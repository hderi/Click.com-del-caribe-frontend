const SERVICES = [
  {
    title: "Reparaciones",
    description: "Diagnostico y reparacion de laptops, PCs y equipos que ya no responden como deberian.",
    detail: "Pantallas, encendido, rendimiento, sistema y hardware.",
  },
  {
    title: "Equipos PC",
    description: "Mantenimiento, limpieza, optimizacion y armado de equipos para casa o negocio.",
    detail: "Desktop, laptop, All in One y componentes.",
  },
  {
    title: "Impresoras",
    description: "Revision, limpieza, calibracion y soporte para equipos de impresion.",
    detail: "Tinta, toner, rodillos, atascos y configuracion.",
  },
  {
    title: "Camaras y redes",
    description: "Soporte para videovigilancia, conectividad y equipos tecnologicos de negocio.",
    detail: "Instalacion, revision, red y mantenimiento.",
  },
];

export default function ServicesSection() {
  return (
    <section id="servicios" className="relative overflow-hidden bg-[#F4F8FC] px-5 py-16 sm:px-8 lg:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(0,174,239,0.14),transparent_26%),radial-gradient(circle_at_88%_78%,rgba(255,122,0,0.13),transparent_28%)]" />
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#00AEEF] via-[#FF7A00] to-[#00AEEF]" />

      <div className="relative mx-auto max-w-[1180px]">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#FF7A00]">Servicios</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-[#080808] sm:text-5xl">
              Lo que ofrecemos para resolver fallas reales.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-[#4B5563] lg:ml-auto">
            Servicios principales para que el cliente identifique rápido cómo podemos ayudarle,
            sin sentirse perdido entre palabras tecnicas. Claro, directo y profesional.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, index) => (
            <article
              key={service.title}
              className="group relative overflow-hidden rounded-[2rem] border border-white bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,174,239,0.14)]"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#00AEEF] to-[#FF7A00]" />
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#00AEEF]/10 transition group-hover:bg-[#FF7A00]/12" />

              <div className={`mb-7 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-lg ${index < 2 ? "bg-[#00AEEF] shadow-[#00AEEF]/25" : "bg-[#FF7A00] shadow-[#FF7A00]/25"}`}>
                {index + 1}
              </div>
              <h3 className="text-xl font-black text-[#080808]">{service.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#4B5563]">{service.description}</p>
              <p className="mt-6 rounded-2xl bg-[#F4F8FC] p-4 text-xs font-bold leading-5 text-[#3D4755] ring-1 ring-[#E0E8F0]">
                {service.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


