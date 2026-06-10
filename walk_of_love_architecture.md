# Walk of Love - Feature Architecture and Implementation Plan

Document status: Planning only, no implementation code
Date: 2026-06-10
Project: Walk of Love
Current stack: React 19, TanStack Router, TanStack Query, TypeScript, Hono on Cloudflare Workers, Cloudflare D1, Cloudflare R2, Tailwind, Framer Motion

## 0) Planning Guardrails

- This plan strictly follows the existing stack and structure already in the repository.
- The prompt mentions Vue, but implementation will stay in the current React and TanStack architecture.
- The platform remains private and relationship scoped to two users.
- All new data and media are relationship-isolated and access-controlled via the existing session auth middleware.
- Existing working routes and APIs remain backward compatible while new capabilities are added in phases.

## 1) Current Architecture Analysis and Reuse Plan

### Existing assets to reuse

- Frontend route shell and metadata in src/routes/__root.tsx.
- Existing homepage composition in src/routes/index.tsx for section-based storytelling.
- Existing API composition in src/api/app.ts.
- Existing auth guard and context from src/api/lib/auth.ts.
- Existing memory core table and APIs from migrations/d1 and src/api/routes/memories.ts.
- Existing media upload and retrieval flow via R2 from src/api/routes/media.ts.

### Existing constraints to respect

- D1 schema already includes users, relationships, memories, memory_comments, memory_reactions, sessions, and auth foundations.
- Media object key format and relationship ownership checks are already enforced server-side.
- Hydration-sensitive UI patterns are already handled using client-only wrappers where needed.

### Architectural direction

- Keep a single Worker API service with modular route files.
- Expand D1 incrementally with migration files only.
- Keep R2 for binary assets and D1 for all queryable metadata.
- Add feature routes under route groups but preserve the current home experience.
- Use relationship_id and author_user_id as first-class tenant and ownership controls.

## 2) Shared Component Hierarchy (Cross-Feature)

### New reusable frontend modules

- Shell and navigation:
  - AppFrame
  - RelationshipSidebar
  - MobileBottomTabs
  - FeatureHeader

- Memory primitives:
  - MemoryCard
  - MemoryDetailDrawer
  - MemoryReactionBar
  - MemoryCommentThread
  - MemoryMediaGallery
  - MemoryLocationChip
  - MemoryDateBadge

- Input and creation primitives:
  - QuickCreateMemoryModal
  - MediaUploader
  - VoiceNoteRecorder
  - TagPicker
  - MoodPicker
  - LocationPicker

- Discovery primitives:
  - SearchBar
  - FilterChips
  - SortDropdown
  - EmptyState
  - YearMonthScroller

- Emotional design primitives:
  - MilestoneStar
  - TimelineRibbon
  - AnniversaryHero
  - SecretNoteEnvelope
  - WarmStatCard

### New backend route modules

- src/api/routes/walk.ts
- src/api/routes/diary.ts
- src/api/routes/timeline.ts
- src/api/routes/vault.ts
- src/api/routes/wall.ts
- src/api/routes/bucket-list.ts
- src/api/routes/stats.ts
- src/api/routes/map.ts
- src/api/routes/dream-board.ts
- src/api/routes/secret-notes.ts
- src/api/routes/anniversaries.ts
- src/api/routes/assistant.ts
- src/api/routes/search.ts
- src/api/routes/notifications.ts

## 3) Global Data Model Extensions (D1)

These build on current existing tables and keep the memories table as the canonical memory record.

### Core extension tables

- memory_media
  - media_id, memory_id, relationship_id, uploader_user_id, object_key, media_type, mime_type, bytes, duration_ms, width, height, created_at

- memory_tags
  - memory_id, tag, created_at

- memory_categories
  - memory_id, category, created_at

- memory_locations
  - location_id, relationship_id, name, latitude, longitude, city, country, created_at

- diary_entries
  - diary_id, relationship_id, author_user_id, entry_date, title, body, mood, created_at, updated_at

- diary_entry_media
  - diary_id, media_id

- wall_posts
  - post_id, relationship_id, author_user_id, body, visibility, pinned, created_at, updated_at

- wall_post_media
  - post_id, media_id

- wall_reactions
  - reaction_id, post_id, user_id, reaction_type, created_at

