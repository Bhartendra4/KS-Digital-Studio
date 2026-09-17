import { NextResponse } from "next/server";
import { getRepo } from "@/lib/db";
export const runtime = "nodejs";
export async function GET() {
  try {
    const types = await getRepo().listMeetingTypes(true);
    const settings = await getRepo().getSettings();
    return NextResponse.json({ ok: true, types, timezone: settings.timezone, maxWindowDays: settings.maxWindowDays });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
