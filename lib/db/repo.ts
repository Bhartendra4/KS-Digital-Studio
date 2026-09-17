import type { Lead, Message, Proposal, Project, FollowUp } from "../crm-types";
import type { AgentRun, Issue, WebsiteCheck, LeadActivity, Approval, DriverHealth } from "./entities";

/** Storage contract. Every method is async so adapters can be file- or network-backed. */
export interface Repo {
  // CRM core
  listLeads(): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | undefined>;
  upsertLead(lead: Lead): Promise<Lead>;
  deleteLead(id: string): Promise<void>;

  addMessage(m: Message): Promise<Message>;
  messagesFor(leadId: string): Promise<Message[]>;

  addProposal(p: Proposal): Promise<Proposal>;
  addProject(p: Project): Promise<Project>;

  addFollowUps(f: FollowUp[]): Promise<void>;
  followupsDue(): Promise<FollowUp[]>;

  // Agent framework (Phase 2/3 foundation)
  addLeadActivity(a: LeadActivity): Promise<LeadActivity>;
  activitiesFor(leadId: string): Promise<LeadActivity[]>;

  startAgentRun(r: AgentRun): Promise<AgentRun>;
  finishAgentRun(id: string, patch: Partial<AgentRun>): Promise<void>;
  listAgentRuns(limit?: number): Promise<AgentRun[]>;

  createIssue(i: Issue): Promise<Issue>;
  listIssues(): Promise<Issue[]>;
  updateIssue(id: string, patch: Partial<Issue>): Promise<Issue | undefined>;

  recordWebsiteCheck(c: WebsiteCheck): Promise<WebsiteCheck>;
  listWebsiteChecks(limit?: number): Promise<WebsiteCheck[]>;

  createApproval(a: Approval): Promise<Approval>;
  listApprovals(status?: Approval["status"]): Promise<Approval[]>;
  updateApproval(id: string, patch: Partial<Approval>): Promise<Approval | undefined>;

  health(): Promise<DriverHealth>;
}