- wall_comments
  - comment_id, post_id, author_user_id, parent_comment_id, body, created_at

- bucket_items
  - item_id, relationship_id, creator_user_id, title, description, category, priority, status, progress_pct, target_date, completed_at, created_at, updated_at

- bucket_item_updates
  - update_id, item_id, author_user_id, note, progress_pct, created_at

- dream_boards
  - board_id, relationship_id, title, category, created_at

- dream_items
  - item_id, board_id, author_user_id, title, note, object_key, source_url, vote_score, created_at

- secret_notes
  - note_id, relationship_id, sender_user_id, recipient_user_id, body_ciphertext, mode, unlock_at, ttl_seconds, one_time, opened_at, destroyed_at, created_at

- anniversaries
  - anniversary_id, relationship_id, year_number, title, summary, created_at

- anniversary_artifacts
  - artifact_id, anniversary_id, artifact_type, ref_id, created_at

- notifications
  - notification_id, relationship_id, recipient_user_id, event_type, entity_type, entity_id, payload_json, read_at, created_at

- search_index
  - entity_type, entity_id, relationship_id, content_text, tags_text, date_value, updated_at

- embeddings
  - embedding_id, relationship_id, entity_type, entity_id, model, vector_json, chunk_text, created_at

### Indexing strategy

- Relationship-scoped composite indexes first, then date.
- Full text search via FTS virtual table tied to search_index.
- Reaction and comments indexes by parent entity and created_at.
- Map and location indexes by relationship_id and coordinates.

## 4) Cloud Storage Strategy (R2)

### Bucket usage

- Single logical binding MEDIA with environment-specific bucket.
- Object prefixes:
  - relationships/{relationship_id}/memories/{memory_id}/...
  - relationships/{relationship_id}/diary/{diary_id}/...
  - relationships/{relationship_id}/wall/{post_id}/...
  - relationships/{relationship_id}/vault/{asset_id}/...
  - relationships/{relationship_id}/anniversaries/{year}/...

### Metadata

- customMetadata keys:
  - relationshipId
  - ownerUserId
  - entityType
  - entityId
  - mediaType

### Security

- No public bucket access.
- Media retrieval only through authenticated Worker route.
- Signed short-lived download tokens optional for large media streaming in later phase.

## 5) Global Search and Filtering Architecture

### Query layers

- Basic search endpoints per feature with SQL LIKE and indexed filters.
- Unified search endpoint for cross-feature search using FTS.
- Advanced discovery endpoint for combined filters:
  - date range
  - mood
  - media type
  - tag
  - location
  - event type

### Sorting defaults

- Most recent first for feeds and diary.
- Memory date ascending for timeline journeys.
- Relevance + recency for search.

## 6) Notification Architecture

### In-app only for now

- No email or push in first implementation.
- Notification bell and unread badges in app shell.
- Events generated server-side on new post, comment, reaction, diary entry, secret note unlock, anniversary creation.

## 7) Privacy and Safety Baseline

- Relationship-scoped authorization on all read and write routes.
- Server enforces ownership for all entity lookups and R2 objects.
- Secret note payload encrypted before storage.
- Soft-delete policy for recoverability.
- Audit fields on all tables: created_at, updated_at, created_by where applicable.

---

## FEATURE 1: WALK OF LOVE

1. Purpose
- Flagship visual memory journey where each major event appears as a star on a path over time.

2. User Experience Flow
- Tap Create Star Memory.
- Enter title, story, date, location, category.
- Upload photos, videos, voice note.
- Save and see animated star placed in chronology.
- Tap star to open memory detail and social interactions.

3. Page Layout
- Top: Path header and year selector.
- Middle: Curved star path with milestone clusters.
- Bottom sheet or side panel: selected memory details.

4. UI Components Needed
- WalkPathCanvas, StarNode, StarCreateModal, MemoryDetailPanel, MemoryReactionBar, MemoryCommentThread, MemoryMediaGallery.

5. Database Design Suggestions
- Reuse memories table with memory_type = walk_star.
- Add star_style, star_rank, path_order fields via migration.
- Reuse memory_comments and memory_reactions.

6. Cloud Storage Requirements
- Photos, video clips, and voice notes in R2 under memory prefix.

