"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Play, Info, Star, Clock, Bookmark, Volume2, VolumeX } from "lucide-react";
import { ContentItem } from "@/data/content";

interface HeroSectionProps {
  items: ContentItem[];
  onWatchlist?: (id: string) => void;
}

export function HeroSection({ items, onWatchlist }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const featured = items.filter((i) => i.backdrop).slice(0, 6);
  const current = featured[currentIndex];

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (!current) return null;

  return (
    <section ref={heroRef} className="relative h-[85vh] lg:h-[90vh] w-full overflow-hidden -mt-16">
      {/* Parallax Background */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            {current.backdrop && (
              <img
                src={current.backdrop}
                alt={current.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent z-[2]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40 z-[2]" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent z-[2]" />
      
      {/* Vignette */}
      <div className="absolute inset-0 z-[2]" style={{
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(10,10,15,0.8) 100%)"
      }} />

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-[3] h-full flex items-center px-4 lg:px-12">
        <div className="max-w-3xl pt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Logo/Badge Area */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="h-px w-8 bg-gradient-to-r from-primary to-transparent" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Featured
                </span>
                <div className="px-2 py-0.5 rounded bg-white/10 backdrop-blur-sm border border-white/10">
                  <span className="text-[10px] font-bold uppercase text-white/80">
                    {current.type === "tvshow" ? "Series" : current.type}
                  </span>
                </div>
              </motion.div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-[0.95] tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/60">
                  {current.title}
                </span>
              </h1>

              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/70 mb-5">
                {current.rating && (
                  <span className="flex items-center gap-1.5 text-yellow-400 font-bold text-base">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    {current.rating}
                  </span>
                )}
                <span className="font-medium">{current.year}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span className="capitalize font-medium">{current.genre}</span>
                {current.duration && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{current.duration}</span>
                  </>
                )}
                {current.seasons && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span>{current.seasons} Season{current.seasons > 1 ? "s" : ""}</span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-base md:text-lg text-white/60 mb-8 line-clamp-2 lg:line-clamp-3 max-w-xl leading-relaxed">
                {current.description}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <Link
                  href={`/watch/${current.id}`}
                  className="group flex items-center gap-2.5 px-8 py-4 rounded-lg bg-white text-black font-bold text-base hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-white/20"
                >
                  <Play className="w-5 h-5 fill-black transition-transform group-hover:scale-110" />
                  Play
                </Link>
                <Link
                  href={`/watch/${current.id}`}
                  className="group flex items-center gap-2.5 px-7 py-4 rounded-lg bg-white/10 backdrop-blur-md text-white font-semibold text-base hover:bg-white/20 transition-all border border-white/10 hover:border-white/20"
                >
                  <Info className="w-5 h-5 transition-transform group-hover:scale-110" />
                  More Info
                </Link>
                {onWatchlist && (
                  <button
                    onClick={() => onWatchlist(current.id)}
                    className="p-4 rounded-lg bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all border border-white/10 hover:border-white/20 hover:scale-105 active:scale-95"
                  >
                    <Bookmark className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => setMuted(!muted)}
                  className="p-4 rounded-full bg-white/5 border border-white/20 text-white/60 hover:text-white hover:bg-white/10 transition-all ml-auto"
                >
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Progress Bar at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-[4] px-4 lg:px-12 pb-6">
        <div className="flex items-center gap-3">
          {featured.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(i)}
              className="group flex-1 max-w-[120px]"
            >
              <div className="h-[3px] rounded-full bg-white/20 overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: i === currentIndex ? "100%" : i < currentIndex ? "100%" : "0%" }}
                  transition={{ duration: i === currentIndex ? 7 : 0.3, ease: "linear" }}
                />
              </div>
              <p className="text-[10px] text-white/40 mt-1.5 truncate group-hover:text-white/70 transition-colors">
                {item.title}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
