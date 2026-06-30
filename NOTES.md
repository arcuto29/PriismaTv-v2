# PriismaTv v2 — Owner Notes & Cheat Sheet

Everything you need to run, maintain, and add content to PriismaTv without help.

---

## 1. QUICK REFERENCE (keys, URLs, logins)

| Thing | Value |
|-------|-------|
| Live site | https://priismatv.xyz |
| Vercel project | priisma-tv-v2 |
| GitHub repo | arcuto29/PriismaTv-v2 |
| My movie server (tunnel) | https://stream.priismatv.xyz |
| Movie files location | `D:\Movies` (Windows PC) |
| Owner username | `Priisma` |
| Owner password | `Jolterz2929$` |
| Master password (backup) | `shadowmonarch` |
| Supabase URL | https://yjprgkslvychvyjchulw.supabase.co |
| TMDB API key | `2dca580c2a14b55200e784d157207b4d` |
| Build command | `NEXT_PRIVATE_SKIP_TURBOPACK=1 npx next build` |

---

## 2. DAILY TASKS

### Add a movie/anime/show (EASIEST WAY)
1. Log in as owner on the site
2. Click **Add Content** button
3. Type the title → it auto-fetches the poster/info from TMDB
4. Save. Done. No code needed.

### Add content by editing code (for bulk adds)
File: `src/data/sample-content.ts`
Copy an existing line and change the values:
```ts
{id:'unique-id',title:'Movie Name',type:'movie',year:2024,rating:8.0,genre:'action',description:'...',poster:'https://image.tmdb.org/t/p/w500/POSTER.jpg',backdrop:'https://image.tmdb.org/t/p/original/BACKDROP.jpg',trailer:'YOUTUBE_ID',duration:'2h',tags:['must-watch'],dateAdded:'2024-06-01'},
```
- `type` = `'movie'`, `'anime'`, or `'tvshow'`
- For shows/anime add: `episodes:13,seasons:1` instead of `duration`
- Get poster/backdrop paths from https://www.themoviedb.org (search title → images)

---

## 3. PUSHING CHANGES (the 5 commands)

```bash
git pull                       # ALWAYS run first
git add .                      # stage changes
git commit -m "what I changed" # save checkpoint
git push                       # send to GitHub → Vercel auto-deploys
git log --oneline              # see history
```

After `git push`, wait ~1-2 min, then **hard refresh** the site (Ctrl+Shift+R).

---

## 4. RUNNING IT LOCALLY (recommended)

Install **Node.js** + **VS Code** once. Then:
```bash
git clone https://github.com/arcuto29/PriismaTv-v2
cd PriismaTv-v2
npm install
npm run dev          # opens http://localhost:3000 with live reload
```
Test before pushing:
```bash
NEXT_PRIVATE_SKIP_TURBOPACK=1 npx next build   # if this passes, Vercel will too
```

---

## 5. WHEN SOMETHING BREAKS

1. **Site stuck on old version?** → Go to vercel.com → Deployments tab. If the latest is RED/failed, the site stays on the old build. Fix the error and push again.
2. **Build fails?** → Run `npm run build` locally to see the exact error and line number.
3. **JavaScript errors?** → Browser DevTools (F12) → Console tab.
4. **Wrong content / no source playing?** → Use the "🔄 Fix Wrong Content" button on the watch page. It re-fetches the IDs.

---

## 6. KEY FILES

| File | What it does |
|------|--------------|
| `src/data/sample-content.ts` | All movies/anime/shows |
| `src/app/(main)/watch/[id]/page.tsx` | Player + streaming servers |
| `src/lib/supabase.ts` | Backend connection |
| `src/app/page.tsx` | Welcome/login page |
| `src/components/layout/sidebar.tsx` | Navigation |

### How streaming works
- **Movies/TV:** embed servers (VidLink, 2Embed, AutoEmbed, AnyEmbed, NontonGo) using TMDB/IMDB IDs auto-fetched from TMDB.
- **Anime:** 4Animo embed (`cdn.4animo.xyz`) using AniList ID. Servers shown as "Priism Sub / Dub / S2". Same source Seanime uses.
- **My Server (HD):** files in `D:\Movies` streamed via Cloudflare tunnel. Auto-matches by title + year.

---

## 7. MOVIE SERVER (your PC)

### What runs on startup
- `server.js` (Node) serves `D:\Movies` on localhost:8080
- Cloudflare tunnel maps `stream.priismatv.xyz` → localhost:8080
- `start-priismatv.bat` in the Windows Startup folder auto-starts both

### Manual start (if it's not running)
Open PowerShell in the server folder and run the two commands, OR just double-click `start-priismatv.bat`.

### Downloading tips (Stremio/torrents)
- **PICK:** `ENG`, `YTS`, `YIFY`, `AAC`, `x264`/`x265 1080p`
- **AVOID:** `ITA`, `RUS`, `seleZen`, `селезень`, `MULTI`, `DDP`, `Atmos`, `TrueHD` (these cause no-audio issues in browsers)
- Save everything to `D:\Movies`

---

## 8. CONVERTING VIDEO (FFmpeg) — fixing "no audio"

Browsers can't play TrueHD/DDP/Atmos audio or MKV containers well. Convert to **MP4 + AAC**.

### A) Simple: copy video, convert audio to AAC (fast, no quality loss to video)
```powershell
ffmpeg -i "input.mkv" -c:v copy -c:a aac -b:a 192k "output.mp4"
```

### B) BEST: auto-pick ENGLISH audio + convert to AAC (use this for multi-language files)
```powershell
ffmpeg -i "input.mkv" -map 0:v:0 -map 0:m:language:eng -map 0:a:0? -c:v copy -c:a aac -b:a 192k -map -0:s "output.mp4"
```
- `-map 0:m:language:eng` grabs the English track
- `-map 0:a:0?` falls back to first audio if no English tagged
- `-map -0:s` drops subtitles (they often break MP4)

### C) If you get "Stream map matches no streams" error
The English track has a different index. List the tracks first:
```powershell
ffmpeg -i "input.mkv"
```
Look for the audio line tagged `(eng)`, note its number (e.g. `Stream #0:2(eng)`), then:
```powershell
ffmpeg -i "input.mkv" -map 0:v:0 -map 0:2 -c:v copy -c:a aac -b:a 192k "output.mp4"
```
(replace `0:2` with the English track's number)

### D) After converting
Delete the old `.mkv` so the server doesn't match the wrong file. Keep only the `.mp4`.

---

## 9. FULL AUTOMATION — auto-convert script

Save the file below as `auto-convert.bat` in `D:\Movies`. Double-click it (or add to Startup).
It watches the folder and automatically converts any new MKV to MP4 with English AAC audio, then deletes the MKV.

See `scripts/auto-convert.bat` in this repo for the full script.

### Make it run on PC startup (set once)
1. Press `Win + R`, type `shell:startup`, press Enter
2. Copy a shortcut to `auto-convert.bat` AND `start-priismatv.bat` into that folder
3. Now both run automatically every time the PC turns on — you never touch them again

---

## 10. THINGS I DON'T WANT (reminders)
- No Korean dramas, no quizzes, no sound effects, no daily pick, no streak counter
- No inappropriate/adult content
- Sidebar starts collapsed, expands on hover
- Owner should never re-enter passwords (auto-unlock everything)
