import { ImageResponse } from "next/og";
import { site } from "@/lib/site";
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.name;

export default function OG() {
  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", background: "#0B0B0B", color: "white",
        backgroundImage: "radial-gradient(60% 60% at 50% 40%, rgba(79,123,255,0.35), rgba(11,11,11,0))",
      }}>
        <div style={{ fontSize: 34, letterSpacing: 8, opacity: 0.6 }}>KS DIGITAL STUDIO</div>
        <div style={{ fontSize: 76, fontWeight: 700, marginTop: 20, textAlign: "center", maxWidth: 900 }}>
          We Build Websites That Grow Businesses.
        </div>
        <div style={{ fontSize: 28, marginTop: 24, opacity: 0.7 }}>
          Premium Web · UI/UX · SEO · AI Automation
        </div>
      </div>
    ),
    { ...size }
  );
}
