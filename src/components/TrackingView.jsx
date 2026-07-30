"use client";

import Link from "next/link";
import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const REPAIR_STEPS = [
  { key: "recibido", label: "Recibido" },
  { key: "diagnostico", label: "Diagnóstico" },
  { key: "en_reparacion", label: "En reparación" },
  { key: "esperando_refaccion", label: "En espera" },
  { key: "finalizado", label: "Listo" },
  { key: "entregado", label: "Entregado" },
];

const WARRANTY_STEPS = [
  { key: "abierta", label: "Abierta" },
  { key: "diagnostico", label: "Diagnóstico" },
  { key: "en_reparacion", label: "En reparación" },
  { key: "finalizada", label: "Finalizada" },
  { key: "cerrada", label: "Cerrada" },
];

function formatDate(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (_) {
    return "-";
  }
}

function formatDateTime(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (_) {
    return "-";
  }
}

function photoUrl(foto) {
  const src = foto?.url || foto?.dataUrl || "";
  if (!src) return "";
  if (src.startsWith("http") || src.startsWith("data:")) return src;
  return `${API_BASE}${src}`;
}

function Timeline({ steps, currentKey }) {
  const currentIndex = steps.findIndex((s) => s.key === currentKey);
  return (
    <div className="mt-6 flex items-start justify-between overflow-x-auto pb-2">
      {steps.map((step, index) => {
        const reached = currentIndex >= 0 && index <= currentIndex;
        const isLast = index === steps.length - 1;
        return (
          <div key={step.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <span
                className={`h-3 w-3 rounded-full border-2 ${
                  reached ? "border-[#0b1f4d] bg-[#0b1f4d]" : "border-[#c7cede] bg-white"
                }`}
              />
              <span
                className={`mt-2 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.04em] ${
                  reached ? "text-[#0b1f4d]" : "text-[#9aa5b8]"
                }`}
              >
                {step.label}
              </span>
            </div>
            {!isLast ? (
              <span
                className={`mx-2 mt-[-18px] h-[2px] flex-1 ${
                  index < currentIndex ? "bg-[#0b1f4d]" : "bg-[#d9dfec]"
                }`}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#e4e9f2] py-3 last:border-b-0">
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b7690]">{label}</span>
      <span className="text-right text-sm font-bold text-[#0b1f4d]">{value || "-"}</span>
    </div>
  );
}

function PhotoGrid({ fotos }) {
  if (!fotos || !fotos.length) return null;
  return (
    <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
      {fotos.map((foto, index) => {
        const src = photoUrl(foto);
        if (!src) return null;
        return (
          <a
            key={index}
            href={src}
            target="_blank"
            rel="noreferrer"
            className="block overflow-hidden rounded-md border border-[#e4e9f2]"
          >
            <img
              src={src}
              alt={foto?.nombre || `Foto ${index + 1}`}
              className="h-20 w-full object-cover"
            />
          </a>
        );
      })}
    </div>
  );
}

function PoliciesAccordion() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-6 border-t border-[#e4e9f2] pt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm font-bold text-[#1d4ed8] underline underline-offset-2"
      >
        Ver políticas de servicio
        <span className={`inline-block transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open ? (
        <div className="mt-3 space-y-2 rounded-md border border-[#e4e9f2] bg-white/60 p-4 text-sm font-medium leading-6 text-[#334155]">
          <p>• El taller no se hace responsable por equipos no recogidos después de 30 días naturales desde la notificación de entrega.</p>
          <p>• La garantía cubre exclusivamente la falla diagnosticada y reparada, salvo que se indique lo contrario.</p>
          <p>• Para recoger el equipo, es necesario presentar el folio de la orden.</p>
          <p>• Cualquier duda sobre estas políticas, contáctanos por WhatsApp.</p>
        </div>
      ) : null}
    </div>
  );
}

export function TrackingView({ data, whatsappNumber = "529842330662" }) {
  const isWarranty = data.tipo === "garantia";
  const steps = isWarranty ? WARRANTY_STEPS : REPAIR_STEPS;
  const currentKey = isWarranty
    ? (data.estado === "abierta" ? "abierta" : data.estado)
    : data.estado;

  const historial = Array.isArray(data.historial) ? data.historial : [];
  const equipoTexto = [data.equipo?.marca, data.equipo?.modelo].filter(Boolean).join(" ") || data.equipo?.tipo || "-";

  const closedMessage = isWarranty
    ? (data.estado === "cerrada" ? "Garantía cerrada. Equipo entregado." : null)
    : (data.estado === "entregado" ? "Equipo entregado. Servicio finalizado." : null);

  return (
    <main
      className="min-h-screen px-4 py-10 sm:px-6 lg:px-8"
      style={{
        fontFamily: "Inter, sans-serif",
        background: "linear-gradient(135deg, #fdf1e7 0%, #f7f4fb 45%, #ffffff 100%)",
      }}
    >
      <div className="mx-auto max-w-[720px]">
        <Link href="/" className="text-sm font-bold text-[#334155]">
          ‹ Volver a inicio
        </Link>

        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1d4ed8] underline decoration-2 underline-offset-4">
          Seguimiento
        </p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-[#0b1f4d] sm:text-4xl">
          Consulta el estatus de tu {isWarranty ? "garantía" : "reparación"}.
        </h1>

        {closedMessage ? (
          <div className="mt-4 rounded-md border border-[#b7e2c5] bg-[#effaf3] px-4 py-3 text-sm font-bold text-[#087a31]">
            {closedMessage}
          </div>
        ) : null}

        <Timeline steps={steps} currentKey={currentKey} />

        <div className="mt-8">
          <Field label="Folio" value={data.folio} />
          {isWarranty ? <Field label="Orden relacionada" value={data.reparacionFolio} /> : null}
          <Field label="Equipo" value={equipoTexto} />
          {!isWarranty ? <Field label="Falla reportada" value={data.fallaReportada} /> : null}
          {isWarranty ? <Field label="Motivo" value={data.motivo} /> : null}
          <Field label="Sucursal" value="CLICK.COM del Caribe" />
          <Field label="Actualizado" value={formatDateTime(data.actualizadoEn)} />
          {!isWarranty ? (
            <>
              <Field label="Fecha de ingreso" value={formatDate(data.fechaIngreso)} />
              <Field label="Fecha estimada de entrega" value={formatDate(data.fechaEntregaEstimada)} />
            </>
          ) : null}
        </div>

        <div className="mt-8">
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[#0b1f4d]">
            Avances de tu {isWarranty ? "garantía" : "reparación"}
          </h2>
          <div className="mt-4 space-y-5">
            {historial.length ? (
              historial.map((item, index) => (
                <div key={index} className="border-b border-[#e4e9f2] pb-5 last:border-b-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9aa5b8]">
                    {formatDateTime(item.fecha)} · {item.tecnico || "Taller"}
                  </p>
                  <p className="mt-1 text-base font-black text-[#0b1f4d]">{item.titulo || "Movimiento"}</p>
                  {item.descripcion ? (
                    <p className="mt-1 whitespace-pre-wrap text-sm font-medium text-[#475569]">{item.descripcion}</p>
                  ) : null}
                  <PhotoGrid fotos={item.fotos} />
                </div>
              ))
            ) : (
              <p className="text-sm font-medium text-[#6b7690]">Aún no hay avances registrados.</p>
            )}
          </div>
        </div>

        <PoliciesAccordion />

        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hola, tengo dudas sobre mi folio ${data.folio}`)}`}
          target="_blank"
          rel="noreferrer"
          className="mt-8 flex h-12 w-full items-center justify-center rounded-md bg-[#0b1f4d] text-sm font-black text-white sm:w-auto sm:px-6"
        >
          ¿Dudas? Escríbenos por WhatsApp
        </a>
      </div>
    </main>
  );
}

export default TrackingView;
