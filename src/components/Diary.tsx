import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const KEY = "sheila_diary_start";
const UNLOCK_KEY = "sheila_diary_unlocked";
const FAILS_KEY = "sheila_diary_fails";

// 💌 The unlock quiz — questions only Sheila would know.
// Each question accepts multiple spellings/variants. Edit freely.
const QUESTIONS: { q: string; answers: string[]; hints: string[] }[] = [
  {
    q: "what did Jack burn the first time he cooked for you?",
    answers: ["rice", "the rice", "white rice"],
    hints: ["pasta", "rice", "eggs"],
  },
  {
    q: "what does Jack secretly call you when no one's listening?",
    answers: ["babe", "baby", "my baby"],
    hints: ["honey", "babe", "queen"],
  },
  {
    q: "what's your made-up nickname for Jack?",
    answers: ["jacky", "jackie", "jay"],
    hints: ["jacky", "j-man", "jackson"],
  },
  {
    q: "where's our dreamland — the one we keep talking about?",
    answers: ["zanzibar", "bora bora", "borabora", "dubai"],
    hints: ["paris", "zanzibar", "tokyo"],
  },
  {
    q: "how many kids do we keep saying we'll have? (a number)",
    answers: ["2", "two", "3", "three"],
    hints: ["1", "2", "5"],
  },
  {
    q: "where did we first meet?",
    answers: ["instagram", "online", "ig", "dm", "dms"],
    hints: ["tinder", "instagram", "a wedding"],
  },
  {
    q: "complete this: 'you're my favorite ___'",
    answers: ["person", "human", "everything"],
    hints: ["person", "headache", "snack"],
  },
  {
    q: "what do I always steal from your plate?",
    answers: ["fries", "chips", "the fries"],
    hints: ["fries", "chicken", "dessert"],
  },
];

const TEASES = [
  "nope. but adorable try. 🙃",
  "wrong — and you call yourself my girlfriend?",
  "lol no. think harder, beautiful.",
  "incorrect. but i love watching you guess.",
  "that's a no. try again, smarty pants.",
  "wrong wrong wrong. cute though.",
];

