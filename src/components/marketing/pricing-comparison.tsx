"use client";

import { startTransition, useId, useMemo, useState } from "react";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock,
  Code2,
  Coins,
  Crown,
  ExternalLink,
  Image as ImageIcon,
  Info,
  Minus,
  RotateCcw,
  Scale,
  Search,
  Sparkles,
  Timer,
  TrendingDown,
  TrendingUp,
  Video,
  X,
  Zap,
} from "lucide-react";

import { PlatformIcon } from "@/components/marketing/platform-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Lang } from "@/lib/lang";
import type { CategoryFilter, CategoryInfo, Platform, SortOption, VendorGroup } from "@/lib/types";
import { formatUnifiedPrice, groupPlatformsByVendor, toRmbPrice } from "@/lib/vendor-groups";

interface PricingComparisonProps {
  platforms: Platform[];
  lang: Lang;
}

type AllowanceFilter = "all" | "requests" | "tokens" | "credits";
type MetricUnitMode = "raw" | "compact";
type ModelFilterItem = {
  key: string;
  label: string;
  count: number;
};

type ModelFilterGroup = {
  key: string;
  label: string;
  count: number;
  items: ModelFilterItem[];
};

const MODEL_FAMILY_DEFS = [
  { key: "gpt", label: "GPT / OpenAI", test: /gpt|openai/i },
  { key: "claude", label: "Claude / Anthropic", test: /claude|anthropic/i },
  { key: "gemini", label: "Gemini", test: /gemini/i },
  { key: "grok", label: "Grok", test: /grok/i },
  { key: "deepseek", label: "DeepSeek", test: /deepseek/i },
  { key: "glm", label: "GLM", test: /glm/i },
  { key: "qwen", label: "Qwen", test: /qwen/i },
  { key: "kimi", label: "Kimi", test: /kimi/i },
  { key: "minimax", label: "MiniMax", test: /minimax/i },
  { key: "mimo", label: "MiMo", test: /mimo/i },
  { key: "llama", label: "Llama", test: /llama/i },
] as const;

const dictionary = {
  zh: {
    title: "定价对比",
    subtitle: "按价格、配额限制、变动频率等维度排序，找到最适合你的方案",
    search: "搜索平台、厂商、标签...",
    currency: "币种",
    allCurrencies: "全部币种",
    allowance: "配额类型",
    allAllowances: "全部配额",
    requests: "按次数",
    tokens: "按 Tokens",
    credits: "按 Credits",
    models: "支持模型",
    allModels: "全部模型",
    unit: "单位显示",
    rawUnit: "原始单位",
    compactUnit: "M / B",
    sort: "排序方式",
    searchLabel: "搜索平台、厂商、标签或模型",
    currencyLabel: "筛选币种",
    allowanceLabel: "筛选配额类型",
    unitLabel: "切换单位显示",
    sortLabel: "切换排序方式",
    results: "共 {count} 个方案",
    selected: "已选 {count} 个",
    clearSelection: "清除选择",
    compareSelected: "对比选中",
    compareTitle: "方案对比",
    compareDesc: "对比已选中的 {count} 个方案，找出最适合你的选择",
    clearFilters: "清除筛选",
    emptyTitle: "未找到匹配的方案",
    emptyDesc: "尝试调整搜索条件或筛选器",
    statusTracked: "追踪中",
    statusLimited: "限时",
    statusDeprecated: "已停用",
    categoryAll: "全部",
    categoryAllDesc: "所有订阅方案",
    categoryModels: "AI 模型",
    categoryModelsDesc: "Claude、ChatGPT、Gemini 等",
    categoryCoding: "Coding",
    categoryCodingDesc: "Cursor、Windsurf、Copilot 等",
    categoryToken: "Token",
    categoryTokenDesc: "API 按量付费方案",
    categoryImage: "图像",
    categoryImageDesc: "Midjourney、DALL-E 等",
    categoryVideo: "视频",
    categoryVideoDesc: "Runway、Pika 等",
    sortPriceAsc: "价格从低到高",
    sortPriceDesc: "价格从高到低",
    sortValue: "请求效率最高",
    sort5h: "5小时配额最多",
    sortWeekly: "每周配额最多",
    sortMonthly: "每月配额最多",
    sortRequests: "总次数最多",
    sortChanges: "变动最频繁",
    sortUpdated: "最近更新",
    sortName: "名称排序",
    categoryBadgeModel: "AI 模型",
    categoryBadgeCoding: "Coding",
    categoryBadgeToken: "Token",
    categoryBadgeImage: "图像",
    categoryBadgeVideo: "视频",
    valueScore: "请求效率",
    valueScoreFormula: "公式：请求效率分数 = 估算月度请求总量 / 统一人民币价格",
    valueScoreNote: "仅基于已抓取的请求类额度做估算，不代表真实使用体验，也不保证精确。",
    details: "查看详情",
    currentPrice: "当前价格",
    estimatedByPrice: "按价格与配额估算",
    overview: "概览",
    limits: "配额限制",
    history: "变动历史",
    description: "详细说明",
    highlight: "要点提示",
    sources: "数据来源",
    keyData: "关键数据",
    siteAndTags: "官网与标签",
    visitOfficial: "访问官网",
    allowanceSummary: "配额说明",
    lastChecked: "最后检查时间",
    noDetailedLimits: "暂无详细限制数据",
    viewSource: "查看来源",
    noHistory: "暂无变动记录",
    compareBest: "请求效率推荐",
    compareBestText: "按当前估算规则，{name} 的请求效率分数最高。",
    comparePrice: "价格对比",
    lowest: "最低",
    most: "最多",
    metrics: "指标",
    recommended: "推荐",
    vendors: "个厂商",
    plansInVendor: "个套餐",
    vendorRange: "{min} 起",
    vendorRangeBetween: "{min} - {max}",
    vendorLatest: "最近变动",
    vendorChanges: "累计 {count} 次变动",
    vendorSelected: "已选 {count} 个套餐",
    showMorePlans: "展开其余 {count} 个套餐",
    showLessPlans: "收起套餐",
    representativePlans: "代表套餐",
    plansShown: "已展示 {shown}/{total}",
    unifiedRmb: "统一人民币",
    selectedPlans: "已选套餐",
    viewAllPlans: "查看全部 {count} 个套餐",
    clearModels: "清空模型",
    vendorPlansTitle: "{vendor} 全部套餐",
    vendorPlansDesc: "按统一人民币价格与配额查看同厂商所有套餐。",
    planDirectory: "套餐目录",
    officialPriceLabel: "官网价",
    quotaLabel: "额度",
    selectedShort: "已选",
    selectedSummary: "{count} 个已选方案可用于对比",
    compareScopeNote: "对比仅统计纯次数与纯 Token 指标，Credits 暂不参与排名与推荐。",
    dataFreshnessNote: "数据来自爬取与整理，并非实时同步，可能存在延迟、缺漏或识别误差，请以官方页面和实际情况为准。",
    compareRequestsSection: "纯次数对比",
    compareTokensSection: "纯 Token 对比",
    compareCreditsExcluded: "Credits 指标已识别，但当前暂不参与对比。",
    noModelsAvailable: "当前分类暂无可筛选模型",
    modelFamilies: "模型家族",
    pickFamily: "先选家族，再选具体型号",
    selectGroup: "选择整个分组",
    unselectGroup: "取消整个分组",
    noCoverageNotes: "暂无来源说明",
    noTags: "暂无标签",
    noDescription: "暂无详细说明",
    noPlansSelectedYet: "还没有选择套餐，先从列表中勾选后再对比。",
    openOfficialSite: "打开 {vendor} 官网",
    viewPlanDetails: "查看 {name} 详情",
    supportedModelsLabel: "支持模型",
    noModelHints: "待补充",
    workspaceTitle: "筛选与排序",
    workspaceDesc: "先缩小分类范围，再按价格、配额、模型和排序规则收敛结果。",
    activeCategory: "当前分类",
    filterSummary: "已启用 {count} 个筛选",
    filterSummaryEmpty: "未启用额外筛选",
  },
  en: {
    title: "Pricing comparison",
    subtitle: "Sort by price, allowance limits and change frequency to find the plan that fits best.",
    search: "Search plans, vendors, tags...",
    currency: "Currency",
    allCurrencies: "All currencies",
    allowance: "Allowance type",
    allAllowances: "All allowances",
    requests: "Requests",
    tokens: "Tokens",
    credits: "Credits",
    models: "Models",
    allModels: "All models",
    unit: "Units",
    rawUnit: "Raw",
    compactUnit: "M / B",
    sort: "Sort by",
    searchLabel: "Search plans, vendors, tags, or models",
    currencyLabel: "Filter by currency",
    allowanceLabel: "Filter by allowance type",
    unitLabel: "Change unit display",
    sortLabel: "Change sort order",
    results: "{count} plans",
    selected: "{count} selected",
    clearSelection: "Clear selection",
    compareSelected: "Compare",
    compareTitle: "Plan comparison",
    compareDesc: "Compare {count} selected plans and spot the best fit faster.",
    clearFilters: "Reset filters",
    emptyTitle: "No matching plans",
    emptyDesc: "Try adjusting your search or filters",
    statusTracked: "Tracked",
    statusLimited: "Limited",
    statusDeprecated: "Deprecated",
    categoryAll: "All",
    categoryAllDesc: "All tracked plans",
    categoryModels: "Models",
    categoryModelsDesc: "Claude, ChatGPT, Gemini and more",
    categoryCoding: "Coding",
    categoryCodingDesc: "Cursor, Windsurf, Copilot and more",
    categoryToken: "Token",
    categoryTokenDesc: "Usage-based API plans",
    categoryImage: "Image",
    categoryImageDesc: "Midjourney, DALL-E and more",
    categoryVideo: "Video",
    categoryVideoDesc: "Runway, Pika and more",
    sortPriceAsc: "Lowest price",
    sortPriceDesc: "Highest price",
    sortValue: "Highest request efficiency",
    sort5h: "Most in 5h",
    sortWeekly: "Most per week",
    sortMonthly: "Most per month",
    sortRequests: "Most requests",
    sortChanges: "Most changes",
    sortUpdated: "Recently updated",
    sortName: "Name",
    categoryBadgeModel: "Models",
    categoryBadgeCoding: "Coding",
    categoryBadgeToken: "Token",
    categoryBadgeImage: "Image",
    categoryBadgeVideo: "Video",
    valueScore: "Request efficiency",
    valueScoreFormula: "Formula: request efficiency score = estimated monthly request volume / unified RMB price",
    valueScoreNote:
      "This estimate only uses captured request-based allowances. It does not represent real-world quality or guaranteed accuracy.",
    details: "Details",
    currentPrice: "Current price",
    estimatedByPrice: "Estimated from price and allowance",
    overview: "Overview",
    limits: "Limits",
    history: "History",
    description: "Description",
    highlight: "Key insight",
    sources: "Sources",
    keyData: "Key metrics",
    siteAndTags: "Official site & tags",
    visitOfficial: "Visit official site",
    allowanceSummary: "Allowance summary",
    lastChecked: "Last checked",
    noDetailedLimits: "No detailed limit data yet",
    viewSource: "Source",
    noHistory: "No history yet",
    compareBest: "Request efficiency pick",
    compareBestText: "{name} currently has the highest request efficiency score under this estimate.",
    comparePrice: "Price comparison",
    lowest: "Lowest",
    most: "Most",
    metrics: "Metric",
    recommended: "Recommended",
    vendors: "vendors",
    plansInVendor: "plans",
    vendorRange: "From {min}",
    vendorRangeBetween: "{min} - {max}",
    vendorLatest: "Latest change",
    vendorChanges: "{count} changes tracked",
    vendorSelected: "{count} plans selected",
    showMorePlans: "Show {count} more plans",
    showLessPlans: "Collapse plans",
    representativePlans: "Representative plans",
    plansShown: "{shown}/{total} shown",
    unifiedRmb: "Unified RMB",
    selectedPlans: "Selected plans",
    viewAllPlans: "View all {count} plans",
    clearModels: "Clear models",
    vendorPlansTitle: "All {vendor} plans",
    vendorPlansDesc: "Compare every plan from the same vendor by unified RMB price and allowance.",
    planDirectory: "Plan directory",
    officialPriceLabel: "Official",
    quotaLabel: "Allowance",
    selectedShort: "Selected",
    selectedSummary: "{count} selected plans ready to compare",
    compareScopeNote:
      "Comparison currently ranks request-based metrics and token-based metrics only. Credits are excluded for now.",
    dataFreshnessNote:
      "Data is collected by crawling and normalization, not in real time. Delays, omissions, and parsing errors are possible. Please verify with official pages.",
    compareRequestsSection: "Request comparison",
    compareTokensSection: "Token comparison",
    compareCreditsExcluded: "Credit-based metrics were detected but are currently excluded from comparison.",
    noModelsAvailable: "No model filters are available for this category yet.",
    modelFamilies: "Model families",
    pickFamily: "Pick a family first, then select exact models.",
    selectGroup: "Select group",
    unselectGroup: "Clear group",
    noCoverageNotes: "No source notes yet.",
    noTags: "No tags yet.",
    noDescription: "No detailed description yet.",
    noPlansSelectedYet: "No plans selected yet. Pick plans from the list before comparing.",
    openOfficialSite: "Open {vendor} official site",
    viewPlanDetails: "View details for {name}",
    supportedModelsLabel: "Models",
    noModelHints: "Coming soon",
    workspaceTitle: "Filters and ranking",
    workspaceDesc: "Narrow the category first, then refine by price, allowance, models, and sorting logic.",
    activeCategory: "Current category",
    filterSummary: "{count} active filters",
    filterSummaryEmpty: "No extra filters",
  },
} as const;

