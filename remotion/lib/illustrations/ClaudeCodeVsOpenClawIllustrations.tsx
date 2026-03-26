import React from "react";

// Brand colors
const orange = "#FF6B00";
const dark = "#0A0A0A";
const white = "#FFFFFF";
const dimGray = "#666666";
const codeGreen = "#4ADE80";
const codeBlue = "#60A5FA";
const red = "#EF4444";

// 1. VsBattle - Two hexagons facing each other with "VS" in the middle
export const VsBattle: React.FC<{ size?: number }> = ({ size = 800 }) => {
  const hexPoints = (cx: number, cy: number, r: number) => {
    const pts: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    return pts.join(" ");
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="800" height="800" fill={dark} />
      {/* Left hexagon - orange */}
      <polygon
        points={hexPoints(240, 400, 140)}
        fill="none"
        stroke={orange}
        strokeWidth="6"
      />
      <polygon
        points={hexPoints(240, 400, 110)}
        fill={orange}
        opacity="0.15"
      />
      <text
        x="240"
        y="410"
        textAnchor="middle"
        fill={orange}
        fontSize="48"
        fontWeight="bold"
        fontFamily="monospace"
      >
        CC
      </text>
      {/* Right hexagon - blue */}
      <polygon
        points={hexPoints(560, 400, 140)}
        fill="none"
        stroke={codeBlue}
        strokeWidth="6"
      />
      <polygon
        points={hexPoints(560, 400, 110)}
        fill={codeBlue}
        opacity="0.15"
      />
      <text
        x="560"
        y="410"
        textAnchor="middle"
        fill={codeBlue}
        fontSize="48"
        fontWeight="bold"
        fontFamily="monospace"
      >
        OC
      </text>
      {/* VS text */}
      <text
        x="400"
        y="415"
        textAnchor="middle"
        fill={white}
        fontSize="72"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        VS
      </text>
      {/* Lightning bolts */}
      <line
        x1="370"
        y1="320"
        x2="400"
        y2="350"
        stroke={orange}
        strokeWidth="3"
      />
      <line
        x1="400"
        y1="350"
        x2="380"
        y2="380"
        stroke={orange}
        strokeWidth="3"
      />
      <line
        x1="420"
        y1="420"
        x2="400"
        y2="450"
        stroke={codeBlue}
        strokeWidth="3"
      />
      <line
        x1="400"
        y1="450"
        x2="430"
        y2="480"
        stroke={codeBlue}
        strokeWidth="3"
      />
    </svg>
  );
};

// 2. TerminalAgent - A terminal/CLI window icon with "> _" prompt and code lines
export const TerminalAgent: React.FC<{ size?: number }> = ({ size = 800 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="800" height="800" fill={dark} />
      {/* Terminal window */}
      <rect
        x="120"
        y="160"
        width="560"
        height="480"
        rx="16"
        fill="#111111"
        stroke={dimGray}
        strokeWidth="3"
      />
      {/* Title bar */}
      <rect
        x="120"
        y="160"
        width="560"
        height="48"
        rx="16"
        fill="#1A1A1A"
      />
      <rect x="120" y="192" width="560" height="16" fill="#1A1A1A" />
      {/* Traffic lights */}
      <circle cx="156" cy="184" r="8" fill={red} />
      <circle cx="184" cy="184" r="8" fill="#FACC15" />
      <circle cx="212" cy="184" r="8" fill={codeGreen} />
      {/* Title text */}
      <text
        x="400"
        y="190"
        textAnchor="middle"
        fill={dimGray}
        fontSize="16"
        fontFamily="monospace"
      >
        claude-code — bash
      </text>
      {/* Prompt line 1 */}
      <text
        x="160"
        y="260"
        fill={codeGreen}
        fontSize="24"
        fontFamily="monospace"
      >
        {"$"}
      </text>
      <text
        x="190"
        y="260"
        fill={white}
        fontSize="24"
        fontFamily="monospace"
      >
        claude
      </text>
      {/* Code lines */}
      <text
        x="160"
        y="310"
        fill={codeBlue}
        fontSize="20"
        fontFamily="monospace"
      >
        {">"} Analyzing codebase...
      </text>
      <rect x="160" y="330" width="320" height="4" rx="2" fill={codeGreen} opacity="0.3" />
      <rect x="160" y="330" width="240" height="4" rx="2" fill={codeGreen} />
      <text
        x="160"
        y="370"
        fill={codeGreen}
        fontSize="20"
        fontFamily="monospace"
      >
        {">"} Found 847 files across 12 modules
      </text>
      <text
        x="160"
        y="420"
        fill={orange}
        fontSize="20"
        fontFamily="monospace"
      >
        {">"} Applying fix to 3 files...
      </text>
      <text
        x="160"
        y="470"
        fill={codeGreen}
        fontSize="20"
        fontFamily="monospace"
      >
        {"✓"} All changes applied successfully
      </text>
      {/* Blinking cursor */}
      <text
        x="160"
        y="530"
        fill={codeGreen}
        fontSize="24"
        fontFamily="monospace"
      >
        {"$"}
      </text>
      <rect x="190" y="514" width="14" height="24" fill={codeGreen} opacity="0.8" />
    </svg>
  );
};

// 3. ContextWindowBrain - A brain outline with "1M" text inside, surrounded by data nodes
export const ContextWindowBrain: React.FC<{ size?: number }> = ({
  size = 800,
}) => {
  const nodePositions = [
    { x: 140, y: 200 },
    { x: 100, y: 400 },
    { x: 160, y: 580 },
    { x: 660, y: 200 },
    { x: 700, y: 400 },
    { x: 640, y: 580 },
    { x: 300, y: 100 },
    { x: 500, y: 100 },
    { x: 300, y: 700 },
    { x: 500, y: 700 },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="800" height="800" fill={dark} />
      {/* Connection lines from nodes to center */}
      {nodePositions.map((pos, i) => (
        <line
          key={`line-${i}`}
          x1={pos.x}
          y1={pos.y}
          x2="400"
          y2="400"
          stroke={orange}
          strokeWidth="1.5"
          opacity="0.3"
        />
      ))}
      {/* Brain outline - simplified using ellipses and paths */}
      <ellipse
        cx="340"
        cy="380"
        rx="120"
        ry="150"
        fill="none"
        stroke={orange}
        strokeWidth="4"
        opacity="0.6"
      />
      <ellipse
        cx="460"
        cy="380"
        rx="120"
        ry="150"
        fill="none"
        stroke={orange}
        strokeWidth="4"
        opacity="0.6"
      />
      <ellipse
        cx="400"
        cy="340"
        rx="100"
        ry="100"
        fill="none"
        stroke={orange}
        strokeWidth="3"
        opacity="0.4"
      />
      {/* Brain inner glow */}
      <ellipse cx="400" cy="380" rx="140" ry="160" fill={orange} opacity="0.06" />
      {/* 1M text */}
      <text
        x="400"
        y="400"
        textAnchor="middle"
        fill={white}
        fontSize="80"
        fontWeight="bold"
        fontFamily="monospace"
      >
        1M
      </text>
      <text
        x="400"
        y="440"
        textAnchor="middle"
        fill={dimGray}
        fontSize="22"
        fontFamily="monospace"
      >
        tokens
      </text>
      {/* Data nodes */}
      {nodePositions.map((pos, i) => (
        <g key={`node-${i}`}>
          <circle cx={pos.x} cy={pos.y} r="20" fill={dark} stroke={codeBlue} strokeWidth="2" />
          <rect x={pos.x - 8} y={pos.y - 6} width="16" height="12" rx="2" fill={codeBlue} opacity="0.7" />
        </g>
      ))}
    </svg>
  );
};

