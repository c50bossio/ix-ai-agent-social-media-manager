/**
 * Jensen Clip 5: "How Jensen Manifests the Future" (66s)
 *
 * Jensen's decision-making: reason until convinced, then manifest through engineering.
 * Curiosity -> Conviction -> Manifest -> Suffer -> Engineer -> Reality
 *
 * Duration: 1980 frames @ 30fps (~66s)
 *
 * POP-OUTS (6 total):
 *   1. "CURIOSITY" (frame 275, 65f) — ConceptOverlay: Telescope
 *   2. "REASONING SYSTEM" (frame 371, 55f) — FloatingKeyword
 *   3. "MANIFEST" (frame 866, 70f) — ConceptOverlay: Blueprint
 *   4. "SUFFERING IN BETWEEN" (frame 1133, 65f) — ConceptOverlay: Fire
 *   5. "ENGINEERING" (frame 1404, 55f) — FloatingKeyword: Gears
 *   6. "REASONING" (frame 1898, 55f) — FloatingKeyword
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

import { WORDS, TOTAL_DURATION_FRAMES } from "../data/jensen-manifest-the-future-words";

const { fontFamily } = loadFont();

const TOTAL_FRAMES = TOTAL_DURATION_FRAMES;

function getZoom(_frame: number): number {
  return 1.0;
}

const CONCEPT_RANGES = [
  { start: 275, end: 340 },    // Curiosity
  { start: 866, end: 936 },    // Manifest
  { start: 1133, end: 1198 },  // Suffering
];

const SFX_EVENTS: Array<{ frame: number; src: string; volume: number }> = [
  { frame: 273, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.20 },
  { frame: 369, src: "audio/pop-402324.mp3", volume: 0.18 },
  { frame: 864, src: "audio/whoosh-effect-382717.mp3", volume: 0.20 },
  { frame: 1131, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.20 },
  { frame: 1402, src: "audio/pop-402324.mp3", volume: 0.18 },
  { frame: 1896, src: "audio/whoosh-bamboo-389752.mp3", volume: 0.18 },
];

// ═══════════════════════════════════════════════════════════════
// CURIOSITY ILLUSTRATION — Telescope looking at stars
// ═══════════════════════════════════════════════════════════════
const CuriosityIllustration: React.FC<{ size?: number }> = ({
  size = 600,
}) => {
  const frame = useCurrentFrame();

  const scopeScale = spring({
    frame,
    fps: 30,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 140 },
  });

  const twinkle = interpolate(frame % 30, [0, 15, 30], [0.4, 1, 0.4]);

  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
      <g transform={`translate(300, 300) scale(${scopeScale}) translate(-300, -300)`}>
        {/* Telescope body */}
        <rect x={220} y={200} width={200} height={40} rx={8} fill="#333" stroke="#555" strokeWidth={3} transform="rotate(-30, 320, 220)" />
        {/* Lens */}
        <circle cx={200} cy={250} r={28} fill="#4488AA" stroke="#333" strokeWidth={4} />
        <circle cx={200} cy={250} r={18} fill="#66AACC" opacity={0.6} />
        {/* Tripod */}
        <line x1={320} y1={260} x2={260} y2={440} stroke="#555" strokeWidth={5} strokeLinecap="round" />
        <line x1={320} y1={260} x2={380} y2={440} stroke="#555" strokeWidth={5} strokeLinecap="round" />
        <line x1={320} y1={260} x2={320} y2={440} stroke="#555" strokeWidth={4} strokeLinecap="round" />
      </g>
      {/* Stars */}
      {[
        { x: 120, y: 120, d: 5 },
        { x: 250, y: 80, d: 8 },
        { x: 380, y: 100, d: 11 },
        { x: 480, y: 150, d: 14 },
        { x: 150, y: 180, d: 7 },
      ].map((star, i) => {
        const starScale = spring({
          frame: Math.max(0, frame - star.d),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 10, stiffness: 180 },
        });
        return (
          <g key={i} opacity={starScale * twinkle}>
            <circle cx={star.x} cy={star.y} r={4} fill="#FFD700" />
            <line x1={star.x - 8} y1={star.y} x2={star.x + 8} y2={star.y} stroke="#FFD700" strokeWidth={1.5} strokeLinecap="round" />
            <line x1={star.x} y1={star.y - 8} x2={star.x} y2={star.y + 8} stroke="#FFD700" strokeWidth={1.5} strokeLinecap="round" />
          </g>
        );
      })}
      {/* Question mark */}
      {(() => {
        const qScale = spring({
          frame: Math.max(0, frame - 16),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 14, stiffness: 120 },
        });
        return (
          <text
            x={480}
            y={280}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontWeight={800}
            fontSize={60}
            fill="#FF7614"
            opacity={qScale}
            transform={`translate(480, 280) scale(${qScale}) translate(-480, -280)`}
          >
            ?
          </text>
        );
      })()}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// MANIFEST ILLUSTRATION — Blueprint with arrows
