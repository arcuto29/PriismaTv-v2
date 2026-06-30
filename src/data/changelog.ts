// ============================================================
//  PriismaTv Changelog
//  Add new entries at the TOP. Users see it once per version.
//  Just edit this file and push — the popup handles the rest.
// ============================================================

export interface ChangelogEntry {
  version: string;       // Unique version string (e.g. "2.5.0")
  date: string;          // Display date
  title: string;         // Short headline
  changes: string[];     // Bullet points
}

export const CHANGELOG: ChangelogEntry[] = [
  // --- ADD NEW ENTRIES HERE (at the top) ---
  {
    version: "2.5.0",
    date: "June 30, 2026",
    title: "Mood Themes & Anime Upgrade",
    changes: [
      "New: 8 mood/background themes (Settings → pick your vibe)",
      "New: Anime now uses Priism Sub/Dub servers (same source as Seanime)",
      "New: Resume Watching section on Anime page",
      "New: Content you add/approve now persists permanently (no more disappearing)",
      "New: Requests auto-delete after approve/deny",
      "Fixed: VidSrc Pro removed (black screen), replaced with working servers",
      "Fixed: Episode replay now works (click same episode to restart)",
      "Removed: Watch Together (placeholder), Install as App (broken)",
    ],
  },
];
