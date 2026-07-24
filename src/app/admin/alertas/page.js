"use client";

import { getToken } from "@/lib/authStorage";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const CLOSED_STATUS = new Set(["entregado", "cerrado"]);
const READY_STATUS = new Set(["finalizado", "listo"]);

const VIEW_OPTIONS = [
  { value: "rango", label: "Agenda del rango" },
  { value: "hoy", label: "Para hoy" },
  { value: "vencidas", label: "Vencidas" },
  { value: "sinMovimiento", label: "Sin movimiento" },
  { value: "sinRecoger", label: "Sin recoger" },
];

const statusLabels = {
  recibido: "Recibido",
  diagnostico: "En diagnostico",
  en_reparacion: "En reparacion",
  esperando_refaccion: "Esperando refaccion",
  finalizado: "Listo",
  entregado: "Entregado",
};

const statusClasses = {
  recibido: "border-[#B7D7F3] bg-[#F2F8FD] text-[#0B6FAE]",
  diagnostico: "border-[#F4D598] bg-[#FFF8EA] text-[#94610A]",
  en_reparacion: "border-[#B7D7F3] bg-[#F2F8FD] text-[#0B6FAE]",
  esperando_refaccion: "border-[#F5C58B] bg-[#FFF5E8] text-[#A14E00]",
  finalizado: "border-[#A8DDC0] bg-[#F0FAF4] text-[#13753A]",
  entregado: "border-[#CDD5E1] bg-[#F7F9FC] text-[#475569]",
};

