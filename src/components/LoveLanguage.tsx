import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Lang = "words" | "acts" | "time" | "touch" | "gifts";

const LANGS: Record<Lang, { name: string; emoji: string; tagline: string; jackDoes: string[] }> = {
  words: {
    name: "Words of Affirmation",
    emoji: "💬",
    tagline: "you bloom when you're told.",
    jackDoes: [
      "calls you beautiful before coffee, before anyone else gets the chance.",
      "saved the screenshot of the time you said something brilliant and reads it back to himself.",
      "introduces you as 'my Sheila' like it's a title only you can hold.",
      "leaves voice notes that start with 'okay so I was just thinking about you…'",
    ],
  },
  acts: {
    name: "Acts of Service",
    emoji: "🛠️",
    tagline: "you feel loved when he shows up.",
    jackDoes: [
      "warms up your side of the bed before you get in.",
      "remembers your coffee order at three different cafes.",
      "fixes the thing before you ask twice.",
      "drives the long way so you can keep talking.",
    ],
  },
  time: {
    name: "Quality Time",
    emoji: "⏳",
    tagline: "presence is the gift.",
    jackDoes: [
      "puts the phone face-down when you start talking.",
      "books the random Tuesday off just to do nothing with you.",
      "remembers exactly where you left off in the story you started last week.",
      "wants the boring errands too, as long as you're in the passenger seat.",
    ],
  },
  touch: {
    name: "Physical Touch",
    emoji: "🤝",
    tagline: "skin tells you the truth.",
    jackDoes: [
      "finds your hand without looking.",
      "kisses your forehead like he's sealing something.",
      "tucks your hair behind your ear mid-sentence and forgets what he was saying.",
      "sleeps with one leg over yours, every single night.",
    ],
  },
  gifts: {
    name: "Receiving Gifts",
    emoji: "🎁",
    tagline: "a token is a translated thought.",
    jackDoes: [
      "screenshots things you mention once and remembers for your birthday.",
      "brings home the snack you said you liked that one time, six months ago.",
      "wraps small things like they're big.",
      "writes the card before he buys the present.",
    ],
  },
};

const QUESTIONS: { q: string; options: { label: string; lang: Lang }[] }[] = [
  {
    q: "the moment that melts you is…",
    options: [
      { label: "him saying 'I'm so proud of you'", lang: "words" },
      { label: "him doing the dishes without being asked", lang: "acts" },
      { label: "him cancelling plans to stay in with you", lang: "time" },
      { label: "him pulling you in mid-cooking just to hold you", lang: "touch" },
      { label: "him bringing home that snack you mentioned once", lang: "gifts" },
    ],
  },
  {
    q: "you feel furthest from him when…",
    options: [
      { label: "he forgets to tell you how he feels", lang: "words" },
      { label: "he says he'll help and doesn't", lang: "acts" },
      { label: "he's on his phone the whole evening", lang: "time" },
      { label: "a whole day passes with no hug", lang: "touch" },
      { label: "he forgets the little dates that matter", lang: "gifts" },
    ],
  },
  {
    q: "your ideal saturday is…",
    options: [
      { label: "him reading you something he wrote", lang: "words" },
      { label: "him making breakfast while you sleep in", lang: "acts" },
      { label: "a long, slow walk with no destination", lang: "time" },
      { label: "lazy in bed, tangled up, no plans", lang: "touch" },
      { label: "an unexpected little something on the counter", lang: "gifts" },
    ],
  },
  {
    q: "the compliment that hits hardest is…",
    options: [
      { label: "'you're the smartest person I know'", lang: "words" },
      { label: "'I'll handle it, rest.'", lang: "acts" },
      { label: "'I'd rather be here with you than anywhere'", lang: "time" },
      { label: "(a kiss instead of words)", lang: "touch" },
      { label: "'this made me think of you'", lang: "gifts" },
    ],
  },
  {
    q: "the love note you'd save forever is…",
    options: [
      { label: "a paragraph about why he loves you", lang: "words" },
      { label: "'already done, my love. ❤'", lang: "acts" },
      { label: "'cleared my evening. it's yours.'", lang: "time" },
      { label: "'come here. now.'", lang: "touch" },
      { label: "a tiny envelope with something inside", lang: "gifts" },
    ],
  },
];

