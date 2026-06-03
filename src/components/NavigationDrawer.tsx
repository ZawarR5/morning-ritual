import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, User, Flame, BookOpen, Crown, HelpCircle, Camera, Pencil, StickyNote } from "lucide-react";
import NotesView from "./NotesView";
import { UserProfile } from "../types";

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  onUpdateProfile: (profile: UserProfile) => void;
  streakDays: number;
  onIncrementStreak: () => void;
  journalText: string;
  onJournalChange: (text: string) => void;
  onSaveJournalToWisdom: () => void;
}

export default function NavigationDrawer({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  streakDays,
  onIncrementStreak,
  journalText,
  onJournalChange,
  onSaveJournalToWisdom,
}: NavigationDrawerProps) {
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.name || "");
  const [showNotes, setShowNotes] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
                {/* Avatar */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="h-16 w-16 rounded-full overflow-hidden border border-[#D1FF26]/40 select-none bg-zinc-900 cursor-pointer group relative"
                >
                  {profile?.avatar ? (
                    <img
                      alt={profile.name}
                      className="h-full w-full object-cover opacity-90 group-hover:opacity-60 transition-all"
                      src={profile.avatar}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-zinc-800 text-zinc-500 group-hover:bg-zinc-700 transition-all">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/40">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          onUpdateProfile({ ...profile!, avatar: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>

                {/* Name */}
                <div>
                  {editing ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-zinc-800 border border-white/20 rounded px-2 py-1 text-white font-serif text-lg w-36 focus:outline-none focus:border-[#D1FF26]/50"
                        maxLength={30}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            onUpdateProfile({ ...profile!, name: editName || "Morning Seeker" });
                            setEditing(false);
                          }
                          if (e.key === "Escape") {
                            setEditName(profile?.name || "");
                            setEditing(false);
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          onUpdateProfile({ ...profile!, name: editName || "Morning Seeker" });
                          setEditing(false);
                        }}
                        className="text-[#D1FF26] text-xs font-bold cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group">
                      <h2 className="font-serif text-xl text-white font-semibold leading-tight">
                        {profile?.name || "Morning Seeker"}
                      </h2>
                      <button
                        onClick={() => {
                          setEditName(profile?.name || "");
                          setEditing(true);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-all text-zinc-500 hover:text-[#D1FF26] cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <p className="font-mono text-[10px] tracking-wider uppercase text-zinc-400 font-bold mt-0.5">
                    Daily Ritualist
                  </p>
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

              <button
                onClick={() => setShowNotes(true)}
                className="flex items-center gap-4 p-3 rounded-xl text-zinc-300 hover:bg-white/5 transition-colors w-full text-left cursor-pointer"
              >
                <StickyNote className="w-5 h-5 text-[#D1FF26]" />
                <span className="font-sans text-sm font-medium">Notes</span>
              </button>

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

          <NotesView isOpen={showNotes} onClose={() => setShowNotes(false)} />
        </>
      )}
    </AnimatePresence>
  );
}
