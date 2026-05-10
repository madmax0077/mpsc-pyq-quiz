"""
Extract & restructure the Santosh Chavan "Modern Maharashtra History" PDF
(`महाराष्ट्र इतिहास.pdf`) into a clean Marathi notes JSON for the website.

The source PDF ships with publisher branding on every page (author tagline,
Telegram channel, contact number, "[Year]" header, repeated chapter banner).
All of that is stripped here so the final notes read like an independent
revision sheet for MPSC / Rajyaseva.

Output: `lib/notesData/mhHistoryContent.json` consumed by the React reader.

Run from repo root:
    python scripts/extract_mh_history_pdf.py
"""
from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path

import fitz  # PyMuPDF

REPO_ROOT = Path(__file__).resolve().parent.parent
SOURCE_PDF = Path(os.path.expanduser("~/Downloads/महाराष्ट्र इतिहास (1).pdf"))
OUT_JSON = REPO_ROOT / "lib" / "notesData" / "mhHistoryContent.json"

# --------------------------------------------------------------------------- #
# Chapter boundaries — mapped from the PDF's table-of-contents structure.
# Each chapter covers a contiguous page range. The reader groups content per
# chapter and renders bullets / paragraphs / sub-headings detected inside.
# --------------------------------------------------------------------------- #
CHAPTERS: list[dict] = [
    {
        "id": "elphinstone",
        "icon": "🏛️",
        "accent": "from-amber-600 via-orange-600 to-red-600",
        "titleMr": "माऊंट स्टुअर्ट एल्फिन्स्टन",
        "titleEn": "Mountstuart Elphinstone & Maharashtra",
        "subtitleMr": "महाराष्ट्राच्या जडणघडणीत योगदान",
        "tip": "वसईचा तह (१८०२), तिसरे इंग्रज-मराठा युद्ध, मुलकी / न्यायिक / शैक्षणिक सुधारणा.",
        "pageStart": 2,
        "pageEnd": 7,
    },
    {
        "id": "missionaries",
        "icon": "✝️",
        "accent": "from-indigo-600 via-violet-600 to-fuchsia-600",
        "titleMr": "महाराष्ट्रातील प्रबोधन चळवळ",
        "titleEn": "Christian Missionaries in India",
        "subtitleMr": "ख्रिस्ती मिशनऱ्यांचे आगमन व कार्य",
        "tip": "१८१३ चा चार्टर, विल्यम केरी, डेव्हिड हिअर, अमेरिकन मराठी मिशन (अहमदनगर).",
        "pageStart": 8,
        "pageEnd": 12,
    },
    {
        "id": "social-religious-reforms",
        "icon": "🪷",
        "accent": "from-rose-600 via-pink-600 to-fuchsia-600",
        "titleMr": "सामाजिक व धार्मिक सुधारणा चळवळ",
        "titleEn": "Social & Religious Reform Movements",
        "subtitleMr": "मानव धर्म समाज, परमहंस मंडळी, प्रार्थना समाज, आर्य समाज, सार्वजनिक सभा",
        "tip": "मानव धर्म समाज (१८४४), परमहंस सभा (१८४९), प्रार्थना समाज (१८६७), आर्य समाज (१८७५).",
        "pageStart": 13,
        "pageEnd": 22,
    },
    {
        "id": "newspapers",
        "icon": "📰",
        "accent": "from-orange-600 via-red-600 to-rose-600",
        "titleMr": "मराठी वृत्तपत्रांचा इतिहास",
        "titleEn": "History of Marathi Newspapers",
        "subtitleMr": "दर्पण ते प्रबुद्ध भारत",
        "tip": "दर्पण (१८३२), प्रभाकर, ज्ञानोदय, केसरी, मराठा, सुधारक, मूकनायक, बहिष्कृत भारत.",
        "pageStart": 23,
        "pageEnd": 27,
    },
    {
        "id": "reformers",
        "icon": "👥",
        "accent": "from-emerald-600 via-teal-600 to-cyan-600",
        "titleMr": "महाराष्ट्रातील प्रमुख समाज सुधारक",
        "titleEn": "Major Social Reformers of Maharashtra",
        "subtitleMr": "जगन्नाथ शंकरशेठ ते विष्णुशास्त्री पंडित",
        "tip": "जगन्नाथ शंकरशेठ, बाळशास्त्री जांभेकर, दादोबा पांडुरंग, लोकहितवादी, भाऊ दाजी लाड, विष्णुशास्त्री पंडित.",
        "pageStart": 28,
        "pageEnd": 50,
    },
    {
        "id": "revolt-1857",
        "icon": "⚔️",
        "accent": "from-red-700 via-rose-700 to-pink-700",
        "titleMr": "१८५७ चा उठाव",
        "titleEn": "The 1857 Revolt — India's First War of Independence",
        "subtitleMr": "भारतीय स्वातंत्र्यसमर व महाराष्ट्राचे योगदान",
        "tip": "बहादूरशाह जफर, मंगल पांडे, तात्या टोपे, झाशीची राणी; महाराष्ट्रातील क्रांतिकारी.",
        "pageStart": 51,
        "pageEnd": 60,
    },
    {
        "id": "phule",
        "icon": "🌸",
        "accent": "from-blue-600 via-sky-600 to-cyan-600",
        "titleMr": "महात्मा जोतिराव फुले व सत्यशोधक समाज",
        "titleEn": "Mahatma Phule & Satyashodhak Samaj",
        "subtitleMr": "स्त्री-शिक्षण, अस्पृश्योद्धार, शेतकरी चळवळ",
        "tip": "१८४८ — पहिली मुलींची शाळा; १८७३ — सत्यशोधक समाज; गुलामगिरी, शेतकऱ्याचा आसूड.",
        "pageStart": 61,
        "pageEnd": 68,
    },
    {
        "id": "early-revolutionaries",
        "icon": "🔥",
        "accent": "from-yellow-600 via-amber-600 to-orange-600",
        "titleMr": "महाराष्ट्रातील आद्य क्रांतिकारक",
        "titleEn": "Early Revolutionaries of Maharashtra",
        "subtitleMr": "उमाजी नाईक, राघोजी भांगरे, वासुदेव बळवंत फडके",
        "tip": "खंडोबा प्रसन्न, महादेव कोळी विद्रोह, रामोशी संघटन, भारताचा आद्य क्रांतिकारक.",
        "pageStart": 69,
        "pageEnd": 74,
    },
    {
        "id": "revolutionary-movement",
        "icon": "🗡️",
        "accent": "from-red-600 via-orange-700 to-amber-700",
        "titleMr": "महाराष्ट्रातील क्रांतिकारी चळवळ",
        "titleEn": "Revolutionary Movement in Maharashtra",
        "subtitleMr": "चापेकर बंधू, सावरकर, मित्रमेळा, अभिनव भारत",
        "tip": "रँडची हत्या, मित्रमेळा (१९००), अभिनव भारत, गुप्त संघटनांचे जाळे.",
        "pageStart": 75,
        "pageEnd": 81,
    },
    {
        "id": "pre-ambedkar-dalit",
        "icon": "🕊️",
        "accent": "from-sky-600 via-blue-700 to-indigo-700",
        "titleMr": "डॉ. बाबासाहेब आंबेडकर पूर्व दलित चळवळ",
        "titleEn": "Pre-Ambedkar Dalit Movement",
        "subtitleMr": "गोपाळ बाबा वलंगकर, किसन फागुजी बंदसोडे, गवळी बंधू",
        "tip": "अनार्य दोष परिहार मंडळी, सोमवंशीय मित्र, महार बटालियन पुनर्गठन मागणी.",
        "pageStart": 82,
        "pageEnd": 88,
    },
    {
        "id": "gandhi-movements",
        "icon": "🇮🇳",
        "accent": "from-green-700 via-emerald-700 to-teal-700",
        "titleMr": "गांधी युगातील चळवळी व महाराष्ट्र",
        "titleEn": "Gandhi-era Movements in Maharashtra",
        "subtitleMr": "असहकार, सत्याग्रह, सविनय कायदेभंग, चले जाव",
        "tip": "नागपूर अधिवेशन (१९२०), मुळशी / झेंडा / हिरडा / मावळ सत्याग्रह, १९४२ चलेजाव.",
        "pageStart": 89,
        "pageEnd": 102,
    },
    {
        "id": "marathwada",
        "icon": "🏰",
        "accent": "from-purple-700 via-violet-700 to-fuchsia-700",
        "titleMr": "मराठवाडा मुक्ती संग्राम",
        "titleEn": "Marathwada Liberation Struggle",
        "subtitleMr": "हैद्राबाद संस्थानातून मुक्ती व महाराष्ट्राचे योगदान",
        "tip": "स्वामी रामानंद तीर्थ, ऑपरेशन पोलो, १७ सप्टेंबर १९४८ — मुक्ती दिन.",
        "pageStart": 103,
        "pageEnd": 107,
    },
    {
        "id": "samyukta-maharashtra",
        "icon": "🚩",
        "accent": "from-orange-600 via-amber-600 to-yellow-600",
        "titleMr": "संयुक्त महाराष्ट्र चळवळ",
        "titleEn": "Samyukta Maharashtra Movement",
        "subtitleMr": "महाराष्ट्र राज्याची निर्मिती (१ मे १९६०)",
        "tip": "अकोला करार (१९४७), नागपूर करार, फाजल अली कमिशन, १०५ हुतात्मे, मुंबईसह संयुक्त महाराष्ट्र.",
        "pageStart": 108,
        "pageEnd": 117,
    },
]

