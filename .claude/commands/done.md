---
name: done
description: "Session completion — validate system, sync documents, report what was done, commit and push. Use when finished with a session or saying 'done', 'wrap up', 'commit this', 'push it', 'let's ship it'."
---

# /done — Session Completion & Sync

**Validate, sync, report, commit. One command to close out a session cleanly.**

Adapted from IX Content Factory /done v3.0 for the Social Media Manager pipeline.

---

## Core Principle

**Document-driven and portable.** Reads CLAUDE.md to understand conventions, validates the system, syncs docs, generates a report, and commits. No hardcoded specifics.

---

## 6-Phase Flow

```
DISCOVER → VALIDATE → SYNC → REPORT → COMMIT → REFLECT
   (1)        (2)       (3)     (4)      (5)      (6)
```

---

## Phase 1: Discovery — What Changed This Session

### Step 1.1: Scan Changes

```bash
# What files changed?
git diff --name-only HEAD 2>/dev/null
git diff --cached --name-only 2>/dev/null
git status --short 2>/dev/null

# Recent commits this session
git log --oneline -10 2>/dev/null
```

### Step 1.2: Classify Session Type

Based on changes, classify as one of:
- **Content Pipeline**: Clips extracted, videos edited, content posted
- **Feature Work**: New skills, components, or tools added
- **Bug Fix**: Fixes to existing pipeline or tools
- **Setup/Config**: Dependencies, API keys, environment changes
- **Documentation**: README, CLAUDE.md, skill docs updated

### Step 1.3: Check Output Directory

```bash
# What content was produced this session?
ls -lt output/clips/ 2>/dev/null | head -5
ls -lt output/thumbnails/ 2>/dev/null | head -5
ls -lt output/carousels/ 2>/dev/null | head -5
ls -lt output/documents/ 2>/dev/null | head -5
ls -lt output/posts/ 2>/dev/null | head -5
```

---

## Phase 2: Validate — System Readiness Check

### Step 2.1: Dependencies

```bash
# Node + npm packages
node --version
test -d node_modules && echo "INSTALLED" || echo "MISSING"

# Python + clip extractor
py --version 2>/dev/null || python --version 2>/dev/null || python3 --version 2>/dev/null
py -3 -c "import mediapipe, cv2, numpy, filterpy, rapidfuzz; print('ALL OK')" 2>/dev/null || echo "CLIP EXTRACTOR DEPS INCOMPLETE"

# FFmpeg
ffmpeg -version 2>/dev/null | head -1 || echo "MISSING"
```

### Step 2.2: API Keys

```bash
# Verify keys are set (NEVER display values)
grep -q "ZERNIO_API_KEY=." .env 2>/dev/null && echo "ZERNIO: SET" || echo "ZERNIO: MISSING"
grep -q "KIE_API_KEY=." .env 2>/dev/null && echo "KIE: SET" || echo "KIE: MISSING"
grep -q "ZERNIO_PROFILE_ID=." .env 2>/dev/null && echo "PROFILE ID: SET" || echo "PROFILE ID: MISSING"
```

### Step 2.3: Remotion Check

```bash
# Can Remotion list compositions?
npx remotion compositions 2>/dev/null | head -5 || echo "REMOTION NOT READY"
```

### Step 2.4: Build Check

```bash
# TypeScript / build validation
npx tsc --noEmit 2>/dev/null && echo "BUILD: PASS" || echo "BUILD: ISSUES"
```

**IF ANY CRITICAL GATE FAILS:** Flag the issue. Don't block the commit for non-critical warnings, but report them.

---

## Phase 3: Sync — Update Documentation

### Step 3.1: CLAUDE.md Sync

Check if any of these changed and need CLAUDE.md updates:
- **package.json** changed → update tech stack if new dependencies added
- **New skills added** → update Skills table
- **New components** → update Remotion Components table
- **New audio/assets** → update Brand Assets section
- **Pipeline changes** → update Pipeline Flow

### Step 3.2: README.md Sync

Check if setup instructions need updates:
- **requirements.txt** changed → update install instructions
- **New API keys needed** → update API keys section
- **New system requirements** → update Requirements section

### Step 3.3: Skill Docs Sync

For any skills modified this session:
- Verify the SKILL.md description matches current behavior
- Verify trigger words are accurate

### Step 3.4: Output Organization Audit

Verify all produced content follows the convention:
```
output/
  clips/YYYY-MM-DD-slug/          # Extracted/reframed clips + clips-metadata.json
  thumbnails/YYYY-MM-DD-slug/     # YouTube thumbnails
  carousels/YYYY-MM-DD-slug/      # AI image carousels
  documents/YYYY-MM-DD-slug/      # Document carousels (HTML > PDF > PNG)
  posts/YYYY-MM-DD-slug/          # Mixed-format posts
```

**IF content is in wrong location:** Move it to the correct `output/` subdirectory before committing.

---

## Phase 4: Report — Session Summary

Generate a summary for the user:

```markdown
## Session Complete

**Date:** [Current date]
**Type:** [Session type from Phase 1]

---

### What Was Done
- [List of main accomplishments]

### System Status
| Component | Status |
|-----------|--------|
| Node.js | [version] |
| npm packages | [OK/Issues] |
| Python | [version] |
| Clip Extractor | [OK/Issues] |
| FFmpeg | [OK/Issues] |
| Zernio API | [Set/Missing] |
| KIE API | [Set/Missing] |
| Build | [Pass/Issues] |

### Content Produced
- Clips: [count and location]
- Thumbnails: [count and location]
- Carousels: [count and location]
- Posts: [count and location]

### Documents Updated
- [List of docs that were synced]

### Issues Found
- [Any warnings or problems detected]

### What's Next
- [Suggested next actions based on current state]
```

---

## Phase 5: Commit & Push

### Step 5.1: Stage Changes

Stage specific files (never blindly `git add -A`):
- Changed source files
- Updated documentation
- New skills/commands
- **EXCLUDE:** `.env`, `node_modules/`, any secrets

### Step 5.2: Commit

```bash
git commit -m "$(cat <<'EOF'
[type]: [Brief description]

- [Change 1]
- [Change 2]
- System validated: all checks passing

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

Commit types: `feat`, `fix`, `docs`, `chore`, `refactor`, `pipeline`

### Step 5.3: Push

```bash
git push origin main
```

**IMPORTANT:** Always confirm with the user before pushing. Show them the commit message and changed files first.

---

## Phase 6: Reflect — Learnings

### Step 6.1: Session Learnings

Note any:
- Bugs discovered and fixed (especially non-obvious root causes)
- Pipeline improvements made
- New patterns established
- Things that should be documented for future sessions

### Step 6.2: Evolution Check

- Any repeated manual steps that should become a skill?
- Any documentation gaps discovered?
- Any dependency issues that should be noted in README?

### Step 6.3: Final Output

```markdown
**Session closed.**
**Commit:** [hash] — [message]
**Push:** [success/failed]

Ready for next session? Use `/continue` to pick up where you left off.
```

---

## Auto-Trigger Patterns

- "done", "/done", "finished", "wrap up"
- "commit this", "push it", "let's ship it"
- "save everything", "close out"

---

## Output Organization Rules (CRITICAL)

Same as `/continue` — all content goes in `output/` following the date-slug convention.
Never save to Downloads, temp, or external locations.

---

**Version:** 1.0
**Adapted from:** IX Content Factory /done v3.0
**Note:** This skill dynamically reads current project state — no hardcoded plan names or versions.
