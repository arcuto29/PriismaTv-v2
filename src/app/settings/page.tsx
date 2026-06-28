"use client";
import { Settings, Moon, Sun, Smartphone, Share2, Download, Shield } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useContentStore } from "@/hooks/use-content-store";
import { OWNER_PASSWORD } from "@/data/content";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { content } = useContentStore();

  const handleInstallPWA = () => {
    alert("To install PriismaTv as an app:\n\n1. Open this site in Chrome/Edge\n2. Click the install icon in the address bar\n3. Or go to browser menu > Install App");
  };

  const handleExport = () => {
    const data = JSON.stringify(content, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "priismatv-backup.json"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-4 lg:px-8 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="max-w-2xl space-y-4">
        {/* Appearance */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            Appearance
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Solo Leveling inspired dark theme with cyan accents</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full transition-all relative ${theme === "dark" ? "bg-primary" : "bg-muted"}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${theme === "dark" ? "left-6" : "left-0.5"}`} />
            </button>
          </div>
        </div>

        {/* PWA */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Smartphone className="w-4 h-4" /> Install as App</h3>
          <p className="text-sm text-muted-foreground mb-3">Install PriismaTv on your device for a native app experience.</p>
          <button onClick={handleInstallPWA} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">
            Install PriismaTv
          </button>
        </div>

        {/* Data */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Download className="w-4 h-4" /> Data Management</h3>
          <div className="space-y-3">
            <button onClick={handleExport} className="w-full py-2.5 rounded-lg bg-muted text-sm font-medium text-foreground hover:bg-muted/80 transition-colors flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" /> Export All Data
            </button>
            <p className="text-xs text-muted-foreground">Your content: {content.length} items total</p>
          </div>
        </div>

        {/* Security */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Shield className="w-4 h-4" /> Security</h3>
          <p className="text-sm text-muted-foreground">Admin actions (add/edit/delete content) are protected by owner password.</p>
          <p className="text-xs text-muted-foreground mt-2">Once authenticated, access persists for the session.</p>
        </div>

        {/* About */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="font-semibold mb-2">About PriismaTv</h3>
          <p className="text-sm text-muted-foreground">Version 2.0 — Complete redesign with Next.js, Tailwind CSS, Framer Motion.</p>
          <p className="text-sm text-muted-foreground mt-1">Solo Leveling / Jin-Woo inspired theme.</p>
          <p className="text-xs text-primary mt-3">Built with love. Arise!</p>
        </div>
      </div>
    </div>
  );
}
