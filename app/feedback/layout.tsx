import type { ReactNode } from "react";

/** Keep the feedback board free of Auto Ads (same policy as /donate). */
export default function FeedbackLayout({ children }: { children: ReactNode }) {
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
