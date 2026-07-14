"use client";

import { useState } from "react";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import PromotionsSection from "@/components/PromotionsSection";
import HeroSection from "@/components/HeroSection";
import PoliciesSection from "@/components/PoliciesSection";
import Footer from "@/components/Footer";

const WHATSAPP_NUMBER = "529871119621";

const WINDOWS = [
  { id: "nosotros", label: "Inicio" },
  { id: "servicios", label: "Servicios" },
  { id: "promociones", label: "Promociones" },
  { id: "contacto", label: "Contacto" },
];

function BrandLogo() {
  return (
    <img
      src="/logo-clickcom.png.jpeg"
      alt="CLICK.COM DEL CARIBE"
      className="h-14 w-auto max-w-[190px] object-contain"
    />
  );
}

export default function PublicWindowApp() {
  const [activeWindow, setActiveWindow] = useState("nosotros");
  const [menuOpen, setMenuOpen] = useState(false);

  const openWindow = (id) => {
    setActiveWindow(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#111827]">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#E9EEF3] bg-white/95 shadow-sm backdrop-blur-xl">
        <nav className="mx-auto flex h-20 max-w-[1180px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <button
            type="button"
            onClick={() => openWindow("nosotros")}
            className="shrink-0"
            aria-label="CLICK.COM Caribe inicio"
          >
            <BrandLogo />
          </button>

          <ul className="hidden items-center gap-1 lg:flex">
            {WINDOWS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => openWindow(item.id)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    activeWindow === item.id
                      ? "bg-[#EAF8FE] text-[#0077B6]"
                      : "text-[#4B5563] hover:bg-[#F5F7FA] hover:text-[#0077B6]"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={() => openWindow("seguimiento")}
              className={`rounded-full border border-[#00AEEF]/25 bg-white px-5 py-2.5 text-sm font-black transition hover:border-[#00AEEF] hover:bg-[#EAF8FE] ${
                activeWindow === "seguimiento" ? "text-[#0077B6] shadow-sm" : "text-[#0077B6]"
              }`}
            >
              Dar seguimiento
            </button>
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
            <span className="text-2xl leading-none">=</span>
          </button>
        </nav>

        {menuOpen && (
          <div className="border-t border-[#E9EEF3] bg-white px-5 py-4 shadow-sm lg:hidden">
            <div className="flex flex-col gap-2">
              {WINDOWS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openWindow(item.id)}
                  className={`rounded-2xl px-4 py-3 text-left text-base font-bold ${
                    activeWindow === item.id ? "bg-[#EAF8FE] text-[#0077B6]" : "text-[#111827] hover:bg-[#F5F7FA]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => openWindow("seguimiento")}
                className="rounded-2xl border border-[#00AEEF]/25 bg-white px-4 py-3 text-center text-base font-black text-[#0077B6]"
              >
                Dar seguimiento
              </button>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-[#FF7A00] px-4 py-3 text-center text-base font-black text-white"
              >
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>

      <div className="pt-20">
        {activeWindow === "nosotros" && <AboutSection />}
        {activeWindow === "servicios" && <ServicesSection />}
        {activeWindow === "promociones" && <PromotionsSection />}
        {activeWindow === "seguimiento" && (
          <>
            <HeroSection />
            <PoliciesSection />
          </>
        )}
        {activeWindow === "contacto" && <Footer />}
      </div>
    </main>
  );
}

