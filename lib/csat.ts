import type { Category, Language, OptionKey, Question, Quiz } from "./types";
import { isQuestionCancelled } from "./questionUtils";

/**
 * CSAT & Aptitude training module.
 *
 * Three streams (Quantitative, Reasoning, Comprehension & DI) each hold a set
 * of topics. Every topic carries a self-contained lesson (concepts, formulas,
 * shortcuts, worked examples, traps) plus `match` rules that map it onto the
 * real tagged questions already present in `public/quizzes.json`, so practice
 * is always backed by genuine MPSC previous-year items.
 */

export type CsatStreamId = "quant" | "reasoning" | "comprehension";

export interface CsatStream {
  id: CsatStreamId;
  name: string;
  blurb: string;
  emoji: string;
  /** Tailwind accent token used for gradients/borders in the UI. */
  accent: "indigo" | "emerald" | "amber";
}

export const CSAT_STREAMS: CsatStream[] = [
  {
    id: "quant",
    name: "Quantitative Aptitude",
    blurb:
      "Numbers, percentages, ratios, algebra, geometry, time-work, speed and interest — the calculation half of CSAT.",
    emoji: "🔢",
    accent: "indigo",
  },
  {
    id: "reasoning",
    name: "Logical Reasoning",
    blurb:
      "Series, coding-decoding, syllogism, puzzles, direction, blood relations and calendars — the thinking half.",
    emoji: "🧩",
    accent: "emerald",
  },
  {
    id: "comprehension",
    name: "Comprehension & Data Interpretation",
    blurb:
      "Reading passages and reading charts — the two skills that decide the CSAT qualifying paper.",
    emoji: "📊",
    accent: "amber",
  },
];

export interface CsatConcept {
  heading: string;
  body: string;
}

export interface CsatExample {
  q: string;
  solution: string;
}

export interface CsatLesson {
  /** Opening paragraph — what the topic is and why MPSC asks it. */
  intro: string;
  concepts: CsatConcept[];
  formulas?: string[];
  shortcuts?: string[];
  examples: CsatExample[];
  traps?: string[];
}

/** Maps a topic onto real tagged questions inside quizzes.json. */
export interface CsatMatch {
  category: Category;
  /** Topic string as tagged on the question. */
  topic: string;
}

export interface CsatTopic {
  id: string;
  name: string;
  stream: CsatStreamId;
  blurb: string;
  /** Approximate lesson reading time in minutes. */
  minutes: number;
  match: CsatMatch[];
  /**
   * Theory-only topic with no practice pool. Used where the tagged questions
   * cannot stand alone — comprehension items reference a passage that is not
   * stored with the question, so practising them in isolation is impossible.
   */
  lessonOnly?: boolean;
  lesson: CsatLesson;
}

/* ------------------------------------------------------------------ *
 * Topics
 * ------------------------------------------------------------------ */

