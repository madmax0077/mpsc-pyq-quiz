"""
Extract & restructure the Vidharbh IAS "Important Schemes" PDF into a clean
Marathi notes JSON for the website's Economics Yojana pack.

The source PDF (`महत्त्वाच्या_योजना_VIDARBH_IAS.pdf`) ships with publisher
branding on every page — VIDARBH IAS ACADEMY name, AMRAVATI city tag,
phone numbers and a {pageN} index. All of those are stripped here so the
final notes read like an independent revision sheet.

Output: `lib/notesData/economicsYojanaContent.json` consumed by both the
React reader and downstream tools.

Run from repo root:
    python scripts/extract_yojana_pdf.py
"""

from __future__ import annotations

import io
import json
import os
import re
from pathlib import Path
from typing import List, Optional

import fitz  # PyMuPDF


REPO_ROOT = Path(__file__).resolve().parent.parent
SOURCE_PDF = Path(os.path.expanduser(
    "~/Downloads/महत्त्वाच्या_योजना_VIDARBH_IAS.pdf"
))
OUT_JSON = REPO_ROOT / "lib" / "notesData" / "economicsYojanaContent.json"
QUIZZES_JSON = REPO_ROOT / "public" / "quizzes.json"

# Topic Wise quiz registration
TOPIC_QUIZ_ID = "topic-yojana-marathi"
TOPIC_NAME = "महत्त्वाच्या योजना (PYQ)"
TOPIC_CATEGORY = "Economics"
TOPIC_LANGUAGE = "marathi"
TOPIC_SOURCE_TAG = "Don't know Academy — Yojana Topic Pack"
TOPIC_TAG_LABEL = "Yojana · महत्त्वाच्या योजना"


# --------------------------------------------------------------------------- #
# Cleaning helpers - strip publisher branding & paginator noise
# --------------------------------------------------------------------------- #
DEVANAGARI = re.compile(r"[\u0900-\u097F]")

NOISE_PATTERNS = [
    re.compile(r"VIDARBH\s*IAS\s*ACADEMY", re.IGNORECASE),
    re.compile(r"AMRAVATI", re.IGNORECASE),
    re.compile(r"MOB\.?\s*NO\.?\s*[0-9\s/]+"),
    re.compile(r"\b9067580048\b"),
    re.compile(r"\b8530370674\b"),
    re.compile(r"\b8668920552\b"),
    re.compile(r"^\s*\{\s*\d+\s*\}\s*$"),                     # {1}, {2} page idx
    re.compile(r"^\s*\{\s*\d+\s*\}\s+MOB"),                    # {N} MOB combo
    re.compile(r"अर्थशास्त्र\s*या\s*विषयातील\s*महत्त्\s*िाच्या\s*योजना"),
    re.compile(r"अर्थशास्त्र\s+या\s+विषयातील\s+महत्त्वाच्या\s+योजना"),
    re.compile(r"^हा\s*कोसय?\s*Purchase\s*करण्यासाठी"),
    re.compile(r"^ही\s*नोट्स\s*Purchase\s*करण्यासाठी"),
    re.compile(r"QR\s*CODE\s*ला\s*Click"),
    re.compile(r"^\s*-+\s*$"),
    re.compile(r"^\s*={2,}\s*PAGE\s+\d+\s*={2,}\s*$"),
]


def is_noise(line: str) -> bool:
    s = line.strip()
    if not s:
        return True
    for rx in NOISE_PATTERNS:
        if rx.search(s):
            return True
    return False


def clean_pdf_to_lines() -> List[str]:
    if not SOURCE_PDF.exists():
        raise SystemExit(f"Source PDF not found: {SOURCE_PDF}")
    doc = fitz.open(SOURCE_PDF)
    lines: List[str] = []
    for page in doc:
        text = page.get_text()
        for raw in text.split("\n"):
            if is_noise(raw):
                continue
            line = raw.strip()
            if not line:
                continue
            lines.append(line)
    doc.close()
    return lines


# --------------------------------------------------------------------------- #
# Yojana scheme parser
# --------------------------------------------------------------------------- #
# A "scheme card" in the body has the visual shape:
#   <scheme-name (1..3 lines)>
#   <start date (1..3 lines)>
#   ▪ <objective bullet 1>
#   ▪ <objective bullet 2>
#   ...
# Date pattern in the source: full Marathi months and Devanagari digits.

