import { cookies } from "next/headers";

import type { MeReply, Platform, RecentChange } from "@/lib/platform-types";

import fallbackPlatforms from "../../data/platforms.json";

const defaultApiBaseUrl = "http://127.0.0.1:8888";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export function getApiBaseUrl(): string {
  const configuredBase =
    process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.PUBLIC_API_BASE_URL;

  if (configuredBase) {
    return trimTrailingSlash(configuredBase);
  }

  return defaultApiBaseUrl;
}

export function getApiOriginForLinks(): string {
  const configuredBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.PUBLIC_API_BASE_URL;

  if (configuredBase) {
    return trimTrailingSlash(configuredBase);
  }

  return "";
}

export function getApiUrl(pathname: string): string {
  const publicBase = getApiOriginForLinks();
  const base = publicBase || getApiBaseUrl();
  return new URL(pathname, `${base}/`).toString();
}

async function getForwardedCookieHeader(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const serialized = cookieStore.toString();
  return serialized.length > 0 ? serialized : undefined;
}

async function fetchJson<T>(pathname: string, init?: RequestInit): Promise<T> {
  const url = getApiUrl(pathname);
  const shouldUseDefaultRevalidate = init?.cache !== "no-store" && init?.next === undefined;
  const response = await fetch(url, {
    ...init,
    headers: {
      accept: "application/json",
      ...(init?.headers ?? {}),
    },
    ...(shouldUseDefaultRevalidate
      ? {
          next: {
            revalidate: 300,
          },
        }
      : init?.next
        ? { next: init.next }
        : {}),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText} (${url})`);
  }

  return (await response.json()) as T;
}

function getFallbackPlatforms(): Platform[] {
  return (fallbackPlatforms as Platform[]).map(normalizePlatform);
}

function getFallbackPlatformMap(): Map<string, Platform> {
  return new Map(getFallbackPlatforms().map((platform) => [platform.slug, platform]));
}

function getFallbackChanges(limit: number): RecentChange[] {
  return getFallbackPlatforms()
    .flatMap((platform) =>
      platform.history.map((historyItem) => ({
        date: historyItem.date,
        type: historyItem.type,
        title: historyItem.title,
        summary: historyItem.summary,
        impact: historyItem.impact,
        sourceUrl: historyItem.sourceUrl,
        platform: {
          slug: platform.slug,
          name: platform.name,
          vendor: platform.vendor,
        },
      })),
    )
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, limit);
}

function normalizePlatform(platform: Platform): Platform {
  const normalizedPriceDisplay = platform.priceDisplay.replace(/^\$\$/, "$").replace(/^¥¥/, "¥").replace(/^￥￥/, "￥");

  return {
    ...platform,
    priceDisplay: normalizedPriceDisplay,
    tags: Array.isArray(platform.tags) ? platform.tags : [],
    coverageNotes: Array.isArray(platform.coverageNotes) ? platform.coverageNotes : [],
    supportedModels: Array.isArray(platform.supportedModels) ? platform.supportedModels : [],
    metrics: {
      ...platform.metrics,
      limits: Array.isArray(platform.metrics?.limits) ? platform.metrics.limits : [],
    },
    history: Array.isArray(platform.history) ? platform.history : [],
  };
}

export async function fetchPlatforms(): Promise<Platform[]> {
  return Array.from(getFallbackPlatformMap().values());
}

export async function fetchPlatform(slug: string): Promise<Platform> {
  const fallback = getFallbackPlatformMap().get(slug);
  if (fallback) {
    return fallback;
  }

  throw new Error(`Platform not found: ${slug}`);
}

export async function fetchRecentChanges(limit = 12): Promise<RecentChange[]> {
  return getFallbackChanges(limit);
}

export async function fetchCurrentUser(): Promise<MeReply> {
  const cookieHeader = await getForwardedCookieHeader();

  try {
    return await fetchJson<MeReply>("/api/auth/me", {
      cache: "no-store",
      headers: cookieHeader
        ? {
            cookie: cookieHeader,
          }
        : undefined,
    });
  } catch {
    return {
      authenticated: false,
      provider: "logto",
    };
  }
}
