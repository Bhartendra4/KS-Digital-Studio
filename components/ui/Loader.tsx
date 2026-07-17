"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Loader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    let n = 0;
    const id = setInterval(() => {
      n += Math.floor(Math.random() * 8) + 3;
      if (n >= 100) { n = 100; clearInterval(id); setTimeout(() => setDone(true), 500); }
      setCount(n);
    }, 90);
    return () => clearInterval(id);
  }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-display text-2xl font-semibold tracking-tight"
          >
            <span className="text-gradient">KS</span> Digital Studio
          </motion.div>
          <div className="mt-8 h-px w-56 overflow-hidden bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-accent-electric to-accent-cyan"
              animate={{ width: `${count}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
          <div className="mt-4 font-display text-6xl font-bold tabular-nums text-white/90">{count}%</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
