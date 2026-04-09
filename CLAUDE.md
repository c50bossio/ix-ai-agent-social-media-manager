# IX AI Agent Social Media Manager

The complete AI-powered content creation and distribution system. Create, edit, and publish content across 13+ platforms using Claude Code skills.

## Skills (17)

| Category | Skill | Triggers |
|----------|-------|----------|
| **Distribution** | `late-social-media` | "post to", "schedule post" |
| | `short-form-posting` | "post short", "post reel" |
| | `youtube-content-package` | "youtube package", "publish video" |
| **Visual Creation** | `thumbnail-creator` | "create thumbnail", "youtube thumbnail" |
| | `carousel-generator` | "create carousel", "carousel images" |
| | `document-carousel` | "document carousel", "LinkedIn PDF" |
| **Video Pipeline** | `clip-extractor` | "extract clips", "reframe video", "face tracking" |
| | `clip-selection` | "select clips", "find best clips" |
| | `edit` | "edit video", "edit clip" |
| | `video-editing` | (invoked by /edit -- router) |
| | `short-form-editing` | (invoked by router -- <90s) |
| | `long-form-editing` | (invoked by router -- 5+ min) |
| | `extracting-transcripts` | "transcribe", "extract transcript" |
| | `visual-overlay-creation` | "create illustration", "new visual" |
| **Voice** | `voice-dna` | "write post", "create caption", "write description", "draft post" |
| **Utility** | `video-upload-helper` | "compress video", "upload video" |
| | `content-analytics` | "check analytics" |

## Rules

1. **Never post without user approval.** Always show the content package and get explicit confirmation.
2. **Each platform gets unique content.** Same message, different wording. Never copy-paste across platforms.
3. **Ask for thumbnails** before posting video content to YouTube.
4. **Confirm titles** before posting to YouTube.
5. **Use the Late REST API** (curl) for posts that need platform-specific features.
6. **Use Late MCP tools** for simple single-platform posts.
7. **Voice DNA is mandatory.** Before writing ANY content, load the `voice-dna` skill. It reads the active brand from `brands/config.json` and loads the correct voice profile from `brands/{slug}/voice-dna.md`. Never mix brand voices.

## Session Commands

| Command | Purpose | Triggers |
|---------|---------|----------|
| `/continue` | Load context, check system, review state, suggest next action | "continue", "resume", "what's next", "where are we" |
| `/done` | Validate, sync docs, report, commit and push | "done", "wrap up", "commit this", "push it" |

## Pipeline Flow

```
/clip-selection > /clip-extractor > /transcribe > /edit > /post-short
```

1. **Clip Selection** -- Analyze transcript, score clips (5 categories, 0-100), select best moments
2. **Clip Extraction** -- Face-tracking reframe (16:9 to 9:16) via Python tool at `tools/clip_extractor/`
3. **Transcription** -- WhisperX GPU or AssemblyAI for word-level timestamps
4. **Editing** -- `/edit` routes to `video-editing` (router) then `short-form-editing` or `long-form-editing`
5. **Publishing** -- `/short-form-posting` or `/youtube-content-package` via Late/Zernio

## Clip Extractor — How It Works (IMPORTANT)

The clip extractor does **intelligent face-tracking reframe**, NOT a static center crop. Never use a raw ffmpeg `crop=` filter as a substitute.

**6-stage pipeline:**
1. **Face Detection** (MediaPipe BlazeFace) -- finds the face every N frames
2. **Signal Fusion** -- combines face + pose + saliency for robust tracking
3. **Temporal Smoothing** (Kalman/EMA) -- smooth, natural camera motion
4. **Deadzone Filtering** -- suppresses micro-jitter so the crop doesn't twitch
5. **Crop Calculation** -- centers the 9:16 window ON the face (mouth at center)
6. **Frame-by-frame rendering** -- interpolated crop positions piped through ffmpeg

**Dependencies:** `mediapipe`, `opencv-contrib-python`, `numpy`, `filterpy`, `pyyaml`, `rapidfuzz`

**All extracted clips go to:** `output/clips/YYYY-MM-DD-slug/` with a `clips-metadata.json`

## Editing Architecture (3-Skill System)

```
/edit > video-editing (ROUTER) > short-form-editing (<90s)
                                > long-form-editing (5+ min)
```

### Format Detection

| Duration | Format | Primary Component | Pop-Outs |
|----------|--------|------------------|----------|
| <90s (pipeline) | Short-form | ConceptOverlay | 8-15 |
| <90s (standalone) | Short-form | AppleStylePopup + FloatingCard | 5-7 |
| 5+ min | Long-form | ConceptOverlay | 30-40+ |

## Essential Commands

```bash
# Remotion
npm run studio                    # Preview in browser
npm run render -- <Id> out/x.mp4  # Render composition

# Clip Extractor
cd tools
python -m clip_extractor reframe --video input.mp4 --output clips/ --format 9x16
python -m clip_extractor batch --video source.mp4 --clips defs.json --output clips/
```

## Critical Editing Rules

