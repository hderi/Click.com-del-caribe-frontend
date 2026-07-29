"use client";

import { getToken } from "@/lib/authStorage";
import { useEffect, useMemo, useState } from "react";
import RepairsHeader from "@/components/admin/RepairsHeader";
import RepairsManagementTable from "@/components/admin/RepairsManagementTable";
import { getPaymentStatus } from "@/lib/paymentStatus";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const statusMeta = {
  recibido: { label: "Recibidos", color: "#4F9DCA" },
  diagnostico: { label: "Diagnóstico", color: "#C76E28" },
  en_reparacion: { label: "En reparación", color: "#008EC4", },
  esperando_refaccion: { label: "En espera", color: "#B98517",},
  finalizado: { label: "Listos", color: "#2F855A"  },
  entregado: { label: "Entregados", color: "#64748B" },
};

function formatDate(value) {
  if (!value) return "Sin fecha";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("es-MX", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function absoluteFileUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  if (url.startsWith("http://localhost:3001")) return url.replace("http://localhost:3001", API_URL);
  if (url.startsWith("https://localhost:3001")) return url.replace("https://localhost:3001", API_URL);
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  if (url.startsWith("/")) return `${API_URL}${url}`;
  return url;
}

function withSessionToken(url) {
  const value = absoluteFileUrl(url);
  if (!value || !value.includes("/uploads/") || value.includes("token=")) return value;
  const token = getToken();
  return token ? `${value}${value.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}` : value;
}

function signedReceiptUrl(repair) {
  const document = repair.documentos?.reciboFirmado || repair.reciboFirmado || {};
  return withSessionToken(
    repair.reciboFirmadoUrl ||
    document.url ||
    document.signedUrl ||
    document.publicUrl ||
    document.ruta ||
    document.src ||
    document.dataUrl
  );
}

function mapRepair(repair) {
  const cliente = repair.cliente || {};
  const contacto = repair.contactoReparacion || {};
  const equipo = repair.equipo || {};
  const history = Array.isArray(repair.historial) ? repair.historial : [];
  const lastHistory = history.length > 0 ? history[history.length - 1] : null;

  return {
    folio: repair.folio,
    client: cliente.nombre || "Cliente sin nombre",
    phone: contacto.telefono || contacto.correo || cliente.telefono || cliente.correo || "Sin contacto",
    email: cliente.correo || "",
    repairContact: contacto.nombre || "",
    ownerClient: cliente.nombre || "",
    linkActivo: Boolean(repair.linkActivo),
    device: [equipo.marca, equipo.modelo].filter(Boolean).join(" ") || "Equipo sin modelo",
    deviceType: equipo.tipo || "Equipo",
    status: repair.estado || "recibido",
    tech: repair.tecnico || "Sin asignar",
    receivedBy: repair.recibidoPor || repair.creadoPor || "Sin registrar",
    date: formatDate(repair.fechaIngreso || repair.creadoEn),
    priority: repair.prioridad || (repair.estado === "entregado" ? "Cerrada" : "Normal"),
    lastMove: lastHistory?.titulo || repair.observacionesCliente || "Equipo registrado",
    pago: repair.pago || {},
    anticipo: repair.anticipo || {},
    paymentStatus: getPaymentStatus(repair),
    signedReceiptUrl: signedReceiptUrl(repair),
  };
}

export default function ReparacionesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadRepairs() {
      setLoading(true);
      setError("");
      try {
        const token = typeof window !== "undefined" ? getToken() : "";
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

    return repairs.filter((repair) => {
      if (statusFilter !== "todos" && repair.status !== statusFilter) return false;
      if (!q) return true;

      return [repair.folio, repair.client, repair.repairContact, repair.phone, repair.email, repair.device, repair.deviceType, repair.tech, repair.receivedBy, repair.date]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [repairs, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    return Object.entries(statusMeta).map(([status, meta]) => ({
      ...meta,
      status,
      count: repairs.filter((repair) => repair.status === status).length,
    }));
  }, [repairs]);

  return (
    <div className="space-y-6" style={{ fontFamily: "var(--cc-font), Inter, Arial, sans-serif" }}>
      <RepairsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        repairCount={repairs.length}
        stats={stats}
      />

      {error && (
        <div className="rounded-2xl border border-[#F0C391] bg-[#FFF1E3] p-4 text-sm font-bold text-[#B45309]">
          {error}. Revisa que el backend esté corriendo en {API_URL}.
        </div>
      )}

      {loading ? (
        <div className="rounded-[24px] border border-[#C9D8E5] bg-white p-10 text-center text-sm font-bold text-[#526174]">
          Cargando reparaciones...
        </div>
      ) : (
        <RepairsManagementTable
          repairs={filteredRepairs}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          statusOptions={stats}
        />
      )}
    </div>
  );
}
