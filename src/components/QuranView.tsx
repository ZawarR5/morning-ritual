import React, { useEffect, useState, useMemo } from "react";
import { X, BookOpen } from "lucide-react";
import { SURAHS } from "../data/demo/quran-surahs";

interface VerseItem { chapter: number; verse: number; text: string; }

interface QuranViewProps {
  onClose: () => void;
}

export default function QuranView({ onClose }: QuranViewProps) {
  const [ar, setAr] = useState<VerseItem[] | null>(null);
  const [en, setEn] = useState<VerseItem[] | null>(null);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [bookmark, setBookmark] = useState<{ surah: number; ayah: number } | null>(null);

  useEffect(() => {
    import("../data/demo/quran-ar.json").then(m => setAr(m.default?.quran || m.default));
    import("../data/demo/quran-en.json").then(m => setEn(m.default?.quran || m.default));
    const saved = localStorage.getItem("mr_quran_bookmark");
    if (saved) setBookmark(JSON.parse(saved));
  }, []);

  const arMap = useMemo(() => {
    const map = new Map<number, VerseItem[]>();
    if (ar) for (const v of ar) { const list = map.get(v.chapter) || []; list.push(v); map.set(v.chapter, list); }
    return map;
  }, [ar]);

  const enMap = useMemo(() => {
    const map = new Map<number, VerseItem[]>();
    if (en) for (const v of en) { const list = map.get(v.chapter) || []; list.push(v); map.set(v.chapter, list); }
    return map;
  }, [en]);

  const handleBookmark = (surah: number, ayah: number) => {
    const b = { surah, ayah };
    setBookmark(b);
    localStorage.setItem("mr_quran_bookmark", JSON.stringify(b));
  };

  if (!ar || !en) return (
    <div className="fixed inset-0 z-[200] bg-[#0b0b0c] flex items-center justify-center">
      <p className="text-zinc-500 text-sm">Loading Quran...</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] bg-[#0b0b0c] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[var(--accent)]" />
          <span className="font-mono text-xs tracking-[0.2em] uppercase font-bold text-zinc-400">
            Quran
          </span>
        </div>
        <button onClick={onClose}
          className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 max-w-3xl mx-auto w-full">
        {selectedSurah ? (
          <SurahView
            surahId={selectedSurah}
            arVerses={arMap.get(selectedSurah) || []}
            enVerses={enMap.get(selectedSurah) || []}
            bookmark={bookmark}
            onBookmark={handleBookmark}
            onBack={() => setSelectedSurah(null)}
          />
        ) : (
          <SurahList
            surahs={SURAHS}
            arMap={arMap}
            bookmark={bookmark}
            onSelect={setSelectedSurah}
          />
        )}
      </div>
    </div>
  );
}

function SurahList({ surahs, arMap, bookmark, onSelect }: {
  surahs: typeof SURAHS;
  arMap: Map<number, VerseItem[]>;
  bookmark: { surah: number; ayah: number } | null;
  onSelect: (id: number) => void;
}) {
  const totalVerses = useMemo(() => {
    let count = 0;
    for (const v of arMap.values()) count += v.length;
    return count;
  }, [arMap]);

  return (
    <div className="space-y-4">
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 text-center space-y-2">
        <p className="font-serif text-xl text-white">The Noble Quran</p>
        <p className="text-xs text-zinc-400">{totalVerses} verses · 114 surahs</p>
        {bookmark && (
          <p className="text-[10px] text-[var(--accent)] font-mono">
            Continue: {surahs.find(s => s.id === bookmark.surah)?.name} ({bookmark.surah}:{bookmark.ayah})
          </p>
        )}
        {bookmark && (
          <button onClick={() => onSelect(bookmark.surah)}
            className="mt-2 text-[10px] font-mono font-bold tracking-wider uppercase bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 rounded-lg px-4 py-2 hover:bg-[var(--accent)]/20 cursor-pointer">
            Continue Reading
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {surahs.map(s => {
          const count = arMap.get(s.id)?.length || 0;
          const isBookmarked = bookmark?.surah === s.id;
          return (
            <button key={s.id} onClick={() => onSelect(s.id)}
              className={`text-left bg-white/[0.02] border border-white/10 rounded-xl p-4 hover:bg-white/[0.04] hover:border-white/20 transition-all cursor-pointer ${isBookmarked ? "border-[var(--accent)]/30" : ""}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[var(--accent)] font-mono">{s.id}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{s.name}</p>
                    <p className="text-xs text-zinc-400 font-serif">{s.arabic}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-500 font-mono">{count} verses</p>
                  {isBookmarked && <p className="text-[10px] text-[var(--accent)]">📖</p>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SurahView({ surahId, arVerses, enVerses, bookmark, onBookmark, onBack }: {
  surahId: number;
  arVerses: VerseItem[];
  enVerses: VerseItem[];
  bookmark: { surah: number; ayah: number } | null;
  onBookmark: (surah: number, ayah: number) => void;
  onBack: () => void;
}) {
  const surah = SURAHS.find(s => s.id === surahId)!;
  return (
    <div className="space-y-5">
      <button onClick={onBack}
        className="text-xs text-[var(--accent)] font-mono font-bold tracking-wider uppercase hover:underline cursor-pointer">
        ← All Surahs
      </button>

      <div className="text-center space-y-2">
        <p className="font-serif text-2xl text-white">{surah.arabic}</p>
        <p className="text-sm text-zinc-400 font-medium">{surah.name} ({surah.id})</p>
        <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">{surah.revelation} · {arVerses.length} verses</p>
      </div>

      <div className="space-y-3">
        {arVerses.map((v, i) => {
          const enV = enVerses[i];
          const isBookmarked = bookmark?.surah === surahId && bookmark?.ayah === v.verse;
          return (
            <div key={v.verse}
              className={`bg-white/[0.02] border rounded-xl p-4 md:p-5 space-y-2 relative group ${isBookmarked ? "border-[var(--accent)]/40 bg-[var(--accent)]/5" : "border-white/10"}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 font-mono">{v.verse}</span>
                <button onClick={() => onBookmark(surahId, v.verse)}
                  className={`opacity-0 group-hover:opacity-100 transition-all p-1 rounded cursor-pointer ${isBookmarked ? "text-[var(--accent)] opacity-100" : "text-zinc-500 hover:text-[var(--accent)]"}`}
                  title={isBookmarked ? "Bookmarked" : "Bookmark this verse"}>
                  <BookOpen className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-lg md:text-xl font-serif text-white leading-loose text-right" dir="rtl">{v.text}</p>
              <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">{enV?.text || ""}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
