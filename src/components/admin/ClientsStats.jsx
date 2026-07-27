"use client";

export default function ClientsStats({ stats = [] }) {
  return (
    <section className="grid grid-cols-1 overflow-hidden rounded-md border border-[#D9E1EA] bg-white font-['Inter'] sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item, index) => (
        <div
          key={item.label}
          className={`relative min-h-[92px] px-5 py-4 ${
            index !== stats.length - 1 ? "border-b border-[#D9E1EA] sm:border-r xl:border-b-0" : ""
          } ${index === 1 ? "sm:border-r-0 xl:border-r" : ""}`}
        >
          <span className="absolute right-5 top-5 h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#5B677A]">{item.label}</p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-[28px] font-bold leading-none text-[#0B1220]">{item.count}</p>
              <p className="mt-2 text-[13px] leading-5 text-[#526174]">{item.note}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
