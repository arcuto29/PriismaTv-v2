"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function WelcomePage() {
  const router = useRouter();
  const [phase, setPhase] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [userName, setUserName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const MASTER_PASSWORD = "shadowmonarch";

  useEffect(() => {
    if (sessionStorage.getItem("priismatv_auth") === "true" || localStorage.getItem("priismatv_remember") === "true") {
      setAuthenticated(true);
      const user = sessionStorage.getItem("priismatv_user") || localStorage.getItem("priismatv_user") || "Guest";
      sessionStorage.setItem("priismatv_user", user);
      if (localStorage.getItem("priismatv_is_owner") === "true") sessionStorage.setItem("priismatv_owner", "true");
    }
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = password.trim();
    const displayName = userName.trim() || "Guest";
    const { supabase } = await import("@/lib/supabase");
    const { data: ownerData } = await supabase.from("owner").select("*").eq("username", displayName).eq("password", code).single();
    if (ownerData) { setAuthenticated(true); sessionStorage.setItem("priismatv_auth", "true"); sessionStorage.setItem("priismatv_user", displayName); sessionStorage.setItem("priismatv_owner", "true"); localStorage.setItem("priismatv_remember", "true"); localStorage.setItem("priismatv_user", displayName); localStorage.setItem("priismatv_is_owner", "true"); logVisit(displayName); return; }
    if (code === MASTER_PASSWORD) { setAuthenticated(true); sessionStorage.setItem("priismatv_auth", "true"); sessionStorage.setItem("priismatv_user", displayName); sessionStorage.setItem("priismatv_owner", "true"); localStorage.setItem("priismatv_remember", "true"); localStorage.setItem("priismatv_user", displayName); localStorage.setItem("priismatv_is_owner", "true"); logVisit(displayName); return; }
    const valid = await validateInviteCode(code, displayName);
    if (valid) { setAuthenticated(true); sessionStorage.setItem("priismatv_auth", "true"); sessionStorage.setItem("priismatv_user", displayName); localStorage.setItem("priismatv_remember", "true"); localStorage.setItem("priismatv_user", displayName); logVisit(displayName, code); }
    else { setPasswordError(true); setPassword(""); setTimeout(() => setPasswordError(false), 2000); }
  };

  const validateInviteCode = async (code: string, name: string) => {
    const { supabase } = await import("@/lib/supabase");
    const { data } = await supabase.from("invite_codes").select("*").eq("code", code.toUpperCase()).eq("is_used", false).single();
    if (data) { await supabase.from("invite_codes").update({ is_used: true, used_by: name, used_at: new Date().toISOString() }).eq("id", data.id); return true; }
    return false;
  };

  const logVisit = async (name: string, inviteCode?: string) => {
    const { supabase } = await import("@/lib/supabase");
    const { data: existing } = await supabase.from("visitors").select("*").eq("name", name).single();
    if (existing) { await supabase.from("visitors").update({ last_seen: new Date().toISOString(), visit_count: existing.visit_count + 1 }).eq("id", existing.id); }
    else { await supabase.from("visitors").insert({ name, invite_code: inviteCode || null }); }
  };

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1000);
    const t3 = setTimeout(() => setPhase(3), 2000);
    const t4 = setTimeout(() => setPhase(4), 3000);
    const t5 = setTimeout(() => setPhase(5), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, []);

  // === LOGIN SCREEN ===
  if (!authenticated) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#020204] flex items-center justify-center overflow-hidden">
        {/* Jin-Woo GIF background */}
        <div className="absolute inset-0">
          <img src="/jinwoo1.gif" alt="" className="absolute inset-0 w-full h-full object-cover opacity-90" style={{ objectPosition: "center top" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020204] via-[#020204]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020204]/70 via-transparent to-[#020204]/70" />
        </div>

        {/* Energy particles */}
        <div className="absolute inset-0 pointer-events-none z-[2]">
          {[...Array(20)].map((_, i) => (
            <motion.div key={i}
              animate={{ y: [0, -(40 + Math.random() * 80), 0], opacity: [0, 0.7, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 2.5 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
              className="absolute rounded-full"
              style={{ left: `${15 + Math.random() * 70}%`, top: `${30 + Math.random() * 50}%`, width: `${2 + Math.random() * 3}px`, height: `${2 + Math.random() * 3}px`, background: i % 2 === 0 ? "#7c3aed" : "#06b6d4", boxShadow: `0 0 ${10 + Math.random() * 15}px ${i % 2 === 0 ? "#7c3aed" : "#06b6d4"}` }}
            />
          ))}
        </div>

        {/* Login Form - glass panel */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 px-8 py-10 max-w-[380px] w-full mx-4 rounded-2xl border border-purple-500/20 backdrop-blur-xl"
          style={{ background: "rgba(8, 4, 20, 0.7)", boxShadow: "0 0 80px rgba(124, 58, 237, 0.1), 0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)" }}
        >
          {/* Glowing top border */}
          <div className="absolute top-0 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />

          {/* Logo */}
          <motion.div
            animate={{ boxShadow: ["0 0 30px rgba(124,58,237,0.3)", "0 0 50px rgba(124,58,237,0.5)", "0 0 30px rgba(124,58,237,0.3)"] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="w-14 h-14 mx-auto mb-5 rounded-xl bg-gradient-to-br from-purple-600/40 to-cyan-500/20 border border-purple-500/40 flex items-center justify-center"
          >
            <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </motion.div>

          {/* Title */}
          <h2 className="text-center text-3xl font-black mb-1 tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent" style={{ textShadow: "none" }}>PRIISMA</span>
            <span className="text-white/90">TV</span>
          </h2>
          <p className="text-center text-purple-300/40 text-[10px] font-bold tracking-[0.4em] uppercase mb-7">Shadow Monarch&apos;s Domain</p>

          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <input
              type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Hunter name..."
              className="w-full px-4 py-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-sm text-white placeholder:text-purple-300/20 focus:outline-none focus:border-purple-500/50 focus:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Access code..."
                className={`w-full px-4 py-3.5 pr-14 rounded-xl bg-purple-950/30 border text-sm text-white placeholder:text-purple-300/20 focus:outline-none focus:border-purple-500/50 focus:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all ${passwordError ? "border-red-500/60" : "border-purple-500/20"}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400/30 hover:text-purple-300/60 text-[10px] font-bold tracking-wider uppercase transition-colors">{showPassword ? "HIDE" : "SHOW"}</button>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(124, 58, 237, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 text-white font-black text-sm tracking-[0.15em] uppercase transition-all shadow-[0_4px_30px_rgba(124,58,237,0.3)]"
            >
              A R I S E
            </motion.button>
          </form>

          {passwordError && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400/80 text-[11px] mt-3 text-center font-medium">
              Access denied. Only hunters may enter.
            </motion.p>
          )}
        </motion.div>
      </div>
    );
  }

  // === SPLASH SCREEN ===
  return (
    <div className="fixed inset-0 z-[200] bg-[#020204] overflow-hidden select-none">
      {/* Jin-Woo GIF - full brightness */}
      <motion.div initial={{ scale: 1.05, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5 }} className="absolute inset-0">
        <img src="/jinwoo1.gif" alt="" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: "center top" }} />
      </motion.div>

      {/* Bottom gradient only - for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020204] via-[#020204]/40 to-transparent z-[1]" />

      {/* Energy particles rising */}
      <div className="absolute inset-0 pointer-events-none z-[3]">
        {[...Array(35)].map((_, i) => (
          <motion.div key={i}
            initial={{ opacity: 0 }}
            animate={phase >= 2 ? { y: [0, -(120 + Math.random() * 200)], opacity: [0, 0.9, 0], x: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 80] } : {}}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
            className="absolute rounded-full"
            style={{ left: `${20 + Math.random() * 60}%`, bottom: `${5 + Math.random() * 25}%`, width: `${1 + Math.random() * 3}px`, height: `${1 + Math.random() * 3}px`, background: i % 3 === 0 ? "#7c3aed" : i % 3 === 1 ? "#06b6d4" : "#a855f7", boxShadow: `0 0 ${8 + Math.random() * 12}px ${i % 3 === 0 ? "#7c3aed" : "#06b6d4"}` }}
          />
        ))}
      </div>

      {/* Aura burst */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={phase >= 3 ? { scale: [0.5, 2], opacity: [0.4, 0] } : {}}
        transition={{ duration: 2 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full z-[2]"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.5) 0%, rgba(6,182,212,0.2) 40%, transparent 70%)" }}
      />

      {/* Fade exit */}
      <AnimatePresence>
        {exiting && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="fixed inset-0 bg-[#020204] z-[100]" />}
      </AnimatePresence>

      {/* Content */}
      <motion.div animate={{ opacity: exiting ? 0 : 1 }} className="relative z-30 h-full flex flex-col items-center justify-end pb-20 md:pb-28 px-6">

        {/* Title - INSANE styled */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={phase >= 2 ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="mb-3 text-center">
          <h1 className="text-6xl md:text-9xl font-black tracking-[-0.05em] leading-none">
            {"PRIISMA".split("").map((letter, i) => (
              <motion.span key={i}
                initial={{ y: 60, opacity: 0, rotateX: -90 }}
                animate={phase >= 2 ? { y: 0, opacity: 1, rotateX: 0 } : {}}
                transition={{ delay: i * 0.07, duration: 0.6, type: "spring", bounce: 0.3 }}
                className="inline-block bg-gradient-to-b from-cyan-300 via-purple-400 to-purple-600 bg-clip-text text-transparent"
                style={{ filter: "drop-shadow(0 0 20px rgba(124,58,237,0.6)) drop-shadow(0 0 40px rgba(6,182,212,0.3))" }}
              >{letter}</motion.span>
            ))}
            {"TV".split("").map((letter, i) => (
              <motion.span key={`tv-${i}`}
                initial={{ y: 60, opacity: 0 }}
                animate={phase >= 2 ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.07, duration: 0.6, type: "spring" }}
                className="inline-block text-white"
                style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))" }}
              >{letter}</motion.span>
            ))}
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : {}}
          className="text-purple-300/50 text-[11px] md:text-xs font-bold tracking-[0.5em] uppercase mb-8"
          style={{ textShadow: "0 0 15px rgba(124,58,237,0.5)" }}
        >
          SHADOW MONARCH&apos;S COLLECTION
        </motion.p>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={phase >= 4 ? { opacity: 1, y: 0 } : {}} className="flex items-center gap-8 md:gap-12 mb-10">
          {[{ value: "423+", label: "TITLES" }, { value: "4K", label: "QUALITY" }, { value: "∞", label: "FREE" }].map((stat, i) => (
            <motion.div key={stat.label}
              initial={{ scale: 0 }}
              animate={phase >= 4 ? { scale: 1 } : {}}
              transition={{ delay: 0.2 + i * 0.1, type: "spring", bounce: 0.4 }}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-black text-white" style={{ textShadow: "0 0 20px rgba(255,255,255,0.2)" }}>{stat.value}</p>
              <p className="text-[8px] tracking-[0.3em] text-purple-400/40 mt-1 font-bold uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CONTINUE button */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={phase >= 5 ? { opacity: 1, y: 0 } : {}}>
          <motion.button
            onClick={() => { setExiting(true); setTimeout(() => router.push("/home"), 800); }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(124, 58, 237, 0.5), 0 0 100px rgba(6, 182, 212, 0.2)" }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 text-white font-black text-sm tracking-[0.2em] uppercase shadow-[0_4px_40px_rgba(124,58,237,0.4)] border border-purple-400/20"
          >
            CONTINUE
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
