import TextReveal from "@/components/fx/TextReveal";
import Reveal from "@/components/fx/Reveal";

export default function SectionHeading({
  eyebrow, title, subtitle, center,
}: { eyebrow: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Reveal>
        <span className="eyebrow">
          <span className="h-px w-8 bg-accent-blue/60" /> {eyebrow}
        </span>
      </Reveal>
      <TextReveal
        as="h2"
        text={title}
        className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl text-gradient"
      />
      {subtitle && (
        <Reveal delay={0.1}>
          <p className="mt-5 text-base leading-relaxed text-white/60 md:text-lg">{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}
