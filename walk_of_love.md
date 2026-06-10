# Walk of Love - Complete Product Architecture & Implementation Planning

**Document Status**: Comprehensive Architecture Planning (No Code Implementation Yet)  
**Date**: June 9, 2026  
**Platform**: React 19 + TanStack Router + Supabase + Cloudflare Workers + Tailwind CSS  
**Scope**: 12 Major Features for Relationship Memory Platform

---

## EXECUTIVE SUMMARY

The "Walk of Love" platform will evolve from a romantic gesture website into a comprehensive relationship memory and history platform. This document provides architecture, UX flows, database design, storage strategy, and an implementation roadmap for 12 interconnected features.

**Core Philosophy:**
- Private platform for two people only
- Emotional design prioritizes meaning over metrics
- Memories are the primary entity (not posts, not users)
- Search and discovery feel magical, not algorithmic
- Long-term preservation (decades of memories)
- Beautiful visualizations of relationship journey

---

## PART 1: CURRENT ARCHITECTURE ANALYSIS

### Existing Tech Stack
- **Frontend**: React 19, TypeScript, TailwindCSS 4, Framer Motion
- **Routing**: TanStack Router (file-based)
- **State**: TanStack React Query
- **Backend**: Cloudflare Workers + Supabase
- **Auth**: Supabase Auth (middleware-based)
- **UI**: shadcn/ui + Radix UI + custom components
- **Storage**: Supabase (DB), Supabase Storage (files), localStorage (client)
- **Visualization**: Recharts
- **Utilities**: date-fns, Zod, React Hook Form

### Existing Pattern Recognition
1. **Component Structure**: Atomic design with UI primitives in `/ui/`
2. **Routing**: TanStack Router with automatic route generation
3. **Data Flow**: React Query for server state, form validation with Zod
4. **Styling**: Tailwind with custom gradients and animations
5. **Animation**: Framer Motion for entrance/interaction effects
6. **Error Handling**: Centralized error capture and custom error pages

### Integration Points to Leverage
- Supabase Auth middleware for role-based access
- Cloudflare Workers for API endpoints (perfect for serverless functions)
- Supabase PostgreSQL for relational queries (perfect for timeline/filtering)
- Supabase Storage for media files (photos, videos, voice notes)
- TanStack Router for nested/modal routes

---

## PART 2: DATABASE SCHEMA DESIGN

### Core Entities

#### 1. **Users** (Minimal - 2 person relationship)
```
users
├── id (UUID, Primary Key)
├── email (String, Unique)
├── display_name (String)
├── avatar_url (String, Optional)
├── relationship_role (String: 'creator' | 'partner')
├── joined_date (Timestamp)
├── preferences (JSONB: theme, notifications, privacy)
└── metadata (JSONB: bio, pronouns, favorite_color)
```

#### 2. **Relationship** (Singleton - only 2 people)
```
relationships
├── id (UUID, Primary Key)
├── user_1_id (FK → users)
├── user_2_id (FK → users)
├── started_date (Date) -- "when you met"
├── official_date (Date) -- "anniversary date"
├── status (String: 'dating' | 'engaged' | 'married')
├── created_at (Timestamp)
└── metadata (JSONB: relationship_name, shared_playlist_id, etc)
```

#### 3. **Memories** (Core entity - the heart of the platform)
```
memories
├── id (UUID, Primary Key)
├── relationship_id (FK → relationships)
├── created_by_user_id (FK → users)
├── title (String)
├── description (Text)
├── memory_date (Date) -- when the memory happened
├── memory_type (String: 'walk_of_love' | 'diary_entry' | 'photo' | 'voice_note' | 'letter' | 'travel')
├── mood (String: Optional, for diary entries)
├── location_id (FK → locations, Optional)
├── featured_photo_url (String, Optional)
├── created_at (Timestamp)
├── updated_at (Timestamp)
├── is_featured (Boolean)
├── is_pinned (Boolean)
├── categories (Array[String])
├── tags (Array[String])
├── stars (Integer: 1-5 rating, Optional)
├── visibility (String: 'public_couple' | 'creator_only' | 'archived')
└── metadata (JSONB: custom_fields)
```

#### 4. **Memory Media** (Photos, Videos, Voice Notes)
```
memory_media
├── id (UUID, Primary Key)
├── memory_id (FK → memories)
├── relationship_id (FK → relationships)
├── file_url (String)
├── file_type (String: 'photo' | 'video' | 'voice_note' | 'document')
├── file_size (Integer, in bytes)
├── duration (Integer, Optional - for video/voice)
├── uploaded_by_user_id (FK → users)
├── caption (Text, Optional)
├── taken_date (Timestamp, Optional)
├── is_featured (Boolean)
├── storage_path (String) -- Supabase Storage path
├── created_at (Timestamp)
├── metadata (JSONB: exif_data, video_thumbnail, voice_transcription)
└── ai_tags (Array[String], Optional) -- future AI categorization
```

#### 5. **Locations** (Travel & Places)
```
locations
├── id (UUID, Primary Key)
├── relationship_id (FK → relationships)
├── name (String)
├── city (String)
├── country (String)
├── latitude (Float)
├── longitude (Float)
├── first_visited_date (Date)
├── visit_count (Integer)
├── photos_count (Integer)
├── is_favorite (Boolean)
├── created_at (Timestamp)
└── metadata (JSONB: address, place_id, description)
```

#### 6. **Diary Entries** (Structured Journaling)
```
diary_entries
├── id (UUID, Primary Key)
├── relationship_id (FK → relationships)
├── created_by_user_id (FK → users)
├── entry_date (Date)
├── content (Text)
├── mood (String)
├── mood_emoji (String)
├── weather (String, Optional)
├── location_id (FK → locations, Optional)
├── tags (Array[String])
├── photos (Array[UUID] - FK → memory_media)
├── voice_notes (Array[UUID] - FK → memory_media)
├── created_at (Timestamp)
├── updated_at (Timestamp)
├── is_featured (Boolean)
├── comment_count (Integer, Denormalized)
└── metadata (JSONB: prompt_responses, custom_fields)
```

#### 7. **Timeline Events** (Relationship Milestones)
```
timeline_events
├── id (UUID, Primary Key)
├── relationship_id (FK → relationships)
├── event_date (Date)
├── title (String)
├── description (Text)
├── event_type (String: 'milestone' | 'achievement' | 'anniversary' | 'travel' | 'memory')
├── category (String)
├── featured_photo_url (String, Optional)
├── memory_id (FK → memories, Optional)
├── created_at (Timestamp)
├── is_pinned (Boolean)
└── metadata (JSONB: custom_icon, importance_level)
```

#### 8. **Bucket List Items** (Goals & Dreams)
```
bucket_list_items
├── id (UUID, Primary Key)
├── relationship_id (FK → relationships)
├── created_by_user_id (FK → users)
├── title (String)
├── description (Text)
├── category (String: 'travel' | 'home' | 'wedding' | 'business' | 'learning' | 'personal')
├── priority (Integer: 1-5)
├── status (String: 'dream' | 'in_progress' | 'completed')
├── target_date (Date, Optional)
├── completion_date (Date, Optional)
├── progress_percentage (Integer: 0-100)
├── photos (Array[UUID])
├── notes (Text, Optional)
├── created_at (Timestamp)
├── updated_at (Timestamp)
├── completed_at (Timestamp, Optional)
└── metadata (JSONB: cost_estimate, milestones)
```

#### 9. **Love Wall Posts** (Social Feed)
```
love_wall_posts
├── id (UUID, Primary Key)
├── relationship_id (FK → relationships)
├── created_by_user_id (FK → users)
├── content (Text)
├── media (Array[UUID] - FK → memory_media)
├── created_at (Timestamp)
├── updated_at (Timestamp)
├── is_pinned (Boolean)
├── view_count (Integer)
├── love_count (Integer)
├── saved_to_memory (Boolean)
├── saved_memory_id (FK → memories, Optional)
└── metadata (JSONB: gif_url, mentions, location)
```

#### 10. **Love Wall Reactions** (Micro-interactions)
```
love_wall_reactions
├── id (UUID, Primary Key)
├── post_id (FK → love_wall_posts)
├── user_id (FK → users)
├── reaction_type (String: 'love' | 'hug' | 'kiss' | 'smile' | 'laugh')
├── created_at (Timestamp)
└── reaction_emoji (String)
```

#### 11. **Love Wall Comments** (Discussions)
```
love_wall_comments
├── id (UUID, Primary Key)
├── post_id (FK → love_wall_posts)
├── created_by_user_id (FK → users)
├── content (Text)
├── media (Array[UUID], Optional)
├── created_at (Timestamp)
├── updated_at (Timestamp)
├── love_count (Integer)
├── reply_to_comment_id (FK → love_wall_comments, Optional)
└── metadata (JSONB: mentions)
```

#### 12. **Dream Board** (Pinterest-style)
```
dream_board_items
├── id (UUID, Primary Key)
├── relationship_id (FK → relationships)
├── created_by_user_id (FK → users)
├── title (String)
├── description (Text)
├── category (String: 'home' | 'wedding' | 'travel' | 'business' | 'family' | 'personal')
├── image_url (String)
├── source_url (String, Optional - if from web)
├── board_id (FK → dream_boards)
├── votes (Integer)
├── created_at (Timestamp)
└── metadata (JSONB: price_range, timeline, notes)
```

#### 13. **Dream Boards** (Collections)
```
dream_boards
├── id (UUID, Primary Key)
├── relationship_id (FK → relationships)
├── title (String)
├── description (Text)
├── category (String)
├── cover_image_url (String, Optional)
├── item_count (Integer)
├── created_at (Timestamp)
└── metadata (JSONB: color_theme, mood)
```

#### 14. **Secret Love Notes** (Timed Messages)
```
secret_love_notes
├── id (UUID, Primary Key)
├── relationship_id (FK → relationships)
├── sent_by_user_id (FK → users)
├── content (Text)
├── note_type (String: 'disappear_after_read' | 'self_destruct' | 'scheduled' | 'surprise')
├── created_at (Timestamp)
├── scheduled_unlock_date (Date, Optional)
├── self_destruct_hours (Integer, Optional)
├── is_read (Boolean)
├── read_at (Timestamp, Optional)
├── metadata (JSONB: custom_animation, secret_theme)
└── encryption_key (String, Optional) -- for future security
```

#### 15. **Anniversary Archive** (Yearly Compilations)
```
anniversary_archives
├── id (UUID, Primary Key)
├── relationship_id (FK → relationships)
├── year_number (Integer: 1, 2, 3, etc)
├── anniversary_date (Date)
├── auto_compiled_highlights (Array[UUID] - FK → memories)
├── top_photos (Array[UUID])
├── video_montage_url (String, Optional)
├── theme_color (String)
├── created_at (Timestamp)
├── metadata (JSONB: goals_achieved, lessons_learned, quotes, stats)
└── is_published (Boolean)
```

#### 16. **Search Index** (For AI-ready architecture)
```
memory_search_index
├── id (UUID, Primary Key)
├── relationship_id (FK → relationships)
├── memory_id (FK → memories)
├── indexed_content (Text) -- concatenated searchable content
├── embeddings (Vector, dimension 1536) -- for semantic search
├── indexed_tags (Array[String])
├── indexed_locations (Array[String])
├── indexed_dates (Array[Date])
├── indexed_people (Array[String])
├── content_type (String)
├── last_indexed (Timestamp)
└── metadata (JSONB)
```

#### 17. **Activity Stream** (For notifications & recap)
```
activity_stream
├── id (UUID, Primary Key)
├── relationship_id (FK → relationships)
├── actor_user_id (FK → users)
├── action_type (String: 'created_memory' | 'added_photo' | 'commented' | 'reacted' | 'achieved_goal')
├── entity_type (String: 'memory' | 'post' | 'diary' | 'bucket_list')
├── entity_id (UUID)
├── created_at (Timestamp)
├── is_read (Boolean)
└── metadata (JSONB: summary, icon)
```

### Database Relationships Diagram
```
relationships (center hub)
├── users (2x connection)
├── memories (1:many)
│   ├── memory_media (1:many)
│   ├── love_wall_reactions (indirect)
│   └── anniversary_archives (many:many)
├── diary_entries (1:many)
├── timeline_events (1:many)
├── bucket_list_items (1:many)
├── love_wall_posts (1:many)
│   ├── love_wall_comments (1:many)
│   └── love_wall_reactions (1:many)
├── locations (1:many)
├── dream_boards (1:many)
│   └── dream_board_items (1:many)
├── secret_love_notes (1:many)
├── anniversary_archives (1:many)
├── memory_search_index (1:many)
└── activity_stream (1:many)
```

---

## PART 3: STORAGE STRATEGY

### Supabase Storage Buckets
```
/walk-of-love/
├── /memories/
│   ├── /{relationship_id}/
│   │   ├── /photos/
│   │   │   ├── {memory_id}-{timestamp}.jpg
│   │   │   └── {memory_id}-{timestamp}.webp (thumbnail)
│   │   ├── /videos/
│   │   │   ├── {memory_id}.mp4
│   │   │   └── {memory_id}-thumbnail.jpg
│   │   └── /voice_notes/
│   │       └── {memory_id}-{user_id}.m4a
├── /diary/
│   ├── /{relationship_id}/
│   │   └── /attachments/
│   │       └── {entry_id}-{timestamp}.{ext}
├── /dream_board/
│   ├── /{relationship_id}/
│   │   └── {item_id}.jpg
├── /anniversary_videos/
│   └── /{relationship_id}/
│       └── {year_number}-montage.mp4
└── /avatars/
    └── {user_id}.{jpg|png}
```

### Storage Tiers
- **Hot Storage**: Current year memories, recent photos (optimized for access)
- **Warm Storage**: Previous years, archived items (accessed monthly)
- **Cold Storage**: Backup/archive (accessible but not optimized)
- **Thumbnail Cache**: Optimized WebP thumbnails (90% faster load)

### CDN & Optimization
- Cloudflare CDN for media delivery
- WebP conversion for photos (30% smaller)
- Video streaming with adaptive bitrate
- Voice note compression (60% reduction)
- Progressive image loading

---

## PART 4: DETAILED FEATURE ARCHITECTURE

---

### FEATURE 1: WALK OF LOVE

#### 1. Purpose
The flagship feature transforms relationship memories into a visual "Walk of Fame" journey. Every major memory becomes a star on an infinite digital pathway, creating a magical representation of the couple's relationship timeline.

#### 2. User Experience Flow

**Creating a Memory**:
1. User clicks "Add to Walk of Love" from main navigation
2. Modal opens with quick-add form:
   - Title (e.g., "First Kiss at the Pier")
   - Date (defaults to today, can be changed)
   - Memory Type (dropdown: first_meeting, first_date, first_kiss, etc)
   - Story (rich text editor with emoji support)
   - Upload Photo (up to 5 photos)
   - Location (optional autocomplete)
3. Preview shows how star will appear with animation
4. On save: Star appears in the pathway with celebration animation
5. Partners receive notification with reaction options

**Viewing the Walk**:
1. User navigates to "Walk of Love" page
2. Vertical infinite scroll timeline appears
3. Stars are positioned chronologically along a magical pathway
4. Each star has unique design based on memory_type:
   - Heart for romance moments
   - Airplane for travel
   - House for home moments
   - Ring for engagement/wedding
   - Custom emoji based on category
5. Hover/tap: Star glows, shows brief preview (title + date + emoji)
6. Click: Opens memory detail page in modal or full page

**Memory Detail Page**:
1. Full-screen immersive view
2. Large featured photo with soft animations
3. Memory title, date, location, type
4. Story text with rich formatting
5. Photo gallery (carousel with animations)
6. Comments section below
7. Reactions bar (Love ❤️, Kiss 💋, Hug 🤗, Laugh 😂, Wow 🤩)
8. Quick actions (edit, archive, delete)

#### 3. Page Layout

```
DESKTOP:
┌─────────────────────────────────────────────┐
│         WALK OF LOVE - Our Journey          │
├─────────────────────────────────────────────┤
│                                             │
│   [Side Info]      [Infinite Stars Path]    │
│   - Total Stars    ★ ✨ ★ ✨ ★ ✨ ★        │
│   - First Memory   ╱   ╱  ╱   ╱   ╱        │
│   - Latest Memory  ★ ✨ ★ ✨ ★ ✨ ★        │
│   - Categories    ╱   ╱  ╱   ╱   ╱        │
│   - Filter by     ★ ✨ ★ ✨ ★ ✨ ★        │
│                                             │
│                                             │
└─────────────────────────────────────────────┘

MEMORY DETAIL (Modal):
┌──────────────────────────────┐
│ ← Close                       │
├──────────────────────────────┤
│ [Large Featured Image]       │
│                              │
│ Title: "First Kiss at Pier" │
│ Date: March 14, 2025        │
│ Location: Santa Monica Pier  │
│                              │
│ Story text here...          │
│                              │
│ [Photo Gallery - Carousel]   │
│                              │
│ [Comments Section]           │
│ [Reactions Bar]              │
└──────────────────────────────┘

MOBILE:
┌──────────────────┐
│ WALK OF LOVE     │
├──────────────────┤
│   ★ ✨ ★        │
│     ╱             │
│   ★ ✨ ★        │
│     ╱             │
│   ★ ✨ ★        │
│     ╱             │
│   ★ ✨ ★        │
│                  │
│ [Load More ∞]    │
└──────────────────┘
```

#### 4. UI Components Needed

**New Components**:
- `WalkOfLoveTimeline` - Main infinite scroll container
- `MemoryStarIcon` - Animated star with glow effect
- `MemoryStarPreview` - Tooltip/popover on hover
- `MemoryDetailModal` - Full memory display
- `MemoryCarousel` - Photo gallery with Embla
- `MemoryCommentSection` - Comments + replies
- `MemoryReactionBar` - 5 reaction types with animations
- `MemorySearchBar` - Search & filter stars
- `MemoryQuickAdd` - Modal for creating new memory
- `MemoryCategoryFilter` - Sidebar filter chips
- `PathMagic` - SVG path generator for visual journey

**Existing Components Leveraged**:
- `Card` - Memory detail wrapper
- `Button` - Actions
- `Avatar` - User reactions
- `Dialog` - Memory detail modal
- `ScrollArea` - Timeline container
- `Badge` - Category/type labels

#### 5. Database Design Suggestions

**Primary Tables**:
- `memories` - Core memory data
- `memory_media` - Photos/videos attached
- `memory_reactions` - Love, Kiss, Hug, etc (new table)
- `memory_comments` - Discussion thread

**Denormalized Fields** (for performance):
- `memories.featured_photo_url` - Quick access
- `memories.comment_count` - Don't count every time
- `memories.reaction_count` - Cache total

**Indexes**:
```sql
CREATE INDEX idx_memories_relationship_date ON memories(relationship_id, memory_date DESC);
CREATE INDEX idx_memories_type ON memories(relationship_id, memory_type);
CREATE INDEX idx_memories_category ON memories USING GIN(categories);
CREATE INDEX idx_memory_reactions_post ON memory_reactions(memory_id);
```

