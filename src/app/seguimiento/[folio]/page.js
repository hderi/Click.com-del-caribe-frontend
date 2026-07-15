"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const STEPS = [
  { key: "recibido", label: "Recibido", text: "Ya tenemos tu equipo en el taller." },
  { key: "diagnostico", label: "Diagnóstico", text: "Estamos revisando la causa de la falla." },
  { key: "en_reparacion", label: "En reparación", text: "Estamos trabajando en la solución." },
  { key: "finalizado", label: "Finalizado", text: "El equipo está listo para entrega." },
  { key: "entregado", label: "Entregado", text: "El equipo ya fue entregado." },
];

function stepIndex(status) {
  const index = STEPS.findIndex((step) => step.key === status);
  return index >= 0 ? index : 0;
}

function photoUrl(photo) {
  const src = String(photo?.url || "");
  if (!src || src.startsWith("http") || src.startsWith("data:")) return src;
  return `${API_URL}${src.startsWith("/") ? src : `/${src}`}`;
}

export default function PublicTrackingPage({ params }) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [repair, setRepair] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTracking() {
      try {
        const response = await fetch(`${API_URL}/api/seguimiento/${params.folio}?token=${encodeURIComponent(token)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "No se pudo abrir el seguimiento");
        setRepair(data);
      } catch (err) {
        setError(err.message || "No se pudo abrir el seguimiento");
      } finally {
        setLoading(false);
      }
    }
    loadTracking();
  }, [params.folio, token]);

  const currentStep = stepIndex(repair?.estado);
  const whatsappUrl = useMemo(() => {
    const message = encodeURIComponent(`Hola, quiero consultar el estado de mi reparación ${params.folio}.`);
    return `https://wa.me/529871119621?text=${message}`;
  }, [params.folio]);

  if (loading) {
    return <main className="min-h-screen bg-[#F5F7FA] p-8 text-[#111827] font-black">Cargando seguimiento...</main>;
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#F5F7FA] text-[#111827]">
        <section className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-5 text-center">
          <img src="/logo-clickcom.png.jpeg" alt="CLICK.COM del Caribe" className="h-24 w-auto object-contain" />
          <h1 className="mt-8 text-4xl font-black">Seguimiento no disponible</h1>
          <p className="mt-4 text-base leading-7 text-[#4B5563]">{error}</p>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-6 rounded-full bg-[#FF7A00] px-6 py-3 text-sm font-black text-white">
            Contactar por WhatsApp
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#111827]">
      <header className="border-b border-[#E9EEF3] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo-clickcom.png.jpeg" alt="CLICK.COM del Caribe" className="h-14 w-auto max-w-[190px] object-contain" />
          </a>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-black text-white">
            WhatsApp
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
        <div className="overflow-hidden rounded-[2rem] border border-[#E9EEF3] bg-white shadow-sm">
          <div className="bg-gradient-to-r from-[#00AEEF] via-[#23C7F7] to-[#FF7A00] px-6 py-3 text-sm font-black text-white sm:px-8">
            Seguimiento claro para tu reparación
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-[#FF7A00]">Folio {repair.folio}</p>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-[#080808] sm:text-5xl">
                  Tu equipo está en proceso
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#4B5563]">
                  Aquí puedes ver el avance de tu reparación con información clara del taller.
                </p>
              </div>

              <div className="rounded-3xl bg-[#F5F7FA] p-5">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#4B5563]">Estado actual</p>
                <p className="mt-1 text-2xl font-black text-[#00AEEF]">{STEPS[currentStep]?.label || repair.estado}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <InfoCard label="Cliente" value={repair.cliente?.nombre || "Cliente"} />
              <InfoCard label="Equipo" value={[repair.equipo?.marca, repair.equipo?.modelo].filter(Boolean).join(" ") || "Equipo"} />
              <InfoCard label="Folio" value={repair.folio} accent />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <section className="rounded-[2rem] border border-[#E9EEF3] bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-black text-[#080808]">Progreso de reparación</h2>
            <p className="mt-2 text-sm text-[#4B5563]">Vista simple del proceso, como seguimiento de pedido.</p>

            <div className="mt-6 space-y-4">
              {STEPS.map((step, index) => {
                const done = index <= currentStep;
                const current = index === currentStep;
                return (
                  <div key={step.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-black ${done ? "bg-[#00AEEF] text-white" : "bg-[#E9EEF3] text-[#4B5563]"}`}>
                        {index + 1}
                      </div>
                      {index < STEPS.length - 1 && <div className={`mt-2 h-11 w-1 rounded-full ${index < currentStep ? "bg-[#00AEEF]" : "bg-[#E9EEF3]"}`} />}
                    </div>
                    <div className="pb-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className={`font-black ${done ? "text-[#080808]" : "text-[#4B5563]"}`}>{step.label}</p>
                        {current && <span className="rounded-full bg-[#FF7A00]/10 px-2.5 py-1 text-[11px] font-black text-[#FF7A00]">Actual</span>}
                      </div>
                      <p className="mt-1 text-sm leading-6 text-[#4B5563]">{step.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="space-y-8">
            <section className="rounded-[2rem] border border-[#E9EEF3] bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-black text-[#080808]">Nota del taller</h2>
              <p className="mt-3 text-sm leading-6 text-[#4B5563]">{repair.observaciones || "El taller actualizará esta vista cuando existan nuevos avances."}</p>
            </section>

            <section className="rounded-[2rem] border border-[#E9EEF3] bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-black text-[#080808]">Historial visible</h2>
              <div className="mt-4 space-y-3">
                {(repair.historial || []).map((note, index) => (
                  <div key={`${note.titulo}-${index}`} className="rounded-2xl bg-[#F5F7FA] p-4 text-sm font-semibold leading-6 text-[#4B5563]">
                    <strong>{note.titulo || note.estado}</strong><br />{note.descripcion || "Actualización registrada."}
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <section className="mt-8 rounded-[2rem] border border-[#E9EEF3] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-black text-[#080808]">Fotos del avance</h2>
          <p className="mt-1 text-sm text-[#4B5563]">Aquí aparecerán las fotos que el taller marque como visibles para cliente.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {(repair.fotos || []).length ? repair.fotos.map((photo, index) => (
              <article key={`${photo.nombre || "foto"}-${index}`} className="overflow-hidden rounded-3xl border border-[#E9EEF3] bg-[#F5F7FA] p-5 text-sm font-bold text-[#4B5563]">
                {photo.url ? <img src={photoUrl(photo)} alt={photo.nombre || "Foto del avance"} className="aspect-[4/3] w-full rounded-2xl object-cover" /> : photo.nombre || "Foto registrada"}
              </article>
            )) : (
              <div className="rounded-3xl border border-dashed border-[#D6E1EA] bg-[#F5F7FA] p-8 text-sm font-bold text-[#4B5563] md:col-span-3">
                Todavía no hay fotos visibles para cliente.
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function InfoCard({ label, value, accent = false }) {
  return (
    <div className="rounded-3xl border border-[#E9EEF3] bg-[#F5F7FA] p-5">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4B5563]">{label}</p>
      <p className={`mt-2 text-lg font-black ${accent ? "text-[#00AEEF]" : "text-[#080808]"}`}>{value}</p>
    </div>
  );
}
