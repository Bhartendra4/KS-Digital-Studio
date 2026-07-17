"use client";
import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let mx = 0, my = 0, rx = 0, ry = 0, raf = 0;
    const move = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
      const t = e.target as HTMLElement;
      setHover(!!t.closest("a, button, [data-cursor]"));
    };
    const loop = () => {
      rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
      if (ring.current) ring.current.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-[70] hidden md:block" aria-hidden>
      <div ref={dot} className="fixed left-0 top-0 h-2 w-2 rounded-full bg-white mix-blend-difference" />
      <div
        ref={ring}
        className="fixed left-0 top-0 h-10 w-10 rounded-full border border-white/40 transition-[width,height,opacity] duration-300"
        style={{
          background: "radial-gradient(circle, rgba(79,123,255,0.25), transparent 60%)",
          transform: "translate(-100px,-100px)",
          scale: hover ? "1.6" : "1",
          opacity: hover ? 1 : 0.7,
        }}
      />
    </div>
  );
}
