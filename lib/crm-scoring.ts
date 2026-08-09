import type { LeadTier, WebsiteAudit } from "./crm-types";

export interface ScoreInput {
  hasWebsite?: boolean;
  website?: string;
  websiteIssues?: string[];   // e.g. ["outdated","not mobile-friendly","slow","no SEO"]
  industry?: string;
  budget?: string;            // free text e.g. "₹50,000" or "$2000+"
  timeline?: string;          // e.g. "ASAP", "1 month"
  servicesNeeded?: string[];
  email?: string;
  phone?: string;
}

const HIGH_INTENT_INDUSTRIES = [
  "restaurant", "hotel", "cafe", "salon", "gym", "real estate", "clinic",
  "e-commerce", "ecommerce", "coach", "consultant", "startup",
];

function parseBudget(b?: string): number {
  if (!b) return 0;
  const digits = (b.match(/[\d,]+/g) || []).join("").replace(/,/g, "");
  const n = parseInt(digits, 10);
  return isNaN(n) ? 0 : n;
}

export function scoreLead(input: ScoreInput): {
  leadScore: number; tier: LeadTier; reasons: string[]; estimatedValue: number;
} {
  let score = 20; // baseline for any inbound lead
  const reasons: string[] = [];

  if (input.hasWebsite === false) {
    score += 28;
    reasons.push("No existing website — strong opportunity for a new build (+28)");
  }

  const issues = input.websiteIssues || [];
  if (issues.length) {
    const add = Math.min(30, issues.length * 8);
    score += add;
    reasons.push(`Current site issues: ${issues.join(", ")} (+${add})`);
  }

  const bud = parseBudget(input.budget);
  if (bud >= 100000 || /\$?\s?[2-9]\d{3,}/.test(input.budget || "")) {
    score += 18; reasons.push("Healthy budget signalled (+18)");
  } else if (bud > 0 || (input.budget && input.budget.trim())) {
    score += 8; reasons.push("Budget provided (+8)");
  }

  if (input.timeline) {
    const t = input.timeline.toLowerCase();
    if (t.includes("asap") || t.includes("urgent") || t.includes("week")) {
      score += 12; reasons.push("Urgent timeline (+12)");
    } else {
      score += 6; reasons.push("Timeline provided (+6)");
    }
  }

  if (input.industry && HIGH_INTENT_INDUSTRIES.some((i) => input.industry!.toLowerCase().includes(i))) {
    score += 8; reasons.push(`High-intent industry: ${input.industry} (+8)`);
  }

  if (input.email && input.phone) { score += 8; reasons.push("Full contact details provided (+8)"); }
  else if (input.email || input.phone) { score += 4; reasons.push("Partial contact details (+4)"); }

  if ((input.servicesNeeded || []).length) {
    score += 6; reasons.push(`Clear service need: ${input.servicesNeeded!.join(", ")} (+6)`);
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const tier: LeadTier = score >= 70 ? "hot" : score >= 45 ? "warm" : "cold";

  // rough estimated project value
  let estimatedValue = bud;
  if (!estimatedValue) {
    const s = (input.servicesNeeded || []).join(" ").toLowerCase();
    if (s.includes("e-commerce") || s.includes("web app") || s.includes("crm")) estimatedValue = 250000;
    else if (s.includes("seo") || s.includes("automation")) estimatedValue = 80000;
    else estimatedValue = 120000;
  }

  return { leadScore: score, tier, reasons, estimatedValue };
}

// Heuristic website audit (structured). An AI provider can enrich this later.
export function heuristicAudit(input: ScoreInput): WebsiteAudit {
  const issues = (input.websiteIssues || []).map((i) => i.toLowerCase());
  const has = (k: string) => issues.some((i) => i.includes(k));
  const base = input.hasWebsite === false ? 0 : 55;
  const pen = (bad: boolean, amt: number) => (bad ? Math.max(0, base - amt) : base + 10);

  const audit: WebsiteAudit = {
    uiux: input.hasWebsite === false ? 0 : pen(has("ui") || has("outdated"), 25),
    mobile: input.hasWebsite === false ? 0 : pen(has("mobile"), 30),
    speed: input.hasWebsite === false ? 0 : pen(has("slow") || has("speed"), 30),
    seo: input.hasWebsite === false ? 0 : pen(has("seo"), 30),
    accessibility: input.hasWebsite === false ? 0 : 50,
    content: input.hasWebsite === false ? 0 : pen(has("content"), 15),
    cta: input.hasWebsite === false ? 0 : pen(has("cta"), 20),
    trust: input.hasWebsite === false ? 0 : pen(has("google") || has("presence"), 15),
    problems: [],
    improvements: [],
    potentialServices: [],
    estimatedScope: "",
  };

  const problems: string[] = [];
  if (input.hasWebsite === false) problems.push("No website — the business is invisible to online search and cannot capture leads.");
  if (has("outdated") || has("ui")) problems.push("Outdated design / weak UI hurts credibility and conversions.");
  if (has("mobile")) problems.push("Poor mobile experience — most visitors are on phones.");
  if (has("slow") || has("speed")) problems.push("Slow load times increase bounce rate and hurt SEO.");
  if (has("seo")) problems.push("Little/no SEO — the business isn't found on Google.");
  if (has("cta")) problems.push("No clear call-to-action — visitors don't convert.");
  if (has("booking")) problems.push("No online booking/ordering — losing direct revenue to third parties.");
  if (has("enquiry")) problems.push("No enquiry system — leads slip through the cracks.");
  if (!problems.length) problems.push("General opportunities to modernise design, speed and conversion.");

  audit.problems = problems;
  audit.improvements = [
    "Rebuild on a fast, mobile-first, modern stack (Next.js).",
    "Add clear CTAs, enquiry forms and (where relevant) online booking/ordering.",
    "Implement technical + on-page SEO and structured data.",
    "Optimise Core Web Vitals for speed and rankings.",
  ];
  audit.potentialServices = input.hasWebsite === false
    ? ["Website Design", "Website Development", "SEO Optimization", "Speed Optimization"]
    : ["Website Redesign", "UI/UX Design", "SEO Optimization", "Speed Optimization"];
  audit.estimatedScope = input.hasWebsite === false
    ? "New 6–10 page website with SEO — ~2–4 weeks."
    : "Redesign + performance + SEO — ~2–5 weeks depending on page count.";
  return audit;
}
