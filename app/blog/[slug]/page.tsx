import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import CTA from "@/components/sections/CTA";
import { posts } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() { return posts.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  if (!p) return pageMeta("Article", "KS Digital Studio blog");
  return pageMeta(p.title, p.excerpt, `/blog/${p.slug}`);
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  if (!p) notFound();
  const date = new Date(p.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return (
    <>
      <PageHero eyebrow={`${p.category} · ${p.read}`} title={p.title} />
      <article className="mx-auto max-w-3xl px-5 pb-16 md:px-10">
        <p className="text-sm text-white/40">{date}</p>
        <div className="mt-6 space-y-5 text-white/70 leading-relaxed">
          {p.body.map((para, i) => <p key={i}>{para}</p>)}
        </div>
        <Link href="/blog" className="mt-10 inline-block text-accent-blue hover:text-white">← Back to blog</Link>
      </article>
      <CTA />
    </>
  );
}
