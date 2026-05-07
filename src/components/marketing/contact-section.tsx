"use client";

import { ExternalLink, Globe, Headphones, Mail, Send } from "lucide-react";
import { siGithub } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import type { Lang } from "@/lib/lang";

const submitListingIssueUrl = "https://github.com/limitcool/plantrack/issues/new?template=submit-listing.yml";
const reportDataIssueUrl = "https://github.com/limitcool/plantrack/issues/new?template=report-data-issue.yml";

const dictionary = {
  zh: {
    title: "联系我们",
    subtitle: "有任何问题或建议？欢迎随时联系我们",
    email: "邮件联系",
    site: "官网",
    github: "GitHub",
    feedback: "问题反馈",
    feedbackLabel: "GitHub Issues",
    updates: "获取更新与反馈入口",
    updatesDesc: "产品即将上线，这里先保留最直接的三条联系路径，方便提交收录、报告问题和邮件沟通。",
    viewRepo: "查看仓库",
    submitIssue: "提交 Issue",
    emailAction: "邮件联系",
    emailPanelTitle: "直接发邮件",
    emailPanelDesc: "当前联系入口统一使用邮件。把你的问题、合作意向或补充信息直接发送到 hi@uvlio.com，我们会尽快回复。",
    emailPrimary: "发送邮件",
    emailSecondary: "复制邮箱地址",
    supportHours: "客服时间",
    supportHoursDesc: "工作日 9:00 - 18:00 (UTC+8)，通常 24 小时内回复",
  },
  en: {
    title: "Contact",
    subtitle: "Questions, feedback, or partnership ideas, reach out any time.",
    email: "Email",
    site: "Website",
    github: "GitHub",
    feedback: "Issue tracker",
    feedbackLabel: "GitHub Issues",
    updates: "Direct feedback routes",
    updatesDesc:
      "Before launch, we keep the fastest contact paths here so you can submit coverage, report issues, or reach us by email.",
    viewRepo: "View repo",
    submitIssue: "Open issue",
    emailAction: "Email us",
    emailPanelTitle: "Use email directly",
    emailPanelDesc:
      "Email is the primary contact route for now. Send questions, partnership requests, or supplemental info to hi@uvlio.com and we'll reply as soon as possible.",
    emailPrimary: "Send email",
    emailSecondary: "Copy email address",
    supportHours: "Support hours",
    supportHoursDesc: "Weekdays 9:00 - 18:00 (UTC+8), usually replied within 24 hours.",
  },
} as const;

export function ContactSection({ lang }: { lang: Lang }) {
  const t = dictionary[lang];

  return (
    <section id="contact" className="border-border border-t bg-card py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-bold text-3xl tracking-tight">{t.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* 联系方式 */}
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href="mailto:hi@uvlio.com"
                className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{t.email}</h3>
                  <p className="text-muted-foreground text-sm">hi@uvlio.com</p>
                </div>
              </a>

              <a
                href="https://plantrack.uvlio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{t.site}</h3>
                  <p className="text-muted-foreground text-sm">plantrack.uvlio.com</p>
                </div>
              </a>

              <a
                href="https://github.com/limitcool/plantrack"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                  <SimpleIcon icon={siGithub} className="h-6 w-6 fill-current" />
                </div>
                <div>
                  <h3 className="font-semibold">{t.github}</h3>
                  <p className="text-muted-foreground text-sm">limitcool/plantrack</p>
                </div>
              </a>

              <a
                href={reportDataIssueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <ExternalLink className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{t.feedback}</h3>
                  <p className="text-muted-foreground text-sm">{t.feedbackLabel}</p>
                </div>
              </a>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{t.updates}</h3>
                  <p className="mt-1 text-muted-foreground text-sm">{t.updatesDesc}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button size="sm" className="gap-2" asChild>
                      <a href="https://github.com/limitcool/plantrack" target="_blank" rel="noopener noreferrer">
                        <SimpleIcon icon={siGithub} className="h-4 w-4 fill-current" />
                        {t.viewRepo}
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2" asChild>
                      <a href={submitListingIssueUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        {t.submitIssue}
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2" asChild>
                      <a href="mailto:hi@uvlio.com">
                        <Send className="h-4 w-4" />
                        {t.emailAction}
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* 客服时间 */}
            <div className="flex items-center gap-4 rounded-xl border border-border bg-background p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <Headphones className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">{t.supportHours}</h3>
                <p className="text-muted-foreground text-sm">{t.supportHoursDesc}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-6">
            <div className="flex h-full flex-col justify-between gap-6">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl">{t.emailPanelTitle}</h3>
                <p className="mt-2 text-muted-foreground text-sm leading-6">{t.emailPanelDesc}</p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-secondary/25 p-4">
                <div className="font-medium text-sm">hi@uvlio.com</div>
                <div className="mt-1 text-muted-foreground text-xs">mailto:hi@uvlio.com</div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="flex-1 gap-2">
                  <a href="mailto:hi@uvlio.com">
                    <Send className="h-4 w-4" />
                    {t.emailPrimary}
                  </a>
                </Button>
                <Button asChild variant="outline" className="flex-1 gap-2">
                  <a href="mailto:hi@uvlio.com?subject=PlanTrack">
                    <Mail className="h-4 w-4" />
                    {t.emailSecondary}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
