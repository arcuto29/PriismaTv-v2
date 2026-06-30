"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Play, Info, Star, Clock, Bookmark, Volume2, VolumeX, Tv } from "lucide-react";
import { ContentItem } from "@/data/content";

interface HeroSectionProps {
  items: ContentItem[];
  onWatchlist?: (id: string) => void;
}

export function HeroSection({ items, onWatchlist }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerReady, setTrailerReady] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const featured = items.filter((i) => i.backdrop).slice(0, 6);
  const current = featured[currentIndex];

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 250]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale = useTransform(scrollY, [0, 700], [1, 1.2]);
  const blur = useTransform(scrollY, [0, 500], [0, 8]);

  // Auto-cycle with trailer support
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
      setShowTrailer(false);
      setTrailerReady(false);
    }, 10000);
  }, [featured.length]);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  // Show trailer after backdrop has been showing for 3s
  useEffect(() => {
    if (!current?.trailer) return;
    setTrailerReady(false);
    const timeout = setTimeout(() => {
      setShowTrailer(true);
      setTimeout(() => setTrailerReady(true), 500);
    }, 3500);
    return () => clearTimeout(timeout);
  }, [currentIndex, current?.trailer]);

  const goTo = (i: number) => {
    setCurrentIndex(i);
    setShowTrailer(false);
    setTrailerReady(false);
    startTimer();
  };

  if (!current) return null;

  return (
    <section ref={heroRef} className="relative h-[100vh] w-full overflow-hidden">
      {/* === PARALLAX BACKGROUND === */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id + "-bg"}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
          >
            {/* Backdrop Image */}
            <img
              src={current.backdrop!}
              alt={current.title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "center 20%" }}
            />

            {/* Trailer Overlay - auto-plays after image shows */}
            {showTrailer && current.trailer && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: trailerReady ? 1 : 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 z-[1]"
              >
                <iframe
                  src={`https://www.youtube.com/embed/${current.trailer}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&showinfo=0&rel=0&loop=1&playlist=${current.trailer}&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0`}
                  className="absolute inset-0 w-[120%] h-[120%] -top-[10%] -left-[10%] border-0 pointer-events-none"
                  allow="autoplay; encrypted-media"
                  style={{ objectFit: "cover" }}
                />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* === CINEMATIC OVERLAYS === */}
      <motion.div style={{ opacity: useTransform(scrollY, [0, 300], [1, 0.5]) }} className="absolute inset-0 z-[2]">
        {/* Left narrative gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#04040a] via-[#04040a]/70 via-35% to-transparent" />
        {/* Bottom seamless blend */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#04040a] via-[#04040a]/30 via-25% to-transparent" />
        {/* Top darkening for nav */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#04040a]/60 via-transparent to-transparent h-32" />
        {/* Cinematic vignette */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 20%, rgba(4,4,10,0.8) 100%)"
        }} />
      </motion.div>

      {/* === AMBIENT PARTICLES === */}
      <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -150, 0],
              x: [0, Math.sin(i * 0.8) * 30, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, delay: i * 1.2, ease: "easeInOut" }}
            className="absolute w-[1px] h-[1px] bg-white rounded-full"
            style={{
              left: `${10 + i * 11}%`,
              top: `${40 + (i % 4) * 15}%`,
              boxShadow: "0 0 6px rgba(255,255,255,0.8)",
            }}
          />
        ))}
      </div>

      {/* === CONTENT === */}
      <motion.div
        style={{ opacity, filter: blur.get() > 0 ? `blur(${blur.get()}px)` : undefined }}
        className="relative z-[4] h-full flex items-end pb-40 lg:pb-44 px-4 lg:px-16"
      >
        <div className="max-w-3xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -40, filter: "blur(6px)" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Category indicator */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 mb-5"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                  <Tv className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                    {current.type === "tvshow" ? "Series" : current.type === "anime" ? "Anime" : "Film"}
                  </span>
                </div>
                {current.rating && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-sm">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-[11px] font-bold text-yellow-400">{current.rating}</span>
                  </div>
                )}
              </motion.div>

              {/* Title - MASSIVE cinematic */}
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black mb-5 leading-[0.85] tracking-[-0.03em]">
                <span className="block text-white" style={{
                  textShadow: "0 4px 30px rgba(0,0,0,0.8), 0 0 80px rgba(0,0,0,0.4)"
                }}>
                  {current.title}
                </span>
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/50 mb-5 font-medium">
                <span className="text-white/70 font-semibold">{current.year}</span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="capitalize">{current.genre}</span>
                {current.duration && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-white/30" />
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{current.duration}</span>
                  </>
                )}
                {current.seasons && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-white/30" />
                    <span>{current.seasons} Season{current.seasons > 1 ? "s" : ""}</span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-[15px] text-white/40 mb-8 line-clamp-2 lg:line-clamp-3 max-w-2xl leading-relaxed font-light">
                {current.description}
              </p>

              {/* Action Buttons - Premium */}
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href={`/watch/${current.id}`}
                  className="magnetic-btn group flex items-center gap-3 px-10 py-4.5 rounded-lg bg-primary text-white font-bold text-base transition-all duration-300 shadow-[0_8px_30px_rgba(229,9,20,0.4)] hover:shadow-[0_12px_40px_rgba(229,9,20,0.5)] hover:bg-primary/90"
                >
                  <Play className="w-5 h-5 fill-white transition-transform duration-300 group-hover:scale-110" />
                  Play
                </Link>
                <Link
                  href={`/watch/${current.id}`}
                  className="magnetic-btn group flex items-center gap-2.5 px-8 py-4.5 rounded-lg bg-white/10 backdrop-blur-xl text-white font-semibold text-base transition-all duration-300 border border-white/10 hover:bg-white/15 hover:border-white/20"
                >
                  <Info className="w-5 h-5 text-white/70 group-hover:text-white transition-all" />
                  More Info
                </Link>
                {onWatchlist && (
                  <button
                    onClick={() => onWatchlist(current.id)}
                    className="magnetic-btn p-4 rounded-lg bg-white/5 backdrop-blur-xl text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-white/15"
                  >
                    <Bookmark className="w-5 h-5" />
                  </button>
                )}
                {/* Mute/Unmute for trailer */}
                {showTrailer && current.trailer && (
                  <button
                    onClick={() => setMuted(!muted)}
                    className="magnetic-btn p-3.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white/50 hover:text-white hover:bg-black/60 transition-all ml-auto"
                  >
                    {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* === BOTTOM PROGRESS === */}
      <div className="absolute bottom-8 left-0 right-0 z-[5] px-4 lg:px-16">
        <div className="flex items-end gap-3 max-w-4xl">
          {featured.map((item, i) => (
            <button
              key={item.id}
              onClick={() => goTo(i)}
              className="group flex-1 max-w-[160px] relative"
            >
              {/* Thumbnail preview on hover */}
              <div className={`relative h-[3px] rounded-full overflow-hidden transition-all duration-300 ${
                i === currentIndex ? "bg-white/20 h-[4px]" : "bg-white/[0.06] hover:bg-white/10"
              }`}>
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: i === currentIndex ? "100%" : i < currentIndex ? "100%" : "0%" }}
                  transition={{ duration: i === currentIndex ? 10 : 0.4, ease: "linear" }}
                />
              </div>
              <p className={`text-[9px] mt-2 truncate transition-all duration-300 ${
                i === currentIndex ? "text-white/70 font-medium" : "text-white/20 group-hover:text-white/40"
              }`}>
                {item.title}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* === SCROLL INDICATOR === */}
      <motion.div
        animate={{ y: [0, 8, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[5]"
      >
        <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-1.5 rounded-full bg-white/50"
          />
        </div>
      </motion.div>
    </section>
  );
}
