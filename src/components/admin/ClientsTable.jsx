"use client";

import Link from "next/link";

function ClientTypeBadge({ type }) {
  const isCompany = type === "Empresa";
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${isCompany ? "border-[#F0C391] bg-[#FFF1E3] text-[#B45309]" : "border-[#A8DDF1] bg-[#E3F5FC] text-[#0077B6]"}`}>
      {type}
    </span>
  );
}

function StatusBadge({ active }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${active ? "border-[#B9E8CD] bg-[#E8F8EF] text-[#15803D]" : "border-[#C9D8E5] bg-[#EEF2F6] text-[#526174]"}`}>
      {active ? "Con equipo activo" : "Sin equipo activo"}
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

function whatsappHref(client) {
  const rawPhone = String(client.phone || "").replace(/\D/g, "");
  if (!rawPhone) return "";
  const phone = rawPhone.length === 10 ? `52${rawPhone}` : rawPhone;
  const message = `Hola ${client.name || ""}, le escribimos de CLICK.COM del Caribe sobre su servicio.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export default function ClientsTable({ clients, loading = false, onNewClient }) {
  if (loading) {
    return (
      <div className="rounded-[24px] border border-[#C9D8E5] bg-white p-12 text-center shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
        <p className="text-sm font-black text-[#102033]">Cargando clientes...</p>
      </div>
    );
  }

  if (!clients || clients.length === 0) {
    return (
      <div className="rounded-[24px] border border-[#C9D8E5] bg-white p-12 text-center shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E3F5FC] text-[#0077B6]">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.1 9.1 0 0 0 3.74-2.03 3.75 3.75 0 0 0-6.66-2.42M15 11.25a3 3 0 1 0-6 0 3 3 0 0 0 6 0ZM4.5 19.5a6.75 6.75 0 0 1 13.5 0" />
          </svg>
        </div>
        <p className="text-base font-black text-[#102033]">Aún no hay clientes registrados</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#526174]">
          Aquí aparecerán los clientes cuando los des de alta manualmente o cuando se cree una nueva reparación con sus datos.
        </p>
        <button type="button" onClick={onNewClient} className="mt-5 rounded-2xl bg-[#FF7A00] px-5 py-3 text-sm font-black text-white shadow-[0_12px_24px_rgba(255,122,0,0.22)] hover:bg-[#E66A00]">
          Dar de alta cliente
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#C9D8E5] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-2 border-b border-[#C9D8E5] px-5 py-4 sm:px-6">
        <h2 className="text-xl font-black tracking-[-0.02em] text-[#102033]">Listado de clientes</h2>
        <p className="text-sm text-[#526174]">Consulta clientes reales y reutiliza su historial cuando vuelvan al taller.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px]">
          <thead className="bg-[#EEF5FA]">
            <tr>
              <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174] sm:px-6">Cliente</th>
              <th className="px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174]">Contacto</th>
              <th className="px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174]">Tipo</th>
              <th className="px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174]">Reparaciones</th>
              <th className="px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174]">Última visita</th>
              <th className="px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174]">Estado</th>
              <th className="px-5 py-3 text-right text-[11px] font-black uppercase tracking-[0.12em] text-[#526174] sm:px-6">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const initials = String(client.name || "CL").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
              return (
                <tr key={client.id} className="border-t border-[#C9D8E5] transition-colors hover:bg-[#E8F1F8]">
                  <td className="px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#E3F5FC] text-xs font-black text-[#0077B6]">{initials}</div>
                      <div>
                        <Link href={`/admin/clientes/${client.id}`} className="text-sm font-black text-[#102033] hover:text-[#0077B6]">{client.name}</Link>
                        <p className="text-xs text-[#526174]">{client.note}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4"><p className="text-sm font-bold text-[#334155]">{client.phone}</p><p className="text-xs text-[#526174]">{client.email || "Sin correo"}</p></td>
                  <td className="px-3 py-4"><ClientTypeBadge type={client.type} /></td>
                  <td className="px-3 py-4"><p className="text-sm font-black text-[#102033]">{client.repairs}</p><p className="text-xs text-[#526174]">{client.equipment} equipos registrados</p></td>
                  <td className="px-3 py-4 text-sm font-bold text-[#334155]">{client.lastVisit}</td>
                  <td className="px-3 py-4"><StatusBadge active={client.active} /></td>
                  <td className="px-5 py-4 text-right sm:px-6">
                    <div className="inline-flex items-center gap-1 rounded-2xl border border-[#C9D8E5] bg-[#EEF5FA] p-1">
                      <Link href={`/admin/clientes/${client.id}`} className="rounded-xl px-4 py-2 text-xs font-black text-[#0077B6] transition hover:bg-[#E3F5FC]">Ver ficha</Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[#C9D8E5] px-5 py-3.5 sm:px-6">
        <p className="text-xs font-bold text-[#526174]">Mostrando {clients.length} clientes</p>
        <p className="text-xs text-[#6B7C90]">Datos guardados en el sistema local</p>
      </div>
    </div>
  );
}

