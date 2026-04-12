import json, os

SET_A_ANSWERS = {
    1:1,2:1,3:1,4:2,5:2,6:1,7:2,8:2,9:1,10:1,
    11:2,12:2,13:1,14:1,15:3,16:1,17:4,18:1,19:3,20:4,
    21:3,22:3,23:2,24:4,25:1,26:3,27:3,28:2,29:2,30:3,
    31:1,32:4,33:1,34:3,35:4,36:2,37:1,38:2,39:4,40:1,
    41:1,42:1,43:1,44:2,45:1,46:2,47:4,48:2,49:1,50:1,
    51:2,52:3,53:1,54:3,55:1,56:3,57:2,58:1,59:1,60:4,
    61:4,62:2,63:2,64:1,65:4,66:3,67:4,68:2,69:4,70:3,
    71:1,72:1,73:2,74:1,75:2,76:1,77:1,78:3,79:4,80:1,
    81:3,82:3,83:1,84:2,85:2,86:2,87:3,88:3,89:3,90:1,
    91:1,92:3,93:4,94:4,95:2,96:3,97:4,98:3,99:1,100:1,
    101:3,102:1,103:2,104:4,105:2,106:3,107:4,108:2,109:4,110:2,
    111:1,112:3,113:3,114:3,115:3,116:2,117:1,118:4,119:2,120:3,
    121:2,122:1,123:3,124:3,125:1,126:2,127:3,128:3,129:4,130:2,
    131:2,132:1,133:3,134:2,135:1,136:2,137:2,138:2,139:2,140:1,
    141:2,142:3,143:2,144:2,145:1,146:4,147:3,148:1,149:4,150:1,
}

ANSWER_MAP = {1: "A", 2: "B", 3: "C", 4: "D"}

