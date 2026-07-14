const servicios = [
  {
    title: "Redes",
    text: "Instalacion, revision y mantenimiento de redes para empresas, hogares y puntos de trabajo.",
  },
  {
    title: "Camaras de vigilancia",
    text: "Configuracion, soporte y revision de sistemas de videovigilancia.",
  },
  {
    title: "Internet empresa / hogar",
    text: "Soluciones de conectividad para Tulum, Playa del Carmen y zona cercana.",
  },
  {
    title: "Accesorios de computo",
    text: "Venta y orientacion para accesorios, componentes y consumibles tecnologicos.",
  },
  {
    title: "Soluciones administrativas",
    text: "Apoyo tecnologico para procesos administrativos, equipos y operacion diaria.",
  },
  {
    title: "PC y servidores",
    text: "Diagnostico, mantenimiento, armado y soporte para equipos de escritorio y servidores.",
  },
  {
    title: "Laptops y tabletas",
    text: "Revision, reparacion, mantenimiento y soporte para equipos portatiles.",
  },
  {
    title: "Mantenimiento y reparacion",
    text: "Servicio especializado en equipos de computo, impresoras y sistemas tecnologicos.",
  },
];

const valores = [
  "Respeto",
  "Honradez",
  "Confianza",
  "Lealtad",
  "Responsabilidad",
  "Honestidad",
  "Compromiso",
];

const promociones = [
  {
    title: "Laptop Dell 15 DC15250",
    description: 'Intel Core i5, 16GB RAM, 512GB SSD, pantalla 15.6".',
    price: "$11,200.00",
    image: "/promos/promo-laptop-dell.jpg.jpeg",
  },
  {
    title: "Monitor Gamer Gigabyte GS27F",
    description: '27", Full HD, FreeSync, 165Hz, HDMI / DisplayPort.',
    price: "$3,045.00",
    image: "/promos/promo-monitor-gigabyte.jpg.jpeg",
  },
  {
    title: "Qian QPMT1701 Touchscreen",
    description: 'Monitor LED touchscreen 17", color negro.',
    price: "$4,000.00",
    image: "/promos/promo-qian-touch.jpg.jpeg",
  },
  {
    title: "LiteBeam airMAX AC GEN2",
    description: "CPE hasta 450 Mbps, 5 GHz, antena integrada de 23 dBi.",
    price: "$1,450.00",
    image: "/promos/promo-litebeam.jpg.jpeg",
  },
  {
    title: "Proyector portatil Qian",
    description: "LCD 1280 x 720, Bluetooth, bajo pedido.",
    price: "$1,885.00",
    image: "/promos/promo-proyector-qian.jpg.jpeg",
  },
];

const whatsappHref =
  "https://wa.me/529871119621?text=Hola%2C%20quiero%20informacion%20de%20CLICK.COM%20del%20Caribe.";

