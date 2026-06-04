import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Capsule = {
  id: string;
  to: string;
  message: string;
  unlockAt: string; // ISO date
  createdAt: string;
  opened?: boolean;
};

const STORAGE = "time-capsules-v1";

function load(): Capsule[] {
  try {
    const raw = localStorage.getItem(STORAGE);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch { return []; }
}
function save(list: Capsule[]) {
  try { localStorage.setItem(STORAGE, JSON.stringify(list)); } catch {}
}

function daysUntil(iso: string): number {
  const now = new Date(); now.setHours(0,0,0,0);
  const target = new Date(iso); target.setHours(0,0,0,0);
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}

function burstConfetti() {
  const root = document.createElement("div");
  root.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden";
  document.body.appendChild(root);
  const emojis = ["💖","✨","🎉","💌","🩷","💫","🎊"];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement("div");
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.cssText = `position:absolute;left:${Math.random()*100}vw;top:-40px;font-size:${16+Math.random()*22}px;transition:transform 3s cubic-bezier(.22,1,.36,1),opacity 3s;`;
    root.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translate(${(Math.random()-0.5)*200}px, ${window.innerHeight + 100}px) rotate(${(Math.random()-0.5)*720}deg)`;
      el.style.opacity = "0";
    });
  }
  setTimeout(() => root.remove(), 3200);
}

export function TimeCapsule() {
  const [mounted, setMounted] = useState(false);
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [to, setTo] = useState("Future Jack");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setCapsules(load());
  }, []);

  const create = () => {
    if (!message.trim() || !date) return;
    const c: Capsule = {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      to,
      message: message.trim(),
      unlockAt: date,
      createdAt: new Date().toISOString(),
    };
    const next = [c, ...capsules];
    setCapsules(next); save(next);
    setMessage(""); setDate("");
  };

  const remove = (id: string) => {
    const next = capsules.filter(c => c.id !== id);
    setCapsules(next); save(next);
  };

  const open = (c: Capsule) => {
    if (daysUntil(c.unlockAt) > 0) return;
    setOpenId(c.id);
    if (!c.opened) {
      const next = capsules.map(x => x.id === c.id ? { ...x, opened: true } : x);
      setCapsules(next); save(next);
      burstConfetti();
    }
  };

  const min = mounted ? new Date(Date.now() + 86400000).toISOString().slice(0,10) : "";

  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="font-script text-2xl text-primary">the time capsule</p>
          <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
            Write to your future.
          </h2>
          <p className="mt-4 italic text-muted-foreground">
            "do not open until ___." sealed in the browser, unlocks itself on the day. 💌
          </p>
        </div>

        {/* Composer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-3xl border border-primary/20 bg-card/50 p-6 backdrop-blur-md md:p-8"
        >
          <div className="flex flex-col gap-4 md:flex-row">
            <label className="flex-1">
              <span className="block text-xs uppercase tracking-widest text-muted-foreground">to</span>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                maxLength={40}
                className="mt-1 w-full rounded-xl border border-primary/20 bg-background/40 px-4 py-2.5 font-display text-foreground outline-none focus:border-primary/50"
              />
            </label>
            <label className="md:w-56">
              <span className="block text-xs uppercase tracking-widest text-muted-foreground">unlock on</span>
              <input
                type="date"
                value={date}
                min={min}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-primary/20 bg-background/40 px-4 py-2.5 font-display text-foreground outline-none focus:border-primary/50"
              />
            </label>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="write something only future you should read…"
            maxLength={1200}
            rows={5}
            className="mt-4 w-full resize-none rounded-2xl border border-primary/20 bg-background/40 px-5 py-4 font-display text-foreground outline-none focus:border-primary/50"
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{message.length}/1200</span>
            <button
              type="button"
              onClick={create}
              disabled={!message.trim() || !date}
              className="rounded-full bg-primary px-6 py-2.5 font-display text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
            >
              🔒 seal capsule
            </button>
          </div>
        </motion.div>

        {/* List */}
        {mounted && capsules.length > 0 && (
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {capsules.map((c) => {
              const d = daysUntil(c.unlockAt);
              const unlocked = d <= 0;
              return (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`relative overflow-hidden rounded-2xl border p-5 backdrop-blur-sm ${unlocked ? "border-primary/40 bg-gradient-to-br from-primary/15 to-primary/5" : "border-primary/20 bg-card/40"}`}
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
                    <span>to {c.to}</span>
                    <button
                      type="button"
                      onClick={() => remove(c.id)}
                      aria-label="delete"
                      className="opacity-50 transition hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="mt-2 font-display text-lg text-foreground">
                    {unlocked ? "🔓 ready to open" : "🔒 sealed"}
                  </p>
                  <p className="mt-1 font-script text-base text-primary">
                    {unlocked
                      ? `unlocked ${new Date(c.unlockAt).toLocaleDateString()}`
                      : `${d} day${d===1?"":"s"} until ${new Date(c.unlockAt).toLocaleDateString()}`}
                  </p>
                  <button
                    type="button"
                    onClick={() => open(c)}
                    disabled={!unlocked}
                    className="mt-4 w-full rounded-full border border-primary/30 bg-background/40 px-4 py-2 font-display text-sm transition-all hover:bg-primary/10 disabled:opacity-40"
                  >
                    {unlocked ? "open the letter →" : "still waiting…"}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Reader */}
        <AnimatePresence>
          {openId && (() => {
            const c = capsules.find(x => x.id === openId);
            if (!c) return null;
            return (
              <>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setOpenId(null)}
                  className="fixed inset-0 z-[120] bg-background/70 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 30 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="fixed left-1/2 top-1/2 z-[125] w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-primary/30 bg-card p-8 shadow-2xl"
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
                    <span>to {c.to}</span>
                    <button type="button" onClick={() => setOpenId(null)} className="rounded-full border border-primary/30 px-3 py-1 transition hover:bg-primary/10">close</button>
                  </div>
                  <p className="mt-3 font-script text-2xl text-primary">a letter from the past</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    sealed {new Date(c.createdAt).toLocaleDateString()} · unlocked {new Date(c.unlockAt).toLocaleDateString()}
                  </p>
                  <div className="mt-5 max-h-[55vh] overflow-y-auto rounded-2xl border border-primary/15 bg-background/40 p-5">
                    <p className="whitespace-pre-wrap font-display leading-relaxed text-foreground/90">{c.message}</p>
                  </div>
                </motion.div>
              </>
            );
          })()}
        </AnimatePresence>
      </div>
    </section>
  );
}