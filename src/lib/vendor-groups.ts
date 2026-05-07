import type { Platform, SortOption, VendorGroup } from "@/lib/types";

const RMB_EXCHANGE_RATE = 7.2;
const REQUEST_HINT_RE = /(次请求|次调用|请求|调用|requests?|calls?|5 小时|每周|每月|每订阅月|月度|weekly|monthly)/i;

function parseDateValue(raw?: string): number {
  if (!raw) {
    return 0;
  }

  const timestamp = new Date(raw).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function comparePlanUpdatedDesc(left: Platform, right: Platform): number {
  return parseDateValue(right.history[0]?.date) - parseDateValue(left.history[0]?.date);
}

export function toRmbPrice(platform: { priceCurrency: string; priceValue: number }): number {
  return platform.priceCurrency === "USD" ? platform.priceValue * RMB_EXCHANGE_RATE : platform.priceValue;
}

export function formatUnifiedPrice(valueRmb: number): string {
  if (!Number.isFinite(valueRmb)) {
    return "¥0";
  }

  const digits = valueRmb >= 100 ? 0 : valueRmb >= 10 ? 1 : 2;
  const normalized = valueRmb.toFixed(digits).replace(/\.0+$|(\.\d*?[1-9])0+$/, "$1");
  return `¥${normalized}`;
}

function parseScaledNumber(input: string): number | null {
  if (!input) return null;
  if (/\b\d+(?:\.\d+)?x\b/i.test(input)) return null;
  if (/不限|无限|unlimited/i.test(input)) return Number.MAX_SAFE_INTEGER;

  const normalized = input.replace(/,/g, "").trim();
  const match = normalized.match(/(\d+(?:\.\d+)?)(?:\s*)(亿|万|千|B|M|K|billion|million|thousand)?/i);
  if (!match) return null;

  const value = Number.parseFloat(match[1]);
  if (Number.isNaN(value)) return null;

  const scale = match[2]?.toLowerCase();
  switch (scale) {
    case "亿":
      return value * 1e8;
    case "万":
      return value * 1e4;
    case "千":
    case "k":
    case "thousand":
      return value * 1e3;
    case "m":
    case "million":
      return value * 1e6;
    case "b":
    case "billion":
      return value * 1e9;
    default:
      return value;
  }
}

function extractMaxRequestCount(text: string): number {
  if (/不限|无限|unlimited/i.test(text)) return Number.MAX_SAFE_INTEGER;

  const matches = text.match(
    /\d+(?:,\d{3})*(?:\.\d+)?(?:\s*(?:亿|万|千|B|M|K|billion|million|thousand))?\s*(?:次请求|次调用|次|requests?|calls?)/gi,
  );
  if (!matches) return 0;

  return matches.reduce((max, match) => {
    const parsed = parseScaledNumber(match);
    return parsed !== null && parsed > max ? parsed : max;
  }, 0);
}

function extractLimitValue(limits: Platform["metrics"]["limits"], label: string): number {
  const limit = limits.find((item) => item.label.includes(label));
  if (!limit) return 0;
  return parseScaledNumber(limit.value) ?? 0;
}

function calculateValueScore(platform: Platform): number {
  const priceInRmb = toRmbPrice(platform);
  if (priceInRmb <= 0) return 0;

  let totalRequests = 0;
  for (const limit of platform.metrics.limits) {
    if (!REQUEST_HINT_RE.test(`${limit.label} ${limit.value} ${limit.unit ?? ""}`)) {
      continue;
    }

    const parsed = parseScaledNumber(limit.value);
    if (parsed === null) {
      continue;
    }

    if (limit.label.includes("5 小时")) {
      totalRequests += (parsed * 24 * 30) / 5;
    } else if (limit.label.includes("每周")) {
      totalRequests += parsed * 4;
    } else if (limit.label.includes("每月")) {
      totalRequests += parsed;
    } else if (limit.label.includes("每天")) {
      totalRequests += parsed * 30;
    }
  }

  return totalRequests / priceInRmb;
}

function getRepresentativePlan(plans: Platform[], sortBy: SortOption): Platform {
  const sorted = [...plans].sort((left, right) => {
    switch (sortBy) {
      case "price-desc":
        return toRmbPrice(right) - toRmbPrice(left);
      case "value-score-desc":
        return calculateValueScore(right) - calculateValueScore(left);
      case "5h-requests-desc":
        return extractLimitValue(right.metrics.limits, "5 小时") - extractLimitValue(left.metrics.limits, "5 小时");
      case "weekly-requests-desc":
        return extractLimitValue(right.metrics.limits, "每周") - extractLimitValue(left.metrics.limits, "每周");
      case "monthly-requests-desc":
        return extractLimitValue(right.metrics.limits, "每月") - extractLimitValue(left.metrics.limits, "每月");
      case "requests-desc":
        return extractMaxRequestCount(right.metrics.quota) - extractMaxRequestCount(left.metrics.quota);
      case "changes-desc":
        return (right.metrics.changeCount ?? 0) - (left.metrics.changeCount ?? 0);
      case "last-updated":
        return comparePlanUpdatedDesc(left, right);
      case "name-asc":
        return left.name.localeCompare(right.name, "zh-CN");
      default:
        return toRmbPrice(left) - toRmbPrice(right);
    }
  });

  return sorted[0] ?? plans[0];
}

export function groupPlatformsByVendor(platforms: Platform[], sortBy: SortOption): VendorGroup[] {
  const grouped = new Map<string, Platform[]>();

  for (const platform of platforms) {
    const current = grouped.get(platform.vendor) ?? [];
    current.push(platform);
    grouped.set(platform.vendor, current);
  }

  return Array.from(grouped.entries()).map(([vendor, plans]) => {
    const sortedPlans = [...plans].sort((left, right) => toRmbPrice(left) - toRmbPrice(right));
    const prices = sortedPlans.map(toRmbPrice);
    const latestHistory = sortedPlans
      .flatMap((plan) => plan.history)
      .sort((left, right) => parseDateValue(right.date) - parseDateValue(left.date))[0];

    return {
      vendor,
      plans: sortedPlans,
      planCount: sortedPlans.length,
      categories: Array.from(new Set(sortedPlans.map((plan) => plan.category))),
      representativePlan: getRepresentativePlan(sortedPlans, sortBy),
      minPriceValueRmb: prices[0] ?? 0,
      maxPriceValueRmb: prices[prices.length - 1] ?? 0,
      minPriceDisplay: formatUnifiedPrice(prices[0] ?? 0),
      maxPriceDisplay: formatUnifiedPrice(prices[prices.length - 1] ?? 0),
      combinedChangeCount: sortedPlans.reduce((total, plan) => total + (plan.metrics.changeCount ?? 0), 0),
      latestChangeDate: latestHistory?.date,
      latestChangeTitle: latestHistory?.title,
    } satisfies VendorGroup;
  });
}
