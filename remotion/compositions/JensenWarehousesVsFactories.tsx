/**
 * Jensen Clip 3: "Warehouses vs. Factories" (83s)
 *
 * Data centers shifted from storage to revenue generation.
 * Tokens are segmenting like iPhones — free, premium, $1000/M.
 *
 * Duration: 2485 frames @ 30fps (~83s)
 *
 * POP-OUTS (7 total):
 *   1. "WAREHOUSE" (frame 40, 65f) — ConceptOverlay: Old building
 *   2. "FACTORY" (frame 138, 70f) — ConceptOverlay: Modern production
 *   3. "REVENUES" (frame 409, 50f) — FloatingKeyword: Money flow
 *   4. "TOKENS" (frame 1507, 65f) — ConceptOverlay: Tier pyramid
 *   5. "PREMIUM TOKENS" (frame 1699, 55f) — FloatingKeyword
 *   6. "$1,000 PER MILLION" (frame 2238, 75f) — ConceptOverlay: Price tag
 *   7. "ONLY WHEN" (frame 2422, 50f) — FloatingKeyword
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

import { WORDS, TOTAL_DURATION_FRAMES } from "../data/jensen-warehouses-vs-factories-words";

const { fontFamily } = loadFont();

const TOTAL_FRAMES = TOTAL_DURATION_FRAMES;

function getZoom(_frame: number): number {
  return 1.0;
}

const CONCEPT_RANGES = [
  { start: 40, end: 105 },     // Warehouse
  { start: 138, end: 208 },    // Factory
  { start: 1507, end: 1572 },  // Tokens
  { start: 2238, end: 2313 },  // $1000 per million
];

const SFX_EVENTS: Array<{ frame: number; src: string; volume: number }> = [
  { frame: 38, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.20 },
  { frame: 136, src: "audio/pop-402324.mp3", volume: 0.20 },
  { frame: 407, src: "audio/whoosh-effect-382717.mp3", volume: 0.18 },
  { frame: 1505, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.20 },
  { frame: 1697, src: "audio/pop-402324.mp3", volume: 0.18 },
  { frame: 2236, src: "audio/whoosh-bamboo-389752.mp3", volume: 0.20 },
  { frame: 2420, src: "audio/pop-402324.mp3", volume: 0.18 },
];

// ═══════════════════════════════════════════════════════════════
// WAREHOUSE ILLUSTRATION
// ═══════════════════════════════════════════════════════════════
const WarehouseIllustration: React.FC<{ size?: number }> = ({
  size = 600,
}) => {
  const frame = useCurrentFrame();

  const buildingScale = spring({
    frame,
    fps: 30,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 140 },
  });

  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
      <g transform={`translate(300, 300) scale(${buildingScale}) translate(-300, -300)`}>
        {/* Building */}
        <rect x={140} y={200} width={320} height={240} rx={4} fill="#8B8B8B" stroke="#666" strokeWidth={3} />
        {/* Roof */}
        <path d="M120 200 L300 120 L480 200 Z" fill="#6B6B6B" stroke="#555" strokeWidth={3} />
        {/* Door */}
        <rect x={260} y={340} width={80} height={100} rx={4} fill="#555" />
        {/* Windows (dark/dusty) */}
        {[
          { x: 170, y: 240 },
          { x: 250, y: 240 },
          { x: 350, y: 240 },
          { x: 430, y: 240 },
        ].map((w, i) => (
          <rect key={i} x={w.x} y={w.y} width={40} height={40} rx={3} fill="#4A4A4A" stroke="#333" strokeWidth={2} />
        ))}
        {/* Dust/cobweb */}
        <path d="M170 240 Q190 230 210 240" stroke="#999" strokeWidth={1} fill="none" opacity={0.5} />
        {/* Storage boxes inside */}
        <rect x={160} y={370} width={40} height={30} rx={2} fill="#A07040" stroke="#806030" strokeWidth={1.5} />
        <rect x={210} y={380} width={35} height={20} rx={2} fill="#B08050" stroke="#906040" strokeWidth={1.5} />
      </g>
      {/* Label */}
      {(() => {
        const lp = spring({ frame: Math.max(0, frame - 15), fps: 30, from: 0, to: 1, config: { damping: 16, stiffness: 100 } });
        return (
          <text x={300} y={510} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={700} fontSize={20} fill="#888" opacity={lp} letterSpacing={3}>
            STORAGE — LOW VALUE
          </text>
        );
      })()}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// FACTORY ILLUSTRATION