#### 6. Cloud Storage Requirements

**Per Memory**:
- 1 featured photo: 2-3 MB
- Up to 5 additional photos: 10-15 MB
- Optional video: 50-200 MB
- Thumbnails: 50-100 KB each

**Example Couple with 100 Memories**:
- 100 featured photos: 200-300 MB
- 500 additional photos: 2.5-7.5 GB
- 20 videos: 1-4 GB
- Thumbnails: 50-100 MB
- **Total: ~5-12 GB** (highly variable)

**Storage Structure**:
```
memories/{relationship_id}/{memory_id}/
├── featured.webp (optimized)
├── featured-thumb.webp (250x250)
├── photos/
│   ├── 1.jpg (original)
│   ├── 1.webp (optimized)
│   ├── 1-thumb.webp
│   └── ...
└── video/
    ├── video.mp4
    └── video-thumb.jpg
```

#### 7. Search & Filtering Requirements

**Search Types**:
1. **Full-text**: Search memories by title, story, location name
2. **Date Range**: "Memories from 2024", "Our first year"
3. **Category**: "All kisses", "All vacations"
4. **Location**: "All Paris memories"
5. **Sentiment**: "Most loved" (by reaction count)
6. **Temporal**: "This month last year"

**Search Implementation**:
- Postgres full-text search (`.search()` in Supabase)
- Category filtering with GIN indexes
- Date range queries (optimized with indexes)
- Location autocomplete with `locations` table

**Future AI Search**:
- "Tell me about our first date"
- "Show me sunset memories"
- "When did we visit the beach?"

#### 8. Mobile Experience

**Mobile-First Design**:
- Full-screen vertical timeline (natural scroll)
- Large touch targets for stars
- Swipe to navigate memories (left/right)
- Tap star to open detail modal
- Bottom sheet for quick-add form
- Gesture: Double-tap star to love
- Infinite scroll (load 20, then 20 more)
- Status bar shows "Year 3 of 4" as context

**Performance**:
- Lazy load photos (intersection observer)
- Virtual scroll for timeline (render only visible)
- Image optimization (WebP, srcset)
- Compress videos for mobile (adaptive streaming)

#### 9. Desktop Experience

**Desktop Enhancement**:
- Side-by-side layout: sidebar filters + main timeline
- Hover previews on stars
- Smooth animations on interactions
- Large featured photos in detail view
- Keyboard shortcuts: ← → to navigate, ESC to close
- Drag-and-drop reordering (future feature)
- Print memory as keepsake

#### 10. Future AI Enhancements

1. **AI Memory Moments**:
   - "Your 3 most loved memories"
   - "Best photo moments"
   - Yearly highlight reels

2. **Smart Categorization**:
   - Auto-detect if photo is kiss, hug, romantic moment
   - Location auto-tagging
   - People recognition (just the two of them)

3. **Memory Similarity**:
   - "Memories similar to this"
   - "Similar locations"
   - "Same season as this memory"

4. **Generative Insights**:
   - "Create a poem about this memory"
   - "Write a caption for this photo"
   - "What would you say about this moment?"

#### 11. Emotional Design Considerations

**Design Principles**:
- **Timelessness**: The pathway feels eternal, not trendy
- **Magic**: Particles, glow, soft animations create wonder
- **Intimacy**: Only two people see this journey (no algorithmic feed)
- **Celebration**: Each new memory is a celebration (confetti effect)
- **Reflection**: Scrolling through creates moment of pause & gratitude
- **Nostalgia**: Soft colors, warm typography (serif fonts for stories)
- **Growth**: Visual representation shows relationship progression

**Micro-interactions**:
- Star glow on hover
- Smooth scale animation when opening memory
- Celebration confetti on star creation
- Subtle heart pulse on reactions
- Typewriter effect for story text (nostalgic)

**Visual Direction**:
- Color: Gradient from couple's favorite colors
- Path: Hand-drawn SVG path (not perfect, has character)
- Typography: Mix of elegant serif (memories) + warm sans-serif (UI)
- Spacing: Generous whitespace (breathing room)
- Darkness: Soft dark theme (reduces eye strain for nighttime reflection)

#### 12. Suggested Route Structure

```
/walk-of-love
├── /walk-of-love (list view - infinite timeline)
│   └── ?category=travel&year=2024 (query params for filtering)
├── /walk-of-love/:memoryId (detail page - full view)
│   └── ?modal=true (opens as modal over timeline)
├── /walk-of-love/new (create new memory)
├── /walk-of-love/search (search results page)
└── /walk-of-love/statistics (view stats about memories)

Route Tree:
__root.tsx
├── walk-of-love/ (layout with sidebar)
│   ├── index.tsx (timeline)
│   ├── new.tsx (create)
│   ├── search.tsx (search results)
│   ├── statistics.tsx (stats dashboard)
│   ├── $memoryId.tsx (detail)
│   └── $memoryId.edit.tsx (edit)
```

#### 13. Suggested API Endpoints

**Memory Management**:
```
GET    /api/memories
       ?relationship_id, ?limit, ?offset, ?sort=date_desc
       Returns: paginated memories with previews

GET    /api/memories/:memoryId
       Returns: full memory with all media

POST   /api/memories
       Body: { title, story, date, memory_type, photos[], location }
       Returns: created memory with star preview

PATCH  /api/memories/:memoryId
       Body: { title, story, date, memory_type, categories }
       Returns: updated memory

DELETE /api/memories/:memoryId
       Returns: success status

GET    /api/memories/search
       ?q=query, ?category, ?dateRange, ?location
       Returns: search results

GET    /api/memories/categories
       Returns: all categories with counts

GET    /api/memories/statistics
       Returns: total count, breakdown by type, date range
```

**Reactions & Comments**:
```
POST   /api/memories/:memoryId/reactions
       Body: { reaction_type: 'love'|'kiss'|'hug'|'laugh'|'wow' }
       Returns: reaction created

DELETE /api/memories/:memoryId/reactions
       Returns: reaction removed

GET    /api/memories/:memoryId/comments
       Returns: paginated comments with replies

POST   /api/memories/:memoryId/comments
       Body: { content, reply_to_comment_id? }
       Returns: created comment

PATCH  /api/memories/:memoryId/comments/:commentId
       Body: { content }
       Returns: updated comment
```

#### 14. Notification Opportunities

1. **Memory Creation**: "They added a memory: First Kiss at Pier"
2. **Comment**: "They commented on First Kiss memory"
3. **Reaction**: "They loved your memory!"
4. **Milestone**: "You've reached 50 memories! 🎉"
5. **Anniversary**: "Anniversary of your first meeting coming up!"
6. **Digest**: "You have 3 new memories this week"
7. **Engagement**: "Check out memories from this date last year"

#### 15. Privacy Considerations

- **No Public URLs**: Memories are never publicly accessible
- **Encryption**: Optional encryption for sensitive memories
- **Access Control**: Only the relationship members access data
- **Deletion**: When relationship ends, optional data deletion
- **Backups**: Regular encrypted backups (couple can export)
- **Audit Trail**: Log who viewed/edited what (optional, for transparency)

---

### FEATURE 2: DAILY LOVE DIARY

#### 1. Purpose
A shared daily journal where both partners can reflect, share emotions, and document the everyday moments that make up their relationship. Unlike memories (which are event-based), diary entries capture the texture of daily life.

#### 2. User Experience Flow

**Creating Diary Entry**:
1. User navigates to "Diary" tab in main nav
2. Today's entry appears first (if started, shows draft)
3. User clicks "Write Today's Note" or date picker for past date
4. Diary entry editor opens:
   - Rich text content area (with formatting toolbar)
   - Mood selector (7 emojis: 😢😔😐😊😄😍🤩)
   - Weather selector (sunny, cloudy, rainy, snowy, etc)
   - Location picker (optional)
   - Photo attachment (up to 5)
   - Voice note recorder
   - Tags (free-form input)
5. Auto-save every 30 seconds (local + cloud)
6. User publishes entry
7. Partner receives notification
8. Entry appears in shared timeline

**Viewing Diary**:
1. User navigates to "Diary" section
2. Calendar view shows current month with dots on days with entries
3. View toggles: Daily | Weekly | Monthly
4. Click date: Expanded view showing entry
5. See partner's entry for same date below
6. Can comment on partner's entry
7. Can react with emoji

**Stream View**:
- Chronological feed of all entries (most recent first)
- Side-by-side view showing both partners' entries for same date
- Week view: Shows 7 days side-by-side
- Month view: Calendar grid with entry indicators

#### 3. Page Layout

```
DESKTOP - Month View:
┌────────────────────────────────────────────┐
│ Diary / Month View (June 2026)             │
├────────────────────────────────────────────┤
│ [←] June 2026 [→] [Today] [Week] [Stream] │
├────────────────────────────────────────────┤
│ Su  Mo  Tu  We  Th  Fr  Sa                 │
│ 1   2   3   4   5   6   7                  │
│ 8  9●  10  11  12  13  14●                │
│ 15 16  17  18●  19  20  21                │
│ 22 23  24  25  26●  27  28                │
│ 29 30                                      │
├────────────────────────────────────────────┤
│ June 9 (2 entries today)                  │
│ ┌─────────────────────────────────────┐   │
│ │ Jack's Entry  😊                    │   │
│ │ "Had coffee with you. Simple."     │   │
│ │ 8:30 AM - Coffee Shop              │   │
│ │ ❤️ 1 💬 She replied                │   │
│ └─────────────────────────────────────┘   │
│ ┌─────────────────────────────────────┐   │
│ │ Sheila's Entry  😍                  │   │
│ │ "Coffee with my favorite person"   │   │
│ │ 8:45 AM - Coffee Shop              │   │
│ │ ❤️ 2 💬 He loved it                │   │
│ └─────────────────────────────────────┘   │
└────────────────────────────────────────────┘

DESKTOP - Writing View:
┌────────────────────────────────────────────┐
│ ← Back | Save Draft | Publish             │
├────────────────────────────────────────────┤
│ Writing for: June 9, 2026                 │
├────────────────────────────────────────────┤
│ [Rich Text Editor]                         │
│ "Today was..."                             │
│                                            │
│                                            │
│ ┌──────────────────────────────────────┐  │
│ │ Mood: [😔] [😊] [😍] [🤩]          │  │
│ │ Weather: [☀️] [⛅] [🌧️]           │  │
│ │ Location: [Lake Tahoe               ]│  │
│ │ Tags: [travel] [adventure]          │  │
│ │ Photos: [+Add Photos] (0/5)         │  │
│ │ Voice: [🎤 Record Note]             │  │
│ └──────────────────────────────────────┘  │
│                                            │
│ [Save Draft] [Publish]                    │
└────────────────────────────────────────────┘

MOBILE - Today View:
┌──────────────────────┐
│ DIARY - Today        │
│ June 9, 2026         │
├──────────────────────┤
│ [Calendar icon] [+]  │
├──────────────────────┤
│ YOUR ENTRY           │
│ ┌──────────────────┐ │
│ │ 😊               │ │
│ │ [Write...]       │ │
│ └──────────────────┘ │
├──────────────────────┤
│ THEIR ENTRY          │
│ ┌──────────────────┐ │
│ │ 😍               │ │
│ │ "Had coffee with" │ │
│ │ "my favorite..."  │ │
│ │                  │ │
│ │ ❤️ [💬 reply]   │ │
│ └──────────────────┘ │
└──────────────────────┘
```

#### 4. UI Components Needed

**New Components**:
- `DiaryCalendar` - Month/week calendar with dots
- `DiaryEditor` - Rich text editor with mood/weather
- `DiaryEntry` - Single entry display
- `DiaryComparison` - Side-by-side view of both entries
- `DiaryStreakCounter` - Days written in a row
- `MoodSelector` - 7 emoji moods
- `WeatherSelector` - Weather conditions
- `VoiceNoteRecorder` - Audio recording UI
- `DiaryStream` - Chronological feed
- `DiaryStats` - Mood trends, entry counts

**Existing Components**:
- `RichTextEditor` - For content (build custom or use library)
- `Card` - Entry wrapper
- `Button` - Actions
- `Badge` - Tags
- `Avatar` - User indicators

#### 5. Database Design Suggestions

**Primary Table**:
```sql
diary_entries (see Part 2 - complete schema provided)

-- Additional supporting table for mood tracking:
CREATE TABLE mood_entries (
  id UUID PRIMARY KEY,
  diary_entry_id FK → diary_entries,
  mood_type STRING,
  timestamp TIMESTAMP,
  created_at TIMESTAMP
);
```

**Denormalized Fields**:
- `diary_entries.comment_count` - Cache count
- `diary_entries.reaction_count` - Cache count

**Indexes**:
```sql
CREATE INDEX idx_diary_relationship_date ON diary_entries(relationship_id, entry_date DESC);
CREATE INDEX idx_diary_user ON diary_entries(created_by_user_id, entry_date DESC);
CREATE INDEX idx_diary_mood ON diary_entries(relationship_id, mood);
```

#### 6. Cloud Storage Requirements

**Per Entry**:
- Text content: 1-50 KB (compressed)
- 5 photos: 5-15 MB
- 1 voice note: 2-5 MB
- Total per entry: ~10-20 MB (if media-rich)

**Example Couple Writing 2x Daily for 1 Year**:
- 730 entries × 5-10 MB average = 3.6-7.3 GB

**Storage Path**:
```
diary/{relationship_id}/{year}/{month}/
├── {entry_id}/
│   ├── content.json
│   ├── photos/
│   │   ├── 1.jpg
│   │   └── 1-thumb.webp
│   └── voice/
│       └── note.m4a
```

#### 7. Search & Filtering Requirements

**Search Options**:
1. **Full-text**: Search entry content
2. **Date Range**: "Entries from December", "Last week's entries"
3. **Mood**: "Show all 😍 entries", "Sad entries"
4. **Weather**: "Rainy day reflections"
5. **Location**: "Beach entries"
6. **Tags**: Filter by #vacation, #anniversary
7. **Sentiment**: "Most commented" (engagement)
8. **Streaks**: "How many days in a row did we both write?"

**Implementation**:
- Postgres full-text search on content
- Mood/weather filtering with equality
- Date range queries
- Tag filtering with ARRAY operators

#### 8. Mobile Experience

- Vertical scroll through month calendar
- Large touch targets for dates
- Swipe between months
- Tap to write or expand entry
- Mood quick-select (7 large emoji buttons)
- Voice note recording with waveform animation
- Photo quick-snap from camera
- Dark mode optimized (easier for night writing)
- Offline support (draft saves locally, syncs when online)

#### 9. Desktop Experience

- Calendar grid on left, expanded day on right
- Week view shows 7 entries side-by-side
- Stream view like social feed
- Rich text editor with full formatting toolbar
- Drag-and-drop photo upload
- Real-time partner presence indicator ("They're writing now...")

#### 10. Future AI Enhancements

1. **Mood Insights**:
   - Chart mood over time
   - "You were happiest in July"
   - "Mood patterns (e.g., happier on weekends)"

2. **Content Analysis**:
   - "Extract all travel mentions"
   - "Sentiment analysis"
   - "Most mentioned person/place/activity"

3. **Prompts**:
   - Daily writing prompts ("What made you laugh today?")
   - AI-generated reflective questions
   - "Year in review" summaries

4. **Summaries**:
   - "Summary of this week"
   - "Your favorite entries from 2024"
   - "Best moments when viewed together"

#### 11. Emotional Design Considerations

**Design Principles**:
- **Intimacy**: Private space, no one else sees this
- **Gentleness**: Soft colors, no pressure
- **Continuity**: Calendar shows all entries at a glance
- **Reflection**: Encourage slow, thoughtful writing
- **Connection**: See partner's entry for same day
- **Growth**: Streaks and consistency celebrate commitment

**Micro-interactions**:
- Mood emoji scales up when selected
- Entry saves with subtle checkmark
- Camera shutter animation on photo upload
- Waveform animation during voice recording
- Mood indicator pulses gently

**Visual Direction**:
- Soft color palette per mood (sad = cool blues, happy = warm yellows)
- Handwritten-style fonts for entries
- Warm paper texture background
- Subtle calendar animations
- Date numbers are large and inviting

#### 12. Suggested Route Structure

```
/diary
├── /diary (calendar month view)
│   └── ?date=2026-06-09 (show specific date)
├── /diary/today (redirect to today)
├── /diary/write (or /diary/:date/write)
├── /diary/stream (chronological feed)
├── /diary/:year/:month/calendar (specific month)
├── /diary/moods (mood analytics)
├── /diary/streaks (streak tracking)
└── /diary/search?q=... (search results)
```

#### 13. Suggested API Endpoints

```
GET    /api/diary
       ?relationship_id, ?year, ?month
       Returns: all entries for relationship in month

GET    /api/diary/:entryId
       Returns: full entry with all attachments

POST   /api/diary
       Body: { entry_date, content, mood, weather, location_id, photos[], tags[] }
       Returns: created entry

PATCH  /api/diary/:entryId
       Body: { content, mood, weather, tags[] }
       Returns: updated entry

DELETE /api/diary/:entryId
       Returns: success

GET    /api/diary/search
       ?q, ?mood, ?weather, ?dateRange, ?tags
       Returns: matching entries

GET    /api/diary/stats
       ?relationship_id, ?timeframe=month|year
       Returns: entry counts, mood distribution, streak count

GET    /api/diary/streaks
       Returns: current streak, longest streak, total days written

POST   /api/diary/:entryId/comments
       Body: { content }
       Returns: comment

GET    /api/diary/:entryId/comments
       Returns: all comments on entry
```

#### 14. Notification Opportunities

1. **Entry Posted**: "They published a diary entry"
2. **Comment**: "They commented on your entry: 'Love this moment'"
3. **Streak Milestone**: "30 days in a row! 🔥"
4. **Weekly Digest**: "You wrote 7 entries this week"
5. **Mood Alert**: "You've been sad for 3 days"
6. **Prompt**: "Have you written today? 🤍"
7. **Anniversary**: "One year ago you wrote: '[snippet]'"

#### 15. Privacy Considerations

- Diary entries are **never** shared publicly
- Optional private sections (one person only sees)
- Encryption for sensitive emotional content
- Export diary as PDF for backup
- Deletion options (archive vs permanent)

---

### FEATURE 3: LOVE TIMELINE

#### 1. Purpose
A visual, chronological representation of the entire relationship history. Every memory, milestone, diary entry, achievement, and moment is plotted on a living timeline. Users can zoom in/out through years, months, weeks to see their relationship from different perspectives.

#### 2. User Experience Flow

**Viewing Timeline**:
1. User navigates to "Timeline" from main nav
2. Vertical infinite scroll timeline appears, starting with "relationship started"
3. Timeline shows all events chronologically:
   - Relationship milestones ("We Met" - auto-created)
   - Walk of Love memories
   - Diary entry highlights
   - Bucket list completions
   - Anniversary dates
   - Travel trips
4. User can zoom: Year View → Month View → Week View
5. Each event is clickable and expands to show full detail
6. Filter options: By type (memories, diary, milestones), by category, by person

