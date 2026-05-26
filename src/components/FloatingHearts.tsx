import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

const EMOJIS = ["❤️", "💖", "💗", "💕", "✨", "🌸", "💫", "🩷"];

export function FloatingHearts({ count = 18 }: { count?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 22,
        duration: 28 + Math.random() * 26,
        size: 12 + Math.random() * 20,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      })),
    [count],
  );
  if (!mounted) return null;

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
            filter: "drop-shadow(0 4px 14px oklch(0.75 0.2 350 / 45%))",
            opacity: 0.85,
          }}
        >
          {it.emoji}
        </span>
      ))}
    </div>
  );
}

export function Sparkles({ count = 30 }: { count?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 6,
        size: 2 + Math.random() * 3,
      })),
    [count],
  );
  if (!mounted) return null;
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
  const glowRef = useRef<HTMLDivElement | null>(null);
  const [trail, setTrail] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
  const idRef = useRef(0);
  const lastRef = useRef({ x: 0, y: 0, t: 0 });

  useEffect(() => {
    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const now = performance.now();
      const dx = tx - lastRef.current.x;
      const dy = ty - lastRef.current.y;
      if (Math.hypot(dx, dy) > 80 && now - lastRef.current.t > 140) {
        lastRef.current = { x: tx, y: ty, t: now };
        const id = ++idRef.current;
        const emoji = ["❤️", "💖", "✨", "🩷"][id % 4];
        setTrail((t) => [...t.slice(-6), { id, x: tx, y: ty, emoji }]);
        setTimeout(() => setTrail((t) => t.filter((p) => p.id !== id)), 1800);
      }
    };
    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] hidden md:block"
        style={{
          width: 420,
          height: 420,
          marginLeft: -210,
          marginTop: -210,
          background:
            "radial-gradient(circle, oklch(0.82 0.18 350 / 28%) 0%, oklch(0.65 0.27 310 / 10%) 45%, transparent 72%)",
          mixBlendMode: "screen",
          willChange: "transform",
        }}
      />
      <div className="pointer-events-none fixed inset-0 z-[59] hidden md:block">
        {trail.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 0.9, scale: 0.6, x: p.x - 10, y: p.y - 10 }}
            animate={{ opacity: 0, scale: 1.4, y: p.y - 60 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="absolute text-lg"
            style={{ filter: "drop-shadow(0 2px 8px oklch(0.78 0.18 350 / 60%))" }}
          >
            {p.emoji}
          </motion.span>
        ))}
      </div>
    </>
  );
}