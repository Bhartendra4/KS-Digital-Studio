import {
  Palette, Code2, ShoppingBag, UtensilsCrossed, Briefcase, FolderKanban,
  MousePointerClick, Layout, Search, Gauge, Bot, MessageSquare,
  Database, LayoutDashboard, AppWindow, Wrench,
} from "lucide-react";

export type Service = {
  slug: string; icon: any; title: string; desc: string; long: string;
  features: string[];
};

export const services: Service[] = [
  { slug: "website-design", icon: Palette, title: "Website Design", desc: "Cinematic, brand-first interfaces designed to convert.", long: "We craft distinctive, on-brand visual designs that make your business unforgettable — from wireframes to pixel-perfect, motion-ready UI.", features: ["Custom design system", "Motion & micro-interactions", "Conversion-focused layouts", "Figma handoff"] },
  { slug: "website-development", icon: Code2, title: "Website Development", desc: "Blazing-fast Next.js builds engineered to scale.", long: "Production-grade front-end engineering with Next.js, TypeScript and clean architecture that stays fast as you grow.", features: ["Next.js + TypeScript", "90+ Lighthouse", "SEO-ready", "CMS integration"] },
  { slug: "ecommerce", icon: ShoppingBag, title: "E-commerce Websites", desc: "Storefronts that feel premium and sell more.", long: "High-converting online stores with premium product pages, fast checkout and analytics baked in.", features: ["Shopify / headless", "Premium product pages", "Fast checkout", "Analytics"] },
  { slug: "restaurant", icon: UtensilsCrossed, title: "Restaurant Websites", desc: "Mouth-watering menus, reservations & ordering.", long: "Beautiful restaurant sites with live menus, reservations and online ordering that fill tables.", features: ["Live menu", "Reservations", "Online ordering", "Google presence"] },
  { slug: "business", icon: Briefcase, title: "Business Websites", desc: "Corporate presence that builds instant trust.", long: "Professional multi-page corporate websites that establish authority and generate qualified leads.", features: ["Multi-page", "Lead capture", "Trust signals", "Blog & CMS"] },
  { slug: "portfolio", icon: FolderKanban, title: "Portfolio Websites", desc: "Showcase your work like an award-winning studio.", long: "Immersive portfolios that make creatives and studios stand out and win better clients.", features: ["Interactive galleries", "Case studies", "Motion reveals", "Fast loading"] },
  { slug: "landing-pages", icon: MousePointerClick, title: "Landing Pages", desc: "Conversion-optimised pages for every campaign.", long: "Single-purpose, high-converting landing pages tuned for your ad and launch campaigns.", features: ["A/B ready", "Fast load", "Clear CTAs", "Analytics events"] },
  { slug: "ui-ux", icon: Layout, title: "UI/UX Design", desc: "Research-driven flows and pixel-perfect systems.", long: "End-to-end product design: research, flows, wireframes and polished, accessible interfaces.", features: ["User research", "Wireframes", "Design systems", "Prototypes"] },
  { slug: "seo", icon: Search, title: "SEO Optimization", desc: "Technical + on-page SEO that ranks and stays.", long: "Technical, on-page and content SEO that grows organic traffic and keeps you ranking.", features: ["Technical audit", "On-page SEO", "Schema markup", "Content strategy"] },
  { slug: "speed", icon: Gauge, title: "Speed Optimization", desc: "90+ Lighthouse, Core Web Vitals in the green.", long: "We diagnose and fix performance bottlenecks to hit green Core Web Vitals across the board.", features: ["Core Web Vitals", "Image optimization", "Code splitting", "Caching"] },
  { slug: "ai-automation", icon: Bot, title: "AI Automation", desc: "Workflows and agents that save you hours.", long: "Custom AI workflows and agents that automate repetitive work and unlock new capabilities.", features: ["Workflow automation", "AI agents", "Integrations", "Custom models"] },
  { slug: "chatbot", icon: MessageSquare, title: "Chatbot Development", desc: "24/7 AI assistants trained on your business.", long: "Conversational AI trained on your data to support customers and capture leads around the clock.", features: ["Trained on your data", "Lead capture", "Multi-channel", "Human handoff"] },
  { slug: "custom-crm", icon: Database, title: "Custom CRM", desc: "Tailored CRM systems built around your workflow.", long: "Bespoke CRM platforms that match exactly how your team sells and supports customers.", features: ["Custom pipelines", "Automations", "Role-based access", "Reporting"] },
  { slug: "admin-panels", icon: LayoutDashboard, title: "Admin Panel Development", desc: "Secure, role-based dashboards for your platform.", long: "Powerful admin panels and dashboards your team actually enjoys using.", features: ["Role-based access", "Data tables & charts", "Audit logs", "Fast UX"] },
  { slug: "web-applications", icon: AppWindow, title: "Web Applications", desc: "Full-scale SaaS and web apps built to scale.", long: "Complex, scalable web applications and SaaS products engineered end to end.", features: ["Scalable architecture", "Auth & payments", "Real-time features", "APIs"] },
  { slug: "maintenance", icon: Wrench, title: "Maintenance & Support", desc: "Proactive care, updates and monitoring.", long: "Ongoing care plans covering updates, monitoring, backups and iterative improvements.", features: ["Monitoring", "Updates & backups", "Security patches", "Priority support"] },
];