questions_data = [
    {
        "num": 1,
        "text": "The satellite launched by India in September 2007 will be used for _______.",
        "options": ["Communication", "Agricultural Research", "Land Measurement", "Reconnaissance"],
        "category": "Science"
    },
    {
        "num": 2,
        "text": "The special feature of the 'Revolt of 1857 AD' was the _______ unity.",
        "options": ["Hindu-Muslim", "Maratha-Sikh", "English-Muslim", "English-Maratha"],
        "category": "History"
    },
    {
        "num": 3,
        "text": "In 1907, Maharshi Karve established the institution _______ at Hingane.",
        "options": ["Mahila Vidyalaya", "Anath Balikashram", "Maharashtra Gram Prathamik Shikshan Mandal", "Samata Manch"],
        "category": "History"
    },
    {
        "num": 4,
        "text": "Family Planning programme was intensively implemented during _______ five year plan for controlling growth of population in India.",
        "options": ["4th (Fourth)", "5th (Fifth)", "6th (Sixth)", "None of these"],
        "category": "Economics"
    },
    {
        "num": 5,
        "text": "_______ assassinated Jackson, the collector of Nashik in 1909 A.D.",
        "options": ["Khudiram Bose", "Anant Kanhere", "Bhupendranath", "Barindra Ghosh"],
        "category": "History"
    },
    {
        "num": 6,
        "text": "Who is the administrative head of Panchayat-Samiti?",
        "options": ["Block Development Officer", "Speaker", "Chief Executive Officer", "Deputy-Speaker"],
        "category": "Indian Polity"
    },
    {
        "num": 7,
        "text": "How many members are elected to the Rajya Sabha from the States as well as Union Territories together?",
        "options": ["226", "238", "225", "228"],
        "category": "Indian Polity"
    },
    {
        "num": 8,
        "text": "\u221a{(65)\u00b2 \u2212 (16)\u00b2} = ?",
        "options": ["49", "63", "144", "45"],
        "category": "Aptitude"
    },
    {
        "num": 9,
        "text": "What is the maximum strength of the Rajya Sabha?",
        "options": ["250", "200", "552", "252"],
        "category": "Indian Polity"
    },
    {
        "num": 10,
        "text": "The first session of National Congress was held in _______.",
        "options": ["Mumbai", "Kolkatta", "Chennai", "Delhi"],
        "category": "History"
    },
    {
        "num": 11,
        "text": "A wire of length 6.27 m is bent to form a circle, then what is the radius of the circle?",
        "options": ["0.1 m", "1.0 m", "3.14 m", "0.0314 m"],
        "category": "Aptitude"
    },
    {
        "num": 12,
        "text": "Who wrote the book 'Poverty and Un-British Rule in India'?",
        "options": ["Justice Ranade", "Dadabhai Naoroji", "Firozshah Mehta", "Swatantryaveer Savarkar"],
        "category": "History"
    },
    {
        "num": 13,
        "text": "Name the hockey player, who was banned for three matches in opening match of Hockey World Cup.",
        "options": ["Shivendra Singh", "Sandip Singh", "Rajpal Singh", "Gurindar Singh"],
        "category": "Current Affairs"
    },
    {
        "num": 14,
        "text": "Morle-Minto Reforms Act was passed in _______.",
        "options": ["1909 A.D.", "1911 A.D.", "1919 A.D.", "1935 A.D."],
        "category": "History"
    },
    {
        "num": 15,
        "text": "Modern Biotechnology works on _______ level.",
        "options": ["Colloidal", "Atom", "Molecule", "Substance"],
        "category": "Science"
    },
    {
        "num": 16,
        "text": "What is the name of the President of Second World Marathi Sahitya Sammelan?",
        "options": ["Mangesh Padgoankar", "Dr. V. B. Deshpande", "Gangadhar Pantawane", "Dhananjay Datar"],
        "category": "Current Affairs"
    },
    {
        "num": 17,
        "text": "Which is the lowest tier of Panchayat Raj Institutions?",
        "options": ["Panchayat Samiti", "Zilla Parishad", "Municipal Council", "Gram Panchayat"],
        "category": "Indian Polity"
    },
    {
        "num": 18,
        "text": "The Sarpanch and the Deputy-Sarpanch are elected by:",
        "options": ["Members of Gram Panchayat", "Gramsabha", "Gramsevak", "Block Development Officer"],
        "category": "Indian Polity"
    },
    {
        "num": 19,
        "text": "In which district of Maharashtra the longest railway tunnel in Asian continent is located?",
        "options": ["Sindhudurg", "Raigad", "Ratnagiri", "Thane"],
        "category": "Geography"
    },
    {
        "num": 20,
        "text": "The Women's University for the female education was established by Maharshi Karve in _______.",
        "options": ["1893", "1907", "1910", "1916"],
        "category": "History"
    },
    {
        "num": 21,
        "text": "Which scheme was rejected by the Cabinet Mission Plan?",
        "options": ["Partition of India", "Creation of Pakistan", "Both (1) and (2)", "Neither of them"],
        "category": "History"
    },
    {
        "num": 22,
        "text": "Which animal is declared as National aquatic animal?",
        "options": ["Crocodile", "Hyppopotamus", "Dolphin", "Tortoise"],
        "category": "Science"
    },
    {
        "num": 23,
        "text": "Who wrote the book 'Dongarichya Turungatil 101 Divas'?",
        "options": ["Lokmanya Tilak", "Gopal Ganesh Agarkar", "Justice Ranade", "Vishnushastri Chiplunkar"],
        "category": "History"
    },
    {
        "num": 24,
        "text": "Yashwantrao Chavan Maharashtra Open University is at _______.",
        "options": ["Mumbai", "Pune", "Nagpur", "Nashik"],
        "category": "Current Affairs"
    },
    {
        "num": 25,
        "text": "In Seventh Five Year Plan for the purpose of _______ development new plan has been introduced.",
        "options": ["Agriculture", "Fishing", "Industries", "Mining"],
        "category": "Economics"
    },
    {
        "num": 26,
        "text": "Solve: 25/5 \u00d7 125/10 + 36/12 + 64/32 = _______.",
        "options": ["6.75", "0.675", "67.5", "None of the above"],
        "category": "Aptitude"
    },
    {
        "num": 27,
        "text": "Oldest fold mountain range in India is _______.",
        "options": ["Vindhya Mountain range", "Satpura Mountain range", "Aravalli Mountain range", "Sahyadri Mountain range"],
        "category": "Geography"
    },
    {
        "num": 28,
        "text": "Elephant belongs to class:",
        "options": ["Carnivorous", "Herbivorous", "Insectivorous", "Omnivorous"],
        "category": "Science"
    },
    {
        "num": 29,
        "text": "In which district of Maharashtra coal is found?",
        "options": ["Bhandara", "Chandrapur", "Yavatmal", "Ratnagiri"],
        "category": "Geography"
    },
    {
        "num": 30,
        "text": "Who is electing Sarpanch?",
        "options": ["Gram Sabha", "Adult voters of the village", "Member of Gram Panchayat", "All of these"],
        "category": "Indian Polity"
    },
    {
        "num": 31,
        "text": "'Brahmos' is the name of _______.",
        "options": ["Missile", "Submarine", "Fighter Ship", "Satellite"],
        "category": "Science"
    },
    {
        "num": 32,
        "text": "Who is known as 'Martin Luther of Maharashtra'?",
        "options": ["Lokahitawadi", "Vishnushastri Pandit", "Jagannath Shankarsheth", "Mahatma Phule"],
        "category": "History"
    },
    {
        "num": 33,
        "text": "Of the 150 trees in an orchard 12% are mango trees. What is the number of other kinds of trees in the orchard?",
        "options": ["132", "138", "18", "24"],
        "category": "Aptitude"
    },
    {
        "num": 34,
        "text": "Eleventh Five Year Plan targets an average GDP growth of:",
        "options": ["7%", "8%", "9%", "10%"],
        "category": "Economics"
    },
    {
        "num": 35,
        "text": "Write fraction form of 0.005:",
        "options": ["5/10", "5/100", "5/10000", "5/1000"],
        "category": "Aptitude"
    },
    {
        "num": 36,
        "text": "Dayana Mendoza who was adjudged Miss Universe 2008 is citizen of _______.",
        "options": ["India", "Venezuela", "Britain", "Mexico"],
        "category": "Current Affairs"
    },
    {
        "num": 37,
        "text": "1 H.P. = _______.",
        "options": ["746 W", "36 \u00d7 10\u2075 J/s", "1000 W", "1000 erg/s"],
        "category": "Science"
    },
    {
        "num": 38,
        "text": "Degradation of _______ in food is called putrefaction.",
        "options": ["Fats", "Proteins", "Carbohydrates", "Pectins"],
        "category": "Science"
    },
    {
        "num": 39,
        "text": "Name the winning team of IPL-2009 tournament.",
        "options": ["Mumbai Indians", "Rajasthan Royals", "Chennai Super Kings", "Deccan Chargers, Hyderabad"],
        "category": "Current Affairs"
    },
    {
        "num": 40,
        "text": "Arrange the creeks in Kokan from North to South direction.",
        "options": ["Rajapuri, Dabhol, Jaigad, Terekhol", "Dabhol, Rajapuri, Jaigad, Terekhol", "Dabhol, Jaigad, Rajapuri, Terekhol", "Terekhol, Jaigad, Dabhol, Rajapuri"],
        "category": "Geography"
    },
    {
        "num": 41,
        "text": "Dr. Babasaheb Ambedkar with his followers embraced the Buddhism at _______.",
        "options": ["Nagpur", "Mahad", "Nashik", "Aurangabad"],
        "category": "History"
    },
    {
        "num": 42,
        "text": "Rajarshi Shahu Maharaj was the President of Non-Brahmin Social Conference in 1920 at _______.",
        "options": ["Hubli", "Kolhapur", "Belgaum", "Mangaon"],
        "category": "History"
    },
    {
        "num": 43,
        "text": "Speed of the boat on calm water is 15 km/hr, the boat comes to original place after 6 hrs 45 min travelling 45 km distance in the opposite direction of water flow. Find speed of water flow.",
        "options": ["5 km/hr", "6 km/hr", "9 km/hr", "3 km/hr"],
        "category": "Aptitude"
    },
    {
        "num": 44,
        "text": "Madam Cama raised the question of India's independence at the International Socialist Conference held at Stuttgart in _______.",
        "options": ["France", "Germany", "England", "Greece"],
        "category": "History"
    },
    {
        "num": 45,
        "text": "Which was the main objective of the Second Five Year Plan?",
        "options": ["Industrialization", "Agricultural Development", "Increase in Export", "Construction of Dams"],
        "category": "Economics"
    },
    {
        "num": 46,
        "text": "Who among the following has been appointed the National Security Advisor by the Government of India?",
        "options": ["Brijesh Mishra", "M. K. Narayanan", "Soli Sorabji", "T. K. Nair"],
        "category": "Current Affairs"
    },
    {
        "num": 47,
        "text": "The State of _______ is the largest producer of Rubber in India.",
        "options": ["Karnataka", "Tamilnadu", "Tripura", "Kerala"],
        "category": "Geography"
    },
    {
        "num": 48,
        "text": "A dishonest trader uses a 900 gram weight instead of a 1 kilogram weight. Find the percentage profit due to this cheating.",
        "options": ["9%", "10%", "1%", "100%"],
        "category": "Aptitude"
    },
    {
        "num": 49,
        "text": "What is the original name of Rajarshi Shahu Maharaj?",
        "options": ["Yeshwantrao", "Prataprao", "Shivajirao", "None of the above"],
        "category": "History"
    },
    {
        "num": 50,
        "text": "_______ five year plan of Government of India will be implemented from the year 2007 to 2012.",
        "options": ["Eleventh", "Tenth", "Thirteenth", "Fifteenth"],
        "category": "Economics"
    },
    {
        "num": 51,
        "text": "Eleventh Five year plan intends to incur _______% of the total plan outlay on social services.",
        "options": ["10.5%", "30.3%", "50.8%", "61.2%"],
        "category": "Economics"
    },
    {
        "num": 52,
        "text": "Water runs into a tank at the rate of 2 litres every 5 seconds and simultaneously runs out at the rate of 1 litre every 10 seconds. If tank capacity is 90,000 litres then how much time it takes to fill the tank?",
        "options": ["2500 minutes", "3000 minutes", "5000 minutes", "4000 minutes"],
        "category": "Aptitude"
    },
    {
        "num": 53,
        "text": "What is the provision in Indian Constitution about citizenship?",
        "options": ["A single citizenship", "A double citizenship", "Both of these", "Neither of these"],
        "category": "Indian Polity"
    },
    {
        "num": 54,
        "text": "Father's age is equal to sum of mother's and son's age and average of ages of all three is 20. Then calculate father's age.",
        "options": ["45", "40", "30", "35"],
        "category": "Aptitude"
    },
    {
        "num": 55,
        "text": "Agarkar was under the influence of western writer _______.",
        "options": ["Spencer", "Rousseau", "Shakespeare", "Martin Luther"],
        "category": "History"
    },
    {
        "num": 56,
        "text": "Jignesh bought 100 shares of one company at price Rs. 1288.55 each and on the same day he sold at price Rs. 1338.45. If broker's commission is 0.001% on buying amount and selling amount then how much profit Jignesh got?",
        "options": ["Rs. 3827.25", "Rs. 4827.25", "Rs. 4727.30", "Rs. 4527.25"],
        "category": "Aptitude"
    },
    {
        "num": 57,
        "text": "Who has written the autobiography 'Dreams from my father'?",
        "options": ["Indira Gandhi", "Barack Obama", "Sheikh Hasina", "Benazir Bhutto"],
        "category": "Current Affairs"
    },
    {
        "num": 58,
        "text": "Ramakant was present on 198 days in School Academic Year. His presentee was 90%. Find out the number of working days of the school in that year.",
        "options": ["220 days", "210 days", "200 days", "215 days"],
        "category": "Aptitude"
    },
    {
        "num": 59,
        "text": "Who advices the Governor to dissolve the Legislative Assembly?",
        "options": ["Chief Minister", "Prime Minister", "Home Minister", "Lokayukta"],
        "category": "Indian Polity"
    },
    {
        "num": 60,
        "text": "In India the alternating current (A.C.) changes its direction _______ times within one second.",
        "options": ["10", "50", "500", "100"],
        "category": "Science"
    },
    {
        "num": 61,
        "text": "The name Kanu Sanyal is related to _______.",
        "options": ["Sport", "Bio-technology", "Film", "Peasant Workers Movement"],
        "category": "Current Affairs"
    },
    {
        "num": 62,
        "text": "Who appoints the Judges of High Court?",
        "options": ["Governor", "President", "Chief Minister", "Prime-Minister"],
        "category": "Indian Polity"
    },
    {
        "num": 63,
        "text": "Maharshi Karve was remarried with widow from _______.",
        "options": ["Seva Sadan", "Sharada Sadan", "Anath Balikaashram", "Mukti Sadan"],
        "category": "History"
    },
    {
        "num": 64,
        "text": "The Bhakra Nangal dam has been constructed on the river _______.",
        "options": ["Sutlej", "Ravi", "Beas", "Ganga"],
        "category": "Geography"
    },
    {
        "num": 65,
        "text": "Which of the following is not a place of Ashtavinayaka?",
        "options": ["Pali", "Ranjangaon", "Morgaon", "Ganpatipule"],
        "category": "Geography"
    },
    {
        "num": 66,
        "text": "Who among the following was the founder member of Swaraj Party?",
        "options": ["Mahatma Gandhi", "Lokmanya Tilak", "Chittaranjan Das", "Justice Ranade"],
        "category": "History"
    },
    {
        "num": 67,
        "text": "_______ is the Chair Person of the Planning Commission of India.",
        "options": ["President of India", "Vice-President of India", "Finance Minister of India", "Prime Minister of India"],
        "category": "Indian Polity"
    },
    {
        "num": 68,
        "text": "In which district National Defence Academy is located?",
        "options": ["Thane", "Pune", "Nashik", "Kolhapur"],
        "category": "Geography"
    },
    {
        "num": 69,
        "text": "In which country did the Swine Flu epidemic originate in 2009?",
        "options": ["France", "South Africa", "Japan", "Mexico"],
        "category": "Current Affairs"
    },
    {
        "num": 70,
        "text": "_______ wrote poetry under the penname of 'Govindagraj'.",
        "options": ["G. N. Dandekar", "V. V. Shirwadkar", "Ram Ganesh Gadkari", "A. R. Deshpande"],
        "category": "History"
    },
    {
        "num": 71,
        "text": "Period of Eighth Five Year Plan was _______.",
        "options": ["1992 to 1997", "1990 to 1995", "1991 to 1996", "None of these"],
        "category": "Economics"
    },
    {
        "num": 72,
        "text": "Decimal fraction form of 245/20 = _______.",
        "options": ["12.25", "1.225", "122.5", "0.1225"],
        "category": "Aptitude"
    },
    {
        "num": 73,
        "text": "Who was the first editor of the newspaper 'Kesari'?",
        "options": ["Lokmanya Tilak", "Gopal Ganesh Agarkar", "Balshastri Jambhekar", "Dr. Bhau Daji Lad"],
        "category": "History"
    },
    {
        "num": 74,
        "text": "_______ is used as catalyst in the manufacture of sulphur trioxide (SO\u2083).",
        "options": ["Vanadium pentoxide (V\u2082O\u2085)", "Manganese dioxide (MnO\u2082)", "Calcium carbonate (CaCO\u2083)", "Silver nitrate (AgNO\u2083)"],
        "category": "Science"
    },
    {
        "num": 75,
        "text": "5\u2070 \u00d7 8\u2070 \u00d7 9\u2070 = ?",
        "options": ["0", "1", "360", "None of these"],
        "category": "Aptitude"
    },
    {
        "num": 76,
        "text": "Where did Lala Hardayal established the Gadar Organisation?",
        "options": ["Canada (America)", "Holland", "France", "Russia"],
        "category": "History"
    },
    {
        "num": 77,
        "text": "In Pune, Mahatma Phule started first school for girls in _______.",
        "options": ["1848", "1851", "1873", "1883"],
        "category": "History"
    },
    {
        "num": 78,
        "text": "The first Indian Railway train from Mumbai to Thane was started in _______.",
        "options": ["1835", "1850", "1853", "1870"],
        "category": "History"
    },
    {
        "num": 79,
        "text": "Total districts in Maharashtra are _______.",
        "options": ["26", "31", "33", "35"],
        "category": "Geography"
    },
    {
        "num": 80,
        "text": "Dr. Ambedkar decided to burn 'Manu Smruti' at _______.",
        "options": ["Mahad", "Pune", "Pandharpur", "Satara"],
        "category": "History"
    },
    {
        "num": 81,
        "text": "Solve: [(78/13 \u00d7 49/42) + (25/(5\u00d73) \u00d7 63/35)] \u00f7 (2\u00d72\u00d72 / 4\u00d72\u00d716) = _______.",
        "options": ["16", "1.6", "160", "320"],
        "category": "Aptitude"
    },
    {
        "num": 82,
        "text": "The words 'Socialist' and 'Secular' were incorporated in the Preamble of the Indian Constitution through which constitutional amendment?",
        "options": ["73rd", "26th", "42nd", "61st"],
        "category": "Indian Polity"
    },
    {
        "num": 83,
        "text": "Using the SONAR, sound pulses are emitted at the surface of sea water. The echo is heard after 4 seconds. Find the depth of the sea. (Velocity of sound in sea water is 1550 m/s).",
        "options": ["3100 m", "6200 m", "24800 m", "1550 m"],
        "category": "Science"
    },
    {
        "num": 84,
        "text": "What is the difference in the averages of numbers from 1 to 20 and numbers from 1 to 10?",
        "options": ["10.5", "5", "5.5", "10"],
        "category": "Aptitude"
    },
    {
        "num": 85,
        "text": "A protein molecule is made up of _______.",
        "options": ["Lipid", "Amino acids", "Carbohydrates", "Nucleic acids"],
        "category": "Science"
    },
    {
        "num": 86,
        "text": "Maharshi Karve was honoured as 'Bharat Ratna' and '_______ ' by Government of India.",
        "options": ["Padmashree", "Padmabhushan", "Bharat Mitra", "L.L.D"],
        "category": "History"
    },
    {
        "num": 87,
        "text": "Who established the 'Scheduled Caste Federation'?",
        "options": ["Maharshi Vitthal Ramaji Shinde", "Rajarshi Shahu Maharaj", "Dr. Babasaheb Ambedkar", "Ramanand Saraswati"],
        "category": "History"
    },
    {
        "num": 88,
        "text": "_______ are known as the power houses of the cells.",
        "options": ["Lysosomes", "Centrosomes", "Mitochondria", "Vacuoles"],
        "category": "Science"
    },
    {
        "num": 89,
        "text": "A committee to study the causes of farmer's suicide in Maharashtra was formed under the chairmanship of _______.",
        "options": ["Dr. Bhalchandra Mungekar", "Dr. Vijay Bhatkar", "Dr. Narendra Jadhav", "Dr. Vasant Gowarikar"],
        "category": "Current Affairs"
    },
    {
        "num": 90,
        "text": "Which of the following is not the example of protozoa?",
        "options": ["Hydra", "Amoeba", "Plasmodium", "Euglena"],
        "category": "Science"
    },
    {
        "num": 91,
        "text": "The All India Khilafat Conference was held at _______ in 1919.",
        "options": ["Delhi", "Calcutta", "Bombay", "Madras"],
        "category": "History"
    },
    {
        "num": 92,
        "text": "Who founded the 'Bahishkrut Hitakarini Sabha'?",
        "options": ["Mahatma Phule", "Maharshi Vitthal Ramaji Shinde", "Dr. Babasaheb Ambedkar", "Rajarshi Shahu Maharaj"],
        "category": "History"
    },
    {
        "num": 93,
        "text": "In which year the 'Chavdar Tale Satyagraha' was started in Mahad?",
        "options": ["1923 A.D.", "1925 A.D.", "1926 A.D.", "1927 A.D."],
        "category": "History"
    },
    {
        "num": 94,
        "text": "Pre-Monsoon Showers in Maharashtra are known as _______.",
        "options": ["Cherry-Blossom-Showers", "Kalbaisakhi", "Norwesters", "Mango-Showers"],
        "category": "Geography"
    },
    {
        "num": 95,
        "text": "There is a bicameral legislature in _______.",
        "options": ["Assam", "Uttar Pradesh", "Punjab", "Tamilnadu"],
        "category": "Indian Polity"
    },
    {
        "num": 96,
        "text": "Find the odd word.",
        "options": ["Potatoes", "Rice", "Oil seeds", "Jawar"],
        "category": "Aptitude"
    },
    {
        "num": 97,
        "text": "Which of the following newspaper was not started by Dr. Ambedkar?",
        "options": ["Bahishkrit Bharat", "Janata Patra", "Samata Patra", "Nava Jawan"],
        "category": "History"
    },
    {
        "num": 98,
        "text": "Area wise largest State of India (as in 2001) is _______.",
        "options": ["Madhya Pradesh", "Uttar Pradesh", "Rajasthan", "Karnataka"],
        "category": "Geography"
    },
    {
        "num": 99,
        "text": "A cylindrical pot has a height of 10 cm and a diameter of 16 cm. How many litres of milk it can hold?",
        "options": ["2 litres", "1.5 litres", "1.75 litres", "2.25 litres"],
        "category": "Aptitude"
    },
    {
        "num": 100,
        "text": "Who has the power to call the Gram Sabha?",
        "options": ["Sarpanch", "Gramsevak", "B.D.O.", "Tahasildar"],
        "category": "Indian Polity"
    },
    {
        "num": 101,
        "text": "At what temperature \u00b0C and \u00b0F both has same value?",
        "options": ["4\u00b0C", "\u22124\u00b0C", "\u221240\u00b0C", "+40\u00b0C"],
        "category": "Science"
    },
    {
        "num": 102,
        "text": "How many members can be nominated by the Governor in Legislative Assembly?",
        "options": ["Only one", "One sixth of the total number of members present in the Assembly", "One twelfth of the total number of members present in the Assembly", "Only twelve"],
        "category": "Indian Polity"
    },
    {
        "num": 103,
        "text": "The term of the member of the Legislative Council is _______ years.",
        "options": ["5", "6", "2\u00bd", "4\u00bd"],
        "category": "Indian Polity"
    },
    {
        "num": 104,
        "text": "L.P.G. contains the chemical components _______.",
        "options": ["Methane and Butane", "Methane and Ethane", "Methane and Ethanol", "Butane and Isobutane"],
        "category": "Science"
    },
    {
        "num": 105,
        "text": "Leakage of poisonous gas Methyl Isocyanide from a factory took lives of thousands at _______.",
        "options": ["Bhuj", "Bhopal", "Mumbai", "Bhuvaneshwar"],
        "category": "Current Affairs"
    },
    {
        "num": 106,
        "text": "Who founded the 'Balhatya Pratibandhak Gruha' at Pune?",
        "options": ["Maharshi Dhondo Keshav Karve", "Ramabai Ranade", "Mahatma Jyotirao Phule", "Ishwarchandra Vidyasagar"],
        "category": "History"
    },
    {
        "num": 107,
        "text": "Coastal region of _______ State receives rainfall due to North-East Monsoon winds.",
        "options": ["Goa", "Punjab", "Maharashtra", "Tamilnadu"],
        "category": "Geography"
    },
    {
        "num": 108,
        "text": "The weight of human brain is approximately _______ grams.",
        "options": ["800 to 1000", "1300 to 1400", "1500 to 1600", "500 to 600"],
        "category": "Science"
    },
    {
        "num": 109,
        "text": "Nilima invested Rs. 60,000 in a nationalised bank for 2 years at the rate of 8.5 p.c. p.a. at compound interest. What amount will Nilima receive from the bank at the end of 2 years?",
        "options": ["Rs. 70,433.5", "Rs. 70,200", "Rs. 70,933.5", "Rs. 70,633.5"],
        "category": "Aptitude"
    },
    {
        "num": 110,
        "text": "What is the name of fighter aircraft that President Pratibha Patil has flown?",
        "options": ["Mig 29", "Sukhoi 30 MKI", "Jaguar", "C-Harrier"],
        "category": "Current Affairs"
    },
    {
        "num": 111,
        "text": "Who convenes the meeting of the Gram Panchayat and the Gram Sabha and presides over them?",
        "options": ["Sarpanch", "Deputy Sarpanch", "Gramsevak", "Member"],
        "category": "Indian Polity"
    },
    {
        "num": 112,
        "text": "Who gave the slogan 'Do or Die'?",
        "options": ["Rashbihari Bose", "Motilal Nehru", "Mahatma Gandhi", "Bankimchandra Chatterjee"],
        "category": "History"
    },
    {
        "num": 113,
        "text": "Who had opposed the woman reservation bill in Parliament?",
        "options": ["Bharatiya Janata Party", "Shiv Sena", "Bahujan Samaj Party", "Nationalist Congress Party"],
        "category": "Indian Polity"
    },
    {
        "num": 114,
        "text": "Hepatitis B is caused by _______.",
        "options": ["HAV", "HIV", "HBV", "None of the above"],
        "category": "Science"
    },
    {
        "num": 115,
        "text": "_______ receives highest rainfall in India.",
        "options": ["Konkan", "Malbar", "Cherapunji", "Gujrat"],
        "category": "Geography"
    },
    {
        "num": 116,
        "text": "Who is contained in the President's electoral college?",
        "options": ["Both the houses of Parliaments and all Legislatures of the States", "Both the houses of Parliaments and Legislative assemblies", "Only Lok Sabha and Legislative assemblies", "Both the houses of Parliaments and State Councils"],
        "category": "Indian Polity"
    },
    {
        "num": 117,
        "text": "What is the name of the party of Bangladesh Prime Minister Sheikh Hasina?",
        "options": ["Awami Ligue", "Bangladesh Nationalist Party", "Bangladesh People Party", "Jamat-e-Islami"],
        "category": "Current Affairs"
    },
    {
        "num": 118,
        "text": "Who among the following film actors established a new political party in August 2008?",
        "options": ["Rajnikant", "Govinda", "Kamal Hassan", "Chiranjeevi"],
        "category": "Current Affairs"
    },
    {
        "num": 119,
        "text": "What was the surname of famous 'Tamasha' artist Chandrakant Dhawalpurikar?",
        "options": ["Belhekar", "Jadhav", "Kadam", "Mohite"],
        "category": "History"
    },
    {
        "num": 120,
        "text": "Which of the following contains more proportion of calcium?",
        "options": ["Pulses", "Vegetable Oil", "Milk", "Orange"],
        "category": "Science"
    },
    {
        "num": 121,
        "text": "What is the reason for increase in judicial activism?",
        "options": ["The growth of population and courts", "Public interest litigations", "Globalizations and liberalization", "Corruption"],
        "category": "Indian Polity"
    },
    {
        "num": 122,
        "text": "Who has started the strike against Court decision in case of Lokmanya Tilak's imprisonment in June 1908?",
        "options": ["The workers of Bombay", "The workers of Poona", "The workers of Calcutta", "None of them"],
        "category": "History"
    },
    {
        "num": 123,
        "text": "Which type of soil is observed on the coastal region of Konkan?",
        "options": ["Alluvial soil", "Regur soil", "Red soil", "Black soil"],
        "category": "Geography"
    },
    {
        "num": 124,
        "text": "Maximum gap between two sessions of Parliament can be of _______.",
        "options": ["three months", "two months", "six months", "twelve months"],
        "category": "Indian Polity"
    },
    {
        "num": 125,
        "text": "'The Muslim League' was founded in the year _______.",
        "options": ["1906", "1908", "1909", "1919"],
        "category": "History"
    },
    {
        "num": 126,
        "text": "If (3, m) satisfy the equation 3x + 5y = 29 the value of m = _______.",
        "options": ["\u22124", "+4", "+3", "\u22123"],
        "category": "Aptitude"
    },
    {
        "num": 127,
        "text": "Maharshi Karve was born in the village _______ of Ratnagiri District.",
        "options": ["Dapoli", "Murud", "Shekhali", "Khed"],
        "category": "History"
    },
    {
        "num": 128,
        "text": "Who was the founder of the city of Agra?",
        "options": ["Mohammad Tughlaq", "Alauddin Khilji", "Sikandar Lodhi", "Ibrahim Lodhi"],
        "category": "History"
    },
    {
        "num": 129,
        "text": "G. G. Agarkar had started _______ Newspaper.",
        "options": ["Dnyanasindhu", "Dnyanaprakash", "Shatapatre", "Sudharak"],
        "category": "History"
    },
    {
        "num": 130,
        "text": "The cost of 15 cycles is Rs. 16,500/-. Find the cost of 11 cycles.",
        "options": ["Rs. 12,200/-", "Rs. 12,100/-", "Rs. 13,000/-", "Rs. 12,400/-"],
        "category": "Aptitude"
    },
    {
        "num": 131,
        "text": "The modern periodic table is based on _______.",
        "options": ["the principle of octaves", "the atomic number of elements", "the atomic mass of elements", "the presence of triods of elements"],
        "category": "Science"
    },
    {
        "num": 132,
        "text": "Dr. Ambedkar demanded for _______ in Round Table Conference.",
        "options": ["Separate electorate", "Reservation", "Education for women", "Temple Entry"],
        "category": "History"
    },
    {
        "num": 133,
        "text": "In 1899 A.D. _______ started 'Anatha Balikashram'.",
        "options": ["Mahatma Phule", "Shahu Maharaj", "Dhondo Keshav Karve", "Sayajirao Gaikawad"],
        "category": "History"
    },
    {
        "num": 134,
        "text": "Who was given 'Rajiv Gandhi Khel Ratna Award 2007'?",
        "options": ["Abhinav Bindra", "M. S. Dhoni", "Sania Mirza", "Sachin Tendulkar"],
        "category": "Current Affairs"
    },
    {
        "num": 135,
        "text": "What is the range of Agni \u2013 III ballistic missile?",
        "options": ["3500 km", "5000 km", "3000 km", "2000 km"],
        "category": "Science"
    },
    {
        "num": 136,
        "text": "Hamas is a militant organisation fighting against which of the following countries?",
        "options": ["Sudan", "Israel", "Brazil", "Syria"],
        "category": "Current Affairs"
    },
    {
        "num": 137,
        "text": "What is contained in a parliamentary form of government?",
        "options": ["The Executive controls the legislature", "The Legislature controls the executive", "The Judiciary controls the executive", "The Legislature controls the judiciary"],
        "category": "Indian Polity"
    },
    {
        "num": 138,
        "text": "NABARD is a _______.",
        "options": ["Board", "Bank", "Bureau", "Department"],
        "category": "Economics"
    },
    {
        "num": 139,
        "text": "In photosynthesis, water and carbon dioxide combine to form _______.",
        "options": ["Carbon", "Carbohydrates", "Nitrogen", "Hydrogen"],
        "category": "Science"
    },
    {
        "num": 140,
        "text": "Who was the commander of a battalion 'Rani of Jhansi' in Azad Hind Sena?",
        "options": ["Dr. Lakshmi Swaminathan", "Sarojini Naidu", "Shanti Ghosh", "Pritilata Waddedar"],
        "category": "History"
    },
    {
        "num": 141,
        "text": "Solve: 35.05 / 2.5 = _______.",
        "options": ["140.2", "14.02", "1402", "3.2"],
        "category": "Aptitude"
    },
    {
        "num": 142,
        "text": "In _______ Dhondo Keshav Karve started 'Vidhava Vivahottejak Mandal'.",
        "options": ["1873 AD", "1887 AD", "1893 AD", "1899 AD"],
        "category": "History"
    },
    {
        "num": 143,
        "text": "_______ is a thermal power station in Maharashtra.",
        "options": ["Trombay", "Dabhol", "Jayakwadi", "Tarapur"],
        "category": "Geography"
    },
    {
        "num": 144,
        "text": "Which is the structural formula of Acetylene?",
        "options": ["H\u2212C=C\u2212H", "H\u2212C\u2261C\u2212H", "H\u2082C=CH\u2082 (Ethylene structure)", "CH\u2084 (Methane-like structure)"],
        "category": "Science"
    },
    {
        "num": 145,
        "text": "The 'Queen's Proclamation' was declared in _______.",
        "options": ["November - 1858", "December - 1885", "October - 1905", "August - 1947"],
        "category": "History"
    },
    {
        "num": 146,
        "text": "Sound waves do not travel through _______.",
        "options": ["Solids", "Liquids", "Gases", "Vacuum"],
        "category": "Science"
    },
    {
        "num": 147,
        "text": "Who among the following Peshwa's was popularly known as a Nanasaheb?",
        "options": ["Baji Rao", "Balaji Vishwanath", "Balaji Baji Rao", "Raghunath Rao"],
        "category": "History"
    },
    {
        "num": 148,
        "text": "Which of the following rivers in Maharashtra is flowing westward?",
        "options": ["Tapi", "Godavari", "Krishna", "Bhima"],
        "category": "Geography"
    },
    {
        "num": 149,
        "text": "Out of total area of India, it is necessary to have _______ per cent area under forest.",
        "options": ["32", "30", "31", "33"],
        "category": "Geography"
    },
    {
        "num": 150,
        "text": "The exponent of Economic Drain Theory was:",
        "options": ["Dadabhai Naoroji", "Ganesh Joshi", "Gopal Hari Deshmukh", "M.G. Ranade"],
        "category": "History"
    },
]

