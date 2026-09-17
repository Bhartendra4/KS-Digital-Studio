import "server-only";
import fs from "fs";
import os from "os";
import path from "path";
import type { Lead, Message, Proposal, Project, FollowUp } from "../crm-types";
import type { AgentRun, Issue, WebsiteCheck, LeadActivity, Approval, DriverHealth,
  MeetingType, AvailabilityRule, BlockedTime, Booking, BookingSettings } from "./entities";
import type { Repo } from "./repo";

/**
 * Local/dev adapter. Keeps the original ~/.ksds-crm/crm.json behaviour so local
 * development and the existing data keep working unchanged.
 * NOT production-safe on serverless (read-only FS) — it degrades to in-memory.
 */
const DATA_DIR = process.env.CRM_DATA_DIR || path.join(os.homedir(), ".ksds-crm");
const DATA_FILE = path.join(DATA_DIR, "crm.json");

interface Store {
  leads: Lead[]; messages: Message[]; proposals: Proposal[]; projects: Project[];
  followups: FollowUp[]; activities: LeadActivity[]; agentRuns: AgentRun[];
  issues: Issue[]; websiteChecks: WebsiteCheck[]; approvals: Approval[];
  meetingTypes: MeetingType[]; availability: AvailabilityRule[];
  blocked: BlockedTime[]; bookings: Booking[]; settings?: BookingSettings;
}
const empty: Store = {
  leads: [], messages: [], proposals: [], projects: [], followups: [],
  activities: [], agentRuns: [], issues: [], websiteChecks: [], approvals: [],
  meetingTypes: [], availability: [], blocked: [], bookings: [],
};


const DEFAULT_TYPES: MeetingType[] = [
  { id: "mt_discovery", slug: "discovery-15", name: "15 Minute Discovery", durationMin: 15,
    description: "A quick intro call to understand your goals.", locationType: "google_meet", enabled: true, sortOrder: 1 },
  { id: "mt_consultation", slug: "consultation-30", name: "30 Minute Consultation", durationMin: 30,
    description: "Discuss your project requirements in detail.", locationType: "google_meet", enabled: true, sortOrder: 2 },
  { id: "mt_project", slug: "project-60", name: "60 Minute Project Consultation", durationMin: 60,
    description: "Deep dive: scope, timeline and investment.", locationType: "google_meet", enabled: true, sortOrder: 3 },
];
const DEFAULT_AVAILABILITY: AvailabilityRule[] = [
  { id: "av_sun", weekday: 0, startMin: 540, endMin: 1020, enabled: false },
  { id: "av_mon", weekday: 1, startMin: 540, endMin: 1020, enabled: true },
  { id: "av_tue", weekday: 2, startMin: 540, endMin: 1020, enabled: true },
  { id: "av_wed", weekday: 3, startMin: 540, endMin: 1020, enabled: true },
  { id: "av_thu", weekday: 4, startMin: 540, endMin: 1020, enabled: true },
  { id: "av_fri", weekday: 5, startMin: 540, endMin: 1020, enabled: true },
  { id: "av_sat", weekday: 6, startMin: 540, endMin: 1020, enabled: false },
];
export const DEFAULT_SETTINGS: BookingSettings = {
  timezone: "Asia/Kolkata", utcOffsetMin: 330, minNoticeMin: 120, maxWindowDays: 30,
  bufferBeforeMin: 0, bufferAfterMin: 15, slotStepMin: 30,
  defaultLocation: "google_meet", defaultMeetingUrl: null,
};

let memory: Store | null = null;
let diskOk = true;

function read(): Store {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify(empty, null, 2));
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return { ...empty, ...parsed };
  } catch {
    diskOk = false;
    if (!memory) memory = JSON.parse(JSON.stringify(empty)) as Store;
    return memory;
  }
}
function write(s: Store): void {
  memory = s;
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(s, null, 2));
    diskOk = true;
  } catch {
    diskOk = false;
  }
}
const sortDesc = <T extends { createdAt?: string }>(a: T, b: T) =>
  (a.createdAt || "") < (b.createdAt || "") ? 1 : -1;

