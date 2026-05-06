/**
 * Hand-curated Maharashtra geographic dataset for the interactive map.
 *
 * Coordinates are approximate (district centroids and well-known landmark
 * coordinates from public sources). Extend or replace by editing the arrays
 * below, or — better — by dropping a real GeoJSON file into /public and
 * loading it from MaharashtraMap.tsx.
 *
 * Structure: every layer (dams, waterfalls, ghats, nuclear, minerals, UNESCO,
 * forts) is a flat array of POI objects. Rivers are LineStrings with an
 * optional `parent` field marking tributaries.
 */

export type LatLng = [number, number]; // [lng, lat] — GeoJSON order

export interface Poi {
  id: string;
  name: string;
  /** Optional secondary text (district, type, etc.) shown in the popup. */
  subtitle?: string;
  coords: LatLng;
}

export interface RiverFeature {
  id: string;
  name: string;
  /** Coarse polyline of the river path, [lng, lat] pairs. */
  path: LatLng[];
  /** id of the parent river if this is a tributary; undefined for main rivers. */
  parent?: string;
}

export interface MineralPoi extends Poi {
  /** Mineral type — drives the heatmap colouring. */
  mineral:
    | "Manganese"
    | "Coal"
    | "Bauxite"
    | "Iron Ore"
    | "Limestone"
    | "Copper";
}

/* ─────────────────────────────────────────────────────────────────── */
/*  Maharashtra envelope (used to restrict the map view).              */
/* ─────────────────────────────────────────────────────────────────── */

export const MAHARASHTRA_CENTER: LatLng = [76.5, 19.0];
export const MAHARASHTRA_BOUNDS: [LatLng, LatLng] = [
  [72.5, 15.5], // SW
  [80.9, 22.2], // NE
];

/* ─────────────────────────────────────────────────────────────────── */
/*  Major rivers — coarse polylines.                                   */
/* ─────────────────────────────────────────────────────────────────── */

