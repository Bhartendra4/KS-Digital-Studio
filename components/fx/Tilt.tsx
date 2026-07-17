"use client";
import { useRef, type ReactNode } from "react";

export default function Tilt({ children, className, max = 10 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateZ(0)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0)"; };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={reset}
      className={className} style={{ transformStyle: "preserve-3d", transition: "transform .3s ease" }}>
      {children}
    </div>
  );
}