function authHeaders() {
  const token = typeof window !== "undefined" ? getToken() : "";
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function dateOnly(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function monthStart() {
  const d = new Date();
  d.setDate(1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function monthEnd() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1, 0);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function daysBetween(a, b) {
  return Math.floor((a.getTime() - b.getTime()) / 86400000);
}

function clientName(item) {
  return item.cliente?.nombre || item.clienteNombre || "Cliente sin nombre";
}

function clientPhone(item) {
  return item.cliente?.telefono || item.telefono || "Sin telefono";
}

function equipmentName(item) {
  return [item.equipo?.marca, item.equipo?.modelo].filter(Boolean).join(" ") || item.equipoNombre || "Equipo sin modelo";
}

export default function AlertasPage() {
  const [reparaciones, setReparaciones] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("rango");
  const [inicio, setInicio] = useState(monthStart());
  const [fin, setFin] = useState(monthEnd());

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_URL}/api/reparaciones`, { headers: authHeaders() });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "No se pudo cargar agenda y recordatorios");
        if (!ignore) setReparaciones(data.reparaciones || []);
      } catch (err) {
        if (!ignore) setError(err.message || "No se pudieron cargar los datos.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const data = useMemo(() => {
    const now = new Date();
    const todayValue = today();
    const abiertas = reparaciones.filter((item) => !CLOSED_STATUS.has(String(item.estado || "").toLowerCase()));
    const enRango = reparaciones.filter((item) => {
      const fecha = dateOnly(item.fechaEntregaEstimada || item.fechaIngreso || item.creadoEn);
      return fecha && (!inicio || fecha >= inicio) && (!fin || fecha <= fin);
    });
    const paraHoy = reparaciones.filter((item) => dateOnly(item.fechaEntregaEstimada) === todayValue);
    const vencidas = abiertas.filter((item) => {
      const fecha = dateOnly(item.fechaEntregaEstimada);
      return fecha && fecha < todayValue;
    });
    const sinMovimiento = abiertas.filter((item) => {
      const historial = Array.isArray(item.historial) ? item.historial : [];
      const last = historial[historial.length - 1]?.fecha || item.actualizadoEn || item.creadoEn || item.fechaIngreso;
      const date = parseDate(last);
      return date ? daysBetween(now, date) > 3 : false;
    });
    const sinRecoger = reparaciones.filter((item) => READY_STATUS.has(String(item.estado || "").toLowerCase()));

    return { enRango, paraHoy, vencidas, sinMovimiento, sinRecoger };
  }, [reparaciones, inicio, fin]);

  const current = {
    rango: data.enRango,
    hoy: data.paraHoy,
    vencidas: data.vencidas,
    sinMovimiento: data.sinMovimiento,
    sinRecoger: data.sinRecoger,
  }[view] || data.enRango;

  return (
    <main className="space-y-5 text-[#0A0A0A]" style={{ fontFamily: "var(--cc-font), Inter, Arial, sans-serif" }}>
      <section className="overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-white">
        <div className="flex flex-col gap-5 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF6B00]">Operacion del taller</p>
            <h1 className="mt-1.5 text-[24px] font-bold tracking-[-0.02em] text-[#0A0A0A]">Agenda y recordatorios</h1>
            <p className="mt-2 text-[13px] font-semibold text-[#4B5563]">
              {loading ? "Cargando datos" : `${reparaciones.length} ordenes registradas en el sistema.`}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <DateField label="Desde" value={inicio} onChange={(event) => setInicio(event.target.value)} />
            <DateField label="Hasta" value={fin} onChange={(event) => setFin(event.target.value)} />
            <button
              type="button"
              onClick={() => {
                setInicio(monthStart());
                setFin(monthEnd());
                setView("rango");
              }}
              className="self-end rounded-[6px] border border-[#0055FF] bg-[#0055FF] px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#0047D8]"
            >
              Este mes
            </button>
          </div>
        </div>

        <div className="border-t border-[#E5E7EB] bg-white">
          <div className="grid overflow-hidden sm:grid-cols-2 lg:grid-cols-5">
            <SummaryCell label="En rango" note="Periodo elegido" value={data.enRango.length} color="#0055FF" />
            <SummaryCell label="Para hoy" note="Entrega estimada" value={data.paraHoy.length} color="#0B86AD" />
            <SummaryCell label="Vencidas" note="Revisar atraso" value={data.vencidas.length} color="#C55A11" />
            <SummaryCell label="Sin movimiento" note="Mas de 3 dias" value={data.sinMovimiento.length} color="#B45309" />
            <SummaryCell label="Sin recoger" note="Listas" value={data.sinRecoger.length} color="#16854E" />
          </div>
        </div>
      </section>

      {error ? <div className="rounded-[6px] border border-[#F4B7B7] bg-[#FFF5F5] p-4 text-sm font-bold text-[#B42318]">{error}</div> : null}

      <section className="overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-white">
        <div className="flex flex-col gap-4 border-b border-[#E5E7EB] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-[18px] font-bold tracking-[-0.01em] text-[#0A0A0A]">Ordenes por revisar</h2>
            <p className="mt-1 text-[13px] text-[#6B7280]">Selecciona la vista para revisar entregas, pendientes y recordatorios sin cambiar de modulo.</p>
          </div>

          <label className="flex w-full max-w-[280px] items-center gap-3 rounded-[6px] border border-[#D1D5DB] bg-white px-3 py-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8A8A8A]">Vista</span>
            <select
              value={view}
              onChange={(event) => setView(event.target.value)}
              className="h-8 min-w-0 flex-1 bg-transparent text-[13px] font-bold text-[#111827] outline-none"
            >
              {VIEW_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-[#F8FAFC]">
              <tr>
                <Th>Folio</Th>
                <Th>Cliente</Th>
                <Th>Equipo</Th>
                <Th>Estado</Th>
                <Th>Entrega estimada</Th>
                <Th>Tecnico</Th>
              </tr>
            </thead>
            <tbody>
              {current.map((item) => (
                <tr key={item.folio || item.id} className="border-t border-[#E5E7EB] transition hover:bg-[#F8FAFC]">
                  <td className="px-5 py-4">
                    <Link className="font-mono text-sm font-bold text-[#0077B6] hover:text-[#FF6B00]" href={`/admin/reparaciones/${item.folio}`}>
                      {item.folio || "Sin folio"}
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-bold text-[#111827]">{clientName(item)}</p>
                    <p className="mt-0.5 text-xs font-medium text-[#6B7280]">{clientPhone(item)}</p>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-[#334155]">{equipmentName(item)}</td>
                  <td className="px-4 py-4"><StatusBadge estado={item.estado} /></td>
                  <td className="px-4 py-4 text-sm font-bold text-[#334155]">{dateOnly(item.fechaEntregaEstimada) || "Sin fecha"}</td>
                  <td className="px-4 py-4 text-sm font-bold text-[#334155]">{item.tecnico || "Sin asignar"}</td>
                </tr>
              ))}
              {!loading && !current.length ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm font-bold text-[#6B7280]">
                    No hay ordenes en esta vista.
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

function DateField({ label, ...props }) {
  return (
    <label className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#6B7280]">
      {label}
      <input
        type="date"
        {...props}
        className="mt-1.5 h-10 w-full rounded-[6px] border border-[#D1D5DB] bg-white px-3 text-[13px] font-bold normal-case tracking-normal text-[#111827] outline-none transition focus:border-[#0055FF]"
      />
    </label>
  );
}

function SummaryCell({ label, note, value, color }) {
  return (
    <div className="flex min-w-[150px] items-center justify-between gap-4 border-b border-[#E5E7EB] px-5 py-3.5 sm:border-r lg:border-b-0 lg:last:border-r-0">
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="truncate text-[12px] font-bold text-[#111827]">{label}</span>
        </span>
        <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.08em] text-[#8A8A8A]">{note}</span>
      </span>
      <span className="text-[17px] font-bold leading-none" style={{ color }}>{value}</span>
    </div>
  );
}

function StatusBadge({ estado }) {
  const key = String(estado || "").toLowerCase();
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${statusClasses[key] || "border-[#CDD5E1] bg-[#F8FAFC] text-[#475569]"}`}>
      {statusLabels[key] || estado || "Sin estado"}
    </span>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-[0.13em] text-[#526174]">{children}</th>;
}
