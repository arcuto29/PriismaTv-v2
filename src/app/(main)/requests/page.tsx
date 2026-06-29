"use client";
import { useState } from "react";
import { Hand, Send, Check, X, RefreshCw, Loader2 } from "lucide-react";
import { useRequests } from "@/hooks/use-supabase";

export default function RequestsPage() {
  const { requests, submitRequest, updateRequestStatus, fetchRequests } = useRequests();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("movie");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [autoAdding, setAutoAdding] = useState<string | null>(null);
  const [autoAddSuccess, setAutoAddSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    const success = await submitRequest(title.trim(), type, name.trim() || "anonymous");
    if (success) {
      setTitle("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  const handleStatusChange = async (id: string, status: "approved" | "denied", title?: string, type?: string) => {
    // Owner is already authenticated - no password needed
    if (sessionStorage.getItem("priismatv_owner") !== "true") {
      alert("Owner access required");
      return;
    }

    // If approved, auto-add content from TMDB
    if (status === "approved" && title) {
      setAutoAdding(id);
      try {
        const TMDB_KEY = "2dca580c2a14b55200e784d157207b4d";
        const searchType = type === "tvshow" || type === "anime" ? "tv" : "movie";
        const res = await fetch(`https://api.themoviedb.org/3/search/${searchType}?api_key=${TMDB_KEY}&query=${encodeURIComponent(title)}`);
        const data = await res.json();

        if (data.results && data.results[0]) {
          const r = data.results[0];
          const newItem = {
            id: `req_${Date.now()}`,
            title: r.title || r.name || title,
            type: type || "movie",
            year: new Date(r.release_date || r.first_air_date || "").getFullYear() || 2025,
            rating: r.vote_average ? parseFloat(r.vote_average.toFixed(1)) : null,
            genre: "action",
            description: r.overview || "No description available.",
            poster: r.poster_path ? `https://image.tmdb.org/t/p/w500${r.poster_path}` : null,
            backdrop: r.backdrop_path ? `https://image.tmdb.org/t/p/original${r.backdrop_path}` : null,
            trailer: null,
            duration: null,
            tags: ["trending"],
            dateAdded: new Date().toISOString().split("T")[0],
          };

          const stored = localStorage.getItem("priismatv_content");
          if (stored) {
            const content = JSON.parse(stored);
            content.unshift(newItem);
            localStorage.setItem("priismatv_content", JSON.stringify(content));
          }
          setAutoAddSuccess(title);
          setTimeout(() => setAutoAddSuccess(null), 3000);
        }
      } catch (e) {
        console.error("Auto-add failed:", e);
      }
      setAutoAdding(null);
    }

    // Remove the request from database after accepting or denying
    const { supabase } = await import("@/lib/supabase");
    await supabase.from("requests").delete().eq("id", id);
    fetchRequests();
  };

  return (
    <div className="px-4 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Hand className="w-6 h-6 text-amber-400" />
          <h1 className="text-2xl font-bold">Content Requests</h1>
        </div>
        <button onClick={fetchRequests} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <RefreshCw className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Submit Request */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="font-semibold mb-4 text-primary">Request a Movie/Show</h3>
          <p className="text-sm text-muted-foreground mb-4">Want something added? Request it here and the owner will see it!</p>

          <div className="space-y-3">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)..."
              className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <div className="flex gap-2 flex-wrap">
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Movie/Show/Anime title..."
                className="flex-1 min-w-[200px] px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <select value={type} onChange={(e) => setType(e.target.value)}
                className="px-3 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none">
                <option value="movie">Movie</option>
                <option value="tvshow">TV Show</option>
                <option value="anime">Anime</option>
              </select>
              <button onClick={handleSubmit} className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-1">
                <Send className="w-4 h-4" /> Request
              </button>
            </div>
            {submitted && <p className="text-green-400 text-xs font-mono">✓ Request submitted! The owner will see it.</p>}
          {autoAddSuccess && <p className="text-green-400 text-xs font-mono">✓ &quot;{autoAddSuccess}&quot; auto-added to library from TMDB!</p>}
          </div>
        </div>

        {/* Requests List */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="font-semibold mb-4">All Requests ({requests.length})</h3>
          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div>
                  <span className="text-sm font-medium">{r.title}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground capitalize">{r.type}</span>
                    <span className="text-xs text-muted-foreground">by {r.requested_by}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      r.status === "approved" ? "bg-green-500/20 text-green-400" :
                      r.status === "denied" ? "bg-red-500/20 text-red-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {r.status}
                    </span>
                  </div>
                </div>
                {r.status === "pending" && (
                  <div className="flex gap-1">
                    {autoAdding === r.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    ) : (
                      <>
                        <button onClick={() => handleStatusChange(r.id, "approved", r.title, r.type)} className="p-1.5 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30" title="Approve & auto-add"><Check className="w-3 h-3" /></button>
                        <button onClick={() => handleStatusChange(r.id, "denied")} className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30" title="Deny"><X className="w-3 h-3" /></button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
            {requests.length === 0 && <p className="text-sm text-muted-foreground">No requests yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
