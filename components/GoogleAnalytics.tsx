"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { allowPublicTracking } from "@/lib/trackingGuard";

/**
 * Google Analytics 4 (GA4) loader.
 *
 * Protections against the continuous Session source = "(not set)" junk we
 * diagnosed (0% engagement scrapers + localhost + Translate):
 *  - Production host only (www.mpscs.in / mpscs.in) — no localhost
 *  - No /admin*
 *  - Load only after a real human signal (or 3s visible) so hit-and-run
 *    scrapers never create empty sessions
 */
const DEFAULT_GA_ID = "G-TPCNK01N4L";

const BOT_UA =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora link preview|outbrain|pinterest|vkshare|whatsapp|telegram|discordbot|preview|headless|phantom|selenium|puppeteer|playwright|httpclient|python-requests|curl|wget|go-http|java\/|libwww|scrapy/i;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function looksLikeBot(): boolean {
  if (typeof navigator === "undefined") return true;
  if ((navigator as Navigator & { webdriver?: boolean }).webdriver) return true;
  const ua = navigator.userAgent || "";
  if (!ua || BOT_UA.test(ua)) return true;
  return false;
}

export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || DEFAULT_GA_ID;
  const pathname = usePathname() || "";
  const [ready, setReady] = useState(false);
  const armed = useRef(false);

  useEffect(() => {
    armed.current = false;
    setReady(false);

    if (!gaId) return;
    if (!allowPublicTracking(pathname)) return;
    if (looksLikeBot()) return;

    const arm = () => {
      if (armed.current) return;
      armed.current = true;
      setReady(true);
      cleanup();
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") arm();
    };

    const cleanup = () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
      window.removeEventListener("scroll", arm, true);
      window.removeEventListener("touchstart", arm);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearTimeout(timer);
    };

    window.addEventListener("pointerdown", arm, { once: true, passive: true });
    window.addEventListener("keydown", arm, { once: true });
    window.addEventListener("scroll", arm, { once: true, passive: true, capture: true });
    window.addEventListener("touchstart", arm, { once: true, passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    const timer = window.setTimeout(() => {
      if (document.visibilityState === "visible") arm();
    }, 3000);

    return cleanup;
  }, [gaId, pathname]);

  if (!gaId || !ready) return null;

  return (
    <>
      <Script
        id="ga4-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            anonymize_ip: true,
            send_page_view: true,
            page_location: window.location.href,
            page_referrer: document.referrer || undefined
          });
        `}
      </Script>
    </>
  );
}
