"use client";

import { getToken } from "@/lib/authStorage";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const estadosListos = ["finalizado"];
const estadosCerrados = ["finalizado", "entregado"];

const statusLabels = {
  recibido: "Recibido",
  diagnostico: "En diagnostico",
  en_reparacion: "En reparacion",
  esperando_refaccion: "Esperando refaccion",
  finalizado: "Listo",
  entregado: "Entregado",
};

const statusStyles = {
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

function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function AgendaPage() {
  const [reparaciones, setReparaciones] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [inicio, setInicio] = useState(today());
  const [fin, setFin] = useState(addDays(7));

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/reparaciones`, { headers: authHeaders() })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "No se pudo cargar agenda");
        setReparaciones(data.reparaciones || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const data = useMemo(() => {
    const enRango = reparaciones.filter((r) => {
      const fecha = dateOnly(r.fechaEntregaEstimada || r.fechaIngreso || r.creadoEn);
      return fecha && (!inicio || fecha >= inicio) && (!fin || fecha <= fin);
    });

    const hoy = today();
    const paraHoy = enRango.filter((r) => dateOnly(r.fechaEntregaEstimada) === hoy);
    const listas = enRango.filter((r) => estadosListos.includes(r.estado));
    const vencidas = reparaciones.filter((r) => {
      const fecha = dateOnly(r.fechaEntregaEstimada);
      return fecha && fecha < hoy && !estadosCerrados.includes(r.estado);
    });

    return { enRango, paraHoy, listas, vencidas };
  }, [reparaciones, inicio, fin]);

  return (
    <main className="space-y-5 text-[#111827]" style={{ fontFamily: "var(--cc-font)" }}>
      <section className="rounded-lg border border-[#D6DEE8] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#C05A00]">Agenda operativa</p>
            <h1 className="mt-2 text-[28px] font-black leading-tight text-[#0F172A]">Agenda y entregas</h1>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-[#56657A]">
              Esta vista se alimenta de las reparaciones guardadas en el sistema. Usa la fecha de entrega estimada para revisar el trabajo del dia, ordenes vencidas y entregas por rango.
            </p>
          </div>
          <div className="rounded-md border border-[#E1E8F0] bg-[#F8FAFC] px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#64748B]">
            {loading ? "Cargando datos" : `${reparaciones.length} ordenes registradas`}
          </div>
        </div>
      </section>

      {error ? <div className="rounded-md border border-[#F4B7B7] bg-[#FFF5F5] p-4 text-sm font-bold text-[#B42318]">{error}</div> : null}

      <section className="rounded-lg border border-[#D6DEE8] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <DateField label="Desde" value={inicio} onChange={(event) => setInicio(event.target.value)} />
          <DateField label="Hasta" value={fin} onChange={(event) => setFin(event.target.value)} />
          <button
            type="button"
            onClick={() => {
              setInicio(today());
              setFin(addDays(7));
            }}
            className="self-end rounded-md border border-[#0B86AD] bg-[#0B86AD] px-5 py-3 text-sm font-black text-white transition hover:bg-[#087696]"
          >
            Esta semana
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card title="Para hoy" value={data.paraHoy.length} note="Entrega estimada" color="#0B86AD" />
        <Card title="En rango" value={data.enRango.length} note="Ordenes del periodo" color="#2563EB" />
        <Card title="Listas" value={data.listas.length} note="Por recoger" color="#16854E" />
        <Card title="Vencidas" value={data.vencidas.length} note="Revisar atraso" color="#C55A11" />
      </section>

      <section className="rounded-lg border border-[#D6DEE8] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-black text-[#0F172A]">Ordenes del rango seleccionado</h2>
          <p className="text-sm font-semibold text-[#64748B]">Se muestran las ordenes cuya fecha de entrega estimada cae dentro del periodo elegido.</p>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="border-y border-[#D6DEE8] bg-[#F7F9FC] text-left">
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
              {data.enRango.map((r) => (
                <tr key={r.folio} className="border-b border-[#E1E8F0] transition hover:bg-[#FAFCFF]">
                  <td className="px-4 py-4">
                    <Link className="font-black text-[#087EA7] hover:underline" href={`/admin/reparaciones/${r.folio}`}>
                      {r.folio}
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-bold text-[#0F172A]">{r.cliente?.nombre || "Sin cliente"}</p>
                    <p className="mt-0.5 text-xs font-semibold text-[#64748B]">{r.cliente?.telefono || "Sin telefono"}</p>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-[#334155]">
                    {[r.equipo?.marca, r.equipo?.modelo].filter(Boolean).join(" ") || "Sin equipo"}
                  </td>
                  <td className="px-4 py-4"><StatusBadge estado={r.estado} /></td>
                  <td className="px-4 py-4 text-sm font-bold text-[#334155]">{dateOnly(r.fechaEntregaEstimada) || "Sin fecha"}</td>
                  <td className="px-4 py-4 text-sm font-bold text-[#334155]">{r.tecnico || "Sin asignar"}</td>
                </tr>
              ))}
              {!loading && !data.enRango.length ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm font-bold text-[#64748B]">
                    No hay ordenes en el rango seleccionado.
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
    <label className="text-sm font-black text-[#0F172A]">
      {label}
      <input
        type="date"
        {...props}
        className="mt-2 w-full rounded-md border border-[#C8D3DF] bg-white px-4 py-3 text-sm font-bold text-[#0F172A] outline-none transition focus:border-[#0B86AD] focus:ring-2 focus:ring-[#0B86AD]/10"
      />
    </label>
  );
}

function Card({ title, value, note, color }) {
  return (
    <article className="rounded-lg border border-[#D6DEE8] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-[#0F172A]">{title}</p>
          <p className="mt-4 text-[36px] font-black leading-none" style={{ color }}>{value}</p>
          <p className="mt-3 text-[11px] font-black uppercase tracking-[0.08em] text-[#64748B]">{note}</p>
        </div>
        <span className="mt-1 h-10 w-1 rounded-full" style={{ backgroundColor: color }} />
      </div>
    </article>
  );
}

function StatusBadge({ estado }) {
  const key = String(estado || "").toLowerCase();
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${statusStyles[key] || "border-[#CDD5E1] bg-[#F8FAFC] text-[#475569]"}`}>
      {statusLabels[key] || estado || "Sin estado"}
    </span>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 text-[11px] font-black uppercase tracking-[0.13em] text-[#526174]">{children}</th>;
}
