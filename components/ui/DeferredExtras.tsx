"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Non-essential widgets: none of them is needed for the first paint, so their
// code is split out and only fetched once the browser is idle after load.
const Cursor = dynamic(() => import("@/components/fx/Cursor"), { ssr: false });
const ScrollProgress = dynamic(() => import("@/components/fx/ScrollProgress"), { ssr: false });
const FloatingWidgets = dynamic(() => import("@/components/ui/FloatingWidgets"), { ssr: false });
const Chatbot = dynamic(() => import("@/components/chat/Chatbot"), { ssr: false });
const CookieBanner = dynamic(() => import("@/components/ui/CookieBanner"), { ssr: false });
const Analytics = dynamic(() => import("@/components/ui/Analytics"), { ssr: false });
const VisitPing = dynamic(() => import("@/components/ui/VisitPing"), { ssr: false });

export default function DeferredExtras() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const go = () => setReady(true);
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (document.readyState === "complete") {
      w.requestIdleCallback ? w.requestIdleCallback(go, { timeout: 1500 }) : setTimeout(go, 300);
    } else {
      const onLoad = () => (w.requestIdleCallback ? w.requestIdleCallback(go, { timeout: 1500 }) : setTimeout(go, 300));
      window.addEventListener("load", onLoad, { once: true });
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);
  if (!ready) return null;
  return (
    <>
      <Analytics />
      <VisitPing />
      <ScrollProgress />
      <Cursor />
      <FloatingWidgets />
      <Chatbot />
      <CookieBanner />
    </>
  );
}
