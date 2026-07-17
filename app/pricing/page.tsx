import PageHero from "@/components/ui/PageHero";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import CTA from "@/components/sections/CTA";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Pricing", "Simple, transparent pricing for premium websites and web apps from KS Digital Studio.", "/pricing");

export default function PricingPage() {
  return (
    <>
      <PageHero eyebrow="Pricing" title="Simple, transparent pricing."
        subtitle="Fixed-scope packages with no surprises. Need something bespoke? Let's talk." />
      <Pricing hideHeading />
      <FAQ />
      <CTA />
    </>
  );
}
