import { motion } from "framer-motion";

const SONGS = [
  {
    title: "Sweet Disposition",
    artist: "The Temper Trap",
    note: "this one is for when you're driving at night with the windows half down. i can picture it. i can picture you.",
  },
  {
    title: "Cherry Wine",
    artist: "Hozier",
    note: "what your laugh sounds like in song form. i don't make the rules.",
  },
  {
    title: "Lover",
    artist: "Taylor Swift",
    note: "yes, the obvious one. fight me. it's obvious because it's right.",
  },
  {
    title: "Best Part",
    artist: "Daniel Caesar & H.E.R.",
    note: "play this and tell me you don't feel something. i'll wait.",
  },
  {
    title: "Cigarette Daydreams",
    artist: "Cage The Elephant",
    note: "for the 2am drives. for the talks that go too long. for us, probably.",
  },
  {
    title: "Yellow",
    artist: "Coldplay",
    note: "embarrassingly literal. i don't care.",
  },
  {
    title: "Sunflower, Vol. 6",
    artist: "Harry Styles",
    note: "this is the soundtrack to me thinking about you while pretending to work.",
  },
  {
    title: "Adore You",
    artist: "Miley Cyrus",
    note: "the one i'd put on in the kitchen to make you dance against your will.",
  },
  {
    title: "Until I Found You",
    artist: "Stephen Sanchez",
    note: "play it slow. close your eyes. don't overthink the message.",
  },
];

function spotifyLink(s: { title: string; artist: string }) {
  return `https://open.spotify.com/search/${encodeURIComponent(`${s.title} ${s.artist}`)}`;
}

export function Soundtrack() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="font-script text-2xl text-primary">the soundtrack of us</p>
          <h2 className="mt-2 font-display text-5xl md:text-6xl font-bold text-gradient-hero">
            Songs, with footnotes
          </h2>
          <p className="mt-4 text-muted-foreground">
            Press play. Read the little note. Repeat. (Yes I made this playlist for you.)
          </p>
        </div>

        <div className="mt-16 space-y-5">
          {SONGS.map((s, i) => (
            <motion.a
              key={s.title}
              href={spotifyLink(s)}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: (i % 4) * 0.08 }}
              whileHover={{ y: -4 }}
              className="group flex items-center gap-6 rounded-2xl border border-primary/20 bg-card/60 p-6 backdrop-blur-md transition-colors hover:border-primary/50"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/20 text-2xl transition-transform group-hover:scale-110">
                ▶
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <p className="font-display text-xl font-semibold text-foreground">{s.title}</p>
                  <p className="text-sm text-muted-foreground">— {s.artist}</p>
                </div>
                <p className="mt-2 font-script text-base text-primary/80 md:text-lg">
                  {s.note}
                </p>
              </div>
              <span className="hidden text-xs text-muted-foreground/70 sm:block">open ↗</span>
            </motion.a>
          ))}
        </div>

        <p className="mt-16 text-center font-script text-2xl text-primary/80">
          track 10 is unreleased. it's yours.
        </p>
      </div>
    </section>
  );
}