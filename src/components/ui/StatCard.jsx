"use client";
/* ═══════════════════════════════════════════════════════════════
   StatCard — KPI card with icon, value, label, and trend
   ═══════════════════════════════════════════════════════════════ */
export default function StatCard({ icon, label, value, trend, trendLabel, color = "blue" }) {
  const colorMap = {
    blue: {
      iconBg: "bg-brand-blue/10",
      iconText: "text-brand-blue",
      glow: "group-hover:shadow-[0_0_24px_rgba(0,102,255,0.12)]",
      valueText: "text-brand-blue",
      accent: "from-brand-blue/20 to-transparent",
    },
    orange: {
      iconBg: "bg-brand-orange/10",
      iconText: "text-brand-orange",
      glow: "group-hover:shadow-[0_0_24px_rgba(255,107,44,0.12)]",
      valueText: "text-brand-orange",
      accent: "from-brand-orange/20 to-transparent",
    },
    green: {
      iconBg: "bg-success/10",
      iconText: "text-success",
      glow: "group-hover:shadow-[0_0_24px_rgba(34,197,94,0.12)]",
      valueText: "text-success",
      accent: "from-success/20 to-transparent",
    },
    purple: {
      iconBg: "bg-[#8B5CF6]/10",
      iconText: "text-[#8B5CF6]",
      glow: "group-hover:shadow-[0_0_24px_rgba(139,92,246,0.12)]",
      valueText: "text-[#8B5CF6]",
      accent: "from-[#8B5CF6]/20 to-transparent",
    },
  };
  const c = colorMap[color] || colorMap.blue;
  const trendUp = trend > 0;
  const trendDown = trend < 0;
  return (
    <div
      className={`group relative glass rounded-xl p-5 transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] overflow-hidden ${c.glow}`}
    >
      {/* Subtle accent gradient in corner */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${c.accent} rounded-bl-[60px] opacity-60 pointer-events-none`} />
      <div className="relative flex items-start justify-between">
        {/* Left: icon + data */}
        <div className="space-y-3">
          <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
            <span className={c.iconText}>{icon}</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
              {label}
            </p>
            <p className={`text-2xl sm:text-3xl font-bold mt-1 ${c.valueText}`}>
              {value}
            </p>
          </div>
        </div>
        {/* Right: trend badge */}
        {trend !== undefined && trend !== null && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
              trendUp
                ? "bg-success/10 text-success"
                : trendDown
                ? "bg-error/10 text-error"
                : "bg-surface-600 text-text-muted"
            }`}
          >
            {trendUp && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            )}
            {trendDown && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
              </svg>
            )}
            <span>{trend > 0 ? "+" : ""}{trend}%</span>
          </div>
        )}
      </div>
      {/* Bottom trend label */}
      {trendLabel && (
        <p className="relative mt-3 text-[11px] text-text-muted">
          {trendLabel}
        </p>
      )}
    </div>
  );
}