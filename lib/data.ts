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
  { slug: "website-design", icon: Palette, title: "Website Design", desc: "A look that fits your business, not a template.", long: "I design the site around your business: your colours, your photos, your way of talking. You see the design and ask for changes before anything is built.", features: ["Custom design system", "Motion & micro-interactions", "Conversion-focused layouts", "Figma handoff"] },
  { slug: "website-development", icon: Code2, title: "Website Development", desc: "Fast websites that open quickly on any phone.", long: "I build with Next.js and TypeScript, so pages open quickly even on slow mobile data and stay easy to update as you grow.", features: ["Next.js + TypeScript", "90+ Lighthouse", "SEO-ready", "CMS integration"] },
  { slug: "ecommerce", icon: ShoppingBag, title: "E-commerce Websites", desc: "An online shop that is easy to buy from.", long: "Clear product pages, a short checkout and order alerts on your phone, so selling online does not turn into extra work.", features: ["Shopify / headless", "Premium product pages", "Fast checkout", "Analytics"] },
  { slug: "restaurant", icon: UtensilsCrossed, title: "Restaurant Websites", desc: "Your menu, table booking and orders in one place.", long: "A site with your menu, photos, timings and location, plus table booking or WhatsApp ordering, so customers stop asking the same questions on call.", features: ["Live menu", "Reservations", "Online ordering", "Google presence"] },
  { slug: "business", icon: Briefcase, title: "Business Websites", desc: "A proper online address people can trust.", long: "A clean multi-page site that explains what you do, shows proof and makes it easy to call, message or send an enquiry.", features: ["Multi-page", "Lead capture", "Trust signals", "Blog & CMS"] },
  { slug: "portfolio", icon: FolderKanban, title: "Portfolio Websites", desc: "Show your work so the right clients notice it.", long: "A simple, good-looking place for your projects and photos that loads fast and makes it easy to contact you.", features: ["Interactive galleries", "Case studies", "Motion reveals", "Fast loading"] },
  { slug: "landing-pages", icon: MousePointerClick, title: "Landing Pages", desc: "One page, one goal, for your ad or launch.", long: "A single focused page for a campaign or offer, with one clear button and tracking so you know what worked.", features: ["A/B ready", "Fast load", "Clear CTAs", "Analytics events"] },
  { slug: "ui-ux", icon: Layout, title: "UI/UX Design", desc: "Screens people understand without a manual.", long: "User flows, wireframes and finished screens for apps and dashboards, designed so people get it the first time.", features: ["User research", "Wireframes", "Design systems", "Prototypes"] },
  { slug: "seo", icon: Search, title: "SEO Optimization", desc: "Help the right people find you on Google.", long: "I fix the technical basics, write clear page titles and set up Google Business Profile and Search Console, so you show up for searches near you.", features: ["Technical audit", "On-page SEO", "Schema markup", "Content strategy"] },
  { slug: "speed", icon: Gauge, title: "Speed Optimization", desc: "Make a slow website fast again.", long: "I find what is slowing your site down (heavy images, extra scripts, slow hosting) and fix it, then show you the before and after.", features: ["Core Web Vitals", "Image optimization", "Code splitting", "Caching"] },
  { slug: "ai-automation", icon: Bot, title: "AI Automation", desc: "Let software handle the repetitive work.", long: "Small automations for things you do every day: replying to enquiries, sending reminders, moving data between sheets and apps.", features: ["Workflow automation", "AI agents", "Integrations", "Custom models"] },
  { slug: "chatbot", icon: MessageSquare, title: "Chatbot Development", desc: "A chat assistant that answers customers at 2 AM.", long: "A chatbot trained on your own services, prices and FAQs that answers common questions and passes real enquiries to you.", features: ["Trained on your data", "Lead capture", "Multi-channel", "Human handoff"] },
  { slug: "custom-crm", icon: Database, title: "Custom CRM", desc: "Keep every enquiry and follow-up in one place.", long: "A simple CRM built around how you actually work, so no enquiry gets lost in WhatsApp or a notebook.", features: ["Custom pipelines", "Automations", "Role-based access", "Reporting"] },
  { slug: "admin-panels", icon: LayoutDashboard, title: "Admin Panel Development", desc: "A dashboard your staff can use on day one.", long: "Admin panels with the right access for each person, clear tables and reports, and nothing extra to confuse people.", features: ["Role-based access", "Data tables & charts", "Audit logs", "Fast UX"] },
  { slug: "web-applications", icon: AppWindow, title: "Web Applications", desc: "Your idea, built into a working web app.", long: "Login, payments, dashboards and APIs: I plan it with you, build it in stages and show you progress every week.", features: ["Scalable architecture", "Auth & payments", "Real-time features", "APIs"] },
  { slug: "maintenance", icon: Wrench, title: "Maintenance & Support", desc: "I look after the site so you do not have to.", long: "Updates, backups, security fixes and small changes each month, with one person to message when something is needed.", features: ["Monitoring", "Updates & backups", "Security patches", "Priority support"] },
];

// Commitments we can stand behind (not vanity numbers). Update with real counts as projects ship.
export const stats = [
  { value: 24, suffix: "h", label: "Reply time on every enquiry" },
  { value: 100, suffix: "%", label: "Mobile-first, responsive builds" },
  { value: 90, suffix: "+", label: "Speed score I aim for" },
  { value: 7, suffix: " days", label: "Starter website delivery" },
];

export const advantages = [
  { title: "You talk to me", desc: "No account manager in between. The person you message is the person building your site." },
  { title: "Free demo first", desc: "I build a sample of your site before you pay, so you can judge the work, not the promises." },
  { title: "Fast on mobile data", desc: "Most of your customers are on a phone. Every site is built and tested for that first." },
  { title: "Fixed price", desc: "The price is written down before I start, and it does not change halfway." },
];

