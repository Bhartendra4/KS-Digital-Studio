import PageHero from "@/components/ui/PageHero";
import Portfolio from "@/components/sections/Portfolio";
import CTA from "@/components/sections/CTA";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Work", "Selected premium websites and web apps built by KS Digital Studio.", "/portfolio");

export default function PortfolioPage() {
  return (
    <>
      <PageHero eyebrow="Selected work" title="Projects we're proud of."
        subtitle="A glimpse of the premium products we've shipped for founders and teams worldwide." />
      <Portfolio hideHeading linkTo="/case-studies" />
      <CTA />
    </>
  );
}
