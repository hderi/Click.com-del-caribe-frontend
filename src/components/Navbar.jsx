"use client";

import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "529871119621";

const NAV_LINKS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Promociones", href: "#promociones" },
  { label: "Seguimiento", href: "#seguimiento" },
  { label: "Contacto", href: "#contacto" },
];

function BrandLogo() {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/logo-clickcom.png.jpeg"
        alt="CLICK.COM DEL CARIBE"
        className="h-14 w-auto max-w-[190px] object-contain"
      />
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-[#E9EEF3] bg-white/95 shadow-sm backdrop-blur-xl"
          : "border-transparent bg-white/85 backdrop-blur-xl"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href="#inicio" aria-label="CLICK.COM Caribe inicio">
          <BrandLogo />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-bold text-[#4B5563] transition hover:bg-[#F5F7FA] hover:text-[#0077B6]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="#seguimiento"
            className="rounded-full border border-[#00AEEF]/25 bg-white px-5 py-2.5 text-sm font-black text-[#0077B6] transition hover:border-[#00AEEF] hover:bg-[#EAF8FE]"
          >
            Dar seguimiento
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#FF7A00] px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-[#FFA21A]"
          >
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E9EEF3] bg-white text-[#080808] lg:hidden"
          aria-label="Abrir menu"
        >
          <span className="text-2xl leading-none">≡</span>
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-[#E9EEF3] bg-white px-5 py-4 shadow-sm lg:hidden">
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-base font-bold text-[#111827] hover:bg-[#F5F7FA]"
              >
                {link.label}
              </a>
            ))}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 rounded-2xl bg-[#FF7A00] px-4 py-3 text-center text-base font-black text-white"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}