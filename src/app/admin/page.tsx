"use client";
import { useState } from "react";
import { PlusCircle, Download, Upload, RefreshCw, Trash2, Wand2 } from "lucide-react";
import { useContentStore } from "@/hooks/use-content-store";
import { ContentItem, OWNER_PASSWORD, TMDB_API_KEY, STORAGE_KEYS } from "@/data/content";
import { SAMPLE_CONTENT } from "@/data/sample-content";

export default function AdminPage() {
  const { content, addContent, saveContent } = useContentStore();
  const [form, setForm] = useState({
    title: "", type: "movie" as "movie" | "anime" | "tvshow",
    year: "", rating: "", genre: "action", description: "",
    poster: "", backdrop: "", video: "", trailer: "",
    duration: "", episodes: "", seasons: "", tags: "",
  });
  const [fetchStatus, setFetchStatus] = useState("");
  const [posterResults, setPosterResults] = useState<string[]>([]);

  const requireOwner = (): boolean => {
    if (sessionStorage.getItem("priismatv_owner") === "true") return true;
    const pw = prompt("Owner password required:");
    if (pw === OWNER_PASSWORD) {
      sessionStorage.setItem("priismatv_owner", "true");
      return true;
    }
    return false;
  };

  const fetchFromTMDB = async () => {
    if (!form.title) return;
    setFetchStatus("Searching TMDB...");
    try {
      const searchType = form.type === "movie" ? "movie" : "tv";
      const res = await fetch(
        `https://api.themoviedb.org/3/search/${searchType}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(form.title)}`
      );
      const data = await res.json();
      if (data.results?.length > 0) {
        const r = data.results[0];
        const posters = data.results.slice(0, 4).map((item: { poster_path: string }) =>
          item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : ""
        ).filter(Boolean);
        setPosterResults(posters);
        setForm((prev) => ({
          ...prev,
          poster: r.poster_path ? `https://image.tmdb.org/t/p/w500${r.poster_path}` : prev.poster,
          backdrop: r.backdrop_path ? `https://image.tmdb.org/t/p/original${r.backdrop_path}` : prev.backdrop,
          description: r.overview || prev.description,
          year: String(new Date(r.release_date || r.first_air_date || "").getFullYear()) || prev.year,
          rating: String(r.vote_average?.toFixed(1)) || prev.rating,
        }));
        setFetchStatus("Found! Poster and info auto-filled.");
      } else {
        setFetchStatus("No results found on TMDB.");
      }
    } catch {
      setFetchStatus("Error fetching from TMDB.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireOwner()) return;
    if (!form.title) return;

    const newItem: ContentItem = {
      id: `custom_${Date.now()}`,
      title: form.title,
      type: form.type,
      year: parseInt(form.year) || new Date().getFullYear(),
      rating: parseFloat(form.rating) || null,
      genre: form.genre,
      description: form.description,
      poster: form.poster || null,
      backdrop: form.backdrop || null,
      video: form.video || null,
      trailer: form.trailer || null,
      duration: form.duration || null,
      episodes: parseInt(form.episodes) || undefined,
      seasons: parseInt(form.seasons) || undefined,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      dateAdded: new Date().toISOString().split("T")[0],
    };

    addContent(newItem);
    setForm({ title: "", type: "movie", year: "", rating: "", genre: "action", description: "", poster: "", backdrop: "", video: "", trailer: "", duration: "", episodes: "", seasons: "", tags: "" });
    setPosterResults([]);
    setFetchStatus("Content added successfully!");
  };

  const handleExport = () => {
    const data = JSON.stringify(content, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "priismatv-backup.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!requireOwner()) return;
    const input = document.createElement("input");
    input.type = "file"; input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (Array.isArray(data)) { saveContent(data); alert("Imported successfully!"); }
        } catch { alert("Invalid JSON file."); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleLoadNew = () => {
    if (!requireOwner()) return;
    const existingIds = content.map((c) => c.id);
    const newItems = SAMPLE_CONTENT.filter((s) => !existingIds.includes(s.id));
    if (newItems.length > 0) {
      saveContent([...content, ...newItems]);
      alert(`Added ${newItems.length} new items!`);
    } else {
      alert("No new content to add.");
    }
  };

  const handleReset = () => {
    if (!requireOwner()) return;
    if (confirm("This will delete ALL data. Are you sure?")) {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
      window.location.reload();
    }
  };

  const stats = {
    movies: content.filter((i) => i.type === "movie").length,
    anime: content.filter((i) => i.type === "anime").length,
    tv: content.filter((i) => i.type === "tvshow").length,
  };

  return (
    <div className="px-4 lg:px-8 py-6">
      <div className="flex items-center gap-2 mb-6">
        <PlusCircle className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Add Content</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr,300px] gap-6 max-w-6xl">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-xl bg-card border border-border">
          <div>
            <label className="text-sm font-medium mb-1 block">Title *</label>
            <div className="flex gap-2">
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Spirited Away, Breaking Bad..." required
                className="flex-1 px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <button type="button" onClick={fetchFromTMDB} className="px-3 py-2.5 rounded-lg bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-colors flex items-center gap-1">
                <Wand2 className="w-4 h-4" /> Auto-fetch
              </button>
            </div>
            {fetchStatus && <p className="text-xs text-primary mt-1">{fetchStatus}</p>}
          </div>

          {posterResults.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-1 block">Auto-found Posters (click to use)</label>
              <div className="flex gap-2 flex-wrap">
                {posterResults.map((p, i) => (
                  <img key={i} src={p} alt="" className="w-16 h-24 rounded cursor-pointer hover:ring-2 ring-primary object-cover"
                    onClick={() => setForm({ ...form, poster: p })} />
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Type *</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ContentItem["type"] })}
                className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="movie">Movie</option>
                <option value="anime">Anime</option>
                <option value="tvshow">TV Show</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Year</label>
              <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2024"
                className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Rating</label>
              <input type="number" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} placeholder="8.5" step="0.1" min="0" max="10"
                className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Genre</label>
            <select value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              {["action","adventure","comedy","crime","drama","fantasy","horror","mecha","romance","sci-fi","shonen","slice-of-life","thriller","documentary","animation"].map((g) => (
                <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="What's this about?"
              className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Poster URL</label>
              <input type="url" value={form.poster} onChange={(e) => setForm({ ...form, poster: e.target.value })} placeholder="https://..."
                className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Backdrop URL</label>
              <input type="url" value={form.backdrop} onChange={(e) => setForm({ ...form, backdrop: e.target.value })} placeholder="https://..."
                className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Video/Stream URL</label>
              <input type="url" value={form.video} onChange={(e) => setForm({ ...form, video: e.target.value })} placeholder="Streamtape, Filemoon, etc."
                className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Trailer ID (YouTube)</label>
              <input type="text" value={form.trailer} onChange={(e) => setForm({ ...form, trailer: e.target.value })} placeholder="e.g. zSWdZVtXT7E"
                className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Duration</label>
              <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="2h 15m"
                className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Episodes</label>
              <input type="number" value={form.episodes} onChange={(e) => setForm({ ...form, episodes: e.target.value })} placeholder="24"
                className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Seasons</label>
              <input type="number" value={form.seasons} onChange={(e) => setForm({ ...form, seasons: e.target.value })} placeholder="1"
                className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Tags (comma separated)</label>
            <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="trending, must-watch, top-rated"
              className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>

          <button type="submit" className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
            <PlusCircle className="w-5 h-5" /> Add to Collection
          </button>
        </form>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-card border border-border">
            <h3 className="font-semibold mb-3">Collection Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Movies</span><span className="font-semibold">{stats.movies}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Anime</span><span className="font-semibold">{stats.anime}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">TV Shows</span><span className="font-semibold">{stats.tv}</span></div>
              <hr className="border-border" />
              <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-bold text-primary">{content.length}</span></div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-card border border-border space-y-3">
            <h3 className="font-semibold">Backup & Restore</h3>
            <button onClick={handleExport} className="w-full py-2.5 rounded-lg bg-muted text-sm font-medium text-foreground hover:bg-muted/80 transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Export Collection
            </button>
            <button onClick={handleImport} className="w-full py-2.5 rounded-lg bg-muted text-sm font-medium text-foreground hover:bg-muted/80 transition-colors flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" /> Import Collection
            </button>
          </div>

          <div className="p-5 rounded-xl bg-card border border-border space-y-3">
            <h3 className="font-semibold">Refresh Content</h3>
            <button onClick={handleLoadNew} className="w-full py-2.5 rounded-lg bg-muted text-sm font-medium text-primary border border-primary/30 hover:bg-primary/10 transition-colors flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" /> Load New Content
            </button>
            <p className="text-xs text-muted-foreground">Adds new items without deleting your edits.</p>
          </div>

          <div className="p-5 rounded-xl bg-card border border-border space-y-3">
            <h3 className="font-semibold text-red-400">Danger Zone</h3>
            <button onClick={handleReset} className="w-full py-2.5 rounded-lg bg-muted text-sm font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" /> Full Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