DEV_DIGITS = "०१२३४५६७८९"
MONTH_MR = (
    "जानेवारी फेब्रुवारी मार्च एप्रिल मे जून जुलै ऑगस्ट सप्टेंबर "
    "ऑक्टोबर ऑक्टोंबर नोव्हेंबर डिसेंबर एवप्रल".split()
)
MONTH_RX = re.compile("|".join(re.escape(m) for m in MONTH_MR))
DATE_RX = re.compile(
    r"^[०१२३४५६७८९0-9१-९\s]+(?:" + "|".join(re.escape(m) for m in MONTH_MR) +
    r")[०१२३४५६७८९0-9१-९\s]*$"
)
BULLET_GLYPHS = ("▪", "•", "▶", "▶︎", "➢", "❑", "■", "◆")


def starts_with_bullet(s: str) -> bool:
    s = s.lstrip()
    return bool(s) and s[0] in BULLET_GLYPHS


def strip_bullet(s: str) -> str:
    s = s.lstrip()
    while s and s[0] in BULLET_GLYPHS:
        s = s[1:].lstrip()
    return s


def join_continuations(lines: List[str]) -> List[str]:
    """Source PDFs wrap long bullets across multiple short lines. Re-flow
    them so each bullet is one logical paragraph. A line continues the
    previous if (a) it does NOT start with a bullet glyph, (b) it does NOT
    look like a new heading, (c) the previous line has been classified as
    a bullet body."""
    out: List[str] = []
    current: Optional[str] = None
    for ln in lines:
        if starts_with_bullet(ln):
            if current is not None:
                out.append(current.strip())
            current = strip_bullet(ln)
        else:
            # Continuation if we already have an open bullet
            if current is not None:
                current = (current + " " + ln.strip()).strip()
            else:
                out.append(ln.strip())
    if current is not None:
        out.append(current.strip())
    return out


# --------------------------------------------------------------------------- #
# Group / scheme partitioning
# --------------------------------------------------------------------------- #
# We hand-curate the list of major groups (titles taken verbatim from the
# TOC). For each group we anchor the body text by searching for the title
# string so the group contains everything between that anchor and the next
# group's anchor. Sub-schemes inside a group are then detected via the
# "<name>\n<date>\n<bullets>" pattern.
#
# TOC reference (verbatim from source pages 2-3):

