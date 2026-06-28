"use client";
import { useState } from "react";
import { Video, Play, ExternalLink } from "lucide-react";

export default function YoutubePage() {
  const [url, setUrl] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");

  const extractVideoId = (input: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
      /^[a-zA-Z0-9_-]{11}$/,
    ];
    for (const p of patterns) {
      const match = input.match(p);
      if (match) return match[1] || input;
    }
    return null;
  };

  const handlePlay = () => {
    const id = extractVideoId(url.trim());
    if (id) setEmbedUrl(`https://www.youtube.com/embed/${id}?autoplay=1`);
  };

  return (
    <div className="px-4 lg:px-8 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Video className="w-6 h-6 text-red-500" />
        <h1 className="text-2xl font-bold">YouTube</h1>
      </div>

      <div className="max-w-4xl">
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePlay()}
            placeholder="Paste a YouTube URL or video ID..."
            className="flex-1 px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button onClick={handlePlay} className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all flex items-center gap-2">
            <Play className="w-4 h-4" /> Play
          </button>
        </div>

        <div className="w-full aspect-video rounded-xl overflow-hidden bg-black ring-1 ring-white/10 mb-6">
          {embedUrl ? (
            <iframe src={embedUrl} className="w-full h-full border-0" allowFullScreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <p>Paste a YouTube URL above and click Play</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-sm text-foreground hover:bg-muted/80 transition-colors">
            <Video className="w-4 h-4 text-red-500" /> Open YouTube <ExternalLink className="w-3 h-3" />
          </a>
          <a href="https://www.youtube.com/feed/trending" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-sm text-foreground hover:bg-muted/80 transition-colors">
            Trending <ExternalLink className="w-3 h-3" />
          </a>
          <a href="https://music.youtube.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-sm text-foreground hover:bg-muted/80 transition-colors">
            Music <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
