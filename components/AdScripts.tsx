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
    <Script
      id="adsense-loader"
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
