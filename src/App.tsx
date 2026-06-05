import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Header from "./components/Header";
import NavigationDrawer from "./components/NavigationDrawer";
import BottomNavBar, { TabId } from "./components/BottomNavBar";
import TodayView from "./components/TodayView";
import PrayerTrackerView from "./components/RitualsView";
import BreathworkSession from "./components/BreathworkSession";
import NotificationToast from "./components/NotificationToast";
import QuietMindView from "./components/QuietMindView";

import {
  DEFAULT_MINDSETS,
  DEFAULT_RITUALS,
  DEFAULT_SETTINGS,
} from "./data";
import FourQulView from "./components/FourQulView";
import GamesView from "./components/GamesView";
import QuranView from "./components/QuranView";
import HadithView from "./components/HadithView";
import { MindsetId, RitualItem, SettingsConfig, UserProfile } from "./types";
import OnboardingModal from "./components/OnboardingModal";
import { getMood } from "./themes";
import { getQuoteForMindset } from "./quotes";

function StarField() {
  const stars = useMemo(() => {
    const result: { left: number; top: number; size: number; delay: number; duration: number; baseOpacity: number }[] = [];
    for (let i = 0; i < 60; i++) {
      result.push({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 3,
        baseOpacity: Math.random() * 0.2 + 0.08,
      });
    }
    return result;
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
            animation: `star-pulse ${s.duration}s ${s.delay}s infinite alternate ease-in-out`,
          }}
        />
      ))}
      <style>{`
        @keyframes star-pulse {
          0% { opacity: 0.05; }
          100% { opacity: 0.25; }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  // Navigation states
  const [activeTab, setActiveTab] = useState<TabId>("today");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isBreathworkActive, setIsBreathworkActive] = useState(false);
  const [showQuran, setShowQuran] = useState(false);
  const [showHadith, setShowHadith] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const previousTab = useRef<TabId>("today");

  // Android / mobile back button handler
  useEffect(() => {
    // Push a history entry so popstate can be intercepted
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      // Re-push immediately so we can intercept again
      window.history.pushState(null, "", window.location.href);

      if (isDrawerOpen) { setIsDrawerOpen(false); return; }
      if (showQuran) { setShowQuran(false); return; }
      if (showHadith) { setShowHadith(false); return; }
      if (isBreathworkActive) { setIsBreathworkActive(false); return; }
      if (activeTab !== "today") { setActiveTab("today"); return; }
      setShowExitConfirm(true);
    };

    window.addEventListener("popstate", handlePopState);

    const capacitor = (window as any).Capacitor;
    if (capacitor?.isNativePlatform()) {
      capacitor.Plugins?.App?.removeAllListeners("backButton");
      capacitor.Plugins?.App?.addListener("backButton", () => {
        if (isDrawerOpen) { setIsDrawerOpen(false); return; }
        if (showQuran) { setShowQuran(false); return; }
        if (showHadith) { setShowHadith(false); return; }
        if (isBreathworkActive) { setIsBreathworkActive(false); return; }
        if (activeTab !== "today") { setActiveTab("today"); return; }
        setShowExitConfirm(true);
      });
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isDrawerOpen, showQuran, showHadith, isBreathworkActive, activeTab]);

  // Track previous tab for back navigation
  useEffect(() => {
    previousTab.current = activeTab;
  }, [activeTab]);

  // Core application states loaded from LocalStorage or fallback data
  const [mindsets, setMindsets] = useState(() => {
    const saved = localStorage.getItem("mr_mindsets");
    return saved ? JSON.parse(saved) : DEFAULT_MINDSETS;
  });

  const [activeMindsetId, setActiveMindsetId] = useState<MindsetId>(() => {
    const saved = localStorage.getItem("mr_active_mindset_id");
    return (saved as MindsetId) || "calm";
  });

  const [rituals, setRituals] = useState<RitualItem[]>(() => {
    const saved = localStorage.getItem("mr_rituals");
    return saved ? JSON.parse(saved) : DEFAULT_RITUALS;
  });

  const [settings, setSettings] = useState<SettingsConfig>(() => {
    const saved = localStorage.getItem("mr_settings");
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Hot-loaded Hero Quote — fresh each time the app opens
  const [activeQuote, setActiveQuote] = useState(() => {
    const savedMindsetId = (localStorage.getItem("mr_active_mindset_id") || "calm") as MindsetId;
    const savedMindsets = localStorage.getItem("mr_mindsets");
    const mindsets = savedMindsets ? JSON.parse(savedMindsets) : DEFAULT_MINDSETS;
    const activeMindset = mindsets.find((m: any) => m.id === savedMindsetId) || mindsets[0];
    return getQuoteForMindset(activeMindset?.title);
  });

  const [streakDays, setStreakDays] = useState(() => {
    const saved = localStorage.getItem("mr_streak_days");
    return saved ? parseInt(saved, 10) : 5; // Start with 5 days as default
  });

  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("mr_profile");
    return saved ? JSON.parse(saved) : null;
  });

  const [mood, setMood] = useState<string>(() => {
    return localStorage.getItem("mr_mood") || "peaceful";
  });

  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const alarmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    localStorage.setItem("mr_mood", mood);
    const theme = getMood(mood);
    const root = document.documentElement;
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--accent-rgb", theme.accentRgb);
    root.style.setProperty("--accent-hover", theme.hoverBg);
  }, [mood]);

  // Request notification permission and check time every 30s
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const sendBrowserNotification = useCallback((text: string, emoji: string) => {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    new Notification("☀️ Good Morning", {
      body: `${emoji}  ${text.slice(0, 100)}`,
      icon: "/favicon.png",
      silent: true,
    });
  }, []);

  // Unlock audio playback on first user tap (required by browser autoplay policy)
  useEffect(() => {
    const unlock = () => {
      if (!alarmRef.current) {
        alarmRef.current = new Audio("/alarm-sound.mp3");
      }
      alarmRef.current.load();
      document.removeEventListener("pointerdown", unlock);
    };
    document.addEventListener("pointerdown", unlock, { once: true });
  }, []);

  const playAlarm = useCallback(() => {
    const audio = alarmRef.current || new Audio("/alarm-sound.mp3");
    audio.currentTime = 0;
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }, []);

  useEffect(() => {
    const todayKey = new Date().toDateString();
    const sentKey = "mr_notification_sent";

    const checkTime = () => {
      const now = new Date();
      let hour = parseInt(settings.notificationHour, 10);
      const minute = parseInt(settings.notificationMinute, 10);
      if (settings.notificationPeriod === "PM" && hour !== 12) hour += 12;
      if (settings.notificationPeriod === "AM" && hour === 12) hour = 0;

      if (now.getHours() === hour && now.getMinutes() === minute) {
        const lastSent = localStorage.getItem(sentKey);
        if (lastSent !== todayKey) {
          localStorage.setItem(sentKey, todayKey);
          sendBrowserNotification(activeQuote.text, activeQuote.emoji);
          setShowToast(true);
          playAlarm();
        }
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 30000);
    return () => clearInterval(interval);
  }, [settings.notificationHour, settings.notificationMinute, settings.notificationPeriod, activeQuote, sendBrowserNotification, playAlarm]);

  // Sync state changes with persistence
  useEffect(() => {
    localStorage.setItem("mr_mindsets", JSON.stringify(mindsets));
  }, [mindsets]);

  useEffect(() => {
    localStorage.setItem("mr_active_mindset_id", activeMindsetId);
  }, [activeMindsetId]);

  useEffect(() => {
    localStorage.setItem("mr_rituals", JSON.stringify(rituals));
  }, [rituals]);

  useEffect(() => {
    localStorage.setItem("mr_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("mr_active_quote_text", activeQuote.text);
    localStorage.setItem("mr_active_quote_category", activeQuote.category);
    localStorage.setItem("mr_active_quote_emoji", activeQuote.emoji);
  }, [activeQuote]);

  useEffect(() => {
    localStorage.setItem("mr_streak_days", streakDays.toString());
  }, [streakDays]);

  useEffect(() => {
    if (profile) {
      localStorage.setItem("mr_profile", JSON.stringify(profile));
    }
  }, [profile]);

  // Handler functions
  const handleToggleRitual = (id: string) => {
    const updated = rituals.map((r) => {
      if (r.id === id) {
        return { ...r, completed: !r.completed };
      }
      return r;
    });
    setRituals(updated);
  };

  const handleAddRitual = (title: string, icon: string) => {
    const newRitual: RitualItem = {
      id: `custom-${Date.now()}`,
      title,
      description: "",
      duration: "",
      completed: false,
      icon,
    };
    setRituals((prev) => [...prev, newRitual]);
  };

  const handleDeleteRitual = (id: string) => {
    setRituals((prev) => prev.filter((r) => r.id !== id));
  };

  const handleCompleteBreathwork = () => {
    // Setting breathwork completed launches progress count updates
    const updated = rituals.map((r) => {
      if (r.id === "breathwork") {
        return { ...r, completed: true };
      }
      return r;
    });
    setRituals(updated);
  };

  const FALLBACK_QUOTES = [
    { text: "The sun rises not just for the world, but for the greatness within you.", category: "Vibrant", emoji: "✨" },
    { text: "Your thoughts are seeds. Plant them with care in the fertile soil of the morning.", category: "Serene", emoji: "🌌" },
    { text: "True power is found in the stillness before the storm. Be the calm center.", category: "Steady", emoji: "⚖️" },
    { text: "The way we start our day determines the quality of our life. Intentionality is the compass of the soul.", category: "Vibrant", emoji: "🌅" },
    { text: "Consistency is the silent engine of greatness.", category: "Steady", emoji: "🏔️" },
    { text: "Nature does not hurry, yet everything is accomplished.", category: "Serene", emoji: "🌿" }
  ];

  const handleGenerateAIManifestation = async () => {
    setIsAIGenerating(true);
    const activeMindset = mindsets.find((m) => m.id === activeMindsetId) || mindsets[0];
    
    try {
      const response = await fetch("/api/manifestation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: settings.manifestationPrompt || "",
          mindset: activeMindset.title,
        }),
      });

      const data = await response.json();
      if (data && data.success) {
        setActiveQuote({
          text: data.text,
          category: data.category,
          emoji: data.emoji,
        });
      }
    } catch (e) {
      const pick = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
      setActiveQuote({ text: pick.text, category: pick.category, emoji: pick.emoji });
    } finally {
      setIsAIGenerating(false);
    }
  };

  const handleUpdateSettings = (updated: Partial<SettingsConfig>) => {
    setSettings((prev) => ({ ...prev, ...updated }));
  };

  const handleIncrementStreak = () => {
    setStreakDays((prev) => prev + 1);
  };

  const handleDecrementStreak = () => {
    setStreakDays((prev) => Math.max(0, prev - 1));
  };

  // Find info about selected active mindset
  const activeMindset = mindsets.find((m) => m.id === activeMindsetId) || mindsets[0];

  const handleProfileComplete = (name: string, avatar: string) => {
    const profileData = { name, avatar };
    setProfile(profileData);
    localStorage.setItem("mr_profile", JSON.stringify(profileData));
  };

  return (
    <>
      {!profile && (
        <OnboardingModal onComplete={handleProfileComplete} />
      )}
      <div className="min-h-screen bg-[#050505] text-[#e5e2e1] pb-32">
      {/* Night sky stars background */}
      <StarField />

      {/* Decorative ambient gold sky glow simulated inside margins */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-[#f2ca50]/[0.02] rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Main Header bar */}
      <Header onToggleDrawer={() => setIsDrawerOpen(true)} profile={profile} />

      {/* Slide Navigation Menu Drawer overlay */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        profile={profile}
        onUpdateProfile={setProfile}
        streakDays={streakDays}
        onIncrementStreak={handleIncrementStreak}
        onDecrementStreak={handleDecrementStreak}
        mood={mood}
        onMoodChange={setMood}
        onOpenQuran={() => setShowQuran(true)}
        onOpenHadith={() => setShowHadith(true)}
      />

      {/* Morning notification toast */}
      <NotificationToast
        show={showToast}
        quoteText={activeQuote.text}
        quoteEmoji={activeQuote.emoji}
        onClose={() => setShowToast(false)}
      />

      {/* Immersive breathe meditation player stage */}
      {isBreathworkActive && (
        <BreathworkSession
          onClose={() => setIsBreathworkActive(false)}
          onComplete={handleCompleteBreathwork}
          mindsetName={activeMindset.title}
        />
      )}

      {/* Primary views section switcher */}
      <main className="pt-24 px-4 max-w-7xl mx-auto">
        {activeTab === "today" && (
          <TodayView
            quoteText={activeQuote.text}
            quoteEmoji={activeQuote.emoji}
            quoteCategory={activeQuote.category}
            rituals={rituals}
            onToggleRitual={handleToggleRitual}
            onAddRitual={handleAddRitual}
            onDeleteRitual={handleDeleteRitual}
            onStartBreathwork={() => setIsBreathworkActive(true)}
          />
        )}

        {activeTab === "rituals" && (
          <PrayerTrackerView />
        )}

        {activeTab === "quiet" && (
          <QuietMindView />
        )}

        {activeTab === "4kul" && (
          <FourQulView onFinish={() => setActiveTab("today")} />
        )}

        {activeTab === "games" && <GamesView />}
      </main>

      {showQuran && <QuranView onClose={() => setShowQuran(false)} />}
      {showHadith && <HadithView onClose={() => setShowHadith(false)} />}

      {/* Exit confirmation dialog for Android back on home screen */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-zinc-100 mb-2">Exit App?</h3>
            <p className="text-sm text-zinc-400 mb-6">Are you sure you want to close Morning Ritual?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-5 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  window.history.back();
                }}
                className="px-5 py-2 rounded-xl bg-[var(--accent)] text-black text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating WhatsApp support button */}
      <a
        href="https://wa.me/923119943699"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-5 z-50 hover:scale-110 transition-all"
      >
        <img src="/whatsapp-logo.png" alt="WhatsApp" className="w-14 h-14" />
      </a>

      {/* Persistent Bottom navigation menu bar */}
      <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
    </>
  );
}
