import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { X, Play, Pause, ChevronRight, Wind, Volume2, VolumeX } from "lucide-react";

interface BreathworkSessionProps {
  onClose: () => void;
  onComplete: () => void;
  mindsetName?: string;
}

type BreathPhase = "Inhale" | "Hold" | "Exhale" | "Rest";

export default function BreathworkSession({
  onClose,
  onComplete,
  mindsetName = "Deep Calm",
}: BreathworkSessionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>("Inhale");
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  // Initialize background ambient music
  useEffect(() => {
    const audio = new Audio('/new-bg-music.mp3');
    audio.loop = true;
    audio.volume = 0.15;
    audio.play().then(() => setSoundEnabled(true)).catch(() => setSoundEnabled(false));
    bgMusicRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Breathing loop ticker
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Transition to next phase
          setPhase((currentPhase) => {
            let nextPhase: BreathPhase = "Inhale";

            if (currentPhase === "Inhale") {
              nextPhase = "Hold";
            } else if (currentPhase === "Hold") {
              nextPhase = "Exhale";
            } else if (currentPhase === "Exhale") {
              nextPhase = "Rest";
            } else if (currentPhase === "Rest") {
              nextPhase = "Inhale";
              setCompletedCycles((c) => c + 1);
            }

            return nextPhase;
          });
          return 4; // Cycles are 4 seconds each (pacing Box Breathing)
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, soundEnabled]);

  const handleTogglePlay = () => {
    if (!isPlaying) {
      bgMusicRef.current?.play().catch(() => {});
    } else {
      bgMusicRef.current?.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const handleEndSession = () => {
    bgMusicRef.current?.pause();
    if (bgMusicRef.current) bgMusicRef.current.currentTime = 0;
    onComplete();
    onClose();
  };

  // Determine scaling coefficient of the meditation circle matching the phase
  const getCircleScale = () => {
    if (!isPlaying) return 1.0;
    switch (phase) {
      case "Inhale":
        return 1.6 - (secondsLeft / 4) * 0.6; // Expands from 1.0 to 1.6
      case "Hold":
        return 1.6; // Holds expanded limit
      case "Exhale":
        return 1.0 + (secondsLeft / 4) * 0.6; // Contracts from 1.6 to 1.0
      case "Rest":
        return 1.0; // Rests relaxed
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-[#0b0b0c] text-on-surface flex flex-col justify-between p-6">
      {/* Soft atmospheric gradient background matching deep spiritual focus */}
      <div className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-[var(--accent)]/5 to-transparent pointer-events-none -z-10" />

      {/* Header bar */}
      <div className="flex justify-between items-center w-full max-w-xl mx-auto pt-4">
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-[var(--accent)] animate-pulse" />
          <span className="font-mono text-xs tracking-[0.2em] uppercase font-bold text-zinc-400">
            Guided Sanctuary
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (soundEnabled) {
                bgMusicRef.current?.pause();
              } else if (isPlaying) {
                bgMusicRef.current?.play().catch(() => {});
              }
            }}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
            aria-label="Exit session"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Meditation Stage */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto relative">
        {/* Glow behind the breathing sphere */}
        <div className="absolute w-80 h-80 rounded-full bg-[var(--accent)]/5 blur-[70px] pointer-events-none" />

        {/* Dynamic Guided Breathing Sphere */}
        <motion.div
          animate={{
            scale: getCircleScale(),
            boxShadow:
              phase === "Hold"
                ? "0 0 50px 0px rgba(var(--accent-rgb), 0.4)"
                : "0 0 35px -5px rgba(var(--accent-rgb), 0.25)",
            borderColor: phase === "Hold" ? "#cebdff" : "var(--accent)",
          }}
          transition={{ type: "spring", stiffness: 45, damping: 20 }}
          className="w-40 h-40 rounded-full border-2 bg-white/[0.02] flex items-center justify-center relative mb-12 select-none"
        >
          {/* Inner ambient dynamic wave rings representing lung motion */}
          <div className="absolute inset-4 rounded-full border border-white/5 animate-pulse" />
          <div className="absolute inset-8 rounded-full border border-white/5 animate-spin" style={{ animationDuration: "10s" }} />

          <div className="text-center z-10">
            <span className="block font-serif text-2xl font-semibold text-white tracking-wide">
              {isPlaying ? secondsLeft : "Pause"}
            </span>
            <span className="block text-[10px] tracking-[0.15em] text-[var(--accent)] uppercase mt-1 font-semibold font-mono">
              seconds
            </span>
          </div>
        </motion.div>

        {/* Phase Instructions */}
        <div className="text-center space-y-3.5 select-none h-24">
          <h2 className="font-serif text-3xl font-medium text-white transition-all">
            {isPlaying ? phase : "Ready Your Focus"}
          </h2>
          <p className="text-xs text-zinc-400 font-medium tracking-wide max-w-xs mx-auto">
            {!isPlaying
              ? `A beautiful ${mindsetName} session custom sculpted for high intentional awareness.`
              : phase === "Inhale"
              ? "Follow the expansion. Breathe in slow and deep."
              : phase === "Hold"
              ? "Savor the absolute stillness. Quiet your thoughts."
              : phase === "Exhale"
              ? "Let go of tension. Release all clutter and cortisol."
              : "Wait at centered balance before the next rise."}
          </p>
        </div>

        {/* Counter indicators */}
        <div className="flex gap-4 mt-8 bg-white/5 px-4 py-2 border border-white/5 rounded-full select-none text-xs text-zinc-400">
          <span>Cycle: <strong className="text-white">{completedCycles}</strong></span>
          <span className="text-zinc-600">|</span>
          <span>Focus energy: <strong className="text-[#cebdff]">{mindsetName}</strong></span>
        </div>
      </div>

      {/* Control Actions bar */}
      <div className="w-full max-w-sm mx-auto flex flex-col gap-4 pb-6 select-none font-sans">
        <div className="flex justify-center items-center gap-6">
          <button
            onClick={handleTogglePlay}
            className={`cursor-pointer w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isPlaying
                ? "bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10"
                : "bg-[var(--accent)] text-[#0b0b0c] hover:shadow-[0_0_30px_4px_rgba(var(--accent-rgb),0.4)]"
            }`}
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-[#0b0b0c] stroke-none translate-x-0.5" />}
          </button>
        </div>

        <div className="flex justify-between items-center gap-4 mt-2">
          <button
            onClick={onClose}
            className="w-1/2 text-center text-[10px] tracking-widest uppercase font-mono font-bold py-3 border border-white/10 rounded hover:bg-white/5 text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            Quit
          </button>
          <button
            onClick={handleEndSession}
            className="w-1/2 text-center text-[10px] tracking-widest uppercase font-mono font-bold py-3 rounded bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/15 hover:border-[var(--accent)]/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Finish Ritual</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
