import { ImageResponse } from "next/og";
import { MARK } from "@/components/brand/mark";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS home-screen icon — same geometry, no rounding (iOS masks it itself). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex",
          alignItems: "center", justifyContent: "center", background: "#0B0B0B",
        }}
      >
        <svg width="122" height="122" viewBox="0 0 64 64">
          <path d={MARK} fill="#FFFFFF" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
