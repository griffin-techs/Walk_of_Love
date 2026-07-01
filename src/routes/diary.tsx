import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ClientOnly } from "@/components/ClientOnly";


type Mood = "Loved" | "Happy" | "Calm" | "Grateful" | "Missing You";

type DiaryComment = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
};

type DiaryEntry = {
  id: string;
  entryDate: string;
  title: string;
  body: string;
  moods: Mood[];
  tags: string[];
  comments: DiaryComment[];
  createdAt: string;
};

const STORAGE_KEY = "daily-love-diary-v1";
const moodOptions: Mood[] = ["Loved", "Happy", "Calm", "Grateful", "Missing You"];

const seedEntries: DiaryEntry[] = [
  {
    id: crypto.randomUUID(),
    entryDate: "2026-06-10",
    title: "Tiny win today",
    body: "We laughed over nothing and it made the whole day lighter.",
    moods: ["Happy", "Loved"],
    tags: ["laughter", "daily"],
    comments: [
      {
        id: crypto.randomUUID(),
        author: "Partner",
        body: "This was my favorite part of today too.",
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    entryDate: "2026-06-09",
    title: "Late night check-in",
    body: "You asked if I ate. I said yes. You still sent snacks.",
    moods: ["Loved", "Grateful"],
    tags: ["care", "night"],
    comments: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    entryDate: "2026-06-08",
    title: "Soft morning call",
    body: "No big plan, just hearing your voice while making breakfast.",
    moods: ["Calm", "Loved"],
    tags: ["routine", "morning"],
    comments: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    entryDate: "2026-06-05",
    title: "Planning our next trip",
    body: "We opened ten tabs and still ended up choosing the first beach.",
    moods: ["Happy", "Grateful"],
    tags: ["travel", "planning"],
    comments: [
      {
        id: crypto.randomUUID(),
        author: "You",
        body: "I vote window seat this time.",
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    entryDate: "2026-05-29",
    title: "I missed you today",
    body: "Long day. Kept checking my phone for your messages.",
    moods: ["Missing You", "Loved"],
    tags: ["distance", "feelings"],
    comments: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    entryDate: "2026-05-21",
    title: "Proud of us",
    body: "Even when we disagree, we still choose patience and softness.",
    moods: ["Grateful", "Calm"],
    tags: ["growth", "us"],
    comments: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    entryDate: "2026-04-18",
    title: "Beach day archive",
    body: "Sand everywhere, sun in our eyes, and the happiest photos on my phone.",
    moods: ["Happy", "Loved"],
    tags: ["beach", "trip"],
    comments: [],
    createdAt: new Date().toISOString(),
  },
];

export const Route = createFileRoute("/diary")({
  component: DiaryRoute,
});

function DiaryRoute() {
  return (
    
      <ClientOnly>
        <DiaryPage />
      </ClientOnly>
    
  );
}

function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [pickedMoods, setPickedMoods] = useState<Mood[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setEntries(seedEntries);
        return;
      }
      const parsed = JSON.parse(raw) as DiaryEntry[];
      setEntries(Array.isArray(parsed) && parsed.length > 0 ? parsed : seedEntries);
    } catch {
      setEntries(seedEntries);
    }
  }, []);

  useEffect(() => {
    if (entries.length === 0) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => b.entryDate.localeCompare(a.entryDate)),
    [entries],
  );

  const visibleEntries = useMemo(() => {
    if (view === "day") {
      return sortedEntries.filter((e) => e.entryDate === selectedDate);
    }

    if (view === "week") {
      const target = new Date(`${selectedDate}T00:00:00`);
      const start = new Date(target);
      start.setDate(target.getDate() - target.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return sortedEntries.filter((e) => {
        const d = new Date(`${e.entryDate}T00:00:00`);
        return d >= start && d <= end;
      });
    }

    return sortedEntries.filter((e) => e.entryDate.slice(0, 7) === selectedDate.slice(0, 7));
  }, [selectedDate, sortedEntries, view]);

  const selectedEntry = useMemo(
    () => entries.find((entry) => entry.id === selectedId) ?? null,
    [entries, selectedId],
  );

  const streak = useMemo(() => {
    const uniqueDates = [...new Set(entries.map((e) => e.entryDate))].sort((a, b) =>
      b.localeCompare(a),
    );
    if (uniqueDates.length === 0) {
      return 0;
    }
    let count = 0;
    let cursor = new Date(`${uniqueDates[0]}T00:00:00`);

    for (const d of uniqueDates) {
      const current = new Date(`${d}T00:00:00`);
      if (current.getTime() === cursor.getTime()) {
        count += 1;
        cursor = new Date(cursor);
        cursor.setDate(cursor.getDate() - 1);
      } else if (current.getTime() < cursor.getTime()) {
        break;
      }
    }

    return count;
  }, [entries]);

  const moodCounts = useMemo(() => {
    const counts: Record<Mood, number> = {
      Loved: 0,
      Happy: 0,
      Calm: 0,
      Grateful: 0,
      "Missing You": 0,
    };
    entries.forEach((entry) => {
      entry.moods.forEach((mood) => {
        counts[mood] += 1;
      });
    });
    return counts;
  }, [entries]);

  function toggleMood(mood: Mood) {
    setPickedMoods((prev) =>
      prev.includes(mood) ? prev.filter((item) => item !== mood) : [...prev, mood],
    );
  }

  function createEntry(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleanTitle = title.trim();
    const cleanBody = body.trim();
    if (!cleanTitle || !cleanBody || pickedMoods.length === 0) {
      return;
    }

    const tags = tagInput
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

    const next: DiaryEntry = {
      id: crypto.randomUUID(),
      entryDate,
      title: cleanTitle,
      body: cleanBody,
      moods: pickedMoods,
      tags,
      comments: [],
      createdAt: new Date().toISOString(),
    };

    setEntries((prev) => [next, ...prev]);
    setSelectedId(next.id);
    setTitle("");
    setBody("");
    setPickedMoods([]);
    setTagInput("");
    setSelectedDate(entryDate);
  }

  function addComment(entryId: string) {
    const bodyText = commentInput.trim();
    if (!bodyText) {
      return;
    }

    const nextComment: DiaryComment = {
      id: crypto.randomUUID(),
      author: "You",
      body: bodyText,
      createdAt: new Date().toISOString(),
    };

    setEntries((prev) =>
      prev.map((entry) => {
        if (entry.id !== entryId) {
          return entry;
        }
        return { ...entry, comments: [nextComment, ...entry.comments] };
      }),
    );
    setCommentInput("");
  }

  function loadSampleDiary() {
    setEntries(seedEntries);
    setSelectedId(seedEntries[0]?.id ?? null);
    setSelectedDate(seedEntries[0]?.entryDate ?? new Date().toISOString().slice(0, 10));
    setView("day");
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-amber-50 via-white to-rose-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">Daily Love Diary</h1>
            <p className="mt-1 text-sm text-slate-600 md:text-base">
              Shared daily moments, moods, and notes for your relationship story.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              to="/walk"
              className="rounded-full border border-amber-300 bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-200"
            >
              Walk of Love
            </Link>
          </div>
        </header>

        <section className="mb-6 grid gap-4 rounded-2xl border border-amber-200 bg-white p-5 shadow-sm md:grid-cols-4">
          <div className="rounded-xl bg-amber-50 p-3">
            <p className="text-xs uppercase tracking-wide text-amber-700">Current streak</p>
            <p className="mt-1 text-2xl font-semibold text-amber-900">{streak} days</p>
          </div>
          <div className="rounded-xl bg-rose-50 p-3 md:col-span-3">
            <p className="text-xs uppercase tracking-wide text-rose-700">Mood tracking</p>
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-rose-900">
              {moodOptions.map((mood) => (
                <span key={mood} className="rounded-full border border-rose-200 bg-white px-3 py-1">
                  {mood}: {moodCounts[mood]}
                </span>
              ))}
            </div>
          </div>
          <div className="md:col-span-4">
            <button
              type="button"
              onClick={loadSampleDiary}
              className="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100"
            >
              Load sample diary
            </button>
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Create diary entry</h2>
          <form onSubmit={createEntry} className="grid gap-3 md:grid-cols-2">
            <input
              required
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-400"
            />
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Entry title"
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-400"
            />
            <textarea
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write how today felt"
              rows={4}
              className="md:col-span-2 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-400"
            />
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Tags (comma-separated)"
              className="md:col-span-2 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-400"
            />

            <div className="md:col-span-2">
              <p className="mb-2 text-sm font-medium text-slate-900">Pick mood(s)</p>
              <div className="flex flex-wrap gap-2">
                {moodOptions.map((mood) => {
                  const active = pickedMoods.includes(mood);
                  return (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => toggleMood(mood)}
                      className={`rounded-full border px-3 py-1 text-sm ${
                        active
                          ? "border-amber-500 bg-amber-100 text-amber-900"
                          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {mood}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-black"
              >
                Save Entry
              </button>
            </div>
          </form>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-900">Entries</h2>
              <div className="flex gap-1 rounded-full bg-slate-100 p-1 text-sm">
                {(["day", "week", "month"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setView(mode)}
                    className={`rounded-full px-3 py-1 capitalize ${
                      view === mode ? "bg-white shadow-sm" : "text-slate-600"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mb-4 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-400"
            />

            {visibleEntries.length === 0 ? (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                No entries in this {view} view yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {visibleEntries.map((entry) => (
                  <li key={entry.id}>
                    <button
                      onClick={() => setSelectedId(entry.id)}
                      className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                        selectedId === entry.id
                          ? "border-amber-400 bg-amber-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">{entry.title}</p>
                        <span className="text-xs text-slate-600">{entry.entryDate}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">{entry.body}</p>
                      <p className="mt-2 text-xs text-amber-700">{entry.moods.join(" • ")}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
            {!selectedEntry ? (
              <p className="text-sm text-slate-600">Pick an entry to open detail and comments.</p>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{selectedEntry.title}</h3>
                <p className="mt-1 text-xs text-slate-500">{selectedEntry.entryDate}</p>
                <p className="mt-3 text-sm text-slate-700">{selectedEntry.body}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedEntry.moods.map((mood) => (
                    <span
                      key={mood}
                      className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-800"
                    >
                      {mood}
                    </span>
                  ))}
                </div>

                {selectedEntry.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedEntry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-5">
                  <p className="mb-2 text-sm font-medium text-slate-900">Comments</p>
                  <div className="flex gap-2">
                    <input
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Write a comment"
                      className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={() => addComment(selectedEntry.id)}
                      className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-black"
                    >
                      Send
                    </button>
                  </div>

                  <ul className="mt-3 space-y-2">
                    {selectedEntry.comments.length === 0 ? (
                      <li className="text-xs text-slate-500">No comments yet.</li>
                    ) : (
                      selectedEntry.comments.map((comment) => (
                        <li key={comment.id} className="rounded-xl bg-slate-50 p-3">
                          <p className="text-xs font-medium text-slate-700">{comment.author}</p>
                          <p className="mt-1 text-sm text-slate-700">{comment.body}</p>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}
