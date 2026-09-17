"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { services } from "@/lib/data";
import { LogoLockup } from "@/components/brand/Logo";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="relative overflow-hidden border-t border-white/10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent" />
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:px-10">
        <div>
          <Link href="/" aria-label={`${site.name} — home`} className="inline-block font-display">
            <LogoLockup />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-white/50">{site.description}</p>
          <p className="mt-4 text-sm text-white/40">{site.email}<br />{site.phone}</p>
        </div>
        <div>
          <h4 className="mb-4 text-xs uppercase tracking-widest text-white/40">Company</h4>
          <ul className="space-y-2 text-sm">
            {site.company.map((n) => (
              <li key={n.href}><Link href={n.href} className="text-white/60 hover:text-white">{n.label}</Link></li>
            ))}
            <li><Link href="/portfolio" className="text-white/60 hover:text-white">Work</Link></li>
            <li><Link href="/pricing" className="text-white/60 hover:text-white">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs uppercase tracking-widest text-white/40">Services</h4>
          <ul className="space-y-2 text-sm">
            {services.slice(0, 7).map((s) => (
              <li key={s.slug}><Link href={`/services/${s.slug}`} className="text-white/60 hover:text-white">{s.title}</Link></li>
            ))}
            <li><Link href="/services" className="text-accent-blue hover:text-white">All services →</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs uppercase tracking-widest text-white/40">Newsletter</h4>
          <p className="text-sm text-white/50">Get occasional insights on premium web & AI.</p>
          <form onSubmit={(e) => { e.preventDefault(); if (email.includes("@")) setOk(true); }} className="mt-4 flex gap-2">
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" aria-label="Email"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm outline-none focus:border-accent-blue/60" />
            <button className="btn-magnetic btn-primary px-4 py-2.5 text-sm" data-cursor>Join</button>
          </form>
          {ok && <p className="mt-2 text-xs text-accent-cyan">Subscribed — welcome aboard!</p>}
          <div className="mt-5 flex flex-wrap gap-3">
            {site.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="glass rounded-lg px-3 py-1.5 text-xs text-white/60 hover:text-white" data-cursor>{s.label}</a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-6 md:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 text-xs text-white/40 md:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <div className="flex gap-5">
            {site.legal.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white">{l.label}</Link>
            ))}
            <span>Next.js · Three.js · GSAP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