export const CSAT_TOPICS: CsatTopic[] = [
  /* ----------------------------- QUANT ----------------------------- */
  {
    id: "number-system",
    name: "Number System & Simplification",
    stream: "quant",
    blurb: "Divisibility, factors, HCF/LCM, remainders, BODMAS and fast simplification.",
    minutes: 8,
    match: [{ category: "Aptitude", topic: "Number System & Simplification" }],
    lesson: {
      intro:
        "Number System is the foundation of every other quantitative topic. MPSC uses it in two ways: directly (divisibility, HCF/LCM, remainders, unit digits) and indirectly, because almost every percentage, ratio or time-work problem finally reduces to arithmetic on integers and fractions. Getting fast and error-free here saves time everywhere else in the paper.",
      concepts: [
        {
          heading: "Classification of numbers",
          body: "Natural numbers (1, 2, 3…), whole numbers (0 onwards), integers (…−2, −1, 0, 1, 2…), rational numbers (expressible as p/q with q ≠ 0), irrational numbers (√2, π), real numbers (rational + irrational). Prime numbers have exactly two factors; 1 is neither prime nor composite; 2 is the only even prime. There are 25 primes below 100 — memorise them, MPSC asks counting questions on this set.",
        },
        {
          heading: "Divisibility rules",
          body: "2 → last digit even. 3 → digit sum divisible by 3. 4 → last two digits divisible by 4. 5 → ends in 0 or 5. 6 → divisible by both 2 and 3. 8 → last three digits divisible by 8. 9 → digit sum divisible by 9. 10 → ends in 0. 11 → difference of alternate digit sums divisible by 11. These rules turn a long division into a two-second check.",
        },
        {
          heading: "HCF and LCM",
          body: "HCF (greatest common divisor) is the largest number dividing all given numbers; LCM is the smallest number divisible by all of them. Find both by prime factorisation: HCF takes the lowest power of each common prime, LCM takes the highest power of every prime present. For exactly two numbers, HCF × LCM = product of the two numbers — this identity solves many one-line MPSC questions.",
        },
        {
          heading: "Remainders and unit digits",
          body: "For remainder questions, reduce the base modulo the divisor first, then use cyclicity. Unit digits repeat in cycles of at most 4: 2 → 2,4,8,6; 3 → 3,9,7,1; 7 → 7,9,3,1; 8 → 8,4,2,6. Digits 0, 1, 5, 6 always end in themselves. Divide the power by 4 and use the remainder to pick the position in the cycle.",
        },
        {
          heading: "BODMAS and simplification",
          body: "Order of operations: Brackets → Of → Division → Multiplication → Addition → Subtraction. Inside brackets, resolve in the order ( ) then { } then [ ]. Simplification questions are pure speed marks — no concept, only discipline. Write one step per line rather than doing three operations mentally.",
        },
      ],
      formulas: [
        "HCF × LCM = product of the two numbers (for two numbers only)",
        "Sum of first n natural numbers = n(n+1)/2",
        "Sum of squares of first n naturals = n(n+1)(2n+1)/6",
        "Sum of cubes of first n naturals = [n(n+1)/2]²",
        "Number of factors of N = (a+1)(b+1)(c+1)… where N = pᵃ·qᵇ·rᶜ",
        "Dividend = Divisor × Quotient + Remainder",
      ],
      shortcuts: [
        "To test divisibility by 7, 11 and 13 together, check divisibility by 1001 (= 7 × 11 × 13).",
        "For unit digit of a power, divide the exponent by 4; remainder 0 means take the 4th term of the cycle.",
        "The product of any n consecutive integers is always divisible by n!.",
        "A perfect square never ends in 2, 3, 7 or 8 — instantly eliminates options.",
      ],
      examples: [
        {
          q: "Find the HCF and LCM of 36 and 48.",
          solution:
            "36 = 2² × 3², 48 = 2⁴ × 3. HCF takes lowest powers = 2² × 3 = 12. LCM takes highest powers = 2⁴ × 3² = 144. Verify: HCF × LCM = 12 × 144 = 1728 = 36 × 48. ✓",
        },
        {
          q: "What is the unit digit of 7¹⁰⁵?",
          solution:
            "Cycle of 7 is 7, 9, 3, 1 (length 4). 105 ÷ 4 gives remainder 1. So the unit digit is the 1st term of the cycle = 7.",
        },
        {
          q: "The least number which when divided by 5, 6 and 8 leaves remainder 3 in each case.",
          solution:
            "LCM(5, 6, 8) = 120. The required number = 120 + 3 = 123.",
        },
      ],
      traps: [
        "1 is not a prime number — a very common MPSC trick option.",
        "HCF × LCM = product works for two numbers only, not three.",
        "In BODMAS, division and multiplication have equal priority — work left to right, not division first.",
      ],
    },
  },
  {
    id: "percentage-profit-loss",
    name: "Percentage, Profit & Loss",
    stream: "quant",
    blurb: "Percentage change, successive change, cost/selling price, discount and marked price.",
    minutes: 8,
    match: [{ category: "Aptitude", topic: "Percentage, Profit & Loss" }],
    lesson: {
      intro:
        "Percentage is the single most reused idea in the paper — profit-loss, discount, interest, data interpretation and even population/economy questions all sit on top of it. MPSC favours successive-change and 'percentage of a percentage' items because they punish mental shortcuts taken carelessly.",
      concepts: [
        {
          heading: "Percentage basics and fraction equivalents",
          body: "x% means x/100. Converting to fractions is the biggest speed gain: 12.5% = 1/8, 16⅔% = 1/6, 20% = 1/5, 25% = 1/4, 33⅓% = 1/3, 37.5% = 3/8, 50% = 1/2, 62.5% = 5/8, 66⅔% = 2/3, 75% = 3/4, 87.5% = 7/8. Memorising this table converts multi-step multiplication into one-step division.",
        },
        {
          heading: "Percentage increase and decrease",
          body: "Percentage change = (change ÷ original) × 100. Always divide by the ORIGINAL value, not the new one. If a value increases by x% and then decreases by x%, the net result is always a DECREASE of x²/100 percent — never zero. This asymmetry is MPSC's favourite trap.",
        },
        {
          heading: "Successive percentage change",
          body: "For two successive changes of a% and b%, the net change = a + b + (ab/100), using negative signs for decreases. Example: +20% then −10% gives 20 − 10 − 200/100 = +8%. This single formula replaces multiplying through step by step.",
        },
        {
          heading: "Profit, loss, cost price and selling price",
          body: "Profit = SP − CP; Loss = CP − SP. Profit% and Loss% are always calculated ON THE COST PRICE unless the question explicitly says otherwise. SP = CP × (100 + profit%)/100. When a question gives profit as a percentage of selling price, convert to cost-price basis before comparing.",
        },
        {
          heading: "Marked price and discount",
          body: "Discount is always calculated on the MARKED PRICE (list price), while profit is calculated on the COST PRICE. SP = MP × (100 − discount%)/100. Shopkeeper problems typically chain these: mark up by x%, then discount by y%, and ask for the net profit — treat it as a successive percentage change on the cost price.",
        },
      ],
      formulas: [
        "Percentage change = (Change / Original) × 100",
        "Net of two successive changes = a + b + ab/100",
        "SP = CP × (100 + Profit%)/100",
        "CP = SP × 100/(100 + Profit%)",
        "SP = MP × (100 − Discount%)/100",
        "Net decrease after +x% then −x% = x²/100 percent",
      ],
      shortcuts: [
        "If A is x% more than B, then B is [x/(100+x)] × 100 percent less than A — not x%.",
        "Selling two items at the same price with equal profit% and loss% always gives a net LOSS of x²/100 percent.",
        "To increase a quantity by 25%, multiply by 5/4; to decrease by 20%, multiply by 4/5.",
      ],
      examples: [
        {
          q: "A shopkeeper marks an article 40% above cost and gives a 25% discount. Find profit%.",
          solution:
            "Let CP = 100. MP = 140. SP = 140 × 0.75 = 105. Profit = 5 on CP 100 → 5%.",
        },
        {
          q: "A salary is increased by 20% and then reduced by 20%. What is the net change?",
          solution:
            "Net = 20 − 20 − (20×20)/100 = −4%. A 4% decrease, not zero.",
        },
        {
          q: "By selling at ₹720, a man loses 10%. At what price should he sell for a 15% profit?",
          solution:
            "CP = 720 × 100/90 = ₹800. For 15% profit, SP = 800 × 1.15 = ₹920.",
        },
      ],
      traps: [
        "Percentage change is on the original value — dividing by the new value is the most common error.",
        "Discount is on marked price, profit is on cost price. Never mix the bases.",
        "Equal % rise and fall never cancel out; the result is always a net loss.",
      ],
    },
  },
  {
    id: "ratio-average",
    name: "Ratio, Proportion & Averages",
    stream: "quant",
    blurb: "Ratio sharing, proportion, mixtures, alligation and weighted averages.",
    minutes: 7,
    match: [{ category: "Aptitude", topic: "Ratio, Proportion & Averages" }],
    lesson: {
      intro:
        "Ratio and average questions are high-frequency and low-difficulty in MPSC prelims — they are the marks you cannot afford to drop. The examiner's usual twist is a weighted average or an alligation dressed up as a mixture/salary problem.",
      concepts: [
        {
          heading: "Ratio fundamentals",
          body: "A ratio a : b compares two quantities of the same unit. Multiplying or dividing both terms by the same non-zero number leaves the ratio unchanged. To divide an amount N in the ratio a : b : c, give each part N × (its share ÷ sum of shares). Always reduce the ratio to lowest terms before computing.",
        },
        {
          heading: "Proportion",
          body: "If a : b = c : d then a·d = b·c (product of extremes = product of means). Direct proportion means one rises as the other rises (y = kx); inverse proportion means one falls as the other rises (xy = k). Deciding which proportion applies is usually the whole question — more workers means less time (inverse), more workers means more output (direct).",
        },
        {
          heading: "Averages",
          body: "Average = sum of observations ÷ number of observations. Key behaviours: adding a value equal to the current average leaves it unchanged; the average of consecutive numbers equals the middle term (or the mean of the two middle terms). If the average of n items is A and one item is replaced, the average shifts by (new − old)/n.",
        },
        {
          heading: "Weighted average",
          body: "When groups of different sizes are combined, the combined average = (n₁A₁ + n₂A₂)/(n₁ + n₂). A plain average of the two averages is only valid when the group sizes are equal — MPSC exploits this constantly with 'average marks of boys and girls' questions.",
        },
        {
          heading: "Alligation",
          body: "Alligation is a fast visual method for mixtures. Cheaper quantity : Dearer quantity = (Dearer price − Mean price) : (Mean price − Cheaper price). It works for any weighted-average situation — price, concentration, speed or marks. Draw the cross, subtract diagonally, and read off the ratio.",
        },
      ],
      formulas: [
        "Average = Sum ÷ Count",
        "Combined average = (n₁A₁ + n₂A₂) / (n₁ + n₂)",
        "Alligation: cheaper : dearer = (D − M) : (M − C)",
        "If a : b = c : d, then ad = bc",
        "Average of first n natural numbers = (n+1)/2",
      ],
      shortcuts: [
        "Average of consecutive numbers = middle term; no need to add them all.",
        "If the average of n numbers increases by x when one number is replaced, the new number exceeds the old by n·x.",
        "In a mixture where water is added, the amount of the pure substance stays constant — track that, not the total.",
      ],
      examples: [
        {
          q: "₹3,600 is divided among A, B, C in the ratio 2 : 3 : 4. Find B's share.",
          solution: "Sum of ratio = 9. B = 3600 × 3/9 = ₹1,200.",
        },
        {
          q: "Average of 10 numbers is 25. If one number 30 is replaced by 50, find the new average.",
          solution: "Increase = (50 − 30)/10 = 2. New average = 25 + 2 = 27.",
        },
        {
          q: "In what ratio must rice at ₹30/kg be mixed with rice at ₹45/kg to get a mixture at ₹35/kg?",
          solution: "Alligation: (45 − 35) : (35 − 30) = 10 : 5 = 2 : 1.",
        },
      ],
      traps: [
        "Never average two averages directly unless the group sizes are identical.",
        "Ratios have no units — convert all quantities to the same unit before forming the ratio.",
        "In mixture problems, adding water changes the total but not the quantity of the original substance.",
      ],
    },
  },
  {
    id: "algebra",
    name: "Algebra & Equations",
    stream: "quant",
    blurb: "Linear and quadratic equations, identities, ages and word-problem translation.",
    minutes: 7,
    match: [{ category: "Aptitude", topic: "Algebra & Equations" }],
    lesson: {
      intro:
        "Most MPSC algebra questions are word problems in disguise: the real skill is translating a sentence into an equation, not solving the equation. Age problems, number problems and simple simultaneous equations dominate this segment.",
      concepts: [
        {
          heading: "Translating words into equations",
          body: "Fix the unknown as the quantity the question asks about, or the smallest quantity to keep numbers clean. 'Is', 'was', 'will be' → equals sign. 'More than' → addition. 'Times' → multiplication. 'Years hence' → add to the present age; 'years ago' → subtract. Writing the sentence in symbols line by line prevents almost every mistake here.",
        },
        {
          heading: "Linear equations",
          body: "A single linear equation in one variable has exactly one solution. For two variables you need two independent equations; solve by substitution (express one variable and plug in) or elimination (add/subtract to cancel a variable). If two equations are multiples of each other, they represent the same line and have infinite solutions.",
        },
        {
          heading: "Quadratic equations",
          body: "For ax² + bx + c = 0, the roots are x = [−b ± √(b² − 4ac)]/2a. Sum of roots = −b/a and product of roots = c/a — MPSC often asks for these directly, so you never need to actually solve. The discriminant D = b² − 4ac tells you the nature: D > 0 real and distinct, D = 0 real and equal, D < 0 imaginary.",
        },
        {
          heading: "Algebraic identities",
          body: "(a + b)² = a² + 2ab + b²; (a − b)² = a² − 2ab + b²; a² − b² = (a + b)(a − b); (a + b)³ = a³ + 3ab(a + b) + b³; a³ + b³ = (a + b)(a² − ab + b²); a³ − b³ = (a − b)(a² + ab + b²). Also a² + b² = (a + b)² − 2ab, which converts most 'given a + b and ab' questions into one line.",
        },
        {
          heading: "Age problems",
          body: "Represent present ages with variables, then shift by the stated number of years on BOTH sides of the relationship. A frequent structure: 'the ratio of ages now is a : b and after n years it becomes c : d' — set present ages as ax and bx, add n to each, equate to c/d and solve for x.",
        },
      ],
      formulas: [
        "Roots of ax² + bx + c = 0 → x = [−b ± √(b² − 4ac)] / 2a",
        "Sum of roots = −b/a; Product of roots = c/a",
        "a² + b² = (a + b)² − 2ab",
        "a² − b² = (a + b)(a − b)",
        "(a + b)³ = a³ + b³ + 3ab(a + b)",
      ],
      shortcuts: [
        "If x + 1/x = k, then x² + 1/x² = k² − 2 and x³ + 1/x³ = k³ − 3k.",
        "For age ratio problems, let present ages be ax and bx — this removes one variable immediately.",
        "Check your answer by substituting back into the original sentence, not the equation you derived.",
      ],
      examples: [
        {
          q: "The sum of two numbers is 20 and their difference is 4. Find them.",
          solution: "x + y = 20, x − y = 4. Adding: 2x = 24 → x = 12, y = 8.",
        },
        {
          q: "If x + 1/x = 5, find x² + 1/x².",
          solution: "x² + 1/x² = (x + 1/x)² − 2 = 25 − 2 = 23.",
        },
        {
          q: "A father is 3 times his son's age. After 12 years he will be twice. Find present ages.",
          solution:
            "Son = x, father = 3x. (3x + 12) = 2(x + 12) → 3x + 12 = 2x + 24 → x = 12. Son 12, father 36.",
        },
      ],
      traps: [
        "When the question says 'after n years', add n to every age in the equation, not just one.",
        "A negative or fractional root is often invalid for ages, counts of people or objects — discard it.",
        "Two equations that are multiples of one another give no unique solution.",
      ],
    },
  },
  {
    id: "mensuration",
    name: "Mensuration & Geometry",
    stream: "quant",
    blurb: "Area, perimeter, volume, surface area and basic triangle/circle properties.",
    minutes: 8,
    match: [{ category: "Aptitude", topic: "Mensuration & Geometry" }],
    lesson: {
      intro:
        "Mensuration is the most formula-dependent topic in CSAT — and therefore the most reliably scoring one, provided the formula sheet is memorised cold. MPSC keeps the shapes simple (square, rectangle, triangle, circle, cube, cylinder, cone, sphere) but likes to ask how a measure changes when a dimension changes.",
      concepts: [
        {
          heading: "Plane figures — area and perimeter",
          body: "Square: area a², perimeter 4a, diagonal a√2. Rectangle: area l×b, perimeter 2(l+b), diagonal √(l²+b²). Triangle: area ½ × base × height. Parallelogram: base × height. Rhombus: ½ × d₁ × d₂. Trapezium: ½ × (sum of parallel sides) × height. Circle: area πr², circumference 2πr.",
        },
        {
          heading: "Triangles",
          body: "Angle sum is 180°. Pythagoras applies to right triangles: hypotenuse² = base² + height². For an equilateral triangle of side a, area = (√3/4)a² and height = (√3/2)a. Heron's formula gives the area from three sides: √[s(s−a)(s−b)(s−c)] where s is the semi-perimeter. Memorise the common Pythagorean triples 3-4-5, 5-12-13, 8-15-17, 7-24-25.",
        },
        {
          heading: "Solids — volume and surface area",
          body: "Cube: volume a³, total surface area 6a², diagonal a√3. Cuboid: volume lbh, TSA 2(lb + bh + hl), diagonal √(l²+b²+h²). Cylinder: volume πr²h, curved surface 2πrh, total 2πr(r+h). Cone: volume ⅓πr²h, curved surface πrl where slant l = √(r²+h²). Sphere: volume ⁴⁄₃πr³, surface 4πr². Hemisphere: volume ⅔πr³, total surface 3πr².",
        },
        {
          heading: "Effect of changing dimensions",
          body: "This is MPSC's favourite mensuration question type. If every linear dimension is multiplied by k, then area is multiplied by k² and volume by k³. So doubling the radius of a sphere multiplies its surface area by 4 and its volume by 8. A percentage increase of x% in the side changes the area by (2x + x²/100)% — the successive-change formula again.",
        },
      ],
      formulas: [
        "Circle: area = πr², circumference = 2πr",
        "Equilateral triangle: area = (√3/4)a²",
        "Heron: area = √[s(s−a)(s−b)(s−c)], s = (a+b+c)/2",
        "Cylinder: V = πr²h, CSA = 2πrh, TSA = 2πr(r + h)",
        "Cone: V = ⅓πr²h, CSA = πrl, l = √(r² + h²)",
        "Sphere: V = ⁴⁄₃πr³, SA = 4πr²",
      ],
      shortcuts: [
        "Linear ×k ⇒ area ×k², volume ×k³. Solves most 'if radius is doubled' questions in one step.",
        "Use π = 22/7 when the radius is a multiple of 7; otherwise 3.14 is faster.",
        "Recognise Pythagorean triples on sight instead of computing square roots.",
      ],
      examples: [
        {
          q: "The radius of a sphere is doubled. By what percent does its volume increase?",
          solution: "Volume scales by k³ = 2³ = 8. Increase = 800% − 100% = 700%.",
        },
        {
          q: "Area of an equilateral triangle of side 8 cm.",
          solution: "(√3/4) × 8² = (√3/4) × 64 = 16√3 ≈ 27.7 cm².",
        },
        {
          q: "A cylinder has radius 7 cm and height 10 cm. Find its volume.",
          solution: "V = πr²h = (22/7) × 49 × 10 = 22 × 7 × 10 = 1540 cm³.",
        },
      ],
      traps: [
        "Curved surface area and total surface area are different — read which one is asked.",
        "For a cone, use the slant height l for surface area and the vertical height h for volume.",
        "Percentage increase in area is not the same as the percentage increase in side.",
      ],
    },
  },
  {
    id: "time-work",
    name: "Time & Work",
    stream: "quant",
    blurb: "Work rates, combined work, pipes and cisterns, efficiency and wages.",
    minutes: 7,
    match: [{ category: "Aptitude", topic: "Time & Work" }],
    lesson: {
      intro:
        "Time and Work looks intimidating but collapses to one idea: convert every worker into a per-day rate and add the rates. Pipes and cisterns is the same topic with inlets as positive work and outlets as negative work.",
      concepts: [
        {
          heading: "The rate method",
          body: "If A finishes a job in n days, A's one-day work is 1/n of the job. When several people work together, add their one-day rates: combined rate = 1/a + 1/b + …, and the time taken is the reciprocal of that sum. This single technique handles the majority of questions without any formula.",
        },
        {
          heading: "The LCM (total-work) method",
          body: "Faster and cleaner: let total work = LCM of the given days. Then each person's daily output is a whole number, and you avoid fractions entirely. If A takes 12 days and B takes 18, set total work = 36 units; A does 3 units/day, B does 2 units/day, together 5 units/day, so they finish in 36/5 = 7.2 days.",
        },
        {
          heading: "Efficiency and inverse proportion",
          body: "Efficiency is inversely proportional to time: if A is twice as efficient as B, A takes half the time. If the ratio of efficiencies is a : b, the ratio of times is b : a. More workers means proportionally less time, assuming everyone works at the same rate — this is the M₁D₁/W₁ = M₂D₂/W₂ relationship.",
        },
        {
          heading: "Pipes and cisterns",
          body: "An inlet pipe filling a tank in n hours contributes +1/n per hour; an outlet pipe emptying it in m hours contributes −1/m per hour. Sum the signed rates. If the net rate is negative the tank never fills — MPSC sometimes plants exactly this case to test whether you checked the sign.",
        },
        {
          heading: "Wages",
          body: "Wages are shared in the ratio of work actually done, which equals the ratio of efficiencies when everyone works the same number of days. If they work for different durations, share in the ratio of (rate × days worked).",
        },
      ],
      formulas: [
        "One day's work = 1 / (days taken)",
        "Combined time = 1 / (1/a + 1/b)  →  for two workers = ab/(a+b)",
        "M₁ × D₁ × H₁ / W₁ = M₂ × D₂ × H₂ / W₂",
        "Efficiency ratio a : b ⇒ time ratio b : a",
        "Net pipe rate = Σ inlet rates − Σ outlet rates",
      ],
      shortcuts: [
        "Set total work = LCM of the given times to work in whole units and avoid fractions.",
        "For two workers, combined time = product ÷ sum of individual times.",
        "Wages split in the ratio of work done, never in the ratio of time taken.",
      ],
      examples: [
        {
          q: "A does a job in 12 days, B in 18. How long together?",
          solution:
            "LCM = 36 units. A = 3/day, B = 2/day, together 5/day. Time = 36/5 = 7.2 days.",
        },
        {
          q: "Pipe A fills a tank in 6 h, pipe B empties it in 8 h. Both open — time to fill?",
          solution:
            "LCM = 24. A = +4/h, B = −3/h. Net = +1/h. Time = 24/1 = 24 hours.",
        },
        {
          q: "A is twice as efficient as B and together they finish in 8 days. How long would A alone take?",
          solution:
            "Efficiency A : B = 2 : 1, so combined 3 parts finish in 8 days → total work = 24 parts. A alone = 24/2 = 12 days.",
        },
      ],
      traps: [
        "Never add days directly — add rates. Adding 12 and 18 days is always wrong.",
        "Check the sign for outlet pipes; a negative net rate means the tank empties.",
        "'Twice as efficient' means half the time, not double the time.",
      ],
    },
  },
  {
    id: "speed-distance",
    name: "Time, Speed & Distance",
    stream: "quant",
    blurb: "Average speed, relative speed, trains, boats & streams.",
    minutes: 7,
    match: [{ category: "Aptitude", topic: "Time, Speed & Distance" }],
    lesson: {
      intro:
        "Speed–distance questions in MPSC cluster around three sub-types: average speed for a two-leg journey, trains crossing objects or each other, and boats in a stream. Each has a formula that removes all the algebra.",
      concepts: [
        {
          heading: "The core relationship",
          body: "Distance = Speed × Time. Keep the units consistent: to convert km/h to m/s multiply by 5/18; to convert m/s to km/h multiply by 18/5. Most wrong answers in this topic are unit-conversion errors, not conceptual ones.",
        },
        {
          heading: "Average speed",
          body: "Average speed = total distance ÷ total time — never the plain average of the two speeds. For equal distances covered at speeds x and y, average speed = 2xy/(x + y), the harmonic mean. For equal times at speeds x and y, the average is the ordinary mean (x + y)/2. Deciding whether distance or time is equal is the whole question.",
        },
        {
          heading: "Relative speed",
          body: "Two bodies moving in opposite directions have relative speed = sum of speeds; in the same direction, relative speed = difference of speeds. This converts a two-moving-object problem into a single-object one.",
        },
        {
          heading: "Trains",
          body: "A train crossing a pole covers its own length. Crossing a platform or bridge it covers (length of train + length of platform). Two trains crossing each other cover the sum of their lengths, at the relative speed. Always add lengths first, then divide by the appropriate relative speed.",
        },
        {
          heading: "Boats and streams",
          body: "Downstream speed = boat speed + stream speed; upstream speed = boat speed − stream speed. Reversing: boat speed = (downstream + upstream)/2 and stream speed = (downstream − upstream)/2. If the boat speed is not greater than the stream speed, upstream travel is impossible.",
        },
      ],
      formulas: [
        "Distance = Speed × Time",
        "km/h → m/s: × 5/18 ; m/s → km/h: × 18/5",
        "Average speed (equal distances) = 2xy/(x + y)",
        "Relative speed: opposite → x + y ; same direction → |x − y|",
        "Boat: downstream = b + s, upstream = b − s",
        "b = (down + up)/2, s = (down − up)/2",
      ],
      shortcuts: [
        "Equal distance ⇒ harmonic mean; equal time ⇒ arithmetic mean.",
        "Train crossing a pole = its own length ÷ speed; no platform length involved.",
        "If speed is increased in the ratio a : b, time changes in the ratio b : a.",
      ],
      examples: [
        {
          q: "A man goes at 40 km/h and returns at 60 km/h. Find average speed.",
          solution: "Equal distances → 2×40×60/(40+60) = 4800/100 = 48 km/h.",
        },
        {
          q: "A 150 m train at 72 km/h crosses a 250 m platform. Time?",
          solution:
            "72 km/h = 20 m/s. Distance = 150 + 250 = 400 m. Time = 400/20 = 20 s.",
        },
        {
          q: "A boat goes 20 km downstream in 2 h and returns in 4 h. Find boat and stream speeds.",
          solution:
            "Down = 10 km/h, Up = 5 km/h. Boat = (10+5)/2 = 7.5 km/h, Stream = (10−5)/2 = 2.5 km/h.",
        },
      ],
      traps: [
        "Average speed is never (x + y)/2 when the distances are equal.",
        "Forgetting to convert km/h to m/s in train problems is the single biggest error source.",
        "For a platform, add the train's length; for a pole, do not.",
      ],
    },
  },
  {
    id: "interest",
    name: "Simple & Compound Interest",
    stream: "quant",
    blurb: "SI vs CI, half-yearly compounding, difference formulas and instalments.",
    minutes: 6,
    match: [{ category: "Aptitude", topic: "Simple & Compound Interest" }],
    lesson: {
      intro:
        "Interest questions are formula-driven and quick. MPSC most often asks the difference between compound and simple interest for two or three years, which has a direct formula that avoids computing both separately.",
      concepts: [
        {
          heading: "Simple interest",
          body: "SI = (P × R × T)/100, where P is principal, R the annual rate and T the time in years. Simple interest is the same every year because it is always computed on the original principal. Amount = P + SI.",
        },
        {
          heading: "Compound interest",
          body: "Amount = P(1 + R/100)^T and CI = Amount − P. Interest is added to the principal at the end of each period, so subsequent interest is earned on interest. For the same P, R and T (with T > 1), CI always exceeds SI.",
        },
        {
          heading: "Compounding frequency",
          body: "For half-yearly compounding, halve the rate and double the time: P(1 + R/200)^(2T). For quarterly, quarter the rate and quadruple the time: P(1 + R/400)^(4T). More frequent compounding always produces a larger amount.",
        },
        {
          heading: "Difference between CI and SI",
          body: "For 2 years, difference = P(R/100)². For 3 years, difference = P(R/100)² × (300 + R)/100. These are among the highest-yield formulas in the entire quantitative section because they turn a long computation into a single multiplication.",
        },
      ],
      formulas: [
        "SI = PRT/100",
        "Amount (CI) = P(1 + R/100)^T",
        "CI = P[(1 + R/100)^T − 1]",
        "Half-yearly: P(1 + R/200)^(2T)",
        "CI − SI (2 years) = P(R/100)²",
        "CI − SI (3 years) = P(R/100)² × (300 + R)/100",
      ],
      shortcuts: [
        "At the same rate, CI for 2 years = SI for 2 years + one year's interest on the first year's interest.",
        "Money doubles under SI when RT = 100.",
        "Rule of 72: under compounding, money roughly doubles in 72/R years.",
      ],
      examples: [
        {
          q: "Find SI on ₹5,000 at 8% for 3 years.",
          solution: "SI = 5000 × 8 × 3/100 = ₹1,200.",
        },
        {
          q: "Difference between CI and SI on ₹10,000 at 10% for 2 years.",
          solution: "Difference = P(R/100)² = 10000 × (0.1)² = ₹100.",
        },
        {
          q: "₹8,000 at 10% per annum compounded half-yearly for 1 year. Find the amount.",
          solution: "A = 8000(1 + 10/200)² = 8000 × (1.05)² = 8000 × 1.1025 = ₹8,820.",
        },
      ],
      traps: [
        "For half-yearly compounding you must change BOTH the rate and the time.",
        "CI and SI are equal for the first year only; they diverge from year two.",
        "The question may ask for the amount, not the interest — read carefully.",
      ],
    },
  },
  {
    id: "probability-stats",
    name: "Probability & Statistics",
    stream: "quant",
    blurb: "Basic probability, dice/cards/coins, mean, median and mode.",
    minutes: 6,
    match: [{ category: "Aptitude", topic: "Probability & Statistics" }],
    lesson: {
      intro:
        "Only a small number of MPSC questions come from probability and statistics, but they are almost always elementary — a single die, a coin, a pack of cards, or the mean/median/mode of a short list. Treat them as guaranteed marks.",
      concepts: [
        {
          heading: "Probability basics",
          body: "Probability of an event = favourable outcomes ÷ total outcomes. It always lies between 0 and 1. P(not A) = 1 − P(A), which is often much faster than counting the favourable cases directly ('at least one' questions almost always use the complement).",
        },
        {
          heading: "Standard sample spaces",
          body: "One coin: 2 outcomes; n coins: 2ⁿ. One die: 6 outcomes; two dice: 36. A pack of cards has 52 cards = 4 suits × 13; two red suits (hearts, diamonds) and two black (spades, clubs); 12 face cards (J, Q, K); 4 aces. Knowing these counts is most of the work.",
        },
        {
          heading: "Combining events",
          body: "For mutually exclusive events, P(A or B) = P(A) + P(B). In general, P(A or B) = P(A) + P(B) − P(A and B). For independent events, P(A and B) = P(A) × P(B). Decide first whether events can occur together before choosing the rule.",
        },
        {
          heading: "Mean, median, mode",
          body: "Mean is the arithmetic average. Median is the middle value after sorting (for an even count, the average of the two middle values — remember to sort first). Mode is the most frequent value; a data set can have more than one mode. The median is unaffected by extreme values, which is why it is preferred for skewed data.",
        },
      ],
      formulas: [
        "P(E) = favourable outcomes / total outcomes",
        "P(not E) = 1 − P(E)",
        "P(A or B) = P(A) + P(B) − P(A and B)",
        "P(A and B) = P(A) × P(B) for independent events",
        "Median position = (n+1)/2 th value in sorted data",
      ],
      shortcuts: [
        "For 'at least one' questions, compute 1 − P(none).",
        "Two dice: sum 7 is the most likely, with 6 favourable outcomes out of 36.",
        "Always sort the data before reading off the median.",
      ],
      examples: [
        {
          q: "Probability of getting a sum of 7 with two dice.",
          solution: "Favourable = 6 ((1,6),(2,5),(3,4),(4,3),(5,2),(6,1)). P = 6/36 = 1/6.",
        },
        {
          q: "A card is drawn from a pack. Probability it is a king.",
          solution: "4 kings out of 52 → 4/52 = 1/13.",
        },
        {
          q: "Find the median of 7, 3, 9, 5, 11.",
          solution: "Sorted: 3, 5, 7, 9, 11. Middle value = 7.",
        },
      ],
      traps: [
        "Probability can never exceed 1 — if your answer does, recheck the total outcomes.",
        "Sort the data before taking the median; using the raw order is the classic error.",
        "'At least one' is not the same as 'exactly one'.",
      ],
    },
  },

  /* --------------------------- REASONING --------------------------- */
  {
    id: "series",
    name: "Number & Letter Series",
    stream: "reasoning",
    blurb: "Finding the pattern in number, letter and mixed series; missing and wrong terms.",
    minutes: 6,
    match: [{ category: "Aptitude", topic: "Number & Letter Series" }],
    lesson: {
      intro:
        "Series questions test pattern recognition under time pressure. There are only about six patterns that MPSC uses, so the skill is to run through them in a fixed order rather than staring at the numbers hoping for inspiration.",
      concepts: [
        {
          heading: "The checking order",
          body: "Work through candidate patterns systematically: (1) constant difference, (2) changing difference — is the difference itself a series, (3) constant ratio, (4) squares/cubes with an offset, (5) alternating two interleaved series, (6) prime numbers or a mixed operation. Ninety percent of MPSC series fall in the first four.",
        },
        {
          heading: "Differences and second differences",
          body: "Write the differences between consecutive terms beneath the series. If those differences are constant, it is arithmetic. If not, take differences of the differences — a constant second difference means the series is quadratic (often n² based). This mechanical step finds the pattern faster than guessing.",
        },
        {
          heading: "Letter series and position values",
          body: "Convert letters to their alphabet positions (A = 1 … Z = 26) and the problem becomes a number series. Memorise the anchors: E = 5, J = 10, O = 15, T = 20, Y = 25. Watch for wrap-around past Z back to A, and for 'opposite letter' patterns where A ↔ Z, B ↔ Y (position + opposite = 27).",
        },
        {
          heading: "Alternating and mixed series",
          body: "If no single pattern fits, split the series into odd-position and even-position terms and test each separately — MPSC uses interleaved series often. In wrong-term questions, identify the pattern from the majority of terms and then find the single term that breaks it, rather than assuming the first odd-looking term is wrong.",
        },
      ],
      formulas: [
        "Arithmetic series nth term = a + (n − 1)d",
        "Geometric series nth term = a·r^(n−1)",
        "Letter position: A = 1 … Z = 26; letter + opposite letter = 27",
      ],
      shortcuts: [
        "Always write differences under the terms — it is faster than mental pattern hunting.",
        "Rapid rise suggests multiplication, squares or cubes; slow steady rise suggests addition.",
        "If nothing fits, split into alternate terms before giving up.",
      ],
      examples: [
        {
          q: "Find the next term: 2, 6, 12, 20, 30, ?",
          solution:
            "Differences: 4, 6, 8, 10 → next difference 12. So next term = 30 + 12 = 42. (Pattern is n² + n.)",
        },
        {
          q: "Complete: 3, 6, 12, 24, ?",
          solution: "Constant ratio of 2. Next = 24 × 2 = 48.",
        },
        {
          q: "Letter series: C, F, I, L, ?",
          solution: "Positions 3, 6, 9, 12 — step of +3. Next = 15 = O.",
        },
      ],
      traps: [
        "Do not stop at the first pattern that fits two terms; verify it against all given terms.",
        "In letter series remember to wrap Z back to A.",
        "For wrong-term questions the majority pattern defines the rule, not the first term.",
      ],
    },
  },
  {
    id: "coding-decoding",
    name: "Coding-Decoding",
    stream: "reasoning",
    blurb: "Letter shifting, substitution, number coding and conditional coding.",
    minutes: 6,
    match: [{ category: "Aptitude", topic: "Coding-Decoding" }],
    lesson: {
      intro:
        "Coding-decoding gives you a rule disguised as an example and asks you to apply it. These are pure-logic marks with no formulas, and with practice they take under 30 seconds each.",
      concepts: [
        {
          heading: "Letter-shift coding",
          body: "The most common type: each letter moves forward or backward by a fixed number. Compare the first letter of the code with the first letter of the word to find the shift, then verify on a second letter before applying it. Shifts may be uniform (+1 for every letter) or positional (+1, +2, +3 …).",
        },
        {
          heading: "Reverse and opposite-letter coding",
          body: "Sometimes the word is simply written backwards, or each letter is replaced by its 'opposite' (A ↔ Z, B ↔ Y, C ↔ X). Test the opposite-letter rule using position + opposite = 27. Checking these two possibilities early saves time.",
        },
        {
          heading: "Substitution coding",
          body: "Whole words are replaced by other words ('if sky is called water, water is called air…'). Build a small mapping table and answer strictly from the table, ignoring real-world meaning. The question deliberately exploits your instinct to answer from common sense.",
        },
        {
          heading: "Number and symbol coding",
          body: "Letters map to digits, either by alphabet position or by an arbitrary key given in the question. For sentence coding — where a few coded sentences share words — find the word common to two sentences and match it with the code common to both. Repeat to decode the rest by elimination.",
        },
      ],
      shortcuts: [
        "Write A–Z with positions 1–26 on your rough sheet at the start of the paper; reuse it all through the reasoning section.",
        "Opposite letter = 27 − position.",
        "For sentence coding, always start from words that appear in two sentences.",
      ],
      examples: [
        {
          q: "If CAT is coded as DBU, how is DOG coded?",
          solution: "Each letter shifts +1. D→E, O→P, G→H. Answer: EPH.",
        },
        {
          q: "If MOTHER is coded as PRWKHU, how is SISTER coded?",
          solution:
            "Check the shift: M(13)→P(16) is +3, O(15)→R(18) is +3, T(20)→W(23) is +3. Uniform +3. Apply to SISTER: S→V, I→L, S→V, T→W, E→H, R→U. Answer: VLVWHU.",
        },
        {
          q: "If BOOK is coded 2-15-15-11, code LAMP.",
          solution: "Alphabet positions: L=12, A=1, M=13, P=16 → 12-1-13-16.",
        },
      ],
      traps: [
        "Verify the rule on a second letter — many codes are positional, not uniform.",
        "In substitution questions answer from the given mapping, never from real-world logic.",
        "Watch the direction of the shift; forward and backward are easy to confuse under time pressure.",
      ],
    },
  },
  {
    id: "syllogism",
    name: "Syllogism & Logical Deduction",
    stream: "reasoning",
    blurb: "All/some/no statements, Venn diagrams and valid conclusions.",
    minutes: 7,
    match: [{ category: "Aptitude", topic: "Syllogism & Logical Deduction" }],
    lesson: {
      intro:
        "Syllogism asks whether a conclusion NECESSARILY follows from the given statements — not whether it is true in the real world. Solving with Venn diagrams removes all ambiguity and is far more reliable than memorising rules.",
      concepts: [
        {
          heading: "The four statement types",
          body: "All A are B (universal affirmative), No A is B (universal negative), Some A are B (particular affirmative), Some A are not B (particular negative). Each has a standard Venn representation: 'All A are B' puts circle A entirely inside B; 'No A is B' draws them separate; 'Some A are B' overlaps them partially.",
        },
        {
          heading: "The Venn method",
          body: "Draw the diagram that satisfies all statements. Then ask: can I draw ANOTHER valid diagram in which the conclusion is false? If yes, the conclusion does not follow. A conclusion follows only if it holds in every possible diagram consistent with the statements.",
        },
        {
          heading: "Core deduction rules",
          body: "Two particular statements ('some') can never produce a definite conclusion. Two negative statements can never produce a definite conclusion. If one statement is particular, the conclusion must be particular; if one is negative, the conclusion must be negative. 'All A are B' allows the possibility that B equals A — it does not imply some B are not A.",
        },
        {
          heading: "Complementary pairs (either–or)",
          body: "When neither conclusion individually follows but together they cover all possibilities, the answer is 'either I or II follows'. This happens with pairs like 'Some A are B' and 'No A is B', or 'All A are B' and 'Some A are not B'. Spotting this pattern rescues questions that otherwise look unanswerable.",
        },
      ],
      shortcuts: [
        "'All A are B' always gives the valid converse 'Some B are A'.",
        "'No A is B' always gives 'No B is A' and 'Some A are not B'.",
        "Two 'some' statements together yield nothing definite — mark it immediately.",
      ],
      examples: [
        {
          q: "Statements: All cats are animals. All animals are living. Conclusion: All cats are living.",
          solution:
            "Cats ⊂ Animals ⊂ Living. The chain is unbroken in every valid diagram, so the conclusion follows.",
        },
        {
          q: "Statements: Some pens are books. Some books are tables. Conclusion: Some pens are tables.",
          solution:
            "Two particular statements. A diagram exists where pens and tables do not overlap, so the conclusion does NOT follow.",
        },
        {
          q: "Statements: All roses are flowers. Conclusion: Some flowers are roses.",
          solution: "Valid converse of a universal affirmative — it follows.",
        },
      ],
      traps: [
        "Judge only from the statements; real-world truth is irrelevant.",
        "'Some A are B' does not imply 'Some A are not B'.",
        "Check for complementary either–or pairs before answering 'neither follows'.",
      ],
    },
  },
  {
    id: "analogy",
    name: "Analogy & Classification",
    stream: "reasoning",
    blurb: "Relationship matching, odd-one-out and category grouping.",
    minutes: 5,
    match: [{ category: "Aptitude", topic: "Analogy & Classification" }],
    lesson: {
      intro:
        "Analogy asks you to identify the relationship in a given pair and reproduce it; classification (odd one out) asks you to find the item that fails a shared property. Both are quick marks once you learn to state the relationship in words before looking at the options.",
      concepts: [
        {
          heading: "Naming the relationship",
          body: "Before reading the options, express the link in a short sentence: 'A is the tool used by B', 'A is the young of B', 'A is the capital of B', 'A is the unit of B'. Then test which option makes the same sentence true. This prevents being pulled toward an option that is merely related in some other way.",
        },
        {
          heading: "Common relationship types",
          body: "Worker–tool (carpenter : saw), individual–group (soldier : army), part–whole (petal : flower), cause–effect (virus : disease), object–function (pen : write), young–adult (calf : cow), unit–quantity (metre : length), synonym and antonym pairs, and place–product relationships.",
        },
        {
          heading: "Number and letter analogies",
          body: "For numbers, test squares, cubes, doubling, ±constant, or a factor relationship. For letters, convert to alphabet positions and look for a shift. Verify the rule on the given pair before applying it to the options.",
        },
        {
          heading: "Classification strategy",
          body: "Find the property shared by the majority — three of four options usually satisfy it and the fourth does not. Beware of multiple valid groupings: if two options look odd, look for a stricter property (for example, all are prime AND odd, so 2 is the exception).",
        },
      ],
      shortcuts: [
        "State the relationship as a full sentence before scanning the options.",
        "For number analogies, check squares and cubes first — they are the most common.",
        "In odd-one-out, the answer is the one failing the property that the other three share.",
      ],
      examples: [
        {
          q: "Doctor : Hospital :: Teacher : ?",
          solution: "Relationship: professional : workplace. Answer: School.",
        },
        {
          q: "25 : 5 :: 81 : ?",
          solution: "First is the square of the second. √81 = 9.",
        },
        {
          q: "Odd one out: 3, 5, 7, 9, 11.",
          solution: "All are prime except 9 (= 3 × 3). Answer: 9.",
        },
      ],
      traps: [
        "Keep the order of the relationship the same — worker : tool must map to worker : tool, not tool : worker.",
        "If two options seem odd, look for a more specific shared property.",
        "Do not settle for a loose association when an exact relationship exists.",
      ],
    },
  },
  {
    id: "puzzles",
    name: "Puzzles & Seating Arrangement",
    stream: "reasoning",
    blurb: "Linear and circular seating, floor puzzles, scheduling and matrix logic.",
    minutes: 8,
    match: [{ category: "Aptitude", topic: "Puzzles" }],
    lesson: {
      intro:
        "Puzzles carry the largest single block of reasoning questions in the tagged MPSC set. They look time-consuming, but a disciplined diagram-and-table method makes them mechanical. The winning habit is to place definite information first and treat conditional clues as branches.",
      concepts: [
        {
          heading: "Classify the puzzle first",
          body: "Identify the type before writing anything: linear arrangement (a row), circular arrangement (a table), floor/building puzzle (vertical stack), scheduling (days or months), or a matrix puzzle (people matched with several attributes). Each type has its own diagram, and choosing the right one immediately is half the battle.",
        },
        {
          heading: "Order of clue usage",
          body: "Use definite clues first ('B sits at the extreme left', 'C lives on floor 3'). Then apply relational clues ('A is immediately left of D'). Leave conditional or negative clues ('E does not sit next to F') for last — use them to eliminate arrangements rather than to build them.",
        },
        {
          heading: "Linear vs circular conventions",
          body: "In a row, 'left' and 'right' are from the reader's view unless the question states the people face north/south — read this carefully because it flips every direction. In a circular arrangement, if everyone faces the centre, then a person's left is anticlockwise. Mark the facing direction on your diagram before placing anybody.",
        },
        {
          heading: "Matrix puzzles",
          body: "When people must be matched to two or more attributes (name, city, colour, profession), draw a grid and mark ✓ and ✗ as you deduce. A ✓ in a cell lets you cross out the rest of that row and column. Never keep this information in your head.",
        },
        {
          heading: "Branching when clues are incomplete",
          body: "If a clue permits two placements, draw both cases side by side and carry them forward. Later clues will usually kill one branch. This is far faster than restarting when you discover a contradiction.",
        },
      ],
      shortcuts: [
        "Always draw the diagram — no puzzle should be attempted mentally.",
        "Place fixed positions first, conditional clues last.",
        "For circular puzzles, note the facing direction before placing anyone.",
        "In an exam, if a puzzle resists after two minutes, skip it and return later.",
      ],
      examples: [
        {
          q: "Five friends A–E sit in a row. C is at the extreme left. D is immediately right of A. B is at the extreme right. Where can E sit?",
          solution:
            "Row of 5: C _ _ _ B. A and D must be adjacent as A then D, so positions 2-3 or 3-4. If A-D at 2-3, E is at 4. If A-D at 3-4, E is at 2. Both are consistent until another clue narrows it.",
        },
        {
          q: "Six people live on six floors. P lives on floor 2. Q lives directly above P. Which floor is Q on?",
          solution: "Directly above floor 2 is floor 3, so Q is on floor 3.",
        },
      ],
      traps: [
        "'Facing the centre' reverses left and right — the most common puzzle error.",
        "'Immediately left' means adjacent; plain 'left' only means somewhere to the left.",
        "Do not assume an arrangement not stated by the clues; keep both branches alive.",
      ],
    },
  },
  {
    id: "direction",
    name: "Direction Sense",
    stream: "reasoning",
    blurb: "Movement tracking, turns, shortest distance and shadow-based direction.",
    minutes: 5,
    match: [{ category: "Aptitude", topic: "Direction Sense" }],
    lesson: {
      intro:
        "Direction questions are pure diagram work: sketch the path and the answer appears. Errors come almost entirely from not drawing, or from mishandling left/right turns relative to the current facing direction.",
      concepts: [
        {
          heading: "The compass and turning",
          body: "Draw the compass at the top of your rough sheet: North up, South down, East right, West left. A right turn is clockwise (N→E→S→W); a left turn is anticlockwise (N→W→S→E). Crucially, turns are relative to the direction the person is CURRENTLY facing, not to the page.",
        },
        {
          heading: "Tracking the path",
          body: "Draw each leg to rough scale with its distance labelled and an arrowhead for direction. Net displacement north–south is the difference of the northward and southward legs; the same applies east–west. The final position depends only on these two net values, not on the order of movement.",
        },
        {
          heading: "Shortest distance",
          body: "The shortest distance from start to finish is the straight line, found with Pythagoras: √(net horizontal² + net vertical²). MPSC picks numbers that form a Pythagorean triple (3-4-5, 6-8-10, 5-12-13), so recognising these gives an instant answer.",
        },
        {
          heading: "Shadows and time of day",
          body: "In the morning the sun is in the east, so shadows fall towards the west; in the evening the sun is in the west and shadows fall east. At noon the shadow is negligible. If a person's shadow falls to their left in the morning, they face north.",
        },
      ],
      formulas: [
        "Shortest distance = √(net East-West² + net North-South²)",
        "Right turn = clockwise; Left turn = anticlockwise",
      ],
      shortcuts: [
        "Two consecutive left turns (or two rights) reverse the original direction.",
        "Look for 3-4-5 and 6-8-10 triples before reaching for a calculator.",
        "Net displacement only — the order of the legs does not matter.",
      ],
      examples: [
        {
          q: "A man walks 3 km north, then 4 km east. How far is he from the start?",
          solution: "√(3² + 4²) = √25 = 5 km.",
        },
        {
          q: "Facing north, a person turns right, then right again. Which way now?",
          solution: "North → East → South. He faces south.",
        },
        {
          q: "Walking 10 m south, 6 m west, 10 m north — final displacement?",
          solution:
            "North-south cancels (10 south, 10 north). Net = 6 m west of the start.",
        },
      ],
      traps: [
        "Turns are relative to the current facing direction, not to the page.",
        "In the morning shadows point west, not east.",
        "Compute net displacement rather than adding all distances walked.",
      ],
    },
  },
  {
    id: "blood-relations",
    name: "Blood Relations",
    stream: "reasoning",
    blurb: "Family trees, coded relations and generation mapping.",
    minutes: 5,
    match: [{ category: "Aptitude", topic: "Blood Relations" }],
    lesson: {
      intro:
        "Blood relation questions are easy marks if you draw a family tree and hard to keep straight if you do not. The standard trick is a long sentence — 'the son of the only daughter of my father's wife' — that unwinds cleanly when read from the end backwards.",
      concepts: [
        {
          heading: "Standard notation",
          body: "Use a consistent set of symbols: + for male, − for female, a horizontal double line for a married couple, a vertical line for parent-to-child, and a single horizontal line for siblings. Place each generation on its own row so relationships across levels stay visible.",
        },
        {
          heading: "Reading long statements backwards",
          body: "Decode from the last phrase to the first. For 'the son of the only daughter of my father', start with 'my father', then 'his only daughter' (my sister), then 'her son' (my nephew). Working forwards from the start is where most people lose track.",
        },
        {
          heading: "Coded relations",
          body: "Symbols stand for relations — for example A + B means A is the father of B, A − B means A is the wife of B. Translate each symbol into plain words on your sheet first, build the tree, then answer. Never try to evaluate the symbol chain mentally.",
        },
        {
          heading: "Watching gender and generation",
          body: "Many statements leave gender unspecified: 'the child of my aunt' could be a cousin of either gender, so a question asking 'brother or sister' may be indeterminate. Count generations carefully — grandparent, parent, self, child — since MPSC's distractors usually shift the answer by exactly one generation.",
        },
      ],
      shortcuts: [
        "Always start the tree from the speaker ('I' or 'me') and build outward.",
        "Read compound statements from the last phrase backwards.",
        "Mother's/father's brother = uncle; their children = cousins, gender often unspecified.",
      ],
      examples: [
        {
          q: "Pointing to a man, a woman said, 'His mother is the only daughter of my mother.' How is she related to him?",
          solution:
            "'The only daughter of my mother' = the woman herself. So his mother is she — she is his mother.",
        },
        {
          q: "A is B's brother, C is A's mother, D is C's father. How is B related to D?",
          solution:
            "C is mother of A and B; D is C's father, so D is the grandfather of B. B is D's grandchild (grandson or granddaughter — gender of B not stated).",
        },
      ],
      traps: [
        "'Only daughter of my mother' usually refers to the speaker herself.",
        "Do not assume gender where the statement does not state it.",
        "Brother-in-law and cousin relationships require the marriage link to be drawn explicitly.",
      ],
    },
  },
  {
    id: "ranking",
    name: "Ranking & Ordering",
    stream: "reasoning",
    blurb: "Positions from both ends, total counts and comparison ordering.",
    minutes: 5,
    match: [{ category: "Aptitude", topic: "Ranking & Ordering" }],
    lesson: {
      intro:
        "Ranking questions revolve around one formula and one habit: the total-count formula, and drawing the line of people rather than reasoning in the abstract. Comparison ordering ('A is taller than B but shorter than C') is best solved as an inequality chain.",
      concepts: [
        {
          heading: "The basic total formula",
          body: "If a person is r-th from the left and s-th from the right in a row, the total number of people = r + s − 1. The −1 exists because that person is counted from both ends. Rearranged, position from the right = total − position from the left + 1.",
        },
        {
          heading: "Counting between two people",
          body: "The number of people strictly BETWEEN positions m and n (with m < n) is n − m − 1. If the question says 'from m to n inclusive', the count is n − m + 1. Reading which of the two is being asked is where most marks are lost.",
        },
        {
          heading: "Interchanged positions",
          body: "When two people swap places and one new position is given, use the swap to deduce the original: the person now occupying a stated position previously held the other's spot. Draw the row before and after the swap; do not attempt it mentally.",
        },
        {
          heading: "Comparison ordering",
          body: "Convert statements into a single inequality chain. 'A is taller than B' becomes A > B; 'A is shorter than C' becomes C > A. Combine into C > A > B. The tallest is the leftmost of the chain and the shortest the rightmost; 'second tallest' is the second element.",
        },
      ],
      formulas: [
        "Total = position from left + position from right − 1",
        "Position from right = Total − position from left + 1",
        "People strictly between positions m and n = n − m − 1",
      ],
      shortcuts: [
        "Draw the row with dashes and write positions from both ends underneath.",
        "For comparisons, build one chain of inequalities instead of comparing pairwise.",
        "Re-read whether the question wants 'between' (exclusive) or a range (inclusive).",
      ],
      examples: [
        {
          q: "In a row, A is 7th from the left and 12th from the right. How many people are there?",
          solution: "Total = 7 + 12 − 1 = 18.",
        },
        {
          q: "In a class of 30, a boy is 12th from the top. What is his rank from the bottom?",
          solution: "30 − 12 + 1 = 19th from the bottom.",
        },
        {
          q: "A is taller than B, C is taller than A, D is shorter than B. Who is tallest?",
          solution: "C > A > B > D. The tallest is C.",
        },
      ],
      traps: [
        "Forgetting the −1 in the total formula is the single most common error.",
        "'Between' excludes both endpoints; an inclusive range does not.",
        "Ranking from the top in marks means the highest scorer is rank 1.",
      ],
    },
  },
  {
    id: "clocks-calendars",
    name: "Clocks & Calendars",
    stream: "reasoning",
    blurb: "Clock angles, hand coincidences, odd days and finding the day of the week.",
    minutes: 6,
    match: [{ category: "Aptitude", topic: "Clocks & Calendars" }],
    lesson: {
      intro:
        "Clocks and calendars are formula topics with very predictable question patterns: the angle between the hands, when the hands coincide, and what day of the week a date falls on. Learn three formulas and this segment becomes free marks.",
      concepts: [
        {
          heading: "Clock geometry",
          body: "The dial is 360°, so each hour mark spans 30°. The hour hand moves 0.5° per minute (30° per hour) and the minute hand moves 6° per minute. The minute hand therefore gains 5.5° per minute on the hour hand — this relative speed drives every clock question.",
        },
        {
          heading: "Angle between the hands",
          body: "Angle = |30H − 5.5M| where H is the hour and M the minutes past it. If the result exceeds 180°, subtract it from 360° to get the smaller angle. The hands coincide 11 times in 12 hours (every 65 5/11 minutes), are opposite 11 times in 12 hours, and are at right angles 22 times in 12 hours.",
        },
        {
          heading: "Odd days",
          body: "An odd day is the remainder when a number of days is divided by 7. An ordinary year has 365 days = 52 weeks + 1 odd day; a leap year has 2 odd days. A century has 5 odd days, 200 years 3, 300 years 1 and 400 years 0. This lets you jump across centuries without counting.",
        },
        {
          heading: "Leap years and day calculation",
          body: "A year is a leap year if divisible by 4, except century years, which must be divisible by 400 — so 1900 was not a leap year but 2000 was. To find the day of the week for a date, total the odd days from the reference point and map the remainder: 0 = Sunday, 1 = Monday, and so on.",
        },
      ],
      formulas: [
        "Angle between hands = |30H − 5.5M| (take 360 − angle if it exceeds 180)",
        "Minute hand gains 5.5° per minute over the hour hand",
        "Hands coincide every 65 5/11 minutes",
        "Ordinary year = 1 odd day; leap year = 2 odd days",
        "100 years = 5 odd days, 200 = 3, 300 = 1, 400 = 0",
      ],
      shortcuts: [
        "Hands coincide 11 times in 12 hours, so 22 times in a day (not 24).",
        "Same calendar repeats after 6 years, 11 years or 28 years depending on leap positioning.",
        "Odd-day remainder 0 = Sunday when counting from a Sunday reference.",
      ],
      examples: [
        {
          q: "Angle between the hands at 3:30?",
          solution: "|30×3 − 5.5×30| = |90 − 165| = 75°.",
        },
        {
          q: "Is 1900 a leap year?",
          solution:
            "It is a century year, so it must be divisible by 400. 1900 ÷ 400 is not an integer, so it is NOT a leap year.",
        },
        {
          q: "How many odd days in 300 years?",
          solution: "300 years contain 1 odd day.",
        },
      ],
      traps: [
        "Century years are leap years only when divisible by 400.",
        "The hands coincide 22 times a day, not 24.",
        "In the angle formula, H is the hour and M the minutes — do not swap them.",
      ],
    },
  },

  /* ------------------- COMPREHENSION & DATA INTERPRETATION ------------------- */
  {
    id: "data-interpretation",
    name: "Data Interpretation",
    stream: "comprehension",
    blurb: "Tables, bar/line graphs, pie charts, percentage change and ratio comparison.",
    minutes: 7,
    match: [{ category: "Aptitude", topic: "Data Interpretation" }],
    lesson: {
      intro:
        "Data Interpretation is applied percentage and ratio work wrapped in a chart. The mathematics is easy; the marks are won or lost on reading the chart correctly and on approximating fast enough to finish in time.",
      concepts: [
        {
          heading: "Read the chart before the questions",
          body: "Spend fifteen seconds on the title, the axis labels, the units and any footnote. The most expensive DI mistakes come from missing that figures are in lakhs, or that a bar shows a cumulative rather than an annual value. Note whether the data is absolute numbers or percentages.",
        },
        {
          heading: "Chart types and what they suit",
          body: "Tables give exact values and suit precise computation. Bar graphs compare magnitudes across categories. Line graphs show trends and are used for growth or decline questions. Pie charts show composition, where the whole is 360° or 100% — so 1% corresponds to 3.6°.",
        },
        {
          heading: "The four question patterns",
          body: "Almost every DI question is one of: (1) a percentage of a total, (2) a ratio between two data points, (3) a percentage increase or decrease between two periods, or (4) an average across several periods. Recognising the pattern lets you set up the calculation without re-reading the chart.",
        },
        {
          heading: "Approximation discipline",
          body: "Options in DI are usually far apart, so exact arithmetic is wasted effort. Round to two significant figures, compute, then match the nearest option. Compare fractions by cross-multiplication instead of converting both to decimals — it is much faster.",
        },
      ],
      formulas: [
        "Percentage of total = (part / total) × 100",
        "Percentage change = [(new − old) / old] × 100",
        "Pie chart: 1% = 3.6°, so value = (angle/360) × total",
        "Average = sum of values ÷ number of values",
      ],
      shortcuts: [
        "Compare two fractions by cross-multiplication rather than long division.",
        "Round aggressively — DI options are rarely close together.",
        "For 'which year saw the highest growth', compare ratios of consecutive values, not absolute differences.",
      ],
      examples: [
        {
          q: "A pie chart shows a sector of 72° for a total budget of ₹50,000. Find that sector's value.",
          solution: "(72/360) × 50000 = 0.2 × 50000 = ₹10,000.",
        },
        {
          q: "Sales rose from 250 to 300 units. Find the percentage increase.",
          solution: "(50/250) × 100 = 20%.",
        },
      ],
      traps: [
        "Check the units — lakhs, crores and percentages are mixed deliberately.",
        "Percentage change is computed on the OLD value.",
        "Highest growth means highest percentage change, not the largest absolute jump.",
      ],
    },
  },
  {
    id: "reading-comprehension",
    name: "Reading Comprehension",
    stream: "comprehension",
    blurb: "Passage reading strategy, inference, tone and vocabulary in context.",
    minutes: 7,
    match: [],
    lessonOnly: true,
    lesson: {
      intro:
        "Comprehension is the highest-weight skill in the CSAT paper and the one most aspirants under-practise. The passages need no outside knowledge — every answer is present in or directly inferable from the text. The challenge is speed and resisting options that are true in general but unsupported by the passage.",
      concepts: [
        {
          heading: "Question-first vs passage-first",
          body: "For short passages (under 300 words), read the passage once at a steady pace, then answer. For long passages, skim the questions first so you know what to look for, then read. Do not read a long passage three times — that is where the time goes.",
        },
        {
          heading: "Identify the main idea",
          body: "The central idea is usually stated in the first or last sentence of the passage or of a paragraph. Everything else supports it. Main-idea questions are answered by the option that covers the WHOLE passage — options that are true but describe only one paragraph are the standard distractor.",
        },
        {
          heading: "Fact vs inference",
          body: "A factual question has its answer written in the passage; locate the line and match it. An inference question requires a conclusion the author did not state but which necessarily follows. The correct inference is always a small, safe step from the text — if an option requires extra assumptions, it is wrong.",
        },
        {
          heading: "Tone and attitude",
          body: "Tone is the author's attitude: critical, appreciative, neutral/objective, analytical, ironic or optimistic. Judge from adjectives and adverbs rather than the subject matter. Most exam passages are neutral or analytical; strongly emotional options are usually traps.",
        },
        {
          heading: "Vocabulary in context",
          body: "When asked the meaning of a word as used in the passage, substitute each option back into the sentence and check which preserves the meaning. The dictionary's primary meaning is often not the intended one — context always wins.",
        },
      ],
      shortcuts: [
        "Eliminate options containing absolutes — 'always', 'never', 'all', 'none' — which are rarely supported.",
        "The correct answer paraphrases the passage; an option repeating its exact words is often a trap.",
        "If two options are opposites, the answer is usually one of them.",
      ],
      examples: [
        {
          q: "How should you approach a main-idea question?",
          solution:
            "Choose the option that summarises the entire passage. Reject options that are accurate but cover only one paragraph or one example.",
        },
        {
          q: "An option states something factually true about the world but not mentioned in the passage. Is it correct?",
          solution:
            "No. Comprehension answers must be supported by the passage itself, not by outside knowledge.",
        },
      ],
      traps: [
        "Bringing in outside knowledge is the number one comprehension error.",
        "Partly-correct options that cover only one paragraph fail main-idea questions.",
        "Extreme wording ('always', 'never') is almost always unsupported.",
      ],
    },
  },
];

