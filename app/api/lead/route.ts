import { NextResponse } from "next/server";
import { upsertLead, uid, nowISO, addFollowUps, logActivity } from "@/lib/crm-db";
import { scoreLead, heuristicAudit } from "@/lib/crm-scoring";
import { notifyNewLead } from "@/lib/crm-notify";
import type { Lead, FollowUp } from "@/lib/crm-types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    // basic anti-spam: honeypot + minimal validation
    if (b.company_website) return NextResponse.json({ ok: true }); // bot trap
    if (!b.businessName && !b.name && !b.email) {
      return NextResponse.json({ ok: false, error: "Missing details" }, { status: 400 });
    }
    const servicesNeeded = Array.isArray(b.servicesNeeded)
      ? b.servicesNeeded : b.service ? [b.service] : [];
    const scoreInput = {
      hasWebsite: b.hasWebsite ?? Boolean(b.website),
      website: b.website,
      websiteIssues: b.websiteIssues || [],
      industry: b.industry,
      budget: b.budget,
      timeline: b.timeline,
      servicesNeeded,
      email: b.email,
      phone: b.phone,
    };
    const { leadScore, tier, reasons, estimatedValue } = scoreLead(scoreInput);

    const lead: Lead = {
      id: uid("lead"),
      businessName: b.businessName || b.name || "Website enquiry",
      website: b.website,
      industry: b.industry,
      location: b.location,
      contactName: b.contactName || b.name,
      email: b.email,
      phone: b.phone,
      leadScore, tier, scoreReasons: reasons,
      status: "new",
      source: b.source || "website",
      notes: b.message || b.projectDescription || b.notes,
      servicesNeeded,
      budget: b.budget,
      timeline: b.timeline,
      estimatedValue,
      audit: heuristicAudit(scoreInput),
      lastContact: null,
      nextFollowUp: new Date(Date.now() + 3 * 864e5).toISOString(),
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    await upsertLead(lead);

    // schedule a Day 0/3/7/14 follow-up sequence (pending; never auto-sent)
    const seq: FollowUp[] = [0, 3, 7, 14].map((d, i) => ({
      id: uid("fu"), leadId: lead.id,
      dueDate: new Date(Date.now() + d * 864e5).toISOString(),
      step: i, channel: "email", status: "pending", createdAt: nowISO(),
    }));
    await addFollowUps(seq);
    await logActivity(lead.id, "created", `Lead captured from ${lead.source} — ${tier.toUpperCase()} (${leadScore}/100)`);

    await notifyNewLead(lead);
    return NextResponse.json({ ok: true, leadId: lead.id, tier, leadScore });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
