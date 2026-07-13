"use client";
export default function Logo({ size = "default" }) {
  const sizes = {
    small: { wrapper: "gap-2", icon: "w-8 h-8", text: "text-lg" },
    default: { wrapper: "gap-3", icon: "w-11 h-11", text: "text-2xl" },
    large: { wrapper: "gap-4", icon: "w-14 h-14", text: "text-3xl" },
  };
  const s = sizes[size] || sizes.default;
  return (
    <div className={`flex items-center ${s.wrapper}`}>
      {/* Logo icon */}
      <div className={`relative ${s.icon}`}>
        {/* Glow behind icon */}
        <div className="absolute inset-0 rounded-xl bg-brand-blue/20 blur-lg" />
        {/* Icon container */}
        <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-brand-blue to-brand-blue-dark flex items-center justify-center shadow-[0_2px_12px_rgba(0,102,255,0.3)]">
          {/* Circuit / tech icon */}
          <svg
            className="w-[55%] h-[55%] text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Mouse cursor / click icon */}
            <path d="M9 3l-1 9 4-3 2 6 2-1-2-6 5 1L9 3z" />
          </svg>
          {/* Orange accent dot */}
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-brand-orange shadow-[0_0_8px_rgba(255,107,44,0.5)]" />
        </div>
      </div>
      {/* Brand text */}
      <div className="flex flex-col">
        <h1 className={`${s.text} font-bold tracking-tight leading-none`}>
          <span className="gradient-text-blue">CLICK</span>
          <span className="text-brand-orange">.</span>
          <span className="text-text-primary">COM</span>
        </h1>
        <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-text-muted mt-0.5">
          Caribe
        </span>
      </div>
    </div>
  );
}
