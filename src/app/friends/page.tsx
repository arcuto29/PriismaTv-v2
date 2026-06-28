"use client";
import { useState } from "react";
import { UserPlus, Share2, Download, Copy, X } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useContentStore } from "@/hooks/use-content-store";
import { STORAGE_KEYS } from "@/data/content";

export default function FriendsPage() {
  const { content, saveContent } = useContentStore();
  const [friends, setFriends] = useLocalStorage<{ id: string; name: string }[]>(STORAGE_KEYS.FRIENDS, []);
  const [friendName, setFriendName] = useState("");
  const [importCode, setImportCode] = useState("");
  const [shareCode, setShareCode] = useState("");

  const addFriend = () => {
    if (!friendName.trim()) return;
    setFriends([...friends, { id: Date.now().toString(), name: friendName.trim() }]);
    setFriendName("");
  };

  const removeFriend = (id: string) => {
    setFriends(friends.filter((f) => f.id !== id));
  };

  const shareCollection = () => {
    const code = btoa(JSON.stringify(content.map((c) => ({ id: c.id, title: c.title, type: c.type, poster: c.poster }))));
    setShareCode(code);
    navigator.clipboard.writeText(code);
  };

  const importCollection = () => {
    if (!importCode.trim()) return;
    try {
      const data = JSON.parse(atob(importCode.trim()));
      if (Array.isArray(data)) {
        const existingIds = content.map((c) => c.id);
        const newItems = data.filter((d: { id: string }) => !existingIds.includes(d.id));
        if (newItems.length > 0) {
          saveContent([...content, ...newItems]);
          alert(`Imported ${newItems.length} new items!`);
        } else {
          alert("No new items to import.");
        }
      }
    } catch {
      alert("Invalid share code.");
    }
    setImportCode("");
  };

  return (
    <div className="px-4 lg:px-8 py-6">
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="w-6 h-6 text-green-400" />
        <h1 className="text-2xl font-bold">Friends</h1>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Add Friends */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><UserPlus className="w-4 h-4 text-primary" /> Add Friends</h3>
          <div className="flex gap-2 mb-4">
            <input type="text" value={friendName} onChange={(e) => setFriendName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addFriend()}
              placeholder="Friend's name..."
              className="flex-1 px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <button onClick={addFriend} className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">Add</button>
          </div>
          <div className="space-y-2">
            {friends.map((f) => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                    {f.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{f.name}</span>
                </div>
                <button onClick={() => removeFriend(f.id)} className="p-1 text-muted-foreground hover:text-red-400">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {friends.length === 0 && <p className="text-sm text-muted-foreground">No friends added yet.</p>}
          </div>
        </div>

        {/* Share & Import */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Share2 className="w-4 h-4 text-primary" /> Share & Import</h3>
          <p className="text-sm text-muted-foreground mb-4">Share your collection with friends or import theirs using share codes.</p>

          <button onClick={shareCollection} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mb-3">
            <Copy className="w-4 h-4" /> Share My Collection (Copy Code)
          </button>
          {shareCode && <p className="text-xs text-green-400 mb-4">Code copied to clipboard!</p>}

          <div className="space-y-2">
            <textarea value={importCode} onChange={(e) => setImportCode(e.target.value)}
              placeholder="Paste your friend's share code here..."
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-24" />
            <button onClick={importCollection} className="w-full py-2.5 rounded-lg bg-muted border border-border text-sm font-medium text-foreground hover:bg-muted/80 transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Import Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