export const jsonRepo: Repo = {
  async listLeads() { return read().leads.slice().sort(sortDesc); },
  async getLead(id) { return read().leads.find((l) => l.id === id); },
  async upsertLead(lead) {
    const db = read();
    const i = db.leads.findIndex((l) => l.id === lead.id);
    if (i >= 0) db.leads[i] = { ...lead, updatedAt: new Date().toISOString() };
    else db.leads.push(lead);
    write(db); return lead;
  },
  async deleteLead(id) {
    const db = read();
    db.leads = db.leads.filter((l) => l.id !== id);
    db.messages = db.messages.filter((m) => m.leadId !== id);
    db.followups = db.followups.filter((f) => f.leadId !== id);
    db.activities = db.activities.filter((a) => a.leadId !== id);
    write(db);
  },
  async addMessage(m) { const db = read(); db.messages.push(m); write(db); return m; },
  async messagesFor(leadId) { return read().messages.filter((m) => m.leadId === leadId); },
  async addProposal(p) { const db = read(); db.proposals.push(p); write(db); return p; },
  async addProject(p) { const db = read(); db.projects.push(p); write(db); return p; },
  async addFollowUps(f) { const db = read(); db.followups.push(...f); write(db); },
  async followupsDue() {
    const today = new Date().toISOString();
    return read().followups.filter((f) => f.status === "pending" && f.dueDate <= today);
  },
  async addLeadActivity(a) { const db = read(); db.activities.push(a); write(db); return a; },
  async activitiesFor(leadId) {
    return read().activities.filter((a) => a.leadId === leadId).sort(sortDesc);
  },
  async startAgentRun(r) { const db = read(); db.agentRuns.push(r); write(db); return r; },
  async finishAgentRun(id, patch) {
    const db = read();
    const i = db.agentRuns.findIndex((r) => r.id === id);
    if (i >= 0) { db.agentRuns[i] = { ...db.agentRuns[i], ...patch }; write(db); }
  },
  async listAgentRuns(limit = 50) {
    return read().agentRuns.slice().sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1)).slice(0, limit);
  },
  async createIssue(i) { const db = read(); db.issues.push(i); write(db); return i; },
  async listIssues() { return read().issues.slice().sort(sortDesc); },
  async updateIssue(id, patch) {
    const db = read();
    const i = db.issues.findIndex((x) => x.id === id);
    if (i < 0) return undefined;
    db.issues[i] = { ...db.issues[i], ...patch, updatedAt: new Date().toISOString() };
    write(db); return db.issues[i];
  },
  async recordWebsiteCheck(c) { const db = read(); db.websiteChecks.push(c); write(db); return c; },
  async listWebsiteChecks(limit = 50) {
    return read().websiteChecks.slice().sort((a, b) => (a.checkedAt < b.checkedAt ? 1 : -1)).slice(0, limit);
  },
  async createApproval(a) { const db = read(); db.approvals.push(a); write(db); return a; },
  async listApprovals(status) {
    const all = read().approvals.slice().sort(sortDesc);
    return status ? all.filter((a) => a.status === status) : all;
  },
  async updateApproval(id, patch) {
    const db = read();
    const i = db.approvals.findIndex((x) => x.id === id);
    if (i < 0) return undefined;
    db.approvals[i] = { ...db.approvals[i], ...patch };
    write(db); return db.approvals[i];
  },

  // ---------- Phase 3: booking ----------
  async listMeetingTypes(onlyEnabled = false) {
    const db = read();
    const types = db.meetingTypes.length ? db.meetingTypes : DEFAULT_TYPES;
    const sorted = types.slice().sort((a, b) => a.sortOrder - b.sortOrder);
    return onlyEnabled ? sorted.filter((t) => t.enabled) : sorted;
  },
  async saveMeetingType(t) {
    const db = read();
    if (!db.meetingTypes.length) db.meetingTypes = DEFAULT_TYPES.slice();
    const i = db.meetingTypes.findIndex((x) => x.id === t.id || x.slug === t.slug);
    if (i >= 0) db.meetingTypes[i] = t; else db.meetingTypes.push(t);
    write(db); return t;
  },
  async getSettings() { return read().settings ?? DEFAULT_SETTINGS; },
  async saveSettings(s2) { const db = read(); db.settings = s2; write(db); return s2; },
  async listAvailability() {
    const db = read();
    return db.availability.length ? db.availability : DEFAULT_AVAILABILITY;
  },
  async saveAvailability(rules) { const db = read(); db.availability = rules; write(db); },
  async listBlockedTimes(fromISO, toISO) {
    return read().blocked.filter((b) =>
      (!fromISO || b.endsAt >= fromISO) && (!toISO || b.startsAt <= toISO));
  },
  async addBlockedTime(b) { const db = read(); db.blocked.push(b); write(db); return b; },
  async removeBlockedTime(id) { const db = read(); db.blocked = db.blocked.filter((b) => b.id !== id); write(db); },
  async listBookings(fromISO, toISO) {
    return read().bookings
      .filter((b) => (!fromISO || b.endsAt >= fromISO) && (!toISO || b.startsAt <= toISO))
      .sort((a, b) => (a.startsAt < b.startsAt ? -1 : 1));
  },
  async getBookingByToken(token) { return read().bookings.find((b) => b.manageToken === token); },
  async createBooking(b) {
    const db = read();
    // double-booking guard: no active booking may share the same start instant
    const taken = db.bookings.some((x) =>
      x.startsAt === b.startsAt && (x.status === "confirmed" || x.status === "rescheduled"));
    if (taken) throw new Error("SLOT_TAKEN");
    db.bookings.push(b); write(db); return b;
  },
  async updateBooking(id, patch2) {
    const db = read();
    const i = db.bookings.findIndex((b) => b.id === id);
    if (i < 0) return undefined;
    db.bookings[i] = { ...db.bookings[i], ...patch2, updatedAt: new Date().toISOString() };
    write(db); return db.bookings[i];
  },
  async health(): Promise<DriverHealth> {
    read();
    return {
      driver: "json",
      ok: true,
      persistent: diskOk,
      detail: diskOk
        ? `Local JSON file at ${DATA_FILE}. Fine for development; NOT persistent on serverless hosting.`
        : "Filesystem not writable — running IN-MEMORY. Data is lost between requests. Configure Supabase for production.",
    };
  },
};
