/**
 * Maharashtra rivers — basin classification & MPSC-grade metadata.
 *
 * The river *paths* live in `lib/mapData/maharashtra.ts` (RIVERS array).
 * This file enriches every id with:
 *   - basin: Godavari | Krishna | Tapi | Konkan
 *   - origin, mouth, length (km), districts traversed, one-liner note
 *
 * Stats sourced from CWC, MoWR, NIH Roorkee, MPSC official syllabus material
 * and standard Maharashtra geography textbooks.
 */

import { RIVERS, type RiverFeature } from "./maharashtra";

export type Basin = "Godavari" | "Krishna" | "Tapi" | "Konkan";

export interface RiverMeta {
  /** Optional — only main rivers / key tributaries carry rich notes. */
  basin: Basin;
  /** Length in km (total length of the river, not just in-state). */
  lengthKm?: number;
  origin?: string;
  mouth?: string;
  /** Maharashtra districts traversed, in upstream → downstream order. */
  districts?: string[];
  /** One-liner that MPSC aspirants tend to be tested on. */
  note?: string;
}

export const BASIN_COLOR: Record<Basin, string> = {
  Godavari: "#7c3aed", // purple
  Krishna: "#0d9488",  // teal
  Tapi: "#d97706",     // amber
  Konkan: "#0284c7",   // sky blue
};

export const BASIN_LABEL: Record<Basin, string> = {
  Godavari: "Godavari basin",
  Krishna: "Krishna basin",
  Tapi: "Tapi basin",
  Konkan: "Konkan (west-flowing)",
};

export const BASIN_ICON: Record<Basin, string> = {
  Godavari: "🟣",
  Krishna: "🟢",
  Tapi: "🟠",
  Konkan: "🔵",
};

/* ─────────────────────────────────────────────────────────────────── */
/*  Per-river metadata, keyed by RIVERS[].id                           */
/* ─────────────────────────────────────────────────────────────────── */

