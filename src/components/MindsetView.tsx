import React from "react";
import { Mindset, MindsetId } from "../types";
import { 
  Droplet, 
  Sparkles, 
  Zap, 
  Activity, 
  Sun, 
  Target
} from "lucide-react";

interface MindsetViewProps {
  mindsets: Mindset[];
  activeMindsetId: MindsetId;
  onChangeMindset: (id: MindsetId) => void;
  onBeginRitual: () => void;
}

export default function MindsetView({
  mindsets,
  activeMindsetId,
  onChangeMindset,
  onBeginRitual,
}: MindsetViewProps) {
  
  // Custom helper to render matching Lucide icons for each mindset
  const getMindsetIcon = (iconName: string, id: string) => {
    const iconClass = "w-7 h-7";
    switch (id) {
      case "calm":
        return <Droplet className={`${iconClass} text-[#cebdff]`} />;
      case "creative":
        return <Sparkles className={`${iconClass} text-[#D1FF26]`} />;
      case "confidence":
        return <Zap className={`${iconClass} text-[#D1FF26]`} />;
      case "focus":
        return <Target className={`${iconClass} text-[#b5d6c5]`} />;
      case "awakening":
        return <Sun className={`${iconClass} text-[#cebdff]`} />;
      case "vitality":
        return <Activity className={`${iconClass} text-[#D1FF26]`} />;
      default:
        return <Sparkles className={`${iconClass}`} />;
    }
  };

  // Pre-configured custom aesthetic tag color for the selected badge
  const getSelectedBadgeColor = (id: string) => {
    switch (id) {
      case "calm":
        return "border-[#cebdff]/30 text-[#cebdff]";
      case "focus":
        return "border-[#b5d6c5]/30 text-[#b5d6c5]";
      default:
        return "border-[#D1FF26]/30 text-[#D1FF26]";
    }
  };

  // Find details of the active selected item to estimate ritual duration
  const activeMindset = mindsets.find((m) => m.id === activeMindsetId) || mindsets[0];

  return (
    <div className="w-full max-w-5xl mx-auto px-1 flex flex-col gap-8 pb-16">
      {/* Upper header section */}
      <section className="text-center max-w-3xl mx-auto space-y-4 select-none relative">
        <span className="text-[#D1FF26] font-mono text-xs font-bold tracking-[0.25em] uppercase block">
          Personalization
        </span>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-[40px] font-normal text-white leading-tight">
          Define Your Mindset
        </h2>
        <p className="font-sans text-xs md:text-sm text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          Select the core energy you wish to cultivate for today’s session. Your choice will influence the ambient audio loops, guided respiratory timing, and curated manifestations.
        </p>
      </section>

      {/* Bento Layout selector Grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch select-none">
        
        {/* Item 1: Deep Calm (Large 8-col active card) */}
        {mindsets.filter(m => m.id === "calm").map((item) => {
          const isSelected = activeMindsetId === "calm";
          return (
            <div
              key={item.id}
              onClick={() => onChangeMindset("calm")}
              className={`md:col-span-8 rounded-2xl p-8 md:p-10 flex flex-col justify-between relative overflow-hidden cursor-pointer transition-all duration-400 border min-h-[280px] ${
                isSelected
                  ? "border-[#D1FF26] bg-[#D1FF26]/5 shadow-[0_0_30px_-5px_rgba(209,255,38,0.15)]"
                  : "bg-white/[0.03] border-white/10 hover:bg-[#161618]/60 hover:border-[#D1FF26]/20"
              }`}
            >
              {/* Soft purple mood gradient background inside card */}
              <div className="absolute top-0 right-0 w-52 h-52 bg-[#cebdff]/5 blur-[70px] pointer-events-none rounded-full translate-x-1/4 -translate-y-1/4" />
              
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                  {getMindsetIcon(item.icon, item.id)}
                </div>
                {isSelected && (
                  <span className={`font-sans text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${getSelectedBadgeColor(item.id)}`}>
                    Active Focus
                  </span>
                )}
              </div>

              <div className="mt-12">
                <h3 className="font-serif text-xl md:text-2xl text-white font-normal mb-1.5">
                  {item.title}
                </h3>
                <p className="font-sans text-xs text-zinc-400 max-w-md leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}

        {/* Item 2: Creative Fire (Side 4-col card) */}
        {mindsets.filter(m => m.id === "creative").map((item) => {
          const isSelected = activeMindsetId === "creative";
          return (
            <div
              key={item.id}
              onClick={() => onChangeMindset("creative")}
              className={`md:col-span-4 rounded-2xl p-7 md:p-8 flex flex-col items-center text-center justify-center relative overflow-hidden cursor-pointer transition-all duration-400 border min-h-[280px] ${
                isSelected
                  ? "border-[#D1FF26] bg-[#D1FF26]/5 shadow-[0_0_30px_-5px_rgba(209,255,38,0.15)]"
                  : "bg-white/[0.03] border-white/10 hover:bg-[#161618]/60 hover:border-[#D1FF26]/20"
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/5">
                {getMindsetIcon(item.icon, item.id)}
              </div>
              <h3 className="font-serif text-lg text-white font-normal mb-1.5">
                {item.title}
              </h3>
              <p className="font-sans text-xs text-zinc-400 leading-normal px-2.5">
                {item.description}
              </p>
              {isSelected && (
                <span className={`mt-4 font-sans text-[9px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-widest ${getSelectedBadgeColor(item.id)}`}>
                  Active
                </span>
              )}
            </div>
          );
        })}

        {/* Item 3: Unstoppable Confidence (Horizontal full-width card) */}
        {mindsets.filter(m => m.id === "confidence").map((item) => {
          const isSelected = activeMindsetId === "confidence";
          return (
            <div
              key={item.id}
              onClick={() => onChangeMindset("confidence")}
              className={`md:col-span-12 rounded-2xl p-7 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 relative overflow-hidden cursor-pointer transition-all duration-400 border ${
                isSelected
                  ? "border-[#D1FF26] bg-[#D1FF26]/5 shadow-[0_0_30px_-5px_rgba(209,255,38,0.15)]"
                  : "bg-white/[0.03] border-white/10 hover:bg-[#161618]/60 hover:border-[#D1FF26]/20"
              }`}
            >
              {/* Subtle visual glow undercard indicator */}
              <div className={`absolute inset-0 bg-radial-at-c from-[#D1FF26]/5 via-transparent to-transparent opacity-0 transition-opacity duration-700 pointer-events-none ${isSelected ? "opacity-100" : ""}`} />

              <div className="w-14 h-14 shrink-0 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                {getMindsetIcon(item.icon, item.id)}
              </div>
              <div className="text-center md:text-left flex-1 space-y-1">
                <div className="flex flex-col md:flex-row md:items-center gap-1.5">
                  <h3 className="font-serif text-lg text-white font-normal">
                    {item.title}
                  </h3>
                  {isSelected && (
                    <span className={`w-fit md:ml-2 font-mono text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide bg-[#D1FF26]/10 ${getSelectedBadgeColor(item.id)}`}>
                      Selected Focus
                    </span>
                  )}
                </div>
                <p className="font-sans text-xs text-zinc-400">
                  {item.description}
                </p>
              </div>

              <div className="hidden md:block w-24 h-[0.5px] bg-white/10" />
              <div className="flex gap-1.5 select-none py-1 animate-pulse">
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-[#D1FF26]" : "bg-zinc-600"}`} />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
              </div>
            </div>
          );
        })}

        {/* Small Grid option Items: Zen Focus, Gentle Awakening, Vitality Rush (3-items) */}
        {mindsets.filter(m => ["focus", "awakening", "vitality"].includes(m.id)).map((item) => {
          const isSelected = activeMindsetId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onChangeMindset(item.id)}
              className={`md:col-span-4 rounded-xl p-7 md:p-8 flex flex-col items-center text-center cursor-pointer transition-all duration-400 border ${
                isSelected
                  ? "border-[#D1FF26] bg-[#D1FF26]/5 shadow-[0_0_30px_-5px_rgba(209,255,38,0.15)] scale-[1.02]"
                  : "bg-white/[0.03] border-white/10 hover:bg-[#161618]/60 hover:border-[#D1FF26]/20"
              }`}
            >
              <div className="mb-4">
                {getMindsetIcon(item.icon, item.id)}
              </div>
              <h4 className="font-serif text-base text-white font-normal mb-1">
                {item.title}
              </h4>
              <p className="font-sans text-[11px] text-zinc-450 leading-relaxed max-w-[200px]">
                {item.description.slice(0, 75)}...
              </p>
              {isSelected && (
                <span className={`mt-3 font-mono text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getSelectedBadgeColor(item.id)}`}>
                  Active
                </span>
              )}
            </div>
          );
        })}
      </section>

      {/* Begin session interaction action block */}
      <section className="mt-8 flex flex-col items-center gap-3.5 select-none">
        <button
          onClick={onBeginRitual}
          className="bg-[#D1FF26] text-[#0b0b0c] hover:shadow-[0_0_35px_rgba(209,255,38,0.45)] hover:bg-[#e2ff60] font-mono text-[10px] font-bold uppercase tracking-[0.25em] px-12 py-4 rounded transition-all duration-300 active:scale-95 cursor-pointer"
        >
          Begin Ritual
        </button>
        <p className="font-mono text-[9px] uppercase tracking-wider text-zinc-500 font-bold">
          Est. breathing sequence duration: 12 minutes / Aura: {activeMindset.title}
        </p>
      </section>
    </div>
  );
}