// ═══════════════════════════════════════════════════════════════
const ManifestIllustration: React.FC<{ size?: number }> = ({
  size = 600,
}) => {
  const frame = useCurrentFrame();

  const blueprintScale = spring({
    frame,
    fps: 30,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 140 },
  });

  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
      <g transform={`translate(300, 280) scale(${blueprintScale}) translate(-300, -280)`}>
        {/* Blueprint paper */}
        <rect x={140} y={140} width={320} height={300} rx={8} fill="#1A3A5C" stroke="#2A5A8C" strokeWidth={3} />
        {/* Grid lines */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={`grid-${i}`}>
            <line x1={140} y1={190 + i * 42} x2={460} y2={190 + i * 42} stroke="#2A5A8C" strokeWidth={1} opacity={0.4} />
            <line x1={190 + i * 45} y1={140} x2={190 + i * 45} y2={440} stroke="#2A5A8C" strokeWidth={1} opacity={0.4} />
          </g>
        ))}
        {/* Blueprint drawings */}
        <rect x={200} y={200} width={100} height={80} rx={4} fill="none" stroke="white" strokeWidth={2} opacity={0.7} />
        <circle cx={380} cy={240} r={40} fill="none" stroke="white" strokeWidth={2} opacity={0.7} />
        <line x1={300} y1={200} x2={340} y2={240} stroke="white" strokeWidth={2} opacity={0.5} strokeDasharray="6 3" />
        {/* Arrow: Vision -> Reality */}
        {(() => {
          const arrowScale = spring({
            frame: Math.max(0, frame - 12),
            fps: 30,
            from: 0,
            to: 1,
            config: { damping: 14, stiffness: 100 },
          });
          return (
            <g opacity={arrowScale}>
              <path d="M200 360 L400 360" stroke="#FF7614" strokeWidth={4} strokeLinecap="round" />
              <polygon points="395,350 415,360 395,370" fill="#FF7614" />
              <text x={200} y={400} fontFamily="Inter, sans-serif" fontWeight={700} fontSize={16} fill="white" opacity={0.8}>VISION</text>
              <text x={370} y={400} fontFamily="Inter, sans-serif" fontWeight={700} fontSize={16} fill="#FF7614">REALITY</text>
            </g>
          );
        })()}
      </g>
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// SUFFERING IN BETWEEN — Fire/flame
// ═══════════════════════════════════════════════════════════════
const SufferingIllustration: React.FC<{ size?: number }> = ({
  size = 600,
}) => {
  const frame = useCurrentFrame();

  const fireScale = spring({
    frame,
    fps: 30,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 140 },
  });

  const flicker = interpolate(frame % 20, [0, 10, 20], [0.8, 1, 0.8]);
  const sway = interpolate(frame % 40, [0, 20, 40], [-3, 3, -3]);

  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
      <g transform={`translate(${300 + sway}, 300) scale(${fireScale}) translate(-300, -300)`}>
        {/* Outer flame */}
        <path
          d="M300 120 Q350 200 380 280 Q400 350 350 400 Q330 430 300 440 Q270 430 250 400 Q200 350 220 280 Q250 200 300 120Z"
          fill="#FF6B00"
          opacity={flicker}
        />
        {/* Middle flame */}
        <path
          d="M300 180 Q330 230 350 290 Q360 340 330 380 Q310 400 300 400 Q290 400 270 380 Q240 340 250 290 Q270 230 300 180Z"
          fill="#FF9500"
          opacity={flicker * 0.9}
        />
        {/* Inner flame */}
        <path
          d="M300 240 Q320 270 330 310 Q335 340 315 360 Q305 370 300 370 Q295 370 285 360 Q265 340 270 310 Q280 270 300 240Z"
          fill="#FFD700"
          opacity={flicker}
        />
        {/* Embers */}
        {[
          { x: 250, y: 150, d: 6 },
          { x: 350, y: 170, d: 10 },
          { x: 230, y: 200, d: 14 },
        ].map((ember, i) => {
          const emberOpacity = spring({
            frame: Math.max(0, frame - ember.d),
            fps: 30,
            from: 0,
            to: 1,
            config: { damping: 20, stiffness: 100 },
          });
          return <circle key={i} cx={ember.x} cy={ember.y} r={3} fill="#FFD700" opacity={emberOpacity * 0.6} />;
        })}
      </g>
      {/* Text */}
      {(() => {
        const textP = spring({
          frame: Math.max(0, frame - 15),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 16, stiffness: 100 },
        });
        return (
          <text x={300} y={510} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={700} fontSize={20} fill="#888" opacity={textP} letterSpacing={3}>
            THE GAP BETWEEN VISION & REALITY
          </text>
        );
      })()}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ═══════════════════════════════════════════════════════════════
