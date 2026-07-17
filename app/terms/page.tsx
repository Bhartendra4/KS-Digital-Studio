import PageHero from "@/components/ui/PageHero";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Terms of Service", "The terms governing use of the KS Digital Studio website and services.", "/terms");

const sections = [
  { h: "Acceptance of terms", p: "By accessing this website or engaging our services, you agree to these terms. If you do not agree, please do not use the site." },
  { h: "Services", p: "We provide design, development, SEO, AI and related digital services under separate written agreements that define scope, timelines and deliverables." },
  { h: "Intellectual property", p: "Website content and branding are owned by KS Digital Studio. Upon full payment, project deliverables are transferred to the client as defined in the project agreement." },
  { h: "Payments", p: "Fees, milestones and payment schedules are set out in each project agreement. Late payments may pause work until resolved." },
  { h: "Limitation of liability", p: "To the maximum extent permitted by law, KS Digital Studio is not liable for indirect or consequential damages arising from use of the website or services." },
  { h: "Changes", p: "We may update these terms from time to time. Continued use of the site constitutes acceptance of the updated terms." },
];

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" subtitle="Last updated: July 2026" />
      <article className="mx-auto max-w-3xl px-5 pb-24 md:px-10">
        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.h}>
              <h2 className="font-display text-xl font-semibold text-gradient">{s.h}</h2>
              <p className="mt-2 text-white/60 leading-relaxed">{s.p}</p>
            </div>
          ))}
          <p className="text-sm text-white/40">This template is provided for convenience and is not legal advice. Have it reviewed before publishing.</p>
        </div>
      </article>
    </>
  );
}
