import Link from "next/link";

import { ArrowRight, BarChart3, Clock3, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Lang } from "@/lib/lang";
import type { Platform } from "@/lib/types";

const dictionary = {
  zh: {
    badge: "持续整理 {platforms} 平台价格变动",
    titleBefore: "AI 订阅服务",
    titleHighlight: "比价追踪",
    titleAfter: "平台",
    description:
      "一站式对比 OpenAI、Claude、Kimi、MiniMax 等国内外 AI 服务的 Token 定价、Coding Plan 方案，定期更新价格与配额变化，减少你手动翻官网的成本",
    primary: "开始比较",
    tracked: "追踪平台",
    plans: "定价方案",
    realtime: "更新频率",
    currencies: "多币种支持",
    realtimeValue: "定期更新",
  },
  en: {
    badge: "Curating price changes across {platforms} platforms",
    titleBefore: "AI subscription",
    titleHighlight: "price tracking",
    titleAfter: "workspace",
    description:
      "Compare OpenAI, Claude, Kimi, MiniMax and other AI plans in one place, with pricing and allowance updates maintained on a regular cadence.",
    primary: "Start comparing",
    tracked: "Platforms tracked",
    plans: "Plans indexed",
    realtime: "Update cadence",
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

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            {t.badge.replace("{platforms}", `${totalPlatforms}+`)}
          </div>

          <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t.titleBefore}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {" "}
              {t.titleHighlight}{" "}
            </span>
            {t.titleAfter}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">{t.description}</p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2" asChild>
              <Link href="#pricing">
                {t.primary}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-bold">{totalPlatforms}+</div>
            <div className="text-sm text-muted-foreground">{t.tracked}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingDown className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-bold">{totalPlans}+</div>
            <div className="text-sm text-muted-foreground">{t.plans}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock3 className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-bold">{t.realtimeValue}</div>
            <div className="text-sm text-muted-foreground">{t.realtime}</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-bold">CNY/USD</div>
            <div className="text-sm text-muted-foreground">{t.currencies}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
