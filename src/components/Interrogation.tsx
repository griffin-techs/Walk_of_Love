import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export type Answers = Record<string, string>;

const QUESTIONS: {
  key: string;
  q: string;
  options: { label: string; emoji: string; reply: string }[];
}[] = [
  {
    key: "zombie",
    q: "Would you survive a zombie apocalypse with Jack?",
    options: [
      { label: "Obviously yes", emoji: "💪", reply: "Knew it. We're built different." },
      { label: "Yes but I'd carry snacks", emoji: "🍿", reply: "Snack supplier of the year. Hired." },
      { label: "Only if Jack protects me", emoji: "🛡️", reply: "Bodyguard mode: permanently activated." },
    ],
  },
  {
    key: "island",
    q: "If we got lost on an island, what would you save first?",
    options: [
      { label: "Jack", emoji: "🥹", reply: "Crying. Genuinely. Goodbye." },
      { label: "Food", emoji: "🍱", reply: "Honest. Respect. I'll be the food next." },
      { label: "WiFi", emoji: "📶", reply: "Gen Z behavior detected." },
      { label: "My lashes", emoji: "👁️", reply: "Priorities. We love a baddie." },
    ],
  },
  {
    key: "nickname",
    q: "What nickname should Jack unlock?",
    options: [
      { label: "Babe", emoji: "💕", reply: "Classic. Timeless. Approved." },
      { label: "CEO of My Heart", emoji: "💼", reply: "Stock just went up 400%." },
      { label: "Future Husband", emoji: "💍", reply: "Note taken. Ring shopping begins Tuesday." },
      { label: "Professional Disturber of Peace", emoji: "😈", reply: "Accurate. Putting it on the resume." },
    ],
  },
];

export function Interrogation({
  answers,
  setAnswers,
}: {
  answers: Answers;
  setAnswers: (a: Answers) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [reply, setReply] = useState<string | null>(null);
  const q = QUESTIONS[idx];
  const done = idx >= QUESTIONS.length;

  const pick = (opt: { label: string; reply: string }) => {
    setAnswers({ ...answers, [q.key]: opt.label });
    setReply(opt.reply);
    setTimeout(() => {
      setReply(null);
      setIdx((i) => i + 1);
    }, 1600);
  };

  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-script text-2xl text-primary">section one</p>
        <h2 className="mt-2 font-display text-5xl md:text-7xl font-bold text-gradient-hero">
          The Love Interrogation
        </h2>
        <p className="mt-4 text-muted-foreground">Three questions. Zero wrong answers. Maybe.</p>

        <div className="mt-12 flex justify-center gap-2">
          {QUESTIONS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-10 rounded-full transition-all ${
                i <= idx ? "bg-gradient-hero" : "bg-foreground/15"
              }`}
            />
          ))}
        </div>

        <div className="relative mt-10 min-h-[420px]">
          <AnimatePresence mode="wait">
            {!done && !reply && (
              <motion.div
                key={q.key}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="glass rounded-3xl p-8 md:p-12"
              >
                <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  {q.q}
                </h3>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {q.options.map((opt) => (
                    <motion.button
                      key={opt.label}
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => pick(opt)}
                      className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/60 px-5 py-4 text-left font-medium text-foreground shadow-[var(--shadow-card)] transition-colors hover:border-primary/50"
                    >
                      <span className="mr-2 text-2xl">{opt.emoji}</span>
                      {opt.label}
                      <span className="absolute inset-0 -z-0 bg-gradient-hero opacity-0 transition-opacity group-hover:opacity-10" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {reply && (
              <motion.div
                key="reply"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ type: "spring", damping: 14 }}
                className="flex flex-col items-center justify-center gap-4 pt-10"
              >
                <FloatingEmojiBurst />
                <p className="font-script text-4xl md:text-5xl text-gradient-hero">{reply}</p>
              </motion.div>
            )}

            {done && (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-3xl p-10"
              >
                <div className="text-5xl">📝💖</div>
                <h3 className="mt-3 font-display text-3xl font-semibold">Statement recorded.</h3>
                <p className="mt-2 text-muted-foreground">
                  Court adjourned. Verdict: undeniable chemistry.
                </p>
                <p className="mt-6 font-script text-2xl text-primary">keep scrolling, baby 💌</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function FloatingEmojiBurst() {
  const emojis = ["💖", "✨", "🥰", "💫", "🌸", "💕"];
  return (
    <div className="relative h-32 w-full">
      {emojis.map((e, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 text-4xl"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.4, 0.6],
            x: Math.cos((i / emojis.length) * Math.PI * 2) * 140,
            y: Math.sin((i / emojis.length) * Math.PI * 2) * 80,
          }}
          transition={{ duration: 1.5, delay: i * 0.05 }}
        >
          {e}
        </motion.span>
      ))}
    </div>
  );
}

export { QUESTIONS };