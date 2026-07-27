"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const DEFAULT_WHATSAPP_NUMBER = "529848047192";
const WHATSAPP_TULUM = "529842182699";

const DEFAULT_MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d796.1388676850976!2d-87.09012077157857!3d20.63081065390293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f4e4310ef435a97%3A0x5c268f5b314779dd!2sCLICK.COM%20DEL%20CARIBE!5e1!3m2!1ses!2smx!4v1784277526852!5m2!1ses!2smx";

const DEFAULT_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=CLICK.COM+DEL+CARIBE+Playa+del+Carmen";

const MAPS_EMBED_TULUM = "https://www.google.com/maps?q=Click+del+Caribe+Tulum&output=embed";
const MAPS_URL_TULUM = "https://www.google.com/maps/search/?api=1&query=Click+del+Caribe+Tulum";

const ADDRESS_PLAYA =
  "Av. Juárez MZ 214, Lote 1, Local 3, entre Av. 80 y 85, Colonia Ejido, Playa del Carmen, Quintana Roo.";

const ADDRESS_TULUM =
  "Av. Tulum Oriente entre Libra y Escorpión Norte, Local 1, Tulum, Quintana Roo.";

const valores = [
  "Respeto",
  "Honradez",
  "Confianza",
  "Lealtad",
  "Responsabilidad",
  "Honestidad",
  "Compromiso",
];

const beneficios = [
  {
    title: "Servicio especializado en informática",
    text: "Soluciones adaptadas a tus necesidades.",
    accent: "#2563EB",
  },
  {
    title: "Click.com, soluciones en segundos",
    text: "Rapidez y eficiencia en cada servicio.",
    accent: "#FF6B00",
  },
  {
    title: "Click.com, soluciones seguras",
    text: "Protegemos tu información y tu equipo.",
    accent: "#2563EB",
  },
];

const servicios = [
  { icon: "camera", image: "/Servicios/cctv.png", title: "CCTV", text: "Videovigilancia, configuración, revisión y soporte técnico para hogares y negocios.", accent: "#2563EB" },
  { icon: "wifi", image: "/Servicios/redes.png", title: "Redes", text: "Instalación, revisión y mantenimiento de redes para hogares, oficinas y empresas.", accent: "#F97316" },
  { icon: "laptop", image: "/Servicios/computacion.png", title: "Computación", text: "Venta, diagnóstico y soporte de equipos de cómputo para uso personal y empresarial.", accent: "#2563EB" },
  { icon: "cable", image: "/Servicios/accesorios.png", title: "Accesorios y refacciones", text: "Amplio inventario de accesorios y refacciones para tus equipos.", accent: "#F97316" },
  { icon: "bolt", image: "/Servicios/cercos.png", title: "Cercos eléctricos", text: "Instalación y mantenimiento de cercos eléctricos para mayor seguridad.", accent: "#2563EB" },
  { icon: "fingerprint", image: "/Servicios/control-acceso.png", title: "Controles de acceso", text: "Sistemas de control de acceso biométrico y por tarjeta para tu negocio.", accent: "#F97316" },
  { icon: "server", image: "/Servicios/mantenimiento.png", title: "Mantenimiento preventivo y correctivo", text: "Revisión y reparación de equipos para mantenerlos siempre funcionando.", accent: "#2563EB" },
  { icon: "register", image: "/Servicios/punto-venta.png", title: "Punto de venta", text: "Instalación y soporte de sistemas de punto de venta para tu negocio.", accent: "#F97316" },
];

const wispPlan = {
  title: "Internet WISP",
  text: "Conectividad inalámbrica de alta velocidad — plan residencial y comercial, con cobertura confiable en toda la zona.",
  accent: "#F97316",
};

function goTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function normalizeMxPhone(value) {
  const clean = String(value || "").replace(/\D/g, "");
  if (!clean) return DEFAULT_WHATSAPP_NUMBER;
  return clean.startsWith("52") ? clean : `52${clean}`;
}

function whatsapp(phone, text) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

function BrandMark({ light = false }) {
  return (
    <img
      src="public/logo-clickcom.png.png"
      alt="CLICK.COM del Caribe"
      className={light ? "h-10 w-auto object-contain brightness-0 invert" : "h-14 w-auto object-contain sm:h-16"}
    />
  );
}

