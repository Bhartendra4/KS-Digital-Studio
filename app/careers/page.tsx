import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/fx/Reveal";
import Button from "@/components/ui/Button";
import CTA from "@/components/sections/CTA";
import { jobs, values } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Careers", "Work with KS Digital Studio — freelance designers and developers welcome.", "/careers");

export default function CareersPage() {
  return (
    <>
      <PageHero eyebrow="Careers" title="Work with us."
        subtitle="KS Digital Studio is founder-led. There are no full-time openings right now, but we work with freelance designers and developers on projects." />
      <section className="mx-auto max-w-[1440px] px-5 pb-8 md:px-10">
        <h2 className="sr-only">Our values and open roles</h2>
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
          {jobs.length === 0 && (
            <div className="glass rounded-2xl p-6 text-white/70">
              No open roles right now. If you&apos;re a freelance designer or developer, send your portfolio through the{" "}
              <Link href="/contact" className="text-accent-blue underline">contact page</Link> and we&apos;ll reach out when a project fits.
            </div>
          )}
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
