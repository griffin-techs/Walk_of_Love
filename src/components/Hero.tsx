import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import heroImg from "@/assets/couple-hero.jpg";
import { Sparkles } from "./FloatingHearts";

const LINES = [
  "Sheila… ❤️",
  "I built an entire website because texting you normally felt too basic.",
  "— Jack",
];

export function Hero() {
  const [step, setStep] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (step >= LINES.length - 1) return;
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 3600 : 5200);
    return () => clearTimeout(t);
  }, [step]);

  const triggerWarning = () => {
    setShowWarning(true);
    const end = Date.now() + 1200;
    const colors = ["#ff6fa3", "#ffb88c", "#c084fc", "#fde68a"];
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 70, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24">
      {/* backdrop image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Couple at golden hour"
          className="h-full w-full object-cover opacity-60"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.95_0.05_50/40%)] via-[oklch(0.78_0.18_350/30%)] to-[oklch(0.25_0.08_320/85%)]" />
      </div>
      <Sparkles count={50} />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-script text-2xl text-white/90"
        >
          a love letter, but in code
        </motion.p>

        <div className="relative mt-6 min-h-[260px] md:min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.h1
              key={step}
              initial={{ opacity: 0, y: 30, filter: "blur(24px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -30, filter: "blur(24px)" }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              className={
                step === 0
                  ? "font-display text-7xl md:text-9xl font-bold text-white drop-shadow-[0_4px_30px_oklch(0.65_0.27_310/60%)]"
                  : step === 2
                    ? "font-script text-5xl md:text-7xl text-gradient-gold"
                    : "font-display text-3xl md:text-5xl font-medium text-white/95 leading-tight"
              }
            >
              {LINES[step]}
            </motion.h1>
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : 20 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <button
            onClick={triggerWarning}
            className="group relative rounded-full bg-gradient-hero animate-gradient px-8 py-4 text-base font-semibold text-white animate-pulse-glow transition-transform hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">Click at your own emotional risk 💌</span>
          </button>
          <p className="font-script text-lg text-white/80">scroll. you'll see. 👀</p>
        </motion.div>
      </div>

      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(0.15_0.08_320/70%)] backdrop-blur-sm px-6"
            onClick={() => setShowWarning(false)}
          >
            <motion.div
              initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 14 }}
              className="glass relative max-w-md rounded-3xl p-10 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-6xl">⚠️💘</div>
              <h3 className="mt-4 font-display text-3xl font-bold text-gradient-hero">
                Warning
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-foreground/80">
                This website may cause smiling,
                <br />
                blushing,
                <br />
                or accidental love.
              </p>
              <button
                onClick={() => setShowWarning(false)}
                className="mt-6 rounded-full bg-gradient-hero px-6 py-3 font-semibold text-white transition-transform hover:scale-105"
              >
                I accept the risk 🥹
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}