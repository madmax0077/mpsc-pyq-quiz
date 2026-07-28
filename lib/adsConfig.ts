/**
 * Central ad configuration.
 *
 * The site can serve display ads through one of two providers:
 *  - "adsense" : Google AdSense Auto Ads + our manual <ins> units (current, live).
 *  - "ezoic"   : Ezoic controls placements; AdSense earns as a bidder INSIDE
 *                Ezoic's auction. AdSense Auto Ads must be OFF in this mode.
 *
 * Flip the provider by setting NEXT_PUBLIC_AD_PROVIDER=ezoic at build time
 * (Vercel → Project → Settings → Environment Variables). Defaults to "adsense"
 * so the live site is unchanged until we deliberately switch.
 */
export type AdProvider = "adsense" | "ezoic";

export const AD_PROVIDER: AdProvider =
  (process.env.NEXT_PUBLIC_AD_PROVIDER as AdProvider) === "ezoic"
    ? "ezoic"
    : "adsense";

export const IS_EZOIC = AD_PROVIDER === "ezoic";
export const IS_ADSENSE = AD_PROVIDER === "adsense";

/** AdSense publisher id (stays linked even under Ezoic — AdSense bids inside it). */
export const ADSENSE_CLIENT = "ca-pub-5084738834329206";

/**
 * Ezoic standalone loader. This is Ezoic's documented script for
 * non-WordPress / non-Cloudflare sites (Next.js on Vercel = this path).
 * CONFIRM this exact src matches what your Ezoic dashboard shows before
 * going live.
 */
export const EZOIC_SCRIPT_SRC = "//www.ezojs.com/ezoic/sa.min.js";

/**
 * Ezoic ad-position placeholder IDs.
 *
 * TODO(user): create one ad position per spot in the Ezoic dashboard
 * (Ad Settings → Placeholders / Ad Positions) and paste the numeric IDs here.
 * Any spot left as 0 renders nothing in Ezoic mode.
 */
export const EZOIC_PLACEHOLDERS = {
  /** Bottom of the first question page (all quiz sections). */
  quizBottom: 0,
  /** Landing page, below the Topic Tests section. */
  landing: 0,
  /** Mock-test result reveal interstitial. */
  mockResult: 0,
} as const;

export type EzoicPlaceholderKey = keyof typeof EZOIC_PLACEHOLDERS;
