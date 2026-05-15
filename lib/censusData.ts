/**
 * Maharashtra Census 2011 — authoritative dataset.
 *
 * Source: census2011.co.in (mirroring Census of India provisional/final tables).
 * Period: Census 2011, when Maharashtra had 35 districts.
 * (Palghar was carved out of Thane on 1 August 2014 — AFTER Census 2011 — so
 *  Palghar's population is included inside Thane's 11.06M figure here.)
 *
 * For each district we store:
 *   - rank: 1 (Thane) … 35 (Sindhudurg) by total population
 *   - population: total population
 *   - growth: decadal growth % (2001 → 2011); can be negative
 *   - sexRatio: females per 1000 males
 *   - literacy: literacy rate %
 *   - density: persons per sq km
 *   - region: rough regional grouping for the UI (Konkan, W. Maharashtra,
 *             Marathwada, N. Maharashtra, Vidarbha)
 */

export type Region =
  | "Konkan"
  | "Western Maharashtra"
  | "Marathwada"
  | "North Maharashtra"
  | "Vidarbha";

export interface CensusDistrict {
  rank: number;
  name: string;
  population: number;
  growth: number;
  sexRatio: number;
  literacy: number;
  density: number;
  region: Region;
}

export const CENSUS_DISTRICTS: readonly CensusDistrict[] = [
  { rank: 1,  name: "Thane",           population: 11_060_148, growth: 36.01, sexRatio: 886,  literacy: 84.53, density: 1157,  region: "Konkan" },
  { rank: 2,  name: "Pune",            population: 9_429_408,  growth: 30.37, sexRatio: 915,  literacy: 86.15, density: 603,   region: "Western Maharashtra" },
  { rank: 3,  name: "Mumbai Suburban", population: 9_356_962,  growth: 8.29,  sexRatio: 860,  literacy: 89.91, density: 20980, region: "Konkan" },
  { rank: 4,  name: "Nashik",          population: 6_107_187,  growth: 22.30, sexRatio: 934,  literacy: 82.31, density: 393,   region: "North Maharashtra" },
  { rank: 5,  name: "Nagpur",          population: 4_653_570,  growth: 14.40, sexRatio: 951,  literacy: 88.39, density: 470,   region: "Vidarbha" },
  { rank: 6,  name: "Ahmadnagar",      population: 4_543_159,  growth: 12.44, sexRatio: 939,  literacy: 79.05, density: 266,   region: "Western Maharashtra" },
  { rank: 7,  name: "Solapur",         population: 4_317_756,  growth: 12.16, sexRatio: 938,  literacy: 77.02, density: 290,   region: "Western Maharashtra" },
  { rank: 8,  name: "Jalgaon",         population: 4_229_917,  growth: 14.86, sexRatio: 925,  literacy: 78.20, density: 360,   region: "North Maharashtra" },
  { rank: 9,  name: "Kolhapur",        population: 3_876_001,  growth: 10.01, sexRatio: 957,  literacy: 81.51, density: 504,   region: "Western Maharashtra" },
  { rank: 10, name: "Aurangabad",      population: 3_701_282,  growth: 27.76, sexRatio: 923,  literacy: 79.02, density: 366,   region: "Marathwada" },
  { rank: 11, name: "Nanded",          population: 3_361_292,  growth: 16.86, sexRatio: 943,  literacy: 75.45, density: 319,   region: "Marathwada" },
  { rank: 12, name: "Mumbai City",     population: 3_085_411,  growth: -7.57, sexRatio: 832,  literacy: 89.21, density: 19652, region: "Konkan" },
  { rank: 13, name: "Satara",          population: 3_003_741,  growth: 6.93,  sexRatio: 988,  literacy: 82.87, density: 287,   region: "Western Maharashtra" },
  { rank: 14, name: "Amravati",        population: 2_888_445,  growth: 10.79, sexRatio: 951,  literacy: 87.38, density: 237,   region: "Vidarbha" },
  { rank: 15, name: "Sangli",          population: 2_822_143,  growth: 9.24,  sexRatio: 966,  literacy: 81.48, density: 329,   region: "Western Maharashtra" },
  { rank: 16, name: "Yavatmal",        population: 2_772_348,  growth: 12.78, sexRatio: 952,  literacy: 82.82, density: 204,   region: "Vidarbha" },
  { rank: 17, name: "Raigad",          population: 2_634_200,  growth: 19.31, sexRatio: 959,  literacy: 83.14, density: 368,   region: "Konkan" },
  { rank: 18, name: "Buldhana",        population: 2_586_258,  growth: 15.85, sexRatio: 934,  literacy: 83.40, density: 268,   region: "Vidarbha" },
  { rank: 19, name: "Beed",            population: 2_585_049,  growth: 19.61, sexRatio: 916,  literacy: 76.99, density: 242,   region: "Marathwada" },
  { rank: 20, name: "Latur",           population: 2_454_196,  growth: 17.97, sexRatio: 928,  literacy: 77.26, density: 343,   region: "Marathwada" },
  { rank: 21, name: "Chandrapur",      population: 2_204_307,  growth: 6.43,  sexRatio: 961,  literacy: 80.01, density: 193,   region: "Vidarbha" },
  { rank: 22, name: "Dhule",           population: 2_050_862,  growth: 20.08, sexRatio: 946,  literacy: 72.80, density: 285,   region: "North Maharashtra" },
  { rank: 23, name: "Jalna",           population: 1_959_046,  growth: 21.46, sexRatio: 937,  literacy: 71.52, density: 254,   region: "Marathwada" },
  { rank: 24, name: "Parbhani",        population: 1_836_086,  growth: 20.19, sexRatio: 947,  literacy: 73.34, density: 295,   region: "Marathwada" },
  { rank: 25, name: "Akola",           population: 1_813_906,  growth: 11.27, sexRatio: 946,  literacy: 88.05, density: 320,   region: "Vidarbha" },
  { rank: 26, name: "Osmanabad",       population: 1_657_576,  growth: 11.50, sexRatio: 924,  literacy: 78.44, density: 219,   region: "Marathwada" },
  { rank: 27, name: "Nandurbar",       population: 1_648_295,  growth: 25.66, sexRatio: 978,  literacy: 64.38, density: 277,   region: "North Maharashtra" },
  { rank: 28, name: "Ratnagiri",       population: 1_615_069,  growth: -4.82, sexRatio: 1122, literacy: 82.18, density: 197,   region: "Konkan" },
  { rank: 29, name: "Gondia",          population: 1_322_507,  growth: 10.14, sexRatio: 999,  literacy: 84.95, density: 253,   region: "Vidarbha" },
  { rank: 30, name: "Wardha",          population: 1_300_774,  growth: 5.18,  sexRatio: 946,  literacy: 86.99, density: 206,   region: "Vidarbha" },
  { rank: 31, name: "Bhandara",        population: 1_200_334,  growth: 5.65,  sexRatio: 982,  literacy: 83.76, density: 294,   region: "Vidarbha" },
  { rank: 32, name: "Washim",          population: 1_197_160,  growth: 17.34, sexRatio: 930,  literacy: 83.25, density: 244,   region: "Vidarbha" },
  { rank: 33, name: "Hingoli",         population: 1_177_345,  growth: 19.27, sexRatio: 942,  literacy: 78.17, density: 244,   region: "Marathwada" },
  { rank: 34, name: "Gadchiroli",      population: 1_072_942,  growth: 10.58, sexRatio: 982,  literacy: 74.36, density: 74,    region: "Vidarbha" },
  { rank: 35, name: "Sindhudurg",      population: 849_651,    growth: -2.21, sexRatio: 1036, literacy: 85.56, density: 163,   region: "Konkan" },
] as const;

