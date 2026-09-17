import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/crm-auth";
import { getRepo, driverName } from "@/lib/db";
import { jsonRepo } from "@/lib/db/json-repo";

export const runtime = "nodejs";

/**
 * One-shot import of the local JSON CRM into the active persistent database.
 * Idempotent: leads are upserted by id, so re-running will not duplicate.
 */
export async function POST() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifySession(token))) return NextResponse.json({ ok: false }, { status: 401 });

  if (driverName() !== "supabase") {
    return NextResponse.json({
      ok: false,
      error: "Active driver is 'json'. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first, then re-run.",
    }, { status: 400 });
  }

  const target = getRepo();
  const result = { leads: 0, messages: 0, followups: 0, errors: [] as string[] };

  try {
    const leads = await jsonRepo.listLeads();
    for (const l of leads) {
      try { await target.upsertLead(l); result.leads++; }
      catch (e) { result.errors.push(`lead ${l.id}: ${(e as Error).message}`); }
    }
    for (const l of leads) {
      try {
        const msgs = await jsonRepo.messagesFor(l.id);
        for (const m of msgs) { await target.addMessage(m); result.messages++; }
      } catch (e) { result.errors.push(`messages ${l.id}: ${(e as Error).message}`); }
    }
    try {
      const due = await jsonRepo.followupsDue();
      if (due.length) { await target.addFollowUps(due); result.followups = due.length; }
    } catch (e) { result.errors.push(`followups: ${(e as Error).message}`); }
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message, result }, { status: 500 });
  }

  return NextResponse.json({ ok: true, migratedTo: "supabase", result });
}
