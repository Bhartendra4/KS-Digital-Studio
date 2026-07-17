"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { faqs } from "@/lib/data";

export default function FAQ({ hideHeading = false }: { hideHeading?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeading eyebrow="FAQ" title="Questions, answered."
          subtitle="Everything you need to know before we start building together." />
        <div className="divide-y divide-white/10">
          {faqs.map((f, i) => (
            <div key={i} className="py-5">
              <button onClick={() => setOpen(open === i ? null : i)} data-cursor
                className="flex w-full items-center justify-between gap-4 text-left">
                <span className="font-display text-lg font-medium">{f.q}</span>
                <Plus className={`h-5 w-5 shrink-0 text-accent-blue transition-transform duration-300 ${open === i ? "rotate-45" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden">
                    <p className="pt-3 text-sm leading-relaxed text-white/55">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
