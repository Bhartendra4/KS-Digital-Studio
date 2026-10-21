"use client";
import Script from "next/script";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { hasAnalyticsConsent } from "@/components/ui/CookieBanner";

export default function Analytics() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const check = () => setOk(hasAnalyticsConsent());
    check();
    window.addEventListener("ks-consent", check);
    return () => window.removeEventListener("ks-consent", check);
  }, []);
  if (!ok) return null;
  return (
    <>
      {site.gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${site.gaId}`} strategy="afterInteractive" />
          <Script id="ga" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${site.gaId}');
          `}</Script>
        </>
      )}
      {site.clarityId && (
        <Script id="clarity" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${site.clarityId}");
        `}</Script>
      )}
    </>
  );
}
