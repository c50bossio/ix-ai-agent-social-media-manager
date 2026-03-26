/**
 * STANDALONE MOTION GRAPHICS — "Claude Code vs OpenClaw"
 *
 * Full long-form comparison video (no source video). AI-narrated with
 * kinetic typography, pop-out illustrations, and word-synced captions.
 *
 * Duration: ~348s (10437 frames @ 30fps)
 * Format: 1920x1080 landscape (YouTube long-form)
 *
 * Scene 1:  HOOK            (f0–350)     — VS title reveal
 * Scene 2:  CLAUDE CODE     (f350–1250)  — What is Claude Code
 * Scene 3:  OPENCLAW        (f1250–2550) — What is OpenClaw
 * Scene 4:  PURPOSE         (f2550–3450) — Comparison #1
 * Scene 5:  ARCHITECTURE    (f3450–4290) — Comparison #2
 * Scene 6:  SECURITY        (f4290–5950) — Comparison #3
 * Scene 7:  CODING          (f5950–7300) — Comparison #4
 * Scene 8:  PRICING         (f7300–8050) — Comparison #5
 * Scene 9:  CONCLUSION      (f8050–10437)— Final verdict + CTA
 */

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from "remotion";
import { noise2D } from "@remotion/noise";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

import { WORDS, TOTAL_DURATION_FRAMES } from "../data/claude-code-vs-openclaw-words";

import {
  VsBattle,
  TerminalAgent,
  ContextWindowBrain,
  CodebaseTree,
  MessagingPlatforms,
  GitHubStarsCounter,
  SkillsEcosystem,
  OpenAITransition,
  PurposeComparison,
  CloudVsLocal,
  SecurityShield,
  VulnerabilityAlert,
  CVEBadge,
  MaliciousCode,
  PermissionSystem,
  MCPBridge,
  PriceComparison,
  WinnerTrophy,
  EnterpriseSecurity,
  FinalVerdict,
} from "../lib/illustrations/ClaudeCodeVsOpenClawIllustrations";

const { fontFamily: interFont } = loadInter();
const { fontFamily: monoFont } = loadJetBrains();

// ═══════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════
const T = {
  bg: "#0A0A0A",
  orange: "#FF6B00",
  orangeGlow: "rgba(255, 107, 0, 0.12)",
  white: "#FFFFFF",
  offWhite: "#E0E0E0",
  dimGray: "#666666",
  codeGreen: "#4ADE80",
  codeBlue: "#60A5FA",
  red: "#EF4444",
  amber: "#FBBF24",
};

// ═══════════════════════════════════════════════════════════════
// SFX EVENTS (J-cut: audio 2-3 frames BEFORE visual)
// ═══════════════════════════════════════════════════════════════
const SFX_EVENTS: Array<{ frame: number; src: string; volume: number }> = [
  // Hook
  { frame: 0, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.24 },
  { frame: 48, src: "audio/pop-402324.mp3", volume: 0.20 },
  // Claude Code section
  { frame: 348, src: "audio/whoosh-effect-382717.mp3", volume: 0.18 },
  { frame: 500, src: "audio/pop-402324.mp3", volume: 0.18 },
  { frame: 630, src: "audio/whoosh-bamboo-389752.mp3", volume: 0.16 },
  { frame: 840, src: "audio/pop-402324.mp3", volume: 0.18 },
  { frame: 1065, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.22 },
  // OpenClaw section
  { frame: 1248, src: "audio/whoosh-effect-382717.mp3", volume: 0.18 },
  { frame: 1408, src: "audio/pop-402324.mp3", volume: 0.16 },
  { frame: 1700, src: "audio/whoosh-bamboo-389752.mp3", volume: 0.18 },
  { frame: 2140, src: "audio/pop-402324.mp3", volume: 0.16 },
  { frame: 2285, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.20 },
  // Section headers
  { frame: 2571, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.24 },
  { frame: 3461, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.24 },
  { frame: 4298, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.24 },
  // Security details
  { frame: 4620, src: "audio/whoosh-effect-382717.mp3", volume: 0.20 },
  { frame: 4688, src: "audio/pop-402324.mp3", volume: 0.22 },
  { frame: 4850, src: "audio/whoosh-bamboo-389752.mp3", volume: 0.20 },
  { frame: 5298, src: "audio/pop-402324.mp3", volume: 0.18 },
  { frame: 5894, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.18 },
  // Coding section
  { frame: 6047, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.24 },
  { frame: 6338, src: "audio/pop-402324.mp3", volume: 0.18 },
  { frame: 6543, src: "audio/whoosh-bamboo-389752.mp3", volume: 0.18 },
  // Pricing
  { frame: 7319, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.24 },
  { frame: 7457, src: "audio/pop-402324.mp3", volume: 0.18 },
  // Conclusion
  { frame: 8074, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.24 },
  { frame: 8274, src: "audio/whoosh-effect-382717.mp3", volume: 0.22 },
  { frame: 9323, src: "audio/pop-402324.mp3", volume: 0.18 },
  { frame: 9900, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.22 },
];