/* ------------------------------------------------------------------ *
 * Lookups
 * ------------------------------------------------------------------ */

export function getCsatTopic(id: string): CsatTopic | undefined {
  return CSAT_TOPICS.find((t) => t.id === id);
}

export function getTopicsByStream(stream: CsatStreamId): CsatTopic[] {
  return CSAT_TOPICS.filter((t) => t.stream === stream);
}

/* ------------------------------------------------------------------ *
 * Practice question building
 * ------------------------------------------------------------------ */

export interface CsatQuestion {
  key: number;
  questionId: string;
  /** Identity used to remember what has already been served. Question ids repeat
   *  across papers, so previous-year items are qualified by their quiz. */
  uid: string;
  topicId: string;
  topicName: string;
  text: string;
  options: Record<OptionKey, string>;
  correctAnswer: OptionKey;
  explanation: string;
  sourceTitle: string;
  difficulty?: "moderate" | "hard";
}

/* ------------------------------------------------------------------ *
 * Generated practice bank (public/csat-questions.json)
 *
 * Built and verified by scripts/csat/build.mjs + validate.mjs. Options are
 * language-neutral and shared between the two languages, so English and
 * Marathi can never disagree about the answer.
 * ------------------------------------------------------------------ */

export interface CsatBankQuestion {
  id: string;
  topicId: string;
  archetype: string;
  difficulty: "moderate" | "hard";
  options: Record<OptionKey, string>;
  correctAnswer: OptionKey;
  en: { text: string; explanation: string };
  mr: { text: string; explanation: string };
}

