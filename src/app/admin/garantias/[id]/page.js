"use client";

import { getToken } from "@/lib/authStorage";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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

function formatDateTime(value) {
  const parsed = parseDate(value);
  if (!parsed) return "-";
  return parsed.toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" });
}

function textValue(...values) {
  const value = values.find((item) => String(item ?? "").trim());
  return value ? String(value).trim() : "-";
}

function statusInfo(warranty, vence) {
  if (warranty.estado === "cerrada") return { label: "Cerrada", className: "border-[#C9D8E5] bg-[#EEF2F6] text-[#526174]" };
  if (vence && vence < dateOnly(new Date().toISOString())) return { label: "Vencida", className: "border-[#F5C58B] bg-[#FFF5E8] text-[#A14E00]" };
  return { label: "Vigente", className: "border-[#A8DDC0] bg-[#F0FAF4] text-[#13753A]" };
}

export default function WarrantyDetailPage({ params }) {
  const [warranty, setWarranty] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWarranty() {
      setError("");
      try {
        const token = getToken();
        const response = await fetch(`${API_URL}/api/garantias/${params.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Garantía no encontrada");
        setWarranty(data.garantia);
        setMessage(data.mensaje);
      } catch (err) {
        setError(err.message || "Garantía no encontrada.");
        setWarranty(null);
      } finally {
        setLoading(false);
      }
    }
    loadWarranty();
  }, [params.id]);

  const windowData = useMemo(() => {
    const repair = warranty?.reparacion || {};
    const days = Number(repair.garantia?.dias || 0);
    const inicio = repair.entregadoEn || repair.actualizadoEn || warranty?.creadoEn;
    const vence = days > 0 ? addDays(inicio, days) : "";
    return { inicio, vence, days };
  }, [warranty]);

  if (loading) {
    return <div className="rounded-[6px] border border-[#E5E7EB] bg-white p-6 text-sm font-bold">Cargando garantía...</div>;
  }

  if (!warranty) {
    return (
      <main className="space-y-4">
        <Link href="/admin/garantias" className="text-sm font-bold text-[#0055FF]">← Volver a garantías</Link>
        <div className="rounded-[6px] border border-[#F4B7B7] bg-[#FFF5F5] p-6 text-sm font-bold text-[#B42318]">{error || "Garantía no encontrada."}</div>
      </main>
    );
  }

  const repair = warranty.reparacion || {};
  const cliente = repair.cliente || {};
  const equipo = repair.equipo || {};
  const opening = Array.isArray(warranty.historial) ? warranty.historial[0] || {} : {};
  const badge = statusInfo(warranty, windowData.vence);
  const phone = String(cliente.telefono || "").replace(/\D/g, "");
  const receiptData = {
    folio: textValue(warranty.folio),
    rx: textValue(warranty.reparacionFolio),
    cliente: textValue(cliente.nombre),
    telefono: textValue(cliente.telefono),
    equipo: textValue(equipo.marca, equipo.tipo),
    modelo: textValue(equipo.modelo),
    serie: textValue(equipo.serie, "Sin serie"),
    fechaIngresoRx: formatDate(repair.fechaIngreso || repair.dateIn || repair.creadoEn),
    entregaRx: formatDate(repair.entregadoEn || repair.actualizadoEn),
    fechaGarantia: formatDate(opening.fechaIngreso || warranty.creadoEn),
    recibidoPor: textValue(opening.recibidoPor, opening.tecnico),
    accesorios: textValue(opening.accesorios),
    falla: textValue(warranty.motivo, opening.motivo, opening.descripcion),
    observaciones: textValue(opening.observaciones),
  };

  function printReceipt() {
    window.print();
  }

  return (
    <main className="space-y-6 text-[#0A0A0A]" style={{ fontFamily: "Inter, var(--cc-font), Arial, sans-serif" }}>
      <WarrantyReceiptPrint data={receiptData} />
      <style jsx global>{`
        .gt-receipt-print {
          display: none;
        }

        @media print {
          @page {
            size: 80mm auto;
            margin: 4mm;
          }

          body * {
            visibility: hidden !important;
          }

          .gt-receipt-print,
          .gt-receipt-print * {
            visibility: visible !important;
          }

          .gt-receipt-print {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 72mm;
            color: #0A0A0A;
            font-family: Inter, Arial, sans-serif;
          }
        }
      `}</style>
      <div className="flex items-center justify-between gap-3">
        <Link href="/admin/garantias" className="text-sm font-bold text-[#0055FF]">← Volver a garantías</Link>
        <button
          type="button"
          onClick={printReceipt}
          className="rounded-[6px] border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-bold text-[#334155] transition hover:bg-[#F8FAFC]"
        >
          Imprimir recibo GT
        </button>
      </div>

      <section className="overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-white">
        <div className="flex flex-col gap-4 border-b border-[#E5E7EB] px-6 py-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF6B00]">Ficha de garantía</p>
            <h1 className="mt-2 text-[26px] font-bold tracking-[-0.02em]">{warranty.folio}</h1>
            <p className="mt-2 text-sm font-medium text-[#526174]">Garantía vinculada con la orden {warranty.reparacionFolio}.</p>
          </div>
          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${badge.className}`}>{badge.label}</span>
        </div>

        <div className="grid border-b border-[#E5E7EB] md:grid-cols-4">
          <Info label="GT" value={warranty.folio} />
          <Info label="RX original" value={warranty.reparacionFolio || "-"} />
          <Info label="Inicio" value={formatDate(windowData.inicio)} />
          <Info label="Vence" value={formatDate(windowData.vence)} sub={windowData.days ? `${windowData.days} días de garantía` : "Sin días configurados"} />
        </div>
      </section>

      <section className="overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-white">
        <div className="border-b border-[#E5E7EB] px-6 py-4">
          <h2 className="text-lg font-bold">Orden RX vinculada</h2>
          <p className="mt-1 text-[13px] font-medium text-[#526174]">Estos datos vienen de la reparación original y no se modifican desde la garantía.</p>
        </div>
        <div className="grid border-b border-[#E5E7EB] md:grid-cols-3">
          <Info label="Cliente" value={cliente.nombre || "-"} sub={cliente.telefono || "-"} />
          <Info label="Correo" value={cliente.correo || "-"} />
          <Info label="Contacto" value={repair.canal || repair.contacto || "-"} />
        </div>
        <div className="grid border-b border-[#E5E7EB] md:grid-cols-4">
          <Info label="Tipo" value={equipo.tipo || "-"} />
          <Info label="Marca" value={equipo.marca || "-"} />
          <Info label="Modelo" value={equipo.modelo || "-"} />
          <Info label="Serie" value={equipo.serie || "Sin serie"} />
        </div>
        <div className="grid md:grid-cols-3">
          <Info label="Recibió" value={repair.recibio || "-"} />
          <Info label="Técnico original" value={repair.tecnico || "-"} />
          <Info label="Entrega RX" value={formatDate(repair.entregadoEn || repair.actualizadoEn)} />
        </div>
      </section>

      <section className="overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-white">
        <div className="border-b border-[#E5E7EB] px-6 py-4">
          <h2 className="text-lg font-bold">Detalle de garantía</h2>
        </div>
        <div className="grid gap-0 md:grid-cols-2">
          <Panel title="Falla reportada en garantía">
            <p className="text-sm font-semibold leading-6 text-[#334155]">{warranty.motivo || "-"}</p>
          </Panel>
          <Panel title="Falla reportada en RX original">
            <p className="text-sm font-semibold leading-6 text-[#334155]">{repair.fallaReportada || "-"}</p>
          </Panel>
        </div>
      </section>

      <section className="overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-white">
        <div className="border-b border-[#E5E7EB] px-6 py-4">
          <h2 className="text-lg font-bold">Historial de garantía</h2>
        </div>
        <div className="divide-y divide-[#E5E7EB]">
          {(warranty.historial || []).map((item, index) => (
            <div key={`${item.fecha}-${index}`} className="grid gap-2 px-6 py-4 md:grid-cols-[170px_1fr_160px]">
              <p className="text-sm font-bold text-[#526174]">{formatDateTime(item.fecha)}</p>
              <div>
                <p className="text-sm font-bold">{item.titulo || item.estado || "Actualización"}</p>
                <p className="mt-1 text-sm font-medium text-[#526174]">{item.descripcion || "-"}</p>
              </div>
              <p className="text-sm font-bold text-[#526174]">Por: {item.tecnico || "-"}</p>
            </div>
          ))}
          {!warranty.historial?.length ? (
            <p className="px-6 py-8 text-center text-sm font-bold text-[#6B7280]">Sin movimientos registrados.</p>
          ) : null}
        </div>
      </section>

      <section className="overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-white">
        <div className="border-b border-[#E5E7EB] px-6 py-4">
          <h2 className="text-lg font-bold">Documentos y comunicación</h2>
        </div>
        <div className="grid gap-3 p-6 md:grid-cols-3">
          <button onClick={printReceipt} className="rounded-[6px] border border-[#D1D5DB] px-4 py-3 text-sm font-bold text-[#334155]">Imprimir recibo GT</button>
          <a href={phone ? `https://wa.me/52${phone}?text=${encodeURIComponent(message?.text || "")}` : "#"} target="_blank" rel="noreferrer" className="rounded-[6px] border border-[#D1D5DB] px-4 py-3 text-center text-sm font-bold text-[#16854E]">WhatsApp</a>
          <a href={`mailto:${cliente.correo || ""}?subject=${encodeURIComponent(message?.subject || warranty.folio)}&body=${encodeURIComponent(message?.text || "")}`} className="rounded-[6px] border border-[#D1D5DB] px-4 py-3 text-center text-sm font-bold text-[#0055FF]">Correo</a>
        </div>
      </section>
    </main>
  );
}

function WarrantyReceiptPrint({ data }) {
  return (
    <section className="gt-receipt-print">
      <div style={{ border: "1px solid #111827", padding: "10px", width: "100%" }}>
        <div style={{ textAlign: "center", borderBottom: "1px solid #111827", paddingBottom: "8px" }}>
          <img src="/logo-clickcom.png.png" alt="CLICK.COM del Caribe" style={{ width: "42mm", height: "auto", objectFit: "contain" }} />
          <p style={{ margin: "8px 0 0", fontSize: "10px", fontWeight: 800, letterSpacing: "0.14em" }}>RECIBO DE GARANTÍA</p>
          <p style={{ margin: "4px 0 0", fontSize: "18px", fontWeight: 900 }}>{data.folio}</p>
          <p style={{ margin: "2px 0 0", fontSize: "10px", fontWeight: 700 }}>Orden original: {data.rx}</p>
        </div>

        <ReceiptRow label="Cliente" value={data.cliente} />
        <ReceiptRow label="Teléfono" value={data.telefono} />
        <ReceiptRow label="Equipo" value={data.equipo} />
        <ReceiptRow label="Modelo" value={data.modelo} />
        <ReceiptRow label="Serie" value={data.serie} />
        <ReceiptRow label="Ingreso RX" value={data.fechaIngresoRx} />
        <ReceiptRow label="Entrega RX" value={data.entregaRx} />
        <ReceiptRow label="Ingreso GT" value={data.fechaGarantia} />
        <ReceiptRow label="Recibió garantía" value={data.recibidoPor} />
        <ReceiptRow label="Accesorios" value={data.accesorios} />

        <div style={{ borderTop: "1px solid #111827", paddingTop: "8px", marginTop: "8px" }}>
          <p style={{ margin: 0, fontSize: "9px", fontWeight: 800, letterSpacing: "0.12em" }}>FALLA REPORTADA</p>
          <p style={{ margin: "4px 0 0", fontSize: "11px", lineHeight: 1.35, fontWeight: 700 }}>{data.falla}</p>
        </div>

        <div style={{ borderTop: "1px solid #111827", paddingTop: "8px", marginTop: "8px" }}>
          <p style={{ margin: 0, fontSize: "9px", fontWeight: 800, letterSpacing: "0.12em" }}>OBSERVACIONES</p>
          <p style={{ margin: "4px 0 0", fontSize: "10px", lineHeight: 1.35, fontWeight: 600 }}>{data.observaciones}</p>
        </div>

        <div style={{ marginTop: "18mm" }}>
          <div style={{ borderTop: "1px solid #111827", paddingTop: "4px", textAlign: "center", fontSize: "10px", fontWeight: 800 }}>
            Firma del cliente
          </div>
        </div>

        <div style={{ marginTop: "14mm" }}>
          <div style={{ borderTop: "1px solid #111827", paddingTop: "4px", textAlign: "center", fontSize: "10px", fontWeight: 800 }}>
            Firma de quien recibe
          </div>
        </div>

        <p style={{ borderTop: "1px solid #111827", margin: "12px 0 0", paddingTop: "8px", textAlign: "center", fontSize: "9px", lineHeight: 1.35, fontWeight: 700 }}>
          CLICK.COM del Caribe
        </p>
      </div>
    </section>
  );
}

function ReceiptRow({ label, value }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "27mm 1fr", gap: "6px", borderBottom: "1px solid #D1D5DB", padding: "6px 0" }}>
      <p style={{ margin: 0, fontSize: "9px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</p>
      <p style={{ margin: 0, fontSize: "11px", fontWeight: 800, wordBreak: "break-word" }}>{value}</p>
    </div>
  );
}

function Info({ label, value, sub }) {
  return (
    <div className="border-b border-[#E5E7EB] px-6 py-4 md:border-r md:last:border-r-0">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6B7280]">{label}</p>
      <p className="mt-2 text-sm font-bold">{value}</p>
      {sub ? <p className="mt-1 text-xs font-medium text-[#526174]">{sub}</p> : null}
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div className="min-h-[130px] border-b border-[#E5E7EB] p-6 md:border-r md:last:border-r-0">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6B7280]">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}
