/**
 * Hand-curated Maharashtra geographic dataset for the interactive map.
 *
 * Coordinates are approximate (district centroids and well-known landmark
 * coordinates from public sources). Extend or replace by editing the arrays
 * below, or — better — by dropping a real GeoJSON file into /public and
 * loading it from MaharashtraMap.tsx.
 *
 * Structure: every layer (dams, waterfalls, ghats, nuclear, minerals, UNESCO,
 * forts) is a flat array of POI objects. Rivers are LineStrings. Districts
 * are point markers (centroid + zoom hint) until proper polygon GeoJSON is
 * added.
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

export interface DistrictMarker {
  id: string;
  name: string;
  coords: LatLng;
  /** Recommended flyTo zoom level for this district. */
  zoom: number;
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
/*  36 districts — centroids + recommended zoom for flyTo().           */
/* ─────────────────────────────────────────────────────────────────── */

export const DISTRICTS: DistrictMarker[] = [
  { id: "ahmednagar", name: "Ahmednagar", coords: [74.74, 19.09], zoom: 9 },
  { id: "akola", name: "Akola", coords: [77.00, 20.71], zoom: 9 },
  { id: "amravati", name: "Amravati", coords: [77.76, 20.93], zoom: 9 },
  { id: "aurangabad", name: "Chhatrapati Sambhajinagar (Aurangabad)", coords: [75.34, 19.88], zoom: 9 },
  { id: "beed", name: "Beed", coords: [75.76, 18.99], zoom: 9 },
  { id: "bhandara", name: "Bhandara", coords: [79.65, 21.17], zoom: 9 },
  { id: "buldhana", name: "Buldhana", coords: [76.18, 20.53], zoom: 9 },
  { id: "chandrapur", name: "Chandrapur", coords: [79.30, 19.96], zoom: 9 },
  { id: "dhule", name: "Dhule", coords: [74.78, 20.90], zoom: 9 },
  { id: "gadchiroli", name: "Gadchiroli", coords: [80.00, 20.18], zoom: 9 },
  { id: "gondia", name: "Gondia", coords: [80.20, 21.46], zoom: 9 },
  { id: "hingoli", name: "Hingoli", coords: [77.15, 19.72], zoom: 10 },
  { id: "jalgaon", name: "Jalgaon", coords: [75.57, 21.01], zoom: 9 },
  { id: "jalna", name: "Jalna", coords: [75.88, 19.84], zoom: 9 },
  { id: "kolhapur", name: "Kolhapur", coords: [74.24, 16.70], zoom: 9 },
  { id: "latur", name: "Latur", coords: [76.57, 18.40], zoom: 9 },
  { id: "mumbai-city", name: "Mumbai City", coords: [72.83, 18.95], zoom: 11 },
  { id: "mumbai-suburban", name: "Mumbai Suburban", coords: [72.86, 19.13], zoom: 10 },
  { id: "nagpur", name: "Nagpur", coords: [79.09, 21.15], zoom: 9 },
  { id: "nanded", name: "Nanded", coords: [77.32, 19.15], zoom: 9 },
  { id: "nandurbar", name: "Nandurbar", coords: [74.24, 21.37], zoom: 9 },
  { id: "nashik", name: "Nashik", coords: [73.79, 19.99], zoom: 9 },
  { id: "osmanabad", name: "Dharashiv (Osmanabad)", coords: [76.04, 18.18], zoom: 9 },
  { id: "palghar", name: "Palghar", coords: [72.77, 19.69], zoom: 9 },
  { id: "parbhani", name: "Parbhani", coords: [76.78, 19.26], zoom: 9 },
  { id: "pune", name: "Pune", coords: [73.86, 18.52], zoom: 9 },
  { id: "raigad", name: "Raigad", coords: [73.18, 18.51], zoom: 9 },
  { id: "ratnagiri", name: "Ratnagiri", coords: [73.31, 16.99], zoom: 9 },
  { id: "sangli", name: "Sangli", coords: [74.57, 16.85], zoom: 9 },
  { id: "satara", name: "Satara", coords: [74.00, 17.69], zoom: 9 },
  { id: "sindhudurg", name: "Sindhudurg", coords: [73.56, 16.13], zoom: 9 },
  { id: "solapur", name: "Solapur", coords: [75.91, 17.66], zoom: 9 },
  { id: "thane", name: "Thane", coords: [73.00, 19.22], zoom: 9 },
  { id: "wardha", name: "Wardha", coords: [78.61, 20.74], zoom: 9 },
  { id: "washim", name: "Washim", coords: [77.13, 20.11], zoom: 10 },
  { id: "yavatmal", name: "Yavatmal", coords: [78.13, 20.39], zoom: 9 },
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