export default function PublicWindowApp() {
  return (
    <main className="min-h-screen bg-[#F6F9FC] font-sans text-[#102033]">
      <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#inicio" className="flex items-center" aria-label="Ir al inicio">
            <img
              src="/logo-clickcom.png.jpeg"
              alt="CLICK.COM del Caribe"
              className="h-14 w-auto object-contain"
            />
          </a>

          <nav className="hidden items-center md:flex">
            <a
              href="#inicio"
              className="border-b-2 border-[#FF6B00] px-3 py-2 text-sm font-semibold text-[#102033]"
            >
              Inicio
            </a>
          </nav>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-[#FF6B00] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#E85F00]"
          >
            WhatsApp
          </a>
        </div>
      </header>

      <section id="inicio" className="border-b border-[#E5EAF0] bg-[#F3F7FC]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
              Servicio especializado en informatica
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.03em] text-[#0B1F3A] sm:text-5xl">
              Tecnologia que impulsa{" "}
              <span className="text-[#FF6B00]">tu negocio.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#344256]">
              En CLICK.COM del Caribe ofrecemos soluciones tecnologicas, equipos,
              reparacion y soporte especializado para empresas, instituciones y
              clientes particulares. Nuestro compromiso es ayudarte a trabajar con
              seguridad, eficiencia y confianza.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="rounded-md bg-[#0057D9] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#0048B5]"
              >
                Solicitar cotizacion
              </a>
              <a
                href="#contenido"
                className="rounded-md border border-[#B8C7D9] bg-white px-5 py-3 text-center text-sm font-semibold text-[#102033] transition hover:bg-[#EEF4FA]"
              >
                Explorar servicios
              </a>
            </div>

            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
              {["Atencion personalizada", "Soporte tecnico especializado", "Soluciones seguras"].map((item) => (
                <div key={item} className="rounded-lg border border-[#D9E4EF] bg-white p-4">
                  <p className="text-sm font-bold text-[#0B1F3A]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#D9E4EF] bg-white p-4">
            <img
              src="/login-bg-clickcom.png"
              alt="CLICK.COM del Caribe"
              className="h-[360px] w-full rounded-lg object-cover"
            />
          </div>
        </div>
      </section>

      <section id="contenido" className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="overflow-hidden rounded-xl border border-[#D9E4EF] bg-white">
            <div className="h-full min-h-[340px] bg-[#0B2A44] p-8 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFB066]">
                Quienes somos
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.02em]">
                Mas que una empresa tecnologica, somos un aliado estrategico.
              </h2>
              <p className="mt-5 text-sm leading-7 text-[#DDEAF5]">
                Somos una empresa dedicada al negocio tecnologico con vocacion
                de servicio, brindando soluciones integrales a empresas,
                instituciones gubernamentales y clientes particulares.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <article className="rounded-xl border border-[#D9E4EF] bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0057D9]">
                Mision
              </p>
              <p className="mt-3 text-sm leading-7 text-[#344256]">
                Proveer productos y servicios de calidad que satisfagan de
                manera consistente las expectativas de nuestros clientes,
                innovando y siendo competitivos en soluciones de equipos y
                servicios para el mercado de la tecnologia.
              </p>
            </article>

            <article className="rounded-xl border border-[#F5CFAE] bg-[#FFF8F2] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF6B00]">
                Vision
              </p>
              <p className="mt-3 text-sm leading-7 text-[#344256]">
                Ser una empresa exitosa, rentable y atractiva, dedicada al
                negocio tecnologico con vocacion de servicio, posicionada en un
                buen nivel en el mercado mediante talento, dedicacion y
                desempeno.
              </p>
            </article>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-[#D9E4EF] bg-white p-6">
          <h2 className="text-center text-2xl font-extrabold tracking-[-0.02em]">
            Nuestros valores
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {valores.map((valor) => (
              <div
                key={valor}
                className="rounded-lg border border-[#E1E8F0] bg-[#F8FBFD] p-4 text-center text-sm font-semibold text-[#102033]"
              >
                {valor}
              </div>
            ))}
          </div>
        </div>

        <section className="mt-8 rounded-xl border border-[#D9E4EF] bg-white p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0057D9]">
                Servicios
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.02em]">
                En que podemos ayudarte
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[#526173]">
              Soluciones claras para resolver fallas reales, mantener equipos y
              mejorar la operacion tecnologica.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {servicios.map((servicio) => (
              <article
                key={servicio.title}
                className="rounded-lg border border-[#E1E8F0] bg-white p-5"
              >
                <h3 className="text-base font-bold text-[#0B1F3A]">{servicio.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#526173]">{servicio.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-[#D9E4EF] bg-white p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF6B00]">
                Promociones
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.02em]">
                Productos y precios destacados
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[#526173]">
              Productos disponibles o bajo pedido. Pregunta existencia directa
              por WhatsApp.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {promociones.map((promo) => (
              <article
                key={promo.title}
                className="overflow-hidden rounded-lg border border-[#E1E8F0] bg-white"
              >
                <a href={promo.image} target="_blank" rel="noreferrer">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="h-64 w-full object-cover transition hover:opacity-90"
                  />
                </a>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-[#0B1F3A]">{promo.title}</h3>
                  <p className="mt-2 min-h-[48px] text-xs leading-5 text-[#526173]">
                    {promo.description}
                  </p>
                  <p className="mt-3 text-lg font-extrabold text-[#FF6B00]">
                    {promo.price} neto
                  </p>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 block rounded-md bg-[#0057D9] px-4 py-2.5 text-center text-xs font-semibold text-white hover:bg-[#0048B5]"
                  >
                    Preguntar por WhatsApp
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-xl border border-[#D9E4EF] bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0057D9]">
              Contacto
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.02em]">
              Estamos para ayudarte
            </h2>
            <div className="mt-5 space-y-3 text-sm leading-6 text-[#344256]">
              <p>
                Av. Benito Juarez, Entre 80 Av. Sur y Diagonal 85 Av. Sur,
                Local 3, MZ 214, Lote 006, Colonia Ejidal, Playa del Carmen,
                Quintana Roo.
              </p>
              <p>
                <strong>Telefono:</strong> 987 111 9621
              </p>
              <p>
                <strong>Correo:</strong> erickalh56@gmail.com
              </p>
              <p>
                <strong>Horario:</strong> Lunes a viernes 9:00 AM - 6:00 PM,
                sabado 9:00 AM - 3:00 PM.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#D9E4EF] bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF6B00]">
              Escribenos
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.02em]">
              Atencion directa
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#526173]">
              Para cotizaciones, disponibilidad de promociones, reparaciones o
              soporte tecnico, el canal principal sera WhatsApp.
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-md bg-[#FF6B00] px-5 py-3 text-sm font-semibold text-white hover:bg-[#E85F00]"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </section>
      </section>

      <footer className="border-t border-[#16344F] bg-[#071A2D] px-5 py-8 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <img
              src="/logo-clickcom.png.jpeg"
              alt="CLICK.COM del Caribe"
              className="h-12 w-auto rounded bg-white object-contain p-1"
            />
            <p className="mt-3 text-sm text-[#B9C8D8]">
              Tecnologia que impulsa tu negocio.
            </p>
          </div>
          <p className="text-sm text-[#B9C8D8]">
            © 2026 CLICK.COM del Caribe. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}
