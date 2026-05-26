import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const MESSAGES = [
  "Loading emotional damage…",
  "Calculating Sheila's smile probability…",
  "Jack is trying to act calm…",
  "Warming up the butterflies…",
  "Almost there. Stay cute.",
];

export function Loader({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setI((x) => x + 1), 1400);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (i >= MESSAGES.length) {
      setDone(true);
      const t = setTimeout(onDone, 1000);
      return () => clearTimeout(t);
    }
  }, [i, onDone]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-sunset"
        >
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto text-6xl"
            >
              ❤️
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 font-display text-xl text-foreground/80"
              >
                {MESSAGES[Math.min(i, MESSAGES.length - 1)]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}