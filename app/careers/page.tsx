import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/fx/Reveal";
import Button from "@/components/ui/Button";
import CTA from "@/components/sections/CTA";
import { jobs, values } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Careers", "Join KS Digital Studio — a remote-first team building award-winning digital experiences.", "/careers");

export default function CareersPage() {
  return (
    <>
      <PageHero eyebrow="Careers" title="Build the future of the web with us."
        subtitle="We're a small, senior, remote-first team that ships premium work. Come raise the bar with us." />
      <section className="mx-auto max-w-[1440px] px-5 pb-8 md:px-10">
        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.06}><div className="glass rounded-2xl p-6">
              <h3 className="font-display text-base font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-white/55">{v.desc}</p>
            </div></Reveal>
          ))}
        </div>
        <h2 className="font-display text-2xl font-semibold text-gradient">Open roles</h2>
        <div className="mt-6 space-y-3">
          {jobs.map((j, i) => (
            <Reveal key={j.slug} delay={i * 0.05}>
              <div className="glass glass-hover flex flex-col gap-4 rounded-2xl p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold">{j.title}</h3>
                  <p className="mt-1 text-sm text-white/55">{j.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/50">
                    <span className="rounded-full bg-white/5 px-3 py-1">{j.team}</span>
                    <span className="rounded-full bg-white/5 px-3 py-1">{j.type}</span>
                    <span className="rounded-full bg-white/5 px-3 py-1">{j.location}</span>
                  </div>
                </div>
                <Button href={`/contact?role=${j.slug}`} variant="ghost" className="text-sm">Apply</Button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
