"use client";

import { useEffect, useRef } from "react";

/** Your AdSense publisher id (same as the loader in app/layout.tsx). */
const AD_CLIENT = "ca-pub-5084738834329206";

type AdsWindow = Window & { adsbygoogle?: Array<Record<string, unknown>> };

/**
 * A single AdSense display ad unit.
 *
 * Renders an <ins class="adsbygoogle"> and asks AdSense to fill it once on
 * mount. Nothing is forced or incentivised — it is a normal display impression.
 * Ads only render on the live (approved) domain; on localhost the slot stays
 * empty, which is expected.
 */
export default function AdUnit({
  slot,
  className,
  minHeight = 250,
}: {
  slot: string;
  className?: string;
  minHeight?: number;
}) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    // Skip until a real slot id is configured.
    if (!slot || slot.startsWith("REPLACE_")) return;
    try {
      const w = window as AdsWindow;
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
      pushed.current = true;
    } catch {
      /* adsbygoogle not ready yet — ignore */
    }
  }, [slot]);

  const isPlaceholder = !slot || slot.startsWith("REPLACE_");

  return (
    <div className={className}>
      {isPlaceholder ? (
        <div
          className="flex items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs font-medium text-slate-400 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-500"
          style={{ minHeight }}
        >
          Advertisement
        </div>
      ) : (
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight }}
          data-ad-client={AD_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
