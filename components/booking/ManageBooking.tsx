"use client";
import { useState } from "react";
import { CalendarDays, XCircle, CheckCircle2, Loader2 } from "lucide-react";

type B = {
  publicCode: string; meetingType: string; durationMin: number; startsAt: string;
  timezone: string; status: string; meetingUrl: string | null; locationType: string; name: string;
};

export default function ManageBooking({ token, booking }: { token: string; booking: B }) {
  const [status, setStatus] = useState(booking.status);
  const [busy, setBusy] = useState(false);

  const local = new Date(new Date(booking.startsAt).getTime() + 330 * 60000);
  const when = `${local.toUTCString().slice(0, 16)}, ${local.getUTCHours() % 12 || 12}:${String(local.getUTCMinutes()).padStart(2, "0")} ${local.getUTCHours() >= 12 ? "PM" : "AM"}`;

  const cancel = async () => {
    if (!confirm("Cancel this consultation?")) return;
    setBusy(true);
    try {
      const r = await fetch("/api/booking/cancel", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const j = await r.json();
      if (j.ok) setStatus("cancelled");
    } catch {}
    setBusy(false);
  };

  const cancelled = status === "cancelled";

  return (
    <div className="card-border p-8">
      <div className={`mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${cancelled ? "bg-red-500/15 text-red-300" : "bg-accent-cyan/15 text-accent-cyan"}`}>
        {cancelled ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
        {cancelled ? "Cancelled" : "Confirmed"}
      </div>

      <div className="space-y-2 text-sm">
        <Row k="Reference" v={booking.publicCode} />
        <Row k="Name" v={booking.name} />
        <Row k="Meeting" v={`${booking.meetingType} (${booking.durationMin} min)`} />
        <Row k="When" v={`${when} (${booking.timezone})`} />
        <Row k="Where" v={booking.meetingUrl || booking.locationType.replace(/_/g, " ")} />
      </div>

      {!cancelled && (
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="/book" className="btn-magnetic btn-primary text-sm" data-cursor>
            <CalendarDays className="h-4 w-4" /> Pick a new time
          </a>
          <button onClick={cancel} disabled={busy} className="btn-magnetic btn-ghost text-sm disabled:opacity-60" data-cursor>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />} Cancel booking
          </button>
        </div>
      )}
      {cancelled && (
        <a href="/book" className="btn-magnetic btn-primary mt-7 text-sm" data-cursor>Book a new consultation</a>
      )}
      <p className="mt-4 text-[11px] text-white/30">
        To reschedule, cancel this booking and pick a new time — your old slot is released immediately.
      </p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between gap-4 border-b border-white/5 py-2"><span className="text-white/40">{k}</span><span className="text-right text-white/85">{v}</span></div>;
}
