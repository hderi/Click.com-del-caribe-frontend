"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getToken } from "@/lib/authStorage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const DEFAULT_POLICIES = [
  "EL CLIENTE ACEPTA LAS POLITICAS DE SERVICIO DE CLICK.COM DEL CARIBE Y ACEPTA QUE A TRAVES DE NUESTROS PROCEDIMIENTOS SE REALICE LA REPARACION Y/O DIAGNOSTICO DE SU EQUIPO DE COMPUTO AL SER ENTREGADO A NUESTRA EMPRESA.",
  "LA REVISION O DIAGNOSTICO DEL EQUIPO REPARABLE O NO REPARABLE ES DE: CPU/PC: $300.00 PESOS, LAPTOP: $500 PESOS, IMPRESORA LASER E INYECCION DE TINTA $300.00, TABLET $200.00, PRECIOS MAS IVA, EN NUESTRAS INSTALACIONES.",
  "EN CASO DE ACEPTAR EL SERVICIO PREVIA COTIZACION, NO SE COBRARA EL DIAGNOSTICO, UNICAMENTE EL COSTO DE LA REPARACION POR MANO DE OBRA Y REFACCIONES.",
  "EL TIEMPO DE GARANTIA EN LA REPARACION O MANO DE OBRA ES DE 7 DIAS NATURALES.",
  "EL TIEMPO DE GARANTIA EN REFACCIONES DEPENDERA DEL FABRICANTE O DEL PROVEEDOR.",
  "EL TIEMPO DE GARANTIA NO APLICA EN CASO DE ELIMINACION DE VIRUS Y CUALQUIER SOFTWARE QUE EL CLIENTE TRAIGA PARA INSTALAR.",
  "NO SE ENTREGA EL EQUIPO EN CASO DE NO PRESENTAR LA ORDEN DE SERVICIO CORRESPONDIENTE, EN CASO DE EXTRAVIO PRESENTAR DOCUMENTOS QUE AVALEN LA PROPIEDAD DEL MISMO.",
  "CLICK.COM DEL CARIBE NO SE HACE RESPONSABLE DE LOS ACCESORIOS Y DANOS FISICOS (GOLPES, RAYADURAS) NO DECLARADOS EN LA ORDEN DE SERVICIO.",
  "LA EMPRESA CLICK.COM DEL CARIBE Y SU REPRESENTANTE LEGAL PERSONA FISICA JUAN GABRIEL CUPUL HUU NO SE HACE RESPONSABLE DEL SOFTWARE ORIGINAL Y NO ORIGINAL INSTALADOS, ASI COMO TAMPOCO Y/O DESPUES DE DOS MESES DE HABER SIDO CONCLUIDO Y AVISADO AL CLIENTE DEL DIAGNOSTICO Y/O REPARACION.",
  "LA FORMA DE PAGO DEL SERVICIO ES DE CONTADO, CON TARJETA DE DEBITO O CREDITO (MAS EL 2.5%), CHEQUE A NOMBRE DE JUAN GABRIEL CUPUL HUU, Y SE ENTREGARA EL EQUIPO CUANDO EL PAGO ESTE EN FIRME EN LA CUENTA.",
  "VERIFIQUE QUE EL EQUIPO RECIBIDO ESTE DE ACUERDO A LO DECLARADO EN LA ORDEN DE SERVICIO, YA QUE NO SE ACEPTARA ALGUNA RECLAMACION POSTERIOR A LA FECHA DE ENTREGA.",
  "EN CASO CONTRARIO TENDRA UN COSTO DE $300.00 PESOS DE RESGUARDO POR DIA Y LA EMPRESA NO SE HACE RESPONSABLE DEL EQUIPO.",
];

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

