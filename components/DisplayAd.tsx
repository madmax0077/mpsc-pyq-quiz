"use client";

import { usePathname } from "next/navigation";
import AdUnit from "./AdUnit";
import EzoicAd from "./EzoicAd";
import { IS_EZOIC, EZOIC_PLACEHOLDERS, type EzoicPlaceholderKey } from "@/lib/adsConfig";
import { isAdFreePath } from "@/lib/trackingGuard";

/**
 * Provider-aware display ad.
 *
 * Renders a real AdSense <ins> unit when AD_PROVIDER is "adsense", or an Ezoic
 * placeholder when it is "ezoic". Every ad spot in the app should use this
 * wrapper so switching providers is a single env-var flip — no per-call-site
 * edits.
 *
 * @param adsenseSlot  AdSense data-ad-slot id (used in adsense mode).
 * @param ezoicKey     Key into EZOIC_PLACEHOLDERS (used in ezoic mode).
 */
export default function DisplayAd({
  adsenseSlot,
  ezoicKey,
  className,
  minHeight = 250,
}: {
  adsenseSlot: string;
  ezoicKey: EzoicPlaceholderKey;
  className?: string;
  minHeight?: number;
}) {
  const pathname = usePathname() || "";
  if (isAdFreePath(pathname)) return null;

  if (IS_EZOIC) {
    return (
      <EzoicAd id={EZOIC_PLACEHOLDERS[ezoicKey]} className={className} minHeight={minHeight} />
    );
  }
  return <AdUnit slot={adsenseSlot} className={className} minHeight={minHeight} />;
}