// 4. CodebaseTree - A file tree structure showing folders and files
export const CodebaseTree: React.FC<{ size?: number }> = ({ size = 800 }) => {
  const items = [
    { indent: 0, label: "src/", isFolder: true, color: orange },
    { indent: 1, label: "components/", isFolder: true, color: codeBlue },
    { indent: 2, label: "App.tsx", isFolder: false, color: codeGreen },
    { indent: 2, label: "Header.tsx", isFolder: false, color: codeGreen },
    { indent: 2, label: "Layout.tsx", isFolder: false, color: codeGreen },
    { indent: 1, label: "utils/", isFolder: true, color: codeBlue },
    { indent: 2, label: "helpers.ts", isFolder: false, color: codeGreen },
    { indent: 2, label: "api.ts", isFolder: false, color: codeGreen },
    { indent: 1, label: "hooks/", isFolder: true, color: codeBlue },
    { indent: 2, label: "useAuth.ts", isFolder: false, color: codeGreen },
    { indent: 0, label: "tests/", isFolder: true, color: orange },
    { indent: 1, label: "unit/", isFolder: true, color: codeBlue },
    { indent: 2, label: "app.test.ts", isFolder: false, color: dimGray },
    { indent: 0, label: "package.json", isFolder: false, color: dimGray },
    { indent: 0, label: "tsconfig.json", isFolder: false, color: dimGray },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="800" height="800" fill={dark} />
      {/* Explorer panel */}
      <rect
        x="120"
        y="80"
        width="560"
        height="640"
        rx="12"
        fill="#111111"
        stroke={dimGray}
        strokeWidth="2"
      />
      <text
        x="160"
        y="120"
        fill={dimGray}
        fontSize="18"
        fontFamily="monospace"
        style={{ textTransform: "uppercase" }}
      >
        EXPLORER
      </text>
      <line x1="120" y1="140" x2="680" y2="140" stroke={dimGray} strokeWidth="1" opacity="0.3" />
      {/* File tree items */}
      {items.map((item, i) => {
        const x = 160 + item.indent * 36;
        const y = 180 + i * 38;
        return (
          <g key={i}>
            {/* Tree connector lines */}
            {item.indent > 0 && (
              <>
                <line
                  x1={x - 18}
                  y1={y - 12}
                  x2={x - 18}
                  y2={y - 30}
                  stroke={dimGray}
                  strokeWidth="1"
                  opacity="0.3"
                />
                <line
                  x1={x - 18}
                  y1={y - 12}
                  x2={x - 6}
                  y2={y - 12}
                  stroke={dimGray}
                  strokeWidth="1"
                  opacity="0.3"
                />
              </>
            )}
            {/* Folder/file icon */}
            {item.isFolder ? (
              <g>
                <rect
                  x={x}
                  y={y - 16}
                  width="20"
                  height="14"
                  rx="2"
                  fill={item.color}
                  opacity="0.8"
                />
                <rect
                  x={x}
                  y={y - 18}
                  width="10"
                  height="5"
                  rx="1"
                  fill={item.color}
                  opacity="0.6"
                />
              </g>
            ) : (
              <rect
                x={x + 2}
                y={y - 16}
                width="14"
                height="18"
                rx="2"
                fill="none"
                stroke={item.color}
                strokeWidth="1.5"
                opacity="0.7"
              />
            )}
            <text
              x={x + 28}
              y={y}
              fill={item.color}
              fontSize="20"
              fontFamily="monospace"
            >
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// 5. MessagingPlatforms - Grid of chat bubble icons (4 different colored bubbles)
export const MessagingPlatforms: React.FC<{ size?: number }> = ({
  size = 800,
}) => {
  const platforms = [
    { x: 260, y: 260, color: codeBlue, label: "Slack" },
    { x: 540, y: 260, color: codeGreen, label: "Discord" },
    { x: 260, y: 500, color: orange, label: "Teams" },
    { x: 540, y: 500, color: "#A78BFA", label: "Chat" },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="800" height="800" fill={dark} />
      {/* Grid lines */}
      <line x1="400" y1="140" x2="400" y2="660" stroke={dimGray} strokeWidth="1" opacity="0.2" />
      <line x1="140" y1="380" x2="660" y2="380" stroke={dimGray} strokeWidth="1" opacity="0.2" />
      {platforms.map((p, i) => (
        <g key={i}>
          {/* Chat bubble */}
          <rect
            x={p.x - 80}
            y={p.y - 60}
            width="160"
            height="100"
            rx="20"
            fill={p.color}
            opacity="0.15"
            stroke={p.color}
            strokeWidth="3"
          />
          {/* Bubble tail */}
          <polygon
            points={`${p.x - 30},${p.y + 40} ${p.x - 50},${p.y + 65} ${p.x - 10},${p.y + 40}`}
            fill={p.color}
            opacity="0.15"
            stroke={p.color}
            strokeWidth="3"
          />
          {/* Message lines inside bubble */}
          <rect
            x={p.x - 55}
            y={p.y - 35}
            width="80"
            height="6"
            rx="3"
            fill={p.color}
            opacity="0.6"
          />
          <rect
            x={p.x - 55}
            y={p.y - 18}
            width="110"
            height="6"
            rx="3"
            fill={p.color}
            opacity="0.4"
          />
          <rect
            x={p.x - 55}
            y={p.y - 1}
            width="60"
            height="6"
            rx="3"
            fill={p.color}
            opacity="0.3"
          />
          {/* Label */}
          <text
            x={p.x}
            y={p.y + 90}
            textAnchor="middle"
            fill={p.color}
            fontSize="20"
            fontFamily="monospace"
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
};

// 6. GitHubStarsCounter - A star icon with "310K+" text, radiating lines
export const GitHubStarsCounter: React.FC<{ size?: number }> = ({
  size = 800,
}) => {
  const starPoints = (cx: number, cy: number, outerR: number, innerR: number) => {
    const pts: string[] = [];
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI / 5) * i - Math.PI / 2;
      const r = i % 2 === 0 ? outerR : innerR;
      pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    return pts.join(" ");
  };

  const rays = Array.from({ length: 16 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 16;
    return {
      x1: 400 + 170 * Math.cos(angle),
      y1: 370 + 170 * Math.sin(angle),
      x2: 400 + 250 * Math.cos(angle),
      y2: 370 + 250 * Math.sin(angle),
    };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="800" height="800" fill={dark} />
      {/* Radiating lines */}
      {rays.map((ray, i) => (
        <line
          key={i}
          x1={ray.x1}
          y1={ray.y1}
          x2={ray.x2}
          y2={ray.y2}
          stroke={orange}
          strokeWidth="2"
          opacity={0.2 + (i % 3) * 0.1}
        />
      ))}
      {/* Outer glow */}
      <circle cx="400" cy="370" r="160" fill={orange} opacity="0.05" />
      <circle cx="400" cy="370" r="120" fill={orange} opacity="0.05" />
      {/* Star */}
      <polygon
        points={starPoints(400, 350, 120, 50)}
        fill={orange}
        opacity="0.2"
        stroke={orange}
        strokeWidth="4"
      />
      <polygon
        points={starPoints(400, 350, 90, 38)}
        fill={orange}
        opacity="0.3"
      />
      {/* Counter text */}
      <text
        x="400"
        y="550"
        textAnchor="middle"
        fill={white}
        fontSize="72"
        fontWeight="bold"
        fontFamily="monospace"
      >
        310K+
      </text>
      <text
        x="400"
        y="590"
        textAnchor="middle"
        fill={dimGray}
        fontSize="24"
        fontFamily="monospace"
      >
        GitHub Stars
      </text>
    </svg>
  );
};

// 7. SkillsEcosystem - Honeycomb grid pattern with gear icons inside cells
export const SkillsEcosystem: React.FC<{ size?: number }> = ({
  size = 800,
}) => {
  const hexPoints = (cx: number, cy: number, r: number) => {
    const pts: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    return pts.join(" ");
  };

  const hexR = 64;
  const hexH = hexR * Math.sqrt(3);
  const cells = [
    { col: 0, row: 0, color: orange },
    { col: 1, row: 0, color: codeBlue },
    { col: 2, row: 0, color: codeGreen },
    { col: -0.5, row: 1, color: codeBlue },
    { col: 0.5, row: 1, color: orange },
    { col: 1.5, row: 1, color: codeGreen },
    { col: 2.5, row: 1, color: codeBlue },
    { col: 0, row: 2, color: codeGreen },
    { col: 1, row: 2, color: orange },
    { col: 2, row: 2, color: codeBlue },
    { col: -0.5, row: 3, color: orange },
    { col: 0.5, row: 3, color: codeBlue },
    { col: 1.5, row: 3, color: orange },
    { col: 2.5, row: 3, color: codeGreen },
  ];

  const baseCx = 220;
  const baseCy = 170;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="800" height="800" fill={dark} />
      {cells.map((cell, i) => {
        const cx = baseCx + cell.col * (hexR * 1.5 + 8);
        const cy = baseCy + cell.row * (hexH * 0.5 + 8);
        return (
          <g key={i}>
            <polygon
              points={hexPoints(cx, cy, hexR)}
              fill={cell.color}
              opacity="0.08"
              stroke={cell.color}
              strokeWidth="2"
              opacity-stroke="0.6"
            />
            {/* Gear icon - simplified as circle with notches */}
            <circle
              cx={cx}
              cy={cy}
              r="18"
              fill="none"
              stroke={cell.color}
              strokeWidth="2.5"
              opacity="0.7"
            />
            <circle cx={cx} cy={cy} r="8" fill={cell.color} opacity="0.5" />
            {/* Gear teeth */}
            {[0, 60, 120, 180, 240, 300].map((deg, j) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <rect
                  key={j}
                  x={cx + 16 * Math.cos(rad) - 3}
                  y={cy + 16 * Math.sin(rad) - 3}
                  width="6"
                  height="6"
                  rx="1"
                  fill={cell.color}
                  opacity="0.6"
                  transform={`rotate(${deg}, ${cx + 16 * Math.cos(rad)}, ${cy + 16 * Math.sin(rad)})`}
                />
              );
            })}
          </g>
        );
      })}
      {/* Title */}
      <text
        x="400"
        y="740"
        textAnchor="middle"
        fill={dimGray}
        fontSize="22"
        fontFamily="monospace"
      >
        Skills Ecosystem
      </text>
    </svg>
  );
};

// 8. OpenAITransition - Arrow from left circle (person) to right circle (building/org)
export const OpenAITransition: React.FC<{ size?: number }> = ({
  size = 800,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="800" height="800" fill={dark} />
      {/* Left circle - Person */}
      <circle
        cx="230"
        cy="400"
        r="120"
        fill={codeBlue}
        opacity="0.1"
        stroke={codeBlue}
        strokeWidth="3"
      />
      {/* Person icon */}
      <circle cx="230" cy="360" r="30" fill="none" stroke={codeBlue} strokeWidth="3" />
      <path
        d="M 185 440 Q 185 400 230 400 Q 275 400 275 440"
        fill="none"
        stroke={codeBlue}
        strokeWidth="3"
      />
      <text
        x="230"
        y="490"
        textAnchor="middle"
        fill={codeBlue}
        fontSize="18"
        fontFamily="monospace"
      >
        Individual
      </text>
      {/* Arrow */}
      <line
        x1="370"
        y1="400"
        x2="490"
        y2="400"
        stroke={orange}
        strokeWidth="4"
      />
      <polygon points="500,400 480,385 480,415" fill={orange} />
      {/* Transition label */}
      <text
        x="430"
        y="380"
        textAnchor="middle"
        fill={dimGray}
        fontSize="16"
        fontFamily="monospace"
      >
        fork &rarr; org
      </text>
      {/* Right circle - Organization/Building */}
      <circle
        cx="570"
        cy="400"
        r="120"
        fill={orange}
        opacity="0.1"
        stroke={orange}
        strokeWidth="3"
      />
      {/* Building icon */}
      <rect
        x="545"
        y="340"
        width="50"
        height="80"
        rx="4"
        fill="none"
        stroke={orange}
        strokeWidth="3"
      />
      <rect x="552" y="352" width="10" height="10" rx="1" fill={orange} opacity="0.5" />
      <rect x="575" y="352" width="10" height="10" rx="1" fill={orange} opacity="0.5" />
      <rect x="552" y="372" width="10" height="10" rx="1" fill={orange} opacity="0.5" />
      <rect x="575" y="372" width="10" height="10" rx="1" fill={orange} opacity="0.5" />
      <rect x="562" y="398" width="16" height="22" rx="2" fill={orange} opacity="0.4" />
      {/* Roof */}
      <polygon points="540,342 570,318 600,342" fill="none" stroke={orange} strokeWidth="3" />
      <text
        x="570"
        y="490"
        textAnchor="middle"
        fill={orange}
        fontSize="18"
        fontFamily="monospace"
      >
        Organization
      </text>
    </svg>
  );
};

// 9. PurposeComparison - Split view: left side code brackets, right side calendar/home/music icons
export const PurposeComparison: React.FC<{ size?: number }> = ({
  size = 800,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="800" height="800" fill={dark} />
      {/* Divider */}
      <line
        x1="400"
        y1="120"
        x2="400"
        y2="680"
        stroke={dimGray}
        strokeWidth="2"
        strokeDasharray="8,8"
      />
      {/* Left side - Code/Developer focus */}
      <rect
        x="100"
        y="180"
        width="240"
        height="440"
        rx="12"
        fill={orange}
        opacity="0.05"
        stroke={orange}
        strokeWidth="2"
      />
      <text
        x="220"
        y="150"
        textAnchor="middle"
        fill={orange}
        fontSize="22"
        fontWeight="bold"
        fontFamily="monospace"
      >
        Claude Code
      </text>
      {/* Code brackets */}
      <text
        x="220"
        y="320"
        textAnchor="middle"
        fill={orange}
        fontSize="120"
        fontFamily="monospace"
        opacity="0.8"
      >
        {"{ }"}
      </text>
      {/* Code lines */}
      <rect x="150" y="400" width="140" height="8" rx="4" fill={codeGreen} opacity="0.5" />
      <rect x="150" y="420" width="100" height="8" rx="4" fill={codeBlue} opacity="0.5" />
      <rect x="150" y="440" width="120" height="8" rx="4" fill={orange} opacity="0.5" />
      <text
        x="220"
        y="520"
        textAnchor="middle"
        fill={dimGray}
        fontSize="16"
        fontFamily="monospace"
      >
        Software Dev
      </text>
      {/* Right side - General assistant */}
      <rect
        x="460"
        y="180"
        width="240"
        height="440"
        rx="12"
        fill={codeBlue}
        opacity="0.05"
        stroke={codeBlue}
        strokeWidth="2"
      />
      <text
        x="580"
        y="150"
        textAnchor="middle"
        fill={codeBlue}
        fontSize="22"
        fontWeight="bold"
        fontFamily="monospace"
      >
        OpenClaw
      </text>
      {/* Calendar icon */}
      <rect
        x="520"
        y="260"
        width="50"
        height="45"
        rx="6"
        fill="none"
        stroke={codeBlue}
        strokeWidth="2.5"
      />
      <line x1="520" y1="274" x2="570" y2="274" stroke={codeBlue} strokeWidth="2" />
      <line x1="534" y1="252" x2="534" y2="266" stroke={codeBlue} strokeWidth="2" />
      <line x1="556" y1="252" x2="556" y2="266" stroke={codeBlue} strokeWidth="2" />
      {/* Home icon */}
      <polygon
        points="580,380 605,356 630,380"
        fill="none"
        stroke={codeGreen}
        strokeWidth="2.5"
      />
      <rect
        x="588"
        y="378"
        width="34"
        height="30"
        fill="none"
        stroke={codeGreen}
        strokeWidth="2.5"
      />
      {/* Music note icon */}
      <circle cx="540" cy="460" r="12" fill="none" stroke="#A78BFA" strokeWidth="2.5" />
      <line x1="552" y1="460" x2="552" y2="424" stroke="#A78BFA" strokeWidth="2.5" />
      <line x1="552" y1="424" x2="572" y2="420" stroke="#A78BFA" strokeWidth="2.5" />
      <text
        x="580"
        y="520"
        textAnchor="middle"
        fill={dimGray}
        fontSize="16"
        fontFamily="monospace"
      >
        General Tasks
      </text>
    </svg>
  );
};

// 10. CloudVsLocal - Cloud icon on left, laptop/server on right with arrows
export const CloudVsLocal: React.FC<{ size?: number }> = ({ size = 800 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="800" height="800" fill={dark} />
      {/* Cloud icon - left */}
      <circle cx="200" cy="340" r="60" fill={codeBlue} opacity="0.15" stroke={codeBlue} strokeWidth="3" />
      <circle cx="270" cy="350" r="50" fill={codeBlue} opacity="0.15" stroke={codeBlue} strokeWidth="3" />
      <circle cx="150" cy="360" r="40" fill={codeBlue} opacity="0.15" stroke={codeBlue} strokeWidth="3" />
      <rect x="140" y="370" width="140" height="40" rx="8" fill={dark} stroke={codeBlue} strokeWidth="3" />
      <rect x="140" y="370" width="140" height="40" rx="8" fill={codeBlue} opacity="0.1" />
      <text
        x="210"
        y="460"
        textAnchor="middle"
        fill={codeBlue}
        fontSize="22"
        fontFamily="monospace"
      >
        Cloud API
      </text>
      {/* Arrows between */}
      <line x1="340" y1="370" x2="440" y2="370" stroke={orange} strokeWidth="3" />
      <polygon points="450,370 436,360 436,380" fill={orange} />
      <line x1="440" y1="400" x2="340" y2="400" stroke={codeGreen} strokeWidth="3" />
      <polygon points="330,400 344,390 344,410" fill={codeGreen} />
      <text
        x="390"
        y="350"
        textAnchor="middle"
        fill={dimGray}
        fontSize="14"
        fontFamily="monospace"
      >
        sync
      </text>
      {/* Laptop/Server - right */}
      <rect
        x="480"
        y="310"
        width="180"
        height="110"
        rx="10"
        fill="#111111"
        stroke={orange}
        strokeWidth="3"
      />
      {/* Screen content */}
      <rect x="495" y="325" width="150" height="75" rx="4" fill={dark} />
      <text
        x="510"
        y="352"
        fill={codeGreen}
        fontSize="14"
        fontFamily="monospace"
      >
        {"$ claude"}
      </text>
      <text
        x="510"
        y="375"
        fill={dimGray}
        fontSize="12"
        fontFamily="monospace"
      >
        {">"} running local...
      </text>
      {/* Laptop base */}
      <rect x="460" y="420" width="220" height="14" rx="4" fill="#222" stroke={orange} strokeWidth="2" />
      <text
        x="570"
        y="470"
        textAnchor="middle"
        fill={orange}
        fontSize="22"
        fontFamily="monospace"
      >
        Local Machine
      </text>
      {/* Labels */}
      <text
        x="210"
        y="550"
        textAnchor="middle"
        fill={dimGray}
        fontSize="16"
        fontFamily="monospace"
      >
        Anthropic API
      </text>
      <text
        x="570"
        y="550"
        textAnchor="middle"
        fill={dimGray}
        fontSize="16"
        fontFamily="monospace"
      >
        Your Codebase
      </text>
    </svg>
  );
};

// 11. SecurityShield - A large shield with a lock icon, glowing red warning border
export const SecurityShield: React.FC<{ size?: number }> = ({
  size = 800,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="800" height="800" fill={dark} />
      {/* Red glow rings */}
      <circle cx="400" cy="400" r="300" fill="none" stroke={red} strokeWidth="1" opacity="0.1" />
      <circle cx="400" cy="400" r="270" fill="none" stroke={red} strokeWidth="1.5" opacity="0.15" />
      <circle cx="400" cy="400" r="240" fill="none" stroke={red} strokeWidth="2" opacity="0.2" />
      {/* Shield shape */}
      <path
        d="M 400 140 L 560 220 L 560 440 Q 560 580 400 660 Q 240 580 240 440 L 240 220 Z"
        fill={red}
        opacity="0.08"
        stroke={red}
        strokeWidth="4"
      />
      <path
        d="M 400 180 L 530 245 L 530 430 Q 530 550 400 620 Q 270 550 270 430 L 270 245 Z"
        fill={red}
        opacity="0.05"
        stroke={red}
        strokeWidth="2"
      />
      {/* Lock body */}
      <rect
        x="360"
        y="380"
        width="80"
        height="70"
        rx="8"
        fill={red}
        opacity="0.3"
        stroke={red}
        strokeWidth="3"
      />
      {/* Lock shackle */}
      <path
        d="M 375 380 L 375 340 Q 375 300 400 300 Q 425 300 425 340 L 425 380"
        fill="none"
        stroke={red}
        strokeWidth="4"
      />
      {/* Keyhole */}
      <circle cx="400" cy="410" r="10" fill={red} opacity="0.6" />
      <rect x="397" y="418" width="6" height="18" rx="2" fill={red} opacity="0.6" />
      {/* Warning text */}
      <text
        x="400"
        y="540"
        textAnchor="middle"
        fill={red}
        fontSize="24"
        fontWeight="bold"
        fontFamily="monospace"
      >
        SECURITY
      </text>
    </svg>
  );
};

// 12. VulnerabilityAlert - Cracked shield with exclamation mark, danger colors
export const VulnerabilityAlert: React.FC<{ size?: number }> = ({
  size = 800,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="800" height="800" fill={dark} />
      {/* Cracked shield */}
      <path
        d="M 400 150 L 570 235 L 570 450 Q 570 590 400 670 Q 230 590 230 450 L 230 235 Z"
        fill={red}
        opacity="0.06"
        stroke={red}
        strokeWidth="4"
      />
      {/* Crack lines */}
      <path
        d="M 400 150 L 410 260 L 380 320 L 420 380 L 390 440 L 410 520 L 400 670"
        fill="none"
        stroke={red}
        strokeWidth="3"
        opacity="0.8"
      />
      {/* Secondary cracks */}
      <line x1="410" y1="260" x2="460" y2="280" stroke={red} strokeWidth="2" opacity="0.5" />
      <line x1="380" y1="320" x2="330" y2="340" stroke={red} strokeWidth="2" opacity="0.5" />
      <line x1="420" y1="380" x2="470" y2="370" stroke={red} strokeWidth="2" opacity="0.5" />
      <line x1="390" y1="440" x2="340" y2="460" stroke={red} strokeWidth="2" opacity="0.5" />
      {/* Exclamation mark */}
      <rect
        x="388"
        y="220"
        width="24"
        height="140"
        rx="12"
        fill={red}
        opacity="0.8"
      />
      <circle cx="400" cy="400" r="14" fill={red} opacity="0.8" />
      {/* Warning fragments */}
      <rect x="300" y="550" width="80" height="4" rx="2" fill={red} opacity="0.3" />
      <rect x="420" y="550" width="80" height="4" rx="2" fill={red} opacity="0.3" />
      {/* Alert text */}
      <text
        x="400"
        y="630"
        textAnchor="middle"
        fill={red}
        fontSize="28"
        fontWeight="bold"
        fontFamily="monospace"
      >
        VULNERABILITY
      </text>
    </svg>
  );
};

// 13. CVEBadge - A badge/stamp shape with "CVE" text and warning triangle
export const CVEBadge: React.FC<{ size?: number }> = ({ size = 800 }) => {
  const badgePoints = (cx: number, cy: number, outerR: number, innerR: number, n: number) => {
    const pts: string[] = [];
    for (let i = 0; i < n * 2; i++) {
      const angle = (Math.PI * i) / n - Math.PI / 2;
      const r = i % 2 === 0 ? outerR : innerR;
      pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    return pts.join(" ");
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="800" height="800" fill={dark} />
      {/* Badge outer edge */}
      <polygon
        points={badgePoints(400, 380, 220, 180, 16)}
        fill={red}
        opacity="0.08"
        stroke={red}
        strokeWidth="3"
      />
      {/* Badge inner circle */}
      <circle
        cx="400"
        cy="380"
        r="150"
        fill={red}
        opacity="0.06"
        stroke={red}
        strokeWidth="2"
      />
      <circle
        cx="400"
        cy="380"
        r="130"
        fill="none"
        stroke={red}
        strokeWidth="1"
        opacity="0.4"
      />
      {/* Warning triangle */}
      <polygon
        points="400,280 350,360 450,360"
        fill="none"
        stroke={red}
        strokeWidth="4"
      />
      <text
        x="400"
        y="350"
        textAnchor="middle"
        fill={red}
        fontSize="32"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        !
      </text>
      {/* CVE text */}
      <text
        x="400"
        y="430"
        textAnchor="middle"
        fill={red}
        fontSize="64"
        fontWeight="bold"
        fontFamily="monospace"
      >
        CVE
      </text>
      {/* Sub text */}
      <text
        x="400"
        y="475"
        textAnchor="middle"
        fill={dimGray}
        fontSize="20"
        fontFamily="monospace"
      >
        2025-XXXXX
      </text>
      {/* Corner markers */}
      <rect x="140" y="140" width="40" height="4" rx="2" fill={red} opacity="0.3" />
      <rect x="140" y="140" width="4" height="40" rx="2" fill={red} opacity="0.3" />
      <rect x="620" y="140" width="40" height="4" rx="2" fill={red} opacity="0.3" />
      <rect x="656" y="140" width="4" height="40" rx="2" fill={red} opacity="0.3" />
      <rect x="140" y="656" width="40" height="4" rx="2" fill={red} opacity="0.3" />
      <rect x="140" y="620" width="4" height="40" rx="2" fill={red} opacity="0.3" />
      <rect x="620" y="656" width="40" height="4" rx="2" fill={red} opacity="0.3" />
      <rect x="656" y="620" width="4" height="40" rx="2" fill={red} opacity="0.3" />
    </svg>
  );
};

// 14. MaliciousCode - A skull icon overlaid on a code bracket, red tones
export const MaliciousCode: React.FC<{ size?: number }> = ({ size = 800 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="800" height="800" fill={dark} />
      {/* Code brackets in background */}
      <text
        x="180"
        y="480"
        fill={red}
        fontSize="240"
        fontFamily="monospace"
        opacity="0.1"
      >
        {"<"}
      </text>
      <text
        x="520"
        y="480"
        fill={red}
        fontSize="240"
        fontFamily="monospace"
        opacity="0.1"
      >
        {"/>"}
      </text>
      {/* Skull - cranium */}
      <ellipse
        cx="400"
        cy="340"
        rx="120"
        ry="130"
        fill={red}
        opacity="0.1"
        stroke={red}
        strokeWidth="4"
      />
      {/* Eye sockets */}
      <ellipse
        cx="355"
        cy="320"
        rx="30"
        ry="35"
        fill={dark}
        stroke={red}
        strokeWidth="3"
      />
      <ellipse
        cx="445"
        cy="320"
        rx="30"
        ry="35"
        fill={dark}
        stroke={red}
        strokeWidth="3"
      />
      {/* Red glowing eyes */}
      <circle cx="355" cy="320" r="10" fill={red} opacity="0.7" />
      <circle cx="445" cy="320" r="10" fill={red} opacity="0.7" />
      {/* Nose */}
      <polygon
        points="400,360 388,390 412,390"
        fill="none"
        stroke={red}
        strokeWidth="2.5"
      />
      {/* Jaw/Teeth */}
      <rect
        x="340"
        y="410"
        width="120"
        height="40"
        rx="6"
        fill="none"
        stroke={red}
        strokeWidth="3"
      />
      {/* Teeth lines */}
      <line x1="360" y1="410" x2="360" y2="450" stroke={red} strokeWidth="2" />
      <line x1="380" y1="410" x2="380" y2="450" stroke={red} strokeWidth="2" />
      <line x1="400" y1="410" x2="400" y2="450" stroke={red} strokeWidth="2" />
      <line x1="420" y1="410" x2="420" y2="450" stroke={red} strokeWidth="2" />
      <line x1="440" y1="410" x2="440" y2="450" stroke={red} strokeWidth="2" />
      {/* Malicious code lines below */}
      <rect x="240" y="520" width="320" height="8" rx="4" fill={red} opacity="0.2" />
      <rect x="260" y="544" width="200" height="8" rx="4" fill={red} opacity="0.15" />
      <rect x="260" y="568" width="280" height="8" rx="4" fill={red} opacity="0.1" />
      {/* Warning label */}
      <text
        x="400"
        y="640"
        textAnchor="middle"
        fill={red}
        fontSize="26"
        fontWeight="bold"
        fontFamily="monospace"
      >
        MALICIOUS CODE
      </text>
    </svg>
  );
};

// 15. PermissionSystem - A lock with checkmark, green tones, multiple permission layers
export const PermissionSystem: React.FC<{ size?: number }> = ({
  size = 800,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="800" height="800" fill={dark} />
      {/* Permission layers - concentric rounded rects */}
      <rect
        x="140"
        y="140"
        width="520"
        height="520"
        rx="24"
        fill={codeGreen}
        opacity="0.03"
        stroke={codeGreen}
        strokeWidth="1.5"
        opacity-stroke="0.2"
      />
      <rect
        x="200"
        y="200"
        width="400"
        height="400"
        rx="20"
        fill={codeGreen}
        opacity="0.05"
        stroke={codeGreen}
        strokeWidth="1.5"
        opacity-stroke="0.3"
      />
      <rect
        x="260"
        y="260"
        width="280"
        height="280"
        rx="16"
        fill={codeGreen}
        opacity="0.07"
        stroke={codeGreen}
        strokeWidth="2"
        opacity-stroke="0.4"
      />
      {/* Layer labels */}
      <text x="160" y="170" fill={codeGreen} fontSize="14" fontFamily="monospace" opacity="0.5">
        Network Access
      </text>
      <text x="220" y="230" fill={codeGreen} fontSize="14" fontFamily="monospace" opacity="0.6">
        File System
      </text>
      <text x="280" y="290" fill={codeGreen} fontSize="14" fontFamily="monospace" opacity="0.7">
        Shell Commands
      </text>
      {/* Central lock */}
      <rect
        x="350"
        y="380"
        width="100"
        height="90"
        rx="12"
        fill={codeGreen}
        opacity="0.2"
        stroke={codeGreen}
        strokeWidth="3"
      />
      {/* Lock shackle */}
      <path
        d="M 370 380 L 370 345 Q 370 310 400 310 Q 430 310 430 345 L 430 380"
        fill="none"
        stroke={codeGreen}
        strokeWidth="4"
      />
      {/* Checkmark inside lock */}
      <path
        d="M 378 425 L 395 445 L 430 405"
        fill="none"
        stroke={codeGreen}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Permission labels on sides */}
      <text
        x="400"
        y="540"
        textAnchor="middle"
        fill={codeGreen}
        fontSize="20"
        fontFamily="monospace"
      >
        PERMISSIONS
      </text>
      {/* Green dots representing approval */}
      {[180, 300, 420, 540, 620].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy="620" r="8" fill={codeGreen} opacity={0.3 + i * 0.1} />
          <text
            x={x}
            y="650"
            textAnchor="middle"
            fill={dimGray}
            fontSize="10"
            fontFamily="monospace"
          >
            L{i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
};

// 16. MCPBridge - Bridge/connector icon linking two nodes (database to AI)
export const MCPBridge: React.FC<{ size?: number }> = ({ size = 800 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="800" height="800" fill={dark} />
      {/* Left node - Database */}
      <ellipse cx="200" cy="340" rx="80" ry="25" fill="none" stroke={codeBlue} strokeWidth="3" />
      <rect
        x="120"
        y="340"
        width="160"
        height="100"
        fill="none"
        stroke={codeBlue}
        strokeWidth="3"
      />
      <ellipse cx="200" cy="440" rx="80" ry="25" fill="none" stroke={codeBlue} strokeWidth="3" />
      <ellipse cx="200" cy="340" rx="80" ry="25" fill={codeBlue} opacity="0.1" />
      <ellipse cx="200" cy="370" rx="80" ry="20" fill="none" stroke={codeBlue} strokeWidth="1" opacity="0.3" />
      <ellipse cx="200" cy="400" rx="80" ry="20" fill="none" stroke={codeBlue} strokeWidth="1" opacity="0.3" />
      <text
        x="200"
        y="510"
        textAnchor="middle"
        fill={codeBlue}
        fontSize="20"
        fontFamily="monospace"
      >
        Database
      </text>
      {/* Bridge structure */}
      <path
        d="M 310 390 Q 400 280 490 390"
        fill="none"
        stroke={orange}
        strokeWidth="4"
      />
      {/* Bridge cables */}
      <line x1="340" y1="390" x2="340" y2="350" stroke={orange} strokeWidth="2" opacity="0.6" />
      <line x1="370" y1="390" x2="370" y2="320" stroke={orange} strokeWidth="2" opacity="0.6" />
      <line x1="400" y1="390" x2="400" y2="308" stroke={orange} strokeWidth="2" opacity="0.6" />
      <line x1="430" y1="390" x2="430" y2="320" stroke={orange} strokeWidth="2" opacity="0.6" />
      <line x1="460" y1="390" x2="460" y2="350" stroke={orange} strokeWidth="2" opacity="0.6" />
      {/* Bridge road */}
      <rect x="310" y="385" width="180" height="10" rx="2" fill={orange} opacity="0.3" />
      {/* MCP label */}
      <text
        x="400"
        y="360"
        textAnchor="middle"
        fill={orange}
        fontSize="28"
        fontWeight="bold"
        fontFamily="monospace"
      >
        MCP
      </text>
      {/* Right node - AI */}
      <circle
        cx="600"
        cy="390"
        r="80"
        fill={codeGreen}
        opacity="0.08"
        stroke={codeGreen}
        strokeWidth="3"
      />
      <circle
        cx="600"
        cy="390"
        r="50"
        fill="none"
        stroke={codeGreen}
        strokeWidth="2"
        opacity="0.4"
      />
      {/* AI brain pattern */}
      <text
        x="600"
        y="400"
        textAnchor="middle"
        fill={codeGreen}
        fontSize="36"
        fontWeight="bold"
        fontFamily="monospace"
      >
        AI
      </text>
      <text
        x="600"
        y="510"
        textAnchor="middle"
        fill={codeGreen}
        fontSize="20"
        fontFamily="monospace"
      >
        Agent
      </text>
      {/* Data flow dots */}
      {[330, 365, 400, 435, 470].map((x, i) => (
        <circle
          key={i}
          cx={x}
          cy="395"
          r="3"
          fill={orange}
          opacity={0.4 + i * 0.12}
        />
      ))}
    </svg>
  );
};

// 17. PriceComparison - Dollar sign with "Free" on left, subscription card on right
export const PriceComparison: React.FC<{ size?: number }> = ({
  size = 800,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="800" height="800" fill={dark} />
      {/* Left side - Free */}
      <circle
        cx="240"
        cy="380"
        r="130"
        fill={codeGreen}
        opacity="0.06"
        stroke={codeGreen}
        strokeWidth="3"
      />
      <text
        x="240"
        y="360"
        textAnchor="middle"
        fill={codeGreen}
        fontSize="100"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        $0
      </text>
      <text
        x="240"
        y="410"
        textAnchor="middle"
        fill={codeGreen}
        fontSize="36"
        fontWeight="bold"
        fontFamily="monospace"
      >
        FREE
      </text>
      <text
        x="240"
        y="450"
        textAnchor="middle"
        fill={dimGray}
        fontSize="16"
        fontFamily="monospace"
      >
        Open Source
      </text>
      {/* VS divider */}
      <text
        x="400"
        y="390"
        textAnchor="middle"
        fill={dimGray}
        fontSize="28"
        fontFamily="sans-serif"
      >
        vs
      </text>
      <line x1="400" y1="220" x2="400" y2="340" stroke={dimGray} strokeWidth="1" opacity="0.3" />
      <line x1="400" y1="420" x2="400" y2="560" stroke={dimGray} strokeWidth="1" opacity="0.3" />
      {/* Right side - Subscription card */}
      <rect
        x="480"
        y="280"
        width="220"
        height="200"
        rx="16"
        fill={orange}
        opacity="0.08"
        stroke={orange}
        strokeWidth="3"
      />
      {/* Card chip */}
      <rect
        x="510"
        y="320"
        width="40"
        height="30"
        rx="6"
        fill={orange}
        opacity="0.3"
        stroke={orange}
        strokeWidth="1.5"
      />
      <line x1="510" y1="335" x2="550" y2="335" stroke={orange} strokeWidth="1" opacity="0.5" />
      <line x1="530" y1="320" x2="530" y2="350" stroke={orange} strokeWidth="1" opacity="0.5" />
      {/* Price */}
      <text
        x="590"
        y="410"
        textAnchor="middle"
        fill={orange}
        fontSize="48"
        fontWeight="bold"
        fontFamily="monospace"
      >
        $20
      </text>
      <text
        x="590"
        y="445"
        textAnchor="middle"
        fill={dimGray}
        fontSize="18"
        fontFamily="monospace"
      >
        /month
      </text>
      {/* Card number dots */}
      {[0, 1, 2, 3].map((g) => (
        <g key={g}>
          {[0, 1, 2, 3].map((d) => (
            <circle
              key={d}
              cx={510 + g * 42 + d * 8}
              cy="460"
              r="2.5"
              fill={dimGray}
              opacity="0.4"
            />
          ))}
        </g>
      ))}
    </svg>
  );
};

// 18. WinnerTrophy - Trophy cup with "#1" and sparkles, orange tones
export const WinnerTrophy: React.FC<{ size?: number }> = ({ size = 800 }) => {
  const sparklePositions = [
    { x: 200, y: 180 },
    { x: 600, y: 200 },
    { x: 160, y: 420 },
    { x: 640, y: 380 },
    { x: 300, y: 140 },
    { x: 520, y: 150 },
    { x: 180, y: 300 },
    { x: 620, y: 280 },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="800" height="800" fill={dark} />
      {/* Sparkles */}
      {sparklePositions.map((sp, i) => (
        <g key={i}>
          <line
            x1={sp.x - 12}
            y1={sp.y}
            x2={sp.x + 12}
            y2={sp.y}
            stroke={orange}
            strokeWidth="2"
            opacity={0.3 + (i % 3) * 0.15}
          />
          <line
            x1={sp.x}
            y1={sp.y - 12}
            x2={sp.x}
            y2={sp.y + 12}
            stroke={orange}
            strokeWidth="2"
            opacity={0.3 + (i % 3) * 0.15}
          />
          <line
            x1={sp.x - 8}
            y1={sp.y - 8}
            x2={sp.x + 8}
            y2={sp.y + 8}
            stroke={orange}
            strokeWidth="1.5"
            opacity={0.2 + (i % 3) * 0.1}
          />
          <line
            x1={sp.x + 8}
            y1={sp.y - 8}
            x2={sp.x - 8}
            y2={sp.y + 8}
            stroke={orange}
            strokeWidth="1.5"
            opacity={0.2 + (i % 3) * 0.1}
          />
        </g>
      ))}
      {/* Trophy cup */}
      <path
        d="M 300 200 L 300 380 Q 300 480 400 500 Q 500 480 500 380 L 500 200 Z"
        fill={orange}
        opacity="0.12"
        stroke={orange}
        strokeWidth="4"
      />
      {/* Trophy rim */}
      <rect x="280" y="190" width="240" height="20" rx="6" fill={orange} opacity="0.2" stroke={orange} strokeWidth="2" />
      {/* Left handle */}
      <path
        d="M 300 250 Q 230 250 230 320 Q 230 380 300 380"
        fill="none"
        stroke={orange}
        strokeWidth="4"
      />
      {/* Right handle */}
      <path
        d="M 500 250 Q 570 250 570 320 Q 570 380 500 380"
        fill="none"
        stroke={orange}
        strokeWidth="4"
      />
      {/* Trophy stem */}
      <rect x="380" y="500" width="40" height="60" rx="4" fill={orange} opacity="0.3" stroke={orange} strokeWidth="2" />
      {/* Trophy base */}
      <rect x="320" y="555" width="160" height="25" rx="8" fill={orange} opacity="0.2" stroke={orange} strokeWidth="3" />
      <rect x="340" y="575" width="120" height="16" rx="6" fill={orange} opacity="0.15" stroke={orange} strokeWidth="2" />
      {/* #1 text */}
      <text
        x="400"
        y="370"
        textAnchor="middle"
        fill={orange}
        fontSize="80"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        #1
      </text>
      {/* Winner label */}
      <text
        x="400"
        y="650"
        textAnchor="middle"
        fill={dimGray}
        fontSize="24"
        fontFamily="monospace"
      >
        WINNER
      </text>
    </svg>
  );
};

// 19. EnterpriseSecurity - Building with shield and checkmark, enterprise feel
export const EnterpriseSecurity: React.FC<{ size?: number }> = ({
  size = 800,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="800" height="800" fill={dark} />
      {/* Building */}
      <rect
        x="260"
        y="180"
        width="280"
        height="400"
        rx="8"
        fill="#111111"
        stroke={codeBlue}
        strokeWidth="3"
      />
      {/* Building roof */}
      <rect
        x="240"
        y="170"
        width="320"
        height="24"
        rx="4"
        fill={codeBlue}
        opacity="0.3"
      />
      {/* Windows - 4 rows of 3 */}
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={295 + col * 70}
            y={220 + row * 80}
            width="40"
            height="50"
            rx="4"
            fill={codeBlue}
            opacity={0.15 + (row + col) * 0.03}
            stroke={codeBlue}
            strokeWidth="1"
            opacity-stroke="0.3"
          />
        ))
      )}
      {/* Building entrance */}
      <rect
        x="365"
        y="510"
        width="70"
        height="70"
        rx="4"
        fill={dark}
        stroke={codeBlue}
        strokeWidth="2"
      />
      <rect x="365" y="500" width="70" height="16" rx="8" fill={codeBlue} opacity="0.2" />
      {/* Shield overlay - lower right */}
      <path
        d="M 540 440 L 630 475 L 630 560 Q 630 630 540 660 Q 450 630 450 560 L 450 475 Z"
        fill={codeGreen}
        opacity="0.1"
        stroke={codeGreen}
        strokeWidth="3"
      />
      {/* Checkmark in shield */}
      <path
        d="M 510 545 L 530 570 L 575 520"
        fill="none"
        stroke={codeGreen}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Enterprise label */}
      <text
        x="400"
        y="650"
        textAnchor="middle"
        fill={codeBlue}
        fontSize="22"
        fontFamily="monospace"
      >
        ENTERPRISE
      </text>
      <text
        x="400"
        y="680"
        textAnchor="middle"
        fill={codeGreen}
        fontSize="18"
        fontFamily="monospace"
      >
        SECURED
      </text>
      {/* Connection dots at top */}
      {[320, 370, 420, 480].map((x, i) => (
        <circle key={i} cx={x} cy="140" r="4" fill={codeBlue} opacity={0.3 + i * 0.1} />
      ))}
      <line x1="320" y1="140" x2="480" y2="140" stroke={codeBlue} strokeWidth="1" opacity="0.2" />
    </svg>
  );
};

// 20. FinalVerdict - A gavel with Claude Code logo styling
export const FinalVerdict: React.FC<{ size?: number }> = ({ size = 800 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="800" height="800" fill={dark} />
      {/* Radial glow */}
      <circle cx="400" cy="380" r="250" fill={orange} opacity="0.03" />
      <circle cx="400" cy="380" r="180" fill={orange} opacity="0.03" />
      {/* Gavel head */}
      <rect
        x="280"
        y="240"
        width="200"
        height="80"
        rx="16"
        fill={orange}
        opacity="0.2"
        stroke={orange}
        strokeWidth="4"
        transform="rotate(-30, 380, 280)"
      />
      {/* Gavel head bands */}
      <rect
        x="290"
        y="260"
        width="20"
        height="40"
        rx="4"
        fill={orange}
        opacity="0.3"
        transform="rotate(-30, 380, 280)"
      />
      <rect
        x="450"
        y="260"
        width="20"
        height="40"
        rx="4"
        fill={orange}
        opacity="0.3"
        transform="rotate(-30, 380, 280)"
      />
      {/* Gavel handle */}
      <rect
        x="370"
        y="310"
        width="20"
        height="200"
        rx="6"
        fill={orange}
        opacity="0.15"
        stroke={orange}
        strokeWidth="3"
        transform="rotate(-30, 380, 410)"
      />
      {/* Sound block (base) */}
      <rect
        x="280"
        y="530"
        width="240"
        height="40"
        rx="8"
        fill={orange}
        opacity="0.15"
        stroke={orange}
        strokeWidth="3"
      />
      <rect
        x="300"
        y="565"
        width="200"
        height="20"
        rx="6"
        fill={orange}
        opacity="0.1"
        stroke={orange}
        strokeWidth="2"
      />
      {/* Impact lines */}
      <line x1="340" y1="510" x2="310" y2="480" stroke={orange} strokeWidth="2" opacity="0.4" />
      <line x1="400" y1="500" x2="400" y2="465" stroke={orange} strokeWidth="2" opacity="0.5" />
      <line x1="460" y1="510" x2="490" y2="480" stroke={orange} strokeWidth="2" opacity="0.4" />
      <line x1="360" y1="505" x2="340" y2="475" stroke={orange} strokeWidth="1.5" opacity="0.3" />
      <line x1="440" y1="505" x2="460" y2="475" stroke={orange} strokeWidth="1.5" opacity="0.3" />
      {/* Verdict text */}
      <text
        x="400"
        y="650"
        textAnchor="middle"
        fill={white}
        fontSize="40"
        fontWeight="bold"
        fontFamily="monospace"
      >
        FINAL VERDICT
      </text>
      {/* Decorative line under text */}
      <rect x="260" y="665" width="280" height="3" rx="1.5" fill={orange} opacity="0.5" />
      {/* Claude Code styling - small CC mark */}
      <rect
        x="360"
        y="690"
        width="80"
        height="28"
        rx="6"
        fill={orange}
        opacity="0.1"
        stroke={orange}
        strokeWidth="1.5"
      />
      <text
        x="400"
        y="710"
        textAnchor="middle"
        fill={orange}
        fontSize="16"
        fontWeight="bold"
        fontFamily="monospace"
      >
        CC
      </text>
    </svg>
  );
};
