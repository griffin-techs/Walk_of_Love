import { motion } from "framer-motion";

const DRAFTS = [
  { text: "i can't stop thinking about you and it's becoming a problem (a good one)", note: "deleted at 11:47pm — too much, too early" },
  { text: "what are you doing right now? actually never mind", note: "chickened out" },
  { text: "saw something today and thought of you instantly", note: "didn't send. couldn't explain what 'it' was" },
  { text: "this is going to sound crazy but", note: "saved as draft. for the brave version of me" },
  { text: "can i call you?", note: "typed. retyped. deleted. paced." },
  { text: "you'd hate this song. i love it. you'd still listen to it for me", note: "sent only to my notes app" },
  { text: "i miss you in like a normal amount. okay fine, slightly more than normal", note: "edited 6 times. then nuked" },
  { text: "okay but hypothetically", note: "the hypothetical was 'us'. didn't survive" },
  { text: "i'm bad at this part", note: "true. also unsent" },
  { text: "do you ever just", note: "yes, i do, also, deleted" },
  { text: "i don't know what we are but i know i like it", note: "way too honest for 2:14am" },
  { text: "if i told you something would you not make it weird", note: "she would not have made it weird. i still chickened" },
  { text: "your name shouldn't have this much power over my mood", note: "embarrassingly accurate. deleted instantly" },
  { text: "wanna run away for the weekend. small bag. no plan", note: "saved for the right moment" },
  { text: "okay i built you a website instead", note: "this is the only one i actually sent ✓" },
];

export function AlmostTexted() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="font-script text-2xl text-primary">things i almost texted you</p>
          <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
            The drafts folder
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every message I started and then... did not send. Until now.
          </p>
        </div>

        <div className="mt-14 rounded-3xl border border-primary/20 bg-card/60 p-5 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="mb-5 flex items-center justify-between border-b border-primary/10 pb-4">
            <p className="font-display text-sm text-muted-foreground">Drafts · Sheila ❤️</p>
            <p className="font-script text-sm text-primary/70">{DRAFTS.length} unsent</p>
          </div>

          <div className="space-y-4">
            {DRAFTS.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: (i % 6) * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-end"
              >
                <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary/85 px-4 py-3 text-right text-primary-foreground shadow-md">
                  <p className="font-display text-base leading-snug">{d.text}</p>
                </div>
                <p className="mt-1 pr-1 font-script text-xs text-muted-foreground">{d.note}</p>
              </motion.div>
            ))}
          </div>

          <p className="mt-8 border-t border-primary/10 pt-5 text-center font-script text-base text-primary/70">
            ↑ all of these were for you. now they are too.
          </p>
        </div>
      </div>
    </section>
  );
}