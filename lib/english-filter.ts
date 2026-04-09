/**
 * Block-based English filter for bilingual (Marathi + English) MPSC PDFs.
 *
 * Strategy:
 * 1. Remove structural noise (page headers, rough-work markers, etc.)
 * 2. Split text into question blocks by question-number markers (1., 2., …)
 * 3. Within each block, find the first "English anchor" line
 * 4. Re-attach the question number from the Marathi line to the English anchor
 * 5. Keep from anchor to end of block, applying strict per-line quality gate
 */

const ENG = new Set([
  "the","and","for","that","was","are","with","his","her","him","from","not",
  "but","which","have","had","has","been","were","this","they","she","will",
  "can","its","than","into","some","these","those","over","under","between",
  "through","before","during","since","while","because","then","out","all",
  "both","any","most","many","much","such","very","just","also","only","each",
  "other","more","about","after","being","when","where","what","who","how",
  "would","could","should","shall","may","must","does","did","you","our",
  "their","own","same","new","old","first","last","next","good","bad","high",
  "low","long","short","great","big","small","large","right","wrong","free",
  "total","major","minor","every","another","enough","several","still",
  "already","never","always","often","here","there","however","therefore",
  "moreover","meanwhile","otherwise","either","neither","none","whether",
  "get","got","set","put","take","took","give","gave","make","made","come",
  "came","know","knew","find","found","tell","told","help","show","try","tried",
  "ask","need","keep","kept","let","begin","began","seem","leave","left","call",
  "called","want","run","ran","hold","held","turn","bring","brought","lead",
  "led","start","end","stop","open","close","pass","passed","raise","move",
  "play","pay","paid","meet","met","include","included","continue","establish",
  "established","create","created","build","built","appoint","appointed",
  "introduce","introduced","enact","enacted","form","formed","achieve","award",
  "awarded","receive","received","serve","served","write","wrote","publish",
  "published","launch","launched","develop","developed","improve","elect",
  "elected","select","selected","recognise","recognised","inaugurate",
  "inaugurated","announce","announced","celebrate","celebrated","discover",
  "discovered","legislate","legislated","legalise","legalised","strive",
  "defend","render","promote","provide","hang","erected","succeeded","filed",
  "produce","producing","originate","originates","separate","separated",
  "divide","divided","locate","located","define","defined","convert","require",
  "fill","filled","measure","measuring","manufacture","manufactures","decide",
  "deciding","characterise","characterised","complete","completed","deprived",
  "prosecuted","punished","compelled","vested","exercised","consist","chosen",
  "regulate","migrated","residing","qualified","enumerate","mentioned",
  "relate","related","derive","derived","touch","touched","exclude","excluding",
  "identify","observe","consider","match","state","rises","constantly",
  "time","year","years","day","days","people","man","men","woman","women",
  "child","children","world","life","hand","part","place","case","week",
  "company","system","program","programme","question","work","works",
  "government","number","numbers","point","home","water","room","area",
  "money","fact","month","right","study","book","books","word","words",
  "business","issue","side","kind","head","house","service","power","hour",
  "hours","game","line","member","members","law","laws","city","community",
  "name","names","rate","price","cost","costs","tax","bank","banks","fund",
  "budget","trade","market","profit","income","growth","production","industry",
  "agriculture","policy","plan","scheme","education","health","development",
  "research","technology","science","history","period","century","modern",
  "ancient","era","age","river","mountain","valley","lake","pass","sea",
  "island","coast","district","districts","province","provinces","capital",
  "state","states","country","region","zone","plateau","forest","land","soil",
  "climate","environment","rainfall","monsoon","temperature","pressure",
  "wind","desert","type","role","unit","units","example","group","session",
  "class","order","family","range","field","basis","way","aim","sum","ratio",
  "series","terms","row","column","columns","figure","figures","diagram",
  "mark","position","speed","distance","capacity","pool","sides","error",
  "formula","equation","value","triangle","triangles","rectangle","surface",
  "pillar","height","width","length","radius","volume","percent","percentage",
  "camp","facility","office","station","theme","award","brand","coach",
  "sport","creator","champion","championship","summit","hostel","poetry",
  "poet","writer","couple","action","condition","mission","orphanage",
  "uprising","rebellion","revolt","battle","revolution","war","treaty",
  "movement","party","congress","union","federation","society","league",
  "leader","leaders","chairman","secretary","officer","general","peasant",
  "peasants","farmer","farmers","labourer","labourers","worker","workers",
  "landlord","landlords","trader","traders","classes","commissioner",
  "gallows","sedition","bomb","patronage","widow","marriage","split",
  "unity","cooperation","discipline","organization","entrepreneurship",
  "indigo","foundation","cabinet","post","constituency","dyarchy",
  "coal","reactor","assistance","catchment","degradation","runoff",
  "pomegranate","wheat","variety","tributary","tributaries","basin",
  "foodgrains","record","tonnes","productivity","millets","jowar",
  "contingency","audit","reports","dashboard","inclusion","deficit",
  "expenditure","receipts","borrowings","revenue","repo","credit",
  "authorisation","operations","accounting","accrual","materiality",
  "entity","recession","depression","inflation","earners","individuals",
  "regulation","banking","branch","expansion","deposit","mobilisation",
  "sector","existence","formation","accordance","princely","classification",
  "liberty","procedure","offence","witness","provisions","article","articles",
  "bill","bills","amendment","provision","legislature","assembly","council",
  "governor","president","minister","ministers","chief","speaker","panchayat",
  "panchayats","sabha","lok","rajya","gram","election","elections",
  "citizenship","fundamental","directive","duties","rights","principles",
  "constitution","parliament","republic","democracy","federal",
  "insurance","airline","magic","shooting","hockey","badminton",
  "harmony","healing","musical","performances","worldwide",
  "chairperson","tropical","humid","population","western","eastern",
  "northern","southern","peninsular","vapour","ghats","untouchable",
  "upliftment","depressed","recognised","abolished","proclaimed",
  "coastal","interior","decreases","increases","distribution",
  "vegetation","eastward","westward","holding","karnataka","bengaluru",
  "chennai","hyderabad","andhra","telangana","tamil","nadu","goa",
  "assam","manipur","mizoram","tripura","meghalaya","sikkim",
  "arunachal","jharkhand","chhattisgarh","odisha","orissa","rajasthan",
  "gujarat","madhya","uttar","uttarakhand","jammu","kashmir","ladakh",
  "pahalgam","anantnag","chairwoman","labour","laborer",
  "nationalized","galena","dolamite","dolomite","mesothermal",
  "paragraph","sentence","sentences","paragraph","paragraphs",
  "option","pair","below","columns","characteristic","characteristics",
  "objectives","objective","sector","sectors","scheme","schemes",
  "sub","included","commissioner","commissioners","launched",
  "atom","atomic","particle","electron","proton","neutron","photon","energy",
  "mass","element","isotope","carbon","helium","alpha","beta","gamma","rays",
  "wave","waves","electromagnetic","wavelength","charge","electric","magnetic",
  "fields","curie","radioactivity","substance","heat","fusion","latent",
  "solid","liquid","melting","cell","blood","vitamin","mineral","calcium",
  "phosphorus","plant","plants","animal","animals","species","phylum",
  "algae","bryophyte","pteridophyte","gymnosperm","cycas","funaria",
  "mollusca","annelida","arthropoda","echinodermata","vertebrate",
  "vertebrates","primitive","barbels","clotting","diabetes","tissue",
  "tissues","chlorosis","wilting","necrotic","metabolism","manganese",
  "copper","zinc","boron","iron","aluminium","bauxite","ore","principle",
  "troposphere","stratosphere","mesosphere","thermosphere","atmospheric",
  "layer","layers","ground","upwards","abundant","deficiency","stunted",
  "dark","green","colouration","malformed","contains","small","areas","dead",
  "sum","product","ratio","average","increase","decrease","percentage",
  "consecutive","even","odd","divisible","digit","constant","absolute",
  "relative","remaining","manufacturing","wholesaler","retailer","electronic",
  "equipment","rectangular","cylindrical","curved","taller",
  "tallest","shortest","youngest","oldest","among","shifted","places",
  "towards","correct","incorrect","mobile","users",
  "india","indian","maharashtra","mumbai","pune","nagpur","nashik","kolhapur",
  "delhi","bengal","bihar","kerala","madras","bombay","vidarbha","tibet",
  "sichuan","census","suburban","palghar","ratnagiri","sindhudurg",
  "bhandara","gadchiroli","chandrapur","lakhmapur","khanapur",
  "police","act","supreme","court","courts","territorial","constituencies",
  "language","implementation","relating","tongue","primary","level",
  "directions","hindi","australia","canada","ireland","usa","citizen",
  "qualification","vice","warrant","seal","pleasure","subordinate",
  "directly","officers","steersman","steering","wheel","ship","master",
  "moon","lesser","stars","fold","concern","per","accused","personal",
  "reservation","seats","disqualification","duration","membership",
  "composition","legislative","direct",
  "january","february","march","april","may","june","july","august",
  "september","october","november","december","million","billion",
  "thousand","hundred","zero","sir","mrs","doctor","professor",
  "answer","options","statement","statements","pairs","list","item",
  "select","find","observe","consider","match","given","below","above",
  "following","social","political","economic","financial","commercial",
  "agricultural","industrial","annual","fiscal","monetary","quantitative",
  "negative","positive","compulsory","substantial","independent",
  "concurrent","separate","particular","specific","approximate",
  "entire","partial","additional","minimum","maximum",
  "according","regarding","concerning","including","excluding","relating",
  "upon","along","across","within","without","towards","against",
  "among","between","beyond","despite","except",
  "true","false","none","only","both","certain","different","important",
  "special","common","general","public","private","national",
  "dought","couple","hydropower","hydro","pilot","project","hydrogen",
  "multipurpose","satlaj","vidyut","nigam","himachal","pradesh",
  "uttarakhand","punjab","haryana","deputy","executive","prudential",
  "kotak","audi","zealand","spiritual","varanasi",
  "prestigious","best","fism","computer","security",
  "incident","response","team","csirt","situated","anantnag",
  "lidder","nallah","attracts","tourists","transit","shri","mata",
  "vaishno","devi","advocate","saraf","birendra",
  "endeavour","achievement","excellence","spheres","collective",
  "individual","activity","parent","guardian","opportunities",
  "ward","six","fourteen","promote","equal","justice","legal","aid",
  "poor","render","upon","called","defend",
  "using","printed","pure","projected","robust","continue","path",
  "pivotal","moment","bringing","together","nations","address",
  "critical","challenges","digital","divide","safety",
  "constructing","largest","expected","completed","dam",
  "became","ambassador","ceo","next","appointed","director",
  "international","monetary","fund",
  "won","prestigious","best","creator","championship",
  "youth","spiritual","held","theme","celebrated","annually",
  "encourages","public","performances","worldwide",
  "security","incident","response","facility","delhi",
  "situated","attracts","tourists","transit","camp",
  "powers","authority","responsibilities","composition","duration",
  "advocate","formation","existence","accordance","provisions",
  "article","constitution","shall","appointed",
  "strive","excellence","spheres","individual","collective",
  "activity","nation","rises","higher","levels","endeavour",
  "parent","guardian","opportunities","education",
  "promote","equal","justice","legal","aid","poor",
  "defend","country","render","national","service",
  "served","chief","minister","longest","period","till",
  "mentioned","special","procedure","implementation","certain",
  "laws","relating","language","used","supreme","court","high",
  "courts","bills","facilities","mother","tongue","primary",
  "directions","development",
  "item","constitution","country","derived",
  "directive","principles","state","policy",
  "fundamental","rights","concurrent","list","union",
  "relations","greater","powers",
  "rights","citizenship","certain","persons","have","migrated",
  "origin","residing","outside","parliament","regulate",
  "incorrect","qualification","citizen","completed","age",
  "forty","five","qualified","election","member","house","people",
  "statements","role","prime","minister","government",
  "master","steersman","steering","wheel","ship",
  "contained","four","fold","classification","units",
  "princely","states","legislature","governor","provinces",
  "commissioner","andaman","nicobar","islands",
  "shall","hold","office","during","pleasure","president",
  "state","shall","appointed","president","warrant",
  "hand","seal","executive","power","vested","governor",
  "exercised","directly","through","officers","subordinate",
  "accordance","constitution",
  "council","ministers","chief","minister","head","aid","advise",
  "gram","sabha","reservation","seats","elections","panchayats",
  "disqualification","membership",
  "person","shall","deprived","life","personal","liberty",
  "except","according","procedure","established","law",
  "person","shall","prosecuted","punished","same","offence",
  "more","than","once","accused","any","offence","shall",
  "compelled","witness","against","himself",
  "state","shall","provide","free","compulsory","education",
  "all","children","age","six","fourteen","years",
  "every","state","there","shall","legislature","consist",
  "governor","where","there","two","houses","legislature",
  "one","shall","known","legislative","council","other",
  "assembly","where","there","only","one","house",
  "shall","consist","not","more","than","five","hundred",
  "not","less","than","sixty","members","chosen",
  "direct","election","territorial","constituencies",
  "enumerate","fundamental","duties","articles","parts",
  "indian","constitution",
  "electromagnetic","waves","wavelength","very","short",
  "negative","charge","deflected","electric","magnetic",
  "fields","rays","having",
  "alpha","particle","beta","curie","electron","helium",
  "atom","radioactivity","photon","high","energy","gamma",
  "latent","heat","fusion","defined","amount","required",
  "heat","unit","mass","substance","raise","temperature",
  "through","convert","solid","liquid","melting","point",
  "without","rise","temperature",
  "correct","order","atmospheric","layers","ground","upwards",
  "stratosphere","mesosphere","thermosphere","troposphere",
  "principle","ore","aluminium","bauxite","malachite",
  "atomic","mass","number","most","abundant","isotope","carbon",
  "dentalium","belongs","phylum","mollusca","annelida",
  "arthropoda","echinodermata",
  "many","species","catfish","have","taste","buds","whisker",
  "like","projections","which","help","finding","food",
  "called","interdigitating","pharyngeal","teeth","barbels",
  "molariform","caniniform",
  "animal","belongs","group","agnatha","most","primitive",
  "scoliodon","dog","fish","rattus","black","rat",
  "petromyzon","lamprey","loris",
  "plant","group","example","algae","bryophyte","pteridophyte",
  "gymnosperm","cycas","funaria","lycopodium","chlamydomonas",
  "symptoms","phosphorus","deficiency","characterised","stunted",
  "growth","entire","plant","dark","green","colouration",
  "leaves","malformed","contains","small","areas","dead",
  "tissues","called","chlorosis","wilting","necrotic","spots",
  "leaf","curling",
  "mineral","plays","important","role","calcium","metabolism",
  "plants","manganese","copper","zinc","boron",
  "vitamin","helps","blood","clotting",
  "abo","blood","group","was","discovered","william","harvey",
  "karl","landsteiner","castello","sturli",
  "world","diabetes","day","celebrated",
  "sum","first","terms","series",
  "six","consecutive","even","numbers","next","three",
  "empty","pool","being","filled","water","constant","rate",
  "takes","hours","fill","capacity","much","more","time",
  "will","take","fill","pool","completely",
  "measuring","sides","rectangle","increase","one","side",
  "decrease","other","side","then","absolute","error",
  "percentage","calculation","area","rectangle",
  "curved","surface","cylindrical","pillar","volume","height",
  "company","manufactures","electronic","equipment","deciding",
  "price","includes","profit","itself","wholesaler","retailer",
  "how","much","percent","decided","price","more","than",
  "manufacturing","cost","equipment",
  "country","ratio","number","states","union","territories",
  "how","much","percentage","number","states","more",
  "than","number","union","territories","that","country",
  "mobile","users","percentage","increased","from","relative",
  "amount","work","done","men","same","that","done","boys",
  "similarly","amount","work","done","women","equal",
  "that","done","boys","men","boys","require","days",
  "finish","work","then","how","many","days","will",
  "needed","men","women","boys","complete","work",
  "average","price","books","while","average","price",
  "eight","books","remaining","two","books","price",
  "one","book","more","than","price","other","what",
  "price","each","these","two","books",
  "how","many","numbers","from","there","each","which",
  "exactly","divisible","and","also","has","digit",
  "row","girls","when","monika","was","shifted","four",
  "places","towards","right","she","became","from",
  "left","end","what","was","her","earlier","position",
  "from","right","end","row","before","shifting",
  "following","diagram","what","correct","figure",
  "question","mark",
  "taller","than","but","not","tall","tallest",
  "who","among","them","tallest",
  "find","out","value",
  "following","question","number","series","given",
  "which","one","number","wrong","find","out","that",
  "wrong","number",
  "observe","figures","below","identify","which","figure",
  "from","given","option","should","come","place",
  "question","mark","select","correct","option",
  "find","number","triangles","following","figure",
  "product","two","numbers","those","numbers","are",
  "ratio","then","what","sum","those","numbers",
  "couple","then","dought",
  "private","banks","recognised","startups","level","share",
  "july","growth","remain","financial","projected","gdp",
  "summit","chaired","marks","bringing","nations","digital",
  "divide","safety","world","largest","dam","river","tibet",
  "province","expected","year","hydro","power","pilot",
  "brand","ambassador","ceo","announced","airline",
  "won","award","championship","magic","creator",
  "theme","annually","encourages","performances",
  "facility","new","response","computer","security","incident",
  "situated","attracts","tourists","transit","camp","important",
  "district","correct","statements","about","sentences",
  "powers","authority","responsibilities","panchayats",
  "advocate","formation","existence","provisions",
  "strive","excellence","individual","collective","activity",
  "nation","higher","levels","endeavour","guardian",
  "opportunities","education","children","promote","justice",
  "legal","poor","defend","country","render","service",
  "served","longest","period","special","procedure","used",
  "laws","relating","language","supreme","high","courts",
  "bills","facilities","mother","tongue","directions",
  "derived","directive","principles","policy","concurrent",
  "list","relations","greater","citizenship","persons",
  "migrated","outside","regulate","qualification","citizen",
  "age","forty","five","qualified","member","people",
  "role","prime","government","steersman","steering","wheel",
  "ship","contained","four","classification","units","princely",
  "legislature","provinces","nicobar","islands","andaman",
  "hold","office","pleasure","president","warrant","hand",
  "seal","executive","vested","exercised","subordinate",
  "ministers","head","advise","reservation","elections",
  "disqualification","person","deprived","life","liberty",
  "procedure","established","prosecuted","punished","offence",
  "once","compelled","witness","against","himself","provide",
  "years","every","consist","governor","two","houses","one",
  "known","council","assembly","house","shall","not","more",
  "five","hundred","less","sixty","chosen","direct",
  "territorial","constituencies","enumerate","articles","parts",
  "electromagnetic","waves","wavelength","charge","deflected",
  "fields","rays","having","alpha","particle","beta","curie",
  "electron","helium","radioactivity","photon","gamma",
  "latent","heat","fusion","defined","amount","required",
  "unit","substance","raise","temperature","convert","solid",
  "liquid","melting","point","without","rise","order",
  "layers","ground","upwards","stratosphere","mesosphere",
  "thermosphere","troposphere","ore","aluminium","bauxite",
  "malachite","atomic","abundant","isotope","carbon",
  "dentalium","belongs","phylum","mollusca","annelida",
  "arthropoda","echinodermata","species","catfish","taste",
  "buds","whisker","projections","finding","food",
  "interdigitating","pharyngeal","teeth","barbels",
  "molariform","caniniform","animal","agnatha","primitive",
  "scoliodon","dog","fish","rattus","black","rat",
  "petromyzon","lamprey","loris","algae","bryophyte",
  "pteridophyte","gymnosperm","cycas","funaria","lycopodium",
  "chlamydomonas","symptoms","phosphorus","deficiency",
  "characterised","stunted","colouration","leaves","malformed",
  "tissues","chlorosis","necrotic","spots","leaf","curling",
  "mineral","plays","calcium","metabolism","plants",
  "manganese","copper","zinc","boron","vitamin","helps",
  "blood","clotting","abo","discovered","william","harvey",
  "karl","landsteiner","castello","sturli","diabetes",
  "celebrated","november","consecutive","even","numbers",
  "empty","pool","filled","constant","takes","fill",
  "completely","measuring","sides","rectangle","decrease",
  "absolute","error","calculation","curved","cylindrical",
  "pillar","volume","manufactures","equipment","deciding",
  "includes","itself","retailer","wholesaler","percent",
  "decided","manufacturing","cost","territories","ratio",
  "increased","relative","done","similarly","equal",
  "require","needed","complete","eight","remaining",
  "book","other","each","exactly","divisible","digit",
  "girls","monika","shifted","places","towards","became",
  "left","earlier","position","before","shifting","diagram",
  "question","mark","taller","yuvika","tallest","nilaksh",
  "sanvi","namita","chaitali","value","series","wrong",
  "observe","figures","identify","come","triangles",
  "product","those","couple","dought",
]);