**Zoom Interactions**:
- Year View: Shows 12-15 major events per year
- Month View: Shows events with dates
- Week View: Shows day-by-day breakdown

**Search & Filter**:
- "Show all trips"
- "Show all times we visited Paris"
- "Show all anniversaries"
- "Timeline for 2024"

#### 3. Page Layout

```
DESKTOP:
┌──────────────────────────────────────────┐
│ TIMELINE - Our Story                     │
│ [Zoom Controls: Year | Month | Week | Day]│
│ [Filter: All | Memories | Diary | Travel]│
├──────────────────────────────────────────┤
│                                          │
│ 2025                                     │
│ • Relationship Started (June 1)          │
│ • First Date (June 15)                   │
│ • First Kiss (July 4)                    │
│ • First Vacation (August)                │
│                                          │
│ 2026 (4 months of relationship)          │
│ • Anniversary (June 1)                   │
│ • Mountain Trip (June 8-15)              │
│ • Got a puppy (June 20)                  │
│ • Proposal (TBD)                         │
│                                          │
│ [Load more ∞]                            │
│                                          │
└──────────────────────────────────────────┘

MONTH VIEW Detail:
┌──────────────────────────────────────────┐
│ June 2026                                │
├──────────────────────────────────────────┤
│ 1 (Mon) ★ First Anniversary             │
│         💒 Our 1st year together!        │
│                                          │
│ 8 (Mon) 🏔 Mountain Trip Started        │
│         ✈️ Heading to Tahoe             │
│                                          │
│ 9 (Tue) 📖 [9 diary entries today]      │
│                                          │
│ 15 (Mon) 🏔 Mountain Trip Ended         │
│          🎉 Best vacation ever           │
│                                          │
│ 20 (Sat) 🐕 New Puppy!                  │
│          Meet Biscuit 🤍                │
│                                          │
└──────────────────────────────────────────┘

MOBILE:
┌─────────────────────┐
│ TIMELINE            │
│ [Zoom: Y M W D]     │
├─────────────────────┤
│ 2025                │
│ • We Met (Jun 1)   │
│ • First Date (15)  │
│ • First Kiss (Jul)  │
│                     │
│ 2026                │
│ • Anniversary (Jun) │
│ • Trip (Jun 8-15)  │
│ • Puppy! (Jun 20)  │
│                     │
│ [Load more ∞]       │
└─────────────────────┘
```

#### 4. UI Components Needed

**New Components**:
- `TimelineContainer` - Main infinite scroll with zoom
- `TimelineEvent` - Single event (clickable, expandable)
- `TimelineZoomControls` - Year/Month/Week/Day selector
- `TimelineFilter` - Filter by type
- `TimelineEventDetail` - Expanded view of event
- `TimelineYearMarker` - Year divider
- `TimelineConnector` - SVG line connecting events
- `TimelineSearch` - Search specific events

**Existing Components**:
- `ScrollArea` - Timeline container
- `Badge` - Event type labels
- `Card` - Event card
- `Dialog` - Event detail modal

#### 5. Database Design Suggestions

**Primary Data Source**:
The timeline aggregates from multiple tables:
- `timeline_events` (explicit milestones)
- `memories` (Walk of Love stars)
- `diary_entries` (important entries marked as featured)
- `bucket_list_items` (completions)
- `relationships.anniversary` (auto-event)

**View/Query**:
```sql
CREATE VIEW timeline_aggregated AS
SELECT 
  'timeline_event' as source_type,
  id,
  event_date as date,
  title,
  event_type,
  featured_photo_url,
  memory_id,
  created_at
FROM timeline_events
WHERE relationship_id = $1

UNION ALL

SELECT 
  'memory' as source_type,
  id,
  memory_date as date,
  title,
  memory_type as event_type,
  featured_photo_url,
  NULL,
  created_at
FROM memories
WHERE relationship_id = $1 AND is_featured = true

UNION ALL

SELECT 
  'diary_entry' as source_type,
  id,
  entry_date as date,
  'Diary Entry' as title,
  'diary' as event_type,
  NULL,
  NULL,
  created_at
FROM diary_entries
WHERE relationship_id = $1 AND is_featured = true

UNION ALL

SELECT 
  'bucket_list' as source_type,
  id,
  completion_date as date,
  title,
  'goal' as event_type,
  NULL,
  NULL,
  created_at
FROM bucket_list_items
WHERE relationship_id = $1 AND status = 'completed'

ORDER BY date ASC;
```

**Indexes**:
```sql
CREATE INDEX idx_timeline_events_date ON timeline_events(relationship_id, event_date);
CREATE INDEX idx_memories_featured_date ON memories(relationship_id, memory_date) 
  WHERE is_featured = true;
```

#### 6. Cloud Storage Requirements

**No new storage needed** - reuses existing memory media and photos

#### 7. Search & Filtering Requirements

**Timeline Search**:
1. **Date range**: "Timeline from June 2024 to June 2026"
2. **Event type**: "Show all travel", "Show all dates"
3. **Location**: "All Paris events"
4. **Full-text**: "Find when we got the puppy"
5. **Keyword**: "Anniversary", "Trip", "Memory"

**Implementation**:
- Filter existing aggregated view
- Use date range indexes
- Full-text search on titles/descriptions

#### 8. Mobile Experience

- Compact timeline with date labels
- Tap to expand event
- Swipe up/down through timeline
- Pinch to zoom level
- Single column layout
- Scrollable month view with days

#### 9. Desktop Experience

- Year/Month/Week toggle at top
- Large event cards with full details
- Hover to show preview
- Click to expand full memory/diary
- Smooth animations between zoom levels
- Print timeline as poster

#### 10. Future AI Enhancements

1. **Auto-generated Milestones**:
   - "This week last year..." cards
   - "One year since you met"
   - "100 days together"

2. **Timeline Insights**:
   - "Most active month"
   - "Most traveled year"
   - "Timeline of growth"

3. **Narrative**:
   - Generate story: "Your first month together"
   - "Best memories from 2024"
   - "Most meaningful moments"

#### 11. Emotional Design Considerations

**Design Principles**:
- **Perspective**: Zooming in/out shows relationship from different scales
- **Flow**: Reading top-to-bottom shows relationship progression
- **Connection**: Visual lines connect events
- **Celebration**: Milestones are prominently marked
- **Continuity**: Every moment is captured
- **Legacy**: Creates a "history book" feeling

**Micro-interactions**:
- Zoom level transitions are smooth
- Events slide in from left/right based on direction
- Hover reveals more detail
- Milestone markers glow
- Year dividers are substantial (hard to miss)

**Visual Direction**:
- Central timeline with events on alternating sides
- Year markers in large, elegant typography
- Event cards have subtle shadows
- Icons change based on event type
- Color coding by category

#### 12. Suggested Route Structure

```
/timeline
├── /timeline (default: year view)
│   └── ?view=year|month|week|day
│   └── ?filter=memories|diary|travel|all
│   └── ?search=query
├── /timeline/:year (specific year)
├── /timeline/:year/:month (specific month)
└── /timeline/search?q=... (search results)
```

#### 13. Suggested API Endpoints

```
GET    /api/timeline
       ?relationship_id, ?view=year|month|week, ?year, ?month
       Returns: aggregated timeline events

GET    /api/timeline/events
       ?relationship_id, ?startDate, ?endDate
       Returns: events in date range

GET    /api/timeline/search
       ?q, ?type, ?dateRange
       Returns: matching timeline events

GET    /api/timeline/milestones
       Returns: major milestones (anniversaries, met, engaged, married)
```

#### 14. Notification Opportunities

1. **Anniversary Reminder**: "1 year ago today, you met!"
2. **Milestone Reached**: "You've been together 1000 days!"
3. **Seasonal Reminder**: "Remember when we visited here?"
4. **Year Review**: "Your 2024 in 5 moments"

#### 15. Privacy Considerations

- Timeline only visible to couple
- Optional hiding of specific events
- No public timeline URLs

---

### FEATURE 4: MEMORY VAULT

#### 1. Purpose
The permanent archive and organizational hub for all relationship media. A private cloud storage experience specifically designed for couples. Users can organize memories into folders and smart collections, tag everything, search instantly, and preserve media long-term.

#### 2. User Experience Flow

**Uploading Media**:
1. User navigates to "Memory Vault"
2. Clicks "Upload" or drags files
3. Batch upload interface shows:
   - Progress bars per file
   - Option to organize into folder during upload
   - Option to add tags during upload
4. After upload, media appears in "Recent Uploads" or chosen folder
5. Can auto-organize by date (Year/Month folders)

**Browsing Vault**:
1. Default view: Grid of all photos/videos (100+ items)
2. Left sidebar shows:
   - Folders (custom created)
   - Smart Collections (auto-generated)
   - Favorites
   - Recent
   - By Date (Year > Month)
   - By Location
3. Click folder: Shows contents in grid
4. Click photo: Opens in fullscreen lightbox
5. Bottom info panel: Size, date taken, location, tags

**Collections**:
- **Smart Collections** (auto-generated):
  - "All Beach Photos"
  - "All Sunsets"
  - "All Trips" (with trip breakdown)
  - "Recent Favorites"
  - "Videos"
  - "This Month's Photos"

**Search**:
- Full text search on filename, tags, EXIF data
- Filter by type (photo/video/document)
- Filter by date range
- Filter by location

#### 3. Page Layout

```
DESKTOP:
┌──────────────────────────────────────────────────────┐
│ MEMORY VAULT - 7,250 Items                          │
├──────────────────────────────────────────────────────┤
│ [Side Panel]          [Main Content]                 │
│                                                      │
│ Folders               Grid View:                     │
│ • All Photos          [IMG] [IMG] [IMG]             │
│ • Vacations           [IMG] [IMG] [IMG]             │
│ • Home                [IMG] [IMG] [IMG]             │
│ • Everyday                                          │
│                                                      │
│ Smart Collections      [← Prev] [Page 1 of 725]    │
│ • All Beach           [Next →]                       │
│ • All Sunsets                                        │
│ • Recent Favorites                                   │
│ • This Month                                         │
│                                                      │
│ By Date                                              │
│ • 2026 (450)                                         │
│ • 2025 (2,850)                                       │
│ • 2024 (3,950)                                       │
│                                                      │
│ By Location                                          │
│ • Paris (120)                                        │
│ • Lake Tahoe (89)                                    │
│ • Home (450)                                         │
└──────────────────────────────────────────────────────┘

FULLSCREEN VIEW:
┌──────────────────────────────────────────┐
│ ← Back  [Info Panel] [Download] [Delete] │
├──────────────────────────────────────────┤
│                                          │
│          [Large Photo/Video]             │
│                                          │
│                                          │
│ [←] [→] (navigation)                     │
│                                          │
├──────────────────────────────────────────┤
│ Date: June 9, 2026                      │
│ Location: Coffee Shop                    │
│ Tags: #coffee, #morning, #love           │
│ Size: 3.2 MB                             │
│                                          │
│ You + They have this file                │
└──────────────────────────────────────────┘

MOBILE:
┌──────────────────────┐
│ MEMORY VAULT         │
│ [≡ Menu] [🔍 Search] │
├──────────────────────┤
│ [IMG] [IMG] [IMG]    │
│ [IMG] [IMG] [IMG]    │
│ [IMG] [IMG] [IMG]    │
│ [IMG] [+]            │
├──────────────────────┤
│ Menu (swipe):        │
│ • All Photos         │
│ • Vacations          │
│ • Beach Moments      │
│ • Recent             │
│                      │
└──────────────────────┘
```

#### 4. UI Components Needed

**New Components**:
- `VaultGrid` - Masonry grid of photos/videos
- `VaultSidebar` - Folders and collections
- `VaultLightbox` - Fullscreen media viewer
- `VaultUpload` - Upload interface
- `VaultSearch` - Advanced search
- `VaultStats` - Total storage used
- `VaultSmartCollections` - Auto-generated collections
- `FolderTree` - Nested folder navigator
- `VaultContextMenu` - Right-click actions (move, tag, delete)

**Existing Components**:
- `Dialog` - Lightbox
- `ScrollArea` - Grid container
- `Button` - Actions
- `Input` - Search box

#### 5. Database Design Suggestions

**Primary Table**:
```sql
-- memory_media table (already defined in Part 2)

-- Folders (for organization):
CREATE TABLE vault_folders (
  id UUID PRIMARY KEY,
  relationship_id FK → relationships,
  parent_folder_id FK → vault_folders (nullable, for nesting),
  name STRING,
  created_at TIMESTAMP,
  created_by_user_id FK → users
);

-- Smart Collections (saved searches):
CREATE TABLE vault_smart_collections (
  id UUID PRIMARY KEY,
  relationship_id FK → relationships,
  name STRING,
  query_params JSONB, -- stored search filters
  created_at TIMESTAMP
);

-- Vault relationships (media to folders):
CREATE TABLE vault_media_folders (
  id UUID PRIMARY KEY,
  media_id FK → memory_media,
  folder_id FK → vault_folders,
  UNIQUE(media_id, folder_id)
);
```

**Indexes**:
```sql
CREATE INDEX idx_vault_folders_relationship ON vault_folders(relationship_id);
CREATE INDEX idx_memory_media_relationship ON memory_media(relationship_id);
CREATE INDEX idx_memory_media_type ON memory_media(relationship_id, file_type);
CREATE INDEX idx_memory_media_date ON memory_media(relationship_id, taken_date DESC);
```

#### 6. Cloud Storage Requirements

**Per User (in previous sections)**:
- 100 memories × 5 photos each = 500 photos
- Example: 500 photos × 3-5 MB = 1.5-2.5 GB
- Plus videos, documents, etc.
- **Total estimate per couple: 5-15 GB** (can grow to 100+ GB over decades)

**Storage Optimization**:
- Auto-generate WebP thumbnails (90% smaller)
- Store originals in cold storage (less frequent access)
- CDN delivery for hot media (current year)

#### 7. Search & Filtering Requirements

**Search Capabilities**:
1. **Filename**: Search by original filename
2. **Tags**: Filter by any tag
3. **Date**: "Photos from June 2024", "Last week's photos"
4. **Location**: "All Paris photos", "Home photos"
5. **Type**: "Only videos", "Only documents"
6. **Size**: "Large files"
7. **Favorites**: "Show only favorited"
8. **Recent**: "Last 30 days"

**Advanced Search**:
- Multi-filter: "Paris photos from 2024 with tag #anniversary"
- Date ranges: "June 15-30, 2024"
- AI-powered (future): "Show me sunset photos"

**Implementation**:
- Postgres full-text on filenames and tags
- JSONB queries for metadata
- GiST index on date ranges

#### 8. Mobile Experience

- Infinite scroll grid (tap to load more)
- Tap photo to fullscreen
- Pinch to zoom in/out of grid
- Double-tap to favorite
- Bottom sheet: Actions (download, delete, move)
- Swipe between photos in fullscreen
- Long-press for context menu

#### 9. Desktop Experience

- Masonry grid (responsive columns)
- Drag-and-drop to move between folders
- Right-click context menu
- Hover shows quick actions (favorite, download)
- Keyboard shortcuts: Arrow keys navigate, Delete removes
- Batch select and organize multiple files
- Print photo or create album

#### 10. Future AI Enhancements

1. **Auto-tagging**:
   - Detect "beach photo", "sunset", "kiss"
   - Auto-categorize by people/place/activity
   - Identify video highlights (emotional moments)

2. **Smart Collections**:
   - "All kisses"
   - "All sunsets"
   - "Your favorite photos"
   - "Best moments from this location"

3. **Photo Magic**:
   - "Create montage from this folder"
   - "Enhance colors in batch"
   - "Upscale old photos"
   - "Remove unwanted objects"

4. **Memory Suggestions**:
   - "You haven't backed up photos from June"
   - "You have 500 unorganized photos"
   - "Create collection from this trip"

#### 11. Emotional Design Considerations

**Design Principles**:
- **Accessibility**: Finding memories should be effortless
- **Beauty**: Media is the star (minimal UI)
- **Organization**: No anxiety about finding anything
- **Permanence**: Feels like a permanent archive (not ephemeral)
- **Curation**: Can organize and treasure items
- **Nostalgia**: Browsing triggers memory recall

**Micro-interactions**:
- Smooth grid reveal on load
- Hover scales photo slightly
- Grid items fade in smoothly
- Fullscreen transitions are graceful
- Collections flow like galleries

**Visual Direction**:
- Clean white/dark UI to not compete with photos
- Generous spacing around media
- Subtle metadata (date, size) in corners
- Smooth transitions between views
- Dark mode emphasizes photos

#### 12. Suggested Route Structure

```
/vault
├── /vault (all items - grid view)
├── /vault/folders (folder view)
├── /vault/folders/:folderId (specific folder contents)
├── /vault/collections/:collectionId (smart collection)
├── /vault/search?q=... (search results)
├── /vault/by-date/:year/:month (by date organization)
├── /vault/by-location/:locationId (by location)
└── /vault/media/:mediaId (fullscreen view)
```

#### 13. Suggested API Endpoints

```
GET    /api/vault/media
       ?relationship_id, ?folder_id, ?limit, ?offset, ?sort
       Returns: paginated media items

GET    /api/vault/folders
       ?relationship_id
       Returns: folder hierarchy

POST   /api/vault/folders
       Body: { name, parent_folder_id? }
       Returns: created folder

POST   /api/vault/media/:mediaId/move
       Body: { folder_id }
       Returns: media moved

GET    /api/vault/media/search
       ?q, ?type, ?dateRange, ?tags, ?location
       Returns: search results

GET    /api/vault/stats
       Returns: total items, storage used, breakdown by type

POST   /api/vault/media/batch
       Body: { file_urls[], folder_id?, tags[] }
       Returns: batch import result

DELETE /api/vault/media/:mediaId
       Returns: deleted

POST   /api/vault/media/:mediaId/favorite
       Returns: favorited status
```

#### 14. Notification Opportunities

1. **Storage Alert**: "You're using 8 GB of 10 GB"
2. **Backup Reminder**: "Back up your vault monthly"
3. **Organization Suggestion**: "You have 200 unorganized photos"
4. **Duplicate Detection**: "You have duplicate photos"

#### 15. Privacy Considerations

- **End-to-End Encryption** (optional, for highly sensitive content)
- Versioning history (can restore deleted photos)
- Regular backups with encryption
- Export entire vault as encrypted file
- Data ownership (all data belongs to couple, exportable)
- GDPR compliance (right to deletion)

---

### FEATURE 5: LOVE WALL

#### 1. Purpose
A private social network feed for only two people. Like Facebook or Instagram, but intimate and focused. Users share daily moments, photos, and thoughts. Unlike Walk of Love (event-based), Love Wall is ephemeral and casual. Interactions (love, hug, kiss, smile, laugh) replace traditional likes/comments.

#### 2. User Experience Flow

**Creating a Post**:
1. User taps "Create Post" or "What's on your mind?"
2. Compose modal opens with:
   - Text input (multi-line, emoji support)
   - Photo/video upload (up to 5 files)
   - GIF search
   - Emoji keyboard
   - Voice note option
