import "server-only";
import fs from "fs";
import os from "os";
import path from "path";
import type { Lead, Message, Proposal, Project, FollowUp } from "../crm-types";
import type { AgentRun, Issue, WebsiteCheck, LeadActivity, Approval, DriverHealth } from "./entities";
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
}
const empty: Store = {
  leads: [], messages: [], proposals: [], projects: [], followups: [],
  activities: [], agentRuns: [], issues: [], websiteChecks: [], approvals: [],
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
