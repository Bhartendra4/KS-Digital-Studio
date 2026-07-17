"use client";
import { motion } from "framer-motion";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Showcase() {
  return (
    <Section id="showcase">
      <SectionHeading eyebrow="Feature showcase" title="Pixel-perfect on every device." center
        subtitle="Every build is engineered to feel premium from 320px phones to 2560px displays." />
      <div className="relative mx-auto mt-16 flex max-w-4xl items-end justify-center">
        {/* laptop */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 12 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-3xl" style={{ perspective: 1000 }}>
          <div className="rounded-t-2xl border border-white/10 bg-ink-800 p-3 shadow-[0_40px_120px_-30px_rgba(46,107,255,0.5)]">
            <div className="mb-2 flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            </div>
            <div className="relative h-64 overflow-hidden rounded-lg bg-gradient-to-br from-ink-700 to-ink md:h-80">
              <div className="absolute inset-0 bg-grid-lines bg-[size:26px_26px]" />
              <motion.div
                animate={{ y: ["0%", "-55%", "0%"] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-x-0 top-0 space-y-4 p-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass rounded-xl p-4">
                    <div className="h-3 w-1/3 rounded bg-gradient-to-r from-accent-electric to-accent-cyan" />
                    <div className="mt-3 h-2 w-2/3 rounded bg-white/10" />
                    <div className="mt-2 h-2 w-1/2 rounded bg-white/10" />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
          <div className="mx-auto h-3 w-[108%] -translate-x-[4%] rounded-b-xl bg-ink-700 shadow-inner" />
        </motion.div>
        {/* phone */}
        <motion.div
          initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.2 }}
          className="absolute -right-2 bottom-0 z-20 hidden w-40 sm:block md:-right-10">
          <div className="rounded-[2rem] border border-white/10 bg-ink-800 p-2 shadow-2xl">
            <div className="relative h-72 overflow-hidden rounded-[1.6rem] bg-gradient-to-b from-ink-700 to-ink">
              <div className="absolute inset-x-0 top-2 mx-auto h-1 w-12 rounded-full bg-white/20" />
              <motion.div animate={{ y: ["0%", "-45%", "0%"] }} transition={{ duration: 10, repeat: Infinity }}
                className="space-y-3 p-4 pt-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass rounded-lg p-3">
                    <div className="h-2 w-1/2 rounded bg-accent-purple/60" />
                    <div className="mt-2 h-2 w-full rounded bg-white/10" />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
