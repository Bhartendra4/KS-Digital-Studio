import { NextResponse } from "next/server";
import { slotsForDate } from "@/lib/booking/service";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "";
  const date = searchParams.get("date") || "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ ok: false, error: "date must be YYYY-MM-DD" }, { status: 400 });
  }
  try {
    const { slots, type: mt } = await slotsForDate(type, date);
    if (!mt) return NextResponse.json({ ok: false, error: "Unknown meeting type" }, { status: 404 });
    return NextResponse.json({ ok: true, date, durationMin: mt.durationMin, slots });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
