"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const DEFAULT_WHATSAPP_NUMBER = "529848047192";

const DEFAULT_MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d796.1388676850976!2d-87.09012077157857!3d20.63081065390293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f4e4310ef435a97%3A0x5c268f5b314779dd!2sCLICK.COM%20DEL%20CARIBE!5e1!3m2!1ses!2smx!4v1784277526852!5m2!1ses!2smx";

const DEFAULT_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=CLICK.COM+DEL+CARIBE+Playa+del+Carmen";

const WHATSAPP_TULUM = "529842182699";

const MAPS_EMBED_TULUM =
   "https://www.google.com/maps?q=Click+del+Caribe+Tulum&output=embed";

const MAPS_URL_TULUM = "https://www.google.com/maps/search/?api=1&query=Click+del+Caribe+Tulum";

const ADDRESS_TULUM =
  "Av. Tulum Oriente entre Libra y Escorpión Norte, Local 1, Tulum, Quintana Roo.";

const valores = [
  { label: "Respeto", icon: "user" },
  { label: "Honradez", icon: "heart" },
  { label: "Confianza", icon: "user" },
  { label: "Lealtad", icon: "shield" },
  { label: "Responsabilidad", icon: "clipboard" },
  { label: "Honestidad", icon: "heart" },
  { label: "Compromiso", icon: "user" },
];

const beneficios = [
  {
    title: "Servicio especializado en informática",
    text: "Soluciones adaptadas a tus necesidades.",
    icon: "shield",
    color: "blue",
  },
  {
    title: "Click.com, soluciones en segundos",
    text: "Rapidez y eficiencia en cada servicio.",
    icon: "bolt",
    color: "orange",
  },
  {
    title: "Click.com, soluciones seguras",
    text: "Protegemos tu información y tu equipo.",
    icon: "lock",
    color: "blue",
  },
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

function goTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function whatsapp(phone, text) {
  return "https://wa.me/" + phone + "?text=" + encodeURIComponent(text);
}

function SectionLabel({ children, color = "#2563EB" }) {
  return (
    <div>
      <p className="text-[12px] font-bold uppercase tracking-[0.18em]" style={{ color }}>
        {children}
      </p>
      <span className="mt-2 block h-[2px] w-8" style={{ background: color }} />
    </div>
  );
}

function BrandMark({ light = false }) {
  return (
    <img
      src="/logos/logo-principal.png.png"
      alt="CLICK.COM del Caribe"
      className={light ? "h-10 w-auto object-contain brightness-0 invert" : "h-16 w-auto object-contain"}
    />
  );
}

function Icon({ name, className = "" }) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    viewBox: "0 0 24 24",
  };

  switch (name) {
    case "target":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="0.6" fill="currentColor" />
        </svg>
      );
    case "eye":
      return (
        <svg {...common}>
          <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.4" />
          <path d="M5 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5" />
        </svg>
      );
    case "heart":
      return (
        <svg {...common}>
          <path d="M12 20.2s-7.6-4.6-9.7-9.2C.7 7.1 3 4 6.4 4c2 0 3.5 1.1 5.6 3.3C14.1 5.1 15.6 4 17.6 4 21 4 23.3 7.1 21.7 11c-2.1 4.6-9.7 9.2-9.7 9.2Z" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3l7 3v6c0 4.4-3 8-7 9-4-1-7-4.6-7-9V6l7-3Z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "clipboard":
      return (
        <svg {...common}>
          <rect x="5" y="4" width="14" height="17" rx="2" />
          <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="4" y="10" width="16" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case "arrowRight":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 2 6a2 2 0 0 1 2-2Z" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3.5 2" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common}>
          <path d="M12 21s7-6.6 7-11.5A7 7 0 0 0 5 9.5C5 14.4 12 21 12 21Z" />
          <circle cx="12" cy="9.5" r="2.4" />
        </svg>
      );
    case "external":
      return (
        <svg {...common}>
          <path d="M14 4h6v6" />
          <path d="M10 14 20 4" />
          <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
        </svg>
      );
    default:
      return null;
  }
}

