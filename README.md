<p align="center">
  <img src="assets/ix-logo.png" alt="INFINITX AI" width="120" />
</p>

<h1 align="center">IX AI Agent Social Media Manager</h1>

<p align="center">
  <strong>Create, edit, and publish content across 13+ platforms. All from your coding agent.<br/>Thumbnails. Video editing. Carousels. Distribution. 16 skills. One repo.</strong>
</p>

---

## What's Inside

### Distribution (3 skills)
- **late-social-media** -- Post to 13+ platforms via Zernio (Twitter, LinkedIn, Instagram, YouTube, TikTok, Threads, and more)
- **short-form-posting** -- Optimized for Shorts, Reels, and TikTok with unique captions per platform
- **youtube-content-package** -- Complete YouTube packages (title, description, tags, timestamps, thumbnail)

### Visual Creation (3 skills)
- **thumbnail-creator** -- YouTube thumbnails via KIE AI with face compositing and bold text
- **carousel-generator** -- Multi-slide image carousels for LinkedIn and Instagram
- **document-carousel** -- Educational documents as HTML, converted to PDF, extracted as page images

### Video Pipeline (8 skills)
- **clip-extractor** -- Face-tracking reframe (16:9 to 9:16) with MediaPipe and Kalman smoothing
- **clip-selection** -- Analyze transcripts, score moments, select best clips
- **edit** -- Entry point router that detects format and dispatches
- **video-editing** -- Shared component library and editing rules
- **short-form-editing** -- Polished short-form edits (<90s) with Remotion
- **long-form-editing** -- Long-form video editing (5+ min) with Remotion
- **extracting-transcripts** -- Word-level transcription for cutting and captions
- **visual-overlay-creation** -- Create custom illustrations for video overlays

### Utility (2 skills)
- **video-upload-helper** -- Compress and upload video files
- **content-analytics** -- Track post performance across platforms

---

## Tools Included

| Tool | What It Does |
|------|-------------|
| **Remotion** | React video compositions. 68 components, 22 compositions, 60 illustrations. Frame-perfect at 30fps. |
| **Clip Extractor** | Python face-tracking pipeline. MediaPipe detection, Kalman smoothing, 4 layout modes. |

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/Trejon-888/ix-ai-agent-social-media-manager.git
cd ix-ai-agent-social-media-manager
```

### 2. Install dependencies

```bash
# Remotion (video engine)
npm install

# Clip Extractor (Python face-tracking pipeline)
# Requires Python 3.10+ and pip
pip install -r tools/clip_extractor/requirements.txt
```

The clip extractor requires these Python packages (all listed in `requirements.txt`):
- **mediapipe** -- Face detection (BlazeFace)
- **opencv-contrib-python** -- Video frame processing (cv2)
- **numpy** -- Array operations
- **filterpy** -- Kalman filter for temporal smoothing
- **pyyaml** -- Config parsing
- **rapidfuzz** -- Fuzzy text matching

> **Troubleshooting:** If clip extraction produces a static center crop instead of face-tracking, verify that `opencv-contrib-python` installed correctly: `python -c "import cv2; print(cv2.__version__)"`. This is the most common setup issue.

### 3. Set API keys

Create a `.env` file in the project root:

```bash
ZERNIO_API_KEY=your-zernio-api-key        # Required: zernio.com (free to start)
ZERNIO_PROFILE_ID=your-profile-id         # Required: from your Zernio dashboard
KIE_API_KEY=your-kie-api-key              # Optional: kie.ai (for thumbnails/carousels)
```

### 4. Open in Claude Code

```bash
claude
```

That's it. Claude Code reads the skills automatically. Say "post to LinkedIn" or "create a thumbnail" and it works.

### Session Commands

Once you're in Claude Code:
- **`/continue`** -- Resume a session. Loads context, checks system readiness, reviews recent work, suggests what to do next.
- **`/done`** -- Close a session. Validates system, syncs docs, generates a report, commits and pushes.

---

## Quick Start Examples

**Post to social media:**
> "Post this to Twitter and LinkedIn: Just shipped a new feature that lets AI agents manage your entire content pipeline."

**Create a thumbnail:**
> "Create a YouTube thumbnail for my video about AI agents running businesses"

**Extract clips from a recording:**
> "Extract the best 3 clips from recording.mp4 and reframe them for TikTok"

**Full YouTube package:**
> "Create a full YouTube package for my latest video -- title, description, tags, timestamps, and thumbnail"

See `examples/` for more detailed walkthroughs.

---

## Requirements

- **Claude Code** (or any Claude-powered coding agent)
- **Node.js 18+** (for Remotion video engine)
- **Python 3.10+** with pip (for clip extractor -- face detection, tracking, reframe)
- **FFmpeg** (for video processing -- [download](https://ffmpeg.org/download.html) or `winget install Gyan.FFmpeg`)
- **Zernio API key** ([zernio.com](https://zernio.com) -- free to start) for social media posting
- **KIE API key** ([kie.ai](https://kie.ai)) for AI image generation (optional)

---

## IX Creator Community

This repo is part of the **IX Creator Community** -- builders, product leaders, and creators working with autonomous intelligence to build businesses that run themselves.

**Three pillars:**
- **Autonomous Operations** -- Context management, self-operating systems, the intelligence running your business so you don't have to.
- **Products + Partners** -- Real products built by real builders. If you want to sell, there's something ready. If you want to build, there's everything you need.
- **Life Empowerment** -- Your business is an extension of you. We're here for the whole person, not just the tech stack.

[Join the IX Creator Community on Discord](https://discord.gg/s5ygK4pQZG)

Create more. Consume less.

---

Built by [Enrique Marq](https://youtube.com/@enriquemarq-0) / [AI Growth Partner](https://aigrowthpartner.ai)