function Icon({ name, className = "", style }) {
  const common = {
    className,
    style,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    viewBox: "0 0 24 24",
  };

  const paths = {
    phone: <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 2 6a2 2 0 0 1 2-2Z" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s7-6.6 7-11.5A7 7 0 0 0 5 9.5C5 14.4 12 21 12 21Z" />
        <circle cx="12" cy="9.5" r="2.4" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="M13 6l6 6-6 6" />
      </>
    ),
    external: (
      <>
        <path d="M14 4h6v6" />
        <path d="M10 14 20 4" />
        <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
      </>
    ),
    wifi: (
      <>
        <path d="M3 8.5a16 16 0 0 1 18 0" />
        <path d="M6.5 12.2a11 11 0 0 1 11 0" />
        <path d="M10 16a5.5 5.5 0 0 1 4 0" />
        <circle cx="12" cy="19.2" r="1.1" fill="currentColor" stroke="none" />
      </>
    ),
    camera: (
      <>
        <path d="M4 8h3l1.5-2h6L16 8h4a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
        <circle cx="12" cy="13.5" r="3.2" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3c2.8 2.6 4.3 5.7 4.3 9s-1.5 6.4-4.3 9c-2.8-2.6-4.3-5.7-4.3-9S9.2 5.6 12 3Z" />
      </>
    ),
    cable: (
      <>
        <path d="M6 3v5a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V3" />
        <path d="M12 11v4" />
        <circle cx="12" cy="18" r="3" />
      </>
    ),
    gear: (
      <>
        <circle cx="12" cy="12" r="3.2" />
        <path d="M12 3v2.4M12 18.6V21M4.2 7.8l2.1 1.2M17.7 15l2.1 1.2M4.2 16.2l2.1-1.2M17.7 9l2.1-1.2M3 12h2.4M18.6 12H21" />
      </>
    ),
    server: (
      <>
        <rect x="4" y="4" width="16" height="6.5" rx="1.3" />
        <rect x="4" y="13.5" width="16" height="6.5" rx="1.3" />
        <path d="M7.5 7.3h.01M7.5 16.8h.01" />
      </>
    ),
    laptop: (
      <>
        <rect x="5" y="5" width="14" height="9.5" rx="1.2" />
        <path d="M2.5 18.5h19" />
      </>
    ),
    wrench: (
      <>
        <path d="M14.7 6.3a4 4 0 0 0-5.4 4.6L4 16.2V20h3.8l5.3-5.3a4 4 0 0 0 4.6-5.4l-2.7 2.7-2-2 2.7-2.7Z" />
      </>
    ),
    tower: (
      <>
        <path d="M12 3v18" />
        <path d="M7 8a7 7 0 0 1 10 0M5 5a10 10 0 0 1 14 0" />
        <path d="M9 21h6M8 21l4-13 4 13" />
      </>
    ),
    bolt: <path d="M13 3 5 13h5l-1 8 8-10h-5l1-8Z" />,
    fingerprint: (
      <>
        <path d="M12 3a7 7 0 0 0-7 7v2c0 3 1 5.5 2.5 7.5" />
        <path d="M12 3a7 7 0 0 1 7 7v2c0 1.2-.1 2.3-.4 3.3" />
        <path d="M8.5 20.5A11 11 0 0 1 7 12v-2a5 5 0 0 1 10 0v2c0 1.3-.2 2.4-.6 3.4" />
        <path d="M12 8.5a3.5 3.5 0 0 0-3.5 3.5v1c0 2.6.7 4.7 1.8 6.3" />
        <path d="M12 8.5A3.5 3.5 0 0 1 15.5 12v1.2" />
        <path d="M12 12v1.5c0 1.8.4 3.3 1 4.5" />
      </>
    ),
    register: (
      <>
        <rect x="3.5" y="9" width="17" height="11" rx="1.3" />
        <path d="M7 9V6.5A2.5 2.5 0 0 1 9.5 4h5A2.5 2.5 0 0 1 17 6.5V9" />
        <path d="M8 14h3M13 14h3M8 17h8" />
      </>
    ),
  };

  return <svg {...common}>{paths[name] || paths.arrow}</svg>;
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

function InfoCard({ title, accent, children }) {
  return (
    <article className="rounded-2xl border border-[#E2E8F0] bg-white/92 p-7 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <span className="block h-1 w-12 rounded-full" style={{ background: accent }} />
      <h3 className="mt-5 text-[12px] font-extrabold uppercase tracking-[0.16em]" style={{ color: accent }}>
        {title}
      </h3>
      <p className="mt-3 text-[14.5px] leading-7 text-[#475569]">{children}</p>
    </article>
  );
}

