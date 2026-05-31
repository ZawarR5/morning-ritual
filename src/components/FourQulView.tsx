import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, ChevronRight } from "lucide-react";
import { QUL_SURAHS } from "../data/quran";

interface FourQulViewProps {
  onFinish: () => void;
}

export default function FourQulView({ onFinish }: FourQulViewProps) {
  const [currentSurahIdx, setCurrentSurahIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const surah = QUL_SURAHS[currentSurahIdx];

  const currentAyahIdx =
    duration > 0
      ? Math.min(
          Math.floor((currentTime / duration) * surah.ayahs.length),
          surah.ayahs.length - 1
        )
      : -1;

  useEffect(() => {
    const audio = new Audio(surah.audioFile);
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentSurahIdx]);

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (!hasStarted) setHasStarted(true);
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleFinish = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setHasStarted(false);
    setCurrentTime(0);
    onFinish();
  };

  const handleSurahChange = (idx: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setHasStarted(false);
    setCurrentTime(0);
    setDuration(0);
    setCurrentSurahIdx(idx);
  };

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      key={currentSurahIdx}
      className="fixed inset-0 z-[120] bg-[#0b0b0c] text-[#e5e2e1] flex flex-col"
    >
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#D1FF26]/5 to-transparent pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-400">
          4 Kul
        </span>
        <button
          onClick={handleFinish}
          className="text-[10px] tracking-widest uppercase font-mono font-bold px-4 py-2 rounded bg-[#D1FF26]/10 hover:bg-[#D1FF26]/20 text-[#D1FF26] border border-[#D1FF26]/15 transition-all cursor-pointer flex items-center gap-1"
        >
          <span>Finish</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Surah selector */}
      <div className="flex justify-center gap-2 px-4 py-3 overflow-x-auto">
        {QUL_SURAHS.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => handleSurahChange(idx)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              idx === currentSurahIdx
                ? "bg-[#D1FF26]/15 text-[#D1FF26] border border-[#D1FF26]/30 shadow-[0_0_12px_rgba(209,255,38,0.15)]"
                : "text-zinc-500 border border-white/5 hover:text-zinc-300"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-y-auto py-4">
        {!hasStarted ? (
          <div className="text-center space-y-6 select-none">
            <p
              className="text-4xl sm:text-5xl font-serif text-white leading-relaxed"
              dir="rtl"
            >
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِیْمِ
            </p>
            <p className="text-zinc-500 text-sm font-mono tracking-wide">
              {surah.nameArabic}
            </p>
            <p className="text-zinc-400 text-sm font-mono tracking-wider">
              Surah {surah.name}
            </p>
          </div>
        ) : (
          <div
            className="w-full max-w-lg mx-auto text-right space-y-4 select-none"
            dir="rtl"
          >
            {surah.ayahs.map((ayah, idx) => (
              <p
                key={idx}
                className={`text-2xl sm:text-3xl font-serif leading-relaxed tracking-wide transition-all duration-500 ${
                  idx === currentAyahIdx
                    ? "text-[#D1FF26] scale-[1.02] [text-shadow:0_0_16px_rgba(209,255,38,0.35)]"
                    : idx < currentAyahIdx
                    ? "text-zinc-600"
                    : "text-zinc-300"
                }`}
              >
                {ayah.arabic}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-full max-w-sm mx-auto px-6 pb-4">
        {hasStarted && duration > 0 && (
          <>
            <div className="w-full h-1 bg-white/10 rounded-full mb-2 overflow-hidden">
              <div
                className="h-full bg-[#D1FF26] rounded-full transition-all duration-200"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <div className="text-center text-[10px] text-zinc-500 font-mono mb-3">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </>
        )}

        <div className="flex justify-center items-center gap-6 mb-4">
          <button
            onClick={handleTogglePlay}
            className={`cursor-pointer w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isPlaying
                ? "bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10"
                : "bg-[#D1FF26] text-[#0b0b0c] hover:shadow-[0_0_30px_4px_rgba(209,255,38,0.4)]"
            }`}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-white" />
            ) : (
              <Play className="w-6 h-6 fill-[#0b0b0c] stroke-none translate-x-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* News ticker */}
      <div className="w-full bg-white/10 border-t border-white/15 overflow-hidden h-14 flex items-center">
        <div className="ticker-track whitespace-nowrap">
          <span>{surah.tickerText}</span>
          <span>{surah.tickerText}</span>
        </div>
      </div>

      <style>{`
        .ticker-track {
          display: flex;
          white-space: nowrap;
          animation: ticker-scroll 45s linear infinite;
        }
        .ticker-track span {
          padding-right: 6rem;
          font-size: 1rem;
          color: #d4d4d8;
          font-weight: 500;
          line-height: 3.5rem;
          white-space: nowrap;
        }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
