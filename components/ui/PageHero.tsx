import TextReveal from "@/components/fx/TextReveal";
import Reveal from "@/components/fx/Reveal";

export default function PageHero({
  eyebrow, title, subtitle,
}: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden pt-40 pb-16 md:pt-48 md:pb-20">
      <div className="aurora" />
      <div className="pointer-events-none absolute inset-0 bg-grid-lines bg-[size:40px_40px] opacity-[0.15]" />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal>
          <span className="eyebrow"><span className="h-px w-8 bg-accent-blue/60" /> {eyebrow}</span>
        </Reveal>
        <TextReveal as="h1" text={title}
          className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-[1.02] tracking-tight text-gradient md:text-7xl" />
        {subtitle && (
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">{subtitle}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