# --------------------------------------------------------------------------- #
# Noise patterns — anything matching any of these is dropped before parsing.
# --------------------------------------------------------------------------- #
NOISE_PATTERNS = [
    re.compile(r"telegram", re.IGNORECASE),
    re.compile(r"@history(by)?santosh\w*", re.IGNORECASE),
    re.compile(r"historybysantoshchavan", re.IGNORECASE),
    re.compile(r"^cont\b", re.IGNORECASE),
    re.compile(r"\bcont\s*[:.]?\s*9?8?22\s*92\s*60?66", re.IGNORECASE),
    re.compile(r"\bcont\s*[:.]?\s*९?८?२२\s*९२\s*६०?६६"),
    re.compile(r"\b9822\s*92\s*6066\b"),
    re.compile(r"\b९८२२\s*९२\s*६०?६६\b"),
    re.compile(r"\b9822926066\b"),
    re.compile(r"\bSantosh\s+Chavan\b", re.IGNORECASE),
    re.compile(r"संिोष\s*चव्हाण"),
    re.compile(r"संतोष\s*चव्हाि"),
    re.compile(r"संतोष\s*चव्हाण"),
    re.compile(r"^\s*\[\s*Year\s*\]\s*$", re.IGNORECASE),
    re.compile(r"NET\s*/\s*SET", re.IGNORECASE),
    re.compile(r"^\s*By\s+Santosh\s+Chavan\s*$", re.IGNORECASE),
    re.compile(r"^Thank\s+you\s+very\s+much", re.IGNORECASE),
    re.compile(r"^\s*={2,}\s*PAGE\s+\d+\s*={2,}\s*$", re.IGNORECASE),
    re.compile(r"^\s*-{3,}\s*$"),
]

