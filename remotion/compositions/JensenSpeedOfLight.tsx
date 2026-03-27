/**
 * Jensen Clip 7: "The Speed of Light" (89s)
 *
 * First principles: measure everything against physical limits.
 * Speed of light = shorthand for what physics can do.
 *
 * Duration: 2660 frames @ 30fps (~89s)
 *
 * POP-OUTS (7 total):
 *   1. "SPEED OF LIGHT" (frame 291, 70f) — ConceptOverlay: Lightning bolt
 *   2. "PHYSICS" (frame 552, 55f) — FloatingKeyword: Atom
 *   3. "EVERYTHING COMPARED" (frame 703, 55f) — FloatingKeyword
 *   4. "TRADE-OFFS" (frame 1148, 70f) — ConceptOverlay: Balance scale
 *   5. "CONSTRAINTS" (frame 1587, 60f) — FloatingKeyword
 *   6. "SPEED OF LIGHT SYSTEM" (frame 2110, 70f) — ConceptOverlay: Speedometer
 *   7. "FIRST PRINCIPLES" (frame 2568, 65f) — ConceptOverlay: Atomic
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

import { WORDS, TOTAL_DURATION_FRAMES } from "../data/jensen-speed-of-light-words";

const { fontFamily } = loadFont();

const TOTAL_FRAMES = TOTAL_DURATION_FRAMES;

function getZoom(_frame: number): number {
  return 1.0;
}

const CONCEPT_RANGES = [
  { start: 291, end: 361 },    // Speed of Light
  { start: 1148, end: 1218 },  // Trade-offs
  { start: 2110, end: 2180 },  // Speed of Light System
  { start: 2568, end: 2633 },  // First Principles
];

const SFX_EVENTS: Array<{ frame: number; src: string; volume: number }> = [
  { frame: 289, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.20 },
  { frame: 550, src: "audio/pop-402324.mp3", volume: 0.18 },
  { frame: 701, src: "audio/whoosh-effect-382717.mp3", volume: 0.18 },
  { frame: 1146, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.20 },
  { frame: 1585, src: "audio/pop-402324.mp3", volume: 0.18 },
  { frame: 2108, src: "audio/whoosh-bamboo-389752.mp3", volume: 0.20 },
  { frame: 2566, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.20 },
];

// ═══════════════════════════════════════════════════════════════
// SPEED OF LIGHT — Lightning bolt with energy
// ═══════════════════════════════════════════════════════════════
const SpeedOfLightIllustration: React.FC<{ size?: number }> = ({
  size = 600,
}) => {
  const frame = useCurrentFrame();

  const boltScale = spring({
    frame,
    fps: 30,
    from: 0,
    to: 1,
    config: { damping: 10, stiffness: 160 },
  });

  const flash = interpolate(frame % 25, [0, 3, 6, 25], [0.5, 1, 0.5, 0.5]);

  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
      {/* Energy ring */}
      <circle cx={300} cy={280} r={200} fill="none" stroke="#FFD700" strokeWidth={3} opacity={flash * 0.3 * boltScale} />
      <circle cx={300} cy={280} r={160} fill="none" stroke="#FF7614" strokeWidth={2} opacity={flash * 0.4 * boltScale} />
      <g transform={`translate(300, 280) scale(${boltScale}) translate(-300, -280)`}>
        {/* Lightning bolt */}
        <path
          d="M310 100 L260 260 L310 250 L250 460 L370 220 L310 230 Z"
          fill="#FFD700"
          stroke="#E6A800"
          strokeWidth={3}
          strokeLinejoin="round"
        />
        {/* Inner glow */}
        <path
          d="M305 140 L275 255 L310 248 L265 420 L355 230 L315 235 Z"
          fill="#FFFFFF"
          opacity={0.4}
        />
      </g>
      {/* Speed lines */}
      {[
        { x1: 100, y1: 200, x2: 160, y2: 210, d: 6 },
        { x1: 80, y1: 280, x2: 150, y2: 280, d: 9 },
        { x1: 100, y1: 360, x2: 160, y2: 350, d: 12 },
        { x1: 440, y1: 200, x2: 500, y2: 210, d: 8 },
        { x1: 450, y1: 280, x2: 520, y2: 280, d: 11 },
        { x1: 440, y1: 360, x2: 500, y2: 350, d: 14 },
      ].map((line, i) => {
        const lineScale = spring({
          frame: Math.max(0, frame - line.d),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 14, stiffness: 120 },
        });
        return (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#FFD700"
            strokeWidth={3}
            strokeLinecap="round"
            opacity={lineScale * 0.5}
          />
        );
      })}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// TRADE-OFFS — Balance scale
