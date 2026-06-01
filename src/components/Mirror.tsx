import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";

interface RewriteEntry {
  keywords: string[];
  jackSays: string;
}

const REWRITES: RewriteEntry[] = [
  {
    keywords: ["ugly", "not pretty", "unattractive", "gross", "disgusting", "hideous", "bad face", "look bad", "not beautiful", "mirror", "hate my face", "hate how i look"],
    jackSays: "Sheila, I literally lose my train of thought when you walk into a room. Your face is the first thing I want to see in the morning and the last thing I picture before sleep. If you think you're ugly, my eyes are broken — and I never want them fixed.",
  },
  {
    keywords: ["fat", "too fat", "not skinny", "weight", "chubby", "big", "huge", "diet", "lose weight", "gained", "stomach", "thighs", "belly", "rolls"],
    jackSays: "Every time you mention your weight I want to wrap my arms around you and prove how little numbers matter. Your body fits against mine like we were designed by the same architect. I don't love you despite your body — I love you with it, in it, because of it.",
  },
  {
    keywords: ["not enough", "not good enough", "inadequate", "fail", "failure", "messing up", "screw up", "ruin everything", "can't do anything right", "worthless", "useless", "disappointment"],
    jackSays: "You think you're not enough? You're the reason I smile at my phone like an idiot in public. The reason I brag about you to strangers. The reason I believe in good things. You don't have to be enough for the world — you just have to exist, and my world is already better.",
  },
  {
    keywords: ["too much", "too loud", "too extra", "too sensitive", "too emotional", "too clingy", "too needy", "overwhelming", "intense", "too much work", "too complicated", "annoying", "exhausting"],
    jackSays: "You're not 'too much,' Sheila. You're a symphony in a world of ringtones. Your intensity is what makes you unforgettable. I'd rather drown in your ocean than stand safely in someone else's puddle. Don't shrink for anyone — especially not for yourself.",
  },
  {
    keywords: ["boring", "not interesting", "dull", "basic", "nothing special", "plain", "average", "nobody cares", "no personality", "lame", "unexciting"],
    jackSays: "Boring? You make me laugh until I can't breathe over the dumbest things. You have opinions about pasta shapes. You remember every detail of stories I forgot I told you. You're the most interesting notification I ever got, and I check my phone hoping it's you every time.",
  },
  {
    keywords: ["stupid", "dumb", "idiot", "slow", "not smart", "idiot", "clueless", "airhead", "dense", "thick", "can't understand", "brain dead", "mind"],
    jackSays: "The way your mind works is my favorite place to visit. You see things I miss. You ask questions that make me rethink everything. You're not stupid — you're the only person whose intelligence I find genuinely attractive. Smart is sexy, and you're my PhD.",
  },
  {
    keywords: ["deserve better", "you deserve better", "someone better", "not good for you", "holding you back", "dragging you down", "waste of time", "he can do better", "she can do better", "find someone else"],
    jackSays: "I already looked, Sheila. I looked everywhere. I looked at everyone. I compared, I wondered, I searched. And every single time, my brain did the same thing: it compared them to you, and they lost. You're my benchmark for better. There is no upgrade from you.",
  },
  {
    keywords: ["difficult", "hard to love", "complicated", "mess", "messy", "broken", "damaged", "trauma", "fucked up", "issues", "problems", "too broken", "unlovable", "unloveable"],
    jackSays: "Your cracks are where the light gets in. I've seen the messy parts, Sheila. I've seen you spiral, overthink, shut down. And I'm still here. Not because I'm patient — because I choose you. Every version of you. The hard days too. Especially the hard days.",
  },
  {
    keywords: ["lazy", "not doing enough", "no motivation", "procrastinate", "wasting time", "should be", "not productive", "not working hard", "lazy person", "slacker", "do nothing", "sitting around"],
    jackSays: "Resting isn't laziness, love. It's maintenance. Your worth isn't measured by your output. The world taught you to grind — but I just want you to breathe. Doing nothing with you is my favorite thing to do. You're a human being, not a human doing.",
  },
  {
    keywords: ["awkward", "weird", "cringe", "embarrassing", "socially awkward", "don't fit", "outsider", "strange", "odd", "not normal", "freak", "misfit", "don't belong"],
    jackSays: "Your weird is my favorite flavor. The way you dance badly at 2am? The random facts you blurt out? The faces you make when you're thinking? That's the stuff I replay in my head. Normal is overrated. I fell for your strange, and I don't want it to change.",
  },
  {
    keywords: ["talk too much", "too loud", "shut up", "annoying voice", "rambling", "never stops", "nagging", "chat too much", "talking", "mouth", "noise"],
    jackSays: "Your voice is my favorite sound. I don't care if you ramble, repeat yourself, or tell the same story twice. I want to hear every word. When you fall asleep mid-sentence, I stay awake hoping you'll start again. Talk forever. I'll never get tired of listening.",
  },
  {
    keywords: ["bad at", "can't", "never will", "always fail", "not talented", "no skill", "suck at", "terrible at", "the worst", "incompetent", "hopeless"],
    jackSays: "You think you can't? I've watched you do impossible things while doubting yourself the whole time. The only person who doesn't believe in you is you — and even you can't convince me not to. I'll be your believer until you catch up.",
  },
  {
    keywords: ["replaceable", "forgettable", "anyone could", "doesn't matter", "insignificant", "small", "nobody", "invisible", "don't matter", "unimportant"],
    jackSays: "Replaceable? I remember what you wore the first time I saw you. I remember the exact stupid joke you made that made me fall. I remember your coffee order, your laugh, the way you sigh when you're annoyed. You're carved into my memory with permanent ink. There's no replacing art.",
  },
  {
    keywords: ["anxious", "anxiety", "overthink", "overthinking", "worry", "worried", "panic", "stressed", "nervous", "scared", "afraid", "fear"],
    jackSays: "Your anxiety is not a flaw — it's your heart trying to protect you from a world that's been hard on you. But you don't have to carry it alone anymore. Hand me some of it. I'll hold what you can't. You're safe with me, even when your mind says you're not.",
  },
  {
    keywords: ["toxic", "manipulative", "crazy", "psycho", "toxic person", "bad person", "mean", "awful person", "horrible", "monster", "villain"],
    jackSays: "You're not toxic, Sheila. You're tender in a world that punishes tenderness. Your 'too much' is just you caring deeply in a language most people never learned to speak. I speak it. I hear you. You're not bad — you're just tired of being misunderstood.",
  },
  {
    keywords: ["used", "damaged goods", "second hand", "not new", "past", "history", "baggage", "too much history", "been through", "hurt", "hurt too many times"],
    jackSays: "Your past isn't baggage — it's a map that led you to me. Every scar, every wrong turn, every person who didn't see your value — they all prepared you to recognize real love when it finally showed up. Hi. I'm real love. And I don't care where you've been, only that you're here.",
  },
  {
    keywords: ["jealous", "possessive", "insecure", "jealousy", "clingy", "needy", "attention", "validation", "attention seeking", "needy person"],
    jackSays: "You want my attention? You have it. All of it. You don't have to fight for it or earn it or wonder if it's real. I'm not going anywhere. Your jealousy isn't crazy — it's your heart being honest about what it wants. And what it wants is exactly what I want to give.",
  },
  {
    keywords: ["nothing", "empty", "numb", "dead inside", "no feelings", "hollow", "void", "blank", "lost", "don't feel anything", "don't care", "apathetic"],
    jackSays: "Even when you feel nothing, you are something to me. I'll feel enough for both of us until you come back. Your emptiness doesn't scare me — it makes me want to fill you with every good thing I can find. Starting with me. I'm yours, even in the silence.",
  },
  {
    keywords: ["mistake", "regret", "shouldn't have", "wrong choice", "bad decision", "wasted", "wasted time", "wasted years", "wasted life"],
    jackSays: "Nothing you've done is a mistake if it taught you what you deserve. And you deserve this — someone who sees your whole story and still wants to be your next chapter. I'm not here to fix your past. I'm here to prove it was worth getting through.",
  },
  {
    keywords: ["alone", "lonely", "no one loves", "unloved", "no friends", "isolated", "abandoned", "left", "no one cares", "no one wants", "by myself"],
    jackSays: "You're not alone, Sheila. I'm right here. Right now. Typing this to you across whatever distance is between us. And I'm not going anywhere. You could push me away a hundred times and I'd come back a hundred and one. You're stuck with me. Lucky you.",
  },
];

