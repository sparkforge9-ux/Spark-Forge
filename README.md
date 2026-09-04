# SparkForge — 3-page split

## Files
- `dashboard.html` — main dashboard (home, iteration hub, idea bank, tasks). First page.
- `login.html` — standalone sign-in / sign-up page. Redirects to `dashboard.html` on success.
- `integration.html` — Native AI Copilot page (from your Gemini file), now linked into the site nav instead of standing alone.
- `assets/firebase-init.js` — one shared Firebase config, imported by both `dashboard.html` and `login.html` (was duplicated inline in two places before — a change to one could silently drift from the other).
- `vercel.json` / `firebase.json` — deploy configs for Vercel + Firebase together.

Colors, fonts, and animations are untouched — same `brand` / `neon` Tailwind palette as your original file. `integration.html`'s buttons were switched from its own indigo/orange to the same `brand`/`neon` tokens so all three pages read as one product instead of two different apps.

## Bugs found and fixed
1. **No real login gate** — `dashboard.html` never checked auth state on load, so `switchPage` and the whole platform were reachable without ever signing in, while `login.html` was originally just a modal. Now `dashboard.html` redirects to `login.html` when `onAuthStateChanged` reports no user, and `login.html` redirects straight to `dashboard.html` if you're already signed in.
2. **Duplicated Firebase config** — `firebaseConfig` was hardcoded once in `index.html` and would have had to be re-typed again for the new login page, guaranteeing drift. Pulled into `assets/firebase-init.js`, imported everywhere.
3. **Gemini fetch didn't check HTTP status** — `handleNativeChatSubmit` in the AI Copilot page called `res.json()` even on a failed request (bad/expired key, quota, etc.), so errors surfaced as a confusing "No response generated" instead of a clear failure. Added `if (!res.ok) throw ...`.
4. **`getAnalytics()` called unconditionally** — throws in some privacy-locked browsers/iframes. Swapped for `isSupported()` guard in `firebase-init.js`.
5. **Idea Bank search was exact-substring only** — searching "clean energy" wouldn't match an idea whose hook only says "renewable" or "solar". `filterBank()` now splits the query into words and matches an idea if *any* word hits name, category, country, hook, or spec text — a topic search now pulls in every related idea instead of just literal phrase matches.
6. Wired the previously-separate `integration.html` into the site: its header now links back to `dashboard.html` (and deep-links straight into the Idea Bank tab), instead of being an unreachable standalone file.

## Firebase + Vercel together
1. `firebase login` then `firebase deploy --only hosting` deploys these static files straight to Firebase Hosting using `firebase.json` — good for a quick Firebase-only preview.
2. For Vercel: `vercel --prod` from this folder (or connect the repo in the Vercel dashboard). `vercel.json` gives you clean URLs (`/login`, `/ai`) and makes `dashboard.html` the root.
3. Auth itself still runs through Firebase Auth regardless of which host serves the HTML — but Firebase only allows sign-in from domains you've explicitly authorized. After deploying to Vercel, add your Vercel domain (e.g. `your-app.vercel.app`) under **Firebase Console → Authentication → Settings → Authorized domains**, or Google/email sign-in will fail with `auth/unauthorized-domain`.
4. The Firebase web API key in `assets/firebase-init.js` is a public client identifier (normal for Firebase web apps, not a secret) — access is actually controlled by Firebase Auth + your Firestore/Storage security rules, not by hiding this key.

## Idea Bank search
`bankSearchInput` now does multi-word "any topic word matches" search across name, category, country, hook, and tech spec text — type a broad topic and every related idea in the bank surfaces, not just an exact phrase.
