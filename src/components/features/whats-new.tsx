"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { CHANGELOG } from "@/data/changelog";

export function WhatsNew() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!CHANGELOG.length) return;
    const latest = CHANGELOG[0].version;
    const seen = localStorage.getItem("priismatv_seen_changelog");
    if (seen !== latest) {
      // Small delay so the page loads first
      setTimeout(() => setShow(true), 1500);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    if (CHANGELOG.length) {
      localStorage.setItem("priismatv_seen_changelog", CHANGELOG[0].version);
    }
  };

  if (!CHANGELOG.length) return null;
  const entry = CHANGELOG[0];

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-[101] inset-x-4 top-[10vh] lg:inset-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[480px] max-h-[80vh] overflow-hidden rounded-2xl bg-card border border-white/10 shadow-2xl"
          >
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">What&apos;s New</h2>
                  <p className="text-xs text-muted-foreground">{entry.title} &middot; {entry.date}</p>
                </div>
              </div>
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Changes */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <ul className="space-y-3">
                {entry.changes.map((change, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span className="text-primary mt-0.5 text-xs">&#9679;</span>
                    <span className="text-foreground/90">{change}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5">
              <button
                onClick={dismiss}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
