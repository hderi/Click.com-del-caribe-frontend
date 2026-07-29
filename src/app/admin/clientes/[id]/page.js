"use client";

import { getToken } from "@/lib/authStorage";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function normalizeClient(client) {
  return {
    id: client.id,
    name: client.nombre || client.name || "Cliente sin nombre",
    phone: client.telefono || client.phone || "Sin teléfono",
    email: client.correo || client.email || "",
    type: client.tipo || client.type || "Particular",
    frequent: Boolean(client.clienteFrecuente || client.frecuente || client.cliente_frecuente),
    note: client.notas || client.nota || client.note || "",
    createdAt: client.creadoEn || client.createdAt || "",
  };
}

function repairStatusLabel(status) {
  const labels = {
    recibido: "Recibido",
    diagnostico: "Diagnóstico",
    en_reparacion: "En reparación",
    esperando_refaccion: "En espera",
    finalizado: "Listo",
    entregado: "Entregado",
  };
  return labels[status] || status || "Recibido";
}

function warrantyPhaseLabel(status) {
  const labels = {
    abierta: "Abierta",
    diagnostico: "Diagnostico",
    en_reparacion: "En reparacion",
    finalizada: "Finalizada",
    cerrada: "Cerrada",
  };
  return labels[status] || status || "Abierta";
}

function parseDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function dateOnly(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function addDays(value, days) {
  const parsed = parseDate(value);
  if (!parsed) return "";
  parsed.setDate(parsed.getDate() + Number(days || 0));
  return dateOnly(parsed.toISOString());
}

function formatDate(value) {
  const parsed = parseDate(value);
  if (!parsed) return "-";
  return parsed.toLocaleDateString("es-MX", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function warrantyValidity(warranty) {
  const repair = warranty.reparacion || {};
  const days = Number(repair.garantia?.dias || 0);
  const start = repair.entregadoEn || repair.actualizadoEn || warranty.creadoEn;
  const vence = days > 0 ? addDays(start, days) : "";
  const expired = vence && vence < dateOnly(new Date().toISOString());
  return { vence, label: expired ? "Vencida" : "Vigente", expired };
}

export default function ClienteDetallePage({ params }) {
  const [clients, setClients] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [warranties, setWarranties] = useState([]);
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
        const [clientsResponse, repairsResponse, warrantiesResponse] = await Promise.all([
          fetch(`${API_URL}/api/clientes`, { headers }),
          fetch(`${API_URL}/api/reparaciones`, { headers }),
          fetch(`${API_URL}/api/garantias?limit=200`, { headers }),
        ]);
        const clientsData = await clientsResponse.json();
        const repairsData = await repairsResponse.json();
        const warrantiesData = await warrantiesResponse.json();

        if (!ignore) {
          setClients((clientsData.clientes || clientsData || []).map(normalizeClient));
          setRepairs(repairsData.reparaciones || repairsData || []);
          setWarranties(warrantiesData.garantias || warrantiesData || []);
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
      const repairClient = repair.cliente || {};
      const repairClientId = repair.clienteId || repairClient.id || "";
      if (repairClientId) return String(repairClientId) === String(client.id);

      const sameName = String(repairClient.nombre || "").trim().toLowerCase() === String(client.name || "").trim().toLowerCase();
      if (!sameName) return false;

      const samePhone = repairClient.telefono && client.phone && String(repairClient.telefono).replace(/\D/g, "") === String(client.phone).replace(/\D/g, "");
      const sameEmail = repairClient.correo && client.email && String(repairClient.correo).toLowerCase() === String(client.email).toLowerCase();
      return Boolean(samePhone || sameEmail);
    });
  }, [repairs, client]);

  const clientWarranties = useMemo(() => {
    if (!client) return [];
    return warranties.filter((warranty) => {
      const repair = warranty.reparacion || {};
      const repairClient = repair.cliente || {};
      const repairClientId = repair.clienteId || repairClient.id || "";
      if (repairClientId) return String(repairClientId) === String(client.id);

      const samePhone = repairClient.telefono && client.phone && String(repairClient.telefono).replace(/\D/g, "") === String(client.phone).replace(/\D/g, "");
      const sameEmail = repairClient.correo && client.email && String(repairClient.correo).toLowerCase() === String(client.email).toLowerCase();
      return Boolean(samePhone || sameEmail);
    });
  }, [warranties, client]);

  useEffect(() => {
    if (client) {
      setEditForm({
        nombre: client.name,
        telefono: client.phone,
        correo: client.email,
        tipo: client.type,
        clienteFrecuente: client.frequent,
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

  if (loading) return <div className="rounded-md border border-[#E5E7EB] bg-white p-6 text-sm font-semibold text-[#111827]">Cargando cliente...</div>;

  if (!client) {
    return (
      <div className="rounded-md border border-[#E5E7EB] bg-white p-6">
        <h1 className="text-xl font-bold text-[#111827]">Cliente no encontrado</h1>
        <Link href="/admin/clientes" className="mt-4 inline-flex h-9 items-center rounded-md bg-[#0055FF] px-4 text-sm font-semibold text-white">Volver a clientes</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-[Inter]">
      <Link href="/admin/clientes" className="inline-flex text-sm font-bold text-[#0055FF] hover:underline">← Volver a clientes</Link>

      <section className="overflow-hidden rounded-md border border-[#E5E7EB] bg-white">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C2410C]">Ficha del cliente</p>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="h-9 rounded-md border border-[#D1D5DB] px-3 text-sm font-semibold text-[#0055FF] hover:bg-[#F8FAFC]">Editar</button>
          ) : null}
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-5 px-5 py-5">
            <div>
              <Label>Nombre</Label>
              <TextInput value={editForm.nombre || ""} onChange={(event) => setEditForm({ ...editForm, nombre: event.target.value })} required />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Teléfono</Label>
                <TextInput value={editForm.telefono || ""} onChange={(event) => setEditForm({ ...editForm, telefono: event.target.value })} required />
              </div>
              <div>
                <Label>Correo</Label>
                <TextInput type="email" value={editForm.correo || ""} onChange={(event) => setEditForm({ ...editForm, correo: event.target.value })} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Tipo de cliente</Label>
                <select value={editForm.tipo || "Particular"} onChange={(event) => setEditForm({ ...editForm, tipo: event.target.value })} className="h-10 w-full rounded-md border border-[#D1D5DB] bg-white px-3 text-sm text-[#111827] outline-none focus:border-[#0055FF]">
                  <option value="Particular">Particular</option>
                  <option value="Empresa">Empresa</option>
                </select>
              </div>
              <label className="flex h-10 items-center gap-3 self-end rounded-md border border-[#D1D5DB] px-3 text-sm font-semibold text-[#111827]">
                <input type="checkbox" checked={Boolean(editForm.clienteFrecuente)} onChange={(event) => setEditForm({ ...editForm, clienteFrecuente: event.target.checked })} className="h-4 w-4 accent-[#0055FF]" />
                Cliente frecuente
              </label>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#E5E7EB] pt-4">
              <button type="button" onClick={() => setIsEditing(false)} className="h-9 rounded-md border border-[#D1D5DB] px-4 text-sm font-semibold text-[#374151] hover:bg-[#F8FAFC]">Cancelar</button>
              <button type="submit" disabled={saving} className="h-9 rounded-md bg-[#0055FF] px-5 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Guardando..." : "Guardar cambios"}</button>
            </div>
          </form>
        ) : (
          <div className="px-5 py-5">
            <h1 className="text-2xl font-bold text-[#0A0A0A]">{client.name}</h1>
            <div className="mt-5 grid overflow-hidden rounded-md border border-[#E5E7EB] md:grid-cols-4">
              <Info label="Teléfono" value={client.phone} />
              <Info label="Correo" value={client.email || "Sin correo"} />
              <Info label="Tipo" value={client.type} />
              <Info label="Cliente frecuente" value={client.frequent ? "Sí" : "No"} />
            </div>
          </div>
        )}
      </section>

      <section id="historial" className="overflow-hidden rounded-md border border-[#E5E7EB] bg-white">
        <div className="border-b border-[#E5E7EB] px-5 py-4">
          <h2 className="text-lg font-bold text-[#0A0A0A]">Historial de reparaciones</h2>
        </div>
        {clientRepairs.length === 0 ? (
          <p className="px-5 py-5 text-sm text-[#6B7280]">Este cliente aún no tiene reparaciones registradas.</p>
        ) : (
          <div>
            {clientRepairs.map((repair) => (
              <div key={repair.folio} className="grid grid-cols-[110px_1fr_140px] items-center border-b border-[#E5E7EB] px-5 py-4 last:border-b-0">
                <p className="text-sm font-bold text-[#0055FF]">{repair.folio}</p>
                <p className="text-sm font-semibold text-[#111827]">{repair.equipo?.marca || repair.marca || "Equipo"} {repair.equipo?.modelo || repair.modelo || ""}</p>
                <span className="justify-self-end rounded-md border border-[#D1D5DB] bg-[#F8FAFC] px-3 py-1 text-xs font-bold text-[#374151]">{repairStatusLabel(repair.estado)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section id="garantias" className="overflow-hidden rounded-md border border-[#E5E7EB] bg-white">
        <div className="border-b border-[#E5E7EB] px-5 py-4">
          <h2 className="text-lg font-bold text-[#0A0A0A]">Garantias vinculadas</h2>
        </div>
        {clientWarranties.length === 0 ? (
          <p className="px-5 py-5 text-sm text-[#6B7280]"></p>
        ) : (
          <div>
            {clientWarranties.map((warranty) => {
              const validity = warrantyValidity(warranty);
              const repair = warranty.reparacion || {};
              const equipo = repair.equipo || {};
              return (
                <div key={warranty.folio} className="grid gap-3 border-b border-[#E5E7EB] px-5 py-4 last:border-b-0 md:grid-cols-[110px_1fr_140px_140px_90px] md:items-center">
                  <p className="font-mono text-sm font-black text-[#0077B6]">
                    {warranty.folio}
                    <span className="mt-1 block text-[11px] font-bold text-[#526174]">RX {warranty.reparacionFolio || repair.folio || "-"}</span>
                  </p>
                  <p className="text-sm font-semibold text-[#111827]">{[equipo.marca, equipo.modelo].filter(Boolean).join(" ") || "Equipo"}</p>
                  <span className="justify-self-start rounded-full border border-[#B7D7F3] bg-[#F2F8FD] px-3 py-1 text-xs font-bold text-[#0077B6]">{warrantyPhaseLabel(warranty.estado)}</span>
                  <span className={`justify-self-start rounded-full border px-3 py-1 text-xs font-bold ${validity.expired ? "border-[#F5C58B] bg-[#FFF5E8] text-[#A14E00]" : "border-[#A8DDC0] bg-[#F0FAF4] text-[#13753A]"}`}>
                    {validity.label}
                  </span>
                  <Link href={`/admin/garantias/${encodeURIComponent(warranty.folio)}`} className="text-sm font-bold text-[#0055FF] hover:underline">Ver</Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function Label({ children }) {
  return <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">{children}</label>;
}

function TextInput(props) {
  return <input {...props} className="h-10 w-full rounded-md border border-[#D1D5DB] bg-white px-3 text-sm text-[#111827] outline-none focus:border-[#0055FF]" />;
}

function Info({ label, value }) {
  return (
    <div className="border-b border-[#E5E7EB] p-4 md:border-b-0 md:border-r md:last:border-r-0">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#64748B]">{label}</p>
      <p className="mt-2 text-sm font-bold text-[#0A0A0A]">{value}</p>
    </div>
  );
}
