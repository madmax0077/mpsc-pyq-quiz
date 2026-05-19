"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  /** Real AdSense slot ID from your account (AdSense → Ads → By ad unit).
   *  Leave empty to rely on Google Auto Ads (enabled via AdSense dashboard). */
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

const PUBLISHER_ID = "ca-pub-5084738834329206";

/** Placeholder slot IDs that must NOT be sent to AdSense — they cause silent
 *  failures and can interfere with Auto Ads page scanning. */
const FAKE_SLOTS = new Set([
  "1234567890",
  "2345678901",
  "3456789012",
  "4567890123",
  "0000000000",
  "9999999999",
]);

function isValidSlot(slot?: string): boolean {
  if (!slot) return false;
  if (FAKE_SLOTS.has(slot)) return false;
  // AdSense slot IDs are 10-digit numbers
  return /^\d{10}$/.test(slot);
}

export default function AdBanner({
  slot,
  format = "auto",
  className = "",
}: AdBannerProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!isValidSlot(slot)) return;
    if (pushed.current) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded or blocked by ad-blocker
    }
  }, [slot]);

  // ── No valid slot: render nothing so Google Auto Ads can scan the page
  //    without hitting broken <ins> elements.
  //    Enable Auto Ads at: AdSense → Ads → By site → toggle On → Save
  if (!isValidSlot(slot)) return null;

  return (
    <div className={`overflow-hidden ${className}`}>
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
