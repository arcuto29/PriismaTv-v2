"use client";
import { useState } from "react";
import { MonitorPlay, Play } from "lucide-react";

const QUICK_CHANNELS = ["xqc", "kai", "shroud", "pokimane", "ironmouse", "tarik"];

export default function TwitchPage() {
  const [channel, setChannel] = useState("");
  const [embedChannel, setEmbedChannel] = useState("");

  const handleWatch = (ch?: string) => {
    const c = ch || channel.trim();
    if (c) setEmbedChannel(c.toLowerCase());
  };

  return (
    <div className="px-4 lg:px-8 py-6">
      <div className="flex items-center gap-2 mb-6">
        <MonitorPlay className="w-6 h-6 text-purple-500" />
        <h1 className="text-2xl font-bold">Twitch</h1>
      </div>

      <div className="max-w-4xl">
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleWatch()}
            placeholder="Enter Twitch channel name..."
            className="flex-1 px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button onClick={() => handleWatch()} className="px-5 py-3 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all flex items-center gap-2">
            <Play className="w-4 h-4" /> Watch
          </button>
        </div>

        <div className="w-full aspect-video rounded-xl overflow-hidden bg-black ring-1 ring-white/10 mb-6">
          {embedChannel ? (
            <iframe
              src={`https://player.twitch.tv/?channel=${embedChannel}&parent=${typeof window !== "undefined" ? window.location.hostname : "localhost"}`}
              className="w-full h-full border-0"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <p>Enter a Twitch channel name above and click Watch</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {QUICK_CHANNELS.map((ch) => (
            <button
              key={ch}
              onClick={() => handleWatch(ch)}
              className="px-4 py-2 rounded-lg bg-muted text-sm font-medium text-foreground hover:bg-purple-600/20 hover:text-purple-400 transition-colors capitalize"
            >
              {ch}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
