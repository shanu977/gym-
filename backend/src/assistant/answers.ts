import { generalGuidance, gym, memberships, programs, products, trainers } from "./knowledge.js";

const inr = (value: number) => `₹${value.toLocaleString("en-IN")}`;

const has = (text: string, words: string[]) => words.some((word) => text.includes(word));

const clean = (value: string) => value.toLowerCase().replace(/[^a-z0-9₹%/\s-]/g, " ").replace(/\s+/g, " ").trim();

const productLine = (product: (typeof products)[number]) => {
  const price = product.compareAtPrice ? `${inr(product.price)} (was ${inr(product.compareAtPrice)})` : inr(product.price);
  return `${product.name} — ${price} · ${product.stock} · ${product.category}`;
};

const trainerLine = (trainer: (typeof trainers)[number]) => `${trainer.name} — ${trainer.discipline} · ${trainer.fee} · ${trainer.availability} · rated ${trainer.rating}`;

const programLine = (program: (typeof programs)[number]) => {
  const trainer = trainers.find((item) => item.id === program.trainerId);
  return `${program.title} — ${program.duration}, ${program.sessionsPerWeek}, ${program.difficulty}${trainer ? ` with ${trainer.name}` : ""}`;
};

function membershipAnswer() {
  const lines = memberships.map(
    (plan) =>
      `${plan.name}: ${inr(plan.monthlyPrice)}/month or ${inr(plan.yearlyPrice)}/year (save ${inr(plan.yearlySavings)}). Gym floor access ${plan.accessHours}. Includes ${plan.highlights.slice(0, 3).join(", ").toLowerCase()}.`,
  );
  return `Iron Peak has three memberships:\n${lines.map((line) => `• ${line}`).join("\n")}\nEvery plan is billed monthly or yearly and can be started from the Memberships page.`;
}

function hoursAnswer() {
  const lines = gym.hours.map((entry) => `${entry.plan} plan: gym floor access ${entry.access}`);
  return `Iron Peak Fitness is a private training club in ${gym.location}.\n\nGym floor access hours by membership:\n${lines.map((line) => `• ${line}`).join("\n")}\n\n${gym.hoursNote} For reception or class times, email ${gym.email} or call ${gym.phone}.`;
}

function contactAnswer() {
  return `Iron Peak Fitness (${gym.established}) is a private training club in ${gym.location}.\n\n• Email: ${gym.email}\n• Phone: ${gym.phone}\n• Address: ${gym.addressNote}\n\nYou can also use the Contact page on the site to send an enquiry.`;
}

function trainersAnswer(query: string) {
  const match = trainers.find((trainer) => has(clean(query), [trainer.name.split(" ")[0]!.toLowerCase(), trainer.discipline.split(" ")[0]!.toLowerCase()]));
  if (match) {
    return `${match.name} — ${match.discipline}\n\n${match.summary}\n\n• Experience: ${match.experience}\n• Rating: ${match.rating}\n• Fee: ${match.fee}\n• Availability: ${match.availability}\n• Focus: ${match.focus.join(", ")}`;
  }
  return `Meet the Iron Peak coaching team:\n${trainers.map((trainer) => `• ${trainerLine(trainer)}`).join("\n")}\n\nEvery trainer offers one-to-one sessions — you can book from their profile on the Trainers page.`;
}

function programsAnswer(query: string) {
  const match = programs.find((program) => has(clean(query), [program.title.toLowerCase(), program.id]));
  if (match) {
    const trainer = trainers.find((item) => item.id === match.trainerId);
    return `${match.title} (${match.category})\n\n${match.summary}\n\n• Duration: ${match.duration}\n• Frequency: ${match.sessionsPerWeek}\n• Difficulty: ${match.difficulty}${trainer ? `\n• Coach: ${trainer.name}` : ""}\n• You get: ${match.benefits.join(", ").toLowerCase()}`;
  }
  if (has(clean(query), ["lose weight", "fat loss", "weight loss"])) {
    const program = programs.find((item) => item.id === "weight-loss")!;
    return `For fat loss, the Weight Loss program is the natural fit: ${programLine(program)}.\n\n${program.summary} It also includes a habit tracker, two coach consultations and a foundational movement guide.`;
  }
  if (has(clean(query), ["strong", "strength", "get stronger"])) {
    const program = programs.find((item) => item.id === "strength-training")!;
    return `For getting stronger, start with Strength Training: ${programLine(program)}.\n\n${program.summary} It includes a 12-week plan, weekly form review and progress tracking.`;
  }
  return `Iron Peak runs four programs:\n${programs.map((program) => `• ${programLine(program)}`).join("\n")}\n\nTell me your goal — strength, muscle, fat loss or general fitness — and I will point you to the right one.`;
}

