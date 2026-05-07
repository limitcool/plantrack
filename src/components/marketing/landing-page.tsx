import { Changelog } from "@/components/marketing/changelog";
import { Footer } from "@/components/marketing/footer";
import { Header } from "@/components/marketing/header";
import { Hero } from "@/components/marketing/hero";
import { PricingComparison } from "@/components/marketing/pricing-comparison";
import type { Lang } from "@/lib/lang";
import type { Platform } from "@/lib/types";

interface LandingPageProps {
  platforms: Platform[];
  lang: Lang;
}

export function LandingPage({ platforms, lang }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header lang={lang} />
      <main>
        <Hero platforms={platforms} lang={lang} />
        <PricingComparison platforms={platforms} lang={lang} />
        <Changelog platforms={platforms} lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}
