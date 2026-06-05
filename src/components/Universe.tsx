import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Star = {
  id: string;
  x: number; // %
  y: number; // %
  memory: string;
  date: string;
};

const STORAGE_KEY = "our-universe-stars-v1";

function loadStars(): Star[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as Star[];
  } catch {}
  return [];
}

export function Universe() {
  const skyRef = useRef<HTMLDivElement | null>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [mounted, setMounted] = useState(false);
  const [pending, setPending] = useState<{ x: number; y: number } | null>(null);
  const [memory, setMemory] = useState("");
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setStars(loadStars());
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(stars)); } catch {}
  }, [stars, mounted]);

  const handleSkyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!skyRef.current) return;
    // if a star card is open, clicking anywhere on the sky just closes it
    if (hover) {
      setHover(null);
      return;
    }
    // also dismiss any pending star composer with an outside click
    if (pending) {
      setPending(null);
      setMemory("");
      return;
    }
    const rect = skyRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    if (x < 2 || x > 98 || y < 2 || y > 98) return;
    setPending({ x, y });
    setMemory("");
  };

  const commit = () => {
    if (!pending || !memory.trim()) return;
    const star: Star = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      x: pending.x,
      y: pending.y,
      memory: memory.trim().slice(0, 280),
      date: new Date().toISOString(),
    };
    setStars((s) => [...s, star]);
    setPending(null);
    setMemory("");
  };

  const remove = (id: string) => setStars((s) => s.filter((st) => st.id !== id));
  const clearAll = () => {
    if (confirm("Clear the whole sky? The stars don't come back.")) setStars([]);
  };

  // build polyline path connecting stars in order added
  const linePoints = stars.map((s) => `${s.x},${s.y}`).join(" ");

  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="font-script text-2xl text-primary">our universe</p>
          <h2 className="mt-2 font-display text-5xl md:text-7xl font-bold text-gradient-hero">
            A night sky, made of us.
          </h2>
          <p className="mt-4 italic text-muted-foreground">
            Click anywhere on the sky to drop a star. Tell it a memory. Watch the constellation grow.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-primary/30 shadow-[var(--glow-pink)]">
          <div
            ref={skyRef}
            onClick={handleSkyClick}
            className="relative aspect-[16/10] w-full cursor-crosshair select-none"
            style={{
              background:
                "radial-gradient(ellipse at 20% 20%, rgba(120,80,200,0.35), transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(220,100,160,0.30), transparent 55%), linear-gradient(180deg, #060417 0%, #0a0625 60%, #120730 100%)",
            }}
          >
            {/* faint background twinkle dots */}
            {Array.from({ length: 60 }).map((_, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-white/60"
                style={{
                  left: `${(i * 37) % 100}%`,
                  top: `${(i * 53) % 100}%`,
                  width: (i % 5) === 0 ? 2 : 1,
                  height: (i % 5) === 0 ? 2 : 1,
                  opacity: 0.25 + ((i * 7) % 50) / 100,
                }}
              />
            ))}

            {/* connecting lines */}
            {stars.length > 1 && (
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <polyline
                  points={linePoints}
                  fill="none"
                  stroke="rgba(255,180,220,0.45)"
                  strokeWidth="0.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            )}

            {/* stars */}
            {mounted && stars.map((s) => (
              <motion.button
                key={s.id}
                type="button"
                onClick={(e) => { e.stopPropagation(); setHover(hover === s.id ? null : s.id); }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                aria-label="star"
              >
                <span className="relative block">
                  <span className="absolute inset-0 -m-3 rounded-full bg-pink-300/30 blur-md" />
                  <span className="relative block h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,200,230,0.95)] animate-pulse" />
                </span>
              </motion.button>
            ))}

            {/* hover/selected card */}
            <AnimatePresence>
              {hover && (() => {
                const s = stars.find((x) => x.id === hover);
                if (!s) return null;
                const flipX = s.x > 70;
                const flipY = s.y > 70;
                return (
                  <motion.div
                    key={s.id + "-card"}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute z-10 w-56 rounded-2xl border border-primary/30 bg-background/90 p-3 text-left shadow-2xl backdrop-blur-md"
                    style={{
                      left: `${s.x}%`,
                      top: `${s.y}%`,
                      transform: `translate(${flipX ? "-105%" : "12px"}, ${flipY ? "-105%" : "12px"})`,
                    }}
                  >
                    <p className="font-display text-sm leading-snug text-foreground">
                      {s.memory}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                      <span>{new Date(s.date).toLocaleDateString()}</span>
                      <button
                        type="button"
                        onClick={() => { remove(s.id); setHover(null); }}
                        className="rounded-full border border-destructive/40 px-2 py-0.5 text-destructive transition hover:bg-destructive/10"
                      >
                        remove
                      </button>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>

            {/* pending marker */}
            {pending && (
              <div
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${pending.x}%`, top: `${pending.y}%` }}
              >
                <span className="block h-3 w-3 rounded-full border-2 border-pink-200 bg-pink-200/40 animate-ping" />
              </div>
            )}
          </div>
        </div>

        {/* composer */}
        <AnimatePresence>
          {pending && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="mx-auto mt-6 max-w-xl rounded-2xl border border-primary/30 bg-card/70 p-5 backdrop-blur-md"
            >
              <p className="font-script text-lg text-primary">name this star</p>
              <p className="text-xs text-muted-foreground">
                a memory, a moment, a quiet inside thing. one sentence is plenty.
              </p>
              <textarea
                value={memory}
                onChange={(e) => setMemory(e.target.value)}
                maxLength={280}
                rows={2}
                autoFocus
                placeholder="the night you danced in the kitchen with no music…"
                className="mt-3 w-full resize-none rounded-xl border border-primary/20 bg-background/60 p-3 font-display text-sm text-foreground outline-none focus:border-primary/50"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {memory.length}/280
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setPending(null); setMemory(""); }}
                    className="rounded-full border border-primary/20 px-4 py-1.5 text-xs transition hover:bg-primary/5"
                  >
                    cancel
                  </button>
                  <button
                    type="button"
                    onClick={commit}
                    disabled={!memory.trim()}
                    className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-md transition disabled:opacity-40 hover:scale-105"
                  >
                    hang it in the sky ✨
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {mounted ? (
              stars.length === 0
                ? "your sky is empty. tap it to begin."
                : `${stars.length} star${stars.length === 1 ? "" : "s"} so far — keep going, my love.`
            ) : "loading the sky…"}
          </span>
          {stars.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="rounded-full border border-destructive/30 px-3 py-1 text-destructive transition hover:bg-destructive/10"
            >
              clear sky
            </button>
          )}
        </div>
      </div>
    </section>
  );
}