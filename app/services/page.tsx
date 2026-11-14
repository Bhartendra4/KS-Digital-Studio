import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/fx/Reveal";
import CTA from "@/components/sections/CTA";
import { services } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Services", "Website design and development, online stores, SEO and simple AI automation for small businesses, from KS Digital Studio.", "/services");

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="What I do" title="What I can build for you."
        subtitle="From a one-page site for your shop to an online store or a booking system. One person does it all, so nothing gets lost in between." />
      <section className="mx-auto max-w-[1440px] px-5 pb-8 md:px-10">
        <h2 className="sr-only">All services</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 0.06}>
              <Link href={`/services/${s.slug}`} className="card-border glass-hover group relative block h-full overflow-hidden p-6" data-cursor>
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent-blue/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] ring-1 ring-white/10 transition-colors group-hover:ring-accent-blue/40">
                  <s.icon className="h-5 w-5 text-accent-cyan" />
                </div>
                <h3 className="flex items-center gap-2 font-display text-lg font-semibold">{s.title}
                  <ArrowUpRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" /></h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{s.desc}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
