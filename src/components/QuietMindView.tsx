import React, { useRef, useEffect, useState, useMemo } from "react";
import { Moon, Volume2, VolumeX, Heart, Search, ChevronRight, BookOpen } from "lucide-react";
import duasData from "../data/demo/duas.json";

const AUDIO_URL = "/new-bg-music.mp3";

interface DuaItem {
  id: number; category: string; title: string; arabic: string;
  transliteration: string; translation: string; source: string;
  repeat: number; categoryName: string;
}

const duas = duasData as DuaItem[];

function DuasContent() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const categories = useMemo(() => {
    const map = new Map<string, { id: string; name: string; count: number }>();
    for (const d of duas) {
      if (!map.has(d.category)) {
        map.set(d.category, { id: d.category, name: d.categoryName, count: 0 });
      }
      map.get(d.category)!.count++;
    }
    return Array.from(map.values());
  }, []);

  const filtered = useMemo(() => {
    let list = category ? duas.filter(d => d.category === category) : duas;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.translation.toLowerCase().includes(q) ||
        d.transliteration.toLowerCase().includes(q)
      );
    }
    return list;
  }, [category, search]);

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search duas..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--accent)]/40"
        />
      </div>

      {/* Categories */}
      {!category && !search && (
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button key={c.id} onClick={() => setCategory(c.id)}
              className="px-3 py-1.5 text-[10px] font-mono font-bold tracking-wider uppercase bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-[var(--accent)]/30 transition-all cursor-pointer">
              {c.name}
              <span className="ml-1.5 text-zinc-500">({c.count})</span>
            </button>
          ))}
        </div>
      )}

      {category && (
        <button onClick={() => { setCategory(null); setExpanded(null); }}
          className="text-[10px] text-[var(--accent)] font-mono font-bold tracking-wider uppercase hover:underline cursor-pointer">
          ← All Categories
        </button>
      )}

      <div className="space-y-2.5">
        {filtered.map(dua => (
          <div key={dua.id}
            className="bg-white/[0.02] border border-white/10 rounded-xl p-4 md:p-5 transition-all hover:border-white/20 cursor-pointer"
            onClick={() => setExpanded(expanded === dua.id ? null : dua.id)}>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{dua.title}</p>
                <p className="text-[9px] text-zinc-500 font-mono tracking-wider uppercase">{dua.categoryName}</p>
              </div>
              <ChevronRight className={`w-4 h-4 text-zinc-500 mt-0.5 transition-transform flex-shrink-0 ${expanded === dua.id ? "rotate-90" : ""}`} />
            </div>
            {expanded === dua.id && (
              <div className="mt-3 pt-3 border-t border-white/10 space-y-2.5">
                <p className="text-base md:text-lg font-serif text-white leading-loose text-right" dir="rtl">{dua.arabic}</p>
                <p className="text-[11px] text-zinc-300 font-mono italic">{dua.transliteration}</p>
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">{dua.translation}</p>
                <div className="flex items-center gap-2 text-[9px] text-zinc-500 font-mono">
                  <span className="text-[var(--accent)]">📖 {dua.source}</span>
                  {dua.repeat > 1 && <span>· Repeat: {dua.repeat}x</span>}
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <p className="text-zinc-500 text-sm text-center py-8">No duas found.</p>}
      </div>
    </div>
  );
}

export default function QuietMindView() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.15);
  const [tab, setTab] = useState<"dhikr" | "duas">("dhikr");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    audioRef.current.play().then(() => setSoundEnabled(true)).catch(() => setSoundEnabled(false));
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

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
    <div className="w-full max-w-5xl mx-auto px-4 flex flex-col gap-6 pb-20">
      <audio ref={audioRef} src={AUDIO_URL} loop crossOrigin="anonymous" preload="auto" />

      {/* Header */}
      <div className="flex items-center justify-between pt-6 select-none">
        <div className="flex items-center gap-3">
          <Moon className="w-5 h-5 text-[var(--accent)]" />
          <span className="font-mono text-xs tracking-[0.2em] uppercase font-bold text-zinc-400">
            Quiet the Mind
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleToggleSound}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
            aria-label="Toggle background sound">
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <input type="range" min="0" max="1" step="0.05" value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1 accent-[var(--accent)] cursor-pointer" />
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-white/10 select-none">
        {[
          { id: "dhikr" as const, label: "Dhikr", icon: Moon },
          { id: "duas" as const, label: "Duas", icon: Heart },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
                tab === t.id
                  ? "text-[var(--accent)] border-b-2 border-[var(--accent)] bg-[var(--accent)]/5"
                  : "text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent"
              }`}>
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Dhikr Content */}
      {tab === "dhikr" && (
        <div className="text-center space-y-10 max-w-3xl mx-auto">
          <div className="space-y-3 select-none">
            <span className="text-[var(--accent)] font-mono text-xs font-bold tracking-[0.25em] uppercase">الذكر</span>
            <h1 className="font-serif text-5xl md:text-6xl font-light text-white tracking-tight">Dhikr</h1>
            <p className="text-[11px] text-zinc-500 font-mono tracking-[0.2em] uppercase">Remembrance of the Divine</p>
          </div>
          <div className="w-12 h-[1px] bg-[var(--accent)]/30 mx-auto" />
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 md:p-10 space-y-5">
            <p className="font-serif text-2xl md:text-3xl italic text-[#f0f0f0] leading-[1.4] tracking-tight font-light">
              "Verily, in the remembrance<br className="hidden sm:block" /> of Allah do hearts find rest."
            </p>
            <p className="font-mono text-[10px] text-[var(--accent)] tracking-[0.25em] uppercase font-bold">— Quran 13:28</p>
          </div>
          <p className="text-sm md:text-[15px] text-zinc-300 leading-[1.8] font-sans max-w-2xl mx-auto">
            There is something profoundly calming about repeating the names of Allah or simple phrases like{" "}
            <span className="text-[var(--accent)] font-semibold">SubhanAllah</span>,{" "}
            <span className="text-[var(--accent)] font-semibold">Alhamdulillah</span>, and{" "}
            <span className="text-[var(--accent)] font-semibold">Allahu Akbar</span>.
            When we make dhikr part of our daily life, it helps slow down the rush of thoughts.
            It brings us back to the present moment, reminding us that we are not in control — Allah is.
          </p>
          <div className="flex items-center gap-4 max-w-xs mx-auto select-none">
            <div className="flex-1 h-[1px] bg-white/10" />
            <span className="text-[10px] text-zinc-500 font-mono tracking-[0.2em] uppercase font-bold">Morning Remembrance</span>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dhikrItems.map((item) => (
              <div key={item.transliteration}
                className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-7 space-y-4 text-center hover:border-[var(--accent)]/20 hover:bg-white/[0.04] transition-all duration-300 group">
                <p className="text-2xl md:text-3xl font-serif text-white leading-loose" dir="rtl">{item.arabic}</p>
                <p className="font-mono text-xs text-[var(--accent)] font-bold tracking-wider group-hover:text-white transition-colors">{item.transliteration}</p>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">{item.meaning}</p>
              </div>
            ))}
          </div>
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 md:p-10 space-y-5 max-w-xl mx-auto">
            <p className="text-xl md:text-2xl font-serif text-white leading-loose" dir="rtl">حَسْبُنَا ٱللَّٰهُ وَنِعْمَ ٱلْوَكِيلُ</p>
            <p className="font-mono text-xs text-[var(--accent)] font-bold tracking-wider">Hasbunallahu wa ni'mal wakeel</p>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans">
              "Allah is sufficient for us, and He is the best Disposer of affairs."
              Repeating this phrase can be especially effective when your mind is racing.
            </p>
          </div>
          <p className="text-xs text-zinc-500 font-mono italic leading-relaxed max-w-md mx-auto">
            When we make dhikr part of our daily life, it helps slow down the rush of thoughts.
          </p>
        </div>
      )}

      {/* Duas Content */}
      {tab === "duas" && (
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="space-y-3 select-none">
            <span className="text-[var(--accent)] font-mono text-xs font-bold tracking-[0.25em] uppercase">الدعاء</span>
            <h1 className="font-serif text-5xl md:text-6xl font-light text-white tracking-tight">Duas</h1>
            <p className="text-[11px] text-zinc-500 font-mono tracking-[0.2em] uppercase">Supplications from Quran & Sunnah</p>
          </div>
          <div className="w-12 h-[1px] bg-[var(--accent)]/30 mx-auto" />
          <p className="text-sm text-zinc-400 leading-relaxed max-w-lg mx-auto font-sans">
            Authentic supplications for every occasion — with Arabic, transliteration, and translation.
          </p>
          <DuasContent />
        </div>
      )}
    </div>
  );
}
