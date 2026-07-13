"use client";

import { useEffect, useMemo, useState } from "react";
import RepairsHeader from "@/components/admin/RepairsHeader";
import RepairsManagementTable from "@/components/admin/RepairsManagementTable";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const statusMeta = {
  recibido: { label: "Recibidos", color: "#4F9DCA", note: "Entraron al taller" },
  diagnostico: { label: "Diagnóstico", color: "#C76E28", note: "En revisión" },
  en_reparacion: { label: "En reparación", color: "#008EC4", note: "Trabajo activo" },
  esperando_refaccion: { label: "En espera", color: "#B98517", note: "Pieza o autorización" },
  finalizado: { label: "Listos", color: "#2F855A", note: "Para entrega" },
  entregado: { label: "Entregados", color: "#64748B", note: "Cerrados" },
};

function formatDate(value) {
  if (!value) return "Sin fecha";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("es-MX", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function mapRepair(repair) {
  const cliente = repair.cliente || {};
  const equipo = repair.equipo || {};
  const history = Array.isArray(repair.historial) ? repair.historial : [];
  const lastHistory = history.length > 0 ? history[history.length - 1] : null;

  return {
    folio: repair.folio,
    client: cliente.nombre || "Cliente sin nombre",
    phone: cliente.telefono || cliente.correo || "Sin contacto",
    device: [equipo.marca, equipo.modelo].filter(Boolean).join(" ") || "Equipo sin modelo",
    deviceType: equipo.tipo || "Equipo",
    status: repair.estado || "recibido",
    tech: repair.tecnico || "Sin asignar",
    receivedBy: repair.recibidoPor || repair.creadoPor || "Sin registrar",
    date: formatDate(repair.fechaIngreso || repair.creadoEn),
    priority: repair.prioridad || (repair.estado === "entregado" ? "Cerrada" : "Normal"),
    lastMove: lastHistory?.titulo || repair.observacionesCliente || "Equipo registrado",
  };
}

export default function ReparacionesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadRepairs() {
      setLoading(true);
      setError("");
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("clickcom_token") : "";
        const response = await fetch(`${API_URL}/api/reparaciones`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "No se pudieron cargar las reparaciones");
        if (!ignore) setRepairs((data.reparaciones || []).map(mapRepair));
      } catch (err) {
        if (!ignore) setError(err.message || "Error al cargar reparaciones");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadRepairs();
    return () => {
      ignore = true;
    };
  }, []);

  const filteredRepairs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return repairs;

    return repairs.filter((repair) =>
      [repair.folio, repair.client, repair.phone, repair.device, repair.deviceType, repair.tech, repair.receivedBy, repair.date]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [repairs, searchQuery]);

  const stats = useMemo(() => {
    return Object.entries(statusMeta).map(([status, meta]) => ({
      ...meta,
      count: repairs.filter((repair) => repair.status === status).length,
    }));
  }, [repairs]);

  return (
    <div className="space-y-6 font-['Manrope','Aptos','Segoe_UI',system-ui,sans-serif]">
      <RepairsHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} repairCount={repairs.length} />

      {error && (
        <div className="rounded-2xl border border-[#F0C391] bg-[#FFF1E3] p-4 text-sm font-bold text-[#B45309]">
          {error}. Revisa que el backend esté corriendo en {API_URL}.
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3">
        {stats.map((item) => (
          <div key={item.label} className="rounded-2xl border border-[#C9D8E5] bg-[#FFFFFF] p-4 shadow-[0_12px_28px_rgba(5,12,22,0.10)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#526174]">{item.label}</p>
                <p className="mt-1 text-3xl font-black" style={{ color: item.color }}>{item.count}</p>
                <p className="mt-1 text-xs leading-5 text-[#526174]">{item.note}</p>
              </div>
              <span className="mt-1 h-3 w-3 rounded-full" style={{ background: item.color, boxShadow: `0 0 0 6px ${item.color}18` }} />
            </div>
          </div>
        ))}
      </section>

      {loading ? (
        <div className="rounded-[24px] border border-[#C9D8E5] bg-white p-10 text-center text-sm font-bold text-[#526174]">
          Cargando reparaciones...
        </div>
      ) : (
        <RepairsManagementTable repairs={filteredRepairs} />
      )}
    </div>
  );
}
