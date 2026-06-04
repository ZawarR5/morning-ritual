export type TabId = "today" | "rituals" | "quiet" | "4kul" | "games";

export type MindsetCategory = "Vibrant" | "Steady" | "Serene";

export type MindsetId =
  | "calm"
  | "creative"
  | "confidence"
  | "focus"
  | "awakening"
  | "vitality";

export interface Mindset {
  id: MindsetId;
  title: string;
  description: string;
  icon: string;
  badge?: string;
  category: MindsetCategory;
}

export interface RitualItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  icon: string;
}

export interface WisdomItem {
  id: string;
  text: string;
  category: MindsetCategory;
  emoji: string;
  date: string;
  bookmarked: boolean;
}

export interface SettingsConfig {
  notificationHour: string;
  notificationMinute: string;
  notificationPeriod: "AM" | "PM";
  silentStart: boolean;
  weekendRhythm: boolean;
  journalNotes: string;
  manifestationPrompt: string;
}

export interface UserProfile {
  name: string;
  avatar: string; // base64 data URL or empty string
}

export interface ManifestationResponse {
  success: boolean;
  text: string;
  category: MindsetCategory;
  emoji: string;
}
