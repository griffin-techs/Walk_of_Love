import { motion } from "framer-motion";
import { useState } from "react";

type Region = {
  id: string;
  name: string;
  story: string;
  x: number;
  y: number;
};

const REGIONS: Region[] = [
  { id: "forest", name: "The Forest of 2am Thoughts", x: 28, y: 30, story: "Dense, mysterious, occasionally lit by phone screen. Inhabitants: existential questions, voice notes nobody asked for, half-written texts to me." },
  { id: "coast", name: "The Coast of Stolen Fries", x: 70, y: 35, story: "Coastline shaped entirely by you 'just having one'. Locals report fry levels dropping mysteriously when you're nearby." },
  { id: "mount", name: "Mount Dramatic Sigh", x: 50, y: 18, story: "Tallest peak on the continent. Volcanic. Erupts on Mondays. Climbers warned: she WILL tell you what's wrong if you ask three times." },
  { id: "river", name: "The River of Voice Notes", x: 20, y: 60, story: "Flows for 4 to 11 minutes at a time. Sometimes branches into a 'wait one more thing'. Always worth listening to." },
  { id: "city", name: "Capital City: Soft Era", x: 56, y: 55, story: "Bustling. Cozy lighting. The local language is 'lol' and the national anthem is your laugh." },
  { id: "desert", name: "The Plains of Petty Drama", x: 78, y: 65, story: "Surprisingly fertile. Nothing grows here but the BEST stories. Tour guide (me) recommended." },
  { id: "isle", name: "Isle of Inside Jokes", x: 38, y: 78, story: "Tiny island. Population: you, me, and three references that make no sense to anyone else. Locals are very protective." },
  { id: "harbor", name: "Harbor of Hugs", x: 82, y: 82, story: "Safe port. All ships welcome. Standard stay: 'just five more minutes'. Standard actual stay: forty." },
];

export function MapOfYou() {
  const [active, setActive] = useState<Region | null>(null);

  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="font-script text-2xl text-primary">a map of you</p>
          <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
            The Republic of Sheila
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tap a region. Explore at your own pace. Don't forget your passport.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-card via-card/60 to-primary/10 shadow-2xl backdrop-blur-xl"
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              <defs>
                <radialGradient id="land" cx="50%" cy="50%" r="65%">
                  <stop offset="0%" stopColor="hsl(var(--primary) / 0.25)" />
                  <stop offset="100%" stopColor="hsl(var(--primary) / 0.04)" />
                </radialGradient>
              </defs>
              <path
                d="M15,30 C10,20 25,10 40,12 C55,5 75,10 85,22 C95,35 92,55 88,70 C82,86 65,95 48,92 C30,94 12,82 8,65 C5,52 8,40 15,30 Z"
                fill="url(#land)"
                stroke="hsl(var(--primary) / 0.5)"
                strokeWidth="0.4"
                strokeDasharray="1 1.4"
              />
              {REGIONS.map((r) => (
                <g key={r.id} className="cursor-pointer" onClick={() => setActive(r)}>
                  <circle
                    cx={r.x}
                    cy={r.y}
                    r={active?.id === r.id ? 2.2 : 1.4}
                    fill="hsl(var(--primary))"
                    className="transition-all"
                  >
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={r.x} cy={r.y} r="3" fill="hsl(var(--primary) / 0.2)" />
                </g>
              ))}
            </svg>

            {REGIONS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setActive(r)}
                className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-background/70 px-2.5 py-1 font-script text-[11px] text-primary backdrop-blur-md transition-all hover:scale-110 hover:bg-background/95 md:text-xs"
                style={{ left: `${r.x}%`, top: `${r.y + 5}%` }}
              >
                {r.name}
              </button>
            ))}
          </motion.div>

          <motion.div
            key={active?.id || "empty"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center rounded-3xl border border-primary/20 bg-card/70 p-8 backdrop-blur-md md:p-10"
          >
            {active ? (
              <>
                <p className="font-script text-xl text-primary/80">region</p>
                <h3 className="mt-2 font-display text-3xl font-bold text-gradient-hero">
                  {active.name}
                </h3>
                <p className="mt-6 font-display text-lg leading-relaxed text-foreground/90">
                  {active.story}
                </p>
                <p className="mt-6 text-sm text-muted-foreground">— travel log, Jack</p>
              </>
            ) : (
              <>
                <p className="font-script text-2xl text-primary/80">welcome, traveler.</p>
                <p className="mt-4 font-display text-lg leading-relaxed text-foreground/85">
                  This whole country is you. Every region is a thing I noticed.
                  Pick one. I left notes everywhere.
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}