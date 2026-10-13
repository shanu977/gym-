export type KnowledgeProduct = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  stock: string;
  rating: number;
  summary: string;
  highlights: string[];
};

export type KnowledgeMembership = {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlySavings: number;
  accessHours: string;
  popular: boolean;
  summary: string;
  highlights: string[];
};

export type KnowledgeTrainer = {
  id: string;
  name: string;
  discipline: string;
  experience: string;
  fee: string;
  availability: string;
  rating: string;
  summary: string;
  focus: string[];
};

export type KnowledgeProgram = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  duration: string;
  sessionsPerWeek: string;
  trainerId: string;
  summary: string;
  benefits: string[];
};

export const gym = {
  name: "Iron Peak Fitness",
  brand: "IRON PEAK",
  tagline: "Train with intention. Live at your peak.",
  established: "EST. 2024",
  type: "Private training club",
  location: "Bandra Kurla Complex, Mumbai, India",
  email: "hello@ironpeak.fit",
  phone: "+91 22 4024 0240",
  addressNote: "Bandra Kurla Complex, Mumbai",
  hoursNote:
    "General club reception hours are not published on the website. Gym floor access hours are set by membership plan.",
  hours: [
    { plan: "Essential", access: "06:00 — 22:00" },
    { plan: "Performance", access: "05:00 — 23:00" },
    { plan: "Elite", access: "05:00 — 23:00" },
  ],
};

export const memberships: KnowledgeMembership[] = [
  {
    id: "essential",
    name: "Essential",
    monthlyPrice: 4900,
    yearlyPrice: 49900,
    yearlySavings: 8900,
    accessHours: "06:00 — 22:00",
    popular: false,
    summary: "The focused foundation for a consistent training practice.",
    highlights: ["Open gym access", "Premium changing rooms", "Progress tracking app", "2 group classes / month", "1 guest pass / quarter"],
  },
  {
    id: "performance",
    name: "Performance",
    monthlyPrice: 8900,
    yearlyPrice: 89900,
    yearlySavings: 16900,
    accessHours: "05:00 — 23:00",
    popular: true,
    summary: "A complete system for members ready to make progress compound.",
    highlights: ["Unlimited gym access", "Weekly coach-led session", "Recovery suite access", "1 personal training session / month", "Monthly nutrition check-in"],
  },
  {
    id: "elite",
    name: "Elite",
    monthlyPrice: 18900,
    yearlyPrice: 189900,
    yearlySavings: 36900,
    accessHours: "05:00 — 23:00",
    popular: false,
    summary: "The most personal expression of the Iron Peak standard.",
    highlights: ["4 personal sessions / month", "Custom programming", "Full recovery suite", "Dedicated trainer", "Dedicated nutrition plan"],
  },
];

export const trainers: KnowledgeTrainer[] = [
  {
    id: "maya-shah",
    name: "Maya Shah",
    discipline: "Strength & Conditioning",
    experience: "9 years experience",
    fee: "₹2,400 / session",
    availability: "Mon — Sat · 6:00 AM — 2:00 PM",
    rating: "4.9 (84 reviews)",
    summary: "Maya believes strength is a skill you can learn. Her coaching is precise, encouraging and built around helping people feel capable in their own bodies.",
    focus: ["Strength Training", "Personal Training", "Weight Loss Training"],
  },
  {
    id: "arjun-rao",
    name: "Arjun Rao",
    discipline: "Athletic Performance",
    experience: "11 years experience",
    fee: "₹2,800 / session",
    availability: "Tue — Sun · 4:00 PM — 9:00 PM",
    rating: "5.0 (112 reviews)",
    summary: "Arjun works with ambitious people who want their training to translate into real-world performance. Expect clarity, challenge and momentum.",
    focus: ["Strength Training", "Functional Training", "Personal Training"],
  },
  {
    id: "leah-morgan",
    name: "Leah Morgan",
    discipline: "Mobility & Recovery",
    experience: "7 years experience",
    fee: "₹2,200 / session",
    availability: "Mon — Fri · 7:00 AM — 4:00 PM",
    rating: "4.9 (67 reviews)",
    summary: "Leah brings together strength, mobility and recovery for a training practice that feels as good as it performs.",
    focus: ["Functional Training", "Mixed Training", "Personal Training"],
  },
];

