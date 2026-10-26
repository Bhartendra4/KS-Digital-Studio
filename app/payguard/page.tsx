import { Check, ShieldCheck, FileSpreadsheet, Timer, IndianRupee, Lock, ListChecks } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/fx/Reveal";
import Button from "@/components/ui/Button";
import CTA from "@/components/sections/CTA";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "MSME PayGuard — 43B(h) & MSME Form 1 compliance software",
  "Find Micro/Small vendor bills at risk under Section 43B(h), see the extra tax and MSMED interest, and export MSME Form 1 and Form 3CD Clause 22 schedules. Runs in your browser.",
  "/payguard"
);

const wa = (plan: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hi KS Digital Studio, I want to buy MSME PayGuard — ${plan} plan. Company name: `)}`;

const plans = [
  { name: "Starter", price: "₹9,999", per: "/ year", tag: "1 company · up to 200 vendors", features: ["Unlimited bills", "43B(h) disallowance & tax impact", "MSMED interest", "Pay-this-week list", "CSV / PDF exports"], hot: false },
  { name: "Business", price: "₹24,999", per: "/ year", tag: "1 company · unlimited vendors", features: ["Everything in Starter", "MSME Form 1 schedule", "Form 3CD Clause 22 working", "Data checks (Udyam, >45-day terms)", "Priority email support"], hot: true },
  { name: "CA Firm", price: "₹49,999", per: "/ year", tag: "Up to 50 client companies", features: ["Everything in Business", "Use for all audit clients", "Branded reports", "Onboarding call", "Bulk Udyam check (add-on)"], hot: false },
  { name: "Enterprise", price: "Custom", per: "", tag: "ERP integration · on-premise", features: ["Tally / SAP import", "Multiple entities", "Sign-off workflow", "Dedicated support", "Custom reports"], hot: false },
];

const features = [
  { icon: FileSpreadsheet, t: "Upload from Tally or Excel", d: "Vendor master and purchase bills as .xlsx or .csv. No ERP change needed." },
  { icon: Timer, t: "Pay-this-week list", d: "Unpaid MSME bills ranked by deadline, with the tax you keep by paying each one on time." },
  { icon: IndianRupee, t: "Tax & interest in rupees", d: "43B(h) disallowance, extra income tax and MSMED Act interest at 3× the RBI bank rate." },
  { icon: ListChecks, t: "Auditor-ready schedules", d: "MSME Form 1 list and Form 3CD Clause 22 working, exported as CSV or PDF." },
  { icon: ShieldCheck, t: "Data checks", d: "Flags wrong Udyam numbers, payment terms over 45 days, traders and unknown vendors." },
  { icon: Lock, t: "Private by design", d: "Everything runs inside your browser. Your financial data is never uploaded." },
];

const faqs = [
  { q: "Who needs this?", a: "Any company with a tax audit that buys goods or services from Micro or Small enterprises registered on Udyam, and the CA firms who audit them." },
  { q: "Is my data uploaded anywhere?", a: "No. Files are read and calculated inside your own browser. Nothing is sent to our servers." },
  { q: "Does Tally already do this?", a: "Tally can tag MSME vendors. PayGuard adds the rupee tax impact, a prioritised pay list, MSMED interest, data checks and ready Clause 22 / Form 1 schedules in one screen, and also works with Busy, SAP or plain Excel." },
  { q: "How does the licence work?", a: "After payment you receive a licence key. Paste it into the app once (Enter licence) and all limits are removed for your plan's period. The free trial checks up to 25 bills on screen." },
  { q: "Is this tax advice?", a: "PayGuard is a decision-support tool based on Section 43B(h) and Sections 15–16 of the MSMED Act. Final figures should be confirmed by your tax auditor." },
];

export default function PayGuardPage() {
  return (
    <>
      <PageHero eyebrow="Software · MSME PayGuard" title="Stop losing tax on late MSME payments."
        subtitle="Upload your purchase bills and vendor list. PayGuard shows which Micro/Small vendor bills are at risk under Section 43B(h), the extra tax and MSMED interest, and exports MSME Form 1 and Clause 22 schedules — in two minutes." />

      <section className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-wrap gap-3">
          <Button href="/payguard/app/">Start free trial</Button>
          <Button href="#pricing" variant="ghost">See pricing</Button>
        </div>
        <p className="mt-3 text-sm text-white/60">Free trial: up to 25 bills, no sign-up. Try it with sample data in one click.</p>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-10">
        <h2 className="font-display text-3xl font-semibold md:text-5xl">The rule most companies miss</h2>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[["15 / 45 days", "Micro & Small vendors must be paid within 15 days, or at most 45 days with a written agreement."],
            ["No deduction", "If the limit has passed and the bill is still unpaid at year end, the expense is not deductible that year (Section 43B(h))."],
            ["3× RBI rate", "Late payments carry MSMED Act interest, compounded monthly, which is also not deductible."]].map(([a, b], i) => (
            <Reveal key={a} delay={i * 0.08}>
              <div className="card-border h-full p-7">
                <div className="font-display text-3xl font-semibold text-gradient">{a}</div>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{b}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-sm text-white/60">Example from our sample data: ₹11.58 lakh of late bills → about <b className="text-white">₹2.91 lakh of extra tax</b> for one small company in one year.</p>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-20 md:px-10">
        <h2 className="font-display text-3xl font-semibold md:text-5xl">What PayGuard does</h2>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.t} delay={(i % 3) * 0.06}>
              <div className="card-border h-full p-6">
                <f.icon className="h-6 w-6 text-accent-cyan" aria-hidden="true" />
                <h3 className="mt-4 font-display text-lg font-semibold">{f.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-[1440px] scroll-mt-28 px-5 pb-20 md:px-10">
        <h2 className="font-display text-3xl font-semibold md:text-5xl">Pricing</h2>
        <p className="mt-3 text-white/65">Yearly licence. Prices exclude GST. Pay securely by bank transfer / UPI against a GST invoice.</p>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((p) => (
            <div key={p.name} className={`card-border flex h-full flex-col p-7 ${p.hot ? "ring-1 ring-accent-blue/60" : ""}`}>
              {p.hot && <span className="mb-3 w-fit rounded-full bg-accent-blue/20 px-3 py-1 text-xs font-semibold text-white">Most popular</span>}
              <h3 className="font-display text-xl font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-white/65">{p.tag}</p>
              <div className="mt-5 font-display text-4xl font-semibold">{p.price}<span className="text-base font-normal text-white/60"> {p.per}</span></div>
              <ul className="mt-6 space-y-2 text-sm text-white/75">
                {p.features.map((f) => (<li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-cyan" aria-hidden="true" />{f}</li>))}
              </ul>
              <div className="mt-auto pt-7">
                <Button href={wa(p.name)} variant={p.hot ? "primary" : "ghost"} className="w-full justify-center">
                  {p.name === "Enterprise" ? "Talk to us" : `Buy ${p.name}`}
                </Button>
                <a href={`mailto:${site.email}?subject=${encodeURIComponent(`MSME PayGuard — ${p.name} plan`)}`} className="mt-3 block text-center text-xs text-white/60 underline">or email us</a>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-white/60">CA firms: free use for this audit season in exchange for feedback — <a className="underline" href={wa("CA Firm pilot")}>ask for a pilot</a>.</p>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-20 md:px-10">
        <h2 className="font-display text-3xl font-semibold md:text-5xl">FAQ</h2>
        <div className="mt-8 divide-y divide-white/10">
          {faqs.map((f) => (
            <details key={f.q} className="py-5">
              <summary className="cursor-pointer font-display text-lg font-medium">{f.q}</summary>
              <p className="pt-3 text-sm leading-relaxed text-white/65">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
