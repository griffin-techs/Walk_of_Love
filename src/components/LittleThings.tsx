import { motion } from "framer-motion";

const THINGS = [
  "the way you laugh at your own jokes before finishing them",
  "how you steal fries and pretend you didn't",
  "your voice notes at 2am that are somehow 4 minutes long",
  "the little pause before you say something honest",
  "how you say 'okay but listen—' before every good story",
  "the way you reorganize things that were already fine",
  "your face when you're concentrating, eyebrows and all",
  "how you remember tiny things people told you once",
  "the playlists. all of them. even the chaotic ones",
  "the way you walk faster when it's cold",
  "your dramatic sighs at minor inconveniences",
  "how you double-text without apologizing for it",
  "the specific giggle when something is actually funny",
  "how you make ordering coffee look like a personality",
  "the way you say my name when you're not even mad",
  "everything you don't notice you're doing",
];

export function LittleThings() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="font-script text-2xl text-primary">section nine</p>
          <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
            The little things
          </h2>
          <p className="mt-4 text-muted-foreground">
            A non-exhaustive list. I keep adding to it. Mentally. Constantly.
          </p>
        </div>

        <div className="mt-16 columns-1 gap-5 sm:columns-2 lg:columns-3 [column-fill:_balance]">
          {THINGS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 6) * 0.08, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3, rotate: i % 2 === 0 ? -0.6 : 0.6 }}
              className="mb-5 inline-block w-full break-inside-avoid rounded-2xl border border-primary/15 bg-card/60 p-5 backdrop-blur-md transition-colors hover:border-primary/40"
            >
              <p className="font-script text-sm text-primary/70">no. {String(i + 1).padStart(2, "0")}</p>
              <p className="mt-1 font-display text-lg leading-relaxed text-foreground/90">{t}</p>
            </motion.div>
          ))}
        </div>

        <p className="mt-16 text-center font-script text-2xl text-primary/80">
          and a hundred more I haven't typed yet.
        </p>
      </div>
    </section>
  );
}