"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, RotateCcw, Disc3 } from "lucide-react";
import Link from "next/link";
import { ContentItem } from "@/data/content";

interface SpinWheelProps {
  items: ContentItem[];
}

export function SpinWheel({ items }: SpinWheelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<ContentItem | null>(null);
  const [rotation, setRotation] = useState(0);

  const spin = useCallback(() => {
    if (spinning || items.length === 0) return;
    setSpinning(true);
    setResult(null);

    const randomIndex = Math.floor(Math.random() * items.length);
    const newRotation = rotation + 1440 + Math.random() * 720;
    setRotation(newRotation);

    setTimeout(() => {
      setResult(items[randomIndex]);
      setSpinning(false);
    }, 3000);
  }, [spinning, items, rotation]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
        title="Spin the Wheel!"
      >
        <Disc3 className="w-6 h-6" />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 relative">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-center mb-6 flex items-center justify-center gap-2">
                  <Disc3 className="w-5 h-5 text-primary" />
                  Spin the Wheel
                </h2>

                {/* Wheel Visual */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-48 h-48">
                    <motion.div
                      animate={{ rotate: rotation }}
                      transition={{ duration: 3, ease: [0.25, 0.1, 0.25, 1] }}
                      className="w-full h-full rounded-full border-4 border-primary/30 bg-gradient-conic from-primary via-purple-600 via-pink-500 via-orange-400 via-yellow-400 via-green-400 via-cyan-400 to-primary flex items-center justify-center"
                      style={{
                        background: `conic-gradient(
                          from 0deg,
                          #00d4ff 0deg,
                          #7c3aed 51deg,
                          #ec4899 103deg,
                          #f97316 154deg,
                          #eab308 206deg,
                          #22c55e 257deg,
                          #06b6d4 309deg,
                          #00d4ff 360deg
                        )`,
                      }}
                    >
                      <div className="w-20 h-20 rounded-full bg-card border-2 border-border flex items-center justify-center">
                        <span className="text-xs font-bold text-center text-muted-foreground">
                          {spinning ? "..." : "SPIN"}
                        </span>
                      </div>
                    </motion.div>
                    {/* Pointer */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-primary" />
                  </div>
                </div>

                {/* Spin Button */}
                <div className="flex justify-center mb-4">
                  <button
                    onClick={spin}
                    disabled={spinning}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {spinning ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Spinning...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-4 h-4" />
                        {result ? "Spin Again" : "SPIN!"}
                      </>
                    )}
                  </button>
                </div>

                {/* Result */}
                <AnimatePresence>
                  {result && !spinning && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center p-4 rounded-xl bg-muted border border-primary/20"
                    >
                      <p className="text-xs text-muted-foreground mb-1">You got:</p>
                      <h3 className="text-lg font-bold text-primary mb-1">{result.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        {result.year} &middot; {result.genre} &middot; {result.type}
                      </p>
                      <Link
                        href={`/watch/${result.id}`}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
                      >
                        <Play className="w-4 h-4 fill-current" /> Watch This
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
