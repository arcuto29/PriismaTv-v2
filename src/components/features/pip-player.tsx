"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Minimize2 } from "lucide-react";

export function PipPlayer() {
  const [pipUrl, setPipUrl] = useState<string | null>(null);
  const [pipTitle, setPipTitle] = useState("");
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      setPipUrl(e.detail.url);
      setPipTitle(e.detail.title || "Now Playing");
      setMinimized(false);
    };
    window.addEventListener("priismatv-pip" as string, handler as EventListener);
    return () => window.removeEventListener("priismatv-pip" as string, handler as EventListener);
  }, []);

  if (!pipUrl) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.8 }}
        drag
        dragMomentum={false}
        className={`fixed z-[45] shadow-2xl shadow-black/50 rounded-xl overflow-hidden border border-white/10 ${
          minimized ? "bottom-6 right-6 w-72 h-44" : "bottom-6 right-6 w-96 h-56"
        }`}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-3 py-2 bg-gradient-to-b from-black/80 to-transparent">
          <span className="text-[10px] font-medium text-white/80 truncate max-w-[60%]">{pipTitle}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setMinimized(!minimized)} className="p-1 rounded hover:bg-white/20 text-white/70">
              {minimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            </button>
            <button onClick={() => setPipUrl(null)} className="p-1 rounded hover:bg-white/20 text-white/70">
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
        <iframe
          src={pipUrl}
          className="w-full h-full border-0 bg-black"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </motion.div>
    </AnimatePresence>
  );
}
