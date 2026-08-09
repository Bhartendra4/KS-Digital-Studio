"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, X, Send, ArrowRight, CalendarCheck, MessageCircle, Mail } from "lucide-react";
import { site } from "@/lib/site";

type Msg = { from: "bot" | "user"; text: string };
type Step =
  | "service" | "name" | "business" | "email" | "phone"
  | "website" | "budget" | "timeline" | "desc" | "done";

const SERVICES = ["Website Design", "Website Development", "E-commerce", "SEO", "AI Automation", "Other"];
const BUDGETS = ["< ₹25k", "₹25k–₹75k", "₹75k–₹2L", "₹2L+"];
const TIMELINES = ["ASAP", "2–4 weeks", "1–3 months", "Just exploring"];

export default function Chatbot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("service");
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: "Hi! 👋 I'm the KS Digital Studio assistant. What can we help you build?" },
  ]);
  const [form, setForm] = useState<any>({ source: "chatbot", servicesNeeded: [] as string[] });
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => { scroller.current?.scrollTo({ top: 9e9, behavior: "smooth" }); }, [msgs, step]);

  if (pathname.startsWith("/admin")) return null;

  const say = (text: string, from: Msg["from"] = "bot") => setMsgs((m) => [...m, { from, text }]);

  const ask: Record<Step, string> = {
    service: "", name: "Great choice! What's your name?",
    business: "And your business name?", email: "What's the best email to reach you?",
    phone: "A phone/WhatsApp number? (optional — type 'skip')",
    website: "Do you have a current website? Paste the link or type 'none'.",
    budget: "", timeline: "", desc: "Briefly, what do you need? (a sentence is fine)",
    done: "",
  };

  const next = (from: Step, value: string) => {
    const order: Step[] = ["service", "name", "business", "email", "phone", "website", "budget", "timeline", "desc", "done"];
    const to = order[order.indexOf(from) + 1];
    setStep(to);
    if (ask[to]) setTimeout(() => say(ask[to]), 250);
  };

  const pick = (val: string) => {
    say(val, "user");
    if (step === "service") { setForm((f: any) => ({ ...f, servicesNeeded: [val], service: val })); next("service", val); }
    else if (step === "budget") { setForm((f: any) => ({ ...f, budget: val })); next("budget", val); }
    else if (step === "timeline") { setForm((f: any) => ({ ...f, timeline: val })); next("timeline", val); }
  };

  const submitText = () => {
    const val = input.trim();
    if (!val) return;
    say(val, "user"); setInput("");
    const map: Partial<Record<Step, string>> = {
      name: "contactName", business: "businessName", email: "email",
      phone: "phone", website: "website", desc: "projectDescription",
    };
    const key = map[step];
    if (key) setForm((f: any) => ({ ...f, [key]: val === "skip" || val === "none" ? "" : val, hasWebsite: step === "website" ? val.toLowerCase() !== "none" : f.hasWebsite }));
    if (step === "desc") finish({ ...form, projectDescription: val });
    else next(step, val);
  };

  const finish = async (payload: any) => {
    setSending(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, source: "chatbot" }),
      });
      const j = await res.json();
      if (j.ok) say("Perfect — thank you! Our team has your details and will reach out shortly. 🚀");
      else say("Thanks! Please also reach us directly below.");
    } catch { say("Thanks! Please reach us directly below."); }
    setSending(false);
    setStep("done");
  };

  const chips =
    step === "service" ? SERVICES : step === "budget" ? BUDGETS : step === "timeline" ? TIMELINES : null;
  const textStep = ["name", "business", "email", "phone", "website", "desc"].includes(step);
  const tel = `tel:${site.phone.replace(/\s/g, "")}`;

  return (
    <>
      <button onClick={() => setOpen((o) => !o)} data-cursor aria-label="Chat with us"
        className="fixed bottom-6 left-6 z-[86] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent-electric to-accent-purple shadow-[0_14px_40px_-12px_rgba(46,107,255,0.8)] transition-transform hover:scale-110">
        {open ? <X className="h-6 w-6 text-white" /> : <Bot className="h-6 w-6 text-white" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="glass fixed bottom-24 left-6 z-[86] flex h-[520px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-3xl">
            <div className="flex items-center gap-3 border-b border-white/10 p-4">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-accent-electric to-accent-purple"><Bot className="h-5 w-5" /></span>
              <div><p className="text-sm font-semibold">KS Digital Studio</p><p className="text-xs text-accent-cyan">● AI Assistant · online</p></div>
            </div>

            <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto p-4">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.from === "user" ? "bg-gradient-to-br from-accent-electric to-accent-purple text-white" : "bg-white/5 text-white/85"}`}>{m.text}</div>
                </div>
              ))}

              {chips && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {chips.map((c) => (
                    <button key={c} onClick={() => pick(c)} data-cursor className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition-colors hover:border-accent-blue/50 hover:text-white">{c}</button>
                  ))}
                </div>
              )}

              {step === "done" && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <a href="/contact" className="btn-magnetic btn-primary justify-center text-xs" data-cursor><ArrowRight className="h-3.5 w-3.5" /> Start Project</a>
                  <a href={site.calendly} target="_blank" rel="noopener noreferrer" className="btn-magnetic btn-ghost justify-center text-xs" data-cursor><CalendarCheck className="h-3.5 w-3.5" /> Book Call</a>
                  <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 rounded-full bg-[#25D366] py-2 text-xs font-medium text-white" data-cursor><MessageCircle className="h-3.5 w-3.5" /> WhatsApp</a>
                  <a href={`mailto:${site.email}`} className="btn-magnetic btn-ghost justify-center text-xs" data-cursor><Mail className="h-3.5 w-3.5" /> Email</a>
                </div>
              )}
            </div>

            {textStep && (
              <form onSubmit={(e) => { e.preventDefault(); submitText(); }} className="flex items-center gap-2 border-t border-white/10 p-3">
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your answer…" disabled={sending}
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm outline-none focus:border-accent-blue/60" />
                <button type="submit" disabled={sending} className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-accent-electric to-accent-purple" data-cursor><Send className="h-4 w-4" /></button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
