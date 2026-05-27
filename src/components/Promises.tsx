import { motion } from "framer-motion";
import { useState } from "react";

const PROMISES = [
  { emoji: "☕", title: "Coffee delivery", text: "I will bring you coffee even if you said you didn't want one. You did. I know." },
  { emoji: "🎧", title: "Aux privileges", text: "You get full aux control. Even the questionable playlists. Especially those." },
  { emoji: "🍜", title: "Snack rights", text: "You may steal food off my plate without warning. It's basically a love language." },
  { emoji: "📸", title: "Cute photos only", text: "I will take 47 photos until one is acceptable. Standards: high. Patience: higher." },
  { emoji: "🛌", title: "Blanket negotiation", text: "60/40 in your favor. I'll survive. Probably. With complaints." },
  { emoji: "🌧️", title: "Rainy day protocol", text: "Window seat, oversized hoodie, terrible movie, your head on my shoulder. Mandatory." },
  { emoji: "🥹", title: "Random texts", text: "Expect 'thinking of you' messages at unreasonable hours. I refuse to apologize." },
  { emoji: "💌", title: "This level of effort", text: "Every time. Every milestone. Every 'just because'. The bar is now this website. Sorry." },
];

export function Promises() {
  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="font-script text-2xl text-primary">section six</p>
          <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
            Official Jack™ Promises
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tap a card. Legally non-binding. Emotionally extremely binding.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROMISES.map((p, i) => {
            const isFlipped = flipped === i;
            return (
              <motion.button
                key={p.title}
                onClick={() => setFlipped(isFlipped ? null : i)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative h-44 w-full rounded-3xl text-left [perspective:1200px]"
              >
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-full w-full [transform-style:preserve-3d]"
                >
                  {/* Front */}
                  <div className="glass absolute inset-0 flex flex-col items-start justify-between rounded-3xl p-6 [backface-visibility:hidden]">
                    <div className="text-4xl">{p.emoji}</div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {p.title}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-primary/80">tap to reveal →</p>
                    </div>
                  </div>
                  {/* Back */}
                  <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-gradient-hero p-6 text-center text-white shadow-[var(--shadow-soft)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <p className="font-script text-xl leading-snug">{p.text}</p>
                  </div>
                </motion.div>
              </motion.button>
            );
          })}
        </div>

        <p className="mt-10 text-center font-script text-2xl text-primary">
          signed, sealed, slightly nervous — Jack ✍️
        </p>
      </div>
    </section>
  );
}