export const JensenManifestTheFuture: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = getZoom(frame);

  const conceptActive = CONCEPT_RANGES.some(
    (r) => frame >= r.start && frame < r.end
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <div style={{ position: "absolute", width: "100%", height: "100%", overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile("clips/clip5-manifest-the-future.mp4")}
          volume={1}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, transformOrigin: "center center" }}
        />
      </div>

      {/* 1. "curiosity" — frame 275, 65f */}
      <Sequence from={275} durationInFrames={65} premountFor={30}>
        <ConceptOverlay
          durationInFrames={65}
          illustration={<CuriosityIllustration />}
          caption="CURIOSITY"
          subtitle="Informed by a lot of curiosity"
          entrance="clip-circle"
          backgroundStyle="solid-white"
          illustrationSize={520}
        />
      </Sequence>

      {/* 2. "reasoning system" — frame 371, 55f (FloatingKeyword) */}
      <Sequence from={371} durationInFrames={55} premountFor={30}>
        <FloatingKeyword
          durationInFrames={55}
          text={"REASONING\nSYSTEM"}
          side="left"
          fontSize={72}
          topPercent={25}
          color="#FFFFFF"
          icon={
            <svg width={60} height={60} viewBox="0 0 60 60" fill="none">
              <circle cx={30} cy={30} r={25} fill="none" stroke="#FF7614" strokeWidth={3} />
              <path d="M20 30 L28 38 L42 22" stroke="#FF7614" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
      </Sequence>

      {/* 3. "manifest" — frame 866, 70f */}
      <Sequence from={866} durationInFrames={70} premountFor={30}>
        <ConceptOverlay
          durationInFrames={70}
          illustration={<ManifestIllustration />}
          caption="MANIFEST A FUTURE"
          subtitle="From vision to engineering reality"
          entrance="clip-circle"
          backgroundStyle="solid-white"
          illustrationSize={520}
        />
      </Sequence>

      {/* 4. "suffering in between" — frame 1133, 65f */}
      <Sequence from={1133} durationInFrames={65} premountFor={30}>
        <ConceptOverlay
          durationInFrames={65}
          illustration={<SufferingIllustration />}
          caption="SUFFERING"
          subtitle="A lot of suffering in between"
          entrance="clip-circle"
          backgroundStyle="solid-white"
          illustrationSize={520}
        />
      </Sequence>

      {/* 5. "engineering" — frame 1404, 55f (FloatingKeyword) */}
      <Sequence from={1404} durationInFrames={55} premountFor={30}>
        <FloatingKeyword
          durationInFrames={55}
          text="ENGINEERING"
          side="right"
          fontSize={68}
          topPercent={28}
          color="#FF7614"
          subtext="Manifest through building"
          icon={
            <svg width={60} height={60} viewBox="0 0 60 60" fill="none">
              <circle cx={30} cy={30} r={18} fill="none" stroke="#FF7614" strokeWidth={3} />
              <circle cx={30} cy={30} r={6} fill="#FF7614" />
              {[0, 60, 120, 180, 240, 300].map((a, i) => {
                const rad = (a * Math.PI) / 180;
                return <rect key={i} x={-4} y={-24} width={8} height={10} rx={2} fill="#FF7614" transform={`translate(30, 30) rotate(${a})`} />;
              })}
            </svg>
          }
        />
      </Sequence>

      {/* 6. "reasoning" — frame 1898, 55f (FloatingKeyword) */}
      <Sequence from={1898} durationInFrames={55} premountFor={30}>
        <FloatingKeyword
          durationInFrames={55}
          text="REASONING"
          side="left"
          fontSize={76}
          topPercent={30}
          color="#FFFFFF"
          subtext="Spent a lot of time reasoning"
        />
      </Sequence>

      {/* ═════ WORD-BY-WORD CAPTIONS ═════ */}
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

      {SFX_EVENTS.map((sfx, i) => (
        <Sequence key={`sfx-${i}`} from={sfx.frame} premountFor={30}>
          <Audio src={staticFile(sfx.src)} volume={sfx.volume} startFrom={0} />
        </Sequence>
      ))}

      <Audio src={staticFile("audio/background-music.mp3")} volume={0.02} startFrom={0} endAt={1050} />
    </AbsoluteFill>
  );
};
