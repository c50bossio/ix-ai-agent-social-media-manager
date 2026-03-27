/**
 * Jensen Clip 6: "Intelligence Is a Commodity" (83s)
 *
 * Jensen: all 60 reports are smarter than him, yet he orchestrates them.
 * Humanity > intelligence. Determination, pain tolerance, life experience.
 *
 * Duration: 2490 frames @ 30fps (~83s)
 *
 * POP-OUTS (7 total):
 *   1. "COMMODITY" (frame 1, 65f) — ConceptOverlay: Diamond/coin
 *   2. "60 SUPERHUMANS" (frame 843, 70f) — ConceptOverlay: Circle of people
 *   3. "ORCHESTRATING" (frame 1002, 55f) — FloatingKeyword
 *   4. "DISHWASHER" (frame 1206, 60f) — FloatingKeyword: Transformation
 *   5. "HUMANITY > INTELLIGENCE" (frame 1629, 75f) — ConceptOverlay: Heart vs brain
 *   6. "DETERMINATION" (frame 1990, 60f) — FloatingKeyword: Flame
 *   7. "INTELLIGENCE ELEVATED" (frame 2322, 55f) — FloatingKeyword
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

import { WORDS, TOTAL_DURATION_FRAMES } from "../data/jensen-intelligence-commodity-words";

const { fontFamily } = loadFont();

const TOTAL_FRAMES = TOTAL_DURATION_FRAMES;

function getZoom(_frame: number): number {
  return 1.0;
}

const CONCEPT_RANGES = [
  { start: 1, end: 66 },       // Commodity
  { start: 843, end: 913 },    // 60 Superhumans
  { start: 1629, end: 1704 },  // Humanity > Intelligence
];

const SFX_EVENTS: Array<{ frame: number; src: string; volume: number }> = [
  { frame: 0, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.20 },
  { frame: 841, src: "audio/pop-402324.mp3", volume: 0.20 },
  { frame: 1000, src: "audio/whoosh-effect-382717.mp3", volume: 0.18 },
  { frame: 1204, src: "audio/pop-402324.mp3", volume: 0.18 },
  { frame: 1627, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.20 },
  { frame: 1988, src: "audio/whoosh-bamboo-389752.mp3", volume: 0.18 },
  { frame: 2320, src: "audio/pop-402324.mp3", volume: 0.18 },
];

// ═══════════════════════════════════════════════════════════════
// COMMODITY ILLUSTRATION — Diamond with $ sign
// ═══════════════════════════════════════════════════════════════
const CommodityIllustration: React.FC<{ size?: number }> = ({
  size = 600,
}) => {
  const frame = useCurrentFrame();

  const coinScale = spring({
    frame,
    fps: 30,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 140 },
  });

  const shimmer = interpolate(frame % 50, [0, 25, 50], [0.8, 1, 0.8]);

  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
      <g transform={`translate(300, 260) scale(${coinScale}) translate(-300, -260)`}>
        {/* Large coin */}
        <ellipse cx={300} cy={260} rx={140} ry={140} fill="#FFD700" stroke="#CC9900" strokeWidth={5} />
        <ellipse cx={300} cy={260} rx={120} ry={120} fill="none" stroke="#CC9900" strokeWidth={2} opacity={0.5} />
        {/* IQ text in center */}
        <text
          x={300}
          y={250}
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontWeight={900}
          fontSize={60}
          fill="#8B6914"
          opacity={shimmer}
        >
          IQ
        </text>
        <text
          x={300}
          y={300}
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontWeight={700}
          fontSize={22}
          fill="#8B6914"
          opacity={0.7}
        >
          COMMODITY
        </text>
        {/* Equal sign = commodity */}
        <text
          x={300}
          y={270}
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontWeight={900}
          fontSize={28}
          fill="#8B6914"
          opacity={0.5}
        >
          =
        </text>
      </g>
      {/* Falling coins */}
      {[
        { x: 160, y: 420, d: 8 },
        { x: 280, y: 440, d: 12 },
        { x: 400, y: 420, d: 10 },
      ].map((c, i) => {
        const cScale = spring({
          frame: Math.max(0, frame - c.d),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 14, stiffness: 120 },
        });
        return (
          <g key={i} opacity={cScale}>
            <ellipse cx={c.x} cy={c.y} rx={30} ry={30} fill="#FFD700" stroke="#CC9900" strokeWidth={2} />
            <text x={c.x} y={c.y + 8} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize={22} fill="#8B6914">$</text>
          </g>
        );
      })}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// 60 SUPERHUMANS — Circle of people with Jensen in center
