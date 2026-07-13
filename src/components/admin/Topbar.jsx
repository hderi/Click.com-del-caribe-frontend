"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
export default function Topbar({ onMenuToggle }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  useEffect(() => {
    try {
      const stored = localStorage.getItem("clickcom_user");
      if (stored) setCurrentUser(JSON.parse(stored));
    } catch {}
  }, []);

  const displayName = currentUser?.nombre || currentUser?.usuario || "Usuario";
  const displayRole = currentUser?.rol || "admin";
  const initial = displayName.charAt(0).toUpperCase();
  const logout = () => {
    localStorage.removeItem("clickcom_token");
    localStorage.removeItem("clickcom_user");
    window.location.href = "/admin/login";
  };

  /* -- Close dropdowns on outside click -- */
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <header
      id="admin-topbar"
      className="sticky top-0 z-30 h-[72px] border-b border-[#C8D6E3] bg-[#EEF5FA]/94 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 shadow-[0_8px_26px_rgba(15,23,42,0.08)]"
    >
      {/* -- Left: Hamburger + Welcome -- */}
      <div className="flex items-center gap-4">
        {/* Hamburger Ãƒ¢Ã¢â€š¬Ã¢â‚¬ mobile only */}
        <button
          id="topbar-menu-btn"
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-[#7A8AA0] hover:text-[#172234] hover:bg-[#EEF6FC] transition-all duration-200"
          aria-label="Abrir menú"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        {/* Welcome message */}
        <div className="hidden sm:block">
          <p className="text-sm text-[#526174] leading-none">
            Bienvenido de vuelta,
          </p>
          <p className="text-base font-semibold text-[#172234] mt-0.5 leading-none">
            {displayName}
          </p>
        </div>
        {/* Mobile: compact greeting */}
        <p className="sm:hidden text-sm font-semibold text-[#172234]">
          Hola, {displayName}
        </p>
      </div>
      {/* -- Right: Actions -- */}
      <div className="flex items-center gap-2">
        {/* -- Notifications -- */}
        <div ref={notifRef} className="relative">
          <button
            id="topbar-notifications-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative p-2.5 rounded-xl text-[#7A8AA0] hover:text-[#172234] hover:bg-[#EEF6FC] transition-all duration-200"
            aria-label="Notificaciones"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            {/* Notification badge */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-orange shadow-[0_0_6px_rgba(255,107,44,0.5)]" />
          </button>
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-[#D5E2EC] bg-white shadow-[0_16px_38px_rgba(15,23,42,0.12)] animate-fade-in origin-top-right">
              <div className="px-4 py-3 border-b border-[#DDE7F0]">
                <h3 className="text-sm font-semibold text-[#172234]">Notificaciones</h3>
              </div>
              <div className="p-4 max-h-80 overflow-y-auto">
                <p className="text-sm font-semibold text-[#526174]">Sin notificaciones por ahora.</p>
                <p className="mt-1 text-xs leading-5 text-[#7A8AA0]">Aquí aparecerán mensajes reales cuando conectemos WhatsApp, correo o alertas del backend.</p>
              </div>
            </div>
          )}
        </div>
        {/* -- Separator -- */}
        <div className="hidden sm:block w-px h-6 bg-[#DDE7F0] mx-1" />
        {/* -- Profile -- */}
        <div ref={profileRef} className="relative">
          <button
            id="topbar-profile-btn"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-[#EEF6FC] transition-all duration-200"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-brand-blue-dark flex items-center justify-center text-white text-xs font-bold shadow-[0_2px_8px_rgba(0,102,255,0.25)]">
              E
            </div>
            {/* Name - hidden on small screens */}
            <span className="hidden sm:block text-sm font-medium text-[#526174]">
              {displayName}
            </span>
            {/* Chevron */}
            <svg
              className={`hidden sm:block w-4 h-4 text-[#7A8AA0] transition-transform duration-200 ${showProfile ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#D5E2EC] bg-white shadow-[0_16px_38px_rgba(15,23,42,0.12)] animate-fade-in origin-top-right">
              <div className="px-4 py-3 border-b border-[#DDE7F0]">
                <p className="text-sm font-semibold text-[#172234]">{displayName}</p>
                <p className="text-xs text-[#7A8AA0] mt-0.5">{displayRole}</p>
              </div>
              <div className="py-1.5">
                <ProfileMenuItem
                  href="/admin/perfil"
                  label="Mi perfil"
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  }
                />
                </div>
              <div className="py-1.5 border-t border-[#DDE7F0]">
                <ProfileMenuItem
                  onClick={logout}
                  label="Cerrar sesión"
                  danger
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
/* -- Sub-components -- */
function NotificationItem({ title, description, time, type }) {
  const colors = {
    info: "bg-brand-blue",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error",
  };
  return (
    <div className="group flex items-start gap-3 p-2.5 rounded-lg hover:bg-[#EEF6FC]/50 transition-colors duration-200 cursor-pointer">
      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${colors[type] || colors.info}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#172234] truncate">{title}</p>
        <p className="text-xs text-[#7A8AA0] mt-0.5 truncate">{description}</p>
      </div>
      <span className="text-[10px] text-[#7A8AA0] whitespace-nowrap shrink-0 mt-0.5">{time}</span>
    </div>
  );
}
function ProfileMenuItem({ label, icon, danger = false, onClick, href }) {
  const className = `w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors duration-200 ${danger
    ? "text-[#526174] hover:bg-red-500/10 hover:text-red-500"
    : "text-[#526174] hover:bg-[#EEF6FC]/70 hover:text-[#172234]"
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
