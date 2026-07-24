"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate, formatTime, formatMoney } from "@/lib/api";
import { getSessionUser, getToken } from "@/lib/authStorage";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const CLOSED_STATUSES = new Set(["entregado"]);
const STATUS_OPTIONS = [
  { value: "recibido", label: "Recibido" },
  { value: "diagnostico", label: "Diagnóstico" },
  { value: "en_reparacion", label: "En reparación" },
  { value: "esperando_refaccion", label: "En espera" },
  { value: "finalizado", label: "Listo" },
  { value: "entregado", label: "Entregado" },
];

const STATUS_FLOW = {
  recibido: ["diagnostico", "en_reparacion", "esperando_refaccion", "finalizado", "entregado"],
  diagnostico: ["en_reparacion", "esperando_refaccion", "finalizado", "entregado"],
  en_reparacion: ["esperando_refaccion", "finalizado", "entregado"],
  esperando_refaccion: ["en_reparacion", "finalizado", "entregado"],
  finalizado: ["entregado"],
  entregado: [],
};
function value(...items) {
  const found = items.find((item) => item !== undefined && item !== null && item !== "");
  return found === undefined ? "-" : found;
}

function asText(item) {
  if (Array.isArray(item)) return item.length ? item.map(displayText).join(", ") : "-";
  if (typeof item === "boolean") return item ? "Si" : "No";
  return displayText(value(item));
}

function displayText(item) {
  const text = String(value(item)).trim();
  if (!text || text === "-") return "-";
  const labels = {
    sin_danos: "Sin daños",
    rayones: "Rayones",
    golpes: "Golpes",
    pantalla_rota: "Pantalla rota",
    sin_cargador: "Sin cargador",
    buen_estado: "Buen estado",
    efectivo: "Efectivo",
    tarjeta: "Tarjeta",
    transferencia: "Transferencia",
    diagnostico: "Diagnóstico",
    en_reparacion: "En reparación",
    esperando_refaccion: "En espera",
    finalizado: "Listo",
    entregado: "Entregado",
  };
  const key = text.toLowerCase();
  if (labels[key]) return labels[key];
  return text.replace(/_/g, " ");
}

function statusLabel(status) {
  return STATUS_OPTIONS.find((item) => item.value === status)?.label || status || "Recibido";
}

function normalizePhotos(repair) {
  const photos = [
    ...(Array.isArray(repair?.fotosRecepcion) ? repair.fotosRecepcion : []),
    ...(Array.isArray(repair?.equipo?.fotosRecepcion) ? repair.equipo.fotosRecepcion : []),
  ];
  const seen = new Set();
  return photos.filter((photo) => {
    const src = typeof photo === "string" ? photo : photo?.url || photo?.ruta || photo?.src || photo?.path || photo?.dataUrl || "";
    const cleanSrc = String(src).split("?")[0].trim();
    const name = String(typeof photo === "string" ? "" : photo?.nombre || photo?.name || "").trim().toLowerCase();
    const fileSignature = [photo?.size, photo?.lastModified].filter(Boolean).join("|");
    const aliases = [cleanSrc, name, fileSignature, [name, fileSignature].filter(Boolean).join("|")]
      .filter(Boolean)
      .map((item) => String(item).toLowerCase());

    if (!aliases.length || aliases.some((alias) => seen.has(alias))) return false;
    aliases.forEach((alias) => seen.add(alias));
    return true;
  });
}

