import type { Platform as BasePlatform, PlatformChange as BasePlatformHistory } from "@/lib/platform-types";

export type PlatformLimit = NonNullable<BasePlatform["metrics"]["limits"]>[number];
export type PlatformMetrics = BasePlatform["metrics"] & {
  limits: PlatformLimit[];
};
export type PlatformHistory = BasePlatformHistory;

export type Platform = Omit<BasePlatform, "metrics" | "history"> & {
  category: "model-subscription" | "coding-plan" | "token-plan" | "image-generation" | "video-generation";
  priceCurrency: "USD" | "CNY";
  status: "tracked" | "limited" | "deprecated";
  metrics: PlatformMetrics;
  history: PlatformHistory[];
};

export interface VendorGroup {
  vendor: string;
  plans: Platform[];
  planCount: number;
  categories: CategoryFilter[];
  representativePlan: Platform;
  minPriceValueRmb: number;
  maxPriceValueRmb: number;
  minPriceDisplay: string;
  maxPriceDisplay: string;
  combinedChangeCount: number;
  latestChangeDate?: string;
  latestChangeTitle?: string;
}

export type SortOption =
  | "price-asc"
  | "price-desc"
  | "value-score-desc"
  | "requests-desc"
  | "changes-desc"
  | "name-asc"
  | "5h-requests-desc"
  | "weekly-requests-desc"
  | "monthly-requests-desc"
  | "last-updated";

export type CategoryFilter =
  | "all"
  | "model-subscription"
  | "coding-plan"
  | "token-plan"
  | "image-generation"
  | "video-generation";

export interface CategoryInfo {
  value: CategoryFilter;
  label: string;
  icon: string;
  description: string;
  count?: number;
}