const FALLBACKS = [
  "I don't know what to say to that exact thought, but I know this: whatever you just typed isn't true. I know you. I choose you. And I'm not wrong about people.",
  "If you said that about my best friend, I'd fight you. Since you said it about the person I love most — let me fight for you instead. You're wrong about yourself, beautiful.",
  "That thought you just had? It needs a fact-check, and I'm the expert on you. Verdict: FALSE. You're incredible. Signed, the person who sees you most clearly.",
  "I wish I could reach through the screen and hold your face until that thought goes away. Since I can't, here's the next best thing: you're loved. Deliberately. Completely. By me.",
  "You know what? That mean thing you think about yourself — Jack disagrees. Strongly. With evidence. Exhibit A: my entire heart. It only beats this way for you.",
];

function findRewrite(text: string): string {
  const low = text.toLowerCase();
  for (const entry of REWRITES) {
    if (entry.keywords.some((k) => low.includes(k))) {
      return entry.jackSays;
    }
  }
  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
}

export function Mirror() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const [showing, setShowing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleRewrite = () => {
    if (!input.trim()) return;
    const rewrite = findRewrite(input);
    setResult(rewrite);
    setShowing(false);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setShowing(true);
    }, 400);
  };

  const reset = () => {
    setInput("");
    setResult(null);
    setShowing(false);
    setTyping(false);
    textareaRef.current?.focus();
  };

  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="font-script text-2xl text-primary">mirror, mirror</p>
          <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
            Tell me something mean.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Type one thing you think about yourself — the thing you’d never say out loud.
            <br />
            I'll hand it back to you in my voice instead.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {/* Input area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-3xl border border-primary/20 bg-card/50 p-1 backdrop-blur-md">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleRewrite();
                  }
                }}
                maxLength={200}
                rows={3}
                placeholder="I'm too... I'm not... I wish I wasn't..."
                className="w-full resize-none rounded-2xl bg-transparent px-6 py-5 font-display text-lg leading-relaxed text-foreground placeholder:text-muted-foreground/50 outline-none"
              />
              <div className="flex items-center justify-between px-5 pb-4">
                <span className="text-xs text-muted-foreground/60">
                  {input.length}/200
                </span>
                <button
                  type="button"
                  onClick={handleRewrite}
                  disabled={!input.trim() || typing}
                  className="rounded-full bg-primary px-6 py-2.5 font-display text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                >
                  {typing ? "Jack is thinking..." : "let Jack see it"}
                </button>
              </div>
            </div>

            {/* Decorative mirror frame corners */}
            <div className="pointer-events-none absolute -inset-3 rounded-[2rem] border border-primary/10" />
            <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] border border-primary/5" />
          </motion.div>

          {/* Result */}
          <AnimatePresence mode="wait">
            {showing && result && (
              <motion.div
                key={result}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative mt-6"
              >
                <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-8 shadow-2xl backdrop-blur-md md:p-10">
                  {/* Quote marks */}
                  <div className="absolute -top-4 left-6 font-display text-6xl text-primary/30 select-none">
                    "
                  </div>

                  <p className="mt-2 font-display text-lg leading-relaxed text-foreground/90 md:text-xl">
                    {result}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <p className="font-script text-xl text-primary">— Jack</p>
                    <button
                      type="button"
                      onClick={reset}
                      className="rounded-full border border-primary/30 bg-background/50 px-4 py-2 font-display text-xs transition-all hover:bg-primary/10 hover:scale-105"
                    >
                      say something else
                    </button>
                  </div>

                  {/* Floating hearts animation */}
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 0, x: 0 }}
                        animate={{
                          opacity: [0, 0.6, 0],
                          y: -60 - Math.random() * 40,
                          x: (Math.random() - 0.5) * 40,
                        }}
                        transition={{
                          duration: 2 + Math.random() * 2,
                          delay: i * 0.3,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                        className="absolute bottom-4"
                        style={{ left: `${15 + i * 18}%` }}
                      >
                        <span className="text-xl">
                          {["❤️", "💖", "💫", "🩷", "✨"][i]}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hint chips for ideas */}
          {!result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-2"
            >
              <span className="text-xs text-muted-foreground/60">stuck? try:</span>
              {["I'm not enough", "I'm too much", "I'm ugly", "I'm boring", "I mess everything up", "He deserves better"].map((hint) => (
                <button
                  key={hint}
                  type="button"
                  onClick={() => {
                    setInput(hint);
                    textareaRef.current?.focus();
                  }}
                  className="rounded-full border border-primary/20 bg-background/40 px-3 py-1 font-display text-xs transition-all hover:bg-primary/10 hover:scale-105"
                >
                  {hint}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
