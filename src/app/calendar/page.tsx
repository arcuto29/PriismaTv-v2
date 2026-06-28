"use client";
import { useState } from "react";
import { Calendar as CalendarIcon, Plus, X, Clock } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS } from "@/data/content";

interface CountdownItem {
  id: string;
  title: string;
  date: string;
  type: "anime" | "movie" | "tvshow";
}

const DEFAULT_COUNTDOWNS: CountdownItem[] = [
  { id: "cd1", title: "Solo Leveling Season 3", date: "2025-10-01", type: "anime" },
  { id: "cd2", title: "Attack on Titan: The Movie", date: "2025-09-15", type: "anime" },
  { id: "cd3", title: "Stranger Things Season 5", date: "2025-07-04", type: "tvshow" },
];

export default function CalendarPage() {
  const [countdowns, setCountdowns] = useLocalStorage<CountdownItem[]>(STORAGE_KEYS.COUNTDOWN, DEFAULT_COUNTDOWNS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", type: "anime" as CountdownItem["type"] });

  const addCountdown = () => {
    if (!form.title || !form.date) return;
    setCountdowns([...countdowns, { id: Date.now().toString(), ...form }]);
    setForm({ title: "", date: "", type: "anime" });
    setShowForm(false);
  };

  const removeCountdown = (id: string) => {
    setCountdowns(countdowns.filter((c) => c.id !== id));
  };

  const getDaysUntil = (date: string) => {
    const diff = new Date(date).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="px-4 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-orange-400" />
          <h1 className="text-2xl font-bold">Calendar & Countdowns</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {showForm && (
        <div className="p-4 rounded-xl bg-card border border-border mb-6 max-w-md space-y-3">
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title..."
            className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as CountdownItem["type"] })}
            className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option value="anime">Anime</option>
            <option value="movie">Movie</option>
            <option value="tvshow">TV Show</option>
          </select>
          <button onClick={addCountdown} className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Add Countdown</button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
        {countdowns.sort((a, b) => getDaysUntil(a.date) - getDaysUntil(b.date)).map((item) => {
          const days = getDaysUntil(item.date);
          const isToday = days === 0;
          return (
            <div key={item.id} className={`p-5 rounded-xl border transition-all ${isToday ? "bg-primary/10 border-primary/30 glow-cyan" : "bg-card border-border"}`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-primary px-2 py-0.5 rounded bg-primary/20">{item.type}</span>
                  <h3 className="font-semibold mt-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(item.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                </div>
                <button onClick={() => removeCountdown(item.id)} className="p-1 text-muted-foreground hover:text-red-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className={`text-lg font-bold ${isToday ? "text-primary glow-text" : ""}`}>
                  {isToday ? "OUT NOW!" : `${days} days`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {countdowns.length === 0 && (
        <div className="text-center py-20">
          <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No countdowns yet</h3>
          <p className="text-muted-foreground">Add upcoming releases to track</p>
        </div>
      )}
    </div>
  );
}
