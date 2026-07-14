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

const FALLBACK = { promociones: [] };
const emptyPromo = { nombre: "", descripcion: "", precio: "", imagen: "", activo: true };
export default function ConfigPromocionesPage() {
  const [form, setForm] = useState(FALLBACK);
  const [msg, setMsg] = useState("");
  useEffect(() => { loadConfig("promociones", FALLBACK).then(setForm); }, []);
  const promos = form.promociones || [];
  const setPromo = (i, key, value) => setForm((prev) => ({ ...prev, promociones: promos.map((p, idx) => idx === i ? { ...p, [key]: value } : p) }));
  async function guardar(e) {
    e.preventDefault();
    setMsg("");
    try { await saveConfig("promociones", form); setMsg("Promociones guardadas."); }
    catch (err) { setMsg(err.message); }
  }
  return (
    <div className="space-y-6">
      <Link href="/admin/configuracion" className="text-sm font-bold text-[#0077b6]">← Volver a configuración</Link>
      <section className="rounded-[24px] border border-[#bfd4e3] bg-white p-7 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ff6b00]">Promociones</p>
        <h1 className="mt-2 text-3xl font-black text-[#08172a]">Productos y precios destacados</h1>
        <p className="mt-2 text-[#40546d]">Administra las promociones que se mostrarán en la página pública.</p>
      </section>
      <form onSubmit={guardar} className="space-y-4">
        <button type="button" onClick={() => setForm((prev) => ({ ...prev, promociones: [...promos, emptyPromo] }))} className="rounded-2xl bg-[#ff7900] px-6 py-3 font-black text-white">Agregar promoción</button>
        {promos.map((promo, i) => (
          <div key={i} className="grid gap-3 rounded-[22px] border border-[#bfd4e3] bg-white p-5 shadow-sm md:grid-cols-2">
            <input placeholder="Nombre" value={promo.nombre || ""} onChange={(e) => setPromo(i, "nombre", e.target.value)} className="rounded-xl border border-[#bfd4e3] px-4 py-3" />
            <input placeholder="Precio" value={promo.precio || ""} onChange={(e) => setPromo(i, "precio", e.target.value)} className="rounded-xl border border-[#bfd4e3] px-4 py-3" />
            <input placeholder="URL de imagen / ruta" value={promo.imagen || ""} onChange={(e) => setPromo(i, "imagen", e.target.value)} className="rounded-xl border border-[#bfd4e3] px-4 py-3 md:col-span-2" />
            <textarea placeholder="Descripción" value={promo.descripcion || ""} onChange={(e) => setPromo(i, "descripcion", e.target.value)} className="rounded-xl border border-[#bfd4e3] px-4 py-3 md:col-span-2" />
            <button type="button" onClick={() => setForm((prev) => ({ ...prev, promociones: promos.filter((_, idx) => idx !== i) }))} className="rounded-xl border border-red-200 px-4 py-2 font-bold text-red-700">Eliminar</button>
          </div>
        ))}
        {msg && <p className="font-bold text-[#0b75a5]">{msg}</p>}
        <button className="rounded-2xl bg-[#0aa7df] px-7 py-3 font-black text-white hover:bg-[#078fc0]">Guardar promociones</button>
      </form>
    </div>
  );
}
