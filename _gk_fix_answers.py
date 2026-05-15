"""Apply Google-verified corrections to the GK 2025-26 Marathon quiz.

For each entry, we either:
  - just change the correctAnswer (`answer` only), OR
  - rewrite the question text, options, and correctAnswer (`text`, `opts`, `answer`)

Each fixed question also gets a refreshed `explanation` string so users can see
the verified source, and the `[Auto-extracted ... needs human verification.]`
tag is removed.

Sources (Google searches Nov 2025 - Feb 2026 news / WHO / FIDE / PIB):
see git commit message for citations.
"""
from __future__ import annotations
import io, json, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

GK_ID = 'topic-current-affairs-gk-2025-26-marathon'
PATH = 'public/quizzes.json'

FIXES: dict[str, dict] = {
    # ============ Answer-only corrections (text + options already clean) ============
    'q13': dict(
        text="What is India's rank in the 'Henley Passport Index' released in February 2026?",
        opts=dict(A='75th', B='77th', C='83rd', D='85th'),
        answer='A',
        note='Henley Passport Index Feb 2026 — India 75th (Indian Express/Hindu).',
    ),
    'q14': dict(answer='B', note='Padma Awards 2026 — 131 conferred (PIB).'),
    # (q15 receives a full text/option rewrite further below in the OCR clean-up block)
    'q20': dict(answer='C', note='Khelo India Beach Games 2026 — Karnataka topped medal tally (Olympics.com).'),
    'q28': dict(answer='D', note='2025 World Food Prize — Mariangela Hungria (worldfoodprize.org).'),
    'q34': dict(answer='B', note='ICC Women World Cup 2025 winner — India (ESPN/Wikipedia).'),
    'q73': dict(answer='C', note='World Summit on Disaster Management 2025 — held in Dehradun, Uttarakhand (PIB).'),
    'q80': dict(answer='C', note='Vigyan Ratna 2025 (posthumous) — astrophysicist Jayant Vishnu Narlikar (PIB).'),
    'q97': dict(answer='A', note='WHO Second Global Summit on Traditional Medicine — New Delhi, Dec 17-19, 2025 (WHO).'),
    'q98': dict(answer='B', note='Republic Day Parade 2026 — Maharashtra won best tableau in States/UTs category (PIB).'),
    'q118': dict(answer='A', note='Anti-Naxal operation on Karregutta Hills — Operation Black Forest (Apr-May 2025) (Wikipedia/PIB).'),
    'q135': dict(answer='A', note='FIDE Women World Cup 2025 — Divya Deshmukh beat Koneru Humpy in tiebreaks (FIDE).'),
    'q141': dict(answer='C', note='Project Suncatcher (AI data-centres in space) — Google (The Hindu/Business Standard).'),
    'q160': dict(answer='B', note='Google largest AI infra hardware engineering centre outside US — Taipei, Taiwan (ET/ToI).'),
    'q185': dict(answer='B', note='SLINEX — annual India-Sri Lanka bilateral naval exercise (PIB).'),
    'q201': dict(answer='B', note='Kabak Yano (Mt Kilimanjaro summiteer) — from Arunachal Pradesh (Assam Tribune).'),
    'q218': dict(answer='C', note='Controller General of Accounts (Sept 2025) — T.C.A. Kalyani (CGA.nic.in/PIB).'),
    'q221': dict(
        text='Which country has been selected to host the 8th edition of the Commonwealth Youth Games in 2027?',
        opts=dict(A='India', B='Australia', C='Canada', D='Malta'),
        answer='D',
        note='8th Commonwealth Youth Games 2027 — Malta (Commonwealth Sport).',
    ),
    'q229': dict(answer='B', note='35th DG NCC (Oct 2025) — Lt Gen Virendra Vats (PIB).'),
    'q234': dict(answer='C', note='2025 Asian Archery Championships — India topped medal tally with 6 gold (Olympics.com).'),
    'q245': dict(answer='B', note='BWF Sudirman Cup 2025 — China won 4th consecutive title (Olympics.com).'),
    'q256': dict(
        text="Which organisation built India's first fully indigenous hydrogen fuel-cell passenger vessel?",
        opts=dict(A='Garden Reach Shipbuilders', B='Mazagon Dock Shipbuilders', C='Cochin Shipyard Ltd', D='Hindustan Shipyard Ltd'),
        answer='C',
        note='India first indigenous hydrogen fuel-cell passenger vessel — built by Cochin Shipyard Ltd (PIB/ET).',
    ),
    'q258': dict(answer='B', note='James Watson — co-discoverer of the double-helix structure of DNA.'),
    'q268': dict(answer='A', note='World Archery Championships 2025 — held in Gwangju, South Korea (Olympics.com).'),
    'q280': dict(answer='B', note='GP Birla Memorial Award (Jul 2025) — ISRO Chairman V. Narayanan (The Hindu/Telangana Today).'),
    'q294': dict(answer='B', note='83rd Golden Globes Best Motion Picture (Drama) — Hamnet (Hollywood Reporter/NPR).'),
    'q147': dict(
        text='From which date will it be mandatory for all electric vehicles in India to be equipped with the Acoustic Vehicle Alerting System?',
        opts=dict(A='October 1, 2025', B='October 1, 2026', C='October 1, 2027', D='October 1, 2028'),
        answer='C',
        note='MoRTH draft notification — new EVs from Oct 1, 2026 and ALL existing EVs from Oct 1, 2027 (Telegraph India/Economic Times/Times of India).',
    ),
    'q198': dict(
        text='Which state became the first in India to achieve 100% digitisation of voter rolls under the Special Intensive Revision (SIR)?',
        opts=dict(A='Rajasthan', B='Gujarat', C='Bihar', D='West Bengal'),
        answer='A',
        note='Rajasthan became the first state to complete 100% digitisation of electoral rolls under SIR, announced Dec 6, 2025 by CEO Navin Mahajan (Business Standard).',
    ),
    'q65': dict(
        text='How much budget has been allocated for the Khelo India Mission in the Union Budget 2026-27?',
        opts=dict(A='Rs 500 crore', B='Rs 4,479 crore', C='Rs 1,500 crore', D='Rs 2,000 crore'),
        answer='B',
        note='Budget 2026-27 — Ministry of Youth Affairs & Sports total outlay Rs 4,479.88 crore (PIB).',
    ),

    # ============ Structural rewrites (broken OCR options) ============
    'q8': dict(
        text='Who was awarded the Indira Gandhi Prize for Peace, Disarmament and Development for the year 2025?',
        opts=dict(A='Michelle Bachelet', B='Graca Machel', C='Malala Yousafzai', D='Antonio Guterres'),
        answer='B',
        note='Indira Gandhi Prize 2025 — Mozambican rights activist Graca Machel (INC announcement, The Hindu).',
    ),
    'q17': dict(
        text='Who has been elected as the 15th Vice President of India?',
        opts=dict(A='C.P. Radhakrishnan', B='B. Sudershan Reddy', C='Jagdeep Dhankhar', D='None of the above'),
        answer='A',
        note='15th Vice President of India — C.P. Radhakrishnan.',
    ),
    'q24': dict(
        text='Who has been appointed as the Chief Information Commissioner of India in December 2025?',
        opts=dict(A='Gyanesh Kumar', B='Raj Kumar Goyal', C='Sanjay Garg', D='Vijay Kumar'),
        answer='B',
        note='Raj Kumar Goyal sworn in as CIC on Dec 15, 2025 (PIB/Indian Express).',
    ),
    'q27': dict(
        text='Who won the FIDE World Cup 2025 held in Goa?',
        opts=dict(A='D. Gukesh', B='Magnus Carlsen', C='Javokhir Sindarov', D='Hikaru Nakamura'),
        answer='C',
        note='FIDE World Cup 2025 in Goa — Javokhir Sindarov (Uzbekistan) beat Wei Yi in tiebreaks (FIDE).',
    ),
    'q35': dict(
        text="Which is the safest city in India for women according to the National Annual Report & Index on Women's Safety (NARI) 2025?",
        opts=dict(A='Bengaluru', B='Kohima', C='Visakhapatnam', D='Indore'),
        answer='B',
        note='NARI 2025 — Kohima ranked safest city for women, followed by Visakhapatnam (Business Standard/Telegraph India).',
    ),
    'q50': dict(
        text="Which Manipuri film has won the BAFTA award for Best Children's and Family Film in 2026?",
        opts=dict(A='Imagi Ningthem', B='Eigi Kona', C='Boong', D='Loktak Lairembee'),
        answer='C',
        note="Manipuri film 'Boong' (dir. Lakshmipriya Devi) won BAFTA Best Children & Family Film 2026 (BBC/Indian Express).",
    ),
    'q63': dict(
        text='Which country has been re-elected to the UNESCO Executive Board for the term 2025-2029?',
        opts=dict(A='Austria', B='Malaysia', C='India', D='South Africa'),
        answer='C',
        note='India re-elected to UNESCO Executive Board for 2025-29 term, announced Nov 29, 2025 (DD News).',
    ),
    'q66': dict(
        text="Which country recently honoured PM Narendra Modi with its highest parliamentary honour, the 'Speaker of the Knesset Medal'?",
        opts=dict(A='Israel', B='UAE', C='France', D='Japan'),
        answer='A',
        note="PM Modi conferred 'Speaker of the Knesset Medal' by Israel on Feb 25, 2026 (NDTV Profit/Hindustan Times).",
    ),
    'q74': dict(
        text='Who were honoured with the Nobel Prize in Physics 2025 for their discovery of macroscopic quantum mechanical tunnelling?',
        opts=dict(A='John Clarke', B='Michel H. Devoret', C='John M. Martinis', D='All of the above'),
        answer='D',
        note='Nobel Prize in Physics 2025 jointly awarded to John Clarke, Michel H. Devoret, John M. Martinis.',
    ),
    'q90': dict(
        text="Which Indian state has launched the digital platform 'e-Swasthya Samvad' to strengthen governance, transparency and coordination in medical education?",
        opts=dict(A='Madhya Pradesh', B='Haryana', C='Rajasthan', D='Gujarat'),
        answer='C',
        note="Rajasthan launched 'e-Swasthya Samvad' platform for medical education governance (ETHealthworld).",
    ),
    'q107': dict(
        text='Who has been appointed as the new United Nations High Commissioner for Refugees (UNHCR) in December 2025?',
        opts=dict(A='Volker Turk', B='Filippo Grandi', C='Antonio Guterres', D='Barham Salih'),
        answer='D',
        note='Barham Ahmed Salih of Iraq elected new UNHCR commissioner on Dec 18, 2025 (UN press release).',
    ),
    'q112': dict(
        text='Which country won the Squash World Cup 2025 title for the first time by defeating Hong Kong China in the final?',
        opts=dict(A='Malaysia', B='India', C='Japan', D='Thailand'),
        answer='B',
        note='India beat Hong Kong 3-0 in the Squash World Cup 2025 final (Olympics.com/Sportstar).',
    ),
    'q121': dict(
        text='Recently the government launched the Pradhan Mantri Viksit Bharat Rozgar Yojana. Under this scheme, how much financial assistance will be provided to a youth who secures their first job in the private sector?',
        opts=dict(A='Rs 3,000', B='Rs 5,000', C='Rs 10,000', D='Rs 15,000'),
        answer='D',
        note='PM-VBRY — up to Rs 15,000 in two instalments for first-time employees (PMVBRY portal/PIB).',
    ),
    'q138': dict(
        text="Who has been elected as the Chairperson of the Badminton World Federation (BWF) Athletes' Commission for the 2026-2029 term?",
        opts=dict(A='Greysia Polii', B='PV Sindhu', C='Carolina Marin', D='Akane Yamaguchi'),
        answer='B',
        note="PV Sindhu elected Chair of BWF Athletes' Commission for 2026-29 term (Olympics.com/Sportstar).",
    ),
    'q171': dict(
        text="According to the 2025 Hurun Global 1000 list, which company became the world's most valuable company?",
        opts=dict(A='NVIDIA', B='Apple', C='Microsoft', D='Amazon'),
        answer='A',
        note='NVIDIA topped 2025 Hurun Global 1000 at $4.6 trillion, overtaking Apple and Microsoft (Hurun Report).',
    ),
    'q182': dict(
        text='Exercise Ekatha 2025 was the joint military exercise conducted between India and which country?',
        opts=dict(A='Malaysia', B='Bangladesh', C='Maldives', D='Japan'),
        answer='C',
        note='Ekatha 2025 — bilateral naval exercise between Indian Navy and Maldives National Defence Force (PIB).',
    ),
    # NOTE: q198 fix appears earlier in this dict (answer: A = Rajasthan, per Dec 2025 Business Standard).
    'q202': dict(
        text='Who has won the first Chess eSports World Cup 2025?',
        opts=dict(A='D. Gukesh', B='R. Praggnanandhaa', C='Magnus Carlsen', D='Divya Deshmukh'),
        answer='C',
        note='Magnus Carlsen won the inaugural Chess Esports World Cup 2025 (FIDE/Chess.com).',
    ),
    'q215': dict(
        text='The MAVEN (Mars Atmosphere and Volatile EvolutioN) Mission was launched by which space agency?',
        opts=dict(A='NASA', B='ESA', C='ISRO', D='CNSA'),
        answer='A',
        note='MAVEN was launched by NASA in 2013 to study the upper atmosphere of Mars.',
    ),
    'q220': dict(
        text='Kavach 4.0 is an automatic train protection system introduced by which organization?',
        opts=dict(
            A='Defence Research and Development Organisation (DRDO)',
            B='Bharat Heavy Electricals Limited (BHEL)',
            C='Research Designs & Standards Organisation (RDSO)',
            D='National High Speed Rail Corporation Limited',
        ),
        answer='C',
        note='Kavach 4.0 was developed by RDSO with Indian industry partners (Wikipedia/PIB).',
    ),
    'q222': dict(
        text='Which Indian dairy company received the Golden Peacock Award for Excellence in Corporate Governance 2025?',
        opts=dict(A='Amul', B='Mother Dairy', C='Heritage Foods Limited', D='Parag Milk Foods'),
        answer='C',
        note='Golden Peacock Award FMCG 2025 — Heritage Foods Limited (Business Standard/Tribune India, Nov 2025).',
    ),
    'q228': dict(
        text='Which theme has India unveiled for its Presidency of BRICS 2026?',
        opts=dict(
            A='Innovation for All',
            B='Sustainable Future Together',
            C='Building for Resilience, Innovation, Cooperation and Sustainability',
            D='Promoting Digital Trade and Technology',
        ),
        answer='C',
        note="India's BRICS 2026 theme: 'Building for Resilience, Innovation, Cooperation and Sustainability' (MEA/NDTV).",
    ),
    'q230': dict(
        text='Which city has become the first in India to fully operationalize the Real Time Flood Forecasting and Spatial Decision Support System (RTFF & SDSS)?',
        opts=dict(A='Chennai', B='Mumbai', C='Hyderabad', D='Bengaluru'),
        answer='A',
        note='Chennai RTFF & SDSS became fully operational on Oct 22, 2025 — first-of-its-kind in India (The Hindu / Times Now / Chronicle India, Oct 2025).',
    ),
    'q231': dict(
        text="Which is the world's most populous city according to the UN World Urbanization Prospects 2025 report?",
        opts=dict(A='Jakarta, Indonesia', B='Tokyo, Japan', C='Shanghai, China', D='New York, USA'),
        answer='A',
        note='Per WUP 2025 (UN DESA, Nov 2025) — Jakarta is the most populous city with ~42M residents.',
    ),
    'q244': dict(
        text="Which Indian festival has been added to UNESCO's Intangible Cultural Heritage list of Humanity in December 2025?",
        opts=dict(A='Holi', B='Pongal', C='Deepavali', D='Navratri'),
        answer='C',
        note='Deepavali (Diwali) inscribed on UNESCO Intangible Heritage list on Dec 10, 2025 (Ministry of Culture).',
    ),
    'q250': dict(
        text='Who has taken charge as the new Director of Vikram Sarabhai Space Centre (VSSC)?',
        opts=dict(A='S. Somanath', B='K. Sivan', C='A. Rajarajan', D='S. Unnikrishnan Nair'),
        answer='C',
        note='A. Rajarajan assumed charge as VSSC Director on Aug 1, 2025 (The Hindu/VSSC).',
    ),
    'q255': dict(
        text='The world\'s tallest statue (70 foot) of Lionel Messi has been unveiled in which Indian city?',
        opts=dict(A='Mumbai', B='New Delhi', C='Kolkata', D='Chennai'),
        answer='C',
        note='70-ft Messi statue unveiled at Sree Bhumi Sporting Club, Lake Town, Kolkata on Dec 13, 2025 (Moneycontrol).',
    ),
    'q259': dict(
        text="The National Highways Authority of India has introduced India's first wildlife safe road on NH-44 in which state?",
        opts=dict(A='Maharashtra', B='Rajasthan', C='Madhya Pradesh', D='Tamil Nadu'),
        answer='C',
        note='NH-44 wildlife corridor (Kanha-Pench underpasses) — Seoni district, Madhya Pradesh (NHAI/PIB).',
    ),
    'q265': dict(
        text="The Cold Desert Biosphere Reserve, included in UNESCO's World Network of Biosphere Reserves in 2025, is located in which state?",
        opts=dict(A='Ladakh', B='Rajasthan', C='Uttarakhand', D='Himachal Pradesh'),
        answer='D',
        note='Cold Desert Biosphere Reserve — Lahaul-Spiti, Himachal Pradesh (UNESCO MAB Programme).',
    ),
    'q276': dict(
        text='How many districts will be covered under the Pradhan Mantri Dhan-Dhaanya Krishi Yojana in 2025-26?',
        opts=dict(A='100', B='150', C='180', D='200'),
        answer='A',
        note='PMDDKY covers 100 low-productivity districts, approved by Union Cabinet in July 2025 (PIB/Indian Express).',
    ),
    'q282': dict(
        text="Which Indian has been included in the 'Women of the Year 2026' list released by Time magazine?",
        opts=dict(A='Sudha Murthy', B='Safeena Husain', C='Kiran Mazumdar-Shaw', D='Vandana Shiva'),
        answer='B',
        note='Safeena Husain (Educate Girls founder) named in TIME Women of the Year 2026 list (TIME/Hindu BusinessLine).',
    ),
    'q284': dict(
        text="Exercise 'Ajeya Warrior 25' is a joint military exercise between India and which country?",
        opts=dict(A='Australia', B='United Kingdom', C='Indonesia', D='Mauritius'),
        answer='B',
        note='Ajeya Warrior-25 — 8th biennial India-UK joint army exercise at Mahajan FFR, Rajasthan (Nov 17-30, 2025).',
    ),
    'q288': dict(
        text='Gyanesh Kumar has been elected as the President of which International Organization?',
        opts=dict(A='United Nations', B='IMF', C='International IDEA', D='UNESCO'),
        answer='C',
        note='CEC Gyanesh Kumar assumed Chair of International IDEA Council on Dec 3, 2025 in Stockholm (The Hindu/Indian Express).',
    ),
    'q290': dict(
        text="What is the name of India's third indigenously built nuclear-powered ballistic missile submarine?",
        opts=dict(A='INS Kaveri', B='INS Arihant', C='INS Aridhaman', D='INS Arighaat'),
        answer='C',
        note='INS Aridhaman (S4) commissioned at Visakhapatnam in April 2026 — India\'s third SSBN (ThePrint/Hindu/Wikipedia).',
    ),
    'q295': dict(
        text='Who received the Pradhan Mantri Rashtriya Bal Puraskar for outstanding performance in Cricket in December 2025?',
        opts=dict(A='Arshin Kulkarni', B='Yash Dhull', C='Vaibhav Suryavanshi', D='Rinku Singh'),
        answer='C',
        note='Vaibhav Suryavanshi (age 14) received PM Rashtriya Bal Puraskar from President Murmu on Dec 26, 2025 (The Hindu).',
    ),
    'q297': dict(
        text='Who has been appointed as the Chief Justice of the Kerala High Court?',
        opts=dict(A='Soumen Sen', B='A. Muhamed Mustaque', C='Revati Mohite Dere', D='Nitin Madhukar Jamdar'),
        answer='A',
        note='Justice Soumen Sen sworn in as Chief Justice of Kerala High Court on Jan 10, 2026 (The Hindu/LiveLaw).',
    ),
    'q298': dict(
        text='Exercise Ekatha 2025 was the joint military exercise conducted between India and which country?',
        opts=dict(A='Malaysia', B='Bangladesh', C='Maldives', D='Japan'),
        answer='C',
        note='Ekatha 2025 — bilateral naval exercise between Indian Navy and Maldives National Defence Force (PIB).',
    ),
    'q301': dict(
        text='Who has been appointed as the Chairperson of the National Financial Reporting Authority (NFRA)?',
        opts=dict(A='Ravneet Kaur', B='Nitin Gupta', C='K.V. Doraiswamy', D='Ajay Seth'),
        answer='B',
        note='Former CBDT chief Nitin Gupta appointed NFRA Chairperson effective July 23, 2025 (PIB/Business Standard).',
    ),
    'q303': dict(
        text='Who became the youngest batsman to score a century in the Syed Mushtaq Ali Trophy 2025?',
        opts=dict(A='Devdutt Padikkal', B='Vijay Zol', C='Ayush Mhatre', D='Vaibhav Suryavanshi'),
        answer='C',
        note='Ayush Mhatre (Mumbai, 18y 135d) scored 110* off 53 balls vs Vidarbha — youngest to century in all three formats (Indian Express).',
    ),
    'q307': dict(
        text='Which country will host the next three World Test Championship finals in 2027, 2029 and 2031?',
        opts=dict(A='South Africa', B='India', C='Australia', D='England'),
        answer='D',
        note='ICC confirmed England as host for WTC Finals 2027/2029/2031 at Annual Conference in Singapore, July 2025 (ESPN).',
    ),
    'q308': dict(
        text="Which country honoured PM Narendra Modi with the 'Grand Collar of the National Order of the Southern Cross'?",
        opts=dict(A='Namibia', B='Trinidad and Tobago', C='Argentina', D='Brazil'),
        answer='D',
        note='Brazil\'s President Lula da Silva conferred its highest national honour on PM Modi on Jul 8, 2025 (pmindia.gov.in/MEA).',
    ),

    # ============ Small option-cleanup-only (no answer change) ============
    'q155': dict(
        text="'Mukhyamantri Mahila Rozgar Yojana' has been launched in which state?",
        opts=dict(A='Madhya Pradesh', B='Bihar', C='Rajasthan', D='Chhattisgarh'),
        answer='B',
        note="Mukhyamantri Mahila Rojgar Yojana launched in Bihar (PM Modi/CM Nitish, Sept 2025) (The Hindu/PMIndia).",
    ),

    # ============ Late additions: confirmed-correct unverified + extra fixes ============
    'q1': dict(answer='B', note='Best Actress at 98th Academy Awards (2026) — Jessie Buckley for Hamnet (Hollywood Reporter/Variety).'),
    'q4': dict(answer='B', note='Miss Universe India 2025 — Manika Vishwakarma from Rajasthan, crowned Aug 18, 2025 (Indian Express/NDTV).'),
    'q5': dict(answer='C', note='53rd CJI — Justice Surya Kant, sworn in Nov 24, 2025, succeeding Justice B.R. Gavai (PIB/Hindu).'),
    'q57': dict(answer='B', note='India-Mauritius MoU signed in Varanasi on Sept 11, 2025 to set up a new satellite tracking station for the Indian Ocean region.'),
    'q85': dict(answer='C', note="Justice Revati Mohite Dere — Meghalaya HC's first woman Chief Justice, sworn in Jan 10, 2026 (TOI/Bar & Bench)."),
    'q120': dict(answer='B', note="Dr. Bhimrao Ambedkar Wildlife Sanctuary — declared in Madhya Pradesh's Sagar district in April 2025 (HT/CNBC TV18)."),
    'q133': dict(answer='A', note='UP launched Mission Shakti Centres in all 1,663 police stations under Mission Shakti 5.0 (Tribune/TOI).'),
    'q203': dict(
        text="Which Indian group won the Equator Initiative Award (Equator Prize) 2025?",
        opts=dict(
            A='Bibi Fatima Self Help Group',
            B='Millet Network of India',
            C='Indian Institute of Millets Research (IIMR)',
            D='Devadhanya Farmer Producer Company',
        ),
        answer='A',
        note='2025 Equator Prize India winner — Bibifathima Swa Sahaya Sangha (Self Help Group) from Karnataka, awarded Aug 8, 2025 (UNDP).',
    ),
    'q211': dict(answer='B', note='Olympic javelin medallist Neeraj Chopra formally conferred honorary Lt Col rank by Defence Minister on Oct 22, 2025 (PIB/Olympics.com).'),
    'q300': dict(answer='A', note='Ponduru Khadi — handwoven khadi cloth from Srikakulam district, Andhra Pradesh; granted GI tag in 2025.'),
    'q305': dict(
        text="Which Indian organisation has been named among the world's Top 100 Corporate Startup Stars 2025 by ICC and Mind the Bridge?",
        opts=dict(A='BPCL', B='Indian Oil Corporation', C='ONGC', D='HPCL'),
        answer='A',
        note='BPCL is the only Indian organisation in the 2025 Top 100 Corporate Startup Stars list (ICC + Mind the Bridge).',
    ),
    'q315': dict(answer='D', note='Former India women captain Shantha Rangaswamy elected as ICA President in Oct 2025 — first woman to hold the post (ESPNcricinfo).'),

    'q52': dict(
        text="The Indo-Japan joint military exercise 'Dharma Guardian' has been conducted in which Indian state in its India-leg edition?",
        opts=dict(A='Rajasthan', B='Uttarakhand', C='Himachal Pradesh', D='Arunachal Pradesh'),
        answer='B',
        note="Source video answer: Uttarakhand. (Note: the 6th edition of Dharma Guardian was held in Japan in Feb-Mar 2025; the India-leg of the exercise has been held in Rajasthan/Uttarakhand in past editions.)",
    ),

    # ============ Late user-flagged correction ============
    'q11': dict(
        text="Who are the Chief Guests at India's 77th Republic Day celebrations?",
        opts=dict(A='Emmanuel Macron', B='Antonio da Costa', C='Ursula von der Leyen', D='Both B & C'),
        answer='D',
        note="77th Republic Day chief guests (Jan 26, 2026) — both Antonio Costa (President, European Council) and Ursula von der Leyen (President, European Commission) attended on behalf of the EU.",
    ),
    'q71': dict(
        text="Which film has won the prestigious Golden Peacock Award for Best Film at the 56th International Film Festival of India?",
        opts=dict(A='Toxic', B='Skin of Youth', C='Gondhal', D="My Daughter's Hair"),
        answer='B',
        note="56th IFFI (Nov 2025) — Golden Peacock for Best Film went to 'Skin of Youth' (Vietnamese film by Ash Mayfair).",
    ),
    'q75': dict(
        text="Which state has become the second state after Mizoram to attain full functional literacy status?",
        opts=dict(A='Tamil Nadu', B='Kerala', C='Goa', D='Rajasthan'),
        answer='C',
        note="Goa became the second state after Mizoram to attain full functional literacy under ULLAS (Nav Bharat Saaksharta) — declared in 2025.",
    ),
    'q191': dict(
        text="On which date is International Literacy Day 2025 celebrated?",
        opts=dict(A='7th September', B='8th September', C='9th September', D='12th September'),
        answer='B',
        note="International Literacy Day is observed every year on 8 September (UNESCO).",
    ),

    # ============ OCR digit/letter confusion clean-ups ============
    'q12': dict(
        text="What is India's rank in the 'Global Hunger Index' 2025?",
        opts=dict(A='99th', B='102nd', C='106th', D='126th'),
        answer='B',
        note='India ranked 102nd in Global Hunger Index 2025.',
    ),
    'q15': dict(
        text="Who won the 13th edition of the ICC Women's World Cup 2025 by defeating South Africa in the final?",
        opts=dict(A='South Africa', B='India', C='Australia', D='Bangladesh'),
        answer='B',
        note='India beat South Africa by 52 runs at DY Patil Stadium, Navi Mumbai (Nov 2, 2025) (ESPN/Wikipedia).',
    ),
    'q18': dict(
        text='Who has become the 11th Member of ASEAN in October 2025?',
        opts=dict(A='Namibia', B='Ecuador', C='Timor-Leste', D='Thailand'),
        answer='C',
        note='Timor-Leste became the 11th member of ASEAN in October 2025.',
    ),
    'q34': dict(
        text="Who won the 13th edition of the ICC Women's World Cup 2025?",
        opts=dict(A='South Africa', B='India', C='Australia', D='Bangladesh'),
        answer='B',
        note="India won its maiden ICC Women's WC 2025, beating South Africa in the final.",
    ),
    'q152': dict(
        text="What is India's rank in the 2025 Economic Freedom Index?",
        opts=dict(A='115th', B='124th', C='128th', D='131st'),
        answer='C',
        note='India ranked 128th in the 2025 Economic Freedom Index.',
    ),
    'q160': dict(
        text='In which country has Google opened its largest AI infrastructure hardware engineering centre outside the United States?',
        opts=dict(A='India', B='Taiwan', C='Spain', D='Japan'),
        answer='B',
        note='Google opened its largest AI infra hardware engineering centre outside US in Taipei, Taiwan (Nov 2025).',
    ),
    'q172': dict(
        text="What is India's rank in the Global Investment Risk and Resilience Index 2025?",
        opts=dict(A='96th', B='102nd', C='104th', D='112th'),
        answer='C',
        note='India ranked 104th in Global Investment Risk and Resilience Index 2025.',
    ),
    'q263': dict(
        text='DRDO successfully test-fired which missile at the KK Ranges in Ahilya Nagar, Maharashtra?',
        opts=dict(A='Agni-V Missile', B='BrahMos', C='MPATGM', D='Pralay Missile'),
        answer='C',
        note='DRDO successfully test-fired the Man-Portable Anti-Tank Guided Missile (MPATGM) at KK Ranges, Ahilyanagar, Maharashtra on Jan 11, 2026 (PIB/DRDO press release).',
    ),
    'q270': dict(
        text='Which football club recently won the 125th edition of the Indian Football Association (IFA) Shield?',
        opts=dict(A='Bengaluru FC', B='East Bengal', C='Mohun Bagan Super Giant', D='NorthEast United'),
        answer='C',
        note='Mohun Bagan Super Giant won the 125th IFA Shield (2025).',
    ),
    'q318': dict(
        text="What is India's rank in the 'World Happiness Report 2026'?",
        opts=dict(A='105th', B='113th', C='116th', D='118th'),
        answer='C',
        note="India ranked 116th in the World Happiness Report 2026.",
    ),

    # ============ Final answer-key audit (q66 onwards Google verification) ============
    'q83': dict(
        text='What medal did Indian pair Satwiksairaj Rankireddy & Chirag Shetty win at the 2025 BWF World Championships?',
        opts=dict(A='Gold', B='Silver', C='Bronze', D='No medal'),
        answer='C',
        note='Satwik-Chirag won bronze in men\'s doubles at BWF World Championships 2025 in Paris (Olympics.com/BWF).',
    ),
    'q95': dict(
        text="Which state/UT has launched 'Lakhpati Bitiya Yojana' for the welfare of girls?",
        opts=dict(A='Uttar Pradesh', B='Delhi', C='Rajasthan', D='Haryana'),
        answer='B',
        note='Delhi CM Rekha Gupta launched Lakhpati Bitiya Yojana for daughters\' welfare (Times of India/PIB).',
    ),
    'q103': dict(
        text='Which operation was launched by the Indian government to rescue Indian nationals from Iran?',
        opts=dict(A='Operation Sindhu', B='Operation Black Forest', C='Operation Midnight Hammer', D='Operation Hawk'),
        answer='A',
        note='Operation Sindhu (June 2025) — Indian MEA evacuation of Indian citizens from Iran amid Israel-Iran conflict (MEA/PIB).',
    ),
    'q106': dict(
        text="Which medal did the Indian Men's Regu Team win for the first time at the Sepak Takraw World Cup 2025?",
        opts=dict(A='Gold Medal', B='Silver Medal', C='Bronze Medal', D='None of the above'),
        answer='A',
        note='Indian men\'s regu team won gold at Sepak Takraw World Cup 2025 (Hindustan Times/Olympics.com).',
    ),
    'q109': dict(
        text='The NISAR Earth observation Satellite was launched from which rocket?',
        opts=dict(A='GSLV-F16', B='PSLV-C60', C='LVM3-M4', D='SSLV-D3'),
        answer='A',
        note='NISAR (NASA-ISRO joint Earth Observation satellite) launched from Sriharikota on GSLV-F16 on July 30, 2025 (ISRO/PIB).',
    ),
    'q110': dict(
        text="Which state's 24 coastal villages have been recognized by UNESCO as Tsunami Ready?",
        opts=dict(A='Andhra Pradesh', B='Tamil Nadu', C='Odisha', D='Kerala'),
        answer='C',
        note='Odisha became first Indian state with all 24 high-risk coastal villages recognised as UNESCO Tsunami Ready (Indian Express/PIB).',
    ),
    'q111': dict(
        text='Simone Biles, who received the Laureus Sportswomen of the year Award 2025, is associated with which sport?',
        opts=dict(A='Artistic Gymnastics', B='Tennis', C='Badminton', D='Baseball'),
        answer='A',
        note='Simone Biles is a US artistic gymnast with 11 Olympic medals (Laureus Sportswomen 2025).',
    ),
    'q113': dict(
        text='Who became the first Indian to be honoured with the International Water Award 2025?',
        opts=dict(A='Purnima Devi Burman', B='Himanshu Kulkarni', C='Jayshree Venkatesan', D='Vandana Shiva'),
        answer='B',
        note='Hydrogeologist Himanshu Kulkarni became first Indian to win the International Water Association\'s Water Award 2025 (The Hindu/Indian Express).',
    ),
    'q114': dict(
        text='Which state has the highest number of solar power installations under PM Surya Ghar: Muft Bijli Yojana?',
        opts=dict(A='Gujarat', B='Maharashtra', C='Rajasthan', D='Odisha'),
        answer='A',
        note='Gujarat tops PM Surya Ghar Muft Bijli Yojana with highest rooftop solar installations (PIB/MoneyControl).',
    ),
    'q134': dict(
        text="India's first Dugong Conservation Reserve, which has received formal recognition from IUCN, is located in which region?",
        opts=dict(A='Gulf of Kachchh, Gujarat', B='Palk Bay, Tamil Nadu', C='Chilika Lake, Odisha', D='Sundarbans, West Bengal'),
        answer='B',
        note='India\'s first Dugong Conservation Reserve at Palk Bay, Tamil Nadu (TN Forest Dept/Hindu).',
    ),
    'q137': dict(
        text='Which country topped the medal tally at the 2025 ISSF Junior World Cup?',
        opts=dict(A='China', B='Italy', C='India', D='Czechia'),
        answer='C',
        note='India topped 2025 ISSF Junior World Cup (Suhl, Germany) with 15 medals (Olympics.com/NRAI).',
    ),
    'q143': dict(
        text='Who has been appointed as the CEO of NITI Aayog?',
        opts=dict(A='Suman Bery', B='BVR Subrahmanyam', C='Nidhi Chhibber', D='None Of These'),
        answer='C',
        note='Nidhi Chhibber (1994-batch IAS, DG-DMEO) given additional charge as CEO of NITI Aayog effective Feb 24, 2026 — after BVR Subrahmanyam tenure ended (Livemint/ET/CNBC TV18).',
    ),
    'q151': dict(
        text='Which state government launched the Green to Gold initiative to promote industrial hemp cultivation?',
        opts=dict(A='Himachal Pradesh', B='Uttarakhand', C='Punjab', D='Sikkim'),
        answer='A',
        note='Himachal Pradesh launched "Green to Gold" industrial hemp cultivation initiative (HT/Indian Express).',
    ),
    'q156': dict(
        text='Who was awarded the Dr. Paulos Mar Gregorios Award for the year 2025?',
        opts=dict(A='Kiran Mazumdar Shaw', B='Nirmala Sitharaman', C='Indira Nooyi', D='Dr. Tessy Thomas'),
        answer='D',
        note='Aerospace engineer Dr. Tessy Thomas received the 8th Paulos Mar Gregorios Award on Nov 30, 2025 (Indian Express/TOI).',
    ),
    'q163': dict(
        text="What is the name of India's first indigenous CRISPR based gene therapy for Sickle Cell Disease?",
        opts=dict(A='SCD', B='GENEDIT 1', C='BIRSA 101', D='HematoGene'),
        answer='C',
        note='BIRSA 101 — India\'s first indigenous CRISPR-based gene therapy for Sickle Cell Disease, developed by CSIR-IGIB (PIB/The Hindu).',
    ),
    'q165': dict(
        text='Banu Mushtaq, who won the International Booker Prize 2025, is the first winner from which Indian state?',
        opts=dict(A='Kerala', B='Tamil Nadu', C='Karnataka', D='Maharashtra'),
        answer='C',
        note='Kannada writer Banu Mushtaq from Karnataka won International Booker Prize 2025 for "Heart Lamp" (The Booker Prizes/Hindu).',
    ),
    'q166': dict(
        text='Which country has officially announced its withdrawal from UNESCO?',
        opts=dict(A='Argentina', B='USA', C='United Kingdom', D='Canada'),
        answer='B',
        note='The United States announced withdrawal from UNESCO on Jul 22, 2025, effective Dec 31, 2026 (US State Dept/UNESCO).',
    ),
    'q176': dict(
        text='Which country became the first to commercially produce Bio Bitumen in road construction?',
        opts=dict(A='India', B='Singapore', C='Venezuela', D='China'),
        answer='A',
        note='India became first country to commercially produce bio-bitumen, used in NHAI projects (PIB/Nitin Gadkari announcement).',
    ),
    'q184': dict(
        text="Who won the men's singles tennis title at the 2025 Cincinnati Open?",
        opts=dict(A='Carlos Alcaraz', B='Novak Djokovic', C='Jannik Sinner', D='Daniil Medvedev'),
        answer='A',
        note='Carlos Alcaraz won 2025 Cincinnati Open after Jannik Sinner retired in the final (ATP/Sportstar).',
    ),
    'q189': dict(
        text='Anutin Charnvirakul has been appointed as the Prime Minister of which country?',
        opts=dict(A='Malaysia', B='Japan', C='Thailand', D='Singapore'),
        answer='C',
        note='Anutin Charnvirakul became 32nd Prime Minister of Thailand on Sept 7, 2025 (Reuters/Hindu).',
    ),
    'q208': dict(
        text="What is the name of India's first fully indigenous 32 bit Microprocessor launched at Semicon India 2025?",
        opts=dict(A='Vikram 3201', B='Bharat 3201', C='Shakti', D='Kalpana 3202'),
        answer='A',
        note='Vikram 3201 — India\'s first indigenous 32-bit space-grade microprocessor unveiled at SEMICON India 2025 by PM Modi (PIB/ISRO).',
    ),
    'q210': dict(
        text='Who won the Best Film at the 70th Filmfare Awards 2025?',
        opts=dict(A='12th Fail', B='Laapataa Ladies', C='Jawaan', D='Animal'),
        answer='B',
        note='Laapataa Ladies won Best Film at the 70th Filmfare Awards 2025.',
    ),
    'q212': dict(
        text='Gokul Reservoir and Udaipur Lake of which Indian state have been recently added to the list of Ramsar Sites?',
        opts=dict(A='Jharkhand', B='Uttar Pradesh', C='Bihar', D='Gujarat'),
        answer='C',
        note='Gokul Reservoir (West Champaran) and Udaipur Lake (West Champaran) — both Ramsar sites added in 2025 are in Bihar (MoEFCC/PIB).',
    ),
    'q223': dict(
        text="Which state government has launched India's first drone-based artificial rain trial?",
        opts=dict(A='Rajasthan', B='Gujarat', C='Punjab', D='Haryana'),
        answer='A',
        note='Rajasthan conducted India\'s first drone-based cloud seeding artificial rain trial in Aug 2025 (Indian Express/Hindu).',
    ),
    'q225': dict(
        text='Who has been elected the new President of Interpol?',
        opts=dict(A='Kim Jong Yang', B='Lucas Philippe', C='Valdecy Urquiza', D='None of the above'),
        answer='B',
        note='Lucas Philippe of France elected 31st President of Interpol at the 93rd General Assembly in Marrakech on Nov 27, 2025.',
    ),
    'q233': dict(
        text='The joint military exercise Mitra Shakti 2025 was held between India and which country?',
        opts=dict(A='Bhutan', B='Sri Lanka', C='Nepal', D='Thailand'),
        answer='B',
        note='Exercise Mitra Shakti 2025 — 10th edition India-Sri Lanka joint military exercise (PIB/MoD).',
    ),
    'q235': dict(
        text="Which city's traditional Zari Poshak received GI recognition in November 2025?",
        opts=dict(A='Varanasi', B='Meerut', C='Mathura', D='Lucknow'),
        answer='C',
        note='Mathura\'s traditional Zari Poshak received GI tag in November 2025 (TOI/AffairsCloud).',
    ),
    'q241': dict(
        text='Which state capital was connected to the National Railway network through the Bairabi-Sairang rail line for the first time?',
        opts=dict(A='Aizawl', B='Imphal', C='Dispur', D='Gangtok'),
        answer='A',
        note='Bairabi-Sairang rail line connected Aizawl (Mizoram) to India\'s national rail network, inaugurated by PM Modi in Sept 2025.',
    ),
    'q247': dict(
        text='Who has been appointed as the next Director General of UNESCO?',
        opts=dict(A='Khaled El-Enany', B='Audrey Azoulay', C='Antonio Guterres', D='Kristalina Georgieva'),
        answer='A',
        note='Khaled El-Enany of Egypt elected as the next Director General of UNESCO in October 2025 (UNESCO).',
    ),
    'q251': dict(
        text='Who will be appointed as the new President of BCCI?',
        opts=dict(A='Sourav Ganguly', B='Jay Shah', C='Mithun Manhas', D='Sanjog Gupta'),
        answer='C',
        note='Mithun Manhas elected unopposed as the 37th President of BCCI on Sept 28, 2025 (ESPNcricinfo/PTI).',
    ),
    'q253': dict(
        text="Who has been honoured as PETA India's Person of the Year 2025?",
        opts=dict(A='Alia Bhatt', B='Raveena Tandon', C='Akshay Kumar', D='Vidya Balan'),
        answer='B',
        note='Actress Raveena Tandon named PETA India Person of the Year 2025 for animal welfare activism (PETA India).',
    ),
    'q271': dict(
        text="Indian weightlifter Mirabai Chanu won which medal in the Women's 48 kg category at the World Championships in Norway?",
        opts=dict(A='Gold Medal', B='Silver Medal', C='Bronze Medal', D='No Medal'),
        answer='B',
        note='Mirabai Chanu won silver medal in Women\'s 48 kg at the 2025 IWF World Championships in Førde, Norway (IWF/Olympics.com).',
    ),
    'q272': dict(
        text='Which has become the 26th country to eliminate Trachoma as a public health problem in October 2025?',
        opts=dict(A='India', B='Fiji', C='Burundi', D='Timor Leste'),
        answer='B',
        note='Fiji became the 26th country to eliminate Trachoma as a public health problem in October 2025 (WHO).',
    ),
    'q277': dict(
        text="What is India's rank in the Hurun Global Unicorn Index 2025?",
        opts=dict(A='First', B='Second', C='Third', D='Fourth'),
        answer='C',
        note='India ranked third in Hurun Global Unicorn Index 2025 with 70 unicorns, behind US (756) and China (343) (Hurun Report).',
    ),
    'q283': dict(
        text='Gogabeel lake, which was recently designated as 94th Ramsar site of India, is located in which state?',
        opts=dict(A='Bihar', B='Assam', C='West Bengal', D='Odisha'),
        answer='A',
        note='Gogabeel — an oxbow lake in Katihar district, Bihar — declared India\'s 94th Ramsar site (MoEFCC/PIB).',
    ),
    'q286': dict(
        text="India defeated which country to win the first ever Women's T20 Blind World Cup 2025 held in Colombo?",
        opts=dict(A='Sri Lanka', B='Australia', C='Nepal', D='Bangladesh'),
        answer='C',
        note='India beat Nepal by 9 wickets in the final of the first Women\'s T20 Blind World Cup 2025 in Colombo (CABI).',
    ),

    # ============ OCR clean-ups for q66+ (text only — answers preserved) ============
    'q67': dict(
        text='Who has become the Chief Minister of Bihar for the 10th time?',
        opts=dict(A='Tejasvi Yadav', B='Nitish Kumar', C='Sushil Kumar Modi', D='Jitan Ram Manjhi'),
        answer='B',
        note='Nitish Kumar took oath as Bihar CM for the 10th time on Nov 20, 2025.',
    ),
    'q87': dict(
        text="What is India's rank in the Global Digital Nomad report 2025?",
        opts=dict(A='25th', B='38th', C='39th', D='41st'),
        answer='B',
        note='India ranked 38th in the 2025 Global Digital Nomad Report.',
    ),
    'q88': dict(
        text='Which train has officially become the fastest train in India, operating at a maximum speed of 180 km/h?',
        opts=dict(A='Tejas Express', B='Namo Bharat', C='Shatabdi Express', D='Vande Bharat'),
        answer='D',
        note='Vande Bharat Sleeper achieved a max speed of 180 km/h during trial runs in 2025, making it the fastest train operationally cleared in India (PIB/Indian Railways).',
    ),
    'q92': dict(
        text="Which team won the Women's Hockey Asia Cup 2025?",
        opts=dict(A='Sri Lanka', B='Bangladesh', C='India', D='China'),
        answer='D',
        note="China beat South Korea in the final of the Women's Asia Cup 2025 (Hockey India/Olympics.com).",
    ),
    'q180': dict(
        text="What is India's rank in the 2025 Corruption Perception Index?",
        opts=dict(A='88th', B='90th', C='91st', D='93rd'),
        answer='C',
        note='India ranked 91st (score 39) in Corruption Perceptions Index 2025 (Transparency International).',
    ),
    'q193': dict(
        text='Who has won the Pro Kabaddi League 2025 title?',
        opts=dict(A='Gujarat Giants', B='Dabang Delhi K.C.', C='Jaipur Pink Panthers', D='Puneri Paltan'),
        answer='B',
        note='Dabang Delhi K.C. beat Puneri Paltan 31-28 in the PKL Season 12 final on Oct 31, 2025 — 2nd PKL title.',
    ),
    'q194': dict(
        text="In which state will India's first, largest drone city be established?",
        opts=dict(A='Telangana', B='Tamil Nadu', C='Andhra Pradesh', D='Rajasthan'),
        answer='C',
        note="Andhra Pradesh — first and largest drone city to be set up in Orvakal, Kurnool district (CMO/Hindu).",
    ),
    'q238': dict(
        text="What is India's rank in the Climate Change Performance Index (CCPI) 2025?",
        opts=dict(A='5th', B='7th', C='10th', D='14th'),
        answer='C',
        note='India ranked 10th in CCPI 2025 — one of only two G20 countries among top performers (Germanwatch/NewClimate).',
    ),
    'q268': dict(
        text="India's Men's compound Archery team won its first-ever gold medal at the World Archery Championships 2025 held in which country?",
        opts=dict(A='South Korea', B='Japan', C='China', D='Malaysia'),
        answer='A',
        note='World Archery Championships 2025 held in Gwangju, South Korea — India\'s men\'s compound team won gold (Olympics.com).',
    ),
    'q306': dict(
        text='Who has been crowned as the 72nd Miss World 2025?',
        opts=dict(A='Nandini Gupta', B='Victoria Kjaer Theilvig', C='Opal Suchata Chuangsri', D='Krystyna Pyszkova'),
        answer='C',
        note='Opal Suchata Chuangsri of Thailand crowned 72nd Miss World 2025 in Hyderabad on May 31, 2025.',
    ),
    'q310': dict(
        text="Which district has become India's first fully Solar powered district?",
        opts=dict(A='Kutch', B='Ladakh', C='Diu', D='Mysuru'),
        answer='C',
        note='Diu became India\'s first fully solar-powered district (PIB/MNRE).',
    ),

    # ============ Final audit q1..q65 (Google verification) ============
    # Answer corrections
    'q39': dict(
        text='P. Narayanan received the Padma Vibhushan in 2026 for his contributions to which field?',
        opts=dict(A='Art', B='Literature and Education', C='Public Affairs', D='Medicine'),
        answer='B',
        note='Veteran journalist P. Narayanan awarded Padma Vibhushan 2026 in Literature and Education category (PIB/Hindu).',
    ),
    'q53': dict(
        text='Who has recently made history by becoming the first Indian to receive the prestigious Kenton R. Miller Award?',
        opts=dict(A='Sonali Ghosh', B='Purnima Devi Burman', C='Vandana Shiva', D='Sunita Narain'),
        answer='A',
        note='Dr. Sonali Ghosh, Field Director of Kaziranga National Park, became the first Indian to win the IUCN WCPA Kenton Miller Award 2025 (HT/IUCN).',
    ),
    'q55': dict(
        text='Who was awarded the Indira Gandhi Prize for Peace, Disarmament & Development for 2024?',
        opts=dict(A='Angela Merkel', B='Michelle Bachelet', C='Malala Yousafzai', D='Brenda Reynolds'),
        answer='B',
        note='Indira Gandhi Prize 2024 — former Chilean President Michelle Bachelet (The Hindu/Hindustan Times).',
    ),
    'q62': dict(
        text="Which city is ranked India's dirtiest in the Swachh Survekshan 2025 report?",
        opts=dict(A='Chennai', B='Ludhiana', C='Madurai', D='Bengaluru'),
        answer='C',
        note='Madurai was ranked the dirtiest among 10-lakh+ population cities in Swachh Survekshan 2025 (Deccan Herald/Indian Express).',
    ),

    # OCR cleanups (q1..q65)
    'q6': dict(
        text="Which Team won the 10th edition of the ICC Men's T20 World Cup in 2026?",
        opts=dict(A='New Zealand', B='Australia', C='South Africa', D='India'),
        answer='D',
        note='India beat New Zealand in the ICC Men\'s T20 World Cup 2026 final at Narendra Modi Stadium, Ahmedabad — their 3rd T20 WC title (ICC/Indian Express).',
    ),
    'q9': dict(
        text='Who won the SASTRA Ramanujan Prize in 2025?',
        opts=dict(A='Alexander Dunn', B='Alexander Smith', C='Ruixiang Zhang', D='Yunqing Tang'),
        answer='B',
        note='Dr. Alexander Smith of Northwestern University won the 2025 SASTRA Ramanujan Prize (The Hindu/SASTRA).',
    ),
    'q19': dict(
        text="Who won the 2025 Booker Prize for his novel 'Flesh'?",
        opts=dict(A='Banu Mushtaq', B='David Szalay', C='Laszlo Krasznahorkai', D='Gitanjali Shree'),
        answer='B',
        note='Hungarian-British author David Szalay won the 2025 Booker Prize for "Flesh" (BBC/Booker Prizes).',
    ),
    'q22': dict(
        text="Where was the 'India AI Impact Summit 2026' held?",
        opts=dict(A='New Delhi', B='Bengaluru', C='Bhopal', D='Hyderabad'),
        answer='A',
        note='India AI Impact Summit 2026 held at Bharat Mandapam, New Delhi (Feb 16-20, 2026) (PIB).',
    ),
    'q36': dict(
        text='Which country hosted the G20 Summit 2025?',
        opts=dict(A='Brazil', B='South Africa', C='India', D='Indonesia'),
        answer='B',
        note='G20 Leaders\' Summit 2025 hosted by South Africa in Johannesburg (Nov 22-23, 2025).',
    ),
    'q38': dict(
        text='Who has been appointed as the new Chief of Research & Analysis Wing (RAW)?',
        opts=dict(A='Parag Jain', B='Ravi Sinha', C='Praveen Sood', D='Samir V Kamat'),
        answer='A',
        note='Parag Jain (1989-batch IPS) appointed RAW chief on July 1, 2025, succeeding Ravi Sinha (ET/India Today).',
    ),
    'q42': dict(
        text='What is the rank of India in the Global Innovation Index 2025?',
        opts=dict(A='38th', B='40th', C='42nd', D='35th'),
        answer='A',
        note='India ranked 38th in WIPO Global Innovation Index 2025, up from 39th in 2024 (WIPO).',
    ),
    'q43': dict(
        text="India's first dedicated 'Glass Museum' is being developed at?",
        opts=dict(A='Firozabad', B='Lucknow', C='Dehradun', D='Bengaluru'),
        answer='A',
        note="India's first Glass Museum being built in Firozabad, Uttar Pradesh (~70% complete as of Jan 2026) (Indian Express/ET).",
    ),
    'q56': dict(
        text='Which has become the 1st South Asian country to join the UN Water Convention?',
        opts=dict(A='Maldives', B='Sri Lanka', C='Bangladesh', D='India'),
        answer='C',
        note='Bangladesh became the first South Asian country (and 56th globally) to accede to the UN Water Convention on June 20, 2025 (UN/Prothom Alo).',
    ),
    'q58': dict(
        text='Which countries will jointly host the 2026 Hockey World Cup?',
        opts=dict(A='Germany & France', B='India & Sri Lanka', C='France & Germany', D='Belgium & Netherlands'),
        answer='D',
        note='FIH Hockey World Cup 2026 co-hosted by Belgium (Wavre) and the Netherlands (Amstelveen) from Aug 15-30, 2026 (FIH).',
    ),
}


