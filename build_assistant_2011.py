#!/usr/bin/env python3
"""
Generate English and Marathi quiz JSON for MPSC Assistant Preliminary 2011 (Set A).

All 150 bilingual question rows live in this file as `BANK` (see `R(...)` helper below).

Run from mcq-quiz-app-live: python build_assistant_2011.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

def R(
    category: str,
    en_text: str,
    en_opts: tuple[str, str, str, str],
    mr_text: str,
    mr_opts: tuple[str, str, str, str],
) -> dict:
    return {
        "category": category,
        "en": {"text": en_text, "options": list(en_opts)},
        "mr": {"text": mr_text, "options": list(mr_opts)},
    }


BANK = [
    R(
        "Aptitude",
        "The radius of a cone is decreased by 20% and the height is increased by 50%. The change in the volume of the cone is",
        ("4% decrease", "4% increase", "20% increase", "20% decrease"),
        "एका शंकूची त्रिज्या 20% ने कमी केली व उंची 50% ने वाढविली. तर त्याच्या आकारमानात होणारा बदल",
        ("4% घट", "4% वाढ", "20% वाढ", "20% घट"),
    ),
    R(
        "Aptitude",
        "For A.P. √2, √8, √18, √32 ... S₁₀ = ...",
        ("55√2", "5√2", "20", "10√2"),
        "√2, √8, √18, √32 ... या अंकगणिती श्रेणीकरिता S₁₀ = ...",
        ("55√2", "5√2", "20", "10√2"),
    ),
    R(
        "Aptitude",
        "In a three-digit number, the sum of the digits at hundreds place and units place is 1 less than the digit at the tens place. The number is 17 times the sum of the three digits. If 198 is added to the original number, the order of the digits is reversed. Then what is the original number?",
        ("351", "153", "135", "151"),
        "एका तीन अंकी संख्येतील शतम स्थानाचा अंक व एकम स्थानाचा अंक यांची बेरीज ही दहम स्थानाच्या अंकापेक्षा 1 ने कमी आहे. ती संख्या अंकाच्या बेरजेच्या 17 पट आहे. त्या संख्येत 198 मिळविले असता संख्येतील अंकाचे क्रम उलट होतात. तर ती मूळ संख्या कोणती?",
        ("351", "153", "135", "151"),
    ),
    R(
        "Aptitude",
        "A certain loan was repaid in two equal and annual instalments of ₹ 4704 each. If the rate of compound interest was 12%, then the sum borrowed was",
        ("₹ 7500", "₹ 8500", "₹ 7000", "₹ 7950"),
        "कर्ज घेतलेल्या एका रकमेची दोन समान वार्षिक हप्त्यात परत फेड केली. प्रत्येक हप्ता ₹ 4704 होता. जर चक्रवाढ व्याजाचा दर 12% असेल तर कर्ज घेतलेली रक्कम =",
        ("₹ 7500", "₹ 8500", "₹ 7000", "₹ 7950"),
    ),
    R(
        "Aptitude",
        "The price of an item is ₹ 5000. If there is 12% discount on it, the price of that item would be",
        ("₹ 4400", "₹ 4880", "₹ 4940", "₹ 4988"),
        "एका वस्तूची किंमत ₹ 5000 आहे. जर त्यावस्तूवर 12% सूट मिळाल्यास त्या वस्तूची किंमत ________ होईल.",
        ("₹ 4400", "₹ 4880", "₹ 4940", "₹ 4988"),
    ),
    R(
        "Aptitude",
        "2/3 of the members of a committee are women. 1/4 of the men in the committee are married. If the number of bachelor men in the committee is 9, then the total number of members of the committee is",
        ("48", "27", "36", "42"),
        "एका समितीतील 2/3 सदस्य स्त्रिया आहेत. पुरूष सदस्यांपैकी 1/4 विवाहित आहेत. पुरूषांपैकी 9 अविवाहित आहेत. तर त्या समितीतील सदस्यांची एकूण संख्या",
        ("48", "27", "36", "42"),
    ),
    R(
        "Aptitude",
        "A machine in a soft drink factory fills 840 bottles in 6 hours. How many bottles will it fill in 5 hours?",
        ("840", "800", "740", "700"),
        "एका साधेपेय कारखान्यात एक यंत्र 840 बॉटल 6 तासात भरते. 5 तासात ते यंत्र किती बॉटल भरेल?",
        ("840", "800", "740", "700"),
    ),
    R(
        "Aptitude",
        "A set of chairs is available for ₹ 2000 cash or for ₹ 1200 cash down payment and ₹ 860 to be paid after six months in one instalment. The rate of interest charged under the instalment scheme is ________ p.a.",
        ("10%", "12%", "12.5%", "15%"),
        "खुर्च्यांचा एक संच रोखीने ₹ 2000 ला मिळतो. किंवा हप्ता योजनेत ₹ 1200 सुरुवातीचा हप्ता भरून ₹ 860 सहा महिन्यानंतर एका हप्त्यांत भरावे लागतात. तर हप्त्याने घेण्याच्या व्यवहारातील व्याज आकारणीचा दर प्र.व. ________ असेल.",
        ("10%", "12%", "12.5%", "15%"),
    ),
    R(
        "Aptitude",
        "Find the value of (69842 × 69842 − 30158 × 30158) / (69842 − 30158)",
        ("69842", "36684", "30158", "100000"),
        "(69842 × 69842 − 30158 × 30158) / (69842 − 30158) ची किंमत किती?",
        ("69842", "36684", "30158", "100000"),
    ),
    R(
        "Aptitude",
        "Surface area of a sphere is 314 cm². Then the volume of the sphere is ________ cm³.",
        ("520", "521", "523⅓", "522⅓"),
        "एका गोलाचे वक्रपृष्ठफळ 314 सेमी² आहे. तर त्या गोलाचे घनफळ ________ सेमी³.",
        ("520", "521", "523⅓", "522⅓"),
    ),
    R(
        "Aptitude",
        "How many sides does a regular polygon have if the measure of an exterior angle is 45°?",
        ("4", "5", "6", "8"),
        "जर एका नियमीत बहुकोनाचे बाहेरील कोनाचे माप 45° असल्यास त्या बहुकोनाला किती बाजू असतील?",
        ("4", "5", "6", "8"),
    ),
    R(
        "Aptitude",
        "If we solve correctly (20 − 5 × 2 + 3 − 18 ÷ 9) then we get the answer",
        ("15/9", "46/9", "11", "31"),
        "जर आपण (20 − 5 × 2 + 3 − 18 ÷ 9) ला बरोबर सोडवू तर आपल्याला ________ हे उत्तर मिळते.",
        ("15/9", "46/9", "11", "31"),
    ),
    R(
        "Aptitude",
        "The square root of 7/5 − (4/25)√24 is",
        ("√8 − √3", "(2/5)√8 − √3", "(2/5)√8 − (1/5)√3", "(1/5)√8 − (2/5)√3"),
        "7/5 − (4/25)√24 याचे वर्गमूळ ________ आहे.",
        ("√8 − √3", "(2/5)√8 − √3", "(2/5)√8 − (1/5)√3", "(1/5)√8 − (2/5)√3"),
    ),
    R(
        "Aptitude",
        "If a three-digit number 24x is divisible by 9, what is the value of x?",
        ("8", "7", "5", "3"),
        "जर 24x या तीन अंकीसंख्येत 9 ने पूर्ण भाग जात असल्यास, x ची किंमत किती?",
        ("8", "7", "5", "3"),
    ),
    R(
        "Aptitude",
        "Simplify: √2.25 × √0.4",
        ("1", "0.3", "2", "2/3"),
        "सरळरूप द्या: √2.25 × √0.4",
        ("1", "0.3", "2", "2/3"),
    ),
    R(
        "Aptitude",
        "How much less is the sum of odd numbers between 51 to 70, from the sum of even numbers between the same?",
        ("9", "10", "11", "12"),
        "51 ते 70 संख्ये पर्यंत येणाऱ्या विषम संख्यांची बेरीज त्याच दरम्यान येणाऱ्या सम संख्यांच्या बेरजेपेक्षा कितीने कमी आहे?",
        ("9", "10", "11", "12"),
    ),
    R(
        "Aptitude",
        "If a > 0, b > 0 and c > 0, then a + 1/(b + 1/c) = ...",
        ("(a + b)/(bc + 1)", "(abc + a + c)/(bc + 1)", "(abc + bc + 1)/(bc + 1)", "(abc + b + c)/(bc + 1)"),
        "जर a > 0, b > 0 आणि c > 0 तर a + 1/(b + 1/c) = ...",
        ("(a + b)/(bc + 1)", "(abc + a + c)/(bc + 1)", "(abc + bc + 1)/(bc + 1)", "(abc + b + c)/(bc + 1)"),
    ),
    R(
        "Aptitude",
        "Ram bought a cupboard for ₹ 3300 including tax of 10%. Find the original price of the cupboard before tax was added.",
        ("₹ 2970", "₹ 3000", "₹ 3033", "₹ 3267"),
        "राम ने एक आलमारी 10% करासहील ₹ 3300 ला विकत घेतली. त्या आलमारीची कर लावण्यापूर्वीची किंमत किती?",
        ("₹ 2970", "₹ 3000", "₹ 3033", "₹ 3267"),
    ),
    R(
        "Aptitude",
        "√−4 is not a surd because ________. Which of the following reasons is incorrect?",
        (
            "it is not a root of a rational number",
            "its square is not a positive number",
            "it is not a real number",
            "it is not an irrational number",
        ),
        "√−4 ही संख्या करणी नाही. कारण ________ त्याचे खालीलपैकी कोणते कारण असत्य आहे?",
        (
            "ती संख्या परिमेय संख्येचे वर्गमूळ नाही",
            "तिचा वर्ग धन संख्या नाही",
            "ती वास्तव संख्या नाही",
            "ती अपरिमेय संख्या नाही",
        ),
    ),
    R(
        "Aptitude",
        "A football team won 10 matches out of the total number of matches they played. If their win percentage was 40, then how many matches did they play in all?",
        ("20", "25", "30", "40"),
        "एका फुटबॉल संघाने त्यांनी पूर्ण खेळलेल्या स्पर्धांपैकी 10 स्पर्धा जिंकल्या जर त्यांचा जिंकण्याचा शेकडा दर 40 होता तर ते एकूण किती स्पर्धा खेळले?",
        ("20", "25", "30", "40"),
    ),
    R(
        "Science",
        "If a 60 W electric bulb is lighted for 6 hours, how much electrical energy is consumed?",
        ("10 units", "360 units", "0.36 unit", "0.1 unit"),
        "60 W शक्तीचा एक बल्ब 6 तास वापरला तर किती विद्युत ऊर्जा वापरली जाईल?",
        ("10 units", "360 units", "0.36 unit", "0.1 unit"),
    ),
    R(
        "Science",
        "A radioactive substance has a half life of 4 hours. What fraction of the original substance will decay after 3 half lives?",
        ("1/8", "7/8", "1/4", "3/4"),
        "एका किरणोत्सारी पदार्थाचा अर्धआयुष्य काळ 4 तास आहे. तर 3 अर्धआयुष्य कालावधीनंतर त्याच्या किती हिस्स्याचा ह्रास होईल?",
        ("1/8", "7/8", "1/4", "3/4"),
    ),
    R(
        "Science",
        "Power bill of solar energy per year at the rate of ₹ 5 per unit will be ₹ ________",
        ("85 × 10¹⁷", "35 × 10¹⁷", "10¹⁷", "12 × 10¹⁷"),
        "प्रत्येक युनिटला ₹ 5 दराने सौरशक्तीचे एका वर्षाचे बिल ₹ ________ होईल.",
        ("85 × 10¹⁷", "35 × 10¹⁷", "10¹⁷", "12 × 10¹⁷"),
    ),
    R(
        "Science",
        "The electric potential difference (V) between the two points in a conductor is expressed by",
        (
            "V = Work done (W) / Charge (Q)",
            "V = Work done (W) / Time (t)",
            "V = Charge (Q) / Time (t)",
            "V = Charge (Q) / Work done (W)",
        ),
        "वाहकातील दोन बिंदुमधील विद्युत विभवांतर (V) ________ या द्वारे व्यक्त केला जातो.",
        (
            "V = कार्य (W) / प्रभार (Q)",
            "V = कार्य (W) / काळ (t)",
            "V = प्रभार (Q) / काळ (t)",
            "V = प्रभार (Q) / कार्य (W)",
        ),
    ),
    R(
        "Science",
        "A rubber ball filled with water is having a small hole at the bottom. If this ball is used as the bob of a simple pendulum, then the time period of such a pendulum will ________ as the ball oscillates.",
        ("decrease", "first decrease and then increase", "first increase and then decrease", "increase"),
        "एका पाण्याने भरलेल्या रबरी चेंडूच्या तळाशी छोटे छिद्र आहे. जर हा चेंडू साधा दोलक करण्यासाठी वापरला तर चेंडू दोलने घेत असताना दोलकाचा दोलन काल",
        ("कमी होतो", "प्रथम कमी होतो व नंतर वाढतो", "प्रथम वाढतो व नंतर कमी होतो", "वाढतो"),
    ),
    R(
        "Science",
        "Two thin lenses of focal length +4 m and −2 m are placed in contact. What is the focal length of the combined lens?",
        ("−4 m", "+2 m", "+4 m", "−2 m"),
        "+4 m आणि −2 m नाभीय अंतरे असलेले दोन पातळ भिंगे एकमेकांना स्पर्श करून ठेवली. तर त्यांच्या संयोगी भिंगाचे नाभीय अंतर किती?",
        ("−4 m", "+2 m", "+4 m", "−2 m"),
    ),
    R(
        "Science",
        "Which of the following chemicals is used as a cooling agent in air-conditioners?",
        ("Carbon tetrachloride", "Methane", "Chloroform", "Freon"),
        "वातानुकूलित यंत्रात प्रशीतक म्हणून खालीलपैकी काय वापरतात?",
        ("कार्बन टेट्राक्लोराईड", "मिथेन", "क्लोरोफॉर्म", "फ्रेऑन"),
    ),
    R(
        "Science",
        "If the pH value of a solution is 7, then the solution is",
        ("acidic", "basic", "alkaline", "neutral"),
        "एखाद्या द्रावणाचा pH जर 7 असल्यास. ते द्रावण ________ असते.",
        ("आम्लधर्मी", "आम्लारिधर्मी", "अल्कलाईन", "उदासीन"),
    ),
    R(
        "Science",
        "The order of penetration power of α, β and γ rays through a metal sheet is ________.",
        ("γ > β > α", "α > β > γ", "β > α > γ", "α > γ > β"),
        "α, β, γ या किरणांच्या धातूच्या पत्र्यातून आरपार जाण्याच्या क्षमतेनुसार क्रमसंबंध ओळखा.",
        ("γ > β > α", "α > β > γ", "β > α > γ", "α > γ > β"),
    ),
    R(
        "Science",
        "On moderate heating, which of the following compounds gives off oxygen?",
        ("Cupric oxide", "Mercuric oxide", "Zinc oxide", "Aluminium oxide"),
        "मध्यम तापमानावर खालीलपैकी कोणते संयुग तापविले असता ऑक्सिजन बाहेर टाकला जातो?",
        ("क्युप्रिक ऑक्साइड", "मर्क्युरिक ऑक्साइड", "झिंक ऑक्साइड", "ॲल्युमिनिअम ऑक्साइड"),
    ),
    R(
        "Science",
        "The temperature at which air becomes saturated with water vapour is called",
        ("freezing point", "melting point", "dew point", "boiling point"),
        "ज्या तापमानास हवा बाष्पाने संतृप्त होते, त्या तापमानास ________ म्हणतात.",
        ("गोठण बिंदू", "द्रवणांक", "दवबिंदू", "उत्कलनांक"),
    ),
    R(
        "Science",
        "From which of the following is methane gas produced?",
        ("Wheat field", "Paddy field", "Cotton field", "Groundnut field"),
        "खालीलपैकी कोणत्या क्षेत्रामधून मिथेन वायूची निर्मिती होते?",
        ("गव्हाचे शेत", "भाताचे शेत", "कापसाचे शेत", "भुईमुगाचे शेत"),
    ),
    R(
        "Science",
        "Human goitre is related to",
        (
            "iodine deficiency in the diet",
            "overactivity of the thyroid",
            "accelerated uptake of I₂ from the blood",
            "All of the above",
        ),
        "मानवी गलगंड ________ याच्याशी संबंधित आहे.",
        (
            "अन्नातील आयोडिनची कमतरता",
            "अवटू ग्रंथीचे जास्त वेगाने कार्य होणे",
            "रक्तामधील आयोडिनचे (I₂) अतिवेगाने शोषण होणे",
            "वरील सर्व",
        ),
    ),
    R(
        "Science",
        "Insulin doses are available today at low costs because",
        (
            "GM bacteria produce it",
            "Bacterial food used here is inexpensive",
            "Process of fermentation is very fast",
            "Fermentation vessels can be used for several years",
        ),
        "सध्या इन्सुलिन हे औषध कमी किमतीत मिळते आहे. त्याचे कारण म्हणजे",
        (
            "जनुकीय परिवर्तित जीवाणू ते तयार करतात",
            "येथे जीवाणूंना दिले जाणारे अन्न अतिशय स्वस्त आहे",
            "किण्वनाची प्रक्रिया अतिशय वेगवान असते",
            "किण्वन करण्याची जी संयंत्रे वापरली जातात ती वर्षानुवर्षे टिकतात",
        ),
    ),
    R(
        "Science",
        "'Broca Index' is concerned with calibration of general health in humans. It is obtained by subtraction of",
        (
            "weight in kg and height in metres",
            "height in cm and 100",
            "height in metres and weight in kg",
            "weight in kg and height in cm",
        ),
        "मानवाच्या सर्वसाधारण आरोग्याविषयी संबंधित 'ब्रोका निर्देशक' खालीलपैकी कोणाच्या वजाबाकीने मिळतो?",
        (
            "कि. ग्रॅम मधील वजन आणि मीटर मधील उंची",
            "सेमी. मधील उंची आणि 100",
            "मीटर मधील उंची आणि कि. ग्रॅम मधील वजन",
            "कि. ग्रॅम मधील वजन आणि सेमी. मधील उंची",
        ),
    ),
    R(
        "Science",
        "While preparing liquors, _________ is not added.",
        ("glucose", "fructose", "yeast", "None of the above"),
        "मादक पेये तयार करण्यासाठी ________ वापरले जात नाही.",
        ("ग्लुकोज", "फ्रुक्टोज", "ईस्ट", "यापैकी कोणतेही नाही"),
    ),
    R(
        "Science",
        "Who requires highest amount of proteins in his/her diet?",
        (
            "An adolescent between 12 to 18 years of age",
            "A pregnant woman",
            "A farm worker",
            "A scientist",
        ),
        "पुढीलपैकी कोणास अन्नामधून जास्तीत जास्त प्रथिने घेण्याची गरज असेल?",
        (
            "12 ते 18 वर्षे वयोगटातील बयात येणारी व्यक्ती",
            "गरोदर स्त्री",
            "शेतावर काम करणारी व्यक्ती",
            "शास्त्रज्ञ",
        ),
    ),
    R(
        "Science",
        "Fats are shown at the apex of food pyramid because fats",
        (
            "are easily absorbed in our cell",
            "perform several functions in a cell",
            "are easily oxidised",
            "are never stored in our body",
        ),
        "मेद हे अन्नशंकूच्या टोकास दाखविले जातात कारण",
        (
            "मेद हा आपल्या पेशीमध्ये सहजरित्या शोषले जातात",
            "मेद आपल्या पेशीमध्ये अनेक प्रकारची कार्ये करतात",
            "मेदांचे ऑक्सिडीकरण सहजरित्या होते",
            "मेद आपल्या पेशीमध्ये कधीही साठविले जात नाहीत",
        ),
    ),
    R(
        "Science",
        "The process of continuous progressive improvement of the health status of a population is called",
        ("public health", "health development", "personal hygiene", "community hygiene"),
        "मानवी आरोग्याच्या स्थितीमध्ये सतत प्रगतिशील सुधारणा होण्याच्या क्रियेस ________ म्हणतात.",
        ("सामाजिक आरोग्य", "आरोग्य विकास", "वैयक्तिक आरोग्यशास्त्र", "सामाजिक आरोग्यशास्त्र"),
    ),
    R(
        "Science",
        "Which of the following is an inherited disease?",
        ("Hypertension", "Diabetes", "Leprosy", "Both (1) and (2) above"),
        "पुढीलपैकी कोणता रोग वंशागत आहे?",
        ("उच्चरक्तदाब", "मधुमेह", "कुष्ठरोग", "वरीलपैकी (1) व (2) दोन्ही"),
    ),
    R(
        "History",
        "Which was the main objective of Indians during and after the revolt of 1857 A.D.?",
        ("To uproot the British", "To co-operate with the British", "To oppose the British", "None of the above"),
        "इ.स. 1857 च्या उठावाच्या दरम्यान आणि नंतर भारतीयांचे मुख्य उद्दिष्ट कोणते होते?",
        ("इंग्रजांना समूळ नष्ट करणे", "इंग्रजांना सहकार्य करणे", "इंग्रजांना विरोध करणे", "वरीलपैकी कोणतेही नाही"),
    ),
    R(
        "History",
        "Bhil Unrest took place at",
        ("Pune", "Khandesh", "Mumbai", "Konkan"),
        "भिल्लांचा उठाव ________ येथे झाला.",
        ("पुणे", "खानदेश", "मुंबई", "कोंकण"),
    ),
    R(
        "History",
        "Who annexed many Indian Princely States between 1848 and 1856 A.D.?",
        ("Lord Ripon", "Lord William Bentinck", "Lord Cornwallis", "Lord Dalhousie"),
        "इ.स. 1848 ते 1856 या काळात अनेक संस्थाने कोणी खालसा केली?",
        ("लॉर्ड रिपन", "लॉर्ड विल्यम बेंटिक", "लॉर्ड कॉर्नवॉलिस", "लॉर्ड डलहौसी"),
    ),
    R(
        "History",
        "Who issued an order to fire at the unarmed innocent crowd gathered for a meeting at Jallianwalla Bagh?",
        ("General Dyer", "O'Dwyer", "Chelmsford", "Curzon"),
        "जलियांवाला बागेतील निरपराधी निःशस्त्र जनतेवर गोळीबार करण्याचे आदेश कोणी दिले?",
        ("जनरल डायर", "ओ'ड्वायर", "चेम्सफर्ड", "कर्झन"),
    ),
    R(
        "History",
        "The agreement made between Dr. Ambedkar and Mahatma Gandhi in the year 1932 A.D. is",
        ("Communal Award", "Poona Pact", "An outline regarding the upliftment of untouchables", "None of the above"),
        "इ.स. 1932 मध्ये डॉ. आंबेडकर आणि महात्मा गांधी यांच्यात झालेला करार",
        ("जातीय निवाडा", "पुणे करार", "अस्पृश्योद्धार संबंधीची रूपरेषा", "वरीलपैकी कोणतेही नाही"),
    ),
    R(
        "History",
        "Who was the founder of 'Bharat Sevak Samaj'?",
        ("Dadabhai Naoroji", "Gopal Krishna Gokhale", "Mahatma Gandhi", "Bipin Chandra Pal"),
        "'भारत सेवक समाज' या संस्थेचे संस्थापक कोण होते?",
        ("दादाभाई नौरोजी", "गोपाळ कृष्ण गोखले", "महात्मा गांधी", "बिपिन चंद्र पाल"),
    ),
    R(
        "History",
        "In September 1916, 'Home Rule League' was founded by",
        ("Indulal Yagnik", "George Arundale", "Annie Besant", "Gopal Krishna Gokhale"),
        "सप्टेंबर 1916 मध्ये, 'होमरूळ लीग' ची स्थापना ________ यांनी केली.",
        ("इंदुलाल याज्ञिक", "जॉर्ज अरूंडेल", "ॲनी बेझंट", "गोपाळ कृष्ण गोखले"),
    ),
    R(
        "History",
        "In Maharashtra, the farmers revolted against zamindars and the money-lenders in",
        ("1860", "1873", "1875", "1905"),
        "महाराष्ट्रात ________ साली शेतकऱ्यांनी जमीनदार आणि सावकार यांच्याविरुद्ध उठाव केला.",
        ("1860", "1873", "1875", "1905"),
    ),
    R(
        "History",
        "In which country was the Home Rule movement first started?",
        ("South Africa", "Ireland", "Netherlands", "India"),
        "होमरूल चळवळ प्रथम कोणत्या देशात सुरू झाली होती?",
        ("दक्षिण आफ्रिका", "आयर्लंड", "नेदरलँड", "भारत"),
    ),
    R(
        "History",
        "After the arrest of Mahatma Gandhi, who led the Satyagraha at Dharasana in Gujarat?",
        ("Shrikrishna Sarada", "Mallappa Dhanshetty", "Qurban Hussain", "Sarojini Naidu"),
        "महात्मा गांधीच्या अटकेनंतर गुजरातमधील धारासण येथील सत्याग्रहाचे नेतृत्व कोणी केले?",
        ("श्रीकृष्ण सारडा", "मल्लाप्पा धनशेट्टी", "कुर्बान हुसेन", "सरोजिनी नायडू"),
    ),
    R(
        "History",
        "Which Act declared the separate electorates for Muslims?",
        ("1813", "1909", "1919", "1935"),
        "कोणत्या कायद्याने मुस्लिमांसाठी विभक्त मतदारसंघ निर्माण करण्यात आले?",
        ("1813", "1909", "1919", "1935"),
    ),
    R(
        "History",
        "The farmers and the East India Company came in direct contact in the _________ system of revenue.",
        ("Rayatwari", "Mahalwari", "Permanent Settlement", "Talukadari"),
        "शेतकरी व ईस्ट इंडिया कंपनी यांचा ________ या महसूल पद्धतीत प्रत्यक्ष संबंध येत असे.",
        ("रयतवारी", "महालवारी", "कायमधारा", "तालुकादारी"),
    ),
    R(
        "History",
        "Which cities were connected by Grand Trunk Road?",
        ("Delhi to Mumbai", "Delhi to Kolkata", "Pune to Mumbai", "Nashik to Surat"),
        "ग्रँड ट्रंक मार्ग कोणत्या शहरांना जोडला जातो?",
        ("दिल्ली ते मुंबई", "दिल्ली ते कोलकाता", "पुणे ते मुंबई", "नाशिक ते सुरत"),
    ),
    R(
        "History",
        "Dr. Babasaheb Ambedkar spread his message through the journals like 'Janata Patra' and ________.",
        ("'Mook Nayak'", "'Sudharak'", "'Vartaman Deepika'", "'Vicharlahari'"),
        "डॉ. बाबासाहेब आंबेडकर ह्यांनी आपल्या विचारांच्या प्रसारासाठी 'जनता पत्र' व ________ ह्या वृत्तपत्रांचा वापर केला.",
        ("'मूक नायक'", "'सुधारक'", "'वर्तमान दीपिका'", "'विचारलहरी'"),
    ),
    R(
        "History",
        "To remove casteism and untouchability, ________ formed 'Samata Manch' in 1944 A.D.",
        ("Gopal Krishna Gokhale", "Annie Besant", "Maharshi Dhondo Keshav Karve", "Justice Ranade"),
        "जातीभेद व अस्पृश्यता निवारणासाठी ________ यांनी इ.स. 1944 मध्ये 'समता मंच' स्थापन केला.",
        ("गोपाळ कृष्ण गोखले", "ॲनी बेझंट", "महर्षी धोंडो केशव कर्वे", "न्यायमूर्ती रानडे"),
    ),
    R(
        "History",
        "What is the ancestral name of Rajarshi Shahu Maharaj's dynasty?",
        ("Nimbalkar", "Bhonsle", "Ghatge", "Pawar"),
        "राजर्षी शाहू महाराजांचे मूळ घराणे कोणते?",
        ("निंबाळकर", "भोंसले", "घाटगे", "पवार"),
    ),
    R(
        "History",
        "In 1875, the 'Arya Samaj' was established by",
        ("Swami Vivekananda", "Swami Dayanand Saraswati", "Ramkrishna Paramahansa", "Raja Rammohan Roy"),
        "1875 साली आर्य समाजाची स्थापना ________ यांनी केली.",
        ("स्वामी विवेकानंद", "स्वामी दयानंद सरस्वती", "रामकृष्ण परमहंस", "राजा राममोहन रॉय"),
    ),
    R(
        "History",
        "At Pune, Mahatma Phule started first school for girls in the year",
        ("1848", "1851", "1873", "1883"),
        "पुणे येथे इ.स. ________ मध्ये महात्मा फुले यांनी मुलींची पहिली शाळा काढली.",
        ("1848", "1851", "1873", "1883"),
    ),
    R(
        "History",
        "Mahatma Jyotiba Phule founded Satyashodhak Samaj in 1873 for",
        (
            "Religious movement",
            "Revolt against British Government",
            "Emancipation of common man from Brahmanical tyranny",
            "Political activities",
        ),
        "सन् 1873 मध्ये महात्मा ज्योतीबा फुले यांनी सत्यशोधक समाजाची स्थापना. ________ साठी केली.",
        (
            "धार्मिक चळवळीसाठी",
            "इंग्रज सरकारविरुद्ध बंड करण्यासाठी",
            "ब्राह्मणी वृत्तीच्या जुलमातून सामान्य माणसाच्या मुक्तीसाठी",
            "राजकीय घडामोडींसाठी",
        ),
    ),
    R(
        "History",
        "The book 'Gulamgiri' was written by",
        ("Mahatma Gandhi", "Mahatma Jyotiba Phule", "Dr. Babasaheb Ambedkar", "Narayan Guru"),
        "'गुलामगिरी' हे पुस्तक ________ यांनी लिहिली.",
        ("महात्मा गांधी", "महात्मा ज्योतीबा फुले", "डॉ. बाबासाहेब आंबेडकर", "नारायण गुरु"),
    ),
    R(
        "History",
        "Construction of Dams for Irrigation, Modernization of Agriculture, Animal Husbandry, Introduction of Horticulture and Conservation of Forests — these modern concepts were first visualized by",
        ("Justice M.G. Ranade", "Mahatma Jyotiba Phule", "Maharaja Sayajirao Gaekwad", "Lokmanya Tilak"),
        "पाणी पुरवठयासाठी, धरवाची उभारणी, रीतीचे आधुनिकीकरण, जातीवंत जनावरांची पैदास, फलोद्यान शास्त्र व संरक्षण या विषयाबाबतच्या दूरदर्शी संकल्पना प्रथम ________ यांनी मांडल्या.",
        ("न्यायमूर्ती म.गो. रानडे", "महात्मा ज्योतीबा फुले", "महाराजा सयाजीराव गायकवाड", "लोकमान्य टिळक"),
    ),
    R(
        "History",
        '"I shall speak apt and do whatever possible only." Who said this?',
        ("Lokmanya Tilak", "Gopal Krishna Gokhale", "Gopal Ganesh Agarkar", "Justice Ranade"),
        '"इष्ट भसेल ते बोलणार आणि साध्य असेल ते करणार." हे खालीलपैकी कोणाचे श्रीद्वाक्य आहे?',
        ("लोकमान्य टिळक", "गोपाळ कृष्ण गोखले", "गोपाळ गणेश आगरकर", "न्यायमूर्ती रानडे"),
    ),
    R(
        "History",
        "A newspaper 'Sudharak' was started by",
        ("Gopal Ganesh Agarkar", "Gopal Hari Deshmukh", "Bal Gangadhar Tilak", "Dr. Panjabrao Deshmukh"),
        "________ यांनी 'सुधारक' वृत्तपत्र सुरू केले.",
        ("गोपाळ गणेश आगरकर", "गोपाळ हरी देशमुख", "बाळ गंगाधर टिळक", "डॉ. पंजाबराव देशमुख"),
    ),
    R(
        "History",
        '________ said that "Without social development political movement has no use."',
        ("R.G. Bhandarkar", "G.K. Gokhale", "D.K. Karve", "G.G. Agarkar"),
        "________ म्हणाले कि, \"सामाजिक सुधारणे शिवाय राजकीय चळवळ निरुपयोगी आहे.\"",
        ("आर.जी. भांडारकर", "जी.के. गोखले", "डी.के. कर्वे", "जी.जी. आगरकर"),
    ),
    R(
        "History",
        "Gopal Ganesh Agarkar was born in the village ________ near Karad.",
        ("Tembhu", "Shekhali", "Dapoli", "Khed"),
        "गोपाळ गणेश आगरकर यांचा जन्म कऱ्हाडजवळ ________ या गावी झाला.",
        ("टेंभू", "शेखली", "दापोळी", "खेड"),
    ),
    R(
        "History",
        "Chhatrapati Shahu was known as a",
        ("Lokancha Raja", "Prajecha Raja", "Maharaja", "Bahujan Samaj Dalitancha Raja"),
        "छत्रपती शाहू ________ या नावाने ओळखले जात असे.",
        ("लोकांचा राजा", "प्रजेचा राजा", "महाराजा", "बहुजन समाज व दलितांचा राजा"),
    ),
    R(
        "History",
        "________ issued an order abolishing the 'Mahar vatan'.",
        ("British Government", "Panjabrao Deshmukh", "Krishnarao Bhalekar", "Chhatrapati Shahu Maharaj"),
        "________ यांनी 'महारवतने' रद्द करण्याची आज्ञा केली?",
        ("ब्रिटीश सरकार", "पंजाबराव देशमुख", "कृष्णराव भाळेकर", "छत्रपती शाहू महाराज"),
    ),
    R(
        "History",
        "In Maharashtra, who was the first social reformer who had given 50% reservation for backward classes in his Princely State?",
        ("Vitthal Ramji Shinde", "Balasaheb Aundhkar", "Chhatrapati Shahu Maharaj", "Pantsachiv Bhorkar"),
        "स्वतःच्या संस्थानात मागास वर्गा करीता 50% आरक्षण ठेवणारे महाराष्ट्रातील पहिले समाजसुधारक कोण?",
        ("विठ्ठळ रामजी शिंदे", "बाळासाहेब औंधकर", "छत्रपती शाहू महाराज", "पंतसचिव भोरकर"),
    ),
    R(
        "History",
        "Rajarshi Shahu Maharaj was the President of Non-Brahmin Social Conference in 1920 at",
        ("Hubli", "Kolhapur", "Belgaum", "Mangaon"),
        "राजर्षी शाहू महाराज 1920 साली ________ येथे झालेल्या ब्राह्मणेतर सामाजिक परिषदेचे अध्यक्ष होते.",
        ("हुबळी", "कोल्हापूर", "बेळगांव", "माणगांव"),
    ),
    R(
        "History",
        "Maharshi Karve was born on",
        ("18 April 1858", "18 April 1758", "18 April 1859", "18 April 1759"),
        "महर्षी कर्वे यांचा जन्म ________ रोजी झाला.",
        ("18 एप्रिल 1858", "18 एप्रिल 1758", "18 एप्रिल 1859", "18 एप्रिल 1759"),
    ),
    R(
        "History",
        "In 1907 A.D. Maharshi Karve established the institution ________ at Hingane.",
        ("Anath Balikashram", "Maharashtra Gram Prathamik Shikshan Mandal", "Mahila Vidyalaya", "Samta Manch"),
        "इ.स. 1907 मध्ये महर्षी कर्वे यांनी हिंगणे येथे ________ या संस्थेची स्थापना केली.",
        ("अनाथ बालिकाश्रम", "महाराष्ट्र ग्राम प्राथमिक शिक्षण मंडळ", "महिला विद्यालय", "समता मंच"),
    ),
    R(
        "History",
        "Maharshi Karve was remarried to a widow from",
        ("Seva Sadan", "Shardashram", "Anath Balikashram", "Mukti Sadan"),
        "महर्षी कर्वे यांनी ________ येथील विधवेशी पुनर्विवाह केला होता.",
        ("सेवा सदन", "शारदाश्रम", "अनाथ बालिकाश्रम", "मुक्ती सदन"),
    ),
    R(
        "History",
        "Who was the social reformer from Maharashtra to whom 'Bharat Ratna' was awarded in 1958?",
        ("Dr. Babasaheb Ambedkar", "Dr. Panjabrao Deshmukh", "Dhondo Keshav Karve", "Mukundrao Patil"),
        "1958 साली 'भारत रत्न' हा गौरव मिळवणारे महाराष्ट्रातील समाजसुधारक कोण?",
        ("डॉ. बाबासाहेब आंबेडकर", "डॉ. पंजाबराव देशमुख", "धोंडो केशव कर्वे", "मुकुंदराव पाटील"),
    ),
    R(
        "History",
        "Who founded 'Bahiskrit Hitakarini Sabha'?",
        ("Mahatma Jyotiba Phule", "Vitthal Ramji Shinde", "Chhatrapati Shahu Maharaj", "Dr. Babasaheb Ambedkar"),
        "'बहिष्कृत हितकारिणी सभा' कोणी स्थापन केली?",
        ("महात्मा ज्योतीबा फुले", "विठ्ठळ रामजी शिंदे", "छत्रपती शाहू महाराज", "डॉ. बाबासाहेब आंबेडकर"),
    ),
    R(
        "History",
        "The periodical 'Mooknayak' was started by",
        ("Dr. Babasaheb Ambedkar", "Chhatrapati Shahu Maharaj", "Gopal Baba Valangkar", "Dhondo Keshav Karve"),
        "'मूकनायक' हे नियतकालिक ________ यांनी सुरू केले.",
        ("डॉ. बाबासाहेब आंबेडकर", "छत्रपती शाहू महाराज", "गोपाळ बाबा वळंगकर", "धोंडो केशव कर्वे"),
    ),
    R(
        "History",
        "Who launched satyagraha of the 'Chavdar Tale' at Mahad in 1927 A.D.?",
        ("Mahatma Gandhi", "Dr. Babasaheb Ambedkar", "V.D. Savarkar", "Vitthal Ramji Shinde"),
        "इ.स. 1927 या वर्षी महाड येथे 'चवदार तळे' सत्याग्रह कोणी सुरू केला?",
        ("महात्मा गांधी", "डॉ. बाबासाहेब आंबेडकर", "वि.दा. सावरकर", "विठ्ठळ रामजी शिंदे"),
    ),
    R(
        "History",
        "Dr. Ambedkar demanded ________ in Round Table Conference.",
        ("Separate electorate", "Reservation", "Education for women", "Temple entry"),
        "डॉ. आंबेडकरांनी गोलमेज परिषदेत ________ मागणी केली.",
        ("स्वतंत्र मतदारसंघ", "आरक्षण", "स्त्री शिक्षण", "मंदिर प्रवेश"),
    ),
    R(
        "History",
        "________ was the father of Social Revolution.",
        ("Bhau Daji Lad", "Vishnushastri Chiplunkar", "Vishnubuva Brahmachari", "Mahatma Jyotiba Phule"),
        "________ हे सामाजिक क्रांतीचे जनक होते.",
        ("भाऊ दाजी लाड", "विष्णुशास्त्री चिपळूणकर", "विष्णुबुवा ब्रह्मचारी", "महात्मा ज्योतीबा फुले"),
    ),
    R(
        "History",
        "________ was the base of Agarkar's Social Reform.",
        ("Fatalism", "Convention", "Rationalism", "Religion"),
        "________ चा आधार घेउन आगरकरांनी सामाजिक सुधारणेचा पुरस्कार केला.",
        ("प्रारब्ध", "रूढी", "बुद्धिप्रामाण्यवाद", "धर्म"),
    ),
    R(
        "History",
        "'Miss Clark Hostel' was started by Shahu Maharaj for ________ students.",
        ("Untouchable", "Brahmin", "Jain", "Maratha"),
        "'मिस क्लार्क वसतीगृहाची' सुरुवात शाहू महाराजांनी ________ विद्यार्थ्यांसाठी केली होती.",
        ("अस्पृश्य", "ब्राह्मण", "जैन", "मराठा"),
    ),
    R(
        "Geography",
        "Percentage of forest is maximum in ________ district of Maharashtra state.",
        ("Sindhudurg", "Gadchiroli", "Aurangabad", "Sholapur"),
        "महाराष्ट्र राज्यात ________ या जिल्ह्यामध्ये अरण्यांची टक्केवारी सर्वात जास्त आहे.",
        ("सिंधुदुर्ग", "गडचिरोली", "औरंगाबाद", "सोलापूर"),
    ),
    R(
        "Geography",
        "When we travel from west to east in Maharashtra, we cross different river basins. They are in the following sequence:",
        (
            "Bhima, Vainaganga, Seena, Savitri",
            "Vainaganga, Seena, Bhima, Savitri",
            "Savitri, Bhima, Seena, Vainaganga",
            "Vainaganga, Bhima, Seena, Savitri",
        ),
        "आपण महाराष्ट्रामध्ये पश्चिमेकडून पूर्वेकडे जातो तेव्हा विविध नद्यांची खोरी पार करतो. त्यांचा क्रम खालीलपैकी कोणता?",
        (
            "भीमा, वैनगंगा, सीना, सावित्री",
            "वैनगंगा, सीना, भीमा, सावित्री",
            "सावित्री, भीमा, सीना, वैनगंगा",
            "वैनगंगा, भीमा, सीना, सावित्री",
        ),
    ),
    R(
        "Geography",
        "The length of Maharashtra state from east to west is about",
        ("600 km", "700 km", "720 km", "800 km"),
        "महाराष्ट्र राज्याची पूर्व-पश्चिम लांबी सुमारे ________ किमी आहे.",
        ("600 किमी", "700 किमी", "720 किमी", "800 किमी"),
    ),
    R(
        "Geography",
        "Which of the following is not a power generation centre in Maharashtra?",
        ("Uran", "Khaparkheda", "Ambarnath", "Parali"),
        "खालीलपैकी कोणते स्थान महाराष्ट्रातील उर्जा निर्मिती केंद्र नाही?",
        ("उरण", "खापरखेडा", "अंबरनाथ", "परळी"),
    ),
    R(
        "Geography",
        "________ is a tributary of the river Wardha.",
        ("Penganga", "Bhima", "Yerala", "Panchganga"),
        "________ हि वर्धा नदीची उपनदी आहे.",
        ("पेनगंगा", "भीमा", "येरळा", "पंचगंगा"),
    ),
    R(
        "Geography",
        "The location of ________ is in the rain shadow region.",
        ("Mahad", "Wai", "Mahabaleshwar", "Nashik"),
        "पर्जन्यछायेच्या प्रदेशामध्ये ________ चे स्थान आहे.",
        ("महाड", "वाई", "महाबळेश्वर", "नाशिक"),
    ),
    R(
        "Geography",
        "Which of the following varieties of rice is not hybrid?",
        ("Indrayani", "Jaya", "Hansa", "Hiramoti"),
        "खालीलपैकी भाताची कोणती जात संकरीत नाही?",
        ("इंद्रायणी", "जया", "हंसा", "हिरामोती"),
    ),
    R(
        "Geography",
        "________ soil is widespread in the plateau region of Maharashtra.",
        ("Black", "Red", "Alluvial", "Laterite"),
        "महाराष्ट्राच्या पठारी विभागामध्ये ________ मृदा मोठ्या प्रमाणात विखुरलेली आढळते.",
        ("काळी", "तांबडी", "गाळाची", "जांभी"),
    ),
    R(
        "Geography",
        "The ________ lake has been formed due to a meteoric fall.",
        ("Chilka", "Lonar", "Sambhar", "Pulicat"),
        "________ या सरोवराची निर्मिती उल्कापातामधून झालेली आहे.",
        ("चिलका", "लोणार", "सांभार", "पुलीकत"),
    ),
    R(
        "Geography",
        "Matheran is an example of ________ settlement.",
        ("Linear", "Twin", "Circular", "Hill top"),
        "माथेरान हे ________ वस्तीचे उदाहरण आहे.",
        ("रेषीय", "जुळी", "गोलाकार", "डोंगरमाथा"),
    ),
    R(
        "Geography",
        "In Maharashtra ________ receives the highest rainfall.",
        ("Chikhaldara", "Toranmal", "Amboli", "Gadchiroli"),
        "महाराष्ट्रातील ________ येथे सर्वात जास्त पाउस पडतो.",
        ("चिखलदरा", "तोरणमाळ", "आंबोली", "गडचिरोली"),
    ),
    R(
        "Geography",
        "Which of the following is not a west-flowing river?",
        ("Vaitarana", "Tanasa", "Koyana", "Shastri"),
        "खालीलपैकी कोणती नदी पश्चिम वाहिनी नाही?",
        ("वैतरणा", "तानसा", "कोयना", "शास्त्री"),
    ),
    R(
        "Geography",
        "India has land frontier of about ________ kilometres.",
        ("14300", "15200", "16500", "15000"),
        "भारताला ________ किलोमीटर लांबीची भूसीमा लागलेली आहे.",
        ("14300", "15200", "16500", "15000"),
    ),
    R(
        "Geography",
        "The oldest fold mountain in India is",
        ("Aravalli", "Sahyadri", "Vindhya", "Nilgiri"),
        "________ हा भारतातील प्राचीन घडीचा पर्वत आहे.",
        ("अरवली", "सह्याद्री", "विंध्य", "नीलगिरी"),
    ),
    R(
        "Geography",
        "Which of the following terms is not related with alluvial soil?",
        ("Khadar", "Bhangar", "Bhabar", "Regur"),
        "खालीलपैकी कोणती संज्ञा गाळाच्या जमिनीशी संबंधित नाही?",
        ("खादर", "भांगर", "भाबर", "रेगूर"),
    ),
    R(
        "Geography",
        "Wildlife sanctuary at Gir in Gujarat state is reserved for",
        ("Tiger", "Elephant", "Lion", "Rhinoceros"),
        "गुजरात राज्यातील गिर अभयारण्य हे ________ साठी राखून ठेवण्यात आलेले आहे.",
        ("वाघ", "हत्ती", "सिंह", "गेंडा"),
    ),
    R(
        "Geography",
        "Jamshedpur is an industrial city situated on the bank of ________ river.",
        ("Mahanadi", "Son", "Suvarnrekha", "Ganga"),
        "जमशेदपूर हे औद्योगिक शहर ________ या नदीवर वसले आहे.",
        ("महानदी", "सोन", "सुवर्णरेखा", "गंगा"),
    ),
    R(
        "Geography",
        "In India ________ state ranks first in tea production.",
        ("Assam", "Bihar", "Maharashtra", "Orissa"),
        "भारतात चहा उत्पादनात ________ राज्याचा प्रथम क्रमांक आहे.",
        ("आसाम", "बिहार", "महाराष्ट्र", "ओरिसा"),
    ),
    R(
        "Geography",
        "The rank of India in terms of railway electrification in the world is",
        ("first", "second", "third", "fourth"),
        "रेल्वे विद्युतीकरणामध्ये भारताचा जगात कितवा क्रमांक लागतो?",
        ("प्रथम", "द्वितीय", "तृतीय", "चतुर्थ"),
    ),
    R(
        "Geography",
        "River Ganga enters the plains at",
        ("Rudraprayag", "Rishikesh", "Allahabad", "Garhwal"),
        "गंगा नदी मैदानी (सखळ) प्रदेशात ________ जवळ प्रवेश करते.",
        ("रुद्रप्रयाग", "ऋषिकेश", "अलाहबाद", "गढवाल"),
    ),
    R(
        "Economics",
        "The formation of Iron & Steel industry in ________ state is the result of Sixth Five Year Plan.",
        ("Karnataka", "Bihar", "Maharashtra", "Orissa"),
        "________ राज्यातील लोह-पोलाद कारखान्याची निर्मिती ही सहाव्या पंचवार्षिक योजनेची निष्पत्ती आहे.",
        ("कर्नाटक", "बिहार", "महाराष्ट्र", "ओरिसा"),
    ),
    R(
        "Economics",
        "The Second Five Year Plan was implemented during the period from",
        ("1950 to 1955", "1956 to 1961", "1952 to 1957", "1961 to 1966"),
        "दुसऱ्या पंचवार्षिक योजनेची अम्मलबजावणी ________ या काळात करण्यात आली.",
        ("1950 ते 1955", "1956 ते 1961", "1952 ते 1957", "1961 ते 1966"),
    ),
    R(
        "Economics",
        "In which year was the Fourth Five Year Plan started?",
        ("1974", "1966", "1969", "1970"),
        "चौथी पंचवार्षिक योजना कोणत्या साली सुरू झाली?",
        ("1974", "1966", "1969", "1970"),
    ),
    R(
        "Economics",
        "Who is the Chairman of State Planning Commission?",
        ("Governor", "Chief Minister", "Finance Minister", "Planning Minister"),
        "राज्य नियोजन आयोगाचा अध्यक्ष कोण असतो?",
        ("राज्यपाल", "मुख्यमंत्री", "अर्थमंत्री", "योजनामंत्री"),
    ),
    R(
        "Economics",
        "The Second Five Year Plan could not be implemented fully because of the",
        (
            "acute shortage of food grains",
            "acute shortage of foreign exchange",
            "over expenditure on war",
            "political crisis",
        ),
        "दुसऱ्या पंचवार्षिक योजनेची अम्मलबजावणी पूर्णतः होऊ शकली नाही याचे कारण म्हणजे",
        (
            "अन्नधान्याची तीव्र टंचाई",
            "परकिय चलनाची तीव्र टंचाई",
            "युद्धावर झालेला प्रचंड खर्च",
            "राजकीय संघर्ष",
        ),
    ),
    R(
        "Economics",
        "The formation of Damodar Valley Project is the result of ________ Five Year Plan.",
        ("First", "Second", "Third", "Fifth"),
        "दामोदर खोरे योजना ही ________ पंचवार्षिक योजनेची निष्पत्ती आहे.",
        ("पहिल्या", "दुसऱ्या", "तिसऱ्या", "पाचव्या"),
    ),
    R(
        "Indian Polity",
        "For how many maximum days can the Rajya Sabha keep the Money Bill?",
        ("7", "15", "16", "14"),
        "जास्तीतजास्त किती दिवस अर्थविषयक विधेयक राज्यसभा स्वतःकडे ठेवू शकते?",
        ("7", "15", "16", "14"),
    ),
    R(
        "Indian Polity",
        "What is federal form of government?",
        (
            "There is centralisation of power",
            "There is decentralisation of power",
            "There is only one central government",
            "There are only provincial governments",
        ),
        "संघीय शासन व्यवस्थेमध्ये",
        (
            "सत्तेचे केंद्रीकरण केलेले असते",
            "सत्तेचे विकेंद्रीकरण केलेले असते",
            "यामध्ये केवळ एकच सरकार असते",
            "यामध्ये केवळ प्रांतीय सरकारे असतात",
        ),
    ),
    R(
        "Indian Polity",
        "When was the first meeting of the Constituent Assembly held in India?",
        (
            "8th December, 1946",
            "9th December, 1946",
            "15th December, 1946",
            "15th August, 1947",
        ),
        "भारताच्या घटना समितीचे पहिले अधिवेशन केव्हा झाले?",
        ("8 डिसेंबर, 1946", "9 डिसेंबर, 1946", "15 डिसेंबर, 1946", "15 ऑगस्ट, 1947"),
    ),
    R(
        "Indian Polity",
        "How many Justices are there in the Supreme Court of India including the Chief Justice?",
        ("25", "26", "27", "17"),
        "भारतात सर्वोच्च न्यायालयात मुख्य न्यायमुर्तीसह किती न्यायमुर्ती आहेत?",
        ("25", "26", "27", "17"),
    ),
    R(
        "Indian Polity",
        "Who was nominated as Vice-President of the Constituent Assembly in its first session?",
        ("K. Santhanam", "Abul Kalam Azad", "John Matthai", "Frank Anthony"),
        "पहिल्या बैठकीच्या वेळी घटना समितीचे उपाध्यक्ष म्हणून कोणाला मनोनीत करण्यात आले होते?",
        ("के. संथानम", "अबुल कलाम आझाद", "जॉन मथाई", "फ्रॅंक ॲंथोनी"),
    ),
    R(
        "Indian Polity",
        "If any Central Minister doesn't offer his resignation despite the directions of the Prime Minister, then",
        (
            "the President can dismiss him",
            "the Prime Minister can dismiss him",
            "the Prime Minister may resign",
            "the Lok Sabha will pass resolution against him/her",
        ),
        "पंतप्रधानाच्या निर्देशावरून जर एखादा केंद्रीयमंत्री राजीनामा देत नसेल तर",
        (
            "राष्ट्रपती त्यास पदावरून काढून टाकतात",
            "पंतप्रधान त्यास पदावरून काढून टाकतात",
            "पंतप्रधान स्वतः च राजीनामा देतात",
            "लोकसभा त्याच्या/तिच्या विरुद्ध ठराव पास करते",
        ),
    ),
    R(
        "Indian Polity",
        "Which State in India has its own separate Constitution?",
        ("Jammu and Kashmir", "Maharashtra", "Bihar", "Andhra Pradesh"),
        "भारतातील कोणत्या घटकराज्याची स्वतःची स्वतंत्र राज्य घटना आहे?",
        ("जम्मू आणि काश्मीर", "महाराष्ट्र", "बिहार", "आंध्र प्रदेश"),
    ),
    R(
        "Indian Polity",
        "________ was the President of the Constituent Assembly of India.",
        ("Dr. Babasaheb Ambedkar", "Vallabhbhai Patel", "Dr. Rajendra Prasad", "Pt. Nehru"),
        "________ हे भारतीय घटना समितीचे अध्यक्ष होते.",
        ("डॉ. बाबासाहेब आंबेडकर", "वल्लभभाई पटेल", "डॉ. राजेंद्र प्रसाद", "पं. नेहरू"),
    ),
    R(
        "Indian Polity",
        "The total number of talukas in Maharashtra is ________.",
        ("350", "355", "351", "357"),
        "महाराष्ट्रातील एकूण तालुक्यांची संख्या ________ आहे.",
        ("350", "355", "351", "357"),
    ),
    R(
        "Indian Polity",
        "How many members of the Vidhan Parishad are elected from teachers' constituency?",
        ("1/2", "1/4", "1/12", "1/3"),
        "विधानपरिषदेतील किती सदस्य हे शिक्षक मतदार संघातू निवडले जातात?",
        ("1/2", "1/4", "1/12", "1/3"),
    ),
    R(
        "Indian Polity",
        "How many languages are constitutionally approved in India?",
        ("14", "18", "20", "22"),
        "भारतात घटनात्मकरित्या किती भाषांना मान्यता देण्यात आली आहे?",
        ("14", "18", "20", "22"),
    ),
    R(
        "Indian Polity",
        "To whom is the Governor responsible?",
        ("The Chief Minister", "The Home Minister", "The Prime Minister", "The President of India"),
        "राज्यपाल कोणास जबाबदार असतो?",
        ("मुख्यमंत्री", "गृहमंत्री", "पंतप्रधान", "भारताचे राष्ट्रपती"),
    ),
    R(
        "Indian Polity",
        "________ became the 25th state in India.",
        ("Goa", "Mizoram", "Sikkim", "Jharkhand"),
        "________ हे भारताचे 25वे राज्य बनले.",
        ("गोवा", "मिझोरम", "सिक्कीम", "झारखंड"),
    ),
    R(
        "Indian Polity",
        "________ can use his powers on the advice of the Chief Minister and the Council of Ministers.",
        ("President", "Prime Minister", "Governor", "The Chief Justice"),
        "________ हे मुख्यमंत्री आणि मंत्रिमंडळाच्या सल्ल्याने आपले अधिकार वापरू शकतात.",
        ("राष्ट्रपती", "पंतप्रधान", "राज्यपाल", "सरन्यायाधीश"),
    ),
    R(
        "Indian Polity",
        "Who selects the Gramsevaks?",
        ("Panchayat Samiti", "Gram Panchayat", "State Government", "District Selection Board"),
        "ग्रामसेवकाची निवड कोण करते?",
        ("पंचायत समिती", "ग्राम पंचायत", "राज्य शासन", "जिल्हा निवड मंडळ"),
    ),
    R(
        "Indian Polity",
        "How many members can be in the Zilla Parishad?",
        ("50 to 75", "60 to 75", "20 to 75", "35 to 75"),
        "जिल्हापरिषदेमध्ये किती सभासद असू शकतात?",
        ("50 ते 75", "60 ते 75", "20 ते 75", "35 ते 75"),
    ),
    R(
        "Indian Polity",
        "Who can sanction the loan to Gram Panchayats?",
        ("State Government", "Collector", "Zilla Parishad", "Panchayat Samiti"),
        "ग्राम पंचायतीला कर्ज कोण मंजूर करू शकतो?",
        ("राज्य सरकार", "जिल्हाधिकारी", "जिल्हा परिषद", "पंचायत समिती"),
    ),
    R(
        "Indian Polity",
        "Zilla Parishad was started in Maharashtra in the year",
        ("1960", "1950", "1947", "1924"),
        "महाराष्ट्रात जिल्हा परिषदेची स्थापना ________ मध्ये झाली.",
        ("1960", "1950", "1947", "1924"),
    ),
    R(
        "Indian Polity",
        "Which is the final decision-making authority regarding the development of a village?",
        ("Gram Panchayat", "Gramsevak", "Sarpanch", "Gram Sabha"),
        "गावाच्या विकासासंबंधी अंतिम निर्णय घेणारी सत्ता कोणती?",
        ("ग्राम पंचायत", "ग्रामसेवक", "सरपंच", "ग्राम सभा"),
    ),
    R(
        "Current Affairs",
        "Which movie received the Oscar Award in the Best Movie category in 2010?",
        ("The Hurt Locker", "An Education", "Inglorious Basterds", "The Secret in Their Eyes"),
        "सर्वोत्कृष्ट चित्रपट म्हणून 2010 मध्ये कोणत्या चित्रपटास ऑस्कर अवार्ड मिळाला?",
        ("द हर्ट लॉकर", "ॲन एज्युकेशन", "इनग्लोरीयस बास्टर्ड", "द सीक्रेट इन देअर आईज"),
    ),
    R(
        "Current Affairs",
        "Who was the coach of the Indian Hockey team in 2010?",
        ("Flourisan Fuex", "Jose Brasa", "Lombi", "Benzamin Base"),
        "2010 मध्ये भारतीय हॉकी संघाचे प्रशिक्षक कोण होते?",
        ("फ्लोरीसन फुक्स", "जोश ब्रासा", "लोंबी", "बेन्झामिन बेस"),
    ),
    R(
        "Current Affairs",
        "What will be number of the amendment in the Constitution of India for women's reservation?",
        ("104th", "108th", "107th", "106th"),
        "महिला करिता राखीव जागा ठेवण्यासाठी घटनेची कितवी घटनादुरुस्ती करावी लागणार आहे?",
        ("104वी", "108वी", "107वी", "106वी"),
    ),
    R(
        "Current Affairs",
        "The autobiography 'Prakashwata' is by the following famous personality:",
        ("Dr. Prakash Amte", "Dr. Anil Awachat", "Dr. Raghunath Mashelkar", "Madhav Kanitkar"),
        "'प्रकाशवाटा' हे आत्मचरित्र ________ या प्रसिद्ध व्यक्तीचे आहे.",
        ("डॉ. प्रकाश आमटे", "डॉ. अनिल अवचट", "डॉ. रघुनाथ माशेळकर", "माधव कानिटकर"),
    ),
    R(
        "Current Affairs",
        "Rangarajan Committee is related to",
        ("National Savings and Investment", "Gujarat Riots", "Mumbai Attack", "Rajiv Gandhi Assassination"),
        "रंगराजन कमिटी ही ________ संबंधित आहे.",
        ("राष्ट्रीय बचत आणि गुंतवणूकीशी", "गुजरात दंगलीशी", "मुंबई हल्ल्याशी", "राजीव गांधी हत्येशी"),
    ),
    R(
        "Current Affairs",
        "The name Soumya Swaminathan is related to",
        ("Tennis", "Chess", "Trekking", "Marathon"),
        "सौम्या स्वामीनाथन ह्या कशाशी संबंधित आहेत?",
        ("टेनिस", "चेस (बुद्धिबळ)", "गिर्यारोहन", "मॅरेथॉन"),
    ),
    R(
        "Current Affairs",
        "For which party has freedom fighter Ahilyabai Rangnekar worked?",
        ("Communist Marxist", "Samajwadi Party", "Congress", "Janata Party"),
        "स्वातंत्र्य सेनानी अहिल्याबाई रांगणेकर यांनी कोणत्या पक्षात काम केले?",
        ("मार्क्सवादी कम्युनिस्ट", "समाजवादी पक्ष", "कॉंग्रेस", "जनता पक्ष"),
    ),
    R(
        "Current Affairs",
        "Which power project is being constructed at Madban near Jaitapur?",
        ("Tidal energy", "Nuclear energy", "Hydro-electric power", "Windmill"),
        "जैतापुर जवळ माडबन येथे कोणता उर्जा प्रकल्प उभा राहतो आहे?",
        ("समुद्र लाटावर आधारित", "अणू उर्जा", "जल-विद्युत", "पवन उर्जा"),
    ),
    R(
        "Current Affairs",
        "Which scheme has the Government of Maharashtra decided to implement from February 2011?",
        (
            "Nirmal Swarajya Mohim",
            "Swarnjayanti Gram Swarozgar Yojana",
            "Yashwant Gram Samriddhi Yojana",
            "M. Gandhi Rozgar Yojana",
        ),
        "फेब्रुवारी 2011 पासून कोणती योजना राबविण्याचा निर्णय महाराष्ट्रराज्याने घेतला आहे?",
        (
            "निर्मल स्व-राज्य मोहिम",
            "स्वर्णजयंती ग्राम स्वरोजगार योजना",
            "यशवंत ग्राम समृद्धी योजना",
            "म. गांधी रोजगार योजना",
        ),
    ),
    R(
        "Current Affairs",
        "Which is the largest Public Sector Bank in India?",
        ("Reserve Bank of India", "State Bank of India", "Bank of India", "Canara Bank"),
        "भारतातील सार्वजनिक क्षेत्रातील सर्वात मोठी बँक कोणती?",
        ("रिझर्व्ह बँक ऑफ इंडिया", "स्टेट बँक ऑफ इंडिया", "बँक ऑफ इंडिया", "कॅनरा बँक"),
    ),
    R(
        "Current Affairs",
        "Which one of the following places is famous for production of railway coaches?",
        ("Nashik", "Kapurthala", "Kanpur", "Kochi"),
        "खालील ठिकाणांपैकी रेल्वे डब्यांच्या निर्मितीसाठी कोणते स्थळ प्रसिद्ध आहे?",
        ("नाशिक", "कपूरथला", "कानपूर", "कोची"),
    ),
    R(
        "Current Affairs",
        "In which district are Dr. Abhay Bang and Dr. Rani Bang working to improve the health conditions of tribals?",
        ("Nandurbar", "Thane", "Gadchiroli", "Yeotmal"),
        "डॉ. अभय बंग आणि डॉ. राणी बंग आदिवासीकरिता कोणत्या जिल्ह्यात आरोग्यविषयक कार्य करीत आहेत?",
        ("नंदूरबार", "ठाणे", "गडचिरोली", "यवतमाळ"),
    ),
    R(
        "Current Affairs",
        "Which is the correct pair in terms of the Agricultural University and its location?",
        (
            "Marathwada Agricultural University – Rahuri",
            "Dr. Panjabrao Deshmukh Agricultural University – Akola",
            "Dr. Babasaheb Ambedkar Agricultural University – Parbhani",
            "Mahatma Phule Agricultural University – Dapoli",
        ),
        "खालीलपैकी कोणती जोडी कृषीविद्यापीठ व गांव यांच्या करीता बरोबर आहे?",
        (
            "मराठवाडा कृषी विद्यापीठ – राहुरी",
            "डॉ. पंजाबराव देशमुख कृषी विद्यापीठ – अकोला",
            "डॉ. बाबासाहेब आंबेडकर कृषी विद्यापीठ – परभणी",
            "महात्मा फुले कृषी विद्यापीठ – दापोली",
        ),
    ),
    R(
        "Current Affairs",
        "________ is the inventor of 'Jaipur Foot'.",
        ("Dr. Pramod Karan Sethi", "Dr. M. Khalilullah", "Dr. V. Swaminathan", "Dr. P.K. Banerjee"),
        "________ ह्यांना 'जयपूर फूट' चे जनक मानले जाते.",
        ("डॉ. प्रमोद करण सेठी", "डॉ. एम. खलीलुल्ला", "डॉ. व्ही. स्वामीनाथन", "डॉ. पी.के. बनर्जी"),
    ),
    R(
        "Current Affairs",
        "Dhanalaxmi Scheme for Girl Child was started in March 2008. a. It was initially launched in 7 states. b. The girl child gets upto 2 lakh rupees.",
        (
            "a and b both are correct",
            "a is correct and b is wrong",
            "a and b are incorrect",
            "a is wrong and b is correct",
        ),
        "मुलींसाठी धनलक्ष्मी योजना ही मार्च 2008 मध्ये सुरू करण्यात आली. a. ही सर्वप्रथम सात राज्यात सुरू करण्यात आली. b. मुलीला 2 लाखापर्यंत रक्कम मिळते.",
        (
            "a आणि b दोन्ही बरोबर आहेत",
            "a बरोबर आहे तर b चूक आहे",
            "a आणि b चुकीचे आहेत",
            "a चूक आहे तर b बरोबर आहे",
        ),
    ),
    R(
        "Current Affairs",
        "Where was the A.I. Marathi Literary Conference 2010 held?",
        ("Sangli", "Mumbai", "U.S.A.", "Thane"),
        "2010 चे अ.भा. मराठी साहित्य संमेलन कोठे झाले?",
        ("सांगली", "मुंबई", "यु.एस.ए.", "ठाणे"),
    ),
    R(
        "Indian Polity",
        "Which Constitutional Amendment provides for Free and Compulsory Primary Education for the children aged between 6 to 14 years?",
        ("42nd Amendment", "73rd Amendment", "86th Amendment", "91st Amendment"),
        "कोणत्या घटनादुरुस्ती अन्वये 6 ते 14 वयोगटातील बालकांसाठी मोफत व सक्तीचे प्राथमिक शिक्षण हा मूलभूत हक्क मानला आहे?",
        ("42वी घटनादुरुस्ती", "73वी घटनादुरुस्ती", "86वी घटनादुरुस्ती", "91वी घटनादुरुस्ती"),
    ),
    R(
        "Economics",
        "Which of the following is not an objective of India's economic planning?",
        ("Population growth", "Industrial growth", "Self-reliance", "Employment generation"),
        "भारताच्या आर्थिक नियोजनाचे खालीलपैकी कोणते उद्दिष्ट नाही?",
        ("लोकसंख्या वाढ", "औद्योगिक वाढ", "स्वावलंबन", "रोजगार निर्मिती"),
    ),
    R(
        "Current Affairs",
        '"Oscar Award" is given for the excellence in the field of',
        ("Films", "Literature", "Sports", "Politics"),
        "खालीलपैकी कोणत्या क्षेत्रातील सर्वोत्कृष्ट कार्यासाठी \"ऑस्कर पुरस्कार\" दिला जातो?",
        ("चित्रपट", "साहित्य", "क्रीडा", "राजकारण"),
    ),
    R(
        "Current Affairs",
        "Which of the following missiles was test-fired from the launch site in Orissa in March 2008?",
        ("Agni-I", "Agni-II", "Agni-III", "Prithvi"),
        "मार्च 2008 मध्ये ओरिसा राज्यात कोणत्या क्षेपणास्त्राची चाचणी घेतली गेली?",
        ("अग्नी-I", "अग्नी-II", "अग्नी-III", "पृथ्वी"),
    ),
    R(
        "Current Affairs",
        "The 15th SAARC Summit of August 2008 was held at",
        ("New Delhi", "Colombo", "Kathmandu", "Islamabad"),
        "ऑगस्ट 2008 मधील पंधरावी सार्क शिखर परिषद ________ येथे आयोजित करण्यात आली.",
        ("नवी दिल्ली", "कोलंबो", "काठमांडू", "इस्लामाबाद"),
    ),
    R(
        "Current Affairs",
        "Where is Tata Motors Nano Car Project in Gujarat located?",
        ("Rajkot", "Anand", "Sanand", "Baroda"),
        "टाटा कंपनीचा नॅनो कार प्रकल्प गुजरात मध्ये कोठे आहे?",
        ("राजकोट", "आणंद", "सानंद", "बडोदा"),
    ),
    R(
        "Current Affairs",
        "Match the columns: a. Pandit Ravi Shankar - (i) Tabla; b. Zakir Hussain - (ii) Sarod; c. Amjad Ali Khan - (iii) Sitar; d. Hari Prasad Chaurasia - (iv) Flute",
        (
            "a-iv, b-i, c-ii, d-iii",
            "a-iii, b-i, c-ii, d-iv",
            "a-ii, b-iii, c-i, d-iv",
            "a-iii, b-i, c-iv, d-ii",
        ),
        "जोड्या जुळवा: a. पंडित रवि शंकर - (i) तबला; b. झाकिर हुसेन - (ii) सरोद; c. अमजद अली खान - (iii) सितार; d. हरी प्रसाद चौरसिया - (iv) बासरी",
        (
            "a-iv, b-i, c-ii, d-iii",
            "a-iii, b-i, c-ii, d-iv",
            "a-ii, b-iii, c-i, d-iv",
            "a-iii, b-i, c-iv, d-ii",
        ),
    ),
    R(
        "Current Affairs",
        "Which gharana of Indian music is represented by Pandit Bhimsen Joshi?",
        ("Dagar", "Kirana", "Jaipur", "Carnatic"),
        "पंडित भीमसेन जोशी भारतातील कोणत्या गायन घराण्याचे मानले जातात?",
        ("डागर", "किराणा", "जयपूर", "कर्नाटकी"),
    ),
    R(
        "Current Affairs",
        "Kavi Kulguru Kalidas Sanskrit University is located at",
        ("Sewagram", "Sangamner", "Wai", "Ramtek"),
        "कवी कुलगुरू कालीदास संस्कृत विद्यापीठ ________ येथे आहे.",
        ("सेवाग्राम", "संगमनेर", "वाई", "रामटेक"),
    ),
]

SCRIPT_DIR = Path(__file__).resolve().parent
PUBLIC_DIR = SCRIPT_DIR / "public"

# Set A: 1=A, 2=B, ... (101 cancelled -> stored as A + explanation)
ANSWERS = (
    "AABDACDDDC"
    "DCCDABBBAB"
    "CBBACADDAB"
    "CBDABCACBD"
    "ABDABBCCBD"
    "BABACCBBCB"
    "BCADAADCAA"
    "CBCDABADCA"
    "BCDCABDABD"
    "CCBADCCABB"
    "ABCBBADBBB"
    "DAACDCDDAC"
    "DACADABBAA"
    "BABABBCBAA"
    "DCAAABCBBD"
)

TITLE_EN = "MPSC Assistant Preliminary Examination 2011 (Set A) (English)"
TITLE_MR = "MPSC सहाय्यक प्राथमिक परीक्षा 2011 (संच A) (मराठी)"
CREATED_AT = "2026-04-18T00:00:00.000Z"
TAG = "Assistant Pre 2011"
CANCELLED_Q = 101
CANCELLED_EXPL = "This question was cancelled by MPSC."


def build_questions(
    bank: list[dict[str, Any]],
    lang: str,
    id_prefix: str,
) -> list[dict[str, Any]]:
    if len(bank) != 150:
        raise ValueError(f"Expected 150 bank rows, got {len(bank)}")
    if len(ANSWERS) != 150:
        raise ValueError(f"Expected 150 answers, got {len(ANSWERS)}")

    out: list[dict[str, Any]] = []
    for i, row in enumerate(bank, start=1):
        key = "en" if lang == "english" else "mr"
        block = row[key]
        opts_list = block["options"]
        if len(opts_list) != 4:
            raise ValueError(f"Q{i}: expected 4 options, got {len(opts_list)}")
        opts = {"A": opts_list[0], "B": opts_list[1], "C": opts_list[2], "D": opts_list[3]}
        letter = ANSWERS[i - 1]
        if letter not in ("A", "B", "C", "D"):
            raise ValueError(f"Q{i}: invalid answer letter {letter!r}")
        expl = CANCELLED_EXPL if i == CANCELLED_Q else ""
        out.append(
            {
                "id": f"{id_prefix}_{i}",
                "text": block["text"],
                "options": opts,
                "correctAnswer": letter,
                "explanation": expl,
                "category": row["category"],
            }
        )
    return out


def validate(quiz: dict[str, Any], lang: str) -> None:
    qs = quiz["questions"]
    if len(qs) != 150:
        raise ValueError(f"{lang}: expected 150 questions, got {len(qs)}")
    allowed = {
        "Indian Polity",
        "History",
        "Geography",
        "Science",
        "Economics",
        "Environment",
        "Current Affairs",
        "Aptitude",
        "English",
        "Marathi",
    }
    for q in qs:
        ca = q.get("correctAnswer")
        if ca not in ("A", "B", "C", "D"):
            raise ValueError(f"{lang}: bad correctAnswer {ca!r} in {q.get('id')}")
        opts = q.get("options") or {}
        if set(opts.keys()) != {"A", "B", "C", "D"}:
            raise ValueError(f"{lang}: bad options keys in {q.get('id')}")
        cat = q.get("category")
        if cat not in allowed:
            raise ValueError(f"{lang}: invalid category {cat!r} in {q.get('id')}")


def main() -> None:
    bank = BANK
    if len(bank) != 150:
        print(f"ERROR: bank_data.BANK has {len(bank)} rows (expected 150)", file=sys.stderr)
        sys.exit(1)

    en_quiz = {
        "id": "asst_pre_2011_en",
        "title": TITLE_EN,
        "createdAt": CREATED_AT,
        "questions": build_questions(bank, "english", "asst2011_en"),
        "language": "english",
        "tag": TAG,
    }
    mr_quiz = {
        "id": "asst_pre_2011_mr",
        "title": TITLE_MR,
        "createdAt": CREATED_AT,
        "questions": build_questions(bank, "marathi", "asst2011_mr"),
        "language": "marathi",
        "tag": TAG,
    }

    validate(en_quiz, "english")
    validate(mr_quiz, "marathi")

    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    en_path = PUBLIC_DIR / "assistant_pre_2011_en.json"
    mr_path = PUBLIC_DIR / "assistant_pre_2011_mr.json"

    with en_path.open("w", encoding="utf-8", newline="\n") as f:
        json.dump(en_quiz, f, ensure_ascii=False, indent=2)
        f.write("\n")
    with mr_path.open("w", encoding="utf-8", newline="\n") as f:
        json.dump(mr_quiz, f, ensure_ascii=False, indent=2)
        f.write("\n")

    # Validation report
    print(f"Wrote: {en_path}")
    print(f"Wrote: {mr_path}")
    print(f"Bank rows: {len(bank)}")
    print(f"English questions: {len(en_quiz['questions'])}")
    print(f"Marathi questions: {len(mr_quiz['questions'])}")
    print(f"Answer string length: {len(ANSWERS)} (expected 150)")

    mismatches = []
    for i in range(150):
        enq = en_quiz["questions"][i]
        mrq = mr_quiz["questions"][i]
        if enq["correctAnswer"] != mrq["correctAnswer"]:
            mismatches.append(i + 1)
    if mismatches:
        print("MISMATCH en/mr correctAnswer at Q:", mismatches)
        sys.exit(1)
    print("No en/mr answer mismatches.")

    q101_en = en_quiz["questions"][100]
    q101_mr = mr_quiz["questions"][100]
    if q101_en["correctAnswer"] != "A" or q101_en["explanation"] != CANCELLED_EXPL:
        print("ERROR: Q101 English cancellation metadata wrong", q101_en)
        sys.exit(1)
    if q101_mr["correctAnswer"] != "A" or q101_mr["explanation"] != CANCELLED_EXPL:
        print("ERROR: Q101 Marathi cancellation metadata wrong", q101_mr)
        sys.exit(1)
    print("Q101 cancellation metadata OK (en + mr).")


if __name__ == "__main__":
    main()
