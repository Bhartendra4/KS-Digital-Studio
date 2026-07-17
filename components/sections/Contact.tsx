"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle, CalendarCheck } from "lucide-react";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { site } from "@/lib/site";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", budget: "Professional", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e: Errors = {};
    if (form.name.trim().length < 2) e.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.message.trim().length < 10) e.message = "Tell us a bit more (10+ chars)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    // Wire to your email service / API route here.
    const subject = encodeURIComponent(`New project inquiry — ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nBudget: ${form.budget}\n\n${form.message}`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const field = "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-accent-blue/60";

  return (
    <Section id="contact">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Contact" title="Let's build something premium."
            subtitle="Tell us about your project and we'll get back within 24 hours." />
          <div className="mt-8 space-y-4">
            <a href={`mailto:${site.email}`} className="glass glass-hover flex items-center gap-4 rounded-2xl p-4" data-cursor>
              <Mail className="h-5 w-5 text-accent-cyan" /><span className="text-sm text-white/70">{site.email}</span>
            </a>
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="glass glass-hover flex items-center gap-4 rounded-2xl p-4" data-cursor>
              <Phone className="h-5 w-5 text-accent-cyan" /><span className="text-sm text-white/70">{site.phone}</span>
            </a>
            <div className="glass flex items-center gap-4 rounded-2xl p-4">
              <MapPin className="h-5 w-5 text-accent-cyan" /><span className="text-sm text-white/70">{site.address}</span>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="btn-magnetic btn-ghost text-sm" data-cursor>
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <a href={site.calendly} target="_blank" rel="noopener noreferrer"
                className="btn-magnetic btn-primary text-sm" data-cursor>
                <CalendarCheck className="h-4 w-4" /> Book a call
              </a>
            </div>
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            <iframe src={site.map} width="100%" height="200" loading="lazy" title="Map"
              referrerPolicy="no-referrer-when-downgrade" style={{ filter: "invert(0.9) hue-rotate(180deg)" }} />
          </div>
        </div>

        <motion.form onSubmit={onSubmit} noValidate
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7 }} className="card-border space-y-5 p-8">
          {sent && (
            <div className="rounded-xl border border-accent-cyan/30 bg-accent-cyan/10 p-4 text-sm text-accent-cyan">
              Thanks! Your mail client should open — or reach us directly at {site.email}.
            </div>
          )}
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-white/50">Name</label>
            <input className={field} placeholder="Jane Doe" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-white/50">Email</label>
            <input className={field} placeholder="jane@company.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-white/50">Budget</label>
            <select className={field} value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}>
              <option className="bg-ink">Starter</option>
              <option className="bg-ink">Professional</option>
              <option className="bg-ink">Enterprise</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-white/50">Project details</label>
            <textarea rows={4} className={field} placeholder="Tell us what you're building..."
              value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
          </div>
          <button type="submit" className="btn-magnetic btn-primary w-full justify-center" data-cursor>
            Send inquiry <Send className="h-4 w-4" />
          </button>
        </motion.form>
      </div>
    </Section>
  );
}
