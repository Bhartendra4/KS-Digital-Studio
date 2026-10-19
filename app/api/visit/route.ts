import { NextResponse } from "next/server";
import { notifyVisit, visitAlertsEnabled } from "@/lib/visit-notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BOT_UA =
  /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|whatsapp|telegram|discord|slack|curl|wget|python|axios|node-fetch|go-http|uptime|pingdom|monitor/i;

// Best-effort per-IP throttle (per server instance). Prevents alert spam from
// one person refreshing / opening many tabs, or a script hammering the endpoint.
const THROTTLE_MS = Number(process.env.VISIT_ALERT_THROTTLE_MIN || 30) * 60 * 1000;
const seen = new Map<string, number>();
let lastSent = 0;
const GLOBAL_MIN_GAP_MS = 5 * 1000; // never more than 1 alert per 5s overall

function clean(v: unknown, max = 200): string {
  return typeof v === "string" ? v.replace(/[\r\n\t]+/g, " ").trim().slice(0, max) : "";
}

function deviceFrom(ua: string): string {
  const os = /android/i.test(ua) ? "Android"
    : /iphone|ipad|ipod/i.test(ua) ? "iOS"
    : /windows/i.test(ua) ? "Windows"
    : /mac os x|macintosh/i.test(ua) ? "Mac"
    : /linux/i.test(ua) ? "Linux" : "Other";
  const browser = /edg\//i.test(ua) ? "Edge"
    : /opr\/|opera/i.test(ua) ? "Opera"
    : /samsungbrowser/i.test(ua) ? "Samsung Internet"
    : /chrome|crios/i.test(ua) ? "Chrome"
    : /firefox|fxios/i.test(ua) ? "Firefox"
    : /safari/i.test(ua) ? "Safari" : "Browser";
  const kind = /mobi|iphone|android/i.test(ua) ? "Mobile" : /ipad|tablet/i.test(ua) ? "Tablet" : "Desktop";
  return `${kind} - ${os} - ${browser}`;
}

function locationFrom(h: Headers): string {
  const dec = (s: string | null) => {
    if (!s) return "";
    try { return decodeURIComponent(s); } catch { return s; }
  };
  // Vercel geo headers (empty locally / on other hosts).
  return [dec(h.get("x-vercel-ip-city")), dec(h.get("x-vercel-ip-country-region")), h.get("x-vercel-ip-country") || ""]
    .filter(Boolean).join(", ");
}

export async function POST(req: Request) {
  // Disabled unless env vars are configured — respond quietly.
  if (!visitAlertsEnabled()) return new NextResponse(null, { status: 204 });

  const ua = req.headers.get("user-agent") || "";
  if (!ua || BOT_UA.test(ua)) return new NextResponse(null, { status: 204 });

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
  const now = Date.now();
  const prev = seen.get(ip);
  if ((prev && now - prev < THROTTLE_MS) || now - lastSent < GLOBAL_MIN_GAP_MS) {
    return new NextResponse(null, { status: 204 });
  }
  seen.set(ip, now);
  lastSent = now;
  if (seen.size > 5000) {
    for (const [k, t] of seen) if (now - t > THROTTLE_MS) seen.delete(k);
  }

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch {}

  const path = clean(body.path, 150) || "/";
  if (path.startsWith("/admin")) return new NextResponse(null, { status: 204 });

  let referrer = clean(body.referrer, 200);
  try {
    if (referrer) {
      const r = new URL(referrer);
      // Ignore internal navigation, keep only the referring site.
      referrer = r.hostname.endsWith("ksdigitalstudio.in") ? "" : r.hostname;
    }
  } catch { referrer = ""; }

  await notifyVisit({
    path,
    referrer,
    device: deviceFrom(ua),
    location: locationFrom(req.headers),
    language: clean(body.lang, 20),
  });
  return new NextResponse(null, { status: 204 });
}