// ═══════════════════════════════════════════════════════════════
const SuperhumansCircleIllustration: React.FC<{ size?: number }> = ({
  size = 600,
}) => {
  const frame = useCurrentFrame();

  const centerScale = spring({
    frame,
    fps: 30,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 140 },
  });

  const numPeople = 12; // Represent 60 with 12 dots

  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
      {/* Center person (Jensen) */}
      <g transform={`translate(300, 280) scale(${centerScale}) translate(-300, -280)`}>
        <circle cx={300} cy={280} r={45} fill="#FF7614" stroke="#E06610" strokeWidth={3} />
        <circle cx={300} cy={265} r={12} fill="white" />
        <path d="M282 295 Q300 278 318 295" fill="white" />
      </g>
      {/* Surrounding people */}
      {Array.from({ length: numPeople }).map((_, i) => {
        const angle = (i * 360) / numPeople - 90;
        const rad = (angle * Math.PI) / 180;
        const cx = 300 + Math.cos(rad) * 160;
        const cy = 280 + Math.sin(rad) * 160;
        const personScale = spring({
          frame: Math.max(0, frame - 4 - i * 2),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 12, stiffness: 160 },
        });
        return (
          <g key={i} opacity={personScale}>
            {/* Connection line */}
            <line x1={300} y1={280} x2={cx} y2={cy} stroke="#FF7614" strokeWidth={1.5} opacity={0.2} />
            {/* Person dot */}
            <circle cx={cx} cy={cy} r={22} fill="#F0F0F0" stroke="#DDD" strokeWidth={2} transform={`translate(${cx}, ${cy}) scale(${personScale}) translate(${-cx}, ${-cy})`} />
            <circle cx={cx} cy={cy - 5} r={6} fill="#999" />
            <path d={`M${cx - 8} ${cy + 8} Q${cx} ${cy} ${cx + 8} ${cy + 8}`} fill="#999" />
          </g>
        );
      })}
      {/* "60" count */}
      {(() => {
        const countScale = spring({
          frame: Math.max(0, frame - 20),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 14, stiffness: 120 },
        });
        return (
          <text
            x={300}
            y={500}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontWeight={800}
            fontSize={32}
            fill="#FF7614"
            opacity={countScale}
            letterSpacing={2}
          >
            60 DIRECT REPORTS
          </text>
        );
      })()}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// HUMANITY > INTELLIGENCE — Heart vs Brain
// ═══════════════════════════════════════════════════════════════
const HumanityVsIntelligenceIllustration: React.FC<{ size?: number }> = ({
  size = 600,
}) => {
  const frame = useCurrentFrame();

  const heartScale = spring({
    frame: Math.max(0, frame - 5),
    fps: 30,
    from: 0,
    to: 1,
    config: { damping: 10, stiffness: 160 },
  });

  const brainScale = spring({
    frame: Math.max(0, frame - 10),
    fps: 30,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 140 },
  });

  const heartPulse = interpolate(frame % 30, [0, 15, 30], [1, 1.08, 1]);

  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
      {/* Heart (left, bigger = winner) */}
      <g transform={`translate(200, 260) scale(${heartScale * heartPulse}) translate(-200, -260)`}>
        <path
          d="M200 220 Q200 170 240 170 Q280 170 280 210 Q280 240 200 310 Q120 240 120 210 Q120 170 160 170 Q200 170 200 220Z"
          fill="#EF4444"
          stroke="#CC3333"
          strokeWidth={3}
        />
        {/* Glow */}
        <circle cx={200} cy={240} r={80} fill="#EF4444" opacity={0.1} />
      </g>
      {/* ">" symbol */}
      {(() => {
        const gtScale = spring({
          frame: Math.max(0, frame - 14),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 14, stiffness: 120 },
        });
        return (
          <text
            x={300}
            y={275}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontWeight={900}
            fontSize={56}
            fill="#FF7614"
            opacity={gtScale}
          >
            {">"}
          </text>
        );
      })()}
      {/* Brain (right, smaller = commodity) */}
      <g transform={`translate(400, 260) scale(${brainScale * 0.8}) translate(-400, -260)`}>
        <path
          d="M400 200 Q440 200 450 230 Q460 240 455 260 Q465 275 455 295 Q460 310 440 320 Q430 330 410 325 Q400 335 390 325 Q370 330 360 320 Q340 310 345 295 Q335 275 345 260 Q340 240 350 230 Q360 200 400 200Z"
          fill="#CCCCCC"
          stroke="#AAA"
          strokeWidth={2}
        />
        <path d="M380 225 Q400 215 420 225" stroke="#AAA" strokeWidth={1.5} fill="none" />
        <path d="M375 260 Q400 250 425 260" stroke="#AAA" strokeWidth={1.5} fill="none" />
      </g>
      {/* Labels */}
      {(() => {
        const labelP = spring({
          frame: Math.max(0, frame - 18),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 16, stiffness: 100 },
        });
        return (
          <g opacity={labelP}>
            <text x={200} y={380} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize={22} fill="#EF4444" letterSpacing={2}>HUMANITY</text>
            <text x={400} y={380} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={700} fontSize={18} fill="#999" letterSpacing={2}>INTELLIGENCE</text>
          </g>
        );
      })()}
      {/* Attributes under humanity */}
      {[
        { text: "Determination", delay: 20, y: 420 },
        { text: "Life Experience", delay: 24, y: 450 },
        { text: "Tolerance for Pain", delay: 28, y: 480 },
      ].map((attr, i) => {
        const attrScale = spring({
          frame: Math.max(0, frame - attr.delay),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 14, stiffness: 120 },
        });
        return (
          <text
            key={i}
            x={300}
            y={attr.y}
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontWeight={600}
            fontSize={18}
            fill="#666"
            opacity={attrScale}
          >
            {attr.text}
          </text>
        );
      })}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ═══════════════════════════════════════════════════════════════
