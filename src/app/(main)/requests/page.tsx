"use client";
import { useState } from "react";
import { Hand, Send, Check, X } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS, OWNER_PASSWORD } from "@/data/content";

interface RequestItem {
  id: string;
  title: string;
  type: string;
  status: "pending" | "approved" | "denied";
  date: string;
}

export default function RequestsPage() {
  const [requests, setRequests] = useLocalStorage<RequestItem[]>(STORAGE_KEYS.REQUESTS, []);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("movie");

  const submitRequest = () => {
    if (!title.trim()) return;
    setRequests([
      { id: Date.now().toString(), title: title.trim(), type, status: "pending", date: new Date().toISOString() },
      ...requests,
    ]);
    setTitle("");
  };

  const updateStatus = (id: string, status: "approved" | "denied") => {
    const pw = prompt("Owner password:");
    if (pw !== OWNER_PASSWORD) return;
    setRequests(requests.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <div className="px-4 lg:px-8 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Hand className="w-6 h-6 text-amber-400" />
        <h1 className="text-2xl font-bold">Content Requests</h1>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Submit Request */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="font-semibold mb-4 text-primary">Request a Movie/Show</h3>
          <p className="text-sm text-muted-foreground mb-4">Want something added? Request it here!</p>
          <div className="flex gap-2 flex-wrap">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitRequest()}
              placeholder="Movie/Show/Anime title..."
              className="flex-1 min-w-[200px] px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <select value={type} onChange={(e) => setType(e.target.value)}
              className="px-3 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none">
              <option value="movie">Movie</option>
              <option value="tvshow">TV Show</option>
              <option value="anime">Anime</option>
            </select>
            <button onClick={submitRequest} className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-1">
              <Send className="w-4 h-4" /> Request
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="font-semibold mb-4">Pending Requests</h3>
          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div>
                  <span className="text-sm font-medium">{r.title}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground capitalize">{r.type}</span>
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
                    <button onClick={() => updateStatus(r.id, "approved")} className="p-1.5 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30"><Check className="w-3 h-3" /></button>
                    <button onClick={() => updateStatus(r.id, "denied")} className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"><X className="w-3 h-3" /></button>
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
