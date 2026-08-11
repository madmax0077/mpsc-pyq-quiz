"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { allowPublicTracking, isProductionHost } from "@/lib/trackingGuard";

/**
 * Google Analytics 4 (GA4) loader.
 *
 * Keep attribution healthy (avoid Unassigned from delayed tags):
 *  - Load immediately on production public pages
 *  - Skip localhost, /admin*, translate proxies, obvious bot UAs
 *
 * Do NOT delay until click — late gtag config is a common cause of
 * Session primary channel = Unassigned / (not set).
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
  if (navigator.languages?.length === 0) return true;
  return false;
}

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

  useEffect(() => {
    if (!gaId) return;
    if (!allowPublicTracking(pathname)) return;
    if (!isAllowedTrackingHost()) return;
    if (looksLikeBot()) return;
    setReady(true);
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
