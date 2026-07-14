"use client";

const PHONE = "529871119621";
const ADDRESS =
  "Av. Benito Juárez, Entre 80 Av. Sur y Diagonal 85 Av. Sur, Local 3, MZ 214, Lote 006, Colonia Ejidal, Playa del Carmen, Quintana Roo";

const valores = [
  "Respeto",
  "Honradez",
  "Confianza",
  "Lealtad",
  "Responsabilidad",
  "Honestidad",
  "Compromiso",
];

const servicios = [
  {
    title: "Redes",
    text: "Instalación, revisión y mantenimiento de redes para hogares, oficinas y empresas.",
  },
  {
    title: "Cámaras de vigilancia",
    text: "Soluciones de videovigilancia, configuración, revisión y soporte técnico.",
  },
  {
    title: "Internet empresa / hogar",
    text: "Instalación y soporte para conectividad en Playa del Carmen y Tulum.",
  },
  {
    title: "Accesorios de cómputo",
    text: "Venta y recomendación de accesorios útiles para equipos de trabajo.",
  },
  {
    title: "Soluciones administrativas",
    text: "Apoyo tecnológico para mejorar procesos internos y operación diaria.",
  },
  {
    title: "PC de escritorio y servidores",
    text: "Armado, mantenimiento, diagnóstico y soporte para equipos de oficina.",
  },
  {
    title: "Laptops y tabletas",
    text: "Diagnóstico, reparación, mantenimiento y optimización de equipos portátiles.",
  },
  {
    title: "Mantenimiento y reparación",
    text: "Servicio especializado en informática para equipos de cómputo e impresión.",
  },
];

const promos = [
  {
    title: "Laptop Dell 15 DC15250",
    detail: "Intel Core i5, 16GB RAM, 512GB SSD, Windows 11 Home.",
    price: "$11,200.00 neto",
    image: "/promos/promo-laptop-dell.jpg.jpeg",
  },
  {
    title: "Monitor Gamer Gigabyte GS27F",
    detail: "27 pulgadas, Full HD, FreeSync, 165Hz, HDMI/DisplayPort.",
    price: "$3,045.00 neto",
    image: "/promos/promo-monitor-gigabyte.jpg.jpeg",
  },
  {
    title: "Qian QPMT1701 Touchscreen",
    detail: "Monitor LED touchscreen 17 pulgadas, color negro.",
    price: "$4,000.00 neto",
    image: "/promos/promo-qian-touch.jpg.jpeg",
  },
  {
    title: "LiteBeam airMAX AC GEN2",
    detail: "CPE hasta 450 Mbps, 5 GHz, antena integrada de 23 dBi.",
    price: "$1,450.00 neto",
    image: "/promos/promo-litebeam.jpg.jpeg",
  },
  {
    title: "Proyector portátil Qian",
    detail: "LCD 1280 x 720, 120 lúmenes, Bluetooth, bajo pedido.",
    price: "$1,885.00 neto",
    image: "/promos/promo-proyector-qian.jpg.jpeg",
  },
];

function goTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function whatsapp(text) {
  return "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(text);
}

function SectionLabel({ children }) {
  return (
    <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#0057D9]">
      {children}
    </p>
  );
}