export const RIVER_META: Record<string, RiverMeta> = {
  /* ─── Godavari basin — main + tributaries ─────────────────────── */
  godavari: {
    basin: "Godavari",
    lengthKm: 1465,
    origin: "Brahmagiri hills, Trimbakeshwar (Nashik)",
    mouth: "Bay of Bengal (Antarvedi, Andhra Pradesh)",
    districts: ["Nashik", "Ahmednagar", "Aurangabad", "Jalna", "Parbhani", "Hingoli", "Nanded", "Gadchiroli"],
    note: "‘Dakshin Ganga’ — longest peninsular river of India. ~668 km of its course lies in Maharashtra.",
  },
  pravara: {
    basin: "Godavari",
    lengthKm: 208,
    origin: "Bhandardara / Ratangad (Ahmednagar)",
    mouth: "Joins Godavari at Toka (Pravara Sangam, Ahmednagar)",
    districts: ["Ahmednagar"],
    note: "Bhandardara (Wilson) Dam — one of India's oldest masonry dams (1926) — is on the Pravara.",
  },
  "mula-godavari": {
    basin: "Godavari",
    lengthKm: 120,
    origin: "Sahyadri above Akole (Ahmednagar)",
    mouth: "Joins Pravara → Godavari near Toka",
    districts: ["Ahmednagar"],
    note: "Mula Dam (near Sangamner) supplies water to Ahmednagar district.",
  },
  darna: {
    basin: "Godavari",
    lengthKm: 76,
    origin: "Igatpuri hills (Nashik)",
    mouth: "Joins Godavari near Nanded village (Nashik district)",
    districts: ["Nashik"],
    note: "Darna Dam (1916) is one of the oldest dams in Maharashtra.",
  },
  kadwa: { basin: "Godavari", origin: "Nashik Sahyadri", mouth: "Joins Godavari in Nashik", districts: ["Nashik"] },
  sindphana: {
    basin: "Godavari",
    origin: "Beed (Patoda hills)",
    mouth: "Joins Godavari in Beed",
    districts: ["Beed"],
    note: "Major tributary of Godavari in the Marathwada plateau.",
  },
  manjira: {
    basin: "Godavari",
    lengthKm: 724,
    origin: "Balaghat range, Patoda (Beed district)",
    mouth: "Joins Godavari near Kandakurthi (Telangana)",
    districts: ["Beed", "Latur", "Osmanabad", "Nanded"],
    note: "Forms part of MH–Karnataka and MH–Telangana inter-state river basin.",
  },
  "purna-godavari": {
    basin: "Godavari",
    lengthKm: 373,
    origin: "Ajanta hills (Aurangabad)",
    mouth: "Joins Godavari near Pathri (Parbhani)",
    districts: ["Aurangabad", "Jalna", "Parbhani"],
    note: "Largest tributary of Godavari in Marathwada. Not to be confused with the Tapi-basin Purna.",
  },
  wardha: {
    basin: "Godavari",
    lengthKm: 528,
    origin: "Multai hills, Satpura range (Madhya Pradesh)",
    mouth: "Joins Wainganga at Seoni Sironcha to form Pranhita → Godavari",
    districts: ["Wardha", "Yavatmal", "Chandrapur", "Gadchiroli"],
    note: "Forms MH–Telangana border in its lower course. Joins Wainganga to form Pranhita.",
  },
  wainganga: {
    basin: "Godavari",
    lengthKm: 580,
    origin: "Mundara hills, Seoni (Madhya Pradesh)",
    mouth: "Joins Wardha at Sironcha to form Pranhita → Godavari",
    districts: ["Bhandara", "Gondia", "Chandrapur", "Gadchiroli"],
    note: "Most important river of east Vidarbha. Gosikhurd / Indira Sagar Dam is on Wainganga.",
  },
  painganga: {
    basin: "Godavari",
    lengthKm: 676,
    origin: "Ajanta hills (Buldhana)",
    mouth: "Joins Wardha at Wadhona (Yavatmal–Chandrapur border)",
    districts: ["Buldhana", "Washim", "Hingoli", "Yavatmal", "Nanded", "Chandrapur"],
    note: "Forms much of the Marathwada–Vidarbha boundary. Isapur Dam is on Painganga.",
  },

  /* Wardha sub-tributaries */
  yashoda: { basin: "Godavari", origin: "Satpura foothills", mouth: "Joins Wardha near Wardha city", districts: ["Wardha"] },
  "wenna-wardha": { basin: "Godavari", origin: "Wardha district hills", mouth: "Joins Wardha", districts: ["Wardha"] },

  /* Wainganga sub-tributaries */
  kanhan: {
    basin: "Godavari",
    origin: "Chhindwara hills (Madhya Pradesh)",
    mouth: "Joins Wainganga north of Bhandara",
    districts: ["Nagpur", "Bhandara"],
    note: "Drains a large part of Nagpur district before joining the Wainganga.",
  },
  pench: { basin: "Godavari", origin: "Satpura hills (MP)", mouth: "Joins Kanhan → Wainganga", districts: ["Nagpur"], note: "Pench River feeds Pench (Totladoh) Hydroelectric Project — 160 MW." },
  bagh: { basin: "Godavari", origin: "Gondia hills", mouth: "Joins Wainganga", districts: ["Gondia"] },
  bavanthadi: { basin: "Godavari", origin: "MP–Bhandara hills", mouth: "Joins Wainganga", districts: ["Bhandara"], note: "Inter-state river — forms part of the MH–MP border." },

  /* Painganga sub-tributaries */
  adan: { basin: "Godavari", origin: "Washim hills", mouth: "Joins Painganga", districts: ["Washim", "Yavatmal"] },
  pus: { basin: "Godavari", origin: "Yavatmal hills", mouth: "Joins Painganga", districts: ["Yavatmal"] },
  arunavati: { basin: "Godavari", origin: "Yavatmal", mouth: "Joins Painganga", districts: ["Yavatmal"] },

  /* ─── Krishna basin — main + tributaries ─────────────────────── */
  krishna: {
    basin: "Krishna",
    lengthKm: 1400,
    origin: "Mahabaleshwar, Satara (Sahyadri)",
    mouth: "Bay of Bengal at Hamsaladeevi (Andhra Pradesh)",
    districts: ["Satara", "Sangli", "Kolhapur"],
    note: "Only ~282 km of Krishna's course is in Maharashtra. Origin near the temple at old Mahabaleshwar.",
  },
  koyna: {
    basin: "Krishna",
    lengthKm: 130,
    origin: "Mahabaleshwar (Sahyadri)",
    mouth: "Joins Krishna at Karad — the famous ‘Preeti Sangam’",
    districts: ["Satara"],
    note: "Koyna Dam supports Maharashtra's largest hydroelectric project (~1960 MW). 1967 Koyna earthquake was the first major reservoir-induced quake in India.",
  },
  venna: {
    basin: "Krishna",
    origin: "Mahabaleshwar plateau",
    mouth: "Joins Krishna at Mahuli (Satara)",
    districts: ["Satara"],
    note: "Forms Venna Lake at Mahabaleshwar — a major tourist landmark.",
  },
  bhima: {
    basin: "Krishna",
    lengthKm: 861,
    origin: "Bhimashankar (Pune, Sahyadri)",
    mouth: "Joins Krishna at Kudalsangam (Karnataka)",
    districts: ["Pune", "Ahmednagar", "Solapur"],
    note: "Largest tributary of Krishna by length. Ujani Dam is on the Bhima — a Marathwada lifeline.",
  },
  "mula-mutha": {
    basin: "Krishna",
    lengthKm: 64,
    origin: "Confluence at Pune (Mula + Mutha)",
    mouth: "Joins Bhima at Tulapur",
    districts: ["Pune"],
    note: "Mula-Mutha is Pune city's lifeline. Mutha originates near Khadakwasla; Mula from Mulshi.",
  },
  indrayani: {
    basin: "Krishna",
    lengthKm: 104,
    origin: "Kurvande hills, Lonavala (Pune)",
    mouth: "Joins Bhima at Tulapur",
    districts: ["Pune"],
    note: "Sacred river — Sant Tukaram (Dehu) and Sant Dnyaneshwar (Alandi) shrines lie on its banks.",
  },
  pavna: { basin: "Krishna", origin: "Mawal Sahyadri", mouth: "Joins Mula at Pune", districts: ["Pune"], note: "Pavna (Pavana) Dam supplies water to Pimpri-Chinchwad." },
  bhama: { basin: "Krishna", origin: "Pune Sahyadri", mouth: "Joins Bhima at Tulapur", districts: ["Pune"] },
  ghod: { basin: "Krishna", origin: "Ghod source in Pune-Ahmadnagar border", mouth: "Joins Bhima", districts: ["Pune", "Ahmednagar"], note: "Ghod Dam is on this river." },
  nira: {
    basin: "Krishna",
    lengthKm: 257,
    origin: "Sahyadri at Bhor Ghat (Pune)",
    mouth: "Joins Bhima at Nira-Narsingpur (Solapur)",
    districts: ["Pune", "Satara", "Solapur"],
    note: "Veer Dam and Bhatghar Dam are on Nira.",
  },
  sina: {
    basin: "Krishna",
    lengthKm: 222,
    origin: "Ahmednagar plateau",
    mouth: "Joins Bhima in Solapur",
    districts: ["Ahmednagar", "Solapur"],
    note: "Drains the dry Ahmednagar–Solapur plain.",
  },
  panchganga: {
    basin: "Krishna",
    lengthKm: 80,
    origin: "Confluence of 5 streams (Kasari, Kumbhi, Tulsi, Bhogavati, Saraswati) at Prayag Sangam, Kolhapur",
    mouth: "Joins Krishna at Kurundwad",
    districts: ["Kolhapur"],
    note: "Kolhapur city sits on the Panchganga. ‘Pancha-ganga’ = five rivers in one.",
  },
  warna: {
    basin: "Krishna",
    lengthKm: 153,
    origin: "Prachitgad (Sahyadri, Sangli–Kolhapur border)",
    mouth: "Joins Krishna at Haripur near Sangli",
    districts: ["Sangli", "Kolhapur"],
    note: "Chandoli (Warna) Dam — within Chandoli/Sahyadri Tiger Reserve.",
  },
  yerla: { basin: "Krishna", origin: "Khanapur hills (Sangli)", mouth: "Joins Krishna near Brahmnal", districts: ["Sangli"] },
  dudhganga: {
    basin: "Krishna",
    lengthKm: 80,
    origin: "Radhanagari (Sahyadri, Kolhapur)",
    mouth: "Joins Krishna at Kurundwad",
    districts: ["Kolhapur"],
    note: "Kalammawadi (Dudhganga) Dam serves Kolhapur and parts of Karnataka.",
  },
  hiranyakeshi: { basin: "Krishna", origin: "Amboli (Sindhudurg / Kolhapur border)", mouth: "Joins Ghataprabha → Krishna (Karnataka)", districts: ["Kolhapur", "Sindhudurg"], note: "Amboli Falls is on the Hiranyakeshi." },
  agrani: { basin: "Krishna", origin: "Khanapur–Atpadi hills (Sangli)", mouth: "Joins Krishna near Sangli", districts: ["Sangli"] },

  /* Koyna sub-tributaries */
  solshi: { basin: "Krishna", origin: "Sahyadri (Satara)", mouth: "Joins Koyna", districts: ["Satara"] },
  kandati: { basin: "Krishna", origin: "Sahyadri (Satara)", mouth: "Joins Koyna", districts: ["Satara"] },
  morna: { basin: "Krishna", origin: "Sahyadri (Sangli)", mouth: "Joins Koyna", districts: ["Sangli"] },

  /* ─── Tapi basin ─────────────────────────────────────────────── */
  tapi: {
    basin: "Tapi",
    lengthKm: 724,
    origin: "Multai (Satpura range, Madhya Pradesh)",
    mouth: "Gulf of Khambhat, Arabian Sea (near Surat, Gujarat)",
    districts: ["Jalgaon", "Dhule", "Nandurbar"],
    note: "One of only three major peninsular rivers that flow WEST. Flows through a rift valley between Satpura and Sahyadri.",
  },
  "purna-tapi": {
    basin: "Tapi",
    lengthKm: 373,
    origin: "Bhainsdehi / Gawilgarh hills (Satpura, on MH–MP border)",
    mouth: "Joins Tapi at Changdev (Jalgaon)",
    districts: ["Amravati", "Akola", "Buldhana", "Jalgaon"],
    note: "Largest tributary of Tapi. Drains the Akola–Buldhana cotton belt.",
  },
  girna: {
    basin: "Tapi",
    lengthKm: 260,
    origin: "Hatgad / Anjaneri hills (Nashik Sahyadri)",
    mouth: "Joins Tapi at Kanalda (Jalgaon)",
    districts: ["Nashik", "Jalgaon"],
    note: "Girna Dam is a major irrigation reservoir of north Maharashtra.",
  },
  panzhra: { basin: "Tapi", origin: "Dhule Sahyadri", mouth: "Joins Tapi in Dhule", districts: ["Dhule"], note: "Panzhra Dam supplies Dhule city." },
  bori: { basin: "Tapi", origin: "Jalgaon hills", mouth: "Joins Tapi in Jalgaon", districts: ["Jalgaon"] },
  aner: { basin: "Tapi", origin: "Dhule Sahyadri", mouth: "Joins Tapi", districts: ["Dhule", "Jalgaon"] },

  /* ─── Konkan — west-flowing into the Arabian Sea ────────────── */
  vaitarna: {
    basin: "Konkan",
    lengthKm: 154,
    origin: "Trimbakeshwar (Nashik Sahyadri)",
    mouth: "Arabian Sea near Arnala / Vasai-Bhayander",
    districts: ["Nashik", "Palghar", "Thane"],
    note: "Upper Vaitarna, Tansa and Modaksagar — the three big lakes that water Mumbai — feed off Vaitarna.",
  },
  pinjal: { basin: "Konkan", origin: "Trimbakeshwar hills", mouth: "Joins Vaitarna", districts: ["Palghar"], note: "Proposed Pinjal Dam will further supply Mumbai." },
  surya: { basin: "Konkan", origin: "Palghar Sahyadri", mouth: "Joins Vaitarna", districts: ["Palghar"], note: "Surya Dam (Dhamani) supplies Palghar–Vasai-Virar." },
  tansa: { basin: "Konkan", origin: "Thane Sahyadri", mouth: "Joins Vaitarna", districts: ["Thane", "Palghar"], note: "Tansa Lake is a key Mumbai water source since 1892." },
  ulhas: {
    basin: "Konkan",
    lengthKm: 122,
    origin: "Sahyadri near Karjat (Raigad)",
    mouth: "Vasai Creek, Arabian Sea",
    districts: ["Raigad", "Thane", "Palghar"],
    note: "Longest west-flowing river entirely within MH. Drains the metropolitan Mumbai region.",
  },
  bhatsa: { basin: "Konkan", origin: "Sahyadri near Murbad", mouth: "Joins Ulhas near Bhiwandi", districts: ["Thane"], note: "Bhatsa Dam — biggest reservoir feeding Mumbai." },
  patalganga: { basin: "Konkan", origin: "Khopoli (Raigad Sahyadri)", mouth: "Karanja / Mumbai Harbour", districts: ["Raigad"], note: "Patalganga industrial belt (Reliance, HOC) is on this river." },
  amba: { basin: "Konkan", origin: "Sahyadri above Pen", mouth: "Dharamtar creek (Raigad)", districts: ["Raigad"] },
  kundalika: {
    basin: "Konkan",
    origin: "Sahyadri at Bhira (Raigad)",
    mouth: "Revdanda creek, Arabian Sea",
    districts: ["Raigad"],
    note: "India's premier white-water rafting river — controlled releases from Bhira Hydroelectric.",
  },
  savitri: {
    basin: "Konkan",
    lengthKm: 99,
    origin: "Mahabaleshwar — same spring as Krishna and Koyna",
    mouth: "Bankot creek, Arabian Sea (Raigad–Ratnagiri border)",
    districts: ["Raigad", "Ratnagiri"],
    note: "Mahad sits on the Savitri. Only river born at Mahabaleshwar that flows WEST.",
  },
  vashishti: {
    basin: "Konkan",
    origin: "Sahyadri above Chiplun",
    mouth: "Dabhol creek (Ratnagiri)",
    districts: ["Ratnagiri"],
    note: "Chiplun lies on the Vashishti — heavily flooded during 2021 Konkan deluge.",
  },
  shastri: { basin: "Konkan", origin: "Sahyadri near Sangameshwar", mouth: "Jaigad creek (Ratnagiri)", districts: ["Ratnagiri"] },
  kajli: { basin: "Konkan", origin: "Ratnagiri Sahyadri", mouth: "Arabian Sea near Ratnagiri town", districts: ["Ratnagiri"] },
  muchkundi: { basin: "Konkan", origin: "Lanja area (Ratnagiri)", mouth: "Purnagad creek", districts: ["Ratnagiri"] },
  gad: { basin: "Konkan", origin: "Sahyadri (Sindhudurg)", mouth: "Arabian Sea (Sindhudurg coast)", districts: ["Sindhudurg"] },
  karli: { basin: "Konkan", origin: "Sahyadri (Sindhudurg)", mouth: "Devbag near Malvan", districts: ["Sindhudurg"], note: "Karli backwaters at Devbag — famous Malvan tourism estuary." },
  terekhol: { basin: "Konkan", origin: "Sahyadri on MH–Goa border", mouth: "Arabian Sea at Terekhol Fort", districts: ["Sindhudurg"], note: "Forms the southern border of Maharashtra with Goa." },
  damanganga: {
    basin: "Konkan",
    lengthKm: 131,
    origin: "Sahyadri (Nashik / Palghar border)",
    mouth: "Arabian Sea near Daman",
    districts: ["Palghar"],
    note: "Inter-state — MH, Gujarat, Dadra & Nagar Haveli, Daman.",
  },
};

