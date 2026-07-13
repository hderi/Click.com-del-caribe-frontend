"use client";

import Link from "next/link";

export default function RepairsHeader({ searchQuery, onSearchChange, repairCount = 0 }) {
  return (
    <section className="rounded-[26px] border border-[#C9D8E5] bg-gradient-to-br from-[#F8FBFD] via-[#EEF5FA] to-[#E5F0F7] p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FF7A00]">Órdenes de servicio</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-[-0.03em] text-[#102033]">Reparaciones</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#526174]">
            Aquí se registran y administran los equipos que entran al taller, desde el folio inicial hasta su entrega.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#91A4B7]">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </span>
            <input
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Buscar folio, cliente o equipo..."
              className="h-12 w-full rounded-2xl border border-[#BFD0DF] bg-[#F7FAFC] pl-11 pr-4 text-sm font-semibold text-[#102033] placeholder:text-[#91A4B7] outline-none transition focus:border-[#00A8E8] focus:shadow-[0_0_0_4px_rgba(0,168,232,0.14)] sm:w-80"
            />
          </div>

          <Link
            href="/admin/reparaciones/nueva"
            id="new-repair-btn"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#FF7A00] px-5 text-sm font-black text-white shadow-[0_12px_22px_rgba(255,122,0,0.18)] transition hover:bg-[#00A8E8] hover:shadow-[0_12px_22px_rgba(0,168,232,0.18)]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nueva reparación
          </Link>
        </div>
      </div>

      <p className="mt-5 text-sm font-bold text-[#526174]">
        {repairCount} reparaciones registradas en el sistema.
      </p>
    </section>
  );
}





