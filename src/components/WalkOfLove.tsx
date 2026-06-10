import { useEffect, useMemo, useState } from "react";

type ReactionType = "love" | "hug" | "kiss" | "smile" | "laugh";

type Comment = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
};

type WalkMemory = {
  id: string;
  title: string;
  story: string;
  memoryDate: string;
  locationName: string;
  category: string;
  reactions: Record<ReactionType, number>;
  likes: number;
  comments: Comment[];
  createdAt: string;
};

const STORAGE_KEY = "walk-of-love-stars-v2";
const REACTIONS: Array<{ key: ReactionType; label: string }> = [
  { key: "love", label: "Love" },
  { key: "hug", label: "Hug" },
  { key: "kiss", label: "Kiss" },
  { key: "smile", label: "Smile" },
  { key: "laugh", label: "Laugh" },
];

const CATEGORY_OPTIONS = [
  "Firsts",
  "Travel",
  "Anniversary",
  "Everyday Magic",
  "Milestone",
  "Future Dream",
];

const seedMemories: WalkMemory[] = [
  {
    id: crypto.randomUUID(),
    title: "The First Time We Spoke for Hours",
    story:
      "One call turned into a midnight story marathon. That night felt like the beginning of everything.",
    memoryDate: "2025-05-22",
    locationName: "Lagos",
    category: "Firsts",
    reactions: { love: 3, hug: 1, kiss: 0, smile: 2, laugh: 1 },
    likes: 5,
    comments: [
      {
        id: crypto.randomUUID(),
        author: "You",
        body: "Still my favorite call ever.",
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        author: "Partner",
        body: "Mine too, always will be.",
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "Our First Date",
    story:
      "What was supposed to be a short hangout became an entire evening of easy laughter and no awkward silence.",
    memoryDate: "2025-06-03",
    locationName: "Lekki",
    category: "Firsts",
    reactions: { love: 8, hug: 2, kiss: 1, smile: 4, laugh: 3 },
    likes: 9,
    comments: [
      {
        id: crypto.randomUUID(),
        author: "Partner",
        body: "I knew that day was special.",
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "The First Kiss",
    story:
      "Rain outside, nervous smiles, and one brave second that turned into the memory we replay forever.",
    memoryDate: "2025-07-14",
    locationName: "Victoria Island",
    category: "Milestone",
    reactions: { love: 11, hug: 1, kiss: 7, smile: 3, laugh: 1 },
    likes: 12,
    comments: [
      {
        id: crypto.randomUUID(),
        author: "You",
        body: "My heart still skips thinking about it.",
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "Sunday Pancake Ritual",
    story:
      "Burnt the first batch, laughed through the second, and declared Sundays our official soft morning.",
    memoryDate: "2025-09-01",
    locationName: "Home",
    category: "Everyday Magic",
    reactions: { love: 4, hug: 3, kiss: 0, smile: 6, laugh: 5 },
    likes: 7,
    comments: [
      {
        id: crypto.randomUUID(),
        author: "You",
        body: "We still owe the kitchen an apology.",
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "Our First Vacation Plan",
    story: "We spent hours comparing beaches and pretending we were already there.",
    memoryDate: "2026-02-11",
    locationName: "Zanzibar (planned)",
    category: "Travel",
    reactions: { love: 2, hug: 0, kiss: 1, smile: 3, laugh: 1 },
    likes: 3,
    comments: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "First Trip Together",
    story:
      "Three days by the ocean, too many photos, and that one sunset where everything felt quiet and right.",
    memoryDate: "2026-04-18",
    locationName: "Badagry",
    category: "Travel",
    reactions: { love: 9, hug: 4, kiss: 2, smile: 6, laugh: 2 },
    likes: 11,
    comments: [
      {
        id: crypto.randomUUID(),
        author: "Partner",
        body: "Can we time travel back to this day?",
        createdAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        author: "You",
        body: "Every single day with you feels like vacation.",
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "One Year Anniversary",
    story:
      "We re-read old chats, recreated our first date outfit, and promised to keep choosing each other loudly.",
    memoryDate: "2026-06-03",
    locationName: "The Rooftop Table",
    category: "Anniversary",
    reactions: { love: 14, hug: 3, kiss: 3, smile: 5, laugh: 2 },
    likes: 15,
    comments: [
      {
        id: crypto.randomUUID(),
        author: "You",
        body: "One year down, forever to go.",
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "Our Tiny Business Idea",
    story:
      "Notebook out, wild ideas everywhere, and the first time we said we can actually build something together.",
    memoryDate: "2026-08-09",
    locationName: "Cafe Corner Booth",
    category: "Future Dream",
    reactions: { love: 5, hug: 2, kiss: 0, smile: 4, laugh: 2 },
    likes: 6,
    comments: [
      {
        id: crypto.randomUUID(),
        author: "You",
        body: "Version one will be chaotic and perfect.",
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "Future Wedding Moodboard Night",
    story:
      "We picked colors, songs, and way too many flowers. The plan changed five times and still felt exciting.",
    memoryDate: "2026-11-22",
    locationName: "Living Room Floor",
    category: "Future Dream",
    reactions: { love: 7, hug: 1, kiss: 2, smile: 5, laugh: 4 },
    likes: 10,
    comments: [
      {
        id: crypto.randomUUID(),
        author: "Partner",
        body: "I can't wait to marry you.",
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "Late Night Conversation",
    story:
      "3 AM thoughts, your hand in mine, and suddenly everything made sense without needing explanations.",
    memoryDate: "2025-10-14",
    locationName: "Our Balcony",
    category: "Everyday Magic",
    reactions: { love: 6, hug: 2, kiss: 1, smile: 3, laugh: 0 },
    likes: 8,
    comments: [
      {
        id: crypto.randomUUID(),
        author: "You",
        body: "Those are my favorite kind of talks with you.",
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "You Surprised Me at Work",
    story: "Showed up with my favorite snacks and flowers, and suddenly the whole day got brighter.",
    memoryDate: "2026-05-20",
    locationName: "Office Lobby",
    category: "Everyday Magic",
    reactions: { love: 10, hug: 3, kiss: 2, smile: 7, laugh: 2 },
    likes: 9,
    comments: [
      {
        id: crypto.randomUUID(),
        author: "Partner",
        body: "You should have seen your face though 😆",
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "The Playlist Exchange",
    story:
      "We made playlists for each other—no theme, just songs that reminded us of the other person.",
    memoryDate: "2025-12-10",
    locationName: "Spotify",
    category: "Firsts",
    reactions: { love: 8, hug: 1, kiss: 0, smile: 4, laugh: 3 },
    likes: 6,
    comments: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "Matching Tattoos Conversation",
    story: "We talked about forever marks. Maybe not yet, but we both said yes to the idea.",
    memoryDate: "2026-01-08",
    locationName: "Tattoo Shop Consultation",
    category: "Future Dream",
    reactions: { love: 9, hug: 2, kiss: 1, smile: 5, laugh: 1 },
    likes: 8,
    comments: [
      {
        id: crypto.randomUUID(),
        author: "You",
        body: "Still thinking about what we'd get.",
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "When You Held Me Through It",
    story:
      "Bad day turned into a better memory because you knew exactly what I needed without asking.",
    memoryDate: "2025-08-17",
    locationName: "Home",
    category: "Milestone",
    reactions: { love: 13, hug: 5, kiss: 1, smile: 3, laugh: 0 },
    likes: 11,
    comments: [
      {
        id: crypto.randomUUID(),
        author: "Partner",
        body: "Always here for you, in every moment.",
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "The Sunrise We Almost Missed",
    story:
      "Set an alarm for 4:45 AM, both looked dead inside, but then the sky painted itself gold and it was worth it.",
    memoryDate: "2026-02-28",
    locationName: "Beach Outlook",
    category: "Travel",
    reactions: { love: 7, hug: 1, kiss: 2, smile: 5, laugh: 4 },
    likes: 9,
    comments: [
      {
        id: crypto.randomUUID(),
        author: "You",
        body: "Best 4:45 AM ever.",
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "First Meeting the Family",
    story:
      "Your siblings interrogated me, your mom cooked for three hours, and somehow I belong now.",
    memoryDate: "2025-11-30",
    locationName: "Family Home",
    category: "Milestone",
    reactions: { love: 8, hug: 4, kiss: 0, smile: 6, laugh: 5 },
    likes: 7,
    comments: [
      {
        id: crypto.randomUUID(),
        author: "Partner",
        body: "My family loves you almost as much as I do.",
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "The Selfie Wall",
    story:
      "Started a photo tradition. Every place we go, we mark it with a selfie in that exact spot.",
    memoryDate: "2026-03-05",
    locationName: "Room Wall",
    category: "Everyday Magic",
    reactions: { love: 5, hug: 1, kiss: 0, smile: 6, laugh: 3 },
    likes: 7,
    comments: [],
    createdAt: new Date().toISOString(),
  },
];

export function WalkOfLove() {
  const [items, setItems] = useState<WalkMemory[]>([]);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [memoryDate, setMemoryDate] = useState("");
  const [locationName, setLocationName] = useState("");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);

  const [commentBody, setCommentBody] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setItems(seedMemories);
        return;
      }
      const parsed = JSON.parse(raw) as WalkMemory[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setItems(parsed);
      } else {
        setItems(seedMemories);
      }
    } catch {
      setItems(seedMemories);
    }
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...items]
      .filter((item) => {
        if (categoryFilter !== "all" && item.category !== categoryFilter) {
          return false;
        }
        if (!q) {
          return true;
        }
        return (
          item.title.toLowerCase().includes(q) ||
          item.story.toLowerCase().includes(q) ||
          item.locationName.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.memoryDate.localeCompare(b.memoryDate));
  }, [categoryFilter, items, query]);

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );

  function resetForm() {
    setTitle("");
    setStory("");
    setMemoryDate("");
    setLocationName("");
    setCategory(CATEGORY_OPTIONS[0]);
  }

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleanTitle = title.trim();
    const cleanStory = story.trim();
    const cleanDate = memoryDate.trim();
    const cleanLocation = locationName.trim();

    if (!cleanTitle || !cleanStory || !cleanDate) {
      return;
    }

    const next: WalkMemory = {
      id: crypto.randomUUID(),
      title: cleanTitle,
      story: cleanStory,
      memoryDate: cleanDate,
      locationName: cleanLocation,
      category,
      reactions: { love: 0, hug: 0, kiss: 0, smile: 0, laugh: 0 },
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    };

    setItems((prev) => [...prev, next]);
    setSelectedId(next.id);
    resetForm();
  }

  function bumpReaction(memoryId: string, reaction: ReactionType) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== memoryId) {
          return item;
        }
        return {
          ...item,
          reactions: {
            ...item.reactions,
            [reaction]: item.reactions[reaction] + 1,
          },
        };
      }),
    );
  }

  function addComment(memoryId: string) {
    const body = commentBody.trim();
    if (!body) {
      return;
    }
    const comment: Comment = {
      id: crypto.randomUUID(),
      author: "You",
      body,
      createdAt: new Date().toISOString(),
    };

    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== memoryId) {
          return item;
        }
        return {
          ...item,
          comments: [comment, ...item.comments],
        };
      }),
    );
    setCommentBody("");
  }

  function likeMemory(memoryId: string) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== memoryId) {
          return item;
        }
        return { ...item, likes: item.likes + 1 };
      }),
    );
  }

  function loadSampleJourney() {
    setItems(seedMemories);
    setSelectedId(seedMemories[0]?.id ?? null);
    setQuery("");
    setCategoryFilter("all");
  }

  return (
    <div className="w-full bg-gradient-sunset px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">Walk of Love</h2>
        <p className="mt-1 text-sm text-slate-600 md:text-base">
          A star path of your most important moments, all in one place.
        </p>

        <section className="mb-8 mt-6 grid gap-4 rounded-2xl border border-rose-200 bg-white/90 p-5 shadow-sm md:grid-cols-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, story, location"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-rose-400"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-rose-400"
          >
            <option value="all">All categories</option>
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <div className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {filtered.length} stars on your path
          </div>
          <div className="md:col-span-3">
            <button
              type="button"
              onClick={loadSampleJourney}
              className="rounded-full border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100"
            >
              Load sample journey
            </button>
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-rose-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Create a New Star Memory</h3>
          <form onSubmit={handleCreate} className="grid gap-3 md:grid-cols-2">
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-rose-400"
            />
            <input
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Location (optional)"
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-rose-400"
            />
            <input
              required
              type="date"
              value={memoryDate}
              onChange={(e) => setMemoryDate(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-rose-400"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-rose-400"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <textarea
              required
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Tell the story behind this memory"
              rows={4}
              className="md:col-span-2 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-rose-400"
            />
            <div className="md:col-span-2">
              <button
                type="submit"
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-black"
              >
                Add Star
              </button>
            </div>
          </form>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Star Path Timeline</h3>
            {filtered.length === 0 ? (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                No star matches this filter. Create a new memory to continue the path.
              </p>
            ) : (
              <ul className="space-y-3">
                {filtered.map((item) => {
                  const selectedStyle = selectedId === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setSelectedId(item.id)}
                        className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                          selectedStyle
                            ? "border-rose-400 bg-rose-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-900">Star {item.title}</p>
                          <span className="text-xs text-slate-600">{item.memoryDate}</span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{item.story}</p>
                        <p className="mt-2 text-xs text-rose-700">{item.category}</p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <aside className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm">
            {!selected ? (
              <p className="text-sm text-slate-600">Select a star to open memory details.</p>
            ) : (
              <div>
                <h4 className="text-lg font-semibold text-slate-900">{selected.title}</h4>
                <p className="mt-1 text-xs text-slate-500">
                  {selected.memoryDate}
                  {selected.locationName ? ` • ${selected.locationName}` : ""}
                </p>
                <p className="mt-3 text-sm text-slate-700">{selected.story}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {REACTIONS.map((reaction) => (
                    <button
                      key={reaction.key}
                      onClick={() => bumpReaction(selected.id, reaction.key)}
                      className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      {reaction.label} {selected.reactions[reaction.key]}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => likeMemory(selected.id)}
                    className="flex-1 rounded-full border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                  >
                    ❤️ Like ({selected.likes})
                  </button>
                </div>

                <div className="mt-5">
                  <p className="mb-2 text-sm font-medium text-slate-900">Comments</p>
                  <div className="flex gap-2">
                    <input
                      value={commentBody}
                      onChange={(e) => setCommentBody(e.target.value)}
                      placeholder="Write a comment"
                      className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-rose-400"
                    />
                    <button
                      onClick={() => addComment(selected.id)}
                      className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-black"
                    >
                      Send
                    </button>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {selected.comments.length === 0 ? (
                      <li className="text-xs text-slate-500">No comments yet.</li>
                    ) : (
                      selected.comments.map((comment) => (
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
    </div>
  );
}
