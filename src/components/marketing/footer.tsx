"use client";

import { useState } from "react";
import Link from "next/link";

import { AlertTriangle, Globe, Mail, Plus } from "lucide-react";
import { siGithub } from "simple-icons";

import { PlantrackBrandIcon } from "@/components/provider-icon";
import { SimpleIcon } from "@/components/simple-icon";
import type { Lang } from "@/lib/lang";

import { ReportModal } from "./report-modal";
import { SubmitModal } from "./submit-modal";

const dictionary = {
  zh: {
    blurb: "一站式 AI 订阅服务比价平台，帮你追踪价格变动，做出明智的订阅决策。",
    product: "产品",
    pricing: "定价对比",
    changes: "变动追踪",
    api: "API 接口",
    categories: "分类",
    models: "AI 模型订阅",
    coding: "Coding Plan",
    token: "Token Plan",
    video: "AI 视频订阅",
    contribute: "贡献",
    submit: "提交收录",
    report: "报告错误",
    sources: "数据来源",
    openSource: "开源贡献",
    support: "支持",
    guide: "使用指南",
    faq: "常见问题",
    rights: "保留所有权利。",
    privacy: "隐私政策",
    terms: "服务条款",
  },
  en: {
    blurb:
      "A high-density AI subscription tracker that helps you compare plans, watch changes, and make better buying decisions.",
    product: "Product",
    pricing: "Pricing",
    changes: "Changes",
    api: "API",
    categories: "Categories",
    models: "AI model plans",
    coding: "Coding plans",
    token: "Token plans",
    video: "AI video plans",
    contribute: "Contribute",
    submit: "Submit listing",
    report: "Report issue",
    sources: "Data sources",
    openSource: "Open source",
    support: "Support",
    guide: "Guide",
    faq: "FAQ",
    rights: "All rights reserved.",
    privacy: "Privacy",
    terms: "Terms",
  },
} as const;

export function Footer({ lang }: { lang: Lang }) {
  const t = dictionary[lang];
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {/* 品牌 */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2">
                <PlantrackBrandIcon className="size-9" iconClassName="size-4.5" />
                <span className="text-xl font-bold tracking-tight">PlanTrack</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{t.blurb}</p>
              {/* 社交链接 */}
              <div className="mt-4 flex gap-3">
                <a
                  href="https://plantrack.uvlio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-secondary"
                >
                  <Globe className="h-4 w-4" />
                </a>
                <a
                  href="https://github.com/limitcool/plantrack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-secondary"
                >
                  <SimpleIcon icon={siGithub} className="h-4 w-4 fill-current" />
                </a>
                <a
                  href="mailto:hi@uvlio.com"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-secondary"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* 产品 */}
            <div>
              <h3 className="mb-4 font-semibold">{t.product}</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#pricing" className="text-muted-foreground transition-colors hover:text-foreground">
                    {t.pricing}
                  </Link>
                </li>
                <li>
                  <Link href="#changelog" className="text-muted-foreground transition-colors hover:text-foreground">
                    {t.changes}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                    {t.api}
                  </Link>
                </li>
              </ul>
            </div>

            {/* 分类 */}
            <div>
              <h3 className="mb-4 font-semibold">{t.categories}</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                    {t.models}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                    {t.coding}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                    {t.token}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                    {t.video}
                  </Link>
                </li>
              </ul>
            </div>

            {/* 贡献 */}
            <div>
              <h3 className="mb-4 font-semibold">{t.contribute}</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => setSubmitModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {t.submit}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {t.report}
                  </button>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                    {t.sources}
                  </Link>
                </li>
                <li>
                  <a
                    href="https://github.com/limitcool/plantrack"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t.openSource}
                  </a>
                </li>
              </ul>
            </div>

            {/* 支持 */}
            <div>
              <h3 className="mb-4 font-semibold">{t.support}</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                    {t.guide}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                    {t.faq}
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:hi@uvlio.com"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    hi@uvlio.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* 底部版权 */}
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} PlanTrack. {t.rights}
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                {t.privacy}
              </Link>
              <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                {t.terms}
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* 弹窗 */}
      <SubmitModal isOpen={submitModalOpen} onClose={() => setSubmitModalOpen(false)} lang={lang} />
      <ReportModal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} lang={lang} />
    </>
  );
}
