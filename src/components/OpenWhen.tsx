import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const ENVELOPES = [
  {
    label: "Open when you're sad",
    emoji: "🌧️",
    message:
      "Hey. Breathe. Whatever it is, it's temporary — and you're not alone in it. I'm one message away, always. Put on something cozy, drink some water (yes, water, don't roll your eyes), and remember that someone out here thinks the world is a much better place because you're in it. Specifically, me. I think that. Loudly.",
  },
  {
    label: "Open when you miss me",
    emoji: "💌",
    message:
      "Same. Genuinely, same. Close your eyes for a second. I'm probably thinking about you right now — odds are honestly very high. Save this page. Re-read this line. I built an entire website so you'd never have to wonder.",
  },
  {
    label: "Open when you need to laugh",
    emoji: "🤡",
    message:
      "Okay picture this: me, trying to look cool around you, while internally my brain is doing the running-man emoji at full speed. That's the joke. That's the bit. I'm the joke. You're welcome.",
  },
  {
    label: "Open when you can't sleep",
    emoji: "🌙",
    message:
      "Stop scrolling. Seriously. Put the phone down after this. Imagine my voice saying something boring on purpose. Imagine a really warm blanket. Imagine I'm telling you that tomorrow is going to be okay — because it is. Goodnight, Sheila. ✨",
  },
  {
    label: "Open when you feel pretty",
    emoji: "💄",
    message:
      "Take the picture. Send me the picture. I will respond like an unserious person, and then I will stare at it for an embarrassing amount of time. This has been a Public Service Announcement.",
  },
  {
    label: "Open when you're proud of yourself",
    emoji: "🏆",
    message:
      "GOOD. You should be. Tell me what it is. I want all the details — the boring ones, the bragging ones, all of them. I'm already proud, I just want the receipts so I can be obnoxiously proud.",
  },
];

export function OpenWhen() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="font-script text-2xl text-primary">section seven</p>
          <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
            Open when...
          </h2>
          <p className="mt-4 text-muted-foreground">
            Little envelopes for big moments. Open them when you need them.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ENVELOPES.map((e, i) => (
            <motion.button
              key={e.label}
              type="button"
              onClick={() => setOpen(i)}
              initial={{ opacity: 0, y: 40, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
              whileTap={{ scale: 0.97 }}
              className="group relative aspect-[5/3.2] overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card to-card/40 p-6 text-left shadow-xl transition-shadow hover:shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.5)]"
            >
              <div className="absolute inset-x-0 top-0 h-1/2 origin-top border-b border-primary/30 bg-gradient-to-b from-primary/10 to-transparent transition-transform duration-700 group-hover:[transform:rotateX(180deg)]" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl opacity-90 transition-transform duration-700 group-hover:-translate-y-[120%] group-hover:scale-75">
                {e.emoji}
              </div>
              <div className="absolute bottom-5 left-6 right-6">
                <p className="font-script text-lg text-primary/80">letter</p>
                <p className="font-display text-lg font-semibold text-foreground">{e.label}</p>
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/0 via-primary/0 to-primary/0 transition-all duration-700 group-hover:from-primary/10" />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              type="button"
              aria-label="Close letter"
              onClick={() => setOpen(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.95, rotate: -2 }}
              animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
              exit={{ y: 60, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-xl rounded-3xl border border-primary/30 bg-card p-10 shadow-2xl"
            >
              <div className="mb-4 text-5xl">{ENVELOPES[open].emoji}</div>
              <p className="font-script text-2xl text-primary">{ENVELOPES[open].label}</p>
              <p className="mt-6 whitespace-pre-line font-display text-lg leading-relaxed text-foreground/90">
                {ENVELOPES[open].message}
              </p>
              <p className="mt-8 font-script text-xl text-primary">— Jack</p>
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="mt-8 rounded-full border border-primary/40 px-6 py-2 text-sm text-foreground/80 transition-colors hover:bg-primary/10"
              >
                Close gently
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}