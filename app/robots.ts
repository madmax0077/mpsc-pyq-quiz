import type { MetadataRoute } from "next";

const SITE_URL = "https://www.mpscs.in";

const PRIVATE_PATHS = ["/admin", "/admin/"];

/**
 * AI / LLM crawlers we want to explicitly opt in. Listing each
 * user-agent (rather than relying on the wildcard `*`) is a stronger
 * "yes, you may train/index on us" signal — several of these vendors
 * default to NOT crawling sites that don't acknowledge them.
 *
 * Sources for canonical user-agent strings:
 *   OpenAI / ChatGPT  https://platform.openai.com/docs/bots
 *   Anthropic         https://docs.anthropic.com/en/docs/web-crawler
 *   Google Gemini     https://developers.google.com/search/docs/crawling-indexing/google-special-crawlers
 *   Perplexity        https://docs.perplexity.ai/guides/bots
 *   Apple Intelligence https://support.apple.com/en-us/119829
 *   Meta AI           https://developers.facebook.com/docs/sharing/webmasters/web-crawlers
 *   Common Crawl      https://commoncrawl.org/faq
 */
const AI_BOTS = [
  // OpenAI — both ChatGPT search and the GPT training crawler.
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic / Claude.
  "ClaudeBot",
  "Claude-Web",
  "Claude-SearchBot",
  "anthropic-ai",
  // Google. NOTE: Googlebot itself is covered by `*`. Google-Extended is
  // the separate opt-in flag for Gemini / Vertex AI training.
  "Google-Extended",
  // Perplexity — search index + on-demand fetcher.
  "PerplexityBot",
  "Perplexity-User",
  // Apple Intelligence.
  "Applebot",
  "Applebot-Extended",
  // Meta AI / Llama.
  "Meta-ExternalAgent",
  "FacebookBot",
  "meta-externalagent",
  // Microsoft Copilot helpers (Bingbot itself is covered by `*`).
  "MSNBot",
  // DuckDuckGo Assist.
  "DuckAssistBot",
  // You.com.
  "YouBot",
  // Cohere.
  "cohere-ai",
  "cohere-training-data-crawler",
  // Common Crawl — feeds GPT, Claude, Llama and many open models.
  "CCBot",
  // Bytespider (Doubao / Bytedance LLMs).
  "Bytespider",
  // Diffbot's LLM data pipeline.
  "Diffbot",
  // Amazon Bedrock data.
  "Amazonbot",
  // Mistral.
  "MistralAI-User",
];

/**
 * Dynamic robots.txt — replaces public/robots.txt so the sitemap URL
 * stays in sync with the host, admin stays private, and every major
 * AI crawler is explicitly allowed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Generic catch-all (search engines).
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      // Per-bot explicit allow for AI crawlers.
      ...AI_BOTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: PRIVATE_PATHS,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
