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
              Ready to build something premium?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              Tell us about your project — we&apos;ll reply within 24 hours with next steps.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button href="/contact" icon={<ArrowRight className="h-4 w-4" />}>Start Your Project</Button>
              <Button href={site.calendly} variant="ghost" icon={<CalendarCheck className="h-4 w-4" />}>Book Free Consultation</Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
