"use client";

import Link from "next/link";

import { ExternalLink, Globe, Mail } from "lucide-react";
import { siGithub } from "simple-icons";

import { PlantrackBrandIcon } from "@/components/provider-icon";
import { SimpleIcon } from "@/components/simple-icon";
import type { Lang } from "@/lib/lang";

const submitListingIssueUrl = "https://github.com/limitcool/plantrack/issues/new?template=submit-listing.yml";
const reportDataIssueUrl = "https://github.com/limitcool/plantrack/issues/new?template=report-data-issue.yml";

const dictionary = {
  zh: {
    blurb: "高密度订阅追踪工作台，把价格、配额、模型支持和历史变化放到同一个决策界面里。",
    product: "导航",
    pricing: "定价对比",
    changes: "变动追踪",
    contact: "反馈与联系",
    contribute: "反馈",
    submit: "提交收录",
    report: "报告错误",
    repo: "查看仓库",
    site: "访问官网",
    rights: "保留所有权利。",
  },
  en: {
    blurb:
      "A dense subscription tracking workspace for comparing price, allowance, model support, and change history in one place.",
    product: "Navigation",
    pricing: "Pricing",
    changes: "Changes",
    contact: "Contact",
    contribute: "Feedback",
    submit: "Submit listing",
    report: "Report issue",
    repo: "View repo",
    site: "Visit site",
    rights: "All rights reserved.",
  },
} as const;

export function Footer({ lang }: { lang: Lang }) {
  const t = dictionary[lang];

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-2">
              <PlantrackBrandIcon className="size-9" iconClassName="size-4.5" />
              <span className="text-xl font-bold tracking-tight">PlanTrack</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{t.blurb}</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 font-semibold text-sm">{t.product}</h3>
              <div className="flex flex-col gap-2 text-sm">
                <Link
                  href="#pricing"
                  className="inline-flex min-h-11 items-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t.pricing}
                </Link>
                <Link
                  href="#changelog"
                  className="inline-flex min-h-11 items-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t.changes}
                </Link>
                <Link
                  href="#contact"
                  className="inline-flex min-h-11 items-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t.contact}
                </Link>
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-semibold text-sm">{t.contribute}</h3>
              <div className="flex flex-col gap-2 text-sm">
                <a
                  href={submitListingIssueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {t.submit}
                </a>
                <a
                  href={reportDataIssueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {t.report}
                </a>
                <a
                  href="https://github.com/limitcool/plantrack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t.repo}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PlanTrack. {t.rights}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://plantrack.uvlio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-secondary"
              aria-label={t.site}
              title={t.site}
            >
              <Globe className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/limitcool/plantrack"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-secondary"
              aria-label={t.repo}
              title={t.repo}
            >
              <SimpleIcon icon={siGithub} className="h-4 w-4 fill-current" />
            </a>
            <a
              href="mailto:hi@uvlio.com"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-secondary"
              aria-label="hi@uvlio.com"
              title="hi@uvlio.com"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
