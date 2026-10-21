import "server-only";
import type { Lead } from "./crm-types";

// Sends a new-lead notification to the agency inbox.
// Uses Resend if RESEND_API_KEY is set; otherwise logs (and returns false) so nothing breaks.
export async function notifyNewLead(lead: Lead): Promise<boolean> {
  const to = process.env.LEAD_NOTIFY_EMAIL || "info@ksdigitalstudio.in";
  const summary =
    `New ${lead.tier.toUpperCase()} lead (score ${lead.leadScore}/100)\n` +
    `Business: ${lead.businessName}\nContact: ${lead.contactName || "-"}\n` +
    `Email: ${lead.email || "-"}  Phone: ${lead.phone || "-"}\n` +
    `Service: ${(lead.servicesNeeded || []).join(", ") || "-"}\n` +
    `Budget: ${lead.budget || "-"}  Timeline: ${lead.timeline || "-"}\n` +
    `Source: ${lead.source}\nNotes: ${lead.notes || "-"}`;

  await pushLeadAlert(lead, summary);

  const key = process.env.RESEND_API_KEY;
  if (key) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
        body: JSON.stringify({
          from: process.env.LEAD_NOTIFY_FROM || "KS Digital Studio <onboarding@resend.dev>",
          to: [to], subject: `New ${lead.tier} lead: ${lead.businessName}`, text: summary,
        }),
      });
      return r.ok;
    } catch { return false; }
  }
  // WhatsApp notification architecture (optional): if WHATSAPP_NOTIFY_WEBHOOK set, POST the summary.
  const hook = process.env.WHATSAPP_NOTIFY_WEBHOOK;
  if (hook) {
    try { await fetch(hook, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: summary }) }); } catch {}
  }
  console.log("[LEAD NOTIFICATION]\n" + summary);
  return false;
}

// Phone alert for every new lead — uses the same ntfy / Telegram settings as visitor alerts.
async function pushLeadAlert(lead: Lead, summary: string): Promise<void> {
  const topic = process.env.NTFY_TOPIC;
  if (topic) {
    const server = (process.env.NTFY_SERVER || "https://ntfy.sh").replace(/\/+$/, "");
    const headers: Record<string, string> = {
      "content-type": "text/plain; charset=utf-8",
      Title: "New lead on ksdigitalstudio.in", Tags: "moneybag", Priority: "high",
    };
    if (process.env.NTFY_TOKEN) headers.authorization = `Bearer ${process.env.NTFY_TOKEN}`;
    try { await fetch(`${server}/${encodeURIComponent(topic)}`, { method: "POST", headers, body: summary }); } catch {}
  }
  const tg = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID;
  if (tg && chat) {
    try {
      await fetch(`https://api.telegram.org/bot${tg}/sendMessage`, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ chat_id: chat, text: `New lead: ${lead.businessName}\n\n${summary}` }),
      });
    } catch {}
  }
}
