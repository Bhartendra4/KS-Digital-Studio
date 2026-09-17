import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/crm-auth";
import { getRepo } from "@/lib/db";

export const runtime = "nodejs";
async function guard() {
  return verifySession((await cookies()).get(SESSION_COOKIE)?.value);
}

export async function GET() {
  if (!(await guard())) return NextResponse.json({ ok: false }, { status: 401 });
  const repo = getRepo();
  const [settings, rules, types, blocked] = await Promise.all([
    repo.getSettings(), repo.listAvailability(), repo.listMeetingTypes(false), repo.listBlockedTimes(),
  ]);
  return NextResponse.json({ ok: true, settings, rules, types, blocked });
}

export async function PUT(req: Request) {
  if (!(await guard())) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const repo = getRepo();
  if (body.settings) await repo.saveSettings(body.settings);
  if (Array.isArray(body.rules)) await repo.saveAvailability(body.rules);
  if (Array.isArray(body.types)) for (const t of body.types) await repo.saveMeetingType(t);
  return NextResponse.json({ ok: true });
}
