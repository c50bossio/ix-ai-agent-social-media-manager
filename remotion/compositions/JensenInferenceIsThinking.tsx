/**
 * Jensen Clip 2: "Inference Is Thinking" (76s)
 *
 * Jensen explains why inference is compute-intensive, not lightweight.
 * Pre-training is memorization; inference is reasoning, searching, exploring.
 *
 * Duration: 2295 frames @ 30fps (~76s)
 *
 * POP-OUTS (6 total):
 *   1. "INFERENCE IS THINKING" (frame 112, 75f) — ConceptOverlay: Brain with gears
 *   2. "THINKING IS HARD" (frame 285, 55f) — FloatingKeyword
 *   3. "MEMORIZATION" (frame 458, 70f) — ConceptOverlay: Books/reading
 *   4. "DECOMPOSING" (frame 1006, 60f) — FloatingKeyword: Puzzle pieces
 *   5. "REASONING" (frame 1215, 55f) — FloatingKeyword: Compass
 *   6. "COMPUTE INTENSIVE" (frame 2163, 75f) — ConceptOverlay: Server rack
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

import { WORDS, TOTAL_DURATION_FRAMES } from "../data/jensen-inference-is-thinking-words";

const { fontFamily } = loadFont();

const TOTAL_FRAMES = TOTAL_DURATION_FRAMES;

function getZoom(_frame: number): number {
  return 1.0;
}

const CONCEPT_RANGES = [
  { start: 112, end: 187 },   // Inference Is Thinking
  { start: 458, end: 528 },   // Memorization
  { start: 2163, end: 2238 }, // Compute Intensive
];

const SFX_EVENTS: Array<{ frame: number; src: string; volume: number }> = [
  { frame: 110, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.20 },
  { frame: 283, src: "audio/pop-402324.mp3", volume: 0.18 },
  { frame: 456, src: "audio/whoosh-effect-382717.mp3", volume: 0.20 },
  { frame: 1004, src: "audio/pop-402324.mp3", volume: 0.18 },
  { frame: 1213, src: "audio/whoosh-bamboo-389752.mp3", volume: 0.18 },
  { frame: 2161, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.20 },
];

// ═══════════════════════════════════════════════════════════════
// BRAIN WITH GEARS — Inference = Thinking
// ═══════════════════════════════════════════════════════════════
const BrainThinkingIllustration: React.FC<{ size?: number }> = ({
  size = 600,
}) => {
  const frame = useCurrentFrame();

  const brainScale = spring({
    frame,
    fps: 30,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 140 },
  });

  const gearRotation = frame * 3;

  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
      <g transform={`translate(300, 280) scale(${brainScale}) translate(-300, -280)`}>
        {/* Brain outline */}
        <path
          d="M300 140 Q380 140 400 200 Q430 220 420 270 Q440 300 420 340 Q430 380 390 400 Q370 430 320 420 Q300 440 280 420 Q230 430 210 400 Q170 380 180 340 Q160 300 180 270 Q170 220 200 200 Q220 140 300 140Z"
          fill="#F8E8FF"
          stroke="#9B59B6"
          strokeWidth={4}
        />
        {/* Brain fold lines */}
        <path d="M250 200 Q300 180 350 200" stroke="#9B59B6" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <path d="M230 260 Q300 240 370 260" stroke="#9B59B6" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <path d="M240 320 Q300 300 360 320" stroke="#9B59B6" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <path d="M300 180 L300 400" stroke="#9B59B6" strokeWidth={2} opacity={0.4} />
        {/* Gear 1 */}
        <g transform={`translate(260, 250) rotate(${gearRotation})`}>
          <circle r={22} fill="#FF7614" stroke="#E06610" strokeWidth={2} />
          <circle r={8} fill="white" />
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <rect
                key={i}
                x={-5}
                y={-28}
                width={10}
                height={12}
                rx={2}
                fill="#FF7614"
                stroke="#E06610"
                strokeWidth={1}
                transform={`rotate(${angle})`}
              />
            );
          })}
        </g>
        {/* Gear 2 */}
        <g transform={`translate(340, 290) rotate(${-gearRotation * 0.8})`}>
          <circle r={18} fill="#FF9500" stroke="#CC7700" strokeWidth={2} />
          <circle r={6} fill="white" />
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <rect
              key={i}
              x={-4}
              y={-23}
              width={8}
              height={10}
              rx={2}
              fill="#FF9500"
              stroke="#CC7700"
              strokeWidth={1}
              transform={`rotate(${angle})`}
            />
          ))}
        </g>
      </g>
      {/* Thought sparks */}
      {[
        { x: 170, y: 160, d: 6 },
        { x: 430, y: 180, d: 10 },
        { x: 150, y: 380, d: 14 },
      ].map((s, i) => {
        const sp = spring({
          frame: Math.max(0, frame - s.d),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 10, stiffness: 180 },
        });
        return (
          <circle key={i} cx={s.x} cy={s.y} r={6} fill="#FF7614" opacity={sp} />
        );
      })}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// MEMORIZATION — Books stacked
