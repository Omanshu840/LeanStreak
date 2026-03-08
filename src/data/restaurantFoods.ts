export type FoodCategory =
  | "fastfood"
  | "indian"
  | "pizza"
  | "drinks"
  | "snacks"
  | "chinese"
  | "healthy";

export interface FoodItem {
  id:           string;
  name:         string;
  emoji:        string;
  category:     FoodCategory;
  calories:     number;        // per serving
  servingLabel: string;        // "1 slice", "1 plate" etc.
  tags:         string[];      // for search matching
}

export const FOOD_DATABASE: FoodItem[] = [
  // ── Fast Food ───────────────────────────────────────────
  {
    id: "burger",        name: "Burger",            emoji: "🍔",
    category: "fastfood", calories: 354,
    servingLabel: "1 burger",
    tags: ["burger", "beef", "mcdonalds", "bun"],
  },
  {
    id: "fries",         name: "French Fries",      emoji: "🍟",
    category: "fastfood", calories: 365,
    servingLabel: "medium serving",
    tags: ["fries", "chips", "potato"],
  },
  {
    id: "hot-dog",       name: "Hot Dog",            emoji: "🌭",
    category: "fastfood", calories: 290,
    servingLabel: "1 hot dog",
    tags: ["hotdog", "sausage"],
  },
  {
    id: "fried-chicken", name: "Fried Chicken",      emoji: "🍗",
    category: "fastfood", calories: 320,
    servingLabel: "2 pieces",
    tags: ["fried chicken", "kfc", "crispy"],
  },
  {
    id: "sandwich",      name: "Sandwich",            emoji: "🥪",
    category: "fastfood", calories: 300,
    servingLabel: "1 sandwich",
    tags: ["sandwich", "sub", "subway"],
  },

  // ── Pizza ───────────────────────────────────────────────
  {
    id: "pizza-slice",   name: "Pizza (1 slice)",    emoji: "🍕",
    category: "pizza",    calories: 285,
    servingLabel: "1 slice",
    tags: ["pizza", "slice", "cheese", "pepperoni"],
  },
  {
    id: "pizza-whole",   name: "Pizza (whole)",       emoji: "🍕",
    category: "pizza",    calories: 1140,
    servingLabel: "4 slices",
    tags: ["pizza", "whole", "full"],
  },
  {
    id: "garlic-bread",  name: "Garlic Bread",        emoji: "🥖",
    category: "pizza",    calories: 200,
    servingLabel: "2 pieces",
    tags: ["garlic bread", "bread", "pizza side"],
  },

  // ── Indian ──────────────────────────────────────────────
  {
    id: "biryani",       name: "Biryani",             emoji: "🍚",
    category: "indian",   calories: 490,
    servingLabel: "1 plate",
    tags: ["biryani", "rice", "indian"],
  },
  {
    id: "butter-chicken",name: "Butter Chicken",      emoji: "🍛",
    category: "indian",   calories: 438,
    servingLabel: "1 bowl + naan",
    tags: ["butter chicken", "murgh makhani", "curry"],
  },
  {
    id: "naan",          name: "Butter Naan",          emoji: "🫓",
    category: "indian",   calories: 170,
    servingLabel: "1 naan",
    tags: ["naan", "bread", "roti"],
  },
  {
    id: "dosa",          name: "Masala Dosa",          emoji: "🥞",
    category: "indian",   calories: 230,
    servingLabel: "1 dosa",
    tags: ["dosa", "south indian", "masala"],
  },
  {
    id: "samosa",        name: "Samosa",               emoji: "🔺",
    category: "indian",   calories: 260,
    servingLabel: "2 pieces",
    tags: ["samosa", "snack", "fried"],
  },
  {
    id: "chole-bhature", name: "Chole Bhature",        emoji: "🍽️",
    category: "indian",   calories: 620,
    servingLabel: "1 plate",
    tags: ["chole", "bhature", "punjabi"],
  },
  {
    id: "dal-makhani",   name: "Dal Makhani + Rice",   emoji: "🍲",
    category: "indian",   calories: 350,
    servingLabel: "1 bowl + rice",
    tags: ["dal", "lentil", "makhani"],
  },
  {
    id: "pav-bhaji",     name: "Pav Bhaji",            emoji: "🍞",
    category: "indian",   calories: 380,
    servingLabel: "2 pav + bhaji",
    tags: ["pav bhaji", "mumbai", "street food"],
  },

  // ── Chinese ─────────────────────────────────────────────
  {
    id: "fried-rice",    name: "Fried Rice",           emoji: "🍳",
    category: "chinese",  calories: 400,
    servingLabel: "1 plate",
    tags: ["fried rice", "chinese", "egg rice"],
  },
  {
    id: "noodles",       name: "Hakka Noodles",        emoji: "🍜",
    category: "chinese",  calories: 360,
    servingLabel: "1 plate",
    tags: ["noodles", "hakka", "chowmein"],
  },
  {
    id: "manchurian",    name: "Manchurian",           emoji: "🥡",
    category: "chinese",  calories: 280,
    servingLabel: "6 pieces",
    tags: ["manchurian", "gravy", "chinese"],
  },
  {
    id: "momos",         name: "Momos",                emoji: "🥟",
    category: "chinese",  calories: 250,
    servingLabel: "6 pieces",
    tags: ["momos", "dumplings", "steamed"],
  },

  // ── Drinks ──────────────────────────────────────────────
  {
    id: "cola",          name: "Cola / Soft Drink",   emoji: "🥤",
    category: "drinks",   calories: 140,
    servingLabel: "330ml can",
    tags: ["cola", "coke", "pepsi", "soda", "soft drink"],
  },
  {
    id: "lassi",         name: "Sweet Lassi",          emoji: "🥛",
    category: "drinks",   calories: 220,
    servingLabel: "1 glass",
    tags: ["lassi", "yogurt", "sweet"],
  },
  {
    id: "milkshake",     name: "Milkshake",            emoji: "🥤",
    category: "drinks",   calories: 370,
    servingLabel: "1 glass",
    tags: ["milkshake", "shake", "chocolate", "vanilla"],
  },
  {
    id: "chai",          name: "Chai (with milk)",     emoji: "🍵",
    category: "drinks",   calories: 60,
    servingLabel: "1 cup",
    tags: ["chai", "tea", "milk tea"],
  },
  {
    id: "juice",         name: "Fruit Juice",          emoji: "🧃",
    category: "drinks",   calories: 120,
    servingLabel: "1 glass",
    tags: ["juice", "orange juice", "mango juice"],
  },

  // ── Snacks ──────────────────────────────────────────────
  {
    id: "vada-pav",      name: "Vada Pav",             emoji: "🍔",
    category: "snacks",   calories: 290,
    servingLabel: "1 piece",
    tags: ["vada pav", "mumbai", "street"],
  },
  {
    id: "chips",         name: "Chips / Crisps",       emoji: "🥔",
    category: "snacks",   calories: 260,
    servingLabel: "1 pack (50g)",
    tags: ["chips", "crisps", "lays", "snack"],
  },
  {
    id: "ice-cream",     name: "Ice Cream",            emoji: "🍦",
    category: "snacks",   calories: 200,
    servingLabel: "1 scoop",
    tags: ["ice cream", "gelato", "dessert"],
  },
  {
    id: "gulab-jamun",   name: "Gulab Jamun",          emoji: "🍮",
    category: "snacks",   calories: 175,
    servingLabel: "2 pieces",
    tags: ["gulab jamun", "sweet", "dessert", "mithai"],
  },

  // ── Healthy ─────────────────────────────────────────────
  {
    id: "salad",         name: "Green Salad",          emoji: "🥗",
    category: "healthy",  calories: 80,
    servingLabel: "1 bowl",
    tags: ["salad", "greens", "healthy"],
  },
  {
    id: "fruit-bowl",    name: "Fruit Bowl",           emoji: "🍱",
    category: "healthy",  calories: 120,
    servingLabel: "1 bowl",
    tags: ["fruit", "bowl", "healthy"],
  },
  {
    id: "grilled-chicken",name: "Grilled Chicken",     emoji: "🍗",
    category: "healthy",  calories: 185,
    servingLabel: "1 piece",
    tags: ["grilled chicken", "healthy", "protein"],
  },
];

export const CATEGORY_META: Record<FoodCategory, { label: string; emoji: string }> = {
  fastfood: { label: "Fast Food", emoji: "🍔" },
  indian:   { label: "Indian",    emoji: "🍛" },
  pizza:    { label: "Pizza",     emoji: "🍕" },
  drinks:   { label: "Drinks",    emoji: "🥤" },
  snacks:   { label: "Snacks",    emoji: "🍟" },
  chinese:  { label: "Chinese",   emoji: "🥡" },
  healthy:  { label: "Healthy",   emoji: "🥗" },
};
