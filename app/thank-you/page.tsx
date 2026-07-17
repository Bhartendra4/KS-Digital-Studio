import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { pageMeta } from "@/lib/seo";

export const metadata = { ...pageMeta("Thank You", "Thanks for reaching out to KS Digital Studio.", "/thank-you"), robots: { index: false } };

export default function ThankYouPage() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-5 text-center">
      <div className="aurora" />
      <div className="relative">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-accent-electric to-accent-purple animate-float">
          <CheckCircle2 className="h-10 w-10 text-white" />
        </div>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-gradient md:text-6xl">Thank you!</h1>
        <p className="mx-auto mt-4 max-w-md text-white/60">
          Your message is on its way. We&apos;ll get back to you within 24 hours. Meanwhile, explore our work.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/portfolio">View our work</Button>
          <Button href="/" variant="ghost">Back home</Button>
        </div>
      </div>
    </section>
  );
}
