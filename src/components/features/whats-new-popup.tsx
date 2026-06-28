"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Film, Sword, Tv } from "lucide-react";
import Link from "next/link";
import { useContentStore } from "@/hooks/use-content-store";

export function WhatsNewPopup() {
  const [show, setShow] = useState(false);
  const { content, isLoaded } = useContentStore();

  useEffect(() => {
    if (!isLoaded) return;
    // Only show once per day
    const lastShown = localStorage.getItem("priismatv_whatsnew_date");
    const today = new Date().toDateString();
    if (lastShown === today) return;

    // Show after 2 seconds
    const timer = setTimeout(() => {
      setShow(true);
      localStorage.setItem("priismatv_whatsnew_date", today);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  // Get content added in the last 30 days
  const recentlyAdded = content
    .filter((item) => {
      const added = new Date(item.dateAdded).getTime();
      return Date.now() - added < 30 * 24 * 60 * 60 * 1000;
    })
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 8);

  if (!show || recentlyAdded.length === 0) return null;

  const TypeIcon = ({ type }: { type: string }) => {
    if (type === "anime") return <Sword className="w-3 h-3 text-purple-400" />;
    if (type === "tvshow") return <Tv className="w-3 h-3 text-cyan-400" />;
    return <Film className="w-3 h-3 text-blue-400" />;
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShow(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[55] w-[90%] max-w-md"
          >
            <div className="bg-card/95 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-purple-500/5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-base">What&apos;s New</h3>
                </div>
                <button onClick={() => setShow(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Content list */}
              <div className="max-h-[350px] overflow-y-auto p-3">
                <p className="text-xs text-muted-foreground px-2 mb-3">Recently added to PriismaTv:</p>
                {recentlyAdded.map((item) => (
                  <Link
                    key={item.id}
                    href={`/watch/${item.id}`}
                    onClick={() => setShow(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    {item.poster ? (
                      <img src={item.poster} alt="" className="w-9 h-13 rounded-lg object-cover flex-shrink-0" style={{ height: "52px" }} />
                    ) : (
                      <div className="w-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0" style={{ height: "52px" }}>
                        <Film className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{item.title}</p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                        <TypeIcon type={item.type} />
                        <span>{item.year}</span>
                        <span className="capitalize">{item.genre}</span>
                        {item.rating && <span className="text-yellow-400">★ {item.rating}</span>}
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-green-500/20 text-green-400 uppercase flex-shrink-0">New</span>
                  </Link>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-border flex items-center justify-between">
                <p className="text-[10px] text-muted-foreground">{recentlyAdded.length} new titles this month</p>
                <button onClick={() => setShow(false)} className="text-xs text-primary font-medium hover:underline">
                  Got it
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
