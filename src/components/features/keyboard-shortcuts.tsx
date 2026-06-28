"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X } from "lucide-react";

const SHORTCUTS = [
  { keys: ["Ctrl", "K"], action: "Open Spotlight Search" },
  { keys: ["Esc"], action: "Close modal / Go back" },
  { keys: ["?"], action: "Show keyboard shortcuts" },
  { keys: ["A"], action: "Type 'arise' for Easter egg" },
];

export function KeyboardShortcuts() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShow((s) => !s);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShow(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[90%] max-w-sm"
          >
            <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold flex items-center gap-2"><Keyboard className="w-4 h-4 text-primary" /> Keyboard Shortcuts</h3>
                <button onClick={() => setShow(false)} className="p-1 rounded hover:bg-muted"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                {SHORTCUTS.map((s) => (
                  <div key={s.action} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{s.action}</span>
                    <div className="flex items-center gap-1">
                      {s.keys.map((k) => (
                        <kbd key={k} className="px-2 py-0.5 text-[10px] font-mono bg-muted rounded border border-border">{k}</kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-4 text-center">Press ? to toggle this panel</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
