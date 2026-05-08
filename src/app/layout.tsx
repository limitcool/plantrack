import type { ReactNode } from "react";

import type { Metadata } from "next";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const siteName = "PlanTrack";
const siteUrl = "https://plantrack.uvlio.com";
const siteTitle = "PlanTrack - AI 订阅比价追踪平台";
const siteDescription =
  "一站式比较 OpenAI、Claude、Kimi、MiniMax 等 AI 服务的 Token Plan、Coding Plan 方案，定期追踪价格与配额变动。";
const ogImageUrl = `${siteUrl}/plantrack-mark.svg`;
const publishedAt = "2026-05-09T01:20:41+08:00";
const organizationName = "PlanTrack";

async function resolveModifiedAt() {
  try {
    const { execSync } = await import("node:child_process");
    return execSync("git log -1 --format=%cI", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return publishedAt;
  }
}

const modifiedAt = await resolveModifiedAt();

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: siteName,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: ogImageUrl,
    },
    email: "hi@uvlio.com",
    sameAs: ["https://github.com/limitcool/plantrack"],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: siteName,
    description: siteDescription,
    inLanguage: ["zh-CN", "en"],
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/#webpage`,
    url: siteUrl,
    name: siteTitle,
    description: siteDescription,
    isPartOf: {
      "@id": `${siteUrl}/#website`,
    },
    about: {
      "@id": `${siteUrl}/#organization`,
    },
    author: {
      "@id": `${siteUrl}/#organization`,
    },
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    breadcrumb: {
      "@id": `${siteUrl}/#breadcrumb`,
    },
    inLanguage: "zh-CN",
    datePublished: publishedAt,
    dateModified: modifiedAt,
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/#application`,
    name: siteName,
    url: siteUrl,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: siteDescription,
    image: ogImageUrl,
    creator: {
      "@id": `${siteUrl}/#organization`,
    },
    author: {
      "@id": `${siteUrl}/#organization`,
    },
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    datePublished: publishedAt,
    dateModified: modifiedAt,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${siteUrl}/#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: siteName,
        item: siteUrl,
      },
    ],
  },
] as const;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  authors: [{ name: organizationName, url: siteUrl }],
  creator: organizationName,
  publisher: organizationName,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: siteTitle,
    description: siteDescription,
    locale: "zh_CN",
    images: [
      {
        url: ogImageUrl,
        alt: `${siteName} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImageUrl],
  },
  icons: {
    icon: [
      { url: "/plantrack-mark.svg", type: "image/svg+xml" },
      { url: "/icon-light-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN" className="bg-background" suppressHydrationWarning>
      <head>
        {structuredData.map((item) => (
          <script key={item["@id"]} type="application/ld+json">
            {JSON.stringify(item)}
          </script>
        ))}
      </head>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
