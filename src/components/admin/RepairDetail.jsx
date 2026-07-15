"use client";

import Link from "next/link";
import { formatDate, formatTime, formatMoney } from "@/lib/api";
import { getToken } from "@/lib/authStorage";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function value(...items) {
  const found = items.find((item) => item !== undefined && item !== null && item !== "");
  return found === undefined ? "—" : found;
}

function normalizePhotos(repair) {
  const photos = [
    ...(Array.isArray(repair?.photos) ? repair.photos : []),
    ...(Array.isArray(repair?.fotosRecepcion) ? repair.fotosRecepcion : []),
    ...(Array.isArray(repair?.fotos) ? repair.fotos : []),
    ...(Array.isArray(repair?.imagenes) ? repair.imagenes : []),
  ];
  const seen = new Set();
  return photos.filter((photo) => {
    const src = typeof photo === "string" ? photo : photo?.url || photo?.ruta || photo?.src;
    if (!src || seen.has(src)) return false;
    seen.add(src);
    return true;
  });
}

function photoSrc(photo) {
  const src = typeof photo === "string" ? photo : photo?.url || photo?.ruta || photo?.src;
  if (!src) return "";
  if (src.startsWith("data:")) return src;
  const absolute = src.startsWith("http") ? src : `${API_BASE}${src.startsWith("/") ? src : `/${src}`}`;
  if (!absolute.includes("/uploads/") || absolute.includes("token=")) return absolute;
  const token = getToken();
  if (!token) return absolute;
  return `${absolute}${absolute.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}`;
}

function Field({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#DCE8F0] py-2 last:border-b-0">
      <span className="text-[#5D7188]">{label}</span>
      <strong className="text-right font-semibold text-[#102033]">{children || "—"}</strong>
    </div>
  );
}

