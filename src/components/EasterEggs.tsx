import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

type Egg =
  | { kind: "confetti" }
  | { kind: "message"; title: string; body: string };

export function EasterEggs() {
  const [egg, setEgg] = useState<Egg | null>(null);
  const [moonCount, setMoonCount] = useState(0);
  const [idleWhisper, setIdleWhisper] = useState(false);
  const typedRef = useRef("");
  const konamiRef = useRef<string[]>([]);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [confetti, setConfetti] = useState<{ id: number; x: number; emoji: string }[]>([]);

  const triggerConfetti = () => {
    const burst = Array.from({ length: 28 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["❤️", "💖", "✨", "🩷", "🌸"][i % 5],
    }));
    setConfetti(burst);
    setTimeout(() => setConfetti([]), 3500);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // typed "sheila"
      if (e.key.length === 1) {
        typedRef.current = (typedRef.current + e.key.toLowerCase()).slice(-20);
        if (typedRef.current.includes("sheila")) {
          typedRef.current = "";
          triggerConfetti();
        }
      }
      // konami
      konamiRef.current = [...konamiRef.current, e.key].slice(-KONAMI.length);
      if (konamiRef.current.join("|") === KONAMI.join("|")) {
        konamiRef.current = [];
        setEgg({
          kind: "message",
          title: "🕹️ secret unlocked",
          body: "the konami code? really? alright, certified nerd. for the record: i think your nerdy side is the cutest one.",
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const reset = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      setIdleWhisper(false);
      idleTimer.current = setTimeout(() => setIdleWhisper(true), 60_000);
    };
    const events = ["mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  const onMoonClick = () => {
    const next = moonCount + 1;
    setMoonCount(next);
    if (next >= 7) {
      setMoonCount(0);
      setEgg({
        kind: "message",
        title: "🌙 the moon broke",
        body: "you clicked the moon seven times. now it's mine, and i'm giving it to you. official deed: one (1) moon, transferred to sheila, forever. enjoy.",
      });
    }
  };

  return (
    <>
      {/* moon button */}
      <button
        type="button"
        aria-label="moon"
        onClick={onMoonClick}
        className="fixed bottom-6 left-6 z-[55] flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-card/70 text-xl shadow-lg backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
        title="🌙"
      >
        🌙
      </button>

      {/* hunt hint */}
      <div className="fixed bottom-6 left-20 z-[55] hidden font-script text-sm text-primary/70 md:block">
        7 secrets hidden. you've found {Math.min(moonCount > 0 ? 1 : 0, 1)}…
      </div>

      {/* idle whisper */}
      <AnimatePresence>
        {idleWhisper && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 1.2 }}
            className="fixed bottom-24 left-1/2 z-[80] -translate-x-1/2 rounded-full border border-primary/30 bg-card/90 px-6 py-3 font-script text-lg text-primary shadow-2xl backdrop-blur-xl"
          >
            still there, sheila? 👀
          </motion.div>
        )}
      </AnimatePresence>

      {/* confetti hearts */}
      <div className="pointer-events-none fixed inset-0 z-[90]">
        {confetti.map((c) => (
          <motion.span
            key={c.id}
            initial={{ y: "110vh", opacity: 1, rotate: 0 }}
            animate={{ y: "-10vh", opacity: 0, rotate: 360 }}
            transition={{ duration: 3.2, ease: "easeOut" }}
            className="absolute text-2xl"
            style={{ left: `${c.x}vw` }}
          >
            {c.emoji}
          </motion.span>
        ))}
      </div>

      {/* egg modal */}
      <AnimatePresence>
        {egg && egg.kind === "message" && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="close"
              onClick={() => setEgg(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md rounded-3xl border border-primary/30 bg-card p-10 text-center shadow-2xl"
            >
              <p className="font-script text-2xl text-primary">{egg.title}</p>
              <p className="mt-4 font-display text-lg leading-relaxed text-foreground/90">{egg.body}</p>
              <button
                type="button"
                onClick={() => setEgg(null)}
                className="mt-8 rounded-full border border-primary/40 px-6 py-2 text-sm text-foreground/80 transition-colors hover:bg-primary/10"
              >
                close softly
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}