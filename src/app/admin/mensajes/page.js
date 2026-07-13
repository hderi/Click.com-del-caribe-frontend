"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("clickcom_token") : "";
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function getMessage(folio, type) {
  const res = await fetch(`${API_URL}/api/reparaciones/${folio}/${type}`, { method: "POST", headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "No se pudo preparar el mensaje");
  return data;
}

export default function MensajesPage() {
  const [reparaciones, setReparaciones] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/reparaciones`, { headers: authHeaders() })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "No se pudieron cargar órdenes");
        setReparaciones(data.reparaciones || []);
      })
      .catch((err) => setError(err.message));
  }, []);

  const stats = useMemo(() => {
    const whatsapp = reparaciones.filter((r) => ["whatsapp", "ambos"].includes(String(r.canalContacto || "").toLowerCase())).length;
    const correo = reparaciones.filter((r) => ["correo", "gmail", "ambos"].includes(String(r.canalContacto || "").toLowerCase())).length;
    const pendientes = reparaciones.filter((r) => r.linkActivo && !["finalizado", "entregado"].includes(r.estado)).length;
    return { whatsapp, correo, pendientes, total: reparaciones.length };
  }, [reparaciones]);

  async function abrir(folio, type) {
    try {
      const data = await getMessage(folio, type);
      window.open(type === "whatsapp" ? data.whatsappUrl : data.mailtoUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="space-y-5 text-[#172234]">
      <section className="rounded-[18px] border border-[#B8C9D8] bg-[#F7FAFC] p-6 shadow-[0_16px_32px_rgba(27,43,60,0.10)]">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#B45309]">Contacto con clientes</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.035em]">Mensajes y enlaces</h1>
        <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-[#526174]">Aquí se preparan los enlaces privados de seguimiento. No inventa mensajes: usa el folio real, teléfono/correo del cliente y token privado.</p>
      </section>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-700">{error}</div>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card title="WhatsApp" value={stats.whatsapp} note="Canal elegido" color="#128C7E" />
        <Card title="Correo" value={stats.correo} note="Canal elegido" color="#3279A8" />
        <Card title="Pendientes" value={stats.pendientes} note="Activos para notificar" color="#C76A24" />
        <Card title="Órdenes" value={stats.total} note="En sistema" color="#667085" />
      </section>

      <section className="rounded-[18px] border border-[#B8C9D8] bg-white p-5">
        <h2 className="text-xl font-black">Enlaces disponibles</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead className="bg-[#EDF4F8] text-left"><tr><Th>Folio</Th><Th>Cliente</Th><Th>Teléfono</Th><Th>Correo</Th><Th>Canal</Th><Th>Acción</Th></tr></thead>
            <tbody>{reparaciones.map((r) => <tr key={r.folio} className="border-t border-[#D0DDE8]"><td className="px-4 py-4 font-black text-[#087EA7]">{r.folio}</td><td className="px-4 py-4 font-bold">{r.cliente?.nombre || "Sin cliente"}</td><td className="px-4 py-4">{r.cliente?.telefono || "Sin teléfono"}</td><td className="px-4 py-4">{r.cliente?.correo || "Sin correo"}</td><td className="px-4 py-4 font-bold">{r.canalContacto || "whatsapp"}</td><td className="px-4 py-4"><div className="flex gap-2"><button onClick={() => abrir(r.folio, "whatsapp")} className="rounded-xl border border-[#B8C9D8] px-3 py-2 font-black text-[#128C7E]">WhatsApp</button><button onClick={() => abrir(r.folio, "email")} className="rounded-xl border border-[#B8C9D8] px-3 py-2 font-black text-[#0B86AD]">Correo</button></div></td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function Card({ title, value, note, color }) { return <article className="rounded-[16px] border border-[#B8C9D8] bg-white p-5"><p className="font-black">{title}</p><p className="mt-3 text-4xl font-black" style={{ color }}>{value}</p><p className="text-xs font-bold uppercase text-[#667085]">{note}</p></article>; }
function Th({ children }) { return <th className="px-4 py-3 text-[11px] font-black uppercase tracking-[0.13em] text-[#526174]">{children}</th>; }
