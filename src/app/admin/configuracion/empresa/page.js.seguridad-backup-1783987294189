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
  telefono: "9871119621",
  correo: "erickalh56@gmail.com",
  direccion: "Av. Benito Juárez, Entre 80 Av. Sur y Diagonal 85 Av. Sur Local 3, MZ 214, Lote 006, Colonia Ejidal, Playa del Carmen, Quintana Roo.",
  horario: "Lunes a viernes 9:00 AM - 6:00 PM. Sábado 9:00 AM - 3:00 PM. Domingo cerrado.",
  mapa: "",
  politicas: "1.- EL CLIENTE ACEPTA LAS POLÍTICAS DE SERVICIO DE CLICK.COM DEL CARIBE...",
};
export default function ConfigEmpresaPage() {
  const [form, setForm] = useState(FALLBACK);
  const [msg, setMsg] = useState("");
  useEffect(() => { loadConfig("empresa", FALLBACK).then(setForm); }, []);
  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  async function guardar(e) {
    e.preventDefault();
    setMsg("");
    try { await saveConfig("empresa", form); setMsg("Datos de empresa guardados."); }
    catch (err) { setMsg(err.message); }
  }
  return (
    <div className="space-y-6">
      <Link href="/admin/configuracion" className="text-sm font-bold text-[#0077b6]">← Volver a configuración</Link>
      <section className="rounded-[24px] border border-[#bfd4e3] bg-white p-7 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ff6b00]">Empresa</p>
        <h1 className="mt-2 text-3xl font-black text-[#08172a]">Políticas, contacto y mapa</h1>
        <p className="mt-2 text-[#40546d]">Aquí se editan los datos legales y de contacto que ve el cliente.</p>
      </section>
      <form onSubmit={guardar} className="rounded-[24px] border border-[#bfd4e3] bg-white p-6 shadow-sm space-y-4">
        {[
          ["telefono", "Teléfono"],
          ["correo", "Correo"],
          ["direccion", "Dirección"],
          ["horario", "Horario"],
          ["mapa", "Link de Google Maps"],
        ].map(([key, label]) => (
          <label key={key} className="block">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#56677d]">{label}</span>
            <input value={form[key]} onChange={(e) => update(key, e.target.value)} className="mt-2 w-full rounded-2xl border border-[#bfd4e3] bg-[#f8fbfd] px-4 py-3 text-[#08172a]" />
          </label>
        ))}
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#56677d]">Políticas de servicio</span>
          <textarea value={form.politicas} onChange={(e) => update("politicas", e.target.value)} className="mt-2 min-h-[260px] w-full rounded-2xl border border-[#bfd4e3] bg-[#f8fbfd] px-4 py-3 text-[#08172a]" />
        </label>
        {msg && <p className="font-bold text-[#0b75a5]">{msg}</p>}
        <button className="rounded-2xl bg-[#0aa7df] px-7 py-3 font-black text-white hover:bg-[#078fc0]">Guardar datos</button>
      </form>
    </div>
  );
}