export const programs: KnowledgeProgram[] = [
  {
    id: "strength-training",
    title: "Strength Training",
    category: "Performance",
    difficulty: "Intermediate",
    duration: "12 weeks",
    sessionsPerWeek: "3 sessions / week",
    trainerId: "maya-shah",
    summary: "A considered progression for building real, lasting strength through compound movement and disciplined progression.",
    benefits: ["Progressive strength development", "Technical lifting foundations", "Personalized progression targets"],
  },
  {
    id: "muscle-building",
    title: "Muscle Building",
    category: "Hypertrophy",
    difficulty: "Intermediate",
    duration: "10 weeks",
    sessionsPerWeek: "4 sessions / week",
    trainerId: "arjun-rao",
    summary: "Train with precision, eat with intent and build a stronger frame with a plan that compounds.",
    benefits: ["Structured hypertrophy blocks", "Movement-specific volume", "Nutrition habit guidance"],
  },
  {
    id: "functional-training",
    title: "Functional Training",
    category: "Movement",
    difficulty: "All levels",
    duration: "8 weeks",
    sessionsPerWeek: "3 sessions / week",
    trainerId: "leah-morgan",
    summary: "Power, endurance and movement for the everyday athlete — built to make your whole life feel better.",
    benefits: ["Better mobility and control", "Athletic conditioning", "Resilient movement patterns"],
  },
  {
    id: "weight-loss",
    title: "Weight Loss",
    category: "Essentials",
    difficulty: "Beginner",
    duration: "6 weeks",
    sessionsPerWeek: "3 sessions / week",
    trainerId: "maya-shah",
    summary: "Build the rituals, mobility and confidence that make sustainable change feel possible.",
    benefits: ["Sustainable training rhythm", "Conditioning for energy", "Simple nutrition structure"],
  },
];

