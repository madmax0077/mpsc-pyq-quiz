export type OptionKey = "A" | "B" | "C" | "D";
export type Language = "english" | "marathi";

export const CATEGORIES = [
  "Indian Polity",
  "History",
  "Geography",
  "Science",
  "Current Affairs",
  "Economics",
  "Aptitude",
  "English",
  "Marathi",
  "Environment",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Question {
  id: string;
  text: string;
  options: Record<OptionKey, string>;
  correctAnswer: OptionKey;
  explanation: string;
  imageUrl?: string;
  category?: Category;
  topicTag?: string;
  sourceTag?: string;
}

export const TOPIC_TAGS: Record<Category, string[]> = {
  History: [
    "ब्रिटिश सत्तेची स्थापना",
    "गव्हर्नर जनरल व व्हाइसरॉय",
    "घटनात्मक विकास : 1773-1858",
    "ब्रिटिशांची आर्थिक धोरणे",
    "घटनात्मक विकास : 1861-1947",
    "जमीन महसूल धोरण",
    "ब्रिटिशांचे राजकीय धोरण",
    "इंग्रजविरोधी असंतोष",
    "1857 चा उठाव व परिणाम",
    "भारतातील शिक्षणाच्या वृद्धी व विकासाचा इतिहास",
    "भारतीय वृत्तपत्राचा इतिहास",
    "सांस्कृतिक जागृती, धार्मिक व सामाजिक सुधारणा",
    "राष्ट्रीय चळवळीची वाढ व विकास",
    "शेतकऱ्यांच्या चळवळी",
    "आदिवासी चळवळी व कामगार चळवळ",
    "काँग्रेसपूर्वी संघटना",
    "काँग्रेस स्थापना व अधिवेशने",
    "मवाळ कालखंड व जहाल कालखंड",
    "बंगालची फाळणी व वंगभंग चळवळ",
    "मुस्लीम लीग",
    "गदर व होमरूल चळवळ",
    "गांधीजींची प्रारंभिक कामगिरी",
    "असहकार चळवळ",
    "स्वराज्य पार्टी",
    "सविनय कायदेभंग चळवळ, गोलमेज परिषदा व पुणे करार",
    "सायमन कमिशन, नेहरू अहवाल व लाहोर अधिवेशन",
    "राष्ट्रीय चळवळ (1939-45)",
    "छोडो भारत चळवळ : 1942",
    "स्वातंत्र्याची प्राप्ती व फाळणी (1945-47)",
    "सशस्त्र क्रांतिकारी चळवळी",
    "आझाद हिंद फौज",
    "भारतातील डाव्या चळवळी",
    "कम्युनिस्ट व सोशॅलिस्ट पार्टी",
    "दुष्काळ आयोग/धोरण व मूल्यमापन",
    "मुस्लीम धर्मांतर्गत सुधारणा",
    "नेहरू युग",
    "राष्ट्रीय पुढारी (रॉय, टिळक, गोखले, नौरोजी, लजपतराय, गांधी, टागोर, विवेकानंद)",
    "स्वातंत्र्योत्तर भारत",
    "भारताचा प्राचीन इतिहास",
    "भारताचा मध्ययुगीन इतिहास",
  ],
  "Indian Polity": [],
  Geography: [],
  Science: [],
  "Current Affairs": [],
  Economics: [],
  Aptitude: [],
  English: [],
  Marathi: [],
  Environment: [],
};

export interface Quiz {
  id: string;
  title: string;
  createdAt: string;
  questions: Question[];
  language?: Language;
  tag?: string;
  topicOnly?: boolean;
}

export type AppMode = "admin" | "student";

export interface ParsedQuestion {
  text: string;
  options: Record<OptionKey, string>;
  imageUrl?: string;
}

export interface Topic {
  id: string;
  name: string;
  description?: string;
  category: Category;
  questionIds: string[];
}
