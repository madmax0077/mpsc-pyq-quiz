import type { MetadataRoute } from "next";
import { getSeoQuestions } from "@/lib/questionSeo";

const SITE_URL = "https://www.mpscs.in";

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

type SitemapEntryConfig = {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
};

/**
 * Dynamic sitemap — always serves an up-to-date copy with the current
 * `lastModified` timestamp. This file replaces `public/sitemap.xml`.
 *
 * IMPORTANT: Keep all legacy entries intact (as requested), and only append
 * additional high-value public discovery URLs.
 */
const LEGACY_SITEMAP_ENTRIES: SitemapEntryConfig[] = [
  { path: "/", changeFrequency: "daily", priority: 1.0 },
  { path: "/exams", changeFrequency: "weekly", priority: 0.9 },
  { path: "/map", changeFrequency: "weekly", priority: 0.85 },
  { path: "/study-guides", changeFrequency: "weekly", priority: 0.85 },
  {
    path: "/study-guides/maharashtra-geography",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/study-guides/maharashtra-history",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/study-guides/indian-polity-for-mpsc",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/study-guides/mpsc-exam-pattern",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/study-guides/mpsc-preparation-strategy",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  { path: "/?mode=notes", changeFrequency: "weekly", priority: 0.85 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.4 },
];

const ADDITIONAL_DISCOVERY_ENTRIES: SitemapEntryConfig[] = [
  // Dedicated landing mode used across the site and llms.txt references.
  { path: "/?mode=leaderboard", changeFrequency: "daily", priority: 0.9 },
];

function toAbsoluteUrl(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const questionEntries: SitemapEntryConfig[] = getSeoQuestions().map((question) => ({
    path: `/questions/${question.id}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  const mergedEntries = [...LEGACY_SITEMAP_ENTRIES, ...ADDITIONAL_DISCOVERY_ENTRIES, ...questionEntries];
  const seen = new Set<string>();
  return mergedEntries
    .filter((entry) => {
      const key = entry.path;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map(({ path, changeFrequency, priority }) => ({
      url: toAbsoluteUrl(path),
      lastModified: now,
      changeFrequency,
      priority,
    }));
}
