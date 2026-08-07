import type { ReactNode } from "react";

/**
 * Keep the donate page free of ads.
 * Auto Ads are loaded site-wide from the root layout; pausing requests here
 * avoids mixing donation CTAs with ad units (safer for AdSense policy).
 */
export default function DonateLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html:
            "window.adsbygoogle=window.adsbygoogle||[];window.adsbygoogle.pauseAdRequests=1;",
        }}
      />
      {children}
    </>
  );
}
