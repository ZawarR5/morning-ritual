import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Lock, Eye, EyeOff, ChevronLeft, Volume2 } from "lucide-react";

interface SecretViewProps {
  onClose: () => void;
}

const SECRET_PASSWORD = "78632792927";

const IMAGES = Array.from({ length: 7 }, (_, i) => `/secret/secret-${i + 1}.jpeg`);

function SecretStars() {
  const stars = useMemo(() => {
    return Array.from({ length: 80 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2.5 + 0.8,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
      baseOpacity: Math.random() * 0.4 + 0.2,
    }));
  }, []);
  const shootingStars = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      id: i,
      left: Math.random() * 80 + 10,
      top: Math.random() * 30,
      angle: Math.random() * 30 + 20,
      delay: Math.random() * 10 + 3,
      duration: Math.random() * 2 + 2.5,
      length: Math.random() * 80 + 60,
    }));
  }, []);
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.baseOpacity,
            animation: `secret-star-pulse ${s.duration}s ${s.delay}s infinite alternate ease-in-out`,
          }}
        />
      ))}
      {shootingStars.map((s) => (
        <div
          key={s.id}
          className="absolute"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            transform: `rotate(${s.angle}deg)`,
            transformOrigin: "left center",
          }}
        >
          <div
            className="h-px rounded-full"
            style={{
              width: `${s.length}px`,
              opacity: 0,
              animation: `secret-shoot ${s.duration}s ${s.delay}s infinite`,
              background: "linear-gradient(to right, rgba(255,255,255,0.9), transparent)",
              boxShadow: "0 0 4px rgba(255,255,255,0.4), 0 0 12px rgba(255,255,255,0.15)",
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes secret-star-pulse {
          0% { opacity: 0.05; transform: scale(0.6); box-shadow: 0 0 2px rgba(255,255,255,0.05); }
          50% { opacity: 0.9; transform: scale(1.4); box-shadow: 0 0 12px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.2); }
          100% { opacity: 0.6; transform: scale(1); box-shadow: 0 0 6px rgba(255,255,255,0.3); }
        }
        @keyframes secret-shoot {
          0% { transform: translateX(-100%); opacity: 0; }
          8% { opacity: 1; }
          65% { opacity: 1; }
          100% { transform: translateX(500px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function SecretView({ onClose }: SecretViewProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const touchStartX = useRef(0);
  const imageIndex = fullscreenImage ? IMAGES.indexOf(fullscreenImage) : -1;

  const goNext = useCallback(() => {
    setFullscreenImage(IMAGES[(imageIndex + 1) % IMAGES.length]);
  }, [imageIndex]);

  const goPrev = useCallback(() => {
    setFullscreenImage(IMAGES[(imageIndex - 1 + IMAGES.length) % IMAGES.length]);
  }, [imageIndex]);

  useEffect(() => {
    if (!fullscreenImage) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [fullscreenImage, goNext, goPrev]);

  useEffect(() => {
    if (showContent && !audioRef.current) {
      const audio = new Audio("/secret/Sitaare.mp3");
      audio.loop = true;
      audio.volume = volume;
      audio.play().catch(() => {});
      audioRef.current = audio;
    }
    if (!showContent && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [showContent]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, []);

  useEffect(() => {
    if (unlocked) {
      const timer = setTimeout(() => setShowContent(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [unlocked]);

  const handleSubmit = () => {
    if (input === SECRET_PASSWORD) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setInput("");
    }
  };

  return (
    <AnimatePresence>
      {!fullscreenImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 260 }}
            className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
          >
            {!unlocked ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-[var(--accent)]" />
                    <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-400">
                      Restricted
                    </span>
                  </div>
                  <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-center space-y-2">
                  <p className="font-serif text-xl text-white">Guess the Correct Password</p>
                  <p className="text-xs text-zinc-500 font-mono">Enter the secret code to unlock</p>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={input}
                    onChange={(e) => { setInput(e.target.value); setError(false); }}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                    placeholder="••••••"
                    maxLength={12}
                    autoFocus
                    className={`w-full bg-[#161618] border rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none font-mono tracking-widest text-center ${
                      error ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-[var(--accent)]/40"
                    }`}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-400 font-mono text-center"
                  >
                    Incorrect password. Try again.
                  </motion.p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!input}
                  className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-zinc-950 font-mono text-[10px] font-bold uppercase tracking-[0.2em] py-3 rounded hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)] transition-all active:scale-95 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Unlock
                </button>
              </div>
            ) : !showContent ? (
              <div className="text-center space-y-4 py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200 }}
                  className="w-16 h-16 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/30 flex items-center justify-center mx-auto"
                >
                  <Lock className="w-7 h-7 text-[var(--accent)]" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="font-serif text-xl text-[var(--accent)]"
                >
                  Congratulations
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-xs text-zinc-500 font-mono"
                >
                  Preparing your secret space...
                </motion.p>
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      )}

      {showContent && !fullscreenImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] bg-[#050505] overflow-y-auto"
        >
          <SecretStars />
          <div className="sticky top-0 z-10 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg text-white">Secret Vault</h2>
              <p className="font-mono text-[10px] tracking-wider text-zinc-500 uppercase">{IMAGES.length} treasures</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5 border border-white/5">
                <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 h-1 accent-[var(--accent)] cursor-pointer"
                />
              </div>
              <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 max-w-5xl mx-auto">
            <div className="text-center py-12 select-none">
              <h2 className="text-3xl md:text-4xl text-white/90 leading-relaxed" style={{ fontFamily: "'Dancing Script', cursive", textShadow: "0 0 40px rgba(var(--accent-rgb),0.2)" }}>
                Bas Tumse Milne ki Der Thi
              </h2>
              <div className="mt-3 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent" />
            </div>
            <div className="columns-2 md:columns-3 gap-3 space-y-3">
              {IMAGES.map((src, i) => (
                <motion.button
                  key={src}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                  onClick={() => setFullscreenImage(src)}
                  className="w-full break-inside-avoid overflow-hidden rounded-xl border border-white/5 bg-zinc-900 group cursor-pointer relative"
                >
                  <img
                    src={src}
                    alt={`Secret ${i + 1}`}
                    className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full p-1.5">
                      <X className="w-3 h-3 text-white rotate-45" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {fullscreenImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[300] bg-black/95 flex flex-col"
          onTouchStart={(e) => { if (e.touches.length === 1) touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (e.changedTouches.length > 1) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(dx) > 60) {
              dx > 0 ? goPrev() : goNext();
            }
          }}
        >
          <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
            <button
              onClick={() => setFullscreenImage(null)}
              className="flex items-center gap-2 text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-sm transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 min-h-0">
            <motion.img
              key={fullscreenImage}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25 }}
              src={fullscreenImage}
              alt="Full screen secret"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-10 p-4 flex justify-center bg-gradient-to-t from-black/60 to-transparent">
            <div className="flex gap-2">
              {IMAGES.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setFullscreenImage(src)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    fullscreenImage === src ? "border-white scale-110" : "border-white/20 opacity-50 hover:opacity-80"
                  }`}
                >
                  <img src={src} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