// ═══════════════════════════════════════════════════════════════
const MemorizationIllustration: React.FC<{ size?: number }> = ({
  size = 600,
}) => {
  const frame = useCurrentFrame();

  const books = [
    { y: 350, color: "#4A90D9", delay: 3 },
    { y: 310, color: "#5BA55B", delay: 6 },
    { y: 270, color: "#D9534F", delay: 9 },
    { y: 230, color: "#F0AD4E", delay: 12 },
  ];

  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
      {/* Books stack */}
      {books.map((book, i) => {
        const bookScale = spring({
          frame: Math.max(0, frame - book.delay),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 12, stiffness: 160 },
        });
        return (
          <g key={i} opacity={bookScale} transform={`translate(300, ${book.y}) scale(${bookScale}) translate(-300, ${-book.y})`}>
            <rect x={180} y={book.y} width={240} height={35} rx={4} fill={book.color} stroke={`${book.color}CC`} strokeWidth={2} />
            <rect x={185} y={book.y + 3} width={5} height={29} rx={2} fill="white" opacity={0.3} />
            <line x1={220} y1={book.y + 17} x2={380} y2={book.y + 17} stroke="white" strokeWidth={2} opacity={0.4} strokeLinecap="round" />
          </g>
        );
      })}
      {/* Reading eye */}
      {(() => {
        const eyeScale = spring({
          frame: Math.max(0, frame - 16),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 14, stiffness: 120 },
        });
        return (
          <g opacity={eyeScale} transform={`translate(300, 170) scale(${eyeScale}) translate(-300, -170)`}>
            <ellipse cx={300} cy={170} rx={50} ry={30} fill="white" stroke="#333" strokeWidth={3} />
            <circle cx={300} cy={170} r={15} fill="#333" />
            <circle cx={305} cy={166} r={5} fill="white" />
          </g>
        );
      })()}
      {/* Label */}
      {(() => {
        const labelP = spring({
          frame: Math.max(0, frame - 20),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 16, stiffness: 100 },
        });
        return (
          <text
            x={300}
            y={440}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontWeight={700}
            fontSize={22}
            fill="#888"
            opacity={labelP}
            letterSpacing={3}
          >
            READING & MEMORIZING
          </text>
        );
      })()}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// COMPUTE INTENSIVE — Server rack with heat
