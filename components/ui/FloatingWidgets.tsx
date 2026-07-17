"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, MessageCircle } from "lucide-react";
import { site } from "@/lib/site";

export default function FloatingWidgets() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div className="fixed bottom-6 right-6 z-[85] flex flex-col items-end gap-3">
      <a
        href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer"
        data-cursor aria-label="WhatsApp"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_10px_40px_-10px_rgba(37,211,102,0.8)] transition-transform hover:scale-110"
      >
        <MessageCircle className="h-6 w-6 text-white" />
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40" />
      </a>
      <AnimatePresence>
        {show && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-cursor aria-label="Scroll to top"
            className="glass flex h-12 w-12 items-center justify-center rounded-full text-white/80 hover:text-white"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