/** Maharashtra state-level totals (Census 2011). */
export const STATE_TOTALS = {
  population: 112_374_333,
  area_sq_km: 307_713,
  density: 365,
  decadalGrowth: 15.99,
  sexRatio: 929,
  childSexRatio: 894,         // 0-6 yrs sex ratio
  literacy: 82.34,
  maleLiteracy: 88.38,
  femaleLiteracy: 75.87,
  urbanPercent: 45.22,
  rankInIndia: 2,             // 2nd most populous state after UP
  districtCount: 35,          // at the time of Census 2011 (Palghar carved later in 2014)
} as const;

/** Metric keys we sort by. */
export type Metric = "population" | "growth" | "sexRatio" | "literacy" | "density";

export const METRIC_LABEL: Record<Metric, string> = {
  population: "Population",
  growth: "Decadal Growth %",
  sexRatio: "Sex Ratio",
  literacy: "Literacy %",
  density: "Density (per km²)",
};

export const METRIC_UNIT: Record<Metric, string> = {
  population: "",
  growth: "%",
  sexRatio: "",
  literacy: "%",
  density: "/km²",
};

export const METRIC_ICON: Record<Metric, string> = {
  population: "👥",
  growth: "📈",
  sexRatio: "⚖️",
  literacy: "📚",
  density: "🏙️",
};

