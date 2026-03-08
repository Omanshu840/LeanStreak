export type EatReason = "hungry" | "bored" | "stressed" | "craving";

export interface ReasonOption {
  value:       EatReason;
  label:       string;
  emoji:       string;
  description: string;
}

export interface Suggestion {
  emoji:   string;
  title:   string;
  message: string;
  actions: string[];
}

export const REASONS: ReasonOption[] = [
  {
    value:       "hungry",
    label:       "Hungry",
    emoji:       "😋",
    description: "My stomach is growling",
  },
  {
    value:       "bored",
    label:       "Bored",
    emoji:       "😴",
    description: "Nothing else to do",
  },
  {
    value:       "stressed",
    label:       "Stressed",
    emoji:       "😰",
    description: "Feeling anxious or overwhelmed",
  },
  {
    value:       "craving",
    label:       "Just Craving",
    emoji:       "🍫",
    description: "Something specific sounds good",
  },
];

export const SUGGESTIONS: Record<EatReason, Suggestion> = {
  hungry: {
    emoji:   "✅",
    title:   "Go ahead and eat!",
    message: "You're genuinely hungry. Choose something nourishing.",
    actions: ["Eat a balanced meal", "Include protein", "Avoid oversized portions"],
  },
  bored: {
    emoji:   "🚶",
    title:   "Not actually hungry",
    message: "Boredom eating adds calories without satisfaction. Try this first:",
    actions: ["Drink water", "Wait 10 minutes", "Take a short walk"],
  },
  stressed: {
    emoji:   "🧘",
    title:   "Stress eating alert",
    message: "Food won't fix stress. Give your body 10 minutes:",
    actions: ["Take 5 deep breaths", "Step outside briefly", "Drink water"],
  },
  craving: {
    emoji:   "⏳",
    title:   "Wait it out",
    message: "Cravings peak and fade in 10–15 minutes. Try this:",
    actions: ["Drink water and wait 10 min", "Eat a piece of fruit instead", "Chew gum"],
  },
};