export interface CsatBank {
  version: number;
  questions: CsatBankQuestion[];
}

const BANK_SOURCE_LABEL = "CSAT Practice Bank";

function bankToQuestions(
  bank: CsatBank | null,
  topicId: string,
  topicName: string,
  language: Language,
): CsatQuestion[] {
  if (!bank?.questions?.length) return [];
  return bank.questions
    .filter((q) => q.topicId === topicId)
    .map((q, i) => {
      const side = language === "marathi" ? q.mr : q.en;
      return {
        key: i + 1,
        questionId: q.id,
        uid: q.id,
        topicId,
        topicName,
        text: side.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: side.explanation,
        sourceTitle: BANK_SOURCE_LABEL,
        difficulty: q.difficulty,
      };
    });
}

/** Quizzes that should never feed the CSAT pools. */
function isUsableQuiz(quiz: Quiz): boolean {
  if (quiz.id === "__copyright__") return false;
  if (quiz.examType && quiz.examType !== "MPSC") return false;
  return true;
}

function isUsableQuestion(q: Question): boolean {
  if (isQuestionCancelled(q)) return false;
  if (!q.correctAnswer) return false;
  if (!q.text || !q.text.trim()) return false;
  const opts = q.options;
  if (!opts) return false;
  return (["A", "B", "C", "D"] as OptionKey[]).every((k) => !!opts[k] && !!opts[k].trim());
}

