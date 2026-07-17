"use client";
import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const base: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function Reveal({
  children, delay = 0, className, y = 28,
}: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      variants={{ hidden: { opacity: 0, y, filter: "blur(10px)" }, show: base.show }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
