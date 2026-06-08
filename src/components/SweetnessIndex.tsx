import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const STORAGE = "sweetness-index-v1";
const PEAK_KEY = "sweetness-peak-v1";

type State = { date: string; score: number };

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadState(): State {
  try {
    const raw = localStorage.getItem(STORAGE);
    if (raw) {
      const s = JSON.parse(raw) as State;
      if (s.date === todayKey()) return s;
    }
  } catch {}
  return { date: todayKey(), score: 0 };
}

function loadPeak(): { score: number; date: string } {
  try {
    const raw = localStorage.getItem(PEAK_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { score: 0, date: "" };
}

const LEVELS = [
  { min: 0, label: "warming up…", emoji: "🌱" },
  { min: 20, label: "she likes you", emoji: "🩷" },
  { min: 50, label: "smitten", emoji: "💗" },
  { min: 100, label: "head over heels", emoji: "💘" },
  { min: 180, label: "dangerously loved", emoji: "💖" },
  { min: 280, label: "in too deep (good)", emoji: "💞" },
  { min: 400, label: "off the charts", emoji: "🌟" },
];

export function SweetnessIndex() {
  const [state, setState] = useState<State>(() =>
    typeof window === "undefined" ? { date: todayKey(), score: 0 } : loadState(),
  );
  const [peak, setPeak] = useState(() =>
    typeof window === "undefined" ? { score: 0, date: "" } : loadPeak(),
  );
  const startedAt = useRef<number>(Date.now());

  // Persist & track peak
  useEffect(() => {
    try { localStorage.setItem(STORAGE, JSON.stringify(state)); } catch {}
    if (state.score > peak.score) {
      const next = { score: state.score, date: state.date };
      setPeak(next);
      try { localStorage.setItem(PEAK_KEY, JSON.stringify(next)); } catch {}
    }
  }, [state, peak.score]);

  // Bump on click anywhere on the page
  useEffect(() => {
    const onClick = () => setState((s) => ({ ...s, score: s.score + 1 }));
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  // Time-spent tick every 5s = +2
  useEffect(() => {
    const t = setInterval(() => {
      setState((s) => ({ ...s, score: s.score + 2 }));
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // Roll over at midnight
  useEffect(() => {
    const check = setInterval(() => {
      const k = todayKey();
      setState((s) => (s.date === k ? s : { date: k, score: 0 }));
    }, 30000);
    return () => clearInterval(check);
  }, []);

  const level = [...LEVELS].reverse().find((l) => state.score >= l.min) ?? LEVELS[0];
  const next = LEVELS.find((l) => l.min > state.score);
  const pct = next
    ? Math.min(100, ((state.score - level.min) / (next.min - level.min)) * 100)
    : 100;

  const minutes = Math.round((Date.now() - startedAt.current) / 60000);

  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-center font-script text-2xl text-primary">🍯 the sweetness index</p>
        <h2 className="mt-2 text-center font-display text-4xl font-bold md:text-5xl text-gradient-hero">
          how loved are you today?
        </h2>
        <p className="mt-3 text-center text-foreground/70">
          ticks up every time you click, stay, or even just exist on this page. resets at midnight.
        </p>

        <div className="glass mt-10 rounded-3xl p-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">today's score</p>
              <motion.p
                key={state.score}
                initial={{ scale: 0.9, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-display text-6xl font-bold text-gradient-hero"
              >
                {state.score}
              </motion.p>
            </div>
            <div className="text-right">
              <p className="text-4xl">{level.emoji}</p>
              <p className="font-script text-xl text-primary">{level.label}</p>
            </div>
          </div>

          <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-primary/10">
            <motion.div
              className="h-full rounded-full bg-gradient-hero"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {next ? `${next.min - state.score} more until "${next.label}"` : "you have unlocked everything ❤️"}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border border-primary/15 bg-card/60 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">all-time peak</p>
              <p className="font-display text-2xl text-foreground">{peak.score}</p>
              <p className="text-xs text-muted-foreground">{peak.date || "—"}</p>
            </div>
            <div className="rounded-2xl border border-primary/15 bg-card/60 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">time with jack</p>
              <p className="font-display text-2xl text-foreground">{minutes} min</p>
              <p className="text-xs text-muted-foreground">this visit</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}