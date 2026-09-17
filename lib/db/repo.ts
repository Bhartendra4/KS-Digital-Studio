import type { Lead, Message, Proposal, Project, FollowUp } from "../crm-types";
import type { AgentRun, Issue, WebsiteCheck, LeadActivity, Approval, DriverHealth } from "./entities";

/** Storage contract. Every method is async so adapters can be file- or network-backed. */
export interface Repo extends BookingRepo {
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

/** Phase 3 — booking/scheduling storage. Implemented by both adapters. */
export interface BookingRepo {
  listMeetingTypes(onlyEnabled?: boolean): Promise<import("./entities").MeetingType[]>;
  saveMeetingType(t: import("./entities").MeetingType): Promise<import("./entities").MeetingType>;

  getSettings(): Promise<import("./entities").BookingSettings>;
  saveSettings(s: import("./entities").BookingSettings): Promise<import("./entities").BookingSettings>;

  listAvailability(): Promise<import("./entities").AvailabilityRule[]>;
  saveAvailability(rules: import("./entities").AvailabilityRule[]): Promise<void>;

  listBlockedTimes(fromISO?: string, toISO?: string): Promise<import("./entities").BlockedTime[]>;
  addBlockedTime(b: import("./entities").BlockedTime): Promise<import("./entities").BlockedTime>;
  removeBlockedTime(id: string): Promise<void>;

  listBookings(fromISO?: string, toISO?: string): Promise<import("./entities").Booking[]>;
  getBookingByToken(token: string): Promise<import("./entities").Booking | undefined>;
  /** MUST reject if an active booking already occupies the start instant. */
  createBooking(b: import("./entities").Booking): Promise<import("./entities").Booking>;
  updateBooking(id: string, patch: Partial<import("./entities").Booking>): Promise<import("./entities").Booking | undefined>;
}
