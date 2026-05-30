import { motion } from "framer-motion";
import maldives from "@/assets/travel-maldives.jpg";
import santorini from "@/assets/travel-santorini.jpg";
import paris from "@/assets/travel-paris.jpg";
import tokyo from "@/assets/travel-tokyo.jpg";
import bali from "@/assets/travel-bali.jpg";
import cappadocia from "@/assets/travel-cappadocia.jpg";
import dubai from "@/assets/travel-dubai.jpg";
import zanzibar from "@/assets/travel-zanzibar.jpg";
import borabora from "@/assets/travel-borabora.jpg";
import seychelles from "@/assets/travel-seychelles.jpg";

const DESTS = [
  { name: "Maldives", quote: "barefoot, sun-drunk, ours.", img: maldives },
  { name: "Santorini", quote: "white walls, blue domes, you.", img: santorini },
  { name: "Paris", quote: "kiss me under the tower.", img: paris },
  { name: "Tokyo", quote: "neon nights and noodles.", img: tokyo },
  { name: "Bali", quote: "swing into the sunset.", img: bali },
  { name: "Cappadocia", quote: "above the clouds with you.", img: cappadocia },
  { name: "Dubai", quote: "skyline dinners only.", img: dubai },
  { name: "Zanzibar", quote: "turquoise & turmeric.", img: zanzibar },
  { name: "Bora Bora", quote: "your villa or mine?", img: borabora },
  { name: "Seychelles", quote: "the kind of quiet we deserve.", img: seychelles },
];

export function Vacation({
  picks,
  setPicks,
}: {
  picks: string[];
  setPicks: (p: string[]) => void;
}) {
  const toggle = (name: string) =>
    setPicks(picks.includes(name) ? picks.filter((p) => p !== name) : [...picks, name]);

  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="font-script text-2xl text-primary">section three</p>
          <h2 className="mt-2 font-display text-5xl md:text-7xl font-bold text-gradient-hero">
            Where Should We Escape To?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tap as many as you want. Jack will start a savings account immediately.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DESTS.map((d, i) => {
            const selected = picks.includes(d.name);
            return (
              <motion.button
                key={d.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.05, duration: 0.6 }}
                whileHover={{ y: -6 }}
                onClick={() => toggle(d.name)}
                className={`group relative overflow-hidden rounded-3xl text-left transition-all ${
                  selected ? "ring-4 ring-primary shadow-[var(--glow-pink)]" : "ring-1 ring-white/40"
                }`}
              >
                <div className="relative aspect-[4/5] w-full bg-gradient-dusk">
                  {d.img ? (
                    <img
                      src={d.img}
                      alt={`Couple in ${d.name}`}
                      loading="lazy"
                      width={1024}
                      height={1280}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-7xl opacity-50">
                      ✈️
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.18_0.08_320/90%)] via-[oklch(0.18_0.08_320/20%)] to-transparent" />

                  <motion.span
                    className="absolute right-4 top-4 text-2xl opacity-0 transition-opacity group-hover:opacity-100"
                    animate={{ x: [0, 6, 0], y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ✈️
                  </motion.span>

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-display text-3xl font-bold text-white drop-shadow-lg">
                      {d.name}
                    </h3>
                    <p className="mt-1 font-script text-xl text-white/90">"{d.quote}"</p>
                  </div>

                  {selected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-hero text-white shadow-lg"
                    >
                      ❤️
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}