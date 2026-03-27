/**
 * Jensen Clip 1: "The Superpower of a Child's Mind" (95s)
 *
 * Jensen on approaching impossible challenges with naive optimism.
 * "How hard could it be?" mindset that built NVIDIA.
 *
 * Duration: 2850 frames @ 30fps (~95s)
 *
 * POP-OUTS (6 total, ConceptOverlay A-tier + FloatingKeyword B-tier):
 *   1. "SUPERPOWER" (frame 742, 75f) — ConceptOverlay: Lightbulb brain
 *   2. "MIND OF A CHILD" (frame 859, 80f) — ConceptOverlay: Child silhouette with stars
 *   3. "HOW HARD COULD IT BE?" (frame 1236, 50f) — FloatingKeyword: Mountain
 *   4. "GIGANTIC" (frame 1548, 60f) — FloatingKeyword: Rocket/scale
 *   5. "SETBACKS" (frame 2108, 75f) — ConceptOverlay: Storm illustration
 *   6. "ENDURANCE & GRIT" (frame 2641, 80f) — ConceptOverlay: Diamond
 */

import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { ConceptOverlay } from "../components/ConceptOverlay";
import { FloatingKeyword } from "../components/FloatingKeyword";

import { WORDS, TOTAL_DURATION_FRAMES } from "../data/jensen-mind-of-child-words";

const { fontFamily } = loadFont();

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════
const TOTAL_FRAMES = TOTAL_DURATION_FRAMES; // 2850

function getZoom(_frame: number): number {
  return 1.0;
}

// ═══════════════════════════════════════════════════════════════
// Concept overlay frame ranges (captions hidden during these)
// ═══════════════════════════════════════════════════════════════
const CONCEPT_RANGES = [
  { start: 742, end: 817 },   // Superpower
  { start: 859, end: 939 },   // Mind of a Child
  { start: 2108, end: 2183 }, // Setbacks
  { start: 2641, end: 2721 }, // Endurance & Grit
];

// ═══════════════════════════════════════════════════════════════
// SFX EVENTS (J-cut: audio 2-3 frames before visual)
// ═══════════════════════════════════════════════════════════════
const SFX_EVENTS: Array<{ frame: number; src: string; volume: number }> = [
  // Superpower
  { frame: 740, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.20 },
  // Mind of a Child
  { frame: 857, src: "audio/pop-402324.mp3", volume: 0.20 },
  // How hard could it be?
  { frame: 1234, src: "audio/whoosh-effect-382717.mp3", volume: 0.18 },
  // Gigantic
  { frame: 1546, src: "audio/pop-402324.mp3", volume: 0.18 },
  // Setbacks
  { frame: 2106, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.20 },
  // Endurance & Grit
  { frame: 2639, src: "audio/whoosh-effect-382717.mp3", volume: 0.20 },
];

// ═══════════════════════════════════════════════════════════════
// SUPERPOWER ILLUSTRATION — Lightbulb with brain inside
// ═══════════════════════════════════════════════════════════════
const SuperpowerIllustration: React.FC<{ size?: number }> = ({
  size = 600,
}) => {
  const frame = useCurrentFrame();

  const bulbScale = spring({
    frame,
    fps: 30,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 140 },
  });

  const glowPulse = interpolate(frame % 40, [0, 20, 40], [0.3, 0.6, 0.3]);

  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
      {/* Glow */}
      <circle cx={300} cy={260} r={180} fill="#FF7614" opacity={glowPulse * bulbScale} />
      {/* Bulb shape */}
      <g transform={`translate(300, 260) scale(${bulbScale}) translate(-300, -260)`}>
        <ellipse cx={300} cy={240} rx={120} ry={140} fill="#FFD700" stroke="#E6A800" strokeWidth={4} />
        <rect x={265} y={370} width={70} height={30} rx={8} fill="#CCCCCC" stroke="#AAAAAA" strokeWidth={2} />
        <rect x={275} y={400} width={50} height={8} rx={4} fill="#AAAAAA" />
        {/* Brain lines inside */}
        <path d="M260 220 Q280 200 300 220 Q320 200 340 220" stroke="#FF7614" strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M260 250 Q280 230 300 250 Q320 230 340 250" stroke="#FF7614" strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M270 280 Q290 260 310 280 Q330 260 340 270" stroke="#FF7614" strokeWidth={3} fill="none" strokeLinecap="round" />
        {/* Lightning bolt */}
        <path d="M290 170 L280 210 L300 205 L285 250" stroke="#FF7614" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* Sparkles */}
      {[
        { x: 160, y: 160, d: 4 },
        { x: 440, y: 180, d: 8 },
        { x: 180, y: 380, d: 12 },
        { x: 430, y: 350, d: 6 },
      ].map((s, i) => {
        const sparkle = spring({
          frame: Math.max(0, frame - s.d),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 10, stiffness: 200 },
        });
        return (
          <g key={i} opacity={sparkle} transform={`translate(${s.x}, ${s.y}) scale(${sparkle})`}>
            <line x1={-12} y1={0} x2={12} y2={0} stroke="#FF7614" strokeWidth={3} strokeLinecap="round" />
            <line x1={0} y1={-12} x2={0} y2={12} stroke="#FF7614" strokeWidth={3} strokeLinecap="round" />
          </g>
        );
      })}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// MIND OF A CHILD ILLUSTRATION — Child silhouette with stars
