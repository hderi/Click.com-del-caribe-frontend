"use client";

export default function ClientsStats({ stats = [] }) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <div key={item.label} className="rounded-lg border border-[#d7dee8] bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase text-[#5b677a]">{item.label}</p>
              <p className="mt-1 text-2xl font-bold text-[#111827]">{item.count}</p>
              <p className="mt-1 text-xs leading-5 text-[#6b7280]">{item.note}</p>
            </div>
            <span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
          </div>
        </div>
      ))}
    </section>
  );
}
