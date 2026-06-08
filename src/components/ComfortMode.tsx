import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const AFFIRMATIONS = [
  "you are safe. you are loved. you are mine.",
  "breathe. i've got you, even from here.",
  "you don't have to be okay right now.",
  "you are not too much. you are exactly enough.",
  "the world is loud. i am quiet here with you.",
  "i'd choose you again. and again. and again.",
  "rest. the world can wait. so can i.",
  "you are softer than you think, and stronger than you know.",
  "let it be heavy for a second. i'm holding the other end.",
  "your feelings make sense. all of them.",
  "you are deeply, stupidly, completely loved.",
];

export function ComfortMode() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % AFFIRMATIONS.length), 6000);
    return () => clearInterval(t);
  }, [open]);

  useEffect(() => {
    if (!open) {
      audioRef.current?.pause();
      return;
    }
    if (!audioRef.current) {
      const a = new Audio(
        "https://cdn.pixabay.com/download/audio/2022/03/15/audio_3081f8855e.mp3?filename=relaxing-piano-music-22918.mp3",
      );
      a.loop = true;
      a.volume = 0.35;
      audioRef.current = a;
    }
    audioRef.current.play().catch(() => {});
    return () => { audioRef.current?.pause(); };
  }, [open]);

  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-script text-2xl text-primary">🧸 comfort mode</p>
        <h2 className="mt-2 font-display text-4xl font-bold md:text-5xl text-gradient-hero">
          when it's all too much
        </h2>
        <p className="mt-3 text-foreground/70">
          one button. soft piano, slow breathing, one quiet thing at a time. close it whenever you want.
        </p>
        <button
          onClick={() => { setIdx(0); setOpen(true); }}
          className="mt-8 rounded-full bg-gradient-hero px-10 py-5 text-lg font-semibold text-white shadow-xl transition-transform hover:scale-105 active:scale-95 animate-pulse-glow"
        >
          I need you. 🤍
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[oklch(0.15_0.05_320/96%)] px-6 text-center"
          >
            {/* breathing orb */}
            <motion.div
              animate={{ scale: [1, 1.5, 1.5, 1, 1], opacity: [0.6, 1, 1, 0.6, 0.6] }}
              transition={{ duration: 10, repeat: Infinity, times: [0, 0.4, 0.6, 1, 1], ease: "easeInOut" }}
              className="h-48 w-48 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.85 0.15 350 / 90%) 0%, oklch(0.7 0.2 320 / 50%) 50%, transparent 80%)",
                filter: "blur(2px)",
              }}
            />
            <p className="mt-6 text-sm uppercase tracking-[0.4em] text-white/60">breathe with me</p>
            <motion.p
              animate={{ opacity: [0.5, 1, 1, 0.5] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="mt-2 font-script text-2xl text-white/80"
            >
              in… hold… out…
            </motion.p>

            <div className="mt-10 min-h-[5rem] max-w-xl">
              <AnimatePresence mode="wait">
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                  transition={{ duration: 1.2 }}
                  className="font-display text-2xl text-white md:text-3xl"
                >
                  {AFFIRMATIONS[idx]}
                </motion.p>
              </AnimatePresence>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="mt-16 rounded-full border border-white/30 px-6 py-2 text-sm text-white/80 transition hover:bg-white/10"
            >
              i'm okay now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}