// ═══════════════════════════════════════════════════════════════
const TradeOffsIllustration: React.FC<{ size?: number }> = ({
  size = 600,
}) => {
  const frame = useCurrentFrame();

  const scaleScale = spring({
    frame,
    fps: 30,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 140 },
  });

  const tilt = interpolate(frame % 80, [0, 40, 80], [-5, 5, -5]);

  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
      <g transform={`translate(300, 300) scale(${scaleScale}) translate(-300, -300)`}>
        {/* Stand */}
        <rect x={290} y={350} width={20} height={100} rx={4} fill="#555" />
        <rect x={250} y={440} width={100} height={15} rx={6} fill="#444" />
        {/* Beam */}
        <g transform={`rotate(${tilt}, 300, 200)`}>
          <rect x={120} y={195} width={360} height={10} rx={5} fill="#666" />
          {/* Fulcrum triangle */}
          <polygon points="285,195 315,195 300,170" fill="#FF7614" />
          {/* Left pan (Latency) */}
          <g>
            <line x1={150} y1={205} x2={150} y2={260} stroke="#888" strokeWidth={2} />
            <line x1={120} y1={205} x2={180} y2={205} stroke="#888" strokeWidth={2} />
            <ellipse cx={150} cy={270} rx={60} ry={18} fill="#E0E0E0" stroke="#CCC" strokeWidth={2} />
            <text x={150} y={310} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={700} fontSize={16} fill="#666">LATENCY</text>
          </g>
          {/* Right pan (Throughput) */}
          <g>
            <line x1={450} y1={205} x2={450} y2={260} stroke="#888" strokeWidth={2} />
            <line x1={420} y1={205} x2={480} y2={205} stroke="#888" strokeWidth={2} />
            <ellipse cx={450} cy={270} rx={60} ry={18} fill="#E0E0E0" stroke="#CCC" strokeWidth={2} />
            <text x={450} y={310} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={700} fontSize={16} fill="#666">THROUGHPUT</text>
          </g>
        </g>
        {/* Labels */}
        {(() => {
          const labelP = spring({
            frame: Math.max(0, frame - 15),
            fps: 30,
            from: 0,
            to: 1,
            config: { damping: 16, stiffness: 100 },
          });
          return (
            <g opacity={labelP}>
              <text x={300} y={390} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={700} fontSize={18} fill="#FF7614" letterSpacing={2}>COST vs CAPACITY</text>
            </g>
          );
        })()}
      </g>
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// SPEED OF LIGHT SYSTEM — Speedometer at max
// ═══════════════════════════════════════════════════════════════
const SpeedometerIllustration: React.FC<{ size?: number }> = ({
  size = 600,
}) => {
  const frame = useCurrentFrame();

  const meterScale = spring({
    frame,
    fps: 30,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 140 },
  });

  const needleAngle = spring({
    frame: Math.max(0, frame - 5),
    fps: 30,
    from: -120,
    to: 60,
    config: { damping: 16, stiffness: 60 },
  });

  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
      <g transform={`translate(300, 320) scale(${meterScale}) translate(-300, -320)`}>
        {/* Gauge arc */}
        <path
          d="M120 320 A180 180 0 0 1 480 320"
          fill="none"
          stroke="#333"
          strokeWidth={20}
          strokeLinecap="round"
        />
        {/* Color segments */}
        <path d="M120 320 A180 180 0 0 1 210 180" fill="none" stroke="#00CC66" strokeWidth={18} strokeLinecap="round" />
        <path d="M210 180 A180 180 0 0 1 390 180" fill="none" stroke="#FFB800" strokeWidth={18} strokeLinecap="round" />
        <path d="M390 180 A180 180 0 0 1 480 320" fill="none" stroke="#EF4444" strokeWidth={18} strokeLinecap="round" />
        {/* Tick marks */}
        {[-120, -80, -40, 0, 40, 80].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 300 + Math.cos(rad) * 155;
          const y1 = 320 + Math.sin(rad) * 155;
          const x2 = 300 + Math.cos(rad) * 170;
          const y2 = 320 + Math.sin(rad) * 170;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#666" strokeWidth={3} strokeLinecap="round" />;
        })}
        {/* Needle */}
        <g transform={`rotate(${needleAngle}, 300, 320)`}>
          <line x1={300} y1={320} x2={300} y2={170} stroke="#FF7614" strokeWidth={5} strokeLinecap="round" />
        </g>
        {/* Center dot */}
        <circle cx={300} cy={320} r={15} fill="#FF7614" stroke="#E06610" strokeWidth={3} />
        {/* Label */}
        <text x={300} y={390} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize={20} fill="#FF7614" letterSpacing={3}>
          MAX
        </text>
      </g>
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// FIRST PRINCIPLES — Atomic structure
// ═══════════════════════════════════════════════════════════════
const FirstPrinciplesIllustration: React.FC<{ size?: number }> = ({
  size = 600,
}) => {
  const frame = useCurrentFrame();

  const atomScale = spring({
    frame,
    fps: 30,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 140 },
  });

  const orbitAngle = frame * 4;

  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
      <g transform={`translate(300, 280) scale(${atomScale}) translate(-300, -280)`}>
        {/* Nucleus */}
        <circle cx={300} cy={280} r={30} fill="#FF7614" stroke="#E06610" strokeWidth={3} />
        <circle cx={293} cy={273} r={10} fill="#FFD700" opacity={0.6} />
        {/* Orbit 1 */}
        <ellipse cx={300} cy={280} rx={140} ry={50} fill="none" stroke="#FF7614" strokeWidth={2} opacity={0.3} transform={`rotate(${0}, 300, 280)`} />
        {/* Orbit 2 */}
        <ellipse cx={300} cy={280} rx={140} ry={50} fill="none" stroke="#FF7614" strokeWidth={2} opacity={0.3} transform={`rotate(60, 300, 280)`} />
        {/* Orbit 3 */}
        <ellipse cx={300} cy={280} rx={140} ry={50} fill="none" stroke="#FF7614" strokeWidth={2} opacity={0.3} transform={`rotate(120, 300, 280)`} />
        {/* Electrons */}
        {[0, 60, 120].map((baseAngle, i) => {
          const angle = orbitAngle + i * 120;
          const rad = (angle * Math.PI) / 180;
          const orbitRad = (baseAngle * Math.PI) / 180;
          // Position on elliptical orbit
          const x = 300 + Math.cos(rad) * 140 * Math.cos(orbitRad) - Math.sin(rad) * 50 * Math.sin(orbitRad);
          const y = 280 + Math.cos(rad) * 140 * Math.sin(orbitRad) + Math.sin(rad) * 50 * Math.cos(orbitRad);
          return (
            <circle key={i} cx={x} cy={y} r={8} fill="#FFD700" stroke="#E6A800" strokeWidth={2} />
          );
        })}
      </g>
      {/* Label */}
      {(() => {
        const labelP = spring({
          frame: Math.max(0, frame - 16),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 16, stiffness: 100 },
        });
        return (
          <text x={300} y={460} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={700} fontSize={20} fill="#888" opacity={labelP} letterSpacing={3}>
            DOWN TO FUNDAMENTALS
          </text>
        );
      })()}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ═══════════════════════════════════════════════════════════════
