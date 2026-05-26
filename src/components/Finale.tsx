import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import confetti from "canvas-confetti";
import type { Answers } from "./Interrogation";
import type { DatePlan } from "./DatePlanner";

const LINES = [
  "Okay Sheila…",
  "I could've sent a normal message…",
  "But where's the fun in that?",
  "Life's too short for boring love stories.",
];

export function Finale({
  answers,
  plan,
  destinations,
}: {
  answers: Answers;
  plan: DatePlan;
  destinations: string[];
}) {
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const summary = buildSummary(answers, plan, destinations);

  const send = () => {
    setSent(true);
    const duration = 2500;
    const end = Date.now() + duration;
    const colors = ["#ff6fa3", "#ffb88c", "#c084fc", "#fde68a", "#ffffff"];
    (function frame() {
      confetti({ particleCount: 6, startVelocity: 35, spread: 360, ticks: 60, origin: { x: Math.random(), y: Math.random() * 0.5 }, colors, shapes: ["circle"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  const copy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "For Jack 💌", text: summary });
      } catch {}
    } else copy();
  };

  return (
    <section className="relative overflow-hidden px-6 py-32">
      <div className="absolute inset-0 bg-gradient-dusk opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.78_0.18_350/40%),transparent_50%),radial-gradient(circle_at_70%_80%,oklch(0.65_0.27_310/40%),transparent_50%)]" />

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="space-y-6">
          {LINES.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.3, duration: 0.8 }}
              className={
                i === LINES.length - 1
                  ? "font-display text-3xl md:text-5xl font-bold text-gradient-gold"
                  : "font-display text-2xl md:text-4xl text-white/90"
              }
            >
              {line}
            </motion.p>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="cta"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2, duration: 0.8 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mt-14"
            >
              <button
                onClick={send}
                className="group relative rounded-full bg-gradient-hero animate-gradient px-10 py-5 text-lg font-bold text-white animate-pulse-glow transition-transform hover:scale-105 active:scale-95"
              >
                Send This Chaos Back To Jack ❤️
              </button>
              <p className="mt-4 font-script text-xl text-white/70">no take-backs 😌</p>
            </motion.div>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="mt-14 glass-dark rounded-3xl p-8 text-left text-white"
            >
              <div className="text-center">
                <div className="text-6xl">🥹💘</div>
                <h3 className="mt-3 font-display text-3xl font-bold text-gradient-gold">
                  Congratulations.
                </h3>
                <p className="mt-2 text-white/85">
                  You have successfully unlocked:
                  <br />
                  <span className="font-script text-2xl text-white">
                    Jack's entire emotional support system.
                  </span>
                </p>
              </div>

              <pre className="mt-6 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-black/30 p-5 text-sm leading-relaxed text-white/90">
{summary}
              </pre>

              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button
                  onClick={copy}
                  className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/20"
                >
                  {copied ? "Copied ✓" : "Copy 💌"}
                </button>
                <button
                  onClick={share}
                  className="rounded-full bg-gradient-hero px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-105"
                >
                  Share with Jack
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(summary)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[oklch(0.78_0.18_140)] px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-105"
                >
                  WhatsApp
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="relative mt-20 text-center font-script text-lg text-white/60">
        made with ❤️, too much coffee, and zero chill — by Jack
      </p>
    </section>
  );
}

function buildSummary(a: Answers, p: DatePlan, dests: string[]) {
  const lines = [
    "💌 For Jack — from Sheila",
    "",
    "🧟 Zombie apocalypse: " + (a.zombie ?? "(skipped)"),
    "🏝️ Stranded island, I'd save: " + (a.island ?? "(skipped)"),
    "💕 Nickname unlocked for Jack: " + (a.nickname ?? "(skipped)"),
    "",
    "📅 Our first chaos:",
    "   Date: " + (p.date || "whenever"),
    "   Time: " + (p.time || "anytime"),
    "   Activity: " + (p.activity || "TBD"),
    "   Mood: " + (p.mood || "TBD"),
    "",
    "✈️ Vacations on the list: " + (dests.length ? dests.join(", ") : "(none yet — rude)"),
    "",
    "P.S. I read the whole website. Yes, all of it. 🥹",
  ];
  return lines.join("\n");
}