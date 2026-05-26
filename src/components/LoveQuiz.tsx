import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

type Question = {
  q: string;
  yes: { label: string; reply: string };
  options?: { label: string; reply: string }[];
  runaway?: { label: string; taunts: string[] };
};

const QUESTIONS: Question[] = [
  {
    q: "Do you love Jack?",
    yes: { label: "Yes ❤️", reply: "Knew it. Suspicions confirmed." },
    runaway: {
      label: "No 😭",
      taunts: [
        "Nice try, Sheila.",
        "The system has detected the correct answer already.",
        "Error 404: Wrong answer unavailable.",
        "This button is shy. Maybe like you?",
        "Lol no. Click the other one. 💕",
      ],
    },
  },
  {
    q: "Would you survive life with Jack?",
    yes: { label: "Absolutely", reply: "Power couple confirmed." },
    options: [
      { label: "Depends if snacks exist", reply: "Snacks will be provided. Forever." },
      { label: "We'll become legends together", reply: "Statues already being commissioned." },
    ],
  },
  {
    q: "How many hugs should Jack receive?",
    yes: { label: "Unlimited DLC Pack", reply: "Subscription activated. No refunds." },
    options: [
      { label: "1", reply: "Bold. Insulting. Slightly hot." },
      { label: "100", reply: "Acceptable. Negotiating up." },
    ],
  },
];

export function LoveQuiz() {
  const [idx, setIdx] = useState(0);
  const [reply, setReply] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const q = QUESTIONS[idx];

  const next = (r: string, big = false) => {
    setReply(r);
    if (big) {
      const colors = ["#ff6fa3", "#ffb88c", "#c084fc", "#fde68a"];
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 }, colors });
    }
    setTimeout(() => {
      setReply(null);
      if (idx + 1 >= QUESTIONS.length) setDone(true);
      else setIdx((i) => i + 1);
    }, 2400);
  };

  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-script text-2xl text-primary">section four</p>
        <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
          Important Relationship Investigation
        </h2>
        <p className="mt-4 text-muted-foreground">
          Please answer honestly. (One of the buttons is broken on purpose.)
        </p>

        <div className="relative mt-14 min-h-[420px]">
          <AnimatePresence mode="wait">
            {!done && !reply && (
              <motion.div
                key={q.q}
                initial={{ opacity: 0, y: 30, filter: "blur(14px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -30, filter: "blur(14px)" }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="glass rounded-3xl p-8 md:p-12"
              >
                <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  {q.q}
                </h3>

                <div className="relative mt-10 flex flex-col items-center gap-4">
                  <YesButton
                    label={q.yes.label}
                    onClick={() => next(q.yes.reply, true)}
                  />
                  {q.runaway && <RunawayButton {...q.runaway} />}
                  {q.options?.map((opt) => (
                    <SoftButton key={opt.label} onClick={() => next(opt.reply)}>
                      {opt.label}
                    </SoftButton>
                  ))}
                </div>
              </motion.div>
            )}

            {reply && (
              <motion.div
                key="reply"
                initial={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center justify-center gap-3 pt-16"
              >
                <p className="font-script text-4xl md:text-5xl text-gradient-hero">{reply}</p>
              </motion.div>
            )}

            {done && (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="glass rounded-3xl p-10"
              >
                <div className="text-5xl">💘</div>
                <h3 className="mt-3 font-display text-3xl font-semibold">Verdict: guilty of loving Jack.</h3>
                <p className="mt-2 text-muted-foreground">
                  Sentence: keep scrolling, gorgeous.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function YesButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      className="relative min-w-[220px] rounded-full bg-gradient-hero animate-gradient animate-pulse-glow px-10 py-4 text-lg font-bold text-white"
    >
      <span className="relative z-10">{label}</span>
    </motion.button>
  );
}

function SoftButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="min-w-[220px] rounded-full border border-white/60 bg-white/60 px-8 py-3.5 text-base font-semibold text-foreground shadow-[var(--shadow-card)] backdrop-blur transition-colors hover:border-primary/50"
    >
      {children}
    </motion.button>
  );
}

function RunawayButton({ label, taunts }: { label: string; taunts: string[] }) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [shrink, setShrink] = useState(1);
  const [rot, setRot] = useState(0);
  const [taunt, setTaunt] = useState<string | null>(null);
  const tauntIdx = useRef(0);
  const tauntTimer = useRef<number | null>(null);

  const dodge = (cx: number, cy: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const bx = r.left + r.width / 2;
    const by = r.top + r.height / 2;
    const dx = bx - cx;
    const dy = by - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > 120) return;
    const push = 140;
    const angle = Math.atan2(dy, dx);
    const parent = el.parentElement?.getBoundingClientRect();
    const maxX = parent ? parent.width / 2 - 40 : 200;
    const maxY = 80;
    setPos((p) => ({
      x: Math.max(-maxX, Math.min(maxX, p.x + Math.cos(angle) * push)),
      y: Math.max(-maxY, Math.min(maxY, p.y + Math.sin(angle) * push * 0.4)),
    }));
    setRot((r) => r + (Math.random() * 30 - 15));
    setShrink((s) => Math.max(0.55, s * 0.94));

    if (tauntTimer.current) window.clearTimeout(tauntTimer.current);
    setTaunt(taunts[tauntIdx.current % taunts.length]);
    tauntIdx.current++;
    tauntTimer.current = window.setTimeout(() => setTaunt(null), 1800);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => dodge(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) dodge(t.clientX, t.clientY);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      if (tauntTimer.current) window.clearTimeout(tauntTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full">
      <motion.button
        ref={ref}
        animate={{ x: pos.x, y: pos.y, scale: shrink, rotate: rot }}
        transition={{ type: "spring", stiffness: 240, damping: 18 }}
        onClick={(e) => {
          e.preventDefault();
          dodge(e.clientX, e.clientY);
        }}
        className="mx-auto block min-w-[180px] rounded-full border border-foreground/15 bg-white/70 px-6 py-3 text-base font-semibold text-foreground/60 shadow-sm"
      >
        {label}
      </motion.button>
      <AnimatePresence>
        {taunt && (
          <motion.p
            key={taunt}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-3 text-center font-script text-xl text-primary"
          >
            {taunt}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}