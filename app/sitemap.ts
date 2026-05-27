import type { MetadataRoute } from "next";
import { getSeoQuestions } from "@/lib/questionSeo";

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
];

const ADDITIONAL_DISCOVERY_ENTRIES: SitemapEntryConfig[] = [
  { path: "/?mode=leaderboard", changeFrequency: "daily", priority: 0.9 },
];

function toAbsoluteUrl(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

/**
 * `generateSitemaps` runs once at build time and returns the list of chunk
 * ids. Next.js then invokes `sitemap({ id })` for each id and writes the
 * result to `out/sitemap/{id}.xml`, plus a top-level `out/sitemap.xml`
 * index linking to every chunk.
 *
 * Chunk id 0  -> static pages (always present, even if there are zero
 *                question pages).
 * Chunk id 1+ -> question pages, in batches of QUESTIONS_PER_SITEMAP.
 */
export async function generateSitemaps(): Promise<Array<{ id: number }>> {
  let questionChunks = 0;
  try {
    const questions = getSeoQuestions();
    questionChunks = Math.ceil(questions.length / QUESTIONS_PER_SITEMAP);
  } catch {
    questionChunks = 0;
  }
  const totalChunks = 1 + questionChunks; // 1 static + N question chunks
  return Array.from({ length: totalChunks }, (_, i) => ({ id: i }));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const now = new Date();

  if (id === 0) {
    const staticEntries = [...LEGACY_SITEMAP_ENTRIES, ...ADDITIONAL_DISCOVERY_ENTRIES];
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

  let questions: ReturnType<typeof getSeoQuestions> = [];
  try {
    questions = getSeoQuestions();
  } catch {
    return [];
  }

  const chunkIndex = id - 1;
  const start = chunkIndex * QUESTIONS_PER_SITEMAP;
  const slice = questions.slice(start, start + QUESTIONS_PER_SITEMAP);

  return slice.map((question) => ({
    url: `${SITE_URL}/questions/${question.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
}
