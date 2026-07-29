"use client";

import { clearSession, getToken, logoutToLogin } from "@/lib/authStorage";
import { getPaymentStatus, hasPendingPayment } from "@/lib/paymentStatus";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

const interStack = "var(--font-inter), Inter, Segoe UI, Arial, sans-serif";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const CLOSED_STATUS = new Set(["entregado", "cerrado"]);
const READY_STATUS = new Set(["finalizado", "listo"]);

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos dias";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

function normalizeRole(role = "") {
  const labels = {
    admin: "Administrador",
    gerencia: "Gerencia",
    ventas: "Ventas",
    recepcion: "Recepcion",
    tecnico: "Tecnico",
  };
  const key = String(role || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return labels[key] || role || "Usuario interno";
}

function dateOnly(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function todayValue() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function daysSince(value) {
  const date = parseDate(value);
  if (!date) return 0;
  return Math.floor((Date.now() - date.getTime()) / 86400000);
}

function clientName(repair) {
  return repair?.cliente?.nombre || "Cliente sin nombre";
}

function equipmentName(repair) {
  return [repair?.equipo?.marca, repair?.equipo?.modelo].filter(Boolean).join(" ") || repair?.equipo?.tipo || "Equipo";
}

function buildNotifications(repairs = []) {
  const today = todayValue();
  const notices = [];

  for (const repair of repairs) {
    const estado = String(repair.estado || "").toLowerCase();
    if (CLOSED_STATUS.has(estado)) continue;

    const entrega = dateOnly(repair.fechaEntregaEstimada);
    const titleBase = `${repair.folio || "Sin folio"} - ${clientName(repair)}`;
    const href = repair.folio ? `/admin/reparaciones/${repair.folio}` : "/admin/reparaciones";

    if (entrega && entrega < today) {
      notices.push({
        key: `${repair.folio}-vencida`,
        type: "danger",
        title: "Entrega vencida",
        text: `${titleBase}. Fecha estimada: ${entrega}.`,
        href,
      });
      continue;
    }

    if (entrega === today) {
      notices.push({
        key: `${repair.folio}-hoy`,
        type: "info",
        title: "Entrega programada para hoy",
        text: `${titleBase}. ${equipmentName(repair)}.`,
        href,
      });
    }

    if (READY_STATUS.has(estado)) {
      notices.push({
        key: `${repair.folio}-recoger`,
        type: "success",
        title: "Equipo listo para recoger",
        text: `${titleBase}. Avisar al cliente si sigue activo.`,
        href,
      });
    }

    const historial = Array.isArray(repair.historial) ? repair.historial : [];
    const lastMove = historial[historial.length - 1]?.fecha || repair.actualizadoEn || repair.creadoEn || repair.fechaIngreso;
    if (daysSince(lastMove) > 3) {
      notices.push({
        key: `${repair.folio}-movimiento`,
        type: "warning",
        title: "Sin movimiento reciente",
        text: `${titleBase}. Revisar avance tecnico.`,
        href,
      });
    }

    if (hasPendingPayment(repair)) {
      const pago = getPaymentStatus(repair);
      notices.push({
        key: `${repair.folio}-pago`,
        type: "warning",
        title: "Pago pendiente",
        text: `${titleBase}. Saldo por liquidar: $${Number(pago.saldo || 0).toLocaleString("es-MX")}.`,
        href,
      });
    }
  }

  return notices.slice(0, 8);
}

export default function Topbar({ onMenuToggle, onSidebarCollapseToggle, sidebarCollapsed = false }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("clickcom_user") || localStorage.getItem("clickcom_user");
      if (stored) setCurrentUser(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadNotifications() {
      const token = typeof window !== "undefined" ? getToken() : "";
      if (!token) return;

      try {
        setNotificationsLoading(true);
        setNotificationsError("");
        const response = await fetch(`${API_URL}/api/reparaciones`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "No se pudieron cargar notificaciones");
        if (!ignore) setNotifications(buildNotifications(data.reparaciones || []));
      } catch (error) {
        if (!ignore) {
          setNotifications([]);
          setNotificationsError(error.message || "No se pudieron cargar notificaciones");
        }
      } finally {
        if (!ignore) setNotificationsLoading(false);
      }
    }

    loadNotifications();
    const timer = window.setInterval(loadNotifications, 60000);
    return () => {
      ignore = true;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = currentUser?.nombre || currentUser?.usuario || "Usuario";
  const displayRole = normalizeRole(currentUser?.rol);
  const initial = displayName.charAt(0).toUpperCase();
  const greeting = useMemo(() => getGreeting(), []);

  const logout = () => {
    clearSession();
    logoutToLogin();
  };

  return (
    <header
      id="admin-topbar"
      className="sticky top-0 z-30 h-[72px] shrink-0 border-b border-[#DDE5EE] bg-white"
      style={{ fontFamily: interStack }}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-5 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            id="topbar-sidebar-collapse-btn"
            onClick={onSidebarCollapseToggle}
            className="hidden h-10 items-center rounded-md border border-[#DDE5EE] bg-white px-3 text-[#526174] transition-colors duration-150 hover:border-[#0B79D0] hover:text-[#0B79D0] lg:flex"
            aria-label={sidebarCollapsed ? "Mostrar panel lateral" : "Ocultar panel lateral"}
            title={sidebarCollapsed ? "Mostrar panel lateral" : "Ocultar panel lateral"}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d={sidebarCollapsed ? "M4 6h16M4 12h16M4 18h16" : "M15 6l-6 6 6 6"} />
            </svg>
          </button>

          <button
            id="topbar-menu-btn"
            onClick={onMenuToggle}
            className="rounded-md border border-[#DDE5EE] bg-[#F8FAFC] p-2 text-[#526174] transition-colors duration-150 hover:border-[#BFD0E2] hover:text-[#0F172A] lg:hidden"
            aria-label="Abrir menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div className="min-w-0">
            <p className="truncate text-[18px] font-bold leading-6 text-[#0F172A]">
              {greeting}, {displayName}
            </p>
          </div>
        </div>

        <div className="flex h-full items-center gap-3">
          <div ref={notifRef} className="relative">
            <button
              id="topbar-notifications-btn"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className="relative flex h-10 items-center rounded-md border border-[#DDE5EE] bg-white px-3 text-[#526174] transition-colors duration-150 hover:border-[#0B79D0] hover:text-[#0B79D0]"
              aria-label="Notificaciones"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              {notifications.length > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2563EB] px-1 text-[10px] font-bold leading-none text-white">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md border border-[#DDE5EE] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.12)]">

                <div className="max-h-80 overflow-y-auto p-2">
                  {notificationsLoading ? (
                    <p className="px-2 py-3 text-sm font-semibold text-[#334155]">Cargando recordatorios...</p>
                  ) : notificationsError ? (
                    <p className="px-2 py-3 text-sm font-semibold text-[#B42318]">{notificationsError}</p>
                  ) : notifications.length ? (
                    notifications.map((item) => <NotificationItem key={item.key} item={item} />)
                  ) : (
                    <p className="px-2 py-3 text-sm font-semibold text-[#334155]">Sin recordatorios por ahora.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div ref={profileRef} className="relative">
            <button
              id="topbar-profile-btn"
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex h-10 items-center gap-2.5 rounded-md border border-[#DDE5EE] bg-white px-2.5 transition-colors duration-150 hover:border-[#0B79D0]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#2563EB] text-xs font-bold text-white">
                {initial}
              </div>
              <span className="hidden min-w-0 text-left sm:block">
                <span className="block max-w-[150px] truncate text-sm font-bold leading-4 text-[#0F172A]">
                  {displayName}
                </span>
                <span className="block max-w-[150px] truncate text-[11px] font-semibold leading-4 text-[#64748B]">
                  {displayRole}
                </span>
              </span>
              <svg
                className={`hidden h-4 w-4 text-[#64748B] transition-transform duration-150 sm:block ${showProfile ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border border-[#DDE5EE] bg-white">
                <div className="border-b border-[#E5EAF0] px-4 py-3">
                  <p className="text-sm font-bold text-[#0F172A]">{displayName}</p>
                  <p className="mt-0.5 text-xs text-[#64748B]">{displayRole}</p>
                </div>
                <div className="py-1.5">
                  <ProfileMenuItem
                    href="/admin/perfil"
                    label="Mi perfil"
                    icon={
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    }
                  />
                </div>
                <div className="border-t border-[#E5EAF0] py-1.5">
                  <ProfileMenuItem
                    onClick={logout}
                    label="Cerrar sesion"
                    danger
                    icon={
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                      </svg>
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-0.5 w-full bg-gradient-to-r from-[#2563EB] via-[#00AEEF] to-[#FF6B00]" />
    </header>
  );
}

function NotificationItem({ item }) {
  const styles = {
    danger: "border-[#FECACA] bg-[#FFF5F5] text-[#B42318]",
    warning: "border-[#FED7AA] bg-[#FFF7ED] text-[#B45309]",
    success: "border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]",
    info: "border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8]",
  };

  return (
    <Link
      href={item.href}
      className="mb-2 block rounded-md border border-[#E5EAF0] bg-white p-3 transition-colors hover:bg-[#F8FAFC]"
    >
      <div className="flex items-start gap-2.5">
        <span className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full border ${styles[item.type] || styles.info}`} />
        <span className="min-w-0">
          <span className="block text-sm font-bold text-[#0F172A]">{item.title}</span>
          <span className="mt-1 block text-xs leading-5 text-[#64748B]">{item.text}</span>
        </span>
      </div>
    </Link>
  );
}

function ProfileMenuItem({ label, icon, danger = false, onClick, href }) {
  const className = `flex w-full items-center gap-2.5 px-4 py-2 text-sm transition-colors duration-150 ${
    danger
      ? "text-[#64748B] hover:bg-red-50 hover:text-red-600"
      : "text-[#334155] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
  }`;

  const content = (
    <>
      <span className="shrink-0">{icon}</span>
      <span>{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
}
