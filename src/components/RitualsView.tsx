import React, { useState, useRef, useEffect } from "react";
import { SettingsConfig, MindsetCategory } from "../types";
import { 
  Bell, 
  Moon, 
  Calendar, 
  Sparkles, 
  Sun, 
  VolumeX, 
  Clock, 
  Settings2,
  Lock,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from "lucide-react";

interface RitualsViewProps {
  config: SettingsConfig;
  onUpdateConfig: (updated: Partial<SettingsConfig>) => void;
  onGenerateAIPrompt: () => void;
  isGenerating: boolean;
  activeMindsetName: string;
}

export default function RitualsView({
  config,
  onUpdateConfig,
  onGenerateAIPrompt,
  isGenerating,
  activeMindsetName,
}: RitualsViewProps) {
  const [showPromptConfig, setShowPromptConfig] = useState(false);
  const [pendingHour, setPendingHour] = useState(config.notificationHour);
  const [pendingMinute, setPendingMinute] = useState(config.notificationMinute);
  const [pendingPeriod, setPendingPeriod] = useState(config.notificationPeriod);
  const [showDone, setShowDone] = useState(false);

  const hourValues = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const minuteValues = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
  const loopedHours = [...hourValues, ...hourValues, ...hourValues];
  const loopedMins = [...minuteValues, ...minuteValues, ...minuteValues];
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const HOUR_OFFSET = hourValues.length;
  const MIN_OFFSET = minuteValues.length;

  const scrollToHour = (hour: string, behavior: ScrollBehavior = "smooth") => {
    const el = hourRef.current;
    if (!el) return;
    const idx = hourValues.indexOf(hour);
    if (idx === -1) return;
    const target = el.children[HOUR_OFFSET + idx] as HTMLElement;
    if (target) target.scrollIntoView({ block: "center", behavior });
  };

  const scrollToMinute = (min: string, behavior: ScrollBehavior = "smooth") => {
    const el = minuteRef.current;
    if (!el) return;
    const idx = minuteValues.indexOf(min);
    if (idx === -1) return;
    const target = el.children[MIN_OFFSET + idx] as HTMLElement;
    if (target) target.scrollIntoView({ block: "center", behavior });
  };

  useEffect(() => { scrollToHour(pendingHour, "auto"); }, []);
  useEffect(() => { scrollToMinute(pendingMinute, "auto"); }, []);
  useEffect(() => { scrollToHour(pendingHour); }, [pendingHour]);
  useEffect(() => { scrollToMinute(pendingMinute); }, [pendingMinute]);

  const handleHourScroll = () => {
    const el = hourRef.current;
    if (!el) return;
    if (el.scrollTop < el.clientHeight) el.scrollTop += HOUR_OFFSET * el.children[0].clientHeight;
    else if (el.scrollTop > el.scrollHeight - el.clientHeight * 2) el.scrollTop -= HOUR_OFFSET * el.children[0].clientHeight;
  };

  const handleMinuteScroll = () => {
    const el = minuteRef.current;
    if (!el) return;
    if (el.scrollTop < el.clientHeight) el.scrollTop += MIN_OFFSET * el.children[0].clientHeight;
    else if (el.scrollTop > el.scrollHeight - el.clientHeight * 2) el.scrollTop -= MIN_OFFSET * el.children[0].clientHeight;
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-1 flex flex-col gap-8 pb-16">
      {/* Hero Title Header */}
      <section className="text-center md:text-left space-y-3 select-none relative">
        <span className="text-[var(--accent)] font-mono text-xs font-bold tracking-[0.25em] uppercase">
          Settings
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-white leading-tight">
          Morning Rituals
        </h2>
        <p className="font-sans text-xs md:text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Configure your intentional rise. These settings define how your devices and the outside world reach you during your sacred hours.
        </p>
      </section>

      {/* Bento Layout Grid of Settings Options */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-5 w-full items-stretch">
        
        {/* Premium Time Picker Card */}
        <div className="md:col-span-8 bg-[#161618]/60 border border-white/10 p-7 md:p-8 rounded-2xl flex flex-col justify-between shadow-[0_0_30px_-10px_rgba(var(--accent-rgb),0.05)]">
          <div className="mb-6 select-none">
            <h3 className="font-serif text-lg text-white font-medium mb-1 tracking-wide">
              Notification Time
            </h3>
            <p className="font-sans text-xs text-zinc-500 leading-normal">
              The exact moment your morning ritual and ambient soundscape begins to wake you.
            </p>
          </div>

          {/* Time Picker dials */}
          <div className="flex items-center justify-center gap-6 md:gap-10 py-8 relative overflow-hidden select-none">
            {/* Hour Dial */}
            <div ref={hourRef} onScroll={handleHourScroll} className="flex flex-col items-center gap-0.5 max-h-[200px] overflow-y-auto no-scrollbar scroll-smooth overscroll-contain touch-pan-y">
              {loopedHours.map((hour, i) => {
                const isSelected = pendingHour === hour;
                return (
                  <button
                    key={i}
                    onClick={() => setPendingHour(hour)}
                    className={`font-serif text-xl md:text-[36px] py-1 font-medium transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? "text-[var(--accent)] drop-shadow-[0_0_12px_rgba(var(--accent-rgb),0.35)] scale-110 font-bold"
                        : "text-zinc-650 hover:text-zinc-400 scale-90"
                    }`}
                  >
                    {hour}
                  </button>
                );
              })}
            </div>

            {/* Separator colon */}
            <div className="font-serif text-2xl md:text-[38px] text-[var(--accent)] pb-2">:</div>

            {/* Minute Dial */}
            <div ref={minuteRef} onScroll={handleMinuteScroll} className="flex flex-col items-center gap-1.5 max-h-[200px] overflow-y-auto no-scrollbar scroll-smooth overscroll-contain touch-pan-y">
              {loopedMins.map((minute, i) => {
                const isSelected = pendingMinute === minute;
                return (
                  <button
                    key={i}
                    onClick={() => setPendingMinute(minute)}
                    className={`font-serif text-2xl md:text-[38px] py-1.5 font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "text-[var(--accent)] drop-shadow-[0_0_12px_rgba(var(--accent-rgb),0.35)] scale-110 font-bold"
                        : "text-zinc-650 hover:text-zinc-400 scale-90"
                    }`}
                  >
                    {minute}
                  </button>
                );
              })}
            </div>

            {/* Period selector AM/PM */}
            <div className="flex flex-col gap-2.5">
              {(["AM", "PM"] as const).map((period) => {
                const isSelected = pendingPeriod === period;
                return (
                  <button
                    key={period}
                    onClick={() => setPendingPeriod(period)}
                    className={`font-mono text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded border transition-all cursor-pointer ${
                      isSelected
                        ? "text-[var(--accent)] bg-[var(--accent)]/10 border-[var(--accent)]/25"
                        : "text-zinc-500 border-transparent hover:text-zinc-350"
                    }`}
                  >
                    {period}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SET button + Under dial sunrise notification message */}
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => {
                onUpdateConfig({ notificationHour: pendingHour, notificationMinute: pendingMinute, notificationPeriod: pendingPeriod });
                setShowDone(true);
                setTimeout(() => setShowDone(false), 2000);
              }}
              className="px-8 py-3 rounded-xl bg-[var(--accent)] text-black font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-all cursor-pointer min-w-[80px]"
            >
              {showDone ? "Done" : "Set"}
            </button>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0b0b0c] border border-white/5 select-none text-xs text-zinc-400 flex-1">
              <Sun className="w-4 h-4 text-[var(--accent)]" />
              <p className="font-sans italic">
                Scheduled 12 minutes before local sunrise based on your active mindset: <strong className="text-white font-medium text-xs font-serif">{activeMindsetName}</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Toggle Controls Card (Mute start / weekend rhythm) */}
        <div className="md:col-span-4 flex flex-col gap-5">
          {/* Silent Start card */}
          <div className="bg-[#161618]/60 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:bg-white/[0.04] transition-all shadow-[0_0_30px_-10px_rgba(var(--accent-rgb),0.04)]">
            <div className="flex justify-between items-start select-none">
              <div className="p-2.5 bg-[#cebdff]/10 rounded-full border border-[#cebdff]/15">
                <VolumeX className="w-5 h-5 text-[#cebdff]" />
              </div>

              {/* Custom IOS checked Switch */}
              <button
                onClick={() => onUpdateConfig({ silentStart: !config.silentStart })}
                className="w-11 h-6 rounded-full bg-zinc-805 relative transition-colors border border-white/5 cursor-pointer"
                aria-label="Toggle Silent Start"
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full absolute top-[3px] transition-all ${
                    config.silentStart ? "left-[22px] bg-[var(--accent)]" : "left-[3px] bg-zinc-550"
                  }`}
                />
              </button>
            </div>

            <div className="mt-8 select-none">
              <h4 className="font-serif text-base text-white tracking-wide">
                Silent Start
              </h4>
              <p className="font-sans text-[11px] text-zinc-405 mt-1 leading-normal">
                Mute all device push and system notifications until the ritual is completed.
              </p>
            </div>
          </div>

          {/* Weekend Rhythm card */}
          <div className="bg-[#161618]/60 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:bg-white/[0.04] transition-all shadow-[0_0_30px_-10px_rgba(var(--accent-rgb),0.04)]">
            <div className="flex justify-between items-start select-none">
              <div className="p-2.5 bg-[#b5d6c5]/10 rounded-full border border-[#b5d6c5]/15">
                <Calendar className="w-5 h-5 text-[#b5d6c5]" />
              </div>

              {/* Custom IOS checked Switch */}
              <button
                onClick={() => onUpdateConfig({ weekendRhythm: !config.weekendRhythm })}
                className="w-11 h-6 rounded-full bg-zinc-805 relative transition-colors border border-white/5 cursor-pointer"
                aria-label="Toggle Weekend Rhythm"
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full absolute top-[3px] transition-all ${
                    config.weekendRhythm ? "left-[22px] bg-[var(--accent)]" : "left-[3px] bg-zinc-550"
                  }`}
                />
              </button>
            </div>

            <div className="mt-8 select-none">
              <h4 className="font-serif text-base text-white tracking-wide">
                Weekend Rhythm
              </h4>
              <p className="font-sans text-[11px] text-zinc-405 mt-1 leading-normal">
                Shift morning alert alerts by +60 minutes on Saturday and Sunday.
              </p>
            </div>
          </div>
        </div>

        {/* AI Manifestation Card (full span 12 cols) */}
        <div className="md:col-span-12 bg-[#161618]/60 border border-white/10 p-7 md:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-l-[var(--accent)] shadow-lg animate-fadeIn select-none">
          <div className="space-y-2 text-center md:text-left flex-1">
            <h4 className="font-serif text-lg text-white font-medium flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-4.5 h-4.5 text-[var(--accent)]" />
              <span>Daily AI Manifestation</span>
            </h4>
            <p className="font-sans text-xs text-zinc-400 max-w-xl leading-relaxed">
              Curate a unique, AI-fueled morning quote or purpose intent based on your physical goals, mindset preferences, and reflections.
            </p>

            {showPromptConfig && (
              <div className="pt-4 flex flex-col gap-3 max-w-lg mt-2">
                <label className="text-[9px] font-mono uppercase font-bold tracking-widest text-[var(--accent)]">
                  Custom Intent Keywords
                </label>
                <input
                  type="text"
                  value={config.manifestationPrompt}
                  onChange={(e) => onUpdateConfig({ manifestationPrompt: e.target.value })}
                  placeholder="e.g. mindfulness, energy, calm execution, focus"
                  className="w-full text-xs text-zinc-200 bg-[#0b0b0c] border border-white/10 rounded p-3 focus:outline-none focus:border-[var(--accent)] transition-all"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 flex-wrap justify-center font-mono">
            <button
              onClick={() => setShowPromptConfig(!showPromptConfig)}
              className="text-[var(--accent)] border border-[var(--accent)]/20 bg-white/5 hover:bg-white/10 text-[10px] uppercase tracking-wider px-5 py-3 rounded transition-all active:scale-95 cursor-pointer font-bold"
            >
              Configure Prompts
            </button>
            <button
              onClick={onGenerateAIPrompt}
              disabled={isGenerating}
              className="bg-[var(--accent)] text-zinc-950 hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.4)] hover:bg-[var(--accent-hover)] text-[10px] uppercase tracking-wider px-6 py-3 rounded transition-all active:scale-95 cursor-pointer font-bold flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Curiating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Intent</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Graphic Orbital pine visualizer Card (full span 12 cols) */}
        <div className="md:col-span-12 relative min-h-[260px] md:min-h-[290px] rounded-2xl overflow-hidden bg-[#161618]/60 border border-white/10 flex items-center justify-center p-6 shadow-2xl">
          <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-tr from-[var(--accent)]/5 via-transparent to-[#cebdff]/5 pointer-events-none" />

          {/* Glowing central concentric rotating orbits */}
          <div className="relative w-44 h-44 md:w-52 md:h-52 flex items-center justify-center select-none z-10">
            <div className="absolute inset-0 border border-[var(--accent)]/12 rounded-full animate-spin" style={{ animationDuration: "25s" }} />
            <div className="absolute inset-4 border border-[#cebdff]/12 rounded-full animate-spin" style={{ animationDuration: "18s", animationDirection: "reverse" }} />
            <div className="absolute inset-8 border border-white/5 rounded-full" />
            <div className="text-center">
              <Sparkles className="w-8 h-8 text-[var(--accent)] mx-auto filter drop-shadow-[0_0_12px_rgba(var(--accent-rgb),0.5)] animate-pulse" />
              <p className="font-sans text-[10px] text-zinc-400 mt-2 tracking-[0.25em] uppercase font-bold">
                Ritual Flow
              </p>
            </div>
          </div>

          {/* Serene landscape visualizer background hotlink */}
          <img
            alt="Misty landscape morning trees"
            className="absolute inset-0 w-full h-full object-cover opacity-20 -z-10 select-none pointer-events-none"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIIeoCS_hkhAxV8_reVpjQ_FmA3eCYAC8kud_SlC-b9qm5PDFR_9x-UOyR1z70a2nlryEFrd4ejcKz-ERtV3UgdPAUaRq8IYYr9c1VzRg9A6FqAyJLlbtBDKnqIL5paPKUwfJG7uypuXhT3lCa_tI3fOIuh37yy67QLe5sQQX486VRSqdR06Xng94YXg3F8vRCNi05wLXMASLu0J5uQAm7GGiS4O0wuf26TFLFvU981xq_n9CqcvDDV5aSLl1v66rK5LX-GLJ24JSQ"
          />
        </div>
      </section>
    </div>
  );
}
