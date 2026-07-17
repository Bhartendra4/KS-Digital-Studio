import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/fx/Reveal";
import CTA from "@/components/sections/CTA";
import { portfolio } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() { return portfolio.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = portfolio.find((x) => x.slug === slug);
  if (!p) return pageMeta("Case Study", "KS Digital Studio case study");
  return pageMeta(p.title, p.desc, `/case-studies/${p.slug}`);
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = portfolio.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <>
      <PageHero eyebrow={`${p.category} · ${p.year}`} title={p.title} subtitle={p.desc} />
      <section className="mx-auto max-w-[1440px] px-5 pb-8 md:px-10">
        <Reveal>
          <div className="relative h-64 overflow-hidden rounded-3xl md:h-96"
            style={{ background: `radial-gradient(120% 120% at 30% 20%, ${p.accent}55, transparent 60%), linear-gradient(160deg, #0A0A0A, #101010)` }}>
            <div className="absolute inset-0 bg-grid-lines bg-[size:28px_28px] opacity-30" />
          </div>
        </Reveal>
        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <Reveal><div><h2 className="font-display text-2xl font-semibold text-gradient">The challenge</h2>
              <p className="mt-3 text-white/60">{p.challenge}</p></div></Reveal>
            <Reveal delay={0.1}><div><h2 className="font-display text-2xl font-semibold text-gradient">Our solution</h2>
              <p className="mt-3 text-white/60">{p.solution}</p></div></Reveal>
            <Reveal delay={0.15}>
              <div className="grid grid-cols-3 gap-4">
                {p.results.map((r) => (
                  <div key={r.label} className="card-border p-5 text-center">
                    <div className="font-display text-3xl font-bold text-gradient">{r.value}</div>
                    <div className="mt-1 text-xs text-white/50">{r.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <aside className="glass h-fit rounded-2xl p-6 text-sm">
              <dl className="space-y-4">
                <div><dt className="text-white/40">Client</dt><dd className="text-white">{p.client}</dd></div>
                <div><dt className="text-white/40">Year</dt><dd className="text-white">{p.year}</dd></div>
                <div><dt className="text-white/40">Services</dt><dd className="text-white">{p.services.join(", ")}</dd></div>
              </dl>
              <Link href="/case-studies" className="mt-6 block text-accent-blue hover:text-white">← All case studies</Link>
            </aside>
          </Reveal>
        </div>
      </section>
      <CTA />
    </>
  );
}
