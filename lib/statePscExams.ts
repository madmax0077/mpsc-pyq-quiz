/**
 * Major State Public Service Commission exams across India.
 * Used for SEO / discovery — PYQ archive on this site remains MPSC-focused;
 * CSAT aptitude practice is transferable to most state prelims.
 */

export type StatePscExam = {
  state: string;
  commission: string;
  shortName: string;
  flagshipExam: string;
  /** Optional common aliases students search for */
  alsoKnownAs?: string;
};

export const STATE_PSC_EXAMS: StatePscExam[] = [
  {
    state: "Andhra Pradesh",
    commission: "Andhra Pradesh Public Service Commission",
    shortName: "APPSC",
    flagshipExam: "APPSC Group I / Group II / Group III",
  },
  {
    state: "Arunachal Pradesh",
    commission: "Arunachal Pradesh Public Service Commission",
    shortName: "APPSC (Arunachal)",
    flagshipExam: "Arunachal Pradesh Civil Services",
  },
  {
    state: "Assam",
    commission: "Assam Public Service Commission",
    shortName: "APSC",
    flagshipExam: "Assam Civil Services (Combined Competitive Exam)",
  },
  {
    state: "Bihar",
    commission: "Bihar Public Service Commission",
    shortName: "BPSC",
    flagshipExam: "BPSC Combined Competitive Examination (CCE)",
  },
  {
    state: "Chhattisgarh",
    commission: "Chhattisgarh Public Service Commission",
    shortName: "CGPSC",
    flagshipExam: "CGPSC State Service Examination",
  },
  {
    state: "Goa",
    commission: "Goa Public Service Commission",
    shortName: "GPSC (Goa)",
    flagshipExam: "Goa Civil Services / Combined exams",
  },
  {
    state: "Gujarat",
    commission: "Gujarat Public Service Commission",
    shortName: "GPSC",
    flagshipExam: "GPSC Class 1 / Class 2 / Class 3",
  },
  {
    state: "Haryana",
    commission: "Haryana Public Service Commission",
    shortName: "HPSC",
    flagshipExam: "Haryana Civil Services (HCS)",
  },
  {
    state: "Himachal Pradesh",
    commission: "Himachal Pradesh Public Service Commission",
    shortName: "HPPSC",
    flagshipExam: "HPAS / Allied Services",
  },
  {
    state: "Jharkhand",
    commission: "Jharkhand Public Service Commission",
    shortName: "JPSC",
    flagshipExam: "JPSC Combined Civil Services",
  },
  {
    state: "Karnataka",
    commission: "Karnataka Public Service Commission",
    shortName: "KPSC",
    flagshipExam: "KAS / Gazetted Probationers / Group A–C",
  },
  {
    state: "Kerala",
    commission: "Kerala Public Service Commission",
    shortName: "Kerala PSC",
    flagshipExam: "Kerala PSC Degree / Degree Level / Various cadres",
    alsoKnownAs: "KPSC Kerala",
  },
  {
    state: "Madhya Pradesh",
    commission: "Madhya Pradesh Public Service Commission",
    shortName: "MPPSC",
    flagshipExam: "MPPSC State Service Examination",
  },
  {
    state: "Maharashtra",
    commission: "Maharashtra Public Service Commission",
    shortName: "MPSC",
    flagshipExam: "Rajyaseva / Group B / Group C / PSI / Combined Pre",
    alsoKnownAs: "राज्यसेवा, Combine",
  },
  {
    state: "Manipur",
    commission: "Manipur Public Service Commission",
    shortName: "MPSC (Manipur)",
    flagshipExam: "Manipur Civil Services Combined Competitive Exam",
  },
  {
    state: "Meghalaya",
    commission: "Meghalaya Public Service Commission",
    shortName: "MPSC (Meghalaya)",
    flagshipExam: "Meghalaya Civil Services",
  },
  {
    state: "Mizoram",
    commission: "Mizoram Public Service Commission",
    shortName: "MPSC (Mizoram)",
    flagshipExam: "Mizoram Civil Services",
  },
  {
    state: "Nagaland",
    commission: "Nagaland Public Service Commission",
    shortName: "NPSC",
    flagshipExam: "Nagaland Civil Services (NCS)",
  },
  {
    state: "Odisha",
    commission: "Odisha Public Service Commission",
    shortName: "OPSC",
    flagshipExam: "OPSC OAS / Combined Competitive Recruitment Exam",
  },
  {
    state: "Punjab",
    commission: "Punjab Public Service Commission",
    shortName: "PPSC",
    flagshipExam: "Punjab Civil Services (PCS)",
  },
  {
    state: "Rajasthan",
    commission: "Rajasthan Public Service Commission",
    shortName: "RPSC",
    flagshipExam: "RAS / RTS / Combined Competitive Exam",
  },
  {
    state: "Sikkim",
    commission: "Sikkim Public Service Commission",
    shortName: "SPSC",
    flagshipExam: "Sikkim Civil Services",
  },
  {
    state: "Tamil Nadu",
    commission: "Tamil Nadu Public Service Commission",
    shortName: "TNPSC",
    flagshipExam: "TNPSC Group I / Group II / Group II-A / Group IV",
  },
  {
    state: "Telangana",
    commission: "Telangana State Public Service Commission",
    shortName: "TSPSC",
    flagshipExam: "TSPSC Group I / Group II / Group III / Group IV",
  },
  {
    state: "Tripura",
    commission: "Tripura Public Service Commission",
    shortName: "TPSC",
    flagshipExam: "Tripura Civil Services / Combined exams",
  },
  {
    state: "Uttar Pradesh",
    commission: "Uttar Pradesh Public Service Commission",
    shortName: "UPPSC",
    flagshipExam: "UPPCS (Provincial Civil Services) / RO-ARO / Combined",
  },
  {
    state: "Uttarakhand",
    commission: "Uttarakhand Public Service Commission",
    shortName: "UKPSC",
    flagshipExam: "UKPSC Combined State Civil / Upper Subordinate Services",
  },
  {
    state: "West Bengal",
    commission: "West Bengal Public Service Commission",
    shortName: "WBPSC",
    flagshipExam: "WBCS (Executive) / Miscellaneous Services",
  },
  // Union Territories / special commissions often searched with state PSCs
  {
    state: "Delhi (NCT)",
    commission: "Union Public Service Commission (for some posts) / DSSSB",
    shortName: "DSSSB / UPSC",
    flagshipExam: "DSSSB teaching & non-teaching / All-India services via UPSC",
    alsoKnownAs: "Delhi SSC",
  },
  {
    state: "Jammu & Kashmir",
    commission: "Jammu and Kashmir Public Service Commission",
    shortName: "JKPSC",
    flagshipExam: "JKAS / Combined Competitive Services",
  },
  {
    state: "All India (Central)",
    commission: "Union Public Service Commission",
    shortName: "UPSC",
    flagshipExam: "Civil Services (IAS/IPS/IFS) Prelims — GS + CSAT",
    alsoKnownAs: "CSE, IAS",
  },
  {
    state: "All India (Staff Selection)",
    commission: "Staff Selection Commission",
    shortName: "SSC",
    flagshipExam: "SSC CGL / CHSL / CPO / GD / MTS",
  },
];