7. Search and Filtering Requirements
- Filter by year, category, event type, and media presence.
- Search by title, story text, and tag.

8. Mobile Experience
- Vertical scroll path with sticky year chip and bottom drawer detail.

9. Desktop Experience
- Wider cinematic path, left filter rail, right detail panel.

10. Future AI Enhancements
- Auto-generate star captions.
- Suggest missing milestone memories by date gaps.

11. Emotional Design Considerations
- Star glow intensity reflects reaction activity.
- Soft transitions and celebratory motion on new stars.

12. Suggested Route Structure
- /walk
- /walk/new
- /walk/:memoryId

13. Suggested API Endpoints
- GET /api/walk/stars
- POST /api/walk/stars
- GET /api/walk/stars/:id
- PATCH /api/walk/stars/:id
- GET /api/walk/search

14. Notification Opportunities
- New star created.
- New comment on a star memory.
- Milestone anniversary reminder tied to star date.

15. Privacy Considerations
- All stars visible only within relationship.
- Optional private mode for creator-only memory draft.

---

## FEATURE 2: DAILY LOVE DIARY

1. Purpose
- Shared daily journaling to preserve feelings, routines, and reflections.

2. User Experience Flow
- Open Today card.
- Write text and select mood.
- Attach media and tags.
- Publish.
- Partner comments or reacts.
- Streak and mood trend update.

3. Page Layout
- Header with streak and mood insights.
- Tabs for Day, Week, Month.
- Calendar grid and entry cards.

4. UI Components Needed
- DiaryComposer, MoodPicker, DiaryCalendar, DiaryEntryCard, DiaryEntryDetail, StreakWidget, MoodTrendChart.

5. Database Design Suggestions
- diary_entries, diary_entry_media.
- Optional derived table diary_streaks for fast streak calculations.

6. Cloud Storage Requirements
- Diary photos, short videos, and voice notes in R2 diary prefix.

7. Search and Filtering Requirements
- Filter by mood, date range, tag, author.
- Search across diary body text.

8. Mobile Experience
- Daily card first, swipe between days, quick mood-first entry.

9. Desktop Experience
- Split view with monthly calendar on left and selected entry detail on right.

10. Future AI Enhancements
- Mood summaries by week.
- Gentle writing prompts based on prior entries.

11. Emotional Design Considerations
- Warm color shifts based on selected mood.
- Streak UI should motivate, never guilt.

12. Suggested Route Structure
- /diary
- /diary/new
- /diary/:diaryId

13. Suggested API Endpoints
- GET /api/diary
- POST /api/diary
- GET /api/diary/:id
- PATCH /api/diary/:id
- GET /api/diary/streak
- GET /api/diary/moods

14. Notification Opportunities
- Partner posted today.
- Streak milestone reached.
- Comment received on entry.

15. Privacy Considerations
- Optional hide entry until next day.
- Edit history visible only to both partners.

---

## FEATURE 3: LOVE TIMELINE

1. Purpose
- Full chronological relationship history with expandable memory nodes.

2. User Experience Flow
- Scroll through years.
- Expand a month.
- Open event or memory detail.
- Filter by type and search keywords.

3. Page Layout
- Year grouped timeline with month subgroups.
- Floating controls for filter and jump-to-year.

4. UI Components Needed
- TimelineYearGroup, TimelineMonthGroup, TimelineEventCard, MilestoneMarker, TimelineFilters.

5. Database Design Suggestions
- timeline_events table.
- Event may reference memory_id when available.

6. Cloud Storage Requirements
- Reuse memory media references, no separate storage required.

7. Search and Filtering Requirements
- Event type, category, date range, text search.

8. Mobile Experience
- Collapsible year accordions and compact cards.

9. Desktop Experience
- Dual-column timeline with richer previews.

10. Future AI Enhancements
- Auto-cluster events into chapters.
- Auto-generate year summaries.

11. Emotional Design Considerations
- Chapter-like year labels and subtle transitions to evoke a storybook feel.

12. Suggested Route Structure
- /timeline
- /timeline/:eventId

13. Suggested API Endpoints
- GET /api/timeline
- POST /api/timeline
- GET /api/timeline/:id
- GET /api/timeline/search

14. Notification Opportunities
- New milestone added.
- Upcoming milestone anniversary.

