import { motion } from "framer-motion";
import { useState } from "react";

type Item = { kind: "memory" | "plan" | "joke"; text: string };

const ITEMS: Item[] = [
  { kind: "memory", text: "the night you laughed so hard you cried at nothing" },
  { kind: "memory", text: "your voice note at 2:14am — the sleepy one" },
  { kind: "memory", text: "the first time you said 'i love you' like you meant it forever" },
  { kind: "memory", text: "you in my hoodie, hair a mess, my whole world" },
  { kind: "memory", text: "the airport pickup we keep replaying in our heads" },
  { kind: "memory", text: "you falling asleep mid-sentence on a call" },
  { kind: "memory", text: "the way you said my name the first time it sounded like home" },
  { kind: "plan", text: "a slow morning in Zanzibar, you in linen, me in love" },
  { kind: "plan", text: "december 31st, midnight, your hand in mine" },
  { kind: "plan", text: "the bookshop date where we read each other our favorite lines" },
  { kind: "plan", text: "dancing barefoot in our kitchen at 11pm" },
  { kind: "plan", text: "a tiny wedding. you, me, the people who knew it before we did" },
  { kind: "plan", text: "naming a dog something embarrassing together" },
  { kind: "plan", text: "growing old loud and unbothered, you and me" },
  { kind: "joke", text: "the Great Rice Incident 🍚" },
  { kind: "joke", text: "'jacky' said in that one specific tone" },
  { kind: "joke", text: "the Zanzibar Debate (you were right, obviously)" },
  { kind: "joke", text: "'babe stop' (you never want me to stop)" },
  { kind: "joke", text: "the fries-stealing treaty of 2024" },
  { kind: "joke", text: "our voice for the cat we don't have yet" },
  { kind: "joke", text: "you saying 'one more episode' at 3am — liar 💕" },
];

const LABEL: Record<Item["kind"], string> = {
  memory: "a memory",
  plan: "a plan",
  joke: "an inside joke",
};

const EMOJI: Record<Item["kind"], string> = {
  memory: "🌙",
  plan: "✨",
  joke: "🤭",
};

export function CompassOfUs() {
  const [angle, setAngle] = useState(0);
  const [item, setItem] = useState<Item | null>(null);
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const extra = 720 + Math.floor(Math.random() * 720);
    const next = angle + extra;
    setAngle(next);
    const picked = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    window.setTimeout(() => {
      setItem(picked);
      setSpinning(false);
    }, 1400);
  };

  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-script text-3xl text-primary">compass of us</p>
        <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl">
          whichever way you spin it,
          <br />
          it always points to us
        </h2>
        <p className="mt-3 text-muted-foreground">
          tap the needle. it'll find a memory, a plan, or one of our stupid little jokes.
        </p>

        <div className="relative mx-auto mt-12 h-72 w-72 select-none">
          {/* outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 shadow-[0_0_60px_-10px_hsl(var(--primary)/0.4)] backdrop-blur-sm" />
          {/* tick marks */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 h-32 w-[2px] origin-top"
              style={{ transform: `translate(-50%, 0) rotate(${i * 30}deg)` }}
            >
              <div className="mx-auto h-3 w-[2px] bg-primary/40" />
            </div>
          ))}
          {/* cardinal letters — U / S */}
          <div className="pointer-events-none absolute inset-0 font-script text-2xl text-primary/70">
            <span className="absolute left-1/2 top-3 -translate-x-1/2">u</span>
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2">s</span>
            <span className="absolute left-3 top-1/2 -translate-y-1/2">&</span>
            <span className="absolute right-3 top-1/2 -translate-y-1/2">♡</span>
          </div>

          {/* needle */}
          <motion.button
            type="button"
            onClick={spin}
            animate={{ rotate: angle }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-1/2 h-56 w-3 -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
            aria-label="spin compass"
          >
            <div className="mx-auto h-1/2 w-full rounded-t-full bg-gradient-to-t from-primary to-primary/40 shadow-[0_0_20px_hsl(var(--primary)/0.6)]" />
            <div className="mx-auto h-1/2 w-full rounded-b-full bg-gradient-to-b from-foreground/40 to-foreground/10" />
          </motion.button>

          {/* center pin */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-primary shadow-lg" />
        </div>

        <button
          type="button"
          onClick={spin}
          disabled={spinning}
          className="mt-10 rounded-full border border-primary/40 bg-primary/10 px-8 py-3 font-display text-base text-foreground transition hover:bg-primary/20 disabled:opacity-60"
        >
          {spinning ? "finding us…" : item ? "spin again ↻" : "spin the compass"}
        </button>

        {item && !spinning && (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass mx-auto mt-8 max-w-xl rounded-3xl border border-primary/20 p-6"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              {EMOJI[item.kind]} it points to {LABEL[item.kind]}
            </p>
            <p className="mt-3 font-script text-2xl text-primary md:text-3xl">{item.text}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}