function headers() {
  const token = typeof window !== "undefined" ? getToken() : "";
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function receiptData(repair) {
  const cliente = repair?.cliente || {};
  const equipo = repair?.equipo || {};
  const pago = repair?.pago || {};
  const anticipo = repair?.anticipo || {};
  const costo = Number(value(pago.costoServicio, pago.costo, 0));
  const pagoRecibido = Number(value(anticipo.monto, pago.anticipo, pago.pagoRecibido, 0));
  const saldo = Number(value(pago.saldoPendiente, pago.saldo, Math.max(0, costo - pagoRecibido)));

  return {
    folio: repair?.folio || "-",
    fechaIngreso: dateOnly(value(repair?.fechaIngreso, repair?.creadoEn)),
    fechaEstimada: dateOnly(value(repair?.fechaEntregaEstimada, repair?.fechaEstimada)),
    cliente: value(cliente.nombre, repair?.clienteNombre),
    telefono: value(cliente.telefono, repair?.telefono),
    correo: value(cliente.correo, repair?.correo),
    equipo: [equipo.marca, equipo.modelo].filter(Boolean).join(" ") || value(equipo.tipo, repair?.tipoEquipo, "Equipo"),
    tipo: value(equipo.tipo, repair?.tipoEquipo),
    serie: value(equipo.serie, repair?.numeroSerie),
    recibidoPor: value(repair?.recibidoPor, repair?.creadoPorNombre),
    tecnico: value(repair?.tecnico, "Sin asignar"),
    falla: value(repair?.fallaReportada),
    total: money(costo),
    pagoRecibido: money(pagoRecibido),
    saldo: money(saldo),
    formaPago: value(anticipo.formaPago, pago.metodoPago),
  };
}

export default function DigitalReceiptPage({ params }) {
  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const repairResponse = await fetch(`${API_URL}/api/reparaciones/${encodeURIComponent(params.id)}`, { headers: headers() });
        const repairData = await repairResponse.json();
        if (!repairResponse.ok) throw new Error(repairData.error || "No se pudo cargar el recibo");

        if (!ignore) {
          setRepair(repairData.reparacion);
        }
      } catch (err) {
        if (!ignore) setError(err.message || "No se pudo cargar el recibo");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadData();
    return () => {
      ignore = true;
    };
  }, [params.id]);

  const data = useMemo(() => receiptData(repair), [repair]);

  if (loading) {
    return <div className="p-6 font-bold text-[#102033]">Cargando recibo digital...</div>;
  }

  if (error || !repair) {
    return (
      <div className="p-6 font-bold text-[#102033]">
        <Link href="/admin/reparaciones" className="text-[#0055FF]">Volver a reparaciones</Link>
        <p className="mt-4 text-[#BE123C]">{error || "Recibo no encontrado"}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6] px-4 py-6 font-[Inter] text-[#0A0A0A]">
      <style jsx global>{`
        @media print {
          @page {
            size: letter;
            margin: 12mm;
          }
          html, body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .pdf-page {
            min-height: auto !important;
            box-shadow: none !important;
            border: 0 !important;
            margin: 0 !important;
            page-break-after: always;
          }
          .pdf-page:last-child {
            page-break-after: auto;
          }
        }
      `}</style>

      <div className="no-print mx-auto mb-4 flex max-w-[816px] items-center justify-between gap-3">
        <Link href={`/admin/reparaciones/${encodeURIComponent(data.folio)}?vista=ficha`} className="text-sm font-bold text-[#0055FF]">
          Volver a ficha
        </Link>
        <button type="button" onClick={() => window.print()} className="rounded-[6px] border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-bold text-[#0A0A0A]">
          Imprimir / guardar PDF
        </button>
      </div>

      <section className="pdf-page mx-auto mb-6 flex min-h-[1056px] max-w-[816px] items-start justify-center rounded-[6px] border border-[#D1D5DB] bg-white p-10 shadow-sm">
        <article className="w-[75mm] rounded-[6px] border border-[#D1D5DB] bg-white p-[5mm]">
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
            <MoneyRow label="Pago recibido" value={data.pagoRecibido} />
            <MoneyRow label="Saldo" value={data.saldo} strong />
            <p className="mt-1 text-[10px] font-bold text-[#4B5563]">Forma de pago: {data.formaPago}</p>
          </section>

          <footer className="mt-6 border-t border-[#D1D5DB] pt-3 text-center text-[9px] font-bold text-[#6B7280]">
            CLICK.COM del Caribe
          </footer>
        </article>
      </section>

      <section className="pdf-page mx-auto min-h-[1056px] max-w-[816px] rounded-[6px] border border-[#D1D5DB] bg-white p-10 shadow-sm">
        <header className="border-b border-[#D1D5DB] pb-6">
          <img src="/logo-clickcom.png.png" alt="CLICK.COM del Caribe" className="h-auto w-[170px] object-contain" />
          <p className="mt-5 text-[11px] font-black uppercase tracking-[0.2em] text-[#FF6B00]">Condiciones del servicio</p>
          <h1 className="mt-2 text-[28px] font-black leading-tight text-[#0A0A0A]">Politicas de servicio</h1>
          <p className="mt-2 text-sm font-semibold text-[#64748B]">Folio relacionado: {data.folio}</p>
        </header>

        <ol className="mt-8 space-y-4">
          {DEFAULT_POLICIES.map((policy, index) => (
            <li key={`${policy}-${index}`} className="grid grid-cols-[34px_1fr] gap-3 rounded-[6px] border border-[#EBEBEB] p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#F3F4F6] text-sm font-black text-[#0055FF]">{index + 1}</span>
              <p className="text-sm font-medium leading-6 text-[#0A0A0A]">{policy}</p>
            </li>
          ))}
        </ol>

        <footer className="mt-10 border-t border-[#D1D5DB] pt-4 text-center text-xs font-bold text-[#8A8A8A]">
          Este documento acompaña el recibo digital de servicio.
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
