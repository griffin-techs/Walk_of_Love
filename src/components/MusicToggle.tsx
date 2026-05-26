import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function MusicToggle() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ osc: OscillatorNode; gain: GainNode; osc2: OscillatorNode } | null>(null);

  useEffect(() => {
    return () => {
      try {
        nodesRef.current?.osc.stop();
        nodesRef.current?.osc2.stop();
        ctxRef.current?.close();
      } catch {}
    };
  }, []);

  const toggle = () => {
    if (!on) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const gain = ctx.createGain();
      gain.gain.value = 0.04;
      gain.connect(ctx.destination);
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 261.63;
      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.value = 329.63;
      osc.connect(gain);
      osc2.connect(gain);
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.18;
      lfoGain.gain.value = 8;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfoGain.connect(osc2.frequency);
      osc.start();
      osc2.start();
      lfo.start();
      ctxRef.current = ctx;
      nodesRef.current = { osc, gain, osc2 };
      setOn(true);
    } else {
      try {
        nodesRef.current?.osc.stop();
        nodesRef.current?.osc2.stop();
        ctxRef.current?.close();
      } catch {}
      ctxRef.current = null;
      nodesRef.current = null;
      setOn(false);
    }
  };

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="fixed right-5 top-5 z-50 glass rounded-full px-4 py-2.5 text-sm font-semibold text-foreground"
      aria-label="Toggle music"
    >
      <motion.span
        animate={on ? { rotate: [0, 360] } : { rotate: 0 }}
        transition={{ duration: 4, repeat: on ? Infinity : 0, ease: "linear" }}
        className="inline-block"
      >
        {on ? "🎵" : "🔇"}
      </motion.span>
      <span className="ml-2 hidden sm:inline">{on ? "vibes on" : "vibes off"}</span>
    </motion.button>
  );
}