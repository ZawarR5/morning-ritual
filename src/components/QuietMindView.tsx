import React, { useRef, useEffect, useState } from "react";
import { Moon, Volume2, VolumeX } from "lucide-react";

const AUDIO_URL = "/new-bg-music.mp3";

export default function QuietMindView() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.play().then(() => setSoundEnabled(true)).catch(() => setSoundEnabled(false));
  }, []);

  const handleToggleSound = () => {
    if (!audioRef.current) return;
    if (soundEnabled) {
      audioRef.current.pause();
      setSoundEnabled(false);
    } else {
      audioRef.current.play().then(() => setSoundEnabled(true)).catch(() => {});
    }
  };

  const dhikrItems = [
    {
      arabic: "سُبْحَانَ ٱللَّٰهِ",
      transliteration: "SubhanAllah",
      meaning: "Glory be to Allah",
    },
    {
      arabic: "ٱلْحَمْدُ لِلَّٰهِ",
      transliteration: "Alhamdulillah",
      meaning: "All praise is due to Allah",
    },
    {
      arabic: "ٱللَّٰهُ أَكْبَرُ",
      transliteration: "Allahu Akbar",
      meaning: "Allah is the Greatest",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 flex flex-col gap-10 pb-20">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={AUDIO_URL}
        loop
        crossOrigin="anonymous"
        preload="auto"
      />

      {/* Header */}
      <div className="flex items-center justify-between pt-6 select-none">
        <div className="flex items-center gap-3">
          <Moon className="w-5 h-5 text-[var(--accent)]" />
          <span className="font-mono text-xs tracking-[0.2em] uppercase font-bold text-zinc-400">
            Quiet the Mind
          </span>
        </div>
        <button
          onClick={handleToggleSound}
          className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
          aria-label="Toggle background sound"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {/* Dhikr Content */}
      <div className="text-center space-y-10 max-w-3xl mx-auto">
        {/* Title */}
        <div className="space-y-3 select-none">
          <span className="text-[var(--accent)] font-mono text-xs font-bold tracking-[0.25em] uppercase">
            الذكر
          </span>
          <h1 className="font-serif text-5xl md:text-6xl font-light text-white tracking-tight">
            Dhikr
          </h1>
          <p className="text-[11px] text-zinc-500 font-mono tracking-[0.2em] uppercase">
            Remembrance of the Divine
          </p>
        </div>

        {/* Divider */}
        <div className="w-12 h-[1px] bg-[var(--accent)]/30 mx-auto" />

        {/* Quran Verse */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 md:p-10 space-y-5">
          <p className="font-serif text-2xl md:text-3xl italic text-[#f0f0f0] leading-[1.4] tracking-tight font-light">
            "Verily, in the remembrance<br className="hidden sm:block" /> of Allah do hearts find rest."
          </p>
          <p className="font-mono text-[10px] text-[var(--accent)] tracking-[0.25em] uppercase font-bold">
            — Quran 13:28
          </p>
        </div>

        {/* Intro Paragraph */}
        <p className="text-sm md:text-[15px] text-zinc-300 leading-[1.8] font-sans max-w-2xl mx-auto">
          There is something profoundly calming about repeating the names of Allah or simple phrases like{" "}
          <span className="text-[var(--accent)] font-semibold">SubhanAllah</span>,{" "}
          <span className="text-[var(--accent)] font-semibold">Alhamdulillah</span>, and{" "}
          <span className="text-[var(--accent)] font-semibold">Allahu Akbar</span>.
          When we make dhikr part of our daily life, it helps slow down the rush of thoughts.
          It brings us back to the present moment, reminding us that we are not in control — Allah is.
        </p>

        {/* Divider with label */}
        <div className="flex items-center gap-4 max-w-xs mx-auto select-none">
          <div className="flex-1 h-[1px] bg-white/10" />
          <span className="text-[10px] text-zinc-500 font-mono tracking-[0.2em] uppercase font-bold">
            Morning Remembrance
          </span>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        {/* Dhikr Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dhikrItems.map((item) => (
            <div
              key={item.transliteration}
              className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-7 space-y-4 text-center hover:border-[var(--accent)]/20 hover:bg-white/[0.04] transition-all duration-300 group"
            >
              <p className="text-2xl md:text-3xl font-serif text-white leading-loose" dir="rtl">
                {item.arabic}
              </p>
              <p className="font-mono text-xs text-[var(--accent)] font-bold tracking-wider group-hover:text-white transition-colors">
                {item.transliteration}
              </p>
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                {item.meaning}
              </p>
            </div>
          ))}
        </div>

        {/* Hasbunallahu Section */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 md:p-10 space-y-5 max-w-xl mx-auto">
          <p className="text-xl md:text-2xl font-serif text-white leading-loose" dir="rtl">
            حَسْبُنَا ٱللَّٰهُ وَنِعْمَ ٱلْوَكِيلُ
          </p>
          <p className="font-mono text-xs text-[var(--accent)] font-bold tracking-wider">
            Hasbunallahu wa ni'mal wakeel
          </p>
          <p className="text-sm text-zinc-300 leading-relaxed font-sans">
            "Allah is sufficient for us, and He is the best Disposer of affairs."
            Repeating this phrase can be especially effective when your mind is racing.
          </p>
        </div>

        {/* Closing */}
        <p className="text-xs text-zinc-500 font-mono italic leading-relaxed max-w-md mx-auto">
          When we make dhikr part of our daily life, it helps slow down the rush of thoughts.
        </p>
      </div>

    </div>
  );
}
