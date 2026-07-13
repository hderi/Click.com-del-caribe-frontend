"use client";

export default function ClientsHeader({ searchQuery, onSearchChange, clientCount = 0, onNewClient }) {
  return (
    <section className="rounded-[26px] border border-[#C9D8E5] bg-gradient-to-br from-[#F8FBFD] via-[#EEF5FA] to-[#E5F0F7] p-6 sm:p-7 shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FF7A00]">Base de clientes</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-[-0.03em] text-[#102033]">Clientes</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#526174]">
            Aquí se consultan clientes reales, sus datos de contacto y el historial que se vaya generando en el sistema.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <div className="relative flex-1 lg:w-96">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#91A4B7]">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </span>
            <input
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Buscar por teléfono, nombre o empresa..."
              className="h-12 w-full rounded-2xl border border-[#BFD0DF] bg-[#F7FAFC] pl-11 pr-4 text-sm font-semibold text-[#102033] placeholder:text-[#7A8AA0] outline-none transition focus:border-[#00A8E8] focus:shadow-[0_0_0_4px_rgba(0,168,232,0.14)]"
            />
          </div>
          <button
            type="button"
            onClick={onNewClient}
            className="h-12 rounded-2xl bg-[#FF7A00] px-5 text-sm font-black text-white shadow-[0_12px_24px_rgba(255,122,0,0.22)] transition hover:bg-[#E66A00]"
          >
            + Nuevo cliente
          </button>
        </div>
      </div>

      <p className="mt-5 text-sm font-bold text-[#526174]">
        {clientCount} clientes registrados en el sistema.
      </p>
    </section>
  );
}