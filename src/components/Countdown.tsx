import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import type { DatePlan } from "./DatePlanner";

const MICRO = [
  "Jack is already picking an outfit.",
  "Tick. Tock. Heartbeats syncing.",
  "Somewhere, Jack just smiled for no reason.",
  "The universe is rehearsing for this date.",
  "Reminder: you are absurdly loved.",
  "Counting in heartbeats, not seconds.",
  "Jack rewrote his entire week for this.",
  "Currently practicing being normal. Failing.",
];

export function Countdown({ plan }: { plan: DatePlan }) {
  const target = buildTarget(plan);
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(() => Date.UTC(2000, 0, 1));
  const [microIdx, setMicroIdx] = useState(0);

  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setMicroIdx((i) => (i + 1) % MICRO.length), 4200);
    return () => clearInterval(t);
  }, []);

  if (!target) {
    return (
      <section className="relative px-6 py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-script text-2xl text-primary">section ten</p>
          <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
            The Countdown
          </h2>
          <div className="glass mt-12 rounded-3xl p-10">
            <div className="text-5xl">⏳</div>
            <p className="mt-4 font-display text-xl text-foreground">
              Scroll back up and pick a date for our chaos.
            </p>
            <p className="mt-2 font-script text-2xl text-primary">
              the timer is waiting for you 💌
            </p>
          </div>
        </div>
      </section>
    );
  }

  const diff = target - now;
  const past = diff <= 0;
  const abs = Math.abs(diff);
  const days = Math.floor(abs / 86_400_000);
  const hours = Math.floor((abs % 86_400_000) / 3_600_000);
  const minutes = Math.floor((abs % 3_600_000) / 60_000);
  const seconds = Math.floor((abs % 60_000) / 1000);

  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-script text-2xl text-primary">section ten</p>
        <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
          {past ? "It's officially happening" : "Counting down to us"}
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0 }}
          className="glass mt-12 rounded-[2rem] p-8 md:p-12"
        >
          <div className="grid grid-cols-4 gap-3 md:gap-6">
            <Unit n={mounted ? days : 0} label="days" />
            <Unit n={mounted ? hours : 0} label="hours" />
            <Unit n={mounted ? minutes : 0} label="min" />
            <Unit n={mounted ? seconds : 0} label="sec" />
          </div>

          <div className="mt-10 h-8 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={microIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8 }}
                className="font-script text-xl text-gradient-gold md:text-2xl"
              >
                {past ? "Stop reading. Go meet Jack." : MICRO[microIdx]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Unit({ n, label }: { n: number; label: string }) {
  return (
    <div className="relative rounded-2xl bg-gradient-hero p-[2px] shadow-[var(--glow-pink)]">
      <div className="rounded-2xl bg-background/80 px-2 py-5 backdrop-blur">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={n}
            initial={{ y: -18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 18, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl font-bold text-gradient-hero md:text-6xl"
          >
            {String(n).padStart(2, "0")}
          </motion.div>
        </AnimatePresence>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  );
}

function buildTarget(p: DatePlan): number | null {
  if (!p.date) return null;
  const iso = `${p.date}T${p.time && /^\d{2}:\d{2}/.test(p.time) ? p.time : "19:00"}:00`;
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? t : null;
}