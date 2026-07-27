"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate, formatTime, formatMoney } from "@/lib/api";
import { getSessionUser, getToken } from "@/lib/authStorage";
import { getPaymentStatus } from "@/lib/paymentStatus";

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

const PAYMENT_METHOD_OPTIONS = [
  { value: "por_definir", label: "Por definir" },
  { value: "efectivo", label: "Efectivo" },
  { value: "tarjeta_debito", label: "Tarjeta de débito" },
  { value: "tarjeta_credito", label: "Tarjeta de crédito" },
  { value: "transferencia", label: "Transferencia" },
  { value: "cheque", label: "Cheque" },
];

function printRepairOrder() {
  if (typeof document === "undefined") return;

  const cleanup = () => {
    document.body.classList.remove("printing-repair-order");
  };

  document.body.classList.add("printing-repair-order");
  window.addEventListener("afterprint", cleanup, { once: true });

  window.print();

  window.setTimeout(cleanup, 1500);
}

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
    por_definir: "Por definir",
    efectivo: "Efectivo",
    tarjeta: "Tarjeta",
    tarjeta_debito: "Tarjeta de débito",
    tarjeta_credito: "Tarjeta de crédito",
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

function photoName(photo, fallback) {
  return typeof photo === "string" ? fallback : photo?.nombre || photo?.name || fallback;
}

