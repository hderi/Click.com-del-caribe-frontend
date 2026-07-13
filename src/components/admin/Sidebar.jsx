"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";

function Icon({ children }) {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{children}</svg>;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25A2.25 2.25 0 018.25 10.5H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></Icon>,
  },
  {
    label: "Reparaciones",
    href: "/admin/reparaciones",
    icon: <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1 5.1a2.12 2.12 0 11-3-3l5.1-5.1m0 0L15 9.6m-7.58 5.57L4.8 12.54a2.12 2.12 0 010-3l7.74-7.74a2.12 2.12 0 013 0l2.66 2.66a2.12 2.12 0 010 3l-7.74 7.74a2.12 2.12 0 01-3 0z" /></Icon>,
  },
  {
    label: "Clientes",
    href: "/admin/clientes",
    icon: <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" /></Icon>,
  },
  {
    label: "Equipos",
    href: "/admin/equipos",
    icon: <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" /></Icon>,
  },
  {
    label: "Alertas",
    href: "/admin/alertas",
    icon: <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a3 3 0 11-5.714 0" /></Icon>,
  },
  {
    label: "Agenda",
    href: "/admin/agenda",
    icon: <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25m10.5-2.25v2.25M3.75 8.25h16.5m-15 12h13.5A1.5 1.5 0 0020.25 18.75V6.75A1.5 1.5 0 0018.75 5.25H5.25A1.5 1.5 0 003.75 6.75v12A1.5 1.5 0 005.25 20.25z" /></Icon>,
  },
  {
    label: "Mensajes",
    href: "/admin/mensajes",
    icon: <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.142-4.03 7.5-9 7.5a10.3 10.3 0 01-3.86-.73L3 20.25l1.38-3.45A6.93 6.93 0 013 12c0-4.142 4.03-7.5 9-7.5s9 3.358 9 7.5z" /></Icon>,
  },
  {
    label: "Configuración",
    href: "/admin/configuracion",
    icon: <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.219.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.379.138.752.43.992l1.005.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.219.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.219-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.003-.827c.293-.24.438-.613.431-.992a6.932 6.932 0 010-.255c.007-.379-.138-.752-.43-.992l-1.005-.827a1.125 1.125 0 01-.26-1.43l1.298-2.247a1.125 1.125 0 011.369-.491l1.217.456c.355.133.75.072 1.076-.124.072-.044.145-.087.219-.128.331-.183.581-.495.644-.869l.213-1.28z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></Icon>,
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const logout = () => {
    localStorage.removeItem("clickcom_token");
    localStorage.removeItem("clickcom_user");
    window.location.href = "/admin/login";
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        id="admin-sidebar"
        className={`
          fixed top-0 left-0 z-50 h-full w-[260px]
          bg-[#EAF2F7]/95 backdrop-blur-xl
          border-r border-[#D5E2EC] shadow-[12px_0_34px_rgba(15,23,42,0.08)]
          flex flex-col
          transition-transform duration-300 ease-[var(--ease-premium)]
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-5 h-[72px] border-b border-[#D5E2EC] shrink-0">
          <Logo size="small" />
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-[#5B6C80] hover:text-[#102033] hover:bg-[#F1F7FB] transition-all duration-200"
            aria-label="Cerrar menú"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1" aria-label="Navegación principal">
          <p className="px-3 mb-3 text-[11px] font-semibold tracking-[0.15em] uppercase text-[#5B6C80]">
            Menú principal
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-out ${isActive ? "bg-[#CFEAF6] text-[#0077B6]" : "text-[#253244] hover:bg-[#DDECF5] hover:text-[#102033]"}`}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-brand-blue shadow-[0_0_8px_rgba(0,102,255,0.4)]" />}
                <span className={`shrink-0 transition-colors duration-200 ${isActive ? "text-[#0077B6]" : "text-[#5B6C80] group-hover:text-[#253244]"}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {isActive && <div className="absolute inset-0 rounded-xl bg-[#CFEAF6]/70 pointer-events-none" />}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-[#D5E2EC] shrink-0">
          <button
            id="sidebar-logout-btn"
            onClick={logout}
            className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#526174] hover:bg-red-50 hover:text-red-600 transition-all duration-200 ease-out"
          >
            <svg className="w-5 h-5 shrink-0 text-[#7A8AA0] group-hover:text-red-600 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}