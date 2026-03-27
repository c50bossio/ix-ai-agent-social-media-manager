/**
 * Jensen Clip 4: "AI Won't Kill Jobs" (91s)
 *
 * Radiology example: AI became superhuman but radiologists grew.
 * The purpose is to diagnose disease, not just study scans.
 *
 * Duration: 2728 frames @ 30fps (~91s)
 *
 * POP-OUTS (7 total):
 *   1. "RADIOLOGY" (frame 196, 70f) — ConceptOverlay: AI scan
 *   2. "SUPERHUMAN" (frame 447, 65f) — ConceptOverlay: Badge
 *   3. "RADIOLOGISTS GREW" (frame 1419, 60f) — FloatingKeyword: Arrow up
 *   4. "SHORTAGE" (frame 1547, 55f) — FloatingKeyword: Warning
 *   5. "PURPOSE vs TASK" (frame 2176, 75f) — ConceptOverlay: Target
 *   6. "DIAGNOSE DISEASE" (frame 2244, 55f) — FloatingKeyword
 *   7. "MORE SCANS" (frame 2576, 55f) — FloatingKeyword: Medical
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

import { WORDS, TOTAL_DURATION_FRAMES } from "../data/jensen-ai-wont-kill-jobs-words";

const { fontFamily } = loadFont();

const TOTAL_FRAMES = TOTAL_DURATION_FRAMES;

function getZoom(_frame: number): number {
  return 1.0;
}

const CONCEPT_RANGES = [
  { start: 196, end: 266 },    // Radiology
  { start: 447, end: 512 },    // Superhuman
  { start: 2176, end: 2251 },  // Purpose vs Task
];

const SFX_EVENTS: Array<{ frame: number; src: string; volume: number }> = [
  { frame: 194, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.20 },
  { frame: 445, src: "audio/pop-402324.mp3", volume: 0.20 },
  { frame: 1417, src: "audio/whoosh-effect-382717.mp3", volume: 0.18 },
  { frame: 1545, src: "audio/pop-402324.mp3", volume: 0.18 },
  { frame: 2174, src: "audio/whoosh-large-sub-384631.mp3", volume: 0.20 },
  { frame: 2242, src: "audio/whoosh-bamboo-389752.mp3", volume: 0.18 },
  { frame: 2574, src: "audio/pop-402324.mp3", volume: 0.18 },
];

// ═══════════════════════════════════════════════════════════════
// RADIOLOGY AI ILLUSTRATION — Scan with AI overlay
// ═══════════════════════════════════════════════════════════════
const RadiologyAIIllustration: React.FC<{ size?: number }> = ({
  size = 600,
}) => {
  const frame = useCurrentFrame();

  const scanScale = spring({
    frame,
    fps: 30,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 140 },
  });

  const scanLine = interpolate(frame % 60, [0, 60], [0, 300]);

  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
      <g transform={`translate(300, 280) scale(${scanScale}) translate(-300, -280)`}>
        {/* X-ray frame */}
        <rect x={160} y={130} width={280} height={320} rx={16} fill="#0A0A2E" stroke="#333" strokeWidth={3} />
        {/* Chest outline */}
        <path
          d="M230 200 Q300 180 370 200 Q380 260 370 340 Q300 380 230 340 Q220 260 230 200Z"
          fill="none"
          stroke="#4488AA"
          strokeWidth={2}
          opacity={0.6}
        />
        {/* Ribs */}
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M250 ${230 + i * 30} Q300 ${220 + i * 30} 350 ${230 + i * 30}`}
            stroke="#4488AA"
            strokeWidth={1.5}
            fill="none"
            opacity={0.4}
          />
        ))}
        {/* Scanning line */}
        <line
          x1={170}
          y1={140 + scanLine}
          x2={430}
          y2={140 + scanLine}
          stroke="#00FF66"
          strokeWidth={2}
          opacity={0.6}
        />
        {/* AI detection box */}
        {(() => {
          const boxScale = spring({
            frame: Math.max(0, frame - 15),
            fps: 30,
            from: 0,
            to: 1,
            config: { damping: 14, stiffness: 120 },
          });
          return (
            <g opacity={boxScale}>
              <rect x={270} y={250} width={70} height={70} rx={4} fill="none" stroke="#FF7614" strokeWidth={3} strokeDasharray="8 4" />
              <text x={305} y={340} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={700} fontSize={14} fill="#FF7614">
                AI DETECTED
              </text>
            </g>
          );
        })()}
      </g>
      {/* AI badge */}
      {(() => {
        const badgeScale = spring({
          frame: Math.max(0, frame - 10),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 10, stiffness: 160 },
        });
        return (
          <g opacity={badgeScale} transform={`translate(460, 160) scale(${badgeScale}) translate(-460, -160)`}>
            <circle cx={460} cy={160} r={35} fill="#FF7614" />
            <text x={460} y={168} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={900} fontSize={24} fill="white">AI</text>
          </g>
        );
      })()}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// SUPERHUMAN ILLUSTRATION — Badge with checkmark
// ═══════════════════════════════════════════════════════════════
const SuperhumanIllustration: React.FC<{ size?: number }> = ({
  size = 600,
}) => {
  const frame = useCurrentFrame();

  const badgeScale = spring({
    frame,
    fps: 30,
    from: 0,
    to: 1,
    config: { damping: 10, stiffness: 160 },
  });

  const pulse = interpolate(frame % 40, [0, 20, 40], [1, 1.05, 1]);

  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
      <g transform={`translate(300, 280) scale(${badgeScale * pulse}) translate(-300, -280)`}>
        {/* Shield shape */}
        <path
          d="M300 100 L420 160 L420 320 Q420 420 300 480 Q180 420 180 320 L180 160 Z"
          fill="#FF7614"
          stroke="#E06610"
          strokeWidth={4}
        />
        {/* Inner shield */}
        <path
          d="M300 130 L400 180 L400 310 Q400 400 300 450 Q200 400 200 310 L200 180 Z"
          fill="#FFFFFF"
          stroke="#F0F0F0"
          strokeWidth={2}
        />
        {/* Checkmark */}
        <path
          d="M245 290 L285 330 L365 230"
          stroke="#FF7614"
          strokeWidth={12}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* "2019-2020" text */}
        {(() => {
          const textP = spring({
            frame: Math.max(0, frame - 12),
            fps: 30,
            from: 0,
            to: 1,
            config: { damping: 16, stiffness: 100 },
          });
          return (
            <text
              x={300}
              y={400}
              textAnchor="middle"
              fontFamily="Inter, sans-serif"
              fontWeight={700}
              fontSize={22}
              fill="#FF7614"
              opacity={textP}
              letterSpacing={2}
            >
              2019 - 2020
            </text>
          );
        })()}
      </g>
      {/* Sparkle rays */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rayScale = spring({
          frame: Math.max(0, frame - 6 - i * 2),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 14, stiffness: 120 },
        });
        const rad = (angle * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={300 + Math.cos(rad) * 200}
            y1={280 + Math.sin(rad) * 200}
            x2={300 + Math.cos(rad) * 230}
            y2={280 + Math.sin(rad) * 230}
            stroke="#FFD700"
            strokeWidth={3}
            strokeLinecap="round"
            opacity={rayScale * 0.5}
          />
        );
      })}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// PURPOSE vs TASK ILLUSTRATION
// ═══════════════════════════════════════════════════════════════
const PurposeVsTaskIllustration: React.FC<{ size?: number }> = ({
  size = 600,
}) => {
  const frame = useCurrentFrame();

  const items = [
    { label: "TASK", sublabel: "Study scans", color: "#EF4444", y: 350, delay: 5, crossed: true },
    { label: "PURPOSE", sublabel: "Diagnose disease", color: "#00CC66", y: 210, delay: 10, crossed: false },
  ];

  return (
    <svg width={size} height={size} viewBox="0 0 600 600" fill="none">
      {items.map((item, i) => {
        const itemScale = spring({
          frame: Math.max(0, frame - item.delay),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 12, stiffness: 140 },
        });
        return (
          <g key={i} opacity={itemScale} transform={`translate(300, ${item.y}) scale(${itemScale}) translate(-300, ${-item.y})`}>
            <rect x={140} y={item.y - 35} width={320} height={70} rx={16} fill={item.color} opacity={item.crossed ? 0.2 : 1} stroke={item.color} strokeWidth={3} />
            <text x={300} y={item.y - 5} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize={24} fill={item.crossed ? item.color : "#FFFFFF"} letterSpacing={3}>
              {item.label}
            </text>
            <text x={300} y={item.y + 22} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={600} fontSize={16} fill={item.crossed ? "#999" : "#FFFFFF"} opacity={0.8}>
              {item.sublabel}
            </text>
            {item.crossed && (
              <line x1={160} y1={item.y} x2={440} y2={item.y} stroke="#EF4444" strokeWidth={4} strokeLinecap="round" />
            )}
          </g>
        );
      })}
      {/* Arrow from task to purpose */}
      {(() => {
        const arrowScale = spring({
          frame: Math.max(0, frame - 15),
          fps: 30,
          from: 0,
          to: 1,
          config: { damping: 14, stiffness: 100 },
        });
        return (
          <g opacity={arrowScale}>
            <path d="M300 310 L300 290" stroke="#FF7614" strokeWidth={4} strokeLinecap="round" />
            <polygon points="290,295 300,275 310,295" fill="#FF7614" />
          </g>
        );
      })()}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ═══════════════════════════════════════════════════════════════
export const JensenAiWontKillJobs: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = getZoom(frame);

  const conceptActive = CONCEPT_RANGES.some(
    (r) => frame >= r.start && frame < r.end
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <div style={{ position: "absolute", width: "100%", height: "100%", overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile("clips/clip4-ai-wont-kill-jobs.mp4")}
          volume={1}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, transformOrigin: "center center" }}
        />
      </div>

      {/* 1. "radiology" — frame 196, 70f */}
      <Sequence from={196} durationInFrames={70} premountFor={30}>
        <ConceptOverlay
          durationInFrames={70}
          illustration={<RadiologyAIIllustration />}
          caption="RADIOLOGY"
          subtitle="AI said this job would go away"
          entrance="clip-circle"
          backgroundStyle="solid-white"
          illustrationSize={520}
        />
      </Sequence>

      {/* 2. "superhuman" — frame 447, 65f */}
      <Sequence from={447} durationInFrames={65} premountFor={30}>
        <ConceptOverlay
          durationInFrames={65}
          illustration={<SuperhumanIllustration />}
          caption="SUPERHUMAN"
          subtitle="Computer vision surpassed humans"
          entrance="clip-circle"
          backgroundStyle="solid-white"
          illustrationSize={520}
        />
      </Sequence>

      {/* 3. "radiologists grew" — frame 1419, 60f (FloatingKeyword) */}
      <Sequence from={1419} durationInFrames={60} premountFor={30}>
        <FloatingKeyword
          durationInFrames={60}
          text={"RADIOLOGISTS\nGREW"}
          side="right"
          fontSize={68}
          topPercent={25}
          color="#00CC66"
          icon={
            <svg width={70} height={70} viewBox="0 0 70 70" fill="none">
              <path d="M15 55 L35 15 L55 55" stroke="#00CC66" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <line x1={35} y1={55} x2={35} y2={35} stroke="#00CC66" strokeWidth={5} strokeLinecap="round" />
            </svg>
          }
        />
      </Sequence>

      {/* 4. "shortage" — frame 1547, 55f (FloatingKeyword) */}
      <Sequence from={1547} durationInFrames={55} premountFor={30}>
        <FloatingKeyword
          durationInFrames={55}
          text="SHORTAGE"
          side="left"
          fontSize={76}
          topPercent={28}
          color="#EF4444"
          subtext="We need more radiologists"
          icon={
            <svg width={60} height={60} viewBox="0 0 60 60" fill="none">
              <path d="M30 5 L55 50 L5 50 Z" fill="#EF4444" stroke="#CC3333" strokeWidth={2} strokeLinejoin="round" />
              <text x={30} y={44} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight={800} fontSize={28} fill="white">!</text>
            </svg>
          }
        />
      </Sequence>

      {/* 5. "purpose vs task" — frame 2176, 75f */}
      <Sequence from={2176} durationInFrames={75} premountFor={30}>
        <ConceptOverlay
          durationInFrames={75}
          illustration={<PurposeVsTaskIllustration />}
          caption="PURPOSE vs TASK"
          subtitle="The job is to diagnose, not just scan"
          entrance="clip-circle"
          backgroundStyle="solid-white"
          illustrationSize={520}
        />
      </Sequence>

      {/* 6. "diagnose disease" — frame 2244, 55f (FloatingKeyword) */}
      <Sequence from={2244} durationInFrames={55} premountFor={30}>
        <FloatingKeyword
          durationInFrames={55}
          text={"DIAGNOSE\nDISEASE"}
          side="right"
          fontSize={72}
          topPercent={25}
          color="#FF7614"
          icon={
            <svg width={60} height={60} viewBox="0 0 60 60" fill="none">
              <rect x={25} y={10} width={10} height={40} rx={3} fill="#FF7614" />
              <rect x={10} y={25} width={40} height={10} rx={3} fill="#FF7614" />
            </svg>
          }
        />
      </Sequence>

      {/* 7. "more scans" — frame 2576, 55f (FloatingKeyword) */}
      <Sequence from={2576} durationInFrames={55} premountFor={30}>
        <FloatingKeyword
          durationInFrames={55}
          text={"MORE SCANS\nBETTER CARE"}
          side="left"
          fontSize={64}
          topPercent={30}
          color="#FFFFFF"
          subtext="AI amplifies, not replaces"
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
