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
  const [isFocused, setIsFocused] = useState<string | null>(null);

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
    const { data: ownerData } = await supabase.from("owner").select("*").eq("username", displayName).eq("password", code).single();

    if (ownerData) {
      setAuthenticated(true);
      sessionStorage.setItem("priismatv_auth", "true");
      sessionStorage.setItem("priismatv_user", displayName);
      sessionStorage.setItem("priismatv_owner", "true");
      localStorage.setItem("priismatv_remember", "true");
      localStorage.setItem("priismatv_user", displayName);
      localStorage.setItem("priismatv_is_owner", "true");
      logVisit(displayName);
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
    } else {
      setPasswordError(true);
      setPassword("");
      setTimeout(() => setPasswordError(false), 2500);
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

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 600);
    const t3 = setTimeout(() => setPhase(3), 1200);
    const t4 = setTimeout(() => setPhase(4), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    const autoEnter = setTimeout(() => {
      setExiting(true);
      setTimeout(() => router.push("/home"), 800);
    }, 2000);
    return () => clearTimeout(autoEnter);
  }, [authenticated, router]);

  // === LOGIN SCREEN ===
  if (!authenticated) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#020204] flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/[0.03] blur-[150px]" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
        </div>

        {/* Floating dots */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -40, 0], opacity: [0, 0.4, 0] }}
              transition={{ duration: 5 + (i % 5) * 2, repeat: Infinity, delay: i * 0.4 }}
              className="absolute w-[1px] h-[1px] rounded-full bg-white"
              style={{ left: `${5 + i * 5}%`, top: `${20 + (i % 6) * 12}%`, boxShadow: "0 0 3px rgba(255,255,255,0.5)" }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center px-6 max-w-sm w-full"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", bounce: 0.3 }}
            className="mb-8"
          >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-red-800 flex items-center justify-center shadow-[0_10px_50px_rgba(229,9,20,0.3)] relative overflow-hidden">
              <svg className="w-9 h-9 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
            </div>
          </motion.div>

          <h2 className="text-3xl font-black text-white mb-1 tracking-tight">
            <span className="text-primary">Priisma</span>Tv
          </h2>
          <p className="text-white/15 text-[10px] font-medium tracking-[0.4em] uppercase mb-8">Premium Streaming</p>

          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
              isFocused === "name" ? "ring-1 ring-primary/30 shadow-[0_0_20px_rgba(229,9,20,0.1)]" : "ring-1 ring-white/[0.04]"
            }`}>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onFocus={() => setIsFocused("name")}
                onBlur={() => setIsFocused(null)}
                placeholder="Your name"
                className="w-full px-5 py-4 bg-white/[0.02] text-sm text-white placeholder:text-white/15 focus:outline-none"
              />
            </div>
            <div className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
              passwordError ? "ring-1 ring-red-500/50" : isFocused === "code" ? "ring-1 ring-primary/30 shadow-[0_0_20px_rgba(229,9,20,0.1)]" : "ring-1 ring-white/[0.04]"
            }`}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocused("code")}
                onBlur={() => setIsFocused(null)}
                placeholder="Access code"
                className="w-full px-5 py-4 pr-16 bg-white/[0.02] text-sm text-white placeholder:text-white/15 focus:outline-none"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/15 hover:text-white/40 text-[10px] font-medium uppercase tracking-wider">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-primary text-white font-bold text-sm transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_10px_30px_rgba(229,9,20,0.3)] magnetic-btn mt-1"
            >
              Enter
            </button>
          </form>

          <AnimatePresence>
            {passwordError && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-red-400/80 text-xs mt-4 font-light">
                Invalid code. Contact the owner for access.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  // === SPLASH SCREEN ===
  return (
    <div className="fixed inset-0 z-[200] bg-[#020204] overflow-hidden select-none">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div animate={{ opacity: [0.02, 0.05, 0.02] }} transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-primary blur-[250px]" />
      </div>

      <AnimatePresence>
        {exiting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="fixed inset-0 bg-[#04040a] z-[100]" />
        )}
      </AnimatePresence>

      <motion.div animate={{ opacity: exiting ? 0 : 1, scale: exiting ? 0.95 : 1 }} transition={{ duration: 0.5 }}
        className="relative z-30 h-full flex flex-col items-center justify-center px-6">

        {/* Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
          animate={phase >= 1 ? { scale: 1, opacity: 1, rotateY: 0 } : {}}
          transition={{ duration: 0.8, type: "spring", bounce: 0.25 }}
          className="mb-8"
        >
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary via-red-600 to-red-800 flex items-center justify-center shadow-[0_20px_80px_rgba(229,9,20,0.3)] relative overflow-hidden">
            <svg className="w-14 h-14 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <motion.div initial={{ x: "-100%" }} animate={phase >= 2 ? { x: "200%" } : {}} transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
          </div>
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-3xl border border-primary/30" style={{ margin: "-4px" }} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
          className="text-6xl md:text-8xl font-black tracking-tight mb-3"
        >
          <span className="text-primary">PRIISMA</span><span className="text-white">TV</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={phase >= 3 ? { opacity: 1 } : {}}
          className="text-white/15 text-[11px] font-medium tracking-[0.5em] uppercase mb-10">
          Premium Streaming
        </motion.p>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={phase >= 3 ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
          className="flex items-center gap-10">
          {[{ value: "423+", label: "Titles" }, { value: "4K", label: "Quality" }, { value: "∞", label: "Free" }].map((stat, i) => (
            <motion.div key={stat.label} initial={{ scale: 0.8, opacity: 0 }}
              animate={phase >= 3 ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
              className="text-center">
              <p className="text-3xl font-black text-white">{stat.value}</p>
              <p className="text-[9px] tracking-[0.25em] text-white/20 mt-1 uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Loading bar */}
        <motion.div initial={{ opacity: 0 }} animate={phase >= 4 ? { opacity: 1 } : {}}
          className="absolute bottom-12 w-48">
          <div className="h-[2px] rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-red-400"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
