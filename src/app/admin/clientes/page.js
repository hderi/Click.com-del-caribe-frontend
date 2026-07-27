"use client";

import { getToken } from "@/lib/authStorage";
import { useEffect, useMemo, useState } from "react";
import ClientsHeader from "@/components/admin/ClientsHeader";
import ClientsTable from "@/components/admin/ClientsTable";
import ClientForm from "@/components/admin/ClientForm";
import ClientsError from "@/components/admin/ClientsError";
import ClientsStats from "@/components/admin/ClientsStats";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const emptyForm = {
  nombre: "",
  telefono: "",
  email: "",
  tipo: "Particular",
  clienteFrecuente: false,
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
  const repairClientId = repair.clienteId || repairClient.id || "";
  if (repairClientId) return String(repairClientId) === String(client.id);

  const sameName = normalizeText(repairClient.nombre) === normalizeText(client.nombre || client.name);
  if (!sameName) return false;

  const samePhone =
    client.telefono &&
    repairClient.telefono &&
    String(repairClient.telefono).replace(/\D/g, "") === String(client.telefono).replace(/\D/g, "");
  const sameEmail =
    client.correo &&
    repairClient.correo &&
    normalizeText(repairClient.correo) === normalizeText(client.correo);

  return Boolean(samePhone || sameEmail);
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
    frequent: Boolean(client.clienteFrecuente || client.frecuente || client.cliente_frecuente),
    repairs: clientRepairs.length,
    equipment: clientEquipment.length,
    lastVisit: latest ? formatDate(repairDate(latest)) : "Sin visitas",
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
          clienteFrecuente: Boolean(form.clienteFrecuente),
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
        <ClientForm
          form={form}
          saving={saving}
          onChange={updateForm}
          onSubmit={saveClient}
          onCancel={() => setShowForm(false)}
        />
      )}

      <ClientsStats stats={stats} />
      <ClientsError message={error} />

      <ClientsTable clients={filteredClients} loading={loading} onNewClient={() => setShowForm(true)} />
    </div>
  );
}
