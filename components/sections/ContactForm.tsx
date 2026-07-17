"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { site } from "@/lib/site";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  budget: z.enum(["Starter", "Professional", "Enterprise"]),
  message: z.string().min(10, "Tell us a bit more (10+ characters)"),
  company: z.string().max(0).optional(), // honeypot — must stay empty
});
type FormData = z.infer<typeof schema>;

export default function ContactForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema), defaultValues: { budget: "Professional" },
  });

  const onSubmit = async (data: FormData) => {
    if (data.company) return; // bot caught by honeypot
    setStatus("sending");
    const hasKey = site.web3formsKey && site.web3formsKey !== "YOUR_WEB3FORMS_ACCESS_KEY";
    try {
      if (hasKey) {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: site.web3formsKey, subject: `New inquiry — ${data.name}`,
            name: data.name, email: data.email, budget: data.budget, message: data.message,
          }),
        });
        if (!res.ok) throw new Error("failed");
      } else {
        // Fallback: open the visitor's mail client if no Web3Forms key is set.
        const subject = encodeURIComponent(`New project inquiry — ${data.name}`);
        const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\nBudget: ${data.budget}\n\n${data.message}`);
        window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      }
      router.push("/thank-you");
    } catch {
      setStatus("error");
    }
  };

  const field = "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-accent-blue/60";

  return (
    <motion.form onSubmit={handleSubmit(onSubmit)} noValidate
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.7 }} className="card-border space-y-5 p-8">
      {status === "error" && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          Something went wrong. Please email us directly at {site.email}.
        </div>
      )}
      {/* honeypot */}
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("company")} />

      <div>
        <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-widest text-white/50">Name</label>
        <input id="name" className={field} placeholder="Jane Doe" {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-widest text-white/50">Email</label>
        <input id="email" className={field} placeholder="jane@company.com" {...register("email")} />
        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="budget" className="mb-2 block text-xs uppercase tracking-widest text-white/50">Budget</label>
        <select id="budget" className={field} {...register("budget")}>
          <option className="bg-ink">Starter</option>
          <option className="bg-ink">Professional</option>
          <option className="bg-ink">Enterprise</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-widest text-white/50">Project details</label>
        <textarea id="message" rows={4} className={field} placeholder="Tell us what you're building..." {...register("message")} />
        {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
      </div>
      <button type="submit" disabled={status === "sending"} className="btn-magnetic btn-primary w-full justify-center disabled:opacity-60" data-cursor>
        {status === "sending" ? <>Sending <Loader2 className="h-4 w-4 animate-spin" /></> : <>Send inquiry <Send className="h-4 w-4" /></>}
      </button>
      <p className="text-center text-xs text-white/30">Protected against spam · We reply within 24 hours</p>
    </motion.form>
  );
}
