import fs from "node:fs";
import path from "node:path";
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
  { path: "/donate", changeFrequency: "monthly", priority: 0.5 },
  { path: "/feedback", changeFrequency: "weekly", priority: 0.6 },
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
  {
    path: "/study-guides/mpsc-salary-pay-scale",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/study-guides/mpsc-cut-off-trends",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/study-guides/mpsc-psi-sti-aso-talathi-salary-comparison",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/study-guides/government-job-vs-private-job",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/study-guides/mpsc-promotion-path-after-selection",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/study-guides/mpsc-interview-document-verification",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  { path: "/?mode=csat", changeFrequency: "weekly", priority: 0.9 },
  {
    path: "/study-guides/mpsc-csat-preparation",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    path: "/study-guides/mpsc-talathi-exam",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/study-guides/upsc-csat-practice",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/study-guides/mpsc-group-c-exam-pattern-2026",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/study-guides/mpsc-group-c-subject-wise-weightage",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/study-guides/mpsc-group-b-previous-year-question-paper",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/study-guides/mpsc-combine-question-paper",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/study-guides/mpsc-talathi-bharti-2026",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/study-guides/mpsc-rto-amvi-exam",
    changeFrequency: "monthly",
    priority: 0.85,
  },
  {
    path: "/study-guides/state-psc-exams-india",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  { path: "/news", changeFrequency: "daily", priority: 0.9 },
  {
    path: "/news/mpsc-mains-optional-marks-controversy-2026",
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    path: "/news/mpsc-drug-inspector-paper-leak-2026",
    changeFrequency: "weekly",
    priority: 0.85,
  },
];

function toAbsoluteUrl(routePath: string): string {
  return routePath === "/" ? SITE_URL : `${SITE_URL}${routePath}`;
}

/**
 * Study-guide routes discovered from app/study-guides (each folder with page.tsx).
 * Keeps the sitemap in sync when new guides are added without editing
 * the hard-coded lists above (those lists still cover legacy URLs).
 */
function getStudyGuideEntries(): SitemapEntryConfig[] {
  const guidesDir = path.join(process.cwd(), "app", "study-guides");
  if (!fs.existsSync(guidesDir)) return [];

  const entries: SitemapEntryConfig[] = [];
  for (const entry of fs.readdirSync(guidesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (!fs.existsSync(path.join(guidesDir, entry.name, "page.tsx"))) continue;
    entries.push({
      path: "/study-guides/" + entry.name,
      changeFrequency: "monthly",
      priority: 0.85,
    });
  }
  return entries;
}

/**
 * Question pages that are eligible for the sitemap. We include every
 * question that has at least a short explanation (>= 40 chars). The
 * /questions/[id] template itself adds unique per-page content, so these
 * pages clear Google's low-value bar. This mirrors the canIndex threshold
 * in app/questions/[id]/page.tsx. Questions without any explanation stay
 * noindex and excluded from the sitemap.
 */
function getIndexableQuestions() {
  return getSeoQuestions().filter(
    (q) => q.explanation && q.explanation.length > 40,
  );
}

/**
 * generateSitemaps runs once at build time and returns the list of chunk
 * ids. Next.js then invokes sitemap({ id }) for each id and writes the
 * result to out/sitemap/{id}.xml.
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
    // Per-paper landing pages (/exams/<slug>) — regenerated from quizzes.json
    // on every build (includes new Rajyaseva / Group B / Group C Pre papers).
    const paperEntries: SitemapEntryConfig[] = getExamPapers().map((p) => ({
      path: "/exams/" + p.slug,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    const staticEntries = [
      ...LEGACY_SITEMAP_ENTRIES,
      ...ADDITIONAL_DISCOVERY_ENTRIES,
      ...getStudyGuideEntries(),
      ...paperEntries,
    ];
    const seen = new Set<string>();
    return staticEntries
      .filter((entry) => {
        if (seen.has(entry.path)) return false;
        seen.add(entry.path);
        return true;
      })
      .map(({ path: routePath, changeFrequency, priority }) => ({
        url: toAbsoluteUrl(routePath),
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
    url: SITE_URL + "/questions/" + question.id,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));
}
