import type { Metadata } from "next";
import { site } from "./site";

export function pageMeta(title: string, description: string, path = "/"): Metadata {
  const url = `${site.domain}${path}`;
  return {
    title, description,
    alternates: { canonical: path },
    openGraph: { title: `${title} — ${site.name}`, description, url, images: ["/opengraph-image"] },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
  };
}
