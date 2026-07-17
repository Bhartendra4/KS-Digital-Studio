import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-5 text-center">
      <div className="aurora" />
      <div className="pointer-events-none absolute inset-0 bg-grid-lines bg-[size:40px_40px] opacity-[0.12]" />
      <div className="relative">
        <h1 className="font-display text-[26vw] font-bold leading-none text-gradient md:text-[16rem] animate-float">404</h1>
        <p className="mt-2 font-display text-xl text-white/80">This page drifted into deep space.</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-white/50">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/">Back home</Button>
          <Button href="/contact" variant="ghost">Contact us</Button>
        </div>
      </div>
    </section>
  );
}
