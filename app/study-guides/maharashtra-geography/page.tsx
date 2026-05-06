import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maharashtra Geography for MPSC — Physical Divisions, Rivers, Climate, Soils & Resources",
  description:
    "Complete Maharashtra geography study guide for MPSC: location, physical divisions (Konkan, Sahyadri, Deccan plateau), Deccan and Konkan rivers, monsoon, soils, agriculture, minerals, lakes and natural landmarks. Long-form notes mapped to MPSC prelims syllabus.",
  keywords: [
    "Maharashtra geography for MPSC",
    "Konkan coast",
    "Sahyadri Western Ghats",
    "Deccan plateau Maharashtra",
    "rivers of Maharashtra",
    "Konkan rivers",
    "soils of Maharashtra",
    "Maharashtra minerals",
    "MPSC geography notes",
  ],
  alternates: { canonical: "/study-guides/maharashtra-geography" },
};

export default function MaharashtraGeographyGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/study-guides"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Back to study guides"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Maharashtra Geography</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">MPSC Study Guide · ~14 min read</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <article className="prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:prose-invert dark:border-slate-700 dark:bg-slate-800 sm:p-9">
          <h2>Maharashtra Geography for MPSC — A Complete Guide</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: April 2026 · Reading time: ~14 minutes
          </p>

          <p>
            Maharashtra geography is one of the highest-scoring sections in every MPSC prelims paper —
            Group B, Group C, PSI and Gazetted Civil/Technical Services all draw 8–14 questions from
            it. This guide walks through the full syllabus in one read: location and physical
            divisions, the river systems, climate, soils, vegetation, agriculture, minerals, lakes
            and the most-asked landmarks. It pairs naturally with our {""}
            <Link href="/map">interactive map of Maharashtra</Link> — open it in a second tab and
            you&apos;ll be able to point to every river, fort, dam and ghat as you read.
          </p>

          <h3>1. Location, area and administrative divisions</h3>
          <p>
            Maharashtra lies in the western and central part of peninsular India between roughly
            15°40&apos; N to 22°N latitude and 72°36&apos; E to 80°54&apos; E longitude. With a
            total area of about <strong>3.08 lakh sq km</strong> it is India&apos;s third-largest
            state by area (after Rajasthan and Madhya Pradesh) and the second-largest by population
            (after Uttar Pradesh).
          </p>
          <ul>
            <li><strong>Coastline</strong>: about 720 km along the Arabian Sea (the Konkan coast).</li>
            <li>
              <strong>Borders</strong>: Gujarat and Dadra &amp; Nagar Haveli to the north-west,
              Madhya Pradesh to the north, Chhattisgarh to the east, Telangana to the south-east,
              Karnataka to the south, and Goa to the south-west.
            </li>
            <li>
              <strong>Administrative divisions</strong>: 6 revenue divisions (Konkan, Pune, Nashik,
              Aurangabad, Amravati, Nagpur) and 36 districts.
            </li>
            <li><strong>Capital</strong>: Mumbai. <strong>Sub-capital</strong>: Nagpur.</li>
          </ul>

          <h3>2. Physical divisions</h3>
          <p>
            Maharashtra is divided into three broad physical regions running roughly parallel to the
            Arabian Sea coast:
          </p>

          <h4>2.1 The Konkan coastal plain</h4>
          <p>
            A narrow strip of low-lying land, 30–50 km wide, between the Arabian Sea and the western
            edge of the Sahyadri. It runs from Daman in the north to the Goa border in the south
            and covers the districts of Palghar, Thane, Mumbai City, Mumbai Suburban, Raigad,
            Ratnagiri and Sindhudurg. The terrain is broken by short, fast-flowing west-flowing
            rivers, tidal creeks (khaadi), red and lateritic soils, and offshore islands. North
            Konkan is gentler and more urbanised; South Konkan (Ratnagiri, Sindhudurg) is hillier
            and more forested.
          </p>

          <h4>2.2 The Sahyadri (Western Ghats)</h4>
          <p>
            The Sahyadri runs north-to-south for about 750 km along Maharashtra&apos;s western
            edge, average elevation 900–1,200 m. It is a fault-block escarpment formed by the
            uplift of the Deccan plateau and the subsidence of the Arabian Sea floor. Important
            peaks include <strong>Kalsubai</strong> (1,646 m — the highest in Maharashtra,
            Ahmednagar), Salher (1,567 m, Nashik), Mahabaleshwar (1,438 m, Satara) and Harishchandragad
            (1,424 m, Ahmednagar). The Sahyadri is part of the UNESCO Western Ghats natural
            heritage site and is the source of every major Deccan river that flows east.
          </p>
          <p>
            The Sahyadri is crossed by famous mountain passes (<em>ghats</em>): Thal/Kasara
            (Mumbai–Nashik), Bor/Khandala (Mumbai–Pune), Tamhini (Pune–Konkan), Varandha
            (Bhor–Mahad), Amba (Kolhapur–Ratnagiri), Kumbharli (Karad–Chiplun), Malshej
            (Pune–Thane) and Khambatki (Pune–Satara).
          </p>

          <h4>2.3 The Maharashtra plateau (Deccan plateau)</h4>
          <p>
            Everything east of the Sahyadri is the Maharashtra plateau, a lava-formed plateau (the
            Deccan Traps) sloping gently from west to east. Average elevation is 450–750 m. It is
            sub-divided based on relief and drainage into the <strong>Western plateau</strong>
            (Pune, Satara, Sangli, Kolhapur), the <strong>Marathwada plateau</strong> (Aurangabad,
            Beed, Latur, Osmanabad, Nanded), and the <strong>Vidarbha region</strong> (Nagpur,
            Amravati, Wardha, Yavatmal, Chandrapur, Gadchiroli, Bhandara, Gondia). Nearly 80% of
            Maharashtra is plateau.
          </p>

          <h3>3. Drainage — rivers of Maharashtra</h3>
          <p>
            Rivers of Maharashtra fall into two clean groups based on the direction of flow.
          </p>

          <h4>3.1 East-flowing (Deccan / Bay of Bengal) rivers</h4>
          <p>
            All the major rivers of the plateau rise in the Sahyadri and flow east, eventually
            draining into the Bay of Bengal. They are large, perennial and form Maharashtra&apos;s
            principal irrigation network.
          </p>
          <ul>
            <li>
              <strong>Godavari</strong> (1,465 km total; ~668 km in Maharashtra). Rises at
              Trimbakeshwar, Nashik. Tributaries in Maharashtra include Pravara, Mula, Darna,
              Kadwa, Manjira, Purna and Sindphana. Often called the <em>Dakshin Ganga</em> (Ganga
              of the South).
            </li>
            <li>
              <strong>Krishna</strong> (1,400 km total; ~282 km in Maharashtra). Rises at
              Mahabaleshwar. Tributaries include Koyna (which itself has Solshi, Kandati, Morna),
              Venna, Warna, Panchganga, Yerla, Dudhganga, Hiranyakeshi and Agrani.
            </li>
            <li>
              <strong>Bhima</strong> (rises at Bhimashankar, ~451 km in Maharashtra) — a major
              tributary of the Krishna. Its own tributaries are Pavna, Mula-Mutha, Indrayani,
              Bhama, Ghod, Nira and Sina.
            </li>
            <li>
              <strong>Tapi</strong> (724 km total; ~228 km in Maharashtra) — one of the only large
              west-flowing rivers in peninsular India, draining into the Gulf of Khambhat. Rises in
              Satpura (Multai, MP). Maharashtra tributaries: Girna, Purna, Panzhra, Bori, Aner.
            </li>
            <li>
              <strong>Wardha</strong> (rises in Satpura) and <strong>Wainganga</strong> (rises in
              Satpura) merge to form the <strong>Pranhita</strong>, which joins the Godavari.
              Tributaries include Painganga (largest tributary of Wardha), Yashoda, Wenna, Kanhan,
              Pench, Bagh and Bavanthadi.
            </li>
            <li>
              <strong>Painganga</strong> (rises in Ajanta hills) — biggest tributary of the Wardha;
              its own tributaries include Adan, Pus and Arunavati.
            </li>
          </ul>

          <h4>3.2 West-flowing (Konkan / Arabian Sea) rivers</h4>
          <p>
            All Konkan rivers are short (under 200 km), fast and rise on the western edge of the
            Sahyadri. They are unsuitable for irrigation but have high hydroelectric potential. From
            north to south:
          </p>
          <ul>
            <li><strong>Damanganga</strong> — Sahyadri (Nashik border) → Daman (Gujarat).</li>
            <li><strong>Vaitarna</strong> — Trimbakeshwar → Vasai creek; tributaries Pinjal, Surya, Tansa.</li>
            <li><strong>Ulhas</strong> — Karjat → Vasai (Bassein) creek; tributary Bhatsa.</li>
            <li><strong>Patalganga</strong> — Khopoli → Karanja / Mumbai harbour.</li>
            <li><strong>Amba</strong> — Sahyadri above Pen → Dharamtar creek.</li>
            <li><strong>Kundalika</strong> — Bhira → Revdanda creek.</li>
            <li><strong>Savitri</strong> — Mahad → Bankot.</li>
            <li><strong>Vashishti</strong> — Sahyadri above Chiplun → Dabhol creek.</li>
            <li><strong>Shastri</strong> — Sahyadri near Sangameshwar → Jaigad creek.</li>
            <li><strong>Kajli, Muchkundi, Gad, Karli, Terekhol</strong> — South Konkan; Terekhol marks the Maharashtra–Goa border.</li>
          </ul>
          <p>
            All of these rivers and their tributaries are plotted with name labels on the {""}
            <Link href="/map">interactive map of Maharashtra</Link> — toggling the &quot;Rivers + tributaries&quot;
            layer is the fastest way to commit them to visual memory.
          </p>

          <h3>4. Climate</h3>
          <p>
            Maharashtra has a typical <strong>tropical monsoon climate</strong> with three seasons:
            summer (March–May), the south-west monsoon (June–September) and winter (November–February).
            Average annual rainfall varies dramatically by region:
          </p>
          <ul>
            <li><strong>Konkan and the windward Sahyadri</strong>: 2,500–6,000 mm. Mahabaleshwar and Amboli routinely receive 6,000–7,000 mm in a year — among the wettest places in India.</li>
            <li><strong>Western plateau (rain-shadow)</strong>: 500–700 mm. Solapur, Sangli, Ahmednagar and Beed are in the rain-shadow of the Sahyadri and prone to drought.</li>
            <li><strong>Vidarbha</strong>: 900–1,250 mm, mostly from south-west monsoon.</li>
            <li><strong>Marathwada</strong>: 600–900 mm, semi-arid.</li>
          </ul>
          <p>
            Cyclones from the Arabian Sea occasionally affect the Konkan coast in May–June and
            October–November.
          </p>

          <h3>5. Soils</h3>
          <p>
            Soil distribution in Maharashtra closely follows the geology and rainfall:
          </p>
          <ul>
            <li><strong>Black soil (Regur)</strong> — derived from weathering of basaltic Deccan trap rocks. Covers most of the plateau (Pune, Satara, Sangli, Kolhapur, Nashik, Marathwada and Vidarbha plains). Very high moisture retention; ideal for cotton, sugarcane, sorghum (jowar), pulses and oilseeds.</li>
            <li><strong>Red soil</strong> — found in eastern Vidarbha (parts of Bhandara, Gondia, Gadchiroli) and pockets of the South Konkan. Iron-rich; suitable for millets, groundnut and pulses.</li>
            <li><strong>Laterite soil</strong> — Konkan coast, especially Ratnagiri and Sindhudurg. Forms from heavy rainfall and high temperature. Used for cashew, mango (Alphonso), coconut and rice.</li>
            <li><strong>Alluvial soil</strong> — narrow river valleys of Tapi, Godavari, Krishna, Bhima — intensively cropped.</li>
            <li><strong>Coastal sandy / saline soil</strong> — narrow coastal strips and tidal zones.</li>
          </ul>

          <h3>6. Forests and vegetation</h3>
          <p>
            About 20% of Maharashtra is officially classified as forest. Major types:
          </p>
          <ul>
            <li><strong>Tropical evergreen and semi-evergreen</strong> — windward Sahyadri and South Konkan (heavy rainfall). Species: jamun, kokum, hirda, fig.</li>
            <li><strong>Moist deciduous</strong> — eastern Sahyadri foothills and Vidarbha. Teak (Tectona grandis) is the dominant species — Maharashtra is one of India&apos;s top teak-producing states.</li>
            <li><strong>Dry deciduous</strong> — Marathwada and the rain-shadow plateau.</li>
            <li><strong>Thorn and scrub</strong> — Solapur, parts of Ahmednagar (very low rainfall).</li>
            <li><strong>Mangroves</strong> — tidal creeks of Konkan, especially Mumbai (Thane creek), Raigad and Sindhudurg.</li>
          </ul>
          <p>
            Major <strong>protected areas</strong>: Tadoba-Andhari Tiger Reserve (Chandrapur),
            Pench Tiger Reserve (Nagpur), Melghat Tiger Reserve (Amravati), Sahyadri Tiger Reserve
            (Satara–Kolhapur), Bhimashankar, Radhanagari, Koyna, Bor, Navegaon-Nagzira and
            Sanjay Gandhi National Park (Mumbai).
          </p>

          <h3>7. Agriculture</h3>
          <p>
            Roughly 55% of Maharashtra&apos;s population depends on agriculture. The state is
            India&apos;s largest producer of <strong>sugarcane</strong>, <strong>onion</strong>,
            <strong>cotton</strong> (with Gujarat), <strong>soybean</strong>, <strong>turmeric</strong>
            and <strong>grapes</strong> (Nashik), and a major producer of jowar (sorghum), pulses,
            oranges (Nagpur), pomegranate (Solapur, Sangli), bananas (Jalgaon), mangoes (Konkan
            Alphonso) and cashew (Sindhudurg).
          </p>
          <p>
            The economic survey divides Maharashtra into nine agro-climatic zones. The Krishna,
            Bhima and Godavari basins are the sugarcane belts; Vidarbha and Marathwada are the
            cotton and pulse belts; Konkan is rice, mango and cashew; Nashik is grapes and onions.
          </p>

          <h3>8. Minerals and mining</h3>
          <p>
            Maharashtra is moderately rich in minerals, concentrated in eastern Vidarbha and the
            Konkan-Goa border:
          </p>
          <ul>
            <li><strong>Manganese</strong> — Nagpur and Bhandara districts (largest manganese belt in India after MP).</li>
            <li><strong>Coal</strong> — Wardha valley (Chandrapur, Yavatmal-Wani). Powers the Chandrapur, Koradi and Mauda thermal stations.</li>
            <li><strong>Iron ore</strong> — Sindhudurg (Redi), Gadchiroli (Surjagarh).</li>
            <li><strong>Bauxite</strong> — Kolhapur (Radhanagari), Ratnagiri, Sindhudurg.</li>
            <li><strong>Limestone</strong> — Yavatmal, Chandrapur (used in cement).</li>
            <li><strong>Other minerals</strong> — copper (small reserves in Nagpur), silica sand (Sindhudurg coast), chromite (Sindhudurg).</li>
          </ul>

          <h3>9. Power generation</h3>
          <p>
            Maharashtra is India&apos;s largest electricity-consuming state and one of the largest
            generators. Capacity is split across three categories:
          </p>
          <ul>
            <li>
              <strong>Nuclear</strong>: Tarapur Atomic Power Station, Palghar (~1,400 MW; oldest
              commercial nuclear station in India, BWR + PHWR units). Jaitapur in Ratnagiri is the
              proposed 6 × 1,650 MW EPR project.
            </li>
            <li>
              <strong>Hydroelectric</strong>: Koyna (~1,960 MW — largest hydro project in
              Maharashtra), Bhira (Tata, 300 MW), Khopoli (Tata, 72 MW), Bhivpuri (Tata, 75 MW),
              Ghatghar Pumped Storage (250 MW), Pench (160 MW), Vaitarna, Tillari (Sindhudurg,
              66 MW) and Yeldari (Parbhani, on the Purna).
            </li>
            <li>
              <strong>Thermal (coal/gas)</strong>: Chandrapur Super Thermal Power Station (3,340 MW —
              MahaGenco), Koradi (2,400 MW, Nagpur), Khaperkheda (1,340 MW), Mauda STPS (2,320 MW,
              NTPC), Tiroda (3,300 MW, Adani Power, Gondia), Parli (1,170 MW, Beed), Paras
              (500 MW, Akola), Bhusawal (1,420 MW, Jalgaon), Nashik / Eklahare (910 MW), Trombay
              (1,580 MW, Tata, Mumbai), Dahanu (500 MW, Adani Palghar), JSW Ratnagiri / Jaigad
              (1,200 MW), Uran gas-based station (672 MW, Raigad).
            </li>
          </ul>
          <p>
            Each of these is plotted as a separate toggleable layer on the {""}
            <Link href="/map">/map page</Link> with installed capacity and operator in the popup.
          </p>

          <h3>10. Famous landmarks</h3>
          <ul>
            <li>
              <strong>UNESCO World Heritage Sites</strong> — Ajanta Caves (Aurangabad; 2nd century
              BCE–6th century CE Buddhist rock-cut), Ellora Caves (Aurangabad; 6th–10th century CE,
              Hindu-Buddhist-Jain), Elephanta Caves (Mumbai harbour), Chhatrapati Shivaji Maharaj
              Terminus / CSMT (Mumbai), Victorian Gothic and Art Deco Ensembles of Mumbai, and the
              Western Ghats natural site (parts in Maharashtra).
            </li>
            <li>
              <strong>Historic forts</strong> — Raigad (capital of the Maratha Empire under
              Chhatrapati Shivaji Maharaj), Sinhagad (Tanaji Malusare&apos;s battle), Pratapgad
              (Battle of Pratapgad, 1659 — Shivaji vs. Afzal Khan), Shivneri (Shivaji&apos;s
              birthplace), Lohgad, Rajgad (the original Maratha capital), Torna (the first fort
              captured by Shivaji), Daulatabad (Devagiri), Panhala (largest fort in the Deccan)
              and Vijaydurg (sea fort).
            </li>
            <li>
              <strong>Major dams and reservoirs</strong> — Koyna (Krishna basin), Jayakwadi
              (Aurangabad, Godavari), Bhandardara/Wilson (Pravara), Tansa (Mumbai water supply),
              Upper Vaitarna, Khadakwasla (Pune, Mutha), Panshet (Pune), Chandoli/Warna,
              Manjara (Beed), Hatnur (Tapi, Jalgaon), Ujani (Solapur, Bhima), Totladoh /
              Pench.
            </li>
            <li>
              <strong>Major waterfalls</strong> — Vajrai (Satara, India&apos;s tallest cascade
              ~853 ft), Thoseghar (Satara), Lingmala (Mahabaleshwar), Kune (Khandala), Bhushi
              (Lonavala), Marleshwar (Ratnagiri), Dabhosa (Palghar), Randha (Pravara), Amboli
              (Sindhudurg).
            </li>
          </ul>

          <h3>11. Quick revision table</h3>
          <p>Memorise these high-frequency MPSC facts:</p>
          <ul>
            <li>Highest peak: <strong>Kalsubai (1,646 m, Ahmednagar)</strong>.</li>
            <li>Longest river in Maharashtra: <strong>Godavari</strong> (~668 km in state).</li>
            <li>Largest hydro project: <strong>Koyna</strong>.</li>
            <li>Only nuclear plant: <strong>Tarapur</strong>.</li>
            <li>Largest thermal plant: <strong>Chandrapur STPS (3,340 MW)</strong>.</li>
            <li>Wettest place: <strong>Amboli / Mahabaleshwar</strong>.</li>
            <li>Driest place: <strong>Solapur–Sangli rain-shadow zone</strong>.</li>
            <li>Largest district by area: <strong>Ahmednagar</strong>.</li>
            <li>Smallest district by area: <strong>Mumbai City</strong>.</li>
            <li>Most populous district: <strong>Thane</strong>.</li>
            <li>Coastline: <strong>~720 km</strong>.</li>
            <li>Maharashtra Day: <strong>1 May 1960</strong> (formation of the state).</li>
          </ul>

          <h3>Next steps</h3>
          <ul>
            <li>Open the <Link href="/map">interactive Maharashtra map</Link> and toggle each layer one by one — by the third pass you&apos;ll know every river by sight.</li>
            <li>Practice 30 geography PYQs on <Link href="/exams">/exams</Link> to test your retention.</li>
            <li>Review the related guides: <Link href="/study-guides/maharashtra-history">Maharashtra History</Link> and <Link href="/study-guides/mpsc-preparation-strategy">MPSC Preparation Strategy</Link>.</li>
          </ul>
        </article>
      </main>

      <footer className="border-t border-slate-200/80 py-6 dark:border-slate-700/80">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-slate-400 dark:text-slate-500">MPSC PYQ QUIZ &middot; Don&apos;t know Academy</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
              <Link href="/" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Home</Link>
              <span>|</span>
              <Link href="/study-guides" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">All study guides</Link>
              <span>|</span>
              <Link href="/exams" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Exam papers</Link>
              <span>|</span>
              <Link href="/map" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Map</Link>
              <span>|</span>
              <Link href="/contact" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
