#!/usr/bin/env python3
"""Full IX Content Pipeline — End-to-end clip production.

Chains: Transcribe → Select → Validate → Reframe → Analyze → Compose → Render → Notify

Usage:
    python tools/pipeline/full_pipeline.py \\
        --video "path/to/video.mp4" \\
        --brand 6fbarber \\
        --clips 5 \\
        --no-post

    # With existing transcript:
    python tools/pipeline/full_pipeline.py \\
        --video "path/to/video.mp4" \\
        --transcript "path/to/transcript.srt" \\
        --brand 6fbarber \\
        --clips 3

    # With AutoResearcher experiment:
    python tools/pipeline/full_pipeline.py \\
        --video "path/to/video.mp4" \\
        --brand 6fbarber \\
        --experiment
"""

import argparse
import json
import os
import subprocess
import sys
import time
from pathlib import Path
from datetime import datetime, timezone

# Add project root to path
PROJECT_ROOT = Path(__file__).parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT / "tools"))

from clip_extractor.selection.boundary_validator import (
    validate_and_fix_boundaries,
    validated_to_clip_definitions,
)
from clip_extractor.analytics.performance_tracker import PerformanceTracker
from pipeline.overlay_matcher import generate_clip_spec
from pipeline.discord_notify import notify_clip_ready, notify_spec_ready, notify_error
from pipeline.ai_composer import compose_clip


def transcribe(video_path: str, output_dir: str, method: str = "auto") -> str:
    """Transcribe video to SRT format.

    Methods:
        auto — try mlx-whisper (Metal GPU, fastest), fall back to whisper CLI
        mlx — MLX Whisper on Apple Silicon Metal GPU (~15x realtime on M3 Max)
        whisper — OpenAI Whisper CLI (slow on CPU)
        api — IX Toolkit cloud API (requires internet)
    """
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Check for existing transcript
    existing_srt = list(output_dir.glob("*.srt"))
    if existing_srt:
        print(f"[pipeline] Found existing transcript: {existing_srt[0]}")
        return str(existing_srt[0])

    print("[pipeline] Transcribing video...")
    start_time = time.time()

    # Try MLX Whisper first (Metal GPU, ~15x realtime on M3 Max)
    if method in ("auto", "mlx"):
        try:
            import mlx_whisper

            print("[pipeline] Using MLX Whisper (Metal GPU)...")
            result = mlx_whisper.transcribe(
                video_path,
                path_or_hf_repo="mlx-community/whisper-small-mlx",
                word_timestamps=True,
            )

            # Convert to SRT format
            video_name = Path(video_path).stem
            srt_path = output_dir / f"{video_name}.srt"

            segments = result.get("segments", [])
            with open(srt_path, "w", encoding="utf-8") as f:
                for i, seg in enumerate(segments, 1):
                    start_ts = _format_srt_time(seg["start"])
                    end_ts = _format_srt_time(seg["end"])
                    text = seg["text"].strip()
                    f.write(f"{i}\n{start_ts} --> {end_ts}\n{text}\n\n")

            # ── Save word-level timestamps (used by caption generator in Step 6) ──
            _save_word_timestamps(result, str(output_dir), video_name)

            elapsed = time.time() - start_time
            speed = float(segments[-1]["end"]) / elapsed if segments else 0
            print(f"[pipeline] Transcription complete in {elapsed:.1f}s ({speed:.1f}x realtime): {srt_path}")
            return str(srt_path)

        except ImportError:
            if method == "mlx":
                raise RuntimeError("mlx-whisper not installed. Run: pip install mlx-whisper")
            print("[pipeline] mlx-whisper not available, falling back to whisper CLI...")

    # Fallback: whisper CLI
    if method in ("auto", "whisper"):
        cmd = [
            "whisper", video_path,
            "--model", "small",
            "--output_format", "srt",
            "--output_dir", str(output_dir),
            "--language", "en",
        ]
        print(f"[pipeline] Using Whisper CLI (CPU — this may be slow)...")
        result = subprocess.run(cmd, capture_output=True, text=True)

        if result.returncode != 0:
            print(f"[pipeline] Whisper failed: {result.stderr[:200]}")
            raise RuntimeError("Transcription failed")

        srt_files = list(output_dir.glob("*.srt"))
        if not srt_files:
            raise RuntimeError("No SRT file produced")

        elapsed = time.time() - start_time
        print(f"[pipeline] Transcription complete in {elapsed:.0f}s: {srt_files[0]}")
        return str(srt_files[0])

    elif method == "api":
        raise NotImplementedError(
            "IX Toolkit API requires video upload. Use mlx or whisper for local files."
        )

    else:
        raise ValueError(f"Unknown transcription method: {method}")