// ═══════════════════════════════════════════════════════════════
const FactoryIllustration: React.FC<{ size?: number }> = ({
  size = 600,
}) => {
  const frame = useCurrentFrame();

  const buildingScale = spring({
    frame,
    fps: 30,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 140 },
  });

  const smokeY = interpolate(frame % 60, [0, 60], [0, -30]);

  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
      <g transform={`translate(300, 300) scale(${buildingScale}) translate(-300, -300)`}>
        {/* Main building */}
        <rect x={150} y={220} width={300} height={220} rx={8} fill="#1A1A1A" stroke="#FF7614" strokeWidth={3} />
        {/* Smokestacks */}
        <rect x={200} y={140} width={30} height={80} rx={4} fill="#333" stroke="#FF7614" strokeWidth={2} />
        <rect x={370} y={140} width={30} height={80} rx={4} fill="#333" stroke="#FF7614" strokeWidth={2} />
        {/* Smoke */}
        <circle cx={215} cy={130 + smokeY} r={12} fill="#DDD" opacity={0.3} />
        <circle cx={385} cy={125 + smokeY} r={15} fill="#DDD" opacity={0.3} />
        {/* Windows (lit up, active) */}
        {[
          { x: 175, y: 250 },
          { x: 255, y: 250 },
          { x: 335, y: 250 },
          { x: 175, y: 320 },
          { x: 255, y: 320 },
          { x: 335, y: 320 },
        ].map((w, i) => (
          <rect key={i} x={w.x} y={w.y} width={50} height={40} rx={4} fill="#FF7614" opacity={0.8} />
        ))}
        {/* Door */}
        <rect x={265} y={370} width={70} height={70} rx={6} fill="#FF7614" />
        {/* Arrow out = production */}
        <path d="M480 330 L520 330 L520 320 L550 340 L520 360 L520 350 L480 350 Z" fill="#00CC66" opacity={0.8} />
      </g>
      {/* Label */}
      {(() => {
        const lp = spring({ frame: Math.max(0, frame - 15), fps: 30, from: 0, to: 1, config: { damping: 16, stiffness: 100 } });
        return (
          <text x={300} y={510} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={700} fontSize={20} fill="#888" opacity={lp} letterSpacing={3}>
            PRODUCTION — REVENUE
          </text>
        );
      })()}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// TOKEN TIERS ILLUSTRATION
// ═══════════════════════════════════════════════════════════════
const TokenTiersIllustration: React.FC<{ size?: number }> = ({
  size = 600,
}) => {
  const frame = useCurrentFrame();

  const tiers = [
    { label: "FREE", color: "#CCCCCC", width: 340, y: 370, delay: 3 },
    { label: "STANDARD", color: "#FF9500", width: 250, y: 290, delay: 7 },
    { label: "PREMIUM", color: "#FF7614", width: 160, y: 210, delay: 11 },
  ];

  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
      {tiers.map((tier, i) => {
        const tierScale = spring({
          frame: Math.max(0, frame - tier.delay),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 12, stiffness: 140 },
        });
        const x = 300 - tier.width / 2;
        return (
          <g key={i} opacity={tierScale}>
            <rect
              x={x}
              y={tier.y}
              width={tier.width}
              height={55}
              rx={10}
              fill={tier.color}
              stroke={tier.color === "#CCCCCC" ? "#AAA" : `${tier.color}CC`}
              strokeWidth={2}
              transform={`translate(${300}, ${tier.y + 27}) scale(${tierScale}) translate(${-300}, ${-(tier.y + 27)})`}
            />
            <text
              x={300}
              y={tier.y + 35}
              textAnchor="middle"
              fontFamily="Inter, sans-serif"
              fontWeight={800}
              fontSize={20}
              fill={tier.color === "#CCCCCC" ? "#666" : "#FFFFFF"}
              letterSpacing={3}
            >
              {tier.label}
            </text>
          </g>
        );
      })}
      {/* Token icon at top */}
      {(() => {
        const coinScale = spring({
          frame: Math.max(0, frame - 15),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 10, stiffness: 160 },
        });
        return (
          <g opacity={coinScale} transform={`translate(300, 150) scale(${coinScale}) translate(-300, -150)`}>
            <circle cx={300} cy={150} r={35} fill="#FFD700" stroke="#E6A800" strokeWidth={3} />
            <text x={300} y={158} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={900} fontSize={28} fill="#8B6914">T</text>
          </g>
        );
      })()}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// $1000 PER MILLION ILLUSTRATION