/**
 * Normalised text key used to drop duplicate questions across papers. It has to
 * be the whole question: many items share a long opening ("Consider the
 * following statements", a data table, an analogy instruction) and differ only
 * further in, so keying on a prefix throws genuinely different questions away.
 */
function dedupeKey(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

/**
 * Collect every question that belongs to a CSAT topic in the requested
 * language — genuine previous-year items plus the generated practice bank.
 */
export function collectTopicQuestions(
  quizzes: Quiz[],
  bank: CsatBank | null,
  topic: CsatTopic,
  language: Language,
): CsatQuestion[] {
  if (topic.lessonOnly) return [];

  const seen = new Set<string>();
  const out: CsatQuestion[] = [];

  for (const item of bankToQuestions(bank, topic.id, topic.name, language)) {
    const key = dedupeKey(item.text);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }

  if (topic.match.length === 0) {
    return out.map((q, i) => ({ ...q, key: i + 1 }));
  }
  const { match: matches } = topic;

  for (const quiz of quizzes) {
    if (!isUsableQuiz(quiz)) continue;
    const quizLang: Language = quiz.language === "marathi" ? "marathi" : "english";
    if (quizLang !== language) continue;

    for (const q of quiz.questions || []) {
      if (!isUsableQuestion(q)) continue;
      const hit = matches.some((m) => q.category === m.category && q.topic === m.topic);
      if (!hit) continue;

      const key = dedupeKey(q.text);
      if (seen.has(key)) continue;
      seen.add(key);

      out.push({
        key: out.length + 1,
        questionId: q.id,
        uid: `${quiz.id}:${q.id}`,
        topicId: topic.id,
        topicName: topic.name,
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer as OptionKey,
        explanation: q.explanation || "",
        sourceTitle: quiz.title,
      });
    }
  }

  return out;
}

/** Fisher–Yates shuffle (returns a new array). */
export function shuffleCsat<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ------------------------------------------------------------------ *
 * Coverage tracking
 *
 * A topic now holds well over a hundred questions, so a purely random draw
 * would keep showing the same ones and a student could never work through the
 * whole set. Every served question is remembered, each run prefers questions
 * that have not been served yet, and once a pool is covered the record clears
 * so the next cycle starts fresh.
 * ------------------------------------------------------------------ */

const SEEN_KEY = "mcq_csat_seen_v2";

type SeenStore = Record<string, string[]>;

export function topicSeenBucket(topicId: string, language: Language): string {
  return `${topicId}:${language}`;
}

export function speedSeenBucket(language: Language): string {
  return `__speed__:${language}`;
}

function readSeenStore(): SeenStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(SEEN_KEY);
    const parsed = raw ? (JSON.parse(raw) as SeenStore) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeSeenStore(store: SeenStore): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SEEN_KEY, JSON.stringify(store));
  } catch {
    /* storage full or blocked — practice still works, it just repeats sooner */
  }
}