export const process = [
  { step: "01", title: "We talk", desc: "A short call or WhatsApp chat about your business and what you need." },
  { step: "02", title: "I look around", desc: "I check your competitors and what your customers search for." },
  { step: "03", title: "Rough layout", desc: "You see the pages and what goes where, before any design work." },
  { step: "04", title: "Design", desc: "Your colours, photos and wording, shown to you for changes." },
  { step: "05", title: "Build", desc: "I turn the design into a fast, working website." },
  { step: "06", title: "Testing", desc: "Checked on phones, tablets and laptops, and for speed." },
  { step: "07", title: "Go live", desc: "I connect your domain and hand over everything, including logins." },
  { step: "08", title: "After launch", desc: "Small fixes and questions are welcome. Care plans if you want ongoing help." },
];

export const values = [
  { title: "Made for you", desc: "Your site is designed around your business, not picked from a template." },
  { title: "Speed matters", desc: "A slow site loses customers, so I check loading time on every build." },
  { title: "Business first", desc: "Looking good is the start. The site has to bring calls, messages and orders." },
  { title: "Plain talk", desc: "Clear scope, clear dates, and I tell you early if something will take longer." },
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
  { name: "Starter", price: "₹8,000", cadence: "from, one-time", highlight: false, tagline: "For a shop, café, clinic or freelancer who needs to be found online.", features: ["1 to 5 pages", "Looks right on every phone", "Call and WhatsApp buttons", "Google Maps and basic SEO", "2 rounds of changes", "Live in about 7 days"] },
  { name: "Business", price: "₹15,000", cadence: "from, one-time", highlight: true, tagline: "For businesses that take bookings or orders.", features: ["Everything in Starter", "Online booking or WhatsApp ordering", "Menu, gallery or price list", "Google Business Profile setup", "Tuned for slow mobile data", "3 rounds of changes"] },
  { name: "Custom", price: "Let's talk", cadence: "quote in 24h", highlight: false, tagline: "Online stores, web apps and automation.", features: ["Online store with payments", "Web app or dashboard", "AI chatbot or automation", "You talk to me directly", "Care plan from ₹1,000/month", "Paid in milestones"] },
];

export const faqs = [
  { q: "Do I have to pay before I see anything?", a: "No. I build a free demo of your site first. If you like it, we agree a price and I finish it. If you don't, you owe nothing." },
  { q: "How long does a website take?", a: "A starter site is usually live in about a week. A site with booking or ordering takes 2 to 3 weeks. Web apps take longer, and I give you dates before starting." },
  { q: "I don't have photos or text. Is that a problem?", a: "No. Send me what you have, even phone photos and a few voice notes. I write the text, pick the best photos and show you everything before it goes live." },
  { q: "Will people find my site on Google?", a: "I set up the basics that matter for local search: fast pages, proper titles, Google Business Profile and Search Console. Ranking takes time, and I won't promise a number one spot." },
  { q: "What happens after the site is live?", a: "You get all the logins. Small fixes in the first weeks are free. If you want ongoing updates, care plans start at ₹1,000 a month." },
  { q: "How do payments work?", a: "Usually half to start the final build and half when the site goes live. Bigger projects are split into milestones." },
];

export type Post = { slug: string; title: string; excerpt: string; category: string; date: string; read: string; body: string[] };
export const posts: Post[] = [
  { slug: "why-fast-websites-convert", title: "Why Fast Websites Convert More Customers", excerpt: "Slow pages lose visitors. Here is what I do to make a site open fast.", category: "Performance", date: "2026-06-18", read: "6 min", body: ["Speed is not decoration. People leave a page that takes too long to open, and Google ranks slow pages lower.", "On every site I build, I compress images, load only the code a page needs and cache whatever can be cached. Then I test it on an ordinary phone, not just my laptop.", "The result is a site that opens quickly on any device, which helps both sales and Google ranking."] },
  { slug: "anatomy-of-a-premium-hero", title: "What Makes a Good First Screen on a Website", excerpt: "What separates a forgettable hero from one that makes visitors trust you instantly.", category: "Design", date: "2026-05-30", read: "5 min", body: ["The first screen of your site is your first impression. A good one says what you do in one line, shows one strong picture and offers one clear button.", "Animation can help, but only when it supports the message. If it slows the page or distracts from the button, I leave it out.", "When it works, a visitor understands who you are and what to do next within a few seconds."] },
  { slug: "seo-in-2026", title: "Technical SEO in 2026: A Practical Checklist", excerpt: "The technical foundations that still move the needle for organic growth.", category: "SEO", date: "2026-05-02", read: "8 min", body: ["Great content needs a technically sound foundation. In 2026, that means fast Core Web Vitals, clean semantic HTML, structured data and a crawlable architecture.", "Every site I build includes proper titles and descriptions, Open Graph tags, schema.org markup, a sitemap and canonical URLs.", "None of this is exciting, but it keeps adding up month after month."] },
  { slug: "ai-automation-for-agencies", title: "Where AI Automation Actually Saves Time", excerpt: "Practical AI workflows that eliminate busywork without the hype.", category: "AI", date: "2026-04-15", read: "7 min", body: ["AI is most useful when it quietly removes repetitive work: replying to common enquiries, drafting posts, sorting support messages and preparing reports.", "The point is not to look modern. The point is to get hours back for the work only you can do.", "Start with one repetitive task, measure the time it takes today, and automate only that. If it saves real hours, expand from there."] },
];

export type Job = { slug: string; title: string; type: string; location: string; team: string; summary: string };
// No open roles right now. Add a real one here only when we are actually hiring.
export const jobs: Job[] = [];
