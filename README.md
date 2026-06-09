# Walk of Love 💜 The Art of Love 💌

A one-of-one love letter built as an interactive site. Multiple sections, hidden interactions, a daily-changing note, a soundtrack, a "diary" with question-locked entries, and a reply form so it becomes a conversation, not a monologue.

Built on TanStack Start + React + Tailwind + Cloudflare (Workers, D1, R2).

---

## Current Architecture (June 2026)

- Frontend: TanStack Start + React (Vite build)
- Backend API: Hono on Cloudflare Workers (`src/api/worker.ts`)
- Database: Cloudflare D1 (`walkoflove-dev` in dev)
- Media: Cloudflare R2 (`walkoflove-dev-media` in dev, `walkoflove-prod-media` in prod)
- Auth: Cookie session flow backed by D1 sessions table

---

## Sections (in order)

1. Hero
2. Today's Note (changes by day)
3. Interrogation (her quiz)
4. Date Planner
5. Vacation picks (Dubai / Zanzibar / Bora Bora / Seychelles)
6. Love Quiz
7. Compatibility Meter
8. Dealbreakers (Tinder-style swipe deck)
9. Reasons
10. Promises
11. Map of You (interactive "Republic of Sheila")
12. Open When… (digital envelopes)
13. The Little Things
14. Almost Texted (unsent drafts)
15. Soundtrack of Us
16. A Letter from Jack (typewriter)
17. **Diary** — question-locked entries
18. Reply to Jack (sends to Lovable Cloud)
19. Photo Album (uploadable polaroids)
20. Mirror, Mirror (reframes negative self-talk)
21. 🎂 Birthday Vault (auto-unlocking date-locked cards)
22. 💝 Love Language Translator (5-question quiz → Jack-behavior translation)
23. 🏛️ Inside Jokes Museum (clickable artifact cards)
24. 🕰️ The Time Capsule (write-now, auto-unlock-on-date letters)
25. 🌌 Our Universe (constellation builder of memories)
26. 🍯 Sweetness Index (live "how loved are you today" meter)
27. 🪄 Wish I Could… (shuffleable, favouritable, cashable soft wishes)
28. 🧸 Comfort Mode (full-screen calming takeover)
29. The Official Invite
30. Countdown
31. Finale. 

Plus global: floating hearts, cursor glow, music toggle, rain toggle, easter eggs (type "sheila", Konami code, moon clicks, idle whisper).

---

## 🧸 Comfort Mode

A full-screen calming takeover for the loud days. One pulse-button — **"I need you. 🤍"** — fades the world to a soft pink-violet, plays slow piano on loop, and pulses a breathing orb (4s in · 2s hold · 4s out). A single affirmation rotates every 6 seconds from `AFFIRMATIONS` in `src/components/ComfortMode.tsx`. Exit with the quiet "i'm okay now" link.

Tweak the affirmation list or audio track at the top of `ComfortMode.tsx`.

---

## 🌱 Next up (ideas for future sections)

1. 💌 **The Apology Vault** — pre-written, painfully sincere apologies from Jack for hypothetical future stupid things.
2. 🎙 **Voice Memos from Jack** — fake voicemail inbox of typed-out love rambles styled as audio cards.
3. 🌧 **Rainy Day Drawer** — tiny rituals (a song, a snack, a sentence) to pull out only when she's sad.
4. 🪞 **Two Truths & a Vow** — a daily prompt where she logs two true things about today and Jack adds one promise.
5. 🧭 **Compass of Us** — a directional dial that, whichever way she spins it, always points to something about *them* (a memory, a future plan, a private joke).

---

## 🧭 Side menu (left sidebar)

A collapsible left-side navigation lives at the top-left corner (the ☰ button). It's **closed by default**, opens on tap, closes on `Esc` or by clicking outside.

- All sections are listed in order with an emoji + label.
- Clicking an item smooth-scrolls to that section.
- Source: `src/components/SideNav.tsx` — edit the `SECTIONS` array there to add/rename/reorder links. Each link's `id` must match the `<div id="...">` wrapper in `src/routes/index.tsx`.

---

## 🎂 Birthday Vault dates (edit these!)

Time-released cards in `src/components/BirthdayVault.tsx` → `CARDS` array. Each card auto-unlocks on its `month/day` (months are 1-12). Update with her real dates:

| Card | Default date | What it is |
|---|---|---|
| her birthday | 7/14 | the big one |
| our anniversary | 3/22 | the day she said yes to all this |
| christmas | 12/25 | warm-light-in-the-window |
| surprise #1 | 2/14 | valentine's, louder |
| surprise #2 | 5/1 | just because, spring |
| surprise #3 | 9/9 | first hoodie morning |
| surprise #4 | 11/11 | 11:11 wish |

