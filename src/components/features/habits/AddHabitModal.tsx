"use client";

import { Button, EmojiIcon, Input } from "@/components/ui";
import { DEFAULT_HABITS, CATEGORY_META } from "@/data/defaultHabits";
import { useState }              from "react";
import { cn }                    from "@/utils/cn";
import { ClipboardList, Pencil, Clock3 } from "lucide-react";

interface Props {
  onAdd:       (name: string, emoji: string) => Promise<boolean>;
  onClose:     () => void;
  loading?:    boolean;
  existingNames: string[];
}

const EMOJI_OPTIONS = ["🚶","🏃","💧","💪","🧘","🦵","🏋️","🌬️","📵","😴","🍎","🚫"];
type HabitCategory = keyof typeof CATEGORY_META;
const CATEGORY_OPTIONS: Array<HabitCategory | "all"> = [
  "all",
  ...(Object.keys(CATEGORY_META) as HabitCategory[]),
];

export function AddHabitModal({ onAdd, onClose, loading, existingNames }: Props) {
  const [tab,        setTab       ] = useState<"preset" | "custom">("preset");
  const [customName, setCustomName] = useState("");
  const [customEmoji,setCustomEmoji] = useState("✅");
  const [activeCategory, setActiveCategory] =
    useState<HabitCategory | "all">("all");

  const filtered = DEFAULT_HABITS.filter((h) => {
    if (activeCategory !== "all" && h.category !== activeCategory) return false;
    if (existingNames.includes(h.habit_name)) return false;
    return true;
  });

  async function handlePreset(name: string, emoji: string) {
    const ok = await onAdd(name, emoji);
    if (ok) onClose();
  }

  async function handleCustom(e: React.FormEvent) {
    e.preventDefault();
    if (!customName.trim()) return;
    const ok = await onAdd(customName.trim(), customEmoji);
    if (ok) onClose();
  }

  return (
    <div className="space-y-4">

      {/* Tab switcher */}
      <div className="flex bg-[#edf2fd] rounded-xl p-1 gap-1 dark:bg-[#1c2a46]">
        {(["preset", "custom"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize",
              tab === t
                ? "bg-[#ffffff] text-[#1f2a44] shadow-sm dark:bg-[var(--card)] dark:text-[var(--foreground)]"
                : "text-[#8a96b0] hover:text-[#586887] dark:text-[var(--muted)] dark:hover:text-[#c7d5f0]"
            )}
          >
            <span className="inline-flex items-center gap-1.5">
              {t === "preset" ? <ClipboardList size={14} /> : <Pencil size={14} />}
              {t === "preset" ? "Choose Preset" : "Custom"}
            </span>
          </button>
        ))}
      </div>

      {tab === "preset" && (
        <div className="space-y-3">
          {/* Category filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0",
                  activeCategory === cat
                    ? "bg-[linear-gradient(140deg,#6996ef,#4b78de)] text-white shadow-[0_8px_14px_rgba(75,120,222,0.3)]"
                    : "bg-[#edf2fd] text-[#6e7a96] hover:bg-[#e4ebfb] dark:bg-[#1c2a46] dark:text-[var(--muted)] dark:hover:bg-[#223255]"
                )}
              >
                {cat === "all" ? "All" : CATEGORY_META[cat].label}
              </button>
            ))}
          </div>

          {/* Preset list */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-center text-sm text-[#8a96b0] dark:text-[var(--muted)] py-4">
                All habits in this category added!
              </p>
            ) : filtered.map((h) => (
              <button
                key={h.habit_name}
                onClick={() => handlePreset(h.habit_name, h.emoji)}
                disabled={loading}
                className="w-full flex items-center gap-3 px-4 py-3 bg-[#f4f7ff]
                           hover:bg-[#eef3ff] hover:border-[#b7cbf1] border border-[#d8e1f2]
                           rounded-xl text-left transition-all active:scale-98 disabled:opacity-50
                           dark:bg-[#1c2a46] dark:hover:bg-[#223255] dark:border-[var(--card-border)] dark:hover:border-[#3a547f]"
              >
                <EmojiIcon emoji={h.emoji} size={20} className="shrink-0 text-[#607195] dark:text-[#9fb2d8]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1f2a44] dark:text-[var(--foreground)]">{h.habit_name}</p>
                  {h.duration && (
                    <p className="inline-flex items-center gap-1 text-xs text-[#8a96b0] dark:text-[var(--muted)]">
                      <Clock3 size={12} />
                      {h.duration}
                    </p>
                  )}
                </div>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full shrink-0",
                  CATEGORY_META[h.category].color
                )}>
                  {CATEGORY_META[h.category].label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === "custom" && (
        <form onSubmit={handleCustom} className="space-y-3">
          <Input
            label="Habit name"
            placeholder="e.g. Morning walk"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            required
            maxLength={50}
          />

          {/* Emoji picker */}
          <div>
            <p className="text-sm font-semibold text-[#334368] dark:text-[#c7d5f0] mb-2">Pick an emoji</p>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((em) => (
                <button
                  type="button"
                  key={em}
                  onClick={() => setCustomEmoji(em)}
                  className={cn(
                    "w-10 h-10 text-xl rounded-xl border-2 transition-all",
                    customEmoji === em
                      ? "border-[#5c8be8] bg-[#e8f0ff] dark:border-[#4d6fb2] dark:bg-[#1d2a47]"
                      : "border-[#d8e1f2] bg-[#f4f7ff] hover:border-[#b8c6e4] dark:border-[var(--card-border)] dark:bg-[#1c2a46] dark:hover:border-[#3a547f]"
                  )}
                >
                  <EmojiIcon emoji={em} size={16} className="mx-auto text-[#607195] dark:text-[#9fb2d8]" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="secondary" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={!customName.trim()}
            >
              Add Habit
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
