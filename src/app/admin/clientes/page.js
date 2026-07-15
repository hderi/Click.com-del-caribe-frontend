"use client";

import { getToken } from "@/lib/authStorage";
import { useEffect, useMemo, useState } from "react";
import ClientsHeader from "@/components/admin/ClientsHeader";
import ClientsTable from "@/components/admin/ClientsTable";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const emptyForm = {
  nombre: "",
  telefono: "",
  email: "",
  tipo: "Particular",
  nota: "",
};

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function dateValue(value) {
  if (!value) return 0;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatDate(value) {
  if (!value) return "Sin visitas";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("es-MX", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function repairDate(repair) {
  return repair.entregadoEn || repair.fechaIngreso || repair.creadoEn || repair.actualizadoEn || "";
}

function isActiveRepair(repair) {
  return repair && repair.estado !== "entregado" && repair.linkActivo !== false;
}

function belongsToClient(repair, client) {
  if (!repair || !client) return false;
  const repairClient = repair.cliente || {};
  return (
    repair.clienteId === client.id ||
    repairClient.id === client.id ||
    (client.telefono && repairClient.telefono && String(repairClient.telefono).replace(/\D/g, "") === String(client.telefono).replace(/\D/g, "")) ||
    (client.correo && repairClient.correo && normalizeText(repairClient.correo) === normalizeText(client.correo)) ||
    (client.nombre && repairClient.nombre && normalizeText(repairClient.nombre) === normalizeText(client.nombre))
  );
}

function belongsToClientEquipment(equipment, client, clientRepairs) {
  if (!equipment || !client) return false;
  const linkedByClient = equipment.clienteId === client.id || equipment.cliente?.id === client.id;
  const linkedByRepair = clientRepairs.some((repair) => repair.equipoId === equipment.id || repair.equipo?.id === equipment.id);
  return linkedByClient || linkedByRepair;
}

function buildClientRow(client, repairs, equipment) {
  const clientRepairs = repairs.filter((repair) => belongsToClient(repair, client));
  const clientEquipment = equipment.filter((item) => belongsToClientEquipment(item, client, clientRepairs));
  const orderedRepairs = clientRepairs.slice().sort((a, b) => dateValue(repairDate(b)) - dateValue(repairDate(a)));
  const latest = orderedRepairs[0];
  const active = clientRepairs.some(isActiveRepair);

  return {
    id: client.id,
    name: client.nombre || client.name || "Sin nombre",
    phone: client.telefono || client.phone || "",
    email: client.correo || client.email || "",
    type: client.tipo || client.type || "Particular",
    repairs: clientRepairs.length,
    equipment: clientEquipment.length,
    lastVisit: latest ? formatDate(repairDate(latest)) : formatDate(client.creadoEn),
    active,
    note: client.notas || client.nota || client.note || "Cliente registrado",
    receivedBy: latest?.recibidoPor || "Sin registrar",
  };
}

export default function ClientesPage() {
  const [clients, setClients] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const token = typeof window !== "undefined" ? getToken() : "";
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const [clientsResponse, repairsResponse, equipmentResponse] = await Promise.all([
        fetch(`${API_URL}/api/clientes`, { headers }),
        fetch(`${API_URL}/api/reparaciones`, { headers }),
        fetch(`${API_URL}/api/equipos`, { headers }),
      ]);

      const clientsData = await clientsResponse.json();
      const repairsData = await repairsResponse.json();
      const equipmentData = await equipmentResponse.json();

      if (!clientsResponse.ok) throw new Error(clientsData.error || "No se pudieron cargar los clientes");
      if (!repairsResponse.ok) throw new Error(repairsData.error || "No se pudieron cargar las reparaciones");
      if (!equipmentResponse.ok) throw new Error(equipmentData.error || "No se pudieron cargar los equipos");

      setClients(Array.isArray(clientsData) ? clientsData : clientsData.clientes || []);
      setRepairs(repairsData.reparaciones || []);
      setEquipment(equipmentData.equipos || []);
    } catch (err) {
      setError(err.message || "Error al cargar clientes");
      setClients([]);
      setRepairs([]);
      setEquipment([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const clientRows = useMemo(() => clients.map((client) => buildClientRow(client, repairs, equipment)), [clients, repairs, equipment]);

  const filteredClients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return clientRows;

    return clientRows.filter((client) =>
      [client.name, client.phone, client.email, client.type, client.note, client.receivedBy]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [clientRows, searchQuery]);

  const stats = useMemo(() => {
    const active = clientRows.filter((client) => client.active).length;
    const companies = clientRows.filter((client) => client.type === "Empresa").length;
    const repairCount = clientRows.reduce((sum, client) => sum + Number(client.repairs || 0), 0);
    return [
      { label: "Clientes", count: clientRows.length, color: "#0077B6", note: "Registrados" },
      { label: "Activos", count: active, color: "#1F8F5F", note: "Con equipo en taller" },
      { label: "Empresas", count: companies, color: "#D97706", note: "Clientes negocio" },
      { label: "Historial", count: repairCount, color: "#475569", note: "Reparaciones asociadas" },
    ];
  }, [clientRows]);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveClient = async (event) => {
    event.preventDefault();
    if (!form.nombre.trim() || !form.telefono.trim()) {
      setError("Nombre y teléfono son obligatorios.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const token = typeof window !== "undefined" ? getToken() : "";
      const response = await fetch(`${API_URL}/api/clientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          telefono: form.telefono.trim(),
          correo: form.email.trim(),
          tipo: form.tipo,
          nota: form.nota.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo guardar el cliente");
      setForm(emptyForm);
      setShowForm(false);
      await loadData();
    } catch (err) {
      setError(err.message || "Error al guardar cliente");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <ClientsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        clientCount={clientRows.length}
        onNewClient={() => setShowForm((value) => !value)}
      />

      {showForm && (
        <section className="rounded-[24px] border border-[#C9D8E5] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FF7A00]">Alta manual</p>
              <h2 className="text-2xl font-black tracking-[-0.02em] text-[#102033]">Nuevo cliente</h2>
              <p className="mt-1 text-sm text-[#526174]">Úsalo cuando quieras registrar un cliente antes de crear una reparación.</p>
            </div>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-2xl border border-[#C9D8E5] px-4 py-2 text-sm font-black text-[#526174] hover:bg-[#EEF5FA]">
              Cancelar
            </button>
          </div>

          <form onSubmit={saveClient} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="grid gap-2 text-sm font-black text-[#102033]">
              Nombre del cliente *
              <input value={form.nombre} onChange={(event) => updateForm("nombre", event.target.value)} className="h-12 rounded-2xl border border-[#BFD0DF] bg-[#F8FBFD] px-4 text-sm font-semibold outline-none focus:border-[#00A8E8]" placeholder="Ej. María López" />
            </label>
            <label className="grid gap-2 text-sm font-black text-[#102033]">
              Teléfono *
              <input value={form.telefono} onChange={(event) => updateForm("telefono", event.target.value)} className="h-12 rounded-2xl border border-[#BFD0DF] bg-[#F8FBFD] px-4 text-sm font-semibold outline-none focus:border-[#00A8E8]" placeholder="Ej. 984 123 4567" />
            </label>
            <label className="grid gap-2 text-sm font-black text-[#102033]">
              Correo
              <input value={form.email} onChange={(event) => updateForm("email", event.target.value)} className="h-12 rounded-2xl border border-[#BFD0DF] bg-[#F8FBFD] px-4 text-sm font-semibold outline-none focus:border-[#00A8E8]" placeholder="correo@ejemplo.com" />
            </label>
            <label className="grid gap-2 text-sm font-black text-[#102033]">
              Tipo
              <select value={form.tipo} onChange={(event) => updateForm("tipo", event.target.value)} className="h-12 rounded-2xl border border-[#BFD0DF] bg-[#F8FBFD] px-4 text-sm font-semibold outline-none focus:border-[#00A8E8]">
                <option>Particular</option>
                <option>Empresa</option>
              </select>
            </label>
            <label className="md:col-span-2 xl:col-span-3 grid gap-2 text-sm font-black text-[#102033]">
              Nota interna
              <input value={form.nota} onChange={(event) => updateForm("nota", event.target.value)} className="h-12 rounded-2xl border border-[#BFD0DF] bg-[#F8FBFD] px-4 text-sm font-semibold outline-none focus:border-[#00A8E8]" placeholder="Ej. prefiere WhatsApp, requiere factura, cliente frecuente..." />
            </label>
            <div className="flex items-end">
              <button disabled={saving} className="h-12 w-full rounded-2xl bg-[#FF7A00] px-5 text-sm font-black text-white shadow-[0_12px_24px_rgba(255,122,0,0.22)] hover:bg-[#E66A00] disabled:opacity-60">
                {saving ? "Guardando..." : "Guardar cliente"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {stats.map((item) => (
          <div key={item.label} className="rounded-2xl border border-[#C9D8E5] bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.07)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#526174]">{item.label}</p>
                <p className="mt-1 text-3xl font-black" style={{ color: item.color }}>{item.count}</p>
                <p className="mt-1 text-xs leading-5 text-[#526174]">{item.note}</p>
              </div>
              <span className="mt-1 h-3 w-3 rounded-full" style={{ background: item.color, boxShadow: `0 0 0 6px ${item.color}18` }} />
            </div>
          </div>
        ))}
      </section>

      {error && (
        <div className="rounded-2xl border border-[#F3B5A7] bg-[#FFF2EE] px-4 py-3 text-sm font-black text-[#9A3412]">
          {error}
        </div>
      )}

      <ClientsTable clients={filteredClients} loading={loading} onNewClient={() => setShowForm(true)} />
    </div>
  );
}