/** How many questions each bucket has already served, keyed by bucket. */
export function csatSeenCounts(): Record<string, number> {
  const store = readSeenStore();
  const counts: Record<string, number> = {};
  for (const [bucket, ids] of Object.entries(store)) counts[bucket] = ids.length;
  return counts;
}

/** Forget the history of one bucket so the whole pool becomes available again. */
export function resetCsatSeen(bucket: string): void {
  const store = readSeenStore();
  if (!store[bucket]) return;
  delete store[bucket];
  writeSeenStore(store);
}

function recordSeen(bucket: string, uids: string[], poolSize: number): void {
  const store = readSeenStore();
  const merged = new Set(store[bucket] || []);
  for (const uid of uids) merged.add(uid);
  // Pool covered: wipe the slate rather than let the record grow forever.
  if (merged.size >= poolSize) delete store[bucket];
  else store[bucket] = [...merged];
  writeSeenStore(store);
}

/**
 * Draw questions the student has not met yet, topping up with older ones only
 * when the unseen pile runs short.
 */
function drawUnseenFirst(pool: CsatQuestion[], bucket: string, limit: number): CsatQuestion[] {
  const seen = new Set(readSeenStore()[bucket] || []);
  const preferHard = (items: CsatQuestion[]) => {
    const hard = shuffleCsat(items.filter((q) => q.difficulty === "hard"));
    const rest = shuffleCsat(items.filter((q) => q.difficulty !== "hard"));
    return [...hard, ...rest];
  };
  const fresh = preferHard(pool.filter((q) => !seen.has(q.uid)));
  if (fresh.length >= limit) return fresh.slice(0, limit);
  const repeats = preferHard(pool.filter((q) => seen.has(q.uid)));
  return [...fresh, ...repeats.slice(0, limit - fresh.length)];
}

