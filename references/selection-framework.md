# Clip Selection Framework

Used by `/clip-selection` Phase 0 and Phase 2. Read this before analyzing a transcript.

---

## The Job

Find moments in a long-form video that work as standalone short-form clips (45–90 seconds). The clip must be complete — it starts at a natural entry point and ends at a natural conclusion. No context required from outside the clip.

---

## 5 Clip Categories

Each clip belongs to exactly one category. Pick the strongest fit.

| Category | What it is | Hook pattern |
|----------|-----------|-------------|
| **educational** | Teaches a concept, framework, or mental model | "Here's how X actually works..." |
| **tactical** | Step-by-step how-to, tool demo, or process walkthrough | "The exact way I do X..." |
| **inspirational** | Reframe, mindset shift, or surprising result | "Most people think X. But..." |
| **personal_story** | A specific experience with a clear lesson | "When I was doing X, I realized..." |
| **entertaining** | High energy, reactive, or unexpectedly funny | Emotion-first, lesson secondary |

**Priority order:** educational > tactical > personal_story > inspirational > entertaining

When a clip could fit two categories, pick the one with the stronger hook.

---

## Selection Criteria (Apply in Order)

### Gate 1: Standalone Completeness
The clip must make complete sense without any prior context from the video.
- Fails if it references "as I mentioned earlier" or assumes prior knowledge
- Fails if the punchline depends on setup from a different segment
- Fails if it ends mid-thought

### Gate 2: Hook Quality
The first 3–5 seconds must give the viewer a reason to keep watching.
- Strong: bold claim, surprising statement, problem statement the viewer has
- Weak: "So today we're going to talk about..."
- Failing: "Okay so continuing on from before..."

### Gate 3: Single Clear Message
One insight, one story, one technique — not three.
- If you can't describe the clip's value in one sentence, it's trying to do too many things.

### Gate 4: Duration Fit
- Minimum: 45 seconds (shorter = too shallow)
- Maximum: 90 seconds (longer = loses attention)
- Ideal: 55–75 seconds

### Gate 5: Shareability
Would someone send this to a friend, save it, or repost it?
- Yes if: teaches something they'd want to remember
- Yes if: validates something they already believe
- Yes if: surprises them with a reframe they hadn't considered

---

## Anchor Word Rules

When defining clip boundaries, always use verbatim words from the transcript:

- **Minimum 5 words**, maximum 8 words per anchor
- Must be an EXACT quote — no paraphrasing
- Pick words that are unique in the transcript (not "and then" or "so basically")
- `srt_start_words`: the words where the clip begins (first spoken words)
- `srt_end_words`: the last words spoken before the clip ends

**Good anchor:** `"The problem with most people's content is"`
**Bad anchor:** `"content problem"` (too short, too ambiguous)

---

## Per-Clip Deliverables

For each selected clip, provide:

```json
{
  "id": 1,
  "title": "kebab-case-6-to-8-words",
  "srt_start_words": "exact verbatim words from transcript start",
  "srt_end_words": "exact verbatim words from transcript end",
  "time_start_estimate": 0.0,
  "time_end_estimate": 75.0,
  "hook_summary": "One sentence: what makes this moment compelling and who it's for",
  "category": "educational"
}
```

---

## Anti-Patterns

- **Never select a clip that starts with a filler phrase** ("So", "Um", "Anyway", "Like I was saying")
- **Never select clips that end with "...and that's why"** — incomplete thought
- **Never select more than 2 clips from the same segment** — diversity across the video
- **Never force a clip to fit** — if it needs trimming at both ends to work, the moment isn't there
- **Never select clips just because the topic sounds interesting** — the execution must match
