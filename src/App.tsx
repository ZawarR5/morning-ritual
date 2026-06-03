import React, { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import NavigationDrawer from "./components/NavigationDrawer";
import BottomNavBar, { TabId } from "./components/BottomNavBar";
import TodayView from "./components/TodayView";
import RitualsView from "./components/RitualsView";
import BreathworkSession from "./components/BreathworkSession";
import NotificationToast from "./components/NotificationToast";
import QuietMindView from "./components/QuietMindView";

import {
  DEFAULT_MINDSETS,
  DEFAULT_RITUALS,
  DEFAULT_SETTINGS,
} from "./data";
import FourQulView from "./components/FourQulView";
import { MindsetId, RitualItem, SettingsConfig, UserProfile } from "./types";
import OnboardingModal from "./components/OnboardingModal";
import { getMood } from "./themes";

export default function App() {
  // Navigation states
  const [activeTab, setActiveTab] = useState<TabId>("today");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isBreathworkActive, setIsBreathworkActive] = useState(false);

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

  // Hot-loaded Hero Quote (curated locally or by AI model)
  const [activeQuote, setActiveQuote] = useState(() => {
    const savedText = localStorage.getItem("mr_active_quote_text");
    const savedCategory = localStorage.getItem("mr_active_quote_category") || "Serene";
    const savedEmoji = localStorage.getItem("mr_active_quote_emoji") || "✨";
    return {
      text: savedText || "The sun rises not just for the world, but for the greatness within you.",
      category: savedCategory,
      emoji: savedEmoji,
    };
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
        }
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 30000);
    return () => clearInterval(interval);
  }, [settings.notificationHour, settings.notificationMinute, settings.notificationPeriod, activeQuote, sendBrowserNotification]);

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

  // Find info about selected active mindset
  const activeMindset = mindsets.find((m) => m.id === activeMindsetId) || mindsets[0];

  const handleProfileComplete = (name: string, avatar: string) => {
    setProfile({ name, avatar });
  };

  return (
    <>
      {!profile && (
        <OnboardingModal onComplete={handleProfileComplete} />
      )}
      <div className="min-h-screen bg-[#050505] text-[#e5e2e1] pb-32">
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
        mood={mood}
        onMoodChange={setMood}
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
            onStartBreathwork={() => setIsBreathworkActive(true)}
          />
        )}

        {activeTab === "rituals" && (
          <RitualsView
            config={settings}
            onUpdateConfig={handleUpdateSettings}
            onGenerateAIPrompt={handleGenerateAIManifestation}
            isGenerating={isAIGenerating}
            activeMindsetName={activeMindset.title}
          />
        )}

        {activeTab === "quiet" && (
          <QuietMindView />
        )}

        {activeTab === "4kul" && (
          <FourQulView onFinish={() => setActiveTab("today")} />
        )}
      </main>

      {/* Persistent Bottom navigation menu bar */}
      <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
    </>
  );
}
