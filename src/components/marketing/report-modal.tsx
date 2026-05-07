"use client";

import { useMemo, useState } from "react";

import { AlertTriangle, ExternalLink, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Lang } from "@/lib/lang";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  platformName?: string;
  lang?: Lang;
}

const dictionary = {
  zh: {
    received: "反馈已收到",
    receivedDesc: "感谢你的反馈！我们会尽快核实并更正信息。",
    close: "关闭",
    title: "报告错误信息",
    subtitle: "发现数据不准确？请告诉我们，帮助我们改进",
    subtitleGithub: "填写后将跳转到 GitHub Issue 模板，我们不会在站内保存这份内容。",
    platform: "相关平台/套餐 *",
    errorType: "错误类型 *",
    errorTypePlaceholder: "选择错误类型",
    price: "价格错误",
    quota: "配额/限制错误",
    outdated: "信息过期",
    missing: "缺少重要信息",
    discontinued: "服务已下线",
    other: "其他",
    description: "错误描述 *",
    correctInfo: "正确信息",
    sourceUrl: "信息来源链接",
    contact: "联系方式（选填）",
    cancel: "取消",
    submit: "前往 GitHub 提交",
    platformPlaceholder: "例: ChatGPT Plus",
    descriptionPlaceholder: "请描述你发现的问题...",
    correctInfoPlaceholder: "如果你知道正确的信息，请在这里填写...",
    contactPlaceholder: "邮箱，方便我们跟进",
  },
  en: {
    received: "Report received",
    receivedDesc: "Thanks. We'll verify and correct the information as soon as possible.",
    close: "Close",
    title: "Report incorrect info",
    subtitle: "Found inaccurate data? Tell us so we can improve it.",
    subtitleGithub: "After filling this out, we'll open a GitHub issue template. Nothing is stored in-site.",
    platform: "Related plan *",
    errorType: "Issue type *",
    errorTypePlaceholder: "Select issue type",
    price: "Wrong price",
    quota: "Wrong allowance / limits",
    outdated: "Outdated info",
    missing: "Missing key info",
    discontinued: "Service discontinued",
    other: "Other",
    description: "Description *",
    correctInfo: "Correct information",
    sourceUrl: "Source URL",
    contact: "Contact (optional)",
    cancel: "Cancel",
    submit: "Open GitHub template",
    platformPlaceholder: "Example: ChatGPT Plus",
    descriptionPlaceholder: "Describe the issue you found...",
    correctInfoPlaceholder: "If you know the correct info, put it here...",
    contactPlaceholder: "Email so we can follow up",
  },
} as const;

export function ReportModal({ isOpen, onClose, platformName = "", lang = "zh" }: ReportModalProps) {
  const t = dictionary[lang];
  const [formData, setFormData] = useState({
    platform: platformName,
    errorType: "",
    description: "",
    correctInfo: "",
    sourceUrl: "",
    contact: "",
  });
  const issueUrl = useMemo(() => {
    const body = [
      `Platform / Plan: ${formData.platform || "-"}`,
      `Issue type: ${formData.errorType || "-"}`,
      "",
      "What is wrong?",
      formData.description || "-",
      "",
      "Correct information",
      formData.correctInfo || "-",
      "",
      `Source URL: ${formData.sourceUrl || "-"}`,
      `Contact: ${formData.contact || "-"}`,
    ].join("\n");

    const params = new URLSearchParams({
      template: "report-data-issue.yml",
      title: `[Data Issue] ${(formData.platform || platformName) ?? ""}`.trim(),
      body,
    });

    return `https://github.com/limitcool/plantrack/issues/new?${params.toString()}`;
  }, [formData, platformName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-8">
      <button
        type="button"
        aria-label={t.cancel}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="absolute top-4 right-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h2 className="font-bold text-xl">{t.title}</h2>
          <p className="mt-1 text-muted-foreground text-sm">{t.subtitle}</p>
          <p className="mt-2 text-muted-foreground/85 text-xs">{t.subtitleGithub}</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            window.open(issueUrl, "_blank", "noopener,noreferrer");
            onClose();
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="platform">{t.platform}</Label>
            <Input
              id="platform"
              placeholder={t.platformPlaceholder}
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="errorType">{t.errorType}</Label>
            <Select
              value={formData.errorType}
              onValueChange={(value) => setFormData({ ...formData, errorType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t.errorTypePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">{t.price}</SelectItem>
                <SelectItem value="quota">{t.quota}</SelectItem>
                <SelectItem value="outdated">{t.outdated}</SelectItem>
                <SelectItem value="missing">{t.missing}</SelectItem>
                <SelectItem value="discontinued">{t.discontinued}</SelectItem>
                <SelectItem value="other">{t.other}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t.description}</Label>
            <Textarea
              id="description"
              placeholder={t.descriptionPlaceholder}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="correctInfo">{t.correctInfo}</Label>
            <Textarea
              id="correctInfo"
              placeholder={t.correctInfoPlaceholder}
              value={formData.correctInfo}
              onChange={(e) => setFormData({ ...formData, correctInfo: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sourceUrl">{t.sourceUrl}</Label>
            <Input
              id="sourceUrl"
              type="url"
              placeholder="https://..."
              value={formData.sourceUrl}
              onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">{t.contact}</Label>
            <Input
              id="contact"
              placeholder={t.contactPlaceholder}
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              {t.cancel}
            </Button>
            <Button type="submit" className="flex-1 gap-2 bg-destructive hover:bg-destructive/90">
              <ExternalLink className="h-4 w-4" />
              {t.submit}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