export const JensenSpeedOfLight: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = getZoom(frame);

  const conceptActive = CONCEPT_RANGES.some(
    (r) => frame >= r.start && frame < r.end
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <div style={{ position: "absolute", width: "100%", height: "100%", overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile("clips/clip7-speed-of-light.mp4")}
          volume={1}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, transformOrigin: "center center" }}
        />
      </div>

      {/* 1. "speed of light" — frame 291, 70f */}
      <Sequence from={291} durationInFrames={70} premountFor={30}>
        <ConceptOverlay
          durationInFrames={70}
          illustration={<SpeedOfLightIllustration />}
          caption="SPEED OF LIGHT"
          subtitle="What physics can do"
          entrance="clip-circle"
          backgroundStyle="solid-white"
          illustrationSize={520}
        />
      </Sequence>

      {/* 2. "physics" — frame 552, 55f (FloatingKeyword) */}
      <Sequence from={552} durationInFrames={55} premountFor={30}>
        <FloatingKeyword
          durationInFrames={55}
          text="PHYSICS"
          side="right"
          fontSize={80}
          topPercent={25}
          color="#FFFFFF"
          subtext="The limit of what's possible"
          icon={
            <svg width={60} height={60} viewBox="0 0 60 60" fill="none">
              <circle cx={30} cy={30} r={10} fill="#FF7614" />
              <ellipse cx={30} cy={30} rx={25} ry={10} fill="none" stroke="#FF7614" strokeWidth={2} opacity={0.5} />
              <ellipse cx={30} cy={30} rx={25} ry={10} fill="none" stroke="#FF7614" strokeWidth={2} opacity={0.5} transform="rotate(60, 30, 30)" />
              <ellipse cx={30} cy={30} rx={25} ry={10} fill="none" stroke="#FF7614" strokeWidth={2} opacity={0.5} transform="rotate(120, 30, 30)" />
            </svg>
          }
        />
      </Sequence>

      {/* 3. "everything compared" — frame 703, 55f (FloatingKeyword) */}
      <Sequence from={703} durationInFrames={55} premountFor={30}>
        <FloatingKeyword
          durationInFrames={55}
          text={"EVERYTHING\nMEASURED"}
          side="left"
          fontSize={68}
          topPercent={28}
          color="#FFD700"
          subtext="Against the speed of light"
        />
      </Sequence>

      {/* 4. "trade-offs" — frame 1148, 70f */}
      <Sequence from={1148} durationInFrames={70} premountFor={30}>
        <ConceptOverlay
          durationInFrames={70}
          illustration={<TradeOffsIllustration />}
          caption="TRADE-OFFS"
          subtitle="Latency vs throughput, cost vs capacity"
          entrance="clip-circle"
          backgroundStyle="solid-white"
          illustrationSize={520}
        />
      </Sequence>

      {/* 5. "constraints" — frame 1587, 60f (FloatingKeyword) */}
      <Sequence from={1587} durationInFrames={60} premountFor={30}>
        <FloatingKeyword
          durationInFrames={60}
          text="CONSTRAINTS"
          side="right"
          fontSize={72}
          topPercent={25}
          color="#EF4444"
          subtext="Achieve each separately"
          icon={
            <svg width={60} height={60} viewBox="0 0 60 60" fill="none">
              <rect x={8} y={8} width={44} height={44} rx={6} fill="none" stroke="#EF4444" strokeWidth={3} />
              <line x1={15} y1={30} x2={45} y2={30} stroke="#EF4444" strokeWidth={3} strokeLinecap="round" />
              <line x1={30} y1={15} x2={30} y2={45} stroke="#EF4444" strokeWidth={3} strokeLinecap="round" />
            </svg>
          }
        />
      </Sequence>

      {/* 6. "speed of light system" — frame 2110, 70f */}
      <Sequence from={2110} durationInFrames={70} premountFor={30}>
        <ConceptOverlay
          durationInFrames={70}
          illustration={<SpeedometerIllustration />}
          caption="SPEED OF LIGHT"
          subtitle="What's the limit of this system?"
          entrance="clip-circle"
          backgroundStyle="solid-white"
          illustrationSize={520}
        />
      </Sequence>

      {/* 7. "first principles" — frame 2568, 65f */}
      <Sequence from={2568} durationInFrames={65} premountFor={30}>
        <ConceptOverlay
          durationInFrames={65}
          illustration={<FirstPrinciplesIllustration />}
          caption="FIRST PRINCIPLES"
          subtitle="The limits -- the fundamentals"
          entrance="clip-circle"
          backgroundStyle="solid-white"
          illustrationSize={520}
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
