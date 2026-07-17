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

export const stats = [
  { value: 250, suffix: "+", label: "Projects Completed" },
  { value: 180, suffix: "+", label: "Happy Clients" },
  { value: 22, suffix: "+", label: "Countries Served" },
  { value: 24, suffix: "/7", label: "Support" },
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

export const milestones = [
  { year: "2017", title: "Founded", desc: "KS Digital Studio starts with a single freelance client." },
  { year: "2019", title: "First 50 projects", desc: "Grew into a small team of designers and developers." },
  { year: "2021", title: "Went global", desc: "Started serving clients across 3 continents." },
  { year: "2023", title: "AI & web apps", desc: "Expanded into AI automation, CRMs and SaaS builds." },
  { year: "2025", title: "250+ launches", desc: "A trusted studio for premium, high-performance products." },
];

export type Project = {
  slug: string; title: string; category: string; tag: string; accent: string;
  desc: string; year: string; client: string; services: string[];
  results: { label: string; value: string }[]; challenge: string; solution: string;
};

export const portfolio: Project[] = [
  { slug: "aether-finance", title: "Aether Finance", category: "Web App", tag: "Dashboard", accent: "#4F7BFF", desc: "Fintech analytics platform with a custom design system.", year: "2025", client: "Aether Inc.", services: ["Web App", "UI/UX", "Dashboards"], results: [{ label: "Demo bookings", value: "+212%" }, { label: "Load time", value: "0.9s" }, { label: "Lighthouse", value: "98" }], challenge: "Aether's legacy dashboard was slow and hard to navigate, hurting trial-to-paid conversion.", solution: "We rebuilt the product on Next.js with a bespoke design system, real-time charts and a sub-second first load." },
  { slug: "noir-atelier", title: "Noir Atelier", category: "E-commerce", tag: "Shop", accent: "#8B5CF6", desc: "Luxury fashion storefront with immersive product pages.", year: "2024", client: "Noir Atelier", services: ["E-commerce", "Design", "SEO"], results: [{ label: "Revenue", value: "+42%" }, { label: "AOV", value: "+18%" }, { label: "Bounce", value: "-31%" }], challenge: "A premium brand with a storefront that felt generic and undersold the products.", solution: "Immersive product storytelling, a refined checkout and technical SEO lifted revenue and average order value." },
  { slug: "lumen-studio", title: "Lumen Studio", category: "Portfolio", tag: "Creative", accent: "#22D3EE", desc: "Interactive portfolio for a motion design studio.", year: "2024", client: "Lumen", services: ["Portfolio", "Motion", "3D"], results: [{ label: "Inbound leads", value: "3x" }, { label: "Avg. session", value: "4m12s" }, { label: "Awwwards", value: "Honorable" }], challenge: "Lumen needed a site as impressive as their reels to win enterprise clients.", solution: "A cinematic, GSAP-driven portfolio with 3D reveals that doubled qualified inbound." },
  { slug: "verde-bistro", title: "Verde Bistro", category: "Restaurant", tag: "Booking", accent: "#34D399", desc: "Fine-dining site with reservations and live menu.", year: "2025", client: "Verde", services: ["Restaurant", "Booking", "Design"], results: [{ label: "Reservations", value: "+64%" }, { label: "Direct orders", value: "+28%" }, { label: "Load time", value: "1.1s" }], challenge: "Verde relied on third-party apps that ate into margins and diluted the brand.", solution: "A branded site with native reservations and ordering brought guests direct and lifted margins." },
  { slug: "orbit-saas", title: "Orbit SaaS", category: "Landing", tag: "Marketing", accent: "#F59E0B", desc: "Product launch page converting at 9.4%.", year: "2025", client: "Orbit", services: ["Landing", "Copy", "CRO"], results: [{ label: "Conversion", value: "9.4%" }, { label: "Signups (wk1)", value: "6,200" }, { label: "CAC", value: "-37%" }], challenge: "Orbit's launch needed a page that could convert cold paid traffic at scale.", solution: "A tightly-scoped, benefit-led landing page with fast load and clear CTAs hit a 9.4% conversion rate." },
  { slug: "pulse-health", title: "Pulse Health", category: "Business", tag: "Corporate", accent: "#F472B6", desc: "Healthcare brand refresh and multi-page build.", year: "2024", client: "Pulse", services: ["Business", "Brand", "SEO"], results: [{ label: "Organic traffic", value: "+128%" }, { label: "Leads", value: "+73%" }, { label: "Accessibility", value: "100" }], challenge: "Pulse's outdated site failed accessibility standards and ranked poorly.", solution: "A fully accessible, SEO-optimised rebuild grew organic traffic and inbound leads substantially." },
];

export const testimonials = [
  { name: "Aria Mehta", role: "Founder, Aether Finance", rating: 5, quote: "They delivered a website that genuinely feels years ahead. Our demo bookings tripled in the first month." },
  { name: "Daniel Cole", role: "CMO, Orbit SaaS", rating: 5, quote: "The most seamless agency experience we've had. Design, speed and communication were flawless." },
  { name: "Sofia Rossi", role: "Owner, Noir Atelier", rating: 5, quote: "Our store finally looks as premium as our products. Sales are up 42% since launch." },
  { name: "Ken Watanabe", role: "Director, Lumen Studio", rating: 5, quote: "Every interaction feels intentional. Clients constantly ask who built our site." },
];

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
