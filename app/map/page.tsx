import type { Metadata } from "next";
import Link from "next/link";
import MapPageClient from "./MapPageClient";

export const metadata: Metadata = {
  title: "Interactive Map of Maharashtra — Rivers, Tributaries, Forts, UNESCO sites",
  description:
    "Explore a high-resolution OpenStreetMap-based map of Maharashtra. See every major river — the Deccan systems (Godavari, Krishna, Bhima, Tapi, Wardha, Wainganga, Painganga) and the Konkan coastal rivers (Damanganga, Vaitarna, Ulhas, Patalganga, Amba, Kundalika, Savitri, Vashishti, Shastri, Kajli, Muchkundi, Gad, Karli, Terekhol) plus 30+ tributaries with name labels. Toggle separate layers for dams, waterfalls, ghats, nuclear plants (Tarapur), hydroelectric plants (Koyna, Bhira), thermal plants (Chandrapur, Koradi, Tiroda), minerals, UNESCO sites and historic forts (saffron flag).",
  keywords: [
    "Maharashtra map",
    "Maharashtra districts map",
    "Maharashtra rivers map",
    "Maharashtra forts map",
    "Sahyadri Western Ghats map",
    "Maharashtra UNESCO sites",
    "MPSC geography map",
  ],
  alternates: { canonical: "/map" },
  openGraph: {
    type: "article",
    title: "Interactive Map of Maharashtra — MPSC Geography",
    description:
      "Toggleable layers for rivers, forts, nuclear / hydro / thermal plants, dams, waterfalls, ghats, UNESCO sites and minerals across Maharashtra.",
    url: "https://www.mpscs.in/map",
    images: ["/og-image.png"],
  },
};

const SITE_URL = "https://www.mpscs.in";

const mapStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/map#webpage`,
      url: `${SITE_URL}/map`,
      name: "Interactive Map of Maharashtra — Rivers, Forts, Power Plants, UNESCO sites",
      description:
        "High-resolution OpenStreetMap interactive map of Maharashtra with toggleable layers for rivers, forts, dams, waterfalls, ghats, nuclear / hydro / thermal power plants, mineral belts and UNESCO sites.",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      breadcrumb: { "@id": `${SITE_URL}/map#breadcrumb` },
      inLanguage: "en-IN",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/map#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Maharashtra Map", item: `${SITE_URL}/map` },
      ],
    },
    {
      "@type": "ItemList",
      name: "Map layers",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Rivers + tributaries (50+ Deccan + Konkan rivers, inline labels)" },
        { "@type": "ListItem", position: 2, name: "Dams (Koyna, Jayakwadi, Bhandardara, Tansa, Ujani, Hatnur…)" },
        { "@type": "ListItem", position: 3, name: "Waterfalls (Thoseghar, Vajrai, Lingmala, Dabhosa…)" },
        { "@type": "ListItem", position: 4, name: "Sahyadri ghats (Tamhini, Amba, Malshej, Kasara, Bor, Varandha…)" },
        { "@type": "ListItem", position: 5, name: "Nuclear power plants (Tarapur, Jaitapur)" },
        { "@type": "ListItem", position: 6, name: "Hydroelectric plants (Koyna, Bhira, Bhivpuri, Khopoli, Pench, Tillari, Yeldari…)" },
        { "@type": "ListItem", position: 7, name: "Thermal power plants (Chandrapur, Koradi, Khaperkheda, Mauda, Tiroda, Parli, Bhusawal, Trombay, Dahanu, JSW Jaigad…)" },
        { "@type": "ListItem", position: 8, name: "Mineral belts (Manganese, Coal, Bauxite, Iron Ore, Limestone)" },
        { "@type": "ListItem", position: 9, name: "UNESCO sites (Ajanta, Ellora, Elephanta, CSMT, Western Ghats)" },
        { "@type": "ListItem", position: 10, name: "Historic forts (Raigad, Sinhagad, Pratapgad, Shivneri, Lohgad, Rajgad, Torna, Daulatabad, Panhala, Vijaydurg)" },
      ],
    },
  ],
};

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mapStructuredData) }}
      />
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Back to home"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100">
              <span aria-hidden>🗺️</span> Maharashtra — Interactive Map
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rivers · Dams · Waterfalls · Ghats · Nuclear / Hydro / Thermal plants · Forts · UNESCO · Minerals
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-6">
        <MapPageClient />

        {/* SEO context block (rendered as plain HTML for crawlers) */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">About this map</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            High-resolution OpenStreetMap-based interactive map of Maharashtra built
            specifically for MPSC geography preparation and casual exploration. The map
            opens with only the <strong>Rivers</strong> layer enabled so you can read the
            drainage clearly; tap any other pill in the layer panel on the left (or the
            <em>All</em> button) to add dams, waterfalls, ghats, the three power-plant
            categories (☢️ <strong>Nuclear</strong>, 🌀 <strong>Hydroelectric</strong>,
            🏭 <strong>Thermal</strong>), mineral belts, UNESCO sites and historic forts.
            The base tiles are streamed from OpenStreetMap, so every zoom level is razor
            sharp — pan to Konkan for the coastal rivers, zoom out to see the full state
            drainage, or fly to a specific district to check the layers around it.
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Deccan / east-flowing rivers</strong> &mdash; Godavari, Krishna, Bhima,
            Tapi, Wardha, Wainganga, Painganga &mdash; are drawn with a thicker dark-blue
            line, with their tributaries (Krishna: Koyna, Venna, Panchganga, Warna, Yerla,
            Dudhganga, Hiranyakeshi, Agrani; Koyna sub-tribs Solshi, Kandati, Morna;
            Godavari: Pravara, Manjira, Purna, Mula, Darna, Kadwa, Sindphana; Bhima:
            Mula-Mutha, Indrayani, Nira, Pavna, Bhama, Ghod, Sina; Tapi: Girna, Purna,
            Panzhra, Bori, Aner; Wardha: Yashoda, Wenna; Wainganga: Kanhan, Pench, Bagh,
            Bavanthadi; Painganga: Adan, Pus, Arunavati) drawn slightly thinner.
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Konkan / west-flowing coastal rivers</strong> &mdash; Damanganga,
            Vaitarna, Ulhas, Patalganga, Amba, Kundalika, Savitri, Vashishti, Shastri,
            Kajli, Muchkundi, Gad, Karli, Terekhol &mdash; all rise in the Sahyadri and
            empty into the Arabian Sea, shown with their tributaries (Vaitarna: Pinjal,
            Surya, Tansa; Ulhas: Bhatsa). Historic forts use a saffron flag marker.
          </p>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Map tiles &copy; OpenStreetMap contributors.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Why an interactive map for MPSC Geography?</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Every MPSC preliminary paper in the last decade has carried at least eight to
            twelve questions from Maharashtra Geography. The recurring themes are drainage
            (which river rises where, which tributary joins which mainstem, which basin a
            district belongs to), the Sahyadri and its ghats (which pass connects which
            district-pair on either side of the crest), the state&apos;s power infrastructure
            (which category of plant, which fuel, which capacity), mineral belts, forest
            cover and UNESCO-designated heritage sites. Reading these as a bullet list in a
            textbook is a slow way to internalise them; seeing them plotted on a single map
            is a fast way. That is why the map was built.
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            The map is organised as ten independently toggleable layers so an aspirant can
            revise one theme at a time without visual overload. A typical revision session
            starts with only the <strong>Rivers</strong> layer on to trace the six major
            basins, then adds <strong>Dams</strong> to see the storage nodes on each river,
            then adds one of the three power-plant layers to see how the drainage supports
            the state&apos;s energy grid, and finally adds <strong>Forts</strong> and
            <strong> UNESCO</strong> to overlay the historic and cultural map on top of the
            physical one. The whole cycle takes about ten minutes and covers roughly half of
            a typical MPSC Geography section by itself.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Layer-by-layer notes for revision</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>🏔️ Ghats.</strong> The Sahyadri range runs roughly 750 km north to south
            through Maharashtra, dividing the Konkan coastal strip from the Deccan plateau.
            The major ghats that MPSC asks about, from north to south, are Thal (Nashik ↔
            Mumbai), Kasara (Mumbai ↔ Nashik via the Igatpuri corridor), Malshej (Pune ↔
            Thane), Bor (part of the Khandala corridor on the Mumbai-Pune expressway),
            Tamhini (Pune ↔ Konkan), Varandha (Bhor ↔ Mahad), Kumbharli (Karad ↔ Chiplun),
            Amba (Kolhapur ↔ Ratnagiri) and Fonda (Belgaum ↔ Goa border). Each ghat maps to
            a specific district-pair, which is exactly the pairing MPSC tests.
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>💧 Dams.</strong> Maharashtra has more large dams than any other state
            in India (2,000+ of every size and 60+ major storages). The ten dams asked
            most frequently in MPSC PYQs are Koyna (Krishna basin, ~1,960 MW hydro),
            Jayakwadi (Godavari, Aurangabad, largest reservoir by volume), Bhandardara /
            Wilson (Pravara, one of India&apos;s oldest concrete dams from 1926), Tansa and
            Upper Vaitarna (Mumbai&apos;s primary drinking-water sources), Khadakwasla and
            Panshet (Pune water supply), Chandoli / Warna (Krishna sub-basin), Manjara
            (Godavari sub-basin), Ujani (Bhima, Solapur) and Hatnur (Tapi). Learn each dam
            with its river and its district; that triplet is almost always the answer key.
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>☢️ Nuclear plants.</strong> Only two are relevant to Maharashtra: the
            operational Tarapur Atomic Power Station (Palghar district, four units — TAPS-1
            and 2 are original BWRs from 1969, TAPS-3 and 4 are indigenous 540 MW PHWRs
            commissioned in 2005–06, total ~1,400 MW), and the proposed Jaitapur Nuclear
            Project (Ratnagiri district, six units of 1,650 MW EPRs planned in
            collaboration with France&apos;s EDF — this will become the world&apos;s largest
            nuclear plant if built).
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>🌀 Hydroelectric plants.</strong> Koyna (~1,960 MW across four stages,
            in Satara district, by far the largest hydro in the state), Bhira (300 MW, Tata
            Power, Raigad), Khopoli (72 MW, Tata Power), Bhivpuri (75 MW, Tata Power),
            Ghatghar (250 MW pumped storage, Ahmednagar), Pench (160 MW, Nagpur), Vaitarna
            (60 MW), Tillari (66 MW, Sindhudurg) and Yeldari (22.5 MW, Parbhani).
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>🏭 Thermal plants.</strong> Chandrapur STPS (3,340 MW, MahaGenco — the
            state&apos;s largest), Koradi (2,400 MW, Nagpur), Khaperkheda (1,340 MW,
            Nagpur), Mauda STPS (2,320 MW, NTPC), Tiroda (3,300 MW, Adani, Gondia),
            Parli (1,170 MW, Beed), Paras (500 MW, Akola), Bhusawal (1,420 MW, Jalgaon),
            Nashik / Eklahare (910 MW), Trombay (1,580 MW, Tata Mumbai), Dahanu (500 MW,
            Adani Palghar), JSW Ratnagiri / Jaigad (1,200 MW) and Uran gas-based (672 MW).
            Cluster them mentally into the Vidarbha cluster (Chandrapur, Koradi,
            Khaperkheda, Mauda, Tiroda), the Marathwada cluster (Parli, Paras) and the
            western cluster (Trombay, Dahanu, Jaigad).
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>🏛️ UNESCO sites &amp; forts.</strong> Ajanta Caves (Aurangabad district,
            Buddhist caves 200 BCE–650 CE), Ellora Caves (Aurangabad, syncretic Buddhist +
            Hindu + Jain caves, including the Kailasa temple at Cave 16), Elephanta Caves
            (Mumbai harbour, 5th–8th century Shaiva caves), Chhatrapati Shivaji Maharaj
            Terminus (CSMT, Mumbai, Victorian Gothic railway station), the Victorian Gothic
            and Art Deco Ensembles of Mumbai and the natural Western Ghats. The historic
            forts layer shows Raigad (Chhatrapati Shivaji Maharaj&apos;s capital, coronation
            1674), Sinhagad (Tanaji&apos;s battle), Pratapgad (Battle of Pratapgad 1659),
            Shivneri (birthplace of Chhatrapati Shivaji Maharaj), Lohgad, Rajgad, Torna
            (first fort captured by Shivaji), Daulatabad (Devagiri, the medieval Yadava
            capital), Panhala (largest fort in the Deccan) and the Vijaydurg sea fort.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-800 dark:bg-indigo-900/30">
          <h2 className="text-lg font-bold text-indigo-800 dark:text-indigo-200">Study-cycle suggestion</h2>
          <p className="mt-2 text-sm text-indigo-900/80 dark:text-indigo-200/90 leading-relaxed">
            Pair a fifteen-minute session on this map with the {""}
            <Link href="/study-guides/maharashtra-geography" className="underline underline-offset-2 hover:text-indigo-900 dark:hover:text-indigo-100">
              Maharashtra Geography study guide
            </Link>{" "}
            and a ten-question drill from the Topic Wise mode on the {""}
            <Link href="/" className="underline underline-offset-2 hover:text-indigo-900 dark:hover:text-indigo-100">home page</Link>.
            Repeat this cycle three times in a fortnight and Maharashtra Geography stops
            being a weak spot — a scoring bump of four to six marks is a common outcome
            reported by our users. For a district-wise view of the rivers alone, visit our
            dedicated {""}
            <Link href="/rivers-maharashtra" className="underline underline-offset-2 hover:text-indigo-900 dark:hover:text-indigo-100">
              Rivers of Maharashtra
            </Link>{" "}
            page.
          </p>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 py-6 dark:border-slate-700/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-slate-400 dark:text-slate-500">MPSC PYQ QUIZ &middot; Don&apos;t know Academy</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
              <Link href="/" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Home</Link>
              <span>|</span>
              <Link href="/exams" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Exams</Link>
              <span>|</span>
              <Link href="/study-guides" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Study guides</Link>
              <span>|</span>
              <Link href="/about" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">About</Link>
              <span>|</span>
              <Link href="/contact" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Contact</Link>
              <span>|</span>
              <Link href="/privacy" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Privacy</Link>
              <span>|</span>
              <Link href="/terms" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Terms</Link>
              <span>|</span>
              <Link href="/disclaimer" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Disclaimer</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