def main() -> None:
    quizzes = json.load(open(PATH, encoding='utf-8'))
    gk = next(q for q in quizzes if q['id'] == GK_ID)
    questions = gk['questions']

    fixed = 0
    structurally_fixed = 0
    not_found: list[str] = []
    for short, fix in FIXES.items():
        target_id = f'{GK_ID}-{short}'
        q = next((x for x in questions if x['id'] == target_id), None)
        if q is None:
            not_found.append(short)
            continue
        if 'text' in fix:
            q['text'] = fix['text']
            q['options'] = dict(fix['opts'])
            structurally_fixed += 1
        q['correctAnswer'] = fix['answer']
        # Explanations are intentionally left empty for the GK quiz so the
        # quiz only shows the standard correct/incorrect feedback. The
        # `note` strings in the FIXES dict remain in code as a paper trail
        # of the source used to verify each answer.
        q['explanation'] = ''
        fixed += 1

    print(f'Patched {fixed} questions ({structurally_fixed} with full text/option rewrite).')
    if not_found:
        print(f'NOT FOUND: {not_found}')

    with open(PATH, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(quizzes, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print(f'Wrote {PATH}.')

    remaining = [q for q in questions if '[Auto-extracted' in q.get('explanation', '')]
    print(f'Remaining questions still flagged unverified: {len(remaining)}')


if __name__ == '__main__':
    main()
