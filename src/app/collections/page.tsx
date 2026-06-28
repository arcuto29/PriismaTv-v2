"use client";
import { useState } from "react";
import { Layers, Plus, X } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useContentStore } from "@/hooks/use-content-store";
import { ContentCard } from "@/components/content/content-card";
import { STORAGE_KEYS } from "@/data/content";

interface Collection {
  id: string;
  name: string;
  items: string[];
}

export default function CollectionsPage() {
  const { content, favorites, watchlist, toggleFavorite, toggleWatchlist } = useContentStore();
  const [collections, setCollections] = useLocalStorage<Collection[]>(STORAGE_KEYS.COLLECTIONS, []);
  const [newName, setNewName] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  const createCollection = () => {
    if (!newName.trim()) return;
    setCollections([...collections, { id: Date.now().toString(), name: newName.trim(), items: [] }]);
    setNewName("");
  };

  const deleteCollection = (id: string) => {
    setCollections(collections.filter((c) => c.id !== id));
    if (selectedCollection === id) setSelectedCollection(null);
  };

  const activeCollection = collections.find((c) => c.id === selectedCollection);
  const activeItems = activeCollection ? content.filter((i) => activeCollection.items.includes(i.id)) : [];

  return (
    <div className="px-4 lg:px-8 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Layers className="w-6 h-6 text-indigo-400" />
        <h1 className="text-2xl font-bold">Collections</h1>
      </div>

      {/* Create Collection */}
      <div className="flex gap-2 mb-6 max-w-md">
        <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createCollection()}
          placeholder="New collection name..."
          className="flex-1 px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        <button onClick={createCollection} className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all flex items-center gap-1">
          <Plus className="w-4 h-4" /> Create
        </button>
      </div>

      {/* Collections List */}
      <div className="flex flex-wrap gap-2 mb-6">
        {collections.map((col) => (
          <div key={col.id} className="flex items-center gap-1">
            <button
              onClick={() => setSelectedCollection(col.id === selectedCollection ? null : col.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCollection === col.id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {col.name} ({col.items.length})
            </button>
            <button onClick={() => deleteCollection(col.id)} className="p-1 rounded text-muted-foreground hover:text-red-400 transition-colors">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Collection Content */}
      {activeCollection && activeItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {activeItems.map((item, i) => (
            <ContentCard key={item.id} item={item} index={i} onFavorite={toggleFavorite} onWatchlist={toggleWatchlist}
              isFavorite={favorites.includes(item.id)} isInWatchlist={watchlist.includes(item.id)} />
          ))}
        </div>
      ) : activeCollection ? (
        <p className="text-muted-foreground text-sm">This collection is empty. Add items from the detail page.</p>
      ) : collections.length === 0 ? (
        <div className="text-center py-20">
          <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No collections yet</h3>
          <p className="text-muted-foreground">Create a collection to organize your content</p>
        </div>
      ) : null}
    </div>
  );
}
