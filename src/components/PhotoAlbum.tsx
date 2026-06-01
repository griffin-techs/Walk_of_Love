import { motion } from "framer-motion";

const FRAMES = [
  { caption: "us, kitchen, 2am, dancing badly", tape: "rotate-[-3deg]" },
  { caption: "you, laughing too hard at my own joke", tape: "rotate-[2deg]" },
  { caption: "first morning in zanzibar, hair wild, coffee burnt", tape: "rotate-[-1deg]" },
  { caption: "the day we adopted something we shouldn't have", tape: "rotate-[3deg]" },
  { caption: "you in my hoodie, again, finally keeping it", tape: "rotate-[-2deg]" },
  { caption: "rain, one umbrella, both soaked anyway", tape: "rotate-[1deg]" },
  { caption: "us at city hall, no fancy dress, just us", tape: "rotate-[-3deg]" },
  { caption: "the ugly couch we swore we'd replace", tape: "rotate-[2deg]" },
  { caption: "3am airport, sleepy, holding hands wrong", tape: "rotate-[-1deg]" },
  { caption: "you teaching me your mom's recipe, badly", tape: "rotate-[3deg]" },
  { caption: "the dog stealing our bed, again", tape: "rotate-[-2deg]" },
  { caption: "anniversary 10, same booth, same order", tape: "rotate-[1deg]" },
];

export function PhotoAlbum() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="font-script text-2xl text-primary">a future, in polaroids</p>
          <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
            The Photo Album We Haven't Taken Yet
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-muted-foreground">
            empty frames, waiting. the captions already know. we'll fill them in, one
            ordinary tuesday at a time.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {FRAMES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: (i % 6) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.04, rotate: 0, y: -6 }}
              className={`group relative mx-auto w-full max-w-xs ${f.tape}`}
            >
              {/* tape */}
              <div className="absolute -top-3 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rotate-[-4deg] bg-yellow-200/70 shadow-sm" />
              {/* polaroid */}
              <div className="rounded-sm bg-white p-4 pb-14 shadow-[0_10px_30px_-10px_oklch(0.4_0.05_350/40%)] transition-shadow group-hover:shadow-[0_20px_50px_-12px_oklch(0.55_0.2_350/45%)]">
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted via-secondary/40 to-muted">
                  {/* placeholder shimmer */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-script text-4xl text-foreground/15">soon</span>
                  </div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,oklch(0.95_0.05_350/40%),transparent_60%)]" />
                </div>
                <p className="mt-4 text-center font-script text-lg leading-tight text-foreground/80">
                  {f.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-14 text-center font-script text-xl text-primary/80">
          we'll fill them in. one click at a time. one life at a time.
        </p>
      </div>
    </section>
  );
}