// ═══════════════════════════════════════════════════════════════
// HELPER: Noise Background (landscape)
// ═══════════════════════════════════════════════════════════════
const NoiseBackground: React.FC = () => {
  const frame = useCurrentFrame();

  const particles = Array.from({ length: 14 }, (_, i) => {
    const x = noise2D("px" + i, i * 0.3, frame * 0.004) * 0.5 + 0.5;
    const y = noise2D("py" + i, i * 0.7, frame * 0.003) * 0.5 + 0.5;
    const opacity = noise2D("po" + i, i * 0.5, frame * 0.006) * 0.02 + 0.03;
    const size = 2 + noise2D("ps" + i, i * 0.2, frame * 0.002) * 2;
    return { x: x * 1920, y: y * 1080, opacity: Math.max(0.01, opacity), size };
  });

  const glowOpacity = interpolate(frame % 180, [0, 90, 180], [0.06, 0.12, 0.06]);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, backgroundColor: T.bg }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 45%, ${T.orange}${Math.round(glowOpacity * 255).toString(16).padStart(2, "0")} 0%, transparent 60%)`,
        }}
      />
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: T.white,
            opacity: p.opacity,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle, transparent 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// HELPER: Animated text reveal (single line)
// ═══════════════════════════════════════════════════════════════
const AnimatedLine: React.FC<{
  text: string;
  fontSize: number;
  color: string;
  delay: number;
  stagger?: number;
  damping?: number;
  stiffness?: number;
  fontWeight?: number;
  letterSpacing?: number;
  mono?: boolean;
}> = ({
  text,
  fontSize,
  color,
  delay,
  stagger = 1.2,
  damping = 12,
  stiffness = 160,
  fontWeight = 800,
  letterSpacing = 2,
  mono = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chars = text.split("");

  return (
    <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
      {chars.map((char, i) => {
        const charFrame = Math.max(0, frame - delay - i * stagger);
        const progress = spring({
          frame: charFrame,
          fps,
          from: 0,
          to: 1,
          config: { damping, stiffness },
        });

        return (
          <span
            key={`${i}-${char}`}
            style={{
              fontFamily: mono ? monoFont : interFont,
              fontWeight,
              fontSize,
              color,
              letterSpacing,
              textShadow: "0 4px 20px rgba(0,0,0,0.5)",
              display: "inline-block",
              whiteSpace: "pre",
              transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
              opacity: progress,
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// HELPER: Pop-out card with illustration
// ═══════════════════════════════════════════════════════════════
const PopOutCard: React.FC<{
  children: React.ReactNode;
  enterFrame: number;
  exitFrame: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}> = ({ children, enterFrame, exitFrame, width = 500, height = 500, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterProgress = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    from: 0,
    to: 1,
    config: { damping: 16, stiffness: 100 },
  });

  const exitProgress = interpolate(frame, [exitFrame - 15, exitFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(enterProgress, [0, 1], [0.7, 1]);
  const opacity = enterProgress * exitProgress;

  if (frame < enterFrame - 5 || frame > exitFrame + 5) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x ?? "50%",
        top: y ?? "50%",
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      {children}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// HELPER: Section title (big reveal for "Number X" headers)
// ═══════════════════════════════════════════════════════════════
const SectionTitle: React.FC<{
  title: string;
  subtitle: string;
  accentColor?: string;
}> = ({ title, subtitle, accentColor = T.orange }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineWidth = spring({
    frame: Math.max(0, frame - 5),
    fps,
    from: 0,
    to: 400,
    config: { damping: 14, stiffness: 100 },
  });

  const titleOpacity = spring({
    frame: Math.max(0, frame - 3),
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const subtitleOpacity = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 16, stiffness: 100 },
  });

  const exitOpacity = interpolate(frame, [80, 100], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: exitOpacity,
        zIndex: 200,
      }}
    >
      <div
        style={{
          width: lineWidth,
          height: 4,
          backgroundColor: accentColor,
          marginBottom: 30,
          borderRadius: 2,
        }}
      />
      <div
        style={{
          fontFamily: interFont,
          fontWeight: 900,
          fontSize: 90,
          color: T.white,
          letterSpacing: 4,
          textTransform: "uppercase",
          opacity: titleOpacity,
          textShadow: `0 0 60px ${accentColor}40`,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: interFont,
          fontWeight: 400,
          fontSize: 36,
          color: T.dimGray,
          marginTop: 12,
          opacity: subtitleOpacity,
          letterSpacing: 6,
          textTransform: "uppercase",
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// HELPER: Word-by-word captions at the bottom
// ═══════════════════════════════════════════════════════════════
const NarrationCaptions: React.FC = () => {
  const frame = useCurrentFrame();

  // Find current word and surrounding context
  let currentIdx = 0;
  for (let i = 0; i < WORDS.length; i++) {
    if (frame >= WORDS[i].frame && frame < WORDS[i].frame + WORDS[i].duration + 3) {
      currentIdx = i;
    }
  }

  // Show a window of ~8 words centered on current
  const windowSize = 8;
  const startIdx = Math.max(0, currentIdx - Math.floor(windowSize / 2));
  const endIdx = Math.min(WORDS.length, startIdx + windowSize);
  const visibleWords = WORDS.slice(startIdx, endIdx);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
        padding: "0 120px",
        zIndex: 300,
      }}
    >
      {visibleWords.map((w) => {
        const isCurrent =
          frame >= w.frame && frame < w.frame + w.duration + 3;
        const isPast = frame >= w.frame + w.duration + 3;

        return (
          <span
            key={w.id}
            style={{
              fontFamily: interFont,
              fontWeight: isCurrent ? 800 : 500,
              fontSize: isCurrent ? 44 : 38,
              color: isCurrent
                ? T.orange
                : isPast
                  ? T.dimGray
                  : "rgba(255,255,255,0.5)",
              transition: "all 0.1s",
              textShadow: isCurrent
                ? `0 0 30px ${T.orangeGlow}`
                : "0 2px 8px rgba(0,0,0,0.8)",
              transform: isCurrent ? "scale(1.05)" : "scale(1)",
            }}
          >
            {w.word}
          </span>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// HELPER: Content area with illustration + label
// ═══════════════════════════════════════════════════════════════
const ContentCard: React.FC<{
  illustration: React.ReactNode;
  label?: string;
  enterFrame: number;
  exitFrame: number;
  illustrationSize?: number;
  position?: "center" | "left" | "right";
}> = ({
  illustration,
  label,
  enterFrame,
  exitFrame,
  illustrationSize = 420,
  position = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterProgress = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    from: 0,
    to: 1,
    config: { damping: 16, stiffness: 100 },
  });

  const exitProgress = interpolate(frame, [exitFrame - 12, exitFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = enterProgress * exitProgress;
  const scale = interpolate(enterProgress, [0, 1], [0.8, 1]);
  const translateY = interpolate(enterProgress, [0, 1], [40, 0]);

  if (frame < enterFrame - 3 || frame > exitFrame + 3) return null;

  const xPos =
    position === "left" ? "30%" : position === "right" ? "70%" : "50%";

  return (
    <div
      style={{
        position: "absolute",
        left: xPos,
        top: "42%",
        transform: `translate(-50%, -50%) scale(${scale}) translateY(${translateY}px)`,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        zIndex: 50,
      }}
    >
      <div style={{ width: illustrationSize, height: illustrationSize }}>
        {illustration}
      </div>
      {label && (
        <div
          style={{
            fontFamily: interFont,
            fontWeight: 700,
            fontSize: 28,
            color: T.offWhite,
            textAlign: "center",
            maxWidth: 500,
            textShadow: "0 2px 12px rgba(0,0,0,0.8)",
            letterSpacing: 1,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// HELPER: Comparison layout (side-by-side)
// ═══════════════════════════════════════════════════════════════
const ComparisonLayout: React.FC<{
  leftIllustration: React.ReactNode;
  leftLabel: string;
  rightIllustration: React.ReactNode;
  rightLabel: string;
  enterFrame: number;
  exitFrame: number;
}> = ({
  leftIllustration,
  leftLabel,
  rightIllustration,
  rightLabel,
  enterFrame,
  exitFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftEnter = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 16, stiffness: 100 },
  });

  const rightEnter = spring({
    frame: Math.max(0, frame - enterFrame - 8),
    fps,
    config: { damping: 16, stiffness: 100 },
  });

  const exitOp = interpolate(frame, [exitFrame - 12, exitFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (frame < enterFrame - 3 || frame > exitFrame + 3) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 120,
        opacity: exitOp,
        zIndex: 50,
        paddingBottom: 140,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          opacity: leftEnter,
          transform: `translateX(${interpolate(leftEnter, [0, 1], [-60, 0])}px)`,
        }}
      >
        <div style={{ width: 340, height: 340 }}>{leftIllustration}</div>
        <div
          style={{
            fontFamily: interFont,
            fontWeight: 700,
            fontSize: 26,
            color: T.orange,
            textAlign: "center",
          }}
        >
          {leftLabel}
        </div>
      </div>

      {/* VS divider */}
      <div
        style={{
          fontFamily: interFont,
          fontWeight: 900,
          fontSize: 48,
          color: T.dimGray,
          opacity: Math.min(leftEnter, rightEnter),
        }}
      >
        VS
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          opacity: rightEnter,
          transform: `translateX(${interpolate(rightEnter, [0, 1], [60, 0])}px)`,
        }}
      >
        <div style={{ width: 340, height: 340 }}>{rightIllustration}</div>
        <div
          style={{
            fontFamily: interFont,
            fontWeight: 700,
            fontSize: 26,
            color: T.codeBlue,
            textAlign: "center",
          }}
        >
          {rightLabel}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ═══════════════════════════════════════════════════════════════
export const ClaudeCodeVsOpenClaw: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Background */}
      <NoiseBackground />

      {/* ── NARRATION AUDIO ──────────────────────────────────── */}
      <Audio src={staticFile("audio/claude-code-vs-openclaw-narration.mp3")} volume={1} />

      {/* ── BACKGROUND MUSIC (first 35s, 0.02 volume) ───────── */}
      <Sequence from={0} durationInFrames={1050}>
        <Audio
          src={staticFile("audio/background-music.mp3")}
          volume={0.02}
          endAt={1050}
        />
      </Sequence>

      {/* ── SFX ──────────────────────────────────────────────── */}
      {SFX_EVENTS.map((sfx, i) => (
        <Sequence key={i} from={sfx.frame} durationInFrames={60}>
          <Audio
            src={staticFile(sfx.src)}
            volume={sfx.volume}
          />
        </Sequence>
      ))}

      {/* ════════════════════════════════════════════════════════ */}
      {/* SCENE 1: HOOK (f0–350)                                 */}
      {/* "Claude Code versus OpenClaw"                          */}
      {/* ════════════════════════════════════════════════════════ */}
      <Sequence from={0} durationInFrames={350}>
        <HookScene />
      </Sequence>

      {/* ════════════════════════════════════════════════════════ */}
      {/* SCENE 2: WHAT IS CLAUDE CODE (f350–1250)               */}
      {/* ════════════════════════════════════════════════════════ */}

      {/* "Anthropic's official command-line coding agent" */}
      <ContentCard
        illustration={<TerminalAgent size={420} />}
        label="Anthropic's Official CLI Agent"
        enterFrame={504}
        exitFrame={720}
        illustrationSize={420}
      />

      {/* "runs in your terminal" → codebase access */}
      <ContentCard
        illustration={<CodebaseTree size={420} />}
        label="Direct Codebase Access"
        enterFrame={635}
        exitFrame={850}
        illustrationSize={400}
      />

      {/* "read files, write code, run commands" */}
      <Sequence from={845} durationInFrames={220}>
        <ContentCard
          illustration={<TerminalAgent size={380} />}
          label="Read • Write • Execute • Commit"
          enterFrame={0}
          exitFrame={210}
          illustrationSize={380}
        />
      </Sequence>

      {/* "one million token context window" */}
      <ContentCard
        illustration={<ContextWindowBrain size={460} />}
        label="1 Million Token Context Window"
        enterFrame={1069}
        exitFrame={1250}
        illustrationSize={460}
      />

      {/* ════════════════════════════════════════════════════════ */}
      {/* SCENE 3: WHAT IS OPENCLAW (f1250–2550)                 */}
      {/* ════════════════════════════════════════════════════════ */}

      {/* "OpenClaw is something very different" */}
      <ContentCard
        illustration={<MessagingPlatforms size={420} />}
        label="AI Personal Assistant via Messaging"
        enterFrame={1275}
        exitFrame={1480}
        illustrationSize={420}
      />

      {/* "Originally called Clawdbot" + "Peter Steinberger" */}
      <ContentCard
        illustration={<OpenAITransition size={400} />}
        label="Created by Peter Steinberger (PSPDFKit)"
        enterFrame={1411}
        exitFrame={1700}
        illustrationSize={400}
      />

      {/* "free, open-source AI personal assistant" */}
      <ContentCard
        illustration={<MessagingPlatforms size={400} />}
        label="Free & Open Source — Signal, Telegram, Discord, WhatsApp"
        enterFrame={1703}
        exitFrame={1950}
        illustrationSize={400}
      />

      {/* "three hundred thousand stars on GitHub" */}
      <ContentCard
        illustration={<GitHubStarsCounter size={440} />}
        label="310K+ GitHub Stars"
        enterFrame={2100}
        exitFrame={2280}
        illustrationSize={440}
      />

      {/* "thirteen thousand community skills" */}
      <ContentCard
        illustration={<SkillsEcosystem size={420} />}
        label="13,000+ Community Skills"
        enterFrame={2200}
        exitFrame={2400}
        illustrationSize={420}
      />

      {/* "joining OpenAI" */}
      <ContentCard
        illustration={<OpenAITransition size={400} />}
        label="Steinberger Joins OpenAI (Feb 2026)"
        enterFrame={2289}
        exitFrame={2550}
        illustrationSize={400}
      />

      {/* ════════════════════════════════════════════════════════ */}
      {/* SCENE 4: PURPOSE (f2550–3450)                          */}
      {/* "Number one. Purpose."                                 */}
      {/* ════════════════════════════════════════════════════════ */}
      <Sequence from={2574} durationInFrames={110}>
        <SectionTitle title="PURPOSE" subtitle="Comparison #1" />
      </Sequence>

      {/* Claude Code vs OpenClaw purpose comparison */}
      <ComparisonLayout
        leftIllustration={<TerminalAgent size={340} />}
        leftLabel="Claude Code: Pure Dev Tool"
        rightIllustration={<MessagingPlatforms size={340} />}
        rightLabel="OpenClaw: Life Assistant"
        enterFrame={2700}
        exitFrame={3450}
      />

      {/* ════════════════════════════════════════════════════════ */}
      {/* SCENE 5: ARCHITECTURE (f3450–4290)                     */}
      {/* "Number two. Architecture."                            */}
      {/* ════════════════════════════════════════════════════════ */}
      <Sequence from={3464} durationInFrames={110}>
        <SectionTitle title="ARCHITECTURE" subtitle="Comparison #2" />
      </Sequence>

      {/* Cloud vs Local comparison */}
      <ComparisonLayout
        leftIllustration={<EnterpriseSecurity size={340} />}
        leftLabel="Anthropic's Cloud Infrastructure"
        rightIllustration={<CloudVsLocal size={340} />}
        rightLabel="Runs Locally — You Choose the Model"
        enterFrame={3600}
        exitFrame={4290}
      />

      {/* ════════════════════════════════════════════════════════ */}
      {/* SCENE 6: SECURITY (f4290–5950)                         */}
      {/* "Number three. Security."                              */}
      {/* ════════════════════════════════════════════════════════ */}
      <Sequence from={4301} durationInFrames={110}>
        <SectionTitle
          title="SECURITY"
          subtitle="Comparison #3"
          accentColor={T.red}
        />
      </Sequence>

      {/* "critical vulnerability" */}
      <ContentCard
        illustration={<VulnerabilityAlert size={460} />}
        label="Critical RCE Vulnerability Discovered"
        enterFrame={4623}
        exitFrame={4850}
        illustrationSize={460}
      />

      {/* "CVE 2026 25253" */}
      <ContentCard
        illustration={<CVEBadge size={440} />}
        label="CVE-2026-25253 — Remote Code Execution"
        enterFrame={4691}
        exitFrame={4970}
        illustrationSize={440}
      />

      {/* "forty thousand exposed instances" */}
      <ContentCard
        illustration={<MaliciousCode size={440} />}
        label="40,000+ Exposed Instances — 63% Vulnerable"
        enterFrame={4853}
        exitFrame={5150}
        illustrationSize={440}
      />

      {/* "twelve percent of skills were malicious" */}
      <ContentCard
        illustration={<MaliciousCode size={420} />}
        label="12% of Community Skills Were Malicious (341 of 2,857)"
        enterFrame={5280}
        exitFrame={5600}
        illustrationSize={420}
      />

      {/* "strict permission system" — Claude Code security */}
      <ContentCard
        illustration={<PermissionSystem size={440} />}
        label="Claude Code: Strict Permissions + Sandboxed Execution"
        enterFrame={5700}
        exitFrame={5950}
        illustrationSize={440}
      />

      {/* "Anthropic has dedicated security teams" */}
      <ContentCard
        illustration={<SecurityShield size={420} />}
        label="Dedicated Security Teams & Infrastructure"
        enterFrame={5897}
        exitFrame={6050}
        illustrationSize={420}
      />

      {/* ════════════════════════════════════════════════════════ */}
      {/* SCENE 7: CODING CAPABILITIES (f5950–7300)              */}
      {/* "Number four. Coding capabilities."                    */}
      {/* ════════════════════════════════════════════════════════ */}
      <Sequence from={6050} durationInFrames={110}>
        <SectionTitle
          title="CODING"
          subtitle="Comparison #4"
          accentColor={T.codeGreen}
        />
      </Sequence>

      {/* "one million token context window" */}
      <ContentCard
        illustration={<ContextWindowBrain size={440} />}
        label="1M Token Context — Entire Projects in Memory"
        enterFrame={6341}
        exitFrame={6540}
        illustrationSize={440}
      />

      {/* "MCP, the Model Context Protocol" */}
      <ContentCard
        illustration={<MCPBridge size={440} />}
        label="MCP: Connect to Databases, APIs, External Tools"
        enterFrame={6546}
        exitFrame={6800}
        illustrationSize={440}
      />

      {/* "hooks, Agent SDK, IDE integration" */}
      <ContentCard
        illustration={<PurposeComparison size={420} />}
        label="Hooks • Agent SDK • VS Code • JetBrains"
        enterFrame={6800}
        exitFrame={7100}
        illustrationSize={420}
      />

      {/* "OpenClaw can write code but lacks deep tooling" */}
      <ComparisonLayout
        leftIllustration={<ContextWindowBrain size={300} />}
        leftLabel="Claude Code: Deep Codebase Understanding"
        rightIllustration={<SkillsEcosystem size={300} />}
        rightLabel="OpenClaw: General AI, Not Code-Specialized"
        enterFrame={7100}
        exitFrame={7300}
      />

      {/* ════════════════════════════════════════════════════════ */}
      {/* SCENE 8: PRICING (f7300–8050)                          */}
      {/* "Number five. Pricing."                                */}
      {/* ════════════════════════════════════════════════════════ */}
      <Sequence from={7322} durationInFrames={110}>
        <SectionTitle
          title="PRICING"
          subtitle="Comparison #5"
          accentColor={T.amber}
        />
      </Sequence>

      {/* Price comparison */}
      <ComparisonLayout
        leftIllustration={<PriceComparison size={340} />}
        leftLabel="OpenClaw: Free + API Costs"
        rightIllustration={<EnterpriseSecurity size={340} />}
        rightLabel="Claude Code: $20-$200/mo"
        enterFrame={7460}
        exitFrame={8050}
      />

      {/* ════════════════════════════════════════════════════════ */}
      {/* SCENE 9: CONCLUSION (f8050–10437)                      */}
      {/* "So here is my conclusion."                            */}
      {/* ════════════════════════════════════════════════════════ */}
      <Sequence from={8077} durationInFrames={110}>
        <SectionTitle
          title="CONCLUSION"
          subtitle="The Verdict"
          accentColor={T.orange}
        />
      </Sequence>

      {/* "clear winner" — Claude Code for dev */}
      <ContentCard
        illustration={<WinnerTrophy size={460} />}
        label="Claude Code — Clear Winner for Development"
        enterFrame={8277}
        exitFrame={8600}
        illustrationSize={460}
      />

      {/* "enterprise-grade security out of the box" */}
      <ContentCard
        illustration={<EnterpriseSecurity size={440} />}
        label="Enterprise-Grade Security Out of the Box"
        enterFrame={8600}
        exitFrame={9000}
        illustrationSize={440}
      />

      {/* OpenClaw: impressive but needs hardening */}
      <ContentCard
        illustration={<SecurityShield size={420} />}
        label="OpenClaw: Impressive, But Lock It Down First"
        enterFrame={9100}
        exitFrame={9500}
        illustrationSize={420}
      />

      {/* Final verdict */}
      <ContentCard
        illustration={<FinalVerdict size={480} />}
        label="Claude Code for Development. Period."
        enterFrame={9700}
        exitFrame={10300}
        illustrationSize={480}
      />

      {/* CTA: "Let me know in the comments" */}
      <Sequence from={10240} durationInFrames={197}>
        <CTAScene />
      </Sequence>

      {/* ── WORD CAPTIONS (always visible) ────────────────────── */}
      <NarrationCaptions />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE: HOOK
// ═══════════════════════════════════════════════════════════════
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const flash = interpolate(frame, [0, 8], [0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const vsScale = spring({
    frame: Math.max(0, frame - 10),
    fps,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 140 },
  });

  const subtitleOpacity = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: { damping: 16, stiffness: 100 },
  });

  const exitOpacity = interpolate(frame, [300, 350], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: exitOpacity }}>
      {/* Orange flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: T.orange,
          opacity: flash,
          zIndex: 500,
        }}
      />

      {/* VS Illustration */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "38%",
          transform: `translate(-50%, -50%) scale(${vsScale})`,
          width: 500,
          height: 500,
        }}
      >
        <VsBattle size={500} />
      </div>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          bottom: 220,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <AnimatedLine
          text="CLAUDE CODE  vs  OPENCLAW"
          fontSize={72}
          color={T.white}
          delay={15}
          fontWeight={900}
          letterSpacing={4}
        />
        <div
          style={{
            fontFamily: interFont,
            fontWeight: 400,
            fontSize: 32,
            color: T.dimGray,
            letterSpacing: 8,
            textTransform: "uppercase",
            opacity: subtitleOpacity,
          }}
        >
          THE ULTIMATE 2026 COMPARISON
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════
// SCENE: CTA (end)
// ═══════════════════════════════════════════════════════════════
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: enter,
        zIndex: 150,
      }}
    >
      <div
        style={{
          fontFamily: interFont,
          fontWeight: 900,
          fontSize: 56,
          color: T.orange,
          letterSpacing: 3,
          textShadow: `0 0 40px ${T.orangeGlow}`,
        }}
      >
        WHICH ONE ARE YOU USING?
      </div>
      <div
        style={{
          fontFamily: interFont,
          fontWeight: 400,
          fontSize: 28,
          color: T.dimGray,
          marginTop: 16,
          letterSpacing: 4,
        }}
      >
        DROP A COMMENT BELOW
      </div>
    </AbsoluteFill>
  );
};
