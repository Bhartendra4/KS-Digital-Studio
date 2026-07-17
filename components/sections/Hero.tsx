"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import { site } from "@/lib/site";

const HeroCanvas = dynamic(() => import("@/components/three/HeroCanvas"), { ssr: false });

const pills = ["Premium Websites", "Brand Identity", "UI/UX", "SEO", "Automation", "AI Solutions"];

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute inset-0 -z-0"><HeroCanvas /></div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,11,11,0)_60%,#0B0B0B_100%)]" />

      <div className="relative z-10 mx-auto max-w-5xl px-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}
          className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-white/70"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent-cyan" /> Award-worthy digital experiences
        </motion.div>

        <h1 className="font-display text-[13vw] font-semibold leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
          {["We Build Websites", "That Sell."].map((line, li) => (
            <span key={li} className="block">
              <span className="reveal-mask">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }} animate={{ y: "0%" }}
                  transition={{ delay: 0.5 + li * 0.14, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className={li === 1 ? "text-gradient text-glow" : ""}>{line}</span>
                </motion.span>
              </span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.7 }}
          className="mx-auto mt-7 max-w-xl text-base text-white/60 md:text-lg"
        >
          {site.heroSub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.15, duration: 0.8 }}
          className="mx-auto mt-7 flex max-w-2xl flex-wrap justify-center gap-2.5"
        >
          {pills.map((p) => (
            <span key={p} className="glass rounded-full px-4 py-2 text-xs text-white/70 md:text-sm">{p}</span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.7 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button href="/contact" icon={<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}>
            Start Your Project
          </Button>
          <Button href={site.calendly} variant="ghost" icon={<CalendarCheck className="h-4 w-4" />}>
            Book Free Consultation
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-white/40"
      >
        <span className="flex flex-col items-center gap-2">Scroll
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-white/60 to-transparent" />
        </span>
      </motion.div>
    </section>
  );
}
