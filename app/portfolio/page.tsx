import PageHero from "@/components/ui/PageHero";
import Portfolio from "@/components/sections/Portfolio";
import CTA from "@/components/sections/CTA";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Work", "Concept / demo websites and web apps that show how KS Digital Studio designs and builds.", "/portfolio");

export default function PortfolioPage() {
  return (
    <>
      <PageHero eyebrow="Concept / demo projects" title="See what we can build."
        subtitle="Live concept websites for fictional brands — open any of them to try it on your phone. Real client work will be added as it launches." />
      <Portfolio hideHeading linkTo="/case-studies" />
      <CTA />
    </>
  );
}
