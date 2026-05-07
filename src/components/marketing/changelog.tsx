"use client";

import { useMemo, useState } from "react";
import { TrendingUp, TrendingDown, Minus, ExternalLink, Filter, BarChart3, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PlatformIcon } from "@/components/marketing/platform-icons";
import type { Lang } from "@/lib/lang";
import { Bar, BarChart, XAxis, YAxis, Cell, PieChart, Pie, Legend } from "recharts";
import type { Platform, PlatformHistory } from "@/lib/types";

interface ChangelogProps {
  platforms: Platform[];
  lang: Lang;
}

interface ChangelogEntry extends PlatformHistory {
  platformName: string;
  platformSlug: string;
  vendor: string;
}

const chartConfig = {
  "value-up": {
    label: "价值提升",
    color: "var(--color-primary)",
  },
  "value-down": {
    label: "价值下降",
    color: "hsl(0, 84%, 60%)",
  },
  neutral: {
    label: "中性变动",
    color: "hsl(240, 5%, 64%)",
  },
  price: {
    label: "价格变动",
    color: "var(--color-primary)",
  },
  promo: {
    label: "促销活动",
    color: "hsl(250, 76%, 60%)",
  },
  quota: {
    label: "配额变更",
    color: "hsl(40, 96%, 53%)",
  },
  coverage: {
    label: "收录更新",
    color: "hsl(200, 76%, 50%)",
  },
} satisfies ChartConfig;

const dictionary = {
  zh: {
    title: "变动追踪",
    subtitle: "定期整理所有平台的价格、配额、活动变动，方便集中查看",
    timeline: "时间线",
    stats: "统计",
    total: "总变动数",
    up: "价值提升",
    down: "价值下降",
    neutral: "中性变动",
    impactDistribution: "影响分布",
    typeDistribution: "变动类型分布",
    monthlyTrend: "月度变动趋势",
    topVendors: "变动最频繁的厂商",
    changesCount: "{count} 次变动",
    filterImpact: "影响",
    filterType: "类型",
    allImpact: "全部影响",
    allTypes: "全部类型",
    records: "共 {count} 条变动记录",
    source: "来源",
    viewAll: "查看全部 {count} 条记录",
    emptyTitle: "未找到匹配的变动记录",
    emptyDesc: "尝试调整筛选条件",
    typePrice: "价格变动",
    typePromo: "促销活动",
    typeQuota: "配额变更",
    typeCoverage: "收录更新",
    typeClassification: "分类调整",
    typeRegional: "区域差异",
  },
  en: {
    title: "Change log",
    subtitle: "Regularly updated pricing, allowance, and promotion changes across indexed plans.",
    timeline: "Timeline",
    stats: "Stats",
    total: "Total changes",
    up: "Value up",
    down: "Value down",
    neutral: "Neutral",
    impactDistribution: "Impact distribution",
    typeDistribution: "Change types",
    monthlyTrend: "Monthly trend",
    topVendors: "Most active vendors",
    changesCount: "{count} changes",
    filterImpact: "Impact",
    filterType: "Type",
    allImpact: "All impact",
    allTypes: "All types",
    records: "{count} records",
    source: "Source",
    viewAll: "View all {count} records",
    emptyTitle: "No matching changes",
    emptyDesc: "Try adjusting the filters",
    typePrice: "Price",
    typePromo: "Promotion",
    typeQuota: "Allowance",
    typeCoverage: "Coverage",
    typeClassification: "Classification",
    typeRegional: "Regional",
  },
} as const;

