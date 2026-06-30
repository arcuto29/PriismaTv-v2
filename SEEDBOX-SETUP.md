# Seedbox + Jellyfin Setup for PriismaTv

Goal: stream your own 4K / 4K HDR library anywhere, 24/7, for you + 1-2 friends,
**without using your home internet** and as cheaply as possible.

The files live on a rented server (seedbox) in a datacenter. All streaming uses
the datacenter's bandwidth — your home connection is never touched.

---

## STEP 0 — Pick a plan (see comparison at the bottom)

Choose by **how much storage** you want (4K HDR = ~60 GB per movie).
Recommended starting point: a 10 Gbps app-capable seedbox with 2-4 TB.

---

## STEP 1 — Get the seedbox

1. Sign up with a provider that supports **apps / Plex / Jellyfin** (NOT a
   torrent-only "lean" plan).
2. After purchase you get: a control panel, an SSH login, and a public URL/IP.
3. From the panel, install **Jellyfin** (free) or **Plex** (1-click on most
   providers). Jellyfin = no subscription ever. Plex = nicer apps but remote
   streaming needs a Plex Pass.

---

## STEP 2 — Get content onto the seedbox

You have two easy ways (both avoid your home internet for streaming):

**A) Download directly on the seedbox (best)**
- Most seedboxes include a torrent client (qBittorrent/ruTorrent) + often
  Sonarr/Radarr for auto-grabbing.
- Add your torrents there → they download at datacenter speed, straight into
  the media folder. You never download to your PC at all.

**B) Upload from your PC**
- If you already have files in `D:\Movies`, upload them via the panel's file
  manager or an FTP/SFTP app (FileZilla). This uses your upload once, then
  it's on the box forever.

Put everything in the seedbox's media folder, e.g. `/home/youruser/media/Movies`
and `/.../Anime`, `/.../TV`.

### Keep your auto-convert + rename scripts useful
- For files you grab on the seedbox, name them cleanly:
  `Title (Year).mkv` for movies, `Title S01E01.mkv` for shows.
- Jellyfin reads filenames to match metadata — same clean-naming rule as your
  local scripts (`scripts/clean-names.ps1`). Many seedboxes run Sonarr/Radarr
  which name files correctly automatically.

---

## STEP 3 — Configure Jellyfin

1. Open your Jellyfin URL (e.g. `https://yourbox.provider.com/jellyfin`).
2. Create the **admin account** (this is you).
3. Add libraries → point them at your media folders (Movies / Anime / Shows).
4. Let it scan — it pulls posters, descriptions, etc. automatically.
5. **Settings → Playback:** turn OFF transcoding limits / prefer **Direct Play**.
   For 4K HDR you want the original file sent as-is (no quality loss, no
   washed-out colors from tone-mapping).

---

## STEP 4 — Add your friends (1-2 people)

1. Jellyfin → Dashboard → Users → **Add User**.
2. Give each friend their own username/password.
3. Optionally limit what libraries they can see.
- No extra cost — Jellyfin has unlimited users built in.

---

## STEP 5 — Watch anywhere (mobile + TV)

- **Phone/Tablet:** install **Jellyfin** (iOS/Android) or a better player like
  **Infuse** (iOS) / **Findroid** (Android). Log in with your server URL.
- **TV:** Jellyfin app on Android TV / Fire Stick 4K / Apple TV. For 4K HDR
  direct play, use a device that supports HEVC + HDR (Fire Stick 4K Max,
  Apple TV 4K, Shield TV).
- **Browser:** just open the Jellyfin URL anywhere.

---

## STEP 6 (optional) — Wire it into the PriismaTv website

You can replace the "⚡ My Server (HD)" feature (which depends on your home PC)
with the seedbox so it works 24/7 without your internet:

1. In `src/app/(main)/watch/[id]/page.tsx`, the constant `MY_SERVER_URL` currently
   points to `https://stream.priismatv.xyz` (your home tunnel).
2. Option A (simplest): change it to your seedbox's direct file URL base so the
   auto-matcher streams from the datacenter instead of your PC.
3. Option B: just use the Jellyfin app for your owned library and keep PriismaTv
   for browsing + embed streaming. (Recommended — less maintenance.)

Tell your AI assistant "update MY_SERVER_URL to my seedbox" and it can wire it up.

---

## IMPORTANT NOTES

- **Storage is the cost**, not the server. 4K HDR remux ≈ 60 GB each. A 2 TB box
  holds ~30-40 4K films or hundreds of 1080p episodes. Buy storage to match your
  appetite.
- **Direct Play for 4K HDR.** Cheap servers can't transcode 4K well. With a
  10 Gbps seedbox you don't need to — send the original file to a capable client.
- **Privacy/legal:** you're responsible for what you store. Use a provider with
  good privacy and follow your local laws.
- **Your home PC becomes optional** — only needed if you choose to download
  locally first. Most people just grab content on the box directly.

---

## PLAN COMPARISON (2026 — verify current prices before buying)

| Provider | Best for | Rough price | Notes |
|----------|----------|-------------|-------|
| **DediSeedbox** | All-rounder | from ~$10/mo | 10 Gbps, unlimited bandwidth, Plex/Jellyfin + Sonarr/Radarr pre-installed |
| **RapidSeedbox** | Reliability/support | ~$8/mo+ (apps tier) | Solid network; lean plans are torrent-only, pick an app plan |
| **PulsedMedia** | Max storage cheap | lowest price-per-TB | Best if you want LOTS of TB for the least money; less hand-holding |

Prices/specs paraphrased from 2026 seedbox comparison guides — confirm on each
provider's site before buying.

### How to choose
- **Want it easy + 4K for friends:** DediSeedbox (apps pre-installed, 10 Gbps).
- **Want a big cheap library:** PulsedMedia (price-per-TB).
- **Want best support:** RapidSeedbox app plan.

Start small (e.g. 2 TB). You can upgrade storage later as your library grows.