/** Convenience: enriched river feature with metadata + parent info. */
export interface EnrichedRiver extends RiverFeature {
  basin: Basin;
  isMain: boolean;
  meta?: RiverMeta;
}

/**
 * Returns every river from RIVERS enriched with its basin + metadata.
 * Falls back to a sensible default basin when no metadata entry exists
 * (defensive in case the data files drift).
 */
export function getEnrichedRivers(): EnrichedRiver[] {
  return RIVERS.map((r) => {
    const meta = RIVER_META[r.id];
    let basin: Basin = "Konkan";
    if (meta) {
      basin = meta.basin;
    } else if (r.parent) {
      const parentMeta = RIVER_META[r.parent];
      if (parentMeta) basin = parentMeta.basin;
    }
    return { ...r, basin, isMain: !r.parent, meta };
  });
}

/** Group enriched rivers by basin, mains first then tributaries. */
export function groupRiversByBasin(): Record<Basin, EnrichedRiver[]> {
  const out: Record<Basin, EnrichedRiver[]> = {
    Godavari: [], Krishna: [], Tapi: [], Konkan: [],
  };
  for (const r of getEnrichedRivers()) {
    out[r.basin].push(r);
  }
  // Mains first, then tributaries; both alphabetical within their group.
  for (const k of Object.keys(out) as Basin[]) {
    out[k].sort((a, b) => {
      if (a.isMain !== b.isMain) return a.isMain ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }
  return out;
}

export const BASINS: Basin[] = ["Godavari", "Krishna", "Tapi", "Konkan"];
