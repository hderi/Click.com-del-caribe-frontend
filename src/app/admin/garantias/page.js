"use client";

import { getToken } from "@/lib/authStorage";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function authHeaders() {
  const token = typeof window !== "undefined" ? getToken() : "";
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function dateOnly(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function parseDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function addDays(value, days) {
  const parsed = parseDate(value);
  if (!parsed) return "";
  parsed.setDate(parsed.getDate() + Number(days || 0));
  return dateOnly(parsed.toISOString());
}

function formatDate(value) {
  const parsed = parseDate(value);
  if (!parsed) return "Sin fecha";
  return parsed.toLocaleDateString("es-MX", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function isWarrantyEnabled(repair) {
  const warranty = repair.garantia || {};
  const value = String(warranty.aplica || repair.garantiaAplica || "").trim().toLowerCase();
  const status = String(repair.estado || "").trim().toLowerCase();
  return status === "entregado" && (value.includes("si") || value.includes("sÃ­"));
}

function normalizeWarranty(repair) {
  const warranty = repair.garantia || {};
  const days = Number(warranty.dias || repair.diasGarantia || 0);
  const baseDate = repair.entregadoEn || repair.fechaEntrega || repair.actualizadoEn || repair.fechaIngreso || repair.creadoEn;
  const limitDate = days > 0 ? addDays(baseDate, days) : "";
  const today = dateOnly(new Date().toISOString());
  const expired = limitDate ? limitDate < today : false;

  return {
    folio: repair.folio || repair.id || "Sin folio",
    cliente: repair.cliente?.nombre || repair.clienteNombre || "Cliente sin nombre",
    telefono: repair.cliente?.telefono || repair.telefono || "Sin telefono",
    equipo: [repair.equipo?.marca, repair.equipo?.modelo].filter(Boolean).join(" ") || repair.equipoNombre || "Equipo sin modelo",
    estado: repair.estado || "Sin estado",
    inicio: baseDate,
    dias: days,
    vence: limitDate,
    nota: warranty.nota || warranty.notas || repair.notaGarantia || "",
    expired,
  };
}

export default function GarantiasPage() {
  const [repairs, setRepairs] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_URL}/api/reparaciones`, { headers: authHeaders() });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "No se pudieron cargar las garantias");
        if (!ignore) setRepairs(data.reparaciones || []);
      } catch (err) {
        if (!ignore) setError(err.message || "No se pudieron cargar las garantias.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const warranties = useMemo(() => repairs.filter(isWarrantyEnabled).map(normalizeWarranty), [repairs]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return warranties;
    return warranties.filter((item) =>
      [item.folio, item.cliente, item.telefono, item.equipo, item.estado, item.nota]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [warranties, query]);

  const activeCount = warranties.filter((item) => !item.expired).length;
  const expiredCount = warranties.filter((item) => item.expired).length;

  return (
    <main className="space-y-6 text-[#0A0A0A]" style={{ fontFamily: "var(--cc-font), Inter, Arial, sans-serif" }}>
      <section className="overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-white">
        <div className="flex flex-col gap-5 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF6B00]">Control de servicio</p>
            <h1 className="mt-1.5 text-[24px] font-bold tracking-[-0.02em] text-[#0A0A0A]">Garantias</h1>
            <p className="mt-2 text-[13px] font-semibold text-[#4B5563]">
              {loading ? "Cargando datos" : `${warranties.length} garantias registradas en el sistema.`}
            </p>
          </div>

          <label className="flex h-11 w-full max-w-[420px] items-center gap-3 rounded-[6px] border border-[#D1D5DB] bg-white px-4">
            <span className="text-[15px] text-[#8A8A8A]">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar folio, cliente, telefono o equipo..."
              className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-[#111827] outline-none placeholder:text-[#8A8A8A]"
            />
          </label>
        </div>

        <div className="grid border-t border-[#E5E7EB] bg-white sm:grid-cols-3">
          <SummaryCell label="Garantias" note="Registradas" value={warranties.length} color="#0055FF" />
          <SummaryCell label="Vigentes" note="Dentro del periodo" value={activeCount} color="#16854E" />
          <SummaryCell label="Vencidas" note="Revisar condiciones" value={expiredCount} color="#C55A11" />
        </div>
      </section>

      {error ? <div className="rounded-[6px] border border-[#F4B7B7] bg-[#FFF5F5] p-4 text-sm font-bold text-[#B42318]">{error}</div> : null}

      <section className="overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-white">
        <div className="border-b border-[#E5E7EB] px-5 py-4">
          <h2 className="text-[18px] font-bold tracking-[-0.01em] text-[#0A0A0A]">Listado de garantias</h2>
          <p className="mt-1 text-[13px] text-[#6B7280]">Consulta las reparaciones con garantia sin crear folios nuevos ni afectar el historial.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead className="bg-[#F8FAFC]">
              <tr>
                <Th>Folio</Th>
                <Th>Cliente</Th>
                <Th>Equipo</Th>
                <Th>Inicio</Th>
                <Th>Dias</Th>
                <Th>Vence</Th>
                <Th>Estado</Th>
                <Th>Accion</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.folio} className="border-t border-[#E5E7EB] transition hover:bg-[#F8FAFC]">
                  <td className="px-5 py-4 font-mono text-sm font-bold text-[#0077B6]">{item.folio}</td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-bold text-[#111827]">{item.cliente}</p>
                    <p className="mt-0.5 text-xs font-medium text-[#6B7280]">{item.telefono}</p>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-[#334155]">{item.equipo}</td>
                  <td className="px-4 py-4 text-sm font-bold text-[#334155]">{formatDate(item.inicio)}</td>
                  <td className="px-4 py-4 text-sm font-bold text-[#334155]">{item.dias || "-"}</td>
                  <td className="px-4 py-4 text-sm font-bold text-[#334155]">{formatDate(item.vence)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${item.expired ? "border-[#F5C58B] bg-[#FFF5E8] text-[#A14E00]" : "border-[#A8DDC0] bg-[#F0FAF4] text-[#13753A]"}`}>
                      {item.expired ? "Vencida" : "Vigente"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/reparaciones/${encodeURIComponent(item.folio)}#garantia`}
                      className="inline-flex h-9 items-center rounded-[6px] border border-[#B7D7F3] bg-[#F2F8FD] px-4 text-[13px] font-bold text-[#0077B6] transition hover:border-[#0077B6]"
                    >
                      Ver garantia
                    </Link>
                  </td>
                </tr>
              ))}

              {!loading && !filtered.length ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-sm font-bold text-[#6B7280]">
                    No hay garantias para mostrar.
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

function SummaryCell({ label, note, value, color }) {
  return (
    <div className="flex min-h-[86px] items-center justify-between gap-4 border-b border-[#E5E7EB] px-5 py-4 sm:border-r sm:last:border-r-0">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6B7280]">{label}</p>
        <p className="mt-2 text-[13px] font-medium text-[#6B7280]">{note}</p>
      </div>
      <p className="text-[24px] font-bold leading-none" style={{ color }}>{value}</p>
    </div>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-[0.13em] text-[#526174]">{children}</th>;
}