// ═══════════════════════════════════════════════════════════════
const ComputeIntensiveIllustration: React.FC<{ size?: number }> = ({
  size = 600,
}) => {
  const frame = useCurrentFrame();

  const rackScale = spring({
    frame,
    fps: 30,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 140 },
  });

  const heatWave = interpolate(frame % 40, [0, 20, 40], [0, 4, 0]);

  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
      <g transform={`translate(300, 300) scale(${rackScale}) translate(-300, -300)`}>
        {/* Server rack */}
        <rect x={180} y={120} width={240} height={380} rx={12} fill="#2A2A2A" stroke="#444" strokeWidth={3} />
        {/* Server units */}
        {[0, 1, 2, 3, 4].map((i) => {
          const unitY = 140 + i * 68;
          const blink = (frame + i * 10) % 30 < 15;
          return (
            <g key={i}>
              <rect x={200} y={unitY} width={200} height={50} rx={6} fill="#1A1A1A" stroke="#555" strokeWidth={1.5} />
              {/* LED lights */}
              <circle cx={220} cy={unitY + 25} r={5} fill={blink ? "#00FF66" : "#004400"} />
              <circle cx={238} cy={unitY + 25} r={5} fill="#FF7614" />
              {/* Vent lines */}
              {[0, 1, 2, 3].map((j) => (
                <line
                  key={j}
                  x1={280 + j * 20}
                  y1={unitY + 12}
                  x2={280 + j * 20}
                  y2={unitY + 38}
                  stroke="#333"
                  strokeWidth={2}
                />
              ))}
            </g>
          );
        })}
        {/* Heat waves */}
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${220 + i * 70} ${110 + heatWave} Q${240 + i * 70} ${90} ${260 + i * 70} ${110 - heatWave}`}
            stroke="#FF7614"
            strokeWidth={2.5}
            fill="none"
            opacity={0.4}
            strokeLinecap="round"
          />
        ))}
      </g>
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ═══════════════════════════════════════════════════════════════
export const JensenInferenceIsThinking: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = getZoom(frame);

  const conceptActive = CONCEPT_RANGES.some(
    (r) => frame >= r.start && frame < r.end
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <OffthreadVideo
          src={staticFile("clips/clip2-inference-is-thinking.mp4")}
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

      {/* 1. "inference is thinking" — frame 112, 75f */}
      <Sequence from={112} durationInFrames={75} premountFor={30}>
        <ConceptOverlay
          durationInFrames={75}
          illustration={<BrainThinkingIllustration />}
          caption="INFERENCE IS THINKING"
          subtitle="Not lightweight -- compute heavy"
          entrance="clip-circle"
          backgroundStyle="solid-white"
          illustrationSize={520}
        />
      </Sequence>

      {/* 2. "thinking is hard" — frame 285, 55f (FloatingKeyword) */}
      <Sequence from={285} durationInFrames={55} premountFor={30}>
        <FloatingKeyword
          durationInFrames={55}
          text={"THINKING\nIS HARD"}
          side="left"
          fontSize={76}
          topPercent={25}
          color="#FFFFFF"
          icon={
            <svg width={60} height={60} viewBox="0 0 60 60" fill="none">
              <circle cx={30} cy={30} r={25} fill="none" stroke="#FF7614" strokeWidth={4} />
              <path d="M20 38 Q30 26 40 38" stroke="#FF7614" strokeWidth={3} fill="none" strokeLinecap="round" />
              <circle cx={22} cy={24} r={3} fill="#FF7614" />
              <circle cx={38} cy={24} r={3} fill="#FF7614" />
            </svg>
          }
        />
      </Sequence>

      {/* 3. "memorization" — frame 458, 70f */}
      <Sequence from={458} durationInFrames={70} premountFor={30}>
        <ConceptOverlay
          durationInFrames={70}
          illustration={<MemorizationIllustration />}
          caption="PRE-TRAINING"
          subtitle="Memorization & generalization"
          entrance="clip-circle"
          backgroundStyle="solid-white"
          illustrationSize={520}
        />
      </Sequence>

      {/* 4. "decomposing" — frame 1006, 60f (FloatingKeyword) */}
      <Sequence from={1006} durationInFrames={60} premountFor={30}>
        <FloatingKeyword
          durationInFrames={60}
          text="DECOMPOSING"
          side="right"
          fontSize={68}
          topPercent={30}
          color="#FF7614"
          subtext="Into solvable pieces"
          icon={
            <svg width={70} height={70} viewBox="0 0 70 70" fill="none">
              <rect x={5} y={5} width={25} height={25} rx={4} fill="#FF7614" opacity={0.8} transform="rotate(5, 17, 17)" />
              <rect x={38} y={8} width={25} height={25} rx={4} fill="#FF9500" opacity={0.8} transform="rotate(-3, 50, 20)" />
              <rect x={10} y={38} width={25} height={25} rx={4} fill="#FFB800" opacity={0.8} transform="rotate(-5, 22, 50)" />
              <rect x={40} y={40} width={25} height={25} rx={4} fill="#FF7614" opacity={0.6} transform="rotate(8, 52, 52)" />
            </svg>
          }
        />
      </Sequence>

      {/* 5. "reasoning" — frame 1215, 55f (FloatingKeyword) */}
      <Sequence from={1215} durationInFrames={55} premountFor={30}>
        <FloatingKeyword
          durationInFrames={55}
          text="REASONING"
          side="left"
          fontSize={76}
          topPercent={28}
          color="#FFFFFF"
          subtext="First principles"
          icon={
            <svg width={70} height={70} viewBox="0 0 70 70" fill="none">
              <circle cx={35} cy={35} r={28} fill="none" stroke="#FF7614" strokeWidth={3} />
              <path d="M35 12 L35 58" stroke="#FF7614" strokeWidth={2} />
              <path d="M12 35 L58 35" stroke="#FF7614" strokeWidth={2} />
              <polygon points="35,8 38,15 32,15" fill="#FF7614" />
              <circle cx={35} cy={35} r={5} fill="#FF7614" />
            </svg>
          }
        />
      </Sequence>

      {/* 6. "compute intensive" — frame 2163, 75f */}
      <Sequence from={2163} durationInFrames={75} premountFor={30}>
        <ConceptOverlay
          durationInFrames={75}
          illustration={<ComputeIntensiveIllustration />}
          caption="COMPUTE INTENSIVE"
          subtitle="Test-time scaling demands power"
          entrance="clip-circle"
          backgroundStyle="solid-white"
          illustrationSize={520}
        />
      </Sequence>

      {/* ═════ WORD-BY-WORD CAPTIONS ═════════════ */}
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

      {/* ═════ SFX ═════ */}
      {SFX_EVENTS.map((sfx, i) => (
        <Sequence key={`sfx-${i}`} from={sfx.frame} premountFor={30}>
          <Audio src={staticFile(sfx.src)} volume={sfx.volume} startFrom={0} />
        </Sequence>
      ))}

      {/* ═════ BACKGROUND MUSIC ═════ */}
      <Audio
        src={staticFile("audio/background-music.mp3")}
        volume={0.02}
        startFrom={0}
        endAt={1050}
      />
    </AbsoluteFill>
  );
};
