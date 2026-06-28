"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function AriseEasterEgg() {
  const [triggered, setTriggered] = useState(false);
  const [buffer, setBuffer] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const newBuffer = (buffer + e.key).slice(-5);
      setBuffer(newBuffer);
      if (newBuffer.toLowerCase() === "arise") {
        setTriggered(true);
        setBuffer("");
        setTimeout(() => setTriggered(false), 4000);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [buffer]);

  return (
    <AnimatePresence>
      {triggered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] pointer-events-none flex items-center justify-center"
        >
          {/* Flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-primary"
          />

          {/* Shockwave ring */}
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute w-40 h-40 rounded-full border-2 border-primary"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
            className="absolute w-40 h-40 rounded-full border border-purple-500"
          />

          {/* Rising particles */}
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 200, x: (Math.random() - 0.5) * 400, opacity: 0, scale: 0 }}
              animate={{ y: -400, opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
              transition={{ duration: 2 + Math.random(), delay: Math.random() * 0.5 }}
              className="absolute w-2 h-2 rounded-full"
              style={{ background: i % 2 === 0 ? "#00d4ff" : "#7c3aed" }}
            />
          ))}

          {/* ARISE text */}
          <motion.h1
            initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
            animate={{ scale: [0.5, 1.2, 1], opacity: [0, 1, 1, 0], filter: "blur(0px)" }}
            transition={{ duration: 3, times: [0, 0.3, 0.7, 1] }}
            className="text-6xl md:text-8xl font-black text-primary arise-glow uppercase tracking-[0.2em]"
            style={{ textShadow: "0 0 40px rgba(0,212,255,0.8), 0 0 80px rgba(0,212,255,0.4), 0 0 120px rgba(124,58,237,0.3)" }}
          >
            ARISE
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