3. Post preview shows how it will look
4. User hits "Share"
5. Post appears at top of feed
6. Partner receives notification

**Viewing Feed**:
1. User navigates to "Love Wall"
2. Chronological feed appears (newest first)
3. Each post shows:
   - Author's avatar + name
   - Timestamp
   - Content (text, photos, video)
   - Reaction bar (5 emoji reactions)
   - Comment button
   - More options (pin, edit, delete, save to memory)
4. Scroll down to load older posts
5. Posts are ordered by recency

**Interactions**:
1. **Reactions**: Instead of "like", users can react with:
   - ❤️ Love (heart)
   - 🤗 Hug
   - 💋 Kiss
   - 😊 Smile
   - 😂 Laugh
2. Tap reaction icon to toggle (only one per user per post)
3. Reaction count shows who reacted ("You & They love this")

**Comments**:
1. Tap comment icon to open comment thread
2. Modal shows:
   - Original post at top
   - All comments below (chronological)
   - Reply-to-comment capability (nested)
   - Input field at bottom
3. Can comment on comments

**Special Features**:
- **Pin**: Pin favorite posts to top
- **Save to Memory**: Automatically moved to Memory Vault with date
- **Edit**: Correct typos (shows "edited" label)
- **Delete**: Remove post

#### 3. Page Layout

```
DESKTOP:
┌────────────────────────────────────────────────┐
│ LOVE WALL - Feed                              │
├────────────────────────────────────────────────┤
│                                                │
│ [New Post Box] "What's on your mind?"         │
│                                                │
│ ────────────────────────────────────────────── │
│ Posts (newest first):                          │
│                                                │
│ Jack • 2 hours ago                            │
│ [Photo: Coffee together]                      │
│ "My favorite person brought me coffee ☕"    │
│ ❤️ 2  🤗 1  💋 0  😊 0  😂 0  [💬]           │
│                                                │
│ Sheila • 4 hours ago                          │
│ [3 photos carousel]                           │
│ "Mountain sunset with you 🏔️ #travel"       │
│ ❤️ 3  🤗 0  💋 1  😊 0  😂 0  [💬]           │
│ [Jack loved this]                             │
│                                                │
│ Jack • 1 day ago                              │
│ "Been thinking about our first date... 💭"   │
│ ❤️ 5  🤗 2  💋 3  😊 0  😂 0  [💬]           │
│ [Show 4 comments]                             │
│                                                │
│ [Load more posts ∞]                           │
│                                                │
└────────────────────────────────────────────────┘

COMMENT MODAL:
┌────────────────────────────────────┐
│ ← Comments                          │
├────────────────────────────────────┤
│ Original Post:                      │
│ [Image] "Mountain sunset..."        │
│ ❤️ 3  🤗 0  💋 1  😊 0  😂 0      │
├────────────────────────────────────┤
│ Comments:                           │
│ Jack: "Absolutely incredible" 💭    │
│ └─ Sheila: "Best day ever!"         │
│    └─ Jack: "Every day with you..." │
│                                    │
│ Sheila: "Can't wait to go back" 🎒 │
│                                    │
│ [Write comment...                   │
│  ●●●●● 🎤 📎]                     │
└────────────────────────────────────┘

MOBILE:
┌──────────────────────┐
│ LOVE WALL            │
├──────────────────────┤
│ [+ What's on your...] │
├──────────────────────┤
│ Jack • 2 hrs ago     │
│ ☕ Coffee! #love     │
│ ❤️❤️ 🤗 💬          │
│                      │
│ Sheila • 4 hrs ago   │
│ [Mountain photo]     │
│ Sunset! 🏔️          │
│ ❤️❤️❤️ 💋 💬       │
│                      │
│ Jack • 1 day ago     │
│ Thinking of you... 💭 │
│ ❤️❤️❤️❤️❤️ 💬    │
│                      │
└──────────────────────┘
```

#### 4. UI Components Needed

**New Components**:
- `LoveWallFeed` - Main feed container
- `LoveWallPost` - Single post display
- `LoveWallCompose` - Create post modal
- `LoveWallReactionBar` - 5 reaction buttons
- `LoveWallCommentThread` - Comments modal
- `LoveWallComment` - Individual comment
- `PostMediaCarousel` - Multi-photo display
- `PostMoreMenu` - Pin, delete, save actions
- `PostEditor` - Edit existing post

**Existing Components**:
- `Card` - Post wrapper
- `Button` - Actions
- `Avatar` - User indicator
- `Dialog` - Modals
- `ScrollArea` - Feed container
- `Popover` - Reaction emoji picker

#### 5. Database Design Suggestions

**Primary Tables**:
```sql
-- love_wall_posts (already defined in Part 2)
-- love_wall_reactions (already defined in Part 2)
-- love_wall_comments (already defined in Part 2)

-- Add table for pinned posts:
CREATE TABLE pinned_posts (
  id UUID PRIMARY KEY,
  post_id FK → love_wall_posts,
  relationship_id FK → relationships,
  pinned_by_user_id FK → users,
  pinned_at TIMESTAMP,
  UNIQUE(relationship_id, post_id)
);
```

**Denormalized Fields** (for performance):
- `love_wall_posts.reaction_count` - Total reactions
- `love_wall_posts.comment_count` - Total comments
- `love_wall_posts.love_count` - Specific reaction counts
- `love_wall_reactions.reaction_emoji` - For quick display

**Indexes**:
```sql
CREATE INDEX idx_posts_relationship_date ON love_wall_posts(relationship_id, created_at DESC);
CREATE INDEX idx_reactions_post ON love_wall_reactions(post_id);
CREATE INDEX idx_comments_post ON love_wall_comments(post_id, created_at);
```

#### 6. Cloud Storage Requirements

**Per Post**:
- Text only: <1 KB
- 5 photos: 5-15 MB
- 1 video: 50-200 MB
- Voice note: 2-5 MB

**Example Couple Posting 1x Daily**:
- 365 posts/year × 1-5 MB average = 365-1825 MB = 0.4-1.8 GB/year
- **10 years = 4-18 GB**

#### 7. Search & Filtering Requirements

**Search Features**:
1. **Text Search**: Search post content
2. **Date Range**: "Posts from June"
3. **Hashtags**: "#travel", "#love"
4. **Mentions**: Find posts mentioning specific person/place
5. **Pinned**: Show only pinned posts
6. **By Reaction**: "Most loved posts"
7. **Media Type**: "Photo posts only"

**Implementation**:
- Full-text search on post content
- Tag filtering with LIKE or arrays
- Date indexing

#### 8. Mobile Experience

- Smooth infinite scroll (snap to posts)
- Large touch targets for reactions
- Swipe between photos in carousel
- Double-tap to love
- Tap to open comments in bottom sheet
- Swipe down to refresh
- Voice record interaction

#### 9. Desktop Experience

- Timeline layout (posts in center column)
- Hover shows additional actions
- Keyboard shortcuts (React: 1-5 keys for reactions)
- Drag to reorder pinned posts
- Print post or create screenshot

#### 10. Future AI Enhancements

1. **Content Moderation**:
   - Detect spam or inappropriate content (unlikely in 2-person app)
   - Flag system for user reporting

2. **Mood Analysis**:
   - Track relationship sentiment over time
   - "Happy period" (lots of loves/hugs)
   - "Need attention" (if activity drops)

3. **Summaries**:
   - "Best moments from this week"
   - "Reaction trends"
   - "Most loved posts"

4. **Suggestions**:
   - "You haven't posted in 3 days"
   - "Celebrate your 500th post!"

#### 11. Emotional Design Considerations

**Design Principles**:
- **Lightness**: Posts feel casual and fun
- **Immediacy**: Sharing should be effortless
- **Joy**: Reactions emphasize positive emotions
- **Memory**: Every post is cherished (not deleted quickly)
- **Playfulness**: Emojis, GIFs, and reactions are playful
- **Intimacy**: Knowing only one other person sees this

**Micro-interactions**:
- Reaction icons grow/shrink with bounce
- Confetti on first reaction to new post
- Animated counter when reaction added
- Smooth scroll snap between posts
- Comment count pulses when new comment

**Visual Direction**:
- Bright, warm colors (not cold social media)
- Large avatars (personalization)
- Generous margins (breathing room)
- Post backgrounds are cards (not flat)
- Timestamps are relative ("2 hours ago")

#### 12. Suggested Route Structure

```
/wall
├── /wall (feed - main view)
├── /wall/new (create post modal)
├── /wall/post/:postId (full post view)
├── /wall/post/:postId/edit (edit post)
├── /wall/search?q=... (search results)
├── /wall/pinned (view all pinned)
└── /wall/reactions (reaction summary)
```

#### 13. Suggested API Endpoints

```
GET    /api/wall/posts
       ?relationship_id, ?limit, ?offset, ?sort=date_desc
       Returns: paginated feed posts

GET    /api/wall/posts/:postId
       Returns: full post with all comments

POST   /api/wall/posts
       Body: { content, media[], voice_note? }
       Returns: created post

PATCH  /api/wall/posts/:postId
       Body: { content }
       Returns: updated post (shows "edited")

DELETE /api/wall/posts/:postId
       Returns: deleted

POST   /api/wall/posts/:postId/reactions
       Body: { reaction_type }
       Returns: reaction added

DELETE /api/wall/posts/:postId/reactions
       Returns: reaction removed

GET    /api/wall/posts/:postId/reactions
       Returns: all reactions on post

POST   /api/wall/posts/:postId/comments
       Body: { content, reply_to_comment_id? }
       Returns: created comment

GET    /api/wall/posts/:postId/comments
       Returns: all comments

PATCH  /api/wall/posts/:postId/pin
       Body: { pinned: true|false }
       Returns: pinned status

POST   /api/wall/posts/:postId/save-to-memory
       Returns: post saved to memory vault
```

#### 14. Notification Opportunities

1. **New Post**: "They posted something new"
2. **Reaction**: "They loved your post"
3. **Comment**: "They replied: '[snippet]'"
4. **Streak**: "You've both posted every day for 7 days! 🔥"
5. **Milestone**: "You've posted together 365 times!"

#### 15. Privacy Considerations

- Posts are **never** public
- No share to other platforms (by default)
- Deletion removes from feed permanently
- Archive option (hide but keep)
- Export post with timestamp

---

### FEATURE 6: COUPLE BUCKET LIST

#### 1. Purpose
Track shared dreams and goals together. A collaborative goal-setting system where both partners can add wishes, track progress, celebrate completions, and archive achievements. Creates a visual record of dreams realized and dreams yet to come.

#### 2. User Experience Flow

**Adding Item**:
1. User navigates to "Bucket List"
2. Clicks "Add Dream" button
3. Modal opens with form:
   - Title (e.g., "Visit Paris")
   - Description
   - Category (travel, home, wedding, business, learning, personal)
   - Priority (1-5 stars)
   - Target date (optional)
   - Reference photo (optional)
4. User hits "Add to List"
5. Item appears in appropriate category

**Viewing List**:
1. Main view shows all items grouped by:
   - Category (Travel | Home | Wedding | etc)
   - Status (Dreams | In Progress | Completed)
2. Each item shows:
   - Title + emoji based on category
   - Progress bar (if in progress)
   - Target date countdown
   - Who added it
   - Heart count (if both love it)
3. Item is clickable

**Item Detail**:
1. Expand item to see:
   - Full description
   - Progress (0-100%)
   - Timeline/milestones
   - Photos attached
   - Notes from both partners
   - Completion date (if done)
   - Comments/reactions

**Actions**:
- **Start**: Mark as "in progress" (adds dates)
- **Update Progress**: Add milestones ("Booked flight", "Saved €5,000")
- **Add Photos**: Attach memories from activity
- **Complete**: Mark as done (archive to completed list)
- **Love It**: Both partners can favorite
- **Discuss**: Comments on each item

#### 3. Page Layout

```
DESKTOP:
┌──────────────────────────────────────────────┐
│ BUCKET LIST - 47 Dreams                      │
├──────────────────────────────────────────────┤
│ [View: By Category | By Status] [+ Add Dream]│
├──────────────────────────────────────────────┤
│                                              │
│ 🌍 TRAVEL (12 dreams)                       │
│ ┌────────────────────────────────────────┐  │
│ │ ✈️ Visit Paris                         │  │
│ │ Priority: ★★★★★ | Target: June 2027  │  │
│ │ Status: In Progress (60% planned)      │  │
│ │ [Progress bar: ████████░░]             │  │
│ │ ❤️ Both love it | 2 notes              │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ ┌────────────────────────────────────────┐  │
│ │ 🏖️ Visit Zanzibar                     │  │
│ │ Priority: ★★★★☆ | Target: Dec 2027   │  │
│ │ Status: Dream                          │  │
│ │ ❤️ She loves it | Save it?             │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ 🏠 HOME (5 dreams)                          │
│ ┌────────────────────────────────────────┐  │
│ │ 🏡 Buy a House                         │  │
│ │ Priority: ★★★★★ | Target: 2028       │  │
│ │ Status: In Progress (25% saved)        │  │
│ │ [Progress bar: ██░░░░░░░░]             │  │
│ │ ❤️ Both love it | 5 notes              │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ 💍 WEDDING (3 dreams)                       │
│ ...                                         │
│                                              │
│ ✅ COMPLETED (28 dreams)                    │
│ ┌────────────────────────────────────────┐  │
│ │ 💑 Move in Together  ✓ Jan 15, 2025   │  │
│ │ 🐕 Get a Dog  ✓ May 20, 2025          │  │
│ │ 🎓 Graduate  ✓ (Both) June 2024       │  │
│ └────────────────────────────────────────┘  │
│                                              │
└──────────────────────────────────────────────┘

ITEM DETAIL MODAL:
┌────────────────────────────────┐
│ ← Back | Edit | Complete       │
├────────────────────────────────┤
│ ✈️ Visit Paris                 │
│ Added by: Jack | May 15, 2025  │
│                                │
│ "Our dream European adventure" │
│                                │
│ Priority: ★★★★★              │
│ Target Date: June 2027         │
│ Status: In Progress            │
│                                │
│ Progress: 60%                  │
│ [████████░░] 3 of 5 steps done │
│                                │
│ Milestones:                    │
│ ✓ Research flights             │
│ ✓ Save budget (€8,000/10,000)  │
│ ✓ Book accommodation           │
│ □ Buy travel insurance         │
│ □ Book flights                 │
│                                │
│ Photos (5):                    │
│ [Eiffel Tower] [Seine]         │
│                                │
│ Notes:                         │
│ Jack: "Want to go in Spring"   │
│ Sheila: "Bring camera!"        │
│                                │
│ ❤️ Jack & Sheila love this     │
│                                │
└────────────────────────────────┘

MOBILE:
┌──────────────────────┐
│ BUCKET LIST          │
│ [By Category | + Add] │
├──────────────────────┤
│ 🌍 TRAVEL (12)       │
│ ┌────────────────────┐
│ │ ✈️ Visit Paris    │
│ │ 60% | June 2027   │
│ │ ❤️❤️ (Both love) │
│ └────────────────────┘
│ ┌────────────────────┐
│ │ 🏖️ Zanzibar      │
│ │ Dream | Dec 2027  │
│ │ ❤️ She loves it   │
│ └────────────────────┘
│                      │
│ 🏠 HOME (5)          │
│ ┌────────────────────┐
│ │ 🏡 Buy a House   │
│ │ 25% | 2028        │
│ │ ❤️❤️ (Both love) │
│ └────────────────────┘
│                      │
└──────────────────────┘
```

#### 4. UI Components Needed

**New Components**:
- `BucketListContainer` - Main list view
- `BucketListItem` - Individual item card
- `BucketListItemDetail` - Expanded detail modal
- `BucketListForm` - Add/edit item
- `ProgressTracker` - Progress bar + milestones
- `MilestoneCheckbox` - Individual milestone
- `CategoryFilter` - Category grouping
- `StatusFilter` - Filter by status (Dreams, In Progress, Completed)
- `BucketListStats` - Dashboard showing completion rates

**Existing Components**:
- `Card` - Item wrapper
- `Button` - Actions
- `Dialog` - Detail modal
- `Badge` - Category/priority labels
- `Progress` - Progress bar (from shadcn)

#### 5. Database Design Suggestions

**Primary Table**:
```sql
-- bucket_list_items (already defined in Part 2)

-- Milestones for tracking progress:
CREATE TABLE bucket_list_milestones (
  id UUID PRIMARY KEY,
  bucket_list_item_id FK → bucket_list_items,
  title STRING,
  description TEXT,
  is_completed BOOLEAN,
  completed_at TIMESTAMP,
  created_at TIMESTAMP
);

-- Notes/comments on items:
CREATE TABLE bucket_list_notes (
  id UUID PRIMARY KEY,
  bucket_list_item_id FK → bucket_list_items,
  created_by_user_id FK → users,
  content TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Media attached to items:
CREATE TABLE bucket_list_media (
  id UUID PRIMARY KEY,
  bucket_list_item_id FK → bucket_list_items,
  media_url STRING,
  uploaded_at TIMESTAMP
);
```

**Indexes**:
```sql
CREATE INDEX idx_bucket_list_relationship ON bucket_list_items(relationship_id);
CREATE INDEX idx_bucket_list_status ON bucket_list_items(relationship_id, status);
CREATE INDEX idx_bucket_list_category ON bucket_list_items(relationship_id, category);
CREATE INDEX idx_bucket_list_date ON bucket_list_items(relationship_id, target_date);
```

#### 6. Cloud Storage Requirements

**Per Item**:
- Text + metadata: <10 KB
- Reference photos: 2-5 MB
- Optional video: 50-200 MB

**Example Couple with 50 Bucket Items**:
- 50 items × 3 photos average = 150 photos = 300-500 MB
- **Total: ~500 MB - 1 GB**

#### 7. Search & Filtering Requirements

**Search/Filter**:
1. **Category**: Travel, Home, Wedding, Business, Learning, Personal
2. **Status**: Dream (0%), In Progress (1-99%), Completed (100%)
3. **Priority**: 1-5 stars
4. **Timeline**: "Target 2026", "Target next 6 months"
5. **Text Search**: Search title and description
6. **Favorites**: Show only items both love
7. **Recently Added**
8. **Near Completion**: Items at 80%+ progress

**Implementation**:
- Simple filters on status, category, priority
- Date range queries
- Full-text search

#### 8. Mobile Experience

- Vertical list with category headers
- Tap to expand item detail
- Swipe actions (mark complete, archive)
- Large touch targets for priority/status
- Progress bars with percentages
- Photo carousel in detail view
- Voice note support for notes

#### 9. Desktop Experience

- Category sidebar for filtering
- Sort options (priority, target date, progress)
- Drag-and-drop reordering
- Bulk actions (mark multiple as complete)
- Calendar view of target dates
- Print bucket list or export

#### 10. Future AI Enhancements

1. **Suggestions**:
   - "Your trip to Paris is ready! Book now?"
   - "You're 3 months away from your house goal"
   - "Similar items you might like"

2. **Analytics**:
   - "Completion rate trends"
   - "Most popular categories"
   - "Average time to complete"

