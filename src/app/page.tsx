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

  // Phase animations
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 800);
    const t3 = setTimeout(() => setPhase(3), 1500);
    const t4 = setTimeout(() => setPhase(4), 2200);
    const t5 = setTimeout(() => setPhase(5), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, []);

  // Auto-enter after authenticated
  useEffect(() => {
    if (!authenticated) return;
    const autoEnter = setTimeout(() => {
      setExiting(true);
      setTimeout(() => router.push("/home"), 900);
    }, 2800);
    return () => clearTimeout(autoEnter);
  }, [authenticated, router]);

  // Login screen
  if (!authenticated) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#030305] flex items-center justify-center overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0">
          {/* Radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-[120px]" />
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-primary/[0.02] blur-[80px]" />
          {/* Grid pattern (very subtle) */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `linear-gradient(rgba(232, 180, 104, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(232, 180, 104, 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }} />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 4 + (i % 4) * 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
              className="absolute w-[1px] h-[1px] rounded-full bg-primary"
              style={{
                left: `${8 + i * 8}%`,
                top: `${20 + (i % 5) * 15}%`,
                boxShadow: '0 0 4px rgba(232, 180, 104, 0.5)',
              }}
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
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-[0_8px_40px_rgba(232,180,104,0.15)]">
              <svg className="w-7 h-7 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-black text-white mb-1 tracking-tight">
              <span className="text-primary">Priisma</span>Tv
            </h2>
            <p className="text-white/20 text-[10px] font-medium tracking-[0.3em] uppercase mb-8">
              Premium Streaming Experience
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onSubmit={handlePasswordSubmit}
            className="space-y-3"
          >
            <div className={`relative rounded-xl transition-all duration-300 ${
              isFocused === 'name'
                ? 'shadow-[0_0_0_1px_rgba(232,180,104,0.3),0_4px_20px_rgba(0,0,0,0.3)]'
                : 'shadow-[0_0_0_1px_rgba(255,255,255,0.04)]'
            }`}>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onFocus={() => setIsFocused('name')}
                onBlur={() => setIsFocused(null)}
                placeholder="Your name"
                className="w-full px-5 py-4 rounded-xl bg-white/[0.03] text-sm text-white placeholder:text-white/15 focus:outline-none transition-all font-light"
              />
            </div>

            <div className={`relative rounded-xl transition-all duration-300 ${
              passwordError
                ? 'shadow-[0_0_0_1px_rgba(239,68,68,0.5)]'
                : isFocused === 'code'
                  ? 'shadow-[0_0_0_1px_rgba(232,180,104,0.3),0_4px_20px_rgba(0,0,0,0.3)]'
                  : 'shadow-[0_0_0_1px_rgba(255,255,255,0.04)]'
            }`}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocused('code')}
                onBlur={() => setIsFocused(null)}
                placeholder="Access code"
                className="w-full px-5 py-4 pr-16 rounded-xl bg-white/[0.03] text-sm text-white placeholder:text-white/15 focus:outline-none transition-all font-light"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors text-[10px] font-medium tracking-wider uppercase"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-black font-bold text-sm transition-all duration-300 hover:shadow-[0_8px_30px_rgba(232,180,104,0.25)] hover:scale-[1.01] active:scale-[0.99] mt-1"
            >
              Enter
            </button>
          </motion.form>

          {/* Error message */}
          <AnimatePresence>
            {passwordError && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-red-400/80 text-xs mt-4 font-light"
              >
                Invalid code. Contact the owner for access.
              </motion.p>
            )}
          </AnimatePresence>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-white/[0.06] text-[9px] font-medium mt-12 tracking-widest uppercase"
          >
            priismatv.com
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Authenticated splash screen
  return (
    <div className="fixed inset-0 z-[200] bg-[#030305] overflow-hidden select-none">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary blur-[200px]"
        />
      </div>

      {/* Scanning line */}
      <motion.div
        initial={{ top: "-2%" }}
        animate={{ top: "102%" }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent z-[3] pointer-events-none"
      />

      {/* Minimal grid floor */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={phase >= 1 ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="absolute bottom-0 left-0 right-0 h-[30%] overflow-hidden z-[3]"
        style={{ perspective: "500px" }}
      >
        <div className="w-full h-full origin-bottom" style={{
          transform: "rotateX(60deg)",
          backgroundImage: "linear-gradient(rgba(232, 180, 104, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232, 180, 104, 0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
      </motion.div>

      {/* Smooth fade exit */}
      <AnimatePresence>
        {exiting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#06060a] z-[100]"
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <motion.div
        animate={{ opacity: exiting ? 0 : 1, scale: exiting ? 0.97 : 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-30 h-full flex flex-col items-center justify-center px-6"
      >
        {/* Logo reveal */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={phase >= 2 ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
          className="mb-8 relative"
        >
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br from-primary/90 via-primary/70 to-primary/50 flex items-center justify-center shadow-[0_20px_80px_rgba(232,180,104,0.2)] relative overflow-hidden">
            <svg className="w-12 h-12 md:w-14 md:h-14 text-black relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            {/* Shine sweep */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={phase >= 3 ? { x: "200%" } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12"
            />
          </div>
          {/* Breathing ring */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-0 rounded-3xl border border-primary/30"
          />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : {}}
          className="mb-3"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tight">
            <span className="text-primary">PRIISMA</span>
            <span className="text-white">TV</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
          className="text-white/20 text-[11px] font-medium tracking-[0.4em] uppercase mb-10"
        >
          Premium Streaming
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={phase >= 4 ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-8 md:gap-12"
        >
          {[{ value: "423+", label: "Titles" }, { value: "HD", label: "Quality" }, { value: "∞", label: "Free" }].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={phase >= 4 ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.1, type: "spring", bounce: 0.3 }}
              className="text-center"
            >
              <p className="text-2xl md:text-3xl font-black text-white/90">{stat.value}</p>
              <p className="text-[9px] tracking-[0.2em] text-white/20 mt-1 font-medium uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom URL */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={phase >= 5 ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="absolute bottom-8 text-[9px] font-medium text-white/[0.06] tracking-[0.3em] uppercase"
        >
          priismatv.com
        </motion.p>
      </motion.div>
    </div>
  );
}