const categories: CategoryInfo[] = [
  { value: "all", label: "全部", icon: "grid", description: "所有订阅方案" },
  { value: "model-subscription", label: "AI 模型", icon: "sparkles", description: "Claude、ChatGPT、Gemini 等" },
  { value: "coding-plan", label: "Coding", icon: "code", description: "Cursor、Windsurf、Copilot 等" },
  { value: "token-plan", label: "Token", icon: "coins", description: "API 按量付费方案" },
  { value: "image-generation", label: "图像", icon: "image", description: "Midjourney、DALL-E 等" },
  { value: "video-generation", label: "视频", icon: "video", description: "Runway、Pika 等" },
];

const REQUEST_HINT_RE = /(次请求|次调用|请求|调用|requests?|calls?|5 小时|每周|每月|每订阅月|月度|weekly|monthly)/i;
const TOKEN_HINT_RE = /(tokens?)/i;
const CREDIT_HINT_RE = /(credits?)/i;

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

function detectMetricKind(parts: Array<string | undefined>): AllowanceFilter | "unknown" {
  const haystack = parts.filter(Boolean).join(" ").toLowerCase();
  if (REQUEST_HINT_RE.test(haystack)) return "requests";
  if (TOKEN_HINT_RE.test(haystack)) return "tokens";
  if (CREDIT_HINT_RE.test(haystack)) return "credits";
  return "unknown";
}

function formatCompactNumber(value: number): string {
  if (!Number.isFinite(value)) return "Unlimited";
  if (value >= 1e9) return `${stripTrailingZeroes((value / 1e9).toFixed(value >= 1e10 ? 0 : 2))} B`;
  if (value >= 1e6) return `${stripTrailingZeroes((value / 1e6).toFixed(value >= 1e7 ? 0 : 2))} M`;
  if (value >= 1e3) return `${stripTrailingZeroes((value / 1e3).toFixed(value >= 1e4 ? 0 : 1))} K`;
  return stripTrailingZeroes(value.toFixed(value % 1 === 0 ? 0 : 2));
}

function stripTrailingZeroes(value: string): string {
  return value.replace(/\.0+$|(\.\d*?[1-9])0+$/, "$1");
}

function formatMetricAmount(
  value: string,
  options: {
    unitMode: MetricUnitMode;
    label?: string;
    unit?: string;
  },
): string {
  if (options.unitMode === "raw") return value;
  if (/\b\d+(?:\.\d+)?x\b/i.test(value)) return value;

  const parsedValue = parseScaledNumber(value);
  if (parsedValue === null) return value;

  const kind = detectMetricKind([value, options.label, options.unit]);
  const haystack = `${value} ${options.label ?? ""} ${options.unit ?? ""}`.toLowerCase();

  let suffix = "";
  if (kind === "tokens") {
    suffix = " Tokens";
  } else if (kind === "credits") {
    suffix = " Credits";
  } else if (kind === "requests") {
    suffix = /调用/.test(haystack) || /call/.test(haystack) ? " 调用" : " 次";
  }

  return `${formatCompactNumber(parsedValue)}${suffix}`;
}

function formatQuotaText(quota: string, unitMode: MetricUnitMode): string {
  if (unitMode === "raw") return quota;

  return quota.replace(
    /(\d+(?:,\d{3})*(?:\.\d+)?(?:\s*(?:亿|万|千|B|M|K|billion|million|thousand))?\s*(?:tokens?|credits?|次请求|次调用|次|requests?|calls?)?)/gi,
    (match) => {
      const formatted = formatMetricAmount(match, { unitMode, label: quota });
      return formatted === match ? match : formatted;
    },
  );
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
  const parsed = parseScaledNumber(limit.value);
  return parsed ?? 0;
}

function getPlanSeriesName(plan: Platform): string {
  const normalizedVendor = plan.vendor.trim();
  const normalizedName = plan.name.trim();

  if (normalizedName.startsWith(normalizedVendor)) {
    const remainder = normalizedName.slice(normalizedVendor.length).trim();
    if (remainder.length > 0) {
      return remainder.replace(/^[·•\-–—\s]+/, "");
    }
  }

  return normalizedName;
}

function getPlatformAllowanceKinds(platform: Platform): Set<AllowanceFilter> {
  const kinds = new Set<AllowanceFilter>();

  if (detectMetricKind([platform.metrics.quota]) === "requests") kinds.add("requests");
  if (detectMetricKind([platform.metrics.quota]) === "tokens") kinds.add("tokens");
  if (detectMetricKind([platform.metrics.quota]) === "credits") kinds.add("credits");

  platform.metrics.limits.forEach((limit) => {
    const kind = detectMetricKind([limit.label, limit.value, limit.unit]);
    if (kind === "requests" || kind === "tokens" || kind === "credits") {
      kinds.add(kind);
    }
  });

  return kinds;
}

function getPlatformModelFilters(platform: Platform): ModelFilterItem[] {
  const seen = new Set<string>();
  const items: ModelFilterItem[] = [];

  for (const model of platform.supportedModels) {
    const normalized = model.trim();
    if (!normalized) {
      continue;
    }
    const key = normalized.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    items.push({ key, label: normalized, count: 1 });
  }

  return items;
}

function getDisplayModels(platform: Platform, limit = 4): string[] {
  return platform.supportedModels
    .map((model) => model.trim())
    .filter(Boolean)
    .slice(0, limit);
}

function detectModelFamily(label: string): { key: string; label: string } {
  const normalized = label.trim();
  const matched = MODEL_FAMILY_DEFS.find((family) => family.test.test(normalized));
  if (matched) {
    return { key: matched.key, label: matched.label };
  }

  return { key: "other", label: "Other" };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";
}

function groupModelFilters(items: ModelFilterItem[]): ModelFilterGroup[] {
  const groups = new Map<string, ModelFilterGroup>();

  for (const item of items) {
    const family = detectModelFamily(item.label);
    const current = groups.get(family.key);
    if (current) {
      current.count += item.count;
      current.items.push(item);
    } else {
      groups.set(family.key, {
        key: family.key,
        label: family.label,
        count: item.count,
        items: [item],
      });
    }
  }

  return [...groups.values()]
    .map((group) => ({
      ...group,
      items: [...group.items].sort((left, right) => right.count - left.count || left.label.localeCompare(right.label)),
    }))
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
}

