const BADGES = [
  "Servicio especializado en informatica",
  "Click.com, soluciones en segundos",
  "Click.com, soluciones seguras",
];

const VALUES = [
  "Respeto",
  "Honradez",
  "Confianza",
  "Lealtad",
  "Responsabilidad",
  "Honestidad",
  "Compromiso",
];

export default function AboutSection() {
  return (
    <section id="inicio" className="relative min-h-screen overflow-hidden bg-[#07111B] px-5 pt-24 text-white sm:px-8 lg:px-12">
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

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-7rem)] max-w-[1180px] items-center gap-10 py-12 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="border-l-4 border-[#00AEEF] pl-6 sm:pl-8">
          <img
            src="/logo-clickcom.png.jpeg"
            alt="CLICK.COM DEL CARIBE"
            className="mb-8 h-24 w-auto rounded-2xl bg-white/95 p-2 shadow-2xl sm:h-28"
          />

          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#FFA21A]">
            Nosotros
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            CLICK.COM del Caribe.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/82">
            Somos una empresa dedicada al negocio tecnologico con vocacion de servicio,
            brindando soluciones integrales a empresas, instituciones gubernamentales
            y clientes particulares.
          </p>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-white/72">
            Proveemos productos y servicios de alta calidad para satisfacer las
            expectativas de nuestros clientes, innovando y siendo competitivos en
            soluciones de equipos y servicios para el mercado tecnologico.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {BADGES.map((badge, index) => (
              <span
                key={badge}
                className={`rounded-full px-5 py-3 text-sm font-black ${
                  index === 0 ? "bg-[#00AEEF] text-white" : "bg-white/10 text-white ring-1 ring-white/15"
                }`}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-black/20 p-4 shadow-2xl backdrop-blur-md ring-1 ring-white/10">
          <div className="rounded-[1.5rem] bg-white p-6 text-[#111827] shadow-xl sm:p-8">
            <div className="grid gap-4 lg:grid-cols-2">
              <article className="rounded-3xl bg-[#EAF8FF] p-5 ring-1 ring-[#00AEEF]/15">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0077B6]">Mision</p>
                <p className="mt-3 text-sm font-bold leading-6 text-[#344154]">
                  Proveer productos y servicios de calidad que satisfagan las expectativas de nuestros clientes, innovando y siendo competitivos en soluciones tecnologicas.
                </p>
              </article>

              <article className="rounded-3xl bg-[#07111B] p-5 text-white ring-1 ring-black/10">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FFA21A]">Vision</p>
                <p className="mt-3 text-sm font-bold leading-6 text-white/78">
                  Ser una empresa exitosa, rentable y atractiva, dedicada al negocio tecnologico con vocacion de servicio y soluciones integrales.
                </p>
              </article>
            </div>

            <div className="mt-5 rounded-3xl bg-[#F4F8FC] p-5 ring-1 ring-[#E0E8F0]">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#D86100]">Valores</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {VALUES.map((value) => (
                  <span key={value} className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#344154] ring-1 ring-[#E0E8F0]">
                    {value}
                  </span>
                ))}
              </div>
            </div>

            <a
              href="#servicios"
              className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-[#FF7A00] px-6 py-4 text-base font-black text-white transition hover:bg-[#FFA21A]"
            >
              Ver servicios
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

