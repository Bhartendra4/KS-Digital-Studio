"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function CookieBanner() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass fixed bottom-6 left-6 z-[84] max-w-sm rounded-2xl p-5 text-sm"
        >
          <p className="text-white/70">
            We use cookies to enhance your experience and analyse traffic. By continuing you agree to our use of cookies.
          </p>
          <div className="mt-4 flex gap-3">
            <button onClick={() => setOpen(false)} className="btn-magnetic btn-primary px-4 py-2 text-xs" data-cursor>Accept</button>
            <button onClick={() => setOpen(false)} className="btn-magnetic btn-ghost px-4 py-2 text-xs" data-cursor>Decline</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