# Repeated chapter banner lines that appear at the top of every page in a section.
# We keep one occurrence at the chapter start and drop the rest.
BANNER_LINES = {
    "महाराष्ट्रातील प्रबोधन चळवळ",
    "महाराष्ट्रािील प्मुख समाज सुधारक",
    "महाराष्ट्रातील प्रमुख समाज सुधारक",
}


def is_noise(line: str) -> bool:
    s = line.strip()
    if not s:
        return True
    for rx in NOISE_PATTERNS:
        if rx.search(s):
            return True
    return False


# --------------------------------------------------------------------------- #
# Light, conservative OCR fix-ups — only safe, high-confidence substitutions.
# We do NOT try to perfectly normalize the publisher's non-Unicode font; we
# just clean the most jarring spelling artefacts so the page reads naturally.
# --------------------------------------------------------------------------- #
WORD_FIXES: dict[str, str] = {
    # Author / publication noise that survives the regex pass
    "एम. ए. इनिहास": "",
    "एम. ए. इजतहास": "",
    "एम. ए. इतिहास": "",
    # Common book / proper-noun fixes (high-confidence)
    "इनिहास": "इतिहास",
    "इजतहास": "इतिहास",
    "महाराष्ट्रािील": "महाराष्ट्रातील",
    "महाराष्ट्रािी": "महाराष्ट्राती",
    "एनफिन्सस्टिट": "एल्फिन्स्टन",
    "एनफिस्टंट": "एल्फिन्स्टन",
    "एनफिस्टंटिे": "एल्फिन्स्टनने",
    "एनफिन्सस्टिटिे": "एल्फिन्स्टनने",
    "एनफिस्टंटची": "एल्फिन्स्टनची",
    "एनफिस्टंटच्या": "एल्फिन्स्टनच्या",
    "एनफिस्टंटला": "एल्फिन्स्टनला",
    "एनफिन्सस्टि": "एल्फिन्स्टन",
    "जन्सम": "जन्म",
    "निधि": "निधन",
    "नशक्षण": "शिक्षण",
    "नशक्षक": "शिक्षक",
    "नशक्षणाचा": "शिक्षणाचा",
    "नशक्षणाची": "शिक्षणाची",
    "नशक्षणाला": "शिक्षणाला",
    "नशक्षणासाठी": "शिक्षणासाठी",
    "नशक्षणाि": "शिक्षणात",
    "मुनस्लम": "मुस्लिम",
    "मुनस्लमांच्या": "मुस्लिमांच्या",
    "मुनस्लमांसाठी": "मुस्लिमांसाठी",
    "मुनस्लमनवरुद्ध": "मुस्लिमविरुद्ध",
    "नवष्ट्णु": "विष्णु",
    "नवष्ट्णुशास्त्री": "विष्णुशास्त्री",
    "नवष्ट्णुशास्त्रींिी": "विष्णुशास्त्रींनी",
    "िोजतराव": "जोतिराव",
    "िुले": "फुले",
    "िोनिराव": "जोतिराव",
    "िोनिबा": "जोतिबा",
    "रािडे": "रानडे",
    "रािड": "रानडे",
    "नटळक": "टिळक",
    "नटळकांिी": "टिळकांनी",
    "नटळकांच्या": "टिळकांच्या",
    "नटळकांवर": "टिळकांवर",
    "वासुदेव बळवंि िडके": "वासुदेव बळवंत फडके",
    "िडके": "फडके",
    "बाबासाहेब आंबेडकर": "बाबासाहेब आंबेडकर",
    "िौरोजी": "नौरोजी",
    "नचपळूणकर": "चिपळूणकर",
    "जांभेकर": "जांभेकर",
    "महात्मा गांधी": "महात्मा गांधी",
    "गोखले": "गोखले",
    # Dates / verb forms that recur
    "रोजी": "रोजी",
    "होिा": "होता",
    "होिी": "होती",
    "होिे": "होते",
    "केली": "केली",
    "केले": "केले",
    "केला": "केला",
    "केफया": "केल्या",
    "ििे": "ज्याने",
    "त्यांिी": "त्यांनी",
    "त्यांच्या": "त्यांच्या",
    "त्यांिा": "त्यांना",
    "नियुक्ती": "नियुक्ती",
    "स्थापिा": "स्थापना",
    "स्थानिक": "स्थानिक",
    "महसूल": "महसूल",
    "नशक्षण": "शिक्षण",
    "नवद्यार्थयाां": "विद्यार्थ्यां",
    "नवद्यार्थयाटिा": "विद्यार्थ्यांना",
    "नवद्यार्थयाांिी": "विद्यार्थ्यांनी",
    "नियिकानलक": "नियतकालिक",
    "मानसक": "मासिक",
    "सानहत्य": "साहित्य",
    "नविंिी": "विनंती",
    "स्त्रीयांिा": "स्त्रियांना",
    "नस्त्रयांिा": "स्त्रियांना",
    "नस्त्रयांिी": "स्त्रियांनी",
    "नस्त्रयांची": "स्त्रियांची",
    "नस्त्रयांचे": "स्त्रियांचे",
    "नस्त्रयांच्या": "स्त्रियांच्या",
    "नस्त्रया": "स्त्रिया",
    "नवधवा": "विधवा",
    "नववाह": "विवाह",
    "नववाहाचा": "विवाहाचा",
    "नववाहास": "विवाहास",
    "नववाहावर": "विवाहावर",
    "नववाहाचे": "विवाहाचे",
    "पुिनवटवाह": "पुनर्विवाह",
    "पुिनवटवाहाचा": "पुनर्विवाहाचा",
    "पुिनवटवाहाचे": "पुनर्विवाहाचे",
    "िसेच": "तसेच",
    "त्यानशवाय": "त्याशिवाय",
    "यानशवाय": "याशिवाय",
    "म्हणिाि": "म्हणतात",
    "म्हणिो": "म्हणतो",
    "म्हणिे": "म्हणते",
    "नदले": "दिले",
    "नदला": "दिला",
    "नदली": "दिली",
    "नदले": "दिले",
    "िाव": "नाव",
    "िाव:": "नाव:",
    "िावाची": "नावाची",
    "िावाचा": "नावाचा",
    "िावाचे": "नावाचे",
    "िावािे": "नावाने",
    "स्वि:": "स्वतः",
    "स्वि:ची": "स्वतःची",
    "स्वि:चा": "स्वतःचा",
    "स्वि:चे": "स्वतःचे",
    "नवद्यापीठ": "विद्यापीठ",
    "नवद्यापीठाची": "विद्यापीठाची",
    "नवद्यापीठाच्या": "विद्यापीठाच्या",
    "महानवद्यालय": "महाविद्यालय",
    "महानवद्यालयाि": "महाविद्यालयात",
    "महानवद्यालयाच्या": "महाविद्यालयाच्या",
    "नियुक्त": "नियुक्त",
    "नवशेष": "विशेष",
    "नवचार": "विचार",
    "नवचारवंि": "विचारवंत",
    "नवचाराचे": "विचाराचे",
    "नवचारांचा": "विचारांचा",
    "नवचारांचे": "विचारांचे",
    "महाराष्ट्रािील": "महाराष्ट्रातील",
    "मुंबईिील": "मुंबईतील",
    "मुंबईि": "मुंबईत",
    "पुण्यािील": "पुण्यातील",
    "पुण्याि": "पुण्यात",
    "गुजरािी": "गुजराती",
    "गुजरािमधे": "गुजरातमधे",
    "गुजरािमधील": "गुजरातमधील",
    "गुजराि": "गुजरात",
    "नशक्षणपद्धि": "शिक्षणपद्धत",
    "िायद्यािुसार": "कायद्यानुसार",
    "कायद्यािुसार": "कायद्यानुसार",
    "कायद्यािे": "कायद्याने",
    "नदवाणी": "दिवाणी",
    "िौजदारी": "फौजदारी",
    "नियुक्त": "नियुक्त",
    "नचत्र": "चित्र",
    "वृत्तपत्रािूि": "वृत्तपत्रातून",
    "वृत्तपत्रांचा": "वृत्तपत्रांचा",
    "वृत्तपत्रांचे": "वृत्तपत्रांचे",
    "वृत्तपत्रांची": "वृत्तपत्रांची",
    "वृत्तपत्रािे": "वृत्तपत्राने",
    "वृत्तपत्राची": "वृत्तपत्राची",
    "वृत्तपत्राचा": "वृत्तपत्राचा",
    "वृत्तपत्राचे": "वृत्तपत्राचे",
    "वृत्तपत्र": "वृत्तपत्र",
    "िोकरी": "नोकरी",
    "िोकरीि": "नोकरीत",
    "िोकरीला": "नोकरीला",
    "नवद्या": "विद्या",
    "नवद्येचा": "विद्येचा",
    "नवद्येि": "विद्येत",
    "नवद्येची": "विद्येची",
    "नवद्येचे": "विद्येचे",
    "नवद्येला": "विद्येला",
    "नचमणराव": "चिमणराव",
    "नचमणाजी": "चिमणाजी",
    "अध्यक्षिेखाली": "अध्यक्षतेखाली",
    "नियिकानलके": "नियतकालिके",
    "नवषयािी": "विषयाही",
    "नवषयािून": "विषयातून",
    "नवषयाि": "विषयात",
    "नवषयांिा": "विषयांना",
    "नवषयांवर": "विषयांवर",
    "नवषयांचा": "विषयांचा",
    "नवषयांचे": "विषयांचे",
    "नवषय": "विषय",
    "नवद्वाि": "विद्वान",
    "नवद्वािांकडूि": "विद्वानांकडून",
    "नटकेला": "टीकेला",
    "नटका": "टीका",
    "नटकाटी": "टीकाटी",
    "नविांिी": "विनंती",
}

