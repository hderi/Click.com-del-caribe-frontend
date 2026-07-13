"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function token() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") || localStorage.getItem("authToken") || "";
}

function headers() {
  const value = token();
  return value ? { Authorization: `Bearer ${value}` } : {};
}

function asArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.reparaciones)) return data.reparaciones;
  if (Array.isArray(data?.usuarios)) return data.usuarios;
  return [];
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function daysSince(value) {
  const date = parseDate(value);
  if (!date) return 0;
  return Math.floor((Date.now() - date.getTime()) / 86400000);
}

function clienteNombre(item) {
  if (typeof item.cliente === "string") return item.cliente;
  return item.clienteNombre || item.cliente?.nombre || "Cliente sin nombre";
}

function equipoNombre(item) {
  if (typeof item.equipo === "string") return item.equipo;
  return item.equipoNombre || item.equipo?.modelo || item.modelo || "Equipo sin modelo";
}

function fechaLocal(value) {
  const date = parseDate(value);
  if (!date) return "Sin fecha";
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Cancun",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default function AlertasPage() {
  const [reparaciones, setReparaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [active, setActive] = useState("vencidas");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [repRes, userRes] = await Promise.all([
          fetch(`${API_URL}/api/reparaciones`, { headers: headers() }),
          fetch(`${API_URL}/api/usuarios`, { headers: headers() }).catch(() => null),
        ]);
        const repData = await repRes.json();
        const userData = userRes ? await userRes.json() : [];
        setReparaciones(asArray(repData));
        setUsuarios(asArray(userData));
      } catch (err) {
        setError(err.message || "No se pudieron cargar alertas.");
      }
    }
    load();
  }, []);

  const alertas = useMemo(() => {
    const abiertas = reparaciones.filter((item) => !["entregado", "cerrado"].includes(String(item.estado || item.status || "").toLowerCase()));
    const sinMovimiento = abiertas.filter((item) => daysSince(item.actualizadoEn || item.ultimoMovimiento || item.fecha || item.creadoEn) >= 3);
    const vencidas = abiertas.filter((item) => {
      const fecha = parseDate(item.fechaEntregaEstimada || item.fechaEstimada);
      return fecha && fecha.getTime() < Date.now();
    });
    const sinRecoger = reparaciones.filter((item) => ["listo", "finalizado"].includes(String(item.estado || item.status || "").toLowerCase()));
    const accesos = usuarios.filter((item) => item.debeCambiarPassword || item.passwordPendiente);
    return { sinMovimiento, vencidas, sinRecoger, accesos };
  }, [reparaciones, usuarios]);

  const list = alertas[active] || [];

  return (
    <main className="min-h-screen bg-[#EAF4FA] p-6 font-sans text-[#0B1F33]">
      <section className="rounded-2xl border border-[#C9DCEB] bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#C05A00]">Centro de avisos</p>
        <h1 className="mt-2 text-3xl font-bold">Alertas del taller</h1>
        <p className="mt-2 max-w-3xl text-[#52657A]">
          Detecta órdenes vencidas, folios sin movimiento, equipos listos sin recoger y usuarios con acceso pendiente.
        </p>
      </section>

      {error ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 font-semibold text-red-700">{error}</p> : null}

      <section className="mt-5 grid gap-4 md:grid-cols-4">
        {[
          ["vencidas", "Fecha vencida", alertas.vencidas.length, "Entrega rebasada"],
          ["sinMovimiento", "Sin movimiento", alertas.sinMovimiento.length, "Más de 3 días"],
          ["sinRecoger", "Sin recoger", alertas.sinRecoger.length, "Listas o finalizadas"],
          ["accesos", "Accesos", alertas.accesos.length, "Contraseña pendiente"],
        ].map(([key, label, total, sub]) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`rounded-2xl border p-5 text-left shadow-sm transition ${active === key ? "border-[#009FE3] bg-white" : "border-[#C9DCEB] bg-white/80"}`}
          >
            <p className="font-bold">{label}</p>
            <p className="mt-3 text-4xl font-bold text-[#0077B6]">{total}</p>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#52657A]">{sub}</p>
          </button>
        ))}
      </section>

      <section className="mt-5 rounded-2xl border border-[#C9DCEB] bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold">Resultados</h2>
        <div className="mt-4 space-y-3">
          {list.length ? list.map((item, index) => (
            <article key={item.id || item.folio || index} className="rounded-xl border border-[#E3EDF5] bg-[#F8FBFD] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold">{item.folio || item.usuario || item.nombre || "Registro"}</p>
                  <p className="text-sm text-[#52657A]">
                    {clienteNombre(item)} · {equipoNombre(item)}
                  </p>
                </div>
                <span className="rounded-full bg-[#E6F7FF] px-3 py-1 text-xs font-bold text-[#0077B6]">
                  {fechaLocal(item.fechaEntregaEstimada || item.fechaEstimada || item.actualizadoEn || item.creadoEn)}
                </span>
              </div>
            </article>
          )) : (
            <p className="rounded-xl border border-[#E3EDF5] bg-[#F8FBFD] p-4 font-semibold text-[#52657A]">
              No hay registros en esta alerta.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
