import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RotateCcw, Sparkles, Brain, ArrowLeft, Trophy, Wind, X, Music, Grid3x3, Keyboard } from "lucide-react";

const GAMES = [
  {
    id: "memory-match",
    title: "Memory Match",
    description: "Flip cards and find all matching pairs",
    icon: Brain,
    emoji: "🧠",
    color: "var(--accent)",
  },
  {
    id: "flappy-leaf",
    title: "Flappy Leaf",
    description: "Tap to guide a floating leaf through the calm pillars",
    icon: Wind,
    emoji: "🍃",
    color: "var(--accent)",
  },
  {
    id: "mindful-snake",
    title: "Mindful Serpent",
    description: "Guide the serpent to gather glowing orbs. Don't hit the walls or yourself",
    icon: Trophy,
    emoji: "🐍",
    color: "var(--accent)",
  },
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    description: "Classic 3-in-a-row. Play against the app",
    icon: X,
    emoji: "⭕",
    color: "var(--accent)",
  },
  {
    id: "simon-says",
    title: "Simon Says",
    description: "Repeat the growing pattern of colors. How long can you remember?",
    icon: Music,
    emoji: "🎵",
    color: "var(--accent)",
  },
  {
    id: "tetris",
    title: "Tetris",
    description: "Arrange falling blocks and clear rows. Classic puzzle action",
    icon: Grid3x3,
    emoji: "🔲",
    color: "var(--accent)",
  },
  {
    id: "guess-word",
    title: "Guess the Word",
    description: "Letters reveal over time. Type the word before the 30s timer runs out",
    icon: Keyboard,
    emoji: "🔤",
    color: "var(--accent)",
  },
];

