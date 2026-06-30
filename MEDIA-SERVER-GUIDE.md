# The Ultimate Media Server Guide for PriismaTv

Two setups: one for **just you** (cheapest), one for **you + friends** (best experience for everyone). Pick the one that fits.

---

## SETUP A: Just Me (cheapest, simplest)

**Use your existing Windows PC + Jellyfin + Cloudflare Tunnel**

### Cost: $0/month (you already have everything)

### What you need
- Your Windows PC (already running)
- Jellyfin (free) instead of the basic Node.js server
- Your existing Cloudflare Tunnel (`stream.priismatv.xyz`)

### Step 1: Install Jellyfin
1. Download from https://jellyfin.org/downloads/
2. Install on Windows (takes 2 minutes)
3. Open `http://localhost:8096` → create your admin account
4. Add libraries → point at `D:\Movies`
5. Let it scan (auto-fetches posters, metadata, episode info)

### Step 2: Configure for 4K HDR
- Dashboard → Playback → Set "Maximum allowed transcoding resolution" to **4K**
- Dashboard → Playback → Enable **hardware acceleration** (your PC's GPU does the work)
  - For Nvidia: pick "NVENC"
  - For Intel: pick "QSV" (Intel Quick Sync)
  - For AMD: pick "VA-API"
- This means: 4K HDR plays perfectly on capable devices, lower-end devices get transcoded automatically

### Step 3: Access from anywhere
You already have a Cloudflare named tunnel. Add Jellyfin to it:

Edit `C:\Users\Priis.PRIISMA\.cloudflared\config.yml`:
```yaml
tunnel: ee826f8e-899e-4de3-85e8-97d6e47dbfc6
credentials-file: C:\Users\Priis.PRIISMA\.cloudflared\ee826f8e-899e-4de3-85e8-97d6e47dbfc6.json

ingress:
  - hostname: stream.priismatv.xyz
    service: http://localhost:8080
  - hostname: media.priismatv.xyz
    service: http://localhost:8096
  - service: http_status:404
```

Then add a DNS record in Cloudflare: `media.priismatv.xyz` → CNAME → your tunnel ID.

Now `https://media.priismatv.xyz` = your Jellyfin, accessible anywhere.

### Step 4: Watch on phone/TV
- **iPhone/Android:** Download "Jellyfin" app → add server: `https://media.priismatv.xyz`
- **Fire Stick / Android TV:** Install Jellyfin from app store
- **Browser:** Just open `https://media.priismatv.xyz`
- **Apple TV:** Use "Infuse" app (best quality) → add Jellyfin server

### Limitations of this setup
- ⚠️ Your PC must be ON for anyone to watch
- ⚠️ Uses your upload bandwidth (fine for just you, but 4K = 50-100 Mbps per stream)
- ⚠️ If your internet goes down, media is unavailable
- ✅ Seeking works perfectly (Jellyfin handles range requests properly)
- ✅ $0 cost
- ✅ Full 4K HDR with hardware transcoding

---

## SETUP B: Me + Friends (best experience, no home internet impact)

**Seedbox running Jellyfin in a datacenter**

### Cost: ~$10-20/month

### Why this is better for sharing
- 10 Gbps datacenter connection (vs your ~30 Mbps upload)
- Multiple people can stream 4K simultaneously without buffering
- Your home internet is NEVER touched
- Server is on 24/7 (no "my PC is off" problems)
- Friends don't need to install anything special (just the Jellyfin app)

### Step 1: Pick a seedbox provider

| Provider | Price | Storage | Speed | Apps |
|----------|-------|---------|-------|------|
| **DediSeedbox** | ~$10/mo | 2 TB | 10 Gbps | Jellyfin + Sonarr + Radarr pre-installed |
| **RapidSeedbox** | ~$12/mo | 2 TB | 10 Gbps | App-tier plans include Jellyfin |
| **PulsedMedia** | ~$8/mo | 3 TB | 1 Gbps | Cheapest per-TB, less polished |
| **Bytesized** | ~$15/mo | 2 TB | 10 Gbps | Best support, GPU transcoding option |

*Prices paraphrased from 2026 guides — verify on each site before buying. Content was rephrased for compliance with licensing restrictions.*

**My pick: DediSeedbox** — easiest setup, everything pre-installed, 10 Gbps.

### Step 2: Install Jellyfin on the seedbox
Most providers have 1-click app install:
1. Log into your seedbox control panel
2. Click "Install" next to Jellyfin (or Plex)
3. Set up your admin account
4. Add media libraries

### Step 3: Get content onto the seedbox

**Option A: Download directly on the box (recommended)**
- Most seedboxes include a torrent client (qBittorrent, ruTorrent)
- Optional: Install **Sonarr** (auto-grabs TV episodes) + **Radarr** (auto-grabs movies)
- Content downloads at datacenter speed → immediately available to stream
- Your home internet is never involved

**Option B: Upload from your PC**
- Use the seedbox's file manager or SFTP (FileZilla)
- Upload your `D:\Movies` files once, then they live on the box forever
- Only uses your internet during the upload

### Step 4: Add friends
1. Jellyfin → Dashboard → Users → Add User
2. Give each friend a username/password
3. Share the URL: `https://yourbox.dediseedbox.com/jellyfin`
4. They install the Jellyfin app on their phone/TV and log in
- Unlimited users, no extra cost

### Step 5: Automate new content (optional but sick)
Install on the seedbox:
- **Sonarr** — auto-downloads new anime/TV episodes when they air
- **Radarr** — auto-downloads movies you add to a wishlist
- **Jackett/Prowlarr** — connects to torrent trackers
- **Bazarr** — auto-downloads subtitles

This means: you add "Black Clover" to Sonarr → every new episode downloads automatically → appears in Jellyfin → you get notified. Zero manual work.

---

## COMPARISON TABLE

| Feature | Setup A (home PC) | Setup B (seedbox) |
|---------|-------------------|-------------------|
| Monthly cost | $0 (just electricity ~$10) | ~$10-20/mo |
| Internet impact | Uses your upload | Zero |
| 4K HDR | ✅ (1 stream max usually) | ✅ (multiple simultaneous) |
| Friends streaming | ⚠️ Eats your bandwidth | ✅ Datacenter handles it |
| 24/7 uptime | Only if PC stays on | ✅ Always |
| Seeking on big files | ✅ (Jellyfin fixes this) | ✅ |
| Auto-download new episodes | ✅ With Sonarr/Radarr | ✅ With Sonarr/Radarr |
| Storage | Limited to your hard drive | 2-8 TB (expandable) |

---

## WHICH ONE?

- **"I just want to watch my stuff on my phone"** → Setup A (free, your PC)
- **"I want friends to use it without killing my internet"** → Setup B (seedbox)
- **"I want to start free, upgrade later"** → Start with A, move to B when you want to share

---

## HOW THIS CONNECTS TO PRISMATV

Your PriismaTv website can work ALONGSIDE Jellyfin:

- **PriismaTv** = for browsing your catalog, using embed servers (VidLink, Priism Sub/Dub), social features (requests, chat, watchlist)
- **Jellyfin** = for streaming YOUR actual files in 4K HDR with proper seeking, mobile apps, multi-user

You can also **replace My Server (HD)** with your Jellyfin instance — just update `MY_SERVER_URL` in the watch page code to point at your Jellyfin/seedbox URL instead of the Node.js server.

Or just use both side by side. Many people do — PriismaTv for the social/browsing experience, Jellyfin app for the actual watching.

---

## QUICK START (if you just want to go)

### Fastest free path (Setup A):
```
1. Download Jellyfin from jellyfin.org
2. Install, point at D:\Movies
3. Add media.priismatv.xyz to your Cloudflare tunnel config
4. Download Jellyfin app on phone → add server
5. Done. Watch anywhere.
```

### Fastest paid path (Setup B):
```
1. Sign up at dediseedbox.com (~$10/mo, 2TB)
2. 1-click install Jellyfin from their panel
3. Download a few movies/shows using their torrent client
4. Share the URL + login with friends
5. Done. Everyone streams from the datacenter.
```
