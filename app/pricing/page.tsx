import PageHero from "@/components/ui/PageHero";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import CTA from "@/components/sections/CTA";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Pricing", "Clear, fixed prices for small-business websites from KS Digital Studio. Free demo before you pay.", "/pricing");

export default function PricingPage() {
  return (
    <>
      <PageHero eyebrow="Pricing" title="Simple, transparent pricing."
        subtitle="Fixed prices, written down before I start. You see a free demo first. Outside India, starter sites begin at about USD 300." />
      <Pricing hideHeading />
      <FAQ />
      <CTA />
    </>
  );
}
