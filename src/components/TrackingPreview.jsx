"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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

function formatTime(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (_) {
    return "";
  }
}

const STATUS_LABELS = {
  recibido: "Recibido",
  diagnostico: "Diagnóstico",
  en_reparacion: "En reparación",
  esperando_refaccion: "En espera de refacción",
  finalizado: "Listo para entrega",
  entregado: "Entregado",
  abierta: "Abierta",
  finalizada: "Finalizada",
  cerrada: "Cerrada",
};

function textValue(...values) {
  const found = values.find((item) => item !== undefined && item !== null && String(item).trim() !== "");
  return found === undefined ? "-" : String(found);
}

function photoUrl(foto) {
  const raw = typeof foto === "string" ? foto : foto?.url || foto?.ruta || foto?.src || foto?.dataUrl || "";
  if (!raw) return "";
  if (raw.startsWith("data:") || raw.startsWith("http")) return raw;
  return `${API_BASE}${raw.startsWith("/") ? raw : `/${raw}`}`;
}

export default function TrackingPreview({ folio, token }) {
  const cleanFolio =
    typeof folio === "string" && folio.trim()
      ? decodeURIComponent(folio).trim()
      : "RX-000";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `${API_BASE}/api/seguimiento/${encodeURIComponent(cleanFolio)}?token=${encodeURIComponent(token || "")}`
        );
        const json = await response.json();
        if (!response.ok) {
          throw new Error(json.error || "No se pudo cargar el seguimiento.");
        }
        if (active) setData(json);
      } catch (err) {
        if (active) setError(err.message || "No se pudo cargar el seguimiento.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [cleanFolio, token]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f3f6f9] px-4 font-[Inter]">
        <p className="text-sm font-bold text-[#52647d]">Cargando seguimiento...</p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f3f6f9] px-4 font-[Inter]">
        <section className="mx-auto w-full max-w-md rounded-lg border border-[#f3c9c9] bg-white p-6 text-center">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#c0392b]">
            Enlace no disponible
          </p>
          <p className="mt-3 text-sm font-semibold text-[#52647d]">
            {error || "Este enlace ya no es válido. Solicita uno nuevo al taller."}
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-md border border-[#cbd8e7] bg-white px-4 text-sm font-black text-[#2563eb]"
          >
            Volver al inicio
          </Link>
        </section>
      </main>
    );
  }

  const historial = Array.isArray(data.historial) ? data.historial : [];
  const ultimoAvance = historial.length ? historial[historial.length - 1] : null;
  const fotos = Array.isArray(data.fotos) ? data.fotos : [];
  const tipo = String(data.tipo || data.tipoSeguimiento || "").toLowerCase() === "garantia" ? "garantia" : "reparacion";
  const isWarranty = tipo === "garantia";
  const saldo = Number(data.pago?.saldoPendiente || 0);
  const folioPrincipal = textValue(data.folio, cleanFolio);
  const folioRelacionado = textValue(data.reparacionFolio, data.rxOriginal, data.folioOriginal, data.reparacion?.folio);
  const equipo = data.equipo || data.reparacion?.equipo || {};
  const title = isWarranty ? "Garantía en seguimiento" : "Reparación en seguimiento";
  const lastFallback = isWarranty
    ? "Tu garantía fue registrada. El taller publicará avances visibles cuando existan actualizaciones."
    : "Tu orden fue registrada. El taller publicará avances visibles para el cliente cuando existan actualizaciones.";

  return (
    <main
      className="min-h-screen bg-[#f3f6f9] px-4 py-8 font-[Inter] text-[#07152b] sm:px-6 lg:px-8"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <section className="mx-auto max-w-[1040px] overflow-hidden rounded-lg border border-[#d6e0ea] bg-white">
        <header className="flex flex-col gap-5 border-b border-[#d6e0ea] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/logo-clickcom.png.png"
              alt="CLICK.COM del Caribe"
              className="h-auto w-[118px] object-contain"
            />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#ff6b00]">
                {isWarranty ? "Garantía privada" : "Seguimiento privado"}
              </p>
              <h1 className="mt-2 text-2xl font-black text-[#07152b]">
                {folioPrincipal}
              </h1>
              <p className="mt-1 text-sm font-semibold text-[#52647d]">
                {title}
              </p>
              <Link
                href="/politicas-servicio"
                className="mt-4 inline-flex text-sm font-black text-[#0055FF] hover:underline"
              >
                Ver politicas de servicio
              </Link>
            </div>
          </div>

          <span className="w-fit rounded-full border border-[#b7e2c5] bg-[#effaf3] px-3 py-1 text-xs font-black text-[#087a31]">
            Enlace verificado
          </span>
        </header>

        <div className="grid border-b border-[#d6e0ea] sm:grid-cols-2 lg:grid-cols-4">
          <InfoCell
            label="Estado"
            value={STATUS_LABELS[data.estado] || data.estado || "-"}
            detail={`Actualizado: ${formatDate(data.actualizadoEn)}`}
          />
          <InfoCell
            label="Equipo"
            value={[equipo?.marca, equipo?.modelo].filter(Boolean).join(" ") || equipo?.tipo || "-"}
            detail={equipo?.tipo || "Sin tipo registrado"}
          />
          <InfoCell
            label={isWarranty ? "Vence" : "Fecha estimada"}
            value={isWarranty ? formatDate(data.vence || data.fechaVence || data.vencimiento) : (data.fechaEntregaEstimada ? formatDate(data.fechaEntregaEstimada) : "Por confirmar")}
            detail={isWarranty && folioRelacionado !== "-" ? `Orden original: ${folioRelacionado}` : "El taller actualizará este dato"}
          />
          {isWarranty ? (
            <InfoCell
              label="Tipo"
              value="Garantía"
              detail={folioRelacionado !== "-" ? `Orden original: ${folioRelacionado}` : "Sin pago en garantía"}
            />
          ) : (
            <InfoCell
              label="Saldo"
              value={saldo > 0 ? `$${saldo.toLocaleString("es-MX")}` : "Sin saldo pendiente"}
              detail="Solo si aplica"
            />
          )}
        </div>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <section className="border-b border-[#d6e0ea] p-6 lg:border-b-0 lg:border-r">
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#07152b]">
              Ultimo avance
            </h2>

            <div className="mt-4 rounded-lg border border-[#d6e0ea] bg-[#f8fafc] p-5">
              <p className="text-base font-black text-[#07152b]">
                {ultimoAvance?.titulo || "Equipo registrado"}
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#52647d]">
                {ultimoAvance?.descripcion || lastFallback ||
                  "Tu orden fue registrada. El taller publicará avances visibles para el cliente cuando existan actualizaciones."}
              </p>
              {ultimoAvance ? (
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.1em] text-[#8aa0b8]">
                  {formatDate(ultimoAvance.fecha)} {formatTime(ultimoAvance.fecha)}
                </p>
              ) : null}
            </div>

            <h2 className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-[#07152b]">
              Historial visible
            </h2>

            <div className="mt-4 divide-y divide-[#d6e0ea] rounded-lg border border-[#d6e0ea]">
              {historial.length ? (
                historial.map((item, index) => (
                  <div key={index} className="grid gap-2 p-4 sm:grid-cols-[140px_1fr]">
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#52647d]">
                      {formatDate(item.fecha)}
                      <br />
                      {formatTime(item.fecha)}
                    </span>
                    <div>
                      <p className="font-black text-[#07152b]">
                        {item.titulo || "Movimiento"}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm font-semibold text-[#52647d]">
                        {item.descripcion || "-"}
                      </p>
                      {Array.isArray(item.fotos) && item.fotos.length ? (
                        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {item.fotos.map((foto, fotoIndex) => {
                            const src = photoUrl(foto);
                            return (
                              <a
                                key={fotoIndex}
                                href={src}
                                target="_blank"
                                rel="noreferrer"
                                className="block overflow-hidden rounded-md border border-[#d6e0ea]"
                              >
                                <img
                                  src={src}
                                  alt={foto?.nombre || `Foto de avance ${fotoIndex + 1}`}
                                  className="h-20 w-full object-cover"
                                />
                              </a>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-sm font-semibold text-[#52647d]">
                  Primer movimiento visible del folio.
                </div>
              )}
            </div>
          </section>

          <section className="p-6">
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#07152b]">
              Evidencias visibles
            </h2>

            {fotos.length ? (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {fotos.map((foto, index) => {
                  const src = photoUrl(foto);
                  return (
                    <a
                      key={index}
                      href={src}
                      target="_blank"
                      rel="noreferrer"
                      className="block overflow-hidden rounded-lg border border-[#d6e0ea]"
                    >
                      <img
                        src={src}
                        alt={foto?.nombre || `Evidencia ${index + 1}`}
                        className="h-32 w-full object-cover"
                      />
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 rounded-lg border border-dashed border-[#b8c8d9] bg-[#f8fafc] p-8 text-center text-sm font-bold text-[#52647d]">
                Sin fotos visibles por ahora.
              </div>
            )}

            <div className="mt-5 rounded-lg border border-[#d6e0ea] p-5">
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#07152b]">
                Privacidad del enlace
              </h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#52647d]">
                Este acceso es privado. Si cierras la página, vuelve a entrar
                desde el enlace compartido por el taller.
              </p>
            </div>

            <Link
              href="/"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-md border border-[#cbd8e7] bg-white px-4 text-sm font-black text-[#2563eb]"
            >
              Volver al inicio
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}

function InfoCell({ label, value, detail }) {
  return (
    <div className="border-b border-[#d6e0ea] p-5 lg:border-b-0 lg:border-r lg:last:border-r-0">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#52647d]">
        {label}
      </p>
      <p className="mt-2 text-lg font-black text-[#07152b]">{value}</p>
      <p className="mt-1 text-xs font-semibold text-[#52647d]">{detail}</p>
    </div>
  );
}


