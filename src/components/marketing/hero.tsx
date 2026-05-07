import Link from "next/link";

import { ArrowRight, BarChart3, Clock3, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Lang } from "@/lib/lang";
import type { Platform } from "@/lib/types";

const dictionary = {
  zh: {
    badge: "持续整理 {platforms} 个平台的订阅价格与配额变动",
    title: "AI 订阅比价与变动追踪工作台",
    description:
      "把价格、配额、支持模型和历史变化放到同一个页面里，对比 OpenAI、Claude、Kimi、MiniMax 等国内外 AI 服务，减少你来回翻官网的时间。",
    primary: "开始比较",
    secondary: "查看变动",
    tracked: "追踪平台",
    plans: "定价方案",
    realtime: "更新方式",
    currencies: "多币种支持",
    realtimeValue: "定期更新",
  },
  en: {
    badge: "Tracking subscription price and allowance changes across {platforms} platforms",
    title: "AI subscription pricing and change tracking workspace",
    description:
      "Compare pricing, allowance, model coverage, and change history for OpenAI, Claude, Kimi, MiniMax, and more in one workspace.",
    primary: "Start comparing",
    secondary: "View changes",
    tracked: "Platforms tracked",
    plans: "Plans indexed",
    realtime: "Update mode",
    currencies: "Currencies",
    realtimeValue: "Regular",
  },
} as const;

interface HeroProps {
  platforms: Platform[];
  lang: Lang;
}

export function Hero({ platforms, lang }: HeroProps) {
  const t = dictionary[lang];
  const totalPlatforms = new Set(platforms.map((platform) => platform.slug)).size;
  const totalPlans = platforms.length;
  const summaryItems = [
    { icon: BarChart3, label: t.tracked, value: `${totalPlatforms}+` },
    { icon: TrendingDown, label: t.plans, value: `${totalPlans}+` },
    { icon: Clock3, label: t.realtime, value: t.realtimeValue },
    { icon: ArrowRight, label: t.currencies, value: "CNY / USD" },
  ];

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            {t.badge.replace("{platforms}", `${totalPlatforms}+`)}
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{t.title}</h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">{t.description}</p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-11 gap-2 px-4 sm:h-9" asChild>
              <Link href="#pricing">
                {t.primary}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-11 gap-2 px-4 sm:h-9" asChild>
              <Link href="#changelog">{t.secondary}</Link>
            </Button>
          </div>
        </div>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryItems.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card/80 px-4 py-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-base tabular-nums">{item.value}</div>
                <div className="text-muted-foreground text-sm">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
