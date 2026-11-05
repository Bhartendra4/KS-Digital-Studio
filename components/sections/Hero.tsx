// Entrance animations are plain CSS so they start with the first paint — with
// framer-motion the headline stayed hidden until the JavaScript had loaded.
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
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_bottom,rgba(15,13,11,0),#0F0D0B_92%)]" />

      <div className="mx-auto grid w-full max-w-[1240px] items-center gap-10 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6">
        {/* ---------------- LEFT: the message ---------------- */}
        <div className="relative z-10 max-w-xl">
          <p className="eyebrow mb-6 animate-fade-up [animation-delay:150ms]">
            <span className="h-px w-8 bg-accent-blue" />
            KS Digital Studio
          </p>

          {/* Below sm the size tracks the column width (viewport minus the
              px-5 gutters) so "WE BUILD DIGITAL" — about 7.9em wide — stays on
              one line from 320px up; capped at sm's 3.75rem so nothing jumps. */}
          <h1 className="font-display text-[length:min(calc((100vw_-_2.5rem)/8.3),3.75rem)] font-semibold leading-[0.94] tracking-tight sm:text-6xl md:text-7xl lg:text-[4.6rem] xl:text-[5.2rem]">
            {HEADLINE.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <span
                  className="inline-block animate-rise"
                  style={{ animationDelay: `${150 + i * 110}ms` }}
                >
                  <span className={i === 2 ? "text-gradient text-glow" : ""}>{line}</span>
                </span>
              </span>
            ))}
          </h1>

          <p
            className="animate-fade-up [animation-delay:450ms] mt-7 max-w-md text-base leading-relaxed text-white/60 md:text-lg"
          >
            Websites, AI-powered solutions and automation built to turn ideas into
            real business.
          </p>

          <div
            className="animate-fade-up [animation-delay:550ms] mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center"
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
          </div>
        </div>

        {/* ---------------- RIGHT: the studio showreel ----------------
            Its own grid cell, so it can never sit on top of the copy or the
            CTAs. Height is reserved up front — the canvas mounting causes no
            layout shift. pointer-events stay off throughout.               */}
        <div
          className="animate-fade-in [animation-delay:200ms] relative z-0 aspect-video w-full lg:aspect-auto lg:h-[70vh] lg:min-h-[480px]"
        >
          <HeroVideo className="h-full w-full" />
        </div>
      </div>

      <div
        className="animate-fade-in [animation-delay:1200ms] pointer-events-none absolute bottom-7 left-1/2 hidden -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-white/55 lg:block"
      >
        <span className="flex flex-col items-center gap-2">
          Scroll
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-white/50 to-transparent" />
        </span>
      </div>
    </section>
  );
}