# Each `anchor` is a substring that is unique to the BODY chapter heading
# (NOT the TOC line). For multi-line wrapped headings, we use the first
# wrapped line as anchor. The OCR sometimes spells the same word differently
# in TOC vs body (e.g. ि vs व), so anchors below intentionally use the
# body spelling.
GROUPS = [
    {
        "id": "mnrega",
        "title_mr": "महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार हमी योजना (मनरेगा)",
        "title_en": "MGNREGA & predecessors",
        "anchor": "महात्मा गाांधी राष्ट्रीय ग्रामीण रोजगार हमी योजना (मनरेगा)",
    },
    {
        "id": "day-nrlm",
        "title_mr": "दीनदयाल अंत्योदय योजना – राष्ट्रीय ग्रामीण उपजीविका अभियान (DAY-NRLM)",
        "title_en": "DAY-NRLM (rural livelihood)",
        "anchor": "दीनदयाल अांत्योदय योजना राष्ट्रीय ग्रामीण उपजजविका अभियान",
    },
    {
        "id": "day-nulm",
        "title_mr": "दीनदयाल अंत्योदय योजना – राष्ट्रीय शहरी उपजीविका अभियान (DAY-NULM)",
        "title_en": "DAY-NULM (urban livelihood)",
        "anchor": "दीनदयाल अांत्योदय योजना राष्ट्रीय शहरी उपजजविका अभियान",
    },
    {
        "id": "twenty-point",
        "title_mr": "वीस कलमी कार्यक्रम",
        "title_en": "20-Point Programme",
        "anchor": "२० कलमी काययक्रमाचे प्रमुख",
    },
    {
        "id": "pmgsy",
        "title_mr": "प्रधानमंत्री ग्राम सडक योजना (PMGSY)",
        "title_en": "PM Gram Sadak Yojana",
        "anchor": "प्रधानमांत्री ग्राम सडक योजना (PMGSY)",
    },
    {
        "id": "pmjdy",
        "title_mr": "प्रधानमंत्री जन धन योजना (PMJDY)",
        "title_en": "PM Jan Dhan Yojana",
        "anchor": "प्रधानमांत्री जन धन योजना (PMJDY)",
    },
    {
        "id": "social-security",
        "title_mr": "सामाजिक सुरक्षा योजना (APY · PMSBY · PMJJBY · PM-KMY · PM-SMY)",
        "title_en": "Social-Security Schemes (APY, PMSBY, PMJJBY, PM-KMY, PM-SMY)",
        "anchor": "समाजजक सुरक्षा योजना : APY",
    },
    {
        "id": "pmmy",
        "title_mr": "प्रधानमंत्री मुद्रा योजना (PMMY)",
        "title_en": "PM Mudra Yojana",
        "anchor": "प्रधानमांत्री मुद्रा योजना (PMMY)",
    },
    {
        "id": "ayushman-bharat",
        "title_mr": "आयुष्मान भारत योजना",
        "title_en": "Ayushman Bharat Yojana",
        "anchor": "आयुष्यमान िारत योजना",
    },
    {
        "id": "dpap",
        "title_mr": "अवर्षण-प्रवण क्षेत्र कार्यक्रम (DPAP)",
        "title_en": "Drought-Prone Areas Programme",
        "anchor": "अवर्यण - प्रवण क्षेत्र",
    },
    {
        "id": "pmgy",
        "title_mr": "पंतप्रधान ग्रामोदय योजना (PMGY)",
        "title_en": "PM Gramodaya Yojana",
        "anchor": "पांतप्रधान ग्रामोदय योजना",
    },
    {
        "id": "bharat-nirman",
        "title_mr": "भारत निर्माण योजना",
        "title_en": "Bharat Nirman Yojana",
        "anchor": "भारत ननमायण योजना",
    },
    {
        "id": "iay-pmay-r",
        "title_mr": "इंदिरा आवास योजना (IAY) / प्रधानमंत्री आवास योजना – ग्रामीण PMAY(R)",
        "title_en": "PMAY-Rural (Indira Awas Yojana)",
        "anchor": "इांरदरा आवास योजना",
    },
    {
        "id": "pmay-u",
        "title_mr": "प्रधानमंत्री आवास योजना (शहरी) PMAY(U)",
        "title_en": "PMAY-Urban",
        "anchor": "प्रधानमांत्री आवास योजना",
    },
    {
        "id": "sagy",
        "title_mr": "सांसद आदर्श ग्राम योजना (SAGY)",
        "title_en": "Sansad Adarsh Gram Yojana",
        "anchor": "साांसद आदिय ग्राम योजना",
    },
    {
        "id": "pmkvy",
        "title_mr": "प्रधानमंत्री कौशल विकास योजना (PMKVY)",
        "title_en": "PM Kaushal Vikas Yojana",
        "anchor": "प्रधान मांत्री कौिल ववकास",
    },
    {
        "id": "nrum",
        "title_mr": "श्यामा प्रसाद रूरबन अभियान (NRUM)",
        "title_en": "Shyama Prasad Rurban Mission",
        "anchor": "श्यामाप्रसाद रूबयन",
    },
    {
        "id": "pmuy",
        "title_mr": "प्रधानमंत्री उज्ज्वला योजना (PMUY)",
        "title_en": "PM Ujjwala Yojana",
        "anchor": "प्रधानमांत्री उज्ज्वला योजना",
    },
    {
        "id": "rvy",
        "title_mr": "राष्ट्रीय वयोश्री योजना (RVY)",
        "title_en": "Rashtriya Vayoshri Yojana",
        "anchor": "राष्ट्रीय वयोश्री योजना",
    },
    {
        "id": "pm-kisan",
        "title_mr": "प्रधानमंत्री किसान सन्मान निधी योजना (PM-Kisan)",
        "title_en": "PM-Kisan Samman Nidhi",
        "anchor": "प्रधानमांत्री रकसान सन्मान",
    },
    {
        "id": "pmmsy",
        "title_mr": "प्रधानमंत्री मत्स्य संपदा योजना (PMMSY)",
        "title_en": "PM Matsya Sampada Yojana",
        "anchor": "प्रधानमांत्री मत्स्य सांपदा",
    },
    {
        "id": "pm-svanidhi",
        "title_mr": "पीएम स्वनिधी योजना",
        "title_en": "PM SVANidhi Yojana",
        "anchor": "पीएम स्वननधी योजना",
    },
    {
        "id": "swamitva",
        "title_mr": "स्वामित्व योजना",
        "title_en": "SVAMITVA Yojana",
        "anchor": "स्वानमत्व योजना",
    },
    {
        "id": "pm-gati-shakti",
        "title_mr": "पीएम गतीशक्ती योजना",
        "title_en": "PM Gati Shakti Yojana",
        "anchor": "पीएम गतीििी योजना",
    },
    {
        "id": "pm-shri",
        "title_mr": "प्रधानमंत्री स्कूल फॉर रायझिंग इंडिया (PM-SHRI)",
        "title_en": "PM-SHRI Schools",
        "anchor": "प्रधानमांत्री स्कूल्स फॉर",
    },
    {
        "id": "amrit-dharohar",
        "title_mr": "अमृत धरोहर योजना",
        "title_en": "Amrit Dharohar Yojana",
        "anchor": "अमृत धरोहर योजना",
    },
    {
        "id": "mishti",
        "title_mr": "MISHTI योजना",
        "title_en": "MISHTI Yojana",
        "anchor": "MISHTI योजना",
    },
    {
        "id": "lakhpati-didi",
        "title_mr": "लखपती दीदी योजना",
        "title_en": "Lakhpati Didi Yojana",
        "anchor": "लखपती दीदी योजना",
    },
    {
        "id": "pm-vishwakarma",
        "title_mr": "पीएम विश्वकर्मा योजना",
        "title_en": "PM Vishwakarma Yojana",
        "anchor": "पीएम ववश्वकमाय योजना",
    },
]

