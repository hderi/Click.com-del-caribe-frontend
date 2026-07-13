"use client";
/* ═══════════════════════════════════════════════════════════════
   ActivityRing — Circular progress ring for completion stats
   ═══════════════════════════════════════════════════════════════ */
export default function ActivityRing({ percentage = 0, size = 80, strokeWidth = 6, color = "#0066FF", label = "" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-text-primary">{percentage}%</span>
        </div>
      </div>
      {label && <span className="text-[11px] text-text-muted font-medium">{label}</span>}
    </div>
  );
}