15. Privacy Considerations
- Immutable date audit for milestone authenticity.

---

## FEATURE 4: MEMORY VAULT

1. Purpose
- Permanent archive for all relationship media and documents.

2. User Experience Flow
- Upload or import assets.
- Organize into folders or collections.
- Tag and favorite assets.
- Open asset details and related memories.

3. Page Layout
- Left: folders and smart albums.
- Main: media grid or list.
- Right: metadata inspector.

4. UI Components Needed
- VaultSidebar, VaultGrid, AssetCard, AssetPreview, FolderTree, CollectionPicker, SmartAlbumBuilder.

5. Database Design Suggestions
- memory_media as canonical media metadata.
- Add vault_assets and vault_collections for non-memory files.

6. Cloud Storage Requirements
- R2 for all binary assets and generated thumbnails.

7. Search and Filtering Requirements
- File type, date, tags, favorite, location, related memory.

8. Mobile Experience
- Grid-first browse with full-screen preview and quick favorite action.

9. Desktop Experience
- Multi-select workflows and keyboard shortcuts.

10. Future AI Enhancements
- Auto-tagging, face grouping, trip grouping, duplicate detection.

11. Emotional Design Considerations
- Memory resurfacing cards should be celebratory and context rich.

12. Suggested Route Structure
- /vault
- /vault/folders/:folderId
- /vault/collections/:collectionId
- /vault/assets/:assetId

13. Suggested API Endpoints
- GET /api/vault/assets
- POST /api/vault/assets
- PATCH /api/vault/assets/:id
- GET /api/vault/collections
- POST /api/vault/collections

14. Notification Opportunities
- New upload by partner.
- Smart album generated.

15. Privacy Considerations
- Strict metadata and object-level relationship checks.

---

## FEATURE 5: LOVE WALL

1. Purpose
- Private two-person social feed for everyday moments.

2. User Experience Flow
- Create post with text and media.
- Partner reacts and comments.
- Optional share post to memory vault.
- Pin special posts.

3. Page Layout
- Composer at top.
- Chronological feed cards.
- Comment threads inline.

4. UI Components Needed
- WallComposer, PostCard, ReactionPicker, CommentComposer, CommentThread, PinnedPostStrip.

5. Database Design Suggestions
- wall_posts, wall_post_media, wall_reactions, wall_comments.

6. Cloud Storage Requirements
- Post media in R2 wall prefix.

7. Search and Filtering Requirements
- Search by text, filter by media type, author, pinned.

8. Mobile Experience
- Sticky quick composer and lightweight media preview.

9. Desktop Experience
- Feed with right rail for pinned and memory highlights.

10. Future AI Enhancements
- Suggest turning high-engagement post into formal memory.

11. Emotional Design Considerations
- Reaction vocabulary remains affectionate and playful.

12. Suggested Route Structure
- /wall
- /wall/:postId

13. Suggested API Endpoints
- GET /api/wall/posts
- POST /api/wall/posts
- POST /api/wall/posts/:id/reactions
- POST /api/wall/posts/:id/comments
- PATCH /api/wall/posts/:id/pin

14. Notification Opportunities
- New post, reaction, or comment.
- Mention alerts.

15. Privacy Considerations
- Mentions remain internal only.
- No external sharing endpoints.

---

## FEATURE 6: COUPLE BUCKET LIST

1. Purpose
- Shared goal and dream tracker with progress and milestones.

2. User Experience Flow
- Create item.
- Assign category and priority.
- Add progress updates and media.
- Mark complete and archive with celebration.

3. Page Layout
- Board view by status plus list view.
- Progress dashboard header.

4. UI Components Needed
- BucketItemCard, PriorityBadge, ProgressRing, MilestoneList, CompletionDialog.

5. Database Design Suggestions
- bucket_items and bucket_item_updates.

6. Cloud Storage Requirements
- Optional evidence media in R2 bucket list prefix.

7. Search and Filtering Requirements
- Filter by status, priority, category, due date.

8. Mobile Experience
- Kanban-like swipe states and quick update actions.

9. Desktop Experience
- Multi-column board and bulk edit controls.

10. Future AI Enhancements
- Recommend next achievable goals.
- Auto-summarize progress trajectory.

