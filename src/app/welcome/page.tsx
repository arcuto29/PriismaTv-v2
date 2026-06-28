"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 });

  return (
    <section ref={ref} className={`h-screen flex items-center justify-center relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full flex items-center justify-center"
      >
        {children}
      </motion.div>
    </section>
  );
}

export default function WelcomePage() {
  const router = useRouter();

  const enter = () => {
    router.push("/");
  };

  return (
    <div className="bg-[#020204] text-white overflow-x-hidden">
      {/* Fixed background particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[15, 35, 55, 75, 25, 45, 65, 85, 10, 90, 30, 70].map((left, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -20, 0], opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 3 + i % 3, repeat: Infinity, delay: i * 0.3 }}
            className="absolute w-1 h-1 rounded-full bg-primary"
            style={{ left: `${left}%`, top: `${20 + (i % 6) * 13}%` }}
          />
        ))}
      </div>

      {/* Fixed scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
        >
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 rounded-full bg-primary"
          />
        </motion.div>
      </motion.div>

      {/* === SECTION 1: Dungeon Gate === */}
      <Section>
        <div className="text-center">
          {/* Gate */}
          <div className="relative mx-auto mb-8">
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -inset-6 rounded-3xl bg-primary/10 blur-xl"
            />
            <div
              className="w-40 h-60 md:w-52 md:h-80 rounded-t-full border-2 border-primary/40 mx-auto relative overflow-hidden flex items-center justify-center"
              style={{ boxShadow: "0 0 40px rgba(0,212,255,0.2), inset 0 0 40px rgba(0,212,255,0.1)" }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-t-full opacity-30"
                style={{ background: "conic-gradient(from 0deg, #00d4ff, transparent, #7c3aed, transparent, #00d4ff)" }}
              />
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 rounded-full bg-primary/30 blur-lg"
              />
              <p className="absolute text-primary/60 text-[10px] font-mono tracking-widest">E-RANK</p>
            </div>
          </div>

          <motion.p
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-white/50 text-lg md:text-xl font-light italic"
          >
            &ldquo;You are the weakest hunter...&rdquo;
          </motion.p>
          <p className="mt-4 text-white/20 text-xs font-mono">↓ SCROLL TO AWAKEN ↓</p>
        </div>
      </Section>

      {/* === SECTION 2: System Notification === */}
      <Section>
        <div className="max-w-md w-full mx-4">
          <motion.div
            className="bg-[#0a1628]/90 border border-primary/40 rounded-lg p-6 backdrop-blur-sm"
            style={{ boxShadow: "0 0 30px rgba(0,212,255,0.15), inset 0 1px 0 rgba(0,212,255,0.2)" }}
          >
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-primary/20">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-mono text-primary/80 uppercase tracking-widest">System Notification</span>
            </div>

            <div className="space-y-3 font-mono text-sm">
              <motion.p initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="text-white/70">
                <span className="text-primary">[System]</span> Player has met the requirements.
              </motion.p>
              <motion.p initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="text-white/70">
                <span className="text-primary">[System]</span> Beginning player reawakening...
              </motion.p>
              <motion.p initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }} className="text-yellow-400">
                <span className="text-primary">[System]</span> Class assigned: <span className="text-white font-bold">Shadow Monarch</span>
              </motion.p>
              <motion.p initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }} className="text-white/70">
                <span className="text-primary">[System]</span> Ability unlocked: <span className="text-cyan-400 font-bold">Arise</span>
              </motion.p>
            </div>

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
      </Section>

      {/* === SECTION 3: ARISE === */}
      <Section>
        <div className="text-center relative">
          <motion.h1
            className="text-7xl md:text-[10rem] font-black text-primary"
            style={{ textShadow: "0 0 40px rgba(0,212,255,0.8), 0 0 80px rgba(0,212,255,0.4), 0 0 120px rgba(124,58,237,0.3)" }}
            animate={{
              textShadow: [
                "0 0 40px rgba(0,212,255,0.8), 0 0 80px rgba(0,212,255,0.4)",
                "0 0 80px rgba(0,212,255,1), 0 0 150px rgba(0,212,255,0.6), 0 0 200px rgba(124,58,237,0.4)",
                "0 0 40px rgba(0,212,255,0.8), 0 0 80px rgba(0,212,255,0.4)",
              ],
            }}
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
      </Section>

      {/* === SECTION 4: Shadow Army === */}
      <Section>
        <div className="text-center">
          <div className="flex items-end justify-center gap-4 md:gap-6 mb-8">
            {[
              { name: "Igris", h: 80 },
              { name: "Beru", h: 100 },
              { name: "Tank", h: 70 },
              { name: "Iron", h: 90 },
              { name: "Tusk", h: 75 },
            ].map((soldier, i) => (
              <motion.div
                key={soldier.name}
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.15, duration: 0.6, type: "spring" }}
                className="flex flex-col items-center"
              >
                <div
                  className="w-10 md:w-14 rounded-t-lg bg-gradient-to-t from-purple-900/80 to-primary/20 border border-primary/20 flex items-center justify-center relative"
                  style={{ height: `${soldier.h}px`, boxShadow: "0 0 15px rgba(0,212,255,0.2)" }}
                >
                  {/* Eyes */}
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    className="flex gap-1.5"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </motion.div>
                </div>
                <p className="text-[9px] font-mono text-primary/50 mt-2">{soldier.name}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/60 text-base md:text-lg"
          >
            Your shadow army awaits, Monarch.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-white/30 text-xs font-mono mt-3"
          >
            423+ titles • Movies • Anime • TV Shows
          </motion.p>
        </div>
      </Section>

      {/* === SECTION 5: Enter === */}
      <Section>
        <div className="text-center">
          <motion.div
            animate={{ boxShadow: [
              "0 0 20px rgba(0,212,255,0.3)",
              "0 0 50px rgba(0,212,255,0.5), 0 0 100px rgba(124,58,237,0.3)",
              "0 0 20px rgba(0,212,255,0.3)",
            ]}}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mb-6"
          >
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-black mb-2">
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

          <p className="mt-6 text-white/15 text-[10px] font-mono">
            CTRL+K search • type &quot;arise&quot; for surprise • press ? for shortcuts
          </p>
        </div>
      </Section>
    </div>
  );
}
