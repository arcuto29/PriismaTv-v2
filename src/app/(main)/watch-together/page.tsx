"use client";
import { motion } from "framer-motion";
import { Users, Clock } from "lucide-react";

export default function WatchTogetherPage() {
  return (
    <div className="px-4 lg:px-8 py-6 flex items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-600/20 border border-primary/30 flex items-center justify-center"
        >
          <Users className="w-9 h-9 text-primary" />
        </motion.div>

        <h1 className="text-3xl font-black mb-2">Watch Together</h1>
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-sm font-mono text-primary">COMING SOON</span>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Synced watch parties are on the way. Soon you&apos;ll be able to watch movies
          with friends in perfect sync — play, pause, and seek together in real-time.
        </p>
        <p className="text-muted-foreground/50 text-xs mt-4 font-mono">
          Use the Chat widget in the meantime to talk while watching the same content.
        </p>
      </motion.div>
    </div>
  );
}
