"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Search, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { services } from "@/lib/data";
import Button from "./Button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on(); window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => { setOpen(false); setMega(false); setSearchOpen(false); }, [pathname]);

  const results = q.length > 1
    ? services.filter((s) => s.title.toLowerCase().includes(q.toLowerCase())).slice(0, 6)
    : [];

  if (pathname.startsWith("/admin")) return null;
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-[90] flex justify-center px-4 pt-4"
    >
      <nav className={cn(
        "flex w-full max-w-[1240px] items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 md:px-6",
        scrolled ? "glass" : "border border-transparent"
      )}>
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold focus-ring" data-cursor>
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent-electric to-accent-purple text-sm font-bold">KS</span>
          <span className="hidden sm:block">Digital Studio</span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {/* Services mega menu */}
          <div className="relative" onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
            <Link href="/services" className="group flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-white">
              Services <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", mega && "rotate-180")} />
            </Link>
            <AnimatePresence>
              {mega && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25 }}
                  className="glass absolute left-1/2 top-8 w-[640px] -translate-x-1/2 rounded-2xl p-4"
                >
                  <div className="grid grid-cols-2 gap-1">
                    {services.slice(0, 12).map((s) => (
                      <Link key={s.slug} href={`/services/${s.slug}`}
                        className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/5">
                        <s.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent-cyan" />
                        <span>
                          <span className="block text-sm font-medium text-white">{s.title}</span>
                          <span className="block text-xs text-white/45">{s.desc}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                  <Link href="/services" className="mt-2 block rounded-xl bg-white/5 p-3 text-center text-sm text-accent-blue hover:bg-white/10">
                    View all services →
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {site.nav.filter((n) => n.label !== "Services").map((n) => (
            <Link key={n.href} href={n.href} data-cursor
              className={cn("group relative text-sm transition-colors hover:text-white",
                pathname === n.href ? "text-white" : "text-white/70")}>
              {n.label}
              <span className={cn("absolute -bottom-1 left-0 h-px bg-accent-blue transition-all duration-300",
                pathname === n.href ? "w-full" : "w-0 group-hover:w-full")} />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} aria-label={`Call ${site.phone}`} data-cursor
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:text-white xl:flex">
            <Phone className="h-4 w-4 text-accent-cyan" /> {site.phone}
          </a>
          <button onClick={() => setSearchOpen((v) => !v)} aria-label="Search"
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-white/60 hover:text-white lg:flex focus-ring" data-cursor>
            <Search className="h-4 w-4" />
          </button>
          <div className="hidden lg:block">
            <Button href="/contact" className="px-5 py-2.5 text-sm">Start Your Project</Button>
          </div>
          <button onClick={() => setOpen(!open)} className="lg:hidden focus-ring" aria-label="Menu" data-cursor>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Search dropdown */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="glass absolute top-20 w-full max-w-md rounded-2xl p-4">
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search services..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-accent-blue/60" />
            <div className="mt-2 space-y-1">
              {results.map((r) => (
                <Link key={r.slug} href={`/services/${r.slug}`} className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/5">{r.title}</Link>
              ))}
              {q.length > 1 && results.length === 0 && <p className="px-3 py-2 text-sm text-white/40">No matches.</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="glass absolute top-20 mx-4 w-[calc(100%-2rem)] rounded-2xl p-6 lg:hidden">
            <div className="flex flex-col gap-4">
              {site.nav.map((n) => (
                <Link key={n.href} href={n.href} className="text-white/80">{n.label}</Link>
              ))}
              <Link href="/careers" className="text-white/80">Careers</Link>
              <Link href="/contact" className="text-white/80">Contact</Link>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="glass flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs text-accent-blue" data-cursor>
                  <Phone className="h-4 w-4" /> Call
                </a>
                <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 text-xs font-medium text-white" data-cursor>
                  WhatsApp
                </a>
                <a href={`mailto:${site.email}`} className="glass flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs text-accent-cyan" data-cursor>
                  Email
                </a>
              </div>
              <Button href="/contact" className="mt-1 justify-center text-sm">Start Your Project</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
