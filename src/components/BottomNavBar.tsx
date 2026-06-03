import React from "react";
import { Sunrise, Bell, BookMarked, Moon } from "lucide-react";
import { motion } from "motion/react";

export type TabId = "today" | "rituals" | "quiet" | "4kul";

interface BottomNavBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function BottomNavBar({ activeTab, onTabChange }: BottomNavBarProps) {
  const navItems = [
    { id: "today" as TabId, label: "Today", icon: Sunrise },
    { id: "rituals" as TabId, label: "Prayer", icon: Bell },
    { id: "quiet" as TabId, label: "Quiet Mind", icon: Moon },
    { id: "4kul" as TabId, label: "4 Kul", icon: BookMarked },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#0b0b0c]/90 backdrop-blur-2xl border-t border-white/10 rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.6)] flex justify-around items-center h-20 px-6 pb-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center text-xs transition-all cursor-pointer active:scale-95 px-4 py-2 rounded-xl relative ${
              isActive
                ? "text-[var(--accent)] font-bold"
                : "text-zinc-500 hover:text-zinc-350"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="circle-glow"
                className="absolute inset-0 bg-[var(--accent)]/5 rounded-xl border border-[var(--accent)]/10 -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <Icon className={`w-5 h-5 mb-1 ${isActive ? "stroke-[2.2]" : "stroke-[1.6]"}`} />
            <span className="text-[10px] uppercase tracking-wider font-mono font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