function proteinAnswer(query: string) {
  const q = clean(query);
  const inStock = products.filter((product) => product.stock !== "Out of stock");
  const protein = inStock.filter((product) => product.category === "Whey Protein");
  const match = products.find((product) => has(q, [product.name.toLowerCase(), product.name.toLowerCase().replace(/\s*\/\s*/g, " ")]));
  if (match) {
    const price = match.compareAtPrice ? `${inr(match.price)} (was ${inr(match.compareAtPrice)})` : inr(match.price);
    return `${match.name} by ${match.brand}\n\n${match.summary}\n\n• Price: ${price}\n• Availability: ${match.stock}\n• Category: ${match.category}\n• Rating: ${match.rating} / 5\n• Highlights: ${match.highlights.join(", ")}`;
  }
  return `In stock protein options right now:\n${protein.map((product) => `• ${productLine(product)}`).join("\n")}\n\nPeak Whey / Vanilla is the best seller at ${inr(3490)} with 25 g protein per serving. Recovery Essentials Bundle (${inr(4490)}) is a lower-cost bundle, but it is low stock.`;
}

function supplementsAnswer() {
  const supplementCategories = ["Whey Protein", "Pre Workout", "Creatine", "Amino Acids", "Fat Loss", "Anabolic", "Health & Wellness"];
  const list = products.filter((product) => supplementCategories.includes(product.category));
  return `Iron Peak stocks these supplements:\n${list.map((product) => `• ${productLine(product)}`).join("\n")}\n\nHydration Tabs are currently out of stock. Everything else above is available to order from the Shop.`;
}

function productSearchAnswer(query: string) {
  const q = clean(query);
  const matches = products.filter((product) => has(q, [product.name.toLowerCase(), product.brand.toLowerCase(), product.category.toLowerCase(), product.id]));
  if (!matches.length) return "";
  return `${matches.length === 1 ? "Here is the product" : "Here are the products"} that match:\n${matches.map((product) => `• ${productLine(product)} — ${product.summary}`).join("\n")}\n\nOpen the Shop page for full details, reviews and checkout.`;
}

function priceAnswer(query: string) {
  const q = clean(query);
  const match = products.find((product) => has(q, [product.name.toLowerCase(), product.id]));
  if (match) {
    const price = match.compareAtPrice ? `${inr(match.price)} (was ${inr(match.compareAtPrice)}, you save ${inr(match.compareAtPrice - match.price)})` : inr(match.price);
    return `${match.name} is ${price} and is currently ${match.stock.toLowerCase()}.`;
  }
  return membershipAnswer();
}

function recommendationAnswer(query: string) {
  const q = clean(query);
  if (has(q, ["muscle", "gain", "bulk", "size"])) {
    return `For building muscle, pair a program with the right fuel:\n• Program: ${programLine(programs.find((item) => item.id === "muscle-building")!)}\n• Protein: Peak Whey / Vanilla — ${inr(3490)}, 25 g per serving\n• Support: Daily Creatine — ${inr(1890)}, 5 g per serving\n\nThat combination covers training, recovery protein and the most researched performance supplement.`;
  }
  if (has(q, ["lose", "fat", "cut", "lean"])) {
    return `For fat loss, keep protein high and total calories in check:\n• Program: ${programLine(programs.find((item) => item.id === "weight-loss")!)}\n• Protein: Peak Whey / Vanilla — ${inr(3490)} to hit protein targets\n• Snack: Cocoa Protein Crisp — ${inr(190)} for the gaps between meals\n\nSkip the pre-workout if you train later in the day — Form Pre-Workout has 200 mg caffeine per serving.`;
  }
  if (has(q, ["beginner", "start", "new", "first"])) {
    return `A clean starting point for a beginner:\n• Program: ${programLine(programs.find((item) => item.id === "functional-training")!)}\n• Coach: Leah Morgan — ${trainers.find((item) => item.id === "leah-morgan")!.fee}, ${trainers.find((item) => item.id === "leah-morgan")!.availability}\n• Membership: Essential at ${inr(4900)}/month with access ${gym.hours[0]!.access}\n• Fuel: Daily Multi Complex — ${inr(1290)}\n\nOnce the basics feel easy, move to Strength Training.`;
  }
  if (has(q, ["energy", "pre", "before workout", "pump", "focus"])) {
    return `For training-day energy: Form Pre-Workout — ${inr(2290)} (was ${inr(2590)}), 200 mg caffeine per serving, 30 servings, no artificial colours. Take it 20-30 minutes before training and avoid it within 6 hours of bedtime.`;
  }
  if (has(q, ["recovery", "sore", "sleep", "rest"])) {
    return `For recovery: Daily Creatine — ${inr(1890)} for repeat performance, plus the Recovery Essentials Bundle — ${inr(4490)} (low stock). Recovery suite access is also included with Performance and Elite memberships.`;
  }
  const protein = products.find((product) => product.id === "peak-whey-vanilla")!;
  return `Here is a solid default stack:\n• ${productLine(protein)} — everyday recovery protein\n• ${productLine(products.find((product) => product.id === "daily-creatine")!)} — 5 g a day for strength and power\n• ${productLine(products.find((product) => product.id === "form-pre-workout")!)} — training-day energy\n\nTell me your goal (strength, muscle, fat loss or endurance) and I will narrow it down.`;
}

