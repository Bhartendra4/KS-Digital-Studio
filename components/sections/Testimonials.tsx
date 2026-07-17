"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % testimonials.length), 5000);
    return () => clearInterval(id);
  }, []);
  const t = testimonials[i];
  return (
    <Section id="testimonials">
      <SectionHeading eyebrow="Loved by clients" title="Words from the people we build for." center />
      <div className="relative mx-auto mt-14 max-w-3xl">
        <Quote className="mx-auto h-10 w-10 text-accent-blue/40" />
        <AnimatePresence mode="wait">
          <motion.div key={i}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
            transition={{ duration: 0.5 }} className="mt-6 text-center">
            <p className="font-display text-2xl font-medium leading-snug text-white md:text-3xl">“{t.quote}”</p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-accent-electric to-accent-purple font-semibold">
                {t.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="text-left">
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-white/50">{t.role}</p>
              </div>
            </div>
            <div className="mt-3 flex justify-center gap-1">
              {[...Array(t.rating)].map((_, s) => <Star key={s} className="h-4 w-4 fill-accent-cyan text-accent-cyan" />)}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, idx) => (
            <button key={idx} onClick={() => setI(idx)} aria-label={`Testimonial ${idx + 1}`} data-cursor
              className={`h-2 rounded-full transition-all ${idx === i ? "w-8 bg-accent-blue" : "w-2 bg-white/20"}`} />
          ))}
        </div>
      </div>
    </Section>
  );
}