// ═══════════════════════════════════════════════════════════════
const MindOfChildIllustration: React.FC<{ size?: number }> = ({
  size = 600,
}) => {
  const frame = useCurrentFrame();

  const headScale = spring({
    frame,
    fps: 30,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 140 },
  });

  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
      <g transform={`translate(300, 300) scale(${headScale}) translate(-300, -300)`}>
        {/* Child head silhouette */}
        <circle cx={300} cy={250} r={100} fill="#1A1A1A" />
        {/* Eyes - curious wide eyes */}
        <circle cx={270} cy={240} r={14} fill="white" />
        <circle cx={330} cy={240} r={14} fill="white" />
        <circle cx={273} cy={238} r={7} fill="#333" />
        <circle cx={333} cy={238} r={7} fill="#333" />
        {/* Smile */}
        <path d="M270 275 Q300 300 330 275" stroke="white" strokeWidth={4} fill="none" strokeLinecap="round" />
        {/* Thought bubbles rising */}
        <circle cx={380} cy={180} r={12} fill="#F0F0F0" opacity={0.7} />
        <circle cx={400} cy={140} r={18} fill="#F0F0F0" opacity={0.8} />
        {/* Stars around the head */}
        {[
          { x: 160, y: 150, delay: 5 },
          { x: 200, y: 100, delay: 8 },
          { x: 400, y: 120, delay: 11 },
          { x: 440, y: 180, delay: 14 },
          { x: 300, y: 80, delay: 7 },
        ].map((star, i) => {
          const starScale = spring({
            frame: Math.max(0, frame - star.delay),
            fps: 30,
            from: 0,
            to: 1,
            config: { damping: 10, stiffness: 180 },
          });
          return (
            <g key={i} opacity={starScale} transform={`translate(${star.x}, ${star.y}) scale(${starScale * 0.8})`}>
              <polygon
                points="0,-16 5,-5 16,-5 7,3 10,16 0,8 -10,16 -7,3 -16,-5 -5,-5"
                fill="#FFD700"
                stroke="#E6A800"
                strokeWidth={1}
              />
            </g>
          );
        })}
      </g>
      {/* "?" and "!" floating */}
      {[
        { x: 170, y: 350, char: "?", delay: 10 },
        { x: 430, y: 330, char: "!", delay: 15 },
      ].map((item, i) => {
        const charScale = spring({
          frame: Math.max(0, frame - item.delay),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 14, stiffness: 120 },
        });
        return (
          <text
            key={i}
            x={item.x}
            y={item.y}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontWeight={800}
            fontSize={48}
            fill="#FF7614"
            opacity={charScale}
            transform={`translate(${item.x}, ${item.y}) scale(${charScale}) translate(${-item.x}, ${-item.y})`}
          >
            {item.char}
          </text>
        );
      })}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// SETBACKS ILLUSTRATION — Storm clouds with lightning
