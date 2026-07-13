"use client";
/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   StatusBadge — Reusable status badge for repair states
   Used across repairs table, detail views, and dashboard
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const STATUS_CONFIG = {
  recibido: {
    label: "Recibido",
    bg: "bg-[#6366F1]/10",
    text: "text-[#818CF8]",
    border: "border-[#6366F1]/20",
    dot: "bg-[#6366F1]",
  },
  diagnostico: {
    label: "Diagnóstico",
    bg: "bg-brand-orange/10",
    text: "text-brand-orange",
    border: "border-brand-orange/20",
    dot: "bg-brand-orange",
  },
  en_reparacion: {
    label: "En reparación",
    bg: "bg-brand-blue/10",
    text: "text-brand-blue-light",
    border: "border-brand-blue/20",
    dot: "bg-brand-blue",
  },
  esperando_refaccion: {
    label: "Esperando refacción",
    bg: "bg-warning/10",
    text: "text-warning",
    border: "border-warning/20",
    dot: "bg-warning",
  },
  finalizado: {
    label: "Finalizado",
    bg: "bg-success/10",
    text: "text-success",
    border: "border-success/20",
    dot: "bg-success",
  },
  entregado: {
    label: "Entregado",
    bg: "bg-[#14B8A6]/10",
    text: "text-[#2DD4BF]",
    border: "border-[#14B8A6]/20",
    dot: "bg-[#14B8A6]",
  },
};
export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.recibido;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border whitespace-nowrap ${config.bg} ${config.text} ${config.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      {config.label}
    </span>
  );
}
export { STATUS_CONFIG };


