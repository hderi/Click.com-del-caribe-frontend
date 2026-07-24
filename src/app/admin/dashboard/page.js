"use client";

import { getToken } from "@/lib/authStorage";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Wrench,
  Clock,
  Calendar,
  AlertTriangle,
  DollarSign,
  BarChart3,
  Search,
  Filter,
  MoreVertical,
  ArrowRight,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const estados = {
  recibido: { label: "Recibidos", color: "#2563EB" },
  diagnostico: { label: "Diagnóstico", color: "#F97316" },
  en_reparacion: { label: "En reparación", color: "#0EA5E9" },
  esperando_refaccion: { label: "En espera", color: "#F59E0B" },
  finalizado: { label: "Listos", color: "#22C55E" },
  entregado: { label: "Entregados", color: "#94A3B8" },
};

const badgeColors = {
  recibido: "#2563EB",
  diagnostico: "#F97316",
  en_reparacion: "#0EA5E9",
  esperando_refaccion: "#F59E0B",
  finalizado: "#22C55E",
  entregado: "#94A3B8",
};

function mapRepair(repair) {
  const cliente = repair.cliente || {};
  const equipo = repair.equipo || {};

  return {
    folio: repair.folio,
    cliente: cliente.nombre || "Sin cliente",
    equipo: [equipo.marca, equipo.modelo].filter(Boolean).join(" ") || "Sin equipo",
    estado: repair.estado || "recibido",
    tecnico: repair.tecnico || "Sin asignar",
    fecha: repair.creadoEn || repair.fechaIngreso || "",
    fechaEntregaEstimada:
      repair.fechaEntregaEstimada ||
      repair.entregaEstimada ||
      repair.fechaPromesa ||
      "",
    anticipo: repair.anticipo || {},
    pago: repair.pago || {},
  };
}

function fechaCorta(value) {
  if (!value) return "Sin fecha";

  try {
    return new Date(value).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      timeZone: "America/Cancun",
    });
  } catch {
    return "Sin fecha";
  }
}

function tiempoTranscurrido(value) {
  if (!value) return "Sin fecha";

  const fecha = new Date(value);
  if (Number.isNaN(fecha.getTime())) return "Sin fecha";

  const diffMs = Date.now() - fecha.getTime();
  const dias = Math.floor(diffMs / 86400000);
  const horas = Math.floor((diffMs % 86400000) / 3600000);

  if (dias > 0) return `${dias}d ${horas}h`;

  const minutos = Math.floor((diffMs % 3600000) / 60000);
  return `${horas}h ${minutos}m`;
}

function toDateOnly(value) {
  if (!value) return "";

  const text = String(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
}

function getTodayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${y}-${m}-${day}`;
}

function getFirstDayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");

  return `${y}-${m}-01`;
}

function getLastDayIso() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1, 0);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${y}-${m}-${day}`;
}