function norm(s: string) {
  return s.trim().toLowerCase().replace(/[.!?'"`]/g, "");
}

const ENTRIES = [
  {
    day: 1,
    title: "Day one — the bravest thing I've done all year",
    body: "I sent it. The link. The whole thing. My hands were sweating like I was 14 again. I keep refreshing nothing. There's no notification to wait for. I just made a website and threw it into the universe and now I'm pacing. Please like at least one part of it. Please.",
  },
  {
    day: 3,
    title: "Day three — okay so",
    body: "You're still opening it. I can tell because something in me settles every time I think about it. I don't know what you're thinking. I'm trying not to ask. I'm doing a very bad job of not asking. Bear with me.",
  },
  {
    day: 7,
    title: "Day seven — a small confession",
    body: "I rewrote the letter section 11 times. The version you read isn't the original. The original was longer, weirder, more honest, and probably would've scared you a little. I'll show you that one one day. Maybe.",
  },
  {
    day: 14,
    title: "Day fourteen — two weeks in",
    body: "It's been two weeks. Whatever happens next, I want you to know — I don't regret a pixel of this. I've never been able to say things out loud the way I can build them. So I built you the thing. And you read it. That's already more than I asked for.",
  },
  {
    day: 30,
    title: "Day thirty — last unlocked entry",
    body: "If you made it here, you've come back five times at minimum. Which means something. Or it means nothing. I'll take either. Just know that the version of me who started this on day one had no idea you'd still be reading by now. Thank you for that. Genuinely. Thank you.",
  },
];

export function Diary() {
  const [startMs, setStartMs] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [unlocked, setUnlocked] = useState(false);
  const [qIndex] = useState(() => Math.floor(Math.random() * QUESTIONS.length));
  const [guess, setGuess] = useState("");
  const [fails, setFails] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    let s = Number(localStorage.getItem(KEY));
    if (!s || Number.isNaN(s)) {
      s = Date.now();
      localStorage.setItem(KEY, String(s));
    }
    setStartMs(s);
    if (localStorage.getItem(UNLOCK_KEY) === "true") setUnlocked(true);
    const f = Number(localStorage.getItem(FAILS_KEY) || "0");
    if (!Number.isNaN(f)) {
      setFails(f);
      if (f >= 5) setShowHints(true);
    }
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const daysSince = startMs ? Math.floor((now - startMs) / 86_400_000) + 1 : 1;
  const current = QUESTIONS[qIndex];

  const tryUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim()) return;
    const ok = current.answers.some((a) => norm(a) === norm(guess));
    if (ok) {
      setUnlocked(true);
      localStorage.setItem(UNLOCK_KEY, "true");
      setFeedback("you got it. i knew you would. welcome in. ❤");
    } else {
      const next = fails + 1;
      setFails(next);
      localStorage.setItem(FAILS_KEY, String(next));
      setFeedback(TEASES[next % TEASES.length]);
      if (next >= 5) setShowHints(true);
      setGuess("");
    }
  };

  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="font-script text-2xl text-primary">the diary i'm not supposed to show you</p>
          <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
            One entry. Then wait.
          </h2>
          <p className="mt-4 text-muted-foreground">
            New pages unlock with time. Come back. They're worth it.
          </p>
          <p className="mt-2 font-script text-lg text-primary/70">
            day {daysSince} since you first opened this
          </p>
        </div>

        {!unlocked && (
          <motion.form
            onSubmit={tryUnlock}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto mt-12 max-w-xl rounded-3xl border border-primary/30 bg-card/70 p-8 shadow-xl backdrop-blur-md"
          >
            <p className="font-script text-lg text-primary/80">prove it's you</p>
            <p className="mt-2 font-display text-xl text-foreground/90">{current.q}</p>
            <input
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              maxLength={40}
              placeholder="type your answer…"
              className="mt-5 w-full rounded-2xl border border-primary/25 bg-background/50 px-5 py-4 font-display text-lg outline-none focus:border-primary"
            />
            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="font-script text-sm text-muted-foreground">
                {feedback ?? `${fails} wrong guess${fails === 1 ? "" : "es"} so far`}
              </p>
              <button
                type="submit"
                className="rounded-full bg-primary px-6 py-3 font-display text-base font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105"
              >
                unlock
              </button>
            </div>
            {showHints && (
              <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <p className="font-script text-sm text-primary/80">
                  okay fine — a little help. one of these is right:
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {current.hints.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setGuess(h)}
                      className="rounded-full border border-primary/30 bg-background/60 px-4 py-2 font-display text-sm transition-all hover:scale-105 hover:bg-primary/10"
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.form>
        )}

        <div className="mt-14 space-y-6">
          {ENTRIES.map((e, i) => {
            const entryOpen = unlocked && daysSince >= e.day;
            const daysLeft = e.day - daysSince;
            const lockedReason = !unlocked ? "answer the question above" : `unlocks in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`;
            return (
              <motion.div
                key={e.day}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.06, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className={`relative overflow-hidden rounded-3xl border p-8 backdrop-blur-md md:p-10 ${
                  entryOpen
                    ? "border-primary/30 bg-card/70 shadow-xl"
                    : "border-primary/10 bg-card/30"
                }`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-script text-xl text-primary/70">day {e.day}</p>
                  {!entryOpen && (
                    <p className="font-script text-sm text-muted-foreground">
                      🔒 {lockedReason}
                    </p>
                  )}
                </div>
                <h3
                  className={`mt-2 font-display text-2xl font-semibold md:text-3xl ${
                    entryOpen ? "text-foreground" : "text-foreground/40 blur-sm"
                  }`}
                >
                  {e.title}
                </h3>
                <p
                  className={`mt-4 font-display text-lg leading-relaxed transition-all ${
                    entryOpen ? "text-foreground/90" : "select-none text-foreground/30 blur-md"
                  }`}
                >
                  {e.body}
                </p>
                {entryOpen && (
                  <p className="mt-6 text-right font-script text-lg text-primary">— Jack</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}