"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const ESTADOS = [
  ["recibido", "Recibido"],
  ["diagnostico", "Diagnóstico"],
  ["en_reparacion", "En reparación"],
  ["en_espera", "En espera"],
  ["listo", "Listo"],
  ["entregado", "Entregado"],
];

const METODOS_PAGO = ["Por definir", "Efectivo", "Tarjeta de débito", "Tarjeta de crédito", "Transferencia", "Cheque"];

function token() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") || localStorage.getItem("authToken") || "";
}

function authHeaders(extra = {}) {
  const value = token();
  return {
    ...extra,
    ...(value ? { Authorization: `Bearer ${value}` } : {}),
  };
}

function labelEstado(value) {
  const found = ESTADOS.find(([key]) => key === value);
  return found ? found[1] : value || "Sin estado";
}

function money(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(number);
}

function date(value) {
  if (!value) return "Sin definir";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Cancun",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

function time(value) {
  if (!value) return "Sin definir";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Cancun",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function field(value) {
  return value === undefined || value === null || value === "" ? "—" : String(value);
}

function normalizePhoto(item) {
  if (!item) return null;
  if (typeof item === "string") return { src: item, name: "Evidencia" };
  const src = item.url || item.src || item.path || item.ruta || item.dataUrl || item.base64;
  if (!src) return null;
  return { src, name: item.name || item.nombre || "Evidencia" };
}

function getPhotos(repair) {
  const raw = [
    ...(Array.isArray(repair?.fotos) ? repair.fotos : []),
    ...(Array.isArray(repair?.fotosRecepcion) ? repair.fotosRecepcion : []),
    ...(Array.isArray(repair?.evidencias) ? repair.evidencias : []),
  ];
  const map = new Map();
  raw.map(normalizePhoto).filter(Boolean).forEach((photo) => {
    if (!map.has(photo.src)) map.set(photo.src, photo);
  });
  return [...map.values()];
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#E3EDF5] py-2 text-sm last:border-b-0">
      <span className="text-[#52657A]">{label}</span>
      <span className="text-right font-semibold text-[#0B1F33]">{field(value)}</span>
    </div>
  );
}

