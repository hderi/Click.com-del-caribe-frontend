"use client";

import { getSessionUser, getToken } from "@/lib/authStorage";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const DEFAULT_ACCESSORIES = [
  { id: "cargador", label: "Cargador" },
  { id: "mouse", label: "Mouse" },
  { id: "cable_poder", label: "Cable de poder" },
  { id: "cartuchos", label: "Cartuchos" },
  { id: "tintas", label: "Tintas" },
];

function normalizeOptions(items, fallback = []) {
  const source = Array.isArray(items) && items.length ? items : fallback;
  return source
    .map((item) => {
      if (typeof item === "string") return { value: item, label: item };
      const label = item?.label || item?.nombre || item?.value || "";
      const value = item?.value || item?.id || label;
      return label && value ? { ...item, value, id: item.id || value, label } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.label.localeCompare(b.label, "es", { sensitivity: "base" }));
}

function normalizeRole(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

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

function todayDate() {
  return new Date(`${dateOnly(new Date().toISOString())}T00:00:00`);
}

function daysRemaining(value) {
  const parsed = parseDate(value);
  if (!parsed) return null;
  parsed.setHours(0, 0, 0, 0);
  return Math.ceil((parsed.getTime() - todayDate().getTime()) / 86400000);
}

function formatRemainingDays(value) {
  if (typeof value !== "number") return "-";
  if (value < 0) return "-";
  if (value === 0) return "Vence hoy";
  return `${value} día${value === 1 ? "" : "s"}`;
}

function formatDate(value) {
  const parsed = parseDate(value);
  if (!parsed) return "-";
  return parsed.toLocaleDateString("es-MX", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function fileUrl(value) {
  const url = String(value || "").trim();
  if (!url) return "";
  const absolute = url.startsWith("http") || url.startsWith("data:") ? url : `${API_URL}${url.startsWith("/") ? url : `/${url}`}`;
  if (!absolute.includes("/uploads/") || absolute.includes("token=")) return absolute;
  const token = getToken();
  return token ? `${absolute}${absolute.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}` : absolute;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function prepareWarrantyPhotos(files) {
  return Promise.all(Array.from(files || []).map(async (file) => ({
    nombre: file.name,
    name: file.name,
    size: file.size,
    lastModified: file.lastModified,
    tipo: "garantia_apertura",
    visibleCliente: false,
    dataUrl: await fileToDataUrl(file),
  })));
}

function warrantyApplies(repair) {
  const value = String(repair.garantia?.aplica || "").trim().toLowerCase();
  return value.includes("si") || value.includes("sí");
}

function normalizeStatus(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function warrantyStatusLabel(value, pending = false) {
  if (pending) return "Por abrir";
  const labels = {
    abierta: "Abierta",
    diagnostico: "Diagnóstico",
    en_reparacion: "En reparación",
    finalizada: "Finalizada",
    cerrada: "Cerrada",
  };
  return labels[normalizeStatus(value)] || "Abierta";
}

function warrantyPhaseInfo(item) {
  const status = normalizeStatus(item.estado);
  const classes = {
    abierta: "border-[#B7D7F3] bg-[#F2F8FD] text-[#0077B6]",
    diagnostico: "border-[#F5C58B] bg-[#FFF5E8] text-[#A14E00]",
    en_reparacion: "border-[#BFDBFE] bg-[#EFF6FF] text-[#0055FF]",
    finalizada: "border-[#A8DDC0] bg-[#F0FAF4] text-[#13753A]",
    cerrada: "border-[#C9D8E5] bg-[#EEF2F6] text-[#526174]",
  };
  return {
    label: warrantyStatusLabel(item.estado, item.pendingWarranty),
    className: item.pendingWarranty ? "border-[#DDE5EE] bg-white text-[#526174]" : classes[status] || classes.abierta,
  };
}

function warrantyValidityInfo(item) {
  if (item.vencida) return { label: "Vencida", className: "border-[#F5C58B] bg-[#FFF5E8] text-[#A14E00]" };
  return { label: "Vigente", className: "border-[#A8DDC0] bg-[#F0FAF4] text-[#13753A]" };
}

function isClosedStatus(value) {
  const status = normalizeStatus(value);
  return ["cerrada", "cerrado", "cancelada", "cancelado", "finalizada", "finalizado"].includes(status);
}

function isClosedWarranty(item) {
  return isClosedStatus(item.estado);
}

function isOpenWarranty(item) {
  return !isClosedStatus(item.estado);
}

function isCurrentWarranty(item) {
  return !item.vencida;
}

function getWarrantyRepairFolio(item) {
  return item?.reparacionFolio || item?.reparacion_folio || item?.reparacion?.folio || item?.rxOriginal || item?.rx_original || "";
}

function isEligibleRepair(repair, warranties) {
  const status = normalizeStatus(repair.estado);
  if (status !== "entregado" || !warrantyApplies(repair)) return false;

  const start = repair.entregadoEn || repair.fechaEntrega || repair.fechaEntregado || repair.actualizadoEn || repair.creadoEn;
  const days = Number(repair.garantia?.dias || 0);
  const expires = days > 0 ? addDays(start, days) : "";
  const remaining = daysRemaining(expires);
  if (typeof remaining === "number" && remaining < 0) return false;

  return !warranties.some((item) => getWarrantyRepairFolio(item) === repair.folio);
}

function normalizeWarranty(item) {
  const repair = item.reparacion || {};
  const warranty = repair.garantia || {};
  const days = Number(warranty.dias || 0);
  const start = repair.entregadoEn || repair.actualizadoEn || item.creadoEn;
  const expires = days > 0 ? addDays(start, days) : "";
  const remaining = daysRemaining(expires);
  const expired = typeof remaining === "number" ? remaining < 0 : false;
  const cliente = repair.cliente || {};
  const equipo = repair.equipo || {};
  const opening = Array.isArray(item.historial) ? item.historial[0] || {} : {};

  return {
    ...item,
    pendingWarranty: false,
    reparacionFolio: getWarrantyRepairFolio(item),
    cliente: cliente.nombre || "Cliente sin nombre",
    telefono: cliente.telefono || "",
    correo: cliente.correo || "",
    equipo: [equipo.marca, equipo.modelo].filter(Boolean).join(" ") || "Equipo",
    serie: equipo.serie || "",
    fechaIngresoOriginal: repair.fechaIngreso || repair.creadoEn || "",
    inicio: start,
    vence: expires,
    dias: days,
    diasRestantes: remaining,
    estado: item.estado || "abierta",
    vencida: expired,
    recibidoPor: opening.recibidoPor || opening.tecnico || "",
    tecnico: item.tecnico || repair.tecnico || "",
    mensaje: item.mensaje || {},
  };
}

function normalizeEligibleRepair(repair) {
  const cliente = repair.cliente || {};
  const equipo = repair.equipo || {};
  const warranty = repair.garantia || {};
  const days = Number(warranty.dias || 0);
  const start = repair.entregadoEn || repair.actualizadoEn || repair.fechaIngreso || repair.creadoEn;
  const expires = days > 0 ? addDays(start, days) : "";
  const remaining = daysRemaining(expires);
  const expired = typeof remaining === "number" ? remaining < 0 : false;

  return {
    pendingWarranty: true,
    folio: `pendiente-${repair.folio}`,
    reparacionFolio: repair.folio,
    cliente: cliente.nombre || "Cliente sin nombre",
    telefono: cliente.telefono || "",
    correo: cliente.correo || "",
    equipo: [equipo.marca, equipo.modelo].filter(Boolean).join(" ") || "Equipo",
    serie: equipo.serie || "",
    fechaIngresoOriginal: repair.fechaIngreso || repair.creadoEn || "",
    inicio: start,
    vence: expires,
    dias: days,
    diasRestantes: remaining,
    estado: "abierta",
    vencida: expired,
    recibidoPor: repair.recibidoPor || "",
    tecnico: repair.tecnico || "",
  };
}

export default function GarantiasPage() {
  const [warranties, setWarranties] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [repairOptions, setRepairOptions] = useState({ accesorios: DEFAULT_ACCESSORIES });
  const [query, setQuery] = useState("");
  const [view, setView] = useState("todas");
  const [loading, setLoading] = useState(true);
  const [savingFolio, setSavingFolio] = useState("");
  const [openDocsMenu, setOpenDocsMenu] = useState("");
  const [openingRepair, setOpeningRepair] = useState(null);
  const [form, setForm] = useState({
    fechaIngreso: dateOnly(new Date().toISOString()),
    recibidoPor: "",
    motivo: "",
    accesorios: "",
    observaciones: "",
    fotos: [],
  });
  const [error, setError] = useState("");
  const autoOpenRef = useRef(false);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const headers = authHeaders();
      const sessionUser = getSessionUser();
      setCurrentUser(sessionUser);
      const [warrantyResponse, repairResponse, usersResponse, optionsResponse] = await Promise.all([
        fetch(`${API_URL}/api/garantias?limit=200`, { headers }),
        fetch(`${API_URL}/api/reparaciones?limit=200`, { headers }),
        fetch(`${API_URL}/api/usuarios`, { headers }),
        fetch(`${API_URL}/api/configuracion/opciones_reparacion`, { headers }),
      ]);
      const warrantyData = await warrantyResponse.json();
      const repairData = await repairResponse.json();
      if (!warrantyResponse.ok) throw new Error(warrantyData.error || "No se pudieron cargar las garantías");
      if (!repairResponse.ok) throw new Error(repairData.error || "No se pudieron cargar las reparaciones");
      setWarranties(warrantyData.garantias || []);
      setRepairs(repairData.reparaciones || []);
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(Array.isArray(usersData.usuarios) ? usersData.usuarios : []);
      }
      if (optionsResponse.ok) {
        const optionsData = await optionsResponse.json();
        if (optionsData?.datos && Object.keys(optionsData.datos).length > 0) {
          setRepairOptions((current) => ({ ...current, ...optionsData.datos }));
        }
      }
    } catch (err) {
      setError(err.message || "No se pudieron cargar las garantías.");
    } finally {
      setLoading(false);
    }
  }

  function startWarrantyForm(item) {
    const sessionUser = getSessionUser();
    const role = normalizeRole(sessionUser?.rol || sessionUser?.role);
    const receivedBy = role === "admin" || role === "gerencia"
      ? ""
      : (sessionUser?.nombre || sessionUser?.name || sessionUser?.usuario || sessionUser?.username || "");
    setOpeningRepair(item);
    setError("");
    setForm({
      fechaIngreso: dateOnly(new Date().toISOString()),
      recibidoPor: receivedBy,
      motivo: "",
      accesorios: "",
      observaciones: "",
      fotos: [],
    });
  }

  async function openWarranty(event) {
    event.preventDefault();
    if (!openingRepair?.reparacionFolio) return;
    const folio = openingRepair.reparacionFolio;
    setSavingFolio(folio);
    setError("");
    try {
      if (!form.motivo.trim()) {
        throw new Error("Escribe la falla reportada para abrir la garantía.");
      }
      const fotos = await prepareWarrantyPhotos(form.fotos);
      const response = await fetch(`${API_URL}/api/garantias`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          reparacionFolio: folio,
          fechaIngreso: form.fechaIngreso,
          recibidoPor: form.recibidoPor,
          motivo: form.motivo,
          accesorios: form.accesorios,
          observaciones: form.observaciones,
          fotos,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo abrir la garantía");
      await loadData();
      setOpeningRepair(null);
      if (data.garantia?.folio) {
        window.location.href = `/admin/garantias/${encodeURIComponent(data.garantia.folio)}`;
      }
    } catch (err) {
      setError(err.message || "No se pudo abrir la garantía.");
    } finally {
      setSavingFolio("");
    }
  }

  async function openWarrantyMessage(folio, type) {
    try {
      const response = await fetch(`${API_URL}/api/garantias/${encodeURIComponent(folio)}/${type}`, {
        method: "POST",
        headers: authHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo preparar el mensaje");
      const url = type === "whatsapp" ? data.whatsappUrl : data.mailtoUrl;
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err.message || "No se pudo preparar el mensaje.");
    }
  }

  async function uploadSignedWarrantyReceipt(item, event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !item?.folio) return;
    setSavingFolio(item.folio);
    setError("");
    try {
      const dataUrl = await fileToDataUrl(file);
      const response = await fetch(`${API_URL}/api/garantias/${encodeURIComponent(item.folio)}/recibo-firmado`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ reciboFirmado: { nombre: file.name, name: file.name, size: file.size, lastModified: file.lastModified, dataUrl } }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo subir el recibo firmado");
      await loadData();
      setOpenDocsMenu("");
    } catch (err) {
      setError(err.message || "No se pudo subir el recibo firmado.");
    } finally {
      setSavingFolio("");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const rows = useMemo(() => warranties.map(normalizeWarranty), [warranties]);
  const eligibleRepairs = useMemo(() => repairs.filter((repair) => isEligibleRepair(repair, warranties)), [repairs, warranties]);
  const pendingRows = useMemo(() => eligibleRepairs.map(normalizeEligibleRepair), [eligibleRepairs]);
  const allRows = useMemo(() => [...pendingRows, ...rows], [pendingRows, rows]);
  const activeUsers = useMemo(() => {
    return Array.isArray(users)
      ? users.filter((user) => user.activo !== false && user.active !== false && user.estado !== "Bloqueado")
      : [];
  }, [users]);
  const currentRole = normalizeRole(currentUser?.rol || currentUser?.role);
  const isAdminLike = currentRole === "admin" || currentRole === "gerencia";
  const currentUserName = currentUser?.nombre || currentUser?.name || currentUser?.usuario || currentUser?.username || "";
  const receiverOptions = useMemo(() => {
    const options = activeUsers
      .filter((user) => {
        const role = normalizeRole(user.rol || user.role);
        return role === "ventas" || role === "venta" || role === "recepcion" || role === "tecnico";
      })
      .map((user) => {
        const label = user.nombre || user.name || user.usuario || user.username;
        return label ? { value: label, label } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.label.localeCompare(b.label, "es", { sensitivity: "base" }));
    if (!currentUserName) return options;
    const currentOption = { value: currentUserName, label: currentUserName };
    return options.some((item) => item.value === currentOption.value) ? options : [currentOption, ...options];
  }, [activeUsers, currentUserName]);
  const accessoryOptions = useMemo(() => normalizeOptions(repairOptions.accesorios, DEFAULT_ACCESSORIES), [repairOptions.accesorios]);

  useEffect(() => {
    if (loading || autoOpenRef.current || typeof window === "undefined") return;
    const rx = new URLSearchParams(window.location.search).get("rx");
    if (!rx) return;
    const target = eligibleRepairs.find((repair) => repair.folio === rx);
    if (!target) return;
    autoOpenRef.current = true;
    startWarrantyForm(normalizeEligibleRepair(target));
  }, [loading, eligibleRepairs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allRows.filter((item) => {
      const matchesView =
        view === "todas" ||
        (view === "abiertas" && !item.pendingWarranty && isOpenWarranty(item)) ||
        (view === "vigentes" && isCurrentWarranty(item)) ||
        (view === "cerradas" && isClosedWarranty(item));
      const matchesQuery =
        !q ||
        [item.folio, item.reparacionFolio, item.cliente, item.telefono, item.correo, item.equipo, item.serie]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return matchesView && matchesQuery;
    });
  }, [allRows, query, view]);

  const stats = [
    { label: "Garantías", value: allRows.length, note: "", color: "#0055FF" },
    { label: "Vigentes", value: allRows.filter(isCurrentWarranty).length, note: "", color: "#16854E" },
    { label: "Abiertas", value: rows.filter(isOpenWarranty).length, note: "", color: "#0077B6" },
    { label: "Cerradas", value: allRows.filter(isClosedWarranty).length, note: "", color: "#C55A11" },
  ];

  return (
    <main className="space-y-6 text-[#0A0A0A]" style={{ fontFamily: "Inter, var(--cc-font), Arial, sans-serif" }}>
      <section className="overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-white">
        <div className="flex flex-col gap-5 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
 

          <label className="flex h-11 w-full max-w-[440px] items-center gap-3 rounded-[6px] border border-[#D1D5DB] bg-white px-4">
            <span className="text-[15px] text-[#8A8A8A]">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar GT, RX, cliente, teléfono o equipo..."
              className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-[#111827] outline-none placeholder:text-[#8A8A8A]"
            />
          </label>
        </div>

        <div className="grid border-t border-[#E5E7EB] bg-white md:grid-cols-4">
          {stats.map((item) => (
            <SummaryCell key={item.label} {...item} />
          ))}
        </div>
      </section>

      {error ? <div className="rounded-[6px] border border-[#F4B7B7] bg-[#FFF5F5] p-4 text-sm font-bold text-[#B42318]">{error}</div> : null}

      {openingRepair ? (
        <section className="overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-white">
          <div className="flex items-start justify-between gap-4 border-b border-[#E5E7EB] px-5 py-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF6B00]">Apertura de garantía</p>
              <h2 className="mt-2 text-[18px] font-bold tracking-[-0.01em]">{openingRepair.reparacionFolio}</h2>
              <p className="mt-1 text-[13px] font-medium text-[#526174]">Solo registra la falla y evidencia actual. La reparación original no se modifica.</p>
            </div>
            <button type="button" onClick={() => setOpeningRepair(null)} className="h-9 rounded-[6px] border border-[#D1D5DB] px-3 text-xs font-bold text-[#334155]">
              Cancelar
            </button>
          </div>

          <form onSubmit={openWarranty} className="space-y-5 px-5 py-5">
            <div className="grid gap-0 overflow-hidden rounded-[6px] border border-[#E5E7EB] md:grid-cols-5">
              <InfoCell label="Cliente" value={openingRepair.cliente} sub={openingRepair.telefono || "-"} />
              <InfoCell label="Equipo" value={openingRepair.equipo} sub={openingRepair.serie || "Sin serie"} />
              <InfoCell label="Ingreso RX" value={formatDate(openingRepair.fechaIngresoOriginal)} />
              <InfoCell label="Entregado" value={formatDate(openingRepair.inicio)} />
              <InfoCell label="Vence" value={formatDate(openingRepair.vence)} sub={formatRemainingDays(openingRepair.diasRestantes)} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#526174]">Fecha de ingreso</span>
                <input type="date" value={form.fechaIngreso} onChange={(event) => setForm((current) => ({ ...current, fechaIngreso: event.target.value }))} className="h-11 w-full rounded-[6px] border border-[#D1D5DB] px-3 text-sm font-semibold outline-none focus:border-[#0055FF]" />
              </label>
              <label className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#526174]">Recibió garantía</span>
                <select value={form.recibidoPor} onChange={(event) => setForm((current) => ({ ...current, recibidoPor: event.target.value }))} disabled={!isAdminLike && Boolean(currentUserName)} className="h-11 w-full rounded-[6px] border border-[#D1D5DB] bg-white px-3 text-sm font-semibold outline-none focus:border-[#0055FF] disabled:cursor-not-allowed disabled:bg-[#EEF3F7] disabled:text-[#64748B]">
                  <option value="">Seleccionar quién recibió...</option>
                  {receiverOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#526174]">Falla reportada por el cliente</span>
              <textarea value={form.motivo} onChange={(event) => setForm((current) => ({ ...current, motivo: event.target.value }))} rows={4} required className="w-full rounded-[6px] border border-[#D1D5DB] px-3 py-2 text-sm font-semibold outline-none focus:border-[#0055FF]" />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#526174]">Accesorios recibidos</span>
                <select value={form.accesorios} onChange={(event) => setForm((current) => ({ ...current, accesorios: event.target.value }))} className="h-11 w-full rounded-[6px] border border-[#D1D5DB] bg-white px-3 text-sm font-semibold outline-none focus:border-[#0055FF]">
                  <option value="">Seleccionar accesorio...</option>
                  <option value="Sin accesorios">Sin accesorios</option>
                  {accessoryOptions.map((option) => (
                    <option key={option.value} value={option.label}>{option.label}</option>
                  ))}
                  <option value="Otro">Otro</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#526174]">Fotos del estado actual</span>
                <input type="file" accept="image/*" multiple onChange={(event) => setForm((current) => ({ ...current, fotos: Array.from(event.target.files || []) }))} className="block h-11 w-full rounded-[6px] border border-[#D1D5DB] bg-white px-3 py-2 text-sm font-semibold" />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#526174]">Observaciones</span>
              <textarea value={form.observaciones} onChange={(event) => setForm((current) => ({ ...current, observaciones: event.target.value }))} rows={3} className="w-full rounded-[6px] border border-[#D1D5DB] px-3 py-2 text-sm font-semibold outline-none focus:border-[#0055FF]" />
            </label>

            <div className="flex justify-end gap-3 border-t border-[#E5E7EB] pt-4">
              <button type="button" onClick={() => setOpeningRepair(null)} className="h-10 rounded-[6px] border border-[#D1D5DB] px-4 text-sm font-bold text-[#334155]">
                Cancelar
              </button>
              <button type="submit" disabled={savingFolio === openingRepair.reparacionFolio} className="h-10 rounded-[6px] bg-[#0055FF] px-4 text-sm font-bold text-white disabled:opacity-60">
                {savingFolio === openingRepair.reparacionFolio ? "Abriendo..." : "Abrir garantía"}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-white">
        <div className="flex flex-col gap-4 border-b border-[#E5E7EB] px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-[18px] font-bold tracking-[-0.01em]">Listado de garantías</h2>
            
          </div>
          <label className="flex h-11 items-center gap-3 rounded-[6px] border border-[#D1D5DB] bg-white px-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6B7280]">Vista</span>
            <select value={view} onChange={(event) => setView(event.target.value)} className="h-9 min-w-[160px] bg-transparent text-[13px] font-bold outline-none">
              <option value="todas">Todas</option>
              <option value="abiertas">Abiertas</option>
              <option value="vigentes">Vigentes</option>
              <option value="cerradas">Cerradas</option>
            </select>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px]">
            <thead className="bg-[#F8FAFC]">
              <tr>
                <Th>Folio</Th>
                <Th>Cliente</Th>
                <Th>Equipo</Th>
                <Th>Fecha</Th>
                <Th>Recibió</Th>
                <Th>Fase</Th>
                <Th>Vigencia</Th>
                <Th>Vence</Th>
                <Th>Técnico</Th>
                <Th>Actualizar</Th>
                <Th>Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const phase = warrantyPhaseInfo(item);
                const validity = warrantyValidityInfo(item);
                const initials = String(item.cliente || "GT")
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2);
                const closed = isClosedWarranty(item);
                return (
                <tr key={item.folio} className={`border-t border-[#E5E7EB] transition ${closed ? "bg-[#F3F7FA]" : "hover:bg-[#F8FAFC]"}`}>
                  <td className="px-5 py-4 font-mono text-sm font-black text-[#0077B6]">
                    {item.pendingWarranty ? item.reparacionFolio : item.folio}
                    {!item.pendingWarranty ? <p className="mt-1 text-[11px] font-bold text-[#526174]">RX {item.reparacionFolio}</p> : null}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xs font-black ${closed ? "bg-[#EEF2F6] text-[#526174]" : "bg-[#E3F5FC] text-[#0077B6]"}`}>
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#102033]">{item.cliente}</p>
                        <p className="text-xs text-[#526174]">{item.telefono || "Sin teléfono"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-black text-[#102033]">{item.equipo}</p>
                    <p className="text-xs text-[#526174]">{item.serie || "Sin serie"}</p>
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-[#334155]">{formatDate(item.inicio)}</td>
                  <td className="px-4 py-4 text-sm font-bold text-[#334155]">{item.recibidoPor || "Sin registrar"}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${phase.className}`}>
                      {phase.label}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${validity.className}`}>
                      {validity.label}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-[#334155]">
                    <p>{formatDate(item.vence)}</p>
                    <p className="text-xs text-[#6B7280]">{!item.vencida ? formatRemainingDays(item.diasRestantes) : "-"}</p>
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-[#334155]">
                    {item.tecnico || "Sin asignar"}
                  </td>
                  <td className="px-4 py-4">
                    {item.pendingWarranty ? (
                      closed ? (
                        <span className="inline-flex h-9 items-center rounded-[6px] border border-[#D1D5DB] px-3 text-xs font-bold text-[#6B7280]">
                          Fuera de garantía
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startWarrantyForm(item)}
                          disabled={savingFolio === item.reparacionFolio}
                          className="h-9 rounded-[6px] border border-[#D1D5DB] px-3 text-xs font-bold text-[#0055FF] transition hover:bg-[#F8FAFC] disabled:opacity-60"
                        >
                          {savingFolio === item.reparacionFolio ? "Abriendo..." : "Abrir garantía"}
                        </button>
                      )
                    ) : (
                      closed ? (
                        <p className="text-sm font-bold text-[#102033]">Folio cerrado</p>
                      ) : (
                        <Link href={`/admin/garantias/${encodeURIComponent(item.folio)}?vista=actualizar`} className="inline-flex h-9 items-center rounded-[6px] border border-[#B7D7F3] bg-[#F2F8FD] px-4 text-[13px] font-black text-[#0077B6] transition hover:border-[#0077B6] hover:bg-[#E3F5FC]">
                          Actualizar
                        </Link>
                      )
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    {!item.pendingWarranty ? (
                      <div className="relative inline-flex items-center gap-1 rounded-[6px] border border-[#DDE5EE] bg-white p-1">
                        <Link href={`/admin/garantias/${encodeURIComponent(item.folio)}`} className="rounded-xl px-3 py-2 text-xs font-black text-[#0077B6] transition hover:bg-[#E3F5FC]">
                          Ver
                        </Link>
                        <button type="button" onClick={() => setOpenDocsMenu((current) => current === item.folio ? "" : item.folio)} className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#DDE5EE] text-base font-black text-[#0F172A] transition hover:border-[#0077B6] hover:bg-[#F8FAFC]">
                          +
                        </button>
                        {openDocsMenu === item.folio ? (
                          <div className="absolute right-0 top-11 z-20 w-[230px] overflow-hidden rounded-[6px] border border-[#DDE5EE] bg-white text-left shadow-[0_16px_32px_rgba(15,23,42,0.12)]">
                            <div className="border-b border-[#E5E7EB] px-3 py-2">
                              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#64748B]">Garantía</p>
                            </div>
                            <Link className="block px-3 py-2 text-sm font-bold text-[#0F172A] hover:bg-[#F8FAFC]" href={`/admin/garantias/${encodeURIComponent(item.folio)}?vista=recibo`} onClick={() => setOpenDocsMenu("")}>
                              Ver recibo
                            </Link>
                            <label className="block cursor-pointer px-3 py-2 text-sm font-bold text-[#0F172A] hover:bg-[#F8FAFC]">
                              {savingFolio === item.folio ? "Subiendo..." : "Subir recibo firmado"}
                              <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => uploadSignedWarrantyReceipt(item, event)} />
                            </label>
                            {item.documentos?.reciboFirmado?.url ? (
                              <a className="block px-3 py-2 text-sm font-bold text-[#0F172A] hover:bg-[#F8FAFC]" href={fileUrl(item.documentos.reciboFirmado.url)} target="_blank" rel="noreferrer" onClick={() => setOpenDocsMenu("")}>
                                Ver recibo firmado
                              </a>
                            ) : null}
                            <div className="border-t border-[#E5E7EB] px-3 py-2">
                              <p className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-[#64748B]">Comunicación</p>
                              <div className="flex items-center gap-2">
                                <button type="button" onClick={() => { setOpenDocsMenu(""); openWarrantyMessage(item.folio, "whatsapp"); }} className="inline-flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#BBF7D0] bg-white text-[#008A36] transition hover:bg-[#F0FDF4]" title="Enviar WhatsApp" aria-label="Enviar WhatsApp"><WhatsAppIcon /></button>
                                <button type="button" onClick={() => { setOpenDocsMenu(""); openWarrantyMessage(item.folio, "email"); }} className="inline-flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#BFDBFE] bg-white text-[#0077B6] transition hover:bg-[#EFF6FF]" title="Enviar correo" aria-label="Enviar correo"><MailIcon /></button>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </td>
                </tr>
                );
              })}

              {!loading && !filtered.length ? (
                <tr>
                  <td colSpan={11} className="px-6 py-10 text-center text-sm font-bold text-[#6B7280]">
                    No hay garantías para mostrar.
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
    <div className="flex min-h-[86px] items-center justify-between gap-4 border-b border-[#E5E7EB] px-5 py-4 md:border-r md:last:border-r-0">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6B7280]">{label}</p>
        <p className="mt-2 text-[13px] font-medium text-[#6B7280]">{note}</p>
      </div>
      <p className="text-[24px] font-bold leading-none" style={{ color }}>{value}</p>
    </div>
  );
}

function InfoCell({ label, value, sub = "" }) {
  return (
    <div className="border-b border-[#E5E7EB] px-4 py-3 md:border-r md:last:border-r-0">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6B7280]">{label}</p>
      <p className="mt-2 text-sm font-bold text-[#0A0A0A]">{value || "-"}</p>
      {sub ? <p className="mt-1 text-xs font-medium text-[#526174]">{sub}</p> : null}
    </div>
  );
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

function Th({ children }) {
  return <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.13em] text-[#526174]">{children}</th>;
}