Locked cards show a countdown and a "peek" button that only teases — they only truly unlock on the date.

---

## 📸 Photo Album controls

Each polaroid frame in the Photo Album has a **⋯ menu** (top-right, on hover) with:
- **Upload / Replace photo** — picks a local image, stored as base64 in `localStorage` (`photo-album-frames-v1`)
- **Edit caption** — inline textarea + save/cancel
- **Delete photo** — clears the image, keeps the caption + frame

Tap an empty frame anywhere to open the file picker. All edits persist per-browser.

Note: this component is still localStorage-based right now; it is not yet wired to the new `/api/media` R2 endpoints.

---

## 🔑 Diary unlock answers — cheat sheet (for Jack only)

Each diary entry shows a random question from the pool below. Hints appear after 5 wrong tries. Answers are case-insensitive and ignore punctuation.

| # | Question | Accepted answers | Hint chips (correct in **bold**) |
|---|---|---|---|
| 1 | what did Jack burn the first time he cooked for you? | `rice` / `the rice` / `white rice` | pasta · **rice** · eggs |
| 2 | what does Jack secretly call you when no one's listening? | `babe` / `baby` / `my baby` | honey · **babe** · queen |
| 3 | what's your made-up nickname for Jack? | `jacky` / `jackie` / `jay` | **jacky** · j-man · jackson |
| 4 | where's our dreamland? | `zanzibar` / `bora bora` / `borabora` / `dubai` | paris · **zanzibar** · tokyo |
| 5 | how many kids do we keep saying we'll have? | `2` / `two` / `3` / `three` | 1 · **2** · 5 |
| 6 | where did we first meet? | `instagram` / `online` / `ig` / `dm` / `dms` | tinder · **instagram** · a wedding |
| 7 | you're my favorite ___ | `person` / `human` / `everything` | **person** · headache · snack |
| 8 | what do I always steal from your plate? | `fries` / `chips` / `the fries` | **fries** · chicken · dessert |

Edit these in `src/components/Diary.tsx` → `QUESTIONS` array.

### How the lock works now
- First entry shows the question form open by default.
- Every other entry is blurred with an **"unlock to see ❤"** button.
- Clicking the button reveals that entry's question. Correct answer → full entry. Wrong → cute tease + fail counter.
- 5 wrong guesses on any entry → hint chips appear (one is correct).
- Each entry has its own independent unlock state (saved in `localStorage`).

---

## Other places to edit content

- `src/components/TodaysNote.tsx` — 60+ day-indexed micro-messages
- `src/components/Letter.tsx` — the main typewriter letter
- `src/components/OpenWhen.tsx` — envelope messages
- `src/components/LittleThings.tsx` — specific moments grid
- `src/components/Dealbreakers.tsx` — swipe-deck cards
- `src/components/Soundtrack.tsx` — playlist + annotations
- `src/components/MapOfYou.tsx` — regions on the "Republic of Sheila"
- `src/components/AlmostTexted.tsx` — unsent drafts
- `src/components/Vacation.tsx` — destination cards + images in `src/assets/travel-*.jpg`

---

## Backend (Cloudflare Worker API)

Main routes:

- `GET /api/health`
- `GET /api/replies`
- `POST /api/replies`
- `POST /api/auth/challenge`
- `POST /api/auth/verify`
- `POST /api/auth/logout`
- `GET /api/memories` (auth required)
- `POST /api/memories` (auth required)
- `POST /api/media/upload-url` (auth required)
- `PUT /api/media/:key` (auth required)
- `GET /api/media/:key` (auth required)

---

## Data Persistence Status

Cloud-backed now:

- `ReplyToJack` messages save to D1 (`sheila_replies`)
- `Memories` routes save to D1
- Media API routes save/read from R2 (backend ready)

Still browser-local (localStorage) for now:

- Diary unlock state
- Photo Album frame/caption state
- Sweetness Index state
- Time Capsule entries
- Universe stars
- Several other interaction widgets

---

## Run locally

```bash
npm install
npm run dev
```

Run Worker API in remote-dev mode (uses Cloudflare D1/R2 bindings):

```bash
npm exec wrangler -- dev --env dev --remote --port 8787
```

---

## Deploy

Frontend (recommended): Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`

Backend:

- Deploy Worker: `npm exec wrangler -- deploy --env dev` (dev)
- Prod deploy can use default environment once production DB config is added.

Made with too much love and too little sleep. — Jack