def _format_srt_time(seconds: float) -> str:
    """Format seconds to SRT timestamp: HH:MM:SS,mmm"""
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int((seconds % 1) * 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def _save_word_timestamps(result: dict, output_dir: str, video_name: str) -> str | None:
    """Extract word-level timestamps from MLX Whisper result and save as words.json.

    Format: [{"word": str, "start": float, "end": float}, ...]
    This is consumed by generate_captions_for_clip in Step 6.
    """
    words = []
    for seg in result.get("segments", []):
        seg_words = seg.get("words", [])
        if seg_words:
            for w in seg_words:
                word_text = w.get("word", "").strip()
                if word_text:
                    words.append({
                        "word": word_text,
                        "start": round(w.get("start", seg["start"]), 3),
                        "end":   round(w.get("end",   seg["end"]),   3),
                    })
        else:
            # No word-level data — split segment text and interpolate
            text_words = seg.get("text", "").strip().split()
            if text_words:
                dur = (seg["end"] - seg["start"]) / len(text_words)
                for i, word in enumerate(text_words):
                    words.append({
                        "word":  word,
                        "start": round(seg["start"] + i * dur, 3),
                        "end":   round(seg["start"] + (i + 1) * dur, 3),
                    })

    if not words:
        return None

    words_path = Path(output_dir) / f"{video_name}_words.json"
    with open(words_path, "w") as f:
        json.dump(words, f, indent=2)
    print(f"[pipeline] Saved {len(words)} word timestamps → {words_path.name}")
    return str(words_path)


def _interpolate_words_from_srt(srt_path: str, clip_start: float, clip_end: float) -> list:
    """Fallback: parse SRT segments and interpolate per-word timings."""
    import re as _re
    SRT_TS = _re.compile(
        r'(\d{2}:\d{2}:\d{2}[,.]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,.]\d{3})'
    )

    def to_sec(ts: str) -> float:
        ts = ts.replace(",", ".")
        h, m, s = ts.split(":")
        return int(h) * 3600 + int(m) * 60 + float(s)

    words = []
    try:
        with open(srt_path, encoding="utf-8") as f:
            content = f.read()
        blocks = content.strip().split("\n\n")
        for block in blocks:
            lines = block.strip().splitlines()
            if len(lines) < 3:
                continue
            m = SRT_TS.search(lines[1])
            if not m:
                continue
            seg_start, seg_end = to_sec(m.group(1)), to_sec(m.group(2))
            if seg_end < clip_start or seg_start > clip_end:
                continue
            text = " ".join(lines[2:]).strip()
            seg_words = text.split()
            if not seg_words:
                continue
            dur = (seg_end - seg_start) / len(seg_words)
            for i, word in enumerate(seg_words):
                w_start = seg_start + i * dur
                w_end   = w_start + dur
                if w_start >= clip_start - 0.1 and w_end <= clip_end + 0.1:
                    words.append({"word": word, "start": round(w_start, 3), "end": round(w_end, 3)})
    except Exception as e:
        print(f"  ⚠️  SRT word interpolation failed: {e}")
    return words


def generate_captions_for_clip(
    words_json_path: str | None,
    srt_path: str,
    clip_start: float,
    clip_end: float,
    output_path: str,
) -> str | None:
    """Build a captions.json for one clip's time range.

    Tries word-level words.json first (accurate), falls back to SRT
    interpolation if word timestamps aren't available.

    Returns the output_path on success, None on failure.
    """
    try:
        if words_json_path and Path(words_json_path).exists():
            with open(words_json_path) as f:
                all_words = json.load(f)
            clip_words = [
                {"word": w["word"], "start": w["start"], "end": w["end"]}
                for w in all_words
                if w.get("start", 0) >= clip_start - 0.1
                and w.get("end",   0) <= clip_end   + 0.1
            ]
        else:
            clip_words = _interpolate_words_from_srt(srt_path, clip_start, clip_end)

        if not clip_words:
            print(f"  ⚠️  No caption words found for [{clip_start:.1f}s → {clip_end:.1f}s]")
            return None

        with open(output_path, "w") as f:
            json.dump(clip_words, f, indent=2)
        print(f"  📝 Captions: {len(clip_words)} words → {Path(output_path).name}")
        return output_path

    except Exception as e:
        print(f"  ⚠️  Caption generation failed: {e}")
        return None


def parse_transcript(srt_path: str, output_dir: str) -> str:
    """Parse SRT into formatted transcript using clip_extractor."""
    output_path = Path(output_dir) / "formatted_transcript.txt"

    cmd = [
        sys.executable, "-m", "clip_extractor", "select", "parse",
        "--transcript", str(Path(srt_path).resolve()),
        "--output", str(Path(output_path).resolve()),
    ]
    result = subprocess.run(
        cmd, capture_output=True, text=True,
        cwd=str(PROJECT_ROOT / "tools"),
    )

    if result.returncode != 0:
        print(f"[pipeline] Parse failed: {result.stderr[:200]}")
        raise RuntimeError("Transcript parsing failed")

    print(result.stdout.strip())
    return str(output_path)


def batch_reframe(
    video_path: str,
    clips: list,
    output_dir: str,
    aspect_ratio: str = "9x16",
) -> list:
    """Batch reframe clips using clip_extractor."""
    # Write clip definitions
    clips_path = Path(output_dir) / "validated_clip_definitions.json"
    with open(clips_path, "w") as f:
        json.dump({"clips": clips}, f, indent=2)

    cmd = [
        sys.executable, "-m", "clip_extractor", "batch",
        "--video", str(Path(video_path).resolve()),
        "--clips", str(clips_path.resolve()),
        "--output", str(Path(output_dir).resolve()),
        "--format", aspect_ratio,
    ]

    print(f"\n[pipeline] Batch reframing {len(clips)} clips to {aspect_ratio}...")
    result = subprocess.run(
        cmd, capture_output=True, text=True,
        cwd=str(PROJECT_ROOT / "tools"),
    )

    # Show subprocess output
    if result.stdout:
        print(result.stdout)

    if result.returncode != 0:
        print(f"[pipeline] ⚠️  clip_extractor batch failed (exit {result.returncode})")
        print(f"[pipeline] stderr tail: {result.stderr[-400:]}")
        print(f"[pipeline] Falling back to per-clip center-crop extraction...")
        return []   # Caller will handle via fallback path

    # Find output files — check both the requested format and split (auto-routed)
    outputs = []
    for clip in clips:
        clip_dir = Path(output_dir) / f"clip-{clip['id']:02d}-{clip['title']}"
        # Try requested format first, then auto-routed formats as fallbacks
        candidate_names = [
            f"reframed-{aspect_ratio}.mp4",
            "reframed-split.mp4",
            "reframed-9x16.mp4",
        ]
        reframed = None
        for name in candidate_names:
            candidate = clip_dir / name
            if candidate.exists():
                reframed = candidate
                break
        if reframed and reframed.exists():
            outputs.append({
                "clip_id": clip["id"],
                "title": clip["title"],
                "path": str(reframed),
            })

    return outputs


def _fallback_center_crop(
    video_path: str,
    clips: list,
    output_dir: str,
    aspect_ratio: str = "9x16",
) -> list:
    """Emergency fallback: extract clips with a static center crop via FFmpeg.

    Used when face-tracking batch_reframe fails (e.g. no face detected, encoder
    gets zero frames). Produces a watchable clip — not perfectly framed, but
    something the QA scorer can evaluate and improve upon.
    """
    import shutil
    if not shutil.which("ffmpeg"):
        print("[fallback] ffmpeg not found — cannot produce fallback clips")
        return []

    # Target dimensions for the aspect ratio
    DIMS = {
        "9x16": ("iw*9/16", "ih"),        # vertical center crop
        "1x1":  ("ih",       "ih"),         # square center crop
        "4x5":  ("iw*4/5",  "ih"),
        "split": ("iw*9/16", "ih"),
        "auto":  ("iw*9/16", "ih"),
    }
    cw, ch = DIMS.get(aspect_ratio, DIMS["9x16"])

    outputs = []
    for clip in clips:
        clip_dir = Path(output_dir) / f"clip-{clip['id']:02d}-{clip['title']}"
        clip_dir.mkdir(parents=True, exist_ok=True)
        out_path = clip_dir / f"reframed-{aspect_ratio}.mp4"

        start = clip.get("start", 0)
        duration = clip.get("end", start + 30) - start
        if duration <= 0:
            continue

        # Center crop filter: crop to target ratio, then scale to 1080x1920
        vf = f"crop={cw}:{ch}:(iw-({cw}))/2:(ih-({ch}))/2,scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2"

        cmd = [
            "ffmpeg", "-y",
            "-ss", str(start),
            "-i", str(video_path),
            "-t", str(duration),
            "-vf", vf,
            "-c:v", "libx264", "-preset", "fast", "-crf", "23",
            "-c:a", "aac", "-b:a", "128k",
            "-movflags", "+faststart",
            str(out_path),
        ]

        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0 and out_path.exists() and out_path.stat().st_size > 10000:
            print(f"[fallback] ✅ clip-{clip['id']:02d} center-crop ok ({duration:.1f}s)")
            outputs.append({"clip_id": clip["id"], "title": clip["title"], "path": str(out_path)})
        else:
            print(f"[fallback] ❌ clip-{clip['id']:02d} failed: {result.stderr[-200:]}")

    return outputs


def run_pipeline(
    video_path: str,
    brand: str = "6fbarber",
    num_clips: int = 5,
    transcript_path: str = None,
    output_dir: str = None,
    no_post: bool = True,
    run_experiment: bool = False,
    aspect_ratio: str = "9x16",
    compose: bool = False,
    notify: bool = False,
    content_type: str = "vlog",
    logo_override: str = None,
):
    """Run the full content pipeline end-to-end."""
    # 'auto' is handled by the clip extractor's intelligent format router.
    # It will analyze face cluster density and pick '9x16' (solo) or 'split' (multi-person).
    # Only normalize truly unknown values as a safety net.
    if aspect_ratio not in ("9x16", "1x1", "4x5", "split", "auto"):
        aspect_ratio = "9x16"

    video_name = Path(video_path).stem.lower().replace(" ", "-")
    if not output_dir:
        output_dir = str(PROJECT_ROOT / "output" / "clips" / video_name)

    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    print("=" * 60)
    print("IX Content Pipeline")
    print("=" * 60)
    print(f"  Video:    {video_path}")
    print(f"  Brand:    {brand}")
    print(f"  Clips:    {num_clips}")
    print(f"  Format:   {aspect_ratio}")
    print(f"  Post:     {'No (dry run)' if no_post else 'Yes'}")
    print(f"  Output:   {output_dir}")
    if run_experiment:
        print(f"  Mode:     AutoResearcher experiment")
    print("=" * 60)

    tracker = PerformanceTracker(str(output_path / ".analytics"))

    total_steps = 9 if compose else 5

    # --- Step 1: Transcribe ---
    print(f"\n📝 Step 1/{total_steps}: Transcription")
    if transcript_path:
        srt_path = transcript_path
        print(f"[pipeline] Using provided transcript: {srt_path}")
    else:
        srt_path = transcribe(video_path, output_dir)

    # --- Step 2: Parse transcript ---
    print(f"\n📋 Step 2/{total_steps}: Parsing transcript")
    formatted_path = parse_transcript(srt_path, output_dir)

    # --- Step 3: Clip selection ---
    print(f"\n🎯 Step 3/{total_steps}: AI clip selection")
    print("[pipeline] Clip selection requires AI analysis of the transcript.")
    print(f"[pipeline] Transcript ready at: {formatted_path}")
    print(f"[pipeline] Request: Select the top {num_clips} clips for {brand}.")

    # Check if clip selections already exist
    selections_path = output_path / "clip_selections.json"
    if selections_path.exists():
        print(f"[pipeline] Found existing selections: {selections_path}")
        with open(selections_path) as f:
            selections = json.load(f)
        clips_raw = selections.get("selections", [])
    else:
        print("[pipeline] 🧠 Generating clip selections via Anthropic API...")
        from pipeline.ai_composer import call_claude
        
        with open(formatted_path, "r", encoding="utf-8") as f:
            transcript_text = f.read()

        prompt = f"""You are a master social media content strategist for the brand '{brand}'.
Analyze this video transcript and identify highly engaging, viral clip boundaries for 30-60 second shorts.
ABSOLUTE MAXIMUM: 60 seconds. Clips over 60 seconds will be REJECTED.

CRITICAL REQUIREMENTS FOR EACH CLIP:
1. STRONG HOOK (first 3 seconds): The clip MUST start on a bold, attention-grabbing statement — 
   a surprising number, a controversial claim, a rhetorical question, or a pattern interrupt.
   NEVER start mid-sentence.
   CRITICAL NEGATIVE CONSTRAINT: DO NOT start the clip with transition words. 
   Reject any sentence that starts with: "So", "And", "But", "Because", "Well", "Basically", "Like", "Honestly", "You know", "I mean".
   Reject any clip that starts in the MIDDLE of a train of thought — if understanding the clip requires hearing what came before, it's NOT a valid hook.
   The first words the viewer hears must make them STOP scrolling. Test: would this first sentence work as a cold open with zero context?

2. STRONG FINISH (last 3 seconds): The clip MUST end on a memorable payoff — 
   a punchline, a call-to-action moment, a revelation, or a statement that reinforces the core message.
   NEVER end mid-thought or mid-sentence. The last words should feel conclusive.

3. HIGH-VALUE CONTENT: The clip body must contain actionable advice, a surprising insight, 
   a real number/result, or an emotionally resonant story beat.

Phase 2 - QA Audit:
Before you write your JSON output, internally critique your selected hooks. Ask yourself: "Is this first sentence actually a hook? Will they scroll away?". If the hook starts mid-thought or uses a boring transition word, adjust the start boundary to find the true pattern interrupt or replace the clip entirely. ONLY output clips that pass this rigorous QA audit!

Filter criteria:
- Look for controversial, highly educational, or intensely motivational statements.
- Each clip must have a "total_score" rating from 0 to 100 on how engaging it is. (Pass QA requires 85+)
- Each clip MUST be between 30-60 seconds. Score any clip over 60s as 0.
- Prioritize clips with natural setup → buildup → payoff structure.
- Provide verbatim 5-word quotes for both the exact Start and End of each segment.

CRITICAL: Do NOT output any conversational text, pleasantries, or your internal critique. You must ONLY output pure JSON exactly in this schema:
{{
  "selections": [
    {{
      "id": 1,
      "title": "A highly clickable title (5-8 words, no clickbait)",
      "srt_start_words": "the exact five words of...",
      "srt_end_words": "...the final five words stated",
      "time_start_estimate": 0.0,
      "time_end_estimate": 60.0,
      "category": "EDUCATIONAL",
      "total_score": 92,
      "hook_preview": "first 10 words of clip",
      "payoff_preview": "last 10 words of clip"
    }}
  ]
}}

Transcript (with timestamps):
{transcript_text}"""
        
        try:
            import re
            api_key = os.environ.get("ANTHROPIC_API_KEY", "")
            raw_response = call_claude(prompt, api_key)
            cleaned = raw_response.strip()
            
            # Find the JSON block using regex to ignore any conversational padding
            json_match = re.search(r'(\{.*\})', cleaned, re.DOTALL)
            if json_match:
                cleaned = json_match.group(1)
            else:
                if cleaned.startswith("```json"): cleaned = cleaned[7:]
                elif cleaned.startswith("```"): cleaned = cleaned[3:]
                if cleaned.endswith("```"): cleaned = cleaned[:-3]
            
            selections = json.loads(cleaned.strip())
            
            # Formally Resolve the text quotes into exact SRT Timestamps
            from clip_extractor.selection.srt_parser import load_transcript
            from clip_extractor.selection.timestamp_resolver import resolve_all_clips
            
            ts_transcript = load_transcript(srt_path, fps=30.0)
            resolved_objects = resolve_all_clips(
                transcript=ts_transcript,
                clips_data=selections.get("selections", []),
                search_window=60.0,
                fuzzy_threshold=70.0
            )
            
            # Map the resolved seconds back into the payload strictly by ID
            resolved_dict_list = []
            
            # Create a lookup mapping for foolproof resolution
            resolution_map = {r.id: r for r in resolved_objects}
            
            for s in selections.get("selections", []):
                matched_r = resolution_map.get(s.get("id"))
                if matched_r:
                    s["start"] = matched_r.start_sec
                    s["end"] = matched_r.end_sec
                    resolved_dict_list.append(s)
                
            selections["selections"] = resolved_dict_list

            with open(selections_path, "w") as f:
                json.dump(selections, f, indent=2)
            
            clips_raw = selections.get("selections", [])
            print(f"  ✅ [pipeline] Claude returned {len(clips_raw)} valid highlights")
        except Exception as e:
            print(f"[pipeline] ⚠️  Claude extraction failed: {e}")
            return {"status": "failed", "error": str(e)}

    # --- Step 4: Validate boundaries ---
    print(f"\n✅ Step 4/{total_steps}: Boundary validation")

    # DYNAMIC SCORING: Extract ALL clips above 85% retention threshold. (User prefers > 85% guarantee over arbitrary limit).
    qualified_clips = [c for c in clips_raw if c.get("total_score", 0) >= 85]
    qualified_clips.sort(key=lambda x: x.get("total_score", 0), reverse=True)
    
    if not qualified_clips and clips_raw: 
        # Fallback if nothing hit 85% to at least grab the best one rather than failing
        print("[pipeline] ⚠️  No clips hit the 85+ score threshold. Falling back to the best available clip.")
        best_clip = max(clips_raw, key=lambda x: x.get("total_score", 0))
        qualified_clips = [best_clip]

    print(f"[pipeline] Filtering complete: Found {len(qualified_clips)} clips exceeding the Viral Retention threshold.")

    clips_for_validation = []
    # Claude json might not have 'start' and 'end' seconds since it provides quotes.
    # The clip_extractor native resolve pipeline usually handles this. If Claude returned seconds, use them.
    # Wait, the validation requires seconds!
    for c in qualified_clips:
        clips_for_validation.append({
            "id": c["id"], 
            "title": c["title"], 
            "start": c.get("start", 0), 
            "end": c.get("end", 60)
        })

    validated = validate_and_fix_boundaries(
        clips=clips_for_validation,
        transcript_path=srt_path,
        video_path=video_path,
        search_window=5.0,  # Level 2 fix: wider search (was 3.0) for better sentence boundary matching
    )

    fixed_clips = validated_to_clip_definitions(validated)

    # Save validated definitions
    validated_path = output_path / "validated_clips.json"
    with open(validated_path, "w") as f:
        json.dump(fixed_clips, f, indent=2)

    # Report boundary fixes
    fixes = sum(1 for v in validated if v.start != v.original_start or v.end != v.original_end)
    issues = sum(1 for v in validated if not v.valid)
    print(f"\n[pipeline] Validation: {fixes} boundaries fixed, {issues} unresolved issues")

    # --- Step 5: Batch reframe ---
    print(f"\n🎬 Step 5/{total_steps}: Face-tracking reframe")
    outputs = batch_reframe(video_path, fixed_clips, output_dir, aspect_ratio)

    # If face-tracking failed entirely, fall back to center-crop so QA has something to score
    if not outputs:
        print(f"[pipeline] ⚠️  Face-tracking produced no outputs — using center-crop fallback")
        outputs = _fallback_center_crop(video_path, fixed_clips, output_dir, aspect_ratio)
        if outputs:
            print(f"[pipeline] ✅ Fallback produced {len(outputs)} clips — scores will be low but improvable")
        else:
            print(f"[pipeline] ❌ Fallback also failed — skipping reframe step")

    # --- Track clips ---
    for clip_raw, clip_fixed in zip(qualified_clips, fixed_clips):
        tracker.log_clip(
            clip_id=f"{video_name}-{clip_fixed['id']:02d}",
            video_source=video_path,
            brand=brand,
            internal_scores=clip_raw.get("scores", {}),
            total_score=clip_raw.get("total_score", 0),
            category=clip_raw.get("category", "unknown"),
            duration=clip_fixed["end"] - clip_fixed["start"],
            title=clip_fixed["title"],
        )

    # --- Steps 6-9: Composition pipeline (if --compose) ---
    clip_specs = []

    if compose:
        print(f"\n🎨 Step 6/{total_steps}: Pop-out analysis + Captions")

        # Locate word-level timestamps saved during transcription
        _words_json = output_path / f"{video_name}_words.json"
        words_json_path = str(_words_json) if _words_json.exists() else None
        if words_json_path:
            print(f"  ✅ Word timestamps available → enabling per-clip captions")
        else:
            print(f"  ⚠️  No word timestamps found — captions will use SRT interpolation")

        for clip_raw, clip_fixed, clip_output in zip(
            qualified_clips, fixed_clips, outputs
        ):
            clip_dir = Path(clip_output["path"]).parent

            # ── Generate word-level captions for this clip ──
            captions_src = generate_captions_for_clip(
                words_json_path=words_json_path,
                srt_path=srt_path,
                clip_start=clip_fixed["start"],
                clip_end=clip_fixed["end"],
                output_path=str(clip_dir / "captions.json"),
            )

            spec = generate_clip_spec(
                transcript_path=srt_path,
                clip_start=clip_fixed["start"],
                clip_end=clip_fixed["end"],
                clip_title=clip_fixed["title"],
                clip_id=f"{video_name}-{clip_fixed['id']:02d}",
                brand_slug=brand,
                video_src=clip_output["path"],
                captions_src=captions_src,   # ← now passing real word captions
                output_path=str(clip_dir / "clip_spec.json"),
                content_type=content_type,
                logo_override=logo_override,
            )
            clip_specs.append(spec)
            cap_status = f"✅ {Path(captions_src).name}" if captions_src else "⚠️ No captions"
            print(f"  📋 {clip_fixed['title']}: spec generated ({spec['status']}) | captions: {cap_status}")

        print(f"\n🎨 Step 6.5/{total_steps}: Market Intel AutoResearch (parallel)")
        api_key = os.environ.get("ANTHROPIC_API_KEY", "")
        if api_key:
            from pipeline.auto_researcher import get_ecosystem_research
            from concurrent.futures import ThreadPoolExecutor, as_completed as _as_completed

            def _research_one(spec):
                spec_path = str(Path(spec.get('videoSrc', '')).parent / "clip_spec.json")
                try:
                    if os.path.exists(spec_path):
                        with open(spec_path, 'r') as f:
                            data = json.load(f)
                        transcript = data.get("transcript", "")
                        if transcript:
                            research_data = get_ecosystem_research(transcript, api_key)
                            data["research_context"] = research_data
                            with open(spec_path, 'w') as f:
                                json.dump(data, f, indent=2)
                            return spec['title'], len(research_data)
                except Exception as e:
                    print(f"  ❌ AutoResearch failed for {spec.get('title','?')}: {e}")
                return spec.get('title','?'), 0

            with ThreadPoolExecutor(max_workers=3) as pool:
                futs = {pool.submit(_research_one, s): s for s in clip_specs}
                for fut in _as_completed(futs):
                    title, n = fut.result()
                    print(f"  ✅ Research: {title} ({n} facts found)")


        print(f"\n🖌️  Step 7/{total_steps}: AI composition (parallel)")
        api_key = os.environ.get("ANTHROPIC_API_KEY", "")
        if api_key:
            from concurrent.futures import ThreadPoolExecutor, as_completed
            
            # Resolve all spec paths first
            spec_tasks = []
            for idx, spec in enumerate(clip_specs):
                spec_path = str(Path(spec.get('videoSrc', '')).parent / "clip_spec.json")
                if not Path(spec_path).exists():
                    for output in outputs:
                        candidate = Path(output["path"]).parent / "clip_spec.json"
                        if candidate.exists() and spec["title"] in str(candidate.parent):
                            spec_path = str(candidate)
                            break
                spec_tasks.append((idx, spec, spec_path))
            
            total_to_compose = len(spec_tasks)
            print(f"  ⚡ Composing {total_to_compose} clips in parallel...")
            print(f"[PROGRESS] 70 Composing {total_to_compose} clips in parallel...")
            sys.stdout.flush()
            
            # Run all Claude API calls concurrently (I/O-bound, threading is perfect)
            compose_results = [None] * total_to_compose
            def _compose_one(task):
                idx, spec, sp = task
                try:
                    result = compose_clip(spec_path=sp, api_key=api_key)
                    return idx, result
                except Exception as e:
                    return idx, {"success": False, "title": spec["title"], "error": str(e)}
            
            with ThreadPoolExecutor(max_workers=5) as pool:
                futures = {pool.submit(_compose_one, t): t for t in spec_tasks}
                done_count = 0
                for future in as_completed(futures):
                    idx, result = future.result()
                    compose_results[idx] = result
                    done_count += 1
                    status = "✅" if result.get("success") else "❌"
                    print(f"  {status} [{done_count}/{total_to_compose}] {result.get('title', '?')[:45]}")
                    pct = 70 + int((done_count / total_to_compose) * 20)
                    print(f"[PROGRESS] {pct} {done_count}/{total_to_compose} composed")
                    sys.stdout.flush()
        else:
            print("[pipeline] No API key — skipping AI composition")
            print("[pipeline] Set ANTHROPIC_API_KEY or use Content Studio with your key")
            compose_results = []

        # --- Step 8: Render (parallel, 2 workers to avoid CPU thrash) ---
        print(f"\n🎞️  Step 8/{total_steps}: Remotion render")
        successful_compositions = [r for r in compose_results if r and r.get("success")]
        if successful_compositions:
            from pipeline.ai_composer import render_clip as do_render
            from concurrent.futures import ThreadPoolExecutor, as_completed
            
            # Build render tasks
            render_tasks = []
            for comp in successful_compositions:
                title = comp.get("title", "")
                clip_out_dir = None
                for out in outputs:
                    if title in out.get("path", ""):
                        clip_out_dir = str(Path(out["path"]).parent)
                        break
                render_dest = str(Path(clip_out_dir) / "rendered_composition.mp4") if clip_out_dir else None
                render_tasks.append((title, render_dest))
            
            total_renders = len(render_tasks)
            print(f"  ⚡ Rendering {total_renders} clips (2 parallel)...")
            print(f"[PROGRESS] 91 Rendering {total_renders} clips...")
            sys.stdout.flush()
            
            def _render_one(task):
                title, dest = task
                try:
                    path = do_render(title, output_path=dest)
                    return title, path, None
                except Exception as e:
                    return title, None, str(e)
            
            with ThreadPoolExecutor(max_workers=2) as pool:
                futures = {pool.submit(_render_one, t): t for t in render_tasks}
                done_count = 0
                for future in as_completed(futures):
                    title, path, err = future.result()
                    done_count += 1
                    if path:
                        print(f"  ✅ [{done_count}/{total_renders}] {title[:40]}")
                    else:
                        print(f"  ❌ [{done_count}/{total_renders}] {title[:40]}: {err}")
                    pct = 91 + int((done_count / total_renders) * 7)
                    print(f"[PROGRESS] {pct} {done_count}/{total_renders} rendered")
                    sys.stdout.flush()
        else:
            print("[pipeline] No compositions to render")

        # --- Step 8.5: Thumbnail extraction ---
        print(f"\n🖼️  Step 8.5/{total_steps}: Generating thumbnails")
        import subprocess as _sp
        for comp in successful_compositions if successful_compositions else []:
            title = comp.get("title", "")
            clip_out_dir = None
            for out in outputs:
                if title in out.get("path", ""):
                    clip_out_dir = str(Path(out["path"]).parent)
                    break
            if not clip_out_dir:
                continue
            video_path = Path(clip_out_dir) / "rendered_composition.mp4"
            thumb_path = Path(clip_out_dir) / "thumbnail.jpg"
            if video_path.exists() and not thumb_path.exists():
                try:
                    # Extract frame at 0.5 seconds as thumbnail
                    _sp.run([
                        "ffmpeg", "-y", "-ss", "0.5", "-i", str(video_path),
                        "-vframes", "1", "-q:v", "3",
                        "-vf", "scale=540:960",
                        str(thumb_path)
                    ], capture_output=True, timeout=15)
                    if thumb_path.exists():
                        print(f"  ✅ Thumbnail: {title[:40]}")
                    else:
                        print(f"  ⚠️  Thumbnail failed (ffmpeg): {title[:40]}")
                except Exception as e:
                    print(f"  ⚠️  Thumbnail failed: {e}")

        # --- Step 9: Discord notification ---
        if notify:
            print(f"\n📣 Step 9/{total_steps}: Discord notification")
            for spec in clip_specs:
                try:
                    notify_spec_ready(spec)
                    print(f"  ✅ Notified: {spec['title']}")
                except Exception as e:
                    print(f"  ⚠️  Notification failed for {spec['title']}: {e}")
        else:
            print(f"\n📣 Step 9/{total_steps}: Discord notification (skipped — use --notify)")


    # --- Summary ---
    print("\n" + "=" * 60)
    print("Pipeline Complete!")
    print("=" * 60)
    for output in outputs:
        print(f"  ✅ {output['title']}: {output['path']}")

    if clip_specs:
        print(f"\n  📋 Clip specs generated: {len(clip_specs)}")
        for spec in clip_specs:
            print(f"     {spec['clipId']}: {spec['status']}")

    if no_post:
        print(f"\n  📁 All clips saved to: {output_dir}")
        print("  🚫 --no-post: Nothing was published")
    else:
        print("\n  📤 Ready for distribution via Zernio")

    return {
        "status": "complete",
        "clips": outputs,
        "output_dir": output_dir,
        "validated_clips": validated_path,
        "clip_specs": [s.get("clipId") for s in clip_specs] if clip_specs else [],
    }


def main():
    parser = argparse.ArgumentParser(
        description="IX Content Pipeline — End-to-end clip production",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s --video video.mp4 --brand 6fbarber --clips 3 --no-post
  %(prog)s --video video.mp4 --transcript transcript.srt --brand 6fbarber
  %(prog)s --video video.mp4 --brand 6fbarber --experiment
        """,
    )

    parser.add_argument("--video", required=True, help="Path to source video")
    parser.add_argument("--research", action="store_true", help="Enable AutoResearcher Market Intel integration")
    parser.add_argument("--brand", default="6fbarber", help="Brand slug")
    parser.add_argument("--clips", type=int, default=5, help="Number of clips to select")
    parser.add_argument("--transcript", help="Path to existing .srt transcript")
    parser.add_argument("--output", help="Output directory")
    parser.add_argument("--format", default="9x16", help="Aspect ratio (9x16, 1x1, 4x5)")
    parser.add_argument("--no-post", action="store_true", default=True, help="Don't post (default)")
    parser.add_argument("--post", action="store_true", help="Post to Zernio")
    parser.add_argument("--experiment", action="store_true", help="Run as AutoResearcher experiment")
    parser.add_argument("--compose", action="store_true", help="Run composition pipeline (Steps 6-9)")
    parser.add_argument("--notify", action="store_true", help="Send Discord notifications")
    parser.add_argument("--content-type", default="auto",
                        help="Content type for pop-out style (default: auto)")
    parser.add_argument("--logo-override", help="Absolute path to custom brand logo")
    parser.add_argument("--no-logo", action="store_true", help="Disable logo usage entirely")

    args = parser.parse_args()

    run_pipeline(
        video_path=args.video,
        brand=args.brand,
        num_clips=args.clips,
        transcript_path=args.transcript,
        output_dir=args.output,
        no_post=not args.post,
        run_experiment=args.experiment,
        aspect_ratio=args.format,
        compose=args.compose,
        notify=args.notify,
        content_type=args.content_type,
        logo_override=None if args.no_logo else args.logo_override,
    )


if __name__ == "__main__":
    main()
