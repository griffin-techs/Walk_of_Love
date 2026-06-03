import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const NOTES = [
  "you got this. seriously. i'd bet money on you.",
  "drink some water. yes, right now. don't argue.",
  "today is a 'you in your soft era' kind of day.",
  "if no one told you yet — you look unreal today.",
  "rest is productive. fight me on it.",
  "your laugh fixed something in my brain. just letting you know.",
  "do one thing today just because it makes you happy.",
  "you survived the week. medal incoming.",
  "the world's lucky you woke up today. i mean it.",
  "you're allowed to take up space. take all of it.",
  "you don't owe anyone a smile today. but you have a great one.",
  "go outside for 4 minutes. trust me.",
  "you are not behind. you are exactly on your timeline.",
  "stretch. then text me. in that order.",
  "wear the thing. dance in the kitchen. live a little.",
  "you are someone's favorite person. (mine.)",
  "soft launch yourself today. just vibe.",
  "tiny win > no win. count it. brag.",
  "you are doing better than you think. by a lot.",
  "main character energy. activate.",
  "i hope something small makes you grin today.",
  "go to sleep, sheila. it's late and you know it.",
  "ok but have you eaten something real today.",
  "you don't have to be okay all day. just most of it.",
  "screenshot this if you forget how loved you are.",
  "your overthinking is lying to you. ignore it.",
  "deep breath. shoulders down. you're safe here.",
  "permission granted: cancel the plans.",
  "you. are. a. whole. moment.",
  "today's energy: unbothered, moisturized, in your lane.",
  "your future self is so proud of you right now.",
  "small steps still count as steps.",
  "you matter on the days you don't feel like it too.",
  "the universe is rooting for you. i checked.",
  "you're allowed to outgrow things. and people.",
  "if it's not a 'hell yes' today, it's a no.",
  "your soft heart is a feature, not a bug.",
  "go romanticize a coffee. you've earned it.",
  "you are not 'too much'. they're not enough.",
  "the bar is on the floor. you are the ceiling.",
  "monday energy: gentle. you don't have to peak.",
  "tuesday energy: small wins. count them all.",
  "wednesday energy: halfway. coast a little.",
  "thursday energy: almost. almost. almost.",
  "friday energy: you survived. proud of you.",
  "saturday energy: do nothing on purpose.",
  "sunday energy: be soft with yourself.",
  "this is your sign. whatever you were thinking — yes.",
  "go text someone you love. they need it too.",
  "your standards are not too high. love that for you.",
  "you're the plot twist in your own story.",
  "be loud about what you love today.",
  "you don't need a reason to feel pretty. just be.",
  "remember when you thought you wouldn't get through that? you did.",
  "you're glowing. it's annoying. keep going.",
  "no thoughts. just vibes. just sheila.",
  "your name is in someone's head right now. (mine. it's mine.)",
  "you can rest without earning it.",
  "today is a great day to be slightly delusional in a confident way.",
  "i'm proud of you. that's it. that's the note.",
];

function indexForToday() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return day % NOTES.length;
}

export function TodaysNote() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const idx = useMemo(indexForToday, []);
  const today = mounted
    ? new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "today";

  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-script text-2xl text-primary">today's note</p>
        <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
          For {today}
        </h2>
        <p className="mt-4 text-muted-foreground">
          Come back tomorrow. There's a new one waiting.
        </p>

        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 rounded-3xl border border-primary/25 bg-card/70 p-10 shadow-2xl backdrop-blur-xl md:p-14"
        >
          <p className="font-script text-3xl text-primary/80">note no. {String(idx + 1).padStart(2, "0")}</p>
          <p className="mt-6 font-display text-2xl leading-relaxed text-foreground/95 md:text-3xl">
            "{NOTES[idx]}"
          </p>
          <p className="mt-8 font-script text-xl text-primary">— Jack</p>
        </motion.div>
      </div>
    </section>
  );
}