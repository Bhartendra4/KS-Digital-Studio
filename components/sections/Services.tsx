"use client";
import { motion } from "framer-motion";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { services } from "@/lib/data";

export default function Services() {
  return (
    <Section id="services">
      <SectionHeading
        eyebrow="What we do"
        title="Services engineered for growth."
        subtitle="From cinematic marketing sites to full-scale web apps and AI automation — one studio, end to end."
      />
      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="card-border glass-hover group relative overflow-hidden p-6"
            data-cursor
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent-blue/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] ring-1 ring-white/10 transition-colors group-hover:ring-accent-blue/40">
              <s.icon className="h-5 w-5 text-accent-cyan" />
            </div>
            <h3 className="font-display text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{s.desc}</p>
            <span className="mt-4 inline-block h-px w-0 bg-gradient-to-r from-accent-electric to-accent-cyan transition-all duration-500 group-hover:w-full" />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
