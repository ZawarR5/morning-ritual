import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sun, Bell } from "lucide-react";

interface NotificationToastProps {
  show: boolean;
  quoteText: string;
  quoteEmoji: string;
  onClose: () => void;
}

export default function NotificationToast({
  show,
  quoteText,
  quoteEmoji,
  onClose,
}: NotificationToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 10000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 260 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-md"
        >
          <div className="bg-[#161618] border border-[var(--accent)]/20 rounded-2xl p-5 shadow-[0_0_40px_rgba(var(--accent-rgb),0.1)] backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center shrink-0 border border-[var(--accent)]/20">
                <span className="text-2xl">{quoteEmoji}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Sun className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent)] font-bold">
                    Good Morning
                  </span>
                </div>
                <p className="font-serif text-sm text-zinc-100 leading-relaxed">
                  "{quoteText}"
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-1 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]/5">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 10, ease: "linear" }}
                className="h-full bg-[var(--accent)]/30"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
