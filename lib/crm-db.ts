import "server-only";
/**
 * Backwards-compatible CRM data access.
 * Phase 1: this now delegates to the pluggable repository layer (lib/db) so the
 * same code runs on local JSON (dev) or Supabase/Postgres (production).
 * NOTE: every function is now async.
 */
import { getRepo, uid, nowISO, driverName } from "./db";
import type { Lead, Message, Proposal, Project, FollowUp } from "./crm-types";
import type { LeadActivity } from "./db/entities";

export { uid, nowISO, driverName };

export const listLeads   = (): Promise<Lead[]>              => getRepo().listLeads();
export const getLead     = (id: string)                     => getRepo().getLead(id);
export const upsertLead  = (lead: Lead): Promise<Lead>      => getRepo().upsertLead(lead);
export const deleteLead  = (id: string): Promise<void>      => getRepo().deleteLead(id);

export const addMessage  = (m: Message): Promise<Message>   => getRepo().addMessage(m);
export const messagesFor = (leadId: string)                 => getRepo().messagesFor(leadId);

export const addProposal = (p: Proposal): Promise<Proposal> => getRepo().addProposal(p);
export const addProject  = (p: Project): Promise<Project>   => getRepo().addProject(p);

export const addFollowUps = (f: FollowUp[]): Promise<void>  => getRepo().addFollowUps(f);
export const followupsDue = (): Promise<FollowUp[]>         => getRepo().followupsDue();

export const addLeadActivity = (a: LeadActivity)            => getRepo().addLeadActivity(a);
export const activitiesFor   = (leadId: string)             => getRepo().activitiesFor(leadId);

export const dbHealth = () => getRepo().health();

/** Convenience: record a lead activity without building the object by hand. */
export async function logActivity(
  leadId: string,
  type: LeadActivity["type"],
  summary: string,
  meta?: Record<string, unknown>,
  actor = "system",
): Promise<void> {
  try {
    await getRepo().addLeadActivity({
      id: uid("act"), leadId, type, summary, meta: meta ?? null, actor, createdAt: nowISO(),
    });
  } catch {
    /* activity logging must never break the main flow */
  }
}
