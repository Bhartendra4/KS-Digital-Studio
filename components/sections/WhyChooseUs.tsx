"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { stats, advantages } from "@/lib/data";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 1600; const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);
  return <span ref={ref} className="tabular-nums">{n}{suffix}</span>;
}

export default function WhyChooseUs() {
  return (
    <Section id="why">
      <SectionHeading eyebrow="Why choose us" title="Numbers that speak for themselves." center />
      <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card-border glass-hover p-8 text-center">
            <div className="font-display text-5xl font-bold text-gradient md:text-6xl">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <p className="mt-3 text-sm text-white/55">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {advantages.map((a, i) => (
          <motion.div key={a.title}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}
            className="glass rounded-2xl p-6">
            <h3 className="font-display text-base font-semibold text-white">{a.title}</h3>
            <p className="mt-2 text-sm text-white/55">{a.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
