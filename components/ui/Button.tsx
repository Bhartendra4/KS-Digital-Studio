"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Magnetic from "@/components/fx/Magnetic";
import type { ReactNode } from "react";

export default function Button({
  children, href = "#", variant = "primary", className, icon,
}: {
  children: ReactNode; href?: string; variant?: "primary" | "ghost"; className?: string; icon?: ReactNode;
}) {
  const external = /^https?:\/\//.test(href);
  return (
    <Magnetic>
      <Link
        href={href}
        data-cursor
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={cn(
          "btn-magnetic group relative",
          variant === "primary" ? "btn-primary" : "btn-ghost",
          className
        )}
      >
        <span className="relative z-10 flex items-center gap-2">{children}{icon}</span>
        <span className="absolute inset-0 -z-0 translate-y-full bg-white/10 transition-transform duration-500 group-hover:translate-y-0" />
      </Link>
    </Magnetic>
  );
}