// Commitments we can stand behind (not vanity numbers). Update with real counts as projects ship.
export const stats = [
  { value: 24, suffix: "h", label: "Reply time on every enquiry" },
  { value: 100, suffix: "%", label: "Mobile-first, responsive builds" },
  { value: 90, suffix: "+", label: "Lighthouse score we aim for" },
  { value: 7, suffix: " days", label: "Starter website delivery" },
];

export const advantages = [
  { title: "Fast Delivery", desc: "Tight, predictable timelines without cutting corners." },
  { title: "Modern Technology", desc: "Next.js, React, Three.js and the latest tooling." },
  { title: "Premium Quality", desc: "Awwwards-level craft on every single pixel." },
  { title: "Real Results", desc: "Sites built to grow traffic, leads and revenue." },
];

export const process = [
  { step: "01", title: "Discovery", desc: "We learn your goals, audience and brand." },
  { step: "02", title: "Research", desc: "Competitor, market and UX research." },
  { step: "03", title: "Wireframe", desc: "Structure, flows and content strategy." },
  { step: "04", title: "UI Design", desc: "High-fidelity, on-brand visual design." },
  { step: "05", title: "Development", desc: "Clean, scalable, animated front-end build." },
  { step: "06", title: "Testing", desc: "Cross-device QA, accessibility & speed." },
  { step: "07", title: "Deployment", desc: "Launch, monitor and hand over the keys." },
  { step: "08", title: "Support", desc: "Ongoing care, iteration and growth." },
];

export const values = [
  { title: "Craft over templates", desc: "Every project is designed from scratch to feel one-of-a-kind." },
  { title: "Speed is a feature", desc: "We obsess over performance because fast sites convert." },
  { title: "Business first", desc: "Beautiful is the baseline — results are the goal." },
  { title: "Radical clarity", desc: "Transparent scope, timelines and communication throughout." },
];

export type Project = {
  slug: string; title: string; category: string; tag: string; accent: string;
  desc: string; year: string; client: string; services: string[];
  results: { label: string; value: string }[]; challenge: string; solution: string;
  image?: string; // screenshot thumbnail
  live?: string;  // live concept website (opens in a new tab)
};

