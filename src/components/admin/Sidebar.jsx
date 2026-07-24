"use client";

import { clearSession, getSessionUser, logoutToLogin } from "@/lib/authStorage";
import { filterNavItemsForUser } from "@/lib/roleAccess";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Monitor,
  ShieldCheck,
  UserRoundCog,
  Users,
  Wrench,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", Icon: LayoutDashboard },
  { label: "Reparaciones", href: "/admin/reparaciones", Icon: Wrench },
  { label: "Clientes", href: "/admin/clientes", Icon: Users },
  { label: "Equipos", href: "/admin/equipos", Icon: Monitor },
  { label: "Garantías", href: "/admin/garantias", Icon: ShieldCheck },
  { label: "Recordatorios", href: "/admin/alertas", Icon: Bell },
  { label: "Usuarios", href: "/admin/configuracion", Icon: UserRoundCog },
];

export default function Sidebar({ isOpen, isCollapsed = false, onClose }) {
  const pathname = usePathname();
  const sessionUser = getSessionUser();
  const visibleItems = filterNavItemsForUser(navItems, sessionUser);

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
        className={`fixed left-0 top-0 z-50 flex h-full w-[292px] flex-col overflow-hidden border-r border-[#E5E7EB] bg-white font-[Inter] transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          isCollapsed ? "lg:hidden" : ""
        } ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#E5E7EB] px-6 py-6">
          <div className="flex items-center gap-3">
            <img
              src="/logos/logo-principal.png.png"
              alt="CLICK.COM del Caribe"
              className="h-11 w-11 shrink-0 object-contain"
            />

            <div className="leading-tight">
              <p className="text-[14px] font-bold tracking-tight text-[#0A0A0A]">CLICK.COM</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF6B00]">
                Del Caribe
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-[4px] p-1.5 text-[#6B7280] transition-colors hover:bg-[#F5F5F5] hover:text-[#0A0A0A] lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto" aria-label="Navegación principal">
         <p className="font-inter border-b border-[#E5E7EB] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A8A8A]">
          Menú principal
          </p>
          {visibleItems.map(({ label, href, Icon }) => {
            const isActive = pathname === href || pathname?.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`group relative flex min-h-[54px] items-center gap-3 border-b border-[#E5E7EB] px-6 py-3 text-[14px] font-semibold transition-colors duration-150 ${
                  isActive ? "bg-[#F7FAFF] text-[#0055FF]" : "bg-white text-[#0A0A0A] hover:bg-[#F8FAFC]"
                }`}
              >
                {isActive ? <span className="absolute left-0 top-0 h-full w-[3px] bg-[#0055FF]" /> : null}

                <Icon
                  className={`h-[19px] w-[19px] shrink-0 ${
                    isActive ? "text-[#0055FF]" : "text-[#6B7280] group-hover:text-[#0055FF]"
                  }`}
                  strokeWidth={1.8}
                />

                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-[#E5E7EB]">
          <button
            id="sidebar-logout-btn"
            onClick={logout}
            className="group flex min-h-[58px] w-full items-center gap-3 bg-white px-6 py-4 text-[14px] font-semibold text-[#0A0A0A] transition-colors duration-150 hover:bg-[#FFF7F0]"
          >
            <LogOut className="h-[19px] w-[19px] shrink-0 text-[#FF6B00]" strokeWidth={1.8} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
