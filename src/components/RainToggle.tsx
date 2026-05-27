import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Soft rain ambience — pink noise shaped through bandpass + lowpass
 * with subtle LFO modulation. Blends gently under the music pad.
 * Smooth fade in/out, seamless loop via long noise buffer.
 */
type RainEngine = {
  ctx: AudioContext;
  master: GainNode;
  stop: () => void;
};

function buildRain(target: number): RainEngine {
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AC();

  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // 6s pink-ish noise buffer — long enough to feel non-repeating
  const len = ctx.sampleRate * 6;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  // pink noise via Voss-McCartney approximation
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.18;
    b6 = white * 0.115926;
  }

  const source = ctx.createBufferSource();
  source.buffer = buf;
  source.loop = true;

  // lowpass to remove harshness
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 2200;
  lp.Q.value = 0.4;

  // bandpass adds the "wet pavement" character
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 900;
  bp.Q.value = 0.6;

  const bpGain = ctx.createGain();
  bpGain.gain.value = 0.45;

  source.connect(lp);
  lp.connect(master);
  source.connect(bp);
  bp.connect(bpGain);
  bpGain.connect(master);

  // slow LFO on lowpass cutoff → wind/rain swells
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.06;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 500;
  lfo.connect(lfoGain);
  lfoGain.connect(lp.frequency);

  source.start();
  lfo.start();

  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(target, now + 2.6);

  const stop = () => {
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(0, t + 1.8);
    setTimeout(() => {
      try {
        source.stop();
        lfo.stop();
        ctx.close();
      } catch {
        /* noop */
      }
    }, 2000);
  };

  return { ctx, master, stop };
}

export function RainToggle() {
  const [on, setOn] = useState(false);
  const [vol, setVol] = useState(0.4);
  const [open, setOpen] = useState(false);
  const engineRef = useRef<RainEngine | null>(null);

  useEffect(() => () => engineRef.current?.stop(), []);

  useEffect(() => {
    const e = engineRef.current;
    if (!e) return;
    const t = e.ctx.currentTime;
    e.master.gain.cancelScheduledValues(t);
    e.master.gain.setValueAtTime(e.master.gain.value, t);
    e.master.gain.linearRampToValueAtTime(vol * 0.22, t + 0.8);
  }, [vol]);

  const toggle = () => {
    if (on) {
      engineRef.current?.stop();
      engineRef.current = null;
      setOn(false);
    } else {
      engineRef.current = buildRain(vol * 0.22);
      setOn(true);
      setOpen(true);
    }
  };

  return (
    <div className="fixed right-4 top-20 z-50 flex flex-col items-end gap-2 sm:right-5 sm:top-[5.25rem]">
      <motion.button
        onClick={toggle}
        onMouseEnter={() => on && setOpen(true)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="glass rounded-full px-4 py-2.5 text-sm font-semibold text-foreground shadow-[var(--shadow-card)]"
        aria-label={on ? "Stop rain ambience" : "Play rain ambience"}
      >
        <motion.span
          animate={on ? { y: [0, 2, 0] } : { y: 0 }}
          transition={{ duration: 2.4, repeat: on ? Infinity : 0, ease: "easeInOut" }}
          className="inline-block"
        >
          {on ? "🌧️" : "☁️"}
        </motion.span>
        <span className="ml-2 hidden sm:inline">{on ? "raining" : "rain off"}</span>
      </motion.button>

      <AnimatePresence>
        {on && open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            onMouseLeave={() => setOpen(false)}
            className="glass flex items-center gap-3 rounded-full px-4 py-2"
          >
            <span className="text-xs font-medium text-foreground/70">rain</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={vol}
              onChange={(e) => setVol(parseFloat(e.target.value))}
              className="h-1 w-28 cursor-pointer accent-[var(--primary)]"
              aria-label="Rain volume"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* subtle visual rain overlay */}
      <AnimatePresence>
        {on && <RainOverlay />}
      </AnimatePresence>
    </div>
  );
}

function RainOverlay() {
  const drops = Array.from({ length: 60 });
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.55 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.6 }}
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      {drops.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = 0.8 + Math.random() * 1.2;
        const height = 40 + Math.random() * 60;
        return (
          <span
            key={i}
            style={{
              left: `${left}%`,
              height: `${height}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
            className="absolute top-[-10%] w-px bg-gradient-to-b from-transparent via-white/40 to-transparent animate-rain"
          />
        );
      })}
    </motion.div>
  );
}