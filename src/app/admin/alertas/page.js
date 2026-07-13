"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function token() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("clickcom_token") || localStorage.getItem("token") || "";
}

function headers() {
  const value = token();
  return value ? { Authorization: `Bearer ${value}` } : {};
}

function dateOnly(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function daysBetween(a, b) {
  return Math.floor((a.getTime() - b.getTime()) / 86400000);
}

function labelClient(item) {
  if (typeof item.cliente === "string") return item.cliente;
  return item.cliente?.nombre || item.clienteNombre || "Cliente sin nombre";
}

function labelEquipo(item) {
  if (typeof item.equipo === "string") return item.equipo;
  return item.equipo?.modelo || item.equipo?.marca || item.equipoNombre || "Equipo sin modelo";
}

function AlertCard({ title, count, caption, active, onClick }) {
  return (
    <button onClick={onClick} className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${active ? "border-[#009FE3]" : "border-[#C9DCEB]"}`}>
      <p className="text-sm font-bold text-[#0F2236]">{title}</p>
      <p className="mt-3 text-3xl font-black text-[#B65F18]">{count}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#5D7287]">{caption}</p>
    </button>
  );
}

export default function AlertasPage() {
  const [reparaciones, setReparaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [filter, setFilter] = useState("vencidas");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [repRes, userRes] = await Promise.all([
          fetch(`${API_URL}/api/reparaciones`, { headers: headers() }),
          fetch(`${API_URL}/api/usuarios`, { headers: headers() }),
        ]);
        const repData = repRes.ok ? await repRes.json() : [];
        const userData = userRes.ok ? await userRes.json() : [];
        setReparaciones(Array.isArray(repData) ? repData : repData.reparaciones || []);
        setUsuarios(Array.isArray(userData) ? userData : userData.usuarios || []);
      } catch (err) {
        setError("No se pudieron cargar las alertas.");
      }
    }
    load();
  }, []);

  const data = useMemo(() => {
    const today = new Date();
    const abiertas = reparaciones.filter((item) => !["entregado", "finalizado", "cerrado"].includes(String(item.estado || "").toLowerCase()));
    const sinMovimiento = abiertas.filter((item) => {
      const historial = Array.isArray(item.historial) ? item.historial : [];
      const last = historial[0]?.fecha || item.actualizadoEn || item.creadoEn || item.fechaIngreso;
      const d = dateOnly(last);
      return d ? daysBetween(today, d) > 3 : false;
    });
    const vencidas = abiertas.filter((item) => {
      const d = dateOnly(item.fechaEntregaEstimada || item.entregaEstimada || item.dateEstimated);
      return d ? d < today : false;
    });
    const sinRecoger = reparaciones.filter((item) => ["finalizado", "listo"].includes(String(item.estado || "").toLowerCase()));
    const accesos = usuarios.filter((u) => u.debeCambiarPassword || u.debe_cambiar_password);
    return { sinMovimiento, vencidas, sinRecoger, accesos };
  }, [reparaciones, usuarios]);

  const current = filter === "sinMovimiento" ? data.sinMovimiento : filter === "sinRecoger" ? data.sinRecoger : filter === "accesos" ? data.accesos : data.vencidas;

  return (
    <div className="space-y-5 text-[#0F2236]">
      <section className="rounded-2xl border border-[#C9DCEB] bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF7900]">Centro de avisos</p>
        <h1 className="mt-2 text-3xl font-black">Alertas del taller</h1>
        <p className="mt-2 max-w-3xl text-sm text-[#496178]">Situaciones que requieren atenciÃ³n: Ã³rdenes sin movimiento, fechas rebasadas, equipos listos sin recoger y accesos pendientes.</p>
      </section>

      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}

      <div className="grid gap-4 md:grid-cols-4">
        <AlertCard title="Sin movimiento" count={data.sinMovimiento.length} caption="MÃ¡s de 3 dÃ­as" active={filter === "sinMovimiento"} onClick={() => setFilter("sinMovimiento")} />
        <AlertCard title="Fecha vencida" count={data.vencidas.length} caption="Entrega rebasada" active={filter === "vencidas"} onClick={() => setFilter("vencidas")} />
        <AlertCard title="Sin recoger" count={data.sinRecoger.length} caption="Finalizados" active={filter === "sinRecoger"} onClick={() => setFilter("sinRecoger")} />
        <AlertCard title="Accesos" count={data.accesos.length} caption="ContraseÃ±a pendiente" active={filter === "accesos"} onClick={() => setFilter("accesos")} />
      </div>

      <section className="rounded-2xl border border-[#C9DCEB] bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">Detalle de alerta</h2>
        <div className="mt-4 space-y-3">
          {current.length === 0 ? (
            <p className="rounded-xl border border-[#E1EDF5] bg-[#F8FBFD] p-4 text-sm font-semibold text-[#496178]">No hay registros en esta categorÃ­a.</p>
          ) : current.map((item, index) => (
            <a key={item.id || item.folio || index} href={item.folio ? `/admin/reparaciones/${item.folio}` : "/admin/configuracion"} className="block rounded-xl border border-[#E1EDF5] bg-[#F8FBFD] p-4 transition hover:border-[#009FE3]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong>{item.folio || item.usuario || item.nombre || "Registro"}</strong>
                <span className="text-xs font-bold text-[#B65F18]">{item.estado || item.rol || "Pendiente"}</span>
              </div>
              <p className="mt-1 text-sm text-[#496178]">{labelClient(item)} Â· {labelEquipo(item)}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
