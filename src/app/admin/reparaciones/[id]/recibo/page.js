"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getToken } from "@/lib/authStorage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function value(...items) {
  const found = items.find((item) => item !== undefined && item !== null && item !== "");
  return found === undefined ? "-" : found;
}

function money(amount) {
  const parsed = Number(amount || 0);
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(Number.isFinite(parsed) ? parsed : 0);
}

function dateOnly(input) {
  if (!input) return "-";
  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) return String(input);
  return parsed.toLocaleDateString("es-MX", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function photoSrc(photo) {
  const src = typeof photo === "string" ? photo : photo?.url || photo?.ruta || photo?.src || photo?.dataUrl || "";
  if (!src) return "";
  if (src.startsWith("data:") || src.startsWith("http")) return src;
  const absolute = `${API_URL}${src.startsWith("/") ? src : `/${src}`}`;
  if (!absolute.includes("/uploads/") || absolute.includes("token=")) return absolute;
  const token = getToken();
  return token ? `${absolute}${absolute.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}` : absolute;
}

function receiptData(repair) {
  const cliente = repair?.cliente || {};
  const contacto = repair?.contactoReparacion || {};
  const equipo = repair?.equipo || {};
  const pago = repair?.pago || {};
  const anticipo = repair?.anticipo || {};
  const costo = Number(value(pago.costoServicio, pago.costo, 0));
  const pagoRecibido = Number(value(anticipo.monto, pago.anticipo, 0));
  const saldo = Number(value(pago.saldoPendiente, pago.saldo, Math.max(0, costo - pagoRecibido)));

  return {
    folio: repair?.folio || "-",
    cliente: value(contacto.nombre, cliente.nombre, repair?.clienteNombre),
    telefono: value(contacto.telefono, cliente.telefono, repair?.telefono),
    equipo: [equipo.marca, equipo.modelo].filter(Boolean).join(" ") || value(equipo.tipo, repair?.tipoEquipo, "Equipo"),
    tipo: value(equipo.tipo, repair?.tipoEquipo),
    serie: value(equipo.serie, repair?.numeroSerie),
    fechaIngreso: dateOnly(value(repair?.fechaIngreso, repair?.creadoEn)),
    recibidoPor: value(repair?.recibidoPor, repair?.creadoPorNombre),
    tecnico: value(repair?.tecnico, "Sin asignar"),
    falla: value(repair?.fallaReportada),
    anticipo: money(pagoRecibido),
    saldo: money(saldo),
    total: money(costo),
    formaPago: value(anticipo.formaPago, pago.metodoPago),
    firmado: repair?.reciboFirmadoUrl || repair?.reciboFirmado?.url || repair?.documentos?.reciboFirmado?.url || "",
  };
}

export default function RepairReceiptPage({ params }) {
  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadRepair() {
      try {
        const token = getToken();
        const response = await fetch(`${API_URL}/api/reparaciones/${encodeURIComponent(params.id)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "No se pudo cargar el recibo");
        if (!ignore) setRepair(data.reparacion);
      } catch (err) {
        if (!ignore) setError(err.message || "No se pudo cargar el recibo");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadRepair();
    return () => {
      ignore = true;
    };
  }, [params.id]);

  const data = useMemo(() => receiptData(repair), [repair]);

  if (loading) {
    return <div className="p-6 font-bold text-[#102033]">Cargando recibo...</div>;
  }

  if (error || !repair) {
    return (
      <div className="p-6 font-bold text-[#102033]">
        <Link href="/admin/reparaciones" className="text-[#0077B6]">Volver a reparaciones</Link>
        <p className="mt-4 text-[#BE123C]">{error || "Recibo no encontrado"}</p>
      </div>
    );
  }

  return (
    <main className="ticket-print-root min-h-screen bg-[#F3F4F6] px-4 py-6 font-[Inter] text-[#111827]">
      <style jsx global>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: 4mm;
          }
          html, body {
            background: white !important;
          }
          body * {
            visibility: hidden !important;
          }
          .ticket-print-root,
          .ticket-print-root * {
            visibility: visible !important;
          }
          .ticket-print-root {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 72mm !important;
            padding: 0 !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .ticket-sheet {
            width: 72mm !important;
            box-shadow: none !important;
            border: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>

      <div className="no-print mb-4 flex w-full items-center justify-between px-8">
        <Link href="/admin/reparaciones" className="text-sm font-bold text-[#0077B6]">
          Volver a reparaciones
        </Link>
        <button type="button" onClick={() => window.print()} className="rounded-[6px] border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-bold text-[#0F172A]">
          Imprimir / guardar PDF
        </button>
      </div>

      <section className="ticket-sheet mx-auto w-[75mm] rounded-[6px] border border-[#D1D5DB] bg-white p-[5mm] shadow-sm">
        <header className="border-b border-[#D1D5DB] pb-3 text-center">
          <img src="/logo-clickcom.png.png" alt="CLICK.COM del Caribe" className="mx-auto h-auto w-[43mm] object-contain" />
          <p className="mt-2 text-[9px] font-black uppercase tracking-[0.18em] text-[#FF6B00]">Recibo de servicio</p>
          <h1 className="mt-1 font-mono text-[20px] font-black leading-none text-[#0F172A]">{data.folio}</h1>
        </header>

        <div className="divide-y divide-[#E5E7EB] text-[11px]">
          <Row label="Fecha" value={data.fechaIngreso} />
          <Row label="Cliente" value={data.cliente} />
          <Row label="Telefono" value={data.telefono} />
          <Row label="Equipo" value={data.equipo} />
          <Row label="Tipo" value={data.tipo} />
          <Row label="Serie" value={data.serie} />
          <Row label="Recibio" value={data.recibidoPor} />
          <Row label="Tecnico" value={data.tecnico} />
          <Row label="Falla" value={data.falla} stacked />
        </div>

        <section className="mt-3 border-y border-[#111827] py-2">
          <MoneyRow label="Total" value={data.total} />
          <MoneyRow label="Pago recibido" value={data.anticipo} />
          <MoneyRow label="Saldo" value={data.saldo} strong />
          <p className="mt-1 text-[10px] font-bold text-[#4B5563]">Forma de pago: {data.formaPago}</p>
        </section>

        <section className="mt-14 text-center">
          <div className="border-t border-[#111827]" />
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.08em]">Firma del cliente</p>
        </section>

        <section className="mt-14 text-center">
          <div className="border-t border-[#111827]" />
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.08em]">Firma de quien recibe</p>
        </section>

        <footer className="mt-6 border-t border-[#D1D5DB] pt-3 text-center text-[9px] font-bold text-[#6B7280]">
          CLICK.COM del Caribe
        </footer>
      </section>
    </main>
  );
}

function Row({ label, value, stacked = false }) {
  return (
    <div className={stacked ? "py-2" : "flex items-start justify-between gap-3 py-1.5"}>
      <span className="font-black uppercase tracking-[0.08em] text-[#6B7280]">{label}</span>
      <strong className={stacked ? "mt-1 block text-[#111827]" : "max-w-[42mm] text-right text-[#111827]"}>{value || "-"}</strong>
    </div>
  );
}

function MoneyRow({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-3 py-0.5 text-[11px]">
      <span className="font-black uppercase tracking-[0.08em] text-[#374151]">{label}</span>
      <strong className={strong ? "text-[14px] text-[#B45309]" : "text-[#111827]"}>{value}</strong>
    </div>
  );
}
