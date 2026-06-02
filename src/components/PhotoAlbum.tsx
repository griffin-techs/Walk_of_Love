import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const DEFAULT_FRAMES = [
  { caption: "us, kitchen, 2am, dancing badly", tape: "rotate-[-3deg]" },
  { caption: "you, laughing too hard at my own joke", tape: "rotate-[2deg]" },
  { caption: "first morning in zanzibar, hair wild, coffee burnt", tape: "rotate-[-1deg]" },
  { caption: "the day we adopted something we shouldn't have", tape: "rotate-[3deg]" },
  { caption: "you in my hoodie, again, finally keeping it", tape: "rotate-[-2deg]" },
  { caption: "rain, one umbrella, both soaked anyway", tape: "rotate-[1deg]" },
  { caption: "us at city hall, no fancy dress, just us", tape: "rotate-[-3deg]" },
  { caption: "the ugly couch we swore we'd replace", tape: "rotate-[2deg]" },
  { caption: "3am airport, sleepy, holding hands wrong", tape: "rotate-[-1deg]" },
  { caption: "you teaching me your mom's recipe, badly", tape: "rotate-[3deg]" },
  { caption: "the dog stealing our bed, again", tape: "rotate-[-2deg]" },
  { caption: "anniversary 10, same booth, same order", tape: "rotate-[1deg]" },
];

type Frame = { caption: string; tape: string; image?: string };
const STORAGE_KEY = "photo-album-frames-v1";

function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export function PhotoAlbum() {
  const [frames, setFrames] = useState<Frame[]>(DEFAULT_FRAMES);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [draftCaption, setDraftCaption] = useState("");
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const menuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Frame[];
        if (Array.isArray(parsed) && parsed.length) setFrames(parsed);
      }
    } catch {}
  }, []);

  const save = (next: Frame[]) => {
    setFrames(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (menuOpen === null) return;
      const el = menuRefs.current[menuOpen];
      if (el && !el.contains(e.target as Node)) setMenuOpen(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  const onUpload = async (i: number, file?: File | null) => {
    if (!file) return;
    const dataUrl = await readImage(file);
    const next = [...frames];
    next[i] = { ...next[i], image: dataUrl };
    save(next);
  };

  const onDeleteImage = (i: number) => {
    const next = [...frames];
    next[i] = { ...next[i], image: undefined };
    save(next);
    setMenuOpen(null);
  };

  const onStartEdit = (i: number) => {
    setEditing(i);
    setDraftCaption(frames[i].caption);
    setMenuOpen(null);
  };

  const onSaveCaption = (i: number) => {
    const next = [...frames];
    next[i] = { ...next[i], caption: draftCaption.trim() || next[i].caption };
    save(next);
    setEditing(null);
  };

  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="font-script text-2xl text-primary">a future, in polaroids</p>
          <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
            The Photo Album We Haven't Taken Yet
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-muted-foreground">
            empty frames, waiting. the captions already know. upload a photo when we
            live it — one ordinary tuesday at a time.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {frames.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: (i % 6) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.04, rotate: 0, y: -6 }}
              className={`group relative mx-auto w-full max-w-xs ${f.tape}`}
            >
              <div className="absolute -top-3 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rotate-[-4deg] bg-yellow-200/70 shadow-sm" />

              {/* 3-dots menu */}
              <div
                ref={(el) => {
                  menuRefs.current[i] = el;
                }}
                className="absolute right-2 top-2 z-20"
              >
                <button
                  type="button"
                  aria-label="frame options"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(menuOpen === i ? null : i);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white shadow-md backdrop-blur transition-transform hover:scale-110 hover:bg-black/80"
                >
                  <span className="text-lg leading-none">⋯</span>
                </button>
                <AnimatePresence>
                  {menuOpen === i && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-9 w-44 overflow-hidden rounded-lg border border-border bg-card shadow-xl"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          fileRefs.current[i]?.click();
                          setMenuOpen(null);
                        }}
                        className="block w-full px-3 py-2 text-left text-sm hover:bg-primary/10"
                      >
                        📷 {f.image ? "Replace photo" : "Upload photo"}
                      </button>
                      <button
                        type="button"
                        onClick={() => onStartEdit(i)}
                        className="block w-full px-3 py-2 text-left text-sm hover:bg-primary/10"
                      >
                        ✏️ Edit caption
                      </button>
                      {f.image && (
                        <button
                          type="button"
                          onClick={() => onDeleteImage(i)}
                          className="block w-full px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10"
                        >
                          🗑️ Delete photo
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <input
                ref={(el) => {
                  fileRefs.current[i] = el;
                }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onUpload(i, e.target.files?.[0])}
              />

              <div className="rounded-sm bg-white p-4 pb-14 shadow-[0_10px_30px_-10px_oklch(0.4_0.05_350/40%)] transition-shadow group-hover:shadow-[0_20px_50px_-12px_oklch(0.55_0.2_350/45%)]">
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted via-secondary/40 to-muted">
                  {f.image ? (
                    <img src={f.image} alt={f.caption} className="h-full w-full object-cover" />
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => fileRefs.current[i]?.click()}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-foreground/30 transition-colors hover:text-primary"
                      >
                        <span className="text-3xl">+</span>
                        <span className="font-script text-2xl">soon</span>
                        <span className="text-[10px] uppercase tracking-widest">tap to upload</span>
                      </button>
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,oklch(0.95_0.05_350/40%),transparent_60%)]" />
                    </>
                  )}
                </div>
                {editing === i ? (
                  <div className="mt-3 flex flex-col gap-2">
                    <textarea
                      value={draftCaption}
                      onChange={(e) => setDraftCaption(e.target.value)}
                      rows={2}
                      className="w-full resize-none rounded border border-border bg-background p-2 text-center font-script text-base text-foreground"
                    />
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSaveCaption(i)}
                        className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground hover:bg-primary/90"
                      >
                        save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(null)}
                        className="rounded-full border border-border px-3 py-1 text-xs hover:bg-muted"
                      >
                        cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 text-center font-script text-lg leading-tight text-foreground/80">
                    {f.caption}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-14 text-center font-script text-xl text-primary/80">
          we'll fill them in. one click at a time. one life at a time.
        </p>
      </div>
    </section>
  );
}