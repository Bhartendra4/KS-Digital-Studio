import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/fx/Reveal";
import CTA from "@/components/sections/CTA";
import { posts } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Blog", "Insights on premium web design, performance, SEO and AI from KS Digital Studio.", "/blog");

export default function BlogPage() {
  return (
    <>
      <PageHero eyebrow="Insights" title="The KS Digital Studio blog."
        subtitle="Practical thinking on premium web design, performance, SEO and AI." />
      <section className="mx-auto max-w-[1440px] px-5 pb-8 md:px-10">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.06}>
              <Link href={`/blog/${p.slug}`} className="card-border glass-hover group flex h-full flex-col p-6" data-cursor>
                <div className="mb-4 flex items-center gap-3 text-xs text-white/40">
                  <span className="rounded-full bg-white/5 px-3 py-1 text-accent-cyan">{p.category}</span>
                  <span>{p.read}</span>
                </div>
                <h3 className="font-display text-lg font-semibold group-hover:text-gradient">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm text-white/55">{p.excerpt}</p>
                <span className="mt-4 text-sm text-accent-blue">Read article →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