export function filterEnglishText(rawText: string): string {
  const lines = rawText.split("\n");
  const cleaned = lines.filter((l) => !isNoise(l));
  const blocks = splitIntoBlocks(cleaned);

  const result: string[] = [];
  for (const block of blocks) {
    const english = extractEnglishPortion(block);
    result.push(...english);
  }
  return result.join("\n");
}

/* ------------------------------------------------------------------ */
/*  Noise removal                                                     */
/* ------------------------------------------------------------------ */

function isNoise(line: string): boolean {
  const t = line.trim();
  if (!t) return true;
  if (/^M\d+\s/i.test(t) && t.length < 25) return true;
  if (/SPACE FOR ROUGH WORK/i.test(t)) return true;
  if (/P\.?\s*T\.?\s*[O0]\.?/i.test(t) && t.length < 12) return true;
  if (/^[=\-_|]{2,}$/.test(t)) return true;
  if (/^-+\s*(oo+|0o+)\s*-+$/i.test(t)) return true;
  if (/BOOKLET\s*NO/i.test(t)) return true;
  if (/^2025\s+M\d+/i.test(t)) return true;
  if (t.length <= 4 && !/\d/.test(t)) return true;
  if (/^[|*#~`]+$/.test(t)) return true;
  if (/^[^a-zA-Z0-9]*$/.test(t)) return true;
  if (/^[_\-—\s.,;:]+$/.test(t)) return true;
  // Pattern: garbled lines with no English words
  if (countEng(t) === 0 && t.length > 5) {
    // Repeated characters (e.g., "RRRRRARARAARRE", "SERRE ww ww")
    if (/(.)\1{3,}/.test(t)) return true;
    // Garbled page header/footer patterns (SIFT, WRT, SRM, etc.)
    if (/S[IF][FR][TM]|WR[TN]|IFT|SRM|IRM/i.test(t) && /[A-Z]{4,}/.test(t)) return true;
  }
  return false;
}

/* ------------------------------------------------------------------ */
/*  Block splitting                                                   */
/* ------------------------------------------------------------------ */

function splitIntoBlocks(lines: string[]): string[][] {
  const blocks: string[][] = [];
  let current: string[] = [];
  for (const line of lines) {
    if (/^\s*\d{1,3}\.\s/.test(line) && current.length > 0) {
      blocks.push(current);
      current = [];
    }
    current.push(line);
  }
  if (current.length > 0) blocks.push(current);
  return blocks;
}

/* ------------------------------------------------------------------ */
/*  English extraction — the core logic                               */
/* ------------------------------------------------------------------ */

function extractEnglishPortion(block: string[]): string[] {
  const qnMatch = block[0]?.match(/^\s*(\d{1,3})\.\s/);
  if (!qnMatch) return [];
  const qnPrefix = `${qnMatch[1]}. `;

  let anchorIdx = -1;
  for (let i = 0; i < block.length; i++) {
    if (isEnglishAnchor(block[i])) {
      anchorIdx = i;
      break;
    }
  }
  if (anchorIdx === -1) return [];

  const result: string[] = [];
  for (let i = anchorIdx; i < block.length; i++) {
    if (!isAcceptableInEnglishZone(block[i])) continue;
    if (result.length === 0) {
      result.push(qnPrefix + block[i].replace(/^\s+/, ""));
    } else {
      result.push(block[i]);
    }
  }
  return result;
}

/* ------------------------------------------------------------------ */
/*  English anchor detection                                          */
/* ------------------------------------------------------------------ */

function isEnglishAnchor(line: string): boolean {
  const t = line.trim();
  if (!t) return false;

  if (/answer\s*options\s*:?/i.test(t) && countEng(t) >= 1) return true;
  if (/match the (following|pairs|correct|column)/i.test(t)) return true;
  // Pattern: line starts with a common English question word
  if (/^[^a-zA-Z]{0,3}(which|who|what|where|when|how|the |was |is |are |an |in )/i.test(t)) return true;
  // Pattern: line starts with an English instruction verb
  if (/^[^a-zA-Z]{0,3}(consider|select|find|observe|state|match|according)/i.test(t)) return true;
  // Pattern: structural headers for match-the-following
  if (/column\s*[AB]|list[- ][I1]/i.test(t)) return true;

  const eng = countEng(t);
  const total = totalWords(t);
  if (total === 0) return false;

  if (total <= 3) return eng >= 2;
  if (total <= 5) return eng >= 2 && eng / total >= 0.35;
  return eng >= 3 && eng / total >= 0.25;
}

/* ------------------------------------------------------------------ */
/*  Post-anchor per-line quality gate (STRICT — default is REJECT)    */
/* ------------------------------------------------------------------ */

function isAcceptableInEnglishZone(line: string): boolean {
  const t = line.trim();
  if (!t) return false;

  // Structural phrases
  if (/answer\s*options/i.test(t)) return true;
  if (/select the correct/i.test(t)) return true;
  if (/match the/i.test(t)) return true;
  if (/column\s*[AB]|list[- ][I1]/i.test(t)) return true;
  if (/^(True|False)[\s,]+(True|False)/i.test(t)) return true;
  // Grid header rows like "(a) (b) (c) (d)" or "(1) (2) (3) (4)" for answer tables
  if (/^\s*\(\s*[a-d]\s*\)\s+\(\s*[a-d]\s*\)\s+\(\s*[a-d]\s*\)\s+\(\s*[a-d]\s*\)/i.test(t)) return true;

  // Percentages or currency — always keep
  if (/\d+\s*%/.test(t)) return true;
  if (/[₹¥$€]/.test(t)) return true;

  // Purely numeric / math / measurement lines
  if (/^[\d\s+\-×xX*÷/=.,:;()%₹¥$€°m²³]+$/.test(t)) return true;

  // Has at least 1 recognised English word → keep
  if (countEng(t) >= 1) return true;

  // Roman numeral markers (i)-(iv) with English content → match-the-pair item lines
  if (/\(\s*(?:i{1,3}v?|vi{0,3})\s*\)/i.test(t) && /[a-zA-Z]{3,}/.test(t)) return true;

  // Option markers — only keep if line also has meaningful content
  // (blocks garbled answer-grid rows like "2) Gv) @ @) @" or "(1) Gv) GH) G6")
  if (/\(\s*[1-4]\s*\)/.test(t) || /\(\s*[a-dA-D]\s*\)/.test(t) || /^\s*[1-4]\s*[)]\s/.test(t)) {
    const nMarkers = ((t.match(/\(\s*[1-4]\s*\)/g) || []).length) +
                     ((t.match(/\(\s*[a-dA-D]\s*\)/g) || []).length);
    if (nMarkers >= 2 && /[a-zA-Z]{3,}/.test(t)) return true;
    if (/[a-zA-Z]{4,}/.test(t)) return true;
    return false;
  }

  // Garbled grid rows — Gv), G6, @@), etc. with no English words → reject
  if (/[GQ@®©¢€]{2,}|Gv\)|GH\)|G6|@@\)/i.test(t) && countEng(t) === 0) return false;

  return false;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function countEng(text: string): number {
  const words = text.toLowerCase().split(/[^a-z']+/).filter((w) => w.length >= 3);
  let n = 0;
  for (const w of words) if (engMatch(w)) n++;
  return n;
}

function engMatch(w: string): boolean {
  if (ENG.has(w)) return true;
  if (w.length > 3 && w.endsWith("s") && ENG.has(w.slice(0, -1))) return true;
  if (w.length > 4 && w.endsWith("es") && ENG.has(w.slice(0, -2))) return true;
  if (w.length > 4 && w.endsWith("ed") && ENG.has(w.slice(0, -2))) return true;
  if (w.length > 5 && w.endsWith("ing") && ENG.has(w.slice(0, -3))) return true;
  if (w.length > 4 && w.endsWith("ly") && ENG.has(w.slice(0, -2))) return true;
  if (w.length > 5 && w.endsWith("ise") && ENG.has(w + "d")) return true;
  if (w.length > 5 && w.endsWith("ize") && ENG.has(w + "d")) return true;
  return false;
}

function totalWords(text: string): number {
  return text.toLowerCase().split(/[^a-z']+/).filter((w) => w.length >= 3).length;
}
