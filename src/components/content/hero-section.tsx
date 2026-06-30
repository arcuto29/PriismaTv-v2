"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Play, Info, Star, Clock, Bookmark, Volume2, VolumeX, ChevronRight } from "lucide-react";
import { ContentItem } from "@/data/content";

interface HeroSectionProps {
  items: ContentItem[];
  onWatchlist?: (id: string) => void;
}

export function HeroSection({ items, onWatchlist }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const featured = items.filter((i) => i.backdrop).slice(0, 5);
  const current = featured[currentIndex];

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 600], [1, 1.15]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (!current) return null;

  return (
    <section ref={heroRef} className="relative h-[90vh] lg:h-[95vh] w-full overflow-hidden -mt-16">
      {/* Parallax Background with Ken Burns effect */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            {current.backdrop && (
              <img
                src={current.backdrop}
                alt={current.title}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: "center 20%" }}
              />
            )}
            {/* Color grading overlay - cinematic warmth */}
            <div className="absolute inset-0 mix-blend-color" style={{ background: "rgba(20, 15, 8, 0.1)" }} />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Multi-layered cinematic gradients */}
      <div className="absolute inset-0 z-[2]">
        {/* Left story gradient - dramatic fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#06060a] via-[#06060a]/80 via-40% to-transparent" />
        {/* Bottom fade - seamless blend into content */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06060a] via-[#06060a]/40 via-30% to-transparent" />
        {/* Top subtle darkening */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#06060a]/50 via-transparent to-transparent" />
        {/* Cinematic vignette */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(6,6,10,0.7) 100%)"
        }} />
        {/* Warm ambient glow from bottom-left */}
        <div className="absolute bottom-0 left-0 w-[60%] h-[40%] bg-gradient-to-tr from-[rgba(232,180,104,0.03)] to-transparent" />
      </div>

      {/* Floating particles (subtle premium touch) */}
      <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 20, 0],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeInOut",
            }}
            className="absolute w-[2px] h-[2px] rounded-full bg-primary/60"
            style={{
              left: `${15 + i * 12}%`,
              top: `${50 + (i % 3) * 15}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-[4] h-full flex items-end pb-32 lg:pb-36 px-4 lg:px-16">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -30, filter: "blur(4px)" }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Category badge */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex items-center gap-3 mb-5"
              >
                <div className="h-[1px] w-10 bg-gradient-to-r from-primary/80 to-transparent" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary/90">
                  Featured
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-white/40 px-2.5 py-1 rounded-full border border-white/[0.06] bg-white/[0.03]">
                  {current.type === "tvshow" ? "Series" : current.type === "anime" ? "Anime" : "Film"}
                </span>
              </motion.div>

              {/* Title - Large cinematic typography */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-5 leading-[0.9] tracking-[-0.02em]">
                <span className="block text-white drop-shadow-[0_2px_30px_rgba(0,0,0,0.8)]">
                  {current.title}
                </span>
              </h1>

              {/* Meta Row - Refined with premium dividers */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/50 mb-5 font-medium">
                {current.rating && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">
                    <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                    <span className="text-white/90 font-semibold">{current.rating}</span>
                  </span>
                )}
                <span className="text-white/60">{current.year}</span>
                <span className="w-[3px] h-[3px] rounded-full bg-white/20" />
                <span className="capitalize">{current.genre}</span>
                {current.duration && (
                  <>
                    <span className="w-[3px] h-[3px] rounded-full bg-white/20" />
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-white/40" />{current.duration}
                    </span>
                  </>
                )}
                {current.seasons && (
                  <>
                    <span className="w-[3px] h-[3px] rounded-full bg-white/20" />
                    <span>{current.seasons} Season{current.seasons > 1 ? "s" : ""}</span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-[15px] md:text-base text-white/45 mb-8 line-clamp-2 lg:line-clamp-3 max-w-xl leading-relaxed font-light">
                {current.description}
              </p>

              {/* Action Buttons - Premium design */}
              <div className="flex items-center gap-3">
                <Link
                  href={`/watch/${current.id}`}
                  className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-black font-bold text-[15px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_40px_rgba(255,255,255,0.15)] hover:shadow-[0_12px_50px_rgba(255,255,255,0.25)]"
                >
                  <Play className="w-5 h-5 fill-black transition-transform duration-300 group-hover:scale-110" />
                  Play Now
                </Link>
                <Link
                  href={`/watch/${current.id}`}
                  className="group flex items-center gap-2.5 px-7 py-4 rounded-xl bg-white/[0.08] backdrop-blur-xl text-white font-semibold text-[15px] transition-all duration-300 border border-white/[0.08] hover:bg-white/[0.12] hover:border-white/[0.15]"
                >
                  <Info className="w-5 h-5 text-white/70 transition-transform duration-300 group-hover:scale-110" />
                  Details
                </Link>
                {onWatchlist && (
                  <button
                    onClick={() => onWatchlist(current.id)}
                    className="p-4 rounded-xl bg-white/[0.06] backdrop-blur-xl text-white/70 hover:text-white hover:bg-white/[0.1] transition-all duration-300 border border-white/[0.06] hover:border-white/[0.12] active:scale-95"
                  >
                    <Bookmark className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => setMuted(!muted)}
                  className="p-3.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white/70 hover:bg-white/[0.08] transition-all duration-300 ml-auto"
                >
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Bottom Progress Indicator - Minimal & Premium */}
      <div className="absolute bottom-8 left-0 right-0 z-[5] px-4 lg:px-16">
        <div className="flex items-end gap-4">
          {featured.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(i)}
              className="group flex-1 max-w-[140px]"
            >
              <div className={`h-[2px] rounded-full overflow-hidden transition-all duration-300 ${
                i === currentIndex ? "bg-white/20" : "bg-white/[0.06] hover:bg-white/10"
              }`}>
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80"
                  initial={{ width: "0%" }}
                  animate={{ width: i === currentIndex ? "100%" : i < currentIndex ? "100%" : "0%" }}
                  transition={{ duration: i === currentIndex ? 8 : 0.4, ease: "linear" }}
                />
              </div>
              <p className={`text-[10px] mt-2 truncate transition-all duration-300 ${
                i === currentIndex ? "text-white/60 font-medium" : "text-white/25 group-hover:text-white/40"
              }`}>
                {item.title}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