11. Emotional Design Considerations
- Completion moments with gentle celebration and keepsake snapshots.

12. Suggested Route Structure
- /bucket-list
- /bucket-list/:itemId

13. Suggested API Endpoints
- GET /api/bucket-list/items
- POST /api/bucket-list/items
- PATCH /api/bucket-list/items/:id
- POST /api/bucket-list/items/:id/updates

14. Notification Opportunities
- Goal status change.
- Upcoming target date reminders.

15. Privacy Considerations
- Personal goals can be marked private-to-author if needed.

---

## FEATURE 7: RELATIONSHIP STATISTICS

1. Purpose
- Playful analytics showing growth and shared life patterns.

2. User Experience Flow
- Open stats dashboard.
- Explore period summaries.
- Tap metric for source drill-down.

3. Page Layout
- Hero counters at top.
- Trend charts and milestone tiles below.

4. UI Components Needed
- WarmStatCard, TrendChart, MilestoneCounter, YearSummaryCards.

5. Database Design Suggestions
- Derived aggregation queries on memories, media, diary, wall, trips.
- Optional materialized summaries table for performance.

6. Cloud Storage Requirements
- None beyond existing data stores.

7. Search and Filtering Requirements
- Time period filter, metric category filter.

8. Mobile Experience
- Swipeable metric cards and compact charts.

9. Desktop Experience
- Full analytics board with comparison charts.

10. Future AI Enhancements
- Narrative summaries of each month and year.

11. Emotional Design Considerations
- Use meaningful labels and memory links, avoid corporate language.

12. Suggested Route Structure
- /stats

13. Suggested API Endpoints
- GET /api/stats/overview
- GET /api/stats/monthly
- GET /api/stats/yearly
- GET /api/stats/milestones

14. Notification Opportunities
- Day count milestones and annual recap readiness.

15. Privacy Considerations
- Keep metrics relationship-private and non-exported by default.

---

## FEATURE 8: LOVE MAP

1. Purpose
- Geographical memory explorer for all places visited together.

2. User Experience Flow
- Open map.
- Zoom and select pin.
- View related memories, diary, and media.
- Jump to trip timeline.

3. Page Layout
- Full map canvas.
- Slide panel with selected location timeline.

4. UI Components Needed
- MapCanvas, LocationPin, LocationCluster, LocationDetailPanel, TripSummaryCard.

5. Database Design Suggestions
- memory_locations and location references on memories and diary entries.

6. Cloud Storage Requirements
- No separate storage; reuse linked media in R2.

7. Search and Filtering Requirements
- Filter by country, city, date range, trip type.

8. Mobile Experience
- Full-screen map with snap panel and large touch targets.

9. Desktop Experience
- Multi-pane map plus detail and timeline list.

10. Future AI Enhancements
- Auto-generate trip story from location sequence.

11. Emotional Design Considerations
- Pins should feel like postcards rather than standard utilitarian markers.

12. Suggested Route Structure
- /map
- /map/locations/:locationId

13. Suggested API Endpoints
- GET /api/map/locations
- GET /api/map/locations/:id
- GET /api/map/trips

14. Notification Opportunities
- On this day memory from same location.

15. Privacy Considerations
- Obfuscate exact coordinates where sensitivity is high.

---

## FEATURE 9: DREAM BOARD

1. Purpose
- Collaborative inspiration and future planning board.

2. User Experience Flow
- Create board.
- Add inspirations from uploads or links.
- Vote and comment.
- Promote item to bucket list or memory goal.

3. Page Layout
- Masonry board cards.
- Board filter by category.

4. UI Components Needed
- BoardCard, DreamItemCard, VotePill, InspirationComposer, BoardFilters.

5. Database Design Suggestions
- dream_boards and dream_items plus vote fields.

6. Cloud Storage Requirements
- Image uploads in R2 dream-board prefix.

7. Search and Filtering Requirements
- Filter by board, category, votes, recency.

8. Mobile Experience
- Pinterest-like card scroll with quick save.

9. Desktop Experience
- Dense masonry with drag and organize interactions.

10. Future AI Enhancements
- Similarity recommendations and board clustering.

11. Emotional Design Considerations
- Creative mood-first visuals with scrapbook texture accents.

