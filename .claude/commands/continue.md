---
name: continue
description: "Load project context, check system readiness, review recent work, suggest next action. Auto-invoke at session start or when user says 'continue', 'resume', 'what's next', 'pick up where we left off', 'where are we', 'status check'."
---

# /continue — Session Resume & System Check

**Load context, verify system readiness, review state, suggest next action.**

---

## Core Principle

**This command is document-driven and portable.** It reads the project's CLAUDE.md to understand conventions, checks system readiness, reviews recent work, and suggests the highest-priority next action. No hardcoded specifics.

---

## 5-Step Flow

```
LOAD CONTEXT → SYSTEM CHECK → REVIEW STATE → STATUS OUTPUT → SUGGEST NEXT
     (1)           (2)            (3)             (4)           (5)
```

---

## Step 1: Load Context

Read these files in order (skip any that don't exist):

1. **CLAUDE.md** — Project conventions, skills, rules, pipeline flow, editing architecture, APIs, file conventions
2. **README.md** — Project overview, setup requirements, quick start examples
3. **package.json** — Current dependencies and scripts
4. **.env** — Verify API keys are set (DO NOT display key values — only confirm presence)

---

## Step 2: System Readiness Check

Verify all dependencies and tools are available:

```bash
# Node.js (need 18+)
node --version

# npm packages installed?
test -d node_modules && echo "INSTALLED" || echo "MISSING"

# Python (need 3.10+)
python --version 2>/dev/null || python3 --version 2>/dev/null || py --version 2>/dev/null || echo "NOT FOUND"

# Clip extractor dependencies
py -3 -c "import mediapipe, cv2, numpy; print('OK')" 2>/dev/null || echo "CLIP EXTRACTOR DEPS MISSING"

# FFmpeg
ffmpeg -version 2>/dev/null | head -1 || echo "NOT FOUND"

# API keys present (never show values)
grep -q "ZERNIO_API_KEY" .env 2>/dev/null && echo "ZERNIO: SET" || echo "ZERNIO: MISSING"
grep -q "KIE_API_KEY" .env 2>/dev/null && echo "KIE: SET" || echo "KIE: MISSING"
grep -q "ZERNIO_PROFILE_ID" .env 2>/dev/null && echo "PROFILE ID: SET" || echo "PROFILE ID: MISSING"
```

---

## Step 3: Review Current State

### 3a: Check Output Directory

```bash
# What content has been produced?
ls output/ 2>/dev/null || echo "No output directory"
ls output/clips/ 2>/dev/null | tail -5
ls output/thumbnails/ 2>/dev/null | tail -5
ls output/carousels/ 2>/dev/null | tail -5
ls output/documents/ 2>/dev/null | tail -5
ls output/posts/ 2>/dev/null | tail -5
```

### 3b: Check for In-Progress Work

```bash
# Recent Remotion compositions
ls -lt remotion/compositions/ 2>/dev/null | head -5

# Recent word data files
ls -lt remotion/data/ 2>/dev/null | head -5

# Any video files in project root or common locations
ls *.mp4 *.mov *.webm 2>/dev/null || echo "No video files in root"
```

### 3c: Check Remotion Status

```bash
# Can Remotion render?
npx remotion compositions 2>/dev/null | head -10 || echo "Remotion not ready"
```

---

## Step 4: Status Output

Present this summary:

```markdown
## Session Resumed

**Project:** IX AI Agent Social Media Manager
**Date:** [Current date]

---

### System Readiness
| Component | Status |
|-----------|--------|
| Node.js | [version or MISSING] |
| npm packages | [Installed / MISSING] |
| Python | [version or MISSING] |
| Clip Extractor | [Ready / MISSING] |
| FFmpeg | [version or MISSING] |
| Zernio API | [Set / MISSING] |
| KIE API | [Set / MISSING] |
| Profile ID | [Set / MISSING] |

### Recent Output
- Clips: [count or none]
- Thumbnails: [count or none]
- Carousels: [count or none]
- Documents: [count or none]

### In-Progress Work
[List any recent compositions, word data, or video files found]

### What's Next
[Based on what you found, suggest the highest-priority action]

---

**What would you like to work on?**
```

---

## Step 5: Suggest Next Action

Based on state, recommend in this priority order:

1. **Fix system issues** — If any dependency is missing or API key not set
2. **Resume in-progress work** — If there are compositions without renders, or clips without posts
3. **New content** — If everything is clean, ask what content the user wants to create

---

## Output Organization Rules (CRITICAL)

**ALL content artifacts go in `output/` following this structure:**

```
output/
  clips/YYYY-MM-DD-slug/          # Extracted/reframed clips + clips-metadata.json
  thumbnails/YYYY-MM-DD-slug/     # YouTube thumbnails
  carousels/YYYY-MM-DD-slug/      # AI image carousels
  documents/YYYY-MM-DD-slug/      # Document carousels (HTML > PDF > PNG)
  posts/YYYY-MM-DD-slug/          # Mixed-format posts
```

**NEVER** save clips or content to Downloads, temp, or any location outside `output/`.
After producing any content, present the output folder to the user for review before proceeding.

---

## Pipeline Reminder

```
/clip-selection > /clip-extractor > /transcribe > /edit > /post-short
```

1. **Clip Selection** — Analyze transcript, score clips, select best moments
2. **Clip Extraction** — Face-tracking reframe (16:9 → 9:16) → `output/clips/`
3. **Transcription** — Word-level timestamps for cutting and captions
4. **Editing** — `/edit` routes to short-form or long-form editing
5. **Publishing** — `/short-form-posting` or `/youtube-content-package`

---

## Auto-Trigger Patterns

- "continue", "pick up where we left off", "resume", "what's next"
- "where are we", "status check", "what now", "what should I do"
- New conversation start

---

**Version:** 1.0
**Adapted from:** IX Content Factory /continue v2.0
**Note:** This skill dynamically reads current project state — no hardcoded plan names or versions.
