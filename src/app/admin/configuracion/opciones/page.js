"use client";

import { getToken } from "@/lib/authStorage";
import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const LISTS = [
  ["tiposEquipo", "Tipos de equipo"],
  ["marcas", "Marcas"],
  ["canalesContacto", "Canales de contacto"],
  ["metodosAutorizacion", "Métodos de autorización"],
  ["accesorios", "Accesorios"],
  ["condicionesFisicas", "Condiciones físicas"],
  ["metodosPago", "Métodos de pago"],
  ["garantia", "Opciones de garantía"],
];

const DEFAULTS = {
  tiposEquipo: ["Laptop", "PC / CPU", "All in One", "Impresora", "Otro"],
  marcas: ["Acer", "Acteck", "Apple", "Asus", "BenQ", "Brother", "Canon", "Compaq", "Dell", "Epson", "Gateway", "Gigabyte", "HP", "Huawei", "Intel", "Kingston", "Lenovo", "LG", "Logitech", "Microsoft", "MSI", "Qian", "Samsung", "Seagate", "Sony", "Toshiba", "Ubiquiti", "Xerox", "Otro"],
  canalesContacto: ["WhatsApp", "Gmail / correo", "Ambos"],
  metodosAutorizacion: ["Presencial", "WhatsApp", "Llamada", "Correo"],
  accesorios: ["Cargador", "Mouse", "Cable de poder", "Cartuchos", "Tintas"],
  condicionesFisicas: ["Sin daños visibles", "Rayaduras", "Golpes", "Pantalla dañada", "Bisagra dañada", "Teclado / touchpad dañado", "Carcasa dañada", "Humedad / líquido", "Faltan piezas / tornillos"],
  metodosPago: ["Efectivo", "Tarjeta de débito", "Tarjeta de crédito", "Transferencia", "Cheque"],
  garantia: ["Sí aplica", "No aplica"],
};

function headers() {
  const token = typeof window !== "undefined" ? getToken() : "";
  return { "Content-Type": "application/json", Authorization: `Bearer ${token || ""}` };
}

function toOptions(lines) {
  return String(lines || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((label) => ({ value: label, label }));
}

function toText(items) {
  return (Array.isArray(items) ? items : [])
    .map((item) => (typeof item === "string" ? item : item?.label || item?.value || ""))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }))
    .join("\n");
}

export default function OpcionesReparacionPage() {
  const [form, setForm] = useState(() => Object.fromEntries(LISTS.map(([key]) => [key, toText(DEFAULTS[key])])));
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API_URL}/api/configuracion/opciones_reparacion`, { headers: headers() });
      if (!res.ok) return;
      const data = await res.json();
      const datos = data.datos || {};
      setForm((current) => {
        const next = { ...current };
        for (const [key] of LISTS) {
          if (Array.isArray(datos[key]) && datos[key].length) next[key] = toText(datos[key]);
        }
        return next;
      });
    }
    load();
  }, []);

  async function save(event) {
    event.preventDefault();
    setMsg("");
    const datos = Object.fromEntries(LISTS.map(([key]) => [key, toOptions(form[key])]));
    const res = await fetch(`${API_URL}/api/configuracion/opciones_reparacion`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({ datos }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error || "No se pudo guardar la configuración.");
      return;
    }
    setMsg("Opciones guardadas correctamente.");
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/configuracion" className="text-sm font-bold text-[#0077b6]">← Volver a configuración</Link>
      <section className="rounded-[22px] border border-[#b9d0df] bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0b75a5]">Catálogos</p>
        <h1 className="mt-2 text-2xl font-bold text-[#08172a]">Opciones de reparación</h1>
        <p className="mt-2 text-sm text-[#40546d]">Cada línea es una opción. El formulario de nueva reparación leerá estos datos desde la base de datos.</p>
      </section>

      <form onSubmit={save} className="grid gap-4 lg:grid-cols-2">
        {LISTS.map(([key, label]) => (
          <label key={key} className="rounded-[18px] border border-[#d5e3ed] bg-white p-4 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#56677d]">{label}</span>
            <textarea
              value={form[key] || ""}
              onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
              rows={8}
              className="mt-3 w-full resize-y rounded-xl border border-[#bfd4e3] bg-white px-4 py-3 text-sm text-[#08172a] outline-none focus:border-[#0aa7df]"
            />
          </label>
        ))}
        <div className="lg:col-span-2">
          {msg && <p className="mb-3 text-sm font-bold text-[#0b75a5]">{msg}</p>}
          <button className="rounded-xl bg-[#0aa7df] px-6 py-3 text-sm font-bold text-white hover:bg-[#078fc0]">
            Guardar opciones
          </button>
        </div>
      </form>
    </div>
  );
}
