import { NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/crm-auth";
import { listLeads, upsertLead, getLead, deleteLead } from "@/lib/crm-db";
import { cookies } from "next/headers";

export const runtime = "nodejs";

async function guard() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySession(token);
}

export async function GET() {
  if (!(await guard())) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, leads: await listLeads() });
}

export async function PATCH(req: Request) {
  if (!(await guard())) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await req.json();
  const existing = await getLead(body.id);
  if (!existing) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  const updated = { ...existing, ...body };
  await upsertLead(updated);
  return NextResponse.json({ ok: true, lead: updated });
}

export async function DELETE(req: Request) {
  if (!(await guard())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await req.json();
  await deleteLead(id);
  return NextResponse.json({ ok: true });
}
