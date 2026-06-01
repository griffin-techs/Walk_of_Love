import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const HEADLINES = [
  {
    paper: "The Daily Chronicle",
    date: "June 14, 2045",
    headline: "Local Couple Still Stealing Each Other's Fries After 40 Years",
    sub: "Jack and Sheila McAllister confess: 'We never learned. We never will.'",
  },
  {
    paper: "The Evening Herald",
    date: "September 3, 2038",
    headline: "Man Builds 47th Playlist for Wife; She Says 'I Love It' for First Time",
    sub: "Jack McAllister, 57, weeps openly at coffee shop. Sources say it's deserved.",
  },
  {
    paper: "The Global Post",
    date: "December 1, 2042",
    headline: "Couple Returns to Zanzibar for 20th Anniversary; Still Can't Agree on Dinner",
    sub: "'He wanted seafood. I wanted seafood. We fought for 20 minutes anyway.' — Sheila McAllister",
  },
  {
    paper: "The Sunday Tribune",
    date: "March 22, 2036",
    headline: "Woman Finishes Husband's Sentences; Husband Finally Starts Finishing Hers",
    sub: "Relationship experts call it 'miraculous.' Jack calls it 'took long enough.'",
  },
  {
    paper: "Metro Weekly",
    date: "August 8, 2040",
    headline: "Grandpa Jack Caught Dancing at Family BBQ; Claims 'Sheila Made Me Do It'",
    sub: "Eyewitnesses confirm he initiated the conga line. Sheila just smiled.",
  },
  {
    paper: "The Times",
    date: "November 11, 2047",
    headline: "Married 42 Years, Still Leave Notes in Each Other's Coffee Mugs",
    sub: "'She draws hearts on mine. I draw terrible portraits on hers.' — Jack McAllister, 66",
  },
  {
    paper: "The Independent",
    date: "January 2, 2035",
    headline: "Couple's New Year's Resolution: 'Fight Less About the Thermostat'",
    sub: "By January 4, both had forgotten. By January 5, they were cuddling under the same blanket.",
  },
  {
    paper: "Daily News",
    date: "May 17, 2044",
    headline: "Woman Sends 3-Minute Voice Note; Husband Listens to Entire Thing Without Complaining",
    sub: "'I trained him,' Sheila told reporters. 'It only took two decades.'",
  },
  {
    paper: "The Chronicle",
    date: "July 29, 2039",
    headline: "Retired Couple Opens Tiny Bookshop; Argues About Shelf Organization Daily",
    sub: "'Alphabetical!' 'By color!' — the McAllisters, still somehow in love.",
  },
  {
    paper: "The Observer",
    date: "October 15, 2046",
    headline: "Husband Secretly Replenishes Wife's Snack Stash for 30th Consecutive Year",
    sub: "'I pretended not to notice. I noticed every single time.' — Sheila McAllister, 61",
  },
  {
    paper: "The Gazette",
    date: "April 4, 2041",
    headline: "Couple Finally Agrees on Pizza Toppings; World Shocked",
    sub: "'Half pepperoni, half margherita. We compromised. It felt weird.' — Jack McAllister",
  },
  {
    paper: "The Sun",
    date: "February 14, 2050",
    headline: "Valentine's Day: 55 Years Later, He Still Writes Her Letters. She Still Cries.",
    sub: "'I made a website once. Now I just use paper. She prefers the paper.' — Jack, 70",
  },
];

const KEY = "sheila_headlines_index";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function Headlines() {
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const [confetti, setConfetti] = useState<{ id: number; x: number; emoji: string }[]>([]);

  const burstConfetti = () => {
    const burst = Array.from({ length: 32 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["❤️", "💖", "✨", "🩷", "🌸", "💫"][i % 6],
    }));
    setConfetti(burst);
    setTimeout(() => setConfetti([]), 3500);
  };

  useEffect(() => {
    setMounted(true);
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const rng = seededRandom(seed);
    const stored = Number(localStorage.getItem(KEY) || "-1");
    let pick: number;
    if (stored >= 0) {
      // cycle to a new one each reload (avoid repeat)
      pick = (stored + 1 + Math.floor(rng() * (HEADLINES.length - 1))) % HEADLINES.length;
    } else {
      pick = Math.floor(rng() * HEADLINES.length);
    }
    setIndex(pick);
    localStorage.setItem(KEY, String(pick));
    // celebrate the fresh headline on reload
    const t = setTimeout(() => burstConfetti(), 400);
    return () => clearTimeout(t);
  }, []);

  const h = HEADLINES[index];

  const shuffle = () => {
    let next: number;
    do {
      next = Math.floor(Math.random() * HEADLINES.length);
    } while (next === index);
    setIndex(next);
    localStorage.setItem(KEY, String(next));
    burstConfetti();
  };

  return (
    <section className="relative px-6 py-32">
      {/* confetti hearts on reload/shuffle */}
      <div className="pointer-events-none fixed inset-0 z-[90]">
        {confetti.map((c) => (
          <motion.span
            key={c.id}
            initial={{ y: "110vh", opacity: 1, rotate: 0 }}
            animate={{ y: "-10vh", opacity: 0, rotate: 360 }}
            transition={{ duration: 3.2, ease: "easeOut" }}
            className="absolute text-2xl"
            style={{ left: `${c.x}vw` }}
          >
            {c.emoji}
          </motion.span>
        ))}
      </div>
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="font-script text-2xl text-primary">from the future</p>
          <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
            Our Future Headlines
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every reload writes a new story. None of them are impossible.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14"
        >
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card/60 p-8 backdrop-blur-md md:p-10">
            {/* newspaper masthead */}
            <div className="border-b-2 border-foreground/20 pb-4 text-center">
              <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-foreground/60">
                {h.paper}
              </p>
              <p className="mt-1 font-script text-sm text-muted-foreground">{h.date}</p>
            </div>

            {/* headline */}
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 10 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 text-center"
            >
              <h3 className="font-display text-3xl font-bold leading-tight text-foreground md:text-4xl">
                {h.headline}
              </h3>
              <p className="mt-4 font-script text-lg text-primary/80">{h.sub}</p>
            </motion.div>

            {/* fold lines decoration */}
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-foreground/10" />
              <p className="font-display text-xs uppercase tracking-widest text-muted-foreground">
                Extra edition
              </p>
              <div className="h-px flex-1 bg-foreground/10" />
            </div>

            {/* shuffle button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={shuffle}
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-display text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:rotate-180"
                >
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
                reload headline
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
