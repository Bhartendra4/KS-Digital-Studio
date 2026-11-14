import Reveal from "@/components/fx/Reveal";
import Button from "@/components/ui/Button";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { site } from "@/lib/site";

export default function CTA() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
      <Reveal>
        <div className="card-border relative overflow-hidden p-10 text-center md:p-16">
          <div className="aurora !opacity-40" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-5xl text-gradient">
              Want to see your website before you pay?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              Tell me about your business. I&apos;ll reply within 24 hours, and I can build a free demo so you can judge the work yourself.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button href="/contact" icon={<ArrowRight className="h-4 w-4" />}>Get a free demo</Button>
              <Button href={site.bookingUrl} variant="ghost" icon={<CalendarCheck className="h-4 w-4" />}>Book a call</Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
