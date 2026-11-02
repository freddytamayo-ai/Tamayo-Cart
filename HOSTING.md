# Hosting Tamayo Cart for free (instructions only — nothing has been deployed)

Tamayo Cart is a plain static folder: `index.html`, `app.js`, `parser.js`, `meals.js`, `mealplan.js`, `styles.css`,
`manifest.webmanifest`, `sw.js`, `icons/`, `vendor/` (Tesseract.js OCR engine + English data, ~11 MB).
There is no server code, no build step, and no API keys. Any static host works.

**What to upload:** everything in this folder *except* `tests/`, `screenshots/` and these `.md` files
(uploading them too is harmless — they're just not needed).

## ⚠️ Camera needs HTTPS
Phone browsers only allow `getUserMedia` (live camera) and service workers (offline mode / Add to
Home Screen) on **HTTPS** pages (or `http://localhost` on the same device). All three hosts below
give you HTTPS automatically. Opening `index.html` from a file, or over plain `http://192.168.x.x`,
will NOT get the live camera — the app falls back to the 🖼️ "take a photo" button, which still works.

Privacy note: whichever host you use, the site is public to anyone who has the URL, but the app
itself sends nothing anywhere — the cart, budget and history stay in each phone's browser storage.
Consider an unguessable project name if you want it obscure.

---

## Option A — Netlify Drop (easiest, no Git, ~2 minutes)
1. Go to <https://app.netlify.com/drop>.
2. Sign up / log in (free "Starter" plan; email or GitHub login).
3. Drag the whole `grocery-scanner` folder onto the page.
4. Wait for "Your site is deployed". You get a URL like `https://random-name-123.netlify.app`.
5. Optional: *Site configuration → Change site name* → e.g. `tamayo-cart-xyz` → `https://tamayo-cart-xyz.netlify.app`.
6. To update later: *Deploys* tab → drag the folder onto the "Drag and drop your site output folder here" box.

## Option B — Cloudflare Pages (direct upload, no Git)
1. Create a free account at <https://dash.cloudflare.com/sign-up>.
2. Dashboard → **Workers & Pages** → **Create** → **Pages** tab → **Upload assets** (Direct Upload).
3. Project name: e.g. `tamayo-cart` → **Create project**.
4. Drag in the `grocery-scanner` folder (or a zip of it) → **Deploy site**.
5. URL: `https://tamayo-cart.pages.dev` (name must be globally unique).
6. Updates: open the project → **Create new deployment** → upload the folder again.
   (CLI alternative: `npx wrangler pages deploy ./grocery-scanner --project-name tamayo-cart`.)
   Note: Cloudflare Pages' per-file limit is 25 MiB — our biggest file is ~4 MB, so it's fine.

## Option C — GitHub Pages (free; needs a GitHub account)
Note: free GitHub Pages sites come from **public** repos, so the code would be public (there's
nothing secret in it).
1. Create a repo on <https://github.com/new>, e.g. `tamayo-cart` (Public).
2. Upload the files: on the repo page **Add file → Upload files**, drag in the *contents* of
   `grocery-scanner` (so `index.html` is at the repo root, and `vendor/`, `icons/` folders keep their structure)
   → **Commit changes**.
   Or with git:
   ```bash
   cd grocery-scanner
   git init && git add . && git commit -m "Tamayo Cart"
   git branch -M main
   git remote add origin https://github.com/<your-username>/tamayo-cart.git
   git push -u origin main
   ```
3. Repo **Settings → Pages** → *Build and deployment* → Source: **Deploy from a branch** →
   Branch: `main`, folder `/ (root)` → **Save**.
4. After ~1 minute the site is at `https://<your-username>.github.io/tamayo-cart/`.
   (Paths in the app are all relative, so the `/tamayo-cart/` sub-path works.)
5. Optional: add an empty file named `.nojekyll` at the root to skip Jekyll processing.

---

## After it's hosted — install on each phone
* **iPhone (Safari):** open the URL → Share button → **Add to Home Screen** → Add.
* **Android (Chrome):** open the URL → ⋮ menu → **Install app** / **Add to Home screen**.
* Open it once while online and wait for the "✓ Ready to work offline" message (it downloads
  the ~11 MB OCR engine once). After that it works in stores with no signal.
* The first time you tap **Scan tag**, allow camera access.

## Updating the app later
The service worker caches files aggressively for offline use. When you change any file, bump
`VERSION` in `sw.js` (e.g. `tamayo-cart-v2`) before uploading; phones pick up the new version on
the next launch or two. Each phone's cart/history is kept across updates (it's in localStorage).

## Test locally (no hosting)
```bash
cd grocery-scanner && python3 -m http.server 8000
# open http://localhost:8000 on this computer (camera works on localhost)
```
