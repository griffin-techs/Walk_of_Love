import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type NavItem =
  | { kind: "route"; href: string; label: string; emoji: string }
  | { kind: "section"; id: string; label: string; emoji: string };

const SECTIONS: NavItem[] = [
  { kind: "section", id: "hero", label: "the beginning", emoji: "💌" },
  { kind: "section", id: "todays-note", label: "today's note", emoji: "🌗" },
  { kind: "section", id: "interrogation", label: "interrogation", emoji: "🕵️" },
  { kind: "section", id: "date-planner", label: "plan our date", emoji: "🌹" },
  { kind: "section", id: "vacation", label: "dreamlands", emoji: "✈️" },
  { kind: "section", id: "love-quiz", label: "love quiz", emoji: "💘" },
  { kind: "section", id: "compatibility", label: "compatibility", emoji: "💞" },
  { kind: "section", id: "dealbreakers", label: "dealbreakers", emoji: "🙅" },
  { kind: "section", id: "reasons", label: "reasons", emoji: "✨" },
  { kind: "section", id: "promises", label: "promises", emoji: "🤞" },
  { kind: "section", id: "headlines", label: "future headlines", emoji: "📰" },
  { kind: "section", id: "map-of-you", label: "map of you", emoji: "🗺️" },
  { kind: "section", id: "open-when", label: "open when…", emoji: "✉️" },
  { kind: "section", id: "little-things", label: "little things", emoji: "🩷" },
  { kind: "section", id: "almost-texted", label: "almost texted", emoji: "📱" },
  { kind: "section", id: "soundtrack", label: "our soundtrack", emoji: "🎵" },
  { kind: "section", id: "letter", label: "the letter", emoji: "📜" },
  { kind: "section", id: "diary", label: "secret diary", emoji: "🔒" },
  { kind: "section", id: "walk-of-love", label: "walk of love", emoji: "⭐" },
  { kind: "section", id: "daily-diary", label: "daily diary", emoji: "📔" },
  { kind: "section", id: "photo-album", label: "polaroids", emoji: "📸" },
  { kind: "section", id: "mirror", label: "mirror, mirror", emoji: "🪞" },
  { kind: "section", id: "birthday-vault", label: "birthday vault", emoji: "🎂" },
  { kind: "section", id: "love-language", label: "love language", emoji: "💝" },
  { kind: "section", id: "jokes-museum", label: "inside jokes museum", emoji: "🏛️" },
  { kind: "section", id: "time-capsule", label: "time capsule", emoji: "🕰️" },
  { kind: "section", id: "universe", label: "our universe", emoji: "🌌" },
  { kind: "section", id: "sweetness", label: "sweetness index", emoji: "🍯" },
  { kind: "section", id: "wish-i-could", label: "wish i could…", emoji: "🪄" },
  { kind: "section", id: "comfort-mode", label: "comfort mode", emoji: "🧸" },
  { kind: "section", id: "compass", label: "compass of us", emoji: "🧭" },
  { kind: "section", id: "reply-to-jack", label: "reply to jack", emoji: "💬" },
  { kind: "section", id: "invite", label: "the invite", emoji: "🥂" },
  { kind: "section", id: "countdown", label: "countdown", emoji: "⏳" },
  { kind: "section", id: "finale", label: "the finale", emoji: "🌙" },
];

export function SideNav() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <>
      {/* trigger */}
      <button
        type="button"
        aria-label="open menu"
        onClick={() => setOpen((v) => !v)}
        className="fixed left-6 top-6 z-110 flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-card/80 text-foreground shadow-lg backdrop-blur-md transition-transform hover:scale-110 active:scale-95"
      >
        <span className="flex flex-col gap-1">
          <span className="block h-0.5 w-5 rounded-full bg-foreground" />
          <span className="block h-0.5 w-5 rounded-full bg-foreground" />
          <span className="block h-0.5 w-5 rounded-full bg-foreground" />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-105 bg-background/40 backdrop-blur-sm"
            />
            <motion.aside
              ref={panelRef}
              key="panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 top-0 z-108 h-full w-75 max-w-[85vw] overflow-y-auto border-r border-primary/20 bg-card/95 p-6 pt-20 shadow-2xl backdrop-blur-xl"
            >
              <p className="px-2 font-script text-2xl text-primary">wander, my love</p>
              <p className="mt-1 px-2 text-xs uppercase tracking-widest text-muted-foreground">
                pick a chapter
              </p>
              <nav className="mt-6 flex flex-col gap-1">
                {SECTIONS.map((s) => (
                  <button
                    key={s.kind === "section" ? s.id : s.href}
                    type="button"
                    onClick={() => {
                      if (s.kind === "section") {
                        go(s.id);
                      }
                    }}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-foreground/80 transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <span className="text-lg transition-transform group-hover:scale-125">
                      {s.emoji}
                    </span>
                    <span className="font-display">{s.label}</span>
                  </button>
                ))}
              </nav>
              <p className="mt-8 px-3 text-center font-script text-base text-primary/70">
                — every chapter is for you ❤
              </p>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}