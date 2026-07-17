"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Tilt from "@/components/fx/Tilt";
import { portfolio } from "@/lib/data";

export default function Portfolio({
  hideHeading = false, linkTo,
}: { hideHeading?: boolean; linkTo?: string }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(portfolio.map((p) => p.category)))], []);
  const [active, setActive] = useState("All");
  const list = active === "All" ? portfolio : portfolio.filter((p) => p.category === active);

  const Card = ({ p }: { p: (typeof portfolio)[number] }) => (
    <Tilt className="card-border group relative block h-72 overflow-hidden">
      <div className="absolute inset-0 opacity-70 transition-transform duration-700 group-hover:scale-110"
        style={{ background: `radial-gradient(120% 120% at 30% 20%, ${p.accent}44, transparent 60%), linear-gradient(160deg, #0A0A0A, #101010)` }} />
      <div className="absolute inset-0 bg-grid-lines bg-[size:24px_24px] opacity-30" />
      <div className="relative flex h-full flex-col justify-between p-6">
        <span className="w-fit rounded-full px-3 py-1 text-xs font-medium"
          style={{ background: `${p.accent}22`, color: p.accent }}>{p.tag}</span>
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40">{p.category}</p>
          <h3 className="mt-1 flex items-center gap-2 font-display text-2xl font-semibold">{p.title}
            <ArrowUpRight className="h-5 w-5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" /></h3>
          <p className="mt-2 max-h-0 overflow-hidden text-sm text-white/60 transition-all duration-500 group-hover:max-h-24">{p.desc}</p>
        </div>
      </div>
    </Tilt>
  );

  return (
    <Section id="work">
      {!hideHeading && (
        <SectionHeading eyebrow="Selected work" title="Projects we're proud of."
          subtitle="A glimpse of the premium products we've shipped for founders and teams worldwide." />
      )}
      <div className={`${hideHeading ? "" : "mt-10"} flex flex-wrap gap-2`}>
        {categories.map((c) => (
          <button key={c} onClick={() => setActive(c)} data-cursor
            className={`rounded-full px-4 py-2 text-sm transition-all ${active === c ? "bg-white text-ink" : "glass text-white/60 hover:text-white"}`}>
            {c}
          </button>
        ))}
      </div>
      <motion.div layout className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <motion.div key={p.slug} layout
              initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.4 }}>
              {linkTo ? <Link href={`${linkTo}/${p.slug}`} data-cursor><Card p={p} /></Link> : <Card p={p} />}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}