/** Format a value of a given metric for display. */
export function formatMetric(d: CensusDistrict, metric: Metric): string {
  const v = d[metric];
  if (metric === "population") return v.toLocaleString("en-IN");
  if (metric === "growth")     return `${v.toFixed(2)}%`;
  if (metric === "literacy")   return `${v.toFixed(2)}%`;
  if (metric === "sexRatio")   return v.toString();
  return v.toLocaleString("en-IN"); // density
}

/** Return districts sorted by a metric. */
export function sortByMetric(metric: Metric, dir: "desc" | "asc" = "desc"): CensusDistrict[] {
  const arr = [...CENSUS_DISTRICTS].sort((a, b) =>
    dir === "desc" ? b[metric] - a[metric] : a[metric] - b[metric],
  );
  return arr;
}

/** Pre-computed memorable extremes (used by Reveal mode + the "Did you know" facts). */
export const HIGHLIGHTS = {
  population: { top: sortByMetric("population", "desc").slice(0, 10), bottom: sortByMetric("population", "asc").slice(0, 10) },
  growth:     { top: sortByMetric("growth",     "desc").slice(0, 10), bottom: sortByMetric("growth",     "asc").slice(0, 10) },
  sexRatio:   { top: sortByMetric("sexRatio",   "desc").slice(0, 10), bottom: sortByMetric("sexRatio",   "asc").slice(0, 10) },
  literacy:   { top: sortByMetric("literacy",   "desc").slice(0, 10), bottom: sortByMetric("literacy",   "asc").slice(0, 10) },
  density:    { top: sortByMetric("density",    "desc").slice(0, 10), bottom: sortByMetric("density",    "asc").slice(0, 10) },
} as const;

/** Memorable one-liner facts used as flashcards. */
export interface FactCard {
  q: string;
  a: string;
  tag: string;
}

export const FACTS: readonly FactCard[] = [
  { q: "Largest district by population", a: "Thane (1.10 cr)", tag: "Population" },
  { q: "Smallest district by population", a: "Sindhudurg (8.49 lakh)", tag: "Population" },
  { q: "Most densely populated district", a: "Mumbai Suburban (20,980 / km²)", tag: "Density" },
  { q: "Least densely populated district", a: "Gadchiroli (74 / km²)", tag: "Density" },
  { q: "Highest sex ratio", a: "Ratnagiri (1122)", tag: "Sex Ratio" },
  { q: "Lowest sex ratio", a: "Mumbai City (832)", tag: "Sex Ratio" },
  { q: "Highest literacy", a: "Mumbai Suburban (89.91%)", tag: "Literacy" },
  { q: "Lowest literacy", a: "Nandurbar (64.38%)", tag: "Literacy" },
  { q: "Highest decadal growth (2001–11)", a: "Thane (+36.01%)", tag: "Growth" },
  { q: "Lowest decadal growth (negative!)", a: "Mumbai City (−7.57%)", tag: "Growth" },
  { q: "Districts with NEGATIVE decadal growth", a: "Mumbai City, Ratnagiri, Sindhudurg", tag: "Growth" },
  { q: "Districts with sex ratio > 1000 (females > males)", a: "Ratnagiri (1122), Sindhudurg (1036)", tag: "Sex Ratio" },
  { q: "Maharashtra's state population (2011)", a: "11.24 crore (2nd in India after UP)", tag: "State" },
  { q: "Maharashtra's state sex ratio (2011)", a: "929", tag: "State" },
  { q: "Maharashtra's state literacy rate (2011)", a: "82.34% (M: 88.38%, F: 75.87%)", tag: "State" },
  { q: "Maharashtra's decadal growth (2001–11)", a: "15.99%", tag: "State" },
  { q: "Maharashtra's population density", a: "365 per km²", tag: "State" },
  { q: "Maharashtra's urban %", a: "45.22% (one of the highest in India)", tag: "State" },
  { q: "Number of districts in Census 2011", a: "35 (Palghar carved out of Thane in 2014)", tag: "State" },
  { q: "Maharashtra's child (0–6) sex ratio", a: "894", tag: "State" },
];
