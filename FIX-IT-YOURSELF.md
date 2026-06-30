# Fix It Yourself — PriismaTv Troubleshooting Guide

When Kiro/AI credits run out, follow this guide to fix common issues yourself.

---

## QUICK FIXES (try these first)

### Site looks broken / old version showing
→ **Hard refresh:** `Ctrl + Shift + R` (clears cached JS)

### Content I added disappeared
→ Open DevTools (F12) → Console → paste:
```js
// Check if your content is in the user bucket
JSON.parse(localStorage.getItem('priismatv_user_content'))?.length
```
If it says `0` or `null`, the migration failed. Paste this to reset:
```js
localStorage.removeItem('priismatv_migrated_v7');
location.reload();
```

### Anime not playing / wrong content
→ Click the **"🔄 Fix Wrong Content"** button on the watch page
→ Or clear the ID cache:
```js
let c = JSON.parse(localStorage.getItem('priismatv_user_content') || '[]');
c.forEach(x => { delete x.imdbId; delete x.tmdbId; });
localStorage.setItem('priismatv_user_content', JSON.stringify(c));
location.reload();
```

### "Could not find streaming source"
→ The embed servers might be down. Try:
1. Wait a minute and try a different server button
2. If ALL servers fail, those free services might be temporarily offline — wait an hour
3. For anime: check if AniList ID shows below the servers. If "none", the title search failed.

### Vercel deploy failed (site stuck on old version)
1. Go to https://vercel.com → your project → Deployments tab
2. If the latest deploy is RED/failed, click it to see the error
3. Common fix: the build broke. Run this locally to see the exact error:
```bash
cd PriismaTv-v2
npm run build
```
4. Fix the error, commit, push again

---

## HOW TO MAKE CHANGES WITHOUT AI

### Adding content (easiest)
1. Log into the site as owner
2. Click **Add Content** in sidebar
3. Type the title → auto-fetches from TMDB → Save
4. Done. No code needed.

### Adding content via code (bulk)
1. Open `src/data/sample-content.ts`
2. Copy any existing line
3. Change the values (title, year, type, etc.)
4. Get poster URL from https://www.themoviedb.org (search → click → right-click poster → copy image URL)
5. Save, commit, push

### Pushing changes to the live site
```bash
cd PriismaTv-v2
git pull                        # get latest
# make your changes
git add .                       # stage
git commit -m "what I changed"  # save
git push                        # deploy (Vercel auto-builds)
```
Wait 1-2 min → hard refresh the site.

---

## COMMON ERRORS AND FIXES

### Build error: "Type error" or "unexpected token"
**Cause:** Typo in code (missing bracket, extra comma, wrong quote)
**Fix:** Look at the line number in the error. Open that file. Look for:
- Missing `}` or `)`
- Extra `,` at the end of a list
- Mismatched quotes `'` vs `"`
- Missing semicolons

### Build error: "Module not found"
**Cause:** A file was deleted or renamed but something still imports it
**Fix:** Search the codebase for the import path mentioned in the error. Either:
- Recreate the missing file
- Remove the import line that references it

### "localStorage is not defined"
**Cause:** Code tries to use localStorage during server-side rendering
**Fix:** Wrap it in `if (typeof window !== 'undefined')` or put it in a `useEffect`

### Embed server shows black screen / wrong movie
**Cause:** Free embed servers are unreliable and change constantly
**Fix:** 
- Try a different server button
- If ALL are broken, the free embed landscape shifted. Search for new working ones:
  1. Google "free movie embed API 2026"
  2. Test if it works: `curl -sI "https://DOMAIN/embed/movie/27205"` — should return 200
  3. Test if it allows iframes: check the headers for `x-frame-options` (should NOT say SAMEORIGIN)
  4. Add it to `src/app/(main)/watch/[id]/page.tsx` in the `getServers` function

### Anime servers (Priism Sub/Dub) stopped working
**Cause:** 4Animo (cdn.4animo.xyz) went down or changed their API
**Fix:**
1. Test: `curl -sI "https://cdn.4animo.xyz/embed/hd-1/ani/19603/1/sub?k=1"` 
2. If 403/404/timeout → their service is down
3. Search for alternatives: "anime embed API anilist 2026"
4. Update the URLs in `getServers` function in the watch page

