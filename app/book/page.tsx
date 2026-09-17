import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/ui/PageHero";
import BookingFlow from "@/components/booking/BookingFlow";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
  "Book a Consultation",
  "Choose a time that suits you and book a free consultation with KS Digital Studio.",
  "/book",
);

export default function BookPage() {
  return (
    <>
      <PageHero
        eyebrow="Book a consultation"
        title="Let's talk about your project."
        subtitle="Pick a meeting type and a time that suits you. You'll get an instant confirmation by email."
      />
      <section className="mx-auto max-w-[1440px] px-5 pb-20 md:px-10">
        <Suspense fallback={<p className="text-sm text-white/40">Loading availability…</p>}>
          <BookingFlow />
        </Suspense>
      </section>
    </>
  );
}
