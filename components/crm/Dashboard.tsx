"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Flame, Send, CheckCircle2, TrendingUp, Search, LogOut, X,
  Bot, FileText, Download, Trash2, RefreshCw, Sparkles,
} from "lucide-react";
import type { Lead, LeadStatus } from "@/lib/crm-types";
import { FoldMark } from "@/components/brand/Logo";

const STATUSES: LeadStatus[] = ["new", "contacted", "replied", "qualified", "proposal_sent", "won", "lost"];
const tierColor: Record<string, string> = { hot: "#F97316", warm: "#F59E0B", cold: "#4F7BFF" };

export default function Dashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [tierF, setTierF] = useState("all");
  const [statusF, setStatusF] = useState("all");
  const [sort, setSort] = useState<"score" | "value" | "recent">("recent");
  const [active, setActive] = useState<Lead | null>(null);

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/leads");
    if (r.status === 401) { router.push("/admin/login"); return; }
    const j = await r.json();
    setLeads(j.leads || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []); // eslint-disable-line

  const stats = useMemo(() => {
    const by = (s: LeadStatus) => leads.filter((l) => l.status === s).length;
    const pipeline = leads.filter((l) => ["qualified", "proposal_sent"].includes(l.status)).reduce((a, l) => a + (l.estimatedValue || 0), 0);
    const contacted = leads.filter((l) => l.status !== "new").length;
    const due = leads.filter((l) => l.nextFollowUp && new Date(l.nextFollowUp) <= new Date() && !["won", "lost"].includes(l.status)).length;
    return {
      total: leads.length, new: by("new"), hot: leads.filter((l) => l.tier === "hot").length,
      contacted, replied: by("replied"), qualified: by("qualified"), proposal: by("proposal_sent"),
      won: by("won"), lost: by("lost"), pipeline,
      conv: leads.length ? Math.round((by("won") / leads.length) * 100) : 0,
      resp: contacted ? Math.round((by("replied") / contacted) * 100) : 0, due,
    };
  }, [leads]);

  const filtered = useMemo(() => {
    let list = leads.filter((l) =>
      (tierF === "all" || l.tier === tierF) &&
      (statusF === "all" || l.status === statusF) &&
      (!q || `${l.businessName} ${l.email} ${l.industry} ${l.location}`.toLowerCase().includes(q.toLowerCase())));
    list = [...list].sort((a, b) =>
      sort === "score" ? b.leadScore - a.leadScore :
      sort === "value" ? (b.estimatedValue || 0) - (a.estimatedValue || 0) :
      (a.createdAt < b.createdAt ? 1 : -1));
    return list;
  }, [leads, q, tierF, statusF, sort]);

  const updateStatus = async (id: string, status: LeadStatus) => {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    await fetch("/api/admin/leads", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, status }) });
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    setLeads((ls) => ls.filter((l) => l.id !== id)); setActive(null);
    await fetch("/api/admin/leads", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ id }) });
  };
  const logout = async () => { await fetch("/api/admin/logout", { method: "POST" }); router.push("/admin/login"); };

  const exportCSV = () => {
    const cols = ["businessName", "contactName", "email", "phone", "industry", "location", "website", "leadScore", "tier", "status", "budget", "timeline", "estimatedValue", "source", "createdAt"];
    const rows = filtered.map((l) => cols.map((c) => `"${String((l as any)[c] ?? "").replace(/"/g, '""')}"`).join(","));
    const csv = [cols.join(","), ...rows].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = "ksds-leads.csv"; a.click(); URL.revokeObjectURL(url);
  };

  const statCards = [
    { label: "Total Leads", value: stats.total, icon: Users, c: "#4F7BFF" },
    { label: "New", value: stats.new, icon: Sparkles, c: "#22D3EE" },
    { label: "Hot Leads", value: stats.hot, icon: Flame, c: "#F97316" },
    { label: "Contacted", value: stats.contacted, icon: Send, c: "#8B5CF6" },
    { label: "Qualified", value: stats.qualified, icon: CheckCircle2, c: "#34D399" },
    { label: "Proposals", value: stats.proposal, icon: FileText, c: "#F59E0B" },
    { label: "Won", value: stats.won, icon: TrendingUp, c: "#34D399" },
    { label: "Follow-ups Due", value: stats.due, icon: RefreshCw, c: "#F472B6" },
  ];

  return (
    <div className="min-h-screen bg-ink px-4 py-6 md:px-8">
      {/* header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04]">
            <FoldMark className="h-5 w-5 text-white" />
          </span>
          <div>
            <h1 className="font-display text-xl font-semibold">Lead &amp; Sales CRM</h1>
            <p className="text-[10px] tracking-[0.25em] text-white/40">KS DIGITAL STUDIO · PRIVATE DASHBOARD</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="glass rounded-xl p-2.5 text-white/70 hover:text-white" title="Refresh"><RefreshCw className="h-4 w-4" /></button>
          <button onClick={exportCSV} className="glass flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/80 hover:text-white"><Download className="h-4 w-4" /> CSV</button>
          <button onClick={logout} className="glass flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/80 hover:text-white"><LogOut className="h-4 w-4" /> Logout</button>
        </div>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="card-border p-4">
            <s.icon className="h-4 w-4" style={{ color: s.c }} />
            <div className="mt-2 font-display text-2xl font-bold">{s.value}</div>
            <div className="text-[11px] text-white/50">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* pipeline + rates */}
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="card-border p-5">
          <p className="text-xs text-white/50">Revenue Pipeline</p>
          <p className="mt-1 font-display text-3xl font-bold text-gradient">₹{stats.pipeline.toLocaleString("en-IN")}</p>
        </div>
        <div className="card-border p-5">
          <p className="text-xs text-white/50">Conversion Rate</p>
          <p className="mt-1 font-display text-3xl font-bold">{stats.conv}%</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-accent-electric to-accent-cyan" style={{ width: `${stats.conv}%` }} /></div>
        </div>
        <div className="card-border p-5">
          <p className="text-xs text-white/50">Response Rate</p>
          <p className="mt-1 font-display text-3xl font-bold">{stats.resp}%</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-accent-purple to-accent-blue" style={{ width: `${stats.resp}%` }} /></div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_340px]">
        {/* leads table */}
        <div className="card-border overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 p-3">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search leads…"
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2 pl-9 pr-3 text-sm outline-none focus:border-accent-blue/60" />
            </div>
            <select value={tierF} onChange={(e) => setTierF(e.target.value)} className="rounded-lg border border-white/10 bg-ink-700 px-2 py-2 text-xs">
              <option value="all">All tiers</option><option value="hot">Hot</option><option value="warm">Warm</option><option value="cold">Cold</option>
            </select>
            <select value={statusF} onChange={(e) => setStatusF(e.target.value)} className="rounded-lg border border-white/10 bg-ink-700 px-2 py-2 text-xs">
              <option value="all">All status</option>{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="rounded-lg border border-white/10 bg-ink-700 px-2 py-2 text-xs">
              <option value="recent">Recent</option><option value="score">Score</option><option value="value">Value</option>
            </select>
          </div>

          <div className="max-h-[560px] overflow-auto">
            {loading ? <p className="p-8 text-center text-sm text-white/40">Loading…</p> :
              filtered.length === 0 ? <p className="p-8 text-center text-sm text-white/40">No leads yet. They appear here from the website chatbot & contact form.</p> :
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-ink-800 text-left text-xs text-white/40">
                  <tr><th className="p-3">Business</th><th className="p-3">Score</th><th className="p-3 hidden md:table-cell">Service</th><th className="p-3">Status</th><th className="p-3"></th></tr>
                </thead>
                <tbody>
                  {filtered.map((l) => (
                    <tr key={l.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                      <td className="p-3 cursor-pointer" onClick={() => setActive(l)}>
                        <div className="font-medium">{l.businessName}</div>
                        <div className="text-xs text-white/40">{l.contactName || l.email || l.industry || "—"}</div>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: `${tierColor[l.tier]}22`, color: tierColor[l.tier] }}>
                          {l.leadScore} · {l.tier.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 hidden md:table-cell text-xs text-white/60">{(l.servicesNeeded || []).join(", ") || "—"}</td>
                      <td className="p-3">
                        <select value={l.status} onChange={(e) => updateStatus(l.id, e.target.value as LeadStatus)}
                          className="rounded-md border border-white/10 bg-ink-700 px-2 py-1 text-xs">
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="p-3 text-right"><button onClick={() => remove(l.id)} className="text-white/30 hover:text-red-400"><Trash2 className="h-4 w-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>}
          </div>
        </div>

        {/* AI assistant */}
        <AiAssistant />
      </div>

      {/* lead drawer */}
      <AnimatePresence>
        {active && <LeadDrawer lead={active} onClose={() => setActive(null)} onDelete={remove} />}
      </AnimatePresence>
    </div>
  );
}

function AiAssistant() {
  const quick = ["Show me hot leads", "Show follow-ups due today", "Show my pipeline", "Which leads are most likely to convert?", "Prepare today's sales report"];
  const [log, setLog] = useState<{ from: "you" | "ai"; text: string }[]>([{ from: "ai", text: "Ask me about your leads, pipeline, or follow-ups." }]);
  const [q, setQ] = useState(""); const [busy, setBusy] = useState(false);
  const ask = async (prompt: string) => {
    if (!prompt.trim()) return;
    setLog((l) => [...l, { from: "you", text: prompt }]); setQ(""); setBusy(true);
    const r = await fetch("/api/admin/ai", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "assistant", prompt }) });
    const j = await r.json();
    setLog((l) => [...l, { from: "ai", text: j.reply || "No answer." }]); setBusy(false);
  };
  return (
    <div className="card-border flex h-fit flex-col p-4">
      <div className="mb-3 flex items-center gap-2"><Bot className="h-4 w-4 text-accent-cyan" /><span className="text-sm font-semibold">AI Sales Assistant</span></div>
      <div className="mb-3 max-h-64 space-y-2 overflow-auto">
        {log.map((m, i) => (
          <div key={i} className={`rounded-xl px-3 py-2 text-xs ${m.from === "you" ? "ml-6 bg-gradient-to-br from-accent-electric to-accent-purple text-white" : "mr-4 bg-white/5 text-white/85"}`}>{m.text}</div>
        ))}
        {busy && <div className="mr-4 rounded-xl bg-white/5 px-3 py-2 text-xs text-white/40">Thinking…</div>}
      </div>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {quick.map((qz) => <button key={qz} onClick={() => ask(qz)} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70 hover:text-white">{qz}</button>)}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); ask(q); }} className="flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask the assistant…" className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs outline-none focus:border-accent-blue/60" />
        <button className="rounded-lg bg-gradient-to-br from-accent-electric to-accent-purple px-3 text-xs">Ask</button>
      </form>
    </div>
  );
}

function LeadDrawer({ lead, onClose, onDelete }: { lead: Lead; onClose: () => void; onDelete: (id: string) => void }) {
  const [tab, setTab] = useState<"info" | "audit" | "outreach" | "proposal">("info");
  const [draft, setDraft] = useState<any>(null);
  const [proposal, setProposal] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  const gen = async (action: "outreach" | "proposal", kind?: string) => {
    setBusy(true);
    const r = await fetch("/api/admin/ai", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action, leadId: lead.id, kind }) });
    const j = await r.json();
    if (action === "outreach") setDraft(j.message); else setProposal(j.proposal);
    setBusy(false);
  };

  return (
    <motion.div data-print-reset className="fixed inset-0 z-[95] flex justify-end bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.aside data-print-reset initial={{ x: 480 }} animate={{ x: 0 }} exit={{ x: 480 }} transition={{ ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-md overflow-auto bg-ink-800 p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold">{lead.businessName}</h2>
            <p className="text-xs text-white/50">{lead.industry || "—"}{lead.location ? " · " + lead.location : ""}</p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium" style={{ background: `${tierColor[lead.tier]}22`, color: tierColor[lead.tier] }}>
          Score {lead.leadScore}/100 · {lead.tier.toUpperCase()} LEAD
        </div>

        <div className="mb-4 flex gap-1 text-xs">
          {(["info", "audit", "outreach", "proposal"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-3 py-1.5 capitalize ${tab === t ? "bg-white text-ink" : "bg-white/5 text-white/60"}`}>{t}</button>
          ))}
        </div>

        {tab === "info" && (
          <div className="space-y-2 text-sm">
            {[["Contact", lead.contactName], ["Email", lead.email], ["Phone", lead.phone], ["Website", lead.website], ["Service", (lead.servicesNeeded || []).join(", ")], ["Budget", lead.budget], ["Timeline", lead.timeline], ["Est. value", lead.estimatedValue ? "₹" + lead.estimatedValue.toLocaleString("en-IN") : ""], ["Source", lead.source], ["Notes", lead.notes]].map(([k, v]) => (
              <div key={k as string} className="flex justify-between gap-4 border-b border-white/5 py-1.5"><span className="text-white/40">{k}</span><span className="text-right text-white/85">{(v as string) || "—"}</span></div>
            ))}
            <div className="pt-2">
              <p className="mb-1 text-xs text-white/40">Why this score</p>
              <ul className="space-y-1 text-xs text-white/60">{lead.scoreReasons.map((r, i) => <li key={i}>• {r}</li>)}</ul>
            </div>
          </div>
        )}

        {tab === "audit" && lead.audit && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-4 gap-2">
              {Object.entries({ "UI/UX": lead.audit.uiux, Mobile: lead.audit.mobile, Speed: lead.audit.speed, SEO: lead.audit.seo, A11y: lead.audit.accessibility, Content: lead.audit.content, CTA: lead.audit.cta, Trust: lead.audit.trust }).map(([k, v]) => (
                <div key={k} className="rounded-lg bg-white/5 p-2 text-center"><div className="font-display text-lg font-bold" style={{ color: (v as number) < 50 ? "#F97316" : "#34D399" }}>{v as number}</div><div className="text-[10px] text-white/40">{k}</div></div>
              ))}
            </div>
            <div><p className="mb-1 text-xs text-white/40">Problems</p><ul className="space-y-1 text-xs text-white/70">{lead.audit.problems.map((p, i) => <li key={i}>• {p}</li>)}</ul></div>
            <div><p className="mb-1 text-xs text-white/40">Recommended</p><ul className="space-y-1 text-xs text-white/70">{lead.audit.improvements.map((p, i) => <li key={i}>• {p}</li>)}</ul></div>
            <p className="text-xs text-accent-cyan">{lead.audit.estimatedScope}</p>
          </div>
        )}

        {tab === "outreach" && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {["cold", "followup", "value", "final"].map((k) => (
                <button key={k} disabled={busy} onClick={() => gen("outreach", k)} className="rounded-lg bg-white/5 px-3 py-1.5 text-xs capitalize hover:bg-white/10">{k}</button>
              ))}
            </div>
            {busy && <p className="text-xs text-white/40">Generating…</p>}
            {draft && (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <p className="mb-1 text-xs text-white/40">Subject</p>
                <p className="mb-2 text-sm font-medium">{draft.subject}</p>
                <textarea defaultValue={draft.body} rows={10} className="w-full rounded-lg border border-white/10 bg-ink px-3 py-2 text-xs" />
                <p className="mt-2 text-[11px] text-white/40">Draft only — review &amp; approve before sending. Nothing is sent automatically.</p>
              </div>
            )}
          </div>
        )}

        {tab === "proposal" && (
          <div className="space-y-3">
            <button disabled={busy} onClick={() => gen("proposal")} className="btn-magnetic btn-primary text-xs">Generate proposal</button>
            {busy && <p className="text-xs text-white/40">Generating…</p>}
            {proposal && (
              <div id="proposal-print" className="space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
                {/* branded letterhead — also printed */}
                <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="flex items-center gap-2.5">
                    <FoldMark className="h-6 w-6 text-white" />
                    <span className="leading-none">
                      <span className="block text-[13px] font-bold tracking-tight">KS</span>
                      <span className="mt-[2px] block text-[7px] tracking-[0.3em] text-white/50">DIGITAL STUDIO</span>
                    </span>
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/35">Proposal</span>
                </div>
                <h3 className="font-display text-lg font-semibold">Proposal — {proposal.business}</h3>
                <P k="Requirements" v={proposal.requirements} />
                <P k="Solution" v={proposal.solution} />
                <P k="Timeline" v={proposal.timeline} />
                <P k="Investment" v={proposal.investment} />
                <div><p className="text-xs text-white/40">Features</p><ul className="text-xs text-white/70">{proposal.features.map((f: string, i: number) => <li key={i}>• {f}</li>)}</ul></div>
                <div><p className="text-xs text-white/40">Deliverables</p><ul className="text-xs text-white/70">{proposal.deliverables.map((f: string, i: number) => <li key={i}>• {f}</li>)}</ul></div>
                <p className="mt-3 border-t border-white/10 pt-3 text-[10px] text-white/40">
                  KS Digital Studio · info@ksdigitalstudio.in · ksdigitalstudio.in
                </p>
                <button onClick={() => window.print()} data-print-hide className="mt-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs">Save as PDF (print)</button>
              </div>
            )}
          </div>
        )}

        <button onClick={() => onDelete(lead.id)} className="mt-6 flex items-center gap-2 text-xs text-red-400/70 hover:text-red-400"><Trash2 className="h-4 w-4" /> Delete lead</button>
      </motion.aside>
    </motion.div>
  );
}

function P({ k, v }: { k: string; v: string }) {
  return <div><p className="text-xs text-white/40">{k}</p><p className="whitespace-pre-wrap text-xs text-white/80">{v}</p></div>;
}