3. **Recommendations**:
   - "Items based on your interests"
   - "Trending dreams for couples"

#### 11. Emotional Design Considerations

**Design Principles**:
- **Aspiration**: Looking at list should inspire, not overwhelm
- **Celebration**: Completing item should feel ceremonial
- **Collaboration**: Both partners contribute equally
- **Progress**: Visual progress bars show momentum
- **Flexibility**: Items can change (no judgment)
- **Memory**: Completed list becomes history

**Micro-interactions**:
- Progress bar animates when updated
- Confetti on item completion
- Checkmark appears satisfying when milestone done
- Category icon scales slightly on interaction
- Completed items fade to show they're archived

**Visual Direction**:
- Category icons are large and colorful
- Priority stars are prominent
- Progress bars are animated
- Target dates show countdown ("121 days away")
- Completed items are visually distinct (faded/checkmarked)

#### 12. Suggested Route Structure

```
/bucket-list
├── /bucket-list (main view - by category)
├── /bucket-list/by-status (organized by status)
├── /bucket-list/completed (show only completed)
├── /bucket-list/new (add new item)
├── /bucket-list/:itemId (detail view)
├── /bucket-list/:itemId/edit (edit item)
└── /bucket-list/search?q=... (search results)
```

#### 13. Suggested API Endpoints

```
GET    /api/bucket-list
       ?relationship_id, ?category, ?status, ?sort
       Returns: filtered bucket list items

GET    /api/bucket-list/:itemId
       Returns: full item with milestones and notes

POST   /api/bucket-list
       Body: { title, description, category, priority, target_date }
       Returns: created item

PATCH  /api/bucket-list/:itemId
       Body: { title, description, status, progress_percentage }
       Returns: updated item

DELETE /api/bucket-list/:itemId
       Returns: deleted

PATCH  /api/bucket-list/:itemId/progress
       Body: { progress_percentage }
       Returns: updated progress

POST   /api/bucket-list/:itemId/milestones
       Body: { title, description }
       Returns: created milestone

PATCH  /api/bucket-list/:itemId/milestones/:milestoneId
       Body: { is_completed }
       Returns: milestone updated

GET    /api/bucket-list/stats
       Returns: completion rates, category breakdown

POST   /api/bucket-list/:itemId/favorite
       Returns: favorite status
```

#### 14. Notification Opportunities

1. **Item Created**: "They added a bucket list item: 'Visit Paris'"
2. **Progress Update**: "They updated progress on 'Buy a House' (25%)"
3. **Milestone**: "You've completed 50% of 'Visit Paris'!"
4. **Completed**: "You completed 'Get a Dog'! 🎉"
5. **Target Date**: "Your trip to Paris is in 1 week!"

#### 15. Privacy Considerations

- Items are private to the couple
- Archived items remain accessible (can revisit old dreams)
- Delete option removes permanently
- Export bucket list as document

---

### FEATURE 7: RELATIONSHIP STATISTICS

#### 1. Purpose
A beautiful, playful dashboard showing quantitative metrics about the relationship. Not corporate analytics, but celebration of shared history through numbers. Designed to spark joy and reflection.

#### 2. User Experience Flow

**Viewing Dashboard**:
1. User navigates to "Statistics" or "Our Story in Numbers"
2. Dashboard loads with scrollable cards showing:
   - Days Together (with milestone badges)
   - Total Photos
   - Total Videos
   - Total Diary Entries
   - Moments Favorited
   - Places Visited
   - Trips Taken
   - Milestones Achieved
   - Bucket List Items (Total | Completed)
   - Most Active Month
   - Mood Breakdown (from diary)
3. Each card is animated on scroll-into-view
4. Tap any card to see breakdown/details

**Interactive Explorations**:
1. **Timeline Chart**: Days together over time (with goal markers)
2. **Monthly Heatmap**: Activity level per month (heat map visualization)
3. **Category Breakdown**: Photos by location, memories by type
4. **Mood Chart**: Mood trends over time (from diary)
5. **Yearly Comparison**: 2024 vs 2025 vs 2026 stats

#### 3. Page Layout

```
DESKTOP:
┌────────────────────────────────────────────────┐
│ OUR STORY IN NUMBERS                          │
│ Together Since June 1, 2025                   │
├────────────────────────────────────────────────┤
│                                                │
│  ┌─────────────┐  ┌─────────────┐             │
│  │ 374         │  │ 7,250       │             │
│  │ Days        │  │ Photos      │             │
│  │ Together    │  │ Captured    │             │
│  └─────────────┘  └─────────────┘             │
│                                                │
│  ┌─────────────┐  ┌─────────────┐             │
│  │ 340         │  │ 900         │             │
│  │ Videos      │  │ Diary       │             │
│  │ Recorded    │  │ Entries     │             │
│  └─────────────┘  └─────────────┘             │
│                                                │
│  ┌─────────────┐  ┌─────────────┐             │
│  │ 17          │  │ 28          │             │
│  │ Trips       │  │ Bucket      │             │
│  │ Taken       │  │ Completed   │             │
│  └─────────────┘  └─────────────┘             │
│                                                │
│ ────────────────────────────────────────────  │
│                                                │
│ This Year's Highlights:                       │
│ • Most Active Month: June (520 photos)        │
│ • Mood: 73% Happy 😊, 20% Loved 😍          │
│ • Average Posts/Week: 12.5 (Up from 10)      │
│                                                │
│ ────────────────────────────────────────────  │
│                                                │
│ [Chart: Days Together Over Time ▆▇▆▅▇▆▇▆]    │
│ [Chart: Monthly Activity Heatmap]             │
│ [Chart: Mood Breakdown by Month]              │
│ [Chart: Photos by Location (Top 5)]           │
│                                                │
│ ────────────────────────────────────────────  │
│                                                │
│ Yearly Comparison:                            │
│ 2024: 2,450 photos | 340 diary entries        │
│ 2025: 3,200 photos | 450 diary entries        │
│ 2026: 1,600 photos | 350 diary entries (so   │
│       far)                                    │
│                                                │
└────────────────────────────────────────────────┘

MOBILE:
┌──────────────────────┐
│ OUR STORY            │
│ Together 374 Days    │
├──────────────────────┤
│ ┌─────────────────┐  │
│ │ 7,250 Photos   │  │
│ └─────────────────┘  │
│ ┌─────────────────┐  │
│ │ 900 Entries    │  │
│ └─────────────────┘  │
│ ┌─────────────────┐  │
│ │ 17 Trips       │  │
│ └─────────────────┘  │
│                      │
│ 📊 Charts Below:     │
│ [Activity Heatmap]   │
│ [Mood Breakdown]     │
│ [Top Locations]      │
│                      │
└──────────────────────┘
```

#### 4. UI Components Needed

**New Components**:
- `StatisticsDashboard` - Main container
- `StatCard` - Individual stat with big number
- `StatChart` - Chart visualization (use Recharts)
- `ActivityHeatmap` - Month/day activity grid
- `MoodBreakdown` - Pie/bar chart of moods
- `TimelineChart` - Days together over time
- `YearlyComparison` - Year-over-year stats
- `LocationBreakdown` - Top locations chart
- `MilestoneCounter` - "Days until next milestone"

**Existing Components**:
- `Card` - Stat card wrapper
- `Chart` components (from shadcn/recharts)
- `Badge` - Labels

#### 5. Database Design Suggestions

**Views for Aggregation** (not separate tables):
```sql
CREATE VIEW stats_totals AS
SELECT 
  r.id as relationship_id,
  COUNT(DISTINCT m.id) as photo_count,
  (SELECT COUNT(*) FROM memory_media WHERE type='video') as video_count,
  (SELECT COUNT(*) FROM diary_entries) as diary_count,
  (SELECT COUNT(*) FROM love_wall_posts) as post_count,
  (SELECT COUNT(*) FROM bucket_list_items WHERE status='completed') as completed_goals,
  (SELECT COUNT(DISTINCT location_id) FROM memories WHERE location_id IS NOT NULL) as locations_visited,
  (SELECT COUNT(*) FROM love_wall_reactions) as reactions_count,
  r.started_date,
  NOW() as calculated_at
FROM relationships r
LEFT JOIN memories m ON r.id = m.relationship_id
GROUP BY r.id;

CREATE VIEW mood_breakdown AS
SELECT 
  relationship_id,
  mood,
  COUNT(*) as count,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY relationship_id), 2) as percentage
FROM diary_entries
WHERE mood IS NOT NULL
GROUP BY relationship_id, mood;

CREATE VIEW monthly_activity AS
SELECT 
  relationship_id,
  EXTRACT(YEAR FROM created_at) as year,
  EXTRACT(MONTH FROM created_at) as month,
  COUNT(*) as activity_count
FROM (
  SELECT relationship_id, created_at FROM memories
  UNION ALL
  SELECT relationship_id, created_at FROM diary_entries
  UNION ALL
  SELECT relationship_id, created_at FROM love_wall_posts
  UNION ALL
  SELECT relationship_id, created_at FROM bucket_list_items
) combined_activity
GROUP BY relationship_id, year, month;
```

**Caching**:
- Cache stats daily (schedule with Cloudflare Workers)
- Store in `relationship_stats_cache` table
- Invalidate on each action (new memory, entry, etc)

#### 6. Cloud Storage Requirements

**No new storage** - queries existing data

#### 7. Search & Filtering Requirements

**Filter Options**:
1. **Time Range**: "This year", "Last 6 months", "All time"
2. **Category**: "Memory stats", "Diary stats", "Travel stats"
3. **Comparison**: "Compare years", "Compare months"

#### 8. Mobile Experience

- Single column layout
- Large readable numbers
- Charts responsive and tappable
- Swipe between chart types
- Bottom sheet for detailed breakdowns

#### 9. Desktop Experience

- Grid layout with 2-3 columns
- Large charts side-by-side
- Hover for details
- Print dashboard as PDF
- Download data as CSV

#### 10. Future AI Enhancements

1. **Predictive**:
   - "At this rate, you'll have 10,000 photos by next year"
   - "You usually trip in summer; weekend available?"

2. **Insights**:
   - "You were happiest in July"
   - "Relationship activity peaked in Month 6"
   - "You photograph together most on weekends"

3. **Comparisons**:
   - "Couple stats vs. average couple" (anonymized)
   - "Your activity compared to your first year"

#### 11. Emotional Design Considerations

**Design Principles**:
- **Celebration**: Numbers represent milestones, not surveillance
- **Growth**: Charts show relationship progression
- **Joy**: Playful tone, not corporate
- **Connection**: Every number represents shared memory
- **Pride**: Numbers inspire gratitude
- **Timelessness**: Stats make relationship feel eternal

**Micro-interactions**:
- Numbers count up with animation on load
- Charts animate with smooth transitions
- Milestone badges appear (gold stars at 100 days, 1 year, etc)
- Hover reveals context ("These 7,250 photos represent 374 days")

**Visual Direction**:
- Large, bold typography for key numbers
- Warm, celebratory colors (golds, pinks)
- Minimal charts (not data-heavy)
- Icons convey meaning (📷 for photos, ✈️ for travel)
- Infographic style (not corporate analytics)

#### 12. Suggested Route Structure

```
/statistics
├── /statistics (main dashboard)
├── /statistics/yearly (year-over-year)
├── /statistics/moods (mood breakdown)
├── /statistics/locations (location stats)
└── /statistics/export (export as PDF/CSV)
```

#### 13. Suggested API Endpoints

```
GET    /api/statistics/overview
       Returns: total photos, videos, days together, etc.

GET    /api/statistics/by-month
       ?timeframe=year|all
       Returns: monthly activity breakdown

GET    /api/statistics/moods
       Returns: mood distribution from diary

GET    /api/statistics/locations
       Returns: top locations visited

GET    /api/statistics/yearly-comparison
       Returns: year-over-year stats

GET    /api/statistics/milestones
       Returns: upcoming milestones and achievements
```

#### 14. Notification Opportunities

1. **Milestone**: "You've been together 1 year! 🎉"
2. **Stats Update**: "Monthly digest: 520 photos, 30 entries"
3. **Comparison**: "You're 20% more active than last month!"
4. **Reminder**: "365 days until your next anniversary"

#### 15. Privacy Considerations

- Stats are never shared publicly
- Export option for personal records
- Deletion of items updates stats retroactively

---

### FEATURE 8: LOVE MAP

#### 1. Purpose
An interactive world map showing every location the couple has visited together. Each location is pinned with photos, stories, and memories from that place. Creates a visual travel history and inspiration for future destinations.

#### 2. User Experience Flow

**Viewing Map**:
1. User navigates to "Love Map"
2. Interactive world map loads (Mapbox/Google Maps)
3. Pins appear for all visited locations
4. Zoom levels: World → Country → City → Specific Location
5. Click pin to expand preview:
   - Location name
   - First visit date
   - Number of visits
   - Top photo from location
   - "View All" link

**Location Detail**:
1. Click "View All" or tap expanded pin
2. Location detail page shows:
   - Map with pin
   - Address/coordinates
   - All photos from location (gallery)
   - Stories/diary entries from this place
   - Videos shot here
   - Timeline of visits
   - Memories tagged with location
   - Trip highlight if part of longer trip

**Adding Location**:
1. Manually enter address
2. Auto-populate from memory location
3. Link existing memories to location
4. Upload photos from this place

#### 3. Page Layout

```
DESKTOP:
┌────────────────────────────────────────────┐
│ LOVE MAP - We've Been Here                 │
│ [🌍 World] [🇫🇷 Countries Visited: 8]     │
├────────────────────────────────────────────┤
│ [Interactive Map with pins]                 │
│ • Pin: Paris (3 visits, 45 photos)         │
│ • Pin: Tokyo (1 visit, 120 photos)         │
│ • Pin: Home (countless, 3,000+ photos)     │
│                                             │
│ [Sidebar]                                   │
│ Locations (Sorted by visits):              │
│ 1. Home - 3,000+ photos                    │
│ 2. Coffee Shop - 500 photos                │
│ 3. Paris - 120 photos                      │
│ 4. Lake Tahoe - 80 photos                  │
│ 5. Tokyo - 120 photos                      │
│ ...                                         │
│                                             │
└────────────────────────────────────────────┘

LOCATION DETAIL:
┌────────────────────────────────────────────┐
│ ← Back | Edit Location                     │
├────────────────────────────────────────────┤
│ 🇫🇷 PARIS                                  │
│ Location Map [Pin on Paris]                │
│                                             │
│ First Visit: March 14, 2024                │
│ Visits: 3 times                            │
│ Photos: 120                                 │
│ Days Spent: 12                              │
│                                             │
│ Timeline:                                   │
│ • March 14-20, 2024 (First time!)         │
│ • June 2-8, 2024 (Anniversary trip)       │
│ • Sept 1-7, 2025 (Return visit)           │
│                                             │
│ Photo Gallery:                              │
│ [Eiffel Tower] [Seine River] [Café]       │
│                                             │
│ Memories Tagged:                           │
│ • "Under the Eiffel Tower"                │
│ • "Best café in Paris"                     │
│ • "Romantic evening at Seine"              │
│                                             │
│ Diary Entries:                              │
│ • "Paris was magical" - Jack, March 15     │
│ • "Dreams come true in Paris" - Sheila...  │
│                                             │
└────────────────────────────────────────────┘

MOBILE:
┌──────────────────────┐
│ LOVE MAP             │
│ [Zoomed Map]         │
│ Paris  Tokyo Home    │
│                      │
│ Locations:           │
│ 1. Home              │
│ 2. Coffee Shop       │
│ 3. Paris  ★          │
│ 4. Lake Tahoe        │
│ 5. Tokyo             │
│                      │
│ [Tap for detail]     │
└──────────────────────┘
```

#### 4. UI Components Needed

**New Components**:
- `LoveMapContainer` - Main map view
- `LoveMapPin` - Interactive map pin
- `LoveMapPreview` - Mini preview on pin hover
- `LocationDetailView` - Full location page
- `LocationGallery` - Photos from location
- `LocationTimeline` - Visit timeline
- `LocationStats` - Visits, photos, days spent
- `LocationSearch` - Find location
- `LocationMemoriesList` - Linked memories

**Existing Components**:
- Map library (Mapbox or Google Maps integration)
- `Card` - Location card
- `Dialog` - Location detail modal

#### 5. Database Design Suggestions

**Primary Table**:
```sql
-- locations table (already defined in Part 2)

-- Location visits tracking:
CREATE TABLE location_visits (
  id UUID PRIMARY KEY,
  location_id FK → locations,
  visit_start_date DATE,
  visit_end_date DATE,
  trip_name STRING (optional),
  memories_ids Array[UUID], -- FK → memories
  created_at TIMESTAMP
);

-- Indexes for performance:
CREATE INDEX idx_locations_relationship ON locations(relationship_id);
CREATE INDEX idx_locations_favorite ON locations(relationship_id, is_favorite);
CREATE INDEX idx_location_visits_date ON location_visits(visit_start_date);
```

**Query to get location stats**:
```sql
SELECT 
  l.id,
  l.name,
  l.country,
  COUNT(DISTINCT lv.id) as visit_count,
  COUNT(DISTINCT m.id) as photo_count,
  l.first_visited_date,
  MAX(lv.visit_end_date) as last_visited,
  SUM(EXTRACT(DAY FROM (lv.visit_end_date - lv.visit_start_date))) as days_spent
FROM locations l
LEFT JOIN location_visits lv ON l.id = lv.location_id
LEFT JOIN memories m ON l.id = m.location_id
GROUP BY l.id
ORDER BY visit_count DESC;
```

#### 6. Cloud Storage Requirements

**Reuses existing photo storage** - no new storage needed

#### 7. Search & Filtering Requirements

**Map Features**:
1. **Search**: "Find Paris", "Show all beaches"
2. **Filter**: "Countries visited", "Favorite locations"
3. **By Type**: "Beaches", "Mountains", "Cities"
4. **By Year**: "Places we visited in 2024"
5. **Trip View**: "Show all locations from Paris trip"

**Implementation**:
- Full-text search on location names
- Coordinate-based proximity search (show nearby pins)
- Filter by country/region
- Custom tags/categories

#### 8. Mobile Experience

- Full-screen interactive map
- Pinch to zoom in/out
- Tap pin for preview
- Swipe up for full detail
- Location list in bottom sheet
- GPS to show current location option

#### 9. Desktop Experience

- Interactive Mapbox/Google Map
- Sidebar list of locations
- Hover pin for preview
- Click for detail modal
- Zoom country view (detailed boundaries)
- Draw travel route between locations (future feature)

#### 10. Future AI Enhancements

1. **Suggestions**:
   - "You loved beaches; here are nearby beach destinations"
   - "Popular locations for couples near you"
   - "Unvisited countries you might like"

2. **Trip Planning**:
   - "Optimal route for visiting all your saved locations"
   - "Best time to visit each destination"

3. **Travel Insights**:
   - "You spend most time in Europe"
   - "Average trip duration: 5 days"
   - "Suggest next adventure based on your style"

#### 11. Emotional Design Considerations

