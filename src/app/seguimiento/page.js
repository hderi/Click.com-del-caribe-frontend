"use client";

import { useState } from "react";
import Link from "next/link";
import TrackingView from "@/components/TrackingView";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function SeguimientoBuscarPage() {
  const [folio, setFolio] = useState("");
  const [telefono, setTelefono] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setData(null);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/seguimiento/buscar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folio: folio.trim(), telefonoUlt4: telefono.trim() }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || "No encontramos una orden con esos datos.");
      }
      setData(json);
    } catch (err) {
      setError(err.message || "No encontramos una orden con esos datos.");
    } finally {
      setLoading(false);
    }
  }

  if (data) {
    return <TrackingView data={data} />;
  }

  return (
    <main
      className="min-h-screen px-4 py-10 sm:px-6 lg:px-8"
      style={{
        fontFamily: "Inter, sans-serif",
        background: "linear-gradient(135deg, #fdf1e7 0%, #f7f4fb 45%, #ffffff 100%)",
      }}
    >
      <div className="mx-auto max-w-[620px]">
        <Link href="/" className="text-sm font-bold text-[#334155]">
          ‹ Volver a inicio
        </Link>

        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1d4ed8] underline decoration-2 underline-offset-4">
          Seguimiento
        </p>
        <h1 className="mt-2 text-3xl font-black leading-tight text-[#0b1f4d] sm:text-4xl">
          Consulta el estatus de tu reparación.
        </h1>
        <p className="mt-2 text-sm font-semibold text-[#52647d]">
          Ingresa el folio y los últimos 4 dígitos del teléfono que registraste al recibir tu equipo.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={folio}
            onChange={(e) => setFolio(e.target.value.toUpperCase())}
            placeholder="RX-104 o GT-102"
            className="h-12 flex-1 rounded-md border border-[#cbd8e7] bg-white px-4 text-sm font-bold text-[#0b1f4d] outline-none focus:border-[#1d4ed8]"
          />
          <input
            value={telefono}
            onChange={(e) => setTelefono(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="Últimos 4 dígitos"
            inputMode="numeric"
            maxLength={4}
            className="h-12 w-full rounded-md border border-[#cbd8e7] bg-white px-4 text-sm font-bold text-[#0b1f4d] outline-none focus:border-[#1d4ed8] sm:w-44"
          />
          <button
            type="submit"
            disabled={loading || !folio.trim() || telefono.length !== 4}
            className="h-12 rounded-md bg-[#0b1f4d] px-6 text-sm font-black text-white disabled:opacity-50"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </form>

        {error ? (
          <div className="mt-4 rounded-md border border-[#f3c9c9] bg-[#fdf1f1] px-4 py-3 text-sm font-bold text-[#c0392b]">
            {error}
          </div>
        ) : null}
      </div>
    </main>
  );
}