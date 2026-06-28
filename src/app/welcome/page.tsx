"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function WelcomePage() {
  const router = useRouter();
  const [phase, setPhase] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 1000);
    const t3 = setTimeout(() => setPhase(3), 2000);
    const t4 = setTimeout(() => setPhase(4), 3000);
    const t5 = setTimeout(() => setPhase(5), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, []);

  const enter = () => {
    setExiting(true);
    setTimeout(() => router.push("/"), 1200);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#020204] overflow-hidden cursor-default select-none" style={{ perspective: "1200px" }}>

      {/* 3D Rotating cube wireframe */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "800px" }}>
        <motion.div
          animate={{ rotateX: 360, rotateY: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] relative"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Cube faces */}
          {[
            { transform: "translateZ(150px)" },
            { transform: "translateZ(-150px) rotateY(180deg)" },
            { transform: "rotateY(90deg) translateZ(150px)" },
            { transform: "rotateY(-90deg) translateZ(150px)" },
            { transform: "rotateX(90deg) translateZ(150px)" },
            { transform: "rotateX(-90deg) translateZ(150px)" },
          ].map((face, i) => (
            <div
              key={i}
              className="absolute inset-0 border border-primary/[0.07] rounded-lg"
              style={{ transform: face.transform, backfaceVisibility: "visible" }}
            />
          ))}
        </motion.div>
      </div>

      {/* 3D rotating ring 1 */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1000px" }}>
        <motion.div
          animate={{ rotateX: 75, rotateZ: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full border border-primary/20 absolute"
          style={{ transformStyle: "preserve-3d" }}
        />
      </div>

      {/* 3D rotating ring 2 */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1000px" }}>
        <motion.div
          animate={{ rotateX: -60, rotateZ: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="w-[280px] h-[280px] md:w-[420px] md:h-[420px] rounded-full border border-purple-500/15 absolute"
          style={{ transformStyle: "preserve-3d" }}
        />
      </div>

      {/* 3D rotating ring 3 - inner */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1000px" }}>
        <motion.div
          animate={{ rotateY: 360, rotateZ: 45 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full border-2 border-cyan-400/10 absolute"
          style={{ transformStyle: "preserve-3d" }}
        />
      </div>

      {/* Grid floor - 3D perspective */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={phase >= 1 ? { opacity: 1 } : {}}
        className="absolute bottom-0 left-0 right-0 h-[40%] overflow-hidden"
        style={{ perspective: "500px" }}
      >
        <div
          className="w-full h-full origin-bottom"
          style={{
            transform: "rotateX(60deg)",
            backgroundImage: `linear-gradient(rgba(0,212,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
        {/* Horizon glow */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-primary/10 to-transparent" />
      </motion.div>

      {/* Scanning line */}
      <motion.div
        initial={{ top: "-2%" }}
        animate={{ top: "102%" }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent z-10"
      />

      {/* Vertical scanning line */}
      <motion.div
        initial={{ left: "-2%" }}
        animate={{ left: "102%" }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "linear", delay: 1 }}
        className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-purple-500/30 to-transparent z-10"
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
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute w-1 h-8 rounded-full origin-bottom"
                  style={{
                    background: `linear-gradient(to top, ${i % 3 === 0 ? "#00d4ff" : i % 3 === 1 ? "#7c3aed" : "#ffffff"}, transparent)`,
                    transform: `rotate(${angle}rad)`,
                  }}
                />
              );
            })}
            {/* Shockwave */}
            <motion.div
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 6, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-4 border-primary"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-2 border-white"
            />
            {/* Flash */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0] }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-white"
            />
          </>
        )}
      </AnimatePresence>

      {/* Corner HUD elements */}
      <motion.div initial={{ opacity: 0 }} animate={phase >= 1 ? { opacity: 1 } : {}} className="absolute top-5 left-5 z-20">
        <div className="w-10 h-10 border-l-2 border-t-2 border-primary/40" />
        <p className="text-[8px] font-mono text-primary/40 mt-1 tracking-widest">SYS.ONLINE</p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={phase >= 1 ? { opacity: 1 } : {}} className="absolute top-5 right-5 z-20">
        <div className="w-10 h-10 border-r-2 border-t-2 border-primary/40 ml-auto" />
        <p className="text-[8px] font-mono text-primary/40 mt-1 tracking-widest text-right">V2.0</p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={phase >= 1 ? { opacity: 1 } : {}} className="absolute bottom-5 left-5 z-20">
        <div className="w-10 h-10 border-l-2 border-b-2 border-primary/40" />
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={phase >= 1 ? { opacity: 1 } : {}} className="absolute bottom-5 right-5 z-20">
        <div className="w-10 h-10 border-r-2 border-b-2 border-primary/40 ml-auto" />
      </motion.div>

      {/* Main content - centered */}
      <motion.div
        animate={{ opacity: exiting ? 0 : 1, scale: exiting ? 1.5 : 1, filter: exiting ? "blur(20px)" : "blur(0px)" }}
        transition={{ duration: 0.6 }}
        className="relative z-30 h-full flex flex-col items-center justify-center px-6"
      >
        {/* Logo with 3D transform on appear */}
        <motion.div
          initial={{ scale: 0, rotateY: 180, opacity: 0 }}
          animate={phase >= 2 ? { scale: 1, rotateY: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          className="mb-6"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-primary via-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_60px_rgba(0,212,255,0.3)]">
              <svg className="w-12 h-12 md:w-16 md:h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            {/* Glow rings */}
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-3xl border border-primary/40"
            />
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute inset-0 rounded-3xl border border-purple-500/30"
            />
          </div>
        </motion.div>

        {/* Title with staggered letters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : {}}
          className="mb-2"
        >
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter">
            {"PRIISMA".split("").map((letter, i) => (
              <motion.span
                key={i}
                initial={{ y: 50, opacity: 0, rotateX: -90 }}
                animate={phase >= 3 ? { y: 0, opacity: 1, rotateX: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.5, type: "spring" }}
                className="inline-block text-primary"
                style={{ textShadow: "0 0 30px rgba(0,212,255,0.5), 0 0 60px rgba(0,212,255,0.2)" }}
              >
                {letter}
              </motion.span>
            ))}
            {"TV".split("").map((letter, i) => (
              <motion.span
                key={`tv-${i}`}
                initial={{ y: 50, opacity: 0, rotateX: -90 }}
                animate={phase >= 3 ? { y: 0, opacity: 1, rotateX: 0 } : {}}
                transition={{ delay: 0.56 + i * 0.08, duration: 0.5, type: "spring" }}
                className="inline-block text-white"
              >
                {letter}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
          className="text-white/30 text-xs md:text-sm font-mono tracking-[0.3em] uppercase mb-10"
        >
          [ PREMIUM STREAMING HUB ]
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-6 md:gap-10 mb-10"
        >
          {[
            { value: "423+", label: "TITLES" },
            { value: "HD", label: "QUALITY" },
            { value: "∞", label: "FREE" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0, rotateZ: -10 }}
              animate={phase >= 4 ? { scale: 1, rotateZ: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.12, type: "spring", bounce: 0.4 }}
              className="text-center"
            >
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
          {/* Animated gradient bg */}
          <motion.div
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl"
            style={{
              background: "linear-gradient(270deg, #00d4ff, #7c3aed, #00d4ff, #7c3aed)",
              backgroundSize: "300% 300%",
            }}
          />
          {/* Border glow */}
          <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]" />
          <span className="relative z-10 flex items-center gap-3">
            ENTER
            <motion.span
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-2xl"
            >
              ⚔️
            </motion.span>
          </span>
        </motion.button>

        {/* Bottom text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={phase >= 5 ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="absolute bottom-8 text-[9px] font-mono text-white/10 tracking-widest"
        >
          ARISE • CTRL+K SEARCH • TYPE &quot;ARISE&quot; FOR SURPRISE
        </motion.p>
      </motion.div>
    </div>
  );
}
