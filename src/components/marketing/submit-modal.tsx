"use client";

import { useMemo, useState } from "react";

import { Building2, DollarSign, ExternalLink, Link2, Plus, Tag, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Lang } from "@/lib/lang";

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Lang;
}

const dictionary = {
  zh: {
    success: "提交成功",
    successDesc: "感谢你的贡献！我们会在 1-3 个工作日内审核并收录。",
    close: "关闭",
    continue: "继续提交",
    title: "提交新平台/套餐",
    subtitle: "帮助我们完善数据，让更多人受益",
    subtitleGithub: "填写后将跳转到 GitHub Issue 模板，我们不会在站内保存这份内容。",
    platformName: "套餐名称 *",
    vendor: "厂商名称 *",
    category: "分类 *",
    categoryPlaceholder: "选择分类",
    categoryModel: "AI 模型订阅",
    categoryCoding: "Coding Plan",
    categoryToken: "Token Plan",
    categoryImage: "图像生成",
    categoryVideo: "视频平台",
    categoryOther: "其他",
    pricingUrl: "定价页面链接 *",
    price: "价格 *",
    currency: "货币",
    description: "补充说明",
    contact: "联系方式（选填）",
    cancel: "取消",
    submit: "前往 GitHub 提交",
    platformPlaceholder: "例: Claude Pro",
    vendorPlaceholder: "例: Anthropic",
    pricePlaceholder: "例: 20",
    descriptionPlaceholder: "配额、限制、特色功能等...",
    contactPlaceholder: "邮箱或社交账号，方便我们联系确认",
  },
  en: {
    success: "Submitted",
    successDesc: "Thanks for contributing. We'll review and add it in 1-3 business days.",
    close: "Close",
    continue: "Submit another",
    title: "Submit a new plan",
    subtitle: "Help us improve the dataset for everyone.",
    subtitleGithub: "After filling this out, we'll open a GitHub issue template. Nothing is stored in-site.",
    platformName: "Plan name *",
    vendor: "Vendor *",
    category: "Category *",
    categoryPlaceholder: "Select a category",
    categoryModel: "AI model plan",
    categoryCoding: "Coding plan",
    categoryToken: "Token plan",
    categoryImage: "Image generation",
    categoryVideo: "Video platform",
    categoryOther: "Other",
    pricingUrl: "Pricing URL *",
    price: "Price *",
    currency: "Currency",
    description: "Notes",
    contact: "Contact (optional)",
    cancel: "Cancel",
    submit: "Open GitHub template",
    platformPlaceholder: "Example: Claude Pro",
    vendorPlaceholder: "Example: Anthropic",
    pricePlaceholder: "Example: 20",
    descriptionPlaceholder: "Quota, limits, notable features...",
    contactPlaceholder: "Email or handle so we can follow up",
  },
} as const;

export function SubmitModal({ isOpen, onClose, lang = "zh" }: SubmitModalProps) {
  const t = dictionary[lang];
  const [formData, setFormData] = useState({
    platformName: "",
    vendor: "",
    category: "",
    pricingUrl: "",
    price: "",
    currency: "CNY",
    description: "",
    contact: "",
  });
  const issueUrl = useMemo(() => {
    const body = [
      `Platform / Plan: ${formData.platformName || "-"}`,
      `Vendor: ${formData.vendor || "-"}`,
      `Category: ${formData.category || "-"}`,
      `Pricing URL: ${formData.pricingUrl || "-"}`,
      `Price: ${formData.price || "-"} ${formData.currency || ""}`.trim(),
      "",
      "Notes",
      formData.description || "-",
      "",
      `Contact: ${formData.contact || "-"}`,
    ].join("\n");

    const params = new URLSearchParams({
      template: "submit-listing.yml",
      title: `[New Listing] ${formData.vendor || formData.platformName || ""}`.trim(),
      body,
    });

    return `https://github.com/limitcool/plantrack/issues/new?${params.toString()}`;
  }, [formData]);

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
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Plus className="h-6 w-6 text-primary" />
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="platformName">{t.platformName}</Label>
              <div className="relative">
                <Tag className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="platformName"
                  placeholder={t.platformPlaceholder}
                  value={formData.platformName}
                  onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor">{t.vendor}</Label>
              <div className="relative">
                <Building2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="vendor"
                  placeholder={t.vendorPlaceholder}
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{t.category}</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder={t.categoryPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="model-subscription">{t.categoryModel}</SelectItem>
                <SelectItem value="coding">{t.categoryCoding}</SelectItem>
                <SelectItem value="token">{t.categoryToken}</SelectItem>
                <SelectItem value="image">{t.categoryImage}</SelectItem>
                <SelectItem value="video">{t.categoryVideo}</SelectItem>
                <SelectItem value="other">{t.categoryOther}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricingUrl">{t.pricingUrl}</Label>
            <div className="relative">
              <Link2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="pricingUrl"
                type="url"
                placeholder="https://..."
                value={formData.pricingUrl}
                onChange={(e) => setFormData({ ...formData, pricingUrl: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">{t.price}</Label>
              <div className="relative">
                <DollarSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="price"
                  type="text"
                  placeholder={t.pricePlaceholder}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">{t.currency}</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CNY">人民币 (CNY)</SelectItem>
                  <SelectItem value="USD">美元 (USD)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t.description}</Label>
            <Textarea
              id="description"
              placeholder={t.descriptionPlaceholder}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
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
            <Button type="submit" className="flex-1 gap-2">
              <ExternalLink className="h-4 w-4" />
              {t.submit}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
