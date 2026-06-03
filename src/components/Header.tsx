import React from "react";
import { Menu, User } from "lucide-react";
import { UserProfile } from "../types";

interface HeaderProps {
  onToggleDrawer: () => void;
  profile: UserProfile | null;
}

export default function Header({ onToggleDrawer, profile }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0b0b0c]/85 backdrop-blur-xl border-b border-white/10 shadow-[0_0_30px_-10px_rgba(209,255,38,0.15)] flex justify-between items-center px-6 h-16">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleDrawer}
          className="p-1 text-[#D1FF26] hover:opacity-80 active:scale-95 transition-all cursor-pointer"
          aria-label="Toggle Drawer"
          id="menu-btn"
        >
          <Menu className="w-6 h-6 stroke-[1.8]" />
        </button>
        <h1 className="font-serif text-white tracking-tighter text-[23px] select-none font-black flex items-center gap-2">
          Morning <span className="italic font-light text-[#D1FF26]">Ritual</span>
          <span className="text-[9px] font-mono tracking-widest text-[#D1FF26]/60 border border-[#D1FF26]/20 px-1.5 py-0.5 rounded ml-2 uppercase hidden sm:inline-block">VOL. 04</span>
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-px w-16 bg-white/10 hidden sm:block"></div>
        <button 
          onClick={onToggleDrawer}
          className="h-8 w-8 rounded-full overflow-hidden border border-[#D1FF26]/30 hover:opacity-85 hover:border-[#D1FF26] transition-all active:scale-95 cursor-pointer bg-zinc-900"
        >
          {profile?.avatar ? (
            <img
              alt={profile.name}
              className="h-full w-full object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all"
              src={profile.avatar}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-zinc-800 text-zinc-400">
              <User className="w-4 h-4" />
            </div>
          )}
        </button>
      </div>
    </header>
  );
}
