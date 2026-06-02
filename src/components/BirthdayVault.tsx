import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type VaultCard = {
  id: string;
  label: string;
  month: number; // 1-12
  day: number;
  emoji: string;
  title: string;
  message: string;
};

// Edit these to her real dates. Months are 1-12.
const CARDS: VaultCard[] = [
  {
    id: "birthday",
    label: "her birthday",
    month: 7,
    day: 14,
    emoji: "🎂",
    title: "happy birthday, my whole world",
    message:
      "another year of you existing — and another year of me being unreasonably lucky. i'd light every candle on this earth just to keep watching you make a wish.",
  },
  {
    id: "anniversary",
    label: "our anniversary",
    month: 3,
    day: 22,
    emoji: "💍",
    title: "the day you said yes to all this",
    message:
      "still the best deal i ever made. same booth, same order, same disbelief that you keep choosing me.",
  },
  {
    id: "christmas",
    label: "christmas",
    month: 12,
    day: 25,
    emoji: "🎄",
    title: "merry christmas, my favorite gift",
    message:
      "every ornament we hang is a tiny vote for more years of this. you are the warm-light-in-the-window of my whole life.",
  },
  {
    id: "surprise-1",
    label: "surprise #1",
    month: 2,
    day: 14,
    emoji: "💌",
    title: "valentine's, but louder",
    message:
      "you are my valentine on february 14th and the other 364 too. consider this card the loud version.",
  },
  {
    id: "surprise-2",
    label: "surprise #2",
    month: 5,
    day: 1,
    emoji: "🌷",
    title: "first of may, just because",
    message:
      "no reason. no occasion. just me, reminding you that the prettiest thing about spring is that you walk through it.",
  },
  {
    id: "surprise-3",
    label: "surprise #3",
    month: 9,
    day: 9,
    emoji: "🍂",
    title: "the autumn one",
    message:
      "first cold morning, hoodie weather, your hands stealing mine in the pocket. that's it. that's the whole love letter.",
  },
  {
    id: "surprise-4",
    label: "surprise #4",
    month: 11,
    day: 11,
    emoji: "✨",
    title: "11:11 — make a wish",
    message:
      "you're my wish. every time. even when i pretend i'm wishing for something cooler. i'm always just wishing for more of you.",
  },
];

function isUnlocked(card: VaultCard, now: Date) {
  return now.getMonth() + 1 === card.month && now.getDate() === card.day;
}

function daysUntil(card: VaultCard, now: Date) {
  const year = now.getFullYear();
  let target = new Date(year, card.month - 1, card.day);
  if (target.getTime() < new Date(year, now.getMonth(), now.getDate()).getTime()) {
    target = new Date(year + 1, card.month - 1, card.day);
  }
  const ms = target.getTime() - new Date(year, now.getMonth(), now.getDate()).getTime();
  return Math.round(ms / 86400000);
}

export function BirthdayVault() {
  const [now, setNow] = useState(() => new Date());
  const [opened, setOpened] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const sorted = useMemo(
    () =>
      [...CARDS].sort((a, b) => {
        const ua = isUnlocked(a, now);
        const ub = isUnlocked(b, now);
        if (ua !== ub) return ua ? -1 : 1;
        return daysUntil(a, now) - daysUntil(b, now);
      }),
    [now],
  );

  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="font-script text-2xl text-primary">set it, forget it, love you</p>
          <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
            The Birthday Vault 🎂
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-muted-foreground">
            cards locked away by the calendar. they pop open on your birthday, our
            anniversary, christmas, and four surprise dates — so love shows up even
            when i forget the day.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((c, i) => {
            const unlocked = isUnlocked(c, now);
            const days = daysUntil(c, now);
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 6) * 0.06 }}
                whileHover={{ y: -4 }}
                className={`relative overflow-hidden rounded-2xl border p-6 transition-all ${
                  unlocked
                    ? "border-primary/50 bg-gradient-to-br from-primary/10 via-card to-card shadow-[0_20px_50px_-12px_oklch(0.55_0.2_350/40%)]"
                    : "border-border bg-card/60"
                }`}
              >
                {unlocked && (
                  <div className="absolute right-3 top-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground">
                    unlocked today
                  </div>
                )}
                <div className="text-4xl">{c.emoji}</div>
                <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                  {c.label} · {c.month}/{c.day}
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold">
                  {unlocked ? c.title : "sealed for now"}
                </h3>

                {unlocked ? (
                  <p className="mt-3 font-script text-lg leading-snug text-foreground/85">
                    {c.message}
                  </p>
                ) : (
                  <>
                    <p className="mt-3 text-sm text-muted-foreground">
                      opens in <span className="font-semibold text-primary">{days}</span>{" "}
                      {days === 1 ? "day" : "days"} ✨
                    </p>
                    <button
                      type="button"
                      onClick={() => setOpened(c.id)}
                      className="mt-4 rounded-full border border-primary/40 px-3 py-1.5 text-xs text-primary transition-colors hover:bg-primary/10"
                    >
                      peek (just a little)
                    </button>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        <p className="mt-12 text-center font-script text-xl text-primary/80">
          time-released love — already wrapped, already yours ❤
        </p>
      </div>

      <AnimatePresence>
        {opened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpened(null)}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-background/80 p-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md rounded-2xl border border-primary/30 bg-card p-8 text-center shadow-2xl"
            >
              <div className="text-5xl">🔒</div>
              <p className="mt-4 font-display text-xl">no peeking, love.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                this one's locked until its day. that's the whole point — surprises
                are kept, not previewed.
              </p>
              <button
                type="button"
                onClick={() => setOpened(null)}
                className="mt-5 rounded-full bg-primary px-4 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
              >
                okay, i'll wait
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}