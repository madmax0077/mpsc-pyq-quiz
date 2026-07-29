import type { MetadataRoute } from "next";
import { getSeoQuestions } from "@/lib/questionSeo";
import { getExamPapers } from "@/lib/examPapers";

const SITE_URL = "https://www.mpscs.in";

/**
 * Question pages per chunk. Keep this comfortably under Google's per-sitemap
 * limit (50 000) and well under any build-time memory limit. 2 000 keeps each
 * generated XML under ~500 KB which Vercel and Google both handle without
 * issue.
 */
const QUESTIONS_PER_SITEMAP = 2000;

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

type SitemapEntryConfig = {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
};

/**
 * Hard-coded static-page entries.
 *
 * IMPORTANT: Keep all legacy entries intact — these are the pages Google has
 * already indexed and we do not want to break inbound links or rankings.
 * Append only; never reorder or remove.
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
  { path: "/terms", changeFrequency: "yearly", priority: 0.4 },
  { path: "/disclaimer", changeFrequency: "yearly", priority: 0.4 },
  { path: "/rivers-maharashtra", changeFrequency: "weekly", priority: 0.85 },
  { path: "/census-2011-maharashtra", changeFrequency: "weekly", priority: 0.85 },
];

const ADDITIONAL_DISCOVERY_ENTRIES: SitemapEntryConfig[] = [
  { path: "/?mode=leaderboard", changeFrequency: "daily", priority: 0.9 },
  { path: "/?mode=mock", changeFrequency: "weekly", priority: 0.9 },
  {
    path: "/study-guides/mpsc-group-c-syllabus",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/study-guides/mpsc-negative-marking",
    changeFrequency: "monthly",
    priority: 0.8,
  },
];

function toAbsoluteUrl(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

/**
 * Question pages that are eligible for the sitemap.  We include every
 * question that has at least a short explanation (>= 40 chars).  The
 * `/questions/[id]` template itself now adds ~1,500 words of unique
 * per-page content (category deep-dive rotated by question-id hash,
 * why-this-matters + how-to-attempt from 5 and 6 variant pools, a
 * source-and-editorial paragraph, related study-guide links and an
 * about block), so the total rendered content easily clears Google's
 * "Low value content" bar regardless of explanation length -- what
 * matters is that the page is genuinely useful.  This mirrors the
 * `canIndex` threshold in `app/questions/[id]/page.tsx`.  Questions
 * without any explanation stay noindex and excluded from the sitemap.
 */
function getIndexableQuestions() {
  return getSeoQuestions().filter(
    (q) => q.explanation && q.explanation.length > 40,
  );
}

/**
 * `generateSitemaps` runs once at build time and returns the list of chunk
 * ids. Next.js then invokes `sitemap({ id })` for each id and writes the
 * result to `out/sitemap/{id}.xml`.
 *
 * Chunk id 0            -> static pages (home, /exams, /map, /about, ...).
 * Chunk id 1, 2, ...    -> question pages that have substantive
 *                          explanations, chunked at QUESTIONS_PER_SITEMAP.
 */
export async function generateSitemaps(): Promise<Array<{ id: number }>> {
  const indexable = getIndexableQuestions();
  const questionChunkCount = Math.ceil(indexable.length / QUESTIONS_PER_SITEMAP);
  const chunks: Array<{ id: number }> = [{ id: 0 }];
  for (let i = 0; i < questionChunkCount; i += 1) {
    chunks.push({ id: i + 1 });
  }
  return chunks;
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const now = new Date();

  if (id === 0) {
    // Per-paper landing pages (/exams/<slug>) — generated from quizzes.json.
    const paperEntries: SitemapEntryConfig[] = getExamPapers().map((p) => ({
      path: `/exams/${p.slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    const staticEntries = [
      ...LEGACY_SITEMAP_ENTRIES,
      ...ADDITIONAL_DISCOVERY_ENTRIES,
      ...paperEntries,
    ];
    const seen = new Set<string>();
    return staticEntries
      .filter((entry) => {
        if (seen.has(entry.path)) return false;
        seen.add(entry.path);
        return true;
      })
      .map(({ path, changeFrequency, priority }) => ({
        url: toAbsoluteUrl(path),
        lastModified: now,
        changeFrequency,
        priority,
      }));
  }

  const chunkIndex = id - 1;
  const indexable = getIndexableQuestions();
  const start = chunkIndex * QUESTIONS_PER_SITEMAP;
  const slice = indexable.slice(start, start + QUESTIONS_PER_SITEMAP);
  return slice.map((question) => ({
    url: `${SITE_URL}/questions/${question.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));
}
