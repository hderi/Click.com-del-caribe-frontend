"use client";

export default function ClientForm({
  form,
  saving = false,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <section className="rounded-lg border border-[#d7dee8] bg-white">
      <div className="flex flex-col gap-2 border-b border-[#e5e7eb] px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase text-[#1d4ed8]">Alta manual</p>
          <h2 className="text-lg font-bold text-[#111827]">Nuevo cliente</h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            Registra un cliente antes de crear una reparacion.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="h-9 rounded-md border border-[#d1d5db] px-3 text-sm font-semibold text-[#374151] hover:bg-[#f3f4f6]"
        >
          Cancelar
        </button>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Nombre del cliente *">
          <input
            value={form.nombre}
            onChange={(event) => onChange("nombre", event.target.value)}
            className="h-10 rounded-md border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#dbeafe]"
            placeholder="Ej. Maria Lopez"
          />
        </Field>

        <Field label="Telefono *">
          <input
            value={form.telefono}
            onChange={(event) => onChange("telefono", event.target.value)}
            className="h-10 rounded-md border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#dbeafe]"
            placeholder="Ej. 984 123 4567"
          />
        </Field>

        <Field label="Correo">
          <input
            value={form.email}
            onChange={(event) => onChange("email", event.target.value)}
            className="h-10 rounded-md border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#dbeafe]"
            placeholder="correo@ejemplo.com"
          />
        </Field>

        <Field label="Tipo">
          <select
            value={form.tipo}
            onChange={(event) => onChange("tipo", event.target.value)}
            className="h-10 rounded-md border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#dbeafe]"
          >
            <option>Particular</option>
            <option>Empresa</option>
          </select>
        </Field>

        <Field label="Nota interna" className="md:col-span-2 xl:col-span-3">
          <input
            value={form.nota}
            onChange={(event) => onChange("nota", event.target.value)}
            className="h-10 rounded-md border border-[#d1d5db] bg-white px-3 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#dbeafe]"
            placeholder="Ej. prefiere WhatsApp, requiere factura, cliente frecuente..."
          />
        </Field>

        <div className="flex items-end">
          <button
            disabled={saving}
            className="h-10 w-full rounded-md bg-[#2563eb] px-4 text-sm font-semibold text-white hover:bg-[#1d4ed8] disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar cliente"}
          </button>
        </div>
      </form>
    </section>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <label className={`grid gap-1.5 text-sm font-semibold text-[#111827] ${className}`}>
      {label}
      {children}
    </label>
  );
}