export const JensenIntelligenceCommodity: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = getZoom(frame);

  const conceptActive = CONCEPT_RANGES.some(
    (r) => frame >= r.start && frame < r.end
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <div style={{ position: "absolute", width: "100%", height: "100%", overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile("clips/clip6-intelligence-commodity.mp4")}
          volume={1}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, transformOrigin: "center center" }}
        />
      </div>

      {/* 1. "commodity" — frame 1, 65f */}
      <Sequence from={1} durationInFrames={65} premountFor={30}>
        <ConceptOverlay
          durationInFrames={65}
          illustration={<CommodityIllustration />}
          caption="INTELLIGENCE"
          subtitle="Is a commodity"
          entrance="clip-circle"
          backgroundStyle="solid-white"
          illustrationSize={520}
        />
      </Sequence>

      {/* 2. "60 superhumans" — frame 843, 70f */}
      <Sequence from={843} durationInFrames={70} premountFor={30}>
        <ConceptOverlay
          durationInFrames={70}
          illustration={<SuperhumansCircleIllustration />}
          caption="60 SUPERHUMANS"
          subtitle="All smarter than me in their field"
          entrance="clip-circle"
          backgroundStyle="solid-white"
          illustrationSize={520}
        />
      </Sequence>

      {/* 3. "orchestrating" — frame 1002, 55f (FloatingKeyword) */}
      <Sequence from={1002} durationInFrames={55} premountFor={30}>
        <FloatingKeyword
          durationInFrames={55}
          text="ORCHESTRATING"
          side="right"
          fontSize={60}
          topPercent={25}
          color="#FF7614"
          subtext="All 60 of them"
          icon={
            <svg width={60} height={60} viewBox="0 0 60 60" fill="none">
              <circle cx={30} cy={30} r={8} fill="#FF7614" />
              {[0, 60, 120, 180, 240, 300].map((a, i) => {
                const rad = (a * Math.PI) / 180;
                return <circle key={i} cx={30 + Math.cos(rad) * 20} cy={30 + Math.sin(rad) * 20} r={5} fill="#F0F0F0" stroke="#DDD" strokeWidth={1.5} />;
              })}
            </svg>
          }
        />
      </Sequence>

      {/* 4. "dishwasher" — frame 1206, 60f (FloatingKeyword) */}
      <Sequence from={1206} durationInFrames={60} premountFor={30}>
        <FloatingKeyword
          durationInFrames={60}
          text={"DISHWASHER\n\u2192 CEO"}
          side="left"
          fontSize={68}
          topPercent={28}
          color="#FFFFFF"
          subtext="Transformation through humanity"
        />
      </Sequence>

      {/* 5. "humanity > intelligence" — frame 1629, 75f */}
      <Sequence from={1629} durationInFrames={75} premountFor={30}>
        <ConceptOverlay
          durationInFrames={75}
          illustration={<HumanityVsIntelligenceIllustration />}
          caption="HUMANITY"
          subtitle="Not specified functionally"
          entrance="clip-circle"
          backgroundStyle="solid-white"
          illustrationSize={550}
        />
      </Sequence>

      {/* 6. "determination" — frame 1990, 60f (FloatingKeyword) */}
      <Sequence from={1990} durationInFrames={60} premountFor={30}>
        <FloatingKeyword
          durationInFrames={60}
          text="DETERMINATION"
          side="right"
          fontSize={60}
          topPercent={25}
          color="#FFD700"
          icon={
            <svg width={60} height={60} viewBox="0 0 60 60" fill="none">
              <path d="M30 10 Q35 25 40 30 Q45 35 40 45 Q35 55 30 55 Q25 55 20 45 Q15 35 20 30 Q25 25 30 10Z" fill="#FF6B00" />
              <path d="M30 22 Q33 30 35 34 Q37 38 35 43 Q33 48 30 48 Q27 48 25 43 Q23 38 25 34 Q27 30 30 22Z" fill="#FFD700" />
            </svg>
          }
        />
      </Sequence>

      {/* 7. "intelligence elevated" — frame 2322, 55f (FloatingKeyword) */}
      <Sequence from={2322} durationInFrames={55} premountFor={30}>
        <FloatingKeyword
          durationInFrames={55}
          text={"INTELLIGENCE\nELEVATED"}
          side="left"
          fontSize={64}
          topPercent={30}
          color="#FFFFFF"
          subtext="A word we've elevated too high"
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
