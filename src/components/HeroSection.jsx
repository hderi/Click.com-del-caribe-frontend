"use client";

const WHATSAPP_NUMBER = "529871119621";
const STEPS = ["Recibido", "Diagnostico", "Revision", "Reparacion", "Entrega"];

export default function HeroSection() {
  const whatsappMessage = encodeURIComponent(
    "Hola, necesito mi enlace privado de seguimiento o informacion sobre reparacion."
  );

  return (
    <section
      id="seguimiento"
      className="relative min-h-screen overflow-hidden bg-[#07111B] pt-24 text-white"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(0,174,239,0.34),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(255,122,0,0.26),transparent_28%),linear-gradient(135deg,#07111B_0%,#0B1D2B_46%,#05080D_100%)]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
        <div className="absolute inset-0 bg-black/24" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] max-w-[1180px] flex-col justify-center gap-10 px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <img
            src="/logo-clickcom.png.jpeg"
            alt="CLICK.COM DEL CARIBE"
            className="mx-auto mb-7 h-20 w-auto rounded-2xl bg-white/95 p-2 shadow-2xl sm:h-24"
          />
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#FFA21A]">
            Seguimiento de servicio
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Consulta que esta pasando con tu equipo.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base font-bold leading-8 text-white/72">
            Si recibiste un enlace privado por WhatsApp, puedes revisar el avance
            de tu reparacion como si fuera el seguimiento de un pedido.
          </p>
        </div>

        <div className="mx-auto w-full max-w-5xl rounded-[2rem] bg-black/20 p-4 shadow-2xl backdrop-blur-md ring-1 ring-white/10">
          <div className="rounded-[1.5rem] bg-white p-6 text-[#111827] shadow-xl sm:p-8">
            <div className="relative overflow-hidden rounded-3xl bg-[#EAF8FF] p-5 ring-1 ring-[#00AEEF]/20">
              <div className="absolute left-8 right-8 top-[3.15rem] h-2 rounded-full bg-white" />
              <div className="absolute left-8 top-[3.15rem] h-2 w-[58%] rounded-full bg-[#00AEEF]" />
              <div className="relative grid grid-cols-5 gap-2">
                {STEPS.map((step, index) => (
                  <div key={step} className="text-center">
                    <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full text-sm font-black shadow-lg ${index <= 2 ? "bg-[#00AEEF] text-white shadow-[#00AEEF]/25" : "bg-white text-[#647084]"}`}>
                      {index + 1}
                    </div>
                    <p className="mt-3 text-[11px] font-black uppercase tracking-wide text-[#344154]">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_0.92fr] lg:items-stretch">
              <div className="space-y-4 rounded-3xl border border-[#DDE7EF] bg-[#F7FAFD] p-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF7A00]">
                    Acceso privado
                  </p>
                  <h2 className="mt-2 text-3xl font-black text-[#080808]">
                    Usa el enlace que te envia el taller
                  </h2>
                  <p className="mt-2 text-sm font-bold leading-6 text-[#5B6472]">
                    Por seguridad, el seguimiento no se abre escribiendo solo el folio. Cada orden tiene un enlace privado con token.
                  </p>
                </div>

                <div className="rounded-3xl bg-white px-5 py-4 text-sm font-black leading-6 text-[#344154] ring-1 ring-[#DDE7EF]">
                  Si perdiste tu enlace, escribe al taller y te lo reenviamos por WhatsApp.
                </div>
              </div>

              <div className="rounded-3xl bg-[#07111B] p-5 text-white">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FFA21A]">
                  Acceso por enlace
                </p>
                <p className="mt-3 text-sm font-bold leading-6 text-white/72">
                  El enlace privado incluye tu folio y una clave segura para ver solo la informacion de tu reparacion.
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#00AEEF] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0077B6]"
                >
                  Contactar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
