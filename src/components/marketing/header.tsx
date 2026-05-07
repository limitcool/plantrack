"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { AlertTriangle, ChevronDown, Languages, Menu, Moon, Plus, Sun, X } from "lucide-react";

import { PlantrackBrandIcon } from "@/components/provider-icon";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Lang, withLang } from "@/lib/lang";

import { ReportModal } from "./report-modal";
import { SubmitModal } from "./submit-modal";

interface HeaderProps {
  lang: Lang;
}

const dictionary = {
  zh: {
    pricing: "定价对比",
    changelog: "变动追踪",
    contribute: "贡献",
    submit: "提交收录",
    report: "报告错误",
    darkTitle: "切换到夜间模式",
    lightTitle: "切换到日间模式",
    langSwitch: "EN",
    mobileMenu: "移动菜单",
  },
  en: {
    pricing: "Pricing",
    changelog: "Changes",
    contribute: "Contribute",
    submit: "Submit",
    report: "Report issue",
    darkTitle: "Switch to dark mode",
    lightTitle: "Switch to light mode",
    langSwitch: "中文",
    mobileMenu: "Menu",
  },
} as const;

export function Header({ lang }: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const t = dictionary[lang];
  const isDark = mounted && resolvedTheme === "dark";
  const switchLangHref = withLang("/", lang === "zh" ? "en" : "zh");

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-border border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <PlantrackBrandIcon className="size-9" iconClassName="size-4.5" />
            <span className="font-bold text-xl tracking-tight">PlanTrack</span>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              href="#pricing"
              className="rounded-md px-3 py-2 font-medium text-muted-foreground text-sm transition-colors hover:bg-secondary hover:text-foreground"
            >
              {t.pricing}
            </Link>
            <Link
              href="#changelog"
              className="rounded-md px-3 py-2 font-medium text-muted-foreground text-sm transition-colors hover:bg-secondary hover:text-foreground"
            >
              {t.changelog}
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-md px-3 py-2 font-medium text-muted-foreground text-sm transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {t.contribute}
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSubmitModalOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t.submit}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setReportModalOpen(true)} className="gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {t.report}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden gap-2 lg:inline-flex" asChild>
              <Link href={switchLangHref}>
                <Languages className="h-4 w-4" />
                {t.langSwitch}
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="relative"
              title={isDark ? t.lightTitle : t.darkTitle}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              title={t.mobileMenu}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-border border-t bg-background lg:hidden">
            <nav className="flex flex-col p-4">
              <Link
                href="#pricing"
                className="rounded-md px-3 py-2 font-medium text-muted-foreground text-sm hover:bg-secondary hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.pricing}
              </Link>
              <Link
                href="#changelog"
                className="rounded-md px-3 py-2 font-medium text-muted-foreground text-sm hover:bg-secondary hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.changelog}
              </Link>
              <Link
                href={switchLangHref}
                className="rounded-md px-3 py-2 font-medium text-muted-foreground text-sm hover:bg-secondary hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.langSwitch}
              </Link>
              <div className="my-2 border-border border-t" />
              <button
                type="button"
                className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-muted-foreground text-sm hover:bg-secondary hover:text-foreground"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSubmitModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
                {t.submit}
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-muted-foreground text-sm hover:bg-secondary hover:text-foreground"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setReportModalOpen(true);
                }}
              >
                <AlertTriangle className="h-4 w-4" />
                {t.report}
              </button>
            </nav>
          </div>
        )}
      </header>

      <SubmitModal isOpen={submitModalOpen} onClose={() => setSubmitModalOpen(false)} lang={lang} />
      <ReportModal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} lang={lang} />
    </>
  );
}
