import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";

type Card = {
  text: string;
  emoji: string;
  leftReply: string; // swipe left = dealbreaker
  rightReply: string; // swipe right = acceptable
};

const CARDS: Card[] = [
  { text: "Eats pizza with a fork", emoji: "🍕", leftReply: "Correct. Banished.", rightReply: "Bold. Reckless. Respectable." },
  { text: "Calls fries 'chips'", emoji: "🍟", leftReply: "Linguistic crime. Noted.", rightReply: "Cultured. We accept the British." },
  { text: "Doesn't text back for 6 hours", emoji: "📱", leftReply: "Jack is already typing 14 paragraphs.", rightReply: "Mysterious. Powerful. Painful." },
  { text: "Puts pineapple on pizza", emoji: "🍍", leftReply: "Wise. Restraining order issued.", rightReply: "Chaotic. We support you." },
  { text: "Says 'we should hang out' and never does", emoji: "👻", leftReply: "Jack felt that personally.", rightReply: "We've all been a villain once." },
  { text: "Doesn't like dogs", emoji: "🐶", leftReply: "Instant disqualification. Sorry.", rightReply: "Concerning. But fixable." },
  { text: "Steals the blanket every night", emoji: "🛏️", leftReply: "Justified. War declared.", rightReply: "Same. Negotiating co-ownership." },
  { text: "Talks during the movie", emoji: "🎬", leftReply: "Cinema crimes. Jail.", rightReply: "Adorable. Annoying. Cute." },
  { text: "Sends voice notes longer than 3 minutes", emoji: "🎙️", leftReply: "Justified. Issue a podcast warning.", rightReply: "Honestly? Jack would listen to all of them. Twice." },
  { text: "Says 'lol' but isn't actually laughing", emoji: "😐", leftReply: "Emotional fraud. Banned.", rightReply: "We all do it. Forgiven." },
  { text: "Leaves 1% battery and doesn't charge it", emoji: "🔋", leftReply: "Chaos goblin behavior. Noted.", rightReply: "Living on the edge. Sexy, actually." },
  { text: "Replies 'k'", emoji: "💀", leftReply: "Capital offense. Goodbye forever.", rightReply: "Bold. Cold. Slightly hot." },
  { text: "Doesn't share their fries", emoji: "🍟", leftReply: "Jack is taking this personally.", rightReply: "Respect. Boundaries. Cute." },
  { text: "Uses 'literally' when not literal", emoji: "📚", leftReply: "Linguists are crying. Approved.", rightReply: "Literally everyone does it. Pass." },
  { text: "Owns more than 4 streaming subscriptions", emoji: "📺", leftReply: "Financial red flag. Investigate.", rightReply: "Generous. We're moving in." },
  { text: "Hates surprise birthday parties", emoji: "🎂", leftReply: "Valid. Jack will whisper-celebrate instead.", rightReply: "Same. Cancel everyone." },
  { text: "Falls asleep during movies, every time", emoji: "😴", leftReply: "Sleepy gremlin. Adored.", rightReply: "Same. Naps > plot." },
  { text: "Has strong opinions about coffee", emoji: "☕", leftReply: "Insufferable. Beautiful. Married material.", rightReply: "Jack is taking notes for the date." },
];

export function Dealbreakers() {
  const [idx, setIdx] = useState(0);
  const [reply, setReply] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<"left" | "right" | null>(null);

  const card = CARDS[idx];
  const done = idx >= CARDS.length;

  const swipe = (dir: "left" | "right") => {
    const r = dir === "left" ? card.leftReply : card.rightReply;
    setVerdict(dir);
    setReply(r);
    setTimeout(() => {
      setReply(null);
      setVerdict(null);
      setIdx((i) => i + 1);
    }, 1400);
  };

  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-script text-2xl text-primary">section six</p>
        <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
          Dealbreakers, Decided
        </h2>
        <p className="mt-4 text-muted-foreground">
          Swipe left to cancel them. Swipe right to forgive. Jack is watching.
        </p>

        <div className="relative mx-auto mt-14 h-[420px] w-full max-w-sm">
          <AnimatePresence>
            {!done && !reply && (
              <SwipeCard key={idx} card={card} onSwipe={swipe} />
            )}
            {reply && (
              <motion.div
                key={`r-${idx}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              >
                <span className="text-5xl">{verdict === "left" ? "💔" : "💞"}</span>
                <p className="font-script text-3xl text-gradient-hero">{reply}</p>
              </motion.div>
            )}
            {done && (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center glass rounded-3xl p-8"
              >
                <div className="text-5xl">⚖️💘</div>
                <h3 className="mt-3 font-display text-2xl font-semibold">Verdict filed.</h3>
                <p className="mt-2 text-muted-foreground">
                  Jack passed all your tests by being the exception to every rule.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!done && (
          <div className="mt-8 flex items-center justify-center gap-6 text-sm font-semibold text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="rounded-full bg-rose-500/15 px-3 py-1 text-rose-500">← swipe</span>
              dealbreaker
            </span>
            <span className="flex items-center gap-2">
              acceptable
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-500">swipe →</span>
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

function SwipeCard({ card, onSwipe }: { card: Card; onSwipe: (d: "left" | "right") => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOp = useTransform(x, [40, 140], [0, 1]);
  const nopeOp = useTransform(x, [-140, -40], [1, 0]);

  return (
    <motion.div
      drag="x"
      style={{ x, rotate }}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 120) onSwipe("right");
        else if (info.offset.x < -120) onSwipe("left");
      }}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 cursor-grab select-none rounded-[2rem] bg-gradient-to-br from-white to-rose-50 p-8 shadow-[var(--shadow-card)] active:cursor-grabbing"
    >
      <motion.div
        style={{ opacity: nopeOp }}
        className="absolute left-6 top-6 rotate-[-12deg] rounded-xl border-2 border-rose-500 px-3 py-1 text-lg font-extrabold uppercase tracking-wider text-rose-500"
      >
        Nope
      </motion.div>
      <motion.div
        style={{ opacity: likeOp }}
        className="absolute right-6 top-6 rotate-[12deg] rounded-xl border-2 border-emerald-500 px-3 py-1 text-lg font-extrabold uppercase tracking-wider text-emerald-500"
      >
        Fine
      </motion.div>

      <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="text-7xl">{card.emoji}</div>
        <p className="mt-6 font-display text-2xl font-semibold text-foreground">
          "{card.text}"
        </p>
        <p className="mt-4 text-sm text-muted-foreground">drag the card →</p>
      </div>

      <div className="absolute inset-x-6 bottom-6 flex justify-between md:hidden">
        <button
          onClick={() => onSwipe("left")}
          className="rounded-full bg-rose-500/10 px-5 py-2 text-sm font-bold text-rose-500"
        >
          💔 Nope
        </button>
        <button
          onClick={() => onSwipe("right")}
          className="rounded-full bg-emerald-500/10 px-5 py-2 text-sm font-bold text-emerald-600"
        >
          Fine 💞
        </button>
      </div>
    </motion.div>
  );
}