// These are CONCEPT / DEMO projects that show our approach — not paid client work.
// "results" are design targets for the concept, never claimed outcomes.
export const portfolio: Project[] = [
  { slug: "crumb-and-co", title: "Crumb & Co.", category: "Restaurant", tag: "Bakery & Café", accent: "#B4692F", desc: "Concept: artisan bakery site with a menu and pre-order for pickup.", year: "Concept", client: "Concept / demo project", services: ["Website", "Menu", "Pre-order"], image: "/concepts/crumb-and-co/thumb.jpg", live: "/concepts/crumb-and-co/index.html", results: [{ label: "Pre-order", value: "Built-in" }, { label: "Layout", value: "Mobile-first" }, { label: "Lighthouse target", value: "90+" }], challenge: "Busy bakeries lose morning customers to long queues and phone orders that get missed.", solution: "A warm, photo-led site with the daily menu and a simple pre-order form so customers can pick up warm bakes without waiting." },
  { slug: "the-thali-house", title: "The Thali House", category: "Restaurant", tag: "Thali & Tiffin", accent: "#D9480F", desc: "Concept: Gujarati thali restaurant with table booking and tiffin plans.", year: "Concept", client: "Concept / demo project", services: ["Website", "Booking", "Tiffin plans"], image: "/concepts/the-thali-house/thumb.jpg", live: "/concepts/the-thali-house/index.html", results: [{ label: "Table booking", value: "Built-in" }, { label: "Tiffin plans", value: "Weekly · monthly" }, { label: "Layout", value: "Mobile-first" }], challenge: "Thali restaurants and tiffin services take most orders by phone and lose repeat customers.", solution: "A bold, appetising site with the menu, table booking and tiffin plans that can be ordered in a few taps." },
  { slug: "glow-studio", title: "Glow Studio", category: "Business", tag: "Salon & Beauty", accent: "#B07D62", desc: "Concept: elegant salon and nail bar site with online appointments.", year: "Concept", client: "Concept / demo project", services: ["Website", "Booking", "Services"], image: "/concepts/glow-studio/thumb.jpg", live: "/concepts/glow-studio/index.html", results: [{ label: "Appointments", value: "Online" }, { label: "Bridal", value: "Packages" }, { label: "Lighthouse target", value: "90+" }], challenge: "Salons juggle appointments on Instagram DMs and WhatsApp, and clients can't see services at a glance.", solution: "A calm, premium site with clear services and an appointment form so clients book a slot in under a minute." },
  { slug: "smilecare-dental", title: "SmileCare Dental", category: "Business", tag: "Clinic", accent: "#0E9F9A", desc: "Concept: family dental clinic site with treatments and check-up booking.", year: "Concept", client: "Concept / demo project", services: ["Website", "Booking", "SEO"], image: "/concepts/smilecare-dental/thumb.jpg", live: "/concepts/smilecare-dental/index.html", results: [{ label: "Check-up booking", value: "Online" }, { label: "Reminders", value: "WhatsApp" }, { label: "Accessibility target", value: "100" }], challenge: "Patients searching 'dentist near me' need to trust a clinic quickly and book without calling.", solution: "A clean, reassuring clinic site with clear treatments, hygiene promises and an easy check-up booking form." },
  { slug: "ironcore-fitness", title: "IronCore Fitness", category: "Business", tag: "Gym", accent: "#A8D61C", desc: "Concept: high-energy gym site with programs and free-trial booking.", year: "Concept", client: "Concept / demo project", services: ["Website", "Booking", "Memberships"], image: "/concepts/ironcore-fitness/thumb.jpg", live: "/concepts/ironcore-fitness/index.html", results: [{ label: "Free trial", value: "1-tap" }, { label: "Programs", value: "4" }, { label: "Theme", value: "Dark" }], challenge: "Gyms need to turn Instagram followers into walk-ins and trial sign-ups.", solution: "A bold, dark-theme site with programs, timings and a free-trial form that captures leads straight to WhatsApp." },
  { slug: "aether-finance", title: "Aether Finance", category: "Web App", tag: "Dashboard", accent: "#4F7BFF", desc: "Concept: fintech analytics dashboard with a custom design system.", year: "Concept", client: "Concept / demo project", services: ["Web App", "UI/UX", "Dashboards"], image: "/concepts/aether-finance/thumb.jpg", live: "/concepts/aether-finance/index.html", results: [{ label: "Load-time target", value: "<1s" }, { label: "Lighthouse target", value: "95+" }, { label: "Layout", value: "Responsive" }], challenge: "Fintech dashboards are often slow and hard to navigate, which hurts trial-to-paid conversion.", solution: "A Next.js build with a bespoke design system, real-time charts and a sub-second first load as the target." },
  { slug: "noir-atelier", title: "Noir Atelier", category: "E-commerce", tag: "Shop", accent: "#8B5CF6", desc: "Concept: luxury fashion storefront with immersive product pages.", year: "Concept", client: "Concept / demo project", services: ["E-commerce", "Design", "SEO"], image: "/concepts/noir-atelier/thumb.jpg", live: "/concepts/noir-atelier/index.html", results: [{ label: "Checkout", value: "1-page" }, { label: "Lighthouse target", value: "90+" }, { label: "SEO", value: "Technical" }], challenge: "Premium brands often sit on generic storefronts that undersell their products.", solution: "Immersive product storytelling, a refined one-page checkout and technical SEO built in from day one." },
  { slug: "lumen-studio", title: "Lumen Studio", category: "Portfolio", tag: "Creative", accent: "#22D3EE", desc: "Concept: interactive portfolio for a motion design studio.", year: "Concept", client: "Concept / demo project", services: ["Portfolio", "Motion", "3D"], image: "/concepts/lumen-studio/thumb.jpg", live: "/concepts/lumen-studio/index.html", results: [{ label: "Motion", value: "GSAP" }, { label: "Reveals", value: "3D" }, { label: "Lighthouse target", value: "90+" }], challenge: "A motion studio needs a site as impressive as its reels to win bigger clients.", solution: "A cinematic, GSAP-driven portfolio with 3D reveals and fast loading on mobile." },
  { slug: "orbit-saas", title: "Orbit SaaS", category: "Landing", tag: "Marketing", accent: "#F59E0B", desc: "Concept: launch page for a planning app, with a waitlist sign-up.", year: "Concept", client: "Concept / demo project", services: ["Landing", "Copy", "CRO"], image: "/concepts/orbit-saas/thumb.jpg", live: "/concepts/orbit-saas/index.html", results: [{ label: "Sections", value: "Benefit-led" }, { label: "CTA", value: "Clear" }, { label: "Lighthouse target", value: "95+" }], challenge: "A launch page has to turn cold paid traffic into sign-ups quickly.", solution: "A tightly scoped, benefit-led landing page with fast load and clear calls to action." },
];

