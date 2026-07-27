"use client";

import { getToken, getSessionUser } from "@/lib/authStorage";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function PerfilPage() {
  const searchParams = useSearchParams();
  const cambioObligatorio = searchParams.get("cambiar") === "1";
  const [usuario, setUsuario] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [form, setForm] = useState({ nombre: "", usuario: "", passwordActual: "", passwordNueva: "" });
  const token = useMemo(() => (typeof window !== "undefined" ? getToken() : ""), []);

  useEffect(() => {
    try {
      const stored = getSessionUser();
      const user = stored || { nombre: "Administrador", usuario: "admin", rol: "admin" };
      setUsuario(user);
      setForm((prev) => ({ ...prev, nombre: user.nombre || "", usuario: user.usuario || "" }));
    } catch {
      setUsuario({ nombre: "Administrador", usuario: "admin", rol: "admin" });
    }
  }, []);

  async function guardarPerfil(event) {
    event.preventDefault();
    setMensaje("");

    if (cambioObligatorio && !form.passwordNueva.trim()) {
      setMensaje("Para salir de Perfil primero debes crear tu nueva contraseña.");
      return;
    }

    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    if (!response.ok) {
      setMensaje(data.error || "No se pudo actualizar el perfil.");
      return;
    }

    localStorage.setItem("clickcom_user", JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    setForm((prev) => ({ ...prev, passwordActual: "", passwordNueva: "" }));
    setMensaje("Perfil actualizado correctamente.");
    if (cambioObligatorio || data.usuario?.debeCambiarPassword === false) {
      window.location.href = "/admin/dashboard";
    }
  }

  return (
    <div className="space-y-5 font-[Inter]">
      <section className="rounded-md border border-[#dde5ee] bg-white px-6 py-5">
        <h1 className="text-2xl font-bold text-[#0f172a]">Mi perfil</h1>
      </section>

      {mensaje && (
        <div className="rounded-md border border-[#bfd0df] bg-white px-4 py-3 text-sm font-semibold text-[#102033]">
          {mensaje}
        </div>
      )}

      <form onSubmit={guardarPerfil} className="rounded-md border border-[#dde5ee] bg-white">
        <div className="border-b border-[#dde5ee] px-6 py-4">
          <h2 className="text-lg font-bold text-[#0f172a]">Datos de acceso</h2>
        </div>

        <div className="grid gap-4 px-6 py-5 md:grid-cols-2">
          <Field label="Nombre preferente" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} />
          <Field label="Nombre de usuario" value={form.usuario} onChange={(v) => setForm({ ...form, usuario: v })} />
          <Field label="Contraseña actual" type="password" value={form.passwordActual} onChange={(v) => setForm({ ...form, passwordActual: v })} />
          <Field label="Nueva contraseña" type="password" value={form.passwordNueva} onChange={(v) => setForm({ ...form, passwordNueva: v })} />
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-[#dde5ee] px-6 py-4">
          <button className="rounded-md bg-[#0055ff] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0047d6]">
            Guardar mi perfil
          </button>
          <span className="text-sm font-medium text-[#526174]">Rol actual: {usuario?.rol || "usuario"}</span>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const hasPasswordValue = isPassword && String(value || "").length > 0;

  function handleChange(nextValue) {
    if (isPassword && !nextValue) {
      setVisible(false);
    }
    onChange(nextValue);
  }

  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#526174]">{label}</label>
      <div className="relative mt-1">
        <input
          type={isPassword && visible ? "text" : type}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className={`w-full rounded-md border border-[#d1d9e2] bg-white px-3 py-3 text-sm font-semibold text-[#102033] outline-none transition focus:border-[#0055ff] ${hasPasswordValue ? "pr-24" : ""}`}
        />
        {hasPasswordValue && (
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-[#d1d9e2] bg-white px-3 py-1.5 text-xs font-bold text-[#0055ff] transition hover:bg-[#f4f7fb]"
          >
            {visible ? "Ocultar" : "Ver"}
          </button>
        )}
      </div>
    </div>
  );
}
