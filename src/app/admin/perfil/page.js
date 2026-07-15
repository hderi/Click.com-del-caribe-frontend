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
    <div className="space-y-5">
      <section className="rounded-[26px] border border-[#C9D8E5] bg-white p-6 shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#FF7A00]">Cuenta</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.03em] text-[#102033]">Mi perfil</h1>
        <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-[#526174]">
          Aquí cada usuario actualiza su nombre, usuario y contraseña. La creación o bloqueo de usuarios queda en Configuración.
        </p>
      </section>

      {mensaje && (
        <div className="rounded-2xl border border-[#BFD0DF] bg-white p-4 text-sm font-bold text-[#102033]">
          {mensaje}
        </div>
      )}

      <form onSubmit={guardarPerfil} className="rounded-[24px] border border-[#C9D8E5] bg-white p-6 shadow-[0_12px_28px_rgba(15,23,42,0.07)]">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-black text-[#102033]">Datos de acceso</h2>
          <p className="text-sm font-semibold text-[#526174]">No se muestran contraseñas guardadas. Solo se permite cambiarla.</p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Nombre preferente" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} />
          <Field label="Nombre de usuario" value={form.usuario} onChange={(v) => setForm({ ...form, usuario: v })} />
          <Field label="Contraseña actual" type="password" value={form.passwordActual} onChange={(v) => setForm({ ...form, passwordActual: v })} />
          <Field label="Nueva contraseña" type="password" value={form.passwordNueva} onChange={(v) => setForm({ ...form, passwordNueva: v })} />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button className="rounded-xl bg-[#00A8E8] px-5 py-3 text-sm font-black text-white shadow-[0_10px_22px_rgba(0,168,232,0.22)] hover:bg-[#008FC7]">
            Guardar mi perfil
          </button>
          <span className="text-sm font-semibold text-[#526174]">Rol actual: {usuario?.rol || "usuario"}</span>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-xs font-black uppercase tracking-[0.12em] text-[#526174]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-[#C8D6E3] bg-white px-3 py-3 text-sm font-bold text-[#102033] outline-none focus:border-[#00A8E8] focus:ring-4 focus:ring-[#DDF3FB]"
      />
    </div>
  );
}