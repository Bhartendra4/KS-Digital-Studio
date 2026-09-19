"use client";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Button from "@/components/ui/Button";

/**
 * Imported directly rather than dynamically: the component is tiny, and this
 * way its poster is in the server HTML so the hero has a picture on first
 * paint. Only the video file itself is deferred until the hero nears the
 * viewport. Height is reserved by the wrapper, so nothing shifts.
 */
import HeroVideo from "@/components/hero/HeroVideo";

const HEADLINE = ["WE BUILD DIGITAL", "PRODUCTS", "THAT GROW."];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 lg:pt-0"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_bottom,rgba(5,5,5,0),#050505_92%)]" />

      <div className="mx-auto grid w-full max-w-[1240px] items-center gap-10 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6">
        {/* ---------------- LEFT: the message ---------------- */}
        <div className="relative z-10 max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="eyebrow mb-6"
          >
            <span className="h-px w-8 bg-accent-blue" />
            KS Digital Studio
          </motion.p>

          <h1 className="font-display text-[11.5vw] font-semibold leading-[0.94] tracking-tight sm:text-6xl md:text-7xl lg:text-[4.6rem] xl:text-[5.2rem]">
            {HEADLINE.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ delay: 0.45 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className={i === 2 ? "text-gradient text-glow" : ""}>{line}</span>
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="mt-7 max-w-md text-base leading-relaxed text-white/60 md:text-lg"
          >
            Websites, AI-powered solutions and automation built to turn ideas into
            real business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.7 }}
            className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center"
          >
            <Button
              href="/contact"
              icon={<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            >
              Start a Project
            </Button>
            <Button
              href="/portfolio"
              variant="ghost"
              icon={<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
            >
              View Our Work
            </Button>
          </motion.div>
        </div>

        {/* ---------------- RIGHT: the studio showreel ----------------
            Its own grid cell, so it can never sit on top of the copy or the
            CTAs. Height is reserved up front — the canvas mounting causes no
            layout shift. pointer-events stay off throughout.               */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 1.1 }}
          className="relative z-0 aspect-video w-full lg:aspect-auto lg:h-[70vh] lg:min-h-[480px]"
        >
          <HeroVideo className="h-full w-full" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="pointer-events-none absolute bottom-7 left-1/2 hidden -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-white/35 lg:block"
      >
        <span className="flex flex-col items-center gap-2">
          Scroll
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-white/50 to-transparent" />
        </span>
      </motion.div>
    </section>
  );
}
