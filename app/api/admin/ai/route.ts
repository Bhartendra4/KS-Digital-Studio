import { NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/crm-auth";
import { cookies } from "next/headers";
import { getLead, listLeads, addMessage, addProposal, uid, nowISO, followupsDue } from "@/lib/crm-db";
import { generateOutreach, generateProposal, assistantReply, aiEnabled } from "@/lib/crm-ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifySession(token))) return NextResponse.json({ ok: false }, { status: 401 });

  const { action, leadId, kind, prompt } = await req.json();

  if (action === "outreach") {
    const lead = getLead(leadId);
    if (!lead) return NextResponse.json({ ok: false, error: "Lead not found" }, { status: 404 });
    const { subject, body } = await generateOutreach(lead, kind || "cold");
    const msg = addMessage({ id: uid("msg"), leadId, channel: "email", kind: kind || "cold", subject, body, status: "draft", createdAt: nowISO() });
    return NextResponse.json({ ok: true, message: msg, aiEnabled: aiEnabled() });
  }

  if (action === "proposal") {
    const lead = getLead(leadId);
    if (!lead) return NextResponse.json({ ok: false, error: "Lead not found" }, { status: 404 });
    const p = await generateProposal(lead, { requirements: prompt });
    const saved = addProposal({ id: uid("prop"), leadId, ...p, createdAt: nowISO() });
    return NextResponse.json({ ok: true, proposal: saved, aiEnabled: aiEnabled() });
  }

  if (action === "assistant") {
    const leads = listLeads();
    const due = followupsDue();
    const ctx = JSON.stringify({
      totalLeads: leads.length,
      hot: leads.filter((l) => l.tier === "hot").map((l) => ({ business: l.businessName, score: l.leadScore, status: l.status })),
      pipeline: leads.filter((l) => ["qualified", "proposal_sent"].includes(l.status)).map((l) => ({ business: l.businessName, value: l.estimatedValue })),
      followUpsDue: due.length,
      leads: leads.slice(0, 25).map((l) => ({ business: l.businessName, tier: l.tier, score: l.leadScore, status: l.status, value: l.estimatedValue, service: l.servicesNeeded })),
    });
    const reply = await assistantReply(prompt || "", ctx);
    if (reply) return NextResponse.json({ ok: true, reply, aiEnabled: true });
    // deterministic fallback answers
    return NextResponse.json({ ok: true, aiEnabled: false, reply: localAssistant(prompt || "", leads, due.length) });
  }

  return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
}

function localAssistant(q: string, leads: any[], due: number): string {
  const s = q.toLowerCase();
  const hot = leads.filter((l) => l.tier === "hot");
  const pipeline = leads.filter((l) => ["qualified", "proposal_sent"].includes(l.status));
  const val = leads.reduce((a, l) => a + (l.estimatedValue || 0), 0);
  if (s.includes("hot")) return hot.length ? `You have ${hot.length} hot lead(s): ` + hot.map((l) => `${l.businessName} (${l.leadScore})`).join(", ") : "No hot leads yet.";
  if (s.includes("follow")) return `${due} follow-up(s) due today.`;
  if (s.includes("pipeline")) return `Pipeline: ${pipeline.length} active deal(s), estimated ₹${val.toLocaleString("en-IN")} total across all leads.`;
  if (s.includes("convert") || s.includes("best")) {
    const top = [...leads].sort((a, b) => b.leadScore - a.leadScore).slice(0, 3);
    return "Most likely to convert: " + (top.map((l) => `${l.businessName} (${l.leadScore})`).join(", ") || "no leads yet");
  }
  if (s.includes("report")) return `Sales report — Total: ${leads.length} leads, Hot: ${hot.length}, In pipeline: ${pipeline.length}, Follow-ups due: ${due}, Estimated value: ₹${val.toLocaleString("en-IN")}.`;
  return `I can help with: hot leads, follow-ups due, pipeline, best leads to convert, and today's report. (Add ANTHROPIC_API_KEY or OPENAI_API_KEY for full AI drafting.) You have ${leads.length} leads, ${hot.length} hot, ${due} follow-ups due.`;
}