function ContactBranch({ title, address, phone, email, schedule, whatsappPhone, mapsUrl, mapsEmbedUrl, mapTitle }) {
  return (
    <>
      <div className="rounded-xl border border-[#E8EDF5] bg-white p-5">
        <h3 className="text-[15px] font-bold text-[#0F1F4A]">{title}</h3>

        <div className="mt-4 space-y-3.5 text-[13.5px] leading-6 text-[#3A4457]">
          <div className="flex gap-2.5">
            <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
            <p>{address}</p>
          </div>
          <div className="flex items-center gap-2.5">
            <Icon name="phone" className="h-4 w-4 shrink-0 text-[#2563EB]" />
            <p>{phone}</p>
          </div>
          <div className="flex items-center gap-2.5">
            <Icon name="mail" className="h-4 w-4 shrink-0 text-[#2563EB]" />
            <p>{email}</p>
          </div>
          <div className="flex gap-2.5">
            <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
            <p>{schedule}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <a
            href={whatsapp(whatsappPhone, "Hola, quiero información de CLICK.COM del Caribe.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#2563EB] px-4 py-2 text-[12.5px] font-bold text-white transition hover:bg-[#1D4ED8]"
          >
            Escríbenos
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
          title={mapTitle}
          src={mapsEmbedUrl}
          className="h-[220px] w-full lg:h-full lg:min-h-[280px]"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </>
  );
}

function ServiceCard({ servicio }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = servicio.image && !imgFailed;

  return (
    <div className="group">
      <div
        className="flex h-[170px] w-full items-center justify-center overflow-hidden rounded-2xl p-4 transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        style={{ background: `linear-gradient(135deg, ${servicio.accent}1A, ${servicio.accent}08)` }}
      >
        {showImage ? (
          <img
            src={servicio.image}
            alt={servicio.title}
            onError={() => setImgFailed(true)}
            className="max-h-full max-w-full object-contain"
            style={{ filter: "drop-shadow(0 8px 14px rgba(15,23,42,0.12))" }}
          />
        ) : (
          <Icon name={servicio.icon} className="h-11 w-11" style={{ color: servicio.accent }} />
        )}
      </div>
      <h3 className="mt-4 text-[15.5px] font-extrabold text-[#0F1F4A]">{servicio.title}</h3>
      <p className="mt-2 text-[13.5px] leading-6 text-[#5B6472]">{servicio.text}</p>
      <span
        className="mt-3 block h-[2px] w-8 transition-all duration-300 group-hover:w-12"
        style={{ background: servicio.accent }}
      />
    </div>
  );
}

export default function PublicWindowApp() {
  const [publicConfig, setPublicConfig] = useState({});
  const [companyConfig, setCompanyConfig] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

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

  const whatsappPhone = normalizeMxPhone(companyConfig.telefono || DEFAULT_WHATSAPP_NUMBER);
  const whatsappPhoneTulum = normalizeMxPhone(companyConfig.telefonoTulum || WHATSAPP_TULUM);
  const address = companyConfig.direccion || ADDRESS_PLAYA;
  const mapsEmbedUrl = companyConfig.mapa || DEFAULT_MAPS_EMBED_URL;
  const mapsUrl = companyConfig.mapsUrl || companyConfig.mapaUrl || DEFAULT_MAPS_URL;

  const visibleValues = String(publicConfig.valores || valores.join(","))
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <main
      className="min-h-screen w-full overflow-x-hidden bg-cover bg-center bg-no-repeat font-sans text-[#0F1F4A]"
      style={{
        fontFamily: "'Inter', sans-serif",
        backgroundImage: "url('/fondo principal.jpg')",
        backgroundAttachment: "fixed",
      }}
    >
      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .float-mascot { animation: floatY 4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .float-mascot { animation: none; }
        }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-[#E8EDF5] bg-white/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <button type="button" onClick={() => goTo("inicio")} className="flex items-center">
            <BrandMark />
          </button>

          <nav className="hidden items-center gap-10 text-[14.5px] font-semibold text-[#3A4457] md:flex">
            {["inicio", "nosotros", "servicios", "contacto"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => goTo(item)}
                className="capitalize transition hover:text-[#2563EB]"
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/seguimiento"
              className="hidden items-center rounded-xl border border-[#D6DEE8] bg-white px-5 text-[14px] font-bold text-[#2563EB] transition hover:border-[#2563EB] hover:bg-[#F2F7FF] sm:flex"
              style={{ height: 46 }}
            >
              Dar seguimiento
            </a>
            <a
              href={whatsapp(whatsappPhone, "Hola, quiero información de CLICK.COM del Caribe.")}
              target="_blank"
              rel="noreferrer"
              className="flex items-center rounded-xl bg-[#2563EB] px-5 text-[14px] font-bold text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)] transition hover:bg-[#1D4ED8]"
              style={{ height: 46 }}
            >
              Contáctanos
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D6DEE8] bg-white text-[#0F1F4A] md:hidden"
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuOpen ? <path d="M6 6l12 12M18 6l-12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-[#E8EDF5] bg-white px-6 py-4 md:hidden">
            <nav className="flex flex-col gap-1 text-[15px] font-semibold text-[#3A4457]">
              {["inicio", "nosotros", "servicios", "contacto"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    goTo(item);
                    setMenuOpen(false);
                  }}
                  className="w-full rounded-lg px-3 py-3 text-left capitalize transition hover:bg-[#F2F7FF] hover:text-[#2563EB]"
                >
                  {item}
                </button>
              ))}
              <a
                href="/seguimiento"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-lg border border-[#D6DEE8] px-3 py-3 text-center font-bold text-[#2563EB]"
              >
                Dar seguimiento
              </a>
            </nav>
          </div>
        )}
      </header>

      <section id="inicio" className="relative overflow-hidden bg-transparent">
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[45%_55%] lg:gap-8 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-[540px] text-center lg:mx-0 lg:text-left">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-[#FF6B00]">
              Bienvenido a CLICK.COM del Caribe
            </p>
            <h1 className="mt-5 text-[46px] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#0F1F4A] sm:text-[58px] lg:text-[68px]">
              Tecnología que impulsa
              <br />
              <span className="text-[#FF6B00]">tu mundo</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[460px] text-[17px] leading-8 text-[#5B6472] lg:mx-0">
              {publicConfig.quienesSomos ||
                "Más de 18 años ofreciendo soluciones tecnológicas confiables y personalizadas para tu hogar, negocio o empresa."}
            </p>
          </div>

          <div className="relative mx-auto flex h-[360px] w-full max-w-[440px] items-center justify-center lg:h-[460px] lg:max-w-none">
            <img
              src="/mascot click.png"
              alt="Mascota CLICK.COM del Caribe"
              className="float-mascot relative z-10 h-auto w-[320px] drop-shadow-[0_30px_40px_rgba(15,31,74,0.14)] sm:w-[390px] lg:w-[470px]"
            />
            <div className="absolute bottom-2 h-6 w-40 rounded-[50%] bg-black/10 blur-md sm:w-56 lg:w-64" />
          </div>
        </div>
      </section>

      <section id="nosotros" className="relative overflow-hidden border-t border-white/40 bg-white/72 px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#0F1F4A]">Nosotros</p>
          <span className="mt-2 block h-[2px] w-8 bg-[#0F1F4A]" />
          <h2 className="mt-5 max-w-2xl text-[36px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#0F1F4A] sm:text-[42px]">
            Soluciones que generan confianza.
          </h2>
          <p className="mt-6 max-w-2xl text-[15.5px] font-medium leading-8 text-[#0F1F4A]">
            {publicConfig.quienesSomos ||
              "Somos una empresa dedicada al negocio tecnológico con vocación de servicio, brindando soluciones integrales a empresas, instituciones gubernamentales y clientes particulares."}
          </p>

          <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-2xl text-[26px] font-extrabold leading-[1.3] tracking-[-0.01em] text-[#0F1F4A] sm:text-[30px]">
              &ldquo;Tecnología y conectividad para tu proyecto.&rdquo;
            </p>
            <div className="shrink-0 text-left sm:text-right">
              <span className="text-[42px] font-extrabold leading-none text-[#0F1F4A]">18</span>
              <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.16em] text-[#0F1F4A]">
                Años de experiencia
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-10 border-t-2 border-[#0F1F4A] pt-10 sm:grid-cols-2">
            <div>
              <span className="text-[46px] font-extrabold leading-none text-[#0F1F4A]/10">01</span>
              <h3 className="-mt-6 text-[13px] font-extrabold uppercase tracking-[0.16em] text-[#0F1F4A]">Misión</h3>
              <p className="mt-3 text-[15px] font-medium leading-7 text-[#0F1F4A]">
                {publicConfig.mision ||
                  "Proveer productos y servicios de calidad que satisfagan las expectativas de nuestros clientes, innovando y siendo competitivos en soluciones tecnológicas."}
              </p>
            </div>
            <div>
              <span className="text-[46px] font-extrabold leading-none text-[#0F1F4A]/10">02</span>
              <h3 className="-mt-6 text-[13px] font-extrabold uppercase tracking-[0.16em] text-[#0F1F4A]">Visión</h3>
              <p className="mt-3 text-[15px] font-medium leading-7 text-[#0F1F4A]">
                {publicConfig.vision ||
                  "Ser una empresa exitosa, rentable y atractiva, dedicada al negocio tecnológico con vocación de servicio y soluciones integrales."}
              </p>
            </div>
          </div>

          <div className="mt-14 border-t-2 border-[#0F1F4A] pt-10">
            <h3 className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-[#0F1F4A]">Valores</h3>
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
              {visibleValues.map((valor) => (
                <span key={valor} className="text-[16px] font-bold text-[#0F1F4A]">
                  {valor}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="servicios" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="mb-14 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <SectionLabel>Servicios</SectionLabel>
          </div>
          <p className="max-w-xl text-[15px] leading-7 text-[#5B6472]">
            Servicio especializado en informática, disponible en Playa del Carmen y Tulum.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {servicios.map((servicio) => (
            <ServiceCard key={servicio.title} servicio={servicio} />
          ))}
        </div>

        <div className="relative mt-12 flex flex-col gap-6 border-t-2 border-[#0F1F4A] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-5">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#0F1F4A0d] sm:h-28 sm:w-28">
              <img
                src="/Servicios/wisp.png"
                alt="Internet WISP"
                className="h-full w-full object-contain p-2"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#0F1F4A]">
                Exclusivo Tulum
              </p>
              <h3 className="mt-1 text-[20px] font-extrabold text-[#0F1F4A]">{wispPlan.title}</h3>
              <p className="mt-1.5 max-w-lg text-[14px] font-medium leading-6 text-[#0F1F4A]">{wispPlan.text}</p>
            </div>
          </div>
          <a
            href={whatsapp(WHATSAPP_TULUM, "Hola, quiero mas información acerca de el internet WISP en Tulum.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-full px-6 py-3 text-[14px] font-extrabold text-white shadow-[0_10px_25px_rgba(15,31,74,0.18)] transition hover:opacity-90"
            style={{ background: "#0F1F4A" }}
          >
            Solicitar información
          </a>
        </div>
      </section>

      <section id="contacto" className="mx-auto max-w-[1600px] px-6 py-16 lg:px-10">
        <div className="mb-10">
          <SectionLabel>Contacto</SectionLabel>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr_1fr_1.1fr] lg:items-stretch">
          <ContactBranch
            title="Sucursal Playa del Carmen"
            address={address}
            phone={companyConfig.telefono || "984 804 7192"}
            email={companyConfig.correo || "erickalh56@gmail.com"}
            schedule={
              companyConfig.horario ||
              "Lunes a viernes: 9:00 AM - 6:00 PM. Sábado: 9:00 AM - 3:00 PM. Domingo: cerrado."
            }
            whatsappPhone={whatsappPhone}
            mapsUrl={mapsUrl}
            mapsEmbedUrl={mapsEmbedUrl}
            mapTitle="Ubicación CLICK.COM del Caribe - Playa del Carmen"
          />
          <ContactBranch
            title="Sucursal Tulum"
            address={companyConfig.direccionTulum || ADDRESS_TULUM}
            phone={companyConfig.telefonoTulum || "984 218 2699"}
            email={companyConfig.correo || "erickalh56@gmail.com"}
            schedule={
              companyConfig.horarioTulum ||
              "Lunes a viernes: 9:00 AM - 6:00 PM. Sábado: 9:00 AM - 3:00 PM. Domingo: cerrado."
            }
            whatsappPhone={whatsappPhoneTulum}
            mapsUrl={companyConfig.mapsUrlTulum || MAPS_URL_TULUM}
            mapsEmbedUrl={companyConfig.mapaTulum || MAPS_EMBED_TULUM}
            mapTitle="Ubicación CLICK.COM del Caribe - Tulum"
          />
        </div>
      </section>

      <footer className="border-t border-[#1E3A6E] bg-[#16305C] px-6 py-4 text-white lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-center">
          <p className="text-[13px] text-[#C7D3E8]">
            © {new Date().getFullYear()} CLICK.COM del Caribe. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}