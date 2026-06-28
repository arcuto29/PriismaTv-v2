"use client";
import { useState } from "react";
import { Users, Play, Copy, Plus, LogIn } from "lucide-react";

export default function WatchTogetherPage() {
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);

  const createRoom = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
    setIsInRoom(true);
  };

  const joinRoom = () => {
    if (joinCode.trim()) {
      setRoomCode(joinCode.trim().toUpperCase());
      setIsInRoom(true);
    }
  };

  const loadVideo = () => {
    if (videoUrl.trim()) {
      const ytMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/);
      if (ytMatch) {
        setEmbedUrl(`https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`);
      } else {
        setEmbedUrl(videoUrl.trim());
      }
    }
  };

  return (
    <div className="px-4 lg:px-8 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Watch Together</h1>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Room Management */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-primary">Sync Watch with Friends</span>
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create a room, share the code, and everyone watches in sync!
          </p>

          <div className="flex flex-wrap gap-3 mb-4">
            <button onClick={createRoom} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all">
              <Plus className="w-4 h-4" /> Create Room
            </button>
            <div className="flex gap-2">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter room code..."
                className="px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-44"
              />
              <button onClick={joinRoom} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground font-medium hover:bg-muted/80 transition-all">
                <LogIn className="w-4 h-4" /> Join
              </button>
            </div>
          </div>

          {isInRoom && (
            <div className="p-4 rounded-lg bg-muted border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary font-semibold">Room Active</span>
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold">{roomCode}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Share this code with your friends!</p>
              <button
                onClick={() => navigator.clipboard.writeText(roomCode)}
                className="mt-2 flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Copy className="w-3 h-3" /> Copy Code
              </button>
            </div>
          )}
        </div>

        {/* Video Player */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="text-lg font-semibold mb-4">Watch Party Player</h3>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadVideo()}
              placeholder="Paste YouTube, Twitch, or any video URL..."
              className="flex-1 px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button onClick={loadVideo} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all">
              <Play className="w-4 h-4" /> Load
            </button>
          </div>

          <div className="w-full aspect-video rounded-xl overflow-hidden bg-black ring-1 ring-white/10">
            {embedUrl ? (
              <iframe src={embedUrl} className="w-full h-full border-0" allowFullScreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <p>Paste a URL above and click Load to start watching</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