// ═══════════════════════════════════════════════════════════════
const SetbacksIllustration: React.FC<{ size?: number }> = ({
  size = 600,
}) => {
  const frame = useCurrentFrame();

  const cloudScale = spring({
    frame,
    fps: 30,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 140 },
  });

  const lightningFlash = interpolate(frame % 30, [0, 2, 4, 30], [0, 1, 0, 0]);

  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
      <g transform={`translate(300, 250) scale(${cloudScale}) translate(-300, -250)`}>
        {/* Dark storm cloud */}
        <ellipse cx={300} cy={200} rx={160} ry={80} fill="#4A4A4A" />
        <ellipse cx={220} cy={210} rx={80} ry={60} fill="#555555" />
        <ellipse cx={380} cy={210} rx={80} ry={60} fill="#555555" />
        <ellipse cx={300} cy={230} rx={140} ry={50} fill="#3A3A3A" />
        {/* Rain drops */}
        {[
          { x: 220, y: 290, d: 8 },
          { x: 260, y: 310, d: 10 },
          { x: 300, y: 295, d: 12 },
          { x: 340, y: 315, d: 14 },
          { x: 380, y: 300, d: 9 },
        ].map((drop, i) => {
          const dropOpacity = spring({
            frame: Math.max(0, frame - drop.d),
            fps: 30,
            from: 0,
            to: 1,
            config: { damping: 20, stiffness: 100 },
          });
          return (
            <line
              key={i}
              x1={drop.x}
              y1={drop.y}
              x2={drop.x - 5}
              y2={drop.y + 25}
              stroke="#6B9DC8"
              strokeWidth={3}
              strokeLinecap="round"
              opacity={dropOpacity}
            />
          );
        })}
        {/* Lightning bolt */}
        <path
          d="M300 270 L280 330 L310 325 L285 400"
          stroke="#FFD700"
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.5 + lightningFlash * 0.5}
        />
      </g>
      {/* X marks for setbacks */}
      {[
        { x: 150, y: 420, delay: 10 },
        { x: 300, y: 450, delay: 14 },
        { x: 450, y: 420, delay: 18 },
      ].map((mark, i) => {
        const markScale = spring({
          frame: Math.max(0, frame - mark.delay),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 12, stiffness: 160 },
        });
        return (
          <g key={i} opacity={markScale} transform={`translate(${mark.x}, ${mark.y}) scale(${markScale})`}>
            <circle r={24} fill="#EF4444" />
            <line x1={-10} y1={-10} x2={10} y2={10} stroke="white" strokeWidth={4} strokeLinecap="round" />
            <line x1={10} y1={-10} x2={-10} y2={10} stroke="white" strokeWidth={4} strokeLinecap="round" />
          </g>
        );
      })}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// ENDURANCE & GRIT ILLUSTRATION — Diamond
// ═══════════════════════════════════════════════════════════════
const EnduranceGritIllustration: React.FC<{ size?: number }> = ({
  size = 600,
}) => {
  const frame = useCurrentFrame();

  const diamondScale = spring({
    frame,
    fps: 30,
    from: 0,
    to: 1,
    config: { damping: 10, stiffness: 140 },
  });

  const shimmer = interpolate(frame % 50, [0, 25, 50], [0.7, 1, 0.7]);

  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
      <g transform={`translate(300, 280) scale(${diamondScale}) translate(-300, -280)`}>
        {/* Diamond shape */}
        <polygon
          points="300,120 420,240 300,460 180,240"
          fill="#B8D4E3"
          stroke="#7FB3D1"
          strokeWidth={3}
        />
        {/* Diamond facets */}
        <polygon points="300,120 360,240 300,280 240,240" fill="#D4E8F5" opacity={shimmer} />
        <polygon points="300,120 240,240 300,280" fill="#A8C8DC" opacity={0.8} />
        <polygon points="300,280 360,240 420,240 300,460" fill="#8AB4CC" opacity={0.9} />
        <polygon points="300,280 240,240 180,240 300,460" fill="#9AC0D4" opacity={0.85} />
        {/* Shine lines */}
        <line x1={250} y1={200} x2={280} y2={220} stroke="white" strokeWidth={3} opacity={shimmer} strokeLinecap="round" />
        <line x1={260} y1={180} x2={270} y2={200} stroke="white" strokeWidth={2} opacity={shimmer * 0.7} strokeLinecap="round" />
      </g>
      {/* Radiating lines */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const lineScale = spring({
          frame: Math.max(0, frame - 8 - i * 2),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 16, stiffness: 100 },
        });
        const rad = (angle * Math.PI) / 180;
        const x1 = 300 + Math.cos(rad) * 170;
        const y1 = 280 + Math.sin(rad) * 170;
        const x2 = 300 + Math.cos(rad) * 200;
        const y2 = 280 + Math.sin(rad) * 200;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#FF7614"
            strokeWidth={3}
            strokeLinecap="round"
            opacity={lineScale * 0.6}
          />
        );
      })}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ═══════════════════════════════════════════════════════════════
