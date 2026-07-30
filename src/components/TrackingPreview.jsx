"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TrackingView from "./TrackingView";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function TrackingPreview({ folio, token }) {
  const cleanFolio =
    typeof folio === "string" && folio.trim()
      ? decodeURIComponent(folio).trim()
      : "";

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
      <main className="flex min-h-screen items-center justify-center bg-[#f7f4fb] px-4 font-[Inter]">
        <p className="text-sm font-bold text-[#52647d]">Cargando seguimiento...</p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f4fb] px-4 font-[Inter]">
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

  return <TrackingView data={data} />;
}