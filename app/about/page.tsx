import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/fx/Reveal";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Process from "@/components/sections/Process";
import CTA from "@/components/sections/CTA";
import { values, milestones } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("About", "Meet KS Digital Studio — a premium, remote-first digital agency building websites that grow businesses.", "/about");

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Our story" title="A studio obsessed with premium craft."
        subtitle="We're a remote-first team of designers, engineers and strategists building digital experiences that make businesses grow." />

      <section className="mx-auto max-w-[1440px] px-5 py-16 md:px-10">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal><div className="card-border glass-hover h-full p-8">
            <h2 className="font-display text-2xl font-semibold text-gradient">Our Mission</h2>
            <p className="mt-3 text-white/60">To build websites and products so good that visitors trust our clients instantly — and so fast that they convert.</p>
          </div></Reveal>
          <Reveal delay={0.1}><div className="card-border glass-hover h-full p-8">
            <h2 className="font-display text-2xl font-semibold text-gradient">Our Vision</h2>
            <p className="mt-3 text-white/60">To be the studio the world&apos;s most ambitious brands call when only award-winning quality will do.</p>
          </div></Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-8 md:px-10">
        <Reveal><span className="eyebrow"><span className="h-px w-8 bg-accent-blue/60" /> Core values</span></Reveal>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.06}><div className="glass h-full rounded-2xl p-6">
              <h3 className="font-display text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-white/55">{v.desc}</p>
            </div></Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 md:px-10">
        <Reveal><span className="eyebrow"><span className="h-px w-8 bg-accent-blue/60" /> Company story</span></Reveal>
        <div className="mt-8 space-y-4">
          {milestones.map((m, i) => (
            <Reveal key={m.year} delay={i * 0.05}>
              <div className="glass glass-hover flex flex-col gap-2 rounded-2xl p-6 md:flex-row md:items-center md:gap-8">
                <span className="font-display text-3xl font-bold text-gradient md:w-28">{m.year}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold">{m.title}</h3>
                  <p className="text-sm text-white/55">{m.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <WhyChooseUs />
      <Process />
      <CTA />
    </>
  );
}
