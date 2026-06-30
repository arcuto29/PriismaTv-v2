"use client";
import { useState } from "react";
import { Settings, Moon, Sun, Smartphone, Share2, Download, Shield, ImageOff, Palette, UserPlus, X } from "lucide-react";
import { useTheme, ThemeColor } from "@/hooks/use-theme";
import { useProfiles } from "@/hooks/use-profiles";
import { useContentStore } from "@/hooks/use-content-store";

const THEME_OPTIONS: { id: ThemeColor; label: string; color: string }[] = [
  { id: "cyan", label: "Cyan (Default)", color: "bg-cyan-500" },
  { id: "purple", label: "Purple", color: "bg-purple-500" },
  { id: "red", label: "Red", color: "bg-red-500" },
  { id: "green", label: "Green", color: "bg-green-500" },
  { id: "gold", label: "Gold", color: "bg-yellow-500" },
  { id: "seasonal", label: "Seasonal Auto", color: "bg-gradient-to-r from-orange-500 to-red-500" },
];

export default function SettingsPage() {
  const { theme, toggleTheme, themeColor, changeColor, seasonalName } = useTheme();
  const { profiles, activeProfile, addProfile, removeProfile, switchProfile, updateProfile, AVATARS, COLORS } = useProfiles();
  const { content } = useContentStore();
  const [newName, setNewName] = useState("");
  const [newAvatar, setNewAvatar] = useState("🐉");
  const [newColor, setNewColor] = useState("from-cyan-500 to-blue-600");
  const [showAddProfile, setShowAddProfile] = useState(false);

  const handleFixImages = () => {
    // Re-verify posters without wiping any added/approved content.
    // Strips the cached "posterOk" flag so the auto-fixer re-runs on load.
    const stripFlag = (key: string) => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return;
        const data = JSON.parse(raw);
        if (Array.isArray(data)) {
          data.forEach((i) => { if (i) delete i.posterOk; });
        } else if (data && typeof data === "object") {
          Object.values(data).forEach((i) => { if (i) delete (i as Record<string, unknown>).posterOk; });
        }
        localStorage.setItem(key, JSON.stringify(data));
      } catch { /* ignore */ }
    };
    stripFlag("priismatv_user_content");
    stripFlag("priismatv_overrides");
    window.location.reload();
  };

  const handleExport = () => {
    const data = JSON.stringify(content, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "priismatv-backup.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateProfile = () => {
    if (!newName.trim()) return;
    addProfile(newName.trim(), newAvatar, newColor);
    setNewName("");
    setShowAddProfile(false);
  };

  return (
    <div className="px-4 lg:px-8 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="max-w-2xl space-y-4">
        {/* Theme Color */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Palette className="w-4 h-4" /> Theme Color</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
            {THEME_OPTIONS.map((t) => (
              <button
                key={t.id}
                onClick={() => changeColor(t.id)}
                className={`p-3 rounded-xl text-center transition-all border-2 ${
                  themeColor === t.id ? "border-foreground scale-105" : "border-transparent hover:border-white/20"
                }`}
              >
                <div className={`w-8 h-8 rounded-full ${t.color} mx-auto mb-1`} />
                <p className="text-[10px] font-medium">{t.label}</p>
              </button>
            ))}
          </div>
          {themeColor === "seasonal" && (
            <p className="text-xs text-muted-foreground">Current season: {seasonalName}</p>
          )}
        </div>

        {/* Dark/Light Mode */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />} Appearance
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Solo Leveling dark theme</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full transition-all relative ${theme === "dark" ? "bg-primary" : "bg-muted"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${theme === "dark" ? "left-6" : "left-0.5"}`} />
            </button>
          </div>
        </div>

        {/* User Profiles */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><UserPlus className="w-4 h-4" /> Profiles</h3>
          <div className="flex flex-wrap gap-3 mb-4">
            {profiles.map((p) => (
              <div key={p.id} className="relative group">
                <button
                  onClick={() => switchProfile(p)}
                  className={`flex flex-col items-center p-3 rounded-xl transition-all border-2 ${
                    activeProfile.id === p.id ? "border-primary bg-primary/10" : "border-transparent hover:border-white/10"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-xl mb-1`}>
                    {p.avatar}
                  </div>
                  <p className="text-xs font-medium">{p.name}</p>
                </button>
                {p.id !== "default" && (
                  <button
                    onClick={() => removeProfile(p.id)}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => setShowAddProfile(!showAddProfile)}
              className="flex flex-col items-center p-3 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl mb-1">+</div>
              <p className="text-xs font-medium text-muted-foreground">Add</p>
            </button>
          </div>

          {showAddProfile && (
            <div className="p-4 rounded-lg bg-muted space-y-3">
              <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Profile name..."
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              <div>
                <p className="text-xs text-muted-foreground mb-2">Choose Avatar:</p>
                <div className="flex flex-wrap gap-2">
                  {AVATARS.map((a) => (
                    <button key={a} onClick={() => setNewAvatar(a)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${newAvatar === a ? "bg-primary/20 ring-2 ring-primary" : "bg-background hover:bg-background/80"}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Choose Color:</p>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button key={c} onClick={() => setNewColor(c)}
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${c} transition-all ${newColor === c ? "ring-2 ring-white scale-110" : "hover:scale-105"}`} />
                  ))}
                </div>
              </div>
              <button onClick={handleCreateProfile} className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Create Profile</button>
            </div>
          )}
        </div>

        {/* Fix Images */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><ImageOff className="w-4 h-4" /> Fix Cover Images</h3>
          <p className="text-sm text-muted-foreground mb-3">If covers aren&apos;t showing, click to reload fresh data.</p>
          <button onClick={handleFixImages} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">
            Fix Images Now
          </button>
        </div>

        {/* PWA */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Smartphone className="w-4 h-4" /> Install as App</h3>
          <p className="text-sm text-muted-foreground mb-3">Install PriismaTv on your device for a native app experience.</p>
          <button onClick={() => alert("Open in Chrome/Edge → Click install icon in address bar → Or go to menu → Install App")} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">
            Install PriismaTv
          </button>
        </div>

        {/* Data */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Download className="w-4 h-4" /> Data Management</h3>
          <button onClick={handleExport} className="w-full py-2.5 rounded-lg bg-muted text-sm font-medium text-foreground hover:bg-muted/80 transition-colors flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4" /> Export All Data
          </button>
          <p className="text-xs text-muted-foreground mt-2">Library: {content.length} titles</p>
        </div>

        {/* Security */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Shield className="w-4 h-4" /> Security</h3>
          <p className="text-sm text-muted-foreground">Admin actions are protected by owner password.</p>
        </div>

        {/* About */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="font-semibold mb-2">About PriismaTv v2</h3>
          <p className="text-sm text-muted-foreground">423+ titles • Next.js • Tailwind • Framer Motion</p>
          <p className="text-xs text-primary mt-2">Solo Leveling inspired. Arise! ⚔️</p>
        </div>
      </div>
    </div>
  );
}
