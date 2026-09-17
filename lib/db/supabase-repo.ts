import "server-only";
import type { Lead, Message, Proposal, Project, FollowUp } from "../crm-types";
import type { AgentRun, Issue, WebsiteCheck, LeadActivity, Approval, DriverHealth,
  MeetingType, AvailabilityRule, BlockedTime, Booking, BookingSettings } from "./entities";
import type { Repo } from "./repo";

/**
 * Production adapter: Supabase via its PostgREST HTTP API using plain fetch.
 * No npm client is required (keeps the dependency tree native-build-free) and
 * HTTP avoids serverless connection-pool exhaustion.
 * Uses the SERVICE ROLE key — server-side only. RLS blocks the anon key.
 */
const URL_BASE = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export function supabaseConfigured(): boolean {
  return Boolean(URL_BASE && KEY);
}

function headers(extra: Record<string, string> = {}): Record<string, string> {
  return {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function rq<T>(table: string, init: RequestInit & { query?: string } = {}): Promise<T> {
  const { query = "", ...rest } = init;
  const res = await fetch(`${URL_BASE}/rest/v1/${table}${query}`, {
    ...rest,
    headers: headers((rest.headers as Record<string, string>) || {}),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Supabase ${table} ${res.status}: ${text.slice(0, 300)}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  const body = await res.text();
  return (body ? JSON.parse(body) : undefined) as T;
}

const select = <T>(table: string, query: string) => rq<T>(table, { method: "GET", query });
const insert = <T>(table: string, row: unknown) =>
  rq<T>(table, { method: "POST", body: JSON.stringify(row), headers: { Prefer: "return=representation" } });
const upsertRow = <T>(table: string, row: unknown) =>
  rq<T>(table, {
    method: "POST", body: JSON.stringify(row),
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
  });
const patch = <T>(table: string, query: string, row: unknown) =>
  rq<T>(table, { method: "PATCH", query, body: JSON.stringify(row), headers: { Prefer: "return=representation" } });
const remove = (table: string, query: string) => rq<void>(table, { method: "DELETE", query });

// ---------- row <-> entity mapping ----------
const iso = (v: unknown) => (v ? new Date(v as string).toISOString() : undefined);

function rowToLead(r: any): Lead {
  return {
    id: r.id,
    businessName: r.business_name,
    website: r.website ?? undefined,
    industry: r.industry ?? undefined,
    location: r.location ?? undefined,
    contactName: r.contact_name ?? undefined,
    email: r.email ?? undefined,
    phone: r.phone ?? undefined,
    websiteScore: r.website_score ?? undefined,
    leadScore: r.lead_score ?? 0,
    tier: r.tier,
    scoreReasons: r.score_reasons ?? [],
    status: r.status,
    source: r.source,
    notes: r.notes ?? undefined,
    servicesNeeded: r.services_needed ?? [],
    budget: r.budget ?? undefined,
    timeline: r.timeline ?? undefined,
    estimatedValue: r.estimated_value != null ? Number(r.estimated_value) : undefined,
    audit: r.audit ?? undefined,
    lastContact: r.last_contact ?? null,
    nextFollowUp: r.next_follow_up ?? null,
    createdAt: iso(r.created_at) || new Date().toISOString(),
    updatedAt: iso(r.updated_at) || new Date().toISOString(),
  };
}
function leadToRow(l: Lead) {
  return {
    id: l.id,
    business_name: l.businessName,
    website: l.website ?? null,
    industry: l.industry ?? null,
    location: l.location ?? null,
    contact_name: l.contactName ?? null,
    email: l.email ?? null,
    phone: l.phone ?? null,
    website_score: l.websiteScore ?? null,
    lead_score: l.leadScore ?? 0,
    tier: l.tier,
    status: l.status,
    source: l.source,
    budget: l.budget ?? null,
    timeline: l.timeline ?? null,
    estimated_value: l.estimatedValue ?? null,
    notes: l.notes ?? null,
    score_reasons: l.scoreReasons ?? [],
    services_needed: l.servicesNeeded ?? [],
    audit: l.audit ?? null,
    last_contact: l.lastContact ?? null,
    next_follow_up: l.nextFollowUp ?? null,
    created_at: l.createdAt,
    updated_at: new Date().toISOString(),
  };
}

const msgRow = (m: Message) => ({
  id: m.id, lead_id: m.leadId, channel: m.channel, kind: m.kind,
  subject: m.subject ?? null, body: m.body, status: m.status, created_at: m.createdAt,
});
const rowToMsg = (r: any): Message => ({
  id: r.id, leadId: r.lead_id, channel: r.channel, kind: r.kind,
  subject: r.subject ?? undefined, body: r.body, status: r.status,
  createdAt: iso(r.created_at) || new Date().toISOString(),
});

const fuRow = (f: FollowUp) => ({
  id: f.id, lead_id: f.leadId, due_date: f.dueDate, step: f.step,
  channel: f.channel, status: f.status, created_at: f.createdAt,
});
const rowToFu = (r: any): FollowUp => ({
  id: r.id, leadId: r.lead_id, dueDate: iso(r.due_date) || r.due_date, step: r.step,
  channel: r.channel, status: r.status, createdAt: iso(r.created_at) || new Date().toISOString(),
});

function rowToBooking(r: any): Booking {
  return {
    id: r.id, publicCode: r.public_code, manageToken: r.manage_token,
    meetingType: r.meeting_type, durationMin: r.duration_min, leadId: r.lead_id ?? null,
    name: r.name, email: r.email, phone: r.phone ?? undefined, company: r.company ?? undefined,
    website: r.website ?? undefined, requirement: r.requirement ?? undefined,
    startsAt: iso(r.starts_at)!, endsAt: iso(r.ends_at)!, timezone: r.timezone,
    locationType: r.location_type, meetingUrl: r.meeting_url, status: r.status,
    notes: r.notes ?? undefined,
    createdAt: iso(r.created_at) || new Date().toISOString(),
    updatedAt: iso(r.updated_at) || new Date().toISOString(),
  };
}
function bookingToRow(b: Booking) {
  return {
    id: b.id, public_code: b.publicCode, manage_token: b.manageToken,
    meeting_type: b.meetingType, duration_min: b.durationMin, lead_id: b.leadId ?? null,
    name: b.name, email: b.email, phone: b.phone ?? null, company: b.company ?? null,
    website: b.website ?? null, requirement: b.requirement ?? null,
    starts_at: b.startsAt, ends_at: b.endsAt, timezone: b.timezone,
    location_type: b.locationType, meeting_url: b.meetingUrl ?? null,
    status: b.status, notes: b.notes ?? null,
    created_at: b.createdAt, updated_at: b.updatedAt,
  };
}

export const supabaseRepo: Repo = {
  async listLeads() {
    const rows = await select<any[]>("leads", "?select=*&order=created_at.desc");
    return (rows || []).map(rowToLead);
  },
  async getLead(id) {
    const rows = await select<any[]>("leads", `?select=*&id=eq.${encodeURIComponent(id)}&limit=1`);
    return rows?.[0] ? rowToLead(rows[0]) : undefined;
  },
  async upsertLead(lead) {
    await upsertRow<any[]>("leads", leadToRow(lead));
    return lead;
  },
  async deleteLead(id) {
    await remove("leads", `?id=eq.${encodeURIComponent(id)}`); // cascades to children
  },
  async addMessage(m) { await insert("messages", msgRow(m)); return m; },
  async messagesFor(leadId) {
    const rows = await select<any[]>("messages", `?select=*&lead_id=eq.${encodeURIComponent(leadId)}&order=created_at.desc`);
    return (rows || []).map(rowToMsg);
  },
  async addProposal(p) {
    await insert("proposals", {
      id: p.id, lead_id: p.leadId, client_name: p.clientName, business: p.business,
      requirements: p.requirements, solution: p.solution, features: p.features,
      timeline: p.timeline, investment: p.investment, deliverables: p.deliverables,
      terms: p.terms, next_steps: p.nextSteps, created_at: p.createdAt,
    });
    return p;
  },
  async addProject(p) {
    await insert("projects", {
      id: p.id, lead_id: p.leadId ?? null, client_name: p.clientName, project_name: p.projectName,
      services: p.services, start_date: p.startDate ?? null, deadline: p.deadline ?? null,
      status: p.status, budget: p.budget ?? null, payment_status: p.paymentStatus ?? "unpaid",
      notes: p.notes ?? null, created_at: p.createdAt,
    });
    return p;
  },
  async addFollowUps(f) { if (f.length) await insert("follow_ups", f.map(fuRow)); },
  async followupsDue() {
    const now = new Date().toISOString();
    const rows = await select<any[]>("follow_ups", `?select=*&status=eq.pending&due_date=lte.${now}&order=due_date.asc`);
    return (rows || []).map(rowToFu);
  },
  async addLeadActivity(a) {
    await insert("lead_activities", {
      id: a.id, lead_id: a.leadId, type: a.type, summary: a.summary,
      meta: a.meta ?? null, actor: a.actor ?? "system", created_at: a.createdAt,
    });
    return a;
  },
  async activitiesFor(leadId) {
    const rows = await select<any[]>("lead_activities", `?select=*&lead_id=eq.${encodeURIComponent(leadId)}&order=created_at.desc`);
    return (rows || []).map((r) => ({
      id: r.id, leadId: r.lead_id, type: r.type, summary: r.summary,
      meta: r.meta, actor: r.actor, createdAt: iso(r.created_at) || "",
    })) as LeadActivity[];
  },
  async startAgentRun(r) {
    await insert("agent_runs", {
      id: r.id, agent: r.agent, status: r.status, started_at: r.startedAt,
      items: r.items ?? 0, tokens_used: r.tokensUsed ?? 0, meta: r.meta ?? null,
    });
    return r;
  },
  async finishAgentRun(id, p) {
    await patch("agent_runs", `?id=eq.${encodeURIComponent(id)}`, {
      status: p.status, finished_at: p.finishedAt ?? new Date().toISOString(),
      duration_ms: p.durationMs ?? null, items: p.items ?? 0,
      tokens_used: p.tokensUsed ?? 0, error: p.error ?? null, summary: p.summary ?? null,
    });
  },
  async listAgentRuns(limit = 50) {
    const rows = await select<any[]>("agent_runs", `?select=*&order=started_at.desc&limit=${limit}`);
    return (rows || []).map((r) => ({
      id: r.id, agent: r.agent, status: r.status, startedAt: iso(r.started_at) || "",
      finishedAt: iso(r.finished_at) ?? null, durationMs: r.duration_ms, items: r.items,
      tokensUsed: r.tokens_used, error: r.error, summary: r.summary, meta: r.meta,
    })) as AgentRun[];
  },
  async createIssue(i) {
    await insert("issues", {
      id: i.id, source: i.source, title: i.title, detail: i.detail ?? null,
      severity: i.severity, status: i.status, url: i.url ?? null,
      suggested_fix: i.suggestedFix ?? null, created_at: i.createdAt, updated_at: i.updatedAt,
    });
    return i;
  },
  async listIssues() {
    const rows = await select<any[]>("issues", "?select=*&order=created_at.desc");
    return (rows || []).map((r) => ({
      id: r.id, source: r.source, title: r.title, detail: r.detail, severity: r.severity,
      status: r.status, url: r.url, suggestedFix: r.suggested_fix,
      createdAt: iso(r.created_at) || "", updatedAt: iso(r.updated_at) || "",
    })) as Issue[];
  },
  async updateIssue(id, p) {
    const rows = await patch<any[]>("issues", `?id=eq.${encodeURIComponent(id)}`, {
      ...(p.status ? { status: p.status } : {}),
      ...(p.severity ? { severity: p.severity } : {}),
      ...(p.suggestedFix !== undefined ? { suggested_fix: p.suggestedFix } : {}),
      ...(p.detail !== undefined ? { detail: p.detail } : {}),
      updated_at: new Date().toISOString(),
    });
    const r = rows?.[0];
    return r ? ({
      id: r.id, source: r.source, title: r.title, detail: r.detail, severity: r.severity,
      status: r.status, url: r.url, suggestedFix: r.suggested_fix,
      createdAt: iso(r.created_at) || "", updatedAt: iso(r.updated_at) || "",
    } as Issue) : undefined;
  },
  async recordWebsiteCheck(c) {
    await insert("website_checks", {
      id: c.id, url: c.url, ok: c.ok, http_status: c.httpStatus ?? null,
      response_ms: c.responseMs ?? null, checked_at: c.checkedAt, details: c.details ?? null,
    });
    return c;
  },
  async listWebsiteChecks(limit = 50) {
    const rows = await select<any[]>("website_checks", `?select=*&order=checked_at.desc&limit=${limit}`);
    return (rows || []).map((r) => ({
      id: r.id, url: r.url, ok: r.ok, httpStatus: r.http_status, responseMs: r.response_ms,
      checkedAt: iso(r.checked_at) || "", details: r.details,
    })) as WebsiteCheck[];
  },
  async createApproval(a) {
    await insert("approvals", {
      id: a.id, kind: a.kind, title: a.title, payload: a.payload ?? null,
      status: a.status, created_at: a.createdAt,
    });
    return a;
  },
  async listApprovals(status) {
    const q = status ? `?select=*&status=eq.${status}&order=created_at.desc` : "?select=*&order=created_at.desc";
    const rows = await select<any[]>("approvals", q);
    return (rows || []).map((r) => ({
      id: r.id, kind: r.kind, title: r.title, payload: r.payload, status: r.status,
      createdAt: iso(r.created_at) || "", decidedAt: iso(r.decided_at) ?? null, decidedBy: r.decided_by,
    })) as Approval[];
  },
  async updateApproval(id, p) {
    const rows = await patch<any[]>("approvals", `?id=eq.${encodeURIComponent(id)}`, {
      ...(p.status ? { status: p.status } : {}),
      decided_at: new Date().toISOString(),
      ...(p.decidedBy ? { decided_by: p.decidedBy } : {}),
    });
    const r = rows?.[0];
    return r ? ({
      id: r.id, kind: r.kind, title: r.title, payload: r.payload, status: r.status,
      createdAt: iso(r.created_at) || "", decidedAt: iso(r.decided_at) ?? null, decidedBy: r.decided_by,
    } as Approval) : undefined;
  },

  // ---------- Phase 3: booking ----------
  async listMeetingTypes(onlyEnabled = false) {
    const q = onlyEnabled
      ? "?select=*&enabled=is.true&order=sort_order.asc"
      : "?select=*&order=sort_order.asc";
    const rows = await select<any[]>("meeting_types", q);
    return (rows || []).map((r) => ({
      id: r.id, slug: r.slug, name: r.name, durationMin: r.duration_min,
      description: r.description ?? undefined, locationType: r.location_type,
      meetingUrl: r.meeting_url, enabled: r.enabled, sortOrder: r.sort_order,
    })) as MeetingType[];
  },
  async saveMeetingType(t: MeetingType) {
    await upsertRow("meeting_types", {
      id: t.id, slug: t.slug, name: t.name, duration_min: t.durationMin,
      description: t.description ?? null, location_type: t.locationType,
      meeting_url: t.meetingUrl ?? null, enabled: t.enabled, sort_order: t.sortOrder,
    });
    return t;
  },
  async getSettings(): Promise<BookingSettings> {
    const rows = await select<any[]>("booking_settings", "?select=*&id=eq.default&limit=1");
    const r = rows?.[0];
    return {
      timezone: r?.timezone ?? "Asia/Kolkata",
      utcOffsetMin: r?.utc_offset_min ?? 330,
      minNoticeMin: r?.min_notice_min ?? 120,
      maxWindowDays: r?.max_window_days ?? 30,
      bufferBeforeMin: r?.buffer_before_min ?? 0,
      bufferAfterMin: r?.buffer_after_min ?? 15,
      slotStepMin: r?.slot_step_min ?? 30,
      defaultLocation: r?.default_location ?? "google_meet",
      defaultMeetingUrl: r?.default_meeting_url ?? null,
    };
  },
  async saveSettings(s2: BookingSettings) {
    await upsertRow("booking_settings", {
      id: "default", timezone: s2.timezone, utc_offset_min: s2.utcOffsetMin,
      min_notice_min: s2.minNoticeMin, max_window_days: s2.maxWindowDays,
      buffer_before_min: s2.bufferBeforeMin, buffer_after_min: s2.bufferAfterMin,
      slot_step_min: s2.slotStepMin, default_location: s2.defaultLocation,
      default_meeting_url: s2.defaultMeetingUrl ?? null, updated_at: new Date().toISOString(),
    });
    return s2;
  },
  async listAvailability() {
    const rows = await select<any[]>("availability_rules", "?select=*&order=weekday.asc");
    return (rows || []).map((r) => ({
      id: r.id, weekday: r.weekday, startMin: r.start_min, endMin: r.end_min, enabled: r.enabled,
    })) as AvailabilityRule[];
  },
  async saveAvailability(rules: AvailabilityRule[]) {
    if (!rules.length) return;
    await upsertRow("availability_rules", rules.map((r) => ({
      id: r.id, weekday: r.weekday, start_min: r.startMin, end_min: r.endMin, enabled: r.enabled,
    })));
  },
  async listBlockedTimes(fromISO?: string, toISO?: string) {
    let q = "?select=*&order=starts_at.asc";
    if (fromISO) q += `&ends_at=gte.${fromISO}`;
    if (toISO) q += `&starts_at=lte.${toISO}`;
    const rows = await select<any[]>("blocked_times", q);
    return (rows || []).map((r) => ({
      id: r.id, startsAt: iso(r.starts_at)!, endsAt: iso(r.ends_at)!, reason: r.reason ?? undefined,
    })) as BlockedTime[];
  },
  async addBlockedTime(b: BlockedTime) {
    await insert("blocked_times", { id: b.id, starts_at: b.startsAt, ends_at: b.endsAt, reason: b.reason ?? null });
    return b;
  },
  async removeBlockedTime(id: string) { await remove("blocked_times", `?id=eq.${encodeURIComponent(id)}`); },
  async listBookings(fromISO?: string, toISO?: string) {
    let q = "?select=*&order=starts_at.asc";
    if (fromISO) q += `&ends_at=gte.${fromISO}`;
    if (toISO) q += `&starts_at=lte.${toISO}`;
    const rows = await select<any[]>("bookings", q);
    return (rows || []).map(rowToBooking);
  },
  async getBookingByToken(token: string) {
    const rows = await select<any[]>("bookings", `?select=*&manage_token=eq.${encodeURIComponent(token)}&limit=1`);
    return rows?.[0] ? rowToBooking(rows[0]) : undefined;
  },
  async createBooking(b: Booking) {
    try {
      await insert("bookings", bookingToRow(b));
      return b;
    } catch (e) {
      // unique index bookings_no_double_book -> 23505 / 409
      const msg = (e as Error).message || "";
      if (msg.includes("409") || msg.includes("23505") || msg.toLowerCase().includes("duplicate")) {
        throw new Error("SLOT_TAKEN");
      }
      throw e;
    }
  },
  async updateBooking(id: string, p: Partial<Booking>) {
    const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (p.status) row.status = p.status;
    if (p.startsAt) row.starts_at = p.startsAt;
    if (p.endsAt) row.ends_at = p.endsAt;
    if (p.notes !== undefined) row.notes = p.notes;
    if (p.meetingUrl !== undefined) row.meeting_url = p.meetingUrl;
    const rows = await patch<any[]>("bookings", `?id=eq.${encodeURIComponent(id)}`, row);
    return rows?.[0] ? rowToBooking(rows[0]) : undefined;
  },
  async health(): Promise<DriverHealth> {
    try {
      await select<any[]>("leads", "?select=id&limit=1");
      return { driver: "supabase", ok: true, persistent: true, detail: "Connected to Supabase (PostgREST). Data is persistent." };
    } catch (e) {
      return { driver: "supabase", ok: false, persistent: true, detail: `Supabase unreachable: ${(e as Error).message}` };
    }
  },
};
