import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/crm-auth";
import { getRepo, driverName } from "@/lib/db";
import { aiEnabled } from "@/lib/crm-ai";

export const runtime = "nodejs";

export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifySession(token))) return NextResponse.json({ ok: false }, { status: 401 });

  const repo = getRepo();
  const health = await repo.health();

  let leads = 0, issues = 0, runs = 0;
  try { leads = (await repo.listLeads()).length; } catch {}
  try { issues = (await repo.listIssues()).length; } catch {}
  try { runs = (await repo.listAgentRuns(10)).length; } catch {}

  return NextResponse.json({
    ok: true,
    database: { ...health, active: driverName() },
    ai: { enabled: aiEnabled(), provider: process.env.ANTHROPIC_API_KEY ? "anthropic" : process.env.OPENAI_API_KEY ? "openai" : "template-fallback" },
    counts: { leads, issues, agentRuns: runs },
    env: {
      sessionSecretSet: Boolean(process.env.SESSION_SECRET),
      adminConfigured: Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD),
      supabaseConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
      booking: "own-system (/book)",
    },
    checkedAt: new Date().toISOString(),
  });
}