12. Suggested Route Structure
- /dream-board
- /dream-board/:boardId
- /dream-board/:boardId/items/:itemId

13. Suggested API Endpoints
- GET /api/dream-board/boards
- POST /api/dream-board/boards
- GET /api/dream-board/boards/:id/items
- POST /api/dream-board/boards/:id/items
- POST /api/dream-board/items/:id/vote

14. Notification Opportunities
- Partner voted or added inspiration.

15. Privacy Considerations
- Source links sanitized and metadata stripped when needed.

---

## FEATURE 10: SECRET LOVE NOTES

1. Purpose
- Intimate private notes with timed, date-locked, or one-time reveal modes.

2. User Experience Flow
- Compose note.
- Choose unlock rule.
- Send.
- Recipient sees sealed envelope.
- Open when unlocked.
- Optional self-destruct.

3. Page Layout
- Inbox of envelopes.
- Composer with unlock settings.
- Reveal view with immersive reading mode.

4. UI Components Needed
- SecretNoteComposer, UnlockRulePicker, EnvelopeCard, RevealScreen, SelfDestructTimer.

5. Database Design Suggestions
- secret_notes table with encrypted payload and unlock metadata.

6. Cloud Storage Requirements
- Optional media attachments in R2 secret-note prefix.

7. Search and Filtering Requirements
- Filter by status: locked, unlocked, opened, expired.
- Search only unlocked plaintext derived index where permitted.

8. Mobile Experience
- One-handed envelope interactions and tactile opening animation.

9. Desktop Experience
- Split inbox and preview layout.

10. Future AI Enhancements
- Optional tone rewrite assistance before sending.

11. Emotional Design Considerations
- Ritualized opening and gentle transitions to preserve intimacy.

12. Suggested Route Structure
- /secret-notes
- /secret-notes/new
- /secret-notes/:noteId

13. Suggested API Endpoints
- GET /api/secret-notes
- POST /api/secret-notes
- POST /api/secret-notes/:id/open
- POST /api/secret-notes/:id/destroy

14. Notification Opportunities
- Note unlocked.
- One-time note waiting unopened.

15. Privacy Considerations
- Encrypted storage, strict read-once semantics, secure erase workflow.

---

## FEATURE 11: ANNIVERSARY ARCHIVE

1. Purpose
- Dedicated annual museum page for each year together.

2. User Experience Flow
- Anniversary page auto-created yearly.
- Partners curate highlights.
- Add letters, top photos, lessons, goals.
- Generate printable keepsake.

3. Page Layout
- Year hero section.
- Highlight galleries, letters, achievements, recap timeline.

4. UI Components Needed
- AnniversaryHero, YearHighlightGrid, GoalsAchievedList, LessonsCard, KeepsakePreview.

5. Database Design Suggestions
- anniversaries and anniversary_artifacts tables.

6. Cloud Storage Requirements
- Curated media and generated PDF keepsakes in R2 anniversary prefix.

7. Search and Filtering Requirements
- Filter by year and artifact type.

8. Mobile Experience
- Story-like chapter flow and swipe sections.

9. Desktop Experience
- Rich editorial layout with print preview panel.

10. Future AI Enhancements
- Auto-generate year summary and highlight candidate selection.

11. Emotional Design Considerations
- Treat each anniversary like a chapter cover of a shared book.

12. Suggested Route Structure
- /anniversaries
- /anniversaries/:year

13. Suggested API Endpoints
- GET /api/anniversaries
- POST /api/anniversaries/:year/compile
- PATCH /api/anniversaries/:year
- POST /api/anniversaries/:year/keepsake

14. Notification Opportunities
- Anniversary month reminder.
- Recap draft ready.

15. Privacy Considerations
- Keepsake exports require explicit confirmation and expiration links.

---

## FEATURE 12: AI MEMORY ASSISTANT

1. Purpose
- Conversational memory historian for retrieval, summaries, and rediscovery.

2. User Experience Flow
- Ask question in natural language.
- Assistant retrieves related memories, diary entries, media, and timeline events.
- Returns grounded answer with citations and quick links.

3. Page Layout
- Chat interface with source cards and timeline snippets.

4. UI Components Needed
- AssistantChat, SourceCard, RetrievalPanel, AskSuggestionChips, FollowUpComposer.