**Design Principles**:
- **Discovery**: Map encourages exploration
- **Wanderlust**: Each pin inspires future travel
- **Pride**: Shows places you've conquered together
- **Connection**: Each location represents a shared moment
- **Adventure**: Map feels like expedition log
- **Timelessness**: Locations grow with relationship

**Micro-interactions**:
- Pins animate on map load
- Hover zooms slightly and shows preview
- Map smoothly zooms on location select
- Photo galleries load with fade-in
- Visited dates appear with subtle animations

**Visual Direction**:
- Clean, minimal map (focus on locations)
- Pins are custom-styled (heart or star shapes)
- Pin colors by region or visit count
- Large readable location names
- Warm color palette (travel inspiration)
- Photos dominate the detail view

#### 12. Suggested Route Structure

```
/map
├── /map (world map view)
├── /map/:locationId (location detail)
├── /map/visits/:tripId (trip detail - all locations from one trip)
├── /map/country/:countryCode (country-specific view)
└── /map/travel-timeline (chronological trip view)
```

#### 13. Suggested API Endpoints

```
GET    /api/locations
       ?relationship_id
       Returns: all locations with visit stats

GET    /api/locations/:locationId
       Returns: detailed location with all visits

GET    /api/locations/nearby
       ?latitude, ?longitude, ?radius_km
       Returns: locations within radius

POST   /api/locations
       Body: { name, city, country, latitude, longitude }
       Returns: created location

PATCH  /api/locations/:locationId
       Body: { name, is_favorite, notes }
       Returns: updated location

GET    /api/locations/by-country
       Returns: all locations grouped by country

GET    /api/locations/stats
       Returns: total countries, cities, photos per location
```

#### 14. Notification Opportunities

1. **New Location**: "You added a new location: Paris!"
2. **Anniversary**: "It's been 1 year since you visited Paris"
3. **Return Visit**: "You're back in Paris! You've been here 3 times"
4. **Milestone**: "You've now visited 10 countries together! 🌍"

#### 15. Privacy Considerations

- Locations are private (GPS data stays between couple)
- Option to hide specific sensitive locations
- No public map sharing
- Export route as personal travel log

---

### FEATURE 9: DREAM BOARD

#### 1. Purpose
A shared Pinterest-style mood board for planning shared future. Couples collect inspiration for home design, wedding ideas, travel destinations, business concepts, and lifestyle goals. Creates a shared vision of the future.

#### 2. User Experience Flow

**Creating Board**:
1. User clicks "+ New Board"
2. Form appears:
   - Board title ("Wedding Ideas", "Dream Home")
   - Category (home, wedding, travel, business, family, personal)
   - Description (optional)
   - Cover photo (optional)
3. Board created and appears in list

**Adding Items**:
1. Click board to open
2. Click "+ Add Inspiration"
3. Options:
   - Upload photo
   - Paste image URL (Pinterest, Instagram)
   - Web search integration
4. Add caption/notes
5. Item appears in grid

**Board View**:
1. Grid of all items on board
2. Each item shows:
   - Image
   - Caption
   - Vote icons (heart from each partner)
   - Notes button
3. Tap item to expand

**Collaboration**:
1. Both partners can add items
2. React to items (love, heart, star, etc)
3. Add notes/discuss items
4. Organize by dragging

#### 3. Page Layout

```
DESKTOP:
┌────────────────────────────────────────────┐
│ DREAM BOARDS - Our Vision                  │
├────────────────────────────────────────────┤
│ [+ New Board]                              │
│                                             │
│ Board List:                                 │
│ ┌─────────────┐  ┌─────────────┐          │
│ │ 💍           │  │ 🏠           │          │
│ │ Wedding      │  │ Dream        │          │
│ │ Ideas        │  │ Home         │          │
│ │ 32 items     │  │ 47 items     │          │
│ │ ❤️ ❤️       │  │ ❤️ ❤️ ❤️    │          │
│ └─────────────┘  └─────────────┘          │
│                                             │
│ ┌─────────────┐  ┌─────────────┐          │
│ │ ✈️           │  │ 💼           │          │
│ │ Travel       │  │ Business     │          │
│ │ Dreams       │  │ Ideas        │          │
│ │ 28 items     │  │ 15 items     │          │
│ │ ❤️ ❤️       │  │ ❤️           │          │
│ └─────────────┘  └─────────────┘          │
│                                             │
└────────────────────────────────────────────┘

BOARD DETAIL:
┌────────────────────────────────────────────┐
│ ← Back | Edit Board | 💍 Wedding Ideas     │
│ 32 items | [♥️ Both love this]             │
├────────────────────────────────────────────┤
│ Grid View:                                  │
│ [Wedding 1] [Wedding 2] [Wedding 3]        │
│ [Wedding 4] [Wedding 5] [Wedding 6]        │
│                                             │
│ [+ Add Item]                                │
│                                             │
└────────────────────────────────────────────┘

ITEM DETAIL:
┌────────────────────────────────────────────┐
│ ← Back | Edit | Delete                     │
├────────────────────────────────────────────┤
│ [Large Wedding Dress Image]                │
│                                             │
│ "Princess Ball Gown with Lace Sleeves"    │
│                                             │
│ Jack: ❤️ Loves it                         │
│ Sheila: ❤️ Loves it                       │
│                                             │
│ Notes:                                     │
│ Jack: "This is perfect for you"            │
│ Sheila: "Found it on Pinterest!"           │
│                                             │
│ Price Range: $2,000 - $3,000               │
│ Designer: Oscar de la Renta                │
│ Source: Pinterest                          │
│                                             │
└────────────────────────────────────────────┘

MOBILE:
┌──────────────────────┐
│ DREAM BOARDS         │
│ [+ New Board]        │
├──────────────────────┤
│ 💍 Wedding Ideas (32)│
│ 🏠 Dream Home (47)   │
│ ✈️ Travel (28)       │
│ 💼 Business (15)     │
├──────────────────────┤
│ [Tap to open board]  │
│                      │
│ Board Grid:          │
│ [IMG] [IMG] [IMG]    │
│ [IMG] [+Add]         │
│                      │
└──────────────────────┘
```

#### 4. UI Components Needed

**New Components**:
- `DreamBoardGrid` - List of boards
- `DreamBoardCard` - Individual board preview
- `DreamBoardDetail` - Board contents
- `DreamBoardItemGrid` - Items in grid layout
- `DreamBoardItem` - Individual item card
- `DreamBoardItemDetail` - Expanded item view
- `DreamBoardForm` - Create/edit board
- `ItemUploadForm` - Add item to board
- `ItemVoting` - Love/heart reactions
- `ItemNotes` - Discussion on items

**Existing Components**:
- `Card` - Board/item wrapper
- `Button` - Actions
- `Dialog` - Detail modal
- `Badge` - Category label

#### 5. Database Design Suggestions

**Primary Tables**:
```sql
-- dream_boards (already defined in Part 2)
-- dream_board_items (already defined in Part 2)

-- User votes on items:
CREATE TABLE dream_board_item_votes (
  id UUID PRIMARY KEY,
  item_id FK → dream_board_items,
  user_id FK → users,
  vote_type STRING (e.g., 'love', 'heart', 'star'),
  created_at TIMESTAMP,
  UNIQUE(item_id, user_id)
);

-- Notes/discussions on items:
CREATE TABLE dream_board_item_notes (
  id UUID PRIMARY KEY,
  item_id FK → dream_board_items,
  user_id FK → users,
  content TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Indexes**:
```sql
CREATE INDEX idx_dream_boards_relationship ON dream_boards(relationship_id);
CREATE INDEX idx_dream_board_items_board ON dream_board_items(board_id);
CREATE INDEX idx_dream_board_votes ON dream_board_item_votes(item_id);
```

#### 6. Cloud Storage Requirements

**Per Item**:
- Image: 2-5 MB (Pinterest screenshots typically 1-3 MB)

**Example: 150 total items across all boards**:
- 150 items × 2-4 MB = 300-600 MB
- **Total: ~500 MB - 1 GB**

#### 7. Search & Filtering Requirements

**Search/Filter**:
1. **By Board**: "Show all wedding ideas"
2. **By Category**: "Show all home items"
3. **Most Loved**: "Items both voted on"
4. **By User**: "Items Jack added"
5. **Recent**: "Newest items first"

#### 8. Mobile Experience

- Single column board list
- Tap to open board
- Grid of items (2 columns)
- Tap item for detail modal
- Swipe to delete
- Pinch to zoom image
- Voice note comments

#### 9. Desktop Experience

- 2-3 column board grid
- Masonry layout for items
- Drag-and-drop reordering
- Batch editing (select multiple items)
- Print board as mood board PDF
- Compare boards side-by-side

#### 10. Future AI Enhancements

1. **Suggestions**:
   - "Items similar to this you might like"
   - "Trending home designs for 2026"
   - "Price suggestions for wedding dresses"

2. **Discovery**:
   - AI-generated mood boards based on preferences
   - "Curated wedding ideas based on your style"

3. **Integration**:
   - Link to real products (price, availability)
   - "Add to shopping list"

#### 11. Emotional Design Considerations

**Design Principles**:
- **Inspiration**: Pinterest-like discovery feel
- **Collaboration**: Both partners contribute equally
- **Vision**: Shared future planning
- **Curation**: Pride in collected items
- **Aspirational**: Looking forward together
- **Beauty**: Focus on images, minimal text

**Micro-interactions**:
- Hover zoom on images
- Vote animations (heart scales up)
- Board creation celebration animation
- Item reveal with fade-in
- Smooth drag-and-drop reordering

**Visual Direction**:
- Clean grid layout (like Pinterest)
- Large preview images
- Soft shadows on cards
- Category emojis are prominent
- Vote counts visible on hover
- Warm color palette

#### 12. Suggested Route Structure

```
/dream-board
├── /dream-board (board list)
├── /dream-board/new (create board)
├── /dream-board/:boardId (board detail)
├── /dream-board/:boardId/item/:itemId (item detail)
└── /dream-board/compare (compare boards)
```

#### 13. Suggested API Endpoints

```
GET    /api/dream-boards
       ?relationship_id
       Returns: all boards with preview

POST   /api/dream-boards
       Body: { title, category, description }
       Returns: created board

GET    /api/dream-boards/:boardId
       Returns: board with all items

POST   /api/dream-boards/:boardId/items
       Body: { image_url, caption, notes }
       Returns: created item

PATCH  /api/dream-boards/:boardId/items/:itemId
       Body: { caption, notes, price_range }
       Returns: updated item

DELETE /api/dream-boards/:boardId/items/:itemId
       Returns: deleted

POST   /api/dream-boards/:boardId/items/:itemId/votes
       Body: { vote_type }
       Returns: vote created

GET    /api/dream-boards/:boardId/stats
       Returns: item count, vote counts, participation
```

#### 14. Notification Opportunities

1. **Item Added**: "They added an inspiration to the Dream Home board"
2. **Vote**: "They love the wedding dress you saved!"
3. **Note**: "They commented on the house design"
4. **Board Milestone**: "You've collected 50 wedding ideas!"

#### 15. Privacy Considerations

- Boards are private
- No public sharing of boards (by default)
- Export board as PDF for printing
- Delete items/boards permanently

---

### FEATURE 10: SECRET LOVE NOTES

#### 1. Purpose
Special timed/scheduled love messages that create surprise and anticipation. Notes can disappear after reading, self-destruct after a time period, unlock on specific dates, or remain hidden until opened. Creates moments of delight throughout the year.

#### 2. User Experience Flow

**Creating Note**:
1. User clicks "Write Secret Note"
2. Compose interface appears:
   - Text content (rich text editor)
   - Optional photo/video
   - Note type selector:
     - "Read Once" (disappears after opening)
     - "Timed Destruct" (disappears after X hours)
     - "Scheduled Unlock" (unlocks on specific date)
     - "Hidden" (stays hidden until discovered)
   - Customization:
     - Background color/theme
     - Animation on unlock
     - Custom unlock message
3. User sets parameters (e.g., "Unlock on June 1, 2027")
4. Preview shows how note will appear
5. User sends/schedules

**Receiving Note**:
1. User receives notification: "You have a secret message waiting"
2. If type = "Read Once":
   - Click to read once
   - Note plays animation and deletes after reading
3. If type = "Timed Destruct":
   - Countdown timer appears
   - Note readable until timer expires
   - Auto-delete with animation
4. If type = "Scheduled Unlock":
   - Shows lock icon
   - Countdown to unlock date
   - On unlock date, notification sent
   - User can open and read
5. If type = "Hidden":
   - Appears as mysterious locked box
   - Require search/discovery (or click to unlock)

#### 3. Page Layout

```
DESKTOP - Receiving Screen:
┌────────────────────────────────────────────┐
│ LOVE NOTES                                 │
├────────────────────────────────────────────┤
│                                             │
│ Pending Notes:                              │
│                                             │
│ [Read Once]                                 │
│ 🔓 "Open when you need me"                │
│ From Jack | Sent 2 hours ago               │
│ ← Read                                      │
│                                             │
│ [Timed Destruct]                           │
│ ⏰ "Self-destructs in 12 hours"           │
│ From Sheila | Sent 1 day ago               │
│ [Timer: 12:00:00]                         │
│                                             │
│ [Scheduled Unlock]                         │
│ 🔒 "Unlocks June 1, 2027"                 │
│ From Jack | Sent 1 week ago                │
│ [Countdown: 357 days]                     │
│                                             │
│ [Hidden]                                   │
│ ❓ "Find me if you can"                   │
│ From Sheila | Sent 1 month ago             │
│ [🔓 Unlock]                                │
│                                             │
│ Read Notes (Archive):                      │
│ ✓ "Happy Anniversary!" - June 1, 2026     │
│ ✓ "I love you more each day" - Feb 14    │
│                                             │
└────────────────────────────────────────────┘

READING NOTE (Read Once):
┌────────────────────────────────────────────┐
│                                             │
│  ♥️  THIS NOTE WILL SELF-DESTRUCT          │
│      AFTER YOU READ IT                     │
│                                             │
│      [Swipe to open]                       │
│                                             │
└────────────────────────────────────────────┘

After swipe/click:
┌────────────────────────────────────────────┐
│                                             │
│  [Soft music plays]                        │
│                                             │
│  [Elegant calligraphy text appears]       │
│                                             │
│  "I've been thinking about our first      │
│   kiss all day. You make me feel like    │
│   the luckiest person alive. Come home   │
│   soon? 💕"                               │
│                                             │
│  — Jack                                    │
│                                             │
│  [5 second delay, then fades out]         │
│  "This message has self-destructed"       │
│                                             │
└────────────────────────────────────────────┘

SCHEDULED UNLOCK:
┌────────────────────────────────────────────┐
│                                             │
│  🔒 LOCKED MESSAGE                         │
│                                             │
│  "From Jack"                               │
│                                             │
│  Unlocks on June 1, 2027                  │
│  357 days remaining                        │
│                                             │
│  👀 Preview (from Jack): "I've been       │
│     planning something special..."        │
│                                             │
└────────────────────────────────────────────┘

MOBILE:
┌──────────────────────┐
│ LOVE NOTES           │
├──────────────────────┤
│ Pending:             │
│ 🔓 Open Me!         │
│ ⏰ Destruct 12h     │
│ 🔒 Unlock 357d     │
│ ❓ Find Me          │
├──────────────────────┤
│ Archive:             │
│ ✓ Happy Anniversary  │
│ ✓ Love You More     │
│                      │
└──────────────────────┘
```

#### 4. UI Components Needed

**New Components**:
- `LoveNotesContainer` - Main list view
- `LoveNoteCard` - Individual note preview
- `LoveNoteCompose` - Create note modal
- `LoveNoteReader` - Full note display
- `LoveNoteType Selector` - Choose note type
- `UnlockCountdown` - Countdown timer display
- `NoteAnimation` - Reveal/self-destruct animations
- `NoteArchive` - Deleted/read notes history

**Existing Components**:
- `Card` - Note wrapper
- `Button` - Actions
- `Dialog` - Compose modal
- `RichTextEditor` - Note content

#### 5. Database Design Suggestions

**Primary Table**:
```sql
-- secret_love_notes (already defined in Part 2)

-- Note reading history:
CREATE TABLE secret_note_reads (
  id UUID PRIMARY KEY,
  note_id FK → secret_love_notes,
  read_by_user_id FK → users,
  read_at TIMESTAMP,
  UNIQUE(note_id, read_by_user_id)
);

-- Indexes:
CREATE INDEX idx_notes_relationship_unread ON secret_love_notes(relationship_id, is_read);
CREATE INDEX idx_notes_unlock_date ON secret_love_notes(scheduled_unlock_date);
```

#### 6. Cloud Storage Requirements

**Per Note**:
- Text: <10 KB
- Optional photo: 2-5 MB
- Optional video: 50-200 MB

**Example: 50 notes/year**:
- 50 notes × 1-2 MB average = 50-100 MB/year
- **10 years = 500 MB - 1 GB**

#### 7. Search & Filtering Requirements

**Search/Filter**:
1. **By Status**: Pending, Read, Archived
2. **By Type**: Read-once, Timed, Scheduled, Hidden
3. **By Date**: "From June", "Last month"
4. **Sender**: "Notes from Jack"

#### 8. Mobile Experience

- List of all notes
- Tap to read
- Swipe to reveal animation
- Full-screen note reader
- Smooth self-destruct animation
- Push notification on unlock
- Archive swipe action

#### 9. Desktop Experience

- Sidebar showing pending notes
- Main area for reading selected note
- Keyboard shortcut to create new (Cmd+N)
- Print note option
- Archive notes in folder

#### 10. Future AI Enhancements

1. **Suggestions**:
   - "Send a note for this occasion"
   - "Anniversary coming up, write a note!"

2. **Reminders**:
   - "You haven't sent a note in a month"
   - "Perfect time to send a surprise"

3. **Content**:
   - AI-generated note suggestions
   - "Rewrite this more poetically"

#### 11. Emotional Design Considerations

**Design Principles**:
- **Anticipation**: Locked notes create excitement
- **Surprise**: Self-destruct adds delight
- **Intimacy**: Secret messages feel personal
- **Magic**: Animations feel special, not ordinary
- **Permanence**: Scheduled notes mark calendar
- **Romance**: Entire feature is romantic

**Micro-interactions**:
- Lock icon pulses slightly
- Unlock animation is satisfying
- Self-destruct animation is poetic (fade, particles)
- Countdown timer ticks softly
- Note content fades in elegantly

**Visual Direction**:
- Elegant, intimate design
- Soft, romantic colors
- Calligraphy-style fonts for note content
- Minimal UI (focus on message)
- Lock/key imagery
- Particle effects on self-destruct
- Dark mode for nighttime reading

#### 12. Suggested Route Structure

```
/love-notes
├── /love-notes (all notes)
├── /love-notes/new (create note)
├── /love-notes/pending (pending notes)
├── /love-notes/archive (read/deleted notes)
├── /love-notes/:noteId (read note)
└── /love-notes/scheduled (upcoming unlocks)
```

#### 13. Suggested API Endpoints

```
POST   /api/love-notes
       Body: { content, note_type, scheduled_unlock_date?, self_destruct_hours?, metadata }
       Returns: created note

