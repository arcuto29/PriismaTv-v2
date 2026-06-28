"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";

export default function WelcomePage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Section transforms based on scroll
  const gateOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const gateScale = useTransform(scrollYProgress, [0, 0.15], [1, 1.5]);
  const systemOpacity = useTransform(scrollYProgress, [0.15, 0.25, 0.4], [0, 1, 1]);
  const systemY = useTransform(scrollYProgress, [0.15, 0.25], [50, 0]);
  const ariseOpacity = useTransform(scrollYProgress, [0.4, 0.5, 0.65], [0, 1, 1]);
  const ariseScale = useTransform(scrollYProgress, [0.4, 0.55], [0.5, 1]);
  const shadowsOpacity = useTransform(scrollYProgress, [0.6, 0.7, 0.85], [0, 1, 1]);
  const shadowsY = useTransform(scrollYProgress, [0.6, 0.75], [100, 0]);
  const enterOpacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);
  const enterScale = useTransform(scrollYProgress, [0.8, 0.95], [0.8, 1]);
  const bgBrightness = useTransform(scrollYProgress, [0, 0.5, 0.7], [0.3, 0.5, 0.8]);

  const enter = () => {
    router.push("/");
  };

  return (
    <div ref={containerRef} className="relative h-[500vh] bg-[#020204]">
      {/* Fixed viewport */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Background that brightens with scroll */}
        <motion.div
          style={{ opacity: bgBrightness }}
          className="absolute inset-0 bg-gradient-to-b from-blue-950/50 via-[#020204] to-purple-950/30"
        />

        {/* Floating particles throughout */}
        <div className="absolute inset-0 pointer-events-none">
          {[15, 35, 55, 75, 25, 45, 65, 85, 10, 90, 30, 70, 50, 20, 80].map((left, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 3 + i % 3, repeat: Infinity, delay: i * 0.4 }}
              className="absolute w-1 h-1 rounded-full bg-primary"
              style={{ left: `${left}%`, top: `${30 + (i % 5) * 15}%` }}
            />
          ))}
        </div>

        {/* === SECTION 1: Dungeon Gate === */}
        <motion.div
          style={{ opacity: gateOpacity, scale: gateScale }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          {/* Gate frame */}
          <div className="relative">
            {/* Outer glow */}
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -inset-8 rounded-3xl bg-primary/10 blur-xl"
            />
            {/* Gate arch */}
            <div className="w-48 h-72 md:w-64 md:h-96 rounded-t-full border-2 border-primary/40 relative overflow-hidden flex items-center justify-center"
              style={{ boxShadow: "0 0 40px rgba(0,212,255,0.2), inset 0 0 40px rgba(0,212,255,0.1)" }}>
              {/* Swirling energy inside gate */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-t-full bg-gradient-conic from-primary/20 via-purple-600/10 via-transparent to-primary/20"
              />
              {/* Gate center glow */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 rounded-full bg-primary/30 blur-lg"
              />
              <p className="absolute text-primary/60 text-xs font-mono tracking-widest">E-RANK</p>
            </div>
          </div>

          <motion.p
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mt-8 text-white/40 text-sm md:text-base font-mono text-center"
          >
            You are the weakest hunter...
          </motion.p>
          <p className="mt-3 text-white/20 text-xs">↓ Scroll to awaken ↓</p>
        </motion.div>

        {/* === SECTION 2: System Notification === */}
        <motion.div
          style={{ opacity: systemOpacity, y: systemY }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="max-w-md w-full mx-4">
            {/* System window */}
            <motion.div
              className="bg-[#0a1628]/90 border border-primary/40 rounded-lg p-6 backdrop-blur-sm relative overflow-hidden"
              style={{ boxShadow: "0 0 30px rgba(0,212,255,0.15), inset 0 1px 0 rgba(0,212,255,0.2)" }}
            >
              {/* Header bar */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-primary/20">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-mono text-primary/80 uppercase tracking-widest">System Notification</span>
              </div>

              {/* Messages */}
              <div className="space-y-3 font-mono text-sm">
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-white/70"
                >
                  <span className="text-primary">[System]</span> Player has met the requirements.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-white/70"
                >
                  <span className="text-primary">[System]</span> Beginning player reawakening...
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-yellow-400"
                >
                  <span className="text-primary">[System]</span> Class assigned: <span className="text-white font-bold">Shadow Monarch</span>
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 }}
                  className="text-white/70"
                >
                  <span className="text-primary">[System]</span> Ability unlocked: <span className="text-cyan-400">Arise</span>
                </motion.p>
              </div>

              {/* Progress bar */}
              <div className="mt-5 pt-3 border-t border-primary/20">
                <div className="flex justify-between text-[9px] font-mono text-primary/60 mb-1">
                  <span>AWAKENING PROGRESS</span>
                  <span>100%</span>
                </div>
                <div className="h-1.5 rounded-full bg-primary/10 overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* === SECTION 3: ARISE === */}
        <motion.div
          style={{ opacity: ariseOpacity, scale: ariseScale }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center">
            {/* Rising shadows behind text */}
            <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0, opacity: 0 }}
                  whileInView={{ height: `${40 + Math.random() * 30}%`, opacity: 0.3 }}
                  transition={{ delay: i * 0.1, duration: 1 }}
                  className="w-4 mx-1 bg-gradient-to-t from-purple-900/50 to-transparent rounded-t-full"
                />
              ))}
            </div>

            <motion.h1
              className="text-7xl md:text-[10rem] font-black text-primary relative"
              style={{
                textShadow: "0 0 40px rgba(0,212,255,0.8), 0 0 80px rgba(0,212,255,0.4), 0 0 120px rgba(124,58,237,0.3)",
              }}
              animate={{ textShadow: [
                "0 0 40px rgba(0,212,255,0.8), 0 0 80px rgba(0,212,255,0.4)",
                "0 0 60px rgba(0,212,255,1), 0 0 120px rgba(0,212,255,0.6), 0 0 200px rgba(124,58,237,0.4)",
                "0 0 40px rgba(0,212,255,0.8), 0 0 80px rgba(0,212,255,0.4)",
              ]}}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ARISE
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/30 text-sm font-mono mt-4 tracking-widest"
            >
              — Sung Jinwoo, Shadow Monarch
            </motion.p>
          </div>
        </motion.div>

        {/* === SECTION 4: Shadow Army === */}
        <motion.div
          style={{ opacity: shadowsOpacity, y: shadowsY }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center max-w-lg mx-4">
            {/* Shadow soldiers rising */}
            <div className="flex items-end justify-center gap-3 mb-8 h-40">
              {["Igris", "Beru", "Tank", "Iron", "Tusk"].map((name, i) => (
                <motion.div
                  key={name}
                  initial={{ y: 100, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.15, duration: 0.8, type: "spring" }}
                  className="flex flex-col items-center"
                >
                  <div className={`w-10 h-${16 + i * 2} md:w-14 rounded-t-lg bg-gradient-to-t from-purple-900/80 to-primary/20 border border-primary/20 flex items-center justify-center`}
                    style={{ height: `${60 + i * 15}px`, boxShadow: "0 0 15px rgba(0,212,255,0.2)" }}>
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      className="w-2 h-2 rounded-full bg-primary"
                    />
                  </div>
                  <p className="text-[8px] font-mono text-primary/40 mt-1">{name}</p>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-white/50 text-sm mb-2"
            >
              Your shadow army awaits, Monarch.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/30 text-xs font-mono"
            >
              423+ titles • Movies • Anime • TV Shows
            </motion.p>
          </div>
        </motion.div>

        {/* === SECTION 5: Enter === */}
        <motion.div
          style={{ opacity: enterOpacity, scale: enterScale }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              animate={{ boxShadow: [
                "0 0 20px rgba(0,212,255,0.3)",
                "0 0 40px rgba(0,212,255,0.5), 0 0 80px rgba(124,58,237,0.3)",
                "0 0 20px rgba(0,212,255,0.3)",
              ]}}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mb-6"
            >
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-black mb-2">
              <span className="text-primary">Priisma</span>
              <span className="text-white">Tv</span>
            </h2>
            <p className="text-white/30 text-xs font-mono tracking-widest mb-8">PREMIUM STREAMING HUB</p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={enter}
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-black text-lg shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-shadow"
            >
              ENTER THE SHADOW REALM ⚔️
            </motion.button>
          </div>
        </motion.div>

        {/* Scroll progress indicator on the side */}
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
          {["Gate", "System", "Arise", "Army", "Enter"].map((label, i) => {
            const progress = scrollYProgress;
            const sectionStart = i * 0.2;
            return (
              <motion.div
                key={label}
                className="flex items-center gap-2"
                style={{ opacity: useTransform(progress, [sectionStart, sectionStart + 0.1], [0.3, 1]) }}
              >
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: useTransform(progress, [sectionStart, sectionStart + 0.05], ["rgba(255,255,255,0.2)", "#00d4ff"]) as unknown as string,
                  }}
                />
                <span className="text-[8px] font-mono text-white/30 hidden md:block">{label}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
