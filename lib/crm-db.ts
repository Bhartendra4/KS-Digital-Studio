import "server-only";
import fs from "fs";
import os from "os";
import path from "path";
import crypto from "crypto";
import type { DB, Lead, Message, Proposal, Project, FollowUp } from "./crm-types";

// Store the CRM data in a SHORT path (home dir) to avoid Windows MAX_PATH issues.
const DATA_DIR = process.env.CRM_DATA_DIR || path.join(os.homedir(), ".ksds-crm");
const DATA_FILE = path.join(DATA_DIR, "crm.json");

const empty: DB = { leads: [], messages: [], proposals: [], projects: [], followups: [] };

function ensure(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify(empty, null, 2));
  } catch {
    /* fall back to in-memory below */
  }
}

let memory: DB | null = null;

export function read(): DB {
  ensure();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return { ...empty, ...parsed };
  } catch {
    if (!memory) memory = JSON.parse(JSON.stringify(empty));
    return memory as DB;
  }
}

export function write(db: DB): void {
  memory = db;
  try {
    ensure();
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  } catch {
    /* keep in memory if disk write fails */
  }
}

export const uid = (p = "id") =>
  `${p}_${Date.now().toString(36)}_${crypto.randomBytes(4).toString("hex")}`;

export const nowISO = () => new Date().toISOString();

// ---- Lead helpers ----
export function listLeads(): Lead[] {
  return read().leads.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
export function getLead(id: string): Lead | undefined {
  return read().leads.find((l) => l.id === id);
}
export function upsertLead(lead: Lead): Lead {
  const db = read();
  const i = db.leads.findIndex((l) => l.id === lead.id);
  if (i >= 0) db.leads[i] = { ...lead, updatedAt: nowISO() };
  else db.leads.push(lead);
  write(db);
  return lead;
}
export function deleteLead(id: string): void {
  const db = read();
  db.leads = db.leads.filter((l) => l.id !== id);
  db.messages = db.messages.filter((m) => m.leadId !== id);
  db.followups = db.followups.filter((f) => f.leadId !== id);
  write(db);
}

// ---- Generic collection push ----
export function addMessage(m: Message): Message { const db = read(); db.messages.push(m); write(db); return m; }
export function addProposal(p: Proposal): Proposal { const db = read(); db.proposals.push(p); write(db); return p; }
export function addProject(p: Project): Project { const db = read(); db.projects.push(p); write(db); return p; }
export function addFollowUps(f: FollowUp[]): void { const db = read(); db.followups.push(...f); write(db); }

export function messagesFor(leadId: string): Message[] { return read().messages.filter((m) => m.leadId === leadId); }
export function followupsDue(): FollowUp[] {
  const today = new Date().toISOString().slice(0, 10);
  return read().followups.filter((f) => f.status === "pending" && f.dueDate.slice(0, 10) <= today);
}

export { DATA_FILE };