1. **ALWAYS use WORDS data** (`.ts` files) for frame timing
2. **Pop-out at EXACT frame** the keyword is spoken
3. **ILLUSTRATION-FIRST** -- NO caption on most pop-outs
4. **illustrationSize:** 800 (no text), 700 (with text), 620 (CTA)
5. **NEVER use template illustrations** -- every pop-out needs UNIQUE visual metaphor
6. **ALWAYS use real images** for logos (`Img` + `staticFile()`)
7. **Long-form: NO zoom keyframes** (flat 1.0)
8. **Source video audio:** `volume={0}` ONLY when the source has burned-in captions or overlapping narration. For **podcast/interview clips where the speaker's voice IS the content**, use `volume={1}` — muting kills the entire clip.
9. **Background music** 0.02 volume, first 35s only
10. **SFX J-cut:** sound 2-3 frames BEFORE visual
11. **SFX variety** -- never repeat same sound consecutively

## Key APIs

### Late / Zernio (Social Posting + Media Storage)
- **Base URL:** `https://getlate.dev/api/v1`
- **Upload:** `POST /media/presign` then PUT to upload URL, use `publicUrl`
- **Post:** `POST /posts` with `platforms[]` array
- **MCP tools:** `accounts_list`, `posts_create`, `posts_list`, `media_presign`

### KIE.ai (AI Image Generation)
- **Base URL:** `https://api.kie.ai/api/v1`
- **Model:** `nano-banana-pro`
- **Create task:** `POST /jobs/createTask`
- **Poll status:** `GET /jobs/recordInfo?taskId={id}`

## Brand Assets

### Platform Logos (`public/logos/`)
x.svg, instagram.svg, linkedin.svg, tiktok.svg, youtube.svg, facebook.svg, threads.svg, bluesky.svg, pinterest.svg, reddit.svg, snapchat.svg, telegram.svg, googlebusiness.svg

### SFX Library (`public/audio/`)
- Pop: `pop-402324.mp3`
- Whoosh variants: `whoosh-effect-382717.mp3`, `whoosh-bamboo-389752.mp3`, `whoosh-large-sub-384631.mp3`
- Background: `background-music.mp3` (volume 0.02)

## Remotion Components

| Component | Use Case | z-index |
|-----------|----------|---------|
| ConceptOverlay | Full-screen concept reveal | 100 |
| AppleStylePopup | Premium white popup | 100 |
| FloatingCard | Card overlay (speaker visible) | 20 |
| PlatformCascade | Logo grid reveal | 30 |
| KineticText | Animated text | 25 |

## File Conventions

- **Compositions:** `remotion/compositions/YourCompositionName.tsx`
- **Word data:** `remotion/data/your-composition-words.ts`
- **Illustrations:** `remotion/lib/illustrations/YourIllustrations.tsx`
- **Output:** `output/` organized by type (thumbnails/, carousels/, documents/, posts/)
- **FPS:** Always 30
- **Portrait:** 1080x1920
- **Landscape:** 1920x1080

## File Organization (All Content)

```
output/
  clips/YYYY-MM-DD-slug/          # Extracted/reframed clips + clips-metadata.json
  thumbnails/YYYY-MM-DD-slug/     # YouTube thumbnails
  carousels/YYYY-MM-DD-slug/      # AI image carousels
  documents/YYYY-MM-DD-slug/      # Document carousels (HTML > PDF > PNG)
  posts/YYYY-MM-DD-slug/          # Mixed-format posts
```

**CRITICAL:** All output goes in `output/` — never to Downloads, temp, or external locations.

## Multi-Brand System

**Content creation supports multiple brands** via `brands/` directory.

| Brand | Slug | Handle | Primary Platforms |
|-------|------|--------|-------------------|
| 6FB Mentorship | `6fbarber` | @6fbarber | Instagram, YouTube |
| Tomb45 | `tomb45` | @tomb45 | Instagram, YouTube, TikTok |
| Pie Accounting | `pieaccounting` | @pieaccounting | Instagram, LinkedIn |

### Brand Commands
```bash
python3 brands/brand_manager.py active           # Show active brand
python3 brands/brand_manager.py switch <slug>     # Switch active brand
python3 brands/brand_manager.py list              # List all brands
python3 brands/brand_manager.py voice <slug>      # Output voice DNA
```

### Brand Files
```
brands/
  config.json                    # Active brand + API settings
  brand_manager.py               # CLI for brand switching
  6fbarber/
    brand.json                   # Colors, accounts, platforms
    voice-dna.md                 # Voice profile
  tomb45/
    brand.json
    voice-dna.md
  pieaccounting/
    brand.json
    voice-dna.md
```

### Quick Rules (All Brands)
- Load Voice DNA before writing ANY content
- Each brand has its own voice — never mix them
- Account IDs come from `brand.json`, never hardcode
- Open with bold claims or results, never generic greetings
- CTA is brief, at the end, not pushy

## Session Tracking

Every `/done` writes a session log to `sessions/YYYY-MM-DD-slug.md`. This creates a running history of what was built, fixed, or posted each session.

```
sessions/
  2026-03-25-onboarding-setup.md
  2026-03-25-clip-extraction-fix.md
  ...
```