// ═══════════════════════════════════════════════════════════════
const PremiumPriceIllustration: React.FC<{ size?: number }> = ({
  size = 600,
}) => {
  const frame = useCurrentFrame();

  const cardScale = spring({
    frame,
    fps: 30,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 140 },
  });

  const shimmer = interpolate(frame % 50, [0, 25, 50], [0.85, 1, 0.85]);

  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
      <g transform={`translate(300, 280) scale(${cardScale}) translate(-300, -280)`}>
        {/* Price tag shape */}
        <rect x={140} y={180} width={320} height={200} rx={20} fill="#1A1A1A" stroke="#FF7614" strokeWidth={4} />
        {/* Gold bar at top */}
        <rect x={140} y={180} width={320} height={50} rx={20} fill="#FF7614" />
        <rect x={140} y={205} width={320} height={25} fill="#FF7614" />
        {/* Dollar amount */}
        <text
          x={300}
          y={310}
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontWeight={900}
          fontSize={72}
          fill="#FFFFFF"
          opacity={shimmer}
        >
          $1,000
        </text>
        {/* Per million tokens */}
        <text
          x={300}
          y={360}
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontWeight={600}
          fontSize={22}
          fill="#999"
          letterSpacing={2}
        >
          PER MILLION TOKENS
        </text>
        {/* Top label */}
        <text
          x={300}
          y={215}
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontWeight={800}
          fontSize={20}
          fill="#FFFFFF"
          letterSpacing={4}
        >
          PREMIUM INTELLIGENCE
        </text>
      </g>
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ═══════════════════════════════════════════════════════════════
export const JensenWarehousesVsFactories: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = getZoom(frame);

  const conceptActive = CONCEPT_RANGES.some(
    (r) => frame >= r.start && frame < r.end
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <div style={{ position: "absolute", width: "100%", height: "100%", overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile("clips/clip3-warehouses-vs-factories.mp4")}
          volume={1}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, transformOrigin: "center center" }}
        />
      </div>

      {/* 1. "warehouse" — frame 40, 65f */}
      <Sequence from={40} durationInFrames={65} premountFor={30}>
        <ConceptOverlay
          durationInFrames={65}
          illustration={<WarehouseIllustration />}
          caption="WAREHOUSE"
          subtitle="Storage -- low value"
          entrance="clip-circle"
          backgroundStyle="solid-white"
          illustrationSize={520}
        />
      </Sequence>

      {/* 2. "factory" — frame 138, 70f */}
      <Sequence from={138} durationInFrames={70} premountFor={30}>
        <ConceptOverlay
          durationInFrames={70}
          illustration={<FactoryIllustration />}
          caption="FACTORY"
          subtitle="Production generates revenue"
          entrance="clip-circle"
          backgroundStyle="solid-white"
          illustrationSize={520}
        />
      </Sequence>

      {/* 3. "revenues" — frame 409, 50f (FloatingKeyword) */}
      <Sequence from={409} durationInFrames={50} premountFor={30}>
        <FloatingKeyword
          durationInFrames={50}
          text="REVENUES"
          side="right"
          fontSize={80}
          topPercent={28}
          color="#00CC66"
          subtext="Direct correlation"
          icon={
            <svg width={60} height={60} viewBox="0 0 60 60" fill="none">
              <circle cx={30} cy={30} r={25} fill="#00CC66" stroke="#009944" strokeWidth={3} />
              <text x={30} y={38} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={900} fontSize={28} fill="white">$</text>
            </svg>
          }
        />
      </Sequence>

      {/* 4. "tokens" — frame 1507, 65f */}
      <Sequence from={1507} durationInFrames={65} premountFor={30}>
        <ConceptOverlay
          durationInFrames={65}
          illustration={<TokenTiersIllustration />}
          caption="TOKEN TIERS"
          subtitle="Segmenting like iPhones"
          entrance="clip-circle"
          backgroundStyle="solid-white"
          illustrationSize={520}
        />
      </Sequence>

      {/* 5. "premium tokens" — frame 1699, 55f (FloatingKeyword) */}
      <Sequence from={1699} durationInFrames={55} premountFor={30}>
        <FloatingKeyword
          durationInFrames={55}
          text={"PREMIUM\nTOKENS"}
          side="left"
          fontSize={72}
          topPercent={25}
          color="#FFD700"
          icon={
            <svg width={60} height={60} viewBox="0 0 60 60" fill="none">
              <polygon points="30,5 36,22 54,22 40,34 45,52 30,40 15,52 20,34 6,22 24,22" fill="#FFD700" stroke="#E6A800" strokeWidth={2} />
            </svg>
          }
        />
      </Sequence>

      {/* 6. "$1,000 per million" — frame 2238, 75f */}
      <Sequence from={2238} durationInFrames={75} premountFor={30}>
        <ConceptOverlay
          durationInFrames={75}
          illustration={<PremiumPriceIllustration />}
          caption="$1,000 / MILLION"
          subtitle="Premium intelligence is coming"
          entrance="clip-circle"
          backgroundStyle="solid-white"
          illustrationSize={520}
        />
      </Sequence>

      {/* 7. "only when" — frame 2422, 50f (FloatingKeyword) */}
      <Sequence from={2422} durationInFrames={50} premountFor={30}>
        <FloatingKeyword
          durationInFrames={50}
          text={"IT'S NOT IF\nIT'S WHEN"}
          side="right"
          fontSize={68}
          topPercent={30}
          color="#FFFFFF"
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
