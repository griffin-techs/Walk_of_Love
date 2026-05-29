import { motion } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const MOODS = ["🥹", "😊", "😳", "🤭", "💖", "🥲", "😏", "🤔", "😭", "✨"];

export function ReplyToJack() {
  const [mood, setMood] = useState<string>("🥹");
  const [word, setWord] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = word.trim();
    if (!trimmed || trimmed.length > 60) return;
    setStatus("sending");
    const { error } = await supabase
      .from("sheila_replies")
      .insert({ mood, word: trimmed });
    if (error) {
      setStatus("error");
      return;
    }
    setStatus("sent");
    setWord("");
  };

  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="font-script text-2xl text-primary">your turn</p>
          <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
            Send Jack something back
          </h2>
          <p className="mt-4 text-muted-foreground">
            One mood. One word. That's all I need. I'll know.
          </p>
        </div>

        <motion.form
          onSubmit={send}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 rounded-3xl border border-primary/25 bg-card/70 p-8 shadow-2xl backdrop-blur-xl md:p-10"
        >
          <p className="font-script text-lg text-primary/80">pick a mood</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMood(m)}
                className={`flex h-12 w-12 items-center justify-center rounded-full border text-2xl transition-all ${
                  mood === m
                    ? "scale-110 border-primary bg-primary/20"
                    : "border-primary/20 bg-card/40 hover:scale-105 hover:border-primary/50"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <p className="mt-8 font-script text-lg text-primary/80">now one word</p>
          <input
            value={word}
            onChange={(e) => setWord(e.target.value)}
            maxLength={60}
            placeholder="just one. anything."
            className="mt-3 w-full rounded-2xl border border-primary/25 bg-background/50 px-5 py-4 font-display text-xl text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
          />

          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="font-script text-sm text-muted-foreground">
              {status === "sent" && "received. i felt it. thank you. ❤"}
              {status === "error" && "something broke. try again?"}
              {status === "idle" && "i'll get a notification. promise."}
              {status === "sending" && "sending gently…"}
            </p>
            <button
              type="submit"
              disabled={status === "sending" || !word.trim()}
              className="rounded-full bg-primary px-7 py-3 font-display text-base font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 disabled:opacity-50"
            >
              {status === "sent" ? "send another" : "send to Jack"}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}