5. Database Design Suggestions
- embeddings table and search_index table.
- Keep source entity references and chunk text.

6. Cloud Storage Requirements
- No direct binary dependency beyond source data; optionally cache generated summaries.

7. Search and Filtering Requirements
- Hybrid retrieval: keyword FTS + vector similarity + recency re-rank.
- Optional filter chips in chat: date range, location, type.

8. Mobile Experience
- Compact source cards and quick follow-up actions.

9. Desktop Experience
- Side-by-side chat and source evidence pane.

10. Future AI Enhancements
- Proactive recap generation.
- Event reconstruction from sparse signals.
- Memory gap prompts.

11. Emotional Design Considerations
- Tone should be warm, respectful, non-judgmental, and relationship-aware.

12. Suggested Route Structure
- /assistant

13. Suggested API Endpoints
- POST /api/assistant/query
- GET /api/assistant/sources/:sessionId
- POST /api/assistant/feedback
- POST /api/search/reindex

14. Notification Opportunities
- Monthly AI recap ready.
- Anniversary draft summary available.

15. Privacy Considerations
- Private model context scoped by relationship_id.
- Never use couple data for global model training.
- Support data deletion and embedding purge per entity.

---

## 8) UX Wireframe Descriptions

### Primary navigation wireframe

- Left or bottom primary nav items:
  - Home
  - Walk
  - Diary
  - Timeline
  - Vault
  - Wall
  - More menu for remaining features

- Global top actions:
  - Search
  - Quick Create
  - Notifications
  - Profile and relationship settings

### Memory detail wireframe

- Hero media carousel
- Title, date, location
- Story text
- Reactions row
- Comments thread
- Related memories strip

### Search wireframe

- Global search bar
- Filter chips row
- Results grouped by feature type
- Recent and saved searches

## 9) Suggested Route Map Summary

- /
- /walk
- /walk/new
- /walk/:memoryId
- /diary
- /diary/new
- /diary/:diaryId
- /timeline
- /timeline/:eventId
- /vault
- /vault/folders/:folderId
- /vault/collections/:collectionId
- /vault/assets/:assetId
- /wall
- /wall/:postId
- /bucket-list
- /bucket-list/:itemId
- /stats
- /map
- /map/locations/:locationId
- /dream-board
- /dream-board/:boardId
- /secret-notes
- /secret-notes/new
- /secret-notes/:noteId
- /anniversaries
- /anniversaries/:year
- /assistant

## 10) Phased Implementation Roadmap

### Phase 1: Memory foundation hardening

- Expand memories schema and add memory_media, tags, categories, and search index.
- Build reusable MemoryCard, MemoryDetail, MediaGallery, Reaction and Comment primitives.
- Add unified search endpoint and feature-level filters.

### Phase 2: Core engagement surfaces

- Implement Walk of Love, Daily Love Diary, Love Timeline.
- Implement Love Wall with reactions, comments, and pinning.
- Add in-app notifications for social events.

### Phase 3: Archive and planning tools

- Implement Memory Vault, Couple Bucket List, Love Map, Dream Board.
- Add favorites, collections, and smart discovery filters.

### Phase 4: Emotional long-term features

- Implement Secret Love Notes and Anniversary Archive.
- Add keepsake generation and yearly recap workflows.

### Phase 5: AI memory intelligence

- Implement embeddings pipeline and hybrid retrieval.
- Ship AI Memory Assistant with source-grounded answers.
- Add monthly and yearly assistant-generated recaps.

## 11) Definition of Done for Each Feature

- Frontend route and responsive layout complete.
- Backend route handlers complete with auth checks.
- D1 migrations and indexes created.
- R2 media path and metadata enforced.
- Search and filtering complete.
- Notifications wired for key events.
- Privacy checks and access controls validated.
- Basic telemetry and error handling included.

## 12) Immediate Next Implementation Slice Recommendation

Start with Feature 1 plus shared primitives because it unlocks most other features:

- Build shared MemoryDetail, MediaGallery, Reaction, Comment components.
- Add memory_media and memory search schema.
- Implement Walk of Love route and APIs.
- Wire notification events for new star memory and comments.

This creates the reusable base required by Diary, Timeline, Wall, and Anniversary features.
