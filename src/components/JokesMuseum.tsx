import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const ARTIFACTS = [
  {
    title: "The Great Rice Incident",
    year: "exhibit 001",
    blurb: "in which Jack attempted dinner.",
    story:
      "The first time Jack cooked for you, he burned the rice so badly the pot needed a funeral. You ate it anyway, smiling like it was Michelin-starred. He still hasn't lived it down — and you bring it up every single time he opens the rice cooker.",
  },
  {
    title: "The Zanzibar Debate",
    year: "exhibit 002",
    blurb: "a foundational argument about beaches.",
    story:
      "An entire afternoon was lost to whether Zanzibar's east coast or west coast was 'the right side.' Neither of you had ever been. Neither of you backed down. The treaty was sealed with a kiss and the agreement to find out together.",
  },
  {
    title: "Babe vs. Baby",
    year: "exhibit 003",
    blurb: "the linguistic standoff of our time.",
    story:
      "You insisted 'babe' was for friends. He insisted 'baby' was a song lyric. The compromise is that he still calls you both, depending on the mood, and you pretend to hate one of them.",
  },
  {
    title: "The Fries Treaty",
    year: "exhibit 004",
    blurb: "a long-standing breach of trust.",
    story:
      "Jack will, at any restaurant, in any country, on any date — steal exactly three fries from your plate. He thinks you don't notice. You always notice. You let him because it's somehow become the most romantic theft in history.",
  },
  {
    title: "The 2AM Dance Floor",
    year: "exhibit 005",
    blurb: "kitchen tile, bare feet, no music.",
    story:
      "There was no song. The fridge hummed. You danced anyway. Jack stepped on your foot. You said 'do that again' and he did. Officially the moment he stopped pretending he wasn't already in love.",
  },
  {
    title: "Operation: Pretend To Sleep",
    year: "exhibit 006",
    blurb: "a tactical retreat.",
    story:
      "You once faked being asleep for twenty whole minutes just to see how he'd react. He whispered 'I love you' into your hair, ate the last of your fries, and stole the covers. You opened one eye. He said: 'I knew.'",
  },
  {
    title: "The Instagram Slide",
    year: "exhibit 007",
    blurb: "the DM that started everything.",
    story:
      "It took Jack four drafts. Three rewrites. One pep talk from his cousin. The final message was three words and a heart. You opened it instantly. You waited forty-five minutes to reply on purpose. He waited five seconds.",
  },
  {
    title: "The Forehead Kiss Protocol",
    year: "exhibit 008",
    blurb: "a non-negotiable.",
    story:
      "Before leaving any room, Jack must kiss your forehead. If forgotten, he must return. If interrupted, he must restart. This was never discussed. This was never agreed upon. It just became law.",
  },
];

export function JokesMuseum() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="font-script text-2xl text-primary">est. the day we met</p>
          <h2 className="mt-2 font-display text-5xl md:text-7xl font-bold text-gradient-hero">
            The Inside Jokes Museum
          </h2>
          <p className="mt-4 italic text-muted-foreground">
            "no flash photography. these jokes are sacred."
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ARTIFACTS.map((a, i) => (
            <motion.button
              key={a.title}
              type="button"
              onClick={() => setOpen(i)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-card/60 p-6 text-left backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-[var(--glow-pink)]"
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
                <span>{a.year}</span>
                <span className="rounded-full border border-primary/30 px-2 py-0.5 text-[10px]">artifact</span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-bold text-foreground">
                {a.title}
              </h3>
              <p className="mt-2 font-script text-lg text-primary/80">{a.blurb}</p>
              <p className="mt-4 text-xs text-muted-foreground/70">tap to read the placard →</p>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <>
            <motion.div
              key="bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(null)}
              className="fixed inset-0 z-[120] bg-background/70 backdrop-blur-sm"
            />
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-1/2 top-1/2 z-[125] w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-primary/30 bg-card p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
                <span>{ARTIFACTS[open].year}</span>
                <button
                  type="button"
                  onClick={() => setOpen(null)}
                  className="rounded-full border border-primary/30 px-3 py-1 transition hover:bg-primary/10"
                >
                  close
                </button>
              </div>
              <h3 className="mt-3 font-display text-3xl font-bold text-gradient-hero">
                {ARTIFACTS[open].title}
              </h3>
              <p className="mt-2 font-script text-xl text-primary">{ARTIFACTS[open].blurb}</p>
              <div className="mt-6 rounded-2xl border border-primary/15 bg-background/40 p-5">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">museum placard</p>
                <p className="mt-2 font-display leading-relaxed text-foreground/90">
                  {ARTIFACTS[open].story}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}