const EMOJIS = ["🌿", "🌊", "🌙", "☀️", "🕊️", "✨", "🌸", "🍃", "🔥", "💧", "🌌", "⭐"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function MemoryMatchGame({ onBack }: { onBack: () => void }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [turns, setTurns] = useState(0);
  const [won, setWon] = useState(false);
  const [locked, setLocked] = useState(false);

  const initGame = useCallback(() => {
    const pairs = shuffle(EMOJIS).slice(0, 6);
    const deck = shuffle([...pairs, ...pairs]).map((emoji, i) => ({
      id: i,
      emoji,
      flipped: false,
      matched: false,
    }));
    setCards(deck);
    setFlippedIds([]);
    setMatches(0);
    setTurns(0);
    setWon(false);
    setLocked(false);
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  useEffect(() => {
    if (matches === 6) {
      const timer = setTimeout(() => setWon(true), 400);
      return () => clearTimeout(timer);
    }
  }, [matches]);

  const handleFlip = (id: number) => {
    if (locked || won) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const updated = cards.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    setCards(updated);

    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setTurns((t) => t + 1);
      setLocked(true);
      const [first, second] = newFlipped.map((fid) => updated.find((c) => c.id === fid)!);
      if (first.emoji === second.emoji) {
        setCards((prev) =>
          prev.map((c) => (c.id === first.id || c.id === second.id ? { ...c, matched: true } : c))
        );
        setMatches((m) => m + 1);
        setFlippedIds([]);
        setLocked(false);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === first.id || c.id === second.id ? { ...c, flipped: false } : c))
          );
          setFlippedIds([]);
          setLocked(false);
        }, 800);
      }
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 flex flex-col gap-6 pb-16">
      <div className="flex items-center gap-3 pt-4">
        <button
          onClick={onBack}
          className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-[var(--accent)] font-mono text-[10px] font-bold tracking-[0.25em] uppercase">
            Mindful Play
          </span>
          <h2 className="font-serif text-2xl font-normal text-white leading-tight">
            Memory Match
          </h2>
        </div>
      </div>

      <p className="font-sans text-xs text-zinc-400 text-center -mt-2">
        Find all 6 pairs. {turns > 0 && `${turns} turn${turns !== 1 ? "s" : ""}`}
      </p>

      <div className="grid grid-cols-4 gap-3">
        {cards.map((card) => {
          const show = card.flipped || card.matched;
          return (
            <motion.button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              whileTap={{ scale: 0.93 }}
              className={`aspect-square rounded-2xl flex items-center justify-center text-2xl transition-all cursor-pointer ${
                card.matched
                  ? "bg-[var(--accent)]/10 border border-[var(--accent)]/30 opacity-60"
                  : show
                  ? "bg-[#161618] border border-white/20"
                  : "bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20"
              }`}
            >
              <AnimatePresence mode="wait">
                {show ? (
                  <motion.span
                    key="emoji"
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="block"
                  >
                    {card.emoji}
                  </motion.span>
                ) : (
                  <motion.span
                    key="?"
                    initial={{ rotateY: -90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-zinc-600 text-lg font-bold font-mono"
                  >
                    ?
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {won && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 py-6"
        >
          <Sparkles className="w-8 h-8 mx-auto text-[var(--accent)]" />
          <p className="font-serif text-xl text-white">All pairs found!</p>
          <p className="font-sans text-xs text-zinc-400">You finished in {turns} turns</p>
          <button
            onClick={initGame}
            className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-zinc-950 font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 rounded hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)] transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
}

const GRID_SIZE = 16;
const INITIAL_SPEED = 150;

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";

function getHighScore(): number {
  return parseInt(localStorage.getItem("mr_snake_highscore") || "0", 10);
}

function setHighScore(score: number) {
  const prev = getHighScore();
  if (score > prev) {
    localStorage.setItem("mr_snake_highscore", score.toString());
  }
}

function randomFood(snake: { x: number; y: number }[]): { x: number; y: number } {
  const occupied = new Set(snake.map((s) => `${s.x},${s.y}`));
  let pos: { x: number; y: number };
  do {
    pos = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
  } while (occupied.has(`${pos.x},${pos.y}`));
  return pos;
}

function SnakeGame({ onBack }: { onBack: () => void }) {
  const [snake, setSnake] = useState([{ x: 8, y: 8 }]);
  const [food, setFood] = useState({ x: 12, y: 8 });
  const [dir, setDir] = useState<Dir>("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScoreState] = useState(getHighScore);
  const [paused, setPaused] = useState(false);
  const dirRef = useRef<Dir>("RIGHT");
  const gameOverRef = useRef(false);
  const pausedRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const changeDir = useCallback((newDir: Dir) => {
    if (gameOverRef.current) return;
    const opposites: Record<string, string> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
    if (opposites[newDir] !== dirRef.current) {
      dirRef.current = newDir;
      setDir(newDir);
    }
  }, []);

  const resetGame = useCallback(() => {
    const start = [{ x: 8, y: 8 }];
    setSnake(start);
    setFood(randomFood(start));
    setDir("RIGHT");
    dirRef.current = "RIGHT";
    setGameOver(false);
    gameOverRef.current = false;
    setScore(0);
    setPaused(false);
    pausedRef.current = false;
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const keyMap: Record<string, Dir> = {
        ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT",
        w: "UP", W: "UP", s: "DOWN", S: "DOWN", a: "LEFT", A: "LEFT", d: "RIGHT", D: "RIGHT",
      };
      const newDir = keyMap[e.key];
      if (!newDir) {
        if (e.key === " " || e.key === "p" || e.key === "P") {
          setPaused((p) => { pausedRef.current = !p; return !p; });
        }
        return;
      }
      changeDir(newDir);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [changeDir]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    const minSwipe = 20;
    if (Math.abs(dx) < minSwipe && Math.abs(dy) < minSwipe) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      changeDir(dx > 0 ? "RIGHT" : "LEFT");
    } else {
      changeDir(dy > 0 ? "DOWN" : "UP");
    }
  };

  useEffect(() => {
    if (gameOver || paused) return;
    const interval = setInterval(() => {
      if (pausedRef.current || gameOverRef.current) return;
      setSnake((prev) => {
        const head = prev[0];
        const newHead = { x: head.x, y: head.y };
        switch (dirRef.current) {
          case "UP": newHead.y -= 1; break;
          case "DOWN": newHead.y += 1; break;
          case "LEFT": newHead.x -= 1; break;
          case "RIGHT": newHead.x += 1; break;
        }
        if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
        if (newHead.x >= GRID_SIZE) newHead.x = 0;
        if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
        if (newHead.y >= GRID_SIZE) newHead.y = 0;
        const hitSelf = prev.slice(0, -1).some((s) => s.x === newHead.x && s.y === newHead.y);
        if (hitSelf) {
          gameOverRef.current = true;
          setGameOver(true);
          setHighScore(score);
          return prev;
        }
        const ate = newHead.x === food.x && newHead.y === food.y;
        const next = [newHead, ...prev];
        if (!ate) next.pop();
        if (ate) {
          setScore((s) => s + 1);
          setFood((f) => randomFood(next));
          setHighScoreState((h) => getHighScore());
        }
        return next;
      });
    }, INITIAL_SPEED);
    return () => clearInterval(interval);
  }, [food, gameOver, paused, score]);

  return (
    <div className="w-full max-w-lg mx-auto px-4 flex flex-col gap-4 pb-16">
      <div className="flex items-center gap-3 pt-4">
        <button
          onClick={onBack}
          className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-[var(--accent)] font-mono text-[10px] font-bold tracking-[0.25em] uppercase">
            Mindful Play
          </span>
          <h2 className="font-serif text-2xl font-normal text-white leading-tight">
            Mindful Serpent
          </h2>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
        <span>Score: <span className="text-white font-bold">{score}</span></span>
        <span>Best: <span className="text-[var(--accent)] font-bold">{highScore}</span></span>
        <button
          onClick={() => setPaused((p) => { pausedRef.current = !p; return !p; })}
          className="text-zinc-500 hover:text-white transition-colors cursor-pointer px-2 py-1 rounded hover:bg-white/5 text-[10px] uppercase tracking-wider"
        >
          {paused ? "Resume" : "Pause"}
        </button>
      </div>

      <div
        className="relative mx-auto w-full max-w-[400px] aspect-square bg-[#0b0b0c] border border-white/10 rounded-2xl overflow-hidden select-none"
        style={{ touchAction: "none" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]">
          <defs>
            <pattern id="grid" width={`${100 / GRID_SIZE}%`} height={`${100 / GRID_SIZE}%`}>
              <path d={`M ${100 / GRID_SIZE} 0 L 0 0 0 ${100 / GRID_SIZE}`} fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Snake segments */}
        {snake.map((seg, i) => (
          <div
            key={`${seg.x}-${seg.y}-${i}`}
            className="absolute rounded-sm transition-[top,left] duration-[80ms]"
            style={{
              top: `${(seg.y / GRID_SIZE) * 100}%`,
              left: `${(seg.x / GRID_SIZE) * 100}%`,
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              backgroundColor: i === 0 ? "var(--accent)" : "rgba(var(--accent-rgb), 0.5)",
              boxShadow: i === 0 ? "0 0 8px rgba(var(--accent-rgb), 0.6)" : "none",
              borderRadius: i === 0 ? "4px" : "2px",
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute flex items-center justify-center text-base animate-pulse"
          style={{
            top: `${(food.y / GRID_SIZE) * 100}%`,
            left: `${(food.x / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
          }}
        >
          🪷
        </div>

        {/* Pause overlay */}
        {paused && !gameOver && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <p className="font-serif text-xl text-white">Paused</p>
          </div>
        )}

        {/* Game over overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4 z-10">
            <p className="font-serif text-2xl text-white">Game Over</p>
            <p className="text-xs text-zinc-400 font-mono">Score: {score}</p>
            {score >= highScore && score > 0 && (
              <p className="text-[10px] text-[var(--accent)] uppercase tracking-wider font-bold">New High Score!</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={resetGame}
                className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-zinc-950 font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 rounded hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)] transition-all active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-[10px] text-zinc-500 font-mono">
        Swipe or use arrow keys &middot; Space or P to pause
      </p>

      {/* D-pad for mobile */}
      <div className="flex justify-center select-none">
        <div className="grid grid-cols-3 gap-1.5 w-40 h-40">
          <div />
          <button
            onTouchStart={(e) => { e.preventDefault(); changeDir("UP"); }}
            onClick={() => changeDir("UP")}
            className="bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white active:scale-95 transition-all cursor-pointer text-sm"
            aria-label="Up"
          >
            ▲
          </button>
          <div />
          <button
            onTouchStart={(e) => { e.preventDefault(); changeDir("LEFT"); }}
            onClick={() => changeDir("LEFT")}
            className="bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white active:scale-95 transition-all cursor-pointer text-sm"
            aria-label="Left"
          >
            ◀
          </button>
          <button
            onTouchStart={(e) => { e.preventDefault(); changeDir("DOWN"); }}
            onClick={() => changeDir("DOWN")}
            className="bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white active:scale-95 transition-all cursor-pointer text-sm"
            aria-label="Down"
          >
            ▼
          </button>
          <button
            onTouchStart={(e) => { e.preventDefault(); changeDir("RIGHT"); }}
            onClick={() => changeDir("RIGHT")}
            className="bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white active:scale-95 transition-all cursor-pointer text-sm"
            aria-label="Right"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}

function FlappyLeafGame({ onBack }: { onBack: () => void }) {
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem("mr_flappy_highscore") || "0", 10));
  const [birdY, setBirdY] = useState(50);
  const [pipes, setPipes] = useState<{ x: number; topH: number; scored: boolean }[]>([]);

  const birdVelRef = useRef(0);
  const birdYRef = useRef(50);
  const pipesRef = useRef<{ x: number; topH: number; scored: boolean }[]>([]);
  const scoreRef = useRef(0);
  const gameOverRef = useRef(false);
  const startedRef = useRef(false);
  const frameRef = useRef(0);
  const lastPipeRef = useRef(0);

  const GRAVITY = 0.25;
  const FLAP = -2.8;
  const PIPE_SPEED = 1.8;
  const PIPE_GAP = 30;
  const PIPE_W = 12;
  const BIRD_X = 25;
  const GROUND = 88;

  function rectHit(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  const flap = useCallback(() => {
    if (gameOverRef.current) {
      birdVelRef.current = 0;
      birdYRef.current = 50;
      pipesRef.current = [];
      scoreRef.current = 0;
      lastPipeRef.current = 0;
      frameRef.current = 0;
      gameOverRef.current = false;
      startedRef.current = false;
      setGameOver(false);
      setScore(0);
      setBirdY(50);
      setPipes([]);
      setStarted(false);
      return;
    }
    if (!startedRef.current) {
      startedRef.current = true;
      setStarted(true);
    }
    birdVelRef.current = FLAP;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!startedRef.current || gameOverRef.current) return;
      frameRef.current++;
      birdVelRef.current += GRAVITY;
      birdYRef.current += birdVelRef.current;
      if (birdYRef.current < -5) birdYRef.current = -5;
      if (birdYRef.current >= GROUND) {
        gameOverRef.current = true;
        const finalScore = scoreRef.current;
        if (finalScore > parseInt(localStorage.getItem("mr_flappy_highscore") || "0")) {
          localStorage.setItem("mr_flappy_highscore", finalScore.toString());
        }
        setGameOver(true);
        return;
      }
      const curPipes = pipesRef.current;
      for (const p of curPipes) p.x -= PIPE_SPEED;
      const filtered = curPipes.filter(p => p.x + PIPE_W > -5);
      for (const p of filtered) {
        if (!p.scored && p.x + PIPE_W < BIRD_X) {
          p.scored = true;
          scoreRef.current++;
          setScore(scoreRef.current);
          if (scoreRef.current > parseInt(localStorage.getItem("mr_flappy_highscore") || "0")) {
            localStorage.setItem("mr_flappy_highscore", scoreRef.current.toString());
            setHighScore(scoreRef.current);
          }
        }
      }
      if (frameRef.current - lastPipeRef.current >= 50) {
        lastPipeRef.current = frameRef.current;
        filtered.push({ x: 100, topH: 15 + Math.random() * 38, scored: false });
      }
      const birdRect = { x: BIRD_X - 4, y: birdYRef.current - 4, w: 8, h: 8 };
      for (const p of filtered) {
        if (rectHit(birdRect, { x: p.x, y: 0, w: PIPE_W, h: p.topH }) ||
            rectHit(birdRect, { x: p.x, y: p.topH + PIPE_GAP, w: PIPE_W, h: 100 - p.topH - PIPE_GAP })) {
          gameOverRef.current = true;
          const finalScore = scoreRef.current;
          if (finalScore > parseInt(localStorage.getItem("mr_flappy_highscore") || "0")) {
            localStorage.setItem("mr_flappy_highscore", finalScore.toString());
          }
          setGameOver(true);
          return;
        }
      }
      pipesRef.current = filtered;
      setBirdY(birdYRef.current);
      setPipes([...filtered]);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto px-4 flex flex-col gap-4 pb-16">
      <div className="flex items-center gap-3 pt-4">
        <button onClick={onBack} className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-[var(--accent)] font-mono text-[10px] font-bold tracking-[0.25em] uppercase">Mindful Play</span>
          <h2 className="font-serif text-2xl font-normal text-white leading-tight">Flappy Leaf</h2>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
        <span>Score: <span className="text-white font-bold">{score}</span></span>
        <span>Best: <span className="text-[var(--accent)] font-bold">{highScore}</span></span>
      </div>
      <div
        className="relative mx-auto w-full max-w-[400px] aspect-[3/4] bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#0b0b0c] border border-white/10 rounded-2xl overflow-hidden select-none"
        style={{ touchAction: "none" }}
        onClick={flap}
        onTouchStart={(e) => { e.preventDefault(); flap(); }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-[10%] bg-[#161618] border-t border-white/5" />
        <div className="absolute text-3xl transition-all duration-[30ms]" style={{ left: `${BIRD_X}%`, top: `${birdY}%`, transform: "translate(-50%, -50%)" }}>🍃</div>
        {pipes.map((p, i) => (
          <React.Fragment key={i}>
            <div className="absolute bg-gradient-to-b from-[#1a3a2a] to-[#2a5a3a]" style={{ left: `${p.x}%`, top: 0, width: `${PIPE_W}%`, height: `${p.topH}%`, borderBottom: "4px solid #3a7a4a" }}>
              <div className="absolute bottom-0 left-[-3px] right-[-3px] h-3 bg-[#2a5a3a] rounded-sm" />
            </div>
            <div className="absolute bg-gradient-to-t from-[#1a3a2a] to-[#2a5a3a]" style={{ left: `${p.x}%`, top: `${p.topH + PIPE_GAP}%`, width: `${PIPE_W}%`, height: `${100 - p.topH - PIPE_GAP - 10}%`, borderTop: "4px solid #3a7a4a" }}>
              <div className="absolute top-0 left-[-3px] right-[-3px] h-3 bg-[#2a5a3a] rounded-sm" />
            </div>
          </React.Fragment>
        ))}
        {!started && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40">
            <p className="font-serif text-2xl text-white">🍃 Flappy Leaf</p>
            <p className="text-xs text-zinc-400 font-mono">Tap to start</p>
          </div>
        )}
        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4">
            <p className="font-serif text-2xl text-white">Game Over</p>
            <p className="text-xs text-zinc-400 font-mono">Score: {score}</p>
            <button onClick={flap} className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-zinc-950 font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 rounded hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)] transition-all active:scale-95 cursor-pointer">
              <RotateCcw className="w-3.5 h-3.5" />
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

type Board = (null | "X" | "O")[];

function getWinner(b: Board): "X" | "O" | null {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  for (const [a,c,d] of lines) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  }
  return null;
}

function aiMove(b: Board): number {
  const empty = b.map((v, i) => v === null ? i : -1).filter(i => i >= 0);
  if (empty.length === 0) return -1;
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const p of ["O", "X"]) {
    for (const [a,c,d] of lines) {
      const vals = [b[a], b[c], b[d]];
      const idxs = [a, c, d];
      if (vals.filter(v => v === p).length === 2 && vals.includes(null)) {
        return idxs[vals.indexOf(null)];
      }
    }
  }
  if (b[4] === null) return 4;
  const corners = [0, 2, 6, 8].filter(i => b[i] === null);
  if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
  return empty[Math.floor(Math.random() * empty.length)];
}

function TicTacToeGame({ onBack }: { onBack: () => void }) {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [player, setPlayer] = useState<"X" | null>(null);
  const [winner, setWinner] = useState<"X" | "O" | "draw" | null>(null);
  const [wins, setWins] = useState(() => parseInt(localStorage.getItem("mr_ttt_wins") || "0", 10));
  const [losses, setLosses] = useState(() => parseInt(localStorage.getItem("mr_ttt_losses") || "0", 10));
  const [draws, setDraws] = useState(() => parseInt(localStorage.getItem("mr_ttt_draws") || "0", 10));

  const updateRecord = useCallback((result: "win" | "loss" | "draw") => {
    if (result === "win") {
      setWins((n) => { const v = n + 1; localStorage.setItem("mr_ttt_wins", v.toString()); return v; });
    } else if (result === "loss") {
      setLosses((n) => { const v = n + 1; localStorage.setItem("mr_ttt_losses", v.toString()); return v; });
    } else {
      setDraws((n) => { const v = n + 1; localStorage.setItem("mr_ttt_draws", v.toString()); return v; });
    }
  }, []);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setPlayer(Math.random() < 0.5 ? "X" : "O");
    setWinner(null);
  }, []);

  useEffect(() => { resetGame(); }, [resetGame]);

  // Check for winner after every board change
  useEffect(() => {
    if (winner) return;
    const w = getWinner(board);
    if (w) {
      setWinner(w);
      updateRecord(w === "X" ? "win" : "loss");
    } else if (board.every((v) => v !== null)) {
      setWinner("draw");
      updateRecord("draw");
    } else {
      setPlayer((prev) => prev === "X" ? "O" : "X");
    }
  }, [board]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = (i: number) => {
    if (winner || player !== "X" || board[i]) return;
    const next = [...board];
    next[i] = "X";
    setBoard(next);
  };

  const status = winner === "X" ? "You win!"
    : winner === "O" ? "App wins!"
    : winner === "draw" ? "It's a draw!"
    : player === "O" ? "App thinking..."
    : "Your turn (X)";

  // AI move
  useEffect(() => {
    if (winner || player !== "O") return;
    const timer = setTimeout(() => {
      const idx = aiMove(board);
      if (idx < 0) return;
      const next = [...board];
      next[idx] = "O";
      setBoard(next);
    }, 400);
    return () => clearTimeout(timer);
  }, [player, winner]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="w-full max-w-lg mx-auto px-4 flex flex-col gap-6 pb-16">
      <div className="flex items-center gap-3 pt-4">
        <button onClick={onBack} className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-[var(--accent)] font-mono text-[10px] font-bold tracking-[0.25em] uppercase">Mindful Play</span>
          <h2 className="font-serif text-2xl font-normal text-white leading-tight">Tic Tac Toe</h2>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
        <span>Wins: <span className="text-[var(--accent)] font-bold">{wins}</span></span>
        <span>Losses: <span className="text-red-400 font-bold">{losses}</span></span>
        <span>Draws: <span className="text-zinc-400 font-bold">{draws}</span></span>
      </div>

      <p className="text-xs text-zinc-500 text-center font-mono -mt-2">{status}</p>

      <div className="grid grid-cols-3 gap-2 mx-auto w-full max-w-[300px]">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            disabled={!!winner || player !== "X" || !!cell}
            className={`aspect-square rounded-xl text-3xl font-bold flex items-center justify-center transition-all cursor-pointer ${
              cell === "X" ? "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30"
              : cell === "O" ? "bg-red-500/10 text-red-400 border border-red-500/30"
              : "bg-white/[0.02] border border-white/10 hover:bg-white/[0.06] hover:border-white/20"
            } ${(!winner && player === "X" && !cell) ? "active:scale-95" : ""} ${(!winner && player !== "X") ? "cursor-not-allowed" : ""}`}
          >
            {cell}
          </button>
        ))}
      </div>

      {winner && (
        <div className="flex justify-center">
          <button
            onClick={resetGame}
            className="inline-flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-zinc-950 font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 rounded hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)] transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

function SimonSaysGame({ onBack }: { onBack: () => void }) {
  const COLORS = [
    { bg: "#22c55e", active: "#4ade80", key: 0 },
    { bg: "#ef4444", active: "#f87171", key: 1 },
    { bg: "#eab308", active: "#facc15", key: 2 },
    { bg: "#3b82f6", active: "#60a5fa", key: 3 },
  ];
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerIdx, setPlayerIdx] = useState(0);
  const [phase, setPhase] = useState<"idle" | "showing" | "input" | "gameover">("idle");
  const [activeBtn, setActiveBtn] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem("mr_simon_highscore") || "0", 10));

  const startGame = useCallback(() => {
    const first = Math.floor(Math.random() * 4);
    setSequence([first]);
    setPlayerIdx(0);
    setScore(0);
    setPhase("showing");
    setHighScore(parseInt(localStorage.getItem("mr_simon_highscore") || "0", 10));
  }, []);

  useEffect(() => {
    if (phase !== "showing" || sequence.length === 0) return;
    let i = 0;
    const showNext = () => {
      if (i >= sequence.length) { setPhase("input"); return; }
      setActiveBtn(sequence[i]);
      setTimeout(() => {
        setActiveBtn(null);
        i++;
        setTimeout(showNext, 180);
      }, 450);
    };
    const t = setTimeout(showNext, 350);
    return () => clearTimeout(t);
  }, [phase, sequence]);

  const handleTap = (colorIdx: number) => {
    if (phase !== "input") return;
    setActiveBtn(colorIdx);
    setTimeout(() => setActiveBtn(null), 200);
    if (colorIdx !== sequence[playerIdx]) {
      const finalScore = score;
      if (finalScore > parseInt(localStorage.getItem("mr_simon_highscore") || "0")) {
        localStorage.setItem("mr_simon_highscore", finalScore.toString());
        setHighScore(finalScore);
      }
      setPhase("gameover");
      return;
    }
    const nextIdx = playerIdx + 1;
    if (nextIdx >= sequence.length) {
      setScore(score + 1);
      setSequence([...sequence, Math.floor(Math.random() * 4)]);
      setPlayerIdx(0);
      setTimeout(() => setPhase("showing"), 300);
    } else {
      setPlayerIdx(nextIdx);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 flex flex-col gap-5 pb-16">
      <div className="flex items-center gap-3 pt-4">
        <button onClick={onBack} className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <span className="text-[var(--accent)] font-mono text-[10px] font-bold tracking-[0.25em] uppercase">Mindful Play</span>
          <h2 className="font-serif text-2xl font-normal text-white leading-tight">Simon Says</h2>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
        <span>Score: <span className="text-white font-bold">{score}</span></span>
        <span>Best: <span className="text-[var(--accent)] font-bold">{highScore}</span></span>
        <span className="text-zinc-500">{phase === "showing" ? "Watch..." : phase === "input" ? "Your turn" : phase === "gameover" ? "Game over" : ""}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 mx-auto w-full max-w-[280px] aspect-square">
        {COLORS.map((c) => (
          <button
            key={c.key}
            onClick={() => handleTap(c.key)}
            disabled={phase !== "input"}
            className="rounded-2xl transition-all duration-150 cursor-pointer border-2 border-white/10 disabled:cursor-not-allowed"
            style={{
              backgroundColor: activeBtn === c.key ? c.active : c.bg,
              boxShadow: activeBtn === c.key ? `0 0 30px ${c.active}80` : "none",
              transform: activeBtn === c.key ? "scale(1.05)" : "scale(1)",
            }}
          />
        ))}
      </div>
      {phase === "idle" && (
        <div className="flex justify-center mt-2">
          <button onClick={startGame} className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-zinc-950 font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-3 rounded hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)] transition-all active:scale-95 cursor-pointer">Start Game</button>
        </div>
      )}
      {phase === "gameover" && (
        <div className="flex flex-col items-center gap-3 mt-2">
          <p className="text-xs text-zinc-400 font-mono">Final score: {score}</p>
          <button onClick={startGame} className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-zinc-950 font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-3 rounded hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)] transition-all active:scale-95 cursor-pointer"><RotateCcw className="w-3.5 h-3.5 inline mr-1" />Play Again</button>
        </div>
      )}
    </div>
  );
}

const TETRIS_COLS = 10;
const TETRIS_ROWS = 20;
const SHAPES: { shape: number[][]; color: string }[] = [
  { shape: [[1,1,1,1]], color: "#22c55e" },
  { shape: [[1,1],[1,1]], color: "#eab308" },
  { shape: [[0,1,0],[1,1,1]], color: "#a78bfa" },
  { shape: [[1,0,0],[1,1,1]], color: "#3b82f6" },
  { shape: [[0,0,1],[1,1,1]], color: "#f97316" },
  { shape: [[0,1,1],[1,1,0]], color: "#ef4444" },
  { shape: [[1,1,0],[0,1,1]], color: "#22d3ee" },
];

function TetrisGame({ onBack }: { onBack: () => void }) {
  const [board, setBoard] = useState<string[][]>(() => Array.from({ length: TETRIS_ROWS }, () => Array(TETRIS_COLS).fill("")));
  const [piece, setPiece] = useState<number[][]>([]);
  const [pieceX, setPieceX] = useState(0);
  const [pieceY, setPieceY] = useState(0);
  const [pieceColor, setPieceColor] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [paused, setPaused] = useState(false);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem("mr_tetris_highscore") || "0", 10));
  const pausedRef = useRef(false);
  const gameOverRef = useRef(false);
  const curPiece = useRef<number[][]>([]);
  const curX = useRef(0);
  const curY = useRef(0);
  const curColor = useRef("");
  const boardRef = useRef<string[][]>([]);
  const scoreRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const resetBoard = useCallback(() => {
    const b = Array.from({ length: TETRIS_ROWS }, () => Array(TETRIS_COLS).fill(""));
    boardRef.current = b;
    setBoard(b);
    setScore(0);
    scoreRef.current = 0;
    setGameOver(false);
    gameOverRef.current = false;
    setPaused(false);
    pausedRef.current = false;
  }, []);

  const collide = (b: string[][], shp: number[][], px: number, py: number): boolean => {
    for (let r = 0; r < shp.length; r++) {
      for (let c = 0; c < shp[r].length; c++) {
        if (!shp[r][c]) continue;
        const nx = px + c, ny = py + r;
        if (nx < 0 || nx >= TETRIS_COLS || ny >= TETRIS_ROWS) return true;
        if (ny < 0) continue;
        if (b[ny][nx]) return true;
      }
    }
    return false;
  };

  const lockPiece = useCallback(() => {
    const b = boardRef.current.map(row => [...row]);
    const shp = curPiece.current;
    for (let r = 0; r < shp.length; r++) {
      for (let c = 0; c < shp[r].length; c++) {
        if (!shp[r][c]) continue;
        const ny = curY.current + r;
        if (ny < 0) { gameOverRef.current = true; setGameOver(true); return; }
        b[ny][curX.current + c] = curColor.current;
      }
    }
    let cleared = 0;
    for (let r = TETRIS_ROWS - 1; r >= 0; r--) {
      if (b[r].every(cell => cell !== "")) {
        b.splice(r, 1);
        b.unshift(Array(TETRIS_COLS).fill(""));
        cleared++;
        r++;
      }
    }
    if (cleared > 0) {
      const pts = [0, 100, 300, 500, 800][cleared] || 800;
      scoreRef.current += pts;
      setScore(scoreRef.current);
      if (scoreRef.current > parseInt(localStorage.getItem("mr_tetris_highscore") || "0")) {
        localStorage.setItem("mr_tetris_highscore", scoreRef.current.toString());
        setHighScore(scoreRef.current);
      }
    }
    boardRef.current = b;
    setBoard(b);
    spawnPiece();
  }, []);

  const spawnPiece = useCallback(() => {
    const idx = Math.floor(Math.random() * SHAPES.length);
    const { shape, color } = SHAPES[idx];
    const startX = Math.floor((TETRIS_COLS - shape[0].length) / 2);
    if (collide(boardRef.current, shape, startX, -1)) {
      gameOverRef.current = true;
      setGameOver(true);
      return;
    }
    curPiece.current = shape;
    curX.current = startX;
    curY.current = -1;
    curColor.current = color;
    setPiece(shape.map(r => [...r]));
    setPieceX(startX);
    setPieceY(-1);
    setPieceColor(color);
  }, []);

  const drop = useCallback(() => {
    if (gameOverRef.current) return;
    if (!collide(boardRef.current, curPiece.current, curX.current, curY.current + 1)) {
      curY.current++;
      setPieceY(curY.current);
    } else {
      lockPiece();
    }
  }, [lockPiece]);

  const moveLeft = useCallback(() => {
    if (!collide(boardRef.current, curPiece.current, curX.current - 1, curY.current)) {
      curX.current--;
      setPieceX(curX.current);
    }
  }, []);

  const moveRight = useCallback(() => {
    if (!collide(boardRef.current, curPiece.current, curX.current + 1, curY.current)) {
      curX.current++;
      setPieceX(curX.current);
    }
  }, []);

  const rotate = useCallback(() => {
    const shp = curPiece.current;
    const rot = shp[0].map((_, c) => shp.map(row => row[c]).reverse());
    if (!collide(boardRef.current, rot, curX.current, curY.current)) {
      curPiece.current = rot;
      setPiece(rot.map(r => [...r]));
    }
  }, []);

  const hardDrop = useCallback(() => {
    if (gameOverRef.current) return;
    while (!collide(boardRef.current, curPiece.current, curX.current, curY.current + 1)) {
      curY.current++;
    }
    setPieceY(curY.current);
    lockPiece();
  }, [lockPiece]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || gameOverRef.current || pausedRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    const minSwipe = 20;
    if (Math.abs(dx) < minSwipe && Math.abs(dy) < minSwipe) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) moveRight();
      else moveLeft();
    } else {
      if (dy > 0) drop();
      else rotate();
    }
  };

  useEffect(() => {
    resetBoard();
    spawnPiece();
    const handleKey = (e: KeyboardEvent) => {
      if (gameOverRef.current) return;
      if (e.key === " " || e.key === "p" || e.key === "P") {
        setPaused(p => { pausedRef.current = !p; return !p; });
        return;
      }
      if (pausedRef.current) return;
      if (e.key === "ArrowLeft") moveLeft();
      if (e.key === "ArrowRight") moveRight();
      if (e.key === "ArrowUp") rotate();
      if (e.key === "ArrowDown") drop();
      if (e.key === " ") hardDrop();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [resetBoard, spawnPiece, drop, moveLeft, moveRight, rotate, hardDrop]);

  useEffect(() => {
    if (gameOver || paused) return;
    const interval = setInterval(() => {
      if (pausedRef.current || gameOverRef.current) return;
      drop();
    }, 400);
    return () => clearInterval(interval);
  }, [gameOver, paused, drop]);

  const displayBoard = board.map((row, r) => {
    const cells = [...row];
    const shp = piece;
    for (let pr = 0; pr < shp.length; pr++) {
      for (let pc = 0; pc < shp[pr].length; pc++) {
        if (shp[pr][pc] && pieceY + pr === r && pieceX + pc >= 0 && pieceX + pc < TETRIS_COLS) {
          cells[pieceX + pc] = pieceColor;
        }
      }
    }
    return cells;
  });

  return (
    <div className="w-full max-w-lg mx-auto px-4 flex flex-col gap-3 pb-16">
      <div className="flex items-center gap-3 pt-4">
        <button onClick={onBack} className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <span className="text-[var(--accent)] font-mono text-[10px] font-bold tracking-[0.25em] uppercase">Mindful Play</span>
          <h2 className="font-serif text-2xl font-normal text-white leading-tight">Tetris</h2>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
        <span>Score: <span className="text-white font-bold">{score}</span></span>
        <span>Best: <span className="text-[var(--accent)] font-bold">{highScore}</span></span>
        <button onClick={() => setPaused(p => { pausedRef.current = !p; return !p; })} className="text-zinc-500 hover:text-white transition-colors cursor-pointer px-2 py-1 rounded hover:bg-white/5 text-[10px] uppercase tracking-wider">{paused ? "Resume" : "Pause"}</button>
      </div>
      <div
        className="mx-auto border border-white/10 rounded-xl overflow-hidden select-none"
        style={{ width: "min(100%, 300px)", touchAction: "none" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {displayBoard.map((row, ri) => (
          <div key={ri} className="flex" style={{ height: `calc(min(100vw, 300px) / ${TETRIS_COLS})` }}>
            {row.map((cell, ci) => (
              <div key={ci} className="flex-1 border-[0.5px] border-white/[0.03]" style={{ backgroundColor: cell || "#0b0b0c" }} />
            ))}
          </div>
        ))}
      </div>
      <p className="text-center text-[10px] text-zinc-500 font-mono">Swipe or use buttons &middot; P: pause</p>
      {/* Mobile controls */}
      <div className="flex justify-center select-none">
        <div className="grid grid-cols-4 gap-2">
          <button
            onTouchStart={(e) => { e.preventDefault(); moveLeft(); }}
            onClick={() => moveLeft()}
            className="bg-white/[0.03] border border-white/10 rounded-xl w-14 h-14 flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white active:scale-95 transition-all cursor-pointer text-base"
            aria-label="Move Left"
          >◀</button>
          <button
            onTouchStart={(e) => { e.preventDefault(); moveRight(); }}
            onClick={() => moveRight()}
            className="bg-white/[0.03] border border-white/10 rounded-xl w-14 h-14 flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white active:scale-95 transition-all cursor-pointer text-base"
            aria-label="Move Right"
          >▶</button>
          <button
            onTouchStart={(e) => { e.preventDefault(); rotate(); }}
            onClick={() => rotate()}
            className="bg-white/[0.03] border border-white/10 rounded-xl w-14 h-14 flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white active:scale-95 transition-all cursor-pointer text-base"
            aria-label="Rotate"
          >↻</button>
          <button
            onTouchStart={(e) => { e.preventDefault(); drop(); }}
            onClick={() => drop()}
            className="bg-white/[0.03] border border-white/10 rounded-xl w-14 h-14 flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white active:scale-95 transition-all cursor-pointer text-base"
            aria-label="Drop"
          >▼</button>
        </div>
      </div>
      {gameOver && (
        <div className="flex flex-col items-center gap-3 mt-2">
          <p className="text-sm text-zinc-400 font-mono">Score: {score}</p>
          <button onClick={() => { resetBoard(); spawnPiece(); }} className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-zinc-950 font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-3 rounded hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)] transition-all active:scale-95 cursor-pointer"><RotateCcw className="w-3.5 h-3.5 inline mr-1" />Play Again</button>
        </div>
      )}
      {paused && !gameOver && <p className="text-center text-sm text-zinc-400 font-mono -mt-2">Paused</p>}
    </div>
  );
}

const WORDS: { word: string; clue: string }[] = [
  { word: "noodles", clue: "chopsticks" }, { word: "apple", clue: "orchard" }, { word: "brave", clue: "fearless" }, { word: "crane", clue: "construction" }, { word: "dream", clue: "pillow" },
  { word: "eager", clue: "keen" }, { word: "flame", clue: "matches" }, { word: "grace", clue: "ballet" }, { word: "heart", clue: "pump" }, { word: "image", clue: "camera" },
  { word: "joker", clue: "cards" }, { word: "knife", clue: "blade" }, { word: "lemon", clue: "sour" }, { word: "magic", clue: "wizard" }, { word: "noble", clue: "royal" },
  { word: "ocean", clue: "waves" }, { word: "piano", clue: "keys" }, { word: "queen", clue: "crown" }, { word: "river", clue: "stream" }, { word: "stone", clue: "pebble" },
  { word: "tiger", clue: "stripes" }, { word: "ultra", clue: "extreme" }, { word: "vivid", clue: "bright" }, { word: "whale", clue: "blowhole" }, { word: "bloom", clue: "petal" },
  { word: "crisp", clue: "fresh" }, { word: "dance", clue: "rhythm" }, { word: "ember", clue: "campfire" }, { word: "frost", clue: "winter" }, { word: "glide", clue: "smooth" },
  { word: "ivory", clue: "elephant" }, { word: "jolly", clue: "santa" }, { word: "kayak", clue: "paddle" }, { word: "latch", clue: "door" }, { word: "mirth", clue: "laughter" },
  { word: "night", clue: "moon" }, { word: "orbit", clue: "satellite" }, { word: "pearl", clue: "oyster" }, { word: "quest", clue: "adventure" }, { word: "radar", clue: "detect" },
  { word: "sugar", clue: "sweet" }, { word: "torch", clue: "flame" }, { word: "unity", clue: "together" }, { word: "vault", clue: "safe" }, { word: "waltz", clue: "vienna" },
  { word: "youth", clue: "young" }, { word: "amber", clue: "fossil" }, { word: "basil", clue: "pesto" }, { word: "coral", clue: "reef" }, { word: "daisy", clue: "flower" },
  { word: "elder", clue: "wise" }, { word: "feast", clue: "banquet" }, { word: "grain", clue: "wheat" }, { word: "haste", clue: "speed" }, { word: "index", clue: "finger" },
  { word: "jewel", clue: "gem" }, { word: "koala", clue: "eucalyptus" }, { word: "lunar", clue: "moon" }, { word: "maple", clue: "pancake" }, { word: "nectar", clue: "honey" },
  { word: "oasis", clue: "desert" }, { word: "pulse", clue: "heartbeat" }, { word: "realm", clue: "kingdom" }, { word: "savor", clue: "enjoy" }, { word: "treat", clue: "reward" },
  { word: "uncle", clue: "aunt" }, { word: "vocal", clue: "voice" }, { word: "weave", clue: "loom" }, { word: "abide", clue: "obey" }, { word: "blend", clue: "mix" },
  { word: "charm", clue: "bracelet" }, { word: "depth", clue: "deep" }, { word: "fleet", clue: "swift" }, { word: "gleam", clue: "shine" }, { word: "hobby", clue: "pastime" },
  { word: "icing", clue: "cake" }, { word: "jumbo", clue: "large" }, { word: "knead", clue: "dough" }, { word: "limit", clue: "boundary" }, { word: "moist", clue: "damp" },
  { word: "nerve", clue: "spine" }, { word: "onset", clue: "start" }, { word: "plumb", clue: "plumber" }, { word: "quote", clue: "citation" }, { word: "ridge", clue: "mountain" },
  { word: "shelf", clue: "bookcase" }, { word: "thyme", clue: "herb" }, { word: "usher", clue: "guide" }, { word: "vigor", clue: "energy" }, { word: "wrist", clue: "watch" },
  { word: "adore", clue: "worship" }, { word: "brisk", clue: "lively" }, { word: "clasp", clue: "brooch" }, { word: "ditch", clue: "trench" }, { word: "froth", clue: "foam" },
  { word: "giddy", clue: "dizzy" }, { word: "hitch", clue: "trailer" }, { word: "jumpy", clue: "nervous" }, { word: "knack", clue: "skill" }, { word: "lofty", clue: "tall" },
  { word: "mango", clue: "tropical" }, { word: "niche", clue: "corner" }, { word: "pouch", clue: "kangaroo" }, { word: "rinse", clue: "wash" }, { word: "scalp", clue: "hair" },
  { word: "tweak", clue: "adjust" }, { word: "vodka", clue: "russia" }, { word: "whiff", clue: "smell" }, { word: "aisle", clue: "corridor" }, { word: "badge", clue: "police" },
  { word: "cabin", clue: "log" }, { word: "dodge", clue: "avoid" }, { word: "fable", clue: "moral" }, { word: "gauge", clue: "measure" }, { word: "hatch", clue: "egg" },
  { word: "igloo", clue: "snow" }, { word: "kebab", clue: "skewer" }, { word: "leash", clue: "dog" }, { word: "midst", clue: "center" }, { word: "noisy", clue: "loud" },
  { word: "plead", clue: "beg" }, { word: "roast", clue: "oven" }, { word: "scent", clue: "perfume" }, { word: "trout", clue: "fishing" }, { word: "unfit", clue: "unhealthy" },
  { word: "viper", clue: "fangs" }, { word: "waist", clue: "belt" }, { word: "baker", clue: "bread" }, { word: "cider", clue: "apple" }, { word: "dough", clue: "flour" },
  { word: "elbow", clue: "arm" }, { word: "fiber", clue: "thread" }, { word: "gloss", clue: "lipstick" }, { word: "hover", clue: "drone" }, { word: "jazzy", clue: "music" },
  { word: "kiosk", clue: "mall" }, { word: "lodge", clue: "cabin" }, { word: "mocha", clue: "coffee" }, { word: "nanny", clue: "babysitter" }, { word: "olive", clue: "branch" },
  { word: "panda", clue: "bamboo" }, { word: "rover", clue: "mars" }, { word: "sushi", clue: "wasabi" }, { word: "tulip", clue: "holland" }, { word: "udder", clue: "cow" },
  { word: "vixen", clue: "fox" }, { word: "wider", clue: "broad" }, { word: "yummy", clue: "tasty" }, { word: "zesty", clue: "spicy" },
  { word: "capture", clue: "prison" }, { word: "bridge", clue: "river" }, { word: "dragon", clue: "fire" }, { word: "frozen", clue: "ice" }, { word: "garden", clue: "seeds" },
  { word: "humble", clue: "modest" }, { word: "island", clue: "shore" }, { word: "jungle", clue: "vines" }, { word: "kitten", clue: "whiskers" }, { word: "lantern", clue: "papyrus" },
  { word: "marble", clue: "statue" }, { word: "nobody", clue: "anonymous" }, { word: "oxygen", clue: "breathe" }, { word: "planet", clue: "saturn" }, { word: "quiver", clue: "arrow" },
  { word: "rocket", clue: "nasa" }, { word: "summer", clue: "beach" }, { word: "tunnel", clue: "train" }, { word: "unique", clue: "special" }, { word: "velvet", clue: "smooth" },
  { word: "winter", clue: "snowflake" }, { word: "bamboo", clue: "shoot" }, { word: "canvas", clue: "painting" }, { word: "desert", clue: "sand" }, { word: "empire", clue: "rome" },
  { word: "falcon", clue: "wings" }, { word: "goblet", clue: "wine" }, { word: "harvest", clue: "autumn" }, { word: "insect", clue: "antenna" }, { word: "jigsaw", clue: "puzzle" },
  { word: "kettle", clue: "whistles" }, { word: "lizard", clue: "sun" }, { word: "mellow", clue: "chill" }, { word: "napkin", clue: "table" }, { word: "orchid", clue: "petals" },
  { word: "puzzle", clue: "riddle" }, { word: "raven", clue: "crow" }, { word: "silver", clue: "spoon" }, { word: "throne", clue: "king" }, { word: "umbrella", clue: "rain" },
  { word: "vacuum", clue: "clean" }, { word: "wallet", clue: "money" }, { word: "yellow", clue: "banana" },
  { word: "ancient", clue: "pyramid" }, { word: "beyond", clue: "horizon" }, { word: "castle", clue: "knight" }, { word: "dazzle", clue: "sparkle" }, { word: "explore", clue: "discover" },
  { word: "fossil", clue: "dinosaur" }, { word: "gondola", clue: "venice" }, { word: "horizon", clue: "skyline" }, { word: "journey", clue: "compass" }, { word: "kitchen", clue: "counter" },
  { word: "liberty", clue: "statue" }, { word: "miracle", clue: "divine" }, { word: "notable", clue: "famous" }, { word: "outline", clue: "silhouette" }, { word: "palace", clue: "castle" },
  { word: "quarter", clue: "coin" }, { word: "respect", clue: "honor" }, { word: "shelter", clue: "roof" }, { word: "trouble", clue: "problem" }, { word: "vibrant", clue: "alive" },
  { word: "whisper", clue: "secret" }, { word: "brazil", clue: "samba" }, { word: "crystal", clue: "glass" }, { word: "destiny", clue: "fate" },
  { word: "fantasy", clue: "imagine" }, { word: "glimpse", clue: "peek" }, { word: "harmony", clue: "melody" }, { word: "initial", clue: "first" }, { word: "justice", clue: "scales" },
];

function GuessWordGame({ onBack }: { onBack: () => void }) {
  const [target, setTarget] = useState("");
  const [clue, setClue] = useState("");
  const [hintIndices, setHintIndices] = useState<number[]>([]);
  const [guess, setGuess] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem("mr_gw_highscore") || "0", 10); } catch { return 0; }
  });
  const [correctFlash, setCorrectFlash] = useState(false);
  const totalTime = 30;

  const vowelCount = target.replace(/[^aeiou]/gi, "").length;

  const nextWord = useCallback(() => {
    const entry = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTarget(entry.word);
    setClue(entry.clue);
    setHintIndices([Math.floor(Math.random() * entry.word.length)]);
    setGuess("");
  }, []);

  const startGame = useCallback(() => {
    nextWord();
    setTimeLeft(30);
    setGameOver(false);
    setScore(0);
    setCorrectFlash(false);
  }, [nextWord]);

  useEffect(() => { startGame(); }, [startGame]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setGameOver(true);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || target.length === 0) return;
    const currentHints = hintIndices.length;
    let needed = 0;
    if (timeLeft <= 20 && currentHints < 2) needed = 2;
    else if (timeLeft <= 10 && currentHints < 3) needed = 3;
    if (needed > currentHints) {
      const available = Array.from({ length: target.length }, (_, i) => i).filter(i => !hintIndices.includes(i));
      if (available.length > 0) {
        const pick = available[Math.floor(Math.random() * available.length)];
        setHintIndices([...hintIndices, pick]);
      }
    }
  }, [timeLeft, hintIndices, target, gameOver]);

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      try { localStorage.setItem("mr_gw_highscore", String(score)); } catch {}
    }
  }, [gameOver]);

  const submitGuess = () => {
    if (correctFlash) return;
    if (guess.trim().toLowerCase() === target.toLowerCase()) {
      const pts = Math.max(0, Math.min(10, Math.floor(timeLeft / 3)));
      setScore((s) => Math.min(10, s + pts));
      setTimeLeft(30);
      setCorrectFlash(true);
      setTimeout(() => { setCorrectFlash(false); nextWord(); }, 800);
    } else {
      setGuess("");
      setTimeLeft((prev) => {
        const next = prev - 5;
        if (next <= 0) {
          setGameOver(true);
          return 0;
        }
        return next;
      });
    }
  };

  const timerColor = timeLeft > 20 ? "var(--accent)" : timeLeft > 10 ? "#eab308" : "#ef4444";

  return (
    <div className="w-full max-w-lg mx-auto px-4 flex flex-col gap-5 pb-16">
      <div className="flex items-center gap-3 pt-4">
        <button onClick={onBack} className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <span className="text-[var(--accent)] font-mono text-[10px] font-bold tracking-[0.25em] uppercase">Mindful Play</span>
          <h2 className="font-serif text-2xl font-normal text-white leading-tight">Guess the Word</h2>
        </div>
      </div>

      {/* Timer bar */}
      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(timeLeft / totalTime) * 100}%`, backgroundColor: timerColor }} />
      </div>
      <div className="flex justify-between text-xs font-mono -mt-3">
        <span style={{ color: timerColor }}>{timeLeft}s</span>
        <span className="text-zinc-500">score: <span className="text-white font-bold">{score}</span><span className="text-zinc-700">/10</span> <span className="text-zinc-700">|</span> best: <span className="text-[var(--accent)] font-bold">{highScore}</span></span>
      </div>

      {/* Word boxes */}
      <div className="flex justify-center gap-2 flex-wrap">
        {target.split("").map((letter, i) => (
          <div key={i} className={`w-10 h-12 rounded-lg flex items-center justify-center text-lg font-bold font-sans uppercase transition-all tracking-wider ${
            hintIndices.includes(i) ? "bg-[var(--accent)]/15 border border-[var(--accent)]/40 text-[var(--accent)]" : "bg-transparent border border-white/10 text-zinc-600"
          }`}>
            {hintIndices.includes(i) ? letter : "?"}
          </div>
        ))}
      </div>

      {/* Clue + vowel hint */}
      {target && (
        <p className="text-center text-[10px] font-sans text-zinc-600 -mt-2 tracking-wider">
          clue: <span className="text-zinc-500 italic">{clue}</span>
          <span className="mx-2 text-zinc-700">|</span>
          <span className="font-mono">{vowelCount} vowel{vowelCount !== 1 ? "s" : ""}</span>
        </p>
      )}

      {/* Correct flash */}
      {correctFlash && (
        <div className="flex justify-center">
          <div className="bg-[var(--accent)]/15 border border-[var(--accent)]/40 rounded-lg px-6 py-2 text-sm font-sans text-[var(--accent)] animate-pulse">Correct!</div>
        </div>
      )}

      {/* Input */}
      {!gameOver && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2 justify-center">
            <input
              value={guess}
              onChange={(e) => setGuess(e.target.value.toUpperCase().slice(0, target.length))}
              onKeyDown={(e) => { if (e.key === "Enter") submitGuess(); }}
              placeholder="Type your guess..."
              maxLength={target.length}
              autoFocus
              className="bg-[#161618] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)]/50 w-44 font-sans uppercase tracking-wider"
            />
            <button
              onClick={submitGuess}
              disabled={guess.trim().length < 3}
              className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-zinc-950 font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-5 py-2 rounded hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)] transition-all active:scale-95 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Guess
            </button>
          </div>
        </div>
      )}

      {/* Result */}
      {gameOver && (
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="font-serif text-2xl text-white">Time's up!</p>
          {target && (
            <p className="font-sans text-base text-zinc-400">
              The word was: <span className="text-white font-bold uppercase tracking-wider">{target}</span>
            </p>
          )}
          <p className="font-serif text-5xl font-bold" style={{ color: timerColor }}>{score}<span className="text-2xl text-zinc-600">/10</span></p>
          {score >= highScore && score > 0 && <p className="text-[10px] text-[var(--accent)] font-mono tracking-wider">New best!</p>}
          <p className="text-xs text-zinc-500 font-mono">Best: <span className="text-white font-bold">{highScore}</span></p>
          <button onClick={startGame} className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-zinc-950 font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-3 rounded hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)] transition-all active:scale-95 cursor-pointer"><RotateCcw className="w-3.5 h-3.5 inline mr-1" />Play Again</button>
        </div>
      )}
    </div>
  );
}

export default function GamesView() {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  if (activeGame === "memory-match") {
    return <MemoryMatchGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === "flappy-leaf") {
    return <FlappyLeafGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === "mindful-snake") {
    return <SnakeGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === "tic-tac-toe") {
    return <TicTacToeGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === "simon-says") {
    return <SimonSaysGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === "tetris") {
    return <TetrisGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === "guess-word") {
    return <GuessWordGame onBack={() => setActiveGame(null)} />;
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 flex flex-col gap-6 pb-16">
      <section className="text-center space-y-2 select-none pt-4">
        <span className="text-[var(--accent)] font-mono text-xs font-bold tracking-[0.25em] uppercase">
          Mindful Play
        </span>
        <h2 className="font-serif text-3xl font-normal text-white leading-tight">
          Games
        </h2>
        <p className="font-sans text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
          Pick a game below to play
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4">
        {GAMES.map((game) => {
          const Icon = game.icon;
          return (
            <motion.button
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              whileTap={{ scale: 0.97 }}
              className="bg-[#161618]/60 border border-white/10 rounded-2xl p-5 flex items-center gap-4 text-left hover:bg-[#161618] hover:border-[var(--accent)]/30 transition-all cursor-pointer"
            >
              <div className="w-14 h-14 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-2xl shrink-0">
                {game.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-lg text-white font-normal">{game.title}</h3>
                <p className="font-sans text-xs text-zinc-400 mt-0.5">{game.description}</p>
              </div>
              <Icon className="w-5 h-5 text-zinc-500 shrink-0" style={{ color: game.color }} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
