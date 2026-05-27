import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const LETTER = `Dear Sheila,

I'm not going to pretend I planned this perfectly. I'm a developer — my version of romance is staying up until 3am picking the exact right shade of pink for a button that says your name.

But here's the thing. Every time I sit down to write you something normal, it comes out wrong. Too small. Too casual. Not enough.

So I built you a whole world instead.

I like you in a way that's a little inconvenient, honestly. You're in my head when I'm debugging. You're in my head when I'm in line for coffee. You're definitely in my head right now, because I'm writing to you, which is sort of the whole point.

You don't have to say anything back. You don't have to feel the same. You just had to know — that someone out here thought you were worth a website, a soundtrack, and a slightly embarrassing amount of typing.

Yours, kind of obviously,
Jack`;

export function Letter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (shown >= LETTER.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), LETTER[shown] === "\n" ? 180 : 28);
    return () => clearTimeout(t);
  }, [inView, shown]);

  const done = shown >= LETTER.length;

  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-3xl" ref={ref}>
        <div className="text-center">
          <p className="font-script text-2xl text-primary">section eight</p>
          <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
            A letter from Jack
          </h2>
          <p className="mt-4 text-muted-foreground">
            Typed slowly. On purpose. Read it slower.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 rounded-3xl border border-primary/20 bg-card/70 p-10 shadow-2xl backdrop-blur-xl md:p-14"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0, transparent 31px, hsl(var(--primary)/0.06) 31px, hsl(var(--primary)/0.06) 32px)",
          }}
        >
          <pre className="whitespace-pre-wrap font-display text-lg leading-8 text-foreground/90 md:text-xl md:leading-9">
            {LETTER.slice(0, shown)}
            {!done && (
              <span className="ml-0.5 inline-block h-5 w-[2px] -translate-y-0.5 animate-pulse bg-primary align-middle" />
            )}
          </pre>
          {done && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="mt-8 text-right font-script text-3xl text-primary"
            >
              ❤
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}