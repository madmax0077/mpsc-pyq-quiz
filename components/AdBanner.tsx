"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

const PUBLISHER_ID = "ca-pub-XXXXXXXXXX"; // Replace with your real AdSense publisher ID

export default function AdBanner({
  slot,
  format = "auto",
  className = "",
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      if (w.adsbygoogle) {
        w.adsbygoogle.push({});
        pushed.current = true;
      }
    } catch {
      // AdSense not loaded yet or blocked by ad-blocker
    }
  }, []);

  if (PUBLISHER_ID.includes("XXXXXXXXXX")) {
    return (
      <div className={`flex items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-3 ${className}`}>
        <p className="text-xs text-slate-400">Ad space — will appear after AdSense approval</p>
      </div>
    );
  }

  return (
    <div ref={adRef} className={`overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
