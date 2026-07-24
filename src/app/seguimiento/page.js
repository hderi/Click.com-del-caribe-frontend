"use client";

const WHATSAPP_NUMBER = "529848047192";

export default function SeguimientoInicioPage() {
  const message = encodeURIComponent("Hola, necesito ayuda para consultar el seguimiento de mi equipo.");

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-5 py-8 text-[#0F172A]" style={{ fontFamily: "var(--cc-font)" }}>
      <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-2xl border border-[#D6DEE8] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-[#F8FAFC] p-8 sm:p-10">
            <a href="/" className="inline-flex">
              <img src="/logo-clickcom.png.png" alt="CLICK.COM del Caribe" className="h-20 w-auto object-contain" />
            </a>
            <p className="mt-8 text-[11px] font-black uppercase tracking-[0.18em] text-[#FF6B00]">Seguimiento de servicio</p>
            <h1 className="mt-3 text-3xl font-black leading-tight text-[#0F172A] sm:text-4xl">Consulta privada de reparación</h1>
            <p className="mt-4 max-w-md text-sm font-semibold leading-6 text-[#526174]">
              Por seguridad, el avance de cada reparación solo puede abrirse con el enlace privado que entrega CLICK.COM del Caribe.
            </p>
          </div>

          <div className="flex flex-col justify-center p-8 sm:p-10">
            <div className="rounded-xl border border-[#D6DEE8] bg-[#F8FAFC] p-5">
              <p className="text-sm font-black text-[#102033]">Necesitas tu enlace privado</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#526174]">
                Si ya recibiste el enlace por WhatsApp o correo, abre ese mensaje y toca el enlace. No se permite consultar una reparación escribiendo datos manualmente.
              </p>
            </div>

            <div className="mt-5 rounded-xl border border-[#F0C391] bg-[#FFF8EF] p-5">
              <p className="text-sm font-black text-[#9A4B00]">No tengo mi enlace</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#6B4A24]">
                Contacta al taller para que te reenvien el enlace de seguimiento correspondiente a tu folio.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#2563EB] px-5 text-sm font-black text-white transition hover:bg-[#1D4ED8]"
              >
                Pedir enlace por WhatsApp
              </a>
              <a href="/" className="inline-flex h-12 items-center justify-center rounded-md border border-[#D6DEE8] bg-white px-5 text-sm font-black text-[#2563EB] transition hover:bg-[#F2F7FF]">
                Volver al inicio
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
