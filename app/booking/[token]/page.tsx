import { notFound } from "next/navigation";
import { getRepo } from "@/lib/db";
import PageHero from "@/components/ui/PageHero";
import ManageBooking from "@/components/booking/ManageBooking";

export const metadata = { title: "Manage your booking", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ManageBookingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const booking = await getRepo().getBookingByToken(token);
  if (!booking) notFound();

  return (
    <>
      <PageHero eyebrow="Your booking" title="Manage your consultation"
        subtitle={`Reference ${booking.publicCode}`} />
      <section className="mx-auto max-w-2xl px-5 pb-20 md:px-10">
        <ManageBooking
          token={token}
          booking={{
            publicCode: booking.publicCode,
            meetingType: booking.meetingType,
            durationMin: booking.durationMin,
            startsAt: booking.startsAt,
            timezone: booking.timezone,
            status: booking.status,
            meetingUrl: booking.meetingUrl ?? null,
            locationType: booking.locationType,
            name: booking.name,
          }}
        />
      </section>
    </>
  );
}
