"use client";

/**
 * AdBanner is intentionally a NO-OP component during the AdSense approval
 * phase.  We were rendering <ins data-ad-slot="…"> with placeholder slot IDs,
 * which made the Google AdSense crawler flag the site for "Low value content"
 * because every page contained broken/empty ad units.
 *
 * Approval checklist (do NOT undo until ALL are true):
 *   1. AdSense account status = "Ready" (green check) for mpscs.in.
 *   2. You have created at least one Ad Unit in:
 *      AdSense → Ads → By ad unit → Display ads.
 *      Each unit gives you a real 10-digit `data-ad-slot` value.
 *   3. `ads.txt` is still served at https://www.mpscs.in/ads.txt.
 *   4. The <meta name="google-adsense-account"> tag is still in app/layout.tsx.
 *
 * Once all four are true, replace this stub with the previous implementation
 * AND only render ads on content-rich pages (study guides, exams index, home
 * footer). Never place an ad within ~300px of an action button (Submit,
 * Retake, Next Set) — AdSense rejects that as "encourages accidental clicks".
 */
interface AdBannerProps {
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

export default function AdBanner(_props: AdBannerProps) {
  return null;
}
