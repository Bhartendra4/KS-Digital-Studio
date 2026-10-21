"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const CONSENT_KEY = "ks-cookie-consent"; // "accepted" | "declined"

export function hasAnalyticsConsent(): boolean {
  try { return localStorage.getItem(CONSENT_KEY) === "accepted"; } catch { return false; }
}

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // Show only until the visitor has made a choice (remembered across pages and visits).
  useEffect(() => {
    try { if (!localStorage.getItem(CONSENT_KEY)) setOpen(true); } catch { setOpen(true); }
  }, []);
  const choose = (v: "accepted" | "declined") => {
    try { localStorage.setItem(CONSENT_KEY, v); } catch {}
    window.dispatchEvent(new Event("ks-consent"));
    setOpen(false);
  };
  if (pathname.startsWith("/admin")) return null;
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          role="dialog" aria-label="Cookie consent"
          className="glass fixed inset-x-4 bottom-4 z-[95] rounded-2xl p-5 text-sm sm:inset-x-auto sm:bottom-6 sm:left-24 sm:max-w-sm"
        >
          <p className="text-white/70">
            We use cookies to enhance your experience and analyse traffic. You can accept or decline analytics cookies.
          </p>
          <div className="mt-4 flex gap-3">
            <button onClick={() => choose("accepted")} className="btn-magnetic btn-primary px-4 py-2 text-xs" data-cursor>Accept</button>
            <button onClick={() => choose("declined")} className="btn-magnetic btn-ghost px-4 py-2 text-xs" data-cursor>Decline</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
