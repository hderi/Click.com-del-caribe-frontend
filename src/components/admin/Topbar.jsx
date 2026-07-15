"use client";

import { clearSession, logoutToLogin } from "@/lib/authStorage";
import { useEffect, useRef, useState } from "react";
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
  const displayRole = currentUser?.rol || "admin";
  const initial = displayName.charAt(0).toUpperCase();
  const logout = () => {
    clearSession();
    logoutToLogin();
  };

  return (
    <header
      id="admin-topbar"
      className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-[#d1d5db] bg-white px-4 sm:px-5 lg:px-6"
    >
      <div className="flex items-center gap-3">
        <button
          id="topbar-menu-btn"
          onClick={onMenuToggle}
          className="rounded-md p-2 text-[#6b7280] transition-colors duration-150 hover:bg-[#f3f4f6] hover:text-[#111827] lg:hidden"
          aria-label="Abrir menú"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <div className="hidden sm:block">
          <p className="text-xs leading-none text-[#6b7280]">Bienvenido de vuelta,</p>
          <p className="mt-0.5 text-sm font-semibold leading-none text-[#111827]">{displayName}</p>
        </div>
        <p className="text-sm font-semibold text-[#111827] sm:hidden">Hola, {displayName}</p>
      </div>

      <div className="flex items-center gap-2">
        <div ref={notifRef} className="relative">
          <button
            id="topbar-notifications-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative rounded-md p-2 text-[#6b7280] transition-colors duration-150 hover:bg-[#f3f4f6] hover:text-[#111827]"
            aria-label="Notificaciones"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#2563eb]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md border border-[#d1d5db] bg-white">
              <div className="border-b border-[#e5e7eb] px-4 py-3">
                <h3 className="text-sm font-semibold text-[#111827]">Notificaciones</h3>
              </div>
              <div className="max-h-80 overflow-y-auto p-4">
                <p className="text-sm font-semibold text-[#374151]">Sin notificaciones por ahora.</p>
                <p className="mt-1 text-xs leading-5 text-[#6b7280]">
                  Aquí aparecerán mensajes reales cuando conectemos WhatsApp, correo o alertas del backend.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mx-1 hidden h-6 w-px bg-[#e5e7eb] sm:block" />

        <div ref={profileRef} className="relative">
          <button
            id="topbar-profile-btn"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 rounded-md p-1.5 pr-3 transition-colors duration-150 hover:bg-[#f3f4f6]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#2563eb] text-xs font-bold text-white">
              {initial}
            </div>
            <span className="hidden text-sm font-medium text-[#374151] sm:block">{displayName}</span>
            <svg
              className={`hidden h-4 w-4 text-[#6b7280] transition-transform duration-150 sm:block ${showProfile ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border border-[#d1d5db] bg-white">
              <div className="border-b border-[#e5e7eb] px-4 py-3">
                <p className="text-sm font-semibold text-[#111827]">{displayName}</p>
                <p className="mt-0.5 text-xs text-[#6b7280]">{displayRole}</p>
              </div>
              <div className="py-1.5">
                <ProfileMenuItem
                  href="/admin/perfil"
                  label="Mi perfil"
                  icon={
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  }
                />
              </div>
              <div className="border-t border-[#e5e7eb] py-1.5">
                <ProfileMenuItem
                  onClick={logout}
                  label="Cerrar sesión"
                  danger
                  icon={
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
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

function ProfileMenuItem({ label, icon, danger = false, onClick, href }) {
  const className = `flex w-full items-center gap-2.5 px-4 py-2 text-sm transition-colors duration-150 ${
    danger
      ? "text-[#6b7280] hover:bg-red-50 hover:text-red-600"
      : "text-[#374151] hover:bg-[#f3f4f6] hover:text-[#111827]"
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