`/continue` reads the latest session log to pick up where the last session left off.

## ClipQA AutoEvolver — Self-Improving Pipeline

> ⚠️ This system was built on top of the existing pipeline and skills. It does NOT replace or modify any existing skills.

The AutoEvolver is a feedback loop that autonomously improves clip quality:

```
Generate (full_pipeline.py) → Audit (Claude Vision) → Diagnose → Patch (config.yaml) → Loop
```

### Key Files

| File | Purpose |
|------|---------|
| `tools/pipeline/clip_qa_evolver.py` | Main orchestrator — parallel Generate/Audit/Diagnose/Patch loop |
| `tools/pipeline/config_patcher.py` | Safe, bounded config.yaml adjuster with rollback |
| `tools/pipeline/test_corpus.json` | 8-video test corpus (one per content type) |
| `tools/clip_extractor/config.yaml` | The tunable config — AutoEvolver patches this |

### Running a Sprint

```bash
# Quick sprint (5 iterations)
bash /Users/bossio/.gemini/antigravity/scratch/run_sprint.sh

# Manual full sprint (raw rubric — default for extraction-only)
cd tools
PYTHONPATH=. PYTHONUNBUFFERED=1 python -m pipeline.clip_qa_evolver \
  --corpus-file pipeline/test_corpus.json \
  --iterations 25 \
  --auto-patch \
  --budget 100 \
  --clips 3 \
  --rubric raw

# Production sprint (full rubric — use with --compose pipeline runs)
# python -m pipeline.clip_qa_evolver --rubric full ...

# Monitor live
tail -f /Users/bossio/.gemini/antigravity/scratch/overnight_sprint.log
```

### Two-Phase Architecture (IMPORTANT)

Sprints run in **Option A mode** (training-only) by default:
- `--no-post` is always set — clips are never published during sprints
- `--compose` is NOT passed — Remotion overlay rendering (Steps 6-9) is skipped for speed
- Only the raw Python extraction + face-tracking is evaluated by Claude Vision QA

To produce final production clips with overlays + captions, run the pipeline manually with `--compose`.

### 8 Content Types (Test Corpus)

| Type | Video | Focus |
|------|-------|-------|
| vlog | Bossio Vlog Miami FINISHED.mp4 | Erratic movement, face tracking |
| product_review | Untitled Project 7_without_silence.mp4 | Object showcase, jump cuts |
| podcast | Ecamm Live Recording 2026-01-20.mov | Multi-speaker, hooks |
| interview | Ecamm Live Recording 2026-01-22.mov | Q&A, split-screen layout |
| tutorial | VIDEO-2026-01-17-12-34-24.mp4 | Step-by-step, no visual cuts |
| motivational | Felix snowball 26.mov | High energy, punchlines |
| day_in_the_life | Barber Shopping _ My Barber Life Vlog 2015.mp4 | B-roll + talking head |
| mentorship | alexis.mov | Direct-to-camera, 1:1 framing |

### Safety Guardrails (Hard Limits — DO NOT LOWER)

These were introduced after the AutoEvolver hallucinated faces from seatbelts and windows:

| Guard | Location | Value | Reason |
|-------|----------|-------|--------|
| Min face confidence | `config_patcher.py` DEFECT_PATCH_MAP | `0.45` floor | Below 0.45 causes false positives on reflective surfaces |
| Max face regions | `split_renderer.py` `_compute_adaptive_regions()` | 3 max | Prevents micro-slicing into unusable strips |
| Max clip duration | `boundary_validator.py` | 60s hard cap | Prevents rambling clips |
| Boundary search window | `full_pipeline.py` | 5.0s | Ensures sentence boundary detection without overreach |

### FFmpeg Critical Note

When extracting clips with fast-seek (`-ss` before `-i`), the internal timestamp resets to 0:
- ✅ Use `-t {duration}` (relative duration)
- ❌ Never use `-to {end_sec}` (absolute timestamp — causes EOF with fast-seek)

This is implemented in `tools/clip_extractor/core/pipeline.py` `extract_clip()`.

### QA Scoring (Two Rubrics)

**Raw Extraction** (`--rubric raw`, default): 4 dimensions, max **40**
`frame_composition`, `face_tracking`, `hook_quality`, `ending_quality`
Target: **28+/40** (70%) — use during AutoEvolver sprints without `--compose`.

**Full Production** (`--rubric full`): 8 dimensions, max **80**
`frame_composition`, `face_tracking`, `hook_quality`, `ending_quality`, `audio_sync`, `pacing`, `multi_speaker`, `overall_watchability`
Target: **60+/80** — use for `--compose` production runs with Remotion overlays.

### Sprint Output Locations

```
output/.evolver/
  iter_clips/{content_type}/     # Raw generated clips per iteration
  reports/iteration_NNN.md       # Per-iteration score report
.learnings/ERRORS.md             # Cumulative defect log (self-improving)
tools/clip_extractor/
  config.yaml                    # Actively patched by AutoEvolver
  .config_history/               # Backup of every config version
```
