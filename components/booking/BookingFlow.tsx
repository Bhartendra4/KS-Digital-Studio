"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CalendarDays, CheckCircle2, Loader2, ArrowLeft, Video } from "lucide-react";
import { site } from "@/lib/site";

type MeetingType = { id: string; slug: string; name: string; durationMin: number; description?: string };
type Slot = { startISO: string; endISO: string; label: string };

const IST_OFFSET_MIN = 330;

/** Calendar dates (business timezone) for the next `days` days. */
function upcomingDates(days: number) {
  const out: { value: string; day: string; num: string; mon: string }[] = [];
  const nowLocal = new Date(Date.now() + IST_OFFSET_MIN * 60000);
  for (let i = 0; i < days; i++) {
    const d = new Date(nowLocal.getTime() + i * 86400000);
    const value = d.toISOString().slice(0, 10);
    out.push({
      value,
      day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getUTCDay()],
      num: String(d.getUTCDate()),
      mon: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getUTCMonth()],
    });
  }
  return out;
}

export default function BookingFlow() {
  const params = useSearchParams();
  const leadId = params.get("lead");

  const [types, setTypes] = useState<MeetingType[]>([]);
  const [tz, setTz] = useState("Asia/Kolkata");
  const [type, setType] = useState<MeetingType | null>(null);
  const [date, setDate] = useState<string>("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [step, setStep] = useState<"type" | "time" | "details" | "done">("type");
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", website: "", requirement: "", company_website: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmed, setConfirmed] = useState<any>(null);

  const dates = useMemo(() => upcomingDates(21), []);

  useEffect(() => {
    fetch("/api/booking/types").then((r) => r.json()).then((j) => {
      if (j.ok) { setTypes(j.types); setTz(j.timezone || "Asia/Kolkata"); }
    }).catch(() => {});
  }, []);

  const loadSlots = useCallback(async (slug: string, d: string) => {
    setLoadingSlots(true); setSlots([]); setSlot(null);
    try {
      const r = await fetch(`/api/booking/slots?type=${encodeURIComponent(slug)}&date=${d}`);
      const j = await r.json();
      setSlots(j.ok ? j.slots : []);
    } catch { setSlots([]); }
    setLoadingSlots(false);
  }, []);

  useEffect(() => { if (type && date) loadSlots(type.slug, date); }, [type, date, loadSlots]);

  const chooseType = (t: MeetingType) => {
    setType(t); setStep("time");
    const first = dates[0].value; setDate(first);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!type || !slot) { setErr("Please pick a time."); return; }
    if (form.name.trim().length < 2) { setErr("Please enter your name."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setErr("Please enter a valid email."); return; }
    setBusy(true);
    try {
      const r = await fetch("/api/booking", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, meetingType: type.slug, startISO: slot.startISO, leadId }),
      });
      const j = await r.json();
      if (!j.ok) {
        setErr(j.error || "Could not complete the booking.");
        if (j.code === "SLOT_TAKEN" && type && date) { await loadSlots(type.slug, date); setStep("time"); }
      } else { setConfirmed(j.booking); setStep("done"); }
    } catch { setErr("Network error. Please try again."); }
    setBusy(false);
  };

  const field = "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-accent-blue/60";

  if (step === "done" && confirmed) {
    const when = new Date(confirmed.startsAt);
    const local = new Date(when.getTime() + IST_OFFSET_MIN * 60000);
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card-border mx-auto max-w-xl p-8 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-accent-cyan" />
        <h2 className="mt-4 font-display text-2xl font-semibold text-gradient">Booking confirmed</h2>
        <p className="mt-2 text-sm text-white/60">A confirmation has been sent to {form.email}.</p>
        <div className="mt-6 space-y-2 rounded-2xl bg-white/[0.03] p-5 text-left text-sm">
          <Row k="Reference" v={confirmed.publicCode} />
          <Row k="Meeting" v={`${confirmed.meetingType} (${confirmed.durationMin} min)`} />
          <Row k="When" v={`${local.toUTCString().slice(0, 16)}, ${local.getUTCHours() % 12 || 12}:${String(local.getUTCMinutes()).padStart(2, "0")} ${local.getUTCHours() >= 12 ? "PM" : "AM"} (${confirmed.timezone})`} />
          <Row k="Where" v={confirmed.meetingUrl || confirmed.locationType.replace(/_/g, " ")} />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={`/booking/${confirmed.manageToken}`} className="btn-magnetic btn-ghost text-sm" data-cursor>Reschedule / Cancel</a>
          <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-magnetic btn-primary text-sm" data-cursor>WhatsApp us</a>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      {/* left: summary */}
      <div className="card-border h-fit p-6">
        <p className="text-xs uppercase tracking-widest text-white/40">KS Digital Studio</p>
        <h2 className="mt-1 font-display text-xl font-semibold">{type ? type.name : "Choose a meeting"}</h2>
        {type && <p className="mt-2 flex items-center gap-2 text-sm text-white/60"><Clock className="h-4 w-4 text-accent-cyan" /> {type.durationMin} minutes</p>}
        <p className="mt-2 flex items-center gap-2 text-sm text-white/60"><Video className="h-4 w-4 text-accent-cyan" /> Google Meet / phone</p>
        <p className="mt-2 flex items-center gap-2 text-sm text-white/60"><CalendarDays className="h-4 w-4 text-accent-cyan" /> Timezone: {tz}</p>
        {slot && <p className="mt-4 rounded-xl bg-white/5 p-3 text-sm text-accent-cyan">{new Date(slot.startISO).toDateString()} · {slot.label}</p>}
        {step !== "type" && (
          <button onClick={() => { setStep(step === "details" ? "time" : "type"); setErr(""); }}
            className="mt-5 flex items-center gap-2 text-xs text-white/50 hover:text-white" data-cursor>
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
        )}
      </div>

      {/* right: steps */}
      <div className="card-border p-6">
        <AnimatePresence mode="wait">
          {step === "type" && (
            <motion.div key="type" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <h3 className="font-display text-lg font-semibold">Select a meeting type</h3>
              {types.length === 0 && <p className="text-sm text-white/40">Loading meeting types…</p>}
              {types.map((t) => (
                <button key={t.slug} onClick={() => chooseType(t)} data-cursor
                  className="glass glass-hover flex w-full items-center justify-between rounded-2xl p-5 text-left">
                  <span>
                    <span className="block font-medium">{t.name}</span>
                    <span className="block text-xs text-white/50">{t.description}</span>
                  </span>
                  <span className="text-sm text-accent-cyan">{t.durationMin} min →</span>
                </button>
              ))}
            </motion.div>
          )}

          {step === "time" && type && (
            <motion.div key="time" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="font-display text-lg font-semibold">Pick a date &amp; time</h3>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {dates.map((d) => (
                  <button key={d.value} onClick={() => setDate(d.value)} data-cursor
                    className={`min-w-[64px] rounded-xl px-3 py-2 text-center text-xs transition-colors ${date === d.value ? "bg-white text-ink" : "glass text-white/70 hover:text-white"}`}>
                    <span className="block">{d.day}</span>
                    <span className="block text-lg font-semibold">{d.num}</span>
                    <span className="block">{d.mon}</span>
                  </button>
                ))}
              </div>
              <div className="mt-5">
                {loadingSlots && <p className="flex items-center gap-2 text-sm text-white/40"><Loader2 className="h-4 w-4 animate-spin" /> Checking availability…</p>}
                {!loadingSlots && slots.length === 0 && <p className="text-sm text-white/40">No times available on this date. Try another day.</p>}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {slots.map((s) => (
                    <button key={s.startISO} onClick={() => { setSlot(s); setStep("details"); }} data-cursor
                      className="glass glass-hover rounded-xl py-2.5 text-sm">{s.label}</button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === "details" && (
            <motion.form key="details" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <h3 className="font-display text-lg font-semibold">Your details</h3>
              {err && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{err}</div>}
              <input className="hidden" tabIndex={-1} autoComplete="off" value={form.company_website}
                onChange={(e) => setForm({ ...form, company_website: e.target.value })} />
              <div className="grid gap-3 sm:grid-cols-2">
                <input className={field} placeholder="Full name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className={field} placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input className={field} placeholder="Phone / WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <input className={field} placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </div>
              <input className={field} placeholder="Existing website (optional)" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              <textarea rows={4} className={field} placeholder="What would you like to build?" value={form.requirement} onChange={(e) => setForm({ ...form, requirement: e.target.value })} />
              <button disabled={busy} className="btn-magnetic btn-primary w-full justify-center disabled:opacity-60" data-cursor>
                {busy ? <>Confirming <Loader2 className="h-4 w-4 animate-spin" /></> : "Confirm booking"}
              </button>
              <p className="text-center text-[11px] text-white/30">You'll receive a confirmation email. No payment required.</p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between gap-4 border-b border-white/5 py-1.5"><span className="text-white/40">{k}</span><span className="text-right text-white/85">{v}</span></div>;
}
