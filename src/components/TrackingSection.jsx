"use client";

const STEPS = ["Recibido", "Diagnostico", "En reparacion", "Pruebas", "Entregado"];

export default function TrackingSection() {
  return (
    <section id="seguimiento" className="relative overflow-hidden bg-[#F4F8FC] px-5 py-24 sm:px-8 lg:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(0,174,239,0.15),transparent_28%),radial-gradient(circle_at_82%_72%,rgba(255,122,0,0.14),transparent_28%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#FF7A00]">Seguimiento</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-[#080808] sm:text-5xl">
            La vista donde el cliente ve el avance real.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-8 text-[#4B5563]">
            El seguimiento se abre solo desde el enlace privado que entrega el taller.
            Asi protegemos datos del cliente, fotos, equipo y saldo de la reparacion.
          </p>

          <div className="mt-8 max-w-xl rounded-[2rem] border border-white bg-white/86 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0077B6]">Enlace privado</p>
            <p className="mt-2 text-sm font-bold leading-6 text-[#526174]">
              Si el cliente pierde su enlace, el taller puede reenviarlo desde la orden registrada.
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] bg-[#07111B] p-4 shadow-[0_28px_90px_rgba(15,23,42,0.18)]">
          <div className="rounded-[1.5rem] bg-white p-6 text-[#111827] sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF7A00]">Ejemplo de vista cliente</p>
                <h3 className="mt-2 text-3xl font-black text-[#080808]">RX-101</h3>
                <p className="mt-1 text-sm font-bold text-[#5B6472]">Laptop Dell Inspiron 15</p>
              </div>
              <span className="w-fit rounded-full bg-[#00AEEF]/12 px-4 py-2 text-xs font-black text-[#0077B6]">
                En reparacion
              </span>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-5">
              {STEPS.map((step, index) => (
                <div key={step} className="rounded-2xl bg-[#F4F8FC] p-3 text-center ring-1 ring-[#E0E8F0]">
                  <div className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-xs font-black ${index <= 2 ? "bg-[#00AEEF] text-white" : "bg-white text-[#5B6472]"}`}>
                    {index + 1}
                  </div>
                  <p className={`mt-2 text-[11px] font-black leading-tight ${index <= 2 ? "text-[#111827]" : "text-[#6B7280]"}`}>
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-[#EAF8FF] p-5 ring-1 ring-[#00AEEF]/15">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0077B6]">Observacion</p>
                <p className="mt-2 text-sm font-bold leading-6 text-[#344154]">
                  Se detecto falla en modulo de memoria. Equipo en pruebas despues del reemplazo.
                </p>
              </div>
              <div className="rounded-3xl bg-[#FFF3E8] p-5 ring-1 ring-[#FF7A00]/15">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#D86100]">Fotos del avance</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="h-16 rounded-2xl bg-[#07111B]/85" />
                  <div className="h-16 rounded-2xl bg-[#00AEEF]/30" />
                  <div className="h-16 rounded-2xl bg-[#FF7A00]/35" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
