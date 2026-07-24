"use client";

import { useState } from "react";
import Link from "next/link";
import { getToken } from "@/lib/authStorage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const statusLabels = {
  recibido: "Recibido",
  diagnostico: "En diagnostico",
  en_reparacion: "En reparacion",
  esperando_refaccion: "Esperando refaccion",
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
  diagnostico: "Revision inicial",
  en_reparacion: "Trabajo en proceso",
  esperando_refaccion: "Espera pieza o autorizacion",
  finalizado: "Cliente por recoger",
  entregado: "Cerrado",
};

const CLOSED_STATUSES = new Set(["entregado"]);

function StatusPill({ status }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${statusClasses[status] || statusClasses.recibido}`}>
      {statusLabels[status] || status}
    </span>
  );
}

async function getMessage(folio, type) {
  const token = typeof window !== "undefined" ? getToken() : "";
  const res = await fetch(`${API_URL}/api/reparaciones/${folio}/${type}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "No se pudo preparar el mensaje");
  return data;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function WhatsAppIcon() {
  return (
    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.43 2.13 11.88c0 1.74.46 3.43 1.33 4.92L2 22l5.34-1.4a9.92 9.92 0 0 0 4.7 1.2h.01c5.46 0 9.9-4.43 9.9-9.88C21.95 6.46 17.51 2 12.04 2Zm0 18.12h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.17.83.85-3.08-.2-.32a8.12 8.12 0 0 1-1.25-4.35c0-4.51 3.68-8.19 8.2-8.19a8.2 8.2 0 0 1 8.2 8.2c0 4.51-3.68 8.18-8.15 8.18Zm4.49-6.13c-.25-.12-1.46-.72-1.69-.8-.23-.09-.4-.12-.56.12-.16.24-.65.8-.79.96-.15.16-.29.18-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.45-1.37-1.7-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.25-.4.08-.16.04-.3-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.3-.23.24-.85.83-.85 2.02 0 1.19.87 2.34.99 2.5.12.16 1.7 2.6 4.13 3.65.58.25 1.03.4 1.38.51.58.18 1.1.16 1.51.1.46-.07 1.46-.6 1.67-1.17.21-.58.21-1.07.15-1.17-.06-.1-.23-.16-.48-.28Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5A2.25 2.25 0 0 1 19.5 19.5h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  );
}

