import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export default function Section({
  id, children, className,
}: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={cn("relative mx-auto w-full max-w-[1440px] px-5 py-24 md:px-10 md:py-32", className)}>
      {children}
    </section>
  );
}
