"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";

export default function WelcomePage() {
  const router = useRouter();
  const [phase, setPhase] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position for 3D control
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Transform mouse to rotation
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [30, -30]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-30, 30]);
  const orbX = useTransform(smoothX, [-0.5, 0.5], [-100, 100]);
  const orbY = useTransform(smoothY, [-0.5, 0.5], [-100, 100]);

  // Scroll-based transforms
  const scaleOnScroll = 1 + scrollProgress * 0.5;
  const opacityOnScroll = Math.max(0, 1 - scrollProgress * 1.5);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 800);
    const t3 = setTimeout(() => setPhase(3), 1500);
    const t4 = setTimeout(() => setPhase(4), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  // Mouse handler
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  // Scroll handler
  const handleScroll = (e: React.WheelEvent) => {
    setScrollProgress((prev) => {
      const next = Math.max(0, Math.min(1, prev + e.deltaY * 0.002));
      if (next >= 0.95 && !exiting) {
        enter();
      }
      return next;
    });
  };

  const enter = () => {
    setExiting(true);
    setTimeout(() => router.push("/"), 1200);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onWheel={handleScroll}
      className="fixed inset-0 z-[200] bg-[#020204] overflow-hidden cursor-crosshair select-none"
      style={{ perspective: "1200px" }}
    >
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={phase >= 4 ? { opacity: 1 } : {}}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1"
      >
        <p className="text-[9px] font-mono text-white/30 tracking-widest">SCROLL TO ENTER</p>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-4 h-7 rounded-full border border-white/20 flex items-start justify-center pt-1"
        >
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 rounded-full bg-primary"
          />
        </motion.div>
      </motion.div>

      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-purple-500"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Interactive 3D scene - responds to mouse */}
      <motion.div
        style={{ rotateX, rotateY }}
        className="absolute inset-0 flex items-center justify-center"
        // style includes perspective from parent
      >
        {/* Central interactive ORB - follows mouse with spring physics */}
        <motion.div
          style={{ x: orbX, y: orbY }}
          className="absolute z-10"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 30px rgba(0,212,255,0.3), inset 0 0 30px rgba(0,212,255,0.1)",
                "0 0 60px rgba(0,212,255,0.5), inset 0 0 40px rgba(124,58,237,0.2)",
                "0 0 30px rgba(0,212,255,0.3), inset 0 0 30px rgba(0,212,255,0.1)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-primary/20 via-blue-500/10 to-purple-600/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center"
          >
            {/* Inner orb */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-primary/40 to-purple-600/40 border border-white/10 flex items-center justify-center"
            >
              <svg className="w-10 h-10 md:w-14 md:h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </motion.div>
          </motion.div>

          {/* Orbiting particles around the orb */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <motion.div
              key={i}
              animate={{ rotate: 360 }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <motion.div
                className="absolute w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50"
                style={{ top: "-10px" }}
                animate={{ scale: [0.5, 1.5, 0.5], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Ring 1 - reacts to mouse */}
        <motion.div
          animate={{ rotateZ: 360 }}
          transition={{ duration: 15 - scrollProgress * 10, repeat: Infinity, ease: "linear" }}
          className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full border border-primary/20"
          style={{ transformStyle: "preserve-3d", rotateX: `${70 + scrollProgress * 20}deg` }}
        />

        {/* Ring 2 */}
        <motion.div
          animate={{ rotateZ: -360 }}
          transition={{ duration: 20 - scrollProgress * 12, repeat: Infinity, ease: "linear" }}
          className="absolute w-[250px] h-[250px] md:w-[380px] md:h-[380px] rounded-full border border-purple-500/15"
          style={{ transformStyle: "preserve-3d", rotateX: `${-60 - scrollProgress * 20}deg` }}
        />

        {/* Ring 3 - fastest, most reactive */}
        <motion.div
          animate={{ rotateZ: 360 }}
          transition={{ duration: 8 - scrollProgress * 6, repeat: Infinity, ease: "linear" }}
          className="absolute w-[180px] h-[180px] md:w-[280px] md:h-[280px] rounded-full border-2 border-cyan-400/10"
          style={{ transformStyle: "preserve-3d", rotateY: `${45 + scrollProgress * 90}deg` }}
        />
      </motion.div>

      {/* Grid floor - tilts with mouse */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={phase >= 1 ? { opacity: 0.6 } : {}}
        className="absolute bottom-0 left-0 right-0 h-[45%] overflow-hidden pointer-events-none"
        style={{ perspective: "500px" }}
      >
        <motion.div
          style={{ rotateX: useTransform(smoothY, [-0.5, 0.5], [55, 65]) }}
          className="w-full h-full origin-bottom"
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(rgba(0,212,255,${0.08 + scrollProgress * 0.15}) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,${0.08 + scrollProgress * 0.15}) 1px, transparent 1px)`,
              backgroundSize: `${50 - scrollProgress * 20}px ${50 - scrollProgress * 20}px`,
            }}
          />
        </motion.div>
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-primary/10 to-transparent" />
      </motion.div>

      {/* Scanning line - speeds up with scroll */}
      <motion.div
        initial={{ top: "-2%" }}
        animate={{ top: "102%" }}
        transition={{ duration: Math.max(0.5, 2.5 - scrollProgress * 2), repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent z-10 pointer-events-none"
      />

      {/* Particle burst on exit */}
      <AnimatePresence>
        {exiting && (
          <>
            {Array.from({ length: 80 }).map((_, i) => {
              const angle = (i / 80) * Math.PI * 2;
              const distance = 500 + Math.random() * 300;
              return (
                <motion.div
                  key={i}
                  initial={{ x: "50vw", y: "50vh", scale: 0, opacity: 1 }}
                  animate={{
                    x: `calc(50vw + ${Math.cos(angle) * distance}px)`,
                    y: `calc(50vh + ${Math.sin(angle) * distance}px)`,
                    scale: [0, 2, 0],
                    opacity: [1, 1, 0],
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute w-1 h-6 rounded-full"
                  style={{ background: `linear-gradient(to top, ${i % 3 === 0 ? "#00d4ff" : i % 3 === 1 ? "#7c3aed" : "#fff"}, transparent)` }}
                />
              );
            })}
            <motion.div initial={{ scale: 0, opacity: 0.8 }} animate={{ scale: 6, opacity: 0 }} transition={{ duration: 0.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-4 border-primary" />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-white" />
          </>
        )}
      </AnimatePresence>

      {/* HUD corners */}
      <motion.div initial={{ opacity: 0 }} animate={phase >= 1 ? { opacity: 1 } : {}} className="absolute top-5 left-5 z-20 pointer-events-none">
        <div className="w-10 h-10 border-l-2 border-t-2 border-primary/40" />
        <p className="text-[8px] font-mono text-primary/40 mt-1">SYS.ONLINE</p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={phase >= 1 ? { opacity: 1 } : {}} className="absolute top-5 right-5 z-20 pointer-events-none">
        <div className="w-10 h-10 border-r-2 border-t-2 border-primary/40 ml-auto" />
        <p className="text-[8px] font-mono text-primary/40 mt-1 text-right">MOUSE.ACTIVE</p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={phase >= 1 ? { opacity: 1 } : {}} className="absolute bottom-5 left-5 z-20 pointer-events-none">
        <div className="w-10 h-10 border-l-2 border-b-2 border-primary/40" />
        <p className="text-[8px] font-mono text-primary/40 mt-1">SCROLL: {Math.round(scrollProgress * 100)}%</p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={phase >= 1 ? { opacity: 1 } : {}} className="absolute bottom-5 right-5 z-20 pointer-events-none">
        <div className="w-10 h-10 border-r-2 border-b-2 border-primary/40 ml-auto" />
      </motion.div>

      {/* Title + button - fades/scales with scroll */}
      <motion.div
        animate={{ opacity: exiting ? 0 : opacityOnScroll, scale: exiting ? 1.5 : scaleOnScroll, filter: exiting ? "blur(20px)" : "blur(0px)" }}
        className="relative z-30 h-full flex flex-col items-center justify-center px-6 pointer-events-none"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : {}}
          className="text-5xl md:text-8xl font-black tracking-tighter mb-2 pointer-events-none"
        >
          {"PRIISMA".split("").map((letter, i) => (
            <motion.span
              key={i}
              initial={{ y: 40, opacity: 0 }}
              animate={phase >= 2 ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: i * 0.07, type: "spring" }}
              className="inline-block text-primary"
              style={{ textShadow: "0 0 30px rgba(0,212,255,0.5)" }}
            >
              {letter}
            </motion.span>
          ))}
          {"TV".split("").map((letter, i) => (
            <motion.span
              key={`tv-${i}`}
              initial={{ y: 40, opacity: 0 }}
              animate={phase >= 2 ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: 0.49 + i * 0.07, type: "spring" }}
              className="inline-block text-white"
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : {}}
          className="text-white/30 text-xs font-mono tracking-[0.3em] uppercase mb-8 pointer-events-none"
        >
          [ MOVE YOUR MOUSE • SCROLL TO ENTER ]
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={phase >= 4 ? { opacity: 1, scale: 1 } : {}}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={enter}
          className="px-10 py-4 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-black text-lg shadow-2xl shadow-primary/30 pointer-events-auto cursor-pointer"
        >
          ENTER ⚔️
        </motion.button>
      </motion.div>
    </div>
  );
}
