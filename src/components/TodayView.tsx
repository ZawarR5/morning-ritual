import React from "react";
import DailySpirit from "./DailySpirit";
import { RitualItem } from "../types";
import { Sparkles, Play } from "lucide-react";

interface TodayViewProps {
  quoteText: string;
  quoteEmoji: string;
  quoteCategory: string;
  rituals: RitualItem[];
  onToggleRitual: (id: string) => void;
  onAddRitual: (title: string, icon: string) => void;
  onDeleteRitual: (id: string) => void;
  onStartBreathwork: () => void;
}

export default function TodayView({
  quoteText,
  quoteEmoji,
  quoteCategory,
  rituals,
  onToggleRitual,
  onAddRitual,
  onDeleteRitual,
  onStartBreathwork,
}: TodayViewProps) {
  return (
    <div className="w-full flex flex-col items-center gap-12 max-w-5xl mx-auto">
      {/* Hero Quote Section */}
      <section className="w-full text-center flex flex-col items-center gap-4 mt-6 select-none px-4 relative">
        <div className="absolute top-0 w-16 h-[1px] bg-[var(--accent)]/30"></div>
        <span className="text-4xl animate-pulse cursor-default mt-4" role="img" aria-label="sparkles">
          {quoteEmoji || "✨"}
        </span>
        <blockquote className="font-serif text-[28px] md:text-4xl lg:text-[42px] italic text-[#f0f0f0] leading-[1.2] tracking-tight max-w-4xl mx-auto font-light">
          "
          {quoteText ||
            "The sun rises not just for the world, but for the greatness within you."}
          "
        </blockquote>
        <p className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-[0.25em] mt-3">
          ● VOL. 04 / BEGIN WITH INTENTION
        </p>
      </section>

      {/* Bento Grid layout */}
      <section className="w-full grid grid-cols-1 md:grid-cols-12 gap-5 px-2 mb-16">
        {/* Daily Spirit card (4 cols on desktop) */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col">
          <DailySpirit rituals={rituals} onToggleRitual={onToggleRitual} onAddRitual={onAddRitual} onDeleteRitual={onDeleteRitual} />
        </div>

        {/* Focus Activity Start Session card (7 cols or 8 cols on desktop) */}
        <div className="md:col-span-7 lg:col-span-8 bg-[#161618]/60 border border-white/10 p-8 rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[300px] hover:bg-[#161618]/90 hover:border-[var(--accent)]/20 transition-all duration-300 shadow-[0_0_30px_-10px_rgba(var(--accent-rgb),0.04)] group">
          {/* Stunning atmospheric background image layer */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 md:w-3/5 lg:w-1/2 opacity-25 pointer-events-none select-none">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0c] to-transparent z-10" />
            <img
              alt="Deep Breathwork Yoga Pose at Dawn"
              className="h-full w-full object-cover grayscale opacity-90 group-hover:scale-105 transition-transform duration-[2s]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwHKme4JHxkSKMLl2VlfAyXi6HsjuOxb1UxYhdPdMYVZlv2gKN0pym3w67V0yF4JvQc31n7w2Q3JJgHWBJOycww2DN9Klv0vjSSWVpXgiy_3xyGaRPVVtK7Ko75f13JCnBhSK5QbcQ-fJApLQxGyfZYhTY6wHTsbO3ue7XHPZayW1E0lhXJv3FLhoICMS0hRv-gu8_QXjo6giOmEAyUu1WLIXOxuApu4boLY8cRx0trbm34Z5H_SJLEFNsg_vSOCXTVvWZQRihUFix"
            />
          </div>

          <div className="relative z-10 flex flex-col gap-2.5 max-w-md my-auto select-none">
            <span className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-[0.2em] font-mono">
              Next Suggested Ritual
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-medium text-white tracking-wide">
              Deep Breathwork
            </h3>
            <p className="font-sans text-xs text-zinc-400 max-w-xs leading-relaxed">
              A premium space to regulate physiological pacing, decrease cortisol levels, and oxygenate vascular cells.
            </p>
            <button
              onClick={onStartBreathwork}
              className="mt-5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-zinc-950 font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-3.5 rounded hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)] transition-all active:scale-95 w-fit flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-zinc-950 stroke-none" />
              <span>Start Session</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
