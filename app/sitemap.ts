import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services, portfolio, posts } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/about", "/services", "/portfolio", "/case-studies", "/pricing", "/blog", "/careers", "/contact", "/privacy", "/terms"];
  const staticPages = routes.map((r) => ({
    url: `${site.domain}${r}`, lastModified: now,
    changeFrequency: "weekly" as const, priority: r === "" ? 1 : 0.7,
  }));
  const dyn = [
    ...services.map((s) => `/services/${s.slug}`),
    ...portfolio.map((p) => `/case-studies/${p.slug}`),
    ...posts.map((p) => `/blog/${p.slug}`),
  ].map((r) => ({ url: `${site.domain}${r}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 }));
  return [...staticPages, ...dyn];
}
