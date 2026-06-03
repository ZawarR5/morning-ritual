export interface Mood {
  id: string;
  label: string;
  emoji: string;
  accent: string;
  accentRgb: string;
  hoverBg: string;
  gradient: string;
}

export const moods: Mood[] = [
  {
    id: "peaceful",
    label: "Peaceful",
    emoji: "🕊️",
    accent: "#D1FF26",
    accentRgb: "209, 255, 38",
    hoverBg: "#e2ff60",
    gradient: "from-[#D1FF26]/5 to-transparent",
  },
  {
    id: "energetic",
    label: "Energetic",
    emoji: "⚡",
    accent: "#FF8C42",
    accentRgb: "255, 140, 66",
    hoverBg: "#ffa766",
    gradient: "from-[#FF8C42]/5 to-transparent",
  },
  {
    id: "calm",
    label: "Calm",
    emoji: "🌊",
    accent: "#60A5FA",
    accentRgb: "96, 165, 250",
    hoverBg: "#93c5fd",
    gradient: "from-[#60A5FA]/5 to-transparent",
  },
  {
    id: "passionate",
    label: "Passionate",
    emoji: "❤️",
    accent: "#F472B6",
    accentRgb: "244, 114, 182",
    hoverBg: "#f9a8d4",
    gradient: "from-[#F472B6]/5 to-transparent",
  },
  {
    id: "focused",
    label: "Focused",
    emoji: "🎯",
    accent: "#A78BFA",
    accentRgb: "167, 139, 250",
    hoverBg: "#c4b5fd",
    gradient: "from-[#A78BFA]/5 to-transparent",
  },
  {
    id: "grateful",
    label: "Grateful",
    emoji: "🙏",
    accent: "#FBBF24",
    accentRgb: "251, 191, 36",
    hoverBg: "#fcd34d",
    gradient: "from-[#FBBF24]/5 to-transparent",
  },
];

export function getMood(id: string): Mood {
  return moods.find((m) => m.id === id) || moods[0];
}