function Box({ title, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-[#C9DCEB] bg-white p-5 shadow-sm ${className}`}>
      <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#52657A]">{title}</h2>
      {children}
    </section>
  );
}

export default function RepairDetail({ repair }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const startMode = searchParams.get("modo") || "ver";
  const [mode, setMode] = useState(startMode);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const photos = useMemo(() => getPhotos(repair), [repair]);
  const folio = repair?.folio || repair?.id || "Sin folio";

  const [payment, setPayment] = useState({
    costoServicio: repair?.costoServicio || repair?.costo || "",
    anticipo: repair?.anticipo || "",
    metodoPago: repair?.metodoPago || repair?.formaPago || "Por definir",
    factura: repair?.factura ? "Sí" : "No",
    numeroFactura: repair?.numeroFactura || "",
    notaPago: repair?.notaPago || "",
  });

  const [advance, setAdvance] = useState({
    estado: repair?.estado || repair?.status || "recibido",
    titulo: "",
    descripcion: "",
    visibleCliente: true,
  });

  if (!repair) {
    return (
      <main className="p-6">
        <button onClick={() => router.back()} className="mb-4 font-semibold text-[#0077B6]">← Volver</button>
        <div className="rounded-2xl border border-[#C9DCEB] bg-white p-6">
          <h1 className="text-2xl font-bold text-[#0B1F33]">Orden no encontrada</h1>
        </div>
      </main>
    );
  }

  async function patchJson(url, body) {
    const res = await fetch(url, {
      method: "PATCH",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { error: text };
    }
    if (!res.ok) throw new Error(data.error || "No se pudo guardar");
    return data;
  }

  async function savePayment(event) {
    event.preventDefault();
    setMessage("");
    const costo = Number(payment.costoServicio || 0);
    const anticipo = Number(payment.anticipo || 0);
    if (anticipo > costo) {
      setMessage("El anticipo no puede superar el costo del servicio.");
      return;
    }
    if (payment.factura === "Sí" && !payment.numeroFactura.trim()) {
      setMessage("Agrega el número de factura.");
      return;
    }
    if (!window.confirm("¿Guardar este movimiento de pago?")) return;
    setSaving(true);
    try {
      const payload = {
        ...payment,
        costoServicio: costo,
        anticipo,
        saldo: Math.max(costo - anticipo, 0),
        movimientoPago: {
          fecha: new Date().toISOString(),
          costoServicio: costo,
          anticipo,
          metodoPago: payment.metodoPago,
          factura: payment.factura,
          numeroFactura: payment.numeroFactura,
          notaPago: payment.notaPago,
        },
      };
      try {
        await patchJson(`${API_URL}/api/reparaciones/${encodeURIComponent(folio)}/pago`, payload);
      } catch {
        await patchJson(`${API_URL}/api/reparaciones/${encodeURIComponent(folio)}`, payload);
      }
      setMessage("Pago actualizado. El movimiento quedó registrado.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function saveAdvance(event) {
    event.preventDefault();
    setMessage("");
    if (!advance.titulo.trim() || !advance.descripcion.trim()) {
      setMessage("Agrega título y descripción del avance.");
      return;
    }
    if (!window.confirm("¿Guardar avance visible para el cliente?")) return;
    setSaving(true);
    try {
      const payload = {
        estado: advance.estado,
        titulo: advance.titulo,
        descripcion: advance.descripcion,
        visibleCliente: true,
        fecha: new Date().toISOString(),
      };
      try {
        await fetch(`${API_URL}/api/reparaciones/${encodeURIComponent(folio)}/avances`, {
          method: "POST",
          headers: authHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify(payload),
        }).then(async (res) => {
          if (!res.ok) throw new Error((await res.json()).error || "No se pudo guardar");
        });
      } catch {
        await patchJson(`${API_URL}/api/reparaciones/${encodeURIComponent(folio)}`, {
          estado: advance.estado,
          ultimoAvance: advance.titulo,
          observacionesTecnicas: advance.descripcion,
        });
      }
      setMessage("Avance actualizado para el cliente.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#EAF4FA] p-6 font-sans text-[#0B1F33]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <button onClick={() => router.back()} className="mb-2 font-semibold text-[#0077B6]">← Volver</button>
          <h1 className="text-3xl font-bold">Orden {folio}</h1>
          <p className="text-sm text-[#52657A]">
            Ingresado el {date(repair.fechaIngreso || repair.fecha || repair.creadoEn)} · Recibió: {field(repair.recibio || repair.recibidoPor)} · Técnico: {field(repair.tecnico || repair.tecnicoAsignado)}
          </p>
        </div>
        {mode === "ver" ? (
          <button onClick={() => window.print()} className="rounded-xl bg-[#009FE3] px-5 py-3 font-bold text-white shadow-sm">
            Imprimir orden
          </button>
        ) : (
          <button onClick={() => setMode("ver")} className="rounded-xl border border-[#BBD2E4] bg-white px-5 py-3 font-bold text-[#0B1F33]">
            Volver a ficha
          </button>
        )}
      </div>

      {mode === "pago" && (
        <Box title="Editar pago y factura">
          <form onSubmit={savePayment} className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1 text-sm font-semibold">Costo del servicio
              <input className="rounded-xl border border-[#BBD2E4] p-3" type="number" min="0" value={payment.costoServicio} onChange={(e) => setPayment({ ...payment, costoServicio: e.target.value })} />
            </label>
            <label className="grid gap-1 text-sm font-semibold">Anticipo
              <input className="rounded-xl border border-[#BBD2E4] p-3" type="number" min="0" max={payment.costoServicio || undefined} value={payment.anticipo} onChange={(e) => setPayment({ ...payment, anticipo: e.target.value })} />
            </label>
            <label className="grid gap-1 text-sm font-semibold">Cómo se pagó
              <select className="rounded-xl border border-[#BBD2E4] p-3" value={payment.metodoPago} onChange={(e) => setPayment({ ...payment, metodoPago: e.target.value })}>
                {METODOS_PAGO.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-semibold">Factura
              <select className="rounded-xl border border-[#BBD2E4] p-3" value={payment.factura} onChange={(e) => setPayment({ ...payment, factura: e.target.value })}>
                <option>No</option>
                <option>Sí</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm font-semibold">Número de factura
              <input className="rounded-xl border border-[#BBD2E4] p-3 disabled:bg-[#EEF5FA]" disabled={payment.factura !== "Sí"} value={payment.numeroFactura} onChange={(e) => setPayment({ ...payment, numeroFactura: e.target.value })} />
            </label>
            <label className="grid gap-1 text-sm font-semibold md:col-span-2">Notas de pago
              <textarea className="min-h-28 rounded-xl border border-[#BBD2E4] p-3" value={payment.notaPago} onChange={(e) => setPayment({ ...payment, notaPago: e.target.value })} />
            </label>
            <button disabled={saving} className="rounded-xl bg-[#FF7900] px-5 py-3 font-bold text-white disabled:opacity-60">
              {saving ? "Guardando..." : "Guardar pago"}
            </button>
          </form>
        </Box>
      )}

      {mode === "avance" && (
        <Box title="Actualizar avance técnico">
          <form onSubmit={saveAdvance} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1 text-sm font-semibold">Estado
                <select className="rounded-xl border border-[#BBD2E4] p-3" value={advance.estado} onChange={(e) => setAdvance({ ...advance, estado: e.target.value })}>
                  {ESTADOS.map(([key, value]) => <option key={key} value={key}>{value}</option>)}
                </select>
              </label>
              <label className="grid gap-1 text-sm font-semibold">Título del avance
                <input className="rounded-xl border border-[#BBD2E4] p-3" value={advance.titulo} onChange={(e) => setAdvance({ ...advance, titulo: e.target.value })} />
              </label>
            </div>
            <textarea className="min-h-32 rounded-xl border border-[#BBD2E4] p-3" value={advance.descripcion} onChange={(e) => setAdvance({ ...advance, descripcion: e.target.value })} placeholder="Describe qué se revisó, qué se encontró y qué debe ver el cliente." />
            <label className="flex items-center gap-2 font-semibold">
              <input type="checkbox" checked readOnly />
              Visible para el cliente
            </label>
            <button disabled={saving} className="w-fit rounded-xl bg-[#FF7900] px-5 py-3 font-bold text-white disabled:opacity-60">
              {saving ? "Guardando..." : "Guardar avance"}
            </button>
          </form>
        </Box>
      )}

      {message && (
        <p className="mt-4 rounded-xl border border-[#BBD2E4] bg-white p-3 font-semibold text-[#0B1F33]">{message}</p>
      )}

      {mode === "ver" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Box title="Cliente">
            <Row label="Nombre" value={repair.clienteNombre || repair.cliente?.nombre || repair.cliente} />
            <Row label="Teléfono" value={repair.telefono || repair.cliente?.telefono} />
            <Row label="Correo" value={repair.correo || repair.cliente?.correo} />
          </Box>
          <Box title="Equipo">
            <Row label="Tipo" value={repair.tipoEquipo || repair.equipo?.tipo} />
            <Row label="Marca / modelo" value={repair.marcaModelo || repair.modelo || repair.equipo?.modelo || repair.equipo} />
            <Row label="Número de serie" value={repair.numeroSerie || repair.serie || repair.equipo?.serie} />
          </Box>
          <Box title="Recepción">
            <Row label="Recibió" value={repair.recibio || repair.recibidoPor} />
            <Row label="Hora de entrada" value={time(repair.fechaIngreso || repair.fecha || repair.creadoEn)} />
            <Row label="Técnico / encargado" value={repair.tecnico || repair.tecnicoAsignado} />
          </Box>
          <Box title="Fechas y estado">
            <Row label="Ingreso" value={date(repair.fechaIngreso || repair.fecha || repair.creadoEn)} />
            <Row label="Entrega estimada" value={date(repair.fechaEntregaEstimada || repair.fechaEstimada)} />
            <Row label="Estado" value={labelEstado(repair.estado || repair.status)} />
          </Box>
          <Box title="Pago y anticipo">
            <Row label="Costo del servicio" value={money(repair.costoServicio || repair.costo)} />
            <Row label="Anticipo" value={money(repair.anticipo)} />
            <Row label="Forma de pago" value={repair.metodoPago || repair.formaPago} />
            <Row label="Saldo" value={money((Number(repair.costoServicio || repair.costo || 0) - Number(repair.anticipo || 0)))} />
            <Row label="Factura" value={repair.factura ? "Sí" : "No"} />
            {repair.factura ? <Row label="Número de factura" value={repair.numeroFactura} /> : null}
          </Box>
          <Box title="Garantía">
            <Row label="Aplica" value={repair.garantia || repair.aplicaGarantia} />
            <Row label="Días" value={repair.diasGarantia} />
            <Row label="Nota" value={repair.notaGarantia} />
          </Box>
          <Box title="Falla reportada" className="lg:col-span-2">
            <p className="text-sm font-semibold">{field(repair.problema || repair.falla || repair.descripcionProblema)}</p>
          </Box>
          <Box title="Observaciones de recepción">
            <p className="text-sm font-semibold">{field(repair.observacionesRecepcion || repair.observaciones)}</p>
          </Box>
          <Box title="Accesorios recibidos">
            <p className="text-sm font-semibold">{Array.isArray(repair.accesorios) ? repair.accesorios.join(", ") : field(repair.accesorios)}</p>
          </Box>
          <Box title="Estado físico">
            <p className="text-sm font-semibold">{Array.isArray(repair.estadoFisico) ? repair.estadoFisico.join(", ") : field(repair.estadoFisico)}</p>
          </Box>
          <Box title="Fotos / evidencia">
            {photos.length ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {photos.map((photo) => (
                  <figure key={photo.src} className="overflow-hidden rounded-xl border border-[#C9DCEB]">
                    <img src={photo.src} alt={photo.name} className="h-32 w-full object-cover" />
                    <figcaption className="truncate p-2 text-xs font-semibold text-[#52657A]">{photo.name}</figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <p className="text-sm font-semibold text-[#52657A]">Sin fotos cargadas.</p>
            )}
          </Box>
          <Box title="Historial técnico" className="lg:col-span-2">
            {(repair.historial || repair.timeline || []).length ? (
              <div className="space-y-3">
                {(repair.historial || repair.timeline).map((item, index) => (
                  <div key={index} className="rounded-xl border border-[#E3EDF5] bg-[#F8FBFD] p-3">
                    <div className="flex justify-between gap-4">
                      <strong>{item.titulo || item.title || "Movimiento"}</strong>
                      <span className="text-sm text-[#52657A]">{date(item.fecha || item.date)} {time(item.fecha || item.date)}</span>
                    </div>
                    <p className="mt-1 text-sm text-[#52657A]">{item.descripcion || item.description}</p>
                    <p className="mt-1 text-xs font-semibold text-[#52657A]">Por: {field(item.usuario || item.tecnico)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm font-semibold text-[#52657A]">Sin movimientos registrados.</p>
            )}
          </Box>
        </div>
      )}
    </main>
  );
}
