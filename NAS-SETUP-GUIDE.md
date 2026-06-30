# NAS Setup Guide — One-Time Purchase, 24/7 Personal Library

Your own media server that runs forever for $0/month.
Watch from any device, anywhere. No subscriptions.

---

## WHAT TO BUY (one-time, ~$550 CAD total)

### The NAS (the brain)
**Synology DS224+** (~$350 CAD)
- 2-bay (holds 2 hard drives)
- Intel Celeron J4125 (hardware transcoding for 4K)
- 2 GB RAM (upgradeable to 6 GB)
- Runs 24/7 silently (15 watts = ~$3-5/mo electricity)
- Buy from: Amazon.ca, Canada Computers, Best Buy

### The Drives (the storage)
**2x WD Red Plus 4 TB** (~$100 each = ~$200 total)
- Designed for NAS (run 24/7 without dying)
- 4 TB usable in RAID 1 (mirrored = if one drive dies, you don't lose data)
- OR 8 TB usable with NO RAID (more space but no backup protection)
- Alternative: Seagate IronWolf 4 TB (same price, also good)

### Optional upgrades (buy later if you want)
- Extra RAM stick (2-4 GB, ~$30) — helps if running many apps
- Bigger drives (8 TB or 12 TB) — for massive libraries
- UPS battery backup (~$60) — keeps NAS alive during power outages

---

## STEP 1: Physical Setup (10 min)

1. Unbox the Synology DS224+
2. Slide the hard drives into the bays (no screws needed, they click in)
3. Plug in the ethernet cable to your router
4. Plug in the power cable
5. Press the power button
6. Wait 2-3 minutes for it to boot (you'll hear a beep)

---

## STEP 2: Initial Synology Setup (10 min)

1. On your PC/phone, open a browser and go to: **http://find.synology.com**
   - It auto-discovers your NAS on the network
2. Click "Connect" → it walks you through setup
3. Install **DSM** (Synology's operating system) — takes ~5 min
4. Create your **admin account** (username + password)
5. Storage setup:
   - If you want **safety** (drive can die, no data loss): pick **SHR/RAID 1** → gives you 4 TB usable
   - If you want **max space** (risk losing data if a drive dies): pick **Basic** → gives you 8 TB usable
   - **Recommendation: SHR (RAID 1)** — 4 TB is enough, and your data is protected
6. Create a shared folder called `media`
7. Inside `media`, create subfolders:
   ```
   /media/Movies
   /media/TV
   /media/Anime
   ```

---

## STEP 3: Install Jellyfin (5 min)

Jellyfin doesn't run natively on Synology — you install it via **Docker** (a container system that Synology supports).

### Install Docker (Container Manager)
1. Open **Package Center** (Synology's app store)
2. Search "Container Manager" → Install it
3. Done

### Install Jellyfin via Docker
1. Open **Container Manager** → Registry → search "jellyfin/jellyfin"
2. Download the `latest` tag
3. Go to **Container** → Create
4. Image: `jellyfin/jellyfin:latest`
5. Container name: `jellyfin`
6. Port settings:
   - Local port `8096` → Container port `8096` (web UI)
   - Local port `8920` → Container port `8920` (HTTPS, optional)
7. Volume mounts (IMPORTANT — this connects Jellyfin to your files):
   - `/volume1/media` → mount as `/media` (read-only is fine)
   - `/volume1/docker/jellyfin/config` → mount as `/config`
   - `/volume1/docker/jellyfin/cache` → mount as `/cache`
8. Environment: add `JELLYFIN_PublishedServerUrl=http://YOUR_NAS_LOCAL_IP:8096`
9. Click **Run**

### Configure Jellyfin
1. Open browser → go to `http://YOUR_NAS_IP:8096`
   (find your NAS IP in your router settings, usually something like 192.168.1.XX)
2. Create admin account
3. Add libraries:
   - **Movies** → path: `/media/Movies`
   - **TV Shows** → path: `/media/TV`
   - **Anime** → path: `/media/Anime` (content type: Shows)
4. Settings → Playback → Hardware Acceleration → **Intel QSV** (the DS224+ supports this)
5. Done — Jellyfin is running

---

## STEP 4: Install Sonarr + Radarr + Prowlarr (15 min)

All via Docker. Same process as Jellyfin:

### Radarr (auto-downloads movies)
- Image: `linuxserver/radarr:latest`
- Ports: `7878:7878`
- Volumes:
  - `/volume1/docker/radarr/config` → `/config`
  - `/volume1/media/Movies` → `/movies`
  - `/volume1/downloads` → `/downloads`

### Sonarr (auto-downloads TV/anime)
- Image: `linuxserver/sonarr:latest`
- Ports: `8989:8989`
- Volumes:
  - `/volume1/docker/sonarr/config` → `/config`
  - `/volume1/media/TV` → `/tv`
  - `/volume1/media/Anime` → `/anime`
  - `/volume1/downloads` → `/downloads`

### Prowlarr (connects to torrent sites)
- Image: `linuxserver/prowlarr:latest`
- Ports: `9696:9696`
- Volumes:
  - `/volume1/docker/prowlarr/config` → `/config`

### qBittorrent (torrent client)
- Image: `linuxserver/qbittorrent:latest`
- Ports: `8080:8080` (web UI), `6881:6881` (torrents)
- Volumes:
  - `/volume1/docker/qbittorrent/config` → `/config`
  - `/volume1/downloads` → `/downloads`

---

## STEP 5: Connect Everything Together (10 min)

### Prowlarr → Torrent sites
1. Open `http://NAS_IP:9696`
2. Indexers → Add → pick:
   - **1337x** (movies/shows, public)
   - **Nyaa** (anime, public)
   - **TorrentGalaxy** (general, public)
3. Settings → Apps → Add:
   - Sonarr: `http://localhost:8989`, paste Sonarr's API key
   - Radarr: `http://localhost:7878`, paste Radarr's API key

### Radarr → qBittorrent
1. Open `http://NAS_IP:7878`
2. Settings → Download Clients → Add → qBittorrent
   - Host: `localhost`, Port: `8080`
   - Username/password from qBittorrent
3. Settings → Media Management → Root folder: `/movies`
4. Settings → Quality Profiles → create "4K":
   - Preferred: Remux-2160p, Bluray-2160p, Bluray-1080p
   - Reject: CAM, TS, ITA, RUS, seleZen

### Sonarr → qBittorrent
1. Open `http://NAS_IP:8989`
2. Same setup as Radarr but root folders: `/tv` and `/anime`
3. Same quality profile

### The flow now:
```
You add "Black Clover" in Sonarr
  → Prowlarr searches Nyaa for it
  → Sends best torrent to qBittorrent
  → Downloads to /downloads/
  → Sonarr moves it to /media/Anime/Black Clover/Season 1/
  → Jellyfin auto-detects it
  → Watch on any device
```

---

## STEP 6: Access From Anywhere (5 min)

### Option A: Tailscale (recommended, free, easiest)
1. Install **Tailscale** package on your Synology (Package Center → Community)
   - Or run via Docker: `tailscale/tailscale`
2. Install **Tailscale** on your phone/laptop
3. Log in with same account on both
4. Now your phone can reach `http://NAS_TAILSCALE_IP:8096` from ANYWHERE
   - Even on mobile data, at a coffee shop, on vacation
   - Encrypted, private, no port forwarding
   - Free for personal use (up to 100 devices)

### Option B: Cloudflare Tunnel (you already know this)
1. Install `cloudflared` on the NAS via Docker
2. Create a tunnel: `media.priismatv.xyz` → `http://localhost:8096`
3. Access Jellyfin at `https://media.priismatv.xyz` from anywhere

### Option C: Synology QuickConnect (built-in, easiest but slower)
1. DSM → Control Panel → QuickConnect → Enable
2. Pick a QuickConnect ID (e.g. `priismatv`)
3. Access via `http://quickconnect.to/priismatv`
4. Slower than Tailscale but zero setup

---

## STEP 7: Watch on Your Devices

| Device | App | How |
|--------|-----|-----|
| iPhone/Android | **Jellyfin** app (free) | Add server → your Tailscale/tunnel URL |
| Fire Stick 4K | **Jellyfin** app | Same |
| Apple TV | **Infuse** app ($10 one-time, best quality) or Jellyfin | Add Jellyfin server |
| Android TV / Shield | **Jellyfin** app | Same |
| Any browser | None needed | Open the URL |
| Your OLED monitor | Browser | Open the URL |

---

## STEP 8: Day-to-Day Usage (zero effort)

**Want a new movie?**
→ Open Radarr (`http://NAS_IP:7878`) → search → Add → it downloads + appears in Jellyfin

**Want a new anime/show?**
→ Open Sonarr (`http://NAS_IP:8989`) → search → Add → ALL episodes download + future ones auto-grab

**Want to watch?**
→ Open Jellyfin on any device → pick something → play

**Storage full?**
→ Delete stuff you've watched (Radarr/Sonarr can auto-delete after X days)
→ Or buy bigger drives and swap them in

---

## HOW IT ALL CONNECTS (the full picture)

```
┌─────────────────────────────────────────────┐
│              YOUR NAS (always on)            │
│                                             │
│  Prowlarr ──→ searches torrent sites        │
│      ↓                                      │
│  Sonarr/Radarr ──→ picks best quality       │
│      ↓                                      │
│  qBittorrent ──→ downloads the file         │
│      ↓                                      │
│  /media/Movies, /TV, /Anime                 │
│      ↓                                      │
│  Jellyfin ──→ serves it to your devices     │
└─────────────────┬───────────────────────────┘
                  │
          Tailscale / Cloudflare Tunnel
                  │
    ┌─────────────┼─────────────────┐
    │             │                 │
  Phone         TV            Laptop
(anywhere)  (at home)      (anywhere)
```

---

## COST SUMMARY

| Item | Cost | When |
|------|------|------|
| Synology DS224+ | ~$350 | One-time |
| 2x 4TB WD Red | ~$200 | One-time |
| Electricity | ~$3-5/mo | Ongoing (unavoidable) |
| Tailscale | $0 | Free forever |
| Jellyfin + all apps | $0 | Free forever |
| **Total** | **~$550 once + ~$4/mo power** | |

No subscriptions. No monthly fees. Your content, your hardware, forever.

---

## VS YOUR CURRENT SETUP

| | Now (PC + Cloudflare) | NAS |
|---|---|---|
| Must be on 24/7 | Your full gaming PC (~$15/mo power) | Tiny silent box (~$4/mo power) |
| Seeking on big files | ❌ Broken through tunnel | ✅ Jellyfin handles it |
| Noise | PC fans | Silent |
| Size | Full tower | Small box (size of a book) |
| If it crashes | Everything down | Auto-restarts, drives protected |
| Auto-downloads | Your bat scripts | Sonarr/Radarr (way better) |
| Mobile app | None | Jellyfin app |

---

## WHEN TO BUY

No rush. Your current setup (Stremio + Torbox + PriismaTv) works fine for now. Buy the NAS when:
- You're tired of relying on Torbox/streaming services
- You want a permanent "this is MY library" feeling
- You want better quality control (exact releases you choose)
- You see a sale on the Synology or drives

Black Friday / Boxing Day = best prices for NAS + drives in Canada.
