import "server-only";
import type { Booking } from "../db/entities";
import { site } from "../site";

const FROM = process.env.LEAD_NOTIFY_FROM || "KS Digital Studio <onboarding@resend.dev>";
const ADMIN_TO = process.env.LEAD_NOTIFY_EMAIL || "info@ksdigitalstudio.in";

export function formatWhen(b: Booking): string {
  const d = new Date(b.startsAt);
  // render in the business timezone using a fixed offset (IST)
  const local = new Date(d.getTime() + 330 * 60000);
  const date = local.toUTCString().slice(0, 16); // "Mon, 21 Sep 2026"
  let h = local.getUTCHours();
  const mm = String(local.getUTCMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${date} at ${h}:${mm} ${ampm} (${b.timezone})`;
}

async function send(to: string, subject: string, text: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[EMAIL:not-sent no RESEND_API_KEY] to=${to} subject=${subject}\n${text}`);
    return false;
  }
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({ from: FROM, to: [to], subject, text }),
    });
    return r.ok;
  } catch { return false; }
}

export function clientConfirmationText(b: Booking, manageUrl: string): string {
  return `Hi ${b.name},

Your consultation with KS Digital Studio is confirmed.

Booking reference: ${b.publicCode}
Meeting: ${b.meetingType} (${b.durationMin} minutes)
When: ${formatWhen(b)}
Where: ${b.meetingUrl || b.locationType.replace(/_/g, " ")}

Need to change it? Reschedule or cancel here:
${manageUrl}

If you have anything to share before the call (brand, examples, references), just reply to this email.

Regards,
KS Digital Studio
${site.email} · ${site.phone}
${site.domain}`;
}

export async function sendBookingEmails(b: Booking, manageUrl: string): Promise<{ client: boolean; admin: boolean }> {
  const client = await send(b.email, `Consultation confirmed — ${formatWhen(b)}`, clientConfirmationText(b, manageUrl));
  const admin = await send(
    ADMIN_TO,
    `New booking: ${b.name} — ${b.meetingType}`,
    `New consultation booked.

Ref: ${b.publicCode}
When: ${formatWhen(b)}
Type: ${b.meetingType} (${b.durationMin} min)

Name: ${b.name}
Email: ${b.email}
Phone: ${b.phone || "-"}
Company: ${b.company || "-"}
Website: ${b.website || "-"}

Requirement:
${b.requirement || "-"}

Manage: ${manageUrl}`,
  );
  return { client, admin };
}

export async function sendCancellationEmails(b: Booking): Promise<void> {
  await send(b.email, `Consultation cancelled — ${b.publicCode}`,
    `Hi ${b.name},\n\nYour consultation on ${formatWhen(b)} has been cancelled.\n\nYou can book a new time any time at ${site.domain}/book\n\nRegards,\nKS Digital Studio`);
  await send(ADMIN_TO, `Booking cancelled: ${b.name} (${b.publicCode})`,
    `${b.name} cancelled the ${b.meetingType} on ${formatWhen(b)}.`);
}