# Skip past the TOC. After cleaning, the TOC's last entry is around line ~90.
# The first body chapter (MGNREGA) appears around line 106. We start at 92
# to skip every TOC entry but still catch the MGNREGA body header.
BODY_START_LINE = 92


def _find_stats_boundary(lines: List[str]) -> int:
    """Return the line index where the body 'योजनासंबांधी आकडेिारी'
    header appears. Anything past that index does NOT belong to a yojana
    group - it's stats / PYQs / footer."""
    for i in range(BODY_START_LINE, len(lines)):
        ln = lines[i]
        if (
            ("योजनासांबांधी" in ln or "योजनासांबंधी" in ln)
            and ("आकडेिारी" in ln or "आकडेवारी" in ln)
        ):
            return i
    # Fallback: first PYQ
    for i, ln in enumerate(lines):
        if ln.strip().startswith("Q1)"):
            return i
    return len(lines)


def build_groups(lines: List[str]) -> List[dict]:
    """Slice the cleaned line stream by group anchors. Each group keeps the
    flowed bullets of all its sub-schemes (joined into single bullet
    paragraphs). Sub-scheme detection is best-effort: we scan for short
    lines that look like a date and treat the line(s) immediately before
    as a sub-scheme name."""
    stats_boundary = _find_stats_boundary(lines)
    print(f"  stats / PYQ boundary at line {stats_boundary}")

    # Locate anchor indices - search in the BODY only (past the TOC)
    anchors: List[tuple[int, dict]] = []
    misses: List[str] = []
    for g in GROUPS:
        ax = g["anchor"]
        idx = next(
            (i for i in range(BODY_START_LINE, len(lines)) if ax in lines[i]),
            -1,
        )
        if idx >= 0:
            anchors.append((idx, g))
        else:
            misses.append(g["id"])
    if misses:
        print(f"  WARNING: anchors NOT found in body for: {misses}")
    anchors.sort(key=lambda x: x[0])

    out_groups: List[dict] = []
    for i, (start, g) in enumerate(anchors):
        next_anchor = anchors[i + 1][0] if i + 1 < len(anchors) else len(lines)
        # Cap at stats_boundary so the last group doesn't bleed into stats/PYQs
        end = min(next_anchor, stats_boundary)
        if end <= start:
            # Anchor falls inside the stats/PYQ region - rare, but skip
            continue
        slab = lines[start:end]
        # Skip the anchor line itself
        body = slab[1:]
        # Reflow bullets
        flowed = join_continuations(body)
        # Build "raw bullets" model for the renderer. The renderer is
        # forgiving — a list of paragraphs is enough. We keep date-looking
        # short lines marked so the React component can highlight them.
        items: List[dict] = []
        for ln in flowed:
            if not ln:
                continue
            stripped = ln.strip()
            # Drop residual brand/QR/marketing lines that crept into merges
            if (
                "Purchase करण्यासाठी" in stripped
                or "QR CODE" in stripped
                or stripped in ("क", "े", "b")
            ):
                continue
            # Trim any tail that bleeds into the PYQ section ("Q1) २०१४...").
            # The merge step glues lines without bullets, so the last stat
            # of the body sometimes swallows the start of question 1.
            mq = re.search(r"\s*Q\s*\d+\)\s*", stripped)
            if mq:
                stripped = stripped[: mq.start()].rstrip(" ,.;:-")
                if not stripped:
                    continue
            # Drop very short junk lines (1-3 chars)
            if len(stripped) <= 3 and not DEVANAGARI.search(stripped):
                continue
            kind = "para"
            # A pure-date line
            if MONTH_RX.search(stripped) and len(stripped) <= 28:
                kind = "date"
            # A short Devanagari-only line that looks like a sub-scheme
            # name (contains parens, no terminator)
            elif (
                len(stripped) <= 80
                and DEVANAGARI.search(stripped)
                and (
                    "(" in stripped
                    and ")" in stripped
                    and not stripped.endswith((".", "।", ":"))
                )
            ):
                kind = "subhead"
            items.append({"kind": kind, "text": stripped})

        out_groups.append(
            {
                "id": g["id"],
                "titleMr": g["title_mr"],
                "titleEn": g["title_en"],
                "items": items,
            }
        )
    return out_groups