export default function PublicWindowApp() {
  const [publicConfig, setPublicConfig] = useState({});
  const [companyConfig, setCompanyConfig] = useState({});

  useEffect(() => {
    let ignore = false;

    async function loadPublicConfig() {
      try {
        const [pageRes, companyRes] = await Promise.all([
          fetch(`${API_URL}/api/public/configuracion/pagina_clientes`),
          fetch(`${API_URL}/api/public/configuracion/empresa`),
        ]);

        const [page, company] = await Promise.all([
          pageRes.ok ? pageRes.json() : {},
          companyRes.ok ? companyRes.json() : {},
        ]);

        if (!ignore) {
          setPublicConfig(page.datos || {});
          setCompanyConfig(company.datos || {});
        }
      } catch (_) {}
    }

    loadPublicConfig();

    return () => {
      ignore = true;
    };
  }, []);

  const rawPhone = String(companyConfig.telefono || DEFAULT_WHATSAPP_NUMBER).replace(/\D/g, "");
  const whatsappPhone = rawPhone.startsWith("52") ? rawPhone : `52${rawPhone}`;
  const rawPhoneTulum = String(companyConfig.telefonoTulum || WHATSAPP_TULUM).replace(/\D/g, "");
  const whatsappPhoneTulum = rawPhoneTulum.startsWith("52") ? rawPhoneTulum : `52${rawPhoneTulum}`;

  const address =
    companyConfig.direccion ||
    "Av. Juárez MZ 214, Lote 1, Local 3, entre Av. 80 y 85, Colonia Ejido, Playa del Carmen, Quintana Roo.";

  const mapsEmbedUrl = companyConfig.mapa || DEFAULT_MAPS_EMBED_URL;
  const mapsUrl = companyConfig.mapsUrl || companyConfig.mapaUrl || DEFAULT_MAPS_URL;

  const visibleValues = String(publicConfig.valores || valores.map((v) => v.label).join(","))
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((label) => valores.find((v) => v.label === label) || { label, icon: "user" });

  return (
    <main className="min-h-screen bg-white font-sans text-[#0F1F4A]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .fade-up { animation: fadeUp 0.5s ease-out both; }
        .float-mascot { animation: floatY 4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .fade-up, .float-mascot { animation: none; }
        }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-[#E8EDF5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <button type="button" onClick={() => goTo("inicio")} className="flex items-center">
            <BrandMark />
          </button>

          <nav className="hidden items-center gap-10 text-[14.5px] font-semibold text-[#3A4457] md:flex">
            <button type="button" onClick={() => goTo("inicio")} className="transition hover:text-[#2563EB]">
              Inicio
            </button>
            <button type="button" onClick={() => goTo("nosotros")} className="transition hover:text-[#2563EB]">
              Nosotros
            </button>
            <button type="button" onClick={() => goTo("servicios")} className="transition hover:text-[#2563EB]">
              Servicios
            </button>
            <button type="button" onClick={() => goTo("contacto")} className="transition hover:text-[#2563EB]">
              Contacto
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/seguimiento"
              className="hidden items-center gap-2 rounded-xl border border-[#D6DEE8] bg-white px-5 text-[14px] font-bold text-[#2563EB] transition hover:border-[#2563EB] hover:bg-[#F2F7FF] sm:flex"
              style={{ height: 46 }}
            >
              <span aria-hidden>⌕</span> Dar seguimiento
            </a>
            <a
              href={whatsapp(whatsappPhone, "Hola, quiero información de CLICK.COM del Caribe.")}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 text-[14px] font-bold text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)] transition hover:bg-[#1D4ED8]"
              style={{ height: 46 }}
            >
              <span aria-hidden>☎</span> Contáctanos
            </a>
          </div>
        </div>
      </header>

      <section id="inicio" className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#FFF1E3]" />
          <div className="absolute -bottom-40 -right-24 h-[26rem] w-[30rem] rounded-[50%] bg-[#EAF2FF]" />
          <div className="absolute -bottom-24 -left-28 h-72 w-80 rounded-[50%] bg-[#FFE9D6] opacity-70" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[45%_55%] lg:gap-8 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-[540px] text-center lg:mx-0 lg:text-left">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-[#FF6B00]">
              Bienvenido a Click.com del Caribe
            </p>

            <h1 className="mt-5 text-[46px] font-extrabold leading-[1.02] tracking-[-0.03em] text-[#0F1F4A] sm:text-[58px] lg:text-[68px]">
              Tecnología
              <br />
              que impulsa
              <br />
              <span className="text-[#FF6B00]">tu mundo</span>
            </h1>

            <p className="mx-auto mt-6 max-w-[460px] text-[17px] font-normal leading-8 text-[#5B6472] lg:mx-0">
              {publicConfig.quienesSomos ||
                "Soluciones tecnológicas confiables y personalizadas para tu hogar, negocio o empresa."}
            </p>
          </div>

          <div className="relative mx-auto flex h-[360px] w-full max-w-[440px] items-center justify-center lg:h-[460px] lg:max-w-none">
            <div className="absolute h-[70%] w-[70%] rounded-full bg-[#EFF6FF]" />
            <img
              src="/mascot%20click.png"
              alt="Mascota CLICK.COM del Caribe"
              className="relative z-10 h-auto w-[320px] drop-shadow-[0_30px_40px_rgba(15,31,74,0.14)] sm:w-[390px] lg:w-[470px]"
            />
            <div className="absolute bottom-2 h-6 w-40 rounded-[50%] bg-black/10 blur-md sm:w-56 lg:w-64" />
          </div>
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 pb-14">
          <button type="button" onClick={() => goTo("nosotros")} className="text-[14px] font-semibold text-[#2563EB]">
            Conócenos más
          </button>
          <button
            type="button"
            onClick={() => goTo("nosotros")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D7E2F5] text-[#2563EB] transition hover:border-[#2563EB]"
            aria-label="Bajar a la sección Nosotros"
          >
            ↓
          </button>
        </div>
      </section>

      <section id="nosotros" className="relative overflow-hidden border-t border-[#F1F4F9] bg-[#F8FAFC] px-6 py-20 lg:px-10">
        <div className="relative mx-auto max-w-7xl fade-up">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <SectionLabel>Nosotros</SectionLabel>
              <h2 className="mt-5 max-w-lg text-[38px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#0F172A] sm:text-[44px]">
                Soluciones que generan <span className="text-[#F97316]">confianza.</span>
              </h2>

              <div className="mt-7 max-w-lg space-y-6 text-[15.5px] leading-8 text-[#475569]">
                <p>
                  {publicConfig.quienesSomos ||
                    "Somos una empresa dedicada al negocio tecnológico con vocación de servicio, brindando soluciones integrales a empresas, instituciones gubernamentales y clientes particulares."}
                </p>
                <p>
                  Proveemos productos y servicios de alta calidad para satisfacer las expectativas de nuestros clientes,
                  innovando y siendo competitivos en soluciones de equipos y servicios para el mercado tecnológico.
                </p>
              </div>

              <div className="mt-10">
                <SectionLabel color="#2563EB">Valores</SectionLabel>
                <div className="mt-5 flex flex-wrap gap-3">
                  {visibleValues.map((valor) => (
                    <div
                      key={valor.label}
                      className="flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-4 py-2.5 text-[13.5px] font-semibold text-[#334155] shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(15,23,42,0.08)]"
                    >
                      <Icon name={valor.icon} className="h-4 w-4 text-[#2563EB]" />
                      {valor.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <InfoCard icon="target" title="Misión" accent="#2563EB">
                {publicConfig.mision ||
                  "Proveer productos y servicios de calidad que satisfagan las expectativas de nuestros clientes, innovando y siendo competitivos en soluciones tecnológicas."}
              </InfoCard>

              <InfoCard icon="eye" title="Visión" accent="#F97316">
                {publicConfig.vision ||
                  "Ser una empresa exitosa, rentable y atractiva, dedicada al negocio tecnológico con vocación de servicio y soluciones integrales."}
              </InfoCard>

              <div className="mt-2 grid gap-4 sm:col-span-2">
                {beneficios.map((b) => (
                  <button
                    key={b.title}
                    type="button"
                    onClick={() => goTo("servicios")}
                    className="group flex items-center gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 text-left shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(15,23,42,0.09)]"
                  >
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white"
                      style={{ background: b.color === "orange" ? "#F97316" : "#2563EB" }}
                    >
                      <Icon name={b.icon} className="h-5 w-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[14.5px] font-bold text-[#0F172A]">{b.title}</span>
                      <span className="block text-[13px] leading-5 text-[#475569]">{b.text}</span>
                    </span>
                    <Icon
                      name="arrowRight"
                      className="h-5 w-5 shrink-0 text-[#94A3B8] transition group-hover:translate-x-1 group-hover:text-[#2563EB]"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -bottom-6 right-0 hidden lg:block">
            <img
              src="/mascot%20click%20n.png"
              alt=""
              aria-hidden="true"
              className="float-mascot h-40 w-auto drop-shadow-[0_18px_28px_rgba(15,31,74,0.16)]"
            />
          </div>

          <div className="relative mt-16 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => goTo("servicios")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#2563EB] text-[#2563EB] transition hover:bg-[#2563EB] hover:text-white"
              aria-label="Ir a la sección Servicios"
            >
              <Icon name="arrowRight" className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo("servicios")}
              className="flex items-center gap-2 text-[15px] font-semibold text-[#2563EB]"
            >
              Conoce nuestros servicios
              <Icon name="arrowRight" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <section id="servicios" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="mb-10 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <SectionLabel>Servicios</SectionLabel>
            <h2 className="mt-3 text-[32px] font-extrabold tracking-[-0.03em] text-[#0F1F4A]">
              ¿En qué podemos ayudarte?
            </h2>
          </div>
          <p className="max-w-xl text-[15px] leading-7 text-[#5B6472]">
            Servicio especializado en informática para operación diaria, soporte técnico y soluciones empresariales.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {servicios.map((service, index) => (
            <article
              key={service.title}
              className="rounded-xl border border-[#E8EDF5] bg-white p-6 transition hover:border-[#C7D6EE] hover:shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
            >
              <div
                className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg text-[13px] font-extrabold text-white"
                style={{ background: index % 3 === 1 ? "#FF6B00" : "#2563EB" }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="text-[16px] font-bold text-[#0F1F4A]">{service.title}</h3>
              <p className="mt-3 text-[14px] leading-6 text-[#5B6472]">{service.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contacto" className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
        <div className="mb-8">
          <SectionLabel>Contacto</SectionLabel>
          <h2 className="mt-3 text-[28px] font-extrabold tracking-[-0.03em] text-[#0F1F4A]">
            Estamos para ayudarte.
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="grid gap-5">
            <div className="rounded-xl border border-[#E8EDF5] bg-white p-6">
              <h3 className="text-[15px] font-bold text-[#0F1F4A]">Sucursal Playa del Carmen</h3>

              <div className="mt-4 space-y-3.5 text-[13.5px] leading-6 text-[#3A4457]">
                <div className="flex gap-2.5">
                  <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
                  <p>{address}</p>
                </div>

                <div className="flex items-center gap-2.5">
                  <Icon name="phone" className="h-4 w-4 shrink-0 text-[#2563EB]" />
                  <p>{companyConfig.telefono || "984 804 7192"}</p>
                </div>

                <div className="flex items-center gap-2.5">
                  <Icon name="mail" className="h-4 w-4 shrink-0 text-[#2563EB]" />
                  <p>{companyConfig.correo || "erickalh56@gmail.com"}</p>
                </div>

                <div className="flex gap-2.5">
                  <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
                  <p>
                    {companyConfig.horario ||
                      "Lunes a viernes: 9:00 AM - 6:00 PM. Sábado: 9:00 AM - 3:00 PM. Domingo: cerrado."}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <a
                  href={whatsapp(whatsappPhone, "Hola, quiero información de CLICK.COM del Caribe.")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#2563EB] px-4 py-2 text-[12.5px] font-bold text-white transition hover:bg-[#1D4ED8]"
                >
                  <span aria-hidden>☎</span> Escríbenos
                </a>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#2563EB]/30 px-4 py-2 text-[12.5px] font-bold text-[#2563EB] transition hover:bg-[#2563EB] hover:text-white"
                >
                  <Icon name="external" className="h-3.5 w-3.5" />
                  Ver en Maps
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#E8EDF5] bg-white">
              <iframe
                title="Ubicación CLICK.COM del Caribe - Playa del Carmen"
                src={mapsEmbedUrl}
                className="h-[280px] w-full"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-xl border border-[#E8EDF5] bg-white p-6">
              <h3 className="text-[15px] font-bold text-[#0F1F4A]">Sucursal Tulum</h3>

              <div className="mt-4 space-y-3.5 text-[13.5px] leading-6 text-[#3A4457]">
                <div className="flex gap-2.5">
                  <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
                  <p>{companyConfig.direccionTulum || ADDRESS_TULUM}</p>
                </div>

                <div className="flex items-center gap-2.5">
                  <Icon name="phone" className="h-4 w-4 shrink-0 text-[#2563EB]" />
                  <p>{companyConfig.telefonoTulum || "984 218 2699"}</p>
                </div>

                <div className="flex items-center gap-2.5">
                  <Icon name="mail" className="h-4 w-4 shrink-0 text-[#2563EB]" />
                  <p>{companyConfig.correo || "erickalh56@gmail.com"}</p>
                </div>

                <div className="flex gap-2.5">
                  <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
                  <p>
                    {companyConfig.horarioTulum ||
                      "Lunes a viernes: 9:00 AM - 6:00 PM. Sábado: 9:00 AM - 3:00 PM. Domingo: cerrado."}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <a
                  href={whatsapp(whatsappPhoneTulum, "Hola, quiero información de CLICK.COM del Caribe.")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#2563EB] px-4 py-2 text-[12.5px] font-bold text-white transition hover:bg-[#1D4ED8]"
                >
                  <span aria-hidden>☎</span> Escríbenos
                </a>

                <a
                  href={companyConfig.mapsUrlTulum || MAPS_URL_TULUM}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#2563EB]/30 px-4 py-2 text-[12.5px] font-bold text-[#2563EB] transition hover:bg-[#2563EB] hover:text-white"
                >
                  <Icon name="external" className="h-3.5 w-3.5" />
                  Ver en Maps
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#E8EDF5] bg-white">
              <iframe
                title="Ubicación CLICK.COM del Caribe - Tulum"
                src={companyConfig.mapaTulum || MAPS_EMBED_TULUM}
                className="h-[280px] w-full"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#102845] bg-[#0F1F4A] px-6 py-9 text-white lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <BrandMark light />
            <p className="text-[13px] text-[#B9C6DE]">Servicio especializado en informática</p>
          </div>
          <p className="text-[13px] text-[#B9C6DE]">
            © {new Date().getFullYear()} CLICK.COM del Caribe. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}

function InfoCard({ icon, title, accent, children }) {
  const bg = accent === "#F97316" ? "#FFF1E3" : "#EFF6FF";

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-7 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5">
      <span className="flex h-11 w-11 items-center justify-center rounded-full" style={{ background: bg, color: accent }}>
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <h3 className="mt-5 text-[12px] font-extrabold uppercase tracking-[0.16em]" style={{ color: accent }}>
        {title}
      </h3>
      <p className="mt-3 text-[14.5px] leading-7 text-[#475569]">{children}</p>
    </div>
  );
}
