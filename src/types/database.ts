export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          calorie_goal: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
        Relationships: [];
      };
      daily_calorie_budget: {
        Row: {
          id: string;
          user_id: string;
          calorie_limit: number;
          date: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["daily_calorie_budget"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["daily_calorie_budget"]["Insert"]>;
        Relationships: [];
      };
      food_entries: {
        Row: {
          id: string;
          user_id: string;
          description: string;
          calories: number;
          meal_type: "breakfast" | "lunch" | "dinner" | "snack" | null;
          eaten_at: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["food_entries"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["food_entries"]["Insert"]>;
        Relationships: [];
      };
      streaks: {
        Row: {
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_completed_date: string | null;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["streaks"]["Row"], "updated_at">;
        Update: Partial<Database["public"]["Tables"]["streaks"]["Insert"]>;
        Relationships: [];
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          habit_name: string;
          emoji: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["habits"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["habits"]["Insert"]>;
        Relationships: [];
      };
      habit_logs: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          date: string;
          completed: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["habit_logs"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["habit_logs"]["Insert"]>;
        Relationships: [];
      };
      eat_prompts: {
        Row: {
          id: string;
          user_id: string;
          reason: string;
          suggestion: string;
          acknowledged: boolean;
          timestamp: string;
        };
        Insert: Omit<Database["public"]["Tables"]["eat_prompts"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["eat_prompts"]["Insert"]>;
        Relationships: [];
      };
      late_eating_logs: {
        Row: {
          id: string;
          user_id: string;
          ignored_warning: boolean;
          timestamp: string;
        };
        Insert: Omit<Database["public"]["Tables"]["late_eating_logs"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["late_eating_logs"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
