import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/fx/Reveal";
import Button from "@/components/ui/Button";
import CTA from "@/components/sections/CTA";
import { services } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) return pageMeta("Service", "KS Digital Studio service");
  return pageMeta(s.title, s.desc, `/services/${s.slug}`);
}

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();
  const others = services.filter((x) => x.slug !== s.slug).slice(0, 4);
  return (
    <>
      <PageHero eyebrow="Service" title={s.title} subtitle={s.long} />
      <section className="mx-auto grid max-w-[1440px] gap-10 px-5 pb-16 md:grid-cols-[1.4fr_1fr] md:px-10">
        <Reveal>
          <div className="card-border p-8">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent-electric to-accent-purple">
              <s.icon className="h-6 w-6 text-white" />
            </div>
            <h2 className="font-display text-2xl font-semibold">What&apos;s included</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {s.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-white/70">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-cyan" /> {f}
                </li>
              ))}
            </ul>
            <div className="mt-8"><Button href="/contact">Start Your Project</Button></div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="glass h-full rounded-2xl p-8">
            <h3 className="text-xs uppercase tracking-widest text-white/40">Related services</h3>
            <ul className="mt-4 space-y-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <a href={`/services/${o.slug}`} className="flex items-center gap-3 rounded-xl p-2 text-sm text-white/70 hover:bg-white/5">
                    <o.icon className="h-4 w-4 text-accent-cyan" /> {o.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>
      <CTA />
    </>
  );
}
