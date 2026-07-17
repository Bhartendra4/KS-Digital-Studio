"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { process } from "@/lib/data";

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const h = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <Section id="process">
      <SectionHeading eyebrow="How we work" title="A process built for excellence."
        subtitle="Eight deliberate stages that turn ambitious ideas into flawless, high-performing products." />
      <div ref={ref} className="relative mt-16 pl-4 md:pl-0">
        {/* center line */}
        <div className="absolute left-4 top-0 h-full w-px bg-white/10 md:left-1/2 md:-translate-x-1/2" />
        <motion.div style={{ scaleY: h }}
          className="absolute left-4 top-0 h-full w-px origin-top bg-gradient-to-b from-accent-electric via-accent-purple to-accent-cyan md:left-1/2 md:-translate-x-1/2" />
        <div className="space-y-10 md:space-y-0">
          {process.map((p, i) => (
            <motion.div key={p.step}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}
              className={`relative flex md:min-h-[120px] md:items-center ${i % 2 ? "md:justify-start" : "md:justify-end"}`}>
              <span className="absolute left-4 top-1 h-3 w-3 -translate-x-1/2 rounded-full bg-accent-blue ring-4 ring-accent-blue/20 md:left-1/2" />
              <div className={`ml-10 w-full md:ml-0 md:w-[45%] ${i % 2 ? "md:pl-12" : "md:pr-12 md:text-right"}`}>
                <div className="card-border glass-hover p-6">
                  <span className="font-display text-3xl font-bold text-white/15">{p.step}</span>
                  <h3 className="mt-1 font-display text-xl font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-white/55">{p.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
