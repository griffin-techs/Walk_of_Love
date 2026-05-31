import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const KEY = "sheila_diary_start";
const UNLOCK_PREFIX = "sheila_diary_unlocked_";
const FAILS_PREFIX = "sheila_diary_fails_";

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
  // each entry gets its own random question + independent unlock state
  const [qIndices] = useState(() =>
    ENTRIES.map(() => Math.floor(Math.random() * QUESTIONS.length))
  );
  const [unlocked, setUnlocked] = useState<boolean[]>(() => ENTRIES.map(() => false));
  const [open, setOpen] = useState<boolean[]>(() => ENTRIES.map((_, i) => i === 0));
  const [guesses, setGuesses] = useState<string[]>(() => ENTRIES.map(() => ""));
  const [fails, setFails] = useState<number[]>(() => ENTRIES.map(() => 0));
  const [feedback, setFeedback] = useState<(string | null)[]>(() => ENTRIES.map(() => null));

  useEffect(() => {
    let s = Number(localStorage.getItem(KEY));
    if (!s || Number.isNaN(s)) {
      s = Date.now();
      localStorage.setItem(KEY, String(s));
    }
    setStartMs(s);
    setUnlocked(ENTRIES.map((_, i) => localStorage.getItem(UNLOCK_PREFIX + i) === "true"));
    setFails(
      ENTRIES.map((_, i) => {
        const f = Number(localStorage.getItem(FAILS_PREFIX + i) || "0");
        return Number.isNaN(f) ? 0 : f;
      })
    );
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const daysSince = startMs ? Math.floor((now - startMs) / 86_400_000) + 1 : 1;

  const update = <T,>(arr: T[], i: number, v: T) => arr.map((x, j) => (j === i ? v : x));

  const tryUnlock = (i: number) => (e: React.FormEvent) => {
    e.preventDefault();
    const guess = guesses[i];
    if (!guess.trim()) return;
    const q = QUESTIONS[qIndices[i]];
    const ok = q.answers.some((a) => norm(a) === norm(guess));
    if (ok) {
      setUnlocked((u) => update(u, i, true));
      localStorage.setItem(UNLOCK_PREFIX + i, "true");
      setFeedback((f) => update(f, i, "you got it. i knew you would. ❤"));
    } else {
      const next = fails[i] + 1;
      setFails((f) => update(f, i, next));
      localStorage.setItem(FAILS_PREFIX + i, String(next));
      setFeedback((f) => update(f, i, TEASES[next % TEASES.length]));
      setGuesses((g) => update(g, i, ""));
    }
  };

  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="font-script text-2xl text-primary">the diary i'm not supposed to show you</p>
          <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
            Every page is a question.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tap unlock. Prove it's you. Read what's underneath.
          </p>
          <p className="mt-2 font-script text-lg text-primary/70">
            day {daysSince} since you first opened this
          </p>
        </div>

        <div className="mt-14 space-y-6">
          {ENTRIES.map((e, i) => {
            const isOpen = unlocked[i];
            const isAsking = open[i] && !isOpen;
            const q = QUESTIONS[qIndices[i]];
            const showHints = fails[i] >= 5;
            return (
              <motion.div
                key={e.day}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.06, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className={`relative overflow-hidden rounded-3xl border p-8 backdrop-blur-md md:p-10 ${
                  isOpen
                    ? "border-primary/30 bg-card/70 shadow-xl"
                    : "border-primary/10 bg-card/30"
                }`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-script text-xl text-primary/70">day {e.day}</p>
                  {!isOpen && (
                    <p className="font-script text-sm text-muted-foreground">🔒 locked</p>
                  )}
                </div>
                <h3
                  className={`mt-2 font-display text-2xl font-semibold md:text-3xl ${
                    isOpen ? "text-foreground" : "text-foreground/40 blur-sm"
                  }`}
                >
                  {e.title}
                </h3>
                <p
                  className={`mt-4 font-display text-lg leading-relaxed transition-all ${
                    isOpen ? "text-foreground/90" : "select-none text-foreground/30 blur-md"
                  }`}
                >
                  {e.body}
                </p>
                {isOpen && (
                  <p className="mt-6 text-right font-script text-lg text-primary">— Jack</p>
                )}

                <AnimatePresence initial={false}>
                  {!isOpen && !isAsking && (
                    <motion.div
                      key="btn"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-6 flex justify-center"
                    >
                      <button
                        type="button"
                        onClick={() => setOpen((o) => update(o, i, true))}
                        className="rounded-full bg-primary px-6 py-3 font-display text-base font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105"
                      >
                        unlock to see ❤
                      </button>
                    </motion.div>
                  )}

                  {isAsking && (
                    <motion.form
                      key="form"
                      onSubmit={tryUnlock(i)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-6 rounded-2xl border border-primary/25 bg-background/40 p-5"
                    >
                      <p className="font-script text-sm text-primary/80">prove it's you</p>
                      <p className="mt-1 font-display text-lg text-foreground/90">{q.q}</p>
                      <input
                        value={guesses[i]}
                        onChange={(ev) => setGuesses((g) => update(g, i, ev.target.value))}
                        maxLength={40}
                        placeholder="type your answer…"
                        className="mt-4 w-full rounded-xl border border-primary/25 bg-background/50 px-4 py-3 font-display text-base outline-none focus:border-primary"
                      />
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <p className="font-script text-sm text-muted-foreground">
                          {feedback[i] ?? `${fails[i]} wrong guess${fails[i] === 1 ? "" : "es"}`}
                        </p>
                        <button
                          type="submit"
                          className="rounded-full bg-primary px-5 py-2.5 font-display text-sm font-semibold text-primary-foreground shadow transition-all hover:scale-105"
                        >
                          unlock
                        </button>
                      </div>
                      {showHints && (
                        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3">
                          <p className="font-script text-xs text-primary/80">
                            okay fine — one of these is right:
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {q.hints.map((h) => (
                              <button
                                key={h}
                                type="button"
                                onClick={() => setGuesses((g) => update(g, i, h))}
                                className="rounded-full border border-primary/30 bg-background/60 px-3 py-1.5 font-display text-xs transition-all hover:scale-105 hover:bg-primary/10"
                              >
                                {h}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}