def build_quiz(lang):
    if lang == "english":
        title = "MPSC Police Sub Inspector (PSI) Pre 2010 (Set A) (English)"
        language = "english"
    else:
        title = "MPSC Police Sub Inspector (PSI) Pre 2010 (Set A) (\u092e\u0930\u093e\u0920\u0940)"
        language = "marathi"

    questions = []
    for q in questions_data:
        n = q["num"]
        ans_num = SET_A_ANSWERS[n]
        questions.append({
            "id": n,
            "text": q["text"],
            "options": {
                "A": q["options"][0],
                "B": q["options"][1],
                "C": q["options"][2],
                "D": q["options"][3],
            },
            "correctAnswer": ANSWER_MAP[ans_num],
            "explanation": "",
            "category": q["category"],
        })

    return {
        "id": f"psi_pre_2010_{lang}",
        "title": title,
        "createdAt": "2010-06-20",
        "questions": questions,
        "language": language,
    }

if __name__ == "__main__":
    os.makedirs("public", exist_ok=True)
    for lang in ["english", "marathi"]:
        quiz = build_quiz(lang)
        fname = f"public/psi_pre_2010_{lang}.json"
        with open(fname, "w", encoding="utf-8") as f:
            json.dump(quiz, f, ensure_ascii=False, indent=2)
        print(f"Wrote {fname}  ({len(quiz['questions'])} questions)")
