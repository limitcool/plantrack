import { LandingPage } from "@/components/marketing/landing-page";
import { fetchPlatforms } from "@/lib/api";
import { getLang } from "@/lib/lang";
import type { Platform as ApiPlatform } from "@/lib/platform-types";
import type { Platform as MarketingPlatform } from "@/lib/types";

function normalizePlatform(platform: ApiPlatform): MarketingPlatform {
  const category =
    platform.category === "ide-subscription"
      ? "coding-plan"
      : platform.category === "aggregator"
        ? "token-plan"
        : platform.category === "model-subscription" ||
            platform.category === "coding-plan" ||
            platform.category === "token-plan" ||
            platform.category === "image-generation" ||
            platform.category === "video-generation"
          ? platform.category
          : "model-subscription";

  const status = platform.status === "archived" ? "deprecated" : platform.status === "limited" ? "limited" : "tracked";

  return {
    ...platform,
    category,
    status,
    priceCurrency: platform.priceCurrency === "CNY" ? "CNY" : "USD",
    metrics: {
      ...platform.metrics,
      limits: platform.metrics.limits ?? [],
    },
    history: platform.history ?? [],
  };
}

export default async function HomePage({ searchParams }: { searchParams?: Promise<{ lang?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const lang = getLang(resolvedSearchParams?.lang, "zh");
  const platforms = await fetchPlatforms();
  const normalizedPlatforms = platforms.map(normalizePlatform);

  return <LandingPage platforms={normalizedPlatforms} lang={lang} />;
}