# Sort by length descending so longer keys are replaced before shorter substrings
WORD_FIX_ITEMS = sorted(WORD_FIXES.items(), key=lambda x: -len(x[0]))


def fix_text(text: str) -> str:
    if not text:
        return text
    # Drop zero-width chars
    text = re.sub(r"[\u200B-\u200D\uFEFF]", "", text)
    # Word-level substitutions (longest-first)
    for k, v in WORD_FIX_ITEMS:
        if k and k in text:
            text = text.replace(k, v)
    # Collapse double spaces
    text = re.sub(r"[ \t]{2,}", " ", text)
    return text


# --------------------------------------------------------------------------- #
# Per-page line cleaning & block detection
# --------------------------------------------------------------------------- #
BULLET_RX = re.compile(r"^[•●▪◦∙∘·]\s*")
NUM_BULLET_RX = re.compile(r"^[(\[]?\s*([0-9]{1,2}|[०-९]{1,2})\s*[)\].]\s+")
INFO_PREFIX_RX = re.compile(r"^(जन्म|जन्सम|निधन|निधि|जि\u094dम)\s*[:：]")
SUBHEAD_KEYWORDS = (
    "सुधारणा", "कार्य", "काये", "सभा", "मंडळी", "समाज", "चळवळ",
    "सत्याग्रह", "उठाव", "विद्रोह", "कोश", "कमिशन", "ग्रंथसंपदा",
    "शिकवण", "तत्त्वज्ञान", "तत्वज्ञान", "नशकवण",
    "विचार", "नवचार", "ग्रंथ", "अधिवेशन", "अनधवेशि",
    "करार", "ठराव", "बखर", "धोरण",
)