function photoSrc(photo) {
  const src = typeof photo === "string"
    ? photo
    : photo?.signedUrl || photo?.publicUrl || photo?.url || photo?.ruta || photo?.src || photo?.dataUrl;
  if (!src) return "";
  if (src.startsWith("data:")) return src;
  if (/^https?:\/\//i.test(src)) return src;
  if (!src.startsWith("/") && photo?.storage === "supabase") return "";
  const absolute = src.startsWith("http") ? src : `${API_BASE}${src.startsWith("/") ? src : `/${src}`}`;
  if (!absolute.includes("/uploads/") || absolute.includes("token=")) return absolute;
  const token = getToken();
  return token ? `${absolute}${absolute.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}` : absolute;
}

function EvidenceImage({ photo, alt, className }) {
  const [failed, setFailed] = useState(false);
  const src = photoSrc(photo);
  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-[#F1F5F9] px-3 text-center text-xs font-bold text-[#64748B] ${className}`}>
        Imagen no disponible
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function prepareFiles(files, visibleCliente) {
  return Promise.all(Array.from(files || []).map(async (file) => ({
    nombre: file.name,
    name: file.name,
    tipo: "avance",
    visibleCliente,
    dataUrl: await fileToDataUrl(file),
  })));
}

function Field({ label, children }) {
  return (
    <div className="grid grid-cols-[135px_1fr] gap-3 border-b border-[#E5EAF0] py-2 last:border-b-0">
      <span className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">{label}</span>
      <strong className="min-w-0 text-[13px] font-semibold text-[#0F172A]">{children || "-"}</strong>
    </div>
  );
}

function Panel({ title, children, className = "", id }) {
  return (
    <section id={id} className={`rounded-md border border-[#DDE5EE] bg-white ${className}`}>
      <h3 className="border-b border-[#E5EAF0] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#0B79D0]">{title}</h3>
      <div className="px-4 py-3">{children}</div>
    </section>
  );
}

function MoneyBox({ label, value: amount, accent = "#0F172A" }) {
  const parsed = Number(amount);
  const safeAmount = Number.isFinite(parsed) ? parsed : 0;
  return (
    <div className="rounded-md border border-[#E5EAF0] bg-[#F8FAFC] px-3 py-2">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#64748B]">{label}</p>
      <p className="mt-1 text-lg font-bold" style={{ color: accent }}>{formatMoney(safeAmount)}</p>
    </div>
  );
}

export default function RepairDetail({ repair, initialView = "ficha", onRepairUpdated }) {
  const [localRepair, setLocalRepair] = useState(repair);
  const [activeView, setActiveView] = useState(initialView);
  const current = localRepair || repair;

  if (!current) {
    return (
      <div className="space-y-4 p-6">
        <Link href="/admin/reparaciones" className="text-[#0078B8]">Volver a reparaciones</Link>
        <section className="cc-card p-5">
          <h1>Orden no encontrada</h1>
          <p className="mt-2 text-[#5D7188]">No existe una reparación con ese folio.</p>
        </section>
      </div>
    );
  }

  const folio = value(current.folio, current.id);
  const cliente = current.cliente || {};
  const equipo = current.equipo || {};
  const pago = current.pago || current.payment || {};
  const anticipo = current.anticipo || current.advance || {};
  const garantia = current.garantia || {};
  const historial = Array.isArray(current.historial) ? current.historial : Array.isArray(current.timeline) ? current.timeline : [];
  const photos = normalizePhotos(current);
  const ingreso = value(current.fechaIngreso, current.fecha, current.creadoEn, current.dateIn);
  const entrada = value(current.horaEntrada, current.creadoEn);
  const costo = value(pago.costoServicio, pago.costo, current.costoServicio, 0);
  const anticipoMonto = value(anticipo.monto, pago.anticipo, current.anticipoMonto, 0);
  const saldo = value(pago.saldoPendiente, pago.saldo, current.saldo, 0);
  const accesorios = value(current.accesorios, equipo.accesorios);
  const estadoFisico = value(current.estadoFisico, equipo.estadoFisico);
  const observaciones = value(current.observacionesRecepcion, equipo.observacionesRecepcion, current.observaciones);
  const isClosed = CLOSED_STATUSES.has(current.estado || current.status);

  function handleUpdated(updated) {
    setLocalRepair(updated);
    onRepairUpdated?.(updated);
    setActiveView("ficha");
  }

  if (activeView === "actualizar" && !isClosed) {
    return (
      <div className="space-y-4 p-4 md:p-6" style={{ fontFamily: "var(--cc-font), Inter, Arial, sans-serif" }}>
        <div className="no-print flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href="/admin/reparaciones" className="text-sm font-semibold text-[#0078B8]">Volver a reparaciones</Link>
            <h1 className="mt-2">Actualizar orden {folio}</h1>
            <p className="text-[#5D7188]">
              Solo se registran avances, pagos permitidos, fotos y cambios de estado. La ficha inicial queda cerrada.
            </p>
          </div>
          <button type="button" onClick={() => setActiveView("ficha")} className="rounded-md border border-[#DDE5EE] bg-white px-4 py-2 text-sm font-semibold text-[#0F172A]">
            Ver ficha
          </button>
        </div>

        <UpdateRepairPanel repair={current} folio={folio} currentPhotos={photos} onCancel={() => setActiveView("ficha")} onUpdated={handleUpdated} />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 md:p-6" style={{ fontFamily: "var(--cc-font), Inter, Arial, sans-serif" }}>
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/reparaciones" className="text-sm font-semibold text-[#0078B8]">Volver a reparaciones</Link>
          <h1 className="mt-2">Orden {folio}</h1>
          <p className="text-[#5D7188]">
            Ingresado el {formatDate(ingreso)} · Recibió: {value(current.recibio, current.recibidoPor)} · Técnico: {value(current.tecnico, current.tecnicoAsignado)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => window.print()} className="rounded-md border border-[#DDE5EE] bg-white px-4 py-2 text-sm font-semibold text-[#0F172A]">
            Imprimir orden
          </button>
        </div>
      </div>

      <article className="repair-print-area rounded-md border border-[#CBD5E1] bg-white p-5 text-[#0F172A]">
        <header className="mb-4 flex flex-wrap items-start justify-between gap-4 border-b-2 border-[#0B79D0] pb-4">
          <div className="flex items-center gap-4">
            <img src="/logo-clickcom.png.png" alt="CLICK.COM del Caribe" className="h-16 w-auto object-contain" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF6B00]">Orden de servicio</p>
              <h2 className="mt-1 text-3xl font-bold leading-tight text-[#0F172A]">{folio}</h2>
              <p className="mt-1 text-xs font-semibold text-[#64748B]">CLICK.COM del Caribe · Servicio especializado en informática</p>
            </div>
          </div>

          <div className="min-w-[210px] rounded-md border border-[#DDE5EE] bg-[#F8FAFC] p-3 text-sm">
            <Field label="Estado">{statusLabel(value(current.estado, current.status))}</Field>
            <Field label="Ingreso">{formatDate(ingreso)}</Field>
            <Field label="Entrega">{formatDate(value(current.fechaEntregaEstimada, current.dateEstimated))}</Field>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Datos del cliente">
            <Field label="Nombre">{value(cliente.nombre, current.clienteNombre, current.client)}</Field>
            <Field label="Teléfono">{value(cliente.telefono, current.telefono, current.phone)}</Field>
            <Field label="Correo">{value(cliente.correo, current.correo, current.email)}</Field>
            <Field label="Contacto">{value(current.canalContacto, current.contactChannel)}</Field>
          </Panel>

          <Panel title="Datos del equipo">
            <Field label="Tipo">{value(equipo.tipo, current.tipoEquipo, current.deviceType)}</Field>
            <Field label="Marca">{value(equipo.marca, current.marca)}</Field>
            <Field label="Modelo">{value(equipo.modelo, current.modelo)}</Field>
            <Field label="Serie">{value(equipo.serie, current.numeroSerie, current.serialNumber)}</Field>
            <Field label="Contraseña">{value(equipo.passwordEquipo, current.passwordEquipo)}</Field>
          </Panel>

          <Panel title="Recepcion y asignacion">
            <Field label="Recibió">{value(current.recibio, current.recibidoPor)}</Field>
            <Field label="Hora">{formatTime(entrada)}</Field>
            <Field label="Tecnico">{value(current.tecnico, current.tecnicoAsignado)}</Field>
            <Field label="Autorizacion">{value(current.autorizacion?.metodo, current.authorizationMethod)}</Field>
            <Field label="Autoriza">{value(current.autorizacion?.autorizadoPor, current.authorizedBy)}</Field>
          </Panel>

          <Panel id="garantia" title="Pago y garantia">
            <div className="grid gap-3 sm:grid-cols-3">
              <MoneyBox label="Costo" value={costo} accent="#0F172A" />
              <MoneyBox label="Pago recibido" value={anticipoMonto} accent="#0B79D0" />
              <MoneyBox label="Saldo" value={saldo} accent="#B45309" />
            </div>
            <div className="mt-3">
              <Field label="Forma pago">{value(anticipo.formaPago, pago.metodoPago, current.metodoPago)}</Field>
              <Field label="Factura">{asText(value(pago.factura, current.factura))}</Field>
              <Field label="Garantia">{asText(value(garantia.aplica, current.garantiaAplica))}</Field>
              <Field label="Días">{value(garantia.dias, current.diasGarantia)}</Field>
              <Field label="Nota">{value(garantia.nota, garantia.notas, current.notaGarantia)}</Field>
            </div>
          </Panel>

          <Panel title="Falla reportada" className="lg:col-span-2">
            <p className="whitespace-pre-wrap text-sm leading-6 text-[#0F172A]">{value(current.problema, current.fallaReportada, current.problem)}</p>
          </Panel>

          <Panel title="Condiciones de recepcion">
            <Field label="Accesorios">{asText(accesorios)}</Field>
            <Field label="Estado físico">{asText(estadoFisico)}</Field>
          </Panel>

          <Panel title="Observaciones">
            <p className="whitespace-pre-wrap text-sm leading-6 text-[#0F172A]">{observaciones}</p>
          </Panel>
        </div>

        <Panel title="Fotos / evidencia" className="mt-4">
          {photos.length ? (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {photos.map((photo, index) => (
                <figure key={photoSrc(photo) || index} className="overflow-hidden rounded-md border border-[#DDE5EE] bg-[#F8FAFC]">
                  <EvidenceImage photo={photo} alt={photo?.nombre || `Evidencia ${index + 1}`} className="h-40 w-full object-cover" />
                  <figcaption className="truncate px-2 py-2 text-xs font-semibold text-[#64748B]">{photo?.nombre || photo?.name || `Evidencia ${index + 1}`}</figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#64748B]">Sin fotos registradas.</p>
          )}
        </Panel>

        <Panel title="Historial tecnico" className="mt-4">
          <div className="space-y-2">
            {historial.length ? historial.map((item, index) => (
              <div key={item.id || index} className="grid gap-3 rounded-md border border-[#E5EAF0] bg-[#F8FAFC] p-3 md:grid-cols-[170px_1fr_130px]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#64748B]">{formatDate(value(item.fecha, item.date, item.creadoEn))}</p>
                  <p className="mt-1 text-xs font-semibold text-[#64748B]">{formatTime(value(item.fecha, item.date, item.creadoEn))}</p>
                </div>
                <div>
                  <strong className="text-sm text-[#0F172A]">{value(item.titulo, item.title, "Movimiento")}</strong>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-[#334155]">{value(item.descripcion, item.description)}</p>
                  {Array.isArray(item.fotos) && item.fotos.length ? (
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {item.fotos.map((photo, photoIndex) => (
                        <figure key={photoSrc(photo) || photoIndex} className="overflow-hidden rounded-md border border-[#DDE5EE] bg-white">
                          <EvidenceImage photo={photo} alt={photo?.nombre || `Foto de avance ${photoIndex + 1}`} className="h-28 w-full object-cover" />
                          <figcaption className="truncate px-2 py-1.5 text-[11px] font-semibold text-[#64748B]">{photo?.nombre || photo?.name || `Foto de avance ${photoIndex + 1}`}</figcaption>
                        </figure>
                      ))}
                    </div>
                  ) : null}
                </div>
                <p className="text-xs font-semibold text-[#64748B]">Por: {value(item.usuario, item.tecnico, item.tech)}</p>
              </div>
            )) : (
              <p className="text-sm text-[#64748B]">Sin movimientos registrados.</p>
            )}
          </div>
        </Panel>

      </article>
    </div>
  );
}

function UpdateRepairPanel({ repair, folio, currentPhotos, onCancel, onUpdated }) {
  const pago = repair.pago || repair.payment || {};
  const anticipo = repair.anticipo || repair.advance || {};
  const user = getSessionUser();
  const role = String(user?.rol || user?.role || "").toLowerCase();
  const canManagePayment = ["admin", "gerencia", "ventas"].includes(role);
  const currentStatus = repair.estado || "recibido";
  const allowedNextStatuses = STATUS_FLOW[currentStatus] || [];
  const availableStatusOptions = STATUS_OPTIONS.filter((item) => allowedNextStatuses.includes(item.value));
  const [form, setForm] = useState(() => ({
    estado: availableStatusOptions[0]?.value || currentStatus,
    tecnico: repair.tecnico || "",
    diagnostico: "",
    observacion: "",
    visibleCliente: false,
    costoServicio: String(value(pago.costoServicio, pago.costo, repair.costoServicio, "")),
    pagoRecibido: String(value(anticipo.monto, pago.anticipo, repair.anticipoMonto, "")),
    formaPago: value(anticipo.formaPago, pago.metodoPago, repair.metodoPago, ""),
    fotosVisibles: false,
  }));
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const statusRequiresNote = ["esperando_refaccion", "entregado"].includes(form.estado);

  function set(name) {
    return (event) => setForm((current) => ({ ...current, [name]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (statusRequiresNote && !form.observacion.trim()) throw new Error("Agrega una observación para este cambio de estado.");
      if (form.estado === repair.estado) throw new Error("Selecciona un estado diferente para registrar un nuevo proceso.");
      const token = getToken();
      const newPhotos = await prepareFiles(files, form.fotosVisibles);
      const costo = Number(form.costoServicio || 0);
      const recibido = Number(form.pagoRecibido || 0);
      if (canManagePayment && costo > 0 && recibido > costo) {
        throw new Error("El pago recibido no puede ser mayor al costo.");
      }
      const saldo = Math.max(0, costo - recibido);

      const payload = {
        estado: form.estado,
        observacionesCliente: form.observacion.trim() || repair.observacionesCliente || "",
        historialItem: {
          estado: form.estado,
          titulo: `Actualización: ${statusLabel(form.estado)}`,
          descripcion: [form.diagnostico.trim(), form.observacion.trim()].filter(Boolean).join("\n\n"),
          visibleCliente: true,
          tecnico: form.tecnico.trim() || repair.tecnico || "Taller",
          fotos: newPhotos,
        },
      };
      if (canManagePayment) {
        payload.pago = { ...(repair.pago || {}), costoServicio: costo, saldoPendiente: saldo, metodoPago: form.formaPago || "" };
        payload.anticipo = { ...(repair.anticipo || {}), dioAnticipo: recibido > 0, monto: recibido, formaPago: form.formaPago };
      }

      const response = await fetch(`${API_BASE}/api/reparaciones/${encodeURIComponent(folio)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo actualizar la reparación");
      onUpdated?.(data.reparacion);
    } catch (err) {
      setError(err.message || "No se pudo actualizar la reparación.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-md border border-[#B7D7F3] bg-white p-4">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-[#E5EAF0] pb-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0055FF]">Actualización de orden</p>
          <h2 className="mt-1 text-xl font-bold text-[#0F172A]">{folio}</h2>
        </div>
        <button type="button" onClick={onCancel} className="rounded-md border border-[#DDE5EE] px-3 py-2 text-sm font-semibold text-[#334155]">Cancelar</button>
      </div>

      {error ? <div className="mb-4 rounded-md border border-[#FDA4AF] bg-[#FFF1F2] px-3 py-2 text-sm font-bold text-[#BE123C]">{error}</div> : null}

      <form onSubmit={submit} className="grid gap-4 lg:grid-cols-2">
        <InputSelect label="Estado" value={form.estado} onChange={set("estado")} options={availableStatusOptions} />
        <ReadOnlyBox label="Tecnico asignado">{repair.tecnico || "Sin asignar"}</ReadOnlyBox>

        <InputArea label="Diagnóstico / avance" value={form.diagnostico} onChange={set("diagnostico")} />
        <InputArea label={statusRequiresNote ? "Observación obligatoria" : "Observación"} value={form.observacion} onChange={set("observacion")} />

        <div className="lg:col-span-2 rounded-md border border-[#E5EAF0] bg-[#F8FAFC] p-3">
          <label className="block text-[12px] font-bold uppercase tracking-[0.08em] text-[#64748B]">Fotos de actualización</label>
          <input type="file" accept="image/*" multiple onChange={(event) => setFiles(event.target.files)} className="mt-2 w-full text-sm" />
          <label className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#334155]">
            <input type="checkbox" checked={form.fotosVisibles} onChange={set("fotosVisibles")} />
            Marcar fotos nuevas como visibles para el cliente
          </label>
          <label className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#334155]">
            <input type="checkbox" checked readOnly disabled />
            Mostrar este avance en la página de seguimiento
          </label>
        </div>

        <div className="lg:col-span-2 flex justify-end">
          <button disabled={saving} className="rounded-md bg-[#0055FF] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">
            {saving ? "Guardando..." : "Guardar actualización"}
          </button>
        </div>
      </form>
    </section>
  );
}

function InputText({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#64748B]">{label}</span>
      <input {...props} className="mt-1.5 h-10 w-full rounded-md border border-[#DDE5EE] px-3 text-sm font-semibold outline-none focus:border-[#0055FF]" />
    </label>
  );
}

function ReadOnlyBox({ label, children }) {
  return (
    <div className="block">
      <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#64748B]">{label}</span>
      <div className="mt-1.5 flex min-h-10 items-center rounded-md border border-[#E5EAF0] bg-[#F8FAFC] px-3 text-sm font-semibold text-[#64748B]">
        {children}
      </div>
    </div>
  );
}

function InputSelect({ label, options, ...props }) {
  return (
    <label className="block">
      <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#64748B]">{label}</span>
      <select {...props} className="mt-1.5 h-10 w-full rounded-md border border-[#DDE5EE] px-3 text-sm font-semibold outline-none focus:border-[#0055FF]">
        {options.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>
    </label>
  );
}

function InputArea({ label, ...props }) {
  return (
    <label className="block lg:col-span-2">
      <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#64748B]">{label}</span>
      <textarea {...props} rows={4} className="mt-1.5 w-full rounded-md border border-[#DDE5EE] px-3 py-2 text-sm font-semibold outline-none focus:border-[#0055FF]" />
    </label>
  );
}

function CommunicationPanel({ folio }) {
  const [loading, setLoading] = useState("");

  async function openMessage(type) {
    setLoading(type);
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/api/reparaciones/${encodeURIComponent(folio)}/${type}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo preparar el mensaje");
      const url = type === "whatsapp" ? data.whatsappUrl : data.mailtoUrl;
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      alert(err.message || "No se pudo abrir el mensaje");
    } finally {
      setLoading("");
    }
  }

  return (
    <Panel title="ComunicaciÃ³n">
      <div className="grid gap-2 sm:grid-cols-2">
        <ActionButton onClick={() => openMessage("whatsapp")} disabled={loading === "whatsapp"}>
          {loading === "whatsapp" ? "Preparando..." : "Enviar WhatsApp"}
        </ActionButton>
        <ActionButton onClick={() => openMessage("email")} disabled={loading === "email"}>
          {loading === "email" ? "Preparando..." : "Enviar correo"}
        </ActionButton>
      </div>
      <p className="mt-3 text-xs font-semibold text-[#64748B]">El mensaje usa el folio y el enlace privado de seguimiento.</p>
    </Panel>
  );
}

function ActionButton({ children, ...props }) {
  return (
    <button type="button" {...props} className="rounded-md border border-[#DDE5EE] bg-[#F8FAFC] px-3 py-2 text-left text-sm font-bold text-[#0F172A] transition hover:border-[#0055FF] hover:bg-white disabled:cursor-not-allowed disabled:opacity-50">
      {children}
    </button>
  );
}






