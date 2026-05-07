"use client";

import Image from "next/image";

import {
  siAlibabacloud,
  siAnthropic,
  siBaidu,
  siBytedance,
  siCursor,
  siDeepseek,
  siMinimax,
  siMoonshotai,
  siOpenrouter,
  siXiaomi,
} from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { cn } from "@/lib/utils";

type ProviderIconProps = {
  vendor: string;
  name?: string;
  className?: string;
  iconClassName?: string;
};

type ProviderVisual =
  | {
      kind: "simple";
      icon: typeof siAnthropic;
      iconClassName: string;
      containerClassName: string;
    }
  | {
      kind: "image";
      src: string;
      alt: string;
      imageClassName: string;
      containerClassName: string;
    }
  | {
      kind: "openai" | "uvlio";
      iconClassName: string;
      containerClassName: string;
    };

function OpenAiGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-5", className)}>
      <path
        d="M11.95 2.1a4.3 4.3 0 0 1 3.7 2.13l.26.44.5-.02a4.5 4.5 0 0 1 4.33 5.94l-.16.49.36.35a4.5 4.5 0 0 1-1.23 7.22l-.46.22-.03.51a4.49 4.49 0 0 1-6.84 3.53l-.42-.25-.42.25a4.49 4.49 0 0 1-6.84-3.54l-.03-.5-.46-.22a4.5 4.5 0 0 1-1.23-7.23l.36-.35-.16-.49a4.5 4.5 0 0 1 4.33-5.94l.5.02.26-.44a4.3 4.3 0 0 1 3.68-2.12Zm0 2.05a2.25 2.25 0 0 0-1.98 1.17l-.85 1.47-1.69-.06A2.45 2.45 0 0 0 5.07 10l.53 1.6-1.22 1.18a2.45 2.45 0 0 0 .67 3.93l1.5.71.1 1.66a2.44 2.44 0 0 0 3.73 1.93l1.42-.85 1.42.85a2.44 2.44 0 0 0 3.73-1.93l.1-1.66 1.5-.71a2.45 2.45 0 0 0 .67-3.93l-1.22-1.18.53-1.6a2.45 2.45 0 0 0-2.36-3.27l-1.69.06-.85-1.47a2.25 2.25 0 0 0-1.96-1.16Zm4.25 5.42-.87 1.5a3.85 3.85 0 0 1 .02 1.86l1.8 1.74a.68.68 0 0 1-.2 1.1l-2.24 1.07-.14 2.48a.68.68 0 0 1-1.03.53l-2.1-1.26-2.1 1.26a.68.68 0 0 1-1.04-.53l-.14-2.48-2.24-1.07a.68.68 0 0 1-.2-1.1l1.8-1.74a3.9 3.9 0 0 1 .02-1.86l-.87-1.5a.68.68 0 0 1 .6-1.02h2.48l1.27-2.14a.68.68 0 0 1 1.17 0l1.27 2.14h2.48a.68.68 0 0 1 .6 1.02Z"
        fill="currentColor"
      />
    </svg>
  );
}

function UvlioGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-5", className)}>
      <path
        d="M4 5.5c0-.83.67-1.5 1.5-1.5S7 4.67 7 5.5v6.68c0 2.73 1.92 4.57 5 4.57s5-1.84 5-4.57V5.5c0-.83.67-1.5 1.5-1.5S20 4.67 20 5.5v6.78C20 16.86 16.77 20 12 20S4 16.86 4 12.28V5.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PlantrackGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-5", className)}>
      <rect x="4" y="14" width="3.5" height="6" rx="1.4" fill="currentColor" opacity="0.72" />
      <rect x="9.5" y="11" width="3.5" height="9" rx="1.4" fill="currentColor" opacity="0.84" />
      <rect x="15" y="7" width="3.5" height="13" rx="1.4" fill="currentColor" opacity="0.96" />
      <path
        d="M4.7 10.1L9.6 8.4L12.1 10.8L18.3 4.6"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M15.9 4.6H18.3V7" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BrandImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      className={cn("size-5 object-contain", className)}
      width={20}
      height={20}
      loading="lazy"
      unoptimized
    />
  );
}

