"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen() {
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Check if already shown this session
    if (sessionStorage.getItem("priismatv_loaded")) {
      setShow(false);
      return;
    }
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => setPhase(3), 2500);
    const t4 = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("priismatv_loaded", "true");
    }, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-[#050508] flex items-center justify-center overflow-hidden"
        >
          {/* Background particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: [0, 0.6, 0], y: -100 }}
                transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 2, repeat: Infinity }}
                className="absolute w-1 h-1 rounded-full bg-primary"
                style={{ left: `${Math.random() * 100}%`, top: `${50 + Math.random() * 50}%` }}
              />
            ))}
          </div>

          {/* Glow ring */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={phase >= 1 ? { scale: [0, 1.5, 1], opacity: [0, 0.3, 0.1] } : {}}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute w-[500px] h-[500px] rounded-full border border-primary/30"
            style={{ boxShadow: "0 0 60px rgba(0,212,255,0.2), inset 0 0 60px rgba(0,212,255,0.1)" }}
          />

          <div className="relative text-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, filter: "blur(20px)" }}
              animate={phase >= 0 ? { scale: 1, opacity: 1, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-6"
            >
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-2xl shadow-primary/30">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={phase >= 1 ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-4xl md:text-5xl font-black mb-2"
            >
              <span className="text-primary">Priisma</span>
              <span className="text-white">Tv</span>
            </motion.h1>

            {/* ARISE text */}
            <motion.p
              initial={{ y: 10, opacity: 0, letterSpacing: "0em" }}
              animate={phase >= 2 ? { y: 0, opacity: 1, letterSpacing: "0.3em" } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-sm uppercase font-bold tracking-[0.3em] text-primary/80 arise-glow"
            >
              Arise
            </motion.p>

            {/* Loading bar */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={phase >= 1 ? { width: "200px", opacity: 1 } : {}}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-8"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