export function Changelog({ platforms, lang }: ChangelogProps) {
  const t = dictionary[lang];
  const changeTypes = useMemo(() => getChangeTypes(lang), [lang]);
  const [impactFilter, setImpactFilter] = useState<"all" | "value-up" | "value-down" | "neutral">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showAll, setShowAll] = useState(false);
  const [viewMode, setViewMode] = useState<"timeline" | "stats">("timeline");

  const allChanges = useMemo(() => {
    const changes: ChangelogEntry[] = [];
    platforms.forEach((platform) => {
      platform.history.forEach((event) => {
        changes.push({
          ...event,
          platformName: platform.name,
          platformSlug: platform.slug,
          vendor: platform.vendor,
        });
      });
    });
    return changes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [platforms]);

  // Stats calculations
  const stats = useMemo(() => {
    const impactCounts = { "value-up": 0, "value-down": 0, neutral: 0 };
    const typeCounts: Record<string, number> = {};
    const vendorCounts: Record<string, number> = {};
    const monthCounts: Record<string, { total: number; "value-up": number; "value-down": number; neutral: number }> =
      {};

    allChanges.forEach((change) => {
      const impact = change.impact === "value-up" || change.impact === "value-down" ? change.impact : "neutral";
      impactCounts[impact]++;
      typeCounts[change.type] = (typeCounts[change.type] || 0) + 1;
      vendorCounts[change.vendor] = (vendorCounts[change.vendor] || 0) + 1;

      const month = change.date.substring(0, 7); // YYYY-MM
      if (!monthCounts[month]) {
        monthCounts[month] = { total: 0, "value-up": 0, "value-down": 0, neutral: 0 };
      }
      monthCounts[month].total++;
      monthCounts[month][impact]++;
    });

    return {
      impactCounts,
      typeCounts,
      vendorCounts,
      monthCounts,
      total: allChanges.length,
    };
  }, [allChanges]);

  // Chart data
  const impactChartData = [
    { name: t.up, value: stats.impactCounts["value-up"], fill: "var(--color-primary)" },
    { name: t.down, value: stats.impactCounts["value-down"], fill: "hsl(0, 84%, 60%)" },
    { name: t.neutral, value: stats.impactCounts.neutral, fill: "hsl(240, 5%, 64%)" },
  ];

  const typeChartData = Object.entries(stats.typeCounts).map(([type, count]) => ({
    name: changeTypes.find((t) => t.value === type)?.label || type,
    value: count,
    fill: getTypeColor(type),
  }));

  const monthlyChartData = Object.entries(stats.monthCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, data]) => ({
      month: month.substring(5), // MM
      [t.up]: data["value-up"],
      [t.down]: data["value-down"],
      [t.neutral]: data.neutral,
    }));

  const topVendors = Object.entries(stats.vendorCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([vendor, count]) => ({ vendor, count }));

  const filteredChanges = useMemo(() => {
    let result = allChanges;
    if (impactFilter !== "all") {
      result = result.filter((c) => c.impact === impactFilter);
    }
    if (typeFilter !== "all") {
      result = result.filter((c) => c.type === typeFilter);
    }
    return result;
  }, [allChanges, impactFilter, typeFilter]);

  const displayedChanges = showAll ? filteredChanges : filteredChanges.slice(0, 10);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "value-up":
        return "border-l-primary";
      case "value-down":
        return "border-l-red-500";
      default:
        return "border-l-muted-foreground";
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "value-up":
        return <TrendingUp className="h-5 w-5 text-primary" />;
      case "value-down":
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <Minus className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "price":
        return "default";
      case "promo":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <section id="changelog" className="border-t border-border py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t.title}</h2>
            <p className="mt-2 text-muted-foreground">{t.subtitle}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "timeline" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("timeline")}
            >
              <Calendar className="mr-1 h-4 w-4" />
              {t.timeline}
            </Button>
            <Button
              variant={viewMode === "stats" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("stats")}
            >
              <BarChart3 className="mr-1 h-4 w-4" />
              {t.stats}
            </Button>
          </div>
        </div>

        {viewMode === "stats" ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t.total}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-primary">{t.up}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    <span className="text-3xl font-bold">{stats.impactCounts["value-up"]}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-500">{t.down}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-6 w-6 text-red-500" />
                    <span className="text-3xl font-bold">{stats.impactCounts["value-down"]}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t.neutral}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Minus className="h-6 w-6 text-muted-foreground" />
                    <span className="text-3xl font-bold">{stats.impactCounts.neutral}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Impact Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t.impactDistribution}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[200px]">
                    <PieChart>
                      <Pie
                        data={impactChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                      >
                        {impactChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Legend />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t.typeDistribution}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[200px]">
                    <BarChart data={typeChartData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" radius={4}>
                        {typeChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Monthly Trend */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">{t.monthlyTrend}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[200px]">
                    <BarChart data={monthlyChartData}>
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey={t.up} stackId="a" fill="var(--color-primary)" radius={[0, 0, 0, 0]} />
                      <Bar dataKey={t.down} stackId="a" fill="hsl(0, 84%, 60%)" radius={[0, 0, 0, 0]} />
                      <Bar dataKey={t.neutral} stackId="a" fill="hsl(240, 5%, 64%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Vendors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.topVendors}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {topVendors.map(({ vendor, count }) => (
                    <div
                      key={vendor}
                      className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2"
                    >
                      <PlatformIcon vendor={vendor} className="h-8 w-8 text-xs" />
                      <div>
                        <div className="font-medium">{vendor}</div>
                        <div className="text-xs text-muted-foreground">
                          {t.changesCount.replace("{count}", String(count))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Select value={impactFilter} onValueChange={(v) => setImpactFilter(v as typeof impactFilter)}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder={t.filterImpact} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allImpact}</SelectItem>
                  <SelectItem value="value-up">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-primary" />
                      {t.up}
                    </span>
                  </SelectItem>
                  <SelectItem value="value-down">
                    <span className="flex items-center gap-2">
                      <TrendingDown className="h-3 w-3 text-red-500" />
                      {t.down}
                    </span>
                  </SelectItem>
                  <SelectItem value="neutral">
                    <span className="flex items-center gap-2">
                      <Minus className="h-3 w-3" />
                      {t.neutral}
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder={t.filterType} />
                </SelectTrigger>
                <SelectContent>
                  {changeTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground">
                {t.records.replace("{count}", String(filteredChanges.length))}
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {displayedChanges.map((change, i) => (
                <div
                  key={`${change.platformSlug}-${change.date}-${i}`}
                  className={`rounded-lg border border-border border-l-4 ${getImpactColor(change.impact)} bg-card p-4 transition-colors hover:bg-card/80`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <PlatformIcon vendor={change.vendor} className="h-10 w-10 shrink-0 text-sm" />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">{change.platformName}</span>
                          <span className="text-sm text-muted-foreground">{change.vendor}</span>
                          <Badge variant={getTypeBadgeVariant(change.type)}>
                            {changeTypes.find((t) => t.value === change.type)?.label || change.type}
                          </Badge>
                          <div className="flex items-center">{getImpactIcon(change.impact)}</div>
                        </div>
                        <h4 className="mt-1 font-medium">{change.title}</h4>
                        <p className="mt-1 text-sm text-muted-foreground">{change.summary}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pl-13 sm:pl-0">
                      <span className="whitespace-nowrap text-sm text-muted-foreground">{change.date}</span>
                      {change.sourceUrl && (
                        <a
                          href={change.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          {t.source}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredChanges.length > 10 && !showAll && (
              <div className="mt-6 text-center">
                <Button variant="outline" onClick={() => setShowAll(true)}>
                  {t.viewAll.replace("{count}", String(filteredChanges.length))}
                </Button>
              </div>
            )}

            {filteredChanges.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-secondary p-4">
                  <Filter className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">{t.emptyTitle}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.emptyDesc}</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function getChangeTypes(lang: Lang) {
  const t = dictionary[lang];

  return [
    { value: "all", label: t.allTypes },
    { value: "price", label: t.typePrice },
    { value: "promo", label: t.typePromo },
    { value: "quota", label: t.typeQuota },
    { value: "coverage", label: t.typeCoverage },
    { value: "classification", label: t.typeClassification },
    { value: "regional", label: t.typeRegional },
  ];
}

function getTypeColor(type: string): string {
  switch (type) {
    case "price":
      return "hsl(168, 76%, 42%)";
    case "promo":
      return "hsl(250, 76%, 60%)";
    case "quota":
      return "hsl(40, 96%, 53%)";
    case "coverage":
      return "hsl(200, 76%, 50%)";
    case "classification":
      return "hsl(280, 76%, 50%)";
    case "regional":
      return "hsl(320, 76%, 50%)";
    default:
      return "hsl(240, 5%, 64%)";
  }
}
