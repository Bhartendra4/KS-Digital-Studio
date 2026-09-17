import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { site } from "@/lib/site";
import SmoothScroll from "@/components/fx/SmoothScroll";
import Cursor from "@/components/fx/Cursor";
import ScrollProgress from "@/components/fx/ScrollProgress";
import Loader from "@/components/ui/Loader";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";
import FloatingWidgets from "@/components/ui/FloatingWidgets";
import CookieBanner from "@/components/ui/CookieBanner";
import Chatbot from "@/components/chat/Chatbot";
import Analytics from "@/components/ui/Analytics";

const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: { default: `${site.name} — Premium Web Design & Development`, template: `%s — ${site.name}` },
  description: site.description,
  keywords: [
    "web design agency", "premium website development", "Next.js agency", "UI UX design",
    "SEO", "AI automation", "creative studio", "KS Digital Studio",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", url: site.domain, siteName: site.name,
    title: `${site.name} — We Build Websites That Grow Businesses`,
    description: site.description, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image", title: `${site.name}`, description: site.description,
    images: ["/opengraph-image"], creator: "@ksdigitalstudio",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  category: "technology",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name, description: site.description, url: site.domain,
    email: site.email, telephone: `+${site.whatsapp}`, image: `${site.domain}/opengraph-image`,
    logo: `${site.domain}/brand/app-icon-512.png`,
    priceRange: "$$", areaServed: "Worldwide",
    sameAs: site.socials.map((s) => s.href),
    address: { "@type": "PostalAddress", addressLocality: "Remote-first" },
    contactPoint: [{
      "@type": "ContactPoint",
      telephone: `+${site.whatsapp}`,
      email: site.email,
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    }],
  };
  return (
    <html lang="en" className={`${space.variable} ${inter.variable} dark`} suppressHydrationWarning>
      <body className="noise font-sans antialiased">
        <Script id="ld-json" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-ink">Skip to content</a>
        <Analytics />
        <Loader />
        <ScrollProgress />
        <Cursor />
        <Navbar />
        <SmoothScroll>
          <main id="content">{children}</main>
          <Footer />
        </SmoothScroll>
        <FloatingWidgets />
        <Chatbot />
        <CookieBanner />
      </body>
    </html>
  );
}