function EvidenceCard({ photo, alt, imageClassName = "h-40 w-full object-cover" }) {
  const src = photoSrc(photo);
  const name = photoName(photo, alt);

  return (
    <figure className="overflow-hidden rounded-md border border-[#DDE5EE] bg-[#F8FAFC]">
      {src ? (
        <a href={src} target="_blank" rel="noreferrer" className="block" title="Abrir imagen">
          <EvidenceImage photo={photo} alt={name} className={imageClassName} />
        </a>
      ) : (
        <EvidenceImage photo={photo} alt={name} className={imageClassName} />
      )}
      <figcaption className="flex items-center justify-between gap-2 px-2 py-2 text-xs font-semibold text-[#64748B]">
        <span className="min-w-0 truncate">{name}</span>
        {src ? (
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            download={name}
            className="no-print shrink-0 text-[#0055FF] hover:underline"
          >
            Descargar
          </a>
        ) : null}
      </figcaption>
    </figure>
  );
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

function PaymentStatusBox({ status }) {
  const item = status || { label: "Sin pago", color: "#64748B", saldo: 0 };
  return (
    <div className="rounded-md border px-3 py-2" style={{ borderColor: `${item.color}55`, backgroundColor: `${item.color}10` }}>
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#64748B]">Estado de pago</p>
      <p className="mt-1 text-lg font-bold" style={{ color: item.color }}>{item.label}</p>
      {item.saldo > 0 ? <p className="mt-1 text-xs font-bold text-[#526174]">Saldo por liquidar: ${Number(item.saldo).toLocaleString("es-MX")}</p> : null}
    </div>
  );
}

function PaymentHistoryList({ history = [] }) {
  return (
    <div className="mt-3 rounded-md border border-[#E5EAF0] bg-white">
      <div className="border-b border-[#E5EAF0] px-3 py-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#64748B]">Historial de pagos</p>
      </div>
      {history.length ? (
        <div className="divide-y divide-[#E5EAF0]">
          {history.map((item, index) => (
            <div key={`${item.fecha || "pago"}-${index}`} className="grid gap-2 px-3 py-2 text-sm sm:grid-cols-[110px_1fr_110px]">
              <span className="font-semibold text-[#64748B]">{formatDate(value(item.fecha, item.date))}</span>
              <span className="font-semibold text-[#0F172A]">
                {displayText(value(item.formaPago, item.metodoPago, item.method, "Pago"))}
                {item.nota ? <span className="block text-xs font-medium text-[#64748B]">{item.nota}</span> : null}
              </span>
              <span className="font-bold text-[#0B79D0]">{formatMoney(Number(item.monto || item.amount || 0))}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="px-3 py-2 text-sm font-semibold text-[#64748B]">Sin pagos registrados.</p>
      )}
    </div>
  );
}

function paymentHistoryOf(repair = {}) {
  const pago = repair.pago || repair.payment || {};
  const anticipo = repair.anticipo || repair.advance || {};
  const history = Array.isArray(pago.historialPagos) ? pago.historialPagos : [];
  if (history.length) return history;
  const initialAmount = Number(value(anticipo.monto, pago.anticipo, repair.anticipoMonto, 0));
  if (!Number.isFinite(initialAmount) || initialAmount <= 0) return [];
  return [{
    fecha: value(repair.creadoEn, repair.fechaIngreso, repair.dateIn),
    monto: initialAmount,
    formaPago: value(anticipo.formaPago, pago.metodoPago, repair.metodoPago, "por_definir"),
    nota: "Pago registrado al crear la orden",
    usuario: value(repair.recibio, repair.recibidoPor, "Sistema"),
  }];
}

function paymentTotal(history = []) {
  return history.reduce((sum, item) => {
    const amount = Number(item?.monto || item?.amount || 0);
    return Number.isFinite(amount) ? sum + amount : sum;
  }, 0);
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
  const paymentHistory = paymentHistoryOf(current);
  const anticipoMonto = paymentTotal(paymentHistory) || value(anticipo.monto, pago.anticipo, current.anticipoMonto, 0);
  const saldo = value(pago.saldoPendiente, pago.saldo, current.saldo, 0);
  const estadoPago = getPaymentStatus(current);
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
          <button type="button" onClick={printRepairOrder} className="rounded-md border border-[#DDE5EE] bg-white px-4 py-2 text-sm font-semibold text-[#0F172A]">
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

        <div className="repair-print-grid grid gap-4 lg:grid-cols-2">
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

          <Panel title="Recepción y asignación">
            <Field label="Recibió">{value(current.recibio, current.recibidoPor)}</Field>
            <Field label="Hora">{formatTime(entrada)}</Field>
            <Field label="Técnico">{value(current.tecnico, current.tecnicoAsignado)}</Field>
            <Field label="Autorización">{displayText(value(current.autorizacion?.metodo, current.authorizationMethod))}</Field>
            <Field label="Autoriza">{value(current.autorizacion?.autorizadoPor, current.authorizedBy)}</Field>
          </Panel>

          <Panel id="garantia" title="Pago, factura y garantía">
            <div className="grid gap-3 sm:grid-cols-3">
              <MoneyBox label="Costo" value={costo} accent="#0F172A" />
              <MoneyBox label="Pago recibido" value={anticipoMonto} accent="#0B79D0" />
              <MoneyBox label="Saldo" value={saldo} accent="#B45309" />
            </div>
            <div className="mt-3">
              <PaymentStatusBox status={estadoPago} />
            </div>
            <div className="mt-3">
              <Field label="Forma pago">{displayText(value(anticipo.formaPago, pago.metodoPago, current.metodoPago))}</Field>
              <Field label="Factura">{asText(value(pago.factura, current.factura))}</Field>
              <Field label="Garantía">{asText(value(garantia.aplica, current.garantiaAplica))}</Field>
              <Field label="Días">{value(garantia.dias, current.diasGarantia)}</Field>
              <Field label="Nota">{value(garantia.nota, garantia.notas, current.notaGarantia)}</Field>
            </div>
            <PaymentHistoryList history={paymentHistory} />
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
                <EvidenceCard key={photoSrc(photo) || index} photo={photo} alt={`Evidencia ${index + 1}`} />
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
                        <EvidenceCard key={photoSrc(photo) || photoIndex} photo={photo} alt={`Foto de avance ${photoIndex + 1}`} imageClassName="h-28 w-full object-cover" />
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
  const availableStatusOptions = STATUS_OPTIONS.filter((item) => item.value === currentStatus || allowedNextStatuses.includes(item.value));
  const paymentHistory = paymentHistoryOf(repair);
  const totalPagado = paymentTotal(paymentHistory) || Number(value(anticipo.monto, pago.anticipo, repair.anticipoMonto, 0));
  const costoActual = Number(value(pago.costoServicio, pago.costo, repair.costoServicio, 0));
  const [form, setForm] = useState(() => ({
    estado: currentStatus,
    tecnico: repair.tecnico || "",
    diagnostico: "",
    observacion: "",
    visibleCliente: false,
    costoServicio: String(value(pago.costoServicio, pago.costo, repair.costoServicio, "")),
    nuevoPago: "",
    formaPago: value(anticipo.formaPago, pago.metodoPago, repair.metodoPago, ""),
    notaPago: "",
    fotosVisibles: false,
  }));
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const statusRequiresNote = ["esperando_refaccion", "entregado"].includes(form.estado);
  const nuevoPagoPreview = Number(form.nuevoPago || 0);
  const nuevoPagoSeguro = Number.isFinite(nuevoPagoPreview) && nuevoPagoPreview > 0 ? nuevoPagoPreview : 0;
  const saldoActual = Math.max(0, Number(form.costoServicio || 0) - totalPagado);
  const nuevoPagoExcede = canManagePayment && nuevoPagoSeguro > saldoActual;
  const saldoDespues = Math.max(0, Number(form.costoServicio || 0) - totalPagado - nuevoPagoSeguro);
  const quedariaLiquidado = Number(form.costoServicio || 0) > 0 && saldoDespues === 0;

  function set(name) {
    return (event) => setForm((current) => ({ ...current, [name]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));
  }

  function setNuevoPago(event) {
    const raw = event.target.value;
    if (raw === "") {
      setForm((current) => ({ ...current, nuevoPago: "" }));
      return;
    }

    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return;

    const maxPayment = Math.max(0, Number(form.costoServicio || 0) - totalPagado);
    const limitedPayment = Math.min(Math.max(parsed, 0), maxPayment);
    setForm((current) => ({ ...current, nuevoPago: String(limitedPayment) }));
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const token = getToken();
      const newPhotos = await prepareFiles(files, form.fotosVisibles);
      const costo = Number(form.costoServicio || 0);
      const nuevoPago = Number(form.nuevoPago || 0);
      const hasPaymentChange = canManagePayment && (nuevoPago > 0 || costo !== costoActual || form.formaPago !== value(anticipo.formaPago, pago.metodoPago, repair.metodoPago, ""));
      const hasProcessChange = form.estado !== repair.estado || form.diagnostico.trim() || form.observacion.trim() || newPhotos.length > 0;
      if (hasProcessChange && statusRequiresNote && !form.observacion.trim()) throw new Error("Agrega una observación para este cambio de estado.");
      if (!hasProcessChange && !hasPaymentChange) {
        throw new Error("Agrega un avance, cambia el estado o registra un pago.");
      }
      if (canManagePayment && nuevoPago < 0) {
        throw new Error("El nuevo pago no puede ser negativo.");
      }
      if (canManagePayment && costo > 0 && nuevoPago > Math.max(0, costo - totalPagado)) {
        throw new Error(`El nuevo pago no puede ser mayor al saldo pendiente (${formatMoney(Math.max(0, costo - totalPagado))}).`);
      }

      const payload = {
      };
      if (hasProcessChange) {
        payload.estado = form.estado;
        payload.observacionesCliente = form.observacion.trim() || repair.observacionesCliente || "";
        payload.historialItem = {
          estado: form.estado,
          titulo: `Actualización: ${statusLabel(form.estado)}`,
          descripcion: [form.diagnostico.trim(), form.observacion.trim()].filter(Boolean).join("\n\n"),
          visibleCliente: true,
          tecnico: repair.tecnico || "Taller",
          fotos: newPhotos,
        };
      }
      if (canManagePayment) {
        payload.pago = { ...(repair.pago || {}), costoServicio: costo, metodoPago: form.formaPago || "" };
        payload.nuevoPago = { monto: nuevoPago, formaPago: form.formaPago || "", nota: form.notaPago.trim() };
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
        <ReadOnlyBox label="Técnico asignado">{repair.tecnico || "Sin asignar"}</ReadOnlyBox>

        {canManagePayment ? (
          <div className="lg:col-span-2 rounded-md border border-[#E5EAF0] bg-[#F8FAFC] p-3">
            <div className="grid gap-3 md:grid-cols-4">
              <MoneyBox label="Costo" value={form.costoServicio || 0} />
              <MoneyBox label="Pagado" value={totalPagado} accent="#0B79D0" />
              <MoneyBox label="Falta por pagar" value={saldoDespues} accent={quedariaLiquidado ? "#16854E" : "#B45309"} />
              <InputText label="Nuevo pago" type="number" min="0" max={saldoActual} step="0.01" value={form.nuevoPago} onChange={setNuevoPago} />
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <InputSelect label="Forma de pago" value={form.formaPago} onChange={set("formaPago")} options={PAYMENT_METHOD_OPTIONS} />
              <InputText label="Nota del pago" value={form.notaPago} onChange={set("notaPago")} placeholder="Referencia o comentario opcional" />
            </div>
            <p className="mt-3 rounded-md border border-[#DDE5EE] bg-white px-3 py-2 text-sm font-semibold text-[#334155]">
              {nuevoPagoExcede
                ? `El nuevo pago no puede ser mayor a ${formatMoney(saldoActual)}.`
                : quedariaLiquidado
                  ? "Con este pago la orden quedará liquidada."
                  : `Después de este pago faltarán ${formatMoney(saldoDespues)}.`}
            </p>
            <PaymentHistoryList history={paymentHistory} />
          </div>
        ) : null}

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
          <button disabled={saving || nuevoPagoExcede} className="rounded-md bg-[#0055FF] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">
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
    <Panel title="Comunicación">
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