export default function DashboardPage() {
  const [reparaciones, setReparaciones] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fechaInicio, setFechaInicio] = useState(getFirstDayIso());
  const [fechaFin, setFechaFin] = useState(getLastDayIso());

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const token = getToken() || "";
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [r1, r2, r3] = await Promise.all([
          fetch(`${API_URL}/api/reparaciones`, { headers }),
          fetch(`${API_URL}/api/clientes`, { headers }),
          fetch(`${API_URL}/api/equipos`, { headers }),
        ]);

        const [d1, d2, d3] = await Promise.all([
          r1.json(),
          r2.json(),
          r3.json(),
        ]);

        if (!r1.ok) throw new Error(d1.error || "No se pudieron cargar reparaciones");
        if (!r2.ok) throw new Error(d2.error || "No se pudieron cargar clientes");
        if (!r3.ok) throw new Error(d3.error || "No se pudieron cargar equipos");

        if (!ignore) {
          setReparaciones((d1.reparaciones || []).map(mapRepair));
          setClientes(d2.clientes || []);
          setEquipos(d3.equipos || []);
        }
      } catch (err) {
        if (!ignore) setError(err.message || "Error al cargar el panel");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  const reparacionesPeriodo = useMemo(() => {
    return reparaciones.filter((item) => {
      const fecha = toDateOnly(item.fecha);
      if (!fecha) return false;
      if (fechaInicio && fecha < fechaInicio) return false;
      if (fechaFin && fecha > fechaFin) return false;
      return true;
    });
  }, [reparaciones, fechaInicio, fechaFin]);

  const data = useMemo(() => {
    const porEstado = Object.fromEntries(Object.keys(estados).map((key) => [key, 0]));
    const porTecnico = {};

    let anticipoTotal = 0;
    let saldoPendiente = 0;
    let conAnticipo = 0;

    reparacionesPeriodo.forEach((item) => {
      porEstado[item.estado] = (porEstado[item.estado] || 0) + 1;

      if (item.anticipo?.dioAnticipo) conAnticipo += 1;

      anticipoTotal += Number(item.anticipo?.monto || 0);
      saldoPendiente += Number(item.pago?.saldoPendiente || 0);

      if (!["finalizado", "entregado"].includes(item.estado)) {
        porTecnico[item.tecnico] = (porTecnico[item.tecnico] || 0) + 1;
      }
    });

    const activas = reparacionesPeriodo.filter(
      (item) => !["finalizado", "entregado"].includes(item.estado)
    ).length;

    const espera = (porEstado.diagnostico || 0) + (porEstado.esperando_refaccion || 0);
    const listas = porEstado.finalizado || 0;
    const cerradas = porEstado.entregado || 0;

    const tecnicos = Object.entries(porTecnico)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return {
      porEstado,
      activas,
      espera,
      listas,
      cerradas,
      tecnicos,
      anticipoTotal,
      saldoPendiente,
      conAnticipo,
    };
  }, [reparacionesPeriodo]);

  const barras = Object.entries(estados).map(([key, item]) => ({
    key,
    ...item,
    value: data.porEstado[key] || 0,
  }));

  const maxBar = Math.max(1, ...barras.map((item) => item.value));

  const recientes = [...reparacionesPeriodo]
    .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)))
    .slice(0, 5);

  const maxTecnico = Math.max(1, ...data.tecnicos.map((t) => t.value));
  const hoyIso = getTodayIso();

  const proximasEntregas = [...reparacionesPeriodo]
    .filter((item) => item.estado === "finalizado" && item.fechaEntregaEstimada)
    .sort((a, b) => String(a.fechaEntregaEstimada).localeCompare(String(b.fechaEntregaEstimada)))
    .slice(0, 4);

  const alertas = [];

  reparacionesPeriodo.forEach((item) => {
    const fecha = toDateOnly(item.fecha);
    if (!fecha) return;

    const dias = Math.floor((new Date(hoyIso) - new Date(fecha)) / 86400000);

    if (["recibido", "diagnostico", "en_reparacion"].includes(item.estado) && dias >= 7) {
      alertas.push({
        tipo: "rojo",
        texto: `Orden ${item.folio} lleva ${dias} días en reparación.`,
        link: "/admin/reparaciones",
        linkLabel: "Ver órdenes",
      });
    } else if (item.estado === "esperando_refaccion" && dias >= 3) {
      alertas.push({
        tipo: "naranja",
        texto: `Orden ${item.folio} espera refacción desde hace ${dias} días.`,
        link: "/admin/equipos",
        linkLabel: "Ver equipo",
      });
    } else if (item.estado === "finalizado" && dias >= 2) {
      alertas.push({
        tipo: "amarillo",
        texto: `Cliente de la orden ${item.folio} aún no recoge su equipo.`,
        link: "/admin/clientes",
        linkLabel: "Ver clientes",
      });
    }
  });

  const resumenDia = reparacionesPeriodo.reduce(
    (acc, item) => {
      const fecha = toDateOnly(item.fecha);

      if (fecha === hoyIso) {
        acc.recibidos += 1;

        if (!["recibido"].includes(item.estado)) acc.iniciadas += 1;

        if (item.estado === "entregado") {
          acc.entregas += 1;
          acc.ingresos += Number(item.anticipo?.monto || 0);
        }
      }

      return acc;
    },
    { recibidos: 0, iniciadas: 0, entregas: 0, ingresos: 0 }
  );

  return (
    <main
      className="space-y-5 bg-white text-[#0A0A0A]"
      style={{
        fontFamily: "var(--cc-font)",
        "--dash-line": "#EBEBEB",
        "--dash-text": "#0A0A0A",
        "--dash-dim": "#8A8A8A",
        "--dash-accent": "#0055FF",
      }}
    >
      {error && (
        <div className="rounded-[4px] border border-[#F3B5B5] bg-[#FFF7F7] px-4 py-3 text-[13px] font-semibold text-[#B42318]">
          {error}
        </div>
      )}

      <section className="border border-[var(--dash-line)] bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto]">
          <label className="space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--dash-dim)]">Desde</span>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full rounded-[4px] border border-[var(--dash-line)] bg-white px-3 py-2 text-[13px] font-medium text-[var(--dash-text)] outline-none focus:border-[var(--dash-accent)]"
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--dash-dim)]">Hasta</span>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full rounded-[4px] border border-[var(--dash-line)] bg-white px-3 py-2 text-[13px] font-medium text-[var(--dash-text)] outline-none focus:border-[var(--dash-accent)]"
            />
          </label>

          <button
            type="button"
            onClick={() => {
              setFechaInicio(getFirstDayIso());
              setFechaFin(getLastDayIso());
            }}
            className="self-end rounded-[4px] border border-[var(--dash-accent)] bg-[var(--dash-accent)] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#0048D8]"
          >
            Este mes
          </button>

          <button
            type="button"
            onClick={() => {
              setFechaInicio("");
              setFechaFin(getTodayIso());
            }}
            className="self-end rounded-[4px] border border-[var(--dash-line)] bg-white px-4 py-2 text-[13px] font-semibold text-[var(--dash-text)] hover:bg-[#F7F7F7]"
          >
            Todo
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <Metric icon={Wrench} title="Activas" value={data.activas} note="En taller" color="#0055FF" />
        <Metric icon={Clock} title="Pendientes" value={data.espera} note="Diagnóstico o espera" color="#C95F00" />
        <Metric icon={Calendar} title="Listas" value={data.listas} note="Por entregar" color="#087443" />
        <Metric icon={AlertTriangle} title="Cerradas" value={data.cerradas} note="Entregadas" color="#737373" />
        <Metric icon={DollarSign} title="Con pago" value={data.conAnticipo} note={`$ ${Number(data.anticipoTotal || 0).toLocaleString("es-MX")} recibido`} color="#087443" />
        <Metric icon={BarChart3} title="Saldo pendiente" value={`$ ${Number(data.saldoPendiente || 0).toLocaleString("es-MX")}`} note="Por cobrar" color="#C95F00" />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <Panel title="Flujo por estado" subtitle="Distribución actual de las órdenes de trabajo." showFilter>
          <div className="mt-5 min-h-[280px] border border-[var(--dash-line)] bg-white px-6 py-7">
            <div className="flex h-full min-h-[225px] items-end gap-6">
              {barras.map((bar) => (
                <div key={bar.key} className="flex flex-1 flex-col items-center justify-end gap-3">
                  <div className="relative flex h-44 w-full items-end justify-center">
                    <div
                      className="w-full max-w-[44px] transition-all"
                      style={{
                        height: `${Math.max(6, (bar.value / maxBar) * 100)}%`,
                        backgroundColor: bar.color,
                      }}
                    />
                  </div>

                  <div className="text-center">
                    <p className="text-[16px] font-bold text-[var(--dash-text)]">{bar.value}</p>
                    <p className="text-[12px] font-medium leading-4 text-[var(--dash-dim)]">{bar.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel title="Próximas entregas" subtitle="Equipos listos, pendientes de entregar al cliente." showFilter>
          {proximasEntregas.length === 0 ? (
            <div className="mt-5 border border-dashed border-[var(--dash-line)] bg-white p-8 text-center text-[13px] font-medium text-[var(--dash-dim)]">
              No hay equipos listos para entregar.
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[420px]">
                <thead>
                  <tr className="border-b border-[var(--dash-line)]">
                    <Th>Fecha</Th>
                    <Th>Equipo</Th>
                    <Th>Cliente</Th>
                  </tr>
                </thead>

                <tbody>
                  {proximasEntregas.map((item) => (
                    <tr key={item.folio} className="border-b border-[var(--dash-line)] last:border-b-0">
                      <td className="px-3 py-3 text-[13px] text-[var(--dash-dim)]">{fechaCorta(item.fechaEntregaEstimada)}</td>
                      <td className="px-3 py-3 text-[13px] font-semibold text-[var(--dash-text)]">{item.equipo}</td>
                      <td className="px-3 py-3 text-[13px] text-[var(--dash-text)]">{item.cliente}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Link href="/admin/alertas" className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--dash-accent)] hover:underline">
            Ver agenda y recordatorios <ArrowRight className="h-4 w-4" />
          </Link>
        </Panel>
      </section>

      <section>
        <Panel title="Órdenes recientes" subtitle="Últimas órdenes registradas en el sistema." actions>
          {recientes.length === 0 ? (
            <div className="mt-5 border border-dashed border-[var(--dash-line)] bg-white p-8 text-center text-[13px] font-medium text-[var(--dash-dim)]">
              Todavía no hay órdenes registradas.
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-[var(--dash-line)]">
                    <Th>Orden</Th>
                    <Th>Cliente</Th>
                    <Th>Equipo</Th>
                    <Th>Técnico</Th>
                    <Th>Estado</Th>
                    <Th>Tiempo</Th>
                    <Th></Th>
                  </tr>
                </thead>

                <tbody>
                  {recientes.map((item) => (
                    <tr key={item.folio} className="border-b border-[var(--dash-line)] last:border-b-0">
                      <td className="px-3 py-3">
                        <Link href={`/admin/reparaciones/${item.folio}`} className="text-[13px] font-semibold text-[var(--dash-accent)] hover:underline">
                          {item.folio}
                        </Link>
                      </td>

                      <td className="px-3 py-3 text-[13px] font-medium text-[var(--dash-text)]">{item.cliente}</td>
                      <td className="px-3 py-3 text-[13px] text-[var(--dash-text)]">{item.equipo}</td>
                      <td className="px-3 py-3 text-[13px] text-[var(--dash-text)]">{item.tecnico}</td>

                      <td className="px-3 py-3">
                        <span
                          className="rounded-[4px] border px-2 py-1 text-[11px] font-semibold"
                          style={{
                            color: badgeColors[item.estado] || "#64748B",
                            backgroundColor: `${badgeColors[item.estado] || "#64748B"}1A`,
                            borderColor: `${badgeColors[item.estado] || "#64748B"}40`,
                          }}
                        >
                          {estados[item.estado]?.label || item.estado}
                        </span>
                      </td>

                      <td className="px-3 py-3 text-[13px] text-[var(--dash-dim)]">{tiempoTranscurrido(item.fecha)}</td>

                      <td className="px-3 py-3 text-right">
                        <button type="button" disabled className="cursor-not-allowed text-[var(--dash-dim)] opacity-40" aria-label="Más opciones">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Link href="/admin/reparaciones" className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--dash-accent)] hover:underline">
            Ver todas las órdenes <ArrowRight className="h-4 w-4" />
          </Link>
        </Panel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.75fr_0.75fr_1fr]">
        <Panel title="Carga por técnico" subtitle="Órdenes activas asignadas." showFilter>
          <div className="mt-5 space-y-4">
            {data.tecnicos.length === 0 ? (
              <div className="border border-dashed border-[var(--dash-line)] bg-white p-5 text-[13px] font-medium text-[var(--dash-dim)]">
                Sin carga activa.
              </div>
            ) : data.tecnicos.map((tech) => (
              <div key={tech.name}>
                <div className="mb-1.5 flex items-center justify-between text-[13px]">
                  <span className="font-semibold text-[var(--dash-text)]">{tech.name}</span>
                  <span className="font-semibold text-[var(--dash-dim)]">{tech.value}</span>
                </div>

                <div className="h-2 w-full overflow-hidden bg-[#F2F2F2]">
                  <div
                    className="h-full bg-[var(--dash-accent)]"
                    style={{ width: `${Math.max(6, (tech.value / maxTecnico) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Recordatorios importantes" subtitle="Seguimientos que conviene revisar.">
          {alertas.length === 0 ? (
            <div className="mt-5 border border-dashed border-[var(--dash-line)] bg-white p-6 text-center text-[13px] font-medium text-[var(--dash-dim)]">
              Sin recordatorios por ahora.
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {alertas.slice(0, 4).map((alerta, index) => {
                const colores = { rojo: "#EF4444", naranja: "#F97316", amarillo: "#F59E0B" };

                return (
                  <div key={index} className="flex items-start justify-between gap-3 border border-[var(--dash-line)] bg-white px-4 py-3">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: colores[alerta.tipo] }} />
                      <p className="text-[13px] text-[var(--dash-text)]">{alerta.texto}</p>
                    </div>

                    <Link href={alerta.link} className="shrink-0 whitespace-nowrap text-[12px] font-semibold text-[var(--dash-accent)] hover:underline">
                      {alerta.linkLabel}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>

        <Panel title="Resumen del día" subtitle="Basado en el rango de fechas seleccionado.">
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Small label="Equipos recibidos" value={resumenDia.recibidos} />
            <Small label="Reparaciones iniciadas" value={resumenDia.iniciadas} />
            <Small label="Entregas realizadas" value={resumenDia.entregas} />
            <Small label="Ingresos del día" value={`$ ${resumenDia.ingresos.toLocaleString("es-MX")}`} />
          </div>
        </Panel>
      </section>
    </main>
  );
}

function Metric({ icon: Icon, title, value, note, color }) {
  return (
    <div className="border border-[var(--dash-line)] bg-white p-4">
      <div className="flex h-8 w-8 items-center justify-center border border-[var(--dash-line)] bg-white">
        <Icon className="h-5 w-5" style={{ color }} strokeWidth={1.8} />
      </div>

      <p className="mt-4 text-[30px] font-bold leading-none text-[var(--dash-text)]">
        {value}
      </p>

      <p className="mt-2 text-[13px] font-semibold text-[var(--dash-text)]">{title}</p>
      <p className="mt-1 text-[12px] font-medium text-[var(--dash-dim)]">{note}</p>
    </div>
  );
}

function Panel({ title, subtitle, children, showFilter, actions }) {
  return (
    <section className="border border-[var(--dash-line)] bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--dash-text)]">{title}</h2>
          <p className="mt-1 text-[13px] font-medium text-[var(--dash-dim)]">{subtitle}</p>
        </div>

        {showFilter && (
          <button
            type="button"
            disabled
            className="flex shrink-0 cursor-not-allowed items-center gap-1.5 rounded-[4px] border border-[var(--dash-line)] bg-white px-3 py-1.5 text-[12px] font-semibold text-[var(--dash-dim)] opacity-70"
          >
            Este mes
          </button>
        )}

        {actions && (
          <div className="flex shrink-0 items-center gap-1.5">
            <button type="button" disabled className="cursor-not-allowed rounded-[4px] border border-[var(--dash-line)] bg-white p-2 text-[var(--dash-dim)] opacity-70" aria-label="Buscar">
              <Search className="h-4 w-4" />
            </button>

            <button type="button" disabled className="cursor-not-allowed rounded-[4px] border border-[var(--dash-line)] bg-white p-2 text-[var(--dash-dim)] opacity-70" aria-label="Filtrar">
              <Filter className="h-4 w-4" />
            </button>

            <button type="button" disabled className="cursor-not-allowed rounded-[4px] border border-[var(--dash-line)] bg-white p-2 text-[var(--dash-dim)] opacity-70" aria-label="Más opciones">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {children}
    </section>
  );
}

function Small({ label, value }) {
  return (
    <div className="border border-[var(--dash-line)] bg-white p-4">
      <p className="text-[22px] font-bold text-[var(--dash-text)]">{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--dash-dim)]">{label}</p>
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--dash-dim)]">
      {children}
    </th>
  );
}
