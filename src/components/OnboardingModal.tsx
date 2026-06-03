import React, { useState, useRef } from "react";
import { Moon, Camera, Check, SkipForward } from "lucide-react";

interface OnboardingModalProps {
  onComplete: (name: string, avatar: string) => void;
}

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    onComplete(name.trim() || "Morning Seeker", avatar);
  };

  const handleSkip = () => {
    onComplete("Morning Seeker", "");
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#050505] flex items-center justify-center p-6">
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#D1FF26]/5 to-transparent pointer-events-none" />

      <div className="w-full max-w-md mx-auto text-center space-y-8 relative">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-[#D1FF26]/10 border border-[#D1FF26]/20 flex items-center justify-center">
            <Moon className="w-8 h-8 text-[#D1FF26]" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="font-serif text-3xl md:text-4xl font-light text-white tracking-tight">
            Welcome to Your Morning Ritual
          </h1>
          <p className="text-sm text-zinc-400 font-sans leading-relaxed max-w-sm mx-auto">
            Set your intention. The dawn awaits.
          </p>
        </div>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 hover:border-[#D1FF26]/40 transition-all cursor-pointer flex items-center justify-center overflow-hidden bg-zinc-900/50 group"
          >
            {avatar ? (
              <img src={avatar} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-8 h-8 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            )}
          </div>
          <p className="text-[10px] text-zinc-500 font-mono tracking-wider">
            Profile photo (optional)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Name Input */}
        <div className="space-y-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={30}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-center text-white text-lg font-serif placeholder-zinc-600 focus:outline-none focus:border-[#D1FF26]/50 transition-colors"
          />
          <p className="text-[10px] text-zinc-500 font-mono tracking-wider">
            What shall we call you?
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <button
            onClick={handleSubmit}
            className="w-full bg-[#D1FF26] text-[#0b0b0c] font-mono text-xs font-bold uppercase tracking-wider py-4 rounded-xl hover:shadow-[0_0_30px_rgba(209,255,38,0.3)] transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Begin Your Ritual
          </button>
          <button
            onClick={handleSkip}
            className="text-xs text-zinc-500 hover:text-zinc-300 font-mono tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5 mx-auto"
          >
            <SkipForward className="w-3.5 h-3.5" />
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