# --------------------------------------------------------------------------- #
# PYQ parser - 62 questions + answer key
# --------------------------------------------------------------------------- #
QUESTION_RX = re.compile(r"^Q\s*(\d{1,3})\)\s*(.+)$")
OPTION_RX = re.compile(r"^([1-4])\)\s*(.+)$")
DEV_TO_ASCII = str.maketrans("०१२३४५६७८९", "0123456789")

# In-question statement labels: अ) ब) क) ड) (Marathi A/B/C/D). Some
# questions also embed match-the-following pairs with (i)/(ii)/(iii)/(iv).
# We split these onto new lines so the question reads cleanly in both
# the notes reader and the Topic Wise quiz.
INLINE_LABEL_RX = re.compile(r"\s+(?=(?:अ|ब|क|ड)\s*\))")
# Trailing tail "पयायी उत्तरे :" (and OCR variants) - the options follow
# in their own UI rows, so the inline tail is redundant.
TRAILING_TAIL_RX = re.compile(
    r"\s*(?:पयायी|पर्यायी|पयाटयी|पयायि)\s*उत्तरे\s*[:.]?\s*$"
)


def format_question_text(q: str) -> str:
    """Normalise a PYQ question. Splits embedded अ)/ब)/क)/ड) statement
    labels onto separate lines and strips the redundant
    'पयायी उत्तरे :' tail. Newlines render via Tailwind's
    `whitespace-pre-line` in both reader and quiz UIs."""
    text = q.strip()
    text = TRAILING_TAIL_RX.sub("", text)
    # Strip "पयायी उत्तरे : अ ब क ड 1) ... 2) ..." trailing segment that
    # appears in match-the-following questions (the option mapping row).
    text = re.sub(
        r"\s*(?:पयायी|पर्यायी|पयाटयी|पयायि)\s*उत्तरे\s*[:.]?\s*(?:अ\s+ब\s+क\s+ड)?.*$",
        "",
        text,
        flags=re.DOTALL,
    )
    # Drop a stray "(र्ट" / "(गट" parenthetical-only tail like "(र्ट अ)"
    # that the OCR sometimes leaves on its own line.
    text = re.sub(r"\s*\(\s*र्ट\s*\)\s*$", "", text)
    # Insert newline before each statement label
    text = INLINE_LABEL_RX.sub("\n", text)
    # Collapse any 3+ blank lines that may result
    text = re.sub(r"\n{2,}", "\n", text)
    return text.strip()