function guidanceAnswer(query: string) {
  const q = clean(query);
  const match = generalGuidance.find((item) => has(q, [item.topic.toLowerCase(), item.id.split("-")[0]!]));
  if (match) return `${match.topic}\n\n${match.advice}\n\nFor programming that fits your schedule, the Programs page and our coaches are the best next step.`;
  return `Here is general guidance I can help with:\n${generalGuidance.map((item) => `• ${item.topic}: ${item.advice.split(".")[0]}.`).join("\n")}\n\nAsk me about a specific topic for the full answer, or about our programs, trainers, memberships and supplements.`;
}

const fallback = () =>
  `I can help with Iron Peak Fitness specifics:\n• Memberships and pricing\n• Programs and trainers\n• Supplements, protein and product prices\n• Gym location and access hours\n• General training and nutrition guidance\n\nTry one of the suggested prompts below, or email ${gym.email} / call ${gym.phone} for anything I cannot answer.`;

export function demoAnswer(message: string): string {
  const q = clean(message);

  if (!q) return fallback();

  if (has(q, ["hi", "hello", "hey", "yo ", "good morning", "good evening"]) && q.length < 30) {
    return `Hi — I am the Iron Peak assistant. What are we working toward today? I can cover memberships, programs, trainers, supplements and general training guidance.`;
  }

  if (has(q, ["thank", "thanks", "cheers", "bye", "great"])) {
    return `Any time. Keep the momentum going — and if you want a hand choosing a plan or program, just say the word.`;
  }

  if (has(q, ["hour", "open", "closing", "timing", "when do you", "what time"])) return hoursAnswer();
  if (has(q, ["where are you", "address", "location", "directions", "contact", "phone number", "email", "reach you"])) return contactAnswer();

  if (has(q, ["membership", "plan", "subscription", "join", "monthly", "yearly", "annual", "price of gym", "cost of gym"])) {
    if (has(q, ["compare", "difference", "which plan", "which membership", "best plan"])) {
      return `${membershipAnswer()}\n\nEssential is best for self-directed training, Performance for coached structure and recovery access, and Elite if you want dedicated coaching and programming every month.`;
    }
    return membershipAnswer();
  }

  if (has(q, ["trainer", "coach", "personal training", "who teaches", "session fee"])) return trainersAnswer(q);
  if (has(q, ["program", "workout", "routine", "strong", "strength", "muscle", "weight loss", "lose weight", "fat loss", "beginner"])) return programsAnswer(q);

  const search = productSearchAnswer(q);
  if (search) return search;

  if (has(q, ["protein", "whey", "shake", "supplement", "creatine", "pre-workout", "pre workout", "vitamin", "hydration", "electrolyte", "snack"])) {
    return proteinAnswer(q);
  }

  if (has(q, ["how much", "price", "cost", "rate", "₹", "rupees", "expensive", "cheap"])) return priceAnswer(q);
  if (has(q, ["recommend", "suggest", "best product", "what should i take", "stack", "buy"])) return recommendationAnswer(q);
  if (has(q, ["how do i", "how to", "advice", "tips", "diet", "nutrition", "eat", "calories", "lose", "gain", "sleep", "recover", "cardio", "warm up", "stretch"])) return guidanceAnswer(q);
  if (has(q, ["shop", "product", "store", "buy", "order", "accessories", "equipment", "gear", "apparel"])) return supplementsAnswer();

  return fallback();
}
