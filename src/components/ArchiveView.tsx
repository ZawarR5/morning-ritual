import React, { useState } from "react";
import { WisdomItem, MindsetCategory } from "../types";
import { Search, Bookmark, BookmarkCheck, Share2, Plus, Sparkles, Check } from "lucide-react";

interface ArchiveViewProps {
  wisdomList: WisdomItem[];
  onToggleBookmark: (id: string) => void;
  onAddWisdom: (text: string, category: MindsetCategory, emoji: string) => void;
}

export default function ArchiveView({
  wisdomList,
  onToggleBookmark,
  onAddWisdom,
}: ArchiveViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | MindsetCategory>("All");
  
  // Custom interactive quote creation variables
  const [showAddForm, setShowAddForm] = useState(false);
  const [newText, setNewText] = useState("");
  const [newCategory, setNewCategory] = useState<MindsetCategory>("Serene");
  const [newEmoji, setNewEmoji] = useState("🌅");
  const [successMsg, setSuccessMsg] = useState("");

  const handleCreateWisdom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    onAddWisdom(newText, newCategory, newEmoji);
    setNewText("");
    setShowAddForm(false);
    setSuccessMsg("Insight logged into archive sanctuary!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Filter lists based on search or chip select
  const filteredWisdom = wisdomList.filter((item) => {
    const matchesSearch = item.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-1 flex flex-col gap-8 pb-16">
      {/* Header and intro */}
      <section className="text-center md:text-left space-y-3 select-none">
        <span className="text-[#D1FF26] font-mono text-xs font-bold tracking-[0.25em] uppercase">
          Ethereal Repository
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-white leading-tight">
          Archive
        </h2>
        <p className="font-sans text-xs md:text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Revisit the wisdom that shaped your past morning sessions. Filter through your evolution of thought and trace your habits progression.
        </p>

        {successMsg && (
          <div className="bg-[#b5d6c5]/10 border border-[#b5d6c5]/25 p-3 rounded-lg text-[#b5d6c5] text-xs font-medium max-w-md text-center animate-pulse">
            {successMsg}
          </div>
        )}
      </section>

      {/* Control Actions: Search, Filter, and Action */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4.5 h-4.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past wisdom thoughts..."
              className="w-full bg-[#161618] hover:bg-[#1a1a1c] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#D1FF26] focus:ring-0 transition-colors font-sans text-xs text-zinc-200 placeholder-zinc-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
            {(["All", "Vibrant", "Steady", "Serene"] as const).map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded font-sans text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                    isActive
                      ? "bg-[#D1FF26] text-[#0b0b0c]"
                      : "bg-white/5 border border-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-250"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Add Personal Wisdom toggle button */}
        <div className="flex justify-end select-none">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 text-[10px] font-bold font-mono uppercase tracking-wider text-[#D1FF26] bg-[#D1FF26]/5 hover:bg-[#D1FF26]/10 border border-[#D1FF26]/15 px-4 py-2.5 rounded cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Record Personal Reflection</span>
          </button>
        </div>

        {/* Dropdown creation form */}
        {showAddForm && (
          <form
            onSubmit={handleCreateWisdom}
            className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-4 animate-fadeIn select-none"
          >
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                Reflection Text
              </label>
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Write your morning insight, inspiration, or quote..."
                required
                rows={2}
                className="w-full text-xs text-zinc-200 bg-[#0b0b0c] border border-white/15 focus:border-[#D1FF26] rounded-xl p-3 resize-none focus:outline-none focus:ring-0 transition-colors"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  Mood Category
                </label>
                <div className="flex gap-2">
                  {(["Serene", "Steady", "Vibrant"] as const).map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setNewCategory(category)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                        newCategory === category
                          ? "bg-[#161618] border-[#D1FF26]/40 text-[#D1FF26]"
                          : "bg-[#0b0b0c] border-white/5 text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                  Icon Emoji
                </label>
                <div className="flex gap-3">
                  {["🌅", "🌌", "🌿", "⚖️", "🔥", "✨"].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewEmoji(emoji)}
                      className={`text-lg p-1.5 rounded-lg border cursor-pointer transition-all ${
                        newEmoji === emoji
                          ? "bg-zinc-800 border-[#D1FF26]/40"
                          : "hover:bg-zinc-900 border-transparent"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-xs font-semibold hover:bg-white/5 text-zinc-500 rounded-lg transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded bg-[#D1FF26] hover:bg-[#e2ff60] text-zinc-950 text-xs font-bold font-sans uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
              >
                Log Insight
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Grid of Archive Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWisdom.map((item, index) => {
          // Card 5 is configured with complex image design and is the 5th element or matching text
          const hasImageBg = item.id === "wisdom-5" || (filteredWisdom.length > 4 && index === 4);

          if (hasImageBg) {
            return (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-2xl flex flex-col justify-end min-h-[320px] p-6 lg:col-span-2 group border border-white/5 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
              >
                {/* Beautiful deep mountain backdrop image */}
                <img
                  className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-[1.5s] opacity-35"
                  alt="A breathtaking, minimalist mountain landscape at dawn."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLjGTJpx2C4Novco3elH2Tfd6w1WgKqDqzSXSWxZZJ6zDrhw8mZNyTXMr1CiKdvofZjCsuYk2JSw8cm4KH8_YtDoIk78IuiP5ELs413fty6N_3O09EMVwcktf7ElRM87FlPKmu6vVq_-ZPWdXgs4eQIxjYA9M5c0L49z5VrFv4jcMevp3-PB6QK345D0C8OpHCcSVYwl3Z6x0WIX7fX1YkT1240ocAtGtzenQJn6pg2kJeOczL2ezKxpgLm6MXjm7X-bdD8ZAFKhlI"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />

                <div className="relative z-20 space-y-4">
                  <p className="font-serif text-xl md:text-2xl italic text-[#e5e2e1] leading-relaxed">
                    "{item.text}"
                  </p>
                  <div className="flex justify-between items-center border-t border-white/10 pt-4 text-zinc-450 text-[11px] font-sans">
                    <span className="font-semibold">{item.date}</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggleBookmark(item.id)}
                        className="text-white hover:text-[#D1FF26] transition-colors cursor-pointer"
                        aria-label="Bookmark quote"
                      >
                        {item.bookmarked ? (
                          <BookmarkCheck className="w-4.5 h-4.5 text-[#D1FF26]" />
                        ) : (
                          <Bookmark className="w-4.5 h-4.5" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          const clipboardText = `"${item.text}" - Recorded in Morning Ritual archive, ${item.date}`;
                          navigator.clipboard.writeText(clipboardText);
                        }}
                        className="text-white hover:text-[#D1FF26] transition-colors cursor-pointer"
                        title="Copy to clipboard"
                      >
                        <Share2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Ordinary Glassmorphic quote card
          const isSerene = item.category === "Serene";
          const isSteady = item.category === "Steady";
          const tagColors = isSerene
            ? "text-[#cebdff] bg-[#cebdff]/10 border-[#cebdff]/20 font-mono text-[9px] uppercase"
            : isSteady
            ? "text-[#b5d6c5] bg-[#b5d6c5]/10 border-[#b5d6c5]/20 font-mono text-[9px] uppercase"
            : "text-[#D1FF26] bg-[#D1FF26]/10 border-[#D1FF26]/20 font-mono text-[9px] uppercase";

          // Set columns-2 spanning for Card 1 (Large Feature) to align with screenshot
          const isFirstCard = index === 0;

          return (
            <div
              key={item.id}
              className={`bg-[#161618]/60 border border-white/10 p-7 rounded-2xl flex flex-col justify-between min-h-[280px] hover:bg-[#161618]/90 hover:border-[#D1FF26]/20 transition-all duration-350 group shadow-lg ${
                isFirstCard ? "lg:col-span-2" : ""
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-5 select-none">
                  <span className="text-2xl">{item.emoji || "🌅"}</span>
                  <span
                    className={`px-2.5 py-1 rounded border ${tagColors}`}
                  >
                    {item.category}
                  </span>
                </div>
                <p className={`font-serif italic text-zinc-100 leading-relaxed ${isFirstCard ? 'text-lg md:text-xl font-light' : 'text-base font-normal'}`}>
                  "{item.text}"
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-4 select-none text-[11px] text-zinc-500 font-sans">
                <span className="font-semibold">{item.date}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleBookmark(item.id)}
                    className="text-zinc-400 group-hover:text-white transition-colors cursor-pointer"
                    aria-label="Bookmark session quote"
                  >
                    {item.bookmarked ? (
                      <BookmarkCheck className="w-4.5 h-4.5 text-[#D1FF26]" />
                    ) : (
                      <Bookmark className="w-4.5 h-4.5 group-hover:text-[#D1FF26] transition-colors" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      const clipboardText = `"${item.text}" - Recorded in Morning Ritual archive, ${item.date}`;
                      navigator.clipboard.writeText(clipboardText);
                    }}
                    className="text-zinc-400 hover:text-[#D1FF26] transition-colors cursor-pointer"
                    title="Copy insight"
                  >
                    <Share2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {filteredWisdom.length === 0 && (
        <div className="text-center py-16 bg-white/[0.01] border border-dashed border-white/10 rounded-2xl select-none">
          <p className="text-sm text-zinc-500 font-medium">No archived insights matching your selection.</p>
        </div>
      )}
    </div>
  );
}
