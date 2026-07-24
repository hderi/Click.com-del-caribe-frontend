"use client";

import { getToken } from "@/lib/authStorage";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function normalizeClient(client) {
  return {
    id: client.id,
    name: client.nombre || client.name || "Cliente sin nombre",
    phone: client.telefono || client.phone || "Sin telefono",
    email: client.correo || client.email || "",
    type: client.tipo || client.type || "Particular",
    note: client.nota || client.note || "",
    createdAt: client.creadoEn || client.createdAt || "",
  };
}

export default function ClienteDetallePage({ params }) {
  const [clients, setClients] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const id = decodeURIComponent(params.id);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const token = getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const [clientsResponse, repairsResponse] = await Promise.all([
          fetch(`${API_URL}/api/clientes`, { headers }),
          fetch(`${API_URL}/api/reparaciones`, { headers }),
        ]);
        const clientsData = await clientsResponse.json();
        const repairsData = await repairsResponse.json();

        if (!ignore) {
          setClients((clientsData.clientes || clientsData || []).map(normalizeClient));
          setRepairs(repairsData.reparaciones || repairsData || []);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  const client = useMemo(() => clients.find((item) => String(item.id) === String(id)), [clients, id]);

  const clientRepairs = useMemo(() => {
    if (!client) return [];
    return repairs.filter((repair) => {
      const cliente = repair.cliente || {};
      return String(repair.clienteId || cliente.id || "") === String(client.id) || cliente.telefono === client.phone || cliente.nombre === client.name;
    });
  }, [repairs, client]);

  useEffect(() => {
    if (client) {
      setEditForm({
        nombre: client.name,
        telefono: client.phone,
        correo: client.email,
        tipo: client.type,
      });
    }
  }, [client]);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const token = getToken();
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_URL}/api/clientes/${client.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        alert("Error al guardar los cambios");
        return;
      }

      const updated = await response.json();
      setClients((prev) => prev.map((item) => (item.id === client.id ? normalizeClient(updated.cliente) : item)));
      setIsEditing(false);
    } catch {
      alert("Error de red");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="rounded-3xl bg-white p-8 text-[#102033]">Cargando cliente...</div>;

  if (!client) {
    return (
      <div className="rounded-3xl border border-[#C9D8E5] bg-white p-8">
        <h1 className="text-2xl font-black text-[#102033]">Cliente no encontrado</h1>
        <Link href="/admin/clientes" className="mt-4 inline-flex rounded-2xl bg-[#0077B6] px-5 py-3 text-sm font-black text-white">Volver a clientes</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/clientes" className="inline-flex text-sm font-black text-[#0077B6] hover:underline">← Volver a clientes</Link>

      <section className="rounded-[28px] border border-[#C9D8E5] bg-white p-6 shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FF7A00]">Ficha del cliente</p>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="rounded-xl bg-[#F8FBFD] px-4 py-2 text-sm font-black text-[#0077B6] hover:bg-[#E8F1F8]">Editar</button>
          ) : null}
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-black text-[#102033]">Nombre</label>
              <input type="text" value={editForm.nombre || ""} onChange={(event) => setEditForm({ ...editForm, nombre: event.target.value })} className="w-full rounded-xl border border-[#C9D8E5] p-3 text-[#102033]" required />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-black text-[#102033]">Telefono</label>
                <input type="text" value={editForm.telefono || ""} onChange={(event) => setEditForm({ ...editForm, telefono: event.target.value })} className="w-full rounded-xl border border-[#C9D8E5] p-3 text-[#102033]" required />
              </div>
              <div>
                <label className="block text-sm font-black text-[#102033]">Correo</label>
                <input type="email" value={editForm.correo || ""} onChange={(event) => setEditForm({ ...editForm, correo: event.target.value })} className="w-full rounded-xl border border-[#C9D8E5] p-3 text-[#102033]" />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button type="button" onClick={() => setIsEditing(false)} className="rounded-xl px-4 py-2 text-sm font-black text-[#526174]">Cancelar</button>
              <button type="submit" disabled={saving} className="rounded-xl bg-[#0077B6] px-5 py-2 text-sm font-black text-white">{saving ? "Guardando..." : "Guardar cambios"}</button>
            </div>
          </form>
        ) : (
          <>
            <h1 className="mt-2 text-3xl font-black text-[#102033]">{client.name}</h1>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <Info label="Telefono" value={client.phone} />
              <Info label="Correo" value={client.email || "Sin correo"} />
              <Info label="Tipo" value={client.type} />
            </div>
          </>
        )}
      </section>

      <section id="historial" className="rounded-[28px] border border-[#C9D8E5] bg-white p-6 shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
        <h2 className="text-xl font-black text-[#102033]">Historial de reparaciones</h2>
        {clientRepairs.length === 0 ? (
          <p className="mt-3 text-sm text-[#526174]">Este cliente aun no tiene reparaciones registradas.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {clientRepairs.map((repair) => (
              <div key={repair.folio} className="flex items-center justify-between rounded-2xl border border-[#C9D8E5] bg-[#F8FBFD] p-4">
                <div>
                  <p className="font-black text-[#102033]">{repair.folio}</p>
                  <p className="text-sm text-[#526174]">{repair.equipo?.marca || repair.marca || "Equipo"} {repair.equipo?.modelo || repair.modelo || ""}</p>
                </div>
                <span className="rounded-full bg-[#E3F5FC] px-3 py-1 text-xs font-black text-[#0077B6]">{repair.estado || "Recibido"}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#C9D8E5] bg-[#F8FBFD] p-4">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#526174]">{label}</p>
      <p className="mt-1 font-black text-[#102033]">{value}</p>
    </div>
  );
}