// Real client testimonials only — add one here (with the client's permission) after each finished project.
export const testimonials: { name: string; role: string; rating: number; quote: string }[] = [];

export const pricing = [
  { name: "Starter", price: "$1,200", cadence: "one-time", highlight: false, tagline: "For founders getting online fast.", features: ["Up to 5 sections", "Responsive design", "Basic SEO setup", "Contact form", "2 revisions", "7-day delivery"] },
  { name: "Professional", price: "$3,500", cadence: "one-time", highlight: true, tagline: "Our most popular premium build.", features: ["Up to 12 sections", "Custom animations (GSAP)", "3D / motion hero", "Advanced SEO", "CMS integration", "Speed optimization", "5 revisions", "Priority support"] },
  { name: "Enterprise", price: "Custom", cadence: "let's talk", highlight: false, tagline: "For platforms & scaling teams.", features: ["Unlimited sections", "Web app / dashboards", "AI automation & chatbot", "Dedicated team", "SLA & maintenance", "Ongoing growth retainer"] },
];

export const faqs = [
  { q: "How long does a project take?", a: "Most premium websites ship in 2–4 weeks. Larger web apps run 6–10 weeks. We share a clear timeline after discovery." },
  { q: "Do you design and develop?", a: "Yes — we own the full journey from strategy and UI design through development, SEO and launch." },
  { q: "Will my site be fast and SEO-ready?", a: "Absolutely. We target 90+ Lighthouse scores, Core Web Vitals in the green, and full technical SEO on every build." },
  { q: "Can you work with my existing brand?", a: "Of course. We can elevate your current identity or craft a brand-new one — your call." },
  { q: "Do you offer maintenance?", a: "Yes, we offer monthly care plans covering updates, monitoring, backups and iterative improvements." },
  { q: "How do payments work?", a: "Typically 50% to start and 50% on launch. Enterprise engagements can be milestone-based." },
];

