import PageHero from "@/components/ui/PageHero";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Privacy Policy", "How KS Digital Studio collects, uses and protects your data.", "/privacy");

const sections = [
  { h: "Information we collect", p: "We collect information you provide directly — such as your name, email and message when you contact us — and basic analytics data (via cookies) about how you use our website." },
  { h: "How we use it", p: "We use your information to respond to inquiries, deliver our services, improve our website and, with your consent, send occasional updates. We never sell your data." },
  { h: "Cookies & analytics", p: "We use privacy-friendly analytics to understand traffic. You can accept or decline non-essential cookies via the banner. Declining will not break core functionality." },
  { h: "Data sharing", p: "We only share data with trusted processors (e.g. email and analytics providers) strictly to operate our services, and we require them to protect your data." },
  { h: "Your rights", p: "You may request access to, correction of, or deletion of your personal data at any time by emailing us. We will respond promptly." },
  { h: "Contact", p: `Questions about this policy? Email ${'hello@ksdigitalstudio.com'}.` },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" subtitle="Last updated: July 2026" />
      <article className="mx-auto max-w-3xl px-5 pb-24 md:px-10">
        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.h}>
              <h2 className="font-display text-xl font-semibold text-gradient">{s.h}</h2>
              <p className="mt-2 text-white/60 leading-relaxed">{s.p}</p>
            </div>
          ))}
          <p className="text-sm text-white/40">This template policy is provided for convenience and is not legal advice. Have it reviewed before publishing.</p>
        </div>
      </article>
    </>
  );
}
