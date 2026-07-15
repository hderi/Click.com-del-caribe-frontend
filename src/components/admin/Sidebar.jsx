"use client";

import { clearSession, logoutToLogin } from "@/lib/authStorage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", code: "DB" },
  { label: "Reparaciones", href: "/admin/reparaciones", code: "RP" },
  { label: "Clientes", href: "/admin/clientes", code: "CL" },
  { label: "Equipos", href: "/admin/equipos", code: "EQ" },
  { label: "Alertas", href: "/admin/alertas", code: "AL" },
  { label: "Agenda", href: "/admin/agenda", code: "AG" },
  { label: "Mensajes", href: "/admin/mensajes", code: "MS" },
  { label: "Configuración", href: "/admin/configuracion", code: "CF" },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const logout = () => {
    clearSession();
    logoutToLogin();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="admin-sidebar"
        className={`fixed left-0 top-0 z-50 flex h-full w-[248px] flex-col border-r border-[#1f2937] bg-[#111827] transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#1f2937] px-4">
          <Logo size="small" />
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-[#9ca3af] transition-colors hover:bg-[#1f2937] hover:text-white lg:hidden"
            aria-label="Cerrar menú"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3" aria-label="Navegación principal">
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9ca3af]">
            Menú principal
          </p>

          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`relative flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors ${
                  isActive ? "bg-[#1f2937] text-white" : "text-[#d1d5db] hover:bg-[#1f2937] hover:text-white"
                }`}
              >
                {isActive && <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#60a5fa]" />}
                <span className={`flex h-6 w-7 shrink-0 items-center justify-center rounded border text-[10px] font-semibold ${
                  isActive ? "border-[#374151] bg-[#111827] text-[#93c5fd]" : "border-[#374151] text-[#9ca3af]"
                }`}>
                  {item.code}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-[#1f2937] px-2 py-3">
          <button
            id="sidebar-logout-btn"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium text-[#d1d5db] transition-colors hover:bg-[#1f2937] hover:text-white"
          >
            <span className="flex h-6 w-7 shrink-0 items-center justify-center rounded border border-[#374151] text-[10px] font-semibold text-[#9ca3af]">
              OUT
            </span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
