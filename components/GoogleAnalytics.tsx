"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { allowPublicTracking, isProductionHost } from "@/lib/trackingGuard";

/**
 * Google Analytics 4 (GA4) loader.
 *
 * Protections against Session source = "(not set)" junk:
 *  - Production host only (www.mpscs.in / mpscs.in) — no localhost / translate proxies
 *  - No /admin*
 *  - Load ONLY after a real human gesture (pointer / key / touch).
 *    No timed auto-arm — that was still letting scrapers create empty sessions.
 */
const DEFAULT_GA_ID = "G-TPCNK01N4L";

const BOT_UA =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora link preview|outbrain|pinterest|vkshare|whatsapp|telegram|discordbot|preview|headless|phantom|selenium|puppeteer|playwright|httpclient|python-requests|curl|wget|go-http|java\/|libwww|scrapy|bytespider|gptbot|claudebot|anthropic|semrush|ahrefs|mj12bot|dotbot|petalbot|yandexbot|baiduspider|sogou|duckduckbot/i;

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
  // Headless / automation fingerprints
  if (navigator.languages?.length === 0) return true;
  return false;
}

/** Reject Google Translate / unexpected hosts that pollute attribution. */
function isAllowedTrackingHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname.toLowerCase();
  if (!isProductionHost(host)) return false;
  if (host.includes("translate.goog")) return false;
  if (host.includes("googleusercontent")) return false;
  return true;
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
    if (!isAllowedTrackingHost()) return;
    if (looksLikeBot()) return;

    const arm = () => {
      if (armed.current) return;
      if (!isAllowedTrackingHost()) return;
      armed.current = true;
      setReady(true);
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
      window.removeEventListener("touchstart", arm);
    };

    // Real gestures only — no scroll timer / visibility timeout (scrapers fake those).
    window.addEventListener("pointerdown", arm, { once: true, passive: true });
    window.addEventListener("keydown", arm, { once: true });
    window.addEventListener("touchstart", arm, { once: true, passive: true });

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
