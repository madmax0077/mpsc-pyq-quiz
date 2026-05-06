import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maharashtra History for MPSC — Satavahanas, Yadavas, Marathas, Peshwas, British Era & State Formation",
  description:
    "Complete Maharashtra history study guide for MPSC: ancient Satavahanas, Vakatakas, Rashtrakutas, medieval Yadavas and Bahmanis, the Maratha Empire under Chhatrapati Shivaji Maharaj, the Peshwas, the British era, the freedom movement and the formation of Maharashtra in 1960.",
  keywords: [
    "Maharashtra history for MPSC",
    "Maratha Empire",
    "Chhatrapati Shivaji Maharaj",
    "Peshwas",
    "Satavahanas",
    "Yadavas of Devagiri",
    "Samyukta Maharashtra movement",
    "MPSC history notes",
  ],
  alternates: { canonical: "/study-guides/maharashtra-history" },
};

export default function MaharashtraHistoryGuide() {
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
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Maharashtra History</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">MPSC Study Guide · ~16 min read</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <article className="prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:prose-invert dark:border-slate-700 dark:bg-slate-800 sm:p-9">
          <h2>Maharashtra History for MPSC — From the Satavahanas to 1960</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: April 2026 · Reading time: ~16 minutes
          </p>

          <p>
            The history section of every MPSC paper draws heavily from Maharashtra-specific
            material: Satavahana administration, the rock-cut caves, Yadava Devagiri, the rise of
            the Maratha Empire under Chhatrapati Shivaji Maharaj, the Peshwa period, the
            anti-British struggle led by Lokmanya Tilak, and the Samyukta Maharashtra movement that
            gave the state its modern boundaries. This guide threads them in one chronological
            narrative so you can recall each era&apos;s rulers, capitals, key events and dates
            quickly. Pair it with the {""}
            <Link href="/study-guides/maharashtra-geography">Maharashtra Geography</Link> guide for
            the spatial context — many forts and battle sites are easier to remember when you can
            place them on the {""}
            <Link href="/map">interactive map</Link>.
          </p>

          <h3>1. Ancient Maharashtra (3rd century BCE – 7th century CE)</h3>

          <h4>1.1 The Satavahanas (c. 230 BCE – 220 CE)</h4>
          <p>
            The Satavahanas (also called the Andhras in the Puranas) were the first major historical
            dynasty of the Deccan and the founders of state-level administration in Maharashtra.
          </p>
          <ul>
            <li><strong>Founder</strong>: Simuka.</li>
            <li><strong>Greatest rulers</strong>: Gautamiputra Satakarni (c. 106–130 CE) and his son Vasishthiputra Pulumavi.</li>
            <li><strong>Capitals</strong>: Pratishthana (modern <strong>Paithan</strong> on the Godavari) and later Amaravati.</li>
            <li><strong>Defeated</strong>: the Saka Western Kshatrapa Nahapana — recorded in the Nashik prashasti (inscription of Gautami Balashri).</li>
            <li><strong>Religion &amp; culture</strong>: Patrons of both Brahmanical and Buddhist religion; sponsored the rock-cut cave architecture at Bhaja, Karle, Kanheri, Kondana and Pitalkhora.</li>
            <li><strong>Coinage</strong>: lead, silver and copper coins with the symbol of a ship — evidence of trans-oceanic trade with Rome.</li>
          </ul>

          <h4>1.2 The Vakatakas (c. 250–500 CE)</h4>
          <ul>
            <li><strong>Founder</strong>: Vindhyashakti.</li>
            <li><strong>Capital</strong>: Nandivardhan (near modern Nagpur), later Vatsagulma (modern <strong>Washim</strong>).</li>
            <li><strong>Famous king</strong>: Pravarasena I (only Vakataka king to perform an Ashvamedha).</li>
            <li><strong>Importance</strong>: Sponsored Phase II (5th century CE) of the Ajanta cave paintings — Caves 16, 17, 19. Married into the Imperial Guptas — Prabhavatigupta (daughter of Chandragupta II) ruled as queen-regent.</li>
          </ul>

          <h4>1.3 Chalukyas of Badami (c. 543–757 CE)</h4>
          <ul>
            <li>Originally based at Badami in northern Karnataka but extended their power into south Maharashtra.</li>
            <li><strong>Pulakeshin II</strong> defeated Harshavardhana on the banks of the Narmada (c. 634 CE).</li>
            <li>Sponsored early rock-cut work at Aihole, Pattadakal and (in Maharashtra) parts of Ellora.</li>
          </ul>

          <h4>1.4 Rashtrakutas (753–982 CE)</h4>
          <ul>
            <li><strong>Founder</strong>: Dantidurga, who overthrew the Chalukyas.</li>
            <li><strong>Capital</strong>: Manyakheta (modern Malkhed in Karnataka, but ruled Maharashtra).</li>
            <li><strong>Greatest contribution</strong>: the Kailasa Temple at Ellora (Cave 16), commissioned by <strong>Krishna I</strong> — a single rock-cut monolith, the largest in the world.</li>
            <li><strong>Other notable kings</strong>: Govinda III (defeated the Pratiharas of Kannauj), Amoghavarsha (author of <em>Kavirajamarga</em>, the earliest surviving Kannada literary work).</li>
          </ul>

          <h3>2. Medieval Maharashtra (10th – 15th century)</h3>

          <h4>2.1 Shilaharas (765–1265)</h4>
          <p>
            Three branches ruled the Konkan — North Konkan (capital Puri / Thane), South Konkan
            (capital Khilegaon), and Kolhapur. Shilaharas built the famous temples of Kopeshwar
            (Khidrapur, Kolhapur) and Ambernath. They fought the Yadavas of Devagiri until the
            Yadavas absorbed them in 1265.
          </p>

          <h4>2.2 Yadavas of Devagiri (850–1334)</h4>
          <ul>
            <li><strong>Capital</strong>: Devagiri (modern <strong>Daulatabad</strong>, Aurangabad).</li>
            <li><strong>Founder</strong>: Bhillama V (declared independence in 1187).</li>
            <li><strong>Greatest king</strong>: Singhana II — extended the kingdom into Karnataka, Telangana and Madhya Pradesh.</li>
            <li><strong>Cultural significance</strong>: First state to make Marathi (rather than Sanskrit or Kannada) its administrative language. Patronised the saint-poet <strong>Sant Dnyaneshwar</strong> (1275–1296), whose <em>Dnyaneshwari</em> commentary on the Bhagavad Gita is the first Marathi philosophical classic.</li>
            <li><strong>End</strong>: Defeated by Alauddin Khilji of the Delhi Sultanate in 1296. The last Yadava ruler, Ramachandra, paid tribute. Daulatabad fell to Muhammad bin Tughlaq in 1328 and briefly served as the Tughlaq capital (1327–1335).</li>
          </ul>

          <h4>2.3 Bahmani Sultanate (1347–1518) and the Deccan Sultanates</h4>
          <ul>
            <li><strong>Founder of Bahmani Sultanate</strong>: Hasan Gangu (Alauddin Bahman Shah).</li>
            <li><strong>Capital</strong>: Gulbarga, later Bidar.</li>
            <li><strong>Famous minister</strong>: Mahmud Gawan — the great Persian-origin administrator and educator.</li>
            <li><strong>Disintegration (c. 1490s–1518)</strong>: into five Deccan Sultanates — Ahmadnagar (Nizam Shahi), Bijapur (Adil Shahi), Berar (Imad Shahi), Bidar (Barid Shahi) and Golconda (Qutb Shahi). Three of these had territory in modern Maharashtra.</li>
            <li><strong>Battle of Talikota (1565)</strong>: A combined alliance of the Deccan Sultanates defeated the Vijayanagara Empire, but the Sultanates remained divided and were absorbed by the Mughals over the next century.</li>
          </ul>

          <h3>3. The Maratha Empire (1674–1818)</h3>

          <h4>3.1 Chhatrapati Shivaji Maharaj (1630–1680)</h4>
          <p>
            Born at <strong>Shivneri Fort (1630)</strong> to Shahaji Bhonsle (a general in service of
            the Adil Shahi sultanate) and Jijabai. Shivaji built the Maratha state by capturing
            forts in the Sahyadri starting with <strong>Torna in 1646</strong>. Key milestones:
          </p>
          <ul>
            <li><strong>1656</strong> — captured Javli from the Mores.</li>
            <li><strong>1659</strong> — Battle of Pratapgad: killed Afzal Khan of Bijapur.</li>
            <li><strong>1660</strong> — Siege of Panhala; escape to Vishalgad with Baji Prabhu Deshpande&apos;s sacrifice at Pavan Khind.</li>
            <li><strong>1663</strong> — surprise attack on Shaista Khan in Pune.</li>
            <li><strong>1664 &amp; 1670</strong> — Sack of Surat (twice).</li>
            <li><strong>1665</strong> — Treaty of Purandar with the Mughals (after Jai Singh&apos;s campaign).</li>
            <li><strong>1666</strong> — escape from Aurangzeb&apos;s court at Agra.</li>
            <li><strong>6 June 1674</strong> — coronation as Chhatrapati at <strong>Raigad fort</strong>; assumed the title <em>Chhatrapati</em> with full Vedic ceremony by Gaga Bhatt.</li>
            <li><strong>1677–78</strong> — Karnataka campaign; built the Maratha state into a peninsular power.</li>
            <li><strong>3 April 1680</strong> — died at Raigad.</li>
          </ul>
          <p>
            <strong>Administration</strong>: Shivaji organised his government as <em>Ashta Pradhan</em> (council of eight ministers) — Peshwa (Prime Minister), Amatya (Finance), Sachiv (Secretary), Mantri (Interior), Senapati (Commander-in-Chief), Sumant (Foreign Affairs), Nyayadhish (Chief Justice), Panditrao (Religious Affairs). Revenue system based on Malik Ambar&apos;s land assessment. Established a strong navy at <strong>Sindhudurg</strong> and <strong>Vijaydurg</strong>.
          </p>

          <h4>3.2 Sambhaji (1681–1689) and Rajaram (1689–1700)</h4>
          <ul>
            <li>Sambhaji continued the war against Aurangzeb, was captured at Sangameshwar (1689) and executed.</li>
            <li>Rajaram shifted base to <strong>Jinji (Tamil Nadu)</strong> and continued resistance.</li>
            <li>His widow <strong>Tarabai</strong> ruled as regent (1700–1707) on behalf of son Shivaji II and turned the Marathas back to the offensive.</li>
          </ul>

          <h4>3.3 The Peshwa Era (1714–1818)</h4>
          <p>
            With Chhatrapati Shahu&apos;s release from Mughal captivity (1707) and his treaty with
            Tarabai, real authority moved to the Peshwa (Prime Minister) at Pune. The Bhat family
            held the post hereditarily.
          </p>
          <ul>
            <li><strong>Balaji Vishwanath</strong> (1714–1720) — first hereditary Peshwa; secured the chauth and sardeshmukhi rights from the Mughals (1719).</li>
            <li><strong>Bajirao I</strong> (1720–1740) — greatest Peshwa; never lost a battle. Established Maratha dominance from the Deccan to Delhi. Famous victories at Palkhed (1728) and Bhopal (1737).</li>
            <li><strong>Balaji Bajirao / Nanasaheb</strong> (1740–1761) — Maratha empire reached its zenith. Lost the <strong>Third Battle of Panipat (14 January 1761)</strong> to Ahmad Shah Abdali, killing his son Vishwasrao and cousin Sadashivrao Bhau.</li>
            <li><strong>Madhavrao I</strong> (1761–1772) — restored Maratha power; defeated the Nizam at Rakshasbhuvan (1763).</li>
            <li><strong>Sawai Madhavrao</strong> (1774–1795) — under regent Nana Phadnavis, defeated the British in the First Anglo-Maratha War (1775–1782, Treaty of Salbai).</li>
            <li><strong>Bajirao II</strong> (1796–1818) — last Peshwa. Defeated by the British in the Third Anglo-Maratha War; signed the Treaty of Bassein (1802) accepting British subsidiary alliance. Final defeat at <strong>Battle of Koregaon Bhima (1 January 1818)</strong> and Battle of Khadki / Yerwada — the Peshwa office abolished.</li>
          </ul>
          <p>
            The Maratha Confederacy by 1800 included the Bhonsles of Nagpur, the Gaekwads of Baroda,
            the Holkars of Indore and the Scindias of Gwalior. After 1818 most of these ruled as
            British &quot;princely states&quot; until 1947.
          </p>

          <h3>4. British Maharashtra (1818–1947)</h3>

          <h4>4.1 Bombay Presidency</h4>
          <p>
            After 1818, modern Maharashtra was incorporated into the <strong>Bombay Presidency</strong>
            (along with Sindh, parts of Karnataka and Gujarat). Vidarbha (then called Berar) came
            under direct British rule via the Hyderabad Subsidiary Treaty of 1853 and was added to
            the Central Provinces in 1903 as the &quot;Central Provinces and Berar&quot;.
          </p>

          <h4>4.2 Social reform and the Bhakti tradition&apos;s heirs</h4>
          <ul>
            <li><strong>Jyotirao Phule</strong> (1827–1890) — founded the <em>Satyashodhak Samaj</em> (1873). Pioneered women&apos;s and Dalit education with his wife <strong>Savitribai Phule</strong>, who opened the first school for girls in 1848 at Pune.</li>
            <li><strong>M. G. Ranade</strong> — founded the Indian Social Conference (1887). Mentor to Gokhale.</li>
            <li><strong>Gopal Krishna Gokhale</strong> (1866–1915) — founded the Servants of India Society (1905). Political guru of Mahatma Gandhi.</li>
            <li><strong>Bal Gangadhar Tilak / Lokmanya Tilak</strong> (1856–1920) — founded <em>Kesari</em> (Marathi) and <em>Mahratta</em> (English) newspapers; popularised the Ganesh Utsav (1893) and Shivaji Jayanti (1895) as mass mobilisation events; coined &quot;<em>Swaraj is my birthright</em>&quot;.</li>
            <li><strong>V. D. Savarkar</strong> (1883–1966) — wrote &quot;The Indian War of Independence 1857&quot; (1909) and <em>Hindutva</em> (1923); founded the Abhinav Bharat Society.</li>
            <li><strong>Dr. B. R. Ambedkar</strong> (1891–1956) — born at Mhow (modern MP) into a Maharashtrian Mahar family; led the Mahad Satyagraha (1927) for Dalit access to public water; chaired the Drafting Committee of the Constitution (1947–49).</li>
            <li><strong>Karmaveer Bhaurao Patil</strong> — founded the Rayat Shikshan Sanstha (1919) at Satara, India&apos;s largest educational network.</li>
            <li><strong>Dhondo Keshav Karve / Maharshi Karve</strong> (1858–1962) — founded SNDT Women&apos;s University (first women&apos;s university in India, 1916).</li>
          </ul>

          <h4>4.3 Freedom movement events in Maharashtra</h4>
          <ul>
            <li><strong>1857 Revolt</strong> — Tatya Tope and Rani Lakshmibai of Jhansi (born in Varanasi but politically connected to the Marathas) were the principal leaders; their guerrilla campaign through Maharashtra and central India lasted until 1858.</li>
            <li><strong>Chapekar brothers (1897)</strong> — assassinated W. C. Rand, the British plague commissioner of Pune, in protest of inhumane plague-control measures.</li>
            <li><strong>Surat Split (1907)</strong> of the Indian National Congress — between the Moderates (Gokhale) and the Extremists (Tilak); held at Surat in Gujarat but largely contested by Maharashtra-based leaders.</li>
            <li><strong>Khilafat &amp; Non-Cooperation (1920–22)</strong>, Salt Satyagraha (1930) and Quit India (1942) — saw heavy participation in Maharashtra; Tilak&apos;s death in 1920 made Gandhi the undisputed leader of the Congress.</li>
            <li><strong>Quit India 1942</strong> — Mumbai&apos;s August Kranti Maidan was the venue of Gandhi&apos;s &quot;Do or Die&quot; speech (8 August 1942). Aruna Asaf Ali hoisted the flag at Gowalia Tank.</li>
          </ul>

          <h3>5. Independence and the formation of Maharashtra</h3>

          <h4>5.1 The Samyukta Maharashtra Movement</h4>
          <p>
            The States Reorganisation Commission of 1955 (Fazal Ali Commission) recommended a
            bilingual Bombay state. Marathi-speaking activists demanded a unified Marathi state
            including Mumbai and Vidarbha. The movement was led by:
          </p>
          <ul>
            <li><strong>S. M. Joshi</strong>, <strong>Acharya Atre</strong>, <strong>S. A. Dange</strong>, <strong>Pralhad Keshav Atre</strong>, <strong>Senapati Bapat</strong>, and <strong>Keshavrao Jedhe</strong>.</li>
            <li>The <strong>Samyukta Maharashtra Samiti</strong> was founded in 1956.</li>
            <li>105 protesters were killed in police firing during the agitation in Mumbai (commemorated as the <strong>Hutatma Chowk</strong> memorial at Flora Fountain).</li>
          </ul>
          <p>
            The movement succeeded with the <strong>Bombay Reorganisation Act 1960</strong>. On
            <strong> 1 May 1960</strong>, the bilingual Bombay state was split into:
          </p>
          <ul>
            <li><strong>Maharashtra</strong> (Marathi-speaking, with Mumbai as capital).</li>
            <li><strong>Gujarat</strong> (Gujarati-speaking, with Ahmedabad as initial capital).</li>
          </ul>
          <p>
            <strong>Yashwantrao Chavan</strong> became the first Chief Minister of Maharashtra. The
            day is observed as <strong>Maharashtra Din / Maharashtra Day</strong>.
          </p>

          <h4>5.2 Post-1960 milestones</h4>
          <ul>
            <li><strong>1972 drought</strong> — one of the worst in Maharashtra&apos;s history; led to the creation of the Employment Guarantee Scheme (EGS), which in 2005 inspired the national MGNREGA.</li>
            <li><strong>1995</strong> — Bombay officially renamed <strong>Mumbai</strong>.</li>
            <li><strong>2014</strong> — Telangana&apos;s separation from Andhra Pradesh prompted renewed (so far unfulfilled) demands for a separate Vidarbha state.</li>
            <li><strong>2018</strong> — Aurangabad airport renamed Chhatrapati Sambhaji Maharaj Airport. In <strong>2022</strong>, Aurangabad city itself was renamed <strong>Chhatrapati Sambhajinagar</strong>; Osmanabad became <strong>Dharashiv</strong>.</li>
          </ul>

          <h3>6. High-yield revision facts</h3>
          <ul>
            <li>First Marathi inscription: at Shravanabelagola (Karnataka, 981 CE) — but Yadavas were the first to officially adopt Marathi as the court language.</li>
            <li>First Maratha capital: <strong>Rajgad</strong>; second: <strong>Raigad</strong> (from 1674).</li>
            <li>Coronation date of Chhatrapati Shivaji Maharaj: <strong>6 June 1674</strong>.</li>
            <li>Third Battle of Panipat: <strong>14 January 1761</strong>.</li>
            <li>Battle of Koregaon Bhima (end of Peshwa rule): <strong>1 January 1818</strong>.</li>
            <li>Mahad Satyagraha by Dr. Ambedkar: <strong>20 March 1927</strong>.</li>
            <li>August Kranti speech by Gandhi: <strong>8 August 1942</strong>.</li>
            <li>Maharashtra Day: <strong>1 May 1960</strong>.</li>
            <li>First CM of Maharashtra: <strong>Yashwantrao Chavan</strong>.</li>
            <li>SNDT (first women&apos;s university): founded by <strong>Maharshi Karve in 1916</strong>.</li>
          </ul>

          <h3>Next steps</h3>
          <ul>
            <li>Cross-reference each fort and battle site with the <Link href="/map">interactive map</Link> — visual memory locks them in.</li>
            <li>Read the <Link href="/study-guides/maharashtra-geography">Maharashtra Geography</Link> guide so you understand the why-here of every campaign.</li>
            <li>Solve a history-heavy PYQ paper from <Link href="/exams">/exams</Link> — Group B 2022 and Group C 2023 are both ~25% history.</li>
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
