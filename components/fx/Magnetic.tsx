"use client";
import { useRef, type ReactNode } from "react";
import { motion } from "framer-motion";

export default function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = "translate(0,0)"; };
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={reset}
      className="inline-block transition-transform duration-300 ease-out will-change-transform">
      {children}
    </motion.div>
  );
}