export const JensenMindOfChild: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = getZoom(frame);

  const conceptActive = CONCEPT_RANGES.some(
    (r) => frame >= r.start && frame < r.end
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* ── BASE: Speaker video ─────────────────────── */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <OffthreadVideo
          src={staticFile("clips/clip1-mind-of-child.mp4")}
          volume={1}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
          }}
        />
      </div>

      {/* ═════ ConceptOverlay MOMENTS ═══════════════════════ */}

      {/* 1. "superpower" — frame 742, 75f */}
      <Sequence from={742} durationInFrames={75} premountFor={30}>
        <ConceptOverlay
          durationInFrames={75}
          illustration={<SuperpowerIllustration />}
          caption="SUPERPOWER"
          subtitle="The power of naive optimism"
          entrance="clip-circle"
          backgroundStyle="solid-white"
          illustrationSize={520}
        />
      </Sequence>

      {/* 2. "mind of a child" — frame 859, 80f */}
      <Sequence from={859} durationInFrames={80} premountFor={30}>
        <ConceptOverlay
          durationInFrames={80}
          illustration={<MindOfChildIllustration />}
          caption="MIND OF A CHILD"
          subtitle="How hard could it be?"
          entrance="clip-circle"
          backgroundStyle="solid-white"
          illustrationSize={520}
        />
      </Sequence>

      {/* 3. "how hard could it be?" — frame 1236, 50f (FloatingKeyword) */}
      <Sequence from={1236} durationInFrames={50} premountFor={30}>
        <FloatingKeyword
          durationInFrames={50}
          text={"HOW HARD\nCOULD IT BE?"}
          side="right"
          fontSize={72}
          topPercent={25}
          color="#FFFFFF"
          icon={
            <svg width={80} height={80} viewBox="0 0 80 80" fill="none">
              <polygon points="40,5 50,30 75,30 55,48 62,75 40,58 18,75 25,48 5,30 30,30" fill="#FFD700" stroke="#E6A800" strokeWidth={2} />
            </svg>
          }
        />
      </Sequence>

      {/* 4. "gigantic" — frame 1548, 60f (FloatingKeyword) */}
      <Sequence from={1548} durationInFrames={60} premountFor={30}>
        <FloatingKeyword
          durationInFrames={60}
          text="GIGANTIC"
          side="left"
          fontSize={80}
          topPercent={30}
          color="#FF7614"
          subtext="Hundreds of billions"
          icon={
            <svg width={70} height={70} viewBox="0 0 70 70" fill="none">
              <path d="M35 5 L40 25 L35 60 L30 25 Z" fill="#FF7614" />
              <path d="M15 35 L30 30 L55 35 L30 40 Z" fill="#FF7614" />
              <circle cx={35} cy={35} r={8} fill="#FFD700" />
            </svg>
          }
        />
      </Sequence>

      {/* 5. "setbacks" — frame 2108, 75f */}
      <Sequence from={2108} durationInFrames={75} premountFor={30}>
        <ConceptOverlay
          durationInFrames={75}
          illustration={<SetbacksIllustration />}
          caption="SETBACKS"
          subtitle="Trials, tribulations, disappointments"
          entrance="clip-circle"
          backgroundStyle="solid-white"
          illustrationSize={520}
        />
      </Sequence>

      {/* 6. "endurance & grit" — frame 2641, 80f */}
      <Sequence from={2641} durationInFrames={80} premountFor={30}>
        <ConceptOverlay
          durationInFrames={80}
          illustration={<EnduranceGritIllustration />}
          caption="ENDURANCE & GRIT"
          subtitle="Unbreakable under pressure"
          entrance="clip-circle"
          backgroundStyle="solid-white"
          illustrationSize={520}
        />
      </Sequence>

      {/* ═════ WORD-BY-WORD CAPTIONS (bottom 28%) ═════════════ */}
      <div
        style={{
          position: "absolute",
          bottom: "28%",
          left: 0,
          width: "100%",
          height: "10%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        {!conceptActive &&
          WORDS.map((w) => {
            if (frame < w.frame || frame >= w.frame + w.duration) return null;
            return (
              <div
                key={w.id}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    fontFamily,
                    fontWeight: 800,
                    fontSize: 72,
                    color: w.emphasis ? "#FF7614" : "#FFFFFF",
                    textAlign: "center",
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                    textShadow: w.emphasis
                      ? "0 0 20px rgba(255, 118, 20, 0.6), 0 4px 12px rgba(0,0,0,0.8)"
                      : "0 4px 12px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.7)",
                    padding: "0 60px",
                  }}
                >
                  {w.word}
                </div>
              </div>
            );
          })}
      </div>

      {/* ═════ SFX LAYER ════════════════════════════════════════ */}
      {SFX_EVENTS.map((sfx, i) => (
        <Sequence key={`sfx-${i}`} from={sfx.frame} premountFor={30}>
          <Audio
            src={staticFile(sfx.src)}
            volume={sfx.volume}
            startFrom={0}
          />
        </Sequence>
      ))}

      {/* ═════ BACKGROUND MUSIC (first 35s = 1050 frames) ═════ */}
      <Audio
        src={staticFile("audio/background-music.mp3")}
        volume={0.02}
        startFrom={0}
        endAt={1050}
      />
    </AbsoluteFill>
  );
};
