"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Play, Sword, Film, Tv, Sparkles, ChevronRight } from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("priismatv_entered")) {
      router.replace("/");
    }
  }, [router]);

  const enter = () => {
    setEntered(true);
    sessionStorage.setItem("priismatv_entered", "true");
    setTimeout(() => router.push("/"), 800);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050508] flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px] animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/5 blur-[120px] animate-blob animation-delay-2000" />
      </div>

      {/* Floating icons */}
      {[Film, Sword, Tv, Sparkles].map((Icon, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1, y: [0, -20, 0] }}
          transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
          className="absolute"
          style={{ left: `${20 + i * 20}%`, top: `${30 + (i % 2) * 40}%` }}
        >
          <Icon className="w-8 h-8 text-primary" />
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: entered ? 0 : 1, y: entered ? -20 : 0, scale: entered ? 0.95 : 1 }}
        transition={{ duration: 0.5 }}
        className="relative text-center px-6 max-w-lg"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-2xl shadow-primary/20 mb-4">
            <Play className="w-9 h-9 text-white fill-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black">
            <span className="text-primary">Priisma</span>
            <span className="text-white">Tv</span>
          </h1>
          <p className="text-white/40 text-sm mt-2 font-medium tracking-wide">Premium Streaming Hub</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-6 mb-8 text-white/50"
        >
          <div className="text-center">
            <p className="text-2xl font-black text-white">423+</p>
            <p className="text-[10px] uppercase tracking-wider">Titles</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-2xl font-black text-white">4K</p>
            <p className="text-[10px] uppercase tracking-wider">Quality</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-2xl font-black text-white">Free</p>
            <p className="text-[10px] uppercase tracking-wider">Always</p>
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/50 text-sm mb-8 leading-relaxed"
        >
          Movies, Anime, TV Shows — all in one place.<br />
          Solo Leveling inspired. Built different.
        </motion.p>

        {/* Enter Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={enter}
          className="group flex items-center gap-2 mx-auto px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold text-base hover:scale-105 active:scale-95 transition-transform shadow-2xl shadow-primary/30"
        >
          Enter PriismaTv
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-[10px] text-white/20 mt-6"
        >
          Press Ctrl+K to search • Type &quot;arise&quot; for a surprise
        </motion.p>
      </motion.div>
    </div>
  );
}