export const products: KnowledgeProduct[] = [
  // 1. Whey Protein
  {
    id: "peak-whey-vanilla",
    name: "Peak Whey / Vanilla",
    brand: "Iron Peak Nutrition",
    category: "Whey Protein",
    price: 3490,
    compareAtPrice: 3990,
    stock: "In stock",
    rating: 4.9,
    summary: "A clean, smooth whey isolate for everyday recovery and steady progress.",
    highlights: ["25 g protein per serving", "33 servings per 1 kg pack", "Low sugar formula"],
  },
  {
    id: "on-gold-standard-whey",
    name: "Optimum Nutrition Gold Standard 100% Whey",
    brand: "Optimum Nutrition",
    category: "Whey Protein",
    price: 3299,
    compareAtPrice: 3899,
    stock: "In stock",
    rating: 4.9,
    summary: "World’s #1 whey protein powder with 24g whey isolate blend.",
    highlights: ["24 g protein per scoop", "5.5 g naturally occurring BCAAs", "Informed-Choice certified"],
  },
  {
    id: "dymatize-iso100-chocolate",
    name: "Dymatize ISO100 Hydrolyzed 100% Whey Isolate",
    brand: "Dymatize",
    category: "Whey Protein",
    price: 4899,
    compareAtPrice: 5499,
    stock: "In stock",
    rating: 4.9,
    summary: "Ultra-fast absorbing hydrolyzed 100% whey isolate.",
    highlights: ["25 g hydrolyzed whey isolate", "Ultra-fast digestion", "Banned substance tested"],
  },
  {
    id: "recovery-bundle",
    name: "Recovery Essentials Bundle",
    brand: "Iron Peak Nutrition",
    category: "Whey Protein",
    price: 4490,
    compareAtPrice: 5190,
    stock: "Low stock",
    rating: 4.8,
    summary: "A bundle of recovery essentials at a value price.",
    highlights: ["Recovery focus", "Bundle value"],
  },

  // 2. Creatine
  {
    id: "daily-creatine",
    name: "Daily Creatine",
    brand: "Iron Peak Nutrition",
    category: "Creatine",
    price: 1890,
    compareAtPrice: 2190,
    stock: "In stock",
    rating: 4.9,
    summary: "Pure micronized creatine monohydrate to support strength, power and repeat performance.",
    highlights: ["5 g creatine per serving", "60 servings", "Third-party tested"],
  },
  {
    id: "on-micronized-creatine",
    name: "Optimum Nutrition Micronized Creatine Powder",
    brand: "Optimum Nutrition",
    category: "Creatine",
    price: 1199,
    compareAtPrice: 1499,
    stock: "In stock",
    rating: 4.8,
    summary: "Pure micronized creatine monohydrate for muscle strength and explosive power.",
    highlights: ["Creapure micronized monohydrate", "83 servings", "Zero fillers"],
  },
  {
    id: "muscleblaze-creamp-creatine",
    name: "MuscleBlaze Creatine Monohydrate CreAMP",
    brand: "MuscleBlaze",
    category: "Creatine",
    price: 999,
    compareAtPrice: 1299,
    stock: "In stock",
    rating: 4.7,
    summary: "CreAMP formula with MB CreAbsorb for enhanced bioavailability.",
    highlights: ["CreAbsorb absorption technology", "3 g monohydrate per scoop", "Labdoor certified"],
  },

  // 3. Pre Workout
  {
    id: "form-pre-workout",
    name: "Form Pre-Workout",
    brand: "Form Athletics",
    category: "Pre Workout",
    price: 2290,
    compareAtPrice: 2590,
    stock: "In stock",
    rating: 4.8,
    summary: "A focused pre-training blend designed for clean energy, drive and session-ready intent.",
    highlights: ["200 mg caffeine per serving", "30 servings", "No artificial colours"],
  },
  {
    id: "cellucor-c4-original",
    name: "Cellucor C4 Original Pre-Workout",
    brand: "Cellucor",
    category: "Pre Workout",
    price: 2499,
    compareAtPrice: 2999,
    stock: "In stock",
    rating: 4.8,
    summary: "Explosive energy and muscular endurance with CarnoSyn Beta-Alanine.",
    highlights: ["150 mg caffeine", "1.6 g CarnoSyn Beta-Alanine", "Zero sugar"],
  },
  {
    id: "muscleblaze-wrathx",
    name: "MuscleBlaze WrathX Pre-Workout",
    brand: "MuscleBlaze",
    category: "Pre Workout",
    price: 1799,
    compareAtPrice: 2199,
    stock: "In stock",
    rating: 4.7,
    summary: "High-intensity formula with 400mg caffeine & 3000mg L-Citrulline.",
    highlights: ["3000 mg L-Citrulline pumps", "400 mg caffeine complex", "1500 mg Beta-Alanine"],
  },

  // 4. Amino Acids
  {
    id: "on-amino-energy",
    name: "Optimum Nutrition Essential Amino Energy",
    brand: "Optimum Nutrition",
    category: "Amino Acids",
    price: 1999,
    compareAtPrice: 2499,
    stock: "In stock",
    rating: 4.8,
    summary: "Essential amino acids with natural green tea caffeine for energy anytime.",
    highlights: ["5 g amino acid blend", "100 mg natural caffeine", "Intra-workout recovery"],
  },
  {
    id: "muscleblaze-bcaa-pro",
    name: "MuscleBlaze BCAA Pro 2:1:1",
    brand: "MuscleBlaze",
    category: "Amino Acids",
    price: 1499,
    compareAtPrice: 1899,
    stock: "In stock",
    rating: 4.7,
    summary: "Intra-workout formulation with 7g BCAAs, Glutamine and electrolytes.",
    highlights: ["7 g BCAAs in 2:1:1 ratio", "2.5 g L-Glutamine", "Electrolyte matrix"],
  },
  {
    id: "scivation-xtend-bcaa",
    name: "Scivation Xtend Original BCAA Powder",
    brand: "Scivation",
    category: "Amino Acids",
    price: 2199,
    compareAtPrice: 2699,
    stock: "In stock",
    rating: 4.9,
    summary: "The original 7g intra-workout BCAA with hydration electrolytes.",
    highlights: ["7 g BCAAs", "Hydration electrolytes", "Zero sugar or carbs"],
  },

  // 5. Fat Loss
  {
    id: "mb-burner-pro",
    name: "MuscleBlaze MB-Burner PRO",
    brand: "MuscleBlaze",
    category: "Fat Loss",
    price: 899,
    compareAtPrice: 1199,
    stock: "In stock",
    rating: 4.6,
    summary: "Thermogenic weight management formula with Garcinia Cambogia and Green Tea.",
    highlights: ["Garcinia Cambogia & Green Tea", "Thermogenic metabolism support", "FSSAI compliant"],
  },
  {
    id: "gnc-l-carnitine-500",
    name: "GNC Pro Performance L-Carnitine 500mg",
    brand: "GNC",
    category: "Fat Loss",
    price: 1399,
    compareAtPrice: 1799,
    stock: "In stock",
    rating: 4.8,
    summary: "Cellular fat metabolism & free fatty acid transport support.",
    highlights: ["500 mg L-Carnitine L-Tartrate", "Converts fat to energy", "Non-stimulant"],
  },

  // 6. Anabolic
  {
    id: "mb-t-surge-natural",
    name: "MuscleBlaze Koshaveda T-Surge Natural Support",
    brand: "MuscleBlaze",
    category: "Anabolic",
    price: 999,
    compareAtPrice: 1499,
    stock: "In stock",
    rating: 4.7,
    summary: "Lawful Ayurvedic stamina & natural testosterone support with KSM-66 Ashwagandha.",
    highlights: ["KSM-66 Ashwagandha & Shilajit", "Safe & 100% lawful botanical tonic", "Vitality and stamina support"],
  },
  {
    id: "himalaya-gokshura-tablets",
    name: "Himalaya Pure Herbs Gokshura",
    brand: "Himalaya Herbals",
    category: "Anabolic",
    price: 290,
    compareAtPrice: 350,
    stock: "In stock",
    rating: 4.8,
    summary: "Pure Tribulus Terrestris extract for physical stamina, vigor and muscle tone.",
    highlights: ["Pure Tribulus Terrestris extract", "Traditional stamina & vigor tonic", "100% vegetarian"],
  },

  // 7. Health & Wellness
  {
    id: "daily-multi",
    name: "Daily Multi Complex",
    brand: "Northline Labs",
    category: "Health & Wellness",
    price: 1290,
    stock: "In stock",
    rating: 4.8,
    summary: "A daily multivitamin base for consistent training and everyday performance.",
    highlights: ["Daily wellness base", "Everyday essential"],
  },
  {
    id: "electrolyte-tabs",
    name: "Hydration Tabs",
    brand: "Northline Labs",
    category: "Health & Wellness",
    price: 790,
    stock: "Out of stock",
    rating: 4.8,
    summary: "Electrolyte hydration tablets for training and recovery.",
    highlights: ["Electrolytes", "Hydration"],
  },
  {
    id: "fastandup-charge-vitaminc",
    name: "Fast&Up Charge Natural Vitamin C & Zinc",
    brand: "Fast&Up",
    category: "Health & Wellness",
    price: 320,
    compareAtPrice: 390,
    stock: "In stock",
    rating: 4.9,
    summary: "Effervescent daily immunity boost with 1000mg Amla extract and 10mg Zinc.",
    highlights: ["1000 mg Vitamin C from Amla", "10 mg Zinc", "Effervescent absorption"],
  },
  {
    id: "on-opti-men-multivitamin",
    name: "Optimum Nutrition Opti-Men Multivitamin",
    brand: "Optimum Nutrition",
    category: "Health & Wellness",
    price: 1799,
    compareAtPrice: 2199,
    stock: "In stock",
    rating: 4.8,
    summary: "Comprehensive nutrient optimization system with 75+ active ingredients.",
    highlights: ["75+ active nutrients", "4 performance blends", "Comprehensive micronutrient base"],
  },

  // 8. Protein Foods
  {
    id: "protein-crisp",
    name: "Cocoa Protein Crisp",
    brand: "Good Form Foods",
    category: "Protein Foods",
    price: 190,
    stock: "Low stock",
    rating: 4.8,
    summary: "An on-the-go cocoa protein snack for the gaps between meals.",
    highlights: ["On-the-go format", "Cocoa flavour"],
  },
  {
    id: "the-whole-truth-protein-bars",
    name: "The Whole Truth 20g Whey Protein Bars",
    brand: "The Whole Truth",
    category: "Protein Foods",
    price: 660,
    compareAtPrice: 750,
    stock: "In stock",
    rating: 4.9,
    summary: "Pack of 6 clean protein bars with 20g protein each, no added sugar.",
    highlights: ["20 g whey isolate protein per bar", "100% whole food ingredients", "Zero added sugar"],
  },
  {
    id: "yogabar-high-protein-oats",
    name: "Yoga Bar High Protein Dark Chocolate Oats",
    brand: "Yoga Bar",
    category: "Protein Foods",
    price: 499,
    compareAtPrice: 625,
    stock: "In stock",
    rating: 4.8,
    summary: "Rolled oats fortified with whey protein and chia seeds, 22g protein per 100g.",
    highlights: ["22 g protein per 100 g", "Chia seeds and almonds", "1 kg pack"],
  },

  // 9. Accessories
  {
    id: "steel-shaker",
    name: "Steel Shaker 750",
    brand: "Iron Peak Supply",
    category: "Accessories",
    price: 990,
    stock: "In stock",
    rating: 4.8,
    summary: "A durable 750 ml steel shaker for shakes and hydration at the gym.",
    highlights: ["750 ml capacity", "Stainless steel"],
  },
  {
    id: "lifting-straps",
    name: "Canvas Lifting Straps",
    brand: "Form Athletics",
    category: "Accessories",
    price: 690,
    stock: "In stock",
    rating: 4.8,
    summary: "Canvas straps for grip support on heavy pulls.",
    highlights: ["Grip support", "Strength training"],
  },
  {
    id: "training-mat",
    name: "Daily Training Mat",
    brand: "Iron Peak Supply",
    category: "Accessories",
    price: 2490,
    stock: "In stock",
    rating: 4.8,
    summary: "A training mat for mobility, warm-ups and home sessions.",
    highlights: ["Mobility and warm-up", "Home gym friendly"],
  },
  {
    id: "peak-tee",
    name: "Peak Training Tee",
    brand: "Iron Peak Apparel",
    category: "Accessories",
    price: 1690,
    stock: "In stock",
    rating: 4.8,
    summary: "Training tee built for sessions and everyday wear.",
    highlights: ["Training wear", "Iron Peak Apparel"],
  },
  {
    id: "knee-sleeve",
    name: "Training Knee Sleeve",
    brand: "Form Athletics",
    category: "Accessories",
    price: 1590,
    stock: "In stock",
    rating: 4.8,
    summary: "Knee support for squat and training days.",
    highlights: ["Squat support", "Training support"],
  },
  {
    id: "boldfit-resistance-bands",
    name: "Boldfit Resistance Bands Set (5 Levels)",
    brand: "Boldfit",
    category: "Accessories",
    price: 599,
    compareAtPrice: 899,
    stock: "In stock",
    rating: 4.8,
    summary: "Set of 5 heavy-duty natural latex resistance loop bands with carry pouch.",
    highlights: ["5 resistance levels (5-30 lbs)", "100% natural latex", "Includes carry pouch"],
  },
  {
    id: "nivia-leather-gym-belt",
    name: "Nivia Genuine Leather Weightlifting Belt",
    brand: "Nivia",
    category: "Accessories",
    price: 999,
    compareAtPrice: 1299,
    stock: "In stock",
    rating: 4.7,
    summary: "Heavy-duty contoured leather lifting belt with dual-prong steel buckle.",
    highlights: ["Genuine leather", "Contoured lumbar support", "Dual-prong steel buckle"],
  },
];

export const generalGuidance = [
  {
    id: "beginner-start",
    topic: "Starting out",
    advice:
      "Begin with 3 sessions a week of full-body training, keep sessions near 45-60 minutes, and progress by adding a little weight or one more set every week or two. Sleep and protein matter as much as the workout.",
  },
  {
    id: "protein-basics",
    topic: "Protein intake",
    advice:
      "A practical target for most lifters is roughly 1.6-2.2 g of protein per kg of bodyweight per day, spread across meals. A whey isolate shake is a convenient way to close the gap after training.",
  },
  {
    id: "creatine-basics",
    topic: "Creatine",
    advice:
      "Creatine monohydrate at around 5 g a day is one of the most researched supplements for strength and repeat performance. It works best taken consistently rather than around workouts only.",
  },
  {
    id: "recovery",
    topic: "Recovery",
    advice:
      "Recovery is where adaptation happens: aim for a regular sleep window, keep hard days separated by an easier day when possible, and use mobility work to stay ahead of niggles.",
  },
  {
    id: "weight-loss",
    topic: "Losing weight",
    advice:
      "Sustainable fat loss comes from a modest calorie deficit you can hold for months, protein-rich meals, strength training to protect muscle, and daily steps. Rapid crash plans rarely last.",
  },
];
