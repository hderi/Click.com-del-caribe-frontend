"use client";
import { getToken, getSessionUser } from "@/lib/authStorage";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const ROLES = [
  { value: "admin", label: "Administrador", limit: 2, note: "Control total del sistema." },
  { value: "ventas", label: "Ventas / recepción", limit: 2, note: "Registra clientes, equipos, pagos y entregas." },
  { value: "tecnico", label: "Técnico", limit: 3, note: "Actualiza avances, diagnósticos, fotos y estados." },
];

function authHeaders() {
  const token = typeof window !== "undefined" ? getToken() : "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token || ""}`,
  };
}

function normalizeRole(role) {
  if (role === "gerencia") return "admin";
  return role || "ventas";
}

function roleLabel(role) {
  return ROLES.find((item) => item.value === normalizeRole(role))?.label || role;
}

async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "No se pudo completar la acción.");
  return data;
}

export default function ConfiguracionPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nombre: "",
    usuario: "",
    rol: "ventas",
    password: "",
  });

  const actualUser = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      return getSessionUser();
    } catch {
      return null;
    }
  }, []);

  const conteo = useMemo(() => {
    return usuarios.reduce((acc, user) => {
      const role = normalizeRole(user.rol);
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});
  }, [usuarios]);

  async function cargarUsuarios() {
    setLoading(true);
    setError("");
    try {
      const data = await api("/api/usuarios");
      setUsuarios(Array.isArray(data?.usuarios) ? data.usuarios : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarUsuarios();
  }, []);

  function pedirPassword(accion) {
    const value = window.prompt(`Confirma tu contraseña de administrador para ${accion}:`);
    if (!value) {
      setError("Acción cancelada. Se requiere contraseña de administrador.");
      return null;
    }
    return value;
  }

  async function crearUsuario(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const roleInfo = ROLES.find((item) => item.value === form.rol);
    if (roleInfo && (conteo[form.rol] || 0) >= roleInfo.limit) {
      setError(`Límite alcanzado: solo se permiten ${roleInfo.limit} usuarios para ${roleInfo.label}.`);
      return;
    }

    const adminPassword = pedirPassword("crear este usuario");
    if (!adminPassword) return;

    try {
      await api("/api/usuarios", {
        method: "POST",
        body: JSON.stringify({ ...form, adminPassword }),
      });
      setForm({ nombre: "", usuario: "", rol: "ventas", password: "" });
      setSuccess("Usuario creado correctamente.");
      await cargarUsuarios();
    } catch (err) {
      setError(err.message);
    }
  }

  async function cambiarEstado(user) {
    setError("");
    setSuccess("");
    if (actualUser?.id === user.id) {
      setError("No puedes bloquear tu propio usuario.");
      return;
    }
    const accion = user.activo ? "bloquear este usuario" : "activar este usuario";
    const adminPassword = pedirPassword(accion);
    if (!adminPassword) return;
    try {
      await api(`/api/usuarios/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({ activo: !user.activo, adminPassword }),
      });
      setSuccess(user.activo ? "Usuario bloqueado." : "Usuario activado.");
      await cargarUsuarios();
    } catch (err) {
      setError(err.message);
    }
  }

  async function eliminarUsuario(user) {
    setError("");
    setSuccess("");
    if (actualUser?.id === user.id) {
      setError("No puedes eliminar tu propio usuario.");
      return;
    }
    if (!window.confirm(`¿Eliminar definitivamente a ${user.nombre || user.usuario}?`)) return;
    const adminPassword = pedirPassword("eliminar este usuario");
    if (!adminPassword) return;
    try {
      await api(`/api/usuarios/${user.id}`, {
        method: "DELETE",
        body: JSON.stringify({ adminPassword }),
      });
      setSuccess("Usuario eliminado.");
      await cargarUsuarios();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[22px] border border-[#b9d0df] bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#c65f11]">Control interno</p>
        <h1 className="mt-2 text-3xl font-bold text-[#08172a]">Configuración</h1>
        <p className="mt-2 max-w-3xl text-[#33465f]">
          Administración de usuarios, permisos y preparación de contenido público. Solo administradores pueden realizar cambios.
        </p>
      </section>

      {error && <div className="rounded-2xl border border-red-300 bg-red-50 px-5 py-4 font-semibold text-red-700">{error}</div>}
      {success && <div className="rounded-2xl border border-green-300 bg-green-50 px-5 py-4 font-semibold text-green-700">{success}</div>}

      <section className="grid gap-4 md:grid-cols-3">
        {ROLES.map((role) => (
          <div key={role.value} className="rounded-[18px] border border-[#bfd4e3] bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#56677d]">Límite {conteo[role.value] || 0} / {role.limit}</p>
            <h2 className="mt-2 text-xl font-bold text-[#08172a]">{role.label}</h2>
            <p className="mt-2 text-sm leading-6 text-[#40546d]">{role.note}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[22px] border border-[#b9d0df] bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-[#08172a]">Usuarios del sistema</h2>
          <p className="mt-1 text-sm text-red-700">
            Para crear, bloquear, activar o eliminar usuarios se solicitará la contraseña del administrador.
          </p>
        </div>

        <form onSubmit={crearUsuario} className="grid gap-3 rounded-2xl border border-[#d5e3ed] bg-[#f7fbfd] p-4 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
          <label className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#56677d]">Nombre</span>
            <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full rounded-xl border border-[#bfd4e3] bg-white px-4 py-3 text-[#08172a]" required />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#56677d]">Usuario</span>
            <input value={form.usuario} onChange={(e) => setForm({ ...form, usuario: e.target.value })} className="w-full rounded-xl border border-[#bfd4e3] bg-white px-4 py-3 text-[#08172a]" required />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#56677d]">Rol</span>
            <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })} className="w-full rounded-xl border border-[#bfd4e3] bg-white px-4 py-3 text-[#08172a]">
              {ROLES.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#56677d]">Contraseña temporal</span>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-[#bfd4e3] bg-white px-4 py-3 text-[#08172a]" required />
          </label>
          <button className="self-end rounded-xl bg-[#e86f00] px-6 py-3 font-bold text-white shadow-sm hover:bg-[#c85f00]">
            Crear usuario
          </button>
        </form>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-[#d5e3ed]">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-[#edf5fa] text-xs uppercase tracking-[0.18em] text-[#56677d]">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="px-4 py-6 text-[#40546d]" colSpan={5}>Cargando usuarios...</td></tr>
              ) : usuarios.length === 0 ? (
                <tr><td className="px-4 py-6 text-[#40546d]" colSpan={5}>No hay usuarios registrados.</td></tr>
              ) : usuarios.map((user) => (
                <tr key={user.id} className="border-t border-[#d5e3ed]">
                  <td className="px-4 py-4 font-bold text-[#08172a]">{user.nombre}</td>
                  <td className="px-4 py-4 text-[#263a54]">{user.usuario}</td>
                  <td className="px-4 py-4 text-[#263a54]">{roleLabel(user.rol)}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${user.activo ? "bg-green-50 text-green-700 ring-1 ring-green-200" : "bg-slate-100 text-slate-600 ring-1 ring-slate-300"}`}>
                      {user.activo ? "Activo" : "Bloqueado"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => cambiarEstado(user)} className="rounded-xl border border-[#bfd4e3] px-4 py-2 font-bold text-[#0b6fa4] hover:bg-[#edf8ff]">
                        {user.activo ? "Bloquear" : "Activar"}
                      </button>
                      <button type="button" onClick={() => eliminarUsuario(user)} className="rounded-xl border border-red-200 px-4 py-2 font-bold text-red-700 hover:bg-red-50">
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Link href="/admin/configuracion/opciones" className="group rounded-[18px] border border-[#bfd4e3] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#334155] hover:shadow-lg">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0b75a5]">Catálogos</p>
          <h3 className="mt-3 text-lg font-bold text-[#08172a]">Opciones de reparación</h3>
          <p className="mt-2 text-sm leading-6 text-[#40546d]">Edita marcas, tipos de equipo, accesorios, condiciones, métodos de pago y opciones usadas en la recepción.</p>
          <span className="mt-4 inline-flex rounded-xl bg-[#eef2f7] px-4 py-2 text-sm font-bold text-[#334155] group-hover:bg-[#e2e8f0]">Editar opciones</span>
        </Link>
        <Link href="/admin/configuracion/publica" className="group rounded-[18px] border border-[#bfd4e3] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#0aa7df] hover:shadow-lg">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0b75a5]">Contenido</p>
          <h3 className="mt-3 text-lg font-bold text-[#08172a]">Página de clientes</h3>
          <p className="mt-2 text-sm leading-6 text-[#40546d]">Edita inicio, textos institucionales, misión, visión, valores, reseñas y secciones visibles.</p>
          <span className="mt-4 inline-flex rounded-xl bg-[#eaf7ff] px-4 py-2 text-sm font-bold text-[#0077b6] group-hover:bg-[#d8f1ff]">Abrir editor</span>
        </Link>
        <Link href="/admin/configuracion/promociones" className="group rounded-[18px] border border-[#bfd4e3] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#ff7a00] hover:shadow-lg">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0b75a5]">Imágenes</p>
          <h3 className="mt-3 text-lg font-bold text-[#08172a]">Promociones</h3>
          <p className="mt-2 text-sm leading-6 text-[#40546d]">Alta, baja, precios, orden e imágenes de promociones para la página pública.</p>
          <span className="mt-4 inline-flex rounded-xl bg-[#fff1e4] px-4 py-2 text-sm font-bold text-[#c35b00] group-hover:bg-[#ffe3c7]">Administrar</span>
        </Link>
        <Link href="/admin/configuracion/empresa" className="group rounded-[18px] border border-[#bfd4e3] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#2f8f5b] hover:shadow-lg">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0b75a5]">Empresa</p>
          <h3 className="mt-3 text-lg font-bold text-[#08172a]">Políticas y contacto</h3>
          <p className="mt-2 text-sm leading-6 text-[#40546d]">Edita dirección, teléfono, correo, horarios, políticas de servicio y mapa.</p>
          <span className="mt-4 inline-flex rounded-xl bg-[#eef9f2] px-4 py-2 text-sm font-bold text-[#247747] group-hover:bg-[#ddf3e6]">Editar datos</span>
        </Link>
      </section>
    </div>
  );
}
