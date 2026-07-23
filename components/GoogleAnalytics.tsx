import Script from "next/script";

/**
 * Google Analytics 4 (GA4) loader.
 *
 * Uses the live Measurement ID by default so it works out of the box on
 * deploy (a GA4 Measurement ID is public, not a secret). You can still
 * override it per-environment with `NEXT_PUBLIC_GA_ID` — e.g. a separate
 * test property — which the static export inlines at build time.
 *
 * Runs alongside Vercel Analytics and Google AdSense with no conflict.
 */
const DEFAULT_GA_ID = "G-TPCNK01N4L";

export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || DEFAULT_GA_ID;
  if (!gaId) return null;

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
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
