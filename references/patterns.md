# Animation & Composition Patterns

Used by `/visual-overlay-creation`. Ready-to-copy code patterns for Remotion compositions.

Full catalogs: `remotion/playbook/animations/_index.md` (animations) · `remotion/playbook/components/_index.md` (components)

---

## Spring Configs (Copy-Paste)

```typescript
import { spring, useCurrentFrame, interpolate } from "remotion";
const frame = useCurrentFrame();
const fps = 30;

// Smooth — text reveals, gentle intros
const smooth = spring({ frame, fps, config: { damping: 200 } });

// Snappy — cards, badges, UI elements
const snappy = spring({ frame, fps, config: { damping: 20, stiffness: 200 } });

// Bouncy — hero illustrations, CTAs
const bouncy = spring({ frame, fps, config: { damping: 8 } });

// Standard — default for most overlays
const standard = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
```

---

## Entrance Patterns

### Scale Up (pop-in)
```typescript
const scale = spring({ frame, fps, from: 0.6, to: 1, config: { damping: 14, stiffness: 120 } });
// Apply: transform: `scale(${scale})`
```

### Slide In from Right
```typescript
const slide = spring({ frame, fps, config: { damping: 20, stiffness: 200 } });
const x = interpolate(slide, [0, 1], [80, 0]);
// Apply: transform: `translateX(${x}px)`
```

### Slide Up
```typescript
const slideUp = spring({ frame, fps, config: { damping: 25, stiffness: 100 } });
const y = interpolate(slideUp, [0, 1], [60, 0]);
const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
// Apply: transform: `translateY(${y}px)`, opacity
```

### Fade In
```typescript
const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
```

### Circle Clip Reveal
```typescript
const pct = interpolate(frame, [0, 12], [0, 150], { extrapolateRight: "clamp" });
// Apply: clipPath: `circle(${pct}% at 50% 50%)`
```

---

## Exit Patterns

### Fade Out (default for all pop-outs)
```typescript
// durationInFrames = total frames this element is visible
const opacity = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
```

### Scale Down + Fade
```typescript
const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [0, 1], { extrapolateLeft: "clamp" });
// transform: `scale(${1 - exit * 0.2})`, opacity: 1 - exit
```

---

## Continuous Effects

### Float (gentle hover)
```typescript
const float = Math.sin(frame / 16) * 4; // N=16 gentle, N=12 faster; amp=4-8px
// Apply: transform: `translateY(${float}px)`
```

### Count Up (stats/metrics)
```typescript
const value = interpolate(frame, [0, 60], [0, targetValue], { extrapolateRight: "clamp" });
// Display: Math.round(value).toLocaleString()
```

### SVG Draw (line reveals)
```typescript
// Requires ref to SVG path element
const totalLength = pathRef.current?.getTotalLength() ?? 500;
const draw = interpolate(frame, [0, 45], [totalLength, 0], { extrapolateRight: "clamp" });
// Apply: strokeDasharray={totalLength}, strokeDashoffset={draw}
```

### Stagger Reveal (lists, grids)
```typescript
// For element at index i, baseDelay in frames
const delay = baseDelay + i * 4; // 4 frames between items
const itemOpacity = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 20, stiffness: 200 } });
```

---

## Component Quick Reference

| Need | Component | File |
|------|-----------|------|
| Full-screen concept reveal | `ConceptOverlay` | `remotion/components/ConceptOverlay.tsx` |
| Premium Apple-style popup | `AppleStylePopup` | `remotion/components/AppleStylePopup.tsx` |
| Floating keyword on speaker | `FloatingKeyword` | `remotion/components/FloatingKeyword.tsx` |
| Info card corner | `FloatingCard` | `remotion/components/FloatingCard.tsx` |
| Platform logo grid | `PlatformCascade` | `remotion/components/PlatformCascade.tsx` |
| Word-by-word captions (shorts) | `CleanWordCaption` | `remotion/components/CleanWordCaption.tsx` |
| Word-by-word captions (long) | `FullWidthCaption` | `remotion/components/FullWidthCaption.tsx` |
| Section marker | `CornerSectionBadge` | `remotion/components/CornerSectionBadge.tsx` |
| Scene transition flash | `TransitionFlash` | `remotion/components/TransitionFlash.tsx` |

---

## IllustrationSize Guide

```typescript
illustrationSize={800}  // No caption — illustration fills the space
illustrationSize={700}  // With caption below
illustrationSize={620}  // CTA overlays or when subtitle is present
```

---

## SFX Timing Pattern

```typescript
// J-cut: SFX fires 3 frames BEFORE the visual appears
<Sequence from={KEYWORD_FRAME - 3} durationInFrames={20}>
  <Audio src={staticFile("audio/whoosh-effect-382717.mp3")} volume={0.16} />
</Sequence>
<Sequence from={KEYWORD_FRAME} durationInFrames={DURATION}>
  <ConceptOverlay ... />
</Sequence>
```

SFX volume guide:
- Pop: `0.22` (quick concept)
- Whoosh: `0.16` (hero overlay)
- Whoosh bamboo: `0.14` (b-roll)
- Whoosh large: `0.18` (section break)
- Background music: `0.02` (first 35s only)

---

## Colors

Import from `remotion/lib/colors.ts` — never hardcode. Key values:
- Orange accent: `#F97316`
- IX mint: `#4ADE80`
- Black: `#000000`
- White: `#FFFFFF`
- Dark bg: `#0A0A0A`