function Box({ title, children }) {
  return (
    <section className="cc-card bg-white p-4">
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wide text-[#43576F]">{title}</h3>
      {children}
    </section>
  );
}

export default function RepairDetail({ repair }) {
  if (!repair) {
    return (
      <div className="space-y-4 p-6">
        <Link href="/admin/reparaciones" className="text-[#0078B8]">← Volver a reparaciones</Link>
        <section className="cc-card p-5">
          <h1>Orden no encontrada</h1>
          <p className="mt-2 text-[#5D7188]">No existe una reparación con ese folio.</p>
        </section>
      </div>
    );
  }

  const folio = value(repair.folio, repair.id);
  const cliente = repair.cliente || {};
  const equipo = repair.equipo || {};
  const pago = repair.pago || {};
  const anticipo = repair.anticipo || repair.advance || {};
  const garantia = repair.garantia || {};
  const historial = Array.isArray(repair.historial) ? repair.historial : Array.isArray(repair.timeline) ? repair.timeline : [];
  const photos = normalizePhotos(repair);
  const ingreso = value(repair.fechaIngreso, repair.fecha, repair.creadoEn, repair.dateIn);
  const entrada = value(repair.horaEntrada, repair.creadoEn);

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/reparaciones" className="text-sm font-semibold text-[#0078B8]">← Volver a reparaciones</Link>
          <h1 className="mt-2">Orden {folio}</h1>
          <p className="text-[#5D7188]">
            Ingresado el {formatDate(ingreso)} · Recibió: {value(repair.recibio, repair.recibidoPor)} · Técnico: {value(repair.tecnico, repair.tecnicoAsignado)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-md bg-[#0078B8] px-4 py-2 font-semibold text-white"
        >
          Imprimir orden
        </button>
      </div>

      <section className="cc-card bg-white p-5">
        <div className="mb-5 flex items-start justify-between border-b border-[#DCE8F0] pb-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#C76510]">Orden de servicio</p>
            <h2 className="mt-1 text-3xl font-bold">{folio}</h2>
          </div>
          <div className="text-right">
            <strong>CLICK.COM del Caribe</strong>
            <p className="text-xs text-[#5D7188]">Servicio especializado en informática</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Box title="Cliente">
            <Field label="Nombre">{value(cliente.nombre, repair.clienteNombre, repair.client)}</Field>
            <Field label="Teléfono">{value(cliente.telefono, repair.telefono, repair.phone)}</Field>
            <Field label="Correo">{value(cliente.correo, repair.correo, repair.email)}</Field>
          </Box>

          <Box title="Equipo">
            <Field label="Tipo">{value(equipo.tipo, repair.tipoEquipo, repair.deviceType)}</Field>
            <Field label="Marca / modelo">{value([equipo.marca, equipo.modelo].filter(Boolean).join(" "), repair.equipoNombre, repair.device)}</Field>
            <Field label="Número de serie">{value(equipo.serie, repair.numeroSerie, repair.serialNumber)}</Field>
          </Box>

          <Box title="Recepción">
            <Field label="Recibió">{value(repair.recibio, repair.recibidoPor)}</Field>
            <Field label="Hora de entrada">{formatTime(entrada)}</Field>
            <Field label="Técnico / encargado">{value(repair.tecnico, repair.tecnicoAsignado)}</Field>
          </Box>

          <Box title="Fechas y estado">
            <Field label="Ingreso">{formatDate(ingreso)}</Field>
            <Field label="Entrega estimada">{formatDate(value(repair.fechaEntregaEstimada, repair.dateEstimated))}</Field>
            <Field label="Estado">{value(repair.estado, repair.status)}</Field>
          </Box>

          <Box title="Pago y anticipo">
            <Field label="Costo del servicio">{formatMoney(value(pago.costoServicio, repair.costoServicio))}</Field>
            <Field label="Anticipo">{formatMoney(value(anticipo.monto, pago.anticipo, repair.anticipoMonto))}</Field>
            <Field label="Forma de pago">{value(anticipo.formaPago, pago.metodoPago, repair.metodoPago)}</Field>
            <Field label="Saldo">{formatMoney(value(pago.saldoPendiente, pago.saldo, repair.saldo))}</Field>
            <Field label="Factura">{value(pago.factura, repair.factura)}</Field>
          </Box>

          <Box title="Garantía">
            <Field label="Aplica">{value(garantia.aplica, repair.garantiaAplica)}</Field>
            <Field label="Días">{value(garantia.dias, repair.diasGarantia)}</Field>
            <Field label="Nota">{value(garantia.nota, repair.notaGarantia)}</Field>
          </Box>

          <Box title="Falla reportada">
            <p>{value(repair.problema, repair.fallaReportada, repair.problem)}</p>
          </Box>

          <Box title="Observaciones de recepción">
            <p>{value(repair.observacionesRecepcion, repair.observaciones)}</p>
          </Box>

          <Box title="Accesorios recibidos">
            <p>{Array.isArray(repair.accesorios) ? repair.accesorios.join(", ") : value(repair.accesorios)}</p>
          </Box>

          <Box title="Estado físico">
            <p>{Array.isArray(repair.estadoFisico) ? repair.estadoFisico.join(", ") : value(repair.estadoFisico)}</p>
          </Box>
        </div>

        <Box title="Fotos / evidencia">
          {photos.length ? (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {photos.map((photo, index) => (
                <figure key={photoSrc(photo) || index} className="overflow-hidden rounded-md border border-[#DCE8F0]">
                  <img src={photoSrc(photo)} alt={photo?.nombre || `Evidencia ${index + 1}`} className="h-44 w-full object-cover" />
                  <figcaption className="truncate px-2 py-2 text-xs text-[#5D7188]">{photo?.nombre || `Evidencia ${index + 1}`}</figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <p className="text-[#5D7188]">Sin fotos registradas.</p>
          )}
        </Box>

        <Box title="Historial técnico">
          <div className="space-y-3">
            {historial.length ? historial.map((item, index) => (
              <div key={item.id || index} className="rounded-md border border-[#DCE8F0] p-3">
                <div className="flex flex-wrap justify-between gap-2">
                  <strong>{value(item.titulo, item.title, "Movimiento")}</strong>
                  <span className="text-xs text-[#5D7188]">{formatDate(value(item.fecha, item.date, item.creadoEn))} {formatTime(value(item.fecha, item.date, item.creadoEn))}</span>
                </div>
                <p className="mt-1 text-[#334155]">{value(item.descripcion, item.description)}</p>
                <p className="mt-1 text-xs text-[#5D7188]">Por: {value(item.usuario, item.tecnico, item.tech)}</p>
              </div>
            )) : (
              <p className="text-[#5D7188]">Sin movimientos registrados.</p>
            )}
          </div>
        </Box>
      </section>
    </div>
  );
}


