# Session: Onboarding & System Setup

**Date:** 2026-03-25
**Type:** Setup / Feature Work

## What Was Done
- Full system onboarding: installed npm packages (Remotion), verified Python 3.14 + clip extractor deps, confirmed FFmpeg
- Created `.env` with Zernio API key, profile ID, and KIE API key
- Created `.gitignore` to protect secrets and keep large files out of git
- Added `/continue` session resume command (adapted from IX Content Factory v2.0)
- Added `/done` session completion command (adapted from IX Content Factory v3.0)
- Created Voice DNA skill with Enrique's full voice profile for all written content
- Updated CLAUDE.md: added clip extractor pipeline docs, session commands, Voice DNA rule, session tracking, clips output path
- Updated README.md: explicit Python dependency list, cv2 troubleshooting, session commands, ZERNIO_PROFILE_ID
- Fixed short-form-posting thumbnail format: `"thumbnail": "URL"` string (not object), added `containsSyntheticMedia: true`
- Removed outdated `.env.example` (referenced old LATE_API_KEY)
- Registered ClaudeCodeVsOpenClaw composition in Remotion

## Content Produced
- No content produced this session (setup/onboarding focus)

## Issues Found & Fixed
- Python appeared missing but was available via `py` launcher (Windows)
- Clip extractor deps were already installed
- `.env.example` was outdated — referenced LATE_API_KEY instead of ZERNIO_API_KEY
- Short-form-posting had wrong thumbnail format (`{"url": "..."}` instead of `"URL"` string)
- output/clips/ had 550MB of video files that needed to stay out of git

## Documents Updated
- CLAUDE.md — skills table, rules, clip extractor docs, session commands, Voice DNA rule, tone section, session tracking, file organization
- README.md — setup instructions, Python deps, troubleshooting, session commands
- .claude/commands/continue.md — new file
- .claude/commands/done.md — new file
- .claude/skills/voice-dna/SKILL.md — new file
- .claude/skills/short-form-posting/SKILL.md — thumbnail format fix
- .gitignore — new file

## What's Next
- Complete Late → Zernio API URL rename across remaining skills (31 files still reference getlate.dev)
- Update hardcoded old API key in skills to reference env var $ZERNIO_API_KEY
- Fix YouTube content package thumbnail format (same fix as short-form-posting)
- Connect social media accounts in Zernio dashboard
- Test a real post end-to-end

## Commits
- `5816ba3` — feat: Add session commands, fix setup docs, fix thumbnail format
- [pending] — feat: Add Voice DNA skill, session tracking
