"use client";

import { getToken } from "@/lib/authStorage";
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

function isClosedStatus(value) {
  const status = normalizeStatus(value);
  return ["cerrada", "cerrado", "cancelada", "cancelado", "finalizada", "finalizado"].includes(status);
}

function isClosedWarranty(item) {
  return isClosedStatus(item.estado) || Boolean(item.vencida);
}

function isOpenWarranty(item) {
  return !isClosedStatus(item.estado) && !item.vencida;
}

function isCurrentWarranty(item) {
  return isOpenWarranty(item) && !item.vencida;
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
    estado: item.estado || (expired ? "cerrada" : "vigente"),
    vencida: expired,
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
    estado: expired ? "cerrada" : "vigente",
    vencida: expired,
  };
}

export default function GarantiasPage() {
  const [warranties, setWarranties] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [users, setUsers] = useState([]);
  const [repairOptions, setRepairOptions] = useState({ accesorios: DEFAULT_ACCESSORIES });
  const [query, setQuery] = useState("");
  const [view, setView] = useState("todas");
  const [loading, setLoading] = useState(true);
  const [savingFolio, setSavingFolio] = useState("");
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
    setOpeningRepair(item);
    setError("");
    setForm({
      fechaIngreso: dateOnly(new Date().toISOString()),
      recibidoPor: "",
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
  const receiverOptions = useMemo(() => {
    return activeUsers
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
  }, [activeUsers]);
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
    { label: "Garantías", value: allRows.length, note: "Registradas y por abrir", color: "#0055FF" },
    { label: "Vigentes", value: allRows.filter(isCurrentWarranty).length, note: "Dentro del periodo", color: "#16854E" },
    { label: "Abiertas", value: rows.filter(isOpenWarranty).length, note: "Folios GT activos", color: "#0077B6" },
    { label: "Cerradas", value: allRows.filter(isClosedWarranty).length, note: "Cerradas o vencidas", color: "#C55A11" },
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
                <select value={form.recibidoPor} onChange={(event) => setForm((current) => ({ ...current, recibidoPor: event.target.value }))} className="h-11 w-full rounded-[6px] border border-[#D1D5DB] bg-white px-3 text-sm font-semibold outline-none focus:border-[#0055FF]">
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
          <table className="w-full min-w-[1080px]">
            <thead className="bg-[#F8FAFC]">
              <tr>
                <Th>Folio</Th>
                <Th>RX original</Th>
                <Th>Cliente</Th>
                <Th>Equipo</Th>
                <Th>Inicio</Th>
                <Th>Vence</Th>
                <Th>Estado</Th>
                <Th>Días restantes</Th>
                <Th>Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.folio} className="border-t border-[#E5E7EB] transition hover:bg-[#F8FAFC]">
                  <td className="px-5 py-4 font-mono text-sm font-bold text-[#0077B6]">{item.pendingWarranty ? item.reparacionFolio : item.folio}</td>
                  <td className="px-4 py-4 font-mono text-sm font-bold text-[#334155]">{item.reparacionFolio}</td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-bold">{item.cliente}</p>
                    <p className="text-xs font-medium text-[#6B7280]">{item.telefono || "-"}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-bold">{item.equipo}</p>
                    <p className="text-xs font-medium text-[#6B7280]">{item.serie || "Sin serie"}</p>
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-[#334155]">{formatDate(item.inicio)}</td>
                  <td className="px-4 py-4 text-sm font-bold text-[#334155]">{formatDate(item.vence)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${isClosedWarranty(item) ? "border-[#C9D8E5] bg-[#EEF2F6] text-[#526174]" : "border-[#A8DDC0] bg-[#F0FAF4] text-[#13753A]"}`}>
                      {isClosedWarranty(item) ? "Cerrada" : "Vigente"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-[#334155]">
                    {!isClosedWarranty(item) ? formatRemainingDays(item.diasRestantes) : "-"}
                  </td>
                  <td className="px-4 py-4">
                    {item.pendingWarranty ? (
                      isClosedWarranty(item) ? (
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
                      <div className="inline-flex items-center rounded-[6px] border border-[#D1D5DB] bg-white">
                        <Link href={`/admin/garantias/${encodeURIComponent(item.folio)}`} className="border-r border-[#D1D5DB] px-3 py-2 text-xs font-bold text-[#0055FF]">
                          Ver
                        </Link>
                        <a href={`https://wa.me/52${item.telefono}?text=${encodeURIComponent(item.mensaje?.text || "")}`} target="_blank" rel="noreferrer" className="px-3 py-2 text-xs font-bold text-[#16854E]">
                          WhatsApp
                        </a>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {!loading && !filtered.length ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-sm font-bold text-[#6B7280]">
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

function Th({ children }) {
  return <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.13em] text-[#526174]">{children}</th>;
}