export default function PublicWindowApp() {
  return (
    <main className="min-h-screen bg-[#F6F9FE] font-sans text-[#071A33]">
      <header className="sticky top-0 z-50 border-b border-[#E4EBF5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <button onClick={() => goTo("inicio")} className="flex items-center gap-3">
            <img
              src="/logo-clickcom.png.jpeg"
              alt="CLICK.COM del Caribe"
              className="h-12 w-auto object-contain"
            />
          </button>

          <nav className="hidden items-center gap-8 text-[14px] font-bold text-[#24344D] md:flex">
            <button onClick={() => goTo("inicio")} className="border-b-2 border-[#0057D9] py-2 text-[#0057D9]">
              Inicio
            </button>
            <button onClick={() => goTo("servicios")} className="py-2 hover:text-[#0057D9]">
              Servicios
            </button>
            <button onClick={() => goTo("promociones")} className="py-2 hover:text-[#0057D9]">
              Promociones
            </button>
            <button onClick={() => goTo("contacto")} className="py-2 hover:text-[#0057D9]">
              Contacto
            </button>
          </nav>

          <a
            href={whatsapp("Hola, quiero información de CLICK.COM del Caribe.")}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-[#FF6B00] px-5 py-3 text-[14px] font-extrabold text-white shadow-sm transition hover:bg-[#E85F00]"
          >
            WhatsApp
          </a>
        </div>
      </header>

      <section
        id="inicio"
        className="relative overflow-hidden bg-[radial-gradient(circle_at_left_bottom,#DDEFFF_0,#F7FAFF_35%,transparent_62%),radial-gradient(circle_at_right_top,#FFE3C9_0,#F8FAFF_34%,transparent_64%)]"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1fr_1.12fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <div className="mb-6 flex items-center gap-3">
              <SectionLabel>Nosotros</SectionLabel>
              <span className="h-[2px] w-12 bg-[#0057D9]" />
            </div>

            <h1 className="max-w-xl text-[44px] font-black leading-[0.98] tracking-[-0.04em] text-[#071A33] sm:text-[64px]">
              CLICK.COM
              <span className="block">
                del <span className="text-[#FF6B00]">Caribe.</span>
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-[17px] font-medium leading-8 text-[#34435B]">
              Somos una empresa dedicada al negocio tecnológico con vocación de servicio,
              brindando soluciones integrales a empresas, instituciones gubernamentales
              y clientes particulares.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => goTo("servicios")}
                className="rounded-lg bg-[#FF6B00] px-7 py-4 text-[15px] font-extrabold text-white shadow-sm transition hover:bg-[#E85F00]"
              >
                Ver servicios
              </button>
              <button
                onClick={() => goTo("contacto")}
                className="rounded-lg border border-[#C9D6E8] bg-white px-7 py-4 text-[15px] font-extrabold text-[#14243B] transition hover:border-[#0057D9] hover:text-[#0057D9]"
              >
                Conócenos más
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E3EAF4] bg-white/86 p-6 shadow-[0_18px_45px_rgba(15,40,75,0.08)]">
            <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
              <div className="space-y-5">
                <InfoBlock
                  color="blue"
                  title="Misión"
                  text="Proveer productos y servicios de calidad que satisfagan las expectativas de nuestros clientes, innovando y siendo competitivos en soluciones tecnológicas."
                />
                <InfoBlock
                  color="orange"
                  title="Visión"
                  text="Ser una empresa exitosa, rentable y atractiva, dedicada al negocio tecnológico con vocación de servicio y soluciones integrales."
                />
              </div>

              <div className="flex items-center justify-center rounded-2xl bg-[#F4F8FD] p-4">
                <img
                  src="/login-bg-clickcom.png"
                  alt="CLICK.COM del Caribe"
                  className="max-h-[300px] w-full rounded-xl object-cover"
                />
              </div>
            </div>

            <div id="valores" className="mt-7 border-t border-[#E4EBF5] pt-6">
              <SectionLabel>Valores</SectionLabel>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                {valores.map((valor) => (
                  <div
                    key={valor}
                    className="rounded-xl border border-[#E1EAF5] bg-white px-3 py-4 text-center text-[12px] font-bold text-[#30425C]"
                  >
                    <span className="mx-auto mb-2 block h-8 w-8 rounded-full border border-[#BFD2EA] bg-[#F5FAFF]" />
                    {valor}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-5 px-5 pb-14 md:grid-cols-3 lg:px-8">
          <Feature title="Soluciones confiables" text="Tecnología de calidad para optimizar tu negocio." />
          <Feature title="Innovación constante" text="Buscamos herramientas útiles y modernas para cada necesidad." accent />
          <Feature title="Soporte especializado" text="Acompañamiento técnico antes, durante y después." />
        </div>
      </section>

      <section id="servicios" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <SectionLabel>Servicios</SectionLabel>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-[#071A33]">
              ¿En qué podemos ayudarte?
            </h2>
          </div>
          <p className="max-w-xl text-[15px] leading-7 text-[#56657A]">
            Servicio especializado en informática para operación diaria, soporte técnico y soluciones empresariales.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {servicios.map((service, index) => (
            <article
              key={service.title}
              className="rounded-xl border border-[#DFE8F4] bg-white p-5 shadow-sm transition hover:border-[#BCD3EF]"
            >
              <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-lg font-black text-white ${index % 3 === 1 ? "bg-[#FF6B00]" : "bg-[#0057D9]"}`}>
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="text-lg font-black text-[#071A33]">{service.title}</h3>
              <p className="mt-3 text-[14px] leading-7 text-[#4F5F76]">{service.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="promociones"
        className="bg-[linear-gradient(135deg,#071A33_0%,#0B314A_58%,#2B1B10_100%)] px-5 py-16 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#FF8A2A]">
                Promociones actuales
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.03em] text-white">
                Equipos y precios destacados para aprovechar ahora.
              </h2>
            </div>
            <p className="max-w-md text-[14px] leading-7 text-[#C8D6E6]">
              Productos disponibles o bajo pedido. El cliente puede preguntar existencia directa por WhatsApp.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {promos.map((promo) => (
              <article key={promo.title} className="overflow-hidden rounded-xl bg-white shadow-sm">
                <a href={promo.image} target="_blank" rel="noreferrer" className="block bg-[#EEF4FA]">
                  <img src={promo.image} alt={promo.title} className="h-72 w-full object-cover" />
                </a>
                <div className="p-4">
                  <h3 className="text-[15px] font-black leading-5 text-[#071A33]">{promo.title}</h3>
                  <p className="mt-2 min-h-[54px] text-[12px] leading-5 text-[#5F6F83]">{promo.detail}</p>
                  <p className="mt-3 text-xl font-black text-[#FF6B00]">{promo.price}</p>
                  <a
                    href={whatsapp("Hola, quiero preguntar por: " + promo.title)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 block rounded-lg bg-[#0057D9] px-4 py-3 text-center text-[13px] font-extrabold text-white hover:bg-[#0048B8]"
                  >
                    Preguntar por WhatsApp
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mb-8">
          <SectionLabel>Contacto</SectionLabel>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-[#071A33]">
            Estamos para ayudarte.
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr_0.9fr]">
          <div className="rounded-xl border border-[#DFE8F4] bg-white p-6">
            <h3 className="text-lg font-black text-[#071A33]">Sucursal Playa del Carmen</h3>
            <div className="mt-5 space-y-4 text-[14px] leading-7 text-[#3B4C63]">
              <p>{ADDRESS}.</p>
              <p><strong>Teléfono:</strong> (987) 111 9621</p>
              <p><strong>Correo:</strong> erickalh56@gmail.com</p>
              <p>
                <strong>Horario:</strong><br />
                Lunes a Viernes: 9:00 AM - 6:00 PM<br />
                Sábado: 9:00 AM - 3:00 PM<br />
                Domingo: Cerrado
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#DFE8F4] bg-white">
            <iframe
              title="Ubicación CLICK.COM del Caribe"
              src={"https://www.google.com/maps?q=" + encodeURIComponent(ADDRESS) + "&output=embed"}
              className="h-full min-h-[320px] w-full"
              loading="lazy"
            />
          </div>

          <form className="rounded-xl border border-[#DFE8F4] bg-white p-6">
            <h3 className="text-lg font-black text-[#071A33]">Envíanos un mensaje</h3>
            <div className="mt-5 space-y-3">
              <input className="w-full rounded-lg border border-[#D7E2F0] px-4 py-3 text-[14px] outline-none focus:border-[#0057D9]" placeholder="Nombre completo" />
              <input className="w-full rounded-lg border border-[#D7E2F0] px-4 py-3 text-[14px] outline-none focus:border-[#0057D9]" placeholder="Teléfono / WhatsApp" />
              <textarea className="min-h-28 w-full rounded-lg border border-[#D7E2F0] px-4 py-3 text-[14px] outline-none focus:border-[#0057D9]" placeholder="Mensaje" />
              <a
                href={whatsapp("Hola, quiero información de CLICK.COM del Caribe.")}
                target="_blank"
                rel="noreferrer"
                className="block rounded-lg bg-[#0057D9] px-4 py-3 text-center text-[14px] font-extrabold text-white hover:bg-[#0048B8]"
              >
                Enviar por WhatsApp
              </a>
            </div>
          </form>
        </div>
      </section>

      <footer className="border-t border-[#102845] bg-[#071A33] px-5 py-8 text-white lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-clickcom.png.jpeg" alt="CLICK.COM del Caribe" className="h-12 w-auto rounded bg-white object-contain" />
            <div>
              <p className="font-black">CLICK.COM del Caribe</p>
              <p className="text-[13px] text-[#B9C8D9]">Servicio especializado en informática</p>
            </div>
          </div>
          <p className="text-[13px] text-[#B9C8D9]">
            © {new Date().getFullYear()} CLICK.COM del Caribe. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}

function InfoBlock({ title, text, color }) {
  const isOrange = color === "orange";
  return (
    <div className="grid grid-cols-[64px_1fr] gap-4 rounded-xl border border-[#E4EBF5] bg-white p-5">
      <div className={`flex h-14 w-14 items-center justify-center rounded-full ${isOrange ? "bg-[#FFF0E4] text-[#FF6B00]" : "bg-[#EAF3FF] text-[#0057D9]"}`}>
        <span className="h-6 w-6 rounded-full border-2 border-current" />
      </div>
      <div>
        <h3 className={`text-[13px] font-black uppercase tracking-[0.16em] ${isOrange ? "text-[#FF6B00]" : "text-[#0057D9]"}`}>
          {title}
        </h3>
        <p className="mt-2 text-[14px] font-semibold leading-6 text-[#273950]">{text}</p>
      </div>
    </div>
  );
}

function Feature({ title, text, accent }) {
  return (
    <article className="group rounded-xl border border-[#E0E8F3] bg-white p-6 shadow-sm">
      <div className={`mb-4 h-12 w-12 rounded-xl ${accent ? "bg-[#FF6B00]" : "bg-[#0057D9]"}`} />
      <h3 className="text-lg font-black text-[#071A33]">{title}</h3>
      <p className="mt-2 text-[14px] leading-6 text-[#5A6A7F]">{text}</p>
    </article>
  );
}