# Manual overrides for questions whose option text could not be parsed
# from the PDF (5-row match-the-following layouts and inline-wrapped
# options). Keys are 1-indexed question numbers as printed in the
# handout. Values are the (q_text, opts, correct, tag) tuples.
MANUAL_OVERRIDES: dict[int, dict] = {
    19: {
        "q": (
            "भारतातील रोजगार निर्मिती कार्यक्रम आणि त्यांच्या प्रारंभ घोषणा "
            "दिनांक-वर्ष खाली दिलेले आहे. योग्य जोड्या लावा.\n"
            "अ)  प्रधानमंत्री ग्राम सडक योजना (PMGSY)\n"
            "ब)  प्रधानमंत्री रोजगार निर्मिती कार्यक्रम (PMEGP)\n"
            "क)  स्वर्णजयंती शहरी रोजगार योजना (SJSRY)\n"
            "ड)  राष्ट्रीय अन्न सुरक्षा योजना (NFSA)\n"
            "(i) १ डिसेंबर १९९७   (ii) ऑगस्ट २०१३   "
            "(iii) २५ डिसेंबर २०००   (iv) १४ ऑगस्ट २००८"
        ),
        "tag": "राज्यसेवा मुख्य २०१९",
        "opts": [
            "अ-iii, ब-iv, क-i, ड-ii",
            "अ-i, ब-iv, क-iii, ड-ii",
            "अ-ii, ब-iv, क-i, ड-iii",
            "अ-iii, ब-i, क-iv, ड-ii",
        ],
        "correct": 0,
    },
    23: {
        "q": (
            "घटनेत नमूद केलेला ‘कामाचा अधिकार’ सर्वप्रथम मिळवून देणारी "
            "भारतातील रोजगार उपक्रम / योजना कोणती?"
        ),
        "tag": "राज्यसेवा मुख्य २०१८",
        "opts": [
            "राष्ट्रीय ग्रामीण रोजगार योजना (NREP)",
            "म. गांधी राष्ट्रीय ग्रामीण रोजगार हमी योजना कायदा (MGNREGA)",
            "महाराष्ट्रातील रोजगार हमी योजना (EGS)",
            "जवाहर रोजगार योजना (JRY)",
        ],
        "correct": 2,
    },
    27: {
        "q": (
            "जोड्या लावा :\n"
            "अ)  प्रधानमंत्री मुद्रा योजना\n"
            "ब)  सौभाग्य योजना\n"
            "क)  प्रधानमंत्री उज्ज्वला योजना\n"
            "ड)  उज्ज्वला डिस्कॉम अशुअरन्स योजना\n"
            "(i) दारिद्र्य रेषेखालील कुटुंबांना एलपीजी जोडणी   "
            "(ii) वीज वितरण कंपन्यांचे आर्थिक आरोग्य सुधारणे   "
            "(iii) सार्वत्रिक घरगुती विद्युतीकरण   "
            "(iv) सूक्ष्म उद्योगांना पुनर्वित्त आणि विकास"
        ),
        "tag": "संयुक्त ‘गट-ब’ पूर्व २०१८",
        "opts": [
            "अ-iii, ब-iv, क-i, ड-ii",
            "अ-i, ब-iv, क-iii, ड-ii",
            "अ-iv, ब-iii, क-i, ड-ii",
            "अ-iii, ब-i, क-iv, ड-ii",
        ],
        "correct": 2,
    },
    28: {
        "q": (
            "खालील जोड्या लावा :\n"
            "अ)  आजीविका उपक्रम सुरू केला\n"
            "ब)  मनरेगाअंतर्गत निवडक २०० सर्वात जास्त मागास तालुक्यांत उपक्रम\n"
            "क)  राष्ट्रीय शहरी उपजीविका मिशन सुरुवात\n"
            "ड)  जवाहरलाल नेहरू राष्ट्रीय शहरी नूतनीकरण मिशनची सुरुवात\n"
            "(i) ३ डिसेंबर, २००५   (ii) २३ सप्टेंबर २०१३   "
            "(iii) २ फेब्रुवारी २००६   (iv) ३ जून २०११"
        ),
        "tag": "STI मुख्य २०१८",
        "opts": [
            "अ-iii, ब-iv, क-i, ड-ii",
            "अ-iv, ब-iii, क-ii, ड-i",
            "अ-ii, ब-iv, क-i, ड-iii",
            "अ-iii, ब-i, क-iv, ड-ii",
        ],
        "correct": 1,
    },
}


