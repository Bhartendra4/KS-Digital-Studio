// ---- CRM domain types ----
export type LeadStatus =
  | "new" | "contacted" | "replied" | "qualified"
  | "proposal_sent" | "won" | "lost";

export type LeadTier = "hot" | "warm" | "cold";

export interface WebsiteAudit {
  uiux: number; mobile: number; speed: number; seo: number;
  accessibility: number; content: number; cta: number; trust: number;
  problems: string[];
  improvements: string[];
  potentialServices: string[];
  estimatedScope: string;
}

export interface Lead {
  id: string;
  businessName: string;
  website?: string;
  industry?: string;
  location?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  websiteScore?: number;      // 0-100 (quality of their current site)
  leadScore: number;          // 0-100 (opportunity)
  tier: LeadTier;
  scoreReasons: string[];
  status: LeadStatus;
  source: string;             // chatbot | contact_form | manual | import
  notes?: string;
  servicesNeeded?: string[];
  budget?: string;
  timeline?: string;
  estimatedValue?: number;
  audit?: WebsiteAudit;
  lastContact?: string | null;
  nextFollowUp?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  leadId: string;
  channel: "email" | "linkedin" | "whatsapp" | "proposal";
  kind: "cold" | "followup" | "value" | "final" | "custom";
  subject?: string;
  body: string;
  status: "draft" | "approved" | "sent";
  createdAt: string;
}

export interface Proposal {
  id: string;
  leadId: string;
  clientName: string;
  business: string;
  requirements: string;
  solution: string;
  features: string[];
  timeline: string;
  investment: string;
  deliverables: string[];
  terms: string[];
  nextSteps: string[];
  createdAt: string;
}

export interface Project {
  id: string;
  leadId?: string;
  clientName: string;
  projectName: string;
  services: string[];
  startDate?: string;
  deadline?: string;
  status: "new" | "planning" | "design" | "development" | "testing" | "review" | "completed";
  budget?: number;
  paymentStatus?: "unpaid" | "partial" | "paid";
  tasks: { id: string; title: string; done: boolean }[];
  notes?: string;
  createdAt: string;
}

export interface FollowUp {
  id: string;
  leadId: string;
  dueDate: string;
  step: number;      // 0,3,7,14 day sequence index
  channel: Message["channel"];
  status: "pending" | "done" | "skipped";
  createdAt: string;
}

export interface DB {
  leads: Lead[];
  messages: Message[];
  proposals: Proposal[];
  projects: Project[];
  followups: FollowUp[];
}