/** Question count available per topic — used to render availability badges. */
export function countTopicQuestions(
  quizzes: Quiz[],
  bank: CsatBank | null,
  language: Language,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const topic of CSAT_TOPICS) {
    counts[topic.id] = collectTopicQuestions(quizzes, bank, topic, language).length;
  }
  return counts;
}

/** Practice set for one topic, drawn from the questions not served yet. */
export function buildTopicPractice(
  quizzes: Quiz[],
  bank: CsatBank | null,
  topic: CsatTopic,
  language: Language,
  limit: number,
): CsatQuestion[] {
  const pool = collectTopicQuestions(quizzes, bank, topic, language);
  if (pool.length === 0) return [];
  const bucket = topicSeenBucket(topic.id, language);
  const picked = drawUnseenFirst(pool, bucket, limit);
  recordSeen(bucket, picked.map((q) => q.uid), pool.length);
  return picked.map((q, i) => ({ ...q, key: i + 1 }));
}

/**
 * Combined speed practice — spreads questions across every CSAT topic that has
 * content, so a single run covers the whole syllabus rather than one area.
 * Each topic is ordered unseen-first and reshuffled on every call, so no two
 * runs give the same paper.
 */
export function buildSpeedTest(
  quizzes: Quiz[],
  bank: CsatBank | null,
  language: Language,
  total: number,
): CsatQuestion[] {
  const bucket = speedSeenBucket(language);
  let poolSize = 0;
  const pools = CSAT_TOPICS.map((t) => {
    const items = collectTopicQuestions(quizzes, bank, t, language);
    poolSize += items.length;
    return { topic: t, items: drawUnseenFirst(items, bucket, items.length) };
  }).filter((p) => p.items.length > 0);

  if (pools.length === 0) return [];

  const picked: CsatQuestion[] = [];
  const cursor = new Map<string, number>();

  // Round-robin across topics so the mix stays balanced.
  while (picked.length < total) {
    let addedThisRound = 0;
    for (const pool of pools) {
      if (picked.length >= total) break;
      const idx = cursor.get(pool.topic.id) ?? 0;
      if (idx >= pool.items.length) continue;
      picked.push(pool.items[idx]);
      cursor.set(pool.topic.id, idx + 1);
      addedThisRound += 1;
    }
    if (addedThisRound === 0) break; // every pool exhausted
  }

  recordSeen(bucket, picked.map((q) => q.uid), poolSize);
  return shuffleCsat(picked).map((q, i) => ({ ...q, key: i + 1 }));
}