---

## FILE MAP (where everything lives)

```
src/
├── data/
│   ├── sample-content.ts      ← All movies/anime/shows
│   ├── content.ts             ← Types + storage keys
│   └── changelog.ts           ← What's New popup entries
├── hooks/
│   ├── use-content-store.ts   ← Content persistence logic
│   ├── use-supabase.ts        ← Requests, invite codes, visitors
│   ├── use-theme.ts           ← Dark/light mode
│   └── use-mood.ts            ← Mood/background themes
├── app/(main)/
│   ├── watch/[id]/page.tsx    ← THE PLAYER + streaming servers
│   ├── anime/page.tsx         ← Anime section
│   ├── home/page.tsx          ← Home page
│   ├── requests/page.tsx      ← Content requests
│   ├── settings/page.tsx      ← Settings (mood, profiles, etc.)
│   └── admin/page.tsx         ← Add content page
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx        ← Navigation sidebar
│   │   ├── animated-background.tsx ← Background effects
│   │   └── top-bar.tsx        ← Top search bar
│   └── features/
│       ├── whats-new.tsx      ← Changelog popup
│       └── mood-selector.tsx  ← (unused now - moved to settings)
```

---

## ASKING CHATGPT FOR HELP

When you run out of Kiro credits, use ChatGPT. Paste this at the start of your conversation:

```
I need help with my PriismaTv v2 project. It's a Next.js streaming site.
Repo: github.com/arcuto29/PriismaTv-v2
Build command: NEXT_PRIVATE_SKIP_TURBOPACK=1 npx next build
The main streaming file is: src/app/(main)/watch/[id]/page.tsx
Content is in: src/data/sample-content.ts

Here's my problem: [describe it]
Here's the error: [paste error if any]
```

Then describe what's broken. ChatGPT can help fix code if you paste the relevant file content.

---

## USEFUL COMMANDS

### Fix "video plays but no audio" on My Server HD
The file has audio that browsers can't play (TrueHD/DDP/Atmos/DTS). Convert to AAC:
```powershell
ffmpeg -i "FILENAME.mp4" -c:v copy -c:a aac -b:a 192k "FILENAME-fixed.mp4"
```
Then delete the old file and rename the fixed one (remove `-fixed` from the name).

To check what audio a file has:
```powershell
ffmpeg -i "FILENAME.mp4"
```
If the audio line says `truehd`, `eac3`, `dts`, `dts-hd`, `ac3`, or `atmos` → that's the problem. Only `aac` works in browsers.

**Prevent this:** When downloading, pick releases tagged `AAC`, `YTS`, `YIFY`, or `x264`. Avoid `TrueHD`, `Atmos`, `DDP`, `DTS`.

```bash
# Check if build passes before pushing
npm run build

# See what files changed
git status

# Undo all uncommitted changes (CAREFUL - loses work)
git checkout .

# See the last 10 commits
git log --oneline -10

# Pull latest from GitHub
git pull

# Check what's on the live site vs your local
git diff origin/main
```

---

## CONTACT / KEYS REFERENCE

| Thing | Value |
|-------|-------|
| GitHub repo | arcuto29/PriismaTv-v2 |
| Vercel dashboard | vercel.com (log in with GitHub) |
| Supabase dashboard | supabase.com → project yjprgkslvychvyjchulw |
| TMDB API key | 2dca580c2a14b55200e784d157207b4d |
| Cloudflare | dash.cloudflare.com |
| Domain | priismatv.xyz (Namecheap) |
| Tunnel ID | ee826f8e-899e-4de3-85e8-97d6e47dbfc6 |
| Owner login | username: Priisma |

---

## IF EVERYTHING IS COMPLETELY BROKEN

Nuclear reset (last resort):
```bash
cd PriismaTv-v2
git fetch origin
git reset --hard origin/main
npm install
npm run build
```
This resets your local code to exactly what's on GitHub. You lose any uncommitted local changes but the project is guaranteed to work.

Then push to force Vercel to redeploy:
```bash
git commit --allow-empty -m "force redeploy"
git push
```
