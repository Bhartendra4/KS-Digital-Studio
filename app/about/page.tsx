import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/fx/Reveal";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Process from "@/components/sections/Process";
import CTA from "@/components/sections/CTA";
import { values } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("About", "Meet Bhartendra, the person behind KS Digital Studio, a one-person web studio in Ahmedabad that builds websites for small businesses.", "/about");

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About" title="One person. Your whole website."
        subtitle="I'm Bhartendra, and KS Digital Studio is just me, working from Ahmedabad. When you message, I reply. When you ask for a change, I make it. No sales team and no hand-offs." />

      <section className="mx-auto max-w-[1440px] px-5 py-16 md:px-10">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal><div className="card-border glass-hover h-full p-8">
            <h2 className="font-display text-2xl font-semibold text-gradient">Why I do this</h2>
            <p className="mt-3 text-white/60">Most small businesses near me are found on Instagram or by word of mouth, and lose customers who search on Google. I want a good website to be something a neighbourhood shop can afford and understand.</p>
          </div></Reveal>
          <Reveal delay={0.1}><div className="card-border glass-hover h-full p-8">
            <h2 className="font-display text-2xl font-semibold text-gradient">What you can expect</h2>
            <p className="mt-3 text-white/60">A straight answer on price and timing, a demo you can open on your own phone before paying, and someone who actually picks up when you call.</p>
          </div></Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-8 md:px-10">
        <Reveal><span className="eyebrow"><span className="h-px w-8 bg-accent-blue/60" /> How I work</span></Reveal>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.06}><div className="glass h-full rounded-2xl p-6">
              <h3 className="font-display text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-white/55">{v.desc}</p>
            </div></Reveal>
          ))}
        </div>
      </section>


      <WhyChooseUs />
      <Process />
      <CTA />
    </>
  );
}
