import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/fx/Reveal";
import CTA from "@/components/sections/CTA";
import { portfolio } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Case Studies", "In-depth case studies showing how KS Digital Studio grows businesses through premium web work.", "/case-studies");

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero eyebrow="Case studies" title="Results, not just visuals."
        subtitle="How our design and engineering translated into real business outcomes." />
      <section className="mx-auto max-w-[1440px] px-5 pb-8 md:px-10">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {portfolio.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 0.08}>
              <Link href={`/case-studies/${p.slug}`} className="card-border group relative block h-64 overflow-hidden" data-cursor>
                <div className="absolute inset-0 opacity-70 transition-transform duration-700 group-hover:scale-110"
                  style={{ background: `radial-gradient(120% 120% at 30% 20%, ${p.accent}44, transparent 60%), linear-gradient(160deg, #0A0A0A, #101010)` }} />
                <div className="absolute inset-0 bg-grid-lines bg-[size:24px_24px] opacity-30" />
                <div className="relative flex h-full flex-col justify-between p-7">
                  <span className="w-fit rounded-full px-3 py-1 text-xs font-medium" style={{ background: `${p.accent}22`, color: p.accent }}>{p.category}</span>
                  <div>
                    <div className="flex flex-wrap gap-4 text-sm text-white/70">
                      {p.results.slice(0, 3).map((r) => (
                        <span key={r.label}><b className="text-white">{r.value}</b> {r.label}</span>
                      ))}
                    </div>
                    <h3 className="mt-2 flex items-center gap-2 font-display text-2xl font-semibold">{p.title}
                      <ArrowUpRight className="h-5 w-5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" /></h3>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
