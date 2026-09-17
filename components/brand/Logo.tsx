import type { SVGProps } from "react";

/**
 * KS Digital Studio — "The Fold"
 * A flat plane folded into dimension. Pure SVG, currentColor-driven.
 *   <FoldMark />            symbol only
 *   <FoldAppIcon />         dark squircle app icon / avatar
 *   <LogoLockup />          symbol + KS DIGITAL STUDIO
 *   <LogoLockup stacked />  centred, for square formats
 */
import { MARK } from "./mark";

export function FoldMark({ className, ...p }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} role="img"
      aria-label="KS Digital Studio" {...p}>
      <title>KS Digital Studio</title>
      <path d={MARK} fill="currentColor" />
    </svg>
  );
}

export function FoldAppIcon({ className, ...p }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img"
      aria-label="KS Digital Studio" {...p}>
      <title>KS Digital Studio</title>
      <rect width="64" height="64" rx="14" fill="#0B0B0B" />
      <path d={MARK} fill="#FFFFFF" />
    </svg>
  );
}

export function LogoLockup({
  stacked = false, className = "",
}: { stacked?: boolean; className?: string }) {
  if (stacked) {
    return (
      <span className={`inline-flex flex-col items-center gap-3 ${className}`}>
        <FoldMark className="h-11 w-auto" />
        <span className="text-center leading-tight">
          <span className="block text-lg font-bold tracking-tight">KS</span>
          <span className="block text-[10px] tracking-[0.35em] text-white/55">DIGITAL STUDIO</span>
        </span>
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <FoldMark className="h-8 w-auto" />
      <span className="leading-tight">
        <span className="block text-lg font-bold tracking-tight">KS</span>
        <span className="block text-[10px] tracking-[0.3em] text-white/55">DIGITAL STUDIO</span>
      </span>
    </span>
  );
}

export default FoldMark;
