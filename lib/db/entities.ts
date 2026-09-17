// Phase-1 entities for the AI Agency OS.
// Existing CRM types (Lead, Message, Proposal, Project, FollowUp) stay in lib/crm-types.ts
// so nothing that already imports them breaks.
export type { Lead, Message, Proposal, Project, FollowUp, WebsiteAudit, LeadStatus, LeadTier } from "../crm-types";

export type IssueSeverity = "critical" | "high" | "medium" | "low";
export type IssueStatus =
  | "detected" | "investigating" | "fix_proposed"
  | "awaiting_approval" | "fixed" | "verified" | "dismissed";

export interface Issue {
  id: string;
  source: string;
  title: string;
  detail?: string;
  severity: IssueSeverity;
  status: IssueStatus;
  url?: string;
  suggestedFix?: string;
  createdAt: string;
  updatedAt: string;
}

export type AgentName =
  | "website_monitor" | "website_optimizer" | "lead_engine" | "website_audit"
  | "lead_scoring" | "sales_assistant" | "follow_up_manager" | "chatbot"
  | "proposal" | "onboarding" | "project_manager" | "qa"
  | "git_deploy" | "revenue_analytics" | "business_intelligence" | "self_improvement";

export type AgentRunStatus = "running" | "ok" | "error" | "skipped";

export interface AgentRun {
  id: string;
  agent: AgentName | string;
  status: AgentRunStatus;
  startedAt: string;
  finishedAt?: string | null;
  durationMs?: number | null;
  items?: number;
  tokensUsed?: number;
  error?: string | null;
  summary?: string | null;
  meta?: Record<string, unknown> | null;
}

export interface WebsiteCheck {
  id: string;
  url: string;
  ok: boolean;
  httpStatus?: number | null;
  responseMs?: number | null;
  checkedAt: string;
  details?: Record<string, unknown> | null;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: "created" | "status_change" | "note" | "email" | "call" | "meeting" | "audit" | "agent";
  summary: string;
  meta?: Record<string, unknown> | null;
  actor?: string;
  createdAt: string;
}

export interface Approval {
  id: string;
  kind: "code" | "content" | "email" | "whatsapp" | "proposal" | "pricing" | "seo" | "deployment";
  title: string;
  payload?: Record<string, unknown> | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  decidedAt?: string | null;
  decidedBy?: string | null;
}

export interface DriverHealth {
  driver: "supabase" | "json";
  ok: boolean;
  persistent: boolean;
  detail: string;
}
