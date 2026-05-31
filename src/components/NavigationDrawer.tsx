import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, User, Flame, BookOpen, Crown, LifeBuoy, HelpCircle, Sparkles } from "lucide-react";

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  streakDays: number;
  onIncrementStreak: () => void;
  journalText: string;
  onJournalChange: (text: string) => void;
  onSaveJournalToWisdom: () => void;
}

export default function NavigationDrawer({
  isOpen,
  onClose,
  streakDays,
  onIncrementStreak,
  journalText,
  onJournalChange,
  onSaveJournalToWisdom,
}: NavigationDrawerProps) {
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSave = () => {
    if (!journalText.trim()) return;
    onSaveJournalToWisdom();
    setSaveStatus("Saved to wisdom archive!");
    setTimeout(() => {
      setSaveStatus(null);
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[90] cursor-pointer"
          />

          {/* Side Drawer Panel */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed left-0 top-0 h-full w-80 md:w-88 bg-[#0b0b0c] border-r border-white/10 z-[100] flex flex-col p-6 overflow-y-auto"
          >
            {/* Header / Profile section */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex flex-col gap-4">
                <div className="h-16 w-16 rounded-full overflow-hidden border border-[#D1FF26]/40 select-none bg-zinc-900">
                  <img
                    alt="Premium Member Avatar"
                    className="h-full w-full object-cover grayscale opacity-90"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH4o5AELAVbDKeqhGKCeGlJDWBp1ewF4ZKiP7OLb_y3K9_DSII7c4qdJoU1rN1ykOzv7IXd-bnafiqD3SVobP7XVf7vFPWnV4kIIY9m3Rsc6Lzi6AaOTPOV776ZzVXTOVYyvmEdP4xJmhpPZ4reCNZ3dYLY-yUwWy04K9AKVxxfQvjCy3gh6QSSGulb39KwP-TxGX_t4ebkEodBKnVRH-E81RIms4xo9v6t2ePWmS9WdLxn9hcSCiDKYSA61rc37xUEUpqsrnVDumD"
                  />
                </div>
                <div>
                  <h2 className="font-serif text-xl text-white font-semibold leading-tight">
                    Aurelius <span className="font-sans italic text-xs text-[#D1FF26]">St.</span>
                  </h2>
                  <p className="font-mono text-[10px] tracking-wider uppercase text-zinc-400 font-bold mt-0.5">
                    Daily Ritualist
                  </p>
                  <span className="text-[9px] uppercase tracking-[0.2em] font-mono text-[#D1FF26] mt-2 inline-block font-bold border border-[#D1FF26]/20 px-2.5 py-0.5 rounded bg-[#D1FF26]/5">
                    Studio Tier
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg active:scale-95 transition-all cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex flex-col gap-2.5 mb-8">
              <div className="flex items-center gap-4 p-3 rounded-xl text-zinc-300 bg-white/5 hover:bg-white/10 transition-colors">
                <User className="w-5 h-5 text-[#D1FF26]" />
                <span className="font-sans text-sm font-medium">Aura Profile</span>
              </div>

              {/* Streak Tracker */}
              <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-zinc-300">
                    <Flame className="w-5 h-5 text-[#D1FF26]" />
                    <span className="font-sans text-sm font-medium">Rise Streak</span>
                  </div>
                  <span className="text-xs font-bold text-[#D1FF26] tracking-wide font-mono bg-[#D1FF26]/10 px-2.5 py-1 rounded border border-[#D1FF26]/20">
                    {streakDays} Days
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-normal">
                  Rituallize early every single day to fuel your inner momentum.
                </p>
                <button
                  onClick={onIncrementStreak}
                  className="mt-2 text-center text-xs font-semibold py-2 rounded bg-[#D1FF26]/10 hover:bg-[#D1FF26]/25 text-[#D1FF26] border border-[#D1FF26]/15 active:scale-95 transition-all cursor-pointer"
                >
                  Log Today's Rise
                </button>
              </div>

              {/* Sunrise Journaling Block */}
              <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3 text-zinc-300">
                  <BookOpen className="w-5 h-5 text-[#D1FF26]" />
                  <span className="font-sans text-sm font-medium">Quick Reflections</span>
                </div>
                <textarea
                  value={journalText}
                  onChange={(e) => onJournalChange(e.target.value)}
                  placeholder="Express your focus, fears, or goals. This context builds your AI daily manifestation quote..."
                  rows={3}
                  className="w-full text-xs text-zinc-200 bg-[#0b0b0c] border border-white/15 hover:border-white/20 focus:border-[#D1FF26] rounded-xl p-2.5 resize-none placeholder-zinc-550 focus:outline-none focus:ring-0 transition-colors"
                />
                <button
                  onClick={handleSave}
                  disabled={!journalText.trim()}
                  className={`text-center text-xs font-mono tracking-wider uppercase py-2 rounded transition-all border cursor-pointer ${
                    journalText.trim()
                      ? "bg-zinc-800 border-zinc-700 hover:bg-zinc-750 text-[#D1FF26] active:scale-95"
                      : "bg-zinc-900/50 border-zinc-850 text-zinc-650 cursor-not-allowed"
                  }`}
                >
                  Save to Archive
                </button>
                {saveStatus && (
                  <p className="text-[10px] text-[#D1FF26] mt-1 text-center font-medium animate-pulse">
                    {saveStatus}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl text-zinc-400 hover:bg-white/5 transition-colors cursor-pointer">
                <Crown className="w-5 h-5 text-[#D1FF26]" />
                <span className="font-sans text-sm font-medium">Sacred Membership</span>
              </div>
            </nav>

            {/* Bottom Support section */}
            <div className="mt-auto pt-6 border-t border-white/10">
              <div className="flex items-center gap-3 p-3 rounded-xl text-zinc-400 hover:bg-white/5 transition-colors cursor-pointer">
                <HelpCircle className="w-5 h-5" />
                <span className="font-sans text-sm font-medium">Sanctuary Support</span>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