def apply_manual_overrides(mcqs: List[dict]) -> None:
    for m in mcqs:
        ov = MANUAL_OVERRIDES.get(m["n"])
        if not ov:
            continue
        m["q"] = ov["q"]
        m["opts"] = list(ov["opts"])
        m["correct"] = ov["correct"]
        if ov.get("tag"):
            m["tag"] = ov["tag"]


def parse_mcqs(lines: List[str]) -> List[dict]:
    # Locate the start of the PYQ section
    pyq_start = -1
    for i, ln in enumerate(lines):
        if ln.startswith("Q1)") or re.match(r"^Q\s*1\)", ln):
            pyq_start = i
            break
    if pyq_start < 0:
        return []

    # Locate the answer key (page after Q62) - first line that says
    # "प्रश्न क्र." followed by tabular pairs.
    ans_start = -1
    for i in range(pyq_start, len(lines)):
        if "प्रश्न क्र" in lines[i]:
            ans_start = i
            break
    if ans_start < 0:
        ans_start = len(lines)

    body = lines[pyq_start:ans_start]
    answers_chunk = lines[ans_start:]

    # Parse answer key first - it appears as alternating Q-num and answer
    # digit (Devanagari). Many "headers" repeat ("प्रश्न क्र.", "उत्तरे").
    answer_map: dict[int, int] = {}
    pending_num: Optional[int] = None
    for ln in answers_chunk:
        s = ln.strip()
        # Skip headers
        if s in ("प्रश्न क्र.", "उत्तरे"):
            continue
        # "1)" or "21)" or "61)" patterns
        m = re.match(r"^(\d+)\)\s*$", s)
        if m:
            pending_num = int(m.group(1))
            continue
        # Single Devanagari digit line as answer
        if pending_num is not None and re.match(r"^[०१२३४५६७८९1-4]\s*$", s):
            try:
                ans = int(s.translate(DEV_TO_ASCII))
                answer_map[pending_num] = ans
            except ValueError:
                pass
            pending_num = None

    # Parse questions
    mcqs: List[dict] = []
    cur_num: Optional[int] = None
    cur_q: List[str] = []
    cur_opts: List[str] = []
    cur_tag: Optional[str] = None
    cur_state = "idle"  # idle | question | options

    def flush():
        if cur_num is None:
            return
        # Pad/truncate options to 4
        opts = (cur_opts + ["—", "—", "—", "—"])[:4]
        ans = answer_map.get(cur_num, 1)
        raw_q = " ".join(s.strip() for s in cur_q if s.strip())
        mcqs.append(
            {
                "n": cur_num,
                "q": format_question_text(raw_q),
                "tag": cur_tag,
                "opts": opts,
                "correct": max(0, min(3, ans - 1)),
            }
        )

    for raw in body:
        s = raw.strip()
        m_q = QUESTION_RX.match(s)
        m_o = OPTION_RX.match(s)
        if m_q:
            flush()
            cur_num = int(m_q.group(1))
            rest = m_q.group(2).strip()
            # Tag in trailing parens often: "(राज्यसेवा मुख्य २०१७)"
            tag_m = re.search(r"\(([^()]{3,40})\)\s*$", rest)
            cur_tag = tag_m.group(1).strip() if tag_m else None
            if tag_m:
                rest = rest[: tag_m.start()].strip()
            cur_q = [rest] if rest else []
            cur_opts = []
            cur_state = "question"
            continue
        if m_o:
            cur_state = "options"
            cur_opts.append(m_o.group(2).strip())
            continue
        if cur_state == "question":
            cur_q.append(s)
        elif cur_state == "options" and cur_opts:
            # continuation of last option
            cur_opts[-1] = (cur_opts[-1] + " " + s).strip()
    flush()

    return mcqs


