"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="bg-[#020204] text-white">
      {/* Fixed background particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[15, 35, 55, 75, 25, 45, 65, 85, 10, 90].map((left, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -20, 0], opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 3 + i % 3, repeat: Infinity, delay: i * 0.3 }}
            className="absolute w-1 h-1 rounded-full bg-cyan-400"
            style={{ left: `${left}%`, top: `${20 + (i % 5) * 15}%` }}
          />
        ))}
      </div>

      {/* Section 1: Dungeon Gate */}
      <div className="h-screen flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="relative mx-auto mb-8">
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -inset-8 rounded-full bg-cyan-500/10 blur-2xl"
            />
            <div
              className="w-40 h-60 md:w-52 md:h-80 rounded-t-full border-2 border-cyan-500/40 mx-auto relative overflow-hidden flex items-center justify-center bg-black/50"
              style={{ boxShadow: "0 0 60px rgba(0,212,255,0.15), inset 0 0 60px rgba(0,212,255,0.08)" }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-6 rounded-t-full opacity-40"
                style={{ background: "conic-gradient(from 0deg, rgba(0,212,255,0.3), transparent, rgba(124,58,237,0.3), transparent, rgba(0,212,255,0.3))" }}
              />
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="w-16 h-16 rounded-full bg-cyan-500/20 blur-lg absolute"
              />
              <span className="relative text-cyan-400/70 text-[10px] font-mono tracking-[0.3em]">E-RANK</span>
            </div>
          </div>

          <motion.p
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-white/50 text-lg md:text-2xl font-light italic"
          >
            &ldquo;You are the weakest hunter...&rdquo;
          </motion.p>
          <motion.p
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-6 text-white/20 text-xs font-mono"
          >
            ↓ SCROLL ↓
          </motion.p>
        </motion.div>
      </div>

      {/* Section 2: System Notification */}
      <div className="h-screen flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full mx-6"
        >
          <div
            className="bg-slate-900/80 border border-cyan-500/30 rounded-lg p-6"
            style={{ boxShadow: "0 0 40px rgba(0,212,255,0.1)" }}
          >
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-cyan-500/20">
              <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-[0.2em]">System Notification</span>
            </div>

            <div className="space-y-4 font-mono text-sm">
              <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} transition={{ delay: 0.2 }} className="text-white/80">
                <span className="text-cyan-400">&gt;</span> Player has met the requirements.
              </motion.p>
              <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} transition={{ delay: 0.5 }} className="text-white/80">
                <span className="text-cyan-400">&gt;</span> Beginning player reawakening...
              </motion.p>
              <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} transition={{ delay: 0.8 }} className="text-yellow-400/90">
                <span className="text-cyan-400">&gt;</span> Class: <span className="text-white font-bold">Shadow Monarch</span>
              </motion.p>
              <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} transition={{ delay: 1.1 }} className="text-white/80">
                <span className="text-cyan-400">&gt;</span> Ability: <span className="text-cyan-300 font-bold">ARISE</span>
              </motion.p>
            </div>

            <div className="mt-5 pt-3 border-t border-cyan-500/20">
              <div className="h-2 rounded-full bg-cyan-900/30 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: false }}
                  transition={{ duration: 2, delay: 0.5 }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                />
              </div>
              <p className="text-[9px] font-mono text-cyan-500/50 mt-2 text-right">AWAKENING: 100%</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Section 3: ARISE */}
      <div className="h-screen flex items-center justify-center relative z-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 1, type: "spring" }}
          className="text-center"
        >
          <motion.h1
            className="text-8xl md:text-[12rem] font-black text-cyan-400 leading-none"
            animate={{
              textShadow: [
                "0 0 20px rgba(0,212,255,0.5), 0 0 60px rgba(0,212,255,0.3)",
                "0 0 40px rgba(0,212,255,0.8), 0 0 100px rgba(0,212,255,0.5), 0 0 160px rgba(124,58,237,0.3)",
                "0 0 20px rgba(0,212,255,0.5), 0 0 60px rgba(0,212,255,0.3)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ARISE
          </motion.h1>
          <p className="text-white/25 text-sm font-mono mt-4 tracking-[0.2em]">
            — Shadow Monarch, Sung Jinwoo
          </p>
        </motion.div>
      </div>

      {/* Section 4: Shadow Army */}
      <div className="h-screen flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Shadow soldiers */}
          <div className="flex items-end justify-center gap-5 md:gap-8 mb-10">
            {[
              { name: "IGRIS", h: 100, color: "from-red-900 to-red-600" },
              { name: "BERU", h: 120, color: "from-green-900 to-green-600" },
              { name: "TANK", h: 90, color: "from-gray-800 to-gray-600" },
              { name: "IRON", h: 110, color: "from-orange-900 to-orange-600" },
              { name: "TUSK", h: 95, color: "from-purple-900 to-purple-600" },
            ].map((soldier, i) => (
              <motion.div
                key={soldier.name}
                initial={{ y: 80, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: false }}
                transition={{ delay: i * 0.12, duration: 0.6, type: "spring" }}
                className="flex flex-col items-center"
              >
                {/* Soldier body */}
                <div
                  className={`w-12 md:w-16 rounded-t-xl bg-gradient-to-t ${soldier.color} border border-white/10 flex flex-col items-center justify-start pt-3 relative`}
                  style={{ height: `${soldier.h}px`, boxShadow: "0 0 20px rgba(0,0,0,0.5), 0 0 10px rgba(0,212,255,0.1)" }}
                >
                  {/* Eyes */}
                  <div className="flex gap-2">
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4], boxShadow: ["0 0 3px #00d4ff", "0 0 10px #00d4ff", "0 0 3px #00d4ff"] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      className="w-2 h-2 rounded-full bg-cyan-400"
                    />
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4], boxShadow: ["0 0 3px #00d4ff", "0 0 10px #00d4ff", "0 0 3px #00d4ff"] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      className="w-2 h-2 rounded-full bg-cyan-400"
                    />
                  </div>
                  {/* Shadow aura */}
                  <motion.div
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    className="absolute -inset-1 rounded-t-xl bg-cyan-500/10 blur-sm"
                  />
                </div>
                <p className="text-[8px] md:text-[9px] font-mono text-cyan-500/50 mt-2 tracking-widest">{soldier.name}</p>
              </motion.div>
            ))}
          </div>

          <p className="text-white/60 text-lg md:text-xl font-light">
            Your shadow army awaits, <span className="text-cyan-400 font-semibold">Monarch</span>.
          </p>
          <p className="text-white/25 text-xs font-mono mt-3 tracking-wider">
            423+ TITLES • MOVIES • ANIME • TV SHOWS
          </p>
        </motion.div>
      </div>

      {/* Section 5: Enter */}
      <div className="h-screen flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center"
        >
          <motion.div
            animate={{ boxShadow: [
              "0 0 30px rgba(0,212,255,0.3)",
              "0 0 60px rgba(0,212,255,0.5), 0 0 100px rgba(124,58,237,0.2)",
              "0 0 30px rgba(0,212,255,0.3)",
            ]}}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center mb-8"
          >
            <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-black mb-3">
            <span className="text-cyan-400">Priisma</span>
            <span className="text-white">Tv</span>
          </h2>
          <p className="text-white/25 text-xs font-mono tracking-[0.3em] mb-10">PREMIUM STREAMING HUB</p>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0,212,255,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="px-12 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-black text-xl shadow-2xl shadow-cyan-500/25 transition-shadow"
          >
            ENTER THE SHADOW REALM ⚔️
          </motion.button>

          <p className="mt-8 text-white/10 text-[10px] font-mono tracking-wider">
            CTRL+K SEARCH • TYPE &quot;ARISE&quot; • PRESS ? FOR SHORTCUTS
          </p>
        </motion.div>
      </div>
    </div>
  );
}
