"use client";

export default function Logo({ size = "default" }) {
  const sizes = {
    small: { mark: "h-8 w-8", title: "text-sm", subtitle: "text-[10px]" },
    default: { mark: "h-10 w-10", title: "text-base", subtitle: "text-[10px]" },
    large: { mark: "h-12 w-12", title: "text-lg", subtitle: "text-xs" },
  };
  const s = sizes[size] || sizes.default;

  return (
    <div className="flex items-center gap-2.5">
      <div className={`${s.mark} flex shrink-0 items-center justify-center rounded-md border border-[#374151] bg-[#0f172a]`}>
        <span className="text-xs font-bold text-[#93c5fd]">CC</span>
      </div>
      <div className="min-w-0">
        <p className={`${s.title} truncate font-semibold leading-none text-white`}>CLICK.COM</p>
        <p className={`${s.subtitle} mt-1 truncate font-medium uppercase tracking-[0.08em] text-[#9ca3af]`}>
          del Caribe
        </p>
      </div>
    </div>
  );
}
