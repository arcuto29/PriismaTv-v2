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
  const [musicMuted, setMusicMuted] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

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
      setTransitioning(true);
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
      setTransitioning(true);
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
      setTransitioning(true);
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
    // No auto-redirect - video plays until user clicks Continue
  }, [authenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  // When transitioning starts, wait for fade then show splash
  useEffect(() => {
    if (transitioning && !authenticated) {
      const timer = setTimeout(() => setAuthenticated(true), 800);
      return () => clearTimeout(timer);
    }
  }, [transitioning, authenticated]);

  // === TRANSITION OVERLAY (fade to black between login and splash) ===
  if (transitioning && !authenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-[200] bg-[#020204]"
      />
    );
  }

  // === LOGIN SCREEN ===
  if (!authenticated) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#020204] flex items-center justify-center overflow-hidden">
        {/* Sci-fi sphere/wireframe background */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "800px" }}>
          {/* Outer wireframe sphere */}
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-[250px] h-[250px] md:w-[350px] md:h-[350px]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`h-${i}`} className="absolute inset-0 rounded-full border border-primary/15" style={{ transform: `rotateX(${i * 22.5}deg)`, transformStyle: "preserve-3d" }} />
            ))}
          </motion.div>
          {/* Vertical lines */}
          <motion.div
            animate={{ rotateX: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute w-[250px] h-[250px] md:w-[350px] md:h-[350px]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`v-${i}`} className="absolute inset-0 rounded-full border border-purple-500/10" style={{ transform: `rotateY(${i * 22.5}deg)`, transformStyle: "preserve-3d" }} />
            ))}
          </motion.div>
          {/* Inner glowing core */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,212,255,0.3) 0%, rgba(124,58,237,0.15) 50%, transparent 70%)", boxShadow: "0 0 40px rgba(0,212,255,0.2), 0 0 80px rgba(0,212,255,0.1)" }}
          />
          {/* Center dot */}
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute w-3 h-3 rounded-full bg-white/70"
            style={{ boxShadow: "0 0 15px #00d4ff, 0 0 30px #00d4ff" }}
          />
        </div>

        {/* 3D Grid floor */}
        <div className="absolute bottom-0 left-0 right-0 h-[30%] overflow-hidden" style={{ perspective: "500px" }}>
          <div className="w-full h-full origin-bottom" style={{ transform: "rotateX(60deg)", backgroundImage: "linear-gradient(rgba(0,212,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.06) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
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

  // === AUTHENTICATED SPLASH - JUST VIBES ===

  return (
    <div className="fixed inset-0 z-[200] bg-[#020204] overflow-hidden select-none">
      {/* Background music */}
      <audio src="/welcome-music.MP3" autoPlay loop muted={musicMuted} style={{ display: "none" }} ref={(el) => { if (el) el.volume = 0.3; }} />

      {/* Jin-Woo video - full screen, no overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        <video
          src="/jinwoo-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center top" }}
        />
      </motion.div>

      {/* Very subtle bottom gradient for button readability */}
      <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-black/60 to-transparent z-[1]" />

      {/* Fade exit */}
      <AnimatePresence>
        {exiting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#020204] z-[100]"
          />
        )}
      </AnimatePresence>

      {/* Bottom-right controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-3"
      >
        <button
          onClick={() => setMusicMuted(!musicMuted)}
          className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all"
        >
          {musicMuted ? "🔇" : "🔊"}
        </button>
        <button
          onClick={() => { setExiting(true); setTimeout(() => router.push("/home"), 800); }}
          className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white font-medium text-sm hover:bg-white/20 transition-all"
        >
          CONTINUE →
        </button>
      </motion.div>
    </div>
  );
}