export type Post = { slug: string; title: string; excerpt: string; category: string; date: string; read: string; body: string[] };
export const posts: Post[] = [
  { slug: "why-fast-websites-convert", title: "Why Fast Websites Convert More Customers", excerpt: "Every 100ms of load time costs conversions. Here's how we hit sub-second loads on premium sites.", category: "Performance", date: "2026-06-18", read: "6 min", body: ["Speed isn't a nice-to-have — it's a revenue lever. Studies consistently show that faster sites convert better, rank higher and retain users longer.", "At KS Digital Studio we treat Core Web Vitals as a first-class requirement. We optimise images, split code, stream server components and cache aggressively.", "The result: sites that feel instant on any device, which directly lifts conversion and SEO."] },
  { slug: "anatomy-of-a-premium-hero", title: "The Anatomy of a Premium Hero Section", excerpt: "What separates a forgettable hero from one that makes visitors trust you instantly.", category: "Design", date: "2026-05-30", read: "5 min", body: ["The hero is the first impression — and you only get one. A premium hero balances a bold message, restrained motion and a single clear action.", "We combine cinematic 3D, staggered text reveals and magnetic CTAs, always in service of the message, never as decoration.", "Done right, the hero communicates quality before a single word is read."] },
  { slug: "seo-in-2026", title: "Technical SEO in 2026: A Practical Checklist", excerpt: "The technical foundations that still move the needle for organic growth.", category: "SEO", date: "2026-05-02", read: "8 min", body: ["Great content needs a technically sound foundation. In 2026, that means fast Core Web Vitals, clean semantic HTML, structured data and a crawlable architecture.", "We ship every site with metadata, Open Graph, schema.org markup, a sitemap and canonical URLs by default.", "These fundamentals compound over time into durable organic growth."] },
  { slug: "ai-automation-for-agencies", title: "How AI Automation Saves Businesses 20+ Hours a Week", excerpt: "Practical AI workflows that eliminate busywork without the hype.", category: "AI", date: "2026-04-15", read: "7 min", body: ["AI is most valuable when it quietly removes repetitive work. We build automations for lead routing, content drafting, support triage and reporting.", "The goal isn't novelty — it's giving teams their time back so they can focus on high-value work.", "Most clients recoup the investment within the first two months."] },
];

export type Job = { slug: string; title: string; type: string; location: string; team: string; summary: string };
export const jobs: Job[] = [
  { slug: "senior-frontend-engineer", title: "Senior Frontend Engineer", type: "Full-time", location: "Remote", team: "Engineering", summary: "Build cinematic, high-performance interfaces with Next.js, TypeScript and GSAP." },
  { slug: "product-designer", title: "Product Designer", type: "Full-time", location: "Remote", team: "Design", summary: "Own end-to-end design for premium websites and web apps." },
  { slug: "motion-designer", title: "Motion Designer", type: "Contract", location: "Remote", team: "Design", summary: "Craft the animations and micro-interactions that make our work unforgettable." },
  { slug: "seo-specialist", title: "SEO Specialist", type: "Part-time", location: "Remote", team: "Growth", summary: "Drive organic growth for our clients through technical and content SEO." },
];
