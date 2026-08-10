"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { ADSENSE_CLIENT, IS_EZOIC } from "@/lib/adsConfig";
import { allowAdScripts } from "@/lib/trackingGuard";

/**
 * Loads AdSense / Ezoic scripts only on the public production site.
 * Skips localhost, /admin*, /donate, and /feedback.
 */
export default function AdScripts() {
  const pathname = usePathname() || "";
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(allowAdScripts(pathname));
  }, [pathname]);

  if (!allowed) return null;

  if (IS_EZOIC) {
    return (
      <>
        <Script id="ezoic-sa" strategy="afterInteractive" src="//www.ezojs.com/ezoic/sa.min.js" />
        <Script id="ezoic-init" strategy="afterInteractive">
          {`window.ezstandalone=window.ezstandalone||{};ezstandalone.cmd=ezstandalone.cmd||[];`}
        </Script>
        <Script
          id="ezoic-analytics"
          strategy="afterInteractive"
          src="//ezoicanalytics.com/analytics.js"
        />
      </>
    );
  }

  return (
    <>
      <Script
        id="adsense-loader"
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        crossOrigin="anonymous"
      />
      <Script
        id="funding-choices"
        strategy="afterInteractive"
        src="https://fundingchoicesmessages.google.com/i/pub-5084738834329206?ers=1"
      />
      <Script id="funding-choices-present" strategy="afterInteractive">
        {`(function(){function signalGooglefcPresent(){if(!window.frames['googlefcPresent']){if(document.body){const iframe=document.createElement('iframe');iframe.style='width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;';iframe.style.display='none';iframe.name='googlefcPresent';document.body.appendChild(iframe);}else{setTimeout(signalGooglefcPresent,0);}}}signalGooglefcPresent();})();`}
      </Script>
      <Script
        id="adsense-adblock-protection"
        strategy="afterInteractive"
        src="/adsense-ad-blocking-error-protection.js"
      />
    </>
  );
}
