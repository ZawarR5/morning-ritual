import React, { useState, useEffect, useCallback } from "react";
import { Check, RotateCcw, Star } from "lucide-react";

const PRAYERS = ["Fajr", "Zuhr", "Asr", "Maghrib", "Isha"];

const CONFETTI_COLORS = ["#D1FF26", "#FF6B6B", "#4ECDC4", "#FFE66D", "#A78BFA", "#FF8C42"];
const CONFETTI_COUNT = 80;

function Confetti() {
  const particles = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: "-10px",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            transform: `rotate(${p.rotation}deg)`,
            animation: `confetti-fall ${p.duration}s ease-out ${p.delay}s forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function PrayerTrackerView() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("mr_prayers");
    return saved ? JSON.parse(saved) : { Fajr: false, Zuhr: false, Asr: false, Maghrib: false, Isha: false };
  });
  const [showConfetti, setShowConfetti] = useState(false);

  const allChecked = PRAYERS.every((p) => checked[p]);

  useEffect(() => {
    localStorage.setItem("mr_prayers", JSON.stringify(checked));
  }, [checked]);

  useEffect(() => {
    if (allChecked) {
      setShowConfetti(true);
      const audio = new Audio("/party-popper.mp3");
      audio.volume = 0.5;
      audio.play().catch(() => {});
      const timer = setTimeout(() => {
        setShowConfetti(false);
        audio.pause();
        audio.currentTime = 0;
      }, 5000);
      return () => {
        clearTimeout(timer);
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [allChecked]);

  const toggle = useCallback((prayer: string) => {
    setChecked((prev) => ({ ...prev, [prayer]: !prev[prayer] }));
  }, []);

  const reset = useCallback(() => {
    setChecked({ Fajr: false, Zuhr: false, Asr: false, Maghrib: false, Isha: false });
  }, []);

  const doneCount = PRAYERS.filter((p) => checked[p]).length;

  return (
    <>
      {showConfetti && <Confetti />}
      <div className="w-full max-w-lg mx-auto px-4 flex flex-col gap-8 pb-16">
        <section className="text-center space-y-3 select-none pt-4">
          <span className="text-[var(--accent)] font-mono text-xs font-bold tracking-[0.25em] uppercase">
            Daily Worship
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-white leading-tight">
            Prayer Tracker
          </h2>
          <p className="font-sans text-xs md:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            {doneCount === 5
              ? "All five prayers completed today. Masha'Allah!"
              : `Track your five daily prayers — ${doneCount} of 5 completed.`}
          </p>
        </section>

        {/* Progress ring */}
        <div className="flex justify-center">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
              <circle
                cx="18" cy="18" r="15.5" fill="none" stroke="var(--accent)" strokeWidth="2"
                strokeDasharray={`${(doneCount / 5) * 97.4} 97.4`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-3xl text-white font-bold">{doneCount}</span>
              <span className="font-sans text-xs text-zinc-500 mt-3 ml-0.5">/5</span>
            </div>
          </div>
        </div>

        {/* Prayer checklist */}
        <div className="bg-[#161618]/60 border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_30px_-10px_rgba(var(--accent-rgb),0.05)]">
          {PRAYERS.map((prayer, i) => (
            <button
              key={prayer}
              onClick={() => toggle(prayer)}
              className={`w-full flex items-center gap-4 px-5 py-4 transition-all cursor-pointer ${
                i < PRAYERS.length - 1 ? "border-b border-white/5" : ""
              } ${checked[prayer] ? "bg-[var(--accent)]/5" : "hover:bg-white/[0.03]"}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                  checked[prayer]
                    ? "bg-[var(--accent)] text-black"
                    : "bg-white/5 border border-white/10 text-zinc-600"
                }`}
              >
                {checked[prayer] && <Check className="w-4 h-4" />}
              </div>
              <span
                className={`font-serif text-base transition-all ${
                  checked[prayer] ? "text-white font-medium" : "text-zinc-400"
                }`}
              >
                {prayer}
              </span>
              {checked[prayer] && (
                <Star className="w-3.5 h-3.5 text-[var(--accent)] ml-auto fill-[var(--accent)]" />
              )}
            </button>
          ))}
        </div>

        {/* Reset button */}
        <button
          onClick={reset}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all cursor-pointer font-sans text-xs tracking-wider uppercase"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>
    </>
  );
}
