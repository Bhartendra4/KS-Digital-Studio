// ============================================================
//  SINGLE SOURCE OF TRUTH — edit here to update the whole site
// ============================================================
export const site = {
  name: "KS Digital Studio",
  shortName: "KS",
  domain: "https://ksdigitalstudio.in",
  tagline: "We Build Digital Experiences That Grow Businesses",
  heroHeadline: "WE BUILD WEBSITES THAT SELL.",
  heroSub:
    "Premium websites engineered for speed, SEO, branding and business growth.",
  description:
    "KS Digital Studio is a premium digital agency crafting cinematic, high-performance websites, web apps, brand identities, UI/UX, SEO and AI automation that grow businesses.",
  email: "info@ksdigitalstudio.in",
  phone: "+91 81078 17733",
  whatsapp: "918107817733", // digits only, country code first
  // Own booking system (Calendly removed). Internal route — no third party.
  bookingUrl: "/book",
  // Get a free key at https://web3forms.com — paste your access key here:
  web3formsKey: "YOUR_WEB3FORMS_ACCESS_KEY",
  gaId: "", // e.g. G-XXXXXXX
  clarityId: "", // Microsoft Clarity project id
  address: "Remote-first • Serving clients worldwide",
  map: "https://www.google.com/maps?q=Bengaluru&output=embed",
  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Dribbble", href: "https://dribbble.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
    { label: "X", href: "https://x.com/" },
    { label: "GitHub", href: "https://github.com/" },
  ],
  // Primary navigation (route-based, multi-page)
  nav: [
    { label: "Services", href: "/services" },
    { label: "Work", href: "/portfolio" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Pricing", href: "/pricing" },
    { label: "Company", href: "/about" },
    { label: "Blog", href: "/blog" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};
export type Site = typeof site;
