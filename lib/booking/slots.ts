/**
 * Slot engine — pure functions, no I/O, so it can be unit-tested and reused
 * by both the public booking page and the admin calendar.
 *
 * Timezone: handled as a fixed UTC offset (Asia/Kolkata = +330 min, no DST).
 * This is exact for IST; a DST-aware zone would need a tz database.
 */
import type { AvailabilityRule, BlockedTime, Booking, BookingSettings } from "../db/entities";

export interface SlotQuery {
  date: string;                 // "YYYY-MM-DD" in the business timezone
  durationMin: number;
  settings: BookingSettings;
  rules: AvailabilityRule[];
  bookings: Booking[];          // active bookings that could overlap this day
  blocked: BlockedTime[];
  now?: Date;
}

export interface Slot {
  startISO: string;
  endISO: string;
  label: string;                // "10:30 AM" in business timezone
}

const MIN = 60_000;

/** Weekday (0=Sun..6=Sat) of a calendar date string, independent of server tz. */
export function weekdayOf(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** Convert a local wall-clock time on `date` to a UTC instant (ms). */
export function localToUtcMs(date: string, minutesFromMidnight: number, utcOffsetMin: number): number {
  const [y, m, d] = date.split("-").map(Number);
  return Date.UTC(y, m - 1, d, 0, 0, 0, 0) + minutesFromMidnight * MIN - utcOffsetMin * MIN;
}

/** Format a UTC instant as a business-timezone clock label. */
export function labelFor(utcMs: number, utcOffsetMin: number): string {
  const local = new Date(utcMs + utcOffsetMin * MIN);
  let h = local.getUTCHours();
  const mm = String(local.getUTCMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${mm} ${ampm}`;
}

/** True when [aStart,aEnd) overlaps [bStart,bEnd). */
export function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Compute bookable slots for one day.
 * Applies: availability rules, min notice, max booking window,
 * existing bookings (expanded by buffers) and blocked times.
 */
export function generateSlots(q: SlotQuery): Slot[] {
  const { date, durationMin, settings, rules, bookings, blocked } = q;
  const now = (q.now ?? new Date()).getTime();
  const off = settings.utcOffsetMin;

  const earliest = now + settings.minNoticeMin * MIN;
  const latest = now + settings.maxWindowDays * 24 * 60 * MIN;

  const wd = weekdayOf(date);
  const dayRules = rules.filter((r) => r.enabled && r.weekday === wd);
  if (dayRules.length === 0) return [];

  const step = Math.max(5, settings.slotStepMin || durationMin);
  const out: Slot[] = [];

  for (const rule of dayRules) {
    for (let m = rule.startMin; m + durationMin <= rule.endMin; m += step) {
      const start = localToUtcMs(date, m, off);
      const end = start + durationMin * MIN;

      if (start < earliest) continue;
      if (start > latest) continue;

      const clash = bookings.some((b) => {
        if (b.status !== "confirmed" && b.status !== "rescheduled") return false;
        const bs = new Date(b.startsAt).getTime() - settings.bufferBeforeMin * MIN;
        const be = new Date(b.endsAt).getTime() + settings.bufferAfterMin * MIN;
        return overlaps(start, end, bs, be);
      });
      if (clash) continue;

      const isBlocked = blocked.some((x) =>
        overlaps(start, end, new Date(x.startsAt).getTime(), new Date(x.endsAt).getTime()));
      if (isBlocked) continue;

      out.push({ startISO: new Date(start).toISOString(), endISO: new Date(end).toISOString(), label: labelFor(start, off) });
    }
  }
  return out.sort((a, b) => (a.startISO < b.startISO ? -1 : 1));
}

/** Server-side re-validation before writing a booking (defence in depth). */
export function isSlotStillFree(
  startISO: string, durationMin: number,
  settings: BookingSettings, rules: AvailabilityRule[],
  bookings: Booking[], blocked: BlockedTime[], now = new Date(),
): boolean {
  const start = new Date(startISO).getTime();
  if (Number.isNaN(start)) return false;
  const localDate = new Date(start + settings.utcOffsetMin * MIN).toISOString().slice(0, 10);
  return generateSlots({ date: localDate, durationMin, settings, rules, bookings, blocked, now })
    .some((s) => new Date(s.startISO).getTime() === start);
}

export function publicCode(): string {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += a[Math.floor(Math.random() * a.length)];
  return `KSD-${s}`;
}
