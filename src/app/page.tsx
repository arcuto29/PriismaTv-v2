"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function WelcomePage() {
  const router = useRouter();
  const [phase, setPhase] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [glitch, setGlitch] = useState(false);
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
      if (localStorage.getItem("priismatv_is_owner") === "true") {
        sessionStorage.setItem("priismatv_owner", "true");
      }
    }
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = password.trim();
    const displayName = userName.trim() || "Guest";

    const { supabase } = await import("@/lib/supabase");
    const { data: ownerData } = await supabase
      .from("owner")
      .select("*")
      .eq("username", displayName)
      .eq("password", code)
      .single();

    if (ownerData) {
      setAuthenticated(true);
      sessionStorage.setItem("priismatv_auth", "true");
      sessionStorage.setItem("priismatv_user", displayName);
      sessionStorage.setItem("priismatv_owner", "true");
      localStorage.setItem("priismatv_remember", "true");
      localStorage.setItem("priismatv_user", displayName);
      localStorage.setItem("priismatv_is_owner", "true");
      logVisit(displayName);
      setPasswordError(false);
      return;
    }

    if (code === MASTER_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem("priismatv_auth", "true");
      sessionStorage.setItem("priismatv_user", displayName);
      sessionStorage.setItem("priismatv_owner", "true");
      localStorage.setItem("priismatv_remember", "true");
      localStorage.setItem("priismatv_user", displayName);
      localStorage.setItem("priismatv_is_owner", "true");
      logVisit(displayName);
      setPasswordError(false);
      return;
    }

    const valid = await validateInviteCode(code, displayName);
    if (valid) {
      setAuthenticated(true);
      sessionStorage.setItem("priismatv_auth", "true");
      sessionStorage.setItem("priismatv_user", displayName);
      localStorage.setItem("priismatv_remember", "true");
      localStorage.setItem("priismatv_user", displayName);
      logVisit(displayName, code);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPassword("");
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  const validateInviteCode = async (code: string, name: string) => {
    const { supabase } = await import("@/lib/supabase");
    const { data } = await supabase.from("invite_codes").select("*").eq("code", code.toUpperCase()).eq("is_used", false).single();
    if (data) {
      await supabase.from("invite_codes").update({ is_used: true, used_by: name, used_at: new Date().toISOString() }).eq("id", data.id);
      return true;
    }
    return false;
  };

  const logVisit = async (name: string, inviteCode?: string) => {
    const { supabase } = await import("@/lib/supabase");
    const { data: existing } = await supabase.from("visitors").select("*").eq("name", name).single();
    if (existing) {
      await supabase.from("visitors").update({ last_seen: new Date().toISOString(), visit_count: existing.visit_count + 1 }).eq("id", existing.id);
    } else {
      await supabase.from("visitors").insert({ name, invite_code: inviteCode || null });
    }
  };

  const fullText = "> ARISE...";

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 800);
    const t3 = setTimeout(() => setPhase(3), 1600);
    const t4 = setTimeout(() => setPhase(4), 2500);
    const t5 = setTimeout(() => setPhase(5), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, []);

  useEffect(() => {
    if (phase < 2) return;
    let i = 0;
    let cancelled = false;
    const type = () => {
      if (cancelled || i >= fullText.length) return;
      i++;
      setTypedText(fullText.slice(0, i));
      setTimeout(type, 80);
    };
    type();
    return () => { cancelled = true; };
  }, [phase >= 2]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 80 + Math.random() * 80);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    const autoEnter = setTimeout(() => {
      setExiting(true);
      setTimeout(() => router.push("/home"), 800);
    }, 7000);
    return () => clearTimeout(autoEnter);
  }, [authenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  // === LOGIN SCREEN WITH JIN-WOO ===
  if (!authenticated) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#020204] flex items-center justify-center overflow-hidden">
        {/* Jin-Woo Background GIF */}
        <div className="absolute inset-0">
          <img
            src="/jinwoo1.gif"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            style={{ objectPosition: "center top" }}
          />
          {/* Minimal overlay - just enough for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020204]/90 via-transparent to-transparent" />
        </div>

        {/* Aura particles - purple/blue energy */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -(30 + Math.random() * 60), 0],
                x: [0, (Math.random() - 0.5) * 40, 0],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
              className="absolute rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${30 + Math.random() * 50}%`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                background: i % 3 === 0 ? "#7c3aed" : i % 3 === 1 ? "#00d4ff" : "#a855f7",
                boxShadow: `0 0 ${8 + Math.random() * 12}px ${i % 3 === 0 ? "#7c3aed" : "#00d4ff"}`,
              }}
            />
          ))}
        </div>

        {/* Rising aura effect from bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[60%] pointer-events-none overflow-hidden">
          <motion.div
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-full h-full bg-gradient-to-t from-purple-900/20 via-blue-900/10 to-transparent blur-2xl"
          />
          <motion.div
            animate={{ y: [0, -20, 0], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, delay: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-cyan-900/15 to-transparent blur-3xl"
          />
        </div>

        {/* Scanning line */}
        <motion.div
          initial={{ top: "-2%" }}
          animate={{ top: "102%" }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent z-[3] pointer-events-none"
        />

        {/* Corner HUD marks */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/30 z-20" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/30 z-20" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/30 z-20" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/30 z-20" />

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center px-6 max-w-sm w-full"
        >
          {/* Logo with aura glow */}
          <motion.div
            animate={{
              boxShadow: [
                "0 0 20px rgba(124,58,237,0.3), 0 0 60px rgba(0,212,255,0.1)",
                "0 0 40px rgba(124,58,237,0.5), 0 0 80px rgba(0,212,255,0.2)",
                "0 0 20px rgba(124,58,237,0.3), 0 0 60px rgba(0,212,255,0.1)",
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-600/30 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center backdrop-blur-sm"
          >
            <svg className="w-7 h-7 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </motion.div>

          <h2 className="text-2xl font-black text-white mb-1">
            <span className="text-primary">Priisma</span>Tv
          </h2>
          <p className="text-white/30 text-xs font-mono mb-6">ENTER YOUR NAME & ACCESS CODE</p>

          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name..."
              className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all backdrop-blur-sm"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Access code..."
                className={`w-full px-4 py-3.5 pr-12 rounded-xl bg-white/5 border text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all backdrop-blur-sm ${
                  passwordError ? "border-red-500" : "border-white/10"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-xs font-mono"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-primary text-white font-bold text-sm hover:opacity-90 transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]"
            >
              ARISE
            </button>
          </form>

          {passwordError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-xs mt-3 font-mono"
            >
              Invalid code. Contact the Shadow Monarch for access.
            </motion.p>
          )}

          <p className="text-white/10 text-[9px] font-mono mt-8">priismatv.com</p>
        </motion.div>
      </div>
    );
  }

  // === AUTHENTICATED SPLASH - JIN-WOO ARISE ===
  return (
    <div className={`fixed inset-0 z-[200] bg-[#020204] overflow-hidden select-none ${glitch ? "translate-x-[1px] skew-x-[0.2deg]" : ""}`}
      style={{ transition: glitch ? "none" : "transform 0.1s" }}>

      {/* Jin-Woo background GIF - splash */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.9 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img
          src="/jinwoo1.gif"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center top" }}
        />
      </motion.div>

      {/* Minimal overlay - just darken the bottom for text */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020204]/80 via-transparent to-transparent z-[1]" />

      {/* Aura burst effect */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={phase >= 3 ? { scale: 1.5, opacity: [0, 0.3, 0] } : {}}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full z-[2]"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.4) 0%, rgba(0,212,255,0.1) 40%, transparent 70%)" }}
      />

      {/* Rising energy particles */}
      <div className="absolute inset-0 pointer-events-none z-[3]">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            animate={phase >= 2 ? {
              y: [0, -(100 + Math.random() * 200)],
              opacity: [0, 0.8, 0],
              x: [(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 60],
            } : {}}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeOut",
            }}
            className="absolute rounded-full"
            style={{
              left: `${30 + Math.random() * 40}%`,
              bottom: `${10 + Math.random() * 30}%`,
              width: `${1 + Math.random() * 3}px`,
              height: `${1 + Math.random() * 3}px`,
              background: i % 2 === 0 ? "#7c3aed" : "#00d4ff",
              boxShadow: `0 0 ${6 + Math.random() * 10}px ${i % 2 === 0 ? "#7c3aed" : "#00d4ff"}`,
            }}
          />
        ))}
      </div>

      {/* Fog from bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none z-[2] overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="w-full h-full bg-gradient-to-t from-purple-900/20 via-blue-900/5 to-transparent blur-xl"
        />
      </div>

      {/* Glitch lines */}
      {glitch && (
        <div className="absolute inset-0 pointer-events-none z-[10]">
          {[20, 45, 70].map((top) => (
            <div key={top} className="absolute left-0 right-0 h-[1px] bg-primary/40" style={{ top: `${top}%` }} />
          ))}
        </div>
      )}

      {/* Corner HUD */}
      <motion.div initial={{ opacity: 0 }} animate={phase >= 1 ? { opacity: 1 } : {}} className="absolute top-5 left-5 z-20">
        <div className="w-10 h-10 border-l-2 border-t-2 border-purple-500/40" />
        <p className="text-[8px] font-mono text-purple-400/40 mt-1">SYS.ONLINE</p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={phase >= 1 ? { opacity: 1 } : {}} className="absolute top-5 right-5 z-20">
        <div className="w-10 h-10 border-r-2 border-t-2 border-purple-500/40 ml-auto" />
        <p className="text-[8px] font-mono text-purple-400/40 mt-1 text-right">V2.0</p>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={phase >= 1 ? { opacity: 1 } : {}} className="absolute bottom-5 left-5 z-20">
        <div className="w-10 h-10 border-l-2 border-b-2 border-purple-500/40" />
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={phase >= 1 ? { opacity: 1 } : {}} className="absolute bottom-5 right-5 z-20">
        <div className="w-10 h-10 border-r-2 border-b-2 border-purple-500/40 ml-auto" />
      </motion.div>

      {/* Fade exit */}
      <AnimatePresence>
        {exiting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 bg-background z-[100]"
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <motion.div
        animate={{ opacity: exiting ? 0 : 1, scale: exiting ? 0.95 : 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-30 h-full flex flex-col items-center justify-center px-6"
      >
        {/* Typing text - ARISE */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={phase >= 2 ? { opacity: 1 } : {}}
          className="text-purple-400/70 text-xs font-mono mb-6 h-5"
        >
          {typedText}<span className="animate-pulse text-primary">|</span>
        </motion.p>

        {/* Logo with purple aura */}
        <motion.div
          initial={{ scale: 0, rotateY: 180, opacity: 0 }}
          animate={phase >= 2 ? { scale: 1, rotateY: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          className="mb-6 relative"
        >
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-purple-600 via-blue-500 to-primary flex items-center justify-center shadow-[0_0_80px_rgba(124,58,237,0.4)] relative overflow-hidden">
            <svg className="w-12 h-12 md:w-16 md:h-16 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <motion.div initial={{ x: "-100%" }} animate={phase >= 3 ? { x: "200%" } : {}} transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
          </div>
          {/* Aura ring */}
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-3xl border border-purple-500/50"
          />
          <motion.div
            animate={{ scale: [1.2, 1.8, 1.2], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
            className="absolute inset-0 rounded-3xl border border-cyan-400/30"
          />
        </motion.div>

        {/* Title - PRIISMATV with glow */}
        <motion.div initial={{ opacity: 0 }} animate={phase >= 3 ? { opacity: 1 } : {}} className="mb-2">
          <h1 className={`text-5xl md:text-8xl font-black tracking-tighter ${glitch ? "skew-x-1" : ""}`}>
            {"PRIISMA".split("").map((letter, i) => (
              <motion.span key={i} initial={{ y: 50, opacity: 0, rotateX: -90 }}
                animate={phase >= 3 ? { y: 0, opacity: 1, rotateX: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.5, type: "spring" }}
                className="inline-block text-primary"
                style={{ textShadow: "0 0 30px rgba(0,212,255,0.5), 0 0 60px rgba(124,58,237,0.3)" }}>
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
          [ SHADOW MONARCH&apos;S COLLECTION ]
        </motion.p>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={phase >= 4 ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}
          className="flex items-center gap-6 md:gap-10 mb-10">
          {[{ value: "423+", label: "TITLES" }, { value: "4K", label: "QUALITY" }, { value: "∞", label: "FREE" }].map((stat, i) => (
            <motion.div key={stat.label} initial={{ scale: 0, rotateZ: -10 }}
              animate={phase >= 4 ? { scale: 1, rotateZ: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.12, type: "spring", bounce: 0.4 }}
              className="text-center">
              <p className="text-3xl md:text-4xl font-black text-white">{stat.value}</p>
              <p className="text-[8px] md:text-[9px] tracking-[0.25em] text-white/25 mt-1 font-mono">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Continue button - appears after 3s */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={phase >= 5 ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <button
            onClick={() => { setExiting(true); setTimeout(() => router.push("/home"), 800); }}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-primary text-white font-bold text-sm hover:opacity-90 transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:scale-105 active:scale-95"
          >
            CONTINUE →
          </button>
        </motion.div>

        {/* Bottom text */}
        <motion.p initial={{ opacity: 0 }} animate={phase >= 5 ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
          className="absolute bottom-8 text-[9px] font-mono text-white/10 tracking-widest">
          priismatv.com
        </motion.p>
      </motion.div>
    </div>
  );
}
