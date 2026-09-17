import { Mail, Phone, MapPin, MessageCircle, CalendarCheck } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import ContactForm from "@/components/sections/ContactForm";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Contact", "Start your premium website project with KS Digital Studio. We reply within 24 hours.", "/contact");

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's build something premium."
        subtitle="Tell us about your project and we'll get back within 24 hours." />
      <section className="mx-auto grid max-w-[1440px] gap-12 px-5 pb-16 md:px-10 lg:grid-cols-2">
        <div>
          <div className="space-y-4">
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
              <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-magnetic btn-ghost text-sm" data-cursor>
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <a href={site.bookingUrl} className="btn-magnetic btn-primary text-sm" data-cursor>
                <CalendarCheck className="h-4 w-4" /> Book a Consultation
              </a>
            </div>
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            <iframe src={site.map} width="100%" height="240" loading="lazy" title="Map"
              referrerPolicy="no-referrer-when-downgrade" style={{ filter: "invert(0.9) hue-rotate(180deg)" }} />
          </div>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