GET    /api/love-notes
       ?relationship_id, ?status=pending|read|archived
       Returns: notes list

GET    /api/love-notes/:noteId
       Returns: full note content

POST   /api/love-notes/:noteId/read
       Returns: marked as read, note auto-deleted if type=read_once

DELETE /api/love-notes/:noteId
       Returns: deleted permanently

GET    /api/love-notes/upcoming
       Returns: all scheduled notes with countdown

PATCH  /api/love-notes/:noteId/unlock
       Returns: force unlock if scheduled
```

#### 14. Notification Opportunities

1. **New Note**: "You have a secret message waiting"
2. **Unlock Reminder**: "Your secret message is ready to read!"
3. **Countdown**: "Your secret message self-destructs in 1 hour"
4. **Deleted**: "Secret message has self-destructed"

#### 15. Privacy Considerations

- Notes stored with optional encryption
- Deletion happens automatically for read-once and timed notes
- No copies retained after deletion
- Deletion is permanent (cannot recover)
- Preview does not spoil full message

---

### FEATURE 11: ANNIVERSARY ARCHIVE

#### 1. Purpose
A dedicated annual compilation celebrating each year of the relationship. Every anniversary automatically aggregates the best photos, highlights, lessons learned, and goals achieved from that year. Over decades, this creates a "relationship museum" showing relationship growth.

#### 2. User Experience Flow

**Auto-Generated Archive** (on each anniversary):
1. System runs compilation job on anniversary date
2. Aggregates:
   - Best photos (by likes/reactions)
   - Videos from the year
   - Featured diary entries
   - Top memories
   - Bucket list items completed
   - Top locations visited
   - Mood summary
   - Major milestones
3. Creates yearbook-like page
4. Sends notification: "Your Year 3 Anniversary Archive is ready!"

**Viewing Archive**:
1. User navigates to "Anniversary Archives"
2. Timeline shows all years:
   - "Year 1 - June 1, 2025 to June 1, 2026"
   - "Year 2 - June 1, 2026 to June 1, 2027"
   - "Year 3 - June 1, 2027 to June 1, 2028"
3. Click year to open anniversary page

**Anniversary Page**:
1. Header: Year number, date range
2. Photo montage (top 24 photos from year)
3. Video highlight reel (if exists)
4. "By the Numbers":
   - Days together
   - Photos taken
   - Memories created
   - Places visited
   - Diary entries
   - Dreams achieved
5. "Highlights" section:
   - Major events from year
   - Best moments
   - Favorite memories
6. "Lessons Learned":
   - What we learned this year (user-contributed)
7. "Goals for Next Year":
   - Bucket list items to complete next year

#### 3. Page Layout

```
DESKTOP - Archives List:
┌─────────────────────────────────────────┐
│ ANNIVERSARY ARCHIVES                    │
│ Our Journey Year by Year                │
├─────────────────────────────────────────┤
│                                          │
│ YEAR 3 (Current)                        │
│ June 1, 2027 - June 1, 2028             │
│ Archive being compiled...                │
│                                          │
│ ───────────────────────────────────────  │
│                                          │
│ YEAR 2                                   │
│ June 1, 2026 - May 31, 2027             │
│ [Montage of 6 top photos]               │
│ 450 photos | 12 diary entries | 8 trips│
│ [View Archive]                          │
│                                          │
│ ───────────────────────────────────────  │
│                                          │
│ YEAR 1                                   │
│ June 1, 2025 - May 31, 2026             │
│ [Montage of 6 top photos]               │
│ 520 photos | 18 diary entries | 12 trips│
│ [View Archive]                          │
│                                          │
└─────────────────────────────────────────┘

ANNIVERSARY PAGE - Year 2:
┌─────────────────────────────────────────┐
│ ANNIVERSARY ARCHIVE - YEAR 2             │
│ June 1, 2026 - May 31, 2027             │
│ 365 Days of Us 🎉                       │
├─────────────────────────────────────────┤
│                                          │
│ BY THE NUMBERS                          │
│ 365 Days | 450 Photos | 12 Videos       │
│ 120 Diary Entries | 8 Trips | 5 Goals   │
│                                          │
│ ───────────────────────────────────────  │
│                                          │
│ PHOTO HIGHLIGHTS (24 best photos)       │
│ [Montage Grid of 24 photos]             │
│                                          │
│ ───────────────────────────────────────  │
│                                          │
│ YEAR IN REVIEW                          │
│                                          │
│ Major Milestones:                       │
│ • First Vacation Together               │
│ • Got a Puppy                           │
│ • Anniversary Trip to Paris             │
│ • Moved in Together                     │
│                                          │
│ Most Visited Places:                    │
│ 1. Coffee Shop (50 visits)              │
│ 2. Lake Tahoe (8 visits)                │
│ 3. Paris (5 visits)                     │
│                                          │
│ Top Moods:                              │
│ 😊 Happy: 65% | 😍 Loved: 25% | 😄 Laugh: 10%│
│                                          │
│ ───────────────────────────────────────  │
│                                          │
│ WHAT WE LEARNED                         │
│ (Editable - add reflections)            │
│                                          │
│ Jack: "I learned how much you make me   │
│        laugh every single day."         │
│                                          │
│ Sheila: "Learned that home is wherever  │
│         you are. ❤️"                    │
│                                          │
│ ───────────────────────────────────────  │
│                                          │
│ GOALS FOR YEAR 3                        │
│ • Visit Tokyo                           │
│ • Buy a house                           │
│ • Learn to dance together               │
│                                          │
│ ───────────────────────────────────────  │
│                                          │
│ [Print Archive] [Save as PDF]           │
│                                          │
└─────────────────────────────────────────┘

MOBILE:
┌──────────────────────┐
│ ANNIVERSARY ARCHIVES │
├──────────────────────┤
│ Year 3 (Current)    │
│ In Progress...      │
│                      │
│ Year 2 - Click ▶   │
│ [6 photo preview]   │
│ 450 photos          │
│                      │
│ Year 1 - Click ▶   │
│ [6 photo preview]   │
│ 520 photos          │
│                      │
└──────────────────────┘
```

#### 4. UI Components Needed

**New Components**:
- `AnniversaryArchivesList` - Timeline of all years
- `AnniversaryArchiveCard` - Year preview card
- `AnniversaryPageHeader` - Year header with dates
- `AnniversaryByNumbers` - Stats display
- `AnniversaryPhotoMontage` - Grid of best photos
- `AnniversaryHighlights` - Key events of year
- `AnniversaryLessonsSection` - Editable reflections
- `AnniversaryGoalsForNext` - Goals list
- `AnniversaryVideoMontage` - Year highlight reel
- `AnniversaryPrintable` - Print/export view

**Existing Components**:
- `Card` - Year preview
- `Button` - Actions
- `Badge` - Stat labels
- `RichTextEditor` - Lessons input

#### 5. Database Design Suggestions

**Primary Table**:
```sql
-- anniversary_archives (already defined in Part 2)

-- Create function to auto-generate archives:
CREATE FUNCTION generate_anniversary_archive(relationship_id UUID, year_number INT)
RETURNS anniversary_archives AS $$
DECLARE
  arch anniversary_archives;
  rel relationships;
BEGIN
  SELECT * INTO rel FROM relationships WHERE id = relationship_id;
  
  INSERT INTO anniversary_archives (
    relationship_id,
    year_number,
    anniversary_date,
    auto_compiled_highlights,
    top_photos,
    created_at
  ) VALUES (
    relationship_id,
    year_number,
    rel.started_date + INTERVAL '1 year' * year_number,
    -- Query to get top memories from year
    (SELECT array_agg(id) FROM memories 
     WHERE relationship_id = $1 
     AND memory_date BETWEEN rel.started_date + INTERVAL '1 year' * (year_number - 1)
                        AND rel.started_date + INTERVAL '1 year' * year_number
     ORDER BY (comment_count + reaction_count) DESC
     LIMIT 20),
    -- Query to get top photos
    (SELECT array_agg(file_url) FROM memory_media
     WHERE relationship_id = $1
     AND taken_date BETWEEN rel.started_date + INTERVAL '1 year' * (year_number - 1)
                      AND rel.started_date + INTERVAL '1 year' * year_number
     ORDER BY taken_date DESC
     LIMIT 24),
    NOW()
  ) RETURNING * INTO arch;
  
  RETURN arch;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate on anniversary:
CREATE OR REPLACE FUNCTION trigger_anniversary_archive()
RETURNS TRIGGER AS $$
BEGIN
  -- This runs daily to check for anniversaries
  -- Simple implementation shown here
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Scheduled Job** (via Cloudflare Workers):
- Daily check for anniversaries
- Run `generate_anniversary_archive()` on anniversary date
- Send notification to couple

#### 6. Cloud Storage Requirements

**Per Archive**:
- 24 best photos: 50-100 MB
- Video montage: 100-300 MB
- Metadata: <1 MB

**Example: 10 years of archives**:
- 10 × (75 MB + 200 MB) = 2,750 MB = 2.75 GB

#### 7. Search & Filtering Requirements

**Archive Navigation**:
1. Timeline view (all years)
2. "Show Year X"
3. "Print this year"
4. "Download as PDF"
5. Search within year (photos, entries, etc)

#### 8. Mobile Experience

- Vertical list of years
- Tap to expand year detail
- Photo montage scrolls horizontally
- Full-screen photo viewer
- Printable view (mobile print dialog)
- Landscape orientation for better photos

#### 9. Desktop Experience

- Timeline of years on left
- Expanded year detail on right
- Print to PDF feature
- Export as HTML
- Share archive (limited sharing options)
- Side-by-side year comparison

#### 10. Future AI Enhancements

1. **Auto-Generated Summaries**:
   - AI writes year summary: "This was the year you..."
   - Sentiment analysis: "Happiness score: 92/100"
   - Key themes: "This year was all about adventure"

2. **Highlight Curation**:
   - ML picks best photos automatically
   - Generates best video montage
   - Creates highlight reel with music

3. **Predictions**:
   - "Next year, you'll likely visit X locations"
   - "Projected milestones for Year 4"
   - "Continue these habits for strongest Year 4"

#### 11. Emotional Design Considerations

**Design Principles**:
- **Celebration**: Every anniversary feels ceremonial
- **Reflection**: Archives encourage pause and gratitude
- **Legacy**: Creates permanent record of relationship
- **Growth**: Watching archives across years shows progression
- **Pride**: Curated highlights celebrate achievements
- **Nostalgia**: Viewing past archives evokes memories
- **Future**: Goals section looks forward with hope

**Micro-interactions**:
- Confetti on anniversary archive page load
- Photos fade in sequentially
- Year timeline animates when loaded
- Scroll reveals achievements
- Hover shows photo details

**Visual Direction**:
- Elegant, gallery-like design
- Year numbers are large and prominent
- Photos are the focus (large, high-quality)
- Gold accents (celebration, premium feel)
- Warm, nostalgic color palette
- Serif fonts for reflections
- Printable design (looks good on paper)

#### 12. Suggested Route Structure

```
/anniversaries
├── /anniversaries (archive timeline)
├── /anniversaries/:year (year detail page)
├── /anniversaries/:year/print (printable version)
├── /anniversaries/:year/edit (edit reflections)
└── /anniversaries/:year/export (export as PDF)
```

#### 13. Suggested API Endpoints

```
GET    /api/anniversaries
       ?relationship_id
       Returns: list of all anniversary archives

GET    /api/anniversaries/:year
       Returns: full year archive with all data

POST   /api/anniversaries/:year/lessons
       Body: { user_id, content }
       Returns: lesson added

PATCH  /api/anniversaries/:year/metadata
       Body: { theme_color, goals_for_next_year }
       Returns: updated metadata

GET    /api/anniversaries/:year/export-pdf
       Returns: PDF file for download

GET    /api/anniversaries/upcoming
       Returns: next anniversary date with countdown
```

#### 14. Notification Opportunities

1. **Anniversary Alert**: "Happy 1st Anniversary! Your archive is ready 🎉"
2. **Archive Ready**: "Your Year 2 Anniversary Archive has been compiled"
3. **Milestone**: "10 years together! Your decade-long journey is incredible"

#### 15. Privacy Considerations

- Archives are completely private
- Auto-compiled from couple's existing data
- Export as PDF for personal/printed records
- Deletion of underlying memories doesn't delete archive snapshot
- Optional sharing (generate private link with expiration)

---

### FEATURE 12: AI MEMORY ASSISTANT

#### 1. Purpose
An intelligent relationship historian that helps couple discover, search, and understand their memories. Uses natural language processing and semantic search to answer questions like "What did we do on our first vacation?" or "Show me all sunset photos." Over time, becomes a powerful memory preservation and discovery tool.

#### 2. User Experience Flow

**Asking Questions**:
1. User navigates to "Ask About Us" or opens AI assistant
2. Text input appears: "Ask me anything about your relationship"
3. User types questions:
   - "What did we do on our first vacation?"
   - "Show me all beach photos"
   - "When was our first road trip?"
   - "Summarize 2024"
   - "What happened in June?"
   - "How many times have we visited Paris?"
   - "What was my mood in the saddest month?"
4. AI processes question and returns:
   - Direct answer (e.g., "You visited Lake Tahoe June 8-15")
   - Relevant memories/photos
   - Diary entries
   - Timeline context

**Search Results**:
1. Answer displayed prominently
2. Related memories shown below
3. Each result is clickable (opens memory detail)
4. Can save search results to collection
5. Refine search with suggested follow-ups

#### 3. Page Layout

```
DESKTOP:
┌────────────────────────────────────────────┐
│ ASK ABOUT YOUR RELATIONSHIP                │
├────────────────────────────────────────────┤
│                                             │
│ [Search Box]                               │
│ "Ask me anything about your story"        │
│ [What did we do on our first date?]       │
│ [🔍 Search]                                │
│                                             │
│ ────────────────────────────────────────── │
│                                             │
│ ANSWER:                                    │
│ "Your first date was on June 15, 2025,   │
│  at Coffee Shop downtown. According to    │
│  Jack's diary entry, he was 'nervous but │
│  couldn't stop smiling.' Sheila said it   │
│  was 'the beginning of everything.' ❤️"  │
│                                             │
│ ────────────────────────────────────────── │
│                                             │
│ RELATED MEMORIES:                          │
│                                             │
│ 📸 First Date (June 15, 2025)             │
│ [Photo from date]                         │
│ Jack: 1 memory | Sheila: 1 memory         │
│ 50 photos from this day                   │
│                                             │
│ 📖 Diary Entries from June 2025:          │
│ • "First date nerves..." - Jack           │
│ • "He was so sweet..." - Sheila           │
│                                             │
│ 🗺️ Locations: Coffee Shop                 │
│                                             │
│ ────────────────────────────────────────── │
│                                             │
│ SUGGESTED FOLLOW-UPS:                     │
│ • "Show me all our coffee dates"         │
│ • "What did I say about that day?"       │
│ • "Timeline of our first month"           │
│                                             │
└────────────────────────────────────────────┘

SEARCH INPUT SUGGESTIONS:
┌─────────────────────────────────────────┐
│ [Search Box]                             │
│ "Tell me about..."                       │
│                                          │
│ Suggested searches:                      │
│ • "Our first kiss"                      │
│ • "All beach photos"                    │
│ • "When did we get the puppy?"          │
│ • "My mood in 2024"                     │
│ • "All Paris memories"                  │
│ • "Best moments from June"              │
│                                          │
└─────────────────────────────────────────┘

MOBILE:
┌──────────────────────┐
│ ASK ABOUT US         │
├──────────────────────┤
│ [Search box]         │
│ Type question...     │
│ [🔍]                 │
├──────────────────────┤
│ ANSWER:              │
│ "Your first date..." │
│                      │
│ MEMORIES:            │
│ [First Date Card]    │
│ [Diary Entries]      │
│                      │
│ FOLLOW-UPS:          │
│ • Show all coffees   │
│ • Our first month    │
│                      │
└──────────────────────┘
```

#### 4. UI Components Needed

**New Components**:
- `AIAssistant` - Main interface
- `AISearchBox` - Input field with suggestions
- `AIAnswer` - Answer display
- `AISearchResults` - Results list
- `AISuggestedFollowUps` - Related questions
- `AIMemoryResult` - Individual result card
- `AIContextPanel` - Show memory context (dates, mood, etc)
- `AISaveSearch` - Save searches to collection

**Existing Components**:
- `Card` - Result wrapper
- `Button` - Actions
- `Dialog` - Memory detail modal

#### 5. Database Design Suggestions

**New Tables for Search Index**:
```sql
-- memory_search_index (already defined in Part 2)

-- Vector embeddings for semantic search:
CREATE TABLE memory_embeddings (
  id UUID PRIMARY KEY,
  entity_id UUID, -- FK to memories, diary_entries, etc
  entity_type STRING, -- 'memory', 'diary_entry', 'post'
  embedding vector(1536), -- OpenAI embeddings dimension
  indexed_content TEXT,
  relationship_id FK → relationships,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Search history (optional, for user convenience):
CREATE TABLE search_history (
  id UUID PRIMARY KEY,
  relationship_id FK → relationships,
  user_id FK → users,
  query TEXT,
  result_count INT,
  searched_at TIMESTAMP
);

-- Indexes for fast retrieval:
CREATE INDEX idx_memory_embeddings_vector ON memory_embeddings USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_memory_search_index_relationship ON memory_search_index(relationship_id);
CREATE INDEX idx_memory_search_index_content ON memory_search_index USING GIN(indexed_tags);
```

#### 6. Cloud Storage Requirements

**Embeddings Storage**:
- Per embedding: 1536 dimensions × 4 bytes = 6.144 KB
- 7,250 memories × 6 KB = 43.5 MB (embeddings only)
- Search index text: ~50-100 MB
- Total: ~150 MB for search infrastructure

#### 7. Search & Filtering Requirements

**Search Types**:

1. **Keyword Search** (Full-text):
   - "Show all beach photos"
   - "Vacation memories"
   - "Happy moments"

2. **Semantic Search** (NLP Understanding):
   - "When did we have our best moment together?"
   - "Show me romantic memories"
   - "What did we do on summer days?"

3. **Faceted Search**:
   - Date: "June 2024"
   - Location: "Paris"
   - Type: "Photos only", "Videos"
   - Mood: "Happy entries"

4. **Question Answering**:
   - "How many times have we visited Paris?" (Aggregation)
   - "What was my mood last month?" (Analytics)
   - "When did we meet?" (Specific fact)

#### 8. Mobile Experience

- Minimalist search interface
- Voice search capability (dictate questions)
- One-tap question templates
- Results scroll vertically
- Tap result to expand/view
- History of recent searches (swipe to clear)

#### 9. Desktop Experience

- Rich search box with autocomplete
- Suggested questions as you type
- Sidebar with search history
- Results can be reordered (relevance, date, popularity)
- Advanced search filters
- Save searches for later

#### 10. Future AI Enhancements

1. **Conversation Memory**:
   - Multi-turn conversation: "Show me beaches. Now only beaches in 2024. Which had the best weather?"
   - Context retention across questions

