import { motion } from "framer-motion";

export type DatePlan = {
  date: string;
  time: string;
  activity: string;
  mood: string;
};

const ACTIVITIES = [
  { label: "Fancy restaurant", emoji: "🍷" },
  { label: "Shopping", emoji: "🛍️" },
  { label: "Movie night", emoji: "🎬" },
  { label: "Beach walk", emoji: "🌊" },
  { label: "Ice cream mission", emoji: "🍦" },
  { label: "Random city adventure", emoji: "🗺️" },
  { label: "Late night drives", emoji: "🚗" },
  { label: "Coffee date", emoji: "☕" },
  { label: "Rooftop dinner", emoji: "🌃" },
  { label: "Whatever makes Sheila smile", emoji: "🥺" },
];

const MOODS = [
  { label: "Soft & romantic", emoji: "🌷" },
  { label: "Chaotic & funny", emoji: "🤪" },
  { label: "Luxury vibes", emoji: "🥂" },
  { label: "Matching outfits energy", emoji: "👫" },
  { label: "Main character energy", emoji: "🎬" },
];

export function DatePlanner({
  plan,
  setPlan,
}: {
  plan: DatePlan;
  setPlan: (p: DatePlan) => void;
}) {
  const update = <K extends keyof DatePlan>(k: K, v: DatePlan[K]) =>
    setPlan({ ...plan, [k]: v });

  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="font-script text-2xl text-primary">section two</p>
          <h2 className="mt-2 font-display text-5xl md:text-7xl font-bold text-gradient-hero">
            Plan Our First Chaos Together
          </h2>
          <p className="mt-4 text-muted-foreground">
            Pick everything. Jack will show up. Possibly nervous.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Field label="Pick a date 🗓️">
            <input
              type="date"
              value={plan.date}
              onChange={(e) => update("date", e.target.value)}
              className="w-full bg-transparent text-lg font-medium text-foreground outline-none"
            />
          </Field>
          <Field label="Pick a time ⏰">
            <input
              type="time"
              value={plan.time}
              onChange={(e) => update("time", e.target.value)}
              className="w-full bg-transparent text-lg font-medium text-foreground outline-none"
            />
          </Field>
        </div>

        <h3 className="mt-14 font-display text-2xl font-semibold">What are we doing?</h3>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {ACTIVITIES.map((a) => (
            <ChipCard
              key={a.label}
              selected={plan.activity === a.label}
              onClick={() => update("activity", a.label)}
            >
              <span className="text-2xl">{a.emoji}</span>
              <span className="mt-2 text-sm font-medium leading-tight">{a.label}</span>
            </ChipCard>
          ))}
        </div>

        <h3 className="mt-14 font-display text-2xl font-semibold">Pick the mood</h3>
        <div className="mt-5 flex flex-wrap gap-3">
          {MOODS.map((m) => (
            <ChipCard
              key={m.label}
              selected={plan.mood === m.label}
              onClick={() => update("mood", m.label)}
              compact
            >
              <span className="text-xl">{m.emoji}</span>
              <span className="text-sm font-medium">{m.label}</span>
            </ChipCard>
          ))}
        </div>

        {(plan.activity || plan.mood) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 glass rounded-3xl p-8 text-center"
          >
            <p className="font-script text-2xl text-primary">summary</p>
            <p className="mt-2 font-display text-xl md:text-2xl text-foreground">
              {plan.date && plan.time
                ? `On ${formatDate(plan.date)} at ${plan.time}, `
                : "Whenever you're free, "}
              {plan.activity ? <>we're doing <b>{plan.activity.toLowerCase()}</b></> : "we're going somewhere"}
              {plan.mood ? <> with <b>{plan.mood.toLowerCase()}</b> vibes.</> : "."}
            </p>
            <p className="mt-4 font-script text-2xl text-gradient-gold">
              Jack is now mentally preparing for this date. 🥲
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  } catch {
    return d;
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="glass block rounded-2xl px-5 py-4">
      <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function ChipCard({
  children,
  selected,
  onClick,
  compact,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ y: -3, scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`relative flex ${
        compact ? "flex-row items-center gap-2 px-4 py-3" : "flex-col items-center justify-center p-4 text-center"
      } rounded-2xl border transition-all ${
        selected
          ? "border-transparent bg-gradient-hero text-white shadow-[var(--glow-pink)]"
          : "border-white/60 bg-white/55 text-foreground hover:border-primary/40"
      }`}
    >
      {children}
    </motion.button>
  );
}