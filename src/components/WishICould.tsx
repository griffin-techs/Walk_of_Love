import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const WISHES = [
  "kiss the back of your neck while you're making tea",
  "tuck your hair behind your ear mid-sentence",
  "hold your hand under the table at dinner",
  "press my forehead to yours when you're stressed",
  "make you laugh so hard you snort",
  "carry you to bed when you fall asleep on the couch",
  "watch you get ready and pretend i'm not staring",
  "warm your feet with mine on a cold night",
  "feed you the first bite of whatever i'm cooking",
  "kiss your shoulder every time i walk past you",
  "play with your fingers when we're stuck in traffic",
  "leave little notes in your jacket pockets",
  "rub your back in slow circles until you fall asleep",
  "be the reason you smile at your phone in public",
  "dance with you in the kitchen, badly",
  "wake up before you just to look at you for a second",
  "let you steal my hoodie and pretend i didn't notice",
  "tell you you're beautiful at the most random moment",
  "pull you into a hug from behind for no reason",
  "remember the tiny thing you said you wanted last week",
  "read with you in complete, comfortable silence",
  "kiss the freckle on your face like it's mine",
  "be the soft place you come home to",
];

const FAVS_KEY = "wish-i-could-favs-v1";
const CASHED_KEY = "wish-i-could-cashed-v1";

function load<T>(k: string, fallback: T): T {
  try { const r = localStorage.getItem(k); return r ? (JSON.parse(r) as T) : fallback; } catch { return fallback; }
}

export function WishICould() {
  const [seed, setSeed] = useState(0);
  const [favs, setFavs] = useState<string[]>([]);
  const [cashed, setCashed] = useState<string[]>([]);
  const [filter, setFilter] = useState<"all" | "favs" | "cashed">("all");

  useEffect(() => {
    setFavs(load<string[]>(FAVS_KEY, []));
    setCashed(load<string[]>(CASHED_KEY, []));
  }, []);

  const shuffled = useMemo(() => {
    const arr = [...WISHES];
    // simple deterministic shuffle from seed
    let s = seed || 1;
    for (let i = arr.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      const j = Math.floor((s / 233280) * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [seed]);

  const visible = shuffled.filter((w) =>
    filter === "favs" ? favs.includes(w) : filter === "cashed" ? cashed.includes(w) : true,
  );

  const toggleFav = (w: string) => {
    const next = favs.includes(w) ? favs.filter((x) => x !== w) : [...favs, w];
    setFavs(next);
    try { localStorage.setItem(FAVS_KEY, JSON.stringify(next)); } catch {}
  };
  const cashIn = (w: string) => {
    if (cashed.includes(w)) return;
    const next = [...cashed, w];
    setCashed(next);
    try { localStorage.setItem(CASHED_KEY, JSON.stringify(next)); } catch {}
  };

  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <p className="text-center font-script text-2xl text-primary">🪄 wish i could…</p>
        <h2 className="mt-2 text-center font-display text-4xl font-bold md:text-5xl text-gradient-hero">
          soft, specific, just for you
        </h2>
        <p className="mt-3 text-center text-foreground/70">
          tap the heart to keep one. tap "cash in" to redeem it next time we're together.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setSeed((s) => s + 1)}
            className="rounded-full bg-gradient-hero px-5 py-2 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            🔀 shuffle
          </button>
          {(["all", "favs", "cashed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                filter === f
                  ? "bg-primary/20 text-primary"
                  : "border border-primary/20 text-foreground/70 hover:bg-primary/10"
              }`}
            >
              {f === "all" ? "all" : f === "favs" ? `♥ saved (${favs.length})` : `💌 cashed in (${cashed.length})`}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((w) => {
              const isFav = favs.includes(w);
              const isCashed = cashed.includes(w);
              return (
                <motion.div
                  key={w}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass relative rounded-2xl p-5"
                >
                  <p className="font-script text-xl text-primary">i wish i could…</p>
                  <p className="mt-1 text-base text-foreground/90">{w}.</p>
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={() => toggleFav(w)}
                      className="text-xl transition-transform hover:scale-125"
                      aria-label="favourite"
                    >
                      {isFav ? "♥" : "♡"}
                    </button>
                    <button
                      onClick={() => cashIn(w)}
                      disabled={isCashed}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                        isCashed
                          ? "bg-primary/10 text-primary/70"
                          : "bg-gradient-hero text-white hover:scale-105"
                      }`}
                    >
                      {isCashed ? "✓ cashed in" : "cash in"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        {visible.length === 0 && (
          <p className="mt-10 text-center text-sm text-muted-foreground">nothing here yet — go save some 🩷</p>
        )}
      </div>
    </section>
  );
}