function resolveProvider(vendor: string, name?: string): ProviderVisual {
  const haystack = `${vendor} ${name ?? ""}`.toLowerCase();

  if (haystack.includes("anthropic") || haystack.includes("claude")) {
    return {
      kind: "simple",
      icon: siAnthropic,
      iconClassName: "text-[#2f241b] dark:text-[#f3dcc1]",
      containerClassName: "bg-[#f6efe5] dark:bg-[#2a2119]",
    };
  }

  if (haystack.includes("cursor")) {
    return {
      kind: "simple",
      icon: siCursor,
      iconClassName: "text-[#111827] dark:text-[#f3f4f6]",
      containerClassName: "bg-[#eef2f7] dark:bg-[#1a202c]",
    };
  }

  if (haystack.includes("openrouter")) {
    return {
      kind: "simple",
      icon: siOpenrouter,
      iconClassName: "text-[#111827] dark:text-[#f3f4f6]",
      containerClassName: "bg-[#eef2f7] dark:bg-[#18212f]",
    };
  }

  if (haystack.includes("deepseek")) {
    return {
      kind: "simple",
      icon: siDeepseek,
      iconClassName: "text-[#4d6bfe] dark:text-[#90a6ff]",
      containerClassName: "bg-[#eef2ff] dark:bg-[#17203a]",
    };
  }

  if (haystack.includes("minimax")) {
    return {
      kind: "simple",
      icon: siMinimax,
      iconClassName: "text-[#171717] dark:text-[#fafafa]",
      containerClassName: "bg-[#f5f5f5] dark:bg-[#242424]",
    };
  }

  if (haystack.includes("kimi") || haystack.includes("moonshot")) {
    return {
      kind: "simple",
      icon: siMoonshotai,
      iconClassName: "text-[#171717] dark:text-[#f5f3ff]",
      containerClassName: "bg-[#f4f2ff] dark:bg-[#241c38]",
    };
  }

  if (haystack.includes("openai") || haystack.includes("chatgpt") || haystack.includes("gpt")) {
    return {
      kind: "openai",
      iconClassName: "text-[#111827] dark:text-[#f3f4f6]",
      containerClassName: "bg-[#eff2f4] dark:bg-[#1b2329]",
    };
  }

  if (haystack.includes("阿里云") || haystack.includes("aliyun") || haystack.includes("alibaba cloud")) {
    return {
      kind: "simple",
      icon: siAlibabacloud,
      iconClassName: "text-[#ff6a00] dark:text-[#ff9a4a]",
      containerClassName: "bg-[#fff1e8] dark:bg-[#3a2415]",
    };
  }

  if (haystack.includes("百度") || haystack.includes("baidu")) {
    return {
      kind: "simple",
      icon: siBaidu,
      iconClassName: "text-[#2932e1] dark:text-[#8aa0ff]",
      containerClassName: "bg-[#edf1ff] dark:bg-[#172040]",
    };
  }

  if (haystack.includes("小米") || haystack.includes("mimo") || haystack.includes("xiaomi")) {
    return {
      kind: "simple",
      icon: siXiaomi,
      iconClassName: "text-[#ff6900] dark:text-[#ff9c4a]",
      containerClassName: "bg-[#fff0e6] dark:bg-[#3d2415]",
    };
  }

  if (haystack.includes("火山方舟") || haystack.includes("volcengine") || haystack.includes("字节")) {
    return {
      kind: "simple",
      icon: siBytedance,
      iconClassName: "text-[#151515] dark:text-[#f5f5f5]",
      containerClassName: "bg-[#f4f4f5] dark:bg-[#222225]",
    };
  }

  if (haystack.includes("京东云") || haystack.includes("jdcloud")) {
    return {
      kind: "image",
      src: "/brand-icons/jdcloud.ico",
      alt: "京东云",
      imageClassName: "size-5",
      containerClassName: "bg-white dark:bg-[#18181b]",
    };
  }

  if (haystack.includes("腾讯云") || haystack.includes("tencent")) {
    return {
      kind: "image",
      src: "/brand-icons/tencent.ico",
      alt: "腾讯云",
      imageClassName: "size-5",
      containerClassName: "bg-white dark:bg-[#0f172a]",
    };
  }

  if (haystack.includes("联通云") || haystack.includes("cucloud")) {
    return {
      kind: "image",
      src: "/brand-icons/cucloud.ico",
      alt: "联通云",
      imageClassName: "size-5",
      containerClassName: "bg-white dark:bg-[#111827]",
    };
  }

  if (haystack.includes("天翼云") || haystack.includes("ctyun")) {
    return {
      kind: "image",
      src: "/brand-icons/ctyun.ico",
      alt: "天翼云",
      imageClassName: "size-5",
      containerClassName: "bg-white dark:bg-[#111827]",
    };
  }

  if (haystack.includes("移动云") || haystack.includes("10086") || haystack.includes("ecloud")) {
    return {
      kind: "image",
      src: "/brand-icons/mobile-cloud.ico",
      alt: "移动云",
      imageClassName: "size-5",
      containerClassName: "bg-white dark:bg-[#111827]",
    };
  }

  if (haystack.includes("讯飞") || haystack.includes("星火") || haystack.includes("xfyun")) {
    return {
      kind: "image",
      src: "/brand-icons/xfyun.ico",
      alt: "讯飞星火",
      imageClassName: "size-5",
      containerClassName: "bg-white dark:bg-[#111827]",
    };
  }

  if (haystack.includes("商汤") || haystack.includes("sensenova") || haystack.includes("sensetime")) {
    return {
      kind: "image",
      src: "/brand-icons/sensenova.png",
      alt: "SenseNova",
      imageClassName: "size-5 rounded-sm",
      containerClassName: "bg-white dark:bg-[#111827]",
    };
  }

  if (haystack.includes("智谱") || haystack.includes("glm") || haystack.includes("bigmodel")) {
    return {
      kind: "image",
      src: "/brand-icons/bigmodel.png",
      alt: "智谱 GLM",
      imageClassName: "size-5",
      containerClassName: "bg-white dark:bg-[#111827]",
    };
  }

  if (haystack.includes("无问芯穹") || haystack.includes("infini-ai") || haystack.includes("infinigence")) {
    return {
      kind: "image",
      src: "/brand-icons/infini-ai.png",
      alt: "无问芯穹",
      imageClassName: "size-5 rounded-sm",
      containerClassName: "bg-white dark:bg-[#111827]",
    };
  }

  if (haystack.includes("国家超算中心") || haystack.includes("scnet")) {
    return {
      kind: "image",
      src: "/brand-icons/scnet.png",
      alt: "国家超算中心",
      imageClassName: "size-5 rounded-sm",
      containerClassName: "bg-white dark:bg-[#111827]",
    };
  }

  if (haystack.includes("opencode")) {
    return {
      kind: "image",
      src: "/brand-icons/opencode.ico",
      alt: "OpenCode",
      imageClassName: "size-5",
      containerClassName: "bg-white dark:bg-[#111827]",
    };
  }

  return {
    kind: "uvlio",
    iconClassName: "text-[#0f172a] dark:text-[#ecfeff]",
    containerClassName: "bg-[#ecfeff] dark:bg-[#11313a]",
  };
}

