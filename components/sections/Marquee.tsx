"use client";
const items = ["Next.js", "React", "Three.js", "GSAP", "TypeScript", "Framer Motion", "Tailwind", "AI", "SEO", "Figma"];
export default function Marquee() {
  return (
    <div className="relative flex overflow-hidden border-y border-white/5 py-6">
      <div className="flex min-w-full shrink-0 animate-marquee items-center justify-around gap-16 whitespace-nowrap">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="font-display text-2xl font-medium text-white/25 md:text-3xl">{t}</span>
        ))}
      </div>
    </div>
  );
}