# --------------------------------------------------------------------------- #
# Stats / facts section
# --------------------------------------------------------------------------- #
def parse_stats(lines: List[str]) -> List[str]:
    """Pick up only the body version of the 'Important Yojana Statistics
    (December 2023)' section. The body header is 'योजनासांबांधी
    महत्त्वाची आकडेिारी (डडसेंबर २०२३ पयंत)' (around line 1572). The
    section ends at the first PYQ (Q1)."""
    start = -1
    for i in range(BODY_START_LINE, len(lines)):
        ln = lines[i]
        if (
            ("योजनासांबांधी" in ln or "योजनासांबंधी" in ln)
            and ("आकडेिारी" in ln or "आकडेवारी" in ln)
        ):
            start = i
            break
    if start < 0:
        return []
    end = next(
        (i for i, ln in enumerate(lines[start + 1:], start + 1)
         if ln.strip().startswith("Q1)")),
        len(lines),
    )
    chunk = lines[start + 1: end]
    flowed = [s for s in join_continuations(chunk) if s.strip()]
    # Drop tiny garbage lines (single chars left over from OCR layout)
    return [s for s in flowed if len(s) >= 12 and DEVANAGARI.search(s)]


# --------------------------------------------------------------------------- #
# Main
# --------------------------------------------------------------------------- #
def main() -> None:
    print(f"Reading {SOURCE_PDF}")
    lines = clean_pdf_to_lines()
    print(f"  {len(lines)} cleaned lines")

    groups = build_groups(lines)
    print(f"  {len(groups)} yojana groups parsed")
    for g in groups:
        print(f"    [{g['id']:<22}] {len(g['items'])} items")

    stats = parse_stats(lines)
    print(f"  {len(stats)} fact lines")

    mcqs = parse_mcqs(lines)
    apply_manual_overrides(mcqs)
    print(f"  {len(mcqs)} MCQs parsed (with {len(MANUAL_OVERRIDES)} manual overrides applied)")
    if mcqs:
        print(f"    answer key resolved for {sum(1 for m in mcqs if m['correct'] is not None)} / {len(mcqs)}")

    out = {
        "totalGroups": len(groups),
        "totalMcqs": len(mcqs),
        "publishedBy": "Don't know Academy",
        "groups": groups,
        "stats": stats,
        "mcqs": mcqs,
    }

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    with io.open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print(f"Wrote {OUT_JSON}")

    # ---- Patch public/quizzes.json with the Yojana Topic Wise quiz ----
    if QUIZZES_JSON.exists() and mcqs:
        from datetime import datetime, timezone

        OPTION_KEYS = ["A", "B", "C", "D"]
        questions = [
            {
                "id": f"{TOPIC_QUIZ_ID}-q{m['n']}",
                "text": m["q"],
                "options": {
                    "A": m["opts"][0],
                    "B": m["opts"][1],
                    "C": m["opts"][2],
                    "D": m["opts"][3],
                },
                "correctAnswer": OPTION_KEYS[m["correct"]],
                "explanation": (
                    f"Original exam: {m['tag']}." if m["tag"] else ""
                ),
                "category": TOPIC_CATEGORY,
                "topic": TOPIC_NAME,
                "sourceTag": TOPIC_SOURCE_TAG,
            }
            for m in mcqs
        ]
        new_quiz = {
            "id": TOPIC_QUIZ_ID,
            "title": TOPIC_NAME,
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "questions": questions,
            "language": TOPIC_LANGUAGE,
            "topicOnly": True,
            "tag": TOPIC_TAG_LABEL,
        }
        with io.open(QUIZZES_JSON, "r", encoding="utf-8") as f:
            quizzes = json.load(f)
        before = len(quizzes)
        quizzes = [q for q in quizzes if q.get("id") != TOPIC_QUIZ_ID]
        quizzes.append(new_quiz)
        with io.open(QUIZZES_JSON, "w", encoding="utf-8") as f:
            json.dump(quizzes, f, ensure_ascii=False, indent=2)
        print(
            f"Patched {QUIZZES_JSON.name}: {before} -> {len(quizzes)} quizzes "
            f"(topic '{TOPIC_NAME}', {len(questions)} MCQs)"
        )


if __name__ == "__main__":
    main()
