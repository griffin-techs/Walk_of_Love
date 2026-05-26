import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Ambient romantic pad — gentle Cmaj7-ish chord with slow LFO modulation,
 * soft lowpass, vinyl-ish noise crackle, and shimmery delay tail.
 * Designed to feel like falling in love during a late-night drive.
 */
type Engine = {
  ctx: AudioContext;
  master: GainNode;
  stop: () => void;
};

function buildEngine(targetVol: number): Engine {
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AC();

  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // gentle lowpass for warmth
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1400;
  filter.Q.value = 0.6;
  filter.connect(master);

  // shimmery delay
  const delay = ctx.createDelay(2);
  delay.delayTime.value = 0.55;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.32;
  const delayGain = ctx.createGain();
  delayGain.gain.value = 0.35;
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(delayGain);
  delayGain.connect(filter);

  // Chord voices — Cmaj9 vibe across octaves
  const freqs = [130.81, 196.0, 261.63, 329.63, 392.0, 493.88];
  const types: OscillatorType[] = ["sine", "triangle", "sine", "triangle", "sine", "triangle"];
  const oscs: OscillatorNode[] = [];
  const voiceGains: GainNode[] = [];

  freqs.forEach((f, i) => {
    const o = ctx.createOscillator();
    o.type = types[i];
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.value = 0.06 + (i === 0 ? 0.04 : 0);
    // very subtle detune drift
    o.detune.value = (Math.random() - 0.5) * 6;
    o.connect(g);
    g.connect(filter);
    g.connect(delay);
    o.start();
    oscs.push(o);
    voiceGains.push(g);
  });

  // slow LFO on filter cutoff → breathing pad
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.08;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 600;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  // soft vinyl crackle (white noise → highpass → very low gain)
  const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = noiseBuf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuf;
  noise.loop = true;
  const noiseHP = ctx.createBiquadFilter();
  noiseHP.type = "highpass";
  noiseHP.frequency.value = 2000;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.012;
  noise.connect(noiseHP);
  noiseHP.connect(noiseGain);
  noiseGain.connect(master);
  noise.start();

  // fade in
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(targetVol, now + 2.4);

  const stop = () => {
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(0, t + 1.4);
    setTimeout(() => {
      try {
        oscs.forEach((o) => o.stop());
        lfo.stop();
        noise.stop();
        ctx.close();
      } catch {
        /* noop */
      }
    }, 1600);
  };

  return { ctx, master, stop };
}

export function MusicToggle() {
  const [on, setOn] = useState(false);
  const [vol, setVol] = useState(0.35);
  const [open, setOpen] = useState(false);
  const engineRef = useRef<Engine | null>(null);

  useEffect(() => () => engineRef.current?.stop(), []);

  // smooth volume changes
  useEffect(() => {
    const e = engineRef.current;
    if (!e) return;
    const t = e.ctx.currentTime;
    e.master.gain.cancelScheduledValues(t);
    e.master.gain.setValueAtTime(e.master.gain.value, t);
    e.master.gain.linearRampToValueAtTime(vol * 0.18, t + 0.6);
  }, [vol]);

  const toggle = () => {
    if (on) {
      engineRef.current?.stop();
      engineRef.current = null;
      setOn(false);
    } else {
      engineRef.current = buildEngine(vol * 0.18);
      setOn(true);
      setOpen(true);
    }
  };

  return (
    <div className="fixed right-4 top-4 z-50 flex flex-col items-end gap-2 sm:right-5 sm:top-5">
      <motion.button
        onClick={toggle}
        onMouseEnter={() => on && setOpen(true)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="glass rounded-full px-4 py-2.5 text-sm font-semibold text-foreground shadow-[var(--shadow-card)]"
        aria-label={on ? "Pause ambient music" : "Play ambient music"}
      >
        <motion.span
          animate={on ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 3.2, repeat: on ? Infinity : 0, ease: "easeInOut" }}
          className="inline-block"
        >
          {on ? "🎵" : "🔇"}
        </motion.span>
        <span className="ml-2 hidden sm:inline">{on ? "vibes on" : "vibes off"}</span>
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
            <span className="text-xs font-medium text-foreground/70">vol</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={vol}
              onChange={(e) => setVol(parseFloat(e.target.value))}
              className="h-1 w-28 cursor-pointer accent-[var(--primary)]"
              aria-label="Volume"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}