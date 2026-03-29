# Clip Scoring Framework

Used by `/clip-selection` Phase 0 and Phase 3. Read this before scoring any clip.

---

## Overview

Each clip is scored across 5 dimensions. Max score is 100 (20 per dimension). Score every clip before ranking.

---

## Dimension 1: Hook Strength (0–20)

Does the first 3 seconds give the viewer a reason to keep watching?

| Score | What it means |
|-------|--------------|
| 18–20 | Bold claim, surprising statement, or compelling problem that makes stopping feel wrong |
| 14–17 | Clear setup with a payoff implied — viewer senses they'll learn something |
| 10–13 | Decent opening but generic — "Today I want to talk about..." type energy |
| 6–9 | Weak entry — requires context, starts with a filler phrase, or feels mid-thought |
| 0–5 | No hook — viewer has no reason to continue past the first 3 seconds |

**Tip:** Say the first 3 seconds out loud. Would you keep scrolling or stop?

---

## Dimension 2: Value Delivery (0–20)

Does the clip deliver a clear, actionable insight?

| Score | What it means |
|-------|--------------|
| 18–20 | Teaches something specific and immediately applicable — viewer walks away knowing something new |
| 14–17 | Solid insight with some generality — useful but not immediately actionable |
| 10–13 | Surface-level observation — interesting but not teachable |
| 6–9 | Entertainment value only — no real learning transfer |
| 0–5 | No clear value — meandering, context-dependent, or incomplete |

---

## Dimension 3: Clarity (0–20)

One message, delivered cleanly. No confusion, no tangents.

| Score | What it means |
|-------|--------------|
| 18–20 | Single clear thesis, no detours, ends at the right moment |
| 14–17 | Mostly clear with one minor tangent or redundancy |
| 10–13 | Two ideas competing — viewer might not know what the main point is |
| 6–9 | Jumpy, hard to follow, or requires external context |
| 0–5 | Multiple unrelated ideas — no coherent message |

---

## Dimension 4: Shareability (0–20)

Would someone send this to a friend, save it, or repost it?

| Score | What it means |
|-------|--------------|
| 18–20 | Has a clear "I need to send this to someone" or "I want to remember this" quality |
| 14–17 | Interesting enough that someone might share — but not compelled to |
| 10–13 | Good content but doesn't stand out from a platform feed |
| 6–9 | Hard to share without additional context |
| 0–5 | Would not survive outside the original video |

**High shareability signals:** contrarian take, surprising number, reframe of a common belief, tactical step others can immediately copy

---

## Dimension 5: Completeness (0–20)

Does it start and end naturally? No awkward cuts.

| Score | What it means |
|-------|--------------|
| 18–20 | Perfect in/out — starts at the right breath, ends with a clean landing |
| 14–17 | Good boundaries with minor awkwardness at start or end |
| 10–13 | One boundary is clearly off — starts mid-thought or ends abruptly |
| 6–9 | Both boundaries feel forced — needs a lot of work to feel complete |
| 0–5 | Cannot stand alone — fundamentally incomplete |

---

## Total Score Interpretation

| Total | Meaning | Action |
|-------|---------|--------|
| 85–100 | Great clip — post it | Priority selection |
| 70–84 | Good clip — worth extracting | Include if clip count allows |
| 55–69 | Decent but improvable | Flag for improvement, include if short on options |
| 40–54 | Below threshold | Only use if nothing better exists |
| 0–39 | Skip | Don't extract |

**Default minimum for selection:** 55. Flag anything below 70 with `best_improvement` note.

---

## Per-Clip Score Output

```json
{
  "id": 1,
  "rank": 1,
  "title": "clip-title-kebab-case",
  "hook_strength": 18,
  "value_delivery": 17,
  "clarity": 19,
  "shareability": 18,
  "completeness": 18,
  "total_score": 90,
  "category": "educational",
  "caption": "Hook line. Value sentence. CTA. (<150 words total)",
  "best_improvement": "What would push this clip to 95+"
}
```

---

## Ranking Ties

When two clips have the same `total_score`, rank by `hook_strength` (higher wins). If still tied, rank by `shareability`.
