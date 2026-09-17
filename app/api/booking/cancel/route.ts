import { NextResponse } from "next/server";
import { cancelBooking } from "@/lib/booking/service";
import { sendCancellationEmails } from "@/lib/booking/emails";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const { token } = await req.json().catch(() => ({ token: "" }));
  if (!token) return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });
  const b = await cancelBooking(token);
  if (!b) return NextResponse.json({ ok: false, error: "Booking not found" }, { status: 404 });
  try { await sendCancellationEmails(b); } catch {}
  return NextResponse.json({ ok: true, status: b.status });
}