/* ------------------------------------------------------------------ *
 * Scoring
 * ------------------------------------------------------------------ */

/** CSAT uses the same 1/4 negative marking as the rest of MPSC prelims. */
export const CSAT_NEGATIVE_MARK = 0.25;

export interface CsatScore {
  total: number;
  answered: number;
  correct: number;
  wrong: number;
  skipped: number;
  net: number;
  percent: number;
  byTopic: Array<{
    topicId: string;
    topicName: string;
    total: number;
    correct: number;
    wrong: number;
    skipped: number;
  }>;
}

export function scoreCsat(
  questions: CsatQuestion[],
  answers: Record<number, OptionKey>,
  applyNegative: boolean,
): CsatScore {
  let correct = 0;
  let wrong = 0;
  const byTopic = new Map<string, CsatScore["byTopic"][number]>();

  for (const q of questions) {
    let row = byTopic.get(q.topicId);
    if (!row) {
      row = { topicId: q.topicId, topicName: q.topicName, total: 0, correct: 0, wrong: 0, skipped: 0 };
      byTopic.set(q.topicId, row);
    }
    row.total += 1;

    const given = answers[q.key];
    if (!given) {
      row.skipped += 1;
      continue;
    }
    if (given === q.correctAnswer) {
      correct += 1;
      row.correct += 1;
    } else {
      wrong += 1;
      row.wrong += 1;
    }
  }

  const total = questions.length;
  const answered = correct + wrong;
  const skipped = total - answered;
  const net = applyNegative ? correct - CSAT_NEGATIVE_MARK * wrong : correct;
  const percent = total > 0 ? (net / total) * 100 : 0;

  return {
    total,
    answered,
    correct,
    wrong,
    skipped,
    net,
    percent,
    byTopic: [...byTopic.values()],
  };
}
