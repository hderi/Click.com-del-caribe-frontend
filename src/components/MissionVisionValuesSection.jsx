const VALUES = [
  "Respeto",
  "Honradez",
  "Confianza",
  "Lealtad",
  "Responsabilidad",
  "Honestidad",
  "Compromiso",
];

export default function MissionVisionValuesSection() {
  return (
    <section id="mision" className="relative min-h-screen overflow-hidden bg-[#F4F8FC] px-5 py-24 sm:px-8 lg:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(0,174,239,0.14),transparent_26%),radial-gradient(circle_at_88%_78%,rgba(255,122,0,0.13),transparent_28%)]" />
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#00AEEF] via-[#FF7A00] to-[#00AEEF]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-12rem)] max-w-7xl flex-col justify-center">
        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#FF7A00]">Mision, vision y valores</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-[#080808] sm:text-5xl">
              Lo que guia nuestro trabajo.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-[#4B5563] lg:ml-auto">
            Una base clara para atender con calidad, competir con soluciones reales
            y mantener confianza con cada cliente.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <article className="rounded-[2rem] bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-white sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#00AEEF]">Mision</p>
            <p className="mt-5 text-base font-bold leading-8 text-[#344154]">
              Proveer productos y servicios de calidad, que satisfagan de manera
              consistente las expectativas de nuestros clientes, innovando y siendo
              competitivos en soluciones de equipos y servicios para el mercado de
              la tecnologia, brindando los mejores resultados a sus necesidades tecnicas.
            </p>
          </article>

          <article className="rounded-[2rem] bg-[#07111B] p-7 text-white shadow-[0_22px_70px_rgba(15,23,42,0.18)] sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#FF7A00]">Vision</p>
            <p className="mt-5 text-base font-bold leading-8 text-white/78">
              Ser una empresa exitosa, rentable y atractiva, dedicada al negocio
              tecnologico con vocacion de servicio, y brindar soluciones integrales
              a empresas e instituciones gubernamentales y clientes particulares,
              posicionandonos en un buen nivel en el mercado.
            </p>
          </article>
        </div>

        <div className="mt-5 rounded-[2rem] bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-white sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#FF7A00]">Valores</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {VALUES.map((value, index) => (
              <div
                key={value}
                className="rounded-2xl bg-[#F4F8FC] p-4 text-center ring-1 ring-[#E0E8F0]"
              >
                <div className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-black text-white ${index % 2 === 0 ? "bg-[#00AEEF]" : "bg-[#FF7A00]"}`}>
                  {index + 1}
                </div>
                <p className="text-sm font-black text-[#111827]">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
