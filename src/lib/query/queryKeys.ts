export const queryKeys = {
  calories: {
    today: (userId: string, day: string) => ["users", userId, "calories", "day", day] as const,
  },
  habits: {
    dashboard: (userId: string, day: string) => ["users", userId, "habits", "dashboard", day] as const,
  },
  streak: {
    summary: (userId: string) => ["users", userId, "streak", "summary"] as const,
  },
  eatPrompt: {
    weekly: (userId: string) => ["users", userId, "eat-prompt", "weekly"] as const,
  },
  night: {
    dashboard: (userId: string, day: string) => ["users", userId, "night", "dashboard", day] as const,
  },
};
