import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Indian Polity for MPSC — Constitution, Fundamental Rights, DPSPs, Parliament & State Government",
  description:
    "Complete Indian Polity study guide for MPSC: Constitution overview, Preamble, Fundamental Rights, Fundamental Duties, DPSPs, Parliament, President, Prime Minister, Supreme Court, Maharashtra state government, Panchayati Raj and the high-yield articles you must memorise.",
  keywords: [
    "Indian polity for MPSC",
    "Indian Constitution",
    "Fundamental Rights",
    "DPSP",
    "Parliament of India",
    "Maharashtra state government",
    "Panchayati Raj",
    "MPSC polity notes",
  ],
  alternates: { canonical: "/study-guides/indian-polity-for-mpsc" },
};

export default function PolityGuide() {
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
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Indian Polity for MPSC</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">MPSC Study Guide · ~15 min read</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <article className="prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:prose-invert dark:border-slate-700 dark:bg-slate-800 sm:p-9">
          <h2>Indian Polity for MPSC — A Constitution-First Guide</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: April 2026 · Reading time: ~15 minutes
          </p>

          <p>
            Polity is the highest-ROI subject in MPSC prelims. Every paper carries 12–18 polity
            questions and the answers are mostly factual — once memorised, retention is high. This
            guide collects the constitutional framework, Fundamental Rights, DPSPs, the Parliament
            and President, the executive and judiciary, the Maharashtra state government and the
            three-tier Panchayati Raj, plus the small number of articles and amendments that show
            up year after year. Pair it with the {""}
            <Link href="/study-guides/mpsc-exam-pattern">MPSC Exam Pattern</Link> guide so you know
            the section weightage.
          </p>

          <h3>1. The Constitution at a glance</h3>
          <ul>
            <li>Adopted: <strong>26 November 1949</strong> (Constitution Day).</li>
            <li>Came into force: <strong>26 January 1950</strong> (Republic Day).</li>
            <li>Drafting Committee Chairman: <strong>Dr. B. R. Ambedkar</strong>.</li>
            <li>Constituent Assembly elected: 1946 (under the Cabinet Mission Plan).</li>
            <li>Original length: <strong>395 articles, 22 parts, 8 schedules</strong>.</li>
            <li>Current length (after amendments): <strong>~448 articles, 25 parts, 12 schedules</strong>.</li>
            <li>Total amendments till 2026: <strong>106+</strong>.</li>
            <li>Inspirations: written constitution (USA), parliamentary government (UK), Fundamental Rights (USA), DPSPs (Ireland), federation with strong centre (Canada), emergency provisions (Germany), procedure of constitutional amendment (South Africa), republic (France).</li>
          </ul>

          <h3>2. The Preamble</h3>
          <p>
            <em>&quot;We, the people of India, having solemnly resolved to constitute India into a
            sovereign socialist secular democratic republic and to secure to all its citizens:
            justice, social, economic and political; liberty of thought, expression, belief, faith
            and worship; equality of status and of opportunity; and to promote among them all
            fraternity, assuring the dignity of the individual and the unity and integrity of the
            nation; in our constituent assembly this 26th day of November 1949 do hereby adopt,
            enact and give to ourselves this constitution.&quot;</em>
          </p>
          <ul>
            <li>The words <strong>SOCIALIST</strong>, <strong>SECULAR</strong> and <strong>INTEGRITY</strong> were added by the <strong>42nd Amendment (1976)</strong>.</li>
            <li>The Supreme Court has held the Preamble to be a part of the Constitution (Kesavananda Bharati 1973, LIC of India 1995).</li>
            <li>The Preamble cannot be enforced in court but can be used as an interpretive aid.</li>
          </ul>

          <h3>3. Fundamental Rights (Part III, Articles 12–35)</h3>
          <p>Six categories after the deletion of the Right to Property by the 44th Amendment (1978):</p>
          <ol>
            <li><strong>Right to Equality (Articles 14–18)</strong>:
              <ul>
                <li>Article 14 — Equality before law and equal protection of laws.</li>
                <li>Article 15 — Prohibition of discrimination on grounds of religion, race, caste, sex or place of birth.</li>
                <li>Article 16 — Equality of opportunity in matters of public employment.</li>
                <li>Article 17 — Abolition of untouchability.</li>
                <li>Article 18 — Abolition of titles.</li>
              </ul>
            </li>
            <li><strong>Right to Freedom (Articles 19–22)</strong>:
              <ul>
                <li>Article 19 — Six freedoms: speech, assembly, association, movement, residence, profession.</li>
                <li>Article 20 — Protection in respect of conviction (no ex-post-facto law, no double jeopardy, no self-incrimination).</li>
                <li>Article 21 — Protection of life and personal liberty (Maneka Gandhi 1978; Right to Privacy — Puttaswamy 2017).</li>
                <li>Article 21A — Right to Education for children 6–14 (added by 86th Amendment, 2002).</li>
                <li>Article 22 — Protection against arrest and detention.</li>
              </ul>
            </li>
            <li><strong>Right against Exploitation (Articles 23–24)</strong>: prohibition of human trafficking, forced labour, child labour below 14.</li>
            <li><strong>Right to Freedom of Religion (Articles 25–28)</strong>: freedom of conscience and free profession, practice and propagation of religion.</li>
            <li><strong>Cultural and Educational Rights (Articles 29–30)</strong>: protection of interests of minorities; right of minorities to establish and administer educational institutions.</li>
            <li><strong>Right to Constitutional Remedies (Article 32)</strong>: right to move the Supreme Court for enforcement of FRs through five writs (Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo Warranto). Dr. Ambedkar called Article 32 the <em>&quot;heart and soul of the Constitution&quot;</em>.</li>
          </ol>

          <h3>4. Directive Principles of State Policy (Part IV, Articles 36–51)</h3>
          <p>
            DPSPs are non-justiciable directives to the state to establish a welfare state. They are
            classified as:
          </p>
          <ul>
            <li><strong>Socialist</strong> — Articles 38, 39, 39A, 41, 42, 43, 43A, 47.</li>
            <li><strong>Gandhian</strong> — Articles 40 (panchayats), 43 (cottage industries), 46 (educational rights of weaker sections), 47 (prohibition), 48 (cattle protection).</li>
            <li><strong>Liberal-intellectual</strong> — Articles 44 (uniform civil code), 45 (early childhood care), 48 (modern agriculture), 49 (heritage), 50 (separation of judiciary from executive), 51 (international peace).</li>
          </ul>

          <h3>5. Fundamental Duties (Part IVA, Article 51A)</h3>
          <p>
            Added by the <strong>42nd Amendment (1976)</strong> on the recommendation of the
            <strong> Swaran Singh Committee</strong>. Originally 10; the 11th duty (parents to
            provide education to child 6–14) was added by the <strong>86th Amendment (2002)</strong>.
            Total duties today: <strong>11</strong>. Like DPSPs, they are not justiciable.
          </p>

          <h3>6. Union Government — the Executive</h3>

          <h4>6.1 The President of India (Articles 52–62)</h4>
          <ul>
            <li>Head of state, supreme commander of the armed forces.</li>
            <li>Elected indirectly by an Electoral College of elected MPs (Lok Sabha + Rajya Sabha) and elected MLAs of all states (including Delhi and Puducherry).</li>
            <li>Voting follows <strong>single transferable vote</strong> by proportional representation.</li>
            <li>Term: <strong>5 years</strong>; eligible for re-election.</li>
            <li>Qualifications: citizen of India, 35+, qualified to be a Lok Sabha member, must not hold any office of profit.</li>
            <li>Impeachment: under Article 61, on grounds of &quot;violation of the Constitution&quot;, by special majority in both houses.</li>
          </ul>

          <h4>6.2 The Vice President (Articles 63–71)</h4>
          <ul>
            <li>Ex-officio Chairman of the Rajya Sabha (Article 64).</li>
            <li>Elected by an Electoral College of MPs only (both houses, both elected and nominated).</li>
            <li>Term: 5 years.</li>
          </ul>

          <h4>6.3 The Prime Minister and Council of Ministers (Articles 74–75)</h4>
          <ul>
            <li>Article 74: there shall be a Council of Ministers with the PM at the head to aid and advise the President. President is bound to act on advice (added by 42nd and 44th Amendments).</li>
            <li>Article 75: PM appointed by the President; other ministers appointed on PM&apos;s advice.</li>
            <li>Total ministers (including PM) cannot exceed <strong>15% of the strength of the Lok Sabha</strong> (added by 91st Amendment, 2003).</li>
            <li>Council of Ministers is collectively responsible to the Lok Sabha.</li>
          </ul>

          <h3>7. Parliament (Articles 79–122)</h3>

          <h4>7.1 Composition</h4>
          <ul>
            <li><strong>Lok Sabha</strong> — house of the people. Maximum strength: <strong>552</strong> (530 from states + 20 from UTs + 2 nominated Anglo-Indians; the nominated Anglo-Indian seats were abolished by the 104th Amendment, 2019). Current strength: <strong>543</strong> elected.</li>
            <li><strong>Rajya Sabha</strong> — council of states. Maximum strength: <strong>250</strong> (238 elected by state/UT legislatures + 12 nominated by the President for distinguished service in literature, art, science, social service). Current strength: <strong>245</strong>.</li>
            <li>Lok Sabha term: 5 years (extendable by 1 year during Emergency).</li>
            <li>Rajya Sabha is a permanent house — 1/3 of members retire every 2 years.</li>
          </ul>

          <h4>7.2 Powers and procedure</h4>
          <ul>
            <li><strong>Money Bills</strong> (Article 110) — can only originate in the Lok Sabha. Rajya Sabha must return within 14 days; Lok Sabha may accept or reject the recommendations.</li>
            <li><strong>Ordinary Bills</strong> — can originate in either house. Disagreement leads to a <strong>joint sitting</strong> presided by the Speaker (Article 108).</li>
            <li><strong>Constitutional Amendment Bills</strong> (Article 368) — special majority in both houses; some amendments also need ratification by half the state legislatures.</li>
            <li><strong>Quorum</strong>: 1/10th of the total strength of either house.</li>
            <li><strong>Speaker of the Lok Sabha</strong> — elected from among its members; presides over joint sittings.</li>
          </ul>

          <h3>8. Judiciary</h3>

          <h4>8.1 The Supreme Court (Articles 124–147)</h4>
          <ul>
            <li>Composition: Chief Justice of India + 33 other judges = <strong>34</strong> (current sanctioned strength after 2019).</li>
            <li>Appointment: by the President under Article 124 — collegium system (since the Three Judges cases, 1993, 1998, 2015 NJAC verdict).</li>
            <li>Retirement age: <strong>65 years</strong>.</li>
            <li>Original jurisdiction: disputes between Centre and states, states and states.</li>
            <li>Writ jurisdiction: under Article 32.</li>
            <li>Appellate jurisdiction: civil, criminal, constitutional matters.</li>
            <li>Advisory jurisdiction: under Article 143.</li>
          </ul>

          <h4>8.2 High Courts (Articles 214–231)</h4>
          <ul>
            <li>Each state has a High Court; some states share (e.g., Punjab and Haryana share the High Court at Chandigarh).</li>
            <li>Maharashtra: Bombay High Court (one of India&apos;s three oldest, est. 1862), with benches at Aurangabad, Nagpur and Panaji (Goa).</li>
            <li>Retirement age: <strong>62 years</strong>.</li>
            <li>Writ jurisdiction: under Article 226 (broader than the SC&apos;s — can issue writs for any purpose, not just FR enforcement).</li>
          </ul>

          <h3>9. The State Government — applied to Maharashtra</h3>
          <ul>
            <li><strong>Governor</strong> (Articles 153–162) — appointed by the President; nominal head of state. Maharashtra&apos;s Governor sits at Raj Bhavan, Malabar Hill, Mumbai.</li>
            <li><strong>Chief Minister</strong> — head of the Council of Ministers. Maharashtra&apos;s first CM was Yashwantrao Chavan (1960). The state secretariat is at Mantralaya, Mumbai.</li>
            <li><strong>Maharashtra Legislative Assembly (Vidhan Sabha)</strong>: <strong>288 seats</strong>. Term 5 years.</li>
            <li><strong>Maharashtra Legislative Council (Vidhan Parishad)</strong>: <strong>78 seats</strong> — Maharashtra is one of only six Indian states with a bicameral legislature (along with UP, Bihar, Karnataka, Andhra Pradesh, Telangana).</li>
            <li>Members of the Legislative Council are elected by graduates, teachers, local authorities, the Vidhan Sabha, and 1/6th are nominated by the Governor.</li>
            <li>The Bombay High Court is the constitutional court for Maharashtra.</li>
          </ul>

          <h3>10. Panchayati Raj (Part IX, Articles 243–243O)</h3>
          <p>
            Three-tier system institutionalised by the <strong>73rd Constitutional Amendment Act,
            1992</strong> (came into force 24 April 1993 — celebrated as Panchayati Raj Day).
          </p>
          <ul>
            <li><strong>Gram Panchayat</strong> — village level.</li>
            <li><strong>Panchayat Samiti</strong> — block / taluka level.</li>
            <li><strong>Zilla Parishad</strong> — district level.</li>
            <li>33% reservation for women (raised to 50% in many states including Maharashtra).</li>
            <li>State Election Commission conducts elections every 5 years.</li>
            <li>Maharashtra was the <strong>first state to adopt the Panchayati Raj system</strong> on the recommendations of the <strong>Balwantrai Mehta Committee (1957)</strong> — implemented in <strong>1962 in Rajasthan and Andhra Pradesh first</strong> (Maharashtra in 1962 too via the Maharashtra Zilla Parishad &amp; Panchayat Samiti Act 1961, effective 1 May 1962).</li>
          </ul>

          <h3>11. Municipalities (Part IXA, Articles 243P–243ZG)</h3>
          <p>
            Inserted by the <strong>74th Amendment, 1992</strong>. Three types of urban bodies:
            Nagar Panchayat (transitional area), Municipal Council (smaller urban area), and
            Municipal Corporation (larger urban area). Maharashtra has 29 Municipal Corporations
            including Mumbai (BMC — Asia&apos;s richest civic body), Pune, Nagpur, Nashik,
            Aurangabad, Thane and Pimpri-Chinchwad.
          </p>

          <h3>12. Constitutional bodies and key offices</h3>
          <ul>
            <li><strong>Election Commission of India</strong> (Article 324) — CEC + 2 ECs.</li>
            <li><strong>Comptroller and Auditor General</strong> (Article 148) — the &quot;guardian of the public purse&quot;.</li>
            <li><strong>Attorney General of India</strong> (Article 76) — first law officer.</li>
            <li><strong>UPSC</strong> (Article 315) and the <strong>State Public Service Commissions</strong> (such as MPSC).</li>
            <li><strong>Finance Commission</strong> (Article 280) — quinquennial, recommends Centre-State revenue sharing.</li>
            <li><strong>NITI Aayog</strong> — established by Government Resolution (1 January 2015) to replace the Planning Commission. Not a constitutional or statutory body.</li>
          </ul>

          <h3>13. Schedules of the Constitution</h3>
          <p>Today there are <strong>12 schedules</strong>:</p>
          <ol>
            <li>Names of states and UTs and their territories.</li>
            <li>Salaries and allowances of constitutional offices.</li>
            <li>Forms of oaths and affirmations.</li>
            <li>Allocation of Rajya Sabha seats among states/UTs.</li>
            <li>Administration of scheduled and tribal areas.</li>
            <li>Administration of tribal areas in Assam, Meghalaya, Tripura, Mizoram (Sixth Schedule).</li>
            <li>Three lists — <strong>Union (97)</strong>, <strong>State (66)</strong>, <strong>Concurrent (47)</strong>.</li>
            <li>22 official languages of India.</li>
            <li>Land reforms — kept out of judicial review.</li>
            <li>Anti-defection law (added by 52nd Amendment, 1985).</li>
            <li>Powers, authority and responsibilities of Panchayats — 29 functional items (added by 73rd Amendment).</li>
            <li>Powers and responsibilities of Municipalities — 18 functional items (added by 74th Amendment).</li>
          </ol>

          <h3>14. Key amendments to memorise</h3>
          <ul>
            <li><strong>1st (1951)</strong> — added Ninth Schedule.</li>
            <li><strong>7th (1956)</strong> — reorganisation of states on linguistic basis.</li>
            <li><strong>42nd (1976)</strong> — &quot;mini-constitution&quot;; added SOCIALIST, SECULAR, INTEGRITY to Preamble; Fundamental Duties; transferred Education to Concurrent List.</li>
            <li><strong>44th (1978)</strong> — undid many Emergency-era changes; Right to Property removed from FRs.</li>
            <li><strong>52nd (1985)</strong> — Anti-defection law (Tenth Schedule).</li>
            <li><strong>61st (1989)</strong> — voting age reduced from 21 to 18.</li>
            <li><strong>73rd &amp; 74th (1992)</strong> — Panchayati Raj and Municipalities.</li>
            <li><strong>86th (2002)</strong> — Right to Education (Article 21A); Article 51A clause (k); Article 45 reframed.</li>
            <li><strong>91st (2003)</strong> — cap of 15% on Council of Ministers&apos; size.</li>
            <li><strong>101st (2016)</strong> — Goods and Services Tax (GST).</li>
            <li><strong>103rd (2019)</strong> — 10% reservation for EWS.</li>
            <li><strong>104th (2020)</strong> — extended SC/ST reservation in Lok Sabha and state assemblies; abolished nominated Anglo-Indian seats.</li>
            <li><strong>105th (2021)</strong> — restored states&apos; powers to identify SEBCs (OBCs).</li>
            <li><strong>106th (2023)</strong> — <em>Nari Shakti Vandan Adhiniyam</em> — 33% reservation for women in Lok Sabha and state legislative assemblies.</li>
          </ul>

          <h3>Next steps</h3>
          <ul>
            <li>Memorise the article numbers in section 3 (FRs) and the amendment list in section 14 — these alone will cover ~6–8 marks per prelim.</li>
            <li>Read the <Link href="/study-guides/maharashtra-history">Maharashtra History</Link> guide for the political background to state formation.</li>
            <li>Solve a polity-heavy PYQ paper from <Link href="/exams">/exams</Link> and identify your weak topics.</li>
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
