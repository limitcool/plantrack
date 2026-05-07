"use client";

import { ExternalLink, Globe, Mail, Send } from "lucide-react";
import { siGithub } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import type { Lang } from "@/lib/lang";

const submitListingIssueUrl = "https://github.com/limitcool/plantrack/issues/new?template=submit-listing.yml";
const reportDataIssueUrl = "https://github.com/limitcool/plantrack/issues/new?template=report-data-issue.yml";

const dictionary = {
  zh: {
    title: "反馈与联系",
    subtitle: "提交收录、报告问题、补充资料，都保留直达入口。",
    email: "邮件联系",
    site: "官网",
    github: "GitHub",
    feedback: "问题反馈",
    repoLabel: "公开仓库与更新记录",
    issueLabel: "数据问题与页面问题",
    actionTitle: "常用入口",
    actionDesc: "如果你要补充平台、纠正数据，或直接联系团队，这里就是最快路径。",
    viewRepo: "查看仓库",
    submitIssue: "提交收录",
    reportIssue: "报告问题",
    emailAction: "发送邮件",
  },
  en: {
    title: "Feedback and contact",
    subtitle: "Direct routes for submissions, corrections, and team contact.",
    email: "Email",
    site: "Website",
    github: "GitHub",
    feedback: "Issue tracker",
    repoLabel: "Public repo and update history",
    issueLabel: "Data and UI issues",
    actionTitle: "Common actions",
    actionDesc: "Use these routes to submit a platform, report an issue, or contact the team directly.",
    viewRepo: "View repo",
    submitIssue: "Submit listing",
    reportIssue: "Report issue",
    emailAction: "Email us",
  },
} as const;

export function ContactSection({ lang }: { lang: Lang }) {
  const t = dictionary[lang];
  const items = [
    {
      title: t.email,
      description: "hi@uvlio.com",
      href: "mailto:hi@uvlio.com",
      icon: Mail,
      iconClassName: "bg-primary/10 text-primary",
    },
    {
      title: t.site,
      description: "plantrack.uvlio.com",
      href: "https://plantrack.uvlio.com",
      icon: Globe,
      iconClassName: "bg-primary/10 text-primary",
    },
    {
      title: t.github,
      description: t.repoLabel,
      href: "https://github.com/limitcool/plantrack",
      icon: null,
      iconClassName: "bg-secondary text-foreground",
    },
    {
      title: t.feedback,
      description: t.issueLabel,
      href: reportDataIssueUrl,
      icon: ExternalLink,
      iconClassName: "bg-primary/10 text-primary",
    },
  ] as const;

  return (
    <section id="contact" className="border-border border-t bg-card py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-bold text-3xl tracking-tight">{t.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target={item.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
              aria-label={`${item.title}: ${item.description}`}
              className="flex items-center gap-4 rounded-2xl border border-border bg-background px-4 py-4 transition-colors hover:border-primary/50 hover:bg-primary/5"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconClassName}`}>
                {item.icon ? (
                  <item.icon className="h-5 w-5" />
                ) : (
                  <SimpleIcon icon={siGithub} className="h-5 w-5 fill-current" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="truncate text-muted-foreground text-sm">{item.description}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h3 className="font-semibold text-base">{t.actionTitle}</h3>
              <p className="mt-1 text-muted-foreground text-sm">{t.actionDesc}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="sm" className="h-11 gap-2 px-4 sm:h-8" asChild>
                <a href="https://github.com/limitcool/plantrack" target="_blank" rel="noopener noreferrer">
                  <SimpleIcon icon={siGithub} className="h-4 w-4 fill-current" />
                  {t.viewRepo}
                </a>
              </Button>
              <Button size="sm" variant="outline" className="h-11 gap-2 px-4 sm:h-8" asChild>
                <a href={submitListingIssueUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  {t.submitIssue}
                </a>
              </Button>
              <Button size="sm" variant="outline" className="h-11 gap-2 px-4 sm:h-8" asChild>
                <a href={reportDataIssueUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  {t.reportIssue}
                </a>
              </Button>
              <Button size="sm" variant="outline" className="h-11 gap-2 px-4 sm:h-8" asChild>
                <a href="mailto:hi@uvlio.com">
                  <Send className="h-4 w-4" />
                  {t.emailAction}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
