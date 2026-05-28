import { motion } from "framer-motion";
import type { DatePlan } from "./DatePlanner";

export function Invite({ plan }: { plan: DatePlan }) {
  const date = plan.date ? formatDate(plan.date) : "To Be Decided";
  const time = plan.time || "TBD";
  const activity = plan.activity || "A Beautiful Surprise";
  const mood = plan.mood || "Soft & Romantic";
  const seat = "A1 — next to Jack";
  const code = generateCode(plan);

  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-script text-2xl text-primary">section nine</p>
        <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
          The Official Invitation
        </h2>
        <p className="mt-4 text-muted-foreground">
          One ticket. Non-transferable. Definitely screenshot it.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: -8 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-14 max-w-xl"
          style={{ perspective: 1200 }}
        >
          <div className="relative flex overflow-hidden rounded-[2rem] bg-gradient-dusk text-white shadow-[var(--shadow-card)]">
            {/* perforation */}
            <div className="absolute left-0 right-0 top-[68%] flex items-center justify-between px-3">
              <span className="-ml-6 h-10 w-10 rounded-full bg-background" />
              <div className="mx-3 flex-1 border-t-2 border-dashed border-white/30" />
              <span className="-mr-6 h-10 w-10 rounded-full bg-background" />
            </div>

            {/* main */}
            <div className="flex-1 p-8 text-left md:p-10">
              <div className="flex items-center justify-between">
                <span className="font-script text-xl text-white/80">love airlines ™</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em]">
                  Boarding Pass
                </span>
              </div>

              <h3 className="mt-6 font-display text-3xl font-bold text-gradient-gold md:text-4xl">
                Sheila ❤ Jack
              </h3>
              <p className="mt-1 font-script text-lg text-white/80">one date. zero exits.</p>

              <div className="mt-7 grid grid-cols-2 gap-5 text-sm">
                <Stat label="Date" value={date} />
                <Stat label="Time" value={time} />
                <Stat label="Activity" value={activity} />
                <Stat label="Mood" value={mood} />
                <Stat label="Seat" value={seat} />
                <Stat label="Dress code" value="Whatever makes you smile" />
              </div>

              <div className="mt-7 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
                    Passenger
                  </p>
                  <p className="font-display text-lg">Sheila — VIP forever</p>
                </div>
                <Barcode />
              </div>
            </div>

            {/* stub */}
            <div className="hidden w-32 flex-col items-center justify-center gap-3 border-l-2 border-dashed border-white/30 bg-white/5 p-5 md:flex">
              <span className="rotate-90 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.3em] text-white/70">
                admit one
              </span>
              <div className="font-script text-3xl text-gradient-gold">{code}</div>
              <span className="text-[10px] text-white/50">ref</span>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            tip: long-press / right-click to save as keepsake 💌
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
        {label}
      </p>
      <p className="mt-1 font-display text-base font-semibold text-white">{value}</p>
    </div>
  );
}

function Barcode() {
  const bars = Array.from({ length: 28 }).map(() => 1 + Math.random() * 3);
  return (
    <div className="flex h-10 items-end gap-[2px]">
      {bars.map((w, i) => (
        <span
          key={i}
          className="h-full bg-white/85"
          style={{ width: `${w}px`, opacity: 0.5 + Math.random() * 0.5 }}
        />
      ))}
    </div>
  );
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

function generateCode(p: DatePlan) {
  const seed = (p.date + p.time + p.activity + p.mood) || "sheila-jack";
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return "SJ-" + h.toString(36).slice(0, 5).toUpperCase();
}