import { NextResponse } from "next/server";
import { createBooking, SlotTakenError, InvalidSlotError } from "@/lib/booking/service";
import { sendBookingEmails } from "@/lib/booking/emails";
import { upsertLead, getLead, logActivity, uid, nowISO } from "@/lib/crm-db";
import { scoreLead } from "@/lib/crm-scoring";
import { site } from "@/lib/site";
import type { Lead } from "@/lib/crm-types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Bad JSON" }, { status: 400 }); }

  if (body.company_website) return NextResponse.json({ ok: true }); // honeypot
  const required = ["meetingType", "startISO", "name", "email"];
  for (const f of required) {
    if (!body[f] || String(body[f]).trim().length < 2) {
      return NextResponse.json({ ok: false, error: `Missing field: ${f}` }, { status: 400 });
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  try {
    const booking = await createBooking({
      meetingType: body.meetingType, startISO: body.startISO,
      name: body.name, email: body.email, phone: body.phone,
      company: body.company, website: body.website,
      requirement: body.requirement, leadId: body.leadId ?? null,
    });

    // Link the booking into the CRM pipeline (MEETING BOOKED)
    try {
      const existing = body.leadId ? await getLead(body.leadId) : undefined;
      if (existing) {
        await upsertLead({ ...existing, status: "qualified", lastContact: nowISO() });
        await logActivity(existing.id, "meeting", `Consultation booked (${booking.publicCode}) — ${booking.meetingType}`, { bookingId: booking.id });
      } else {
        const scored = scoreLead({
          hasWebsite: Boolean(body.website), website: body.website,
          servicesNeeded: [], email: body.email, phone: body.phone, timeline: "ASAP",
        });
        const lead: Lead = {
          id: uid("lead"),
          businessName: body.company || body.name,
          website: body.website, contactName: body.name, email: body.email, phone: body.phone,
          leadScore: scored.leadScore, tier: scored.tier, scoreReasons: scored.reasons,
          status: "qualified", source: "booking",
          notes: body.requirement, estimatedValue: scored.estimatedValue,
          lastContact: nowISO(), nextFollowUp: null,
          createdAt: nowISO(), updatedAt: nowISO(),
        };
        await upsertLead(lead);
        await logActivity(lead.id, "meeting", `Consultation booked (${booking.publicCode}) — ${booking.meetingType}`, { bookingId: booking.id });
      }
    } catch { /* CRM linking must never break a confirmed booking */ }

    const manageUrl = `${site.domain}/booking/${booking.manageToken}`;
    const mail = await sendBookingEmails(booking, manageUrl);

    return NextResponse.json({
      ok: true,
      booking: {
        publicCode: booking.publicCode, startsAt: booking.startsAt, endsAt: booking.endsAt,
        meetingType: booking.meetingType, durationMin: booking.durationMin,
        timezone: booking.timezone, locationType: booking.locationType,
        meetingUrl: booking.meetingUrl, manageToken: booking.manageToken,
      },
      emailed: mail,
    });
  } catch (e) {
    if (e instanceof SlotTakenError) {
      return NextResponse.json({ ok: false, error: "That time was just booked. Please choose another slot.", code: "SLOT_TAKEN" }, { status: 409 });
    }
    if (e instanceof InvalidSlotError) {
      return NextResponse.json({ ok: false, error: "Invalid meeting type or slot.", code: "INVALID_SLOT" }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: "Could not create booking." }, { status: 500 });
  }
}