export const RIVERS: RiverFeature[] = [
  /* ─── Main rivers ─────────────────────────────────────────── */
  {
    id: "godavari",
    name: "Godavari",
    path: [
      [73.69, 19.93], // Trimbakeshwar (source)
      [74.16, 19.95],
      [74.74, 19.94],
      [75.34, 19.88], // near Aurangabad
      [76.30, 19.30],
      [77.32, 19.15], // Nanded
      [78.20, 18.90],
    ],
  },
  {
    id: "krishna",
    name: "Krishna",
    path: [
      [73.65, 17.93], // Mahabaleshwar (source)
      [74.00, 17.69], // Satara
      [74.57, 16.85], // Sangli
      [74.92, 16.62],
      [75.50, 16.20],
    ],
  },
  {
    id: "bhima",
    name: "Bhima",
    path: [
      [73.50, 19.10], // Bhimashankar (source)
      [73.86, 18.52], // Pune
      [75.20, 17.90],
      [75.91, 17.66], // Solapur
      [76.50, 17.30],
    ],
  },
  {
    id: "tapi",
    name: "Tapi",
    path: [
      [78.30, 21.50],
      [76.80, 21.20],
      [75.57, 21.01], // Jalgaon
      [74.80, 21.10],
      [73.20, 21.20], // exits to Gujarat
    ],
  },
  {
    id: "wardha",
    name: "Wardha",
    path: [
      [78.10, 21.80],
      [78.61, 20.74], // Wardha
      [79.00, 20.20],
      [79.30, 19.96], // joins Wainganga near Chandrapur
    ],
  },
  {
    id: "wainganga",
    name: "Wainganga",
    path: [
      [80.00, 21.80],
      [79.65, 21.17], // Bhandara
      [79.50, 20.50],
      [79.30, 19.96],
    ],
  },
  {
    id: "painganga",
    name: "Painganga",
    path: [
      [76.20, 20.35], // Ajanta hills (source area)
      [76.80, 20.15],
      [77.40, 19.90],
      [78.00, 19.70],
      [78.45, 19.62], // joins Wardha at Wadhona
    ],
  },
  {
    id: "vaitarna",
    name: "Vaitarna",
    path: [
      [73.55, 19.95], // Trimbakeshwar hills (source)
      [73.40, 19.80], // Igatpuri area
      [73.20, 19.60], // Vaitarna dam area
      [73.00, 19.45],
      [72.83, 19.30], // Arabian Sea (near Vasai-Bhayander)
    ],
  },
  {
    id: "savitri",
    name: "Savitri",
    path: [
      [73.45, 18.10],
      [73.20, 18.05],
      [73.00, 17.99], // Mahad / Bankot
    ],
  },

  /* ─── Krishna basin tributaries ───────────────────────────── */
  {
    id: "koyna",
    name: "Koyna",
    parent: "krishna",
    path: [
      [73.75, 17.40], // Koyna Dam
      [73.95, 17.40],
      [74.18, 17.30], // joins Krishna at Karad (Preeti Sangam)
    ],
  },
  {
    id: "venna",
    name: "Venna",
    parent: "krishna",
    path: [
      [73.69, 17.93], // Mahabaleshwar
      [73.85, 17.78],
      [74.00, 17.70], // joins Krishna near Mahuli (Satara)
    ],
  },
  {
    id: "panchganga",
    name: "Panchganga",
    parent: "krishna",
    path: [
      [74.00, 16.78], // forms near Kolhapur
      [74.40, 16.72],
      [74.70, 16.70], // joins Krishna at Kurundwad
    ],
  },
  {
    id: "warna",
    name: "Warna",
    parent: "krishna",
    path: [
      [73.78, 17.06], // Chandoli (Warna) Dam
      [74.20, 16.95],
      [74.62, 16.85], // joins Krishna near Sangli
    ],
  },
  {
    id: "yerla",
    name: "Yerla",
    parent: "krishna",
    path: [
      [74.20, 17.30], // Sangli district source
      [74.40, 17.05],
      [74.65, 16.85], // joins Krishna near Brahmnal
    ],
  },
  {
    id: "dudhganga",
    name: "Dudhganga",
    parent: "krishna",
    path: [
      [74.05, 16.55], // Sahyadri (Radhanagari)
      [74.40, 16.62],
      [74.70, 16.65], // joins Krishna near Kurundwad
    ],
  },
  {
    id: "hiranyakeshi",
    name: "Hiranyakeshi",
    parent: "krishna",
    path: [
      [74.00, 15.95], // Amboli source
      [74.30, 16.05],
      [74.55, 16.18], // joins Ghataprabha → Krishna
    ],
  },
  {
    id: "agrani",
    name: "Agrani",
    parent: "krishna",
    path: [
      [74.30, 17.00],
      [74.55, 16.85],
      [74.65, 16.78], // joins Krishna near Sangli
    ],
  },

  /* ─── Koyna sub-tributaries ───────────────────────────────── */
  {
    id: "solshi",
    name: "Solshi",
    parent: "koyna",
    path: [
      [73.65, 17.48],
      [73.72, 17.43], // joins Koyna
    ],
  },
  {
    id: "kandati",
    name: "Kandati",
    parent: "koyna",
    path: [
      [73.80, 17.52],
      [73.78, 17.43], // joins Koyna
    ],
  },
  {
    id: "morna",
    name: "Morna",
    parent: "koyna",
    path: [
      [73.85, 17.20],
      [73.95, 17.30],
      [74.00, 17.35], // joins Koyna
    ],
  },

  /* ─── Bhima basin tributaries ─────────────────────────────── */
  {
    id: "mula-mutha",
    name: "Mula-Mutha",
    parent: "bhima",
    path: [
      [73.86, 18.52], // Pune (Mula & Mutha confluence)
      [74.05, 18.65],
      [74.20, 18.74], // joins Bhima at Tulapur
    ],
  },
  {
    id: "indrayani",
    name: "Indrayani",
    parent: "bhima",
    path: [
      [73.55, 18.78], // Lonavala area
      [73.90, 18.72],
      [74.20, 18.74], // joins Bhima at Tulapur
    ],
  },
  {
    id: "nira",
    name: "Nira",
    parent: "bhima",
    path: [
      [73.85, 18.05],
      [74.50, 18.00],
      [75.10, 17.85], // joins Bhima south of Pune
    ],
  },
  {
    id: "pavna",
    name: "Pavna",
    parent: "bhima",
    path: [
      [73.45, 18.80], // Lonavala source
      [73.65, 18.65],
      [73.85, 18.55], // joins Mula at Pune
    ],
  },
  {
    id: "bhama",
    name: "Bhama",
    parent: "bhima",
    path: [
      [73.85, 18.95],
      [74.00, 18.85],
      [74.20, 18.75], // joins Bhima at Tulapur
    ],
  },
  {
    id: "ghod",
    name: "Ghod",
    parent: "bhima",
    path: [
      [74.05, 19.10],
      [74.40, 18.90],
      [74.70, 18.65], // joins Bhima
    ],
  },
  {
    id: "sina",
    name: "Sina",
    parent: "bhima",
    path: [
      [74.80, 19.10], // Ahmednagar source
      [75.30, 18.50],
      [75.85, 17.70], // joins Bhima in Solapur
    ],
  },

  /* ─── Godavari basin tributaries ──────────────────────────── */
  {
    id: "pravara",
    name: "Pravara",
    parent: "godavari",
    path: [
      [73.75, 19.54], // Bhandardara (source area)
      [74.50, 19.60],
      [74.95, 19.55], // joins Godavari at Pravara Sangam (Toka)
    ],
  },
  {
    id: "manjira",
    name: "Manjira",
    parent: "godavari",
    path: [
      [75.50, 18.50],
      [76.40, 18.40],
      [77.40, 18.10], // exits to Telangana, joins Godavari downstream
    ],
  },
  {
    id: "purna-godavari",
    name: "Purna",
    parent: "godavari",
    path: [
      [76.40, 19.95],
      [76.78, 19.65],
      [77.30, 19.25], // joins Godavari near Nanded
    ],
  },
  {
    id: "mula-godavari",
    name: "Mula",
    parent: "godavari",
    path: [
      [73.95, 19.40], // Sahyadri source
      [74.50, 19.45],
      [74.95, 19.50], // joins Pravara → Godavari near Toka
    ],
  },
  {
    id: "darna",
    name: "Darna",
    parent: "godavari",
    path: [
      [73.55, 19.80], // Igatpuri source
      [73.70, 19.90],
      [73.85, 19.95], // joins Godavari near Nashik
    ],
  },
  {
    id: "kadwa",
    name: "Kadwa",
    parent: "godavari",
    path: [
      [74.05, 20.10],
      [74.20, 20.05],
      [74.30, 19.95],
    ],
  },
  {
    id: "sindphana",
    name: "Sindphana",
    parent: "godavari",
    path: [
      [75.80, 19.00], // Beed
      [76.00, 19.20],
      [76.30, 19.30], // joins Godavari
    ],
  },

  /* ─── Tapi basin tributaries ──────────────────────────────── */
  {
    id: "girna",
    name: "Girna",
    parent: "tapi",
    path: [
      [74.20, 20.45],
      [74.90, 20.70],
      [75.40, 20.95], // joins Tapi in Jalgaon district
    ],
  },
  {
    id: "purna-tapi",
    name: "Purna",
    parent: "tapi",
    path: [
      [76.50, 21.20], // Satpura source
      [76.20, 21.10],
      [75.85, 21.05], // joins Tapi at Changdev
    ],
  },
  {
    id: "panzhra",
    name: "Panzhra",
    parent: "tapi",
    path: [
      [74.10, 20.85], // Dhule source
      [74.50, 20.90],
      [74.80, 21.00], // joins Tapi
    ],
  },
  {
    id: "bori",
    name: "Bori",
    parent: "tapi",
    path: [
      [75.45, 20.50], // Jalgaon
      [75.55, 20.80],
      [75.60, 21.00], // joins Tapi
    ],
  },
  {
    id: "aner",
    name: "Aner",
    parent: "tapi",
    path: [
      [74.85, 20.85],
      [75.05, 20.95],
      [75.20, 21.05], // joins Tapi
    ],
  },

  /* ─── Wardha basin tributaries ────────────────────────────── */
  {
    id: "yashoda",
    name: "Yashoda",
    parent: "wardha",
    path: [
      [78.30, 21.30],
      [78.50, 21.00],
      [78.60, 20.80], // joins Wardha near Wardha city
    ],
  },
  {
    id: "wenna-wardha",
    name: "Wenna",
    parent: "wardha",
    path: [
      [78.55, 21.05],
      [78.62, 20.92],
      [78.65, 20.80], // joins Wardha
    ],
  },

  /* ─── Wainganga basin tributaries ─────────────────────────── */
  {
    id: "kanhan",
    name: "Kanhan",
    parent: "wainganga",
    path: [
      [78.85, 21.70], // Chhindwara hills
      [79.20, 21.40],
      [79.55, 21.00], // joins Wainganga north of Bhandara
    ],
  },
  {
    id: "pench",
    name: "Pench",
    parent: "wainganga",
    path: [
      [78.95, 21.65],
      [79.10, 21.45],
      [79.30, 21.20], // joins Kanhan → Wainganga
    ],
  },
  {
    id: "bagh",
    name: "Bagh",
    parent: "wainganga",
    path: [
      [80.10, 21.10],
      [79.85, 21.20],
      [79.65, 21.15], // joins Wainganga
    ],
  },
  {
    id: "bavanthadi",
    name: "Bavanthadi",
    parent: "wainganga",
    path: [
      [80.30, 21.50],
      [80.10, 21.40],
      [79.85, 21.30], // joins Wainganga
    ],
  },

  /* ─── Painganga sub-tributaries ───────────────────────────── */
  {
    id: "adan",
    name: "Adan",
    parent: "painganga",
    path: [
      [77.30, 20.35], // Washim source
      [77.55, 20.10],
      [77.80, 19.85], // joins Painganga
    ],
  },
  {
    id: "pus",
    name: "Pus",
    parent: "painganga",
    path: [
      [77.85, 20.30], // Yavatmal
      [77.95, 20.00],
      [78.05, 19.75], // joins Painganga
    ],
  },
  {
    id: "arunavati",
    name: "Arunavati",
    parent: "painganga",
    path: [
      [77.50, 19.95],
      [77.75, 19.80],
      [78.00, 19.70], // joins Painganga
    ],
  },

  /* ─── Vaitarna sub-tributaries ────────────────────────────── */
  {
    id: "pinjal",
    name: "Pinjal",
    parent: "vaitarna",
    path: [
      [73.30, 19.85],
      [73.20, 19.75],
      [73.15, 19.60], // joins Vaitarna
    ],
  },
  {
    id: "surya",
    name: "Surya",
    parent: "vaitarna",
    path: [
      [73.05, 19.85], // Palghar
      [73.00, 19.65],
      [72.90, 19.45], // joins Vaitarna
    ],
  },
  {
    id: "tansa",
    name: "Tansa",
    parent: "vaitarna",
    path: [
      [73.30, 19.55], // Tansa dam area
      [73.20, 19.45],
      [73.05, 19.35], // joins Vaitarna
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────── */
/*  Dams.                                                              */
/* ─────────────────────────────────────────────────────────────────── */

export const DAMS: Poi[] = [
  { id: "koyna", name: "Koyna Dam", subtitle: "Satara · Krishna basin", coords: [73.75, 17.40] },
  { id: "jayakwadi", name: "Jayakwadi Dam", subtitle: "Aurangabad · Godavari", coords: [75.37, 19.49] },
  { id: "bhandardara", name: "Bhandardara (Wilson) Dam", subtitle: "Ahmednagar · Pravara", coords: [73.75, 19.54] },
  { id: "tansa", name: "Tansa Dam", subtitle: "Thane · Mumbai water supply", coords: [73.20, 19.55] },
  { id: "vaitarna", name: "Upper Vaitarna Dam", subtitle: "Nashik / Thane", coords: [73.32, 19.84] },
  { id: "khadakwasla", name: "Khadakwasla Dam", subtitle: "Pune · Mutha", coords: [73.77, 18.44] },
  { id: "panshet", name: "Panshet Dam", subtitle: "Pune · Ambi", coords: [73.61, 18.39] },
  { id: "warna", name: "Chandoli (Warna) Dam", subtitle: "Sangli · Warna", coords: [73.78, 17.06] },
  { id: "manjara", name: "Manjara Dam", subtitle: "Beed · Manjara", coords: [76.20, 18.50] },
  { id: "hatnur", name: "Hatnur Dam", subtitle: "Jalgaon · Tapi", coords: [76.07, 21.07] },
  { id: "ujani", name: "Ujani Dam", subtitle: "Solapur · Bhima", coords: [75.13, 18.07] },
  { id: "totladoh", name: "Totladoh (Pench) Dam", subtitle: "Nagpur · Pench", coords: [79.20, 21.60] },
];

/* ─────────────────────────────────────────────────────────────────── */
/*  Waterfalls.                                                        */
/* ─────────────────────────────────────────────────────────────────── */

export const WATERFALLS: Poi[] = [
  { id: "thoseghar", name: "Thoseghar Falls", subtitle: "Satara", coords: [73.83, 17.55] },
  { id: "vajrai", name: "Vajrai Falls", subtitle: "Satara · India's tallest cascade", coords: [73.79, 17.56] },
  { id: "kune", name: "Kune Falls", subtitle: "Khandala, Pune", coords: [73.39, 18.75] },
  { id: "bhushi", name: "Bhushi Dam Falls", subtitle: "Lonavala, Pune", coords: [73.40, 18.74] },
  { id: "marleshwar", name: "Marleshwar Falls", subtitle: "Ratnagiri", coords: [73.58, 17.21] },
  { id: "dabhosa", name: "Dabhosa Falls", subtitle: "Palghar", coords: [73.13, 19.78] },
  { id: "randha", name: "Randha Falls", subtitle: "Ahmednagar · Pravara", coords: [73.69, 19.55] },
  { id: "lingmala", name: "Lingmala Falls", subtitle: "Mahabaleshwar, Satara", coords: [73.69, 17.93] },
  { id: "amboli", name: "Amboli Falls", subtitle: "Sindhudurg", coords: [74.00, 15.95] },
  { id: "gokak", name: "Gokak-style Falls (Sahyadri)", subtitle: "Kolhapur ghats", coords: [74.10, 16.40] },
];

/* ─────────────────────────────────────────────────────────────────── */
/*  Ghats / mountain passes.                                           */
/* ─────────────────────────────────────────────────────────────────── */

export const GHATS: Poi[] = [
  { id: "tamhini", name: "Tamhini Ghat", subtitle: "Pune ↔ Konkan", coords: [73.42, 18.44] },
  { id: "amba", name: "Amba Ghat", subtitle: "Kolhapur ↔ Ratnagiri", coords: [73.79, 17.05] },
  { id: "malshej", name: "Malshej Ghat", subtitle: "Pune ↔ Thane", coords: [73.78, 19.34] },
  { id: "kasara", name: "Kasara (Thal) Ghat", subtitle: "Mumbai ↔ Nashik", coords: [73.47, 19.65] },
  { id: "kumbharli", name: "Kumbharli Ghat", subtitle: "Karad ↔ Chiplun", coords: [73.65, 17.42] },
  { id: "varandha", name: "Varandha Ghat", subtitle: "Bhor ↔ Mahad", coords: [73.55, 18.10] },
  { id: "bor", name: "Bor Ghat", subtitle: "Mumbai ↔ Pune (Khandala)", coords: [73.39, 18.75] },
  { id: "khambatki", name: "Khambatki Ghat", subtitle: "Pune ↔ Satara", coords: [74.05, 18.05] },
];

/* ─────────────────────────────────────────────────────────────────── */
/*  Nuclear & major hydro power plants.                                */
/* ─────────────────────────────────────────────────────────────────── */

export const POWER_PLANTS: Poi[] = [
  { id: "tarapur", name: "Tarapur Atomic Power Station", subtitle: "Palghar · Nuclear, ~1400 MW", coords: [72.66, 19.83] },
  { id: "koyna-hydro", name: "Koyna Hydroelectric Project", subtitle: "Satara · Hydro, ~1960 MW", coords: [73.75, 17.40] },
  { id: "ghatghar", name: "Ghatghar Pumped Storage", subtitle: "Ahmednagar · Hydro, 250 MW", coords: [73.65, 19.62] },
  { id: "pench-hydro", name: "Pench Hydroelectric", subtitle: "Nagpur · Hydro, 160 MW", coords: [79.20, 21.60] },
  { id: "bhira", name: "Bhira Hydroelectric (Tata)", subtitle: "Raigad · Hydro, 300 MW", coords: [73.36, 18.42] },
  { id: "khopoli", name: "Khopoli Hydroelectric", subtitle: "Raigad · Hydro, 72 MW", coords: [73.34, 18.78] },
];

/* ─────────────────────────────────────────────────────────────────── */
/*  Mineral deposits — drives heat-style colouring on the map.         */
/* ─────────────────────────────────────────────────────────────────── */

export const MINERALS: MineralPoi[] = [
  { id: "min-nagpur", name: "Manganese belt", subtitle: "Nagpur–Bhandara", mineral: "Manganese", coords: [79.40, 21.10] },
  { id: "min-bhandara", name: "Manganese deposits", subtitle: "Bhandara", mineral: "Manganese", coords: [79.65, 21.17] },
  { id: "min-chandrapur", name: "Coal fields", subtitle: "Chandrapur (Wardha valley)", mineral: "Coal", coords: [79.30, 19.96] },
  { id: "min-yavatmal", name: "Coal deposits", subtitle: "Yavatmal (Wani)", mineral: "Coal", coords: [78.95, 20.05] },
  { id: "min-kolhapur", name: "Bauxite reserves", subtitle: "Kolhapur (Radhanagari)", mineral: "Bauxite", coords: [74.10, 16.40] },
  { id: "min-sindhudurg", name: "Iron ore reserves", subtitle: "Sindhudurg (Redi)", mineral: "Iron Ore", coords: [73.65, 15.75] },
  { id: "min-ratnagiri", name: "Bauxite & Iron Ore", subtitle: "Ratnagiri", mineral: "Bauxite", coords: [73.31, 17.10] },
  { id: "min-yav-lime", name: "Limestone deposits", subtitle: "Yavatmal", mineral: "Limestone", coords: [78.13, 20.39] },
  { id: "min-gadchiroli", name: "Iron ore (Surjagarh)", subtitle: "Gadchiroli", mineral: "Iron Ore", coords: [80.42, 19.85] },
];

/* ─────────────────────────────────────────────────────────────────── */
/*  UNESCO World Heritage Sites in Maharashtra.                        */
/* ─────────────────────────────────────────────────────────────────── */

export const UNESCO_SITES: Poi[] = [
  { id: "ajanta", name: "Ajanta Caves", subtitle: "Aurangabad · UNESCO", coords: [75.70, 20.55] },
  { id: "ellora", name: "Ellora Caves", subtitle: "Aurangabad · UNESCO", coords: [75.18, 20.02] },
  { id: "elephanta", name: "Elephanta Caves", subtitle: "Mumbai harbour · UNESCO", coords: [72.93, 18.96] },
  { id: "cst", name: "Chhatrapati Shivaji Maharaj Terminus (CSMT)", subtitle: "Mumbai · UNESCO", coords: [72.84, 18.94] },
  { id: "victorian-art-deco", name: "Victorian Gothic & Art Deco Ensembles", subtitle: "Mumbai · UNESCO", coords: [72.83, 18.93] },
  { id: "western-ghats", name: "Western Ghats (Sahyadri)", subtitle: "UNESCO Natural Site", coords: [73.65, 17.93] },
];

/* ─────────────────────────────────────────────────────────────────── */
/*  Historic forts.                                                    */
/* ─────────────────────────────────────────────────────────────────── */

export const FORTS: Poi[] = [
  { id: "raigad", name: "Raigad Fort", subtitle: "Capital of the Maratha Empire", coords: [73.44, 18.23] },
  { id: "sinhagad", name: "Sinhagad Fort", subtitle: "Pune · Tanaji Malusare's battle", coords: [73.76, 18.37] },
  { id: "pratapgad", name: "Pratapgad Fort", subtitle: "Satara · Battle of Pratapgad 1659", coords: [73.58, 17.94] },
  { id: "shivneri", name: "Shivneri Fort", subtitle: "Pune · Birthplace of Shivaji Maharaj", coords: [73.85, 19.20] },
  { id: "lohgad", name: "Lohgad Fort", subtitle: "Pune · Iron fort", coords: [73.48, 18.70] },
  { id: "rajgad", name: "Rajgad Fort", subtitle: "Pune · Original Maratha capital", coords: [73.68, 18.25] },
  { id: "torna", name: "Torna (Prachandagad) Fort", subtitle: "Pune · First fort captured by Shivaji", coords: [73.62, 18.27] },
  { id: "daulatabad", name: "Daulatabad Fort", subtitle: "Aurangabad · Devagiri", coords: [75.22, 19.94] },
  { id: "panhala", name: "Panhala Fort", subtitle: "Kolhapur · Largest fort in the Deccan", coords: [74.10, 16.81] },
  { id: "vijaydurg", name: "Vijaydurg (Sea) Fort", subtitle: "Sindhudurg · Coastal fort", coords: [73.33, 16.56] },
];
