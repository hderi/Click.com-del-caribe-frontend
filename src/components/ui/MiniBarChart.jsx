"use client";
/* ═══════════════════════════════════════════════════════════════
   MiniBarChart — Pure CSS/SVG chart, no external deps
   Renders a simple animated bar chart for dashboard widgets
   ═══════════════════════════════════════════════════════════════ */
export default function MiniBarChart({ data = [], height = 120, barColor = "brand-blue" }) {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => d.value), 1);
  const colorFillMap = {
    "brand-blue": { fill: "#0066FF", fillLight: "#3388FF" },
    "brand-orange": { fill: "#FF6B2C", fillLight: "#FF8A55" },
    success: { fill: "#22C55E", fillLight: "#4ADE80" },
  };
  const colors = colorFillMap[barColor] || colorFillMap["brand-blue"];
  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${data.length * 40} ${height}`}
        className="w-full"
        style={{ height }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`bar-grad-${barColor}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.fillLight} stopOpacity="0.9" />
            <stop offset="100%" stopColor={colors.fill} stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {data.map((item, i) => {
          const barH = (item.value / max) * (height - 20);
          const x = i * 40 + 8;
          const y = height - barH;
          const w = 24;
          return (
            <g key={i}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={w}
                height={barH}
                rx={4}
                fill={`url(#bar-grad-${barColor})`}
                className="transition-all duration-500 ease-out"
                style={{
                  animation: `bar-grow 0.6s ease-out ${i * 0.05}s both`,
                }}
              />
              {/* Label */}
              <text
                x={x + w / 2}
                y={height - 2}
                textAnchor="middle"
                className="fill-text-muted"
                style={{ fontSize: "9px", fontFamily: "var(--font-sans)" }}
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
