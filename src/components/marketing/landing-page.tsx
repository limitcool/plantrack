import dynamic from "next/dynamic";

import { Footer } from "@/components/marketing/footer";
import { Header } from "@/components/marketing/header";
import { Hero } from "@/components/marketing/hero";
import { PricingComparison } from "@/components/marketing/pricing-comparison";
import type { Lang } from "@/lib/lang";
import type { Platform } from "@/lib/types";

const Changelog = dynamic(
  () => import("@/components/marketing/changelog").then((mod) => mod.Changelog),
  {
    loading: () => <div className="border-t border-border py-16" aria-hidden="true" />,
  },
);

const ContactSection = dynamic(
  () => import("@/components/marketing/contact-section").then((mod) => mod.ContactSection),
  {
    loading: () => <div className="border-t border-border py-16" aria-hidden="true" />,
  },
);

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
        <ContactSection lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}