def line_is_subhead(s: str, prev_was_blank: bool) -> bool:
    """A line is treated as a sub-heading when:
    - it is short (<= 60 chars),
    - has no terminal punctuation,
    - contains no commas/colons (except when we know it's a labelled subhead),
    - and contains a known subhead keyword OR is a centered title."""
    if len(s) > 70:
        return False
    if any(c in s for c in (".", ":", "?", ";")):
        return False
    if "," in s:
        return False
    if s.endswith(("ही", "त्या", "ते", "होते")):  # likely sentence
        return False
    if any(k in s for k in SUBHEAD_KEYWORDS):
        return True
    return False


def parse_chapter_text(lines: list[str]) -> list[dict]:
    """Convert a flat list of cleaned lines into typed blocks:
    info | subhead | bullet | para

    Strategy: PDFs hard-wrap every visual line, so a single bullet or
    paragraph spans many input lines. We track the *current* block and
    keep appending continuation lines to it until we hit a structural
    boundary (blank line, new bullet, info row, or detected sub-head).
    """
    blocks: list[dict] = []
    cur: dict | None = None  # current accumulating block

    def flush():
        nonlocal cur
        if cur is not None:
            text = re.sub(r"\s+", " ", cur["text"]).strip()
            if text:
                cur["text"] = text
                blocks.append(cur)
            cur = None

    for raw in lines:
        s = raw.strip()
        if not s:
            # blank line → paragraph / bullet boundary
            flush()
            continue

        # Birth/death info line — always its own block
        if INFO_PREFIX_RX.search(s):
            flush()
            blocks.append({"kind": "info", "text": s})
            continue

        # Sub-heading: short, no terminal punctuation, contains a known keyword.
        # We honour it whenever the heuristic matches — even mid-flow — because
        # the source PDF often does NOT put a blank line before a sub-head.
        if line_is_subhead(s, prev_was_blank=(cur is None)):
            flush()
            blocks.append({"kind": "subhead", "text": s})
            continue

        # Bullet (• or numbered). Always starts a new block.
        if BULLET_RX.match(s):
            flush()
            text = BULLET_RX.sub("", s).strip()
            cur = {"kind": "bullet", "text": text}
            continue
        if NUM_BULLET_RX.match(s) and len(s) < 200:
            flush()
            text = NUM_BULLET_RX.sub("", s).strip()
            cur = {"kind": "bullet", "text": text}
            continue

        # Continuation line — append to current block, or start a paragraph
        if cur is None:
            cur = {"kind": "para", "text": s}
        else:
            cur["text"] += " " + s

    flush()
    return blocks


