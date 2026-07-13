"use client";

import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const statusLabels = {
  recibido: "Recibido",
  diagnostico: "En diagnóstico",
  en_reparacion: "En reparación",
  esperando_refaccion: "Esperando refacción",
  finalizado: "Listo para entrega",
  entregado: "Entregado",
};

const statusClasses = {
  recibido: "bg-[#E3F5FC] text-[#0077B6] border-[#A8DDF1]",
  diagnostico: "bg-[#FFF1E3] text-[#B45309] border-[#F0C391]",
  en_reparacion: "bg-[#E3F5FC] text-[#0077B6] border-[#A8DDF1]",
  esperando_refaccion: "bg-[#FFF7D8] text-[#8A6500] border-[#E4CA71]",
  finalizado: "bg-[#E8F8EF] text-[#15803D] border-[#B9E8CD]",
  entregado: "bg-[#E9F0F6] text-[#526174] border-[#C9D8E5]",
};

const lastMoveByStatus = {
  recibido: "Equipo registrado",
  diagnostico: "Revisión inicial",
  en_reparacion: "Trabajo en proceso",
  esperando_refaccion: "Espera pieza o autorización",
  finalizado: "Cliente por recoger",
  entregado: "Cerrado",
};

function StatusPill({ status }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${statusClasses[status] || statusClasses.recibido}`}>
      {statusLabels[status] || status}
    </span>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.43 2.13 11.88c0 1.74.46 3.43 1.33 4.92L2 22l5.34-1.4a9.92 9.92 0 0 0 4.7 1.2h.01c5.46 0 9.9-4.43 9.9-9.88C21.95 6.46 17.51 2 12.04 2Zm0 18.12h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.17.83.85-3.08-.2-.32a8.12 8.12 0 0 1-1.25-4.35c0-4.51 3.68-8.19 8.2-8.19a8.2 8.2 0 0 1 8.2 8.2c0 4.51-3.68 8.18-8.15 8.18Zm4.49-6.13c-.25-.12-1.46-.72-1.69-.8-.23-.09-.4-.12-.56.12-.16.24-.65.8-.79.96-.15.16-.29.18-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.45-1.37-1.7-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.25-.4.08-.16.04-.3-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.3-.23.24-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.16 1.7 2.6 4.13 3.65.58.25 1.03.4 1.38.51.58.18 1.1.16 1.51.1.46-.07 1.46-.6 1.67-1.17.21-.58.21-1.07.15-1.17-.06-.1-.23-.16-.48-.28Z" />
    </svg>
  );
}

async function openWhatsApp(folio) {
  try {
    const token = localStorage.getItem("clickcom_token");
    const response = await fetch(`${API_URL}/api/reparaciones/${folio}/whatsapp`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "No se pudo preparar WhatsApp");
    if (data.whatsappUrl) window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
  } catch (error) {
    alert(error.message || "No se pudo abrir WhatsApp. Revisa que el backend esté corriendo.");
  }
}

export default function RepairsManagementTable({ repairs }) {
  if (!repairs || repairs.length === 0) {
    return (
      <div className="rounded-[24px] border border-[#C9D8E5] bg-[#FFFFFF] p-12 text-center shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E3F5FC] text-[#0077B6]">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <p className="text-sm font-black text-[#102033]">No se encontraron reparaciones</p>
        <p className="mt-1 text-sm text-[#526174]">Intenta buscar por folio, cliente o equipo.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#C9D8E5] bg-[#FFFFFF] shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-3 border-b border-[#C9D8E5] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-xl font-black tracking-[-0.02em] text-[#102033]">Listado de reparaciones</h2>
          <p className="text-sm text-[#526174]">Consulta cada folio. Los entregados quedan cerrados; solo permiten comentarios internos o garantía.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#E3F5FC] px-3 py-1 text-xs font-black text-[#0077B6]">Todas</span>
          <span className="rounded-full bg-[#FFF3E7] px-3 py-1 text-xs font-black text-[#B45309]">Activas</span>
          <span className="rounded-full bg-[#EAFBF3] px-3 py-1 text-xs font-black text-[#15803D]">Listas</span>
          <span className="rounded-full bg-[#EEF2F6] px-3 py-1 text-xs font-black text-[#334155]">Cerradas</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px]">
          <thead className="bg-[#EEF5FA]">
            <tr>
              <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174] sm:px-6">Folio</th>
              <th className="px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174]">Cliente</th>
              <th className="px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174]">Equipo</th>
              <th className="px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174]">Fecha</th>
              <th className="px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174]">Recibió</th>
              <th className="px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174]">Estado</th>
              <th className="px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174]">Técnico</th>
              <th className="px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174]">Último avance</th>
              <th className="px-5 py-3 text-right text-[11px] font-black uppercase tracking-[0.12em] text-[#526174] sm:px-6">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {repairs.map((repair) => {
              const initials = String(repair.client || "CL")
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2);
              const isClosed = repair.status === "entregado";
              const lastMove = repair.lastMove || lastMoveByStatus[repair.status] || "Sin avance registrado";

              return (
                <tr key={repair.folio} className={`border-t border-[#C9D8E5] transition-colors ${isClosed ? "bg-[#F3F7FA]" : "hover:bg-[#E8F1F8]"}`}>
                  <td className="px-5 py-4 sm:px-6">
                    <Link href={`/admin/reparaciones/${repair.folio}?vista=ficha`} className="font-mono text-sm font-black text-[#0077B6] hover:text-[#FF9B3D]">
                      {repair.folio}
                    </Link>
                  </td>

                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xs font-black ${isClosed ? "bg-[#EEF2F6] text-[#526174]" : "bg-[#E3F5FC] text-[#0077B6]"}`}>
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#102033]">{repair.client}</p>
                        <p className="text-xs text-[#526174]">{repair.phone || "Sin teléfono"}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-4">
                    <p className="text-sm font-black text-[#102033]">{repair.device}</p>
                    <p className="text-xs text-[#526174]">{repair.deviceType}</p>
                  </td>

                  <td className="px-3 py-4 text-sm font-bold text-[#334155]">{repair.date}</td>
                  <td className="px-3 py-4 text-sm font-bold text-[#334155]">{repair.receivedBy || "Sin registrar"}</td>
                  <td className="px-3 py-4"><StatusPill status={repair.status} /></td>
                  <td className="px-3 py-4 text-sm font-bold text-[#334155]">{repair.tech}</td>
                  <td className="px-3 py-4">
                    <p className="text-sm font-bold text-[#102033]">{lastMove}</p>
                    <p className="text-xs text-[#6B7C90]">{isClosed ? "Folio cerrado" : "Disponible para actualizar"}</p>
                  </td>

                  <td className="px-5 py-4 text-right sm:px-6">
                    <div className="inline-flex items-center gap-1 rounded-2xl border border-[#C9D8E5] bg-[#EEF5FA] p-1">
                      <Link href={`/admin/reparaciones/${repair.folio}?vista=ficha`} className="rounded-xl px-3 py-2 text-xs font-black text-[#0077B6] transition hover:bg-[#E3F5FC]" title="Ver">
                        Ver
                      </Link>
                      {isClosed ? (
                        <Link href={`/admin/reparaciones/${repair.folio}?vista=actualizar`} className="rounded-xl px-3 py-2 text-xs font-black text-[#526174] transition hover:bg-white" title="Agregar comentario interno o garantía">
                          Comentario
                        </Link>
                      ) : (
                        <Link href={`/admin/reparaciones/${repair.folio}?vista=actualizar`} className="rounded-xl px-3 py-2 text-xs font-black text-[#B45309] transition hover:bg-[#FFF1E3]" title="Editar reparación">
                          Editar
                        </Link>
                      )}
                      <button type="button" onClick={() => openWhatsApp(repair.folio)} className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-black text-[#15803D] transition hover:bg-[#E8F8EF]" title="Enviar WhatsApp">
                        <WhatsAppIcon />
                        WhatsApp
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[#C9D8E5] px-5 py-3.5 sm:px-6">
        <p className="text-xs font-bold text-[#526174]">Mostrando {repairs.length} reparaciones</p>
        <p className="text-xs text-[#6B7C90]">Información guardada en el sistema</p>
      </div>
    </div>
  );
}

