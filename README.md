# KS Digital Studio — Premium Multi-Page Agency Website

A cinematic, Awwwards-grade agency website built with **Next.js 15 (App Router)**, **TypeScript**,
**Tailwind CSS**, **Three.js / React Three Fiber**, **Framer Motion**, **GSAP**, **Lenis** smooth scroll,
and **React Hook Form + Zod**.

## Quick start
```bash
npm install
npm run dev                    # http://localhost:3000
npm run build && npm start     # production
```
> Requires internet on first build (Google Fonts via next/font). Node 18.18+ recommended.

## Pages (13 routes + 404)
Home · About · Services (+ detail page per service) · Portfolio · Case Studies (+ detail) ·
Pricing · Blog (+ article) · Careers · Contact · Privacy · Terms · Thank You · animated 404.

All dynamic routes are statically generated (`generateStaticParams`) — **44 pages** at build time.

## Highlights
- **Cinematic hero** — Three.js particle field + wireframe orb, mouse parallax, staggered text reveal, headline “WE BUILD WEBSITES THAT SELL.”
- **Mega-menu navbar** with services dropdown, live search, sticky glass, active states
- **Route transitions** (`app/template.tsx`), page loader, Lenis smooth scroll, gradient cursor, scroll-progress bar, magnetic buttons, noise overlay, aurora gradients
- **Sections** — 16 services, animated counters, scroll-animated 8-step process, device showcase, filterable 3D-tilt portfolio, testimonial carousel, highlighted pricing, FAQ accordion, premium footer + newsletter
- **Contact** — React Hook Form + Zod validation, Web3Forms submit (mailto fallback), honeypot spam protection, redirect to animated Thank-You page
- **Floating widgets** — WhatsApp, scroll-to-top, cookie banner
- **SEO** — per-page metadata, OpenGraph + dynamic OG image, Twitter cards, JSON-LD schema, `robots.txt`, dynamic `sitemap.xml`, web manifest, canonical URLs
- **Accessibility** — skip-link, ARIA labels, focus-visible rings, keyboard nav, reduced-motion support
- **Analytics-ready** — Google Analytics + Microsoft Clarity (drop in IDs, loads only if set)
- **Responsive** — tuned from 320px to 2560px, dark premium theme (#050505 / #101010)

## Configure in one place (CMS-ready)
- `lib/site.ts` — brand, contact, socials, WhatsApp, Calendly, nav, map, **Web3Forms key**, GA/Clarity IDs
- `lib/data.ts` — services, stats, process, values, milestones, portfolio/case studies, testimonials, pricing, FAQs, blog posts, jobs

Edit those files and the whole site updates — no component changes needed.

## Contact form setup
1. Get a free access key at **https://web3forms.com**
2. Paste it into `site.web3formsKey` in `lib/site.ts`
Without a key, the form falls back to opening the visitor's email client. Prefer Resend/EmailJS?
Swap the `fetch` call in `components/sections/ContactForm.tsx`.

## Analytics
Set `gaId` (e.g. `G-XXXX`) and/or `clarityId` in `lib/site.ts` — scripts load only when present.

## Fonts
Space Grotesk + Inter via `next/font`. To add **Satoshi**, drop the files in `/public/fonts`
and register with `next/font/local` in `app/layout.tsx`.

## Tech
Next.js 15 · React 18 · TypeScript · TailwindCSS · Three.js · @react-three/fiber · Framer Motion · GSAP · Lenis · React Hook Form · Zod · lucide-react
