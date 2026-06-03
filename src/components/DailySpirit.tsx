import React, { useState } from "react";
import { RitualItem } from "../types";
import { Check, Flame, ChevronDown, ChevronUp } from "lucide-react";

interface DailySpiritProps {
  rituals: RitualItem[];
  onToggleRitual: (id: string) => void;
}

export default function DailySpirit({ rituals, onToggleRitual }: DailySpiritProps) {
  const [isRawExpanded, setIsRawExpanded] = useState(false);

  const total = rituals.length;
  const completed = rituals.filter((r) => r.completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Circular progress equations
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="w-full bg-[#161618]/60 backdrop-blur-xl border border-white/10 py-7 px-8 rounded-2xl flex flex-col items-center justify-center gap-5 hover:bg-white/[0.04] hover:border-[var(--accent)]/20 transition-all duration-300 group shadow-[0_0_30px_-10px_rgba(var(--accent-rgb),0.05)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-8 h-px bg-[var(--accent)]"></div>
      {/* Dynamic Animated Ring container */}
      <div className="relative w-32 h-32 select-none">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="ringGrad" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={1} />
              <stop offset="100%" stopColor="#161618" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          {/* Outer faded ring */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="3.5"
          />
          {/* Active progress ring */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.25)]"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-3xl font-black text-white transition-all duration-300">
            {percentage}%
          </span>
        </div>
      </div>

      <div className="text-center">
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] font-bold text-[var(--accent)]">
          Daily Spirit
        </h3>
        <p className="font-sans text-xs text-zinc-450 mt-1 font-medium">
          {completed} of {total} Rituals Complete
        </p>
      </div>

      {/* Expand / Collapse Checklist */}
      <button
        onClick={() => setIsRawExpanded(!isRawExpanded)}
        className="flex items-center gap-1.5 text-[10px] text-[var(--accent)] font-bold tracking-wider uppercase hover:opacity-80 active:scale-95 transition-all mt-1 cursor-pointer font-mono"
      >
        <span>{isRawExpanded ? "Hide" : "Manage"} Habits</span>
        {isRawExpanded ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </button>

      {/* Expandable list of current habits */}
      {isRawExpanded && (
        <div className="w-full border-t border-white/5 pt-4 mt-1 flex flex-col gap-2 animate-fadeIn">
          {rituals.map((r) => (
            <div
              key={r.id}
              onClick={() => onToggleRitual(r.id)}
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] hover:bg-[#161618] border border-white/5 hover:border-[var(--accent)]/20 transition-all cursor-pointer group"
            >
              <div className="flex flex-col pr-3">
                <span className="text-xs font-semibold text-zinc-200">
                  {r.title}
                </span>
                <span className="text-[10px] text-zinc-500 font-medium leading-normal">
                  {r.description}
                </span>
              </div>
              <div
                className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                  r.completed
                    ? "bg-[var(--accent)] text-[#0b0b0c]"
                    : "border border-zinc-700 hover:border-[var(--accent)]"
                }`}
              >
                {r.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
