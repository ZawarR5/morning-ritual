import React, { useEffect, useState, useMemo } from "react";
import { X, Search, BookOpen, Heart, MessageCircle, ChevronRight } from "lucide-react";
import { SURAHS } from "../data/demo/quran-surahs";

// Types
interface HadithItem {
  id: string; collection: string; collection_name: string;
  hadithnumber: number; arabic: string; english: string; grade: string;
}
interface DuaItem {
  id: number; category: string; title: string; arabic: string;
  transliteration: string; translation: string; source: string;
  repeat: number; categoryName: string;
}
interface VerseItem { chapter: number; verse: number; text: string; }

// Lazy data loader
function useJson<T>(file: string): T | null {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    import(`../data/demo/${file}`).then(m => {
      const d = m.default || m;
      setData(d?.quran ?? d);
    }).catch(() => {});
  }, [file]);
  return data;
}

// Build verses map from flat array
function buildSurahMap(verses: VerseItem[] | null): Map<number, VerseItem[]> {
  const map = new Map<number, VerseItem[]>();
  if (!verses) return map;
  for (const v of verses) {
    const list = map.get(v.chapter) || [];
    list.push(v);
    map.set(v.chapter, list);
  }
  return map;
}

// ─── Tab: Hadith ───
function HadithTab() {
  const hadiths = useJson<HadithItem[]>("hadith.json");
  const [index, setIndex] = useState(0);
  const h = hadiths?.[index];
  if (!hadiths || !h) return <p className="text-zinc-500 text-sm text-center py-20">Loading hadith...</p>;
  return (
    <div className="space-y-6">
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8 space-y-5">
        <div className="flex items-center gap-2 text-[var(--accent)]">
          <MessageCircle className="w-4 h-4" />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold">
            {h.collection_name} · Hadith {h.hadithnumber}
          </span>
        </div>
        <p className="text-xl md:text-2xl font-serif text-white leading-loose text-right" dir="rtl">
          {h.arabic}
        </p>
        <p className="text-sm md:text-[15px] text-zinc-300 leading-[1.8] font-sans">
          {h.english}
        </p>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded ${h.grade === "Sahih" ? "text-green-400 bg-green-500/10" : "text-yellow-400 bg-yellow-500/10"}`}>
            {h.grade}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3">
        <button onClick={() => setIndex(i => Math.max(0, i - 1))} disabled={index === 0}
          className="px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-30 cursor-pointer disabled:cursor-default">
          Previous
        </button>
        <span className="text-xs text-zinc-500 font-mono">{index + 1} / {hadiths.length}</span>
        <button onClick={() => setIndex(i => Math.min(hadiths.length - 1, i + 1))} disabled={index === hadiths.length - 1}
          className="px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-30 cursor-pointer disabled:cursor-default">
          Next
        </button>
        <button onClick={() => setIndex(Math.floor(Math.random() * hadiths.length))}
          className="px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 rounded-lg hover:bg-[var(--accent)]/20 cursor-pointer">
          Random
        </button>
      </div>
    </div>
  );
}

// ─── Tab: Duas ───
function DuasTab() {
  const allDuas = useJson<DuaItem[]>("duas.json");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const categories = useMemo(() => {
    if (!allDuas) return [];
    const map = new Map<string, { id: string; name: string; count: number }>();
    for (const d of allDuas) {
      if (!map.has(d.category)) {
        map.set(d.category, { id: d.category, name: d.categoryName, count: 0 });
      }
      map.get(d.category)!.count++;
    }
    return Array.from(map.values());
  }, [allDuas]);

  const filtered = useMemo(() => {
    if (!allDuas) return [];
    let list = category ? allDuas.filter(d => d.category === category) : allDuas;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.translation.toLowerCase().includes(q) ||
        d.transliteration.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allDuas, category, search]);

  if (!allDuas) return <p className="text-zinc-500 text-sm text-center py-20">Loading duas...</p>;

  return (
    <div className="space-y-6">
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
              className="px-3 py-1.5 text-xs font-mono font-bold tracking-wider uppercase bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-[var(--accent)]/30 transition-all cursor-pointer">
              {c.name}
              <span className="ml-1.5 text-zinc-500">({c.count})</span>
            </button>
          ))}
        </div>
      )}

      {/* Back button */}
      {category && (
        <button onClick={() => { setCategory(null); setExpanded(null); }}
          className="text-xs text-[var(--accent)] font-mono font-bold tracking-wider uppercase hover:underline cursor-pointer">
          ← All Categories
        </button>
      )}

      {/* Dua cards */}
      <div className="space-y-3">
        {filtered.map(dua => (
          <div key={dua.id}
            className="bg-white/[0.02] border border-white/10 rounded-xl p-5 transition-all hover:border-white/20 cursor-pointer"
            onClick={() => setExpanded(expanded === dua.id ? null : dua.id)}>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{dua.title}</p>
                <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">{dua.categoryName}</p>
              </div>
              <ChevronRight className={`w-4 h-4 text-zinc-500 mt-1 transition-transform flex-shrink-0 ${expanded === dua.id ? "rotate-90" : ""}`} />
            </div>
            {expanded === dua.id && (
              <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                <p className="text-lg font-serif text-white leading-loose text-right" dir="rtl">{dua.arabic}</p>
                <p className="text-xs text-zinc-300 font-mono italic">{dua.transliteration}</p>
                <p className="text-sm text-zinc-300 leading-relaxed">{dua.translation}</p>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
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

// ─── Tab: Quran Reader ───
function QuranTab() {
  const ar = useJson<VerseItem[]>("quran-ar.json");
  const en = useJson<VerseItem[]>("quran-en.json");
  const arMap = useMemo(() => buildSurahMap(ar), [ar]);
  const enMap = useMemo(() => buildSurahMap(en), [en]);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [bookmark, setBookmark] = useState<{ surah: number; ayah: number } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("mr_demo_quran_bookmark");
    if (saved) setBookmark(JSON.parse(saved));
  }, []);

  const totalRead = useMemo(() => {
    if (!ar) return 0;
    return ar.length;
  }, [ar]);

  const surahAyahCounts = useMemo(() => {
    const map = new Map<number, number>();
    if (ar) for (const v of ar) map.set(v.chapter, (map.get(v.chapter) || 0) + 1);
    return map;
  }, [ar]);

  if (!ar || !en) return <p className="text-zinc-500 text-sm text-center py-20">Loading Quran...</p>;

  if (selectedSurah) {
    const arVerses = arMap.get(selectedSurah) || [];
    const enVerses = enMap.get(selectedSurah) || [];
    const surah = SURAHS.find(s => s.id === selectedSurah)!;
    const handleBookmark = (ayah: number) => {
      const b = { surah: selectedSurah, ayah };
      setBookmark(b);
      localStorage.setItem("mr_demo_quran_bookmark", JSON.stringify(b));
    };

    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedSurah(null)}
          className="text-xs text-[var(--accent)] font-mono font-bold tracking-wider uppercase hover:underline cursor-pointer">
          ← All Surahs
        </button>

        <div className="text-center space-y-2">
          <p className="font-serif text-2xl text-white">{surah.arabic}</p>
          <p className="text-sm text-zinc-400 font-medium">{surah.name} ({surah.id})</p>
          <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">{surah.revelation} · {arVerses.length} verses</p>
        </div>

        <div className="space-y-4">
          {arVerses.map((v, i) => {
            const enV = enVerses[i];
            const isBookmarked = bookmark?.surah === selectedSurah && bookmark?.ayah === v.verse;
            return (
              <div key={v.verse} id={`verse-${v.verse}`}
                className={`bg-white/[0.02] border rounded-xl p-4 md:p-5 space-y-2 relative group ${isBookmarked ? "border-[var(--accent)]/40 bg-[var(--accent)]/5" : "border-white/10"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 font-mono">{v.verse}</span>
                  <button onClick={() => handleBookmark(v.verse)}
                    className={`opacity-0 group-hover:opacity-100 transition-all p-1 rounded cursor-pointer ${isBookmarked ? "text-[var(--accent)]" : "text-zinc-500 hover:text-[var(--accent)]"}`}
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

        <div className="text-center py-4">
          <p className="text-[10px] text-zinc-500 font-mono">
            {arVerses.length} verses · {surah.revelation}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress overview */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 text-center space-y-2">
        <p className="font-serif text-lg text-white">The Noble Quran</p>
        <p className="text-xs text-zinc-400">{totalRead} verses · 114 surahs</p>
        {bookmark && (
          <p className="text-[10px] text-[var(--accent)] font-mono">
            Bookmark: {SURAHS.find(s => s.id === bookmark.surah)?.name} ({bookmark.surah}:{bookmark.ayah})
          </p>
        )}
      </div>

      {/* Surah list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {SURAHS.map(s => {
          const count = surahAyahCounts.get(s.id) || 0;
          const isBookmarked = bookmark?.surah === s.id;
          return (
            <button key={s.id} onClick={() => setSelectedSurah(s.id)}
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

// ─── Main DemoView ───
type DemoViewProps = { onClose: () => void };

export default function DemoView({ onClose }: DemoViewProps) {
  const [tab, setTab] = useState<"hadith" | "duas" | "quran">("hadith");

  return (
    <div className="fixed inset-0 z-[200] bg-[#0b0b0c] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-[var(--accent)]" />
          <span className="font-mono text-xs tracking-[0.2em] uppercase font-bold text-zinc-400">
            Feature Preview
          </span>
        </div>
        <button onClick={onClose}
          className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 flex-shrink-0">
        {[
          { id: "hadith" as const, label: "Hadith", icon: MessageCircle },
          { id: "duas" as const, label: "Duas", icon: Heart },
          { id: "quran" as const, label: "Quran", icon: BookOpen },
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 max-w-3xl mx-auto w-full">
        {tab === "hadith" && <HadithTab />}
        {tab === "duas" && <DuasTab />}
        {tab === "quran" && <QuranTab />}
      </div>
    </div>
  );
}
