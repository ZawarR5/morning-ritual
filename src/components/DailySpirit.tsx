import React, { useState } from "react";
import { RitualItem } from "../types";
import { Check, ChevronDown, ChevronUp, Plus, X } from "lucide-react";

interface DailySpiritProps {
  rituals: RitualItem[];
  onToggleRitual: (id: string) => void;
  onAddRitual: (title: string, icon: string) => void;
  onDeleteRitual: (id: string) => void;
}

const ICON_CHOICES = ["💧", "🧘", "📖", "🏃", "🥗", "✍️"];

export default function DailySpirit({ rituals, onToggleRitual, onAddRitual, onDeleteRitual }: DailySpiritProps) {
  const [isRawExpanded, setIsRawExpanded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newIcon, setNewIcon] = useState(ICON_CHOICES[0]);

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
        className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-zinc-950 font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-3 rounded hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)] transition-all active:scale-95 w-fit flex items-center gap-2 cursor-pointer"
      >
        <span>{isRawExpanded ? "Hide" : "Manage"} Habits</span>
        {isRawExpanded ? (
          <ChevronUp className="w-3.5 h-3.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
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
              <div className="flex items-center gap-3 pr-3 min-w-0">
                <span className="text-base shrink-0">{r.icon || "✨"}</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-zinc-200 truncate">
                    {r.title}
                  </span>
                  {r.description && (
                    <span className="text-[10px] text-zinc-500 font-medium leading-normal truncate">
                      {r.description}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteRitual(r.id);
                  }}
                  className="text-zinc-600 hover:text-red-400 transition-colors p-1 cursor-pointer opacity-0 group-hover:opacity-100"
                  title="Remove this habit"
                  aria-label="Remove ritual"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
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
            </div>
          ))}

          {showAddForm ? (
            <div className="p-3 rounded-xl bg-white/[0.02] border border-[var(--accent)]/20 space-y-3">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Drink water"
                maxLength={40}
                autoFocus
                className="w-full bg-[#0b0b0c] border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)]/50"
              />
              <div className="flex gap-1.5">
                {ICON_CHOICES.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setNewIcon(emoji)}
                    className={`text-lg w-8 h-8 rounded-lg border transition-all cursor-pointer ${
                      newIcon === emoji
                        ? "bg-zinc-800 border-[var(--accent)]/40"
                        : "border-transparent hover:bg-zinc-900"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => { setShowAddForm(false); setNewTitle(""); }}
                  className="flex-1 py-2 text-[10px] font-mono uppercase tracking-wider text-zinc-400 border border-white/10 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const t = newTitle.trim();
                    if (!t) return;
                    onAddRitual(t, newIcon);
                    setNewTitle("");
                    setShowAddForm(false);
                  }}
                  className="flex-1 py-2 text-[10px] font-mono uppercase tracking-wider bg-[var(--accent)] text-[#0b0b0c] font-bold rounded-lg hover:opacity-90 transition-all cursor-pointer"
                >
                  Add Habit
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/15 text-zinc-400 hover:text-[var(--accent)] hover:border-[var(--accent)]/40 transition-all text-[11px] font-mono uppercase tracking-wider cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Custom Habit
            </button>
          )}
        </div>
      )}
    </div>
  );
}
