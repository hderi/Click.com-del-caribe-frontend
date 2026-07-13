"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const estadosListos = ["finalizado"];

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("clickcom_token") : "";
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
  const [inicio, setInicio] = useState(today());
  const [fin, setFin] = useState(addDays(7));

  useEffect(() => {
    fetch(`${API_URL}/api/reparaciones`, { headers: authHeaders() })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "No se pudo cargar agenda");
        setReparaciones(data.reparaciones || []);
      })
      .catch((err) => setError(err.message));
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
      return fecha && fecha < hoy && !["finalizado", "entregado"].includes(r.estado);
    });
    return { enRango, paraHoy, listas, vencidas };
  }, [reparaciones, inicio, fin]);

  return (
    <main className="space-y-5 text-[#172234]">
      <section className="rounded-[18px] border border-[#B8C9D8] bg-[#F7FAFC] p-6 shadow-[0_16px_32px_rgba(27,43,60,0.10)]">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#B45309]">Agenda operativa</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.035em]">Agenda y entregas</h1>
        <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-[#526174]">Esta vista sí se alimenta de las fechas reales de las órdenes. Sirve para ver entregas estimadas, equipos vencidos y trabajo por rango.</p>
      </section>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-700">{error}</div>}

      <section className="rounded-[18px] border border-[#B8C9D8] bg-white p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <label className="font-bold">Desde<input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} className="mt-1 w-full rounded-xl border border-[#B8C9D8] px-4 py-3" /></label>
          <label className="font-bold">Hasta<input type="date" value={fin} onChange={(e) => setFin(e.target.value)} className="mt-1 w-full rounded-xl border border-[#B8C9D8] px-4 py-3" /></label>
          <button onClick={() => { setInicio(today()); setFin(addDays(7)); }} className="self-end rounded-xl bg-[#0B86AD] px-5 py-3 font-black text-white">Esta semana</button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card title="Para hoy" value={data.paraHoy.length} note="Entrega estimada" color="#0B86AD" />
        <Card title="En rango" value={data.enRango.length} note="Órdenes del periodo" color="#3279A8" />
        <Card title="Listas" value={data.listas.length} note="Por recoger" color="#2E7D55" />
        <Card title="Vencidas" value={data.vencidas.length} note="Revisar atraso" color="#C76A24" />
      </section>

      <section className="rounded-[18px] border border-[#B8C9D8] bg-white p-5">
        <h2 className="text-xl font-black">Órdenes del rango seleccionado</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-[#EDF4F8] text-left"><tr><Th>Folio</Th><Th>Cliente</Th><Th>Equipo</Th><Th>Estado</Th><Th>Entrega estimada</Th><Th>Técnico</Th></tr></thead>
            <tbody>{data.enRango.map((r) => <tr key={r.folio} className="border-t border-[#D0DDE8]"><td className="px-4 py-4"><Link className="font-black text-[#087EA7]" href={`/admin/reparaciones/${r.folio}`}>{r.folio}</Link></td><td className="px-4 py-4 font-bold">{r.cliente?.nombre || "Sin cliente"}</td><td className="px-4 py-4">{[r.equipo?.marca, r.equipo?.modelo].filter(Boolean).join(" ")}</td><td className="px-4 py-4 font-bold">{r.estado}</td><td className="px-4 py-4">{dateOnly(r.fechaEntregaEstimada) || "Sin fecha"}</td><td className="px-4 py-4">{r.tecnico || "Sin asignar"}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function Card({ title, value, note, color }) { return <article className="rounded-[16px] border border-[#B8C9D8] bg-white p-5"><p className="font-black">{title}</p><p className="mt-3 text-4xl font-black" style={{ color }}>{value}</p><p className="text-xs font-bold uppercase text-[#667085]">{note}</p></article>; }
function Th({ children }) { return <th className="px-4 py-3 text-[11px] font-black uppercase tracking-[0.13em] text-[#526174]">{children}</th>; }
