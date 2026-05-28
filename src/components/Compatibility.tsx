import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Answers } from "./Interrogation";

const ROASTS: { min: number; line: string; sub: string }[] = [
  { min: 95, line: "Soulmates. Confirmed. Bye.", sub: "Jack is sobbing in the corner. Happy tears." },
  { min: 85, line: "Dangerously compatible.", sub: "We should probably tell our parents." },
  { min: 70, line: "Suspiciously perfect.", sub: "The universe is showing off again." },
  { min: 55, line: "Disturbingly cute together.", sub: "Other couples are taking notes." },
  { min: 0, line: "Still 100%. The math is broken.", sub: "Jack rigged it. No regrets." },
];

export function Compatibility({ answers }: { answers: Answers }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  const score = computeScore(answers);
  const roast = ROASTS.find((r) => score >= r.min)!;

  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => unsub();
  }, [rounded]);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, score, { duration: 3.4, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, score, count]);

  // gauge math
  const R = 130;
  const C = Math.PI * R; // half circle
  const offset = C - (display / 100) * C;

  return (
    <section ref={ref} className="relative px-6 py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-script text-2xl text-primary">section five</p>
        <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
          The Compatibility Meter
        </h2>
        <p className="mt-4 text-muted-foreground">
          Calibrated by Jack. Audited by nobody. Results: legally binding.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="glass mx-auto mt-14 max-w-xl rounded-[2rem] p-10"
        >
          <div className="relative mx-auto" style={{ width: 320, height: 180 }}>
            <svg viewBox="0 0 320 180" className="absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="oklch(0.78 0.18 350)" />
                  <stop offset="50%" stopColor="oklch(0.72 0.22 330)" />
                  <stop offset="100%" stopColor="oklch(0.78 0.16 60)" />
                </linearGradient>
              </defs>
              <path
                d="M 30 160 A 130 130 0 0 1 290 160"
                stroke="oklch(0.92 0.02 350)"
                strokeWidth="22"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 30 160 A 130 130 0 0 1 290 160"
                stroke="url(#gaugeGrad)"
                strokeWidth="22"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={C}
                strokeDashoffset={offset}
                style={{ filter: "drop-shadow(0 4px 18px oklch(0.78 0.18 350 / 55%))" }}
              />
            </svg>
            <div className="absolute inset-x-0 bottom-4 flex flex-col items-center">
              <span className="font-display text-6xl font-bold text-gradient-hero leading-none">
                {display}%
              </span>
              <span className="mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                compatibility
              </span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 2.6, duration: 1.0 }}
            className="mt-8"
          >
            <p className="font-script text-3xl text-gradient-gold">{roast.line}</p>
            <p className="mt-2 text-muted-foreground">{roast.sub}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function computeScore(a: Answers) {
  // every answer adds a sweet bonus; floor is 92 because Jack is biased.
  const filled = Object.values(a).filter(Boolean).length;
  const base = 92 + filled * 2 + Math.floor(Math.random() * 3);
  return Math.min(100, base);
}