const EXTRA_QUESTIONS: { q: string; options: { label: string; lang: Lang }[] }[] = [
  {
    q: "after a hard day, what undoes the knot in your chest?",
    options: [
      { label: "him whispering 'you did so well today, my love'", lang: "words" },
      { label: "him quietly running you a bath without asking", lang: "acts" },
      { label: "him sitting on the floor with you while you vent", lang: "time" },
      { label: "him pulling you into his chest until you exhale", lang: "touch" },
      { label: "him handing you your favourite chocolate at the door", lang: "gifts" },
    ],
  },
  {
    q: "the way you secretly want to be missed is…",
    options: [
      { label: "a text that says 'the day is quieter without you'", lang: "words" },
      { label: "coming home to find he tidied your side of the room", lang: "acts" },
      { label: "him driving an hour just to have dinner with you", lang: "time" },
      { label: "him holding your face the second you walk in", lang: "touch" },
      { label: "a little something on your pillow, no occasion", lang: "gifts" },
    ],
  },
  {
    q: "in bed, just before sleep, you want…",
    options: [
      { label: "him telling you the thing he loved about you today", lang: "words" },
      { label: "him plugging your phone in because you forgot again", lang: "acts" },
      { label: "him staying awake a little longer to keep talking", lang: "time" },
      { label: "his arm across your waist, his nose at your shoulder", lang: "touch" },
      { label: "the little note he tucked under your pillow", lang: "gifts" },
    ],
  },
  {
    q: "the thing that would make you cry (in the good way) is…",
    options: [
      { label: "a voice note from him you weren't expecting", lang: "words" },
      { label: "him fixing the thing you'd been quietly worrying about", lang: "acts" },
      { label: "him showing up unannounced just because he missed you", lang: "time" },
      { label: "him kissing your forehead like it's a promise", lang: "touch" },
      { label: "the way he wrapped a gift you didn't know he noticed you wanted", lang: "gifts" },
    ],
  },
  {
    q: "you feel most his when…",
    options: [
      { label: "he calls you 'my Sheila' in front of his people", lang: "words" },
      { label: "he carries the heavy thing before you even reach for it", lang: "acts" },
      { label: "his calendar quietly bends to make room for you", lang: "time" },
      { label: "his hand finds the small of your back in a crowd", lang: "touch" },
      { label: "he remembers the tiny thing you said in March", lang: "gifts" },
    ],
  },
  {
    q: "the small daily ritual you'd miss the most is…",
    options: [
      { label: "his 'good morning, beautiful' before anything else", lang: "words" },
      { label: "him making your coffee exactly how you like it", lang: "acts" },
      { label: "the ten quiet minutes before the day starts, together", lang: "time" },
      { label: "the way he kisses your shoulder walking past", lang: "touch" },
      { label: "the random flowers, on a random tuesday, for no reason", lang: "gifts" },
    ],
  },
  {
    q: "if he could only do ONE thing forever, you'd pick…",
    options: [
      { label: "tell you, out loud, what he sees in you", lang: "words" },
      { label: "lighten your load without making a show of it", lang: "acts" },
      { label: "give you his undivided, phone-down attention", lang: "time" },
      { label: "hold you like you might disappear if he doesn't", lang: "touch" },
      { label: "keep noticing the little things and bringing them home", lang: "gifts" },
    ],
  },
];

QUESTIONS.push(...EXTRA_QUESTIONS);

function tally(answers: Lang[]): Lang {
  const counts: Record<Lang, number> = { words: 0, acts: 0, time: 0, touch: 0, gifts: 0 };
  answers.forEach((a) => counts[a]++);
  return (Object.keys(counts) as Lang[]).sort((a, b) => counts[b] - counts[a])[0];
}

const STORAGE_KEY = "love-language-result-v1";

export function LoveLanguage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Lang[]>([]);
  const [result, setResult] = useState<Lang | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved in LANGS)) setResult(saved as Lang);
    } catch {}
  }, []);

  const pick = (lang: Lang) => {
    const next = [...answers, lang];
    setAnswers(next);
    if (next.length === QUESTIONS.length) {
      const r = tally(next);
      setResult(r);
      try { localStorage.setItem(STORAGE_KEY, r); } catch {}
    } else {
      setStep(step + 1);
    }
  };

  const retake = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="font-script text-2xl text-primary">love language translator</p>
          <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
            How do you hear love?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Five tiny questions. Then I'll translate everything I do through your fluent tongue.
          </p>
        </div>

        <div className="mt-12">
          <AnimatePresence mode="wait">
            {mounted && !result && (
              <motion.div
                key={`q-${step}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl border border-primary/20 bg-card/50 p-8 backdrop-blur-md"
              >
                <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
                  <span>question {step + 1} of {QUESTIONS.length}</span>
                  <div className="flex gap-1">
                    {QUESTIONS.map((_, i) => (
                      <span key={i} className={`h-1.5 w-6 rounded-full ${i <= step ? "bg-primary" : "bg-primary/20"}`} />
                    ))}
                  </div>
                </div>
                <p className="font-display text-2xl text-foreground">{QUESTIONS[step].q}</p>
                <div className="mt-6 flex flex-col gap-3">
                  {QUESTIONS[step].options.map((o) => (
                    <button
                      key={o.label}
                      type="button"
                      onClick={() => pick(o.lang)}
                      className="rounded-2xl border border-primary/20 bg-background/40 px-5 py-4 text-left font-display text-base text-foreground/90 transition-all hover:scale-[1.02] hover:bg-primary/10 hover:border-primary/40"
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {mounted && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-8 shadow-2xl backdrop-blur-md md:p-10"
              >
                <div className="text-center">
                  <div className="text-6xl">{LANGS[result].emoji}</div>
                  <p className="mt-3 font-script text-2xl text-primary">your love language is</p>
                  <h3 className="mt-1 font-display text-4xl font-bold text-gradient-hero md:text-5xl">
                    {LANGS[result].name}
                  </h3>
                  <p className="mt-2 italic text-muted-foreground">{LANGS[result].tagline}</p>
                </div>

                <div className="mt-8">
                  <p className="text-center font-script text-xl text-primary">so here's what to watch for…</p>
                  <ul className="mt-4 space-y-3">
                    {LANGS[result].jackDoes.map((line, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.15 }}
                        className="flex gap-3 rounded-2xl border border-primary/15 bg-background/30 p-4 font-display text-foreground/90"
                      >
                        <span className="text-primary">❤</span>
                        <span>jack {line}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={retake}
                    className="rounded-full border border-primary/30 bg-background/50 px-5 py-2 font-display text-xs transition-all hover:bg-primary/10 hover:scale-105"
                  >
                    retake the quiz
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}