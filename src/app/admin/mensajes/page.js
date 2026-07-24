"use client";

import { getToken } from "@/lib/authStorage";
import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function authHeaders() {
  const token = typeof window !== "undefined" ? getToken() : "";
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function isActiveOrder(order) {
  return Boolean(order.linkActivo) && !["finalizado", "entregado"].includes(String(order.estado || "").toLowerCase());
}

function getMessageState(order) {
  const estado = String(order.estado || "").toLowerCase();
  if (estado === "finalizado" && order.linkActivo) return "pendiente";
  if (isActiveOrder(order)) return "activo";
  return "cerrado";
}

async function getMessage(folio, type) {
  const res = await fetch(`${API_URL}/api/reparaciones/${folio}/${type}`, {
    method: "POST",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "No se pudo preparar el mensaje");
  return data;
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

export default function MensajesPage() {
  const [reparaciones, setReparaciones] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadOrders() {
      try {
        const res = await fetch(`${API_URL}/api/reparaciones`, { headers: authHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "No se pudieron cargar ordenes");
        if (!ignore) setReparaciones(data.reparaciones || []);
      } catch (err) {
        if (!ignore) setError(err.message);
      }
    }

    loadOrders();
    return () => {
      ignore = true;
    };
  }, []);

  const stats = useMemo(() => {
    const pendientes = reparaciones.filter((item) => item.estado === "finalizado" && item.linkActivo).length;
    const activos = reparaciones.filter(isActiveOrder).length;
    const cerrados = reparaciones.filter((item) => getMessageState(item) === "cerrado").length;
    return { pendientes, activos, cerrados, ordenes: reparaciones.length };
  }, [reparaciones]);

  const filteredReparaciones = useMemo(() => {
    const term = search.trim().toLowerCase();

    return reparaciones.filter((order) => {
      const messageState = getMessageState(order);
      if (statusFilter !== "todos" && messageState !== statusFilter) return false;
      if (!term) return true;

      const values = [
        order.folio,
        order.estado,
        messageState,
        order.cliente?.nombre,
        order.cliente?.telefono,
        order.cliente?.correo,
      ];

      return values.some((value) => String(value || "").toLowerCase().includes(term));
    });
  }, [reparaciones, search, statusFilter]);

  async function abrir(folio, type) {
    try {
      const data = await getMessage(folio, type);
      const url = type === "whatsapp" ? data.whatsappUrl : data.mailtoUrl;
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="space-y-5 text-[#0A0A0A]" style={{ fontFamily: "var(--cc-font), Inter, Arial, sans-serif" }}>
      {error && (
        <div className="rounded-[6px] border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      <section className="grid overflow-hidden rounded-[6px] border-y border-[#E5E7EB] bg-white sm:grid-cols-2 xl:grid-cols-4">
        <Card title="Pendientes" value={stats.pendientes} note="Listas para notificar" color="#B45309" />
        <Card title="Activos" value={stats.activos} note="Procesos abiertos" color="#0B79D0" />
        <Card title="Cerrados" value={stats.cerrados} note="Sin enlace activo" color="#64748B" />
        <Card title="Ordenes" value={stats.ordenes} note="En sistema" color="#15803D" />
      </section>

      <section className="overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-white">
        <div className="flex flex-col gap-4 border-b border-[#E5E7EB] px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-[20px] font-bold tracking-[-0.01em] text-[#0A0A0A]">Ordenes</h2>
            <p className="mt-1 text-[13px] leading-5 text-[#6B7280]">
              WhatsApp y correo solo estan disponibles mientras el proceso este activo.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 md:max-w-[640px] md:flex-row md:items-center md:justify-end">
            <div className="inline-flex rounded-[6px] border border-[#D1D5DB] bg-white p-1">
              <FilterButton active={statusFilter === "todos"} onClick={() => setStatusFilter("todos")}>Todos</FilterButton>
              <FilterButton active={statusFilter === "pendiente"} onClick={() => setStatusFilter("pendiente")}>Pendientes</FilterButton>
              <FilterButton active={statusFilter === "activo"} onClick={() => setStatusFilter("activo")}>Activos</FilterButton>
              <FilterButton active={statusFilter === "cerrado"} onClick={() => setStatusFilter("cerrado")}>Cerrados</FilterButton>
            </div>

            <label className="relative w-full md:max-w-[340px]">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" aria-hidden="true">
                <SearchIcon />
              </span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar folio, cliente, telefono o correo..."
                className="h-11 w-full rounded-[6px] border border-[#D1D5DB] bg-white pl-10 pr-3 text-[14px] font-medium text-[#0A0A0A] outline-none transition focus:border-[#0055FF] placeholder:text-[#8A8A8A]"
              />
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead className="bg-[#F8FAFC] text-left">
              <tr>
                <Th>Folio</Th>
                <Th>Cliente</Th>
                <Th>Telefono</Th>
                <Th>Correo</Th>
                <Th>Estado</Th>
                <Th>Accion</Th>
              </tr>
            </thead>
            <tbody>
              {filteredReparaciones.map((order) => {
                const messageState = getMessageState(order);
                const active = messageState !== "cerrado";
                return (
                  <tr key={order.folio} className={`border-t border-[#E5E7EB] ${active ? "hover:bg-[#F8FAFC]" : "bg-[#F8FAFC]"}`}>
                    <td className="px-4 py-4 font-mono text-sm font-bold text-[#0B79D0]">{order.folio}</td>
                    <td className="px-4 py-4 font-bold text-[#102033]">{order.cliente?.nombre || "Sin cliente"}</td>
                    <td className="px-4 py-4 text-sm text-[#334155]">{order.cliente?.telefono || "Sin telefono"}</td>
                    <td className="px-4 py-4 text-sm text-[#334155]">{order.cliente?.correo || "Sin correo"}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-bold ${messageState === "activo" ? "border-[#B7D8F7] bg-[#EAF4FF] text-[#0B79D0]" : messageState === "pendiente" ? "border-[#FED7AA] bg-[#FFF7ED] text-[#B45309]" : "border-[#D5DEE8] bg-[#EEF2F6] text-[#64748B]"}`}>
                        {messageState === "activo" ? "Activo" : messageState === "pendiente" ? "Pendiente" : "Cerrado"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {active ? (
                        <div className="inline-flex items-center gap-1 rounded-md border border-[#DDE5EE] bg-white p-1">
                          <IconAction title="Enviar WhatsApp" color="#15803D" onClick={() => abrir(order.folio, "whatsapp")}>
                            <WhatsAppIcon />
                          </IconAction>
                          <IconAction title="Enviar correo" color="#0B79D0" onClick={() => abrir(order.folio, "email")}>
                            <MailIcon />
                          </IconAction>
                        </div>
                      ) : (
                        <div className="rounded-md border border-[#DDE5EE] bg-white px-3 py-2">
                          <p className="text-xs font-bold text-[#64748B]">Orden cerrada</p>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {!filteredReparaciones.length ? (
                <tr>
                  <td className="px-4 py-8 text-center text-sm font-semibold text-[#6B7280]" colSpan={6}>
                    No se encontraron ordenes con esa busqueda.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function Card({ title, value, note, color }) {
  return (
    <article className="border-b border-[#E5E7EB] px-8 py-7 md:border-b-0 md:border-r md:last:border-r-0">
      <p className="text-[13px] font-bold text-[#0A0A0A]">{title}</p>
      <p className="mt-4 text-[38px] font-bold leading-none" style={{ color }}>{value}</p>
      <p className="mt-3 text-[12px] font-bold uppercase tracking-[0.02em] text-[#6B7280]">{note}</p>
    </article>
  );
}

function IconAction({ title, color, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#DDE5EE] bg-white transition hover:border-[#0B79D0]"
      style={{ color }}
    >
      {children}
    </button>
  );
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 rounded-[4px] px-3 text-[13px] font-bold transition ${
        active ? "bg-[#0055FF] text-white" : "text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#0A0A0A]"
      }`}
    >
      {children}
    </button>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.13em] text-[#4B5563]">{children}</th>;
}

function SearchIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
    </svg>
  );
}
