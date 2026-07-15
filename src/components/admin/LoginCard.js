"use client";

import { useState } from "react";

export default function LoginCard({ onSubmit, isLoading = false, error = "" }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function submit(event) {
    event.preventDefault();
    onSubmit({ usuario: usuario.trim(), password });
  }

  return (
    <section
      className="relative mx-auto w-full max-w-[520px] rounded-[28px] border border-[#C9D8E6] bg-white px-6 py-6 shadow-[0_22px_70px_rgba(30,64,95,0.14)] sm:px-10"
      style={{ maxHeight: "calc(100dvh - 32px)", overflowY: "auto", overflowX: "hidden" }}
    >
      <div className="absolute left-0 right-0 top-0 h-[3px] bg-[#0B79D0]" />
      <div className="absolute -right-14 -top-14 h-32 w-32 rounded-full bg-[#E4F5FC]" />
      <div className="absolute -bottom-16 -left-14 h-32 w-32 rounded-full bg-[#FFF0DC]" />

      <div className="relative text-center">
        <div className="mx-auto flex h-20 w-32 items-center justify-center rounded-2xl border border-[#D4E7F3] bg-white">
          <img src="/logo-clickcom.png.jpeg" alt="CLICK.COM del Caribe" className="max-h-16 max-w-28 object-contain" />
        </div>
        <p className="mt-4 text-sm font-bold uppercase tracking-[0.22em] text-[#0B79D0]">Acceso interno</p>
        <h1 className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#102033]">Panel administrativo</h1>
      </div>

      <form
        onSubmit={submit}
        className="relative mt-6 space-y-4"
        style={{ display: "block", border: 0, minHeight: 0, padding: 0 }}
      >
        <Field
          label="Usuario"
          value={usuario}
          onChange={(event) => setUsuario(event.target.value)}
          placeholder="Ej. admin"
          icon="user"
          autoComplete="username"
        />

        <div>
          <label className="mb-2 block text-sm font-bold text-[#334155]">Contraseña</label>
          <div className="flex items-center rounded-xl border border-[#C8DCEC] bg-[#F8FBFD] px-4 focus-within:border-[#0B79D0] focus-within:ring-3 focus-within:ring-[#0B79D0]/15">
            <Icon type="lock" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Tu contraseña"
              autoComplete="current-password"
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base font-semibold text-[#102033] outline-none placeholder:text-[#9AA8BA]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="rounded-lg border border-[#BCD3E5] bg-white px-3 py-2 text-sm font-bold text-[#0B79D0] hover:bg-[#EFF7FC]"
            >
              {showPassword ? "Ocultar" : "Ver"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-xl bg-[#0B79D0] px-6 py-3.5 text-lg font-black text-white transition hover:bg-[#075FA7] disabled:cursor-not-allowed disabled:opacity-70"
          style={{
            display: "flex",
            width: "100%",
            minHeight: 54,
            alignItems: "center",
            justifyContent: "center",
            border: 0,
            borderRadius: 12,
            background: isLoading ? "#6AA9DA" : "#0B79D0",
            color: "#FFFFFF",
            fontSize: 18,
            fontWeight: 900,
            cursor: isLoading ? "not-allowed" : "pointer",
            position: "relative",
            zIndex: 20,
          }}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>

        {error ? (
          <div className="rounded-xl border border-[#FFC0C0] bg-[#FFF0F0] px-4 py-3 text-sm font-bold text-[#B91C1C]">
            {error}
          </div>
        ) : null}
      </form>

      <div className="relative mt-5 text-center">
        <p className="text-sm font-semibold text-[#6B7A90]">Acceso restringido. Solo personal autorizado.</p>
        <p className="mt-2 text-sm font-bold text-[#8CA0B5]">
          CLICK.COM del Caribe - Servicio especializado en informática
        </p>
      </div>
    </section>
  );
}

function Field({ label, icon, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-[#334155]">{label}</label>
      <div className="flex items-center rounded-xl border border-[#C8DCEC] bg-[#F8FBFD] px-4 focus-within:border-[#0B79D0] focus-within:ring-3 focus-within:ring-[#0B79D0]/15">
        <Icon type={icon} />
        <input
          {...props}
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base font-semibold text-[#102033] outline-none placeholder:text-[#9AA8BA]"
          required
        />
      </div>
    </div>
  );
}

function Icon({ type }) {
  const path =
    type === "lock"
      ? "M16.5 10.5V7.5a4.5 4.5 0 10-9 0v3m-.75 0h10.5A1.75 1.75 0 0118 12.25v6A1.75 1.75 0 0116.25 20H7.75A1.75 1.75 0 016 18.25v-6a1.75 1.75 0 011.75-1.75z"
      : "M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0";
  return (
    <svg className="h-5 w-5 shrink-0 text-[#7FA5BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}
