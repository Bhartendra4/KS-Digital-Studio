import { ImageResponse } from "next/og";
import { site } from "@/lib/site";
import { MARK } from "@/components/brand/mark";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.name;

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", background: "#0B0B0B", color: "white",
          backgroundImage: "radial-gradient(60% 60% at 50% 40%, rgba(79,123,255,0.30), rgba(11,11,11,0))",
        }}
      >
        {/* "The Fold" mark + wordmark lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="76" height="76" viewBox="0 0 64 64">
            <path d={MARK} fill="#FFFFFF" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1, lineHeight: 1 }}>KS</div>
            <div style={{ fontSize: 16, letterSpacing: 9, opacity: 0.55, marginTop: 8 }}>DIGITAL STUDIO</div>
          </div>
        </div>

        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 44, textAlign: "center", maxWidth: 900, lineHeight: 1.12 }}>
          We Build Websites That Grow Businesses.
        </div>
        <div style={{ fontSize: 26, marginTop: 26, opacity: 0.65 }}>
          Premium Web · UI/UX · SEO · AI Automation
        </div>

        {/* electric accent rule */}
        <div style={{ display: "flex", width: 180, height: 3, marginTop: 40, background: "#4F7BFF", borderRadius: 2 }} />
      </div>
    ),
    { ...size }
  );
}
