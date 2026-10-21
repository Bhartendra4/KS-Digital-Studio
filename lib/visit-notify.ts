import "server-only";

// Visitor alerts: sends a phone push notification when someone opens the site.
// Completely disabled (no-op) unless at least one channel is configured:
//   - ntfy.sh  -> NTFY_TOPIC (optional NTFY_SERVER, NTFY_TOKEN)
//   - Telegram -> TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID
// Never throws — a failed alert must never break the website.

export type VisitInfo = {
  path: string;
  referrer: string;
  device: string;
  location: string;
  language: string;
};

export function visitAlertsEnabled(): boolean {
  return Boolean(
    process.env.NTFY_TOPIC ||
      (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
  );
}

function buildMessage(v: VisitInfo): string {
  return (
    `Page: ${v.path}\n` +
    `From: ${v.referrer || "Direct / unknown"}\n` +
    `Location: ${v.location || "Unknown"}\n` +
    `Device: ${v.device}` +
    (v.language ? `\nLanguage: ${v.language}` : "")
  );
}

async function sendNtfy(text: string): Promise<boolean> {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) return false;
  const server = (process.env.NTFY_SERVER || "https://ntfy.sh").replace(/\/+$/, "");
  const headers: Record<string, string> = {
    "content-type": "text/plain; charset=utf-8",
    // Header values must stay ASCII.
    Title: "New visitor on ksdigitalstudio.in",
    Tags: "eyes",
    Priority: process.env.NTFY_PRIORITY || "default",
  };
  if (process.env.NTFY_TOKEN) headers.authorization = `Bearer ${process.env.NTFY_TOKEN}`;
  try {
    const r = await fetch(`${server}/${encodeURIComponent(topic)}`, {
      method: "POST",
      headers,
      body: text,
    });
    return r.ok;
  } catch {
    return false;
  }
}

async function sendTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `New visitor on ksdigitalstudio.in\n\n${text}`,
        disable_web_page_preview: true,
      }),
    });
    return r.ok;
  } catch {
    return false;
  }
}

export async function notifyVisit(v: VisitInfo): Promise<boolean> {
  if (!visitAlertsEnabled()) return false;
  const text = buildMessage(v);
  const results = await Promise.all([sendNtfy(text), sendTelegram(text)]);
  return results.some(Boolean);
}