# --------------------------------------------------------------------------- #
# Main extraction
# --------------------------------------------------------------------------- #
def extract() -> dict:
    sys.stdout.reconfigure(encoding="utf-8")
    if not SOURCE_PDF.exists():
        raise FileNotFoundError(f"PDF not found at {SOURCE_PDF}")

    doc = fitz.open(SOURCE_PDF)
    raw_pages: list[str] = []
    for i in range(doc.page_count):
        raw_pages.append(doc[i].get_text())
    doc.close()

    out_chapters: list[dict] = []

    for ch in CHAPTERS:
        chapter_lines: list[str] = []
        seen_banner = False
        for pno in range(ch["pageStart"], ch["pageEnd"] + 1):
            if pno > len(raw_pages):
                break
            text = raw_pages[pno - 1]
            for raw_line in text.split("\n"):
                line = raw_line.rstrip()
                if is_noise(line):
                    continue
                stripped = line.strip()
                # Drop repeated centered chapter banner inside the same chapter
                if stripped in BANNER_LINES:
                    if seen_banner:
                        continue
                    seen_banner = True
                    continue
                # Drop dangling stray dashes / single chars
                if len(stripped) <= 1 and stripped not in ("•",):
                    continue
                chapter_lines.append(line)

        # Apply OCR fix-ups on the whole text for this chapter
        joined = "\n".join(chapter_lines)
        joined = fix_text(joined)
        cleaned_lines = joined.split("\n")
        blocks = parse_chapter_text(cleaned_lines)

        out_chapters.append({
            "id": ch["id"],
            "icon": ch["icon"],
            "accent": ch["accent"],
            "titleMr": ch["titleMr"],
            "titleEn": ch["titleEn"],
            "subtitleMr": ch["subtitleMr"],
            "tip": ch["tip"],
            "pageStart": ch["pageStart"],
            "pageEnd": ch["pageEnd"],
            "blocks": blocks,
        })

    total_blocks = sum(len(c["blocks"]) for c in out_chapters)

    out = {
        "title_mr": "आधुनिक महाराष्ट्राचा इतिहास",
        "title_en": "Modern Maharashtra History",
        "subtitle_mr": "MPSC · Rajyaseva · UPSC साठी संपूर्ण मराठी नोट्स",
        "totalPages": len(raw_pages),
        "totalChapters": len(out_chapters),
        "totalBlocks": total_blocks,
        "chapters": out_chapters,
    }
    return out


def main() -> None:
    data = extract()
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(
        json.dumps(data, ensure_ascii=False, indent=1),
        encoding="utf-8",
    )
    print(f"Wrote {OUT_JSON}")
    print(f"  chapters: {data['totalChapters']}")
    print(f"  blocks:   {data['totalBlocks']}")
    print(f"  pages:    {data['totalPages']}")


if __name__ == "__main__":
    main()
