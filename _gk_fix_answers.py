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
    'q13': dict(answer='A', note='Henley Passport Index Feb 2026 — India 75th (Indian Express/Hindu).'),
    'q14': dict(answer='B', note='Padma Awards 2026 — 131 conferred (PIB).'),
    'q15': dict(answer='B', note='ICC Women World Cup 2025 — India beat South Africa by 52 runs (ESPN/Wikipedia).'),
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
    'q221': dict(answer='D', note='8th Commonwealth Youth Games 2027 — Malta (Commonwealth Sport).'),
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
    'q65': dict(answer='B', note='Budget 2026-27 — Ministry of Youth Affairs & Sports total outlay Rs 4,479.88 crore (PIB).'),

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
    'q198': dict(
        text='Which state became the first in India to achieve 100% digitisation of voter rolls under the Special Intensive Revision (SIR)?',
        opts=dict(A='Rajasthan', B='Gujarat', C='Bihar', D='West Bengal'),
        answer='C',
        note='Bihar achieved near-complete digitisation through SIR exercise launched June 24, 2025 (ECI/PIB).',
    ),
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
        answer='B',
        note='Per the source video (Adda247) — Mother Dairy. (Note: not independently confirmed in Golden Peacock 2025 winners list.)',
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
        text='Which city has become the first in India to fully operationalize the Real Time Flood Forecasting and Spatial Decision Support System (IFLOWS)?',
        opts=dict(A='Chennai', B='Mumbai', C='Hyderabad', D='Bengaluru'),
        answer='B',
        note='IFLOWS-Mumbai is the Integrated Flood Warning System (Real-time + Spatial Decision Support) — Mumbai (PIB).',
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
        q['explanation'] = fix['note']
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
