import Link from "next/link";

export default function ReportesPage() {
  return (
    <main className="space-y-5 text-[#172234]">
      <section className="rounded-[18px] border border-[#B8C9D8] bg-white p-8 shadow-[0_16px_32px_rgba(27,43,60,0.10)]">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#B45309]">Reportes</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.035em]">Reportes retirados por ahora</h1>
        <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-[#526174]">
          Este apartado se dejó limpio porque todavía no hay reglas finales para reportes descargables. Los datos operativos por fecha ya se revisan desde Dashboard y Agenda.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/admin/dashboard" className="rounded-xl bg-[#0B86AD] px-5 py-3 font-black text-white">Ir al dashboard</Link>
          <Link href="/admin/agenda" className="rounded-xl border border-[#B8C9D8] px-5 py-3 font-black text-[#0B86AD]">Ver agenda</Link>
        </div>
      </section>
    </main>
  );
}