function platformMatchesModel(platform: Platform, modelKey: string): boolean {
  const normalizedModels = platform.supportedModels.map((model) => model.toLowerCase());
  if (normalizedModels.some((model) => model.includes(modelKey))) {
    return true;
  }

  const haystack =
    `${platform.name} ${platform.vendor} ${platform.tags.join(" ")} ${platform.supportedModels.join(" ")}`.toLowerCase();
  if (modelKey === "gpt") {
    return haystack.includes("gpt") || haystack.includes("openai");
  }

  return haystack.includes(modelKey);
}

// Calculate value score based on price and limits
function calculateValueScore(platform: Platform): number {
  const priceInRMB = platform.priceCurrency === "USD" ? platform.priceValue * 7.2 : platform.priceValue;

  if (priceInRMB <= 0) return 0;

  // Extract request limits
  let totalRequests = 0;
  for (const limit of platform.metrics.limits) {
    const match = limit.value.match(/(\d+[\d,]*)/);
    if (match) {
      const num = parseInt(match[1].replace(/,/g, ""), 10);
      // Weight by time period
      if (limit.label.includes("5 小时")) {
        totalRequests += (num * 24 * 30) / 5; // Monthly equivalent
      } else if (limit.label.includes("每周")) {
        totalRequests += num * 4;
      } else if (limit.label.includes("每月")) {
        totalRequests += num;
      } else if (limit.label.includes("每天")) {
        totalRequests += num * 30;
      }
    }
  }

  // Score = requests per RMB
  return totalRequests / priceInRMB;
}

export function PricingComparison({ platforms, lang }: PricingComparisonProps) {
  const t = dictionary[lang];
  const sortOptions = useMemo(
    () => [
      { value: "price-asc", label: t.sortPriceAsc, icon: ArrowUp },
      { value: "price-desc", label: t.sortPriceDesc, icon: ArrowDown },
      { value: "value-score-desc", label: t.sortValue, icon: Crown },
      { value: "5h-requests-desc", label: t.sort5h, icon: Timer },
      { value: "weekly-requests-desc", label: t.sortWeekly, icon: Calendar },
      { value: "monthly-requests-desc", label: t.sortMonthly, icon: CalendarDays },
      { value: "requests-desc", label: t.sortRequests, icon: Zap },
      { value: "changes-desc", label: t.sortChanges, icon: Clock },
      { value: "last-updated", label: t.sortUpdated, icon: RotateCcw },
      { value: "name-asc", label: t.sortName, icon: ArrowUpDown },
    ],
    [t],
  );
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("value-score-desc");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [currencyFilter, setCurrencyFilter] = useState<"all" | "CNY" | "USD">("all");
  const [allowanceFilter, setAllowanceFilter] = useState<AllowanceFilter>("all");
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set());
  const [activeModelFamily, setActiveModelFamily] = useState<string | null>(null);
  const [unitMode, setUnitMode] = useState<MetricUnitMode>("compact");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [compareOpen, setCompareOpen] = useState(false);
  const [detailsPlatform, setDetailsPlatform] = useState<Platform | null>(null);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 5) {
        next.add(id);
      }
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());
  const openPlatformDetails = (platform: Platform) => setDetailsPlatform(platform);
  const toggleModelKey = (modelKey: string) => {
    setSelectedModels((prev) => {
      const next = new Set(prev);
      if (next.has(modelKey)) {
        next.delete(modelKey);
      } else {
        next.add(modelKey);
      }
      return next;
    });
  };

  const selectedPlatforms = useMemo(() => {
    return platforms.filter((p) => selectedIds.has(p.id));
  }, [platforms, selectedIds]);

  // Calculate value scores for all platforms
  const platformsWithScores = useMemo(() => {
    return platforms.map((p) => ({
      ...p,
      valueScore: calculateValueScore(p),
    }));
  }, [platforms]);

  const modelFilters = useMemo(() => {
    const counts = new Map<string, ModelFilterItem>();
    for (const platform of platforms) {
      for (const item of getPlatformModelFilters(platform)) {
        const current = counts.get(item.key);
        if (current) {
          current.count += 1;
        } else {
          counts.set(item.key, { ...item });
        }
      }
    }
    return Array.from(counts.values()).sort(
      (left, right) => right.count - left.count || left.label.localeCompare(right.label),
    );
  }, [platforms]);
  const groupedModelFilters = useMemo(() => groupModelFilters(modelFilters), [modelFilters]);
  const activeModelGroup = useMemo(() => {
    if (groupedModelFilters.length === 0) return null;

    if (activeModelFamily) {
      const matched = groupedModelFilters.find((group) => group.key === activeModelFamily);
      if (matched) {
        return matched;
      }
    }

    const selectedGroup = groupedModelFilters.find((group) => group.items.some((item) => selectedModels.has(item.key)));
    return selectedGroup ?? groupedModelFilters[0];
  }, [activeModelFamily, groupedModelFilters, selectedModels]);

  // Find best value platform
  const bestValuePlatform = useMemo(() => {
    if (selectedPlatforms.length === 0) return null;
    return selectedPlatforms.reduce((best, current) => {
      const bestScore = calculateValueScore(best);
      const currentScore = calculateValueScore(current);
      return currentScore > bestScore ? current : best;
    });
  }, [selectedPlatforms]);

  // Calculate category counts
  const categoriesWithCounts = useMemo(() => {
    const labels: Record<CategoryFilter, { label: string; description: string }> = {
      all: { label: t.categoryAll, description: t.categoryAllDesc },
      "model-subscription": { label: t.categoryModels, description: t.categoryModelsDesc },
      "coding-plan": { label: t.categoryCoding, description: t.categoryCodingDesc },
      "token-plan": { label: t.categoryToken, description: t.categoryTokenDesc },
      "image-generation": { label: t.categoryImage, description: t.categoryImageDesc },
      "video-generation": { label: t.categoryVideo, description: t.categoryVideoDesc },
    };

    return categories.map((cat) => ({
      ...cat,
      label: labels[cat.value].label,
      description: labels[cat.value].description,
      count: cat.value === "all" ? platforms.length : platforms.filter((p) => p.category === cat.value).length,
    }));
  }, [platforms, t]);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "sparkles":
        return <Sparkles className="h-4 w-4" />;
      case "code":
        return <Code2 className="h-4 w-4" />;
      case "coins":
        return <Coins className="h-4 w-4" />;
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const filteredAndSortedPlatforms = useMemo(() => {
    let result = [...platformsWithScores];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.vendor.toLowerCase().includes(searchLower) ||
          p.tags.some((t) => t.toLowerCase().includes(searchLower)) ||
          p.supportedModels.some((model) => model.toLowerCase().includes(searchLower)),
      );
    }

    // Filter by category
    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    // Filter by currency
    if (currencyFilter !== "all") {
      result = result.filter((p) => p.priceCurrency === currencyFilter);
    }

    if (allowanceFilter !== "all") {
      result = result.filter((p) => getPlatformAllowanceKinds(p).has(allowanceFilter));
    }

    if (selectedModels.size > 0) {
      result = result.filter((p) => Array.from(selectedModels).some((modelKey) => platformMatchesModel(p, modelKey)));
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return toRmbPrice(a) - toRmbPrice(b);
        case "price-desc":
          return toRmbPrice(b) - toRmbPrice(a);
        case "value-score-desc":
          return b.valueScore - a.valueScore;
        case "5h-requests-desc":
          return extractLimitValue(b.metrics.limits, "5 小时") - extractLimitValue(a.metrics.limits, "5 小时");
        case "weekly-requests-desc":
          return extractLimitValue(b.metrics.limits, "每周") - extractLimitValue(a.metrics.limits, "每周");
        case "monthly-requests-desc":
          return extractLimitValue(b.metrics.limits, "每月") - extractLimitValue(a.metrics.limits, "每月");
        case "requests-desc":
          return extractMaxRequestCount(b.metrics.quota) - extractMaxRequestCount(a.metrics.quota);
        case "changes-desc":
          return b.metrics.changeCount - a.metrics.changeCount;
        case "last-updated": {
          const dateA = a.history[0]?.date || "1970-01-01";
          const dateB = b.history[0]?.date || "1970-01-01";
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        }
        case "name-asc":
          return a.name.localeCompare(b.name, "zh-CN");
        default:
          return 0;
      }
    });

    return result;
  }, [platformsWithScores, search, sortBy, category, currencyFilter, allowanceFilter, selectedModels]);

  const filteredVendorGroups = useMemo(() => {
    const groups = groupPlatformsByVendor(filteredAndSortedPlatforms, sortBy);

    return groups.sort((left, right) => {
      const leftRepresentative = left.representativePlan;
      const rightRepresentative = right.representativePlan;

      switch (sortBy) {
        case "price-asc":
          return left.minPriceValueRmb - right.minPriceValueRmb;
        case "price-desc":
          return right.maxPriceValueRmb - left.maxPriceValueRmb;
        case "value-score-desc":
          return Math.max(...right.plans.map(calculateValueScore)) - Math.max(...left.plans.map(calculateValueScore));
        case "5h-requests-desc":
          return (
            Math.max(...right.plans.map((plan) => extractLimitValue(plan.metrics.limits, "5 小时"))) -
            Math.max(...left.plans.map((plan) => extractLimitValue(plan.metrics.limits, "5 小时")))
          );
        case "weekly-requests-desc":
          return (
            Math.max(...right.plans.map((plan) => extractLimitValue(plan.metrics.limits, "每周"))) -
            Math.max(...left.plans.map((plan) => extractLimitValue(plan.metrics.limits, "每周")))
          );
        case "monthly-requests-desc":
          return (
            Math.max(...right.plans.map((plan) => extractLimitValue(plan.metrics.limits, "每月"))) -
            Math.max(...left.plans.map((plan) => extractLimitValue(plan.metrics.limits, "每月")))
          );
        case "requests-desc":
          return (
            Math.max(...right.plans.map((plan) => extractMaxRequestCount(plan.metrics.quota))) -
            Math.max(...left.plans.map((plan) => extractMaxRequestCount(plan.metrics.quota)))
          );
        case "changes-desc":
          return right.combinedChangeCount - left.combinedChangeCount;
        case "last-updated":
          return (
            new Date(right.latestChangeDate ?? "1970-01-01").getTime() -
            new Date(left.latestChangeDate ?? "1970-01-01").getTime()
          );
        case "name-asc":
          return left.vendor.localeCompare(right.vendor, "zh-CN");
        default:
          return toRmbPrice(rightRepresentative) - toRmbPrice(leftRepresentative);
      }
    });
  }, [filteredAndSortedPlatforms, sortBy]);
  const activeCategoryMeta =
    categoriesWithCounts.find((item) => item.value === category) ?? categoriesWithCounts[0];
  const activeFilterCount =
    (search.trim() ? 1 : 0) +
    (currencyFilter !== "all" ? 1 : 0) +
    (allowanceFilter !== "all" ? 1 : 0) +
    (selectedModels.size > 0 ? 1 : 0);
  const hasFilterState = activeFilterCount > 0 || unitMode !== "compact";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "tracked":
        return (
          <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20">
            {t.statusTracked}
          </Badge>
        );
      case "limited":
        return (
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
            {t.statusLimited}
          </Badge>
        );
      default:
        return <Badge variant="outline">{t.statusDeprecated}</Badge>;
    }
  };

  return (
    <section id="pricing" className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="font-bold text-3xl tracking-tight">{t.title}</h2>
            <p className="mt-2 text-muted-foreground">{t.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              {t.results.replace("{count}", String(filteredAndSortedPlatforms.length))}
            </Badge>
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              {filteredVendorGroups.length} {t.vendors}
            </Badge>
            {selectedIds.size > 0 && (
              <Badge className="rounded-full bg-primary/10 px-3 py-1 text-primary hover:bg-primary/15">
                {t.selected.replace("{count}", String(selectedIds.size))}
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] border border-border/70 bg-card/35 p-2">
            <div className="flex flex-wrap gap-2">
              {categoriesWithCounts.map((cat) => (
                <button
                  type="button"
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  aria-pressed={category === cat.value}
                  className={`flex items-center gap-2 rounded-2xl border px-4 py-2 font-medium text-sm transition-all ${
                    category === cat.value
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-transparent bg-transparent text-foreground/70 hover:border-primary/15 hover:bg-background hover:text-foreground"
                  }`}
                >
                  {getCategoryIcon(cat.icon)}
                  <span>{cat.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs ${
                      category === cat.value
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-border/70 bg-card/55 p-4 sm:p-5">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <div className="font-medium text-sm">{t.workspaceTitle}</div>
                <p className="mt-1 text-muted-foreground text-sm">{t.workspaceDesc}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {t.activeCategory}: {activeCategoryMeta.label}
                </Badge>
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {activeFilterCount > 0
                    ? t.filterSummary.replace("{count}", String(activeFilterCount))
                    : t.filterSummaryEmpty}
                </Badge>
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {unitMode === "compact" ? t.compactUnit : t.rawUnit}
                </Badge>
              </div>
            </div>

            <div className="grid gap-3 xl:grid-cols-[minmax(0,1.45fr)_repeat(4,minmax(0,0.82fr))]">
              <div className="relative min-w-0 xl:col-span-2">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  aria-label={t.searchLabel}
                  placeholder={t.search}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 rounded-2xl border-border/70 bg-background/95 pl-9 shadow-none"
                />
              </div>
              <Select value={currencyFilter} onValueChange={(v) => setCurrencyFilter(v as "all" | "CNY" | "USD")}>
                <SelectTrigger
                  aria-label={t.currencyLabel}
                  className="h-11 w-full rounded-2xl border-border/70 bg-background/95 shadow-none"
                >
                  <SelectValue placeholder={t.currency} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allCurrencies}</SelectItem>
                  <SelectItem value="CNY">人民币 (CNY)</SelectItem>
                  <SelectItem value="USD">美元 (USD)</SelectItem>
                </SelectContent>
              </Select>
              <Select value={allowanceFilter} onValueChange={(v) => setAllowanceFilter(v as AllowanceFilter)}>
                <SelectTrigger
                  aria-label={t.allowanceLabel}
                  className="h-11 w-full rounded-2xl border-border/70 bg-background/95 shadow-none"
                >
                  <SelectValue placeholder={t.allowance} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allAllowances}</SelectItem>
                  <SelectItem value="requests">{t.requests}</SelectItem>
                  <SelectItem value="tokens">{t.tokens}</SelectItem>
                  <SelectItem value="credits">{t.credits}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={unitMode} onValueChange={(v) => setUnitMode(v as MetricUnitMode)}>
                <SelectTrigger
                  aria-label={t.unitLabel}
                  className="h-11 w-full rounded-2xl border-border/70 bg-background/95 shadow-none"
                >
                  <SelectValue placeholder={t.unit} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="raw">{t.rawUnit}</SelectItem>
                  <SelectItem value="compact">{t.compactUnit}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger
                  aria-label={t.sortLabel}
                  className="h-11 w-full rounded-2xl border-border/70 bg-background/95 shadow-none"
                >
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <SelectValue placeholder={t.sort} />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className="flex items-center gap-2">
                        <opt.icon className="h-3 w-3" />
                        {opt.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {modelFilters.length > 0 ? (
              <div className="mt-4 border-border/70 border-t pt-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">{t.models}</span>
                    <span className="text-muted-foreground text-xs">· {t.pickFamily}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedModels.size > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedModels(new Set())}
                        className="h-11 px-3 text-muted-foreground hover:text-foreground sm:h-8"
                      >
                        <X className="mr-1 h-3 w-3" />
                        {t.clearModels}
                      </Button>
                    )}
                  </div>
                </div>
                <div className="mt-3 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {groupedModelFilters.map((group) => {
                      const selectedCount = group.items.filter((item) => selectedModels.has(item.key)).length;
                      const isActiveFamily = activeModelGroup?.key === group.key;
                      const isFullySelected = selectedCount === group.items.length;
                      const isPartiallySelected = selectedCount > 0 && selectedCount < group.items.length;

                      return (
                        <button
                          key={group.key}
                          type="button"
                          onClick={() => setActiveModelFamily(group.key)}
                          aria-pressed={isActiveFamily}
                          className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors sm:min-h-0 ${
                            isActiveFamily
                              ? "border-primary bg-primary/10 text-foreground shadow-sm"
                              : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                          }`}
                        >
                          <span className="max-w-[9rem] truncate">{group.label}</span>
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[11px] ${
                              isActiveFamily ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {group.count}
                          </span>
                          {(isFullySelected || isPartiallySelected) && (
                            <span
                              className={`rounded-full px-1.5 py-0.5 text-[11px] ${
                                isFullySelected ? "bg-primary text-primary-foreground" : "bg-primary/15 text-primary"
                              }`}
                            >
                              {selectedCount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {activeModelGroup ? (
                    <div className="rounded-2xl border border-border/70 bg-background/70 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="truncate font-medium text-sm">{activeModelGroup.label}</span>
                            <Badge variant="secondary" className="rounded-full text-[11px]">
                              {activeModelGroup.items.length}
                            </Badge>
                          </div>
                          <p className="mt-1 text-muted-foreground text-xs">
                            {lang === "zh"
                              ? `当前展示 ${activeModelGroup.items.length} 个具体型号`
                              : `${activeModelGroup.items.length} exact models in this family`}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedModels((prev) => {
                              const next = new Set(prev);
                              const everySelected = activeModelGroup.items.every((item) => next.has(item.key));
                              for (const item of activeModelGroup.items) {
                                if (everySelected) {
                                  next.delete(item.key);
                                } else {
                                  next.add(item.key);
                                }
                              }
                              return next;
                            })
                          }
                          className="h-11 rounded-full px-3 text-xs sm:h-8"
                        >
                          {activeModelGroup.items.every((item) => selectedModels.has(item.key))
                            ? t.unselectGroup
                            : t.selectGroup}
                        </Button>
                      </div>

                      <ScrollArea className="mt-3 max-h-40 pr-3">
                        <div className="flex flex-wrap gap-2">
                          {activeModelGroup.items.map((item) => {
                            const active = selectedModels.has(item.key);
                            return (
                              <button
                                key={item.key}
                                type="button"
                                onClick={() => toggleModelKey(item.key)}
                                aria-pressed={active}
                                className={`inline-flex min-h-11 max-w-full items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors sm:min-h-0 ${
                                  active
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                }`}
                              >
                                <span className="max-w-[14rem] truncate">{item.label}</span>
                                <span
                                  className={`rounded-full px-1.5 py-0.5 text-[11px] ${
                                    active
                                      ? "bg-primary-foreground/20 text-primary-foreground"
                                      : "bg-secondary text-muted-foreground"
                                  }`}
                                >
                                  {item.count}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="mt-4 border-border/70 border-t pt-4">
                <div className="rounded-2xl border border-border/70 border-dashed bg-background/65 px-4 py-3 text-muted-foreground text-sm">
                  {t.noModelsAvailable}
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-3 border-border/70 border-t pt-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <div className="font-medium text-sm">
                  {t.activeCategory}: {activeCategoryMeta.label}
                </div>
                <div className="text-muted-foreground text-sm">{activeCategoryMeta.description}</div>
                <div className="text-muted-foreground text-xs">{t.compareScopeNote}</div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {selectedIds.size > 0 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSelection}
                      className="h-11 px-3 text-muted-foreground hover:text-foreground sm:h-8"
                    >
                      <X className="mr-1 h-3 w-3" />
                      {t.clearSelection}
                    </Button>
                    <Sheet open={compareOpen} onOpenChange={setCompareOpen}>
                      <SheetTrigger asChild>
                        <Button size="sm" className="h-11 gap-2 px-3 sm:h-8">
                          <Scale className="h-4 w-4" />
                          {t.compareSelected} ({selectedIds.size})
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
                        <SheetHeader>
                          <SheetTitle className="flex items-center gap-2">
                            <Scale className="h-5 w-5" />
                            {t.compareTitle}
                          </SheetTitle>
                          <SheetDescription>
                            {t.compareDesc.replace("{count}", String(selectedIds.size))}
                          </SheetDescription>
                        </SheetHeader>
                        <ComparePanel
                          platforms={selectedPlatforms}
                          bestValueId={bestValuePlatform?.id}
                          unitMode={unitMode}
                          lang={lang}
                        />
                      </SheetContent>
                    </Sheet>
                    <span className="text-muted-foreground text-xs" aria-live="polite">
                      {t.selectedSummary.replace("{count}", String(selectedIds.size))}
                    </span>
                  </>
                )}
                {hasFilterState && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearch("");
                      setCurrencyFilter("all");
                      setAllowanceFilter("all");
                      setSelectedModels(new Set());
                      setUnitMode("compact");
                    }}
                    className="h-11 px-3 text-muted-foreground hover:text-foreground sm:h-8"
                  >
                    <RotateCcw className="mr-1 h-3 w-3" />
                    {t.clearFilters}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Platform cards */}
        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredVendorGroups.map((group, index) => (
            <VendorGroupCard
              key={group.vendor}
              group={group}
              getStatusBadge={getStatusBadge}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onOpenDetails={openPlatformDetails}
              unitMode={unitMode}
              rank={sortBy === "value-score-desc" ? index + 1 : undefined}
              lang={lang}
            />
          ))}
        </div>

        {filteredVendorGroups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-secondary p-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">{t.emptyTitle}</h3>
            <p className="mt-1 text-muted-foreground text-sm">{t.emptyDesc}</p>
          </div>
        )}
      </div>
      <PlatformDetailsDialog
        open={detailsPlatform !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDetailsPlatform(null);
          }
        }}
        platform={detailsPlatform}
        unitMode={unitMode}
        getStatusBadge={getStatusBadge}
        lang={lang}
      />
    </section>
  );
}

interface VendorGroupCardProps {
  group: VendorGroup;
  getStatusBadge: (status: string) => React.ReactNode;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onOpenDetails: (platform: Platform) => void;
  unitMode: MetricUnitMode;
  rank?: number;
  lang: Lang;
}

const MINI_CHART_STROKE = "var(--color-primary)";

function MiniTrendSparkline({ values }: { values: number[] }) {
  const gradientId = useId().replace(/:/g, "");

  if (values.length < 2) {
    return null;
  }

  const width = 240;
  const height = 48;
  const paddingX = 6;
  const paddingY = 5;
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = Math.max(maxValue - minValue, 1);

  const points = values.map((value, index) => {
    const x = paddingX + (usableWidth * index) / (values.length - 1);
    const y = paddingY + ((maxValue - value) / range) * usableHeight;
    return { x, y };
  });

  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join("");
  const areaPath = `${linePath}L${points.at(-1)?.x},${height - paddingY}L${points[0]?.x},${height - paddingY}Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className="block h-12 w-full overflow-visible"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={MINI_CHART_STROKE} stopOpacity="0.3" />
          <stop offset="95%" stopColor={MINI_CHART_STROKE} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={MINI_CHART_STROKE}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface ActiveVendorPlanPanelProps {
  plan: Platform;
  representativeStatus: string;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onOpenDetails: (platform: Platform) => void;
  unitMode: MetricUnitMode;
  getStatusBadge: (status: string) => React.ReactNode;
  lang: Lang;
}

function getMicroLabelClass(lang: Lang): string {
  return lang === "zh"
    ? "font-medium text-[11px] text-muted-foreground leading-none whitespace-nowrap"
    : "font-medium text-[11px] text-muted-foreground uppercase tracking-[0.18em] leading-none whitespace-nowrap";
}

function PriceRangeDisplay({
  minPrice,
  maxPrice,
  className = "text-xl",
  align = "start",
}: {
  minPrice: string;
  maxPrice: string;
  className?: string;
  align?: "start" | "center";
}) {
  const wrapperClass =
    align === "center"
      ? "mt-1 flex min-w-0 flex-wrap items-baseline justify-center gap-x-1 gap-y-0.5 text-center"
      : "mt-1 flex min-w-0 flex-wrap items-baseline gap-x-1 gap-y-0.5";

  if (minPrice === maxPrice) {
    return <span className={`whitespace-nowrap font-bold text-primary tabular-nums ${className}`}>{minPrice}</span>;
  }

  return (
    <div className={wrapperClass}>
      <span className={`whitespace-nowrap font-bold text-primary tabular-nums ${className}`}>{minPrice}</span>
      <span className="text-muted-foreground text-sm">-</span>
      <span className={`whitespace-nowrap font-bold text-primary tabular-nums ${className}`}>{maxPrice}</span>
    </div>
  );
}

function SummaryMetricCard({
  label,
  children,
  detail,
  emphasized = false,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  detail?: React.ReactNode;
  emphasized?: boolean;
}) {
  return (
    <div
      className={`flex min-h-[104px] flex-col justify-between rounded-2xl border p-3 ${
        emphasized ? "border-primary/15 bg-primary/5" : "border-border/70 bg-secondary/30"
      }`}
    >
      <div className="space-y-2">
        <div>{label}</div>
        <div className="min-h-[36px]">{children}</div>
      </div>
      {detail ? (
        <div className="pt-2 text-center text-muted-foreground text-xs">{detail}</div>
      ) : (
        <div className="pt-2" />
      )}
    </div>
  );
}

function ActiveVendorPlanPanel({
  plan,
  representativeStatus,
  isSelected,
  onToggleSelect,
  onOpenDetails,
  unitMode,
  getStatusBadge,
  lang,
}: ActiveVendorPlanPanelProps) {
  const t = dictionary[lang];
  const seriesName = getPlanSeriesName(plan);
  const primaryLimit = plan.metrics.limits[0];
  const secondaryLimit = plan.metrics.limits[1];
  const displayModels = getDisplayModels(plan, 4);

  return (
    <div
      className={`rounded-2xl border p-4 transition-colors ${
        isSelected ? "border-primary/30 bg-primary/5 shadow-sm" : "border-border/70 bg-background"
      }`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(plan.id)}
          className="mt-0.5 h-5 w-5 border-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
        <div className="min-w-0 flex-1">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div className="min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-semibold text-base">{seriesName}</div>
                {plan.status !== representativeStatus ? getStatusBadge(plan.status) : null}
                {isSelected && (
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary"
                  >
                    {dictionary[lang].selectedShort}
                  </Badge>
                )}
              </div>
              <div className="text-muted-foreground text-xs">{plan.subcategory}</div>
              <div className="space-y-2">
                <div className={getMicroLabelClass(lang)}>{t.supportedModelsLabel}</div>
                {displayModels.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {displayModels.map((model) => (
                      <Badge
                        key={model}
                        variant="secondary"
                        className="rounded-full border border-border/60 bg-secondary/40 px-2 py-0.5 text-[11px]"
                      >
                        {model}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-xs">{t.noModelHints}</div>
                )}
              </div>
              <div className="text-muted-foreground text-sm leading-6">
                {formatQuotaText(plan.metrics.quota, unitMode)}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
                {primaryLimit && (
                  <Badge
                    variant="secondary"
                    className="rounded-full border border-border/60 bg-secondary/40 px-2 py-0.5 text-[11px]"
                  >
                    {primaryLimit.label}:{" "}
                    {formatMetricAmount(primaryLimit.value, {
                      unitMode,
                      label: primaryLimit.label,
                      unit: primaryLimit.unit,
                    })}
                  </Badge>
                )}
                {secondaryLimit && (
                  <Badge
                    variant="secondary"
                    className="rounded-full border border-border/60 bg-secondary/40 px-2 py-0.5 text-[11px]"
                  >
                    {secondaryLimit.label}:{" "}
                    {formatMetricAmount(secondaryLimit.value, {
                      unitMode,
                      label: secondaryLimit.label,
                      unit: secondaryLimit.unit,
                    })}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 lg:items-end lg:text-right">
              <div>
                <div className="font-semibold text-base text-foreground tabular-nums">
                  {formatUnifiedPrice(toRmbPrice(plan))}
                </div>
                <div className="text-muted-foreground text-xs">{plan.priceDisplay}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => onOpenDetails(plan)}
                aria-label={dictionary[lang].viewPlanDetails.replace("{name}", plan.name)}
                title={dictionary[lang].viewPlanDetails.replace("{name}", plan.name)}
              >
                {dictionary[lang].details}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface VendorPlanDirectoryItemProps {
  plan: Platform;
  representativeStatus: string;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onOpenDetails: (platform: Platform) => void;
  unitMode: MetricUnitMode;
  getStatusBadge: (status: string) => React.ReactNode;
  lang: Lang;
}

function VendorPlanDirectoryItem({
  plan,
  representativeStatus,
  isSelected,
  onToggleSelect,
  onOpenDetails,
  unitMode,
  getStatusBadge,
  lang,
}: VendorPlanDirectoryItemProps) {
  const t = dictionary[lang];
  const seriesName = getPlanSeriesName(plan);
  const primaryLimit = plan.metrics.limits[0];
  const displayModels = getDisplayModels(plan, 4);

  return (
    <div
      className={`border-border/70 border-b px-4 py-4 transition-colors last:border-b-0 ${
        isSelected ? "bg-primary/5" : "bg-background hover:bg-secondary/20"
      }`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(plan.id)}
          className="mt-1 h-5 w-5 border-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
        <div className="min-w-0 flex-1">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(140px,0.7fr)_auto] lg:items-start">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-semibold text-foreground text-sm">{seriesName}</div>
                {isSelected && (
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary"
                  >
                    {t.selectedShort}
                  </Badge>
                )}
                {plan.status !== representativeStatus ? getStatusBadge(plan.status) : null}
              </div>
              <div className="text-muted-foreground text-xs">{plan.subcategory}</div>
              <div className="space-y-2">
                <div className={getMicroLabelClass(lang)}>{t.supportedModelsLabel}</div>
                {displayModels.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {displayModels.map((model) => (
                      <Badge
                        key={model}
                        variant="secondary"
                        className="rounded-full border border-border/60 bg-secondary/40 px-2 py-0.5 text-[11px]"
                      >
                        {model}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-xs">{t.noModelHints}</div>
                )}
              </div>
              <div className="text-muted-foreground text-sm leading-6">
                {formatQuotaText(plan.metrics.quota, unitMode)}
              </div>
              {primaryLimit && (
                <Badge
                  variant="secondary"
                  className="rounded-full border border-border/60 bg-secondary/40 px-2 py-0.5 text-[11px]"
                >
                  {primaryLimit.label}:{" "}
                  {formatMetricAmount(primaryLimit.value, {
                    unitMode,
                    label: primaryLimit.label,
                    unit: primaryLimit.unit,
                  })}
                </Badge>
              )}
            </div>

            <div className="space-y-1 lg:text-right">
              <div className={getMicroLabelClass(lang)}>{t.unifiedRmb}</div>
              <div className="font-semibold text-base text-foreground tabular-nums">
                {formatUnifiedPrice(toRmbPrice(plan))}
              </div>
              <div className="text-muted-foreground text-xs">
                {t.officialPriceLabel}: {plan.priceDisplay}
              </div>
            </div>

            <div className="flex items-center justify-end lg:self-center">
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => onOpenDetails(plan)}
                aria-label={t.viewPlanDetails.replace("{name}", plan.name)}
                title={t.viewPlanDetails.replace("{name}", plan.name)}
              >
                {t.details}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VendorGroupCard({
  group,
  getStatusBadge,
  selectedIds,
  onToggleSelect,
  onOpenDetails,
  unitMode,
  rank,
  lang,
}: VendorGroupCardProps) {
  const t = dictionary[lang];
  const microLabelClass = getMicroLabelClass(lang);
  const platform = group.representativePlan;
  const latestChange = platform.history[0];
  const [vendorPlansOpen, setVendorPlansOpen] = useState(false);
  const [vendorPlansMounted, setVendorPlansMounted] = useState(false);
  const [activePlanId, setActivePlanId] = useState(group.plans[0]?.id ?? platform.id);
  const priceText =
    group.minPriceValueRmb === group.maxPriceValueRmb
      ? t.vendorRange.replace("{min}", group.minPriceDisplay)
      : t.vendorRangeBetween.replace("{min}", group.minPriceDisplay).replace("{max}", group.maxPriceDisplay);
  const selectedPlanCount = group.plans.filter((plan) => selectedIds.has(plan.id)).length;
  const visibleSeries = group.plans.slice(0, 3);
  const activePlan =
    group.plans.find((plan) => plan.id === activePlanId) ??
    group.plans.find((plan) => selectedIds.has(plan.id)) ??
    group.plans[0] ??
    platform;
  const categoryLabel = {
    "model-subscription": t.categoryBadgeModel,
    "coding-plan": t.categoryBadgeCoding,
    "token-plan": t.categoryBadgeToken,
    "image-generation": t.categoryBadgeImage,
    "video-generation": t.categoryBadgeVideo,
  }[platform.category];

  // Generate mini chart data from history
  const miniChartData = useMemo(() => {
    if (platform.history.length === 0) return [];

    // Create data points from history (reverse to show oldest first)
    const points = platform.history
      .slice(0, 6)
      .reverse()
      .map((h, i) => ({
        index: i,
        value: h.impact === "value-up" ? 3 : h.impact === "value-down" ? 1 : 2,
        date: h.date,
      }));

    return points;
  }, [platform.history]);
  const showSummaryAside = selectedPlanCount > 0 || miniChartData.length > 1;

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-primary text-primary-foreground">TOP 1</Badge>;
    if (rank === 2) return <Badge variant="secondary">TOP 2</Badge>;
    if (rank === 3) return <Badge variant="outline">TOP 3</Badge>;
    return null;
  };

  const handleVendorPlansOpenChange = (open: boolean) => {
    setVendorPlansOpen(open);
    if (open && !vendorPlansMounted) {
      startTransition(() => {
        setVendorPlansMounted(true);
      });
    }
  };

  return (
    <Card
      className={`group relative overflow-hidden rounded-[26px] border-border/70 bg-card/95 shadow-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 ${
        selectedPlanCount > 0 ? "border-primary ring-2 ring-primary/20" : ""
      }`}
    >
      {/* Rank badge */}
      {rank && rank <= 3 && <div className="absolute top-3 right-3 z-10">{getRankBadge(rank)}</div>}

      <CardHeader className="pt-8 pb-3">
        <div className="flex items-start gap-4">
          <PlatformIcon vendor={platform.vendor} className="h-12 w-12 shrink-0 rounded-2xl text-sm shadow-sm" />
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2 pr-12">
              <CardTitle className="font-semibold text-xl tracking-tight">{platform.vendor}</CardTitle>
              {getStatusBadge(platform.status)}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm">
              <span>
                {group.planCount} {t.plansInVendor}
              </span>
              <span>·</span>
              <span>{categoryLabel}</span>
              <Badge variant="secondary" className="border-border/70 bg-secondary/70 text-foreground/80 text-xs">
                {priceText}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {visibleSeries.map((plan) => (
                <Badge
                  key={plan.id}
                  variant="outline"
                  className="rounded-full border-border/70 bg-background/80 px-2.5 py-1 font-medium text-[11px] text-foreground/75"
                >
                  {getPlanSeriesName(plan)}
                </Badge>
              ))}
              {group.plans.length > visibleSeries.length && (
                <Badge
                  variant="outline"
                  className="rounded-full border-border/70 border-dashed bg-background/80 px-2.5 py-1 font-medium text-[11px] text-muted-foreground"
                >
                  +{group.plans.length - visibleSeries.length}
                </Badge>
              )}
            </div>
          </div>
          <a
            href={platform.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-4 rounded-xl p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label={t.openOfficialSite.replace("{vendor}", platform.vendor)}
            title={t.openOfficialSite.replace("{vendor}", platform.vendor)}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-1">
        <div className={`grid gap-3 ${showSummaryAside ? "lg:grid-cols-[minmax(0,1.25fr)_minmax(164px,0.82fr)]" : ""}`}>
          <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
            <div className={microLabelClass}>{t.unifiedRmb}</div>
            <PriceRangeDisplay
              minPrice={group.minPriceDisplay}
              maxPrice={group.maxPriceDisplay}
              className="text-xl sm:text-2xl"
            />
            <p className="mt-1 text-muted-foreground text-xs">{platform.metrics.billing}</p>
          </div>
          {showSummaryAside && (
            <div className="rounded-2xl border border-border/70 bg-secondary/35 p-4">
              {selectedPlanCount > 0 ? (
                <div className="text-center">
                  <div className={microLabelClass}>{t.selectedPlans}</div>
                  <div className="mt-1 font-bold text-primary text-xl tabular-nums">{selectedPlanCount}</div>
                  <div className="mt-1 text-muted-foreground text-xs">
                    {t.vendorSelected.replace("{count}", String(selectedPlanCount))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className={microLabelClass}>{t.vendorLatest}</div>
                  <div className="h-12 w-full min-w-0 overflow-hidden">
                    <MiniTrendSparkline values={miniChartData.map((item) => item.value)} />
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {group.latestChangeDate ?? latestChange?.date ?? "—"}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {miniChartData.length > 1 && selectedPlanCount > 0 && (
          <div className="rounded-2xl border border-border/70 bg-secondary/20 px-3 py-2">
            <div className="h-12 w-full min-w-0 overflow-hidden">
              <MiniTrendSparkline values={miniChartData.map((item) => item.value)} />
            </div>
          </div>
        )}

        {activePlan.highlight && (
          <div className="flex items-start gap-2 rounded-xl border border-border/70 bg-secondary/20 p-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="line-clamp-2 text-muted-foreground text-xs">{activePlan.highlight}</p>
          </div>
        )}

        <div className="rounded-2xl border border-border/70 bg-secondary/12 p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className={microLabelClass}>{t.representativePlans}</div>
              <div className="mt-1 text-muted-foreground text-xs">
                {lang === "zh"
                  ? "切换套餐后查看当前方案的价格、额度与详情"
                  : "Switch plans to inspect the active price, allowance, and details."}
              </div>
            </div>
            {group.planCount > 4 && (
              <Drawer open={vendorPlansOpen} onOpenChange={handleVendorPlansOpenChange} direction="bottom">
                <DrawerTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="h-8 rounded-full bg-primary px-3 text-primary-foreground text-xs shadow-sm hover:bg-primary/90"
                  >
                    {t.viewAllPlans.replace("{count}", String(group.planCount))}
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="mx-auto flex max-h-[88vh] w-full max-w-5xl gap-0 rounded-t-[28px] border border-border/70 p-0">
                  <DrawerHeader className="border-border/70 border-b bg-background/95 px-5 py-5 text-left supports-backdrop-filter:backdrop-blur">
                    <div className="flex items-start gap-4 pr-10">
                      <PlatformIcon
                        vendor={platform.vendor}
                        className="h-12 w-12 shrink-0 rounded-2xl text-sm shadow-sm"
                      />
                      <div className="min-w-0 flex-1 space-y-4">
                        <div className="space-y-1.5">
                          <DrawerTitle>{t.vendorPlansTitle.replace("{vendor}", platform.vendor)}</DrawerTitle>
                          <DrawerDescription>{t.vendorPlansDesc}</DrawerDescription>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          <SummaryMetricCard
                            label={<div className={microLabelClass}>{t.unifiedRmb}</div>}
                            emphasized
                            detail={platform.metrics.billing}
                          >
                            <PriceRangeDisplay
                              minPrice={group.minPriceDisplay}
                              maxPrice={group.maxPriceDisplay}
                              className="text-lg sm:text-xl"
                              align="center"
                            />
                          </SummaryMetricCard>
                          <SummaryMetricCard
                            label={<div className={microLabelClass}>{t.planDirectory}</div>}
                            detail={`${group.planCount} ${t.plansInVendor}`}
                          >
                            <div className="text-center font-semibold text-foreground text-xl tabular-nums">
                              {group.planCount}
                            </div>
                          </SummaryMetricCard>
                          <SummaryMetricCard
                            label={<div className={microLabelClass}>{t.selectedPlans}</div>}
                            detail={t.vendorSelected.replace("{count}", String(selectedPlanCount))}
                          >
                            <div className="text-center font-semibold text-foreground text-xl tabular-nums">
                              {selectedPlanCount}
                            </div>
                          </SummaryMetricCard>
                        </div>

                        <div className="space-y-2">
                          <div className={microLabelClass}>{t.representativePlans}</div>
                          {group.plans.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {group.plans.map((plan) => (
                                <Badge
                                  key={plan.id}
                                  variant="outline"
                                  className="max-w-full rounded-full border-border/70 bg-background/80 px-2.5 py-1 font-medium text-[11px] text-foreground/75"
                                >
                                  <span className="truncate">{getPlanSeriesName(plan)}</span>
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <div className="rounded-2xl border border-border/70 border-dashed bg-background/70 px-4 py-3 text-muted-foreground text-sm">
                              {t.noPlansSelectedYet}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </DrawerHeader>

                  {vendorPlansMounted ? (
                    <ScrollArea className="min-h-0 flex-1">
                      <div className="px-5 py-5">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <div className={microLabelClass}>{t.planDirectory}</div>
                            <div className="mt-1 text-muted-foreground text-sm">
                              {group.planCount} {t.plansInVendor}
                            </div>
                          </div>
                        </div>

                        <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/70 shadow-sm">
                          {group.plans.map((plan) => (
                            <VendorPlanDirectoryItem
                              key={plan.id}
                              plan={plan}
                              representativeStatus={platform.status}
                              isSelected={selectedIds.has(plan.id)}
                              onToggleSelect={onToggleSelect}
                              onOpenDetails={onOpenDetails}
                              unitMode={unitMode}
                              getStatusBadge={getStatusBadge}
                              lang={lang}
                            />
                          ))}
                        </div>
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex min-h-0 flex-1 items-center justify-center px-5 py-10 text-muted-foreground text-sm">
                      {group.planCount} {t.plansInVendor}
                    </div>
                  )}
                </DrawerContent>
              </Drawer>
            )}
          </div>

          <div className="space-y-3">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="inline-flex min-w-max gap-2 pb-2 pr-2">
                {group.plans.map((plan) => {
                  const isActive = plan.id === activePlan.id;
                  const isSelected = selectedIds.has(plan.id);
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setActivePlanId(plan.id)}
                      aria-pressed={isActive}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      <span>{getPlanSeriesName(plan)}</span>
                      {isSelected && (
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[11px] ${
                            isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"
                          }`}
                        >
                          {t.selectedShort}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <ActiveVendorPlanPanel
              plan={activePlan}
              representativeStatus={platform.status}
              isSelected={selectedIds.has(activePlan.id)}
              onToggleSelect={onToggleSelect}
              onOpenDetails={onOpenDetails}
              unitMode={unitMode}
              getStatusBadge={getStatusBadge}
              lang={lang}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface PlatformDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: Platform | null;
  unitMode: MetricUnitMode;
  getStatusBadge: (status: string) => React.ReactNode;
  lang: Lang;
}

function PlatformDetailsDialog({
  open,
  onOpenChange,
  platform,
  unitMode,
  getStatusBadge,
  lang,
}: PlatformDetailsDialogProps) {
  const t = dictionary[lang];

  if (!platform) {
    return null;
  }

  const valueScore = calculateValueScore(platform);
  const displayModels = getDisplayModels(platform, 8);

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "model-subscription":
        return (
          <Badge variant="outline" className="border-border bg-secondary/50 text-secondary-foreground">
            {t.categoryBadgeModel}
          </Badge>
        );
      case "coding-plan":
        return (
          <Badge variant="outline" className="border-primary/25 bg-primary/10 text-primary">
            {t.categoryBadgeCoding}
          </Badge>
        );
      case "token-plan":
        return (
          <Badge variant="outline" className="border-border bg-secondary/50 text-secondary-foreground">
            {t.categoryBadgeToken}
          </Badge>
        );
      case "image-generation":
        return (
          <Badge variant="outline" className="border-border bg-secondary/50 text-secondary-foreground">
            {t.categoryBadgeImage}
          </Badge>
        );
      case "video-generation":
        return (
          <Badge variant="outline" className="border-pink-500/30 bg-pink-500/10 text-pink-400">
            {t.categoryBadgeVideo}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden border-border/70 bg-background p-0 sm:max-w-4xl">
        <Tabs defaultValue="overview" className="flex max-h-[90vh] flex-col">
          <DialogHeader className="border-border/70 border-b bg-gradient-to-br from-primary/10 via-background to-background px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-4 pr-10 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <PlatformIcon
                  vendor={platform.vendor}
                  name={platform.name}
                  className="h-14 w-14 rounded-2xl text-xl shadow-sm"
                />
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <DialogTitle className="min-w-0 break-words font-semibold text-xl tracking-tight sm:text-2xl">
                      {platform.name}
                    </DialogTitle>
                    {getStatusBadge(platform.status)}
                    {getCategoryBadge(platform.category)}
                  </div>
                  <DialogDescription className="text-sm">
                    {platform.vendor} · {platform.subcategory}
                  </DialogDescription>
                  <div className="flex flex-wrap gap-2">
                    {platform.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="secondary" className="rounded-full px-2.5 py-1 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid min-w-[220px] grid-cols-2 gap-3 sm:max-w-[280px]">
                <div className="rounded-2xl border border-border/70 bg-card/80 p-3">
                  <div className="text-muted-foreground text-xs">{t.currentPrice}</div>
                  <div className="mt-1 font-semibold text-2xl text-primary">{platform.priceDisplay}</div>
                  <div className="mt-1 text-muted-foreground text-xs">{platform.metrics.billing}</div>
                </div>
                <div className="rounded-2xl border border-border/70 bg-card/80 p-3">
                  <div className="text-muted-foreground text-xs">{t.valueScore}</div>
                  <div className="mt-1 font-semibold text-2xl">{valueScore > 0 ? valueScore.toFixed(1) : "--"}</div>
                  <div className="mt-1 text-muted-foreground text-xs">{t.estimatedByPrice}</div>
                  <div className="mt-2 text-[11px] text-muted-foreground leading-5">{t.valueScoreFormula}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground/85 leading-5">{t.valueScoreNote}</div>
                </div>
              </div>
            </div>
            <TabsList className="mt-5 grid w-full grid-cols-3 rounded-xl bg-secondary/80 p-1">
              <TabsTrigger value="overview" className="rounded-lg">
                {t.overview}
              </TabsTrigger>
              <TabsTrigger value="limits" className="rounded-lg">
                {t.limits}
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-lg">
                {t.history}
              </TabsTrigger>
            </TabsList>
          </DialogHeader>

          <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
            <TabsContent value="overview" className="mt-0 space-y-6">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <div className="space-y-4 rounded-2xl border border-border/70 bg-card/70 p-5">
                  <div>
                    <h4 className="font-semibold text-sm">{t.description}</h4>
                    <p className="mt-2 text-muted-foreground text-sm leading-6">
                      {platform.description || t.noDescription}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm">{t.supportedModelsLabel}</h4>
                    {displayModels.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {displayModels.map((model) => (
                          <Badge key={model} variant="secondary" className="rounded-full px-2.5 py-1 text-xs">
                            {model}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-3 rounded-2xl border border-border/70 border-dashed bg-background/70 px-4 py-3 text-muted-foreground text-sm">
                        {t.noModelHints}
                      </div>
                    )}
                  </div>

                  {platform.highlight && (
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                      <div className="flex items-start gap-3">
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <div>
                          <div className="font-medium text-sm">{t.highlight}</div>
                          <p className="mt-1 text-muted-foreground text-sm leading-6">{platform.highlight}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-sm">{t.sources}</h4>
                    {platform.coverageNotes.length > 0 ? (
                      <ul className="mt-3 space-y-2 text-muted-foreground text-sm">
                        {platform.coverageNotes.map((note) => (
                          <li key={note} className="flex items-start gap-3">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            <span className="leading-6">{note}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="mt-3 rounded-2xl border border-border/70 border-dashed bg-background/70 px-4 py-3 text-muted-foreground text-sm">
                        {t.noCoverageNotes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-border/70 bg-card/70 p-5">
                    <h4 className="font-semibold text-sm">{t.keyData}</h4>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                      {platform.metrics.limits.slice(0, 3).map((limit) => (
                        <div
                          key={`${limit.label}-${limit.value}-${limit.unit}`}
                          className="rounded-xl bg-secondary/60 p-3"
                        >
                          <div className="text-muted-foreground text-xs">{limit.label}</div>
                          <div className="mt-1 font-semibold text-lg">
                            {formatMetricAmount(limit.value, { unitMode, label: limit.label, unit: limit.unit })}
                          </div>
                          <div className="text-muted-foreground text-xs">{limit.unit}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-card/70 p-5">
                    <h4 className="font-semibold text-sm">{t.siteAndTags}</h4>
                    {platform.tags.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {platform.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="max-w-full rounded-full px-2.5 py-1">
                            <span className="truncate">{tag}</span>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-4 rounded-2xl border border-border/70 border-dashed bg-background/70 px-4 py-3 text-muted-foreground text-sm">
                        {t.noTags}
                      </div>
                    )}
                    <Button asChild className="mt-5 w-full">
                      <a href={platform.officialUrl} target="_blank" rel="noopener noreferrer">
                        {t.visitOfficial}
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="limits" className="mt-0 space-y-6">
              <div className="rounded-2xl border border-border/70 bg-card/70 p-5">
                <h4 className="font-semibold text-sm">{t.allowanceSummary}</h4>
                <p className="mt-2 text-muted-foreground text-sm leading-6">
                  {formatQuotaText(platform.metrics.quota, unitMode)}
                </p>
                <div className="mt-4 text-muted-foreground text-xs">
                  {t.lastChecked}: {platform.metrics.lastChecked}
                </div>
              </div>

              {platform.metrics.limits.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {platform.metrics.limits.map((limit) => (
                    <div
                      key={`${limit.label}-${limit.value}-${limit.unit}`}
                      className="rounded-2xl border border-border/70 bg-card/70 p-4"
                    >
                      <div className="font-medium text-muted-foreground text-xs uppercase tracking-[0.16em]">
                        {limit.label}
                      </div>
                      <div className="mt-3 font-semibold text-2xl">
                        {formatMetricAmount(limit.value, { unitMode, label: limit.label, unit: limit.unit })}
                      </div>
                      <div className="mt-1 text-muted-foreground text-sm">{limit.unit}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-border/70 border-dashed bg-card/40 py-10 text-center">
                  <Info className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground text-sm">{t.noDetailedLimits}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              {platform.history.length > 0 ? (
                <div className="space-y-4">
                  {platform.history.map((event) => (
                    <div
                      key={`${event.date}-${event.title}`}
                      className="relative rounded-2xl border border-border/70 bg-card/70 p-5 pl-12"
                    >
                      <div className="absolute top-5 left-5 flex h-6 w-6 items-center justify-center rounded-full bg-secondary">
                        {event.impact === "value-up" && <TrendingUp className="h-3.5 w-3.5 text-primary" />}
                        {event.impact === "value-down" && <TrendingDown className="h-3.5 w-3.5 text-destructive" />}
                        {event.impact === "neutral" && <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{event.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {event.type}
                        </Badge>
                        <span className="text-muted-foreground text-xs">{event.date}</span>
                      </div>
                      <p className="mt-2 text-muted-foreground text-sm leading-6">{event.summary}</p>
                      {event.sourceUrl && (
                        <a
                          href={event.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1 text-primary text-sm hover:underline"
                        >
                          {t.viewSource}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-border/70 border-dashed bg-card/40 py-10 text-center">
                  <Clock className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground text-sm">{t.noHistory}</p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

interface ComparePanelProps {
  platforms: Platform[];
  bestValueId?: string;
  unitMode: MetricUnitMode;
  lang: Lang;
}

function ComparePanel({ platforms, bestValueId, unitMode, lang }: ComparePanelProps) {
  const t = dictionary[lang];
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  const comparePanelId = useId();

  const toggleMetric = (metric: string) => {
    setExpandedMetric((prev) => (prev === metric ? null : metric));
  };

  const metricGroups = useMemo(() => {
    const requests = new Set<string>();
    const tokens = new Set<string>();
    const credits = new Set<string>();

    platforms.forEach((platform) => {
      platform.metrics.limits.forEach((limit) => {
        const kind = detectMetricKind([limit.label, limit.value, limit.unit]);
        if (kind === "requests") requests.add(limit.label);
        if (kind === "tokens") tokens.add(limit.label);
        if (kind === "credits") credits.add(limit.label);
      });
    });

    return {
      requests: Array.from(requests),
      tokens: Array.from(tokens),
      credits: Array.from(credits),
    };
  }, [platforms]);

  const getCompareValue = (platform: Platform, label: string) => {
    const limit = platform.metrics.limits.find((l) => l.label === label);
    return limit ? formatMetricAmount(limit.value, { unitMode, label: limit.label, unit: limit.unit }) : "-";
  };

  const convertToRMB = (p: Platform) => (p.priceCurrency === "USD" ? p.priceValue * 7.2 : p.priceValue);

  // Find best values for each metric
  const getBestPriceId = () => {
    return platforms.reduce((best, current) => (convertToRMB(current) < convertToRMB(best) ? current : best)).id;
  };

  const getBestLimitId = (label: string) => {
    return platforms.reduce((best, current) => {
      const bestLimit = best.metrics.limits.find((l) => l.label === label);
      const currentLimit = current.metrics.limits.find((l) => l.label === label);
      if (!currentLimit) return best;
      if (!bestLimit) return current;

      const bestNum = parseScaledNumber(bestLimit.value) ?? 0;
      const currentNum = parseScaledNumber(currentLimit.value) ?? 0;
      return currentNum > bestNum ? current : best;
    }).id;
  };

  const renderMetricSection = (sectionTitle: string, labels: string[]) => {
    if (labels.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="font-medium text-sm">{sectionTitle}</div>
        {labels.map((label) => (
          <div key={label}>
            <button
              type="button"
              onClick={() => toggleMetric(label)}
              aria-expanded={expandedMetric === label}
              aria-controls={`${comparePanelId}-${slugify(label)}`}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-4 hover:bg-secondary/50"
            >
              <span className="font-medium">{label}</span>
              {expandedMetric === label ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedMetric === label && (
              <div id={`${comparePanelId}-${slugify(label)}`} className="mt-2 grid gap-2">
                {platforms.map((p) => {
                  const value = getCompareValue(p, label);
                  const isBest = p.id === getBestLimitId(label) && value !== "-";
                  return (
                    <div
                      key={p.id}
                      className={`flex items-center justify-between rounded-lg border p-3 ${
                        isBest ? "border-primary/40 bg-primary/5" : "border-border bg-card"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <PlatformIcon vendor={p.vendor} className="h-8 w-8 text-xs" />
                        <span className="font-medium">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{value}</span>
                        {isBest && <Badge className="bg-primary text-primary-foreground">{t.most}</Badge>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Request efficiency recommendation */}
      {bestValueId && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center gap-2 text-primary">
            <Crown className="h-5 w-5" />
            <span className="font-medium">{t.compareBest}</span>
          </div>
          <p className="mt-2 text-muted-foreground text-sm">
            {t.compareBestText.replace("{name}", platforms.find((p) => p.id === bestValueId)?.name ?? "")}
          </p>
          <p className="mt-2 text-muted-foreground text-xs">{t.valueScoreFormula}</p>
          <p className="mt-1 text-muted-foreground/85 text-xs">{t.valueScoreNote}</p>
          <p className="mt-1 text-muted-foreground/85 text-xs">{t.dataFreshnessNote}</p>
        </div>
      )}

      {/* Price comparison */}
      <div>
        <button
          type="button"
          onClick={() => toggleMetric("price")}
          aria-expanded={expandedMetric === "price"}
          aria-controls={`${comparePanelId}-price`}
          className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-4 hover:bg-secondary/50"
        >
          <span className="font-medium">{t.comparePrice}</span>
          {expandedMetric === "price" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {expandedMetric === "price" && (
          <div id={`${comparePanelId}-price`} className="mt-2 grid gap-2">
            {platforms.map((p) => (
              <div
                key={p.id}
                className={`flex items-center justify-between rounded-lg border p-3 ${
                  p.id === getBestPriceId() ? "border-primary/40 bg-primary/5" : "border-border bg-card"
                }`}
              >
                <div className="flex items-center gap-2">
                  <PlatformIcon vendor={p.vendor} className="h-8 w-8 text-xs" />
                  <span className="font-medium">{p.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{p.priceDisplay}</span>
                  {p.id === getBestPriceId() && (
                    <Badge className="bg-primary text-primary-foreground">{t.lowest}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {renderMetricSection(t.compareRequestsSection, metricGroups.requests)}
      {renderMetricSection(t.compareTokensSection, metricGroups.tokens)}

      {metricGroups.credits.length > 0 && (
        <div className="rounded-lg border border-border bg-secondary/20 p-4 text-muted-foreground text-sm">
          {t.compareCreditsExcluded}
        </div>
      )}

      {/* Full comparison table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border border-b bg-secondary/50">
              <th className="p-3 text-left font-medium">{t.metrics}</th>
              {platforms.map((p) => (
                <th key={p.id} className="p-3 text-center font-medium">
                  <div className="flex flex-col items-center gap-1">
                    <PlatformIcon vendor={p.vendor} className="h-6 w-6 text-xs" />
                    <span className="text-xs">{p.name}</span>
                    {p.id === bestValueId && (
                      <Badge className="bg-primary text-xs text-primary-foreground">{t.recommended}</Badge>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-border border-b">
              <td className="p-3 font-medium">价格</td>
              {platforms.map((p) => (
                <td
                  key={p.id}
                  className={`p-3 text-center ${p.id === getBestPriceId() ? "font-bold text-primary" : ""}`}
                >
                  {p.priceDisplay}
                </td>
              ))}
            </tr>
            <tr className="border-border border-b">
              <td className="p-3 font-medium">{t.valueScore}</td>
              {platforms.map((p) => (
                <td key={p.id} className={`p-3 text-center ${p.id === bestValueId ? "font-bold text-primary" : ""}`}>
                  {calculateValueScore(p).toFixed(1)}
                </td>
              ))}
            </tr>
            {[...metricGroups.requests, ...metricGroups.tokens].map((label) => (
              <tr key={label} className="border-border border-b last:border-0">
                <td className="p-3 font-medium">{label}</td>
                {platforms.map((p) => {
                  const value = getCompareValue(p, label);
                  const isBest = p.id === getBestLimitId(label) && value !== "-";
                  return (
                    <td key={p.id} className={`p-3 text-center ${isBest ? "font-bold text-primary" : ""}`}>
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
