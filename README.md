# For Sheila — a website from Jack 💌

A one-of-one love letter built as an interactive site. Multiple sections, hidden interactions, a daily-changing note, a soundtrack, a "diary" with question-locked entries, and a reply form so it becomes a conversation, not a monologue.

Built on Lovable (TanStack Start + React + Tailwind + Lovable Cloud/Supabase).

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
19. The Official Invite
20. Countdown
21. Finale

Plus global: floating hearts, cursor glow, music toggle, rain toggle, easter eggs (type "sheila", Konami code, moon clicks, idle whisper).

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

## Backend (Lovable Cloud)

- `sheila_replies` table stores mood + word from the Reply form.
- Read replies via Lovable Cloud / Supabase dashboard.

---

## Run locally

```bash
bun install
bun dev
```

Made with too much love and too little sleep. — Jack