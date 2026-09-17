# Phase 3 — Own Booking System (Calendly removed)

Calendly is **gone**. No `calendly.com` reference remains in the codebase.
All "Book a Consultation" CTAs now point at our own `/book` route.

## Flow
```
/book  →  meeting type  →  date  →  slot  →  details  →  confirmed
              ↓ (server re-validates the slot before writing)
        booking row + CRM lead (status: qualified, source: booking)
              ↓
        confirmation email to client + notification to info@ksdigitalstudio.in
              ↓
        /booking/<manage_token>  →  cancel (slot released instantly)
```

## Double-booking protection (two independent layers)
1. **Application** — before writing, the server re-generates that day's slots and
   confirms the requested start is still offered (`isSlotStillFree`).
2. **Database** — a partial unique index guarantees it even under a race:
   ```sql
   create unique index bookings_no_double_book
     on bookings (starts_at) where status in ('confirmed','rescheduled');
   ```
   A duplicate insert surfaces as `SLOT_TAKEN` → the UI reloads slots and asks the
   client to pick again (HTTP 409).

## Availability
Configured in `booking_settings` + `availability_rules`. Defaults (seeded):
Mon–Fri 09:00–17:00 **Asia/Kolkata**, weekends off, 30-min grid, 2-hour minimum
notice, 30-day booking window, 15-minute buffer after each meeting.
Admin API: `GET/PUT /api/admin/availability` (session-protected).

> Timezone is handled as a fixed UTC offset (+330). Exact for IST, which has no DST.

## Meeting types (admin can enable/disable)
`discovery-15` (15m) · `consultation-30` (30m) · `project-60` (60m)

## Endpoints
| Route | Purpose |
|---|---|
| `GET /api/booking/types` | enabled meeting types + timezone |
| `GET /api/booking/slots?type=&date=` | bookable slots for a day |
| `POST /api/booking` | create booking (validated, 409 on race) |
| `POST /api/booking/cancel` | cancel via manage token |
| `GET/PUT /api/admin/availability` | rules, settings, meeting types, blocks |

## Lead context
`/book?lead=<id>` — the chatbot passes the lead id it just created, so a booking is
attached to the existing lead instead of creating a duplicate. Bookings with no lead
create one (`source: "booking"`, status `qualified`).

## Meeting location
`location_type` supports `google_meet | zoom | phone | whatsapp | in_person | custom`
with an optional `meeting_url`. Automatic Google Meet link creation is **not**
implemented yet — set a static meeting URL per meeting type for now.

## Tests
`npm test` — 8 passing tests covering working hours, closed days, buffers,
blocked times, minimum notice and the double-booking guard.
