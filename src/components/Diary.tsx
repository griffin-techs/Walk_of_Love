import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const KEY = "sheila_diary_start";

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

  useEffect(() => {
    let s = Number(localStorage.getItem(KEY));
    if (!s || Number.isNaN(s)) {
      s = Date.now();
      localStorage.setItem(KEY, String(s));
    }
    setStartMs(s);
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const daysSince = startMs ? Math.floor((now - startMs) / 86_400_000) + 1 : 1;

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

        <div className="mt-14 space-y-6">
          {ENTRIES.map((e, i) => {
            const unlocked = daysSince >= e.day;
            const daysLeft = e.day - daysSince;
            return (
              <motion.div
                key={e.day}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.06, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className={`relative overflow-hidden rounded-3xl border p-8 backdrop-blur-md md:p-10 ${
                  unlocked
                    ? "border-primary/30 bg-card/70 shadow-xl"
                    : "border-primary/10 bg-card/30"
                }`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-script text-xl text-primary/70">day {e.day}</p>
                  {!unlocked && (
                    <p className="font-script text-sm text-muted-foreground">
                      🔒 unlocks in {daysLeft} day{daysLeft === 1 ? "" : "s"}
                    </p>
                  )}
                </div>
                <h3
                  className={`mt-2 font-display text-2xl font-semibold md:text-3xl ${
                    unlocked ? "text-foreground" : "text-foreground/40 blur-sm"
                  }`}
                >
                  {e.title}
                </h3>
                <p
                  className={`mt-4 font-display text-lg leading-relaxed transition-all ${
                    unlocked ? "text-foreground/90" : "select-none text-foreground/30 blur-md"
                  }`}
                >
                  {e.body}
                </p>
                {unlocked && (
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