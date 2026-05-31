import { Mindset, RitualItem, WisdomItem, SettingsConfig } from "./types";

export const DEFAULT_MINDSETS: Mindset[] = [
  {
    id: "calm",
    title: "Deep Calm",
    description: "Lower cortisol levels and find your center through rhythmic breathing and expansive silence.",
    icon: "Droplets",
    badge: "Selected",
    category: "Serene"
  },
  {
    id: "creative",
    title: "Creative Fire",
    description: "Ignite divergent thinking and unlock high-velocity ideation.",
    icon: "Sparkles",
    category: "Vibrant"
  },
  {
    id: "confidence",
    title: "Unstoppable Confidence",
    description: "Step into your power with assertive visualization and power-posing cues designed for high-stakes performance.",
    icon: "Zap",
    category: "Vibrant"
  },
  {
    id: "focus",
    title: "Zen Focus",
    description: "Pure cognitive clarity. Streamline thought, narrow attention, and eliminate modern clutter.",
    icon: "Target",
    category: "Steady"
  },
  {
    id: "awakening",
    title: "Gentle Awakening",
    description: "Soft transition from dark to light. A progressive stimulation of physical senses.",
    icon: "Sun",
    category: "Serene"
  },
  {
    id: "vitality",
    title: "Vitality Rush",
    description: "High-intensity morning energy to boost circulation, metabolism, and physical grit.",
    icon: "Activity",
    category: "Vibrant"
  }
];

export const DEFAULT_RITUALS: RitualItem[] = [
  {
    id: "breathwork",
    title: "Deep Breathwork",
    description: "A 10-minute session to center your awareness and expand your potential.",
    duration: "10 mins",
    completed: true,
    icon: "Wind"
  },
  {
    id: "journaling",
    title: "Sunrise Reflections",
    description: "Express your current focus, daily gratitude, and mental obstacles.",
    duration: "5 mins",
    completed: true,
    icon: "PenTool"
  },
  {
    id: "hydration",
    title: "Sacred Hydration",
    description: "Rehydrate with pure water and lemon to activate digestion and mental physical vigor.",
    duration: "2 mins",
    completed: true,
    icon: "CupSoda"
  },
  {
    id: "movement",
    title: "Solar Stretching",
    description: "Gentle, fluid yoga asanas to re-align physical posture and blood flow.",
    duration: "10 mins",
    completed: false, // 3 of 4 completed initially
    icon: "FlameKindling"
  }
];

export const DEFAULT_WISDOM: WisdomItem[] = [
  {
    id: "wisdom-1",
    text: "The way we start our day determines the quality of our life. Intentionality is the compass of the soul.",
    category: "Vibrant",
    emoji: "🌅",
    date: "October 14, 2023",
    bookmarked: true
  },
  {
    id: "wisdom-2",
    text: "True power is found in the stillness before the storm. Be the calm center.",
    category: "Steady",
    emoji: "⚖️",
    date: "October 13, 2023",
    bookmarked: false
  },
  {
    id: "wisdom-3",
    text: "Your thoughts are seeds. Plant them with care in the fertile soil of the morning.",
    category: "Serene",
    emoji: "🌌",
    date: "October 12, 2023",
    bookmarked: false
  },
  {
    id: "wisdom-4",
    text: "Discipline is the bridge between goals and accomplishment. Build it brick by brick.",
    category: "Vibrant",
    emoji: "🔥",
    date: "October 11, 2023",
    bookmarked: false
  },
  {
    id: "wisdom-5",
    text: "Nature does not hurry, yet everything is accomplished.",
    category: "Serene",
    emoji: "🏔️", // matches screen image description
    date: "October 10, 2023",
    bookmarked: true
  },
  {
    id: "wisdom-6",
    text: "Consistency is the silent engine of greatness.",
    category: "Steady",
    emoji: "🏔️",
    date: "October 09, 2023",
    bookmarked: false
  }
];

export const DEFAULT_SETTINGS: SettingsConfig = {
  notificationHour: "06",
  notificationMinute: "30",
  notificationPeriod: "AM",
  silentStart: true,
  weekendRhythm: false,
  journalNotes: "",
  manifestationPrompt: "Serenity, Focus, Daily Grit, Gratitude"
};
