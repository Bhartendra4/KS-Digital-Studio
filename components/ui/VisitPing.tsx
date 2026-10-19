"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Pings /api/visit ONCE per browser session so the owner gets a phone alert.
// The server side is a no-op unless alert env vars are configured.
// Owner opt-out: open the site once with ?noalert=1 (re-enable with ?noalert=0).
const SESSION_KEY = "ksds_visit_pinged";
const OPTOUT_KEY = "ksds_no_visit_alert";
const BOT_UA = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview/i;

export default function VisitPing() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (pathname.startsWith("/admin")) return;
      const params = new URLSearchParams(window.location.search);
      if (params.get("noalert") === "1") localStorage.setItem(OPTOUT_KEY, "1");
      if (params.get("noalert") === "0") localStorage.removeItem(OPTOUT_KEY);
      if (localStorage.getItem(OPTOUT_KEY) === "1") return;
      if (navigator.webdriver || BOT_UA.test(navigator.userAgent)) return;
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");

      const payload = JSON.stringify({
        path: pathname,
        referrer: document.referrer,
        lang: navigator.language,
      });
      const blob = new Blob([payload], { type: "application/json" });
      if (!(navigator.sendBeacon && navigator.sendBeacon("/api/visit", blob))) {
        fetch("/api/visit", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // storage blocked (private mode etc.) — silently skip
    }
    // Run only for the first page of the session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
