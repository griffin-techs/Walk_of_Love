import { useMemo } from "react";
import { motion } from "framer-motion";

const EMOJIS = ["❤️", "💖", "💗", "💕", "✨", "🌸", "💫", "🩷"];

export function FloatingHearts({ count = 18 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 10 + Math.random() * 14,
        size: 14 + Math.random() * 24,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      })),
    [count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {items.map((it) => (
        <span
          key={it.id}
          className="absolute bottom-[-10vh] select-none"
          style={{
            left: `${it.left}%`,
            fontSize: it.size,
            animation: `float-up ${it.duration}s linear ${it.delay}s infinite`,
            filter: "drop-shadow(0 4px 12px oklch(0.75 0.2 350 / 50%))",
          }}
        >
          {it.emoji}
        </span>
      ))}
    </div>
  );
}

export function Sparkles({ count = 30 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
        size: 2 + Math.random() * 3,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            boxShadow: "0 0 8px white",
          }}
        />
      ))}
    </div>
  );
}

export function CursorGlow() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] hidden md:block"
      style={{
        width: 380,
        height: 380,
        marginLeft: -190,
        marginTop: -190,
        background:
          "radial-gradient(circle, oklch(0.78 0.18 350 / 30%) 0%, oklch(0.65 0.27 310 / 10%) 40%, transparent 70%)",
        mixBlendMode: "screen",
      }}
      animate={{}}
      ref={(el) => {
        if (!el) return;
        const handler = (e: MouseEvent) => {
          el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        };
        window.addEventListener("mousemove", handler);
      }}
    />
  );
}