"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Loader2 } from "lucide-react";

function LoginInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: u, password: p }),
      });
      if (res.ok) router.push(sp.get("next") || "/admin");
      else setErr("Invalid username or password.");
    } catch { setErr("Something went wrong."); }
    setBusy(false);
  };

  const field = "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-accent-blue/60";
  return (
    <div className="relative flex min-h-screen items-center justify-center px-5">
      <div className="aurora" />
      <motion.form onSubmit={submit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="card-border relative z-10 w-full max-w-sm space-y-5 p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-accent-electric to-accent-purple"><Lock className="h-5 w-5" /></span>
          <div>
            <h1 className="font-display text-lg font-semibold">CRM Admin</h1>
            <p className="text-xs text-white/50">KS Digital Studio — private</p>
          </div>
        </div>
        {err && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{err}</div>}
        <div>
          <label className="mb-2 block text-xs uppercase tracking-widest text-white/50">Username</label>
          <input className={field} value={u} onChange={(e) => setU(e.target.value)} autoComplete="username" />
        </div>
        <div>
          <label className="mb-2 block text-xs uppercase tracking-widest text-white/50">Password</label>
          <input type="password" className={field} value={p} onChange={(e) => setP(e.target.value)} autoComplete="current-password" />
        </div>
        <button disabled={busy} className="btn-magnetic btn-primary w-full justify-center disabled:opacity-60" data-cursor>
          {busy ? <>Signing in <Loader2 className="h-4 w-4 animate-spin" /></> : "Sign in"}
        </button>
        <p className="text-center text-[11px] text-white/30">Set ADMIN_USERNAME / ADMIN_PASSWORD in your environment.</p>
      </motion.form>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={null}><LoginInner /></Suspense>;
}
