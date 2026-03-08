export interface HabitPreset {
  habit_name: string;
  emoji:      string;
  category:   "movement" | "hydration" | "mindfulness" | "strength";
  duration?:  string;
}

export const DEFAULT_HABITS: HabitPreset[] = [
  // Movement
  { habit_name: "Walk 5 minutes",    emoji: "🚶", category: "movement",     duration: "5 min"  },
  { habit_name: "Walk 15 minutes",   emoji: "🏃", category: "movement",     duration: "15 min" },
  { habit_name: "Stretch",           emoji: "🧘", category: "mindfulness",  duration: "5 min"  },
  { habit_name: "10 Pushups",        emoji: "💪", category: "strength",     duration: "2 min"  },
  { habit_name: "20 Squats",         emoji: "🦵", category: "strength",     duration: "3 min"  },
  { habit_name: "Plank 30 seconds",  emoji: "🏋️", category: "strength",     duration: "1 min"  },
  // Hydration
  { habit_name: "Drink water",       emoji: "💧", category: "hydration",    duration: "1 min"  },
  { habit_name: "No sugary drinks",  emoji: "🚫", category: "hydration"                        },
  // Mindfulness
  { habit_name: "5 deep breaths",    emoji: "🌬️", category: "mindfulness",  duration: "1 min"  },
  { habit_name: "No phone at meals", emoji: "📵", category: "mindfulness"                      },
  { habit_name: "Sleep by 11 PM",    emoji: "😴", category: "mindfulness"                      },
];

export const CATEGORY_META = {
  movement:     { label: "Movement",     color: "bg-green-100  text-green-700"  },
  hydration:    { label: "Hydration",    color: "bg-blue-100   text-blue-700"   },
  mindfulness:  { label: "Mindfulness",  color: "bg-purple-100 text-purple-700" },
  strength:     { label: "Strength",     color: "bg-orange-100 text-orange-700" },
};
