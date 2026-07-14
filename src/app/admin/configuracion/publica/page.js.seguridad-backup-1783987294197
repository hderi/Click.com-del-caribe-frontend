"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function headers() {
  const token = typeof window !== "undefined" ? localStorage.getItem("clickcom_token") : "";
  return { "Content-Type": "application/json", Authorization: `Bearer ${token || ""}` };
}

async function loadConfig(clave, fallback) {
  const res = await fetch(`${API_URL}/api/configuracion/${clave}`, { headers: headers() });
  if (!res.ok) return fallback;
  const data = await res.json();
  return { ...fallback, ...(data.datos || {}) };
}

async function saveConfig(clave, datos) {
  const res = await fetch(`${API_URL}/api/configuracion/${clave}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ datos }),
  });
  if (!res.ok) throw new Error((await res.json()).error || "No se pudo guardar");
}

const FALLBACK = {
  titulo: "Soluciones tecnológicas que impulsan tu negocio.",
  subtitulo: "Reparación de equipos, redes, cámaras y soporte especializado.",
  quienesSomos: "Somos una empresa dedicada al negocio tecnológico con vocación de servicio.",
  mision: "Proveer productos y servicios de calidad que satisfagan las expectativas de nuestros clientes.",
  vision: "Ser una empresa exitosa, rentable y atractiva dedicada al negocio tecnológico.",
  valores: "Respeto, Honradez, Confianza, Lealtad, Responsabilidad, Honestidad y Compromiso",
};
export default function ConfigPublicaPage() {
  const [form, setForm] = useState(FALLBACK);
  const [msg, setMsg] = useState("");
  useEffect(() => { loadConfig("pagina_clientes", FALLBACK).then(setForm); }, []);
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  async function guardar(e) {
    e.preventDefault();
    setMsg("");
    try { await saveConfig("pagina_clientes", form); setMsg("Contenido guardado."); }
    catch (err) { setMsg(err.message); }
  }
  return (
    <div className="space-y-6">
      <Link href="/admin/configuracion" className="text-sm font-bold text-[#0077b6]">← Volver a configuración</Link>
      <section className="rounded-[24px] border border-[#bfd4e3] bg-white p-7 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ff6b00]">Página pública</p>
        <h1 className="mt-2 text-3xl font-black text-[#08172a]">Contenido visible para clientes</h1>
        <p className="mt-2 text-[#40546d]">Aquí se ajusta lo que aparece en la página principal: inicio, misión, visión, valores y texto institucional.</p>
      </section>
      <form onSubmit={guardar} className="rounded-[24px] border border-[#bfd4e3] bg-white p-6 shadow-sm space-y-4">
        {[
          ["titulo", "Título principal"],
          ["subtitulo", "Subtítulo"],
          ["quienesSomos", "Quiénes somos"],
          ["mision", "Misión"],
          ["vision", "Visión"],
          ["valores", "Valores"],
        ].map(([key, label]) => (
          <label key={key} className="block">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#56677d]">{label}</span>
            <textarea value={form[key]} onChange={(e) => update(key, e.target.value)} className="mt-2 min-h-[88px] w-full rounded-2xl border border-[#bfd4e3] bg-[#f8fbfd] px-4 py-3 text-[#08172a]" />
          </label>
        ))}
        {msg && <p className="font-bold text-[#0b75a5]">{msg}</p>}
        <button className="rounded-2xl bg-[#0aa7df] px-7 py-3 font-black text-white hover:bg-[#078fc0]">Guardar contenido</button>
      </form>
    </div>
  );
}
