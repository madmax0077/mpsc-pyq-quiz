import type { MetadataRoute } from "next";

const SITE_URL = "https://www.mpscs.in";

/**
 * Dynamic robots.txt — replaces public/robots.txt so that the sitemap
 * URL stays in sync with the host and admin remains private.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
