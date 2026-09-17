import "server-only";
import crypto from "crypto";
import { getRepo, uid, nowISO } from "../db";
import type { Booking, MeetingType } from "../db/entities";
import { generateSlots, isSlotStillFree, publicCode, type Slot } from "./slots";

const MIN = 60_000;

/** Window of existing bookings/blocks that could affect a given day. */
async function contextFor(dateISO: string) {
  const repo = getRepo();
  const from = new Date(new Date(dateISO).getTime() - 2 * 24 * 60 * MIN).toISOString();
  const to = new Date(new Date(dateISO).getTime() + 2 * 24 * 60 * MIN).toISOString();
  const [settings, rules, bookings, blocked] = await Promise.all([
    repo.getSettings(), repo.listAvailability(), repo.listBookings(from, to), repo.listBlockedTimes(from, to),
  ]);
  return { settings, rules, bookings, blocked };
}

export async function getMeetingType(slug: string): Promise<MeetingType | undefined> {
  const types = await getRepo().listMeetingTypes(true);
  return types.find((t) => t.slug === slug);
}

export async function slotsForDate(slug: string, date: string): Promise<{ slots: Slot[]; type?: MeetingType }> {
  const type = await getMeetingType(slug);
  if (!type) return { slots: [] };
  const anchor = `${date}T00:00:00.000Z`;
  const { settings, rules, bookings, blocked } = await contextFor(anchor);
  return { slots: generateSlots({ date, durationMin: type.durationMin, settings, rules, bookings, blocked }), type };
}

export interface BookingInput {
  meetingType: string; startISO: string;
  name: string; email: string; phone?: string; company?: string;
  website?: string; requirement?: string; leadId?: string | null;
}

export class SlotTakenError extends Error { constructor() { super("SLOT_TAKEN"); } }
export class InvalidSlotError extends Error { constructor() { super("INVALID_SLOT"); } }

/**
 * Creates a booking with defence-in-depth against double booking:
 *  1. re-generate slots server-side and confirm the requested start is still offered
 *  2. rely on the DB unique index (Supabase) / in-process guard (JSON) on insert
 */
export async function createBooking(input: BookingInput): Promise<Booking> {
  const repo = getRepo();
  const type = await getMeetingType(input.meetingType);
  if (!type) throw new InvalidSlotError();

  const { settings, rules, bookings, blocked } = await contextFor(input.startISO);
  if (!isSlotStillFree(input.startISO, type.durationMin, settings, rules, bookings, blocked)) {
    throw new SlotTakenError();
  }

  const start = new Date(input.startISO);
  const booking: Booking = {
    id: uid("bk"),
    publicCode: publicCode(),
    manageToken: crypto.randomBytes(24).toString("hex"),
    meetingType: type.slug,
    durationMin: type.durationMin,
    leadId: input.leadId ?? null,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim(),
    company: input.company?.trim(),
    website: input.website?.trim(),
    requirement: input.requirement?.trim(),
    startsAt: start.toISOString(),
    endsAt: new Date(start.getTime() + type.durationMin * MIN).toISOString(),
    timezone: settings.timezone,
    locationType: type.locationType || settings.defaultLocation,
    meetingUrl: type.meetingUrl || settings.defaultMeetingUrl || null,
    status: "confirmed",
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };

  try {
    await repo.createBooking(booking);
  } catch (e) {
    if ((e as Error).message === "SLOT_TAKEN") throw new SlotTakenError();
    throw e;
  }
  return booking;
}

export async function cancelBooking(token: string): Promise<Booking | undefined> {
  const repo = getRepo();
  const b = await repo.getBookingByToken(token);
  if (!b) return undefined;
  return repo.updateBooking(b.id, { status: "cancelled" });
}