2. **Proactive Suggestions**:
   - "You haven't asked about June memories in a while"
   - "Check out your Year 1 anniversary archive"
   - "Remember this day last year?"

3. **Generative Summaries**:
   - "Tell me a story about our best vacation"
   - "Write a poem about our relationship based on memories"
   - "Create a year-end summary"

4. **Personalization**:
   - Learning user search patterns
   - Suggesting relevant searches based on upcoming dates
   - "You usually ask about beach days in summer"

5. **Cross-Modal Search**:
   - Search by image ("Find similar photos to this")
   - Audio transcription of memories
   - Sketch-based search

#### 11. Emotional Design Considerations

**Design Principles**:
- **Intuitive**: Feels like talking to a friend
- **Magic**: Instant retrieval feels like memory magic
- **Discovery**: Encourage exploring forgotten memories
- **Connection**: Reminds couple of shared history
- **Respect**: AI is a helper, not invasive
- **Wonder**: Answers surprise and delight

**Micro-interactions**:
- Typewriter effect as answer types out
- Results fade in with stagger animation
- Search suggestions appear as you type
- Results scale slightly on hover
- Follow-up questions appear with transition

**Visual Direction**:
- Conversational, warm interface
- Large, readable text
- Minimal UI (focus on answers)
- Soft colors (not corporate)
- Icon use conveys answer type (📸 photos, 📖 diary, etc)
- Results feel like discovery, not data

#### 12. Suggested Route Structure

```
/ai-search
├── /ai-search (main assistant)
├── /ai-search/results?q=... (search results)
├── /ai-search/history (search history)
└── /ai-search/saved-searches (saved search collections)
```

#### 13. Suggested API Endpoints

```
POST   /api/ai/search
       Body: { query, relationship_id, limit? }
       Returns: { answer, results[], suggested_follow_ups }

POST   /api/ai/semantic-search
       Body: { query, relationship_id }
       Returns: vector-based search results (most similar)

GET    /api/ai/embeddings/status
       Returns: which memories have embeddings generated

POST   /api/ai/generate-embeddings
       ?relationship_id
       (Background job to generate embeddings for all memories)

GET    /api/ai/search-suggestions
       ?relationship_id
       Returns: suggested searches based on relationship state

POST   /api/ai/save-search
       Body: { query, name }
       Returns: saved search collection

GET    /api/ai/search-history
       ?relationship_id, ?limit
       Returns: previous searches

POST   /api/ai/conversation
       Body: { query, conversation_context }
       Returns: answer with context awareness
```

#### 14. Notification Opportunities

1. **Memory Resurface**: "Remember this day 2 years ago?"
2. **Question Suggestion**: "I found 50 memories of beaches you visited"
3. **Data Ready**: "Your memory embeddings are ready for smart search"
4. **Anniversary Reminder**: "You haven't asked about your first date in months"

#### 15. Privacy Considerations

- **Embeddings Encryption**: Vector data is sensitive
- **No External AI**: Keep AI assistant internal (Cloudflare Workers + local models, not OpenAI)
- **Data Retention**: Search queries are logged but not shared
- **Export**: Provide export of all embeddings/search data
- **Deletion**: Embeddings deleted when memory is deleted
- **Privacy by Design**: Assistant never contacts external services
- **Security**: Search index is relationship-specific

#### Architecture Notes for AI Implementation:

**Option 1: Local Embeddings** (Recommended for Privacy):
- Use Hugging Face transformers running on Cloudflare Workers
- Generate embeddings locally, never sent to external API
- Store embeddings in Supabase with pgvector extension
- Use vector similarity search for retrieval

**Option 2: Cloudflare Vectorize** (If Available):
- Cloudflare's managed vector database
- Embed generation via Cloudflare AI
- Native integration with Workers

**Search Implementation**:
1. Index generation: Happens after each memory/diary/post creation
2. Embeddings: 1536-dim vectors from local model
3. Storage: PostgreSQL with pgvector extension
4. Query: Cosine similarity search for semantic matching
5. Ranking: Combine semantic + keyword + recency + engagement

---

## PART 5: COMPONENT HIERARCHY & ARCHITECTURE

### Global Components
```
App
├── Layout
│   ├── Navigation (top nav with logo, settings)
│   ├── Sidebar (left nav - collapsible, mobile hamburger)
│   │   ├── Logo
│   │   ├── NavLinks
│   │   │   ├── Walk of Love
│   │   │   ├── Daily Love Diary
│   │   │   ├── Timeline
│   │   │   ├── Memory Vault
│   │   │   ├── Love Wall
│   │   │   ├── Bucket List
│   │   │   ├── Statistics
│   │   │   ├── Love Map
│   │   │   ├── Dream Board
│   │   │   ├── Secret Love Notes
│   │   │   └── Anniversary Archives
│   │   ├── UserMenu
│   │   └── Settings
│   ├── MainContent (right side, responsive)
│   └── Footer (if needed)
├── GlobalModals
│   ├── SettingsModal
│   ├── ProfileModal
│   ├── NotificationsPanel
│   └── SearchOverlay (Cmd+K)
├── GlobalNotifications
│   └── ToastContainer (Sonner)
└── GlobalFeatures
    ├── FloatingHearts (existing, repurpose)
    ├── MusicToggle (existing, repurpose)
    ├── RainToggle (existing, repurpose)
    └── EasterEggs (existing, repurpose)
```

### Feature Components

**Walk of Love**:
```
WalkOfLoveLayout
├── WalkOfLoveTimeline (main infinite scroll)
│   ├── MemoryStarIcon
│   ├── MemoryStarPreview (hover tooltip)
│   └── [MemoryDetailModal] (when clicked)
├── WalkOfLoveSidebar
│   ├── MemorySearchBar
│   ├── MemoryCategoryFilter
│   └── MemoryTypeFilter
└── MemoryDetailModal
    ├── MemoryHeader (title, date, location)
    ├── MemoryCarousel (photos/videos)
    ├── MemoryStory (text content)
    ├── MemoryCommentSection
    └── MemoryReactionBar
```

**Daily Love Diary**:
```
DiaryLayout
├── DiaryViewSelector ([Daily|Weekly|Monthly|Stream])
├── DiaryEditor (when writing)
│   ├── RichTextEditor
│   ├── MoodSelector
│   ├── WeatherSelector
│   ├── LocationPicker
│   ├── PhotoUpload
│   ├── VoiceNoteRecorder
│   └── TagInput
├── DiaryCalendar (month view)
│   ├── DiaryCalendarGrid
│   ├── DayEntryIndicators
│   └── [Expand on day click]
├── DiaryEntryExpanded
│   ├── DiaryEntry (self)
│   ├── DiaryEntry (partner)
│   ├── DiaryCommentSection
│   └── DiaryReactionBar
└── DiaryStreakCounter
```

**Love Timeline**:
```
TimelineLayout
├── TimelineZoomControls ([Year|Month|Week|Day])
├── TimelineFilterControls
├── TimelineContainer (infinite scroll)
│   ├── TimelineYearMarker
│   ├── TimelineEvent
│   │   ├── EventIcon
│   │   ├── EventDetails
│   │   └── [Expand on click]
│   └── TimelineConnector (SVG line)
└── TimelineEventDetail (modal)
    ├── Memory/Diary/Goal data
    └── Related content
```

**Memory Vault**:
```
VaultLayout
├── VaultSidebar
│   ├── FolderTree
│   │   ├── FolderNode (expandable)
│   │   └── FolderContextMenu
│   ├── SmartCollections
│   └── ByDateOrganization
├── VaultSearchBar
├── VaultGrid (masonry layout)
│   ├── VaultGridItem
│   │   ├── Photo/Video thumbnail
│   │   ├── HoverActions
│   │   └── [Click to fullscreen]
│   └── VaultContextMenu
├── VaultLightbox (fullscreen)
│   ├── MediaViewer
│   ├── MediaInfo
│   ├── Navigation (prev/next)
│   └── Actions
└── VaultUpload (drag-and-drop or modal)
```

**Love Wall**:
```
LoveWallLayout
├── LoveWallComposeBox (sticky top)
│   ├── RichTextInput
│   ├── MediaUpload
│   ├── GIFSearch
│   └── VoiceNoteRecorder
├── LoveWallFeed (infinite scroll)
│   ├── LoveWallPost
│   │   ├── PostHeader (user, time)
│   │   ├── PostContent (text, media carousel)
│   │   ├── PostReactionBar
│   │   ├── PostCommentCount
│   │   └── PostMoreMenu
│   └── [Click post for detail]
└── LoveWallCommentThread (modal)
    ├── OriginalPost
    ├── CommentList
    └── CommentInput
```

(Continuing with other feature components...)

---

## PART 6: API ENDPOINTS SUMMARY

**Base URL**: `https://api.walkoflo-ve.com/api`

**Auth**: All endpoints require JWT token + relationship_id in header

### Walk of Love
- `GET /memories` - List memories
- `POST /memories` - Create memory
- `GET /memories/:id` - Get memory detail
- `PATCH /memories/:id` - Update memory
- `DELETE /memories/:id` - Delete memory
- `POST /memories/:id/reactions` - Add reaction
- `GET /memories/:id/comments` - Get comments
- `POST /memories/:id/comments` - Add comment

### Diary
- `GET /diary` - List entries
- `POST /diary` - Create entry
- `GET /diary/:id` - Get entry detail
- `PATCH /diary/:id` - Update entry
- `GET /diary/stats` - Get mood stats
- `GET /diary/streaks` - Get streak info

### Timeline
- `GET /timeline` - Get timeline events
- `GET /timeline/search` - Search timeline

### Memory Vault
- `GET /vault/media` - List media
- `POST /vault/media` - Upload media
- `GET /vault/folders` - Get folder structure
- `POST /vault/folders` - Create folder
- `GET /vault/search` - Search media

### Love Wall
- `GET /wall/posts` - Get feed
- `POST /wall/posts` - Create post
- `POST /wall/posts/:id/reactions` - React to post
- `POST /wall/posts/:id/comments` - Comment on post

### Bucket List
- `GET /bucket-list` - List items
- `POST /bucket-list` - Create item
- `PATCH /bucket-list/:id/progress` - Update progress
- `GET /bucket-list/stats` - Get statistics

### Statistics
- `GET /statistics/overview` - Main stats
- `GET /statistics/by-month` - Monthly breakdown
- `GET /statistics/moods` - Mood analytics

### Love Map
- `GET /locations` - Get all locations
- `POST /locations` - Add location
- `GET /locations/:id` - Get location detail

### Dream Board
- `GET /dream-boards` - List boards
- `POST /dream-boards` - Create board
- `GET /dream-boards/:id/items` - Get board items
- `POST /dream-boards/:id/items` - Add item

### Secret Love Notes
- `POST /love-notes` - Create note
- `GET /love-notes` - List notes
- `POST /love-notes/:id/read` - Mark as read

### Anniversaries
- `GET /anniversaries` - Get all archives
- `GET /anniversaries/:year` - Get year archive
- `POST /anniversaries/:year/lessons` - Add reflection

### AI Assistant
- `POST /ai/search` - Search memories with AI
- `POST /ai/semantic-search` - Semantic search
- `GET /ai/embeddings/status` - Check embedding status

---

## PART 7: PHASED IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Months 1-2)
**Goal**: Build core data structures and initial features

Priority Features:
1. **Memory Vault** - Upload & organize photos
2. **Walk of Love** - Create & view memories
3. **Database Schema** - Finalize schema, create migrations
4. **Auth/Security** - Relationship-based access control

Deliverables:
- Complete Supabase schema with all tables
- Basic file upload to Supabase Storage
- Memory creation flow (text + photos)
- Simple memory list view (grid)
- RPC auth working for couple-only access

Tech: Supabase, Cloudflare Workers, Supabase Storage

### Phase 2: Social & Interaction (Months 3-4)
**Goal**: Add social interactions and real-time features

Priority Features:
1. **Love Wall** - Posts, reactions, comments
2. **Daily Love Diary** - Diary entries with mood
3. **Reactions System** - Cross-feature reactions
4. **Real-time Updates** - WebSocket for live updates

Deliverables:
- Love Wall feed with CRUD operations
- Diary entry creation & viewing
- Reaction system (love, hug, kiss, etc)
- Real-time notifications (Supabase Realtime)
- Comments on memories & posts

Tech: Supabase Realtime, React Query subscriptions

### Phase 3: Timeline & Analytics (Months 5-6)
**Goal**: Historical view and insights

Priority Features:
1. **Love Timeline** - Chronological all events
2. **Relationship Statistics** - Dashboard with charts
3. **Timeline Aggregation** - Query view combining data
4. **Monthly/Yearly Views** - Zoom-in zoom-out

Deliverables:
- Aggregated timeline view (all features)
- Statistics dashboard with charts (Recharts)
- Monthly/yearly breakdowns
- Activity heatmaps
- "Days together" counter

Tech: Postgres views, Recharts

### Phase 4: Travel & Curation (Months 7-8)
**Goal**: Location-based features and collection management

Priority Features:
1. **Love Map** - Interactive map with locations
2. **Memory Vault Organization** - Folders & collections
3. **Location Tagging** - Auto-tag memories by location
4. **Trip Grouping** - Group memories by trip

Deliverables:
- Interactive map (Mapbox/Google Maps)
- Location creation & visit tracking
- Folder management for vault
- Smart collections (auto-generated)
- Trip grouping UI

Tech: Mapbox API, GeoJSON, Folder hierarchy

### Phase 5: Goals & Dreams (Months 9-10)
**Goal**: Future planning features

Priority Features:
1. **Bucket List** - Goal tracking with progress
2. **Dream Board** - Pinterest-style inspiration
3. **Progress Tracking** - Milestones & completion
4. **Photo Association** - Link media to goals

Deliverables:
- Bucket list creation & management
- Progress update system (0-100%)
- Milestones for tracking
- Dream board creation & item curation
- Goal-to-memory linking

Tech: React forms, Progress components

### Phase 6: Timing & Secrets (Months 11-12)
**Goal**: Special features for delayed reveals

Priority Features:
1. **Secret Love Notes** - Timed/scheduled messages
2. **Anniversary Archive** - Yearly compilation
3. **Scheduled Unlock** - Date-locked content
4. **Auto-Generate** - Scheduled jobs

Deliverables:
- Secret note creation (multiple types)
- Self-destruct messaging
- Scheduled unlock mechanism
- Anniversary auto-compilation (Cron job)
- Archive viewing page

Tech: Cloudflare Workers Cron, Scheduled tasks, Encryption

### Phase 7: Search & AI (Months 13-15)
**Goal**: Intelligent discovery

Priority Features:
1. **AI Memory Assistant** - Question answering
2. **Semantic Search** - Embeddings-based search
3. **Vector Database** - PostgreSQL + pgvector
4. **Smart Suggestions** - Prompt recommendations

Deliverables:
- Embeddings generation (local models)
- Vector similarity search
- Natural language query processing
- Question answering system
- Search UI with suggestions

Tech: Hugging Face transformers, pgvector, OpenAI Whisper (for transcription)

### Phase 8: Polish & Scale (Months 16+)
**Goal**: Optimization and new features

Ongoing:
- Performance optimization
- Mobile UX refinement
- Accessibility audit (WCAG)
- Advanced AI features
- New "nice-to-have" features

---

## PART 8: PRIVACY & SECURITY ARCHITECTURE

### Data Isolation
- **Row-Level Security (RLS)**: Supabase RLS ensures only relationship members access data
- **Relationship Isolation**: Every query filters by `relationship_id`
- **No Cross-Couple Data**: No way to access another couple's data

### Authentication
- **OAuth 2.0**: Supabase Auth (Google, GitHub, Email)
- **JWT Tokens**: Signed tokens valid 1 hour, refresh token 7 days
- **Device Tracking**: Optional (for security)

### Encryption
- **In Transit**: HTTPS/TLS 1.3
- **At Rest**: Supabase automatic encryption
- **Optional Sensitive Content**: User-initiated encryption for specific memories

### Storage Security
- **Supabase Storage**: Private buckets (no public URLs by default)
- **Signed URLs**: Time-limited access (1 hour validity)
- **File Integrity**: SHA256 hashing for verification

### Compliance
- **GDPR**: Right to deletion, data export
- **CCPA**: Privacy policy, data handling
- **Data Retention**: Backups kept for 30 days minimum

### Audit Trail
- **Activity Logs**: Who accessed what, when
- **Deletion Logs**: Record of deleted items (for recovery)
- **API Logging**: All API calls logged with timestamps

---

## PART 9: SCALABILITY & PERFORMANCE

### Database Optimization
- **Indexes**: Created on frequently queried columns (dates, categories, relationships)
- **Materialized Views**: Pre-computed complex queries (timeline aggregation)
- **Partitioning**: Memories partitioned by relationship_id (future, if 1000+ couples)
- **Caching**: Redis for statistics (invalidate on changes)

### File Storage
- **CDN**: Cloudflare CDN for media delivery
- **Thumbnails**: WebP generation, cached
- **Progressive Loading**: LQIP (Low Quality Image Placeholder)
- **Video Streaming**: Adaptive bitrate (HLS)

### API Performance
- **Pagination**: Always limit + offset (default 20, max 100)
- **Lazy Loading**: Load more on scroll
- **Request Deduplication**: React Query caching
- **Rate Limiting**: 1000 requests/hour per user

### Frontend Optimization
- **Code Splitting**: Route-based splitting
- **Bundle Analysis**: Monitor bundle size
- **Image Optimization**: WebP, srcset
- **Virtual Scrolling**: For large lists (timelines, grids)

### Monitoring
- **Error Tracking**: Sentry for bug detection
- **Performance Monitoring**: Web Vitals tracking
- **Analytics**: Anonymous usage patterns
- **Uptime Monitoring**: Heartbeat monitoring

---

## FINAL SUMMARY

This architecture supports a private, intimate relationship platform for two people with:

✅ **12 Major Features** covering memories, diary, timeline, vault, social, goals, maps, dreams, secrets, archives, and AI

✅ **Scalable Database** with proper normalization, indexes, and views

✅ **Cloud-Native Storage** with CDN optimization and tiered access

✅ **AI-Ready Infrastructure** with embeddings, semantic search, and vector database

✅ **Privacy-First Design** with RLS, encryption, and audit trails

✅ **Mobile-First UX** with responsive design and offline support

✅ **Phased Rollout** starting with MVP (Phase 1-2) to full AI features (Phase 7)

**Total Development Time**: ~15 months with dedicated team

**Tech Stack**: React 19 + TanStack + Supabase + Cloudflare + Tailwind (respecting existing)

**Key Success Metrics**:
- Daily active usage (both partners)
- Memory growth rate
- Feature adoption
- User satisfaction (emotional impact)
- Data preservation longevity

---

**END OF ARCHITECTURE DOCUMENT**

This document provides comprehensive planning without code implementation. Each feature is architecturally sound, respectful of your existing tech stack, and designed with emotional intentionality for a relationship-focused platform.

Ready to start Phase 1 implementation whenever you are! 🤍
