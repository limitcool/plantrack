"use client";

import { Bell, Clock3, Mail, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Lang } from "@/lib/lang";

const reportDataIssueUrl = "https://github.com/limitcool/plantrack/issues/new?template=report-data-issue.yml";

const dictionary = {
  zh: {
    title: "订阅价格提醒",
    subtitle: "订阅提醒功能暂时下线，等公开站静态版稳定后再恢复。",
    comingSoon: "即将恢复",
    comingSoonDesc: "后续会提供更轻量的邮件提醒能力，目前请先通过 GitHub Issue 或邮件联系我们。",
    emailAction: "邮件联系",
    issueAction: "提交 Issue",
    note1: "公开站当前不再依赖登录系统",
    note2: "提醒功能会在后续用更轻的实现方式重做",
    note3: "现阶段请以手动关注变动时间线为主",
  },
  en: {
    title: "Price alerts",
    subtitle: "Alerts are temporarily disabled while the public site moves to a lighter static setup.",
    comingSoon: "Coming back soon",
    comingSoonDesc:
      "We'll restore a lighter email-alert workflow later. For now, use GitHub Issues or email to reach us.",
    emailAction: "Email us",
    issueAction: "Open issue",
    note1: "The public site no longer depends on sign-in",
    note2: "Alerts will return with a simpler implementation",
    note3: "For now, follow changes manually from the timeline",
  },
} as const;

export function SubscribeAlerts({ lang }: { lang: Lang }) {
  const t = dictionary[lang];
  return (
    <section id="alerts" className="border-border border-t bg-secondary/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Bell className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-bold text-3xl tracking-tight">{t.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-border/70 bg-background/80 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-primary text-sm">
                <Clock3 className="h-4 w-4" />
                {t.comingSoon}
              </div>
              <p className="max-w-2xl text-muted-foreground text-sm leading-6">{t.comingSoonDesc}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="gap-2">
                <a href="mailto:hi@uvlio.com">
                  <Mail className="h-4 w-4" />
                  {t.emailAction}
                </a>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <a href={reportDataIssueUrl} target="_blank" rel="noopener noreferrer">
                  <Sparkles className="h-4 w-4" />
                  {t.issueAction}
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-secondary/25 p-4 text-muted-foreground text-sm">
              {t.note1}
            </div>
            <div className="rounded-2xl border border-border/70 bg-secondary/25 p-4 text-muted-foreground text-sm">
              {t.note2}
            </div>
            <div className="rounded-2xl border border-border/70 bg-secondary/25 p-4 text-muted-foreground text-sm">
              {t.note3}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
