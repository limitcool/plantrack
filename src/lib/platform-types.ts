export type PlatformChange = {
  date: string;
  type: string;
  title: string;
  summary: string;
  impact: "value-up" | "neutral" | "value-down" | string;
  sourceUrl?: string;
};

export type PlatformMetricsLimit = {
  label: string;
  value: string;
  unit: string;
};

export type PlatformMetrics = {
  quota: string;
  billing: string;
  lastChecked: string;
  changeCount: number;
  limits?: PlatformMetricsLimit[];
};

export type Platform = {
  id: string;
  slug: string;
  name: string;
  vendor: string;
  category: string;
  subcategory: string;
  priceDisplay: string;
  priceValue: number;
  priceCurrency: string;
  summary: string;
  description: string;
  status: string;
  valueLane: string;
  highlight: string;
  officialUrl: string;
  tags: string[];
  coverageNotes: string[];
  supportedModels: string[];
  metrics: PlatformMetrics;
  history: PlatformChange[];
};

export type PlatformBrief = Pick<Platform, "name" | "slug" | "vendor">;

export type RecentChange = PlatformChange & {
  platform: PlatformBrief;
};

export type MeReply = {
  authenticated: boolean;
  provider: string;
  scopes?: string[];
  subject?: string;
  email?: string;
  displayName?: string;
};
