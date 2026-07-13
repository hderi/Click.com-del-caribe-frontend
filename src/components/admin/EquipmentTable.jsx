"use client";

import Link from "next/link";

function EquipmentIcon({ type }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#E3F5FC] text-[#0077B6]">
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        {type === "Impresora" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V2.25h12V9M6 18H4.5A2.25 2.25 0 012.25 15.75v-4.5A2.25 2.25 0 014.5 9h15a2.25 2.25 0 012.25 2.25v4.5A2.25 2.25 0 0119.5 18H18m-12 0v3.75h12V18M7.5 13.5h.008v.008H7.5V13.5z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
        )}
      </svg>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "En taller": "border-[#A8DDF1] bg-[#E3F5FC] text-[#0077B6]",
    "En reparación": "border-[#A8DDF1] bg-[#E3F5FC] text-[#0077B6]",
    "Sin reparación activa": "border-[#C9D8E5] bg-[#EEF2F6] text-[#526174]",
    Entregado: "border-[#B9E8CD] bg-[#E8F8EF] text-[#15803D]",
  };

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${styles[status] || styles["Sin reparación activa"]}`}>
      {status}
    </span>
  );
}

export default function EquipmentTable({ equipment, loading = false }) {
  if (loading) {
    return (
      <div className="rounded-[24px] border border-[#C9D8E5] bg-white p-12 text-center shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
        <p className="text-sm font-black text-[#102033]">Cargando equipos...</p>
      </div>
    );
  }

  if (!equipment || equipment.length === 0) {
    return (
      <div className="rounded-[24px] border border-[#C9D8E5] bg-white p-12 text-center shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
        <p className="text-base font-black text-[#102033]">Aún no hay equipos registrados</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#526174]">Aquí aparecerán los equipos cuando registres una reparación o captures un dispositivo manualmente.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#C9D8E5] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-2 border-b border-[#C9D8E5] px-5 py-4 sm:px-6">
        <h2 className="text-xl font-black tracking-[-0.02em] text-[#102033]">Listado de equipos</h2>
        <p className="text-sm text-[#526174]">El equipo guarda su propio historial aunque cambie de reparación o vuelva al taller meses después.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <thead className="bg-[#EEF5FA]">
            <tr>
              <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174] sm:px-6">Equipo</th>
              <th className="px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174]">Serie</th>
              <th className="px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174]">Cliente</th>
              <th className="px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174]">Estado</th>
              <th className="px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174]">Reparaciones</th>
              <th className="px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174]">Última atención</th>
              <th className="px-5 py-3 text-right text-[11px] font-black uppercase tracking-[0.12em] text-[#526174] sm:px-6">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((item) => (
              <tr key={item.id} className="border-t border-[#C9D8E5] transition-colors hover:bg-[#E8F1F8]">
                <td className="px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <EquipmentIcon type={item.type} />
                    <div>
                      <Link href={`/admin/equipos/${encodeURIComponent(item.id)}`} className="text-sm font-black text-[#102033] hover:text-[#0077B6]">{item.brand} {item.model}</Link>
                      <p className="text-xs font-bold text-[#526174]">{item.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4">
                  <p className="text-sm font-black text-[#334155]">{item.serial}</p>
                  <p className="text-xs text-[#526174]">{item.tag}</p>
                </td>
                <td className="px-3 py-4">
                  <p className="text-sm font-black text-[#102033]">{item.client}</p>
                  <p className="text-xs text-[#526174]">{item.phone}</p>
                </td>
                <td className="px-3 py-4"><StatusBadge status={item.status} /></td>
                <td className="px-3 py-4">
                  <p className="text-sm font-black text-[#102033]">{item.repairs}</p>
                  {item.currentFolio ? <p className="text-xs text-[#526174]">Folio activo: {item.currentFolio}</p> : null}
                </td>
                <td className="px-3 py-4 text-sm font-bold text-[#334155]">{item.lastService && item.lastService !== "Sin historial" ? item.lastService : "—"}</td>
                <td className="px-5 py-4 text-right sm:px-6">
                  <div className="inline-flex items-center gap-1 rounded-2xl border border-[#C9D8E5] bg-[#EEF5FA] p-1">
                    <Link href={`/admin/equipos/${encodeURIComponent(item.id)}`} className="rounded-xl px-3 py-2 text-xs font-black text-[#0077B6] transition hover:bg-[#E3F5FC]">Ficha</Link>
                    <Link href={`/admin/equipos/${encodeURIComponent(item.id)}#historial`} className="rounded-xl px-3 py-2 text-xs font-black text-[#526174] transition hover:bg-white">Historial</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[#C9D8E5] px-5 py-3.5 sm:px-6">
        <p className="text-xs font-bold text-[#526174]">Mostrando {equipment.length} equipos</p>
        <p className="text-xs text-[#6B7C90]">Datos guardados en el sistema local</p>
      </div>
    </div>
  );
}
