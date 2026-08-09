import "server-only";
import type { Lead } from "./crm-types";

// Single LLM entrypoint. Uses Anthropic or OpenAI if a key is present, else returns null.
async function llm(system: string, user: string): Promise<string | null> {
  const anthropic = process.env.ANTHROPIC_API_KEY;
  const openai = process.env.OPENAI_API_KEY;
  try {
    if (anthropic) {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": anthropic,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest",
          max_tokens: 900, system, messages: [{ role: "user", content: user }],
        }),
      });
      if (!r.ok) return null;
      const j = await r.json();
      return j?.content?.[0]?.text ?? null;
    }
    if (openai) {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${openai}` },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          messages: [{ role: "system", content: system }, { role: "user", content: user }],
          max_tokens: 900,
        }),
      });
      if (!r.ok) return null;
      const j = await r.json();
      return j?.choices?.[0]?.message?.content ?? null;
    }
  } catch {
    /* fall through to template */
  }
  return null;
}

export function aiEnabled() {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY);
}

const AGENCY = "KS Digital Studio";

export async function generateOutreach(lead: Lead, kind: string): Promise<{ subject: string; body: string }> {
  const problems = lead.audit?.problems?.slice(0, 3).join("; ") || "opportunities to modernise the site, improve speed and SEO";
  const biz = lead.businessName;
  const sys = `You are a senior sales copywriter for ${AGENCY}, a premium web design & development studio. Write concise, personalised, non-spammy B2B outreach. Never fabricate facts. Always include a soft CTA and an opt-out line.`;
  const prompt = `Write a ${kind} email to ${lead.contactName || "the owner"} of "${biz}" (${lead.industry || "local business"}${lead.location ? ", " + lead.location : ""}). Their website: ${lead.website || "none found"}. Key issues to reference respectfully: ${problems}. Keep it under 130 words. Return as: SUBJECT: <line>\\n\\n<body>.`;

  const out = await llm(sys, prompt);
  if (out) {
    const m = out.match(/SUBJECT:\s*(.+)/i);
    const subject = m ? m[1].trim() : `Ideas to grow ${biz} online`;
    const body = out.replace(/SUBJECT:.*(\n)?/i, "").trim();
    return { subject, body };
  }
  // Template fallback (personalised)
  const subject = kind === "followup" ? `Following up — ${biz}` : `Helping ${biz} win more customers online`;
  const body =
`Hi ${lead.contactName || "there"},

I came across ${biz}${lead.location ? " in " + lead.location : ""} and had a quick look at your online presence. I noticed ${problems}.

At ${AGENCY} we build fast, modern, conversion-focused websites for ${lead.industry || "businesses like yours"} — designed to turn visitors into customers and rank on Google.

Would you be open to a free 15-minute audit call this week? No obligation.

Best,
${AGENCY}
${process.env.NEXT_PUBLIC_SITE_EMAIL || "info@ksdigitalstudio.in"}

— Reply "unsubscribe" and I won't follow up.`;
  return { subject, body };
}

export async function generateProposal(lead: Lead, extra?: { requirements?: string }) {
  const biz = lead.businessName;
  const services = lead.servicesNeeded?.length ? lead.servicesNeeded : (lead.audit?.potentialServices || ["Website Design", "Website Development", "SEO Optimization"]);
  const value = lead.estimatedValue ? `₹${lead.estimatedValue.toLocaleString("en-IN")}` : "Custom quote";
  const sys = `You are a proposal writer for ${AGENCY}. Produce clear, professional, honest proposals. Do not over-promise.`;
  const prompt = `Draft a website project proposal for "${biz}" (${lead.industry || "business"}). Requirements: ${extra?.requirements || lead.notes || "modern, fast, SEO-ready website"}. Recommended services: ${services.join(", ")}. Budget/estimate: ${value}. Return sections: Requirements, Recommended Solution, Features (bullets), Timeline, Investment, Deliverables (bullets), Terms (bullets), Next Steps (bullets).`;

  const out = await llm(sys, prompt);
  const base = {
    clientName: lead.contactName || biz,
    business: biz,
    requirements: extra?.requirements || lead.notes || "A modern, fast, mobile-first website that generates enquiries and ranks on Google.",
    solution: out || `A bespoke, high-performance website built by ${AGENCY} on Next.js, tailored to ${biz}'s brand and goals — fast, SEO-ready and conversion-focused.`,
    features: ["Custom responsive design", "SEO & structured data", "Speed optimisation (90+ Lighthouse)", "Enquiry / lead capture", "Analytics", "CMS-ready content"],
    timeline: lead.timeline || "2–4 weeks from kickoff",
    investment: value,
    deliverables: ["Design in Figma", "Fully built responsive website", "SEO setup", "Deployment", "Training & handover"],
    terms: ["50% to start, 50% on launch", "2 rounds of revisions included", "Timeline assumes timely content & feedback"],
    nextSteps: ["Approve this proposal", "Kickoff call & content gathering", "Design → Development → Launch"],
  };
  return base;
}

export async function assistantReply(prompt: string, context: string): Promise<string | null> {
  const sys = `You are the internal AI Sales Assistant for ${AGENCY}'s CRM. Answer using ONLY the provided CRM context. Be concise and actionable. If asked to write a message, keep it personalised and non-spammy.`;
  return llm(sys, `CRM CONTEXT:\n${context}\n\nREQUEST: ${prompt}`);
}
