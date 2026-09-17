/**
 * Booking slot-engine regression tests.
 * Zero dependencies — uses Node's built-in test runner + type stripping.
 *   npm test
 */
import test from "node:test";
import assert from "node:assert/strict";
import { generateSlots, isSlotStillFree, weekdayOf, labelFor } from "../lib/booking/slots.ts";
import type { AvailabilityRule, BlockedTime, Booking, BookingSettings } from "../lib/db/entities.ts";

const settings: BookingSettings = {
  timezone: "Asia/Kolkata", utcOffsetMin: 330, minNoticeMin: 120, maxWindowDays: 30,
  bufferBeforeMin: 0, bufferAfterMin: 15, slotStepMin: 30,
  defaultLocation: "google_meet", defaultMeetingUrl: null,
};
const rules: AvailabilityRule[] = [
  { id: "sun", weekday: 0, startMin: 540, endMin: 1020, enabled: false },
  { id: "mon", weekday: 1, startMin: 540, endMin: 1020, enabled: true },
  { id: "sat", weekday: 6, startMin: 540, endMin: 1020, enabled: false },
];
const MONDAY = "2026-09-21";
const SUNDAY = "2026-09-20";
const NOW = new Date("2026-09-21T03:00:00.000Z"); // 08:30 IST
const base = { durationMin: 30, settings, rules, bookings: [] as Booking[], blocked: [] as BlockedTime[], now: NOW };

test("weekday helper resolves calendar weekday", () => {
  assert.equal(weekdayOf(MONDAY), 1);
  assert.equal(weekdayOf(SUNDAY), 0);
});

test("IST labels render correctly", () => {
  assert.equal(labelFor(Date.UTC(2026, 8, 21, 3, 30), 330), "9:00 AM");
});

test("working day returns slots inside working hours", () => {
  const s = generateSlots({ ...base, date: MONDAY });
  assert.ok(s.length > 0);
  assert.equal(s[0].label, "10:30 AM");               // 09:00 + 2h min-notice, on the 30-min grid
  assert.equal(s[s.length - 1].label, "4:30 PM");     // last 30-min slot ending by 17:00
  assert.equal(new Date(s[1].startISO).getTime() - new Date(s[0].startISO).getTime(), 30 * 60000);
});

test("non-working day returns no slots", () => {
  assert.equal(generateSlots({ ...base, date: SUNDAY }).length, 0);
});

test("existing booking removes its slot and the buffered one after it", () => {
  const all = generateSlots({ ...base, date: MONDAY });
  const taken = all[2];
  const bookings = [{ startsAt: taken.startISO, endsAt: taken.endISO, status: "confirmed" } as Booking];
  const after = generateSlots({ ...base, date: MONDAY, bookings });
  assert.ok(!after.some((s) => s.startISO === taken.startISO));
  assert.equal(after.length, all.length - 2); // slot itself + 15-min buffer overlap
});

test("double-booking guard rejects a taken slot", () => {
  const all = generateSlots({ ...base, date: MONDAY });
  const taken = all[2];
  const bookings = [{ startsAt: taken.startISO, endsAt: taken.endISO, status: "confirmed" } as Booking];
  assert.equal(isSlotStillFree(taken.startISO, 30, settings, rules, bookings, [], NOW), false);
  assert.equal(isSlotStillFree(all[0].startISO, 30, settings, rules, bookings, [], NOW), true);
});

test("blocked time removes overlapping slots", () => {
  const all = generateSlots({ ...base, date: MONDAY });
  const blocked = [{ id: "b", startsAt: all[0].startISO, endsAt: all[1].startISO } as BlockedTime];
  const after = generateSlots({ ...base, date: MONDAY, blocked });
  assert.ok(!after.some((s) => s.startISO === all[0].startISO));
});

test("minimum notice is enforced", () => {
  const now = new Date("2026-09-21T10:00:00.000Z"); // 15:30 IST
  const s = generateSlots({ ...base, date: MONDAY, now });
  assert.ok(s.every((x) => new Date(x.startISO).getTime() >= now.getTime() + 120 * 60000));
});