export default function RepairsManagementTable({ repairs, statusFilter = "todos", onStatusFilterChange = () => {}, statusOptions = [] }) {
  const [openDocsMenu, setOpenDocsMenu] = useState("");
  const [uploadingReceipt, setUploadingReceipt] = useState("");

  async function openMessage(folio, type) {
    try {
      const data = await getMessage(folio, type);
      const url = type === "whatsapp" ? data.whatsappUrl : data.mailtoUrl;
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      alert(err.message || "No se pudo abrir el mensaje");
    }
  }

  async function uploadSignedReceipt(repair, event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploadingReceipt(repair.folio);
    try {
      const dataUrl = await fileToDataUrl(file);
      const token = getToken();
      const response = await fetch(`${API_URL}/api/reparaciones/${encodeURIComponent(repair.folio)}/recibo-firmado`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          reciboFirmado: {
            nombre: file.name,
            name: file.name,
            size: file.size,
            lastModified: file.lastModified,
            dataUrl,
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo subir el recibo firmado");
      alert("Recibo firmado guardado.");
      window.location.reload();
    } catch (err) {
      alert(err.message || "No se pudo subir el recibo firmado");
    } finally {
      setUploadingReceipt("");
      setOpenDocsMenu("");
    }
  }

  return (
    <div className="overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-[#FFFFFF]">
      <div className="flex flex-col gap-4 border-b border-[#E5E7EB] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-[18px] font-bold tracking-[-0.01em] text-[#0A0A0A]">Reparaciones</h2>
        </div>

        <label className="flex w-full max-w-[260px] items-center gap-3 rounded-[6px] border border-[#D1D5DB] bg-white px-3 py-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8A8A8A]">Vista</span>
          <select
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value)}
            className="h-8 min-w-0 flex-1 bg-transparent text-[13px] font-bold text-[#111827] outline-none"
          >
            <option value="todos">Todos</option>
            {statusOptions.map((item) => (
              <option key={item.status} value={item.status}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px]">
          <thead className="bg-[#F8FAFC]">
            <tr>
              <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174] sm:px-6">Folio</th>
              <th className="px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174]">Cliente</th>
              <th className="px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174]">Equipo</th>
              <th className="px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174]">Fecha</th>
              <th className="px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174]">Recibio</th>
              <th className="px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174]">Estado</th>
              <th className="px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174]">Tecnico</th>
              <th className="px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.12em] text-[#526174]">Actualizar</th>
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
              const isClosed = CLOSED_STATUSES.has(repair.status);
              const lastMove = repair.lastMove || lastMoveByStatus[repair.status] || "Sin avance registrado";

              return (
                <tr key={repair.folio} className={`border-t border-[#E5E7EB] transition-colors ${isClosed ? "bg-[#F3F7FA]" : "hover:bg-[#F8FAFC]"}`}>
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
                        <p className="text-xs text-[#526174]">{repair.phone || "Sin telefono"}</p>
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
                    {isClosed ? (
                      <>
                        <p className="text-sm font-bold text-[#102033]">{lastMove}</p>
                        <p className="text-xs text-[#6B7C90]">Folio cerrado</p>
                      </>
                    ) : (
                      <Link
                        href={`/admin/reparaciones/${repair.folio}?vista=actualizar`}
                        className="inline-flex h-9 items-center rounded-[6px] border border-[#B7D7F3] bg-[#F2F8FD] px-4 text-[13px] font-black text-[#0077B6] transition hover:border-[#0077B6] hover:bg-[#E3F5FC]"
                      >
                        Actualizar
                      </Link>
                    )}
                  </td>

                  <td className="px-5 py-4 text-right sm:px-6">
                    <div className="relative inline-flex items-center gap-1 rounded-[6px] border border-[#DDE5EE] bg-white p-1">
                      <Link href={`/admin/reparaciones/${repair.folio}?vista=ficha`} className="rounded-xl px-3 py-2 text-xs font-black text-[#0077B6] transition hover:bg-[#E3F5FC]" title="Ver ficha">
                        Ver
                      </Link>
                      <button
                        type="button"
                        onClick={() => setOpenDocsMenu((current) => current === repair.folio ? "" : repair.folio)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#DDE5EE] text-base font-black text-[#0F172A] transition hover:border-[#0077B6] hover:bg-[#F8FAFC]"
                        aria-label={`Documentos de ${repair.folio}`}
                        title="Documentos"
                      >
                        +
                      </button>

                      {openDocsMenu === repair.folio ? (
                        <div className="absolute right-0 top-11 z-20 w-[230px] overflow-hidden rounded-[6px] border border-[#DDE5EE] bg-white text-left shadow-[0_16px_32px_rgba(15,23,42,0.12)]">
                          <div className="border-b border-[#E5E7EB] px-3 py-2">
                            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#64748B]">Documentos</p>
                          </div>
                          <Link className="block px-3 py-2 text-sm font-bold text-[#0F172A] hover:bg-[#F8FAFC]" href={`/admin/reparaciones/${repair.folio}/recibo`} onClick={() => setOpenDocsMenu("")}>
                            Ver recibo
                          </Link>
                          <Link className="block px-3 py-2 text-sm font-bold text-[#0F172A] hover:bg-[#F8FAFC]" href={`/admin/reparaciones/${repair.folio}/recibo-digital`} onClick={() => setOpenDocsMenu("")}>
                            Descargar PDF
                          </Link>
                          <label className="block cursor-pointer px-3 py-2 text-sm font-bold text-[#0F172A] hover:bg-[#F8FAFC]">
                            {uploadingReceipt === repair.folio ? "Subiendo..." : "Subir recibo firmado"}
                            <input type="file" accept="image/*" className="hidden" onChange={(event) => uploadSignedReceipt(repair, event)} />
                          </label>
                          {repair.signedReceiptUrl ? (
                            <a className="block px-3 py-2 text-sm font-bold text-[#0F172A] hover:bg-[#F8FAFC]" href={repair.signedReceiptUrl} target="_blank" rel="noreferrer" onClick={() => setOpenDocsMenu("")}>
                              Ver recibo firmado
                            </a>
                          ) : null}
                          <div className="border-t border-[#E5E7EB] px-3 py-2">
                            <p className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#64748B]">Comunicacion</p>
                            <div className="flex items-center gap-2">
                              <button type="button" onClick={() => { setOpenDocsMenu(""); openMessage(repair.folio, "whatsapp"); }} className="inline-flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#BBF7D0] bg-white text-[#008A36] transition hover:bg-[#F0FDF4]" title="Enviar WhatsApp" aria-label="Enviar WhatsApp">
                                <WhatsAppIcon />
                              </button>
                              <button type="button" onClick={() => { setOpenDocsMenu(""); openMessage(repair.folio, "email"); }} className="inline-flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#BFDBFE] bg-white text-[#0077B6] transition hover:bg-[#EFF6FF]" title="Enviar correo" aria-label="Enviar correo">
                                <MailIcon />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
            {(!repairs || repairs.length === 0) ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E3F5FC] text-[#0077B6]">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>
                  <p className="text-sm font-black text-[#102033]">No se encontraron reparaciones</p>
                  <p className="mt-1 text-sm text-[#526174]">Intenta cambiar la vista o buscar por folio, cliente o equipo.</p>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[#E5E7EB] px-5 py-3.5 sm:px-6">
        <p className="text-xs font-bold text-[#526174]">Mostrando {repairs.length} reparaciones</p>
        <p className="text-xs text-[#6B7C90]">Informacion guardada en el sistema</p>
      </div>
    </div>
  );
}

function IconAction({ title, color, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className="inline-flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#DDE5EE] bg-white transition hover:border-[#0B79D0]"
      style={{ color }}
    >
      {children}
    </button>
  );
}
