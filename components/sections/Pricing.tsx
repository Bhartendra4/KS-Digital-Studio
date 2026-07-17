"use client";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { pricing } from "@/lib/data";

export default function Pricing({ hideHeading = false }: { hideHeading?: boolean }) {
  return (
    <Section id="pricing">
      {!hideHeading && (
        <SectionHeading eyebrow="Pricing" title="Simple, transparent pricing." center
          subtitle="Fixed-scope packages with no surprises. Need something bespoke? Let's talk." />
      )}
      <div className={`${hideHeading ? "" : "mt-14"} grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-center`}>
        {pricing.map((p, i) => (
          <motion.div key={p.name}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
            className={`card-border relative p-8 ${p.highlight ? "lg:scale-[1.05] ring-1 ring-accent-blue/50" : "glass-hover"}`}>
            {p.highlight && (
              <>
                <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-b from-accent-blue/15 to-transparent blur-xl" />
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-accent-electric to-accent-purple px-4 py-1 text-xs font-semibold">
                  <Sparkles className="mr-1 inline h-3 w-3" /> Most Popular
                </span>
              </>
            )}
            <h3 className="font-display text-xl font-semibold">{p.name}</h3>
            <p className="mt-1 text-sm text-white/50">{p.tagline}</p>
            <div className="mt-6 flex items-end gap-2">
              <span className="font-display text-5xl font-bold text-gradient">{p.price}</span>
              <span className="mb-1.5 text-sm text-white/40">{p.cadence}</span>
            </div>
            <ul className="mt-6 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-white/70">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-cyan" /> {f}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href="/contact" variant={p.highlight ? "primary" : "ghost"} className="w-full justify-center">
                {p.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
