"use client";
import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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

function whatsapp(phone, text) {
  return "https://wa.me/" + phone + "?text=" + encodeURIComponent(text);
}

function SectionLabel({ children }) {
  return (
    <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#0057D9]">
      {children}
    </p>
  );
}

function BrandMini({ light = false }) {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_28%,#BDF5FF_0,#00AEEF_42%,#0057D9_100%)]">
        <span className="absolute left-1.5 right-1.5 top-3 h-1 rotate-[-10deg] rounded-full bg-[#071A33]" />
        <span className="absolute left-2 right-2 top-5 h-1 rotate-[-10deg] rounded-full bg-[#071A33]" />
        <span className="absolute left-0.5 top-2 h-9 w-10 rotate-[-18deg] rounded-[50%] border-[4px] border-[#FF7A00] border-t-transparent" />
      </span>
      <span className="leading-none">
        <span className={`block text-sm font-black tracking-[-0.04em] ${light ? "text-white" : "text-[#071A33]"}`}>CLICK.COM</span>
        <span className="block text-xs font-black text-[#FF6B00]">DEL CARIBE</span>
      </span>
    </div>
  );
}

export default function PublicWindowApp() {
  const [publicConfig, setPublicConfig] = useState({});
  const [promoConfig, setPromoConfig] = useState({});
  const [companyConfig, setCompanyConfig] = useState({});

  useEffect(() => {
    let ignore = false;
    async function loadPublicConfig() {
      try {
        const [pageRes, promosRes, companyRes] = await Promise.all([
          fetch(`${API_URL}/api/public/configuracion/pagina_clientes`),
          fetch(`${API_URL}/api/public/configuracion/promociones`),
          fetch(`${API_URL}/api/public/configuracion/empresa`),
        ]);
        const [page, promo, company] = await Promise.all([
          pageRes.ok ? pageRes.json() : {},
          promosRes.ok ? promosRes.json() : {},
          companyRes.ok ? companyRes.json() : {},
        ]);
        if (!ignore) {
          setPublicConfig(page.datos || {});
          setPromoConfig(promo.datos || {});
          setCompanyConfig(company.datos || {});
        }
      } catch (_) {}
    }
    loadPublicConfig();
    return () => { ignore = true; };
  }, []);

  const rawPhone = String(companyConfig.telefono || "529871119621").replace(/\D/g, "");
  const whatsappPhone = rawPhone.startsWith("52") ? rawPhone : `52${rawPhone}`;
  const address = companyConfig.direccion || "Av. Benito Juarez, Playa del Carmen, Quintana Roo";
  const activePromos = useMemo(() => {
    const configured = Array.isArray(promoConfig.promociones) ? promoConfig.promociones.filter((item) => item.activo !== false) : [];
    if (!configured.length) return promos;
    return configured.map((item) => ({
      title: item.nombre || item.title || "Promocion",
      detail: item.descripcion || item.detail || "",
      price: item.precio || item.price || "",
      image: item.imagen || item.image || "",
    }));
  }, [promoConfig]);
  const visibleValues = String(publicConfig.valores || valores.join(",")).split(",").map((item) => item.trim()).filter(Boolean);
  return (
    <main className="min-h-screen bg-[#F6F9FE] font-sans text-[#071A33]">
      <header className="sticky top-0 z-50 border-b border-[#E4EBF5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <button onClick={() => goTo("inicio")} className="flex items-center gap-3">
            <BrandMini />
          </button>

          <nav className="hidden items-center gap-8 text-[14px] font-bold text-[#24344D] md:flex">
            <button onClick={() => goTo("inicio")} className="border-b-2 border-[#0057D9] py-2 text-[#0057D9]">
              Inicio
            </button>
          </nav>

          <a
            href={whatsapp(whatsappPhone, "Hola, quiero informacion de CLICK.COM del Caribe.")}
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
        <div className="mx-auto max-w-7xl px-5 pt-8 lg:px-8 lg:pt-10">
          <div className="relative min-h-[430px] overflow-hidden rounded-[24px] border border-[#E3EAF4] bg-white shadow-[0_22px_60px_rgba(15,40,75,0.10)] sm:min-h-[500px] lg:min-h-[560px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,#F4F8FF_0,#FFFFFF_38%,transparent_70%)]" />
            <div className="absolute left-0 top-[34%] h-[42%] w-[58%] rounded-[50%] bg-[#F3F7FF]" />
            <div className="absolute -bottom-28 -left-20 h-72 w-[62%] rounded-[50%] bg-[#FF7A00]" />
            <div className="absolute -bottom-20 left-8 h-60 w-[48%] rounded-[50%] bg-[#FFB763]" />
            <div className="absolute -bottom-24 right-[-8%] h-72 w-[58%] rounded-[50%] bg-[#0057D9]" />
            <div className="absolute -bottom-14 right-6 h-48 w-[42%] rounded-[50%] bg-[#0E7BFF]" />
            <div className="absolute -right-16 -top-10 h-48 w-48 rounded-full bg-[#FF7A00]" />
            <div className="absolute left-[58%] -top-20 h-40 w-40 rounded-full bg-[#BBD7FF]" />
            <div className="absolute right-[5%] top-[12%] h-64 w-64 rounded-full border border-[#DCE8F7]" />
            <div className="absolute right-[7%] top-[16%] h-48 w-48 rounded-full border border-[#DCE8F7]" />
            <div className="absolute right-[9%] top-[20%] h-32 w-32 rounded-full border border-[#DCE8F7]" />

            <div className="absolute left-7 top-8 grid grid-cols-6 gap-3 sm:left-10 sm:top-12">
              {Array.from({ length: 30 }).map((_, index) => (
                <span key={index} className="h-1.5 w-1.5 rounded-full bg-[#9EC2F5]" />
              ))}
            </div>
            <div className="absolute bottom-24 right-8 grid grid-cols-4 gap-3">
              {Array.from({ length: 16 }).map((_, index) => (
                <span key={index} className="h-1.5 w-1.5 rounded-full bg-[#FF9A45]" />
              ))}
            </div>

            <div className="relative z-10 grid min-h-[430px] items-center gap-8 px-6 py-12 sm:min-h-[500px] sm:px-12 lg:min-h-[560px] lg:grid-cols-[1fr_360px] lg:px-20">
              <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center lg:justify-start">
                  <div className="relative h-28 w-28 shrink-0 rounded-full bg-[radial-gradient(circle_at_35%_28%,#BDF5FF_0,#00AEEF_42%,#0057D9_100%)] shadow-[0_18px_40px_rgba(0,87,217,0.20)]">
                    <span className="absolute left-3 right-3 top-8 h-2 rotate-[-10deg] rounded-full bg-[#071A33]" />
                    <span className="absolute left-5 right-4 top-14 h-2 rotate-[-10deg] rounded-full bg-[#071A33]" />
                    <span className="absolute left-2 top-8 h-24 w-28 rotate-[-18deg] rounded-[50%] border-[10px] border-[#FF7A00] border-t-transparent" />
                    <span className="absolute -bottom-1 left-4 h-5 w-20 rounded-[50%] bg-black/10 blur-sm" />
                  </div>

                  <div>
                    <h1 className="text-[46px] font-black leading-[0.9] tracking-[-0.03em] text-[#071A33] sm:text-[64px] lg:text-[74px]">
                      CLICK.COM
                      <span className="block text-[#FF6B00]">DEL CARIBE</span>
                    </h1>
                    <p className="mt-5 text-lg font-bold text-[#1F3354] sm:text-xl">
                      Soluciones tecnologicas que impulsan tu mundo
                    </p>
                    <span className="mx-auto mt-4 block h-1 w-24 rounded-full bg-[#0057D9] lg:mx-0" />
                  </div>
                </div>
              </div>

              <div className="relative mx-auto hidden h-[330px] w-[280px] lg:block">
                <div className="absolute left-1/2 top-8 h-40 w-40 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_28%,#E8FCFF_0,#43D7FF_42%,#008CE5_100%)] shadow-[0_18px_40px_rgba(0,87,217,0.22)]">
                  <span className="absolute left-8 top-16 h-3 w-8 rounded-full border-t-4 border-[#071A33]" />
                  <span className="absolute right-8 top-14 h-9 w-7 rounded-full bg-white ring-4 ring-[#071A33]">
                    <span className="absolute left-2 top-2 h-3 w-3 rounded-full bg-[#071A33]" />
                  </span>
                  <span className="absolute bottom-9 left-1/2 h-9 w-16 -translate-x-1/2 rounded-b-full bg-[#FF6B6B] ring-4 ring-[#071A33]" />
                  <span className="absolute left-4 top-8 h-2 w-32 rotate-[-10deg] rounded-full bg-[#071A33]" />
                  <span className="absolute left-2 top-20 h-2 w-36 rotate-[8deg] rounded-full bg-[#071A33]" />
                </div>
                <div className="absolute left-[70px] top-[178px] h-24 w-36 rounded-[36px] bg-[#FF7A00] shadow-[0_16px_35px_rgba(255,107,0,0.25)]" />
                <div className="absolute left-[88px] top-[190px] h-28 w-24 rounded-[30px] bg-white ring-4 ring-[#071A33]" />
                <div className="absolute left-[35px] top-[120px] h-16 w-16 rotate-[-24deg] rounded-full bg-white ring-4 ring-[#071A33]" />
                <div className="absolute right-[28px] top-[118px] h-16 w-16 rotate-[24deg] rounded-full bg-white ring-4 ring-[#071A33]" />
                <div className="absolute bottom-8 left-[86px] h-20 w-9 rotate-[16deg] rounded-full bg-[#071A33]" />
                <div className="absolute bottom-10 right-[82px] h-20 w-9 rotate-[-16deg] rounded-full bg-[#071A33]" />
                <div className="absolute bottom-2 left-[84px] h-9 w-16 rounded-full bg-[#FF7A00] ring-4 ring-[#071A33]" />
                <div className="absolute bottom-4 right-[60px] h-9 w-16 rounded-full bg-[#FF7A00] ring-4 ring-[#071A33]" />
                <div className="absolute -right-2 top-[190px] h-28 w-20 rotate-[28deg] rounded-[50%] bg-[#FF7A00]" />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
          <div className="relative overflow-hidden rounded-[24px] border border-[#E3EAF4] bg-white p-8 shadow-[0_22px_60px_rgba(15,40,75,0.10)] lg:p-12">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#FFE2C4]" />
            <div className="absolute -left-20 bottom-[-120px] h-72 w-72 rounded-full bg-[#DCEBFF]" />
            <div className="relative grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <SectionLabel>Nosotros</SectionLabel>
                <h2 className="mt-4 max-w-xl text-4xl font-black leading-tight tracking-[-0.04em] text-[#071A33] sm:text-5xl">
                  Tecnología, soporte y servicio para el Caribe.
                </h2>
                <p className="mt-5 max-w-2xl text-[16px] font-medium leading-8 text-[#34435B]">
                  Somos un equipo enfocado en resolver, acompañar y mantener la operación tecnológica de hogares, oficinas y empresas.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ["01", "Misión", "Resolver con calidad y atención cercana."],
                  ["02", "Visión", "Ser el aliado tecnológico de confianza."],
                  ["03", "Valores", "Respeto, honradez y compromiso."],
                ].map(([number, title, text]) => (
                  <article key={title} className="rounded-2xl border border-[#DFE8F4] bg-[#F8FBFF] p-5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0057D9] text-sm font-black text-white">
                      {number}
                    </span>
                    <h3 className="mt-4 text-lg font-black text-[#071A33]">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#56657A]">{text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>

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
              {publicConfig.quienesSomos || "Somos una empresa dedicada al negocio tecnologico con vocacion de servicio, brindando soluciones integrales a empresas, instituciones gubernamentales y clientes particulares."}
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
                  title="Mision"
                  text={publicConfig.mision || "Proveer productos y servicios de calidad que satisfagan las expectativas de nuestros clientes, innovando y siendo competitivos en soluciones tecnologicas."}
                />
                <InfoBlock
                  color="orange"
                  title="Vision"
                  text={publicConfig.vision || "Ser una empresa exitosa, rentable y atractiva, dedicada al negocio tecnologico con vocacion de servicio y soluciones integrales."}
                />
              </div>

              <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl bg-[#F4F8FD] p-4">
                <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-[#DCEBFF]" />
                <div className="absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-[#FFE0BF]" />
                <div className="relative rounded-3xl border border-[#D7E5F4] bg-white px-7 py-8 text-center shadow-sm">
                  <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_28%,#BDF5FF_0,#00AEEF_42%,#0057D9_100%)]">
                    <span className="h-12 w-16 rotate-[-18deg] rounded-[50%] border-[8px] border-[#FF7A00] border-t-transparent" />
                  </div>
                  <p className="text-2xl font-black tracking-[-0.03em] text-[#071A33]">CLICK.COM</p>
                  <p className="text-lg font-black text-[#FF6B00]">DEL CARIBE</p>
                  <span className="mx-auto mt-3 block h-1 w-16 rounded-full bg-[#0057D9]" />
                </div>
              </div>
            </div>

            <div id="valores" className="mt-7 border-t border-[#E4EBF5] pt-6">
              <SectionLabel>Valores</SectionLabel>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                {visibleValues.map((valor) => (
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
          <Feature title="Soluciones confiables" text="Tecnologia de calidad para optimizar tu negocio." />
          <Feature title="Innovacion constante" text="Buscamos herramientas utiles y modernas para cada necesidad." accent />
          <Feature title="Soporte especializado" text="Acompanamiento tecnico antes, durante y despues." />
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
            {activePromos.map((promo) => (
              <article key={promo.title} className="overflow-hidden rounded-xl bg-white shadow-sm">
                {promo.image ? (
                  <a href={promo.image} target="_blank" rel="noreferrer" className="block bg-[#EEF4FA]">
                    <img src={promo.image} alt={promo.title} className="h-72 w-full object-cover" />
                  </a>
                ) : null}
                <div className="p-4">
                  <h3 className="text-[15px] font-black leading-5 text-[#071A33]">{promo.title}</h3>
                  <p className="mt-2 min-h-[54px] text-[12px] leading-5 text-[#5F6F83]">{promo.detail}</p>
                  <p className="mt-3 text-xl font-black text-[#FF6B00]">{promo.price}</p>
                  <a
                    href={whatsapp(whatsappPhone, "Hola, quiero preguntar por: " + promo.title)}
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
              <p>{address}.</p>
              <p><strong>Telefono:</strong> {companyConfig.telefono || "(987) 111 9621"}</p>
              <p><strong>Correo:</strong> {companyConfig.correo || "contacto@clickcomdelcaribe.com"}</p>
              <p>
                <strong>Horario:</strong><br />
                {companyConfig.horario || "Lunes a viernes 9:00 AM - 6:00 PM. Sabado 9:00 AM - 3:00 PM. Domingo cerrado."}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#DFE8F4] bg-white">
            <iframe
              title="Ubicación CLICK.COM del Caribe"
              src={companyConfig.mapa || ("https://www.google.com/maps?q=" + encodeURIComponent(address) + "&output=embed")}
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
                href={whatsapp(whatsappPhone, "Hola, quiero informacion de CLICK.COM del Caribe.")}
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
            <BrandMini light />
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






