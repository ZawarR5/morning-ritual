import React, { useEffect, useState } from "react";
import { X, MessageCircle } from "lucide-react";
import hadithData from "../data/demo/hadith.json";

interface HadithItem {
  id: string; collection: string; collection_name: string;
  hadithnumber: number; arabic: string; english: string; grade: string;
}

const hadiths = hadithData as HadithItem[];

interface HadithViewProps {
  onClose: () => void;
}

export default function HadithView({ onClose }: HadithViewProps) {
  const [dailyHadith, setDailyHadith] = useState<HadithItem | null>(null);
  const [allHadiths] = useState(hadiths);

  useEffect(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem("mr_hadith_date");
    let index = parseInt(localStorage.getItem("mr_hadith_index") || "0", 10);
    if (storedDate !== today || isNaN(index)) {
      index = Math.floor(Math.random() * hadiths.length);
      localStorage.setItem("mr_hadith_date", today);
      localStorage.setItem("mr_hadith_index", index.toString());
    }
    setDailyHadith(hadiths[index]);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] overflow-y-auto">
      <div className="sticky top-0 z-10 bg-[#050505]/80 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3 max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="font-serif text-lg text-zinc-100">Hadith</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {dailyHadith && (
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 md:p-6 space-y-3">
            <div className="flex items-center gap-2 text-[var(--accent)]">
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase font-bold">
                Hadith of the Day · {dailyHadith.collection_name} {dailyHadith.hadithnumber}
              </span>
            </div>
            <p className="text-base md:text-lg font-serif text-[#f0f0f0] leading-loose text-right" dir="rtl">
              {dailyHadith.arabic}
            </p>
            <p className="text-xs md:text-sm text-zinc-300 leading-[1.7] font-sans">
              {dailyHadith.english}
            </p>
            <span className={`inline-block text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
              dailyHadith.grade === "Sahih"
                ? "text-green-400 bg-green-500/10"
                : "text-yellow-400 bg-yellow-500/10"
            }`}>
              {dailyHadith.grade}
            </span>
          </div>
        )}

        <h3 className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] pt-4">
          All Hadith ({allHadiths.length})
        </h3>

        <div className="space-y-3 pb-8">
          {allHadiths.map((h) => (
            <div key={h.id} className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-zinc-500 tracking-wider uppercase">
                  {h.collection_name} · {h.hadithnumber}
                </span>
                <span className={`text-[9px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded ${
                  h.grade === "Sahih"
                    ? "text-green-400 bg-green-500/10"
                    : "text-yellow-400 bg-yellow-500/10"
                }`}>
                  {h.grade}
                </span>
              </div>
              <p className="text-sm font-serif text-[#f0f0f0] leading-loose text-right" dir="rtl">
                {h.arabic}
              </p>
              <p className="text-xs text-zinc-300 leading-[1.6] font-sans">
                {h.english}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