export function ProviderIcon({ vendor, name, className, iconClassName }: ProviderIconProps) {
  const resolved = resolveProvider(vendor, name);

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[14px] border border-black/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] dark:border-white/10 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
        resolved.containerClassName,
        className,
      )}
    >
      {resolved.kind === "simple" ? (
        <SimpleIcon icon={resolved.icon} className={cn(resolved.iconClassName, iconClassName)} />
      ) : resolved.kind === "image" ? (
        <BrandImage src={resolved.src} alt={resolved.alt} className={cn(resolved.imageClassName, iconClassName)} />
      ) : resolved.kind === "openai" ? (
        <OpenAiGlyph className={cn(resolved.iconClassName, iconClassName)} />
      ) : (
        <UvlioGlyph className={cn(resolved.iconClassName, iconClassName)} />
      )}
    </div>
  );
}

export function UvlioBrandIcon({ className, iconClassName }: Omit<ProviderIconProps, "vendor">) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-slate-950 text-white shadow-[0_10px_22px_rgba(15,23,42,0.22)] dark:bg-cyan-950 dark:text-cyan-50 dark:shadow-[0_10px_28px_rgba(8,47,73,0.35)]",
        className,
      )}
    >
      <UvlioGlyph className={cn("size-4.5", iconClassName)} />
    </div>
  );
}

export function PlantrackBrandIcon({ className, iconClassName }: Omit<ProviderIconProps, "vendor">) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[16px] bg-[linear-gradient(145deg,#0f6bdc,#18b89f)] text-white shadow-[0_12px_30px_rgba(15,107,220,0.28)] dark:bg-[linear-gradient(145deg,#77afff,#5ee0c8)] dark:text-slate-950 dark:shadow-[0_14px_34px_rgba(41,182,246,0.24)]",
        className,
      )}
    >
      <PlantrackGlyph className={cn("size-4.5", iconClassName)} />
    </div>
  );
}
