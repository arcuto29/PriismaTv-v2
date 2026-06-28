"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function WelcomePage() {
  const router = useRouter();
  const [phase, setPhase] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [glitch, setGlitch] = useState(false);
  const [shards, setShards] = useState<{ x: number; y: number; w: number; h: number; rx: number; ry: number; delay: number }[]>([]);

  const fullText = "> INITIALIZING PRIISMATV...";

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 1000);
    const t3 = setTimeout(() => setPhase(3), 2000);
    const t4 = setTimeout(() => setPhase(4), 3000);
    const t5 = setTimeout(() => setPhase(5), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, []);

  // Typing animation
  useEffect(() => {
    if (phase < 2) return;
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [phase]);

  // Random glitch flicker
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 100 + Math.random() * 100);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Heartbeat pulse via CSS
  useEffect(() => {
    if (phase >= 3) {
      document.documentElement.style.setProperty("--heartbeat", "running");
    }
  }, [phase]);

  // Generate crack lines for shatter effect
  const generateShards = () => {
    const newShards = [];
    // Create crack lines that spread from center
    const numCracks = 12;
    for (let i = 0; i < numCracks; i++) {
      const angle = (i / numCracks) * Math.PI * 2;
      const length = 60 + Math.random() * 40;
      newShards.push({
        x: 50,
        y: 50,
        w: 2,
        h: length,
        rx: angle * (180 / Math.PI),
        ry: 0,
        delay: i * 0.03,
      });
    }
    // Create fragments that fall
    for (let i = 0; i < 30; i++) {
      newShards.push({
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60,
        w: 5 + Math.random() * 10,
        h: 5 + Math.random() * 10,
        rx: (Math.random() - 0.5) * 180,
        ry: (Math.random() - 0.5) * 180,
        delay: 0.3 + Math.random() * 0.4,
      });
    }
    return newShards;
  };

  const enter = () => {
    setCountdown(3);
    setTimeout(() => setCountdown(2), 600);
    setTimeout(() => setCountdown(1), 1200);
    setTimeout(() => {
      setCountdown(0);
      setShards(generateShards());
      setExiting(true);
    }, 1800);
    setTimeout(() => router.push("/"), 3000);
  };

  return (
    <div className={`fixed inset-0 z-[200] bg-[#020204] overflow-hidden select-none ${glitch ? "translate-x-[2px] skew-x-[0.3deg]" : ""}`}
      style={{ perspective: "1200px", transition: glitch ? "none" : "transform 0.1s" }}>

      {/* Heartbeat pulse overlay - very subtle and quick */}
      <motion.div
        animate={phase >= 3 ? { opacity: [0, 0.015, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 bg-primary pointer-events-none z-[1]"
      />

      {/* Fog rising from bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none z-[2] overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="w-full h-full bg-gradient-to-t from-primary/10 via-purple-900/5 to-transparent blur-xl"
        />
        <motion.div
          animate={{ y: [0, -15, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-cyan-900/10 to-transparent blur-2xl"
        />
      </div>

      {/* Glitch horizontal lines */}
      {glitch && (
        <div className="absolute inset-0 pointer-events-none z-[3]">
          {[20, 40, 55, 70, 85].map((top) => (
            <div key={top} className="absolute left-0 right-0 h-[2px] bg-primary/30" style={{ top: `${top}%` }} />
          ))}
        </div>
      )}

      {/* Scanning line */}
      <motion.div
        initial={{ top: "-2%" }}
        animate={{ top: "102%" }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent z-[3] pointer-events-none"
      />

      {/* 3D Rotating cube wireframe */}
      <div className="absolute inset-0 flex items-center justify-center z-[4]" style={{ perspective: "800px" }}>
        <motion.div
          animate={{ rotateX: 360, rotateY: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="w-[250px] h-[250px] md:w-[350px] md:h-[350px] relative"
          style={{ transformStyle: "preserve-3d" }}
        >
          {[
            "translateZ(125px)", "translateZ(-125px) rotateY(180deg)",
            "rotateY(90deg) translateZ(125px)", "rotateY(-90deg) translateZ(125px)",
            "rotateX(90deg) translateZ(125px)", "rotateX(-90deg) translateZ(125px)",
          ].map((transform, i) => (
            <div key={i} className="absolute inset-0 border border-primary/[0.06] rounded-lg" style={{ transform, backfaceVisibility: "visible" }} />
          ))}
        </motion.div>
      </div>

      {/* Orbiting rings */}
      <div className="absolute inset-0 flex items-center justify-center z-[4]" style={{ perspective: "1000px" }}>
        <motion.div animate={{ rotateX: 75, rotateZ: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="w-[350px] h-[350px] md:w-[450px] md:h-[450px] rounded-full border border-primary/15 absolute" style={{ transformStyle: "preserve-3d" }} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-[4]" style={{ perspective: "1000px" }}>
        <motion.div animate={{ rotateX: -60, rotateZ: -360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="w-[280px] h-[280px] md:w-[380px] md:h-[380px] rounded-full border border-purple-500/10 absolute" style={{ transformStyle: "preserve-3d" }} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-[4]" style={{ perspective: "1000px" }}>
        <motion.div animate={{ rotateY: 360, rotateZ: 45 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-[180px] h-[180px] md:w-[260px] md:h-[260px] rounded-full border-2 border-cyan-400/10 absolute" style={{ transformStyle: "preserve-3d" }} />
      </div>

      {/* 3D Grid floor */}
      <motion.div initial={{ opacity: 0 }} animate={phase >= 1 ? { opacity: 1 } : {}}
        className="absolute bottom-0 left-0 right-0 h-[35%] overflow-hidden z-[3]" style={{ perspective: "500px" }}>
        <div className="w-full h-full origin-bottom" style={{ transform: "rotateX(60deg)",
          backgroundImage: "linear-gradient(rgba(0,212,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.08) 1px, transparent 1px)",
          backgroundSize: "50px 50px" }} />
      </motion.div>

      {/* Corner HUD */}
      <motion.div initial={{ opacity: 0 }} animate={phase >= 1 ? { opacity: 1 } : {}} className="absolute top-5 left-5 z-20">
        <div className="w-10 h-10 border-l-2 border-t-2 border-primary/40" />
        <p className="text-[8px] font-mono text-primary/40 mt-1">SYS.ONLINE</p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={phase >= 1 ? { opacity: 1 } : {}} className="absolute top-5 right-5 z-20">
        <div className="w-10 h-10 border-r-2 border-t-2 border-primary/40 ml-auto" />
        <p className="text-[8px] font-mono text-primary/40 mt-1 text-right">V2.0</p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={phase >= 1 ? { opacity: 1 } : {}} className="absolute bottom-5 left-5 z-20">
        <div className="w-10 h-10 border-l-2 border-b-2 border-primary/40" />
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={phase >= 1 ? { opacity: 1 } : {}} className="absolute bottom-5 right-5 z-20">
        <div className="w-10 h-10 border-r-2 border-b-2 border-primary/40 ml-auto" />
      </motion.div>

      {/* SCREEN CRACK EXIT */}
      <AnimatePresence>
        {exiting && shards.length > 0 && (
          <>
            {/* Crack lines spreading from center */}
            {shards.filter((s) => s.w === 2).map((shard, i) => (
              <motion.div
                key={`crack-${i}`}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: [0, 1, 1] }}
                transition={{ duration: 0.4, delay: shard.delay, ease: "easeOut" }}
                className="fixed z-[100] origin-top"
                style={{
                  left: `${shard.x}%`,
                  top: `${shard.y}%`,
                  width: "2px",
                  height: `${shard.h}%`,
                  background: "linear-gradient(to bottom, rgba(0,212,255,0.9), rgba(124,58,237,0.6), transparent)",
                  transform: `rotate(${shard.rx}deg)`,
                  boxShadow: "0 0 8px rgba(0,212,255,0.8), 0 0 20px rgba(0,212,255,0.4)",
                }}
              />
            ))}

            {/* Fragments that fall after cracks */}
            {shards.filter((s) => s.w !== 2).map((shard, i) => (
              <motion.div
                key={`frag-${i}`}
                initial={{ opacity: 1, y: 0, rotateX: 0, rotateZ: 0, scale: 1 }}
                animate={{
                  y: 800,
                  rotateX: shard.rx,
                  rotateZ: shard.ry * 0.5,
                  opacity: [1, 1, 0],
                  scale: [1, 0.8, 0.3],
                }}
                transition={{ duration: 1.5, delay: shard.delay, ease: "easeIn" }}
                className="fixed bg-[#020204] border border-primary/20 z-[100]"
                style={{
                  left: `${shard.x}%`,
                  top: `${shard.y}%`,
                  width: `${shard.w}%`,
                  height: `${shard.h}%`,
                  transformStyle: "preserve-3d",
                }}
              />
            ))}

            {/* Light bleeding through cracks */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0.6, 1] }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="fixed inset-0 z-[99]"
              style={{ background: "radial-gradient(circle at center, rgba(0,212,255,0.15) 0%, transparent 70%)" }}
            />

            {/* Final bright flash */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0, 1, 0] }}
              transition={{ duration: 1.5, delay: 0.8, times: [0, 0.5, 0.7, 0.85, 1] }}
              className="fixed inset-0 bg-white z-[101]"
            />
          </>
        )}
      </AnimatePresence>

      {/* Countdown overlay */}
      <AnimatePresence>
        {countdown !== null && countdown > 0 && (
          <motion.div
            key={countdown}
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 flex items-center justify-center z-[80] pointer-events-none"
          >
            <span className="text-8xl md:text-[12rem] font-black text-primary" style={{ textShadow: "0 0 60px rgba(0,212,255,0.8)" }}>
              {countdown}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content - hide during countdown */}
      <motion.div
        animate={{ opacity: exiting || (countdown !== null && countdown > 0) ? 0 : 1, scale: exiting ? 1.1 : 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-30 h-full flex flex-col items-center justify-center px-6"
      >
        {/* Typing text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : {}}
          className="text-primary/60 text-xs font-mono mb-6 h-5"
        >
          {typedText}<span className="animate-pulse">|</span>
        </motion.p>

        {/* Logo with glitch */}
        <motion.div
          initial={{ scale: 0, rotateY: 180, opacity: 0 }}
          animate={phase >= 2 ? { scale: 1, rotateY: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          className="mb-6 relative"
        >
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-primary via-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_60px_rgba(0,212,255,0.3)] relative overflow-hidden">
            <svg className="w-12 h-12 md:w-16 md:h-16 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <motion.div initial={{ x: "-100%" }} animate={phase >= 3 ? { x: "200%" } : {}} transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
          </div>
          {/* Glitch duplicate */}
          {glitch && (
            <div className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-red-500/30 to-purple-600/30 translate-x-[3px] -translate-y-[2px]" />
          )}
          <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-3xl border border-primary/40" />
        </motion.div>

        {/* Title with staggered letters */}
        <motion.div initial={{ opacity: 0 }} animate={phase >= 3 ? { opacity: 1 } : {}} className="mb-2">
          <h1 className={`text-5xl md:text-8xl font-black tracking-tighter ${glitch ? "skew-x-1" : ""}`}>
            {"PRIISMA".split("").map((letter, i) => (
              <motion.span key={i} initial={{ y: 50, opacity: 0, rotateX: -90 }}
                animate={phase >= 3 ? { y: 0, opacity: 1, rotateX: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.5, type: "spring" }}
                className="inline-block text-primary"
                style={{ textShadow: "0 0 30px rgba(0,212,255,0.5), 0 0 60px rgba(0,212,255,0.2)" }}>
                {letter}
              </motion.span>
            ))}
            {"TV".split("").map((letter, i) => (
              <motion.span key={`tv-${i}`} initial={{ y: 50, opacity: 0, rotateX: -90 }}
                animate={phase >= 3 ? { y: 0, opacity: 1, rotateX: 0 } : {}}
                transition={{ delay: 0.56 + i * 0.08, duration: 0.5, type: "spring" }}
                className="inline-block text-white">
                {letter}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p initial={{ opacity: 0, y: 10 }} animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
          className="text-white/30 text-xs md:text-sm font-mono tracking-[0.3em] uppercase mb-8">
          [ PREMIUM STREAMING HUB ]
        </motion.p>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={phase >= 4 ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}
          className="flex items-center gap-6 md:gap-10 mb-10">
          {[{ value: "423+", label: "TITLES" }, { value: "HD", label: "QUALITY" }, { value: "∞", label: "FREE" }].map((stat, i) => (
            <motion.div key={stat.label} initial={{ scale: 0, rotateZ: -10 }}
              animate={phase >= 4 ? { scale: 1, rotateZ: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.12, type: "spring", bounce: 0.4 }}
              className="text-center">
              <p className="text-3xl md:text-4xl font-black text-white">{stat.value}</p>
              <p className="text-[8px] md:text-[9px] tracking-[0.25em] text-white/25 mt-1 font-mono">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Enter button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={phase >= 5 ? { opacity: 1, scale: 1 } : {}}
          transition={{ type: "spring", bounce: 0.5 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0,212,255,0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={enter}
          className="relative px-12 py-5 rounded-2xl font-black text-lg md:text-xl text-white overflow-hidden group"
        >
          <motion.div animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl"
            style={{ background: "linear-gradient(270deg, #00d4ff, #7c3aed, #00d4ff, #7c3aed)", backgroundSize: "300% 300%" }} />
          <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]" />
          <span className="relative z-10 flex items-center gap-3">
            ENTER
            <motion.span animate={{ x: [0, 8, 0] }} transition={{ duration: 1, repeat: Infinity }} className="text-2xl">⚔️</motion.span>
          </span>
        </motion.button>

        {/* Bottom text */}
        <motion.p initial={{ opacity: 0 }} animate={phase >= 5 ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
          className="absolute bottom-8 text-[9px] font-mono text-white/10 tracking-widest">
          ARISE • CTRL+K SEARCH • TYPE &quot;ARISE&quot; FOR SURPRISE
        </motion.p>
      </motion.div>
    </div>
  );
}
