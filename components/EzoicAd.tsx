"use client";

import { useEffect } from "react";
import { ezShowAds, ezDestroy } from "@/lib/ezoic";

/**
 * A single Ezoic ad placeholder.
 *
 * Renders the <div id="ezoic-pub-ad-placeholder-{id}"> Ezoic expects and asks
 * Ezoic to fill it on mount. On unmount (e.g. an SPA view change) it destroys
 * the placeholder so the next mount gets a fresh, correctly-sized ad.
 *
 * A placeholder id of 0 (not yet configured) renders nothing.
 */
export default function EzoicAd({
  id,
  className,
  minHeight = 250,
}: {
  id: number;
  className?: string;
  minHeight?: number;
}) {
  useEffect(() => {
    if (!id) return;
    ezShowAds(id);
    return () => ezDestroy(id);
  }, [id]);

  if (!id) return null;

  return (
    <div className={className}>
      <div id={`ezoic-pub-ad-placeholder-${id}`} style={{ minHeight }} />
    </div>
  );
}
