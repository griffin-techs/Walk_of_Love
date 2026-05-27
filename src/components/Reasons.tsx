import { motion } from "framer-motion";

const REASONS = [
  { n: "01", t: "Your laugh", d: "It's basically my favorite sound on earth. I've made entire days better just by replaying it in my head." },
  { n: "02", t: "The way you think", d: "You notice tiny details nobody else does. Honestly, kind of unfair. Beautifully unfair." },
  { n: "03", t: "Your kindness", d: "It's never loud. It just shows up — in messages, in moments, in how you treat people. I see it. Always." },
  { n: "04", t: "The chaos", d: "You're a little bit of a storm and I'd happily stand in the rain for you. Hence the rain button, by the way." },
  { n: "05", t: "Your eyes", d: "They have this thing where they speak before you do. It's wildly inconvenient because I forget my sentences." },
  { n: "06", t: "You. Just you.", d: "No category. No reason needed. You walk into a room and the room becomes interesting. Magic trick, really." },
];

export function Reasons() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="font-script text-2xl text-primary">section five</p>
          <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
            Six (of many) reasons
          </h2>
          <p className="mt-4 text-muted-foreground">
            A short list. I had to cut it down. The original was embarrassing.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {REASONS.map((r, i) => (
            <motion.article
              key={r.n}
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.12, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="glass animate-breathe group relative overflow-hidden rounded-3xl p-8"
            >
              <div className="absolute -right-6 -top-8 select-none font-display text-[7rem] font-bold leading-none text-gradient-hero opacity-20 transition-opacity group-hover:opacity-40">
                {r.n}
              </div>
              <h3 className="relative font-display text-2xl font-semibold text-foreground">
                {r.t}
              </h3>
              <p className="relative mt-3 leading-relaxed text-muted-foreground">{r.d}</p>
              <div className="relative mt-5 h-px w-12 bg-gradient-hero transition-all duration-700 group-hover:w-24" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}