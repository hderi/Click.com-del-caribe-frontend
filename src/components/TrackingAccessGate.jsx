"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const WHATSAPP_NUMBER = "529848047192";

const ETAPAS = ["Recibido", "Diagnóstico", "En reparación", "En espera", "Listo", "Entregado"];

function whatsapp(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function ProgressTracker({ etapaActual }) {
  const indexActual = ETAPAS.indexOf(etapaActual);

  return (
    <div className="relative mt-10">
      <div className="absolute left-0 right-0 top-[9px] h-[2px] bg-[#D8DEE8]" />
      <div
        className="absolute left-0 top-[9px] h-[2px] bg-[#0F1F4A] transition-all duration-500"
        style={{ width: `${(indexActual / (ETAPAS.length - 1)) * 100}%` }}
      />
      <div className="relative flex justify-between">
        {ETAPAS.map((etapa, i) => {
          const done = i <= indexActual;
          return (
            <div key={etapa} className="flex flex-col items-center gap-2.5" style={{ width: `${100 / ETAPAS.length}%` }}>
              <span
                className="h-[19px] w-[19px] shrink-0 rounded-full border-2 transition-colors"
                style={{
                  background: done ? "#0F1F4A" : "#FFFFFF",
                  borderColor: done ? "#0F1F4A" : "#D8DEE8",
                }}
              />
              <span
                className={`text-center text-[12px] leading-tight ${
                  done ? "font-extrabold text-[#0F1F4A]" : "font-medium text-[#94A3B8]"
                }`}
              >
                {etapa}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DataRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1 border-t border-[#D8DEE8] py-4 sm:flex-row sm:items-baseline sm:justify-between">
      <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#5B6472]">{label}</span>
      <span className="text-[14.5px] font-bold text-[#0F1F4A] sm:text-right">{value}</span>
    </div>
  );
}

function formatMXN(value) {
  return `$${Number(value || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
}

function PaymentSummary({ orden }) {
  const costo = Number(orden.costo || 0);
  const pagado = Number(orden.pagado || 0);
  const faltante = Math.max(costo - pagado, 0);

  return (
    <div className="mt-10 border-t-2 border-[#0F1F4A] pt-8">
      <h3 className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#5B6472]">Pago</h3>
      <div className="mt-5 grid grid-cols-3 gap-4">
        <div>
          <p className="text-[22px] font-extrabold leading-none text-[#0F1F4A]">{formatMXN(costo)}</p>
          <p className="mt-1 text-[11.5px] font-bold uppercase tracking-[0.1em] text-[#5B6472]">Costo total</p>
        </div>
        <div>
          <p className="text-[22px] font-extrabold leading-none text-[#0F1F4A]">{formatMXN(pagado)}</p>
          <p className="mt-1 text-[11.5px] font-bold uppercase tracking-[0.1em] text-[#5B6472]">Pagado</p>
        </div>
        <div>
          <p
            className="text-[22px] font-extrabold leading-none"
            style={{ color: faltante > 0 ? "#0F1F4A" : "#1E8A5E" }}
          >
            {formatMXN(faltante)}
          </p>
          <p className="mt-1 text-[11.5px] font-bold uppercase tracking-[0.1em] text-[#5B6472]">
            {faltante > 0 ? "Falta por pagar" : "Liquidado"}
          </p>
        </div>
      </div>
    </div>
  );
}

function AvancesTimeline({ avances }) {
  const visibles = (avances || []).filter((a) => a.visiblePublico !== false);
  if (visibles.length === 0) return null;

  return (
    <div className="mt-10 border-t-2 border-[#0F1F4A] pt-8">
      <h3 className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#5B6472]">Avances de tu reparación</h3>
      <div className="mt-6 space-y-8">
        {visibles.map((avance, i) => (
          <div key={i} className="border-l-2 border-[#0F1F4A]/15 pl-5">
            <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#5B6472]">
              {avance.fecha}
              {avance.tecnico ? ` · ${avance.tecnico}` : ""}
            </p>
            {avance.diagnostico && (
              <p className="mt-2 text-[14.5px] font-medium leading-7 text-[#0F1F4A]">{avance.diagnostico}</p>
            )}
            {avance.observacion && (
              <p className="mt-1.5 text-[13.5px] font-medium leading-6 text-[#5B6472]">{avance.observacion}</p>
            )}
            {Array.isArray(avance.fotos) && avance.fotos.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2.5">
                {avance.fotos.map((foto, j) => (
                  <img
                    key={j}
                    src={foto}
                    alt={`Avance ${i + 1} foto ${j + 1}`}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SeguimientoPage() {
  const [folio, setFolio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orden, setOrden] = useState(null);

  async function buscar(e) {
    e.preventDefault();
    if (!folio.trim()) return;

    setLoading(true);
    setError("");
    setOrden(null);

    try {
      const res = await fetch(`${API_URL}/api/public/ordenes/${encodeURIComponent(folio.trim())}`);
      if (!res.ok) {
        setError("No encontramos ninguna orden con ese folio. Verifica el número e intenta de nuevo.");
        return;
      }
      const data = await res.json();
      setOrden(data.datos || data);
    } catch (_) {
      setError("No pudimos conectar con el servidor. Intenta de nuevo en unos minutos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen w-full overflow-x-hidden bg-cover bg-center bg-no-repeat font-sans text-[#0F1F4A]"
      style={{
        fontFamily: "'Inter', sans-serif",
        backgroundImage: "url('/fondo principal.jpg')",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="mx-auto max-w-2xl px-6 py-20 lg:px-10">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-[#5B6472] transition hover:text-[#0F1F4A]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
          Volver a inicio
        </a>

        <p className="mt-8 text-[12px] font-bold uppercase tracking-[0.18em] text-[#0F1F4A]">Seguimiento</p>
        <span className="mt-2 block h-[2px] w-8 bg-[#0F1F4A]" />
        <h1 className="mt-5 text-[32px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#0F1F4A] sm:text-[38px]">
          Consulta el estatus de tu reparación.
        </h1>
        <p className="mt-4 text-[15px] font-medium leading-7 text-[#5B6472]">
          Ingresa el número de folio que te dimos al recibir tu equipo.
        </p>

        <form onSubmit={buscar} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={folio}
            onChange={(e) => setFolio(e.target.value)}
            placeholder="Ej. CC-0245"
            className="w-full border-b-2 border-[#0F1F4A]/30 bg-transparent px-1 py-3 text-[16px] font-bold text-[#0F1F4A] placeholder:font-medium placeholder:text-[#94A3B8] focus:border-[#0F1F4A] focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="shrink-0 rounded-xl bg-[#0F1F4A] px-7 py-3.5 text-[14.5px] font-extrabold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </form>

        {error && (
          <p className="mt-6 text-[14px] font-semibold text-[#B4232D]">{error}</p>
        )}

        {orden && (
          <div className="mt-14">
            <ProgressTracker etapaActual={orden.etapa || "Recibido"} />

            <div className="mt-14">
              <DataRow label="Folio" value={orden.folio} />
              <DataRow label="Equipo" value={orden.equipo} />
              <DataRow label="Falla reportada" value={orden.falla} />
              <DataRow label="Sucursal" value={orden.sucursal} />
              <DataRow label="Técnico asignado" value={orden.tecnico} />
              <DataRow label="Fecha de ingreso" value={orden.fechaIngreso} />
              <DataRow label="Fecha estimada de entrega" value={orden.fechaEstimada} />
            </div>

            <PaymentSummary orden={orden} />

            <AvancesTimeline avances={orden.avances} />

            <div className="mt-12">
              <a
                href={whatsapp(`Hola, tengo dudas sobre mi orden de reparación ${orden.folio || ""}.`)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-[#0F1F4A] px-7 py-3.5 text-[14.5px] font-extrabold text-white transition hover:opacity-90"
              >
                ¿Dudas? Escríbenos por WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}