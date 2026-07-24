"use client";

import Link from "next/link";

export default function RepairsHeader({
  searchQuery,
  onSearchChange,
  repairCount = 0,
  stats = [],
}) {
  return (
    <section className="overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-white">
      <div className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-[24px] font-bold tracking-[-0.02em] text-[#0A0A0A]">Reparaciones</h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center xl:justify-end">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8A8A]">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </span>
            <input
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Buscar folio, cliente o equipo..."
              className="h-10 w-full rounded-[6px] border border-[#D1D5DB] bg-white pl-11 pr-4 text-[13px] font-semibold text-[#0A0A0A] outline-none transition placeholder:text-[#8A8A8A] focus:border-[#0055FF] sm:w-[360px]"
            />
          </div>

          <Link
            href="/admin/reparaciones/nueva"
            id="new-repair-btn"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[6px] bg-[#FF6B00] px-5 text-[13px] font-bold text-white transition hover:bg-[#E85F00]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nueva reparación
          </Link>
        </div>
      </div>

      <div className="border-t border-[#E5E7EB] bg-white">
        <div className="grid overflow-hidden sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-8">
          <StatusSummary
            item={{
              status: "total",
              label: "Total de órdenes",
              note: "Registradas",
              count: repairCount,
              color: "#0055FF",
            }}
          />
          {stats.map((item) => (
            <StatusSummary key={item.status} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatusSummary({ item }) {
  return (
    <div className="flex min-w-[150px] items-center justify-between gap-4 border-b border-[#E5E7EB] px-5 py-3.5 sm:border-r 2xl:border-b-0 2xl:last:border-r-0">
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="truncate text-[12px] font-bold text-[#111827]">{item.label}</span>
        </span>
        <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.08em] text-[#8A8A8A]">
          {item.note}
        </span>
      </span>
      <span className="text-[17px] font-bold leading-none" style={{ color: item.color }}>
        {item.count}
      </span>
    </div>
  );
}
