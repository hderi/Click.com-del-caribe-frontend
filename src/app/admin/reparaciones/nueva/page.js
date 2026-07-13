import NewRepairForm from "@/components/admin/NewRepairForm";
import Link from "next/link";
export default function NuevaReparacionPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin/reparaciones"
              className="text-text-muted hover:text-text-primary transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-text-primary">Nueva reparación</h1>
          </div>
          <p className="text-sm text-text-secondary">
            Registrar una nueva orden de servicio
          </p>
        </div>
        <p className="text-xs text-text-muted">
          Los campos con <span className="text-brand-orange">*</span> son obligatorios
        </p>
      </div>
      {/* Form */}
      <NewRepairForm />
    </div>
  );
}


