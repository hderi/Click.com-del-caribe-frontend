"use client";

import { useState } from "react";

const interStack = "var(--font-inter), Inter, Segoe UI, Arial, sans-serif";

export default function LoginCard({ onSubmit, isLoading = false, error = "" }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const camposCompletos = usuario.trim() !== "" && password !== "";

  function submit(event) {
    event.preventDefault();
    onSubmit({ usuario: usuario.trim(), password });
  }

  function handlePasswordChange(event) {
    const value = event.target.value;
    setPassword(value);
    if (!value) setShowPassword(false);
  }

  return (
    <section
      className="w-full max-w-[min(420px,calc(100vw-32px))] rounded-xl border border-white/45 bg-white/[0.08] px-[clamp(20px,4vw,32px)] py-[clamp(22px,4vh,34px)] text-[#102033]"
      style={{ fontFamily: interStack }}
    >
      <div className="flex w-full justify-center">
        <img
          src="/logo-clickcom.png.png"
          alt="CLICK.COM del Caribe"
          className="h-auto w-[clamp(150px,42vw,235px)] object-contain"
        />
      </div>

      <div className="mt-[clamp(20px,4vh,30px)] text-center">
        <p className="text-[clamp(10px,2vw,12px)] font-bold uppercase tracking-[0.2em] text-[#0B79D0]">
          Acceso interno
        </p>

        <h1 className="mt-2 text-[clamp(23px,5vw,31px)] font-bold leading-tight text-[#102033]">
          Panel administrativo
        </h1>
      </div>

      <form onSubmit={submit} className="mt-[clamp(22px,4vh,30px)] space-y-4">
        <Field
          label="Usuario"
          value={usuario}
          onChange={(event) => setUsuario(event.target.value)}
          icon="user"
          autoComplete="username"
        />

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#334155]">
            Contraseña
          </label>

          <div className="flex h-12 items-center rounded-md border border-white/65 bg-white/30 px-3 transition focus-within:border-[#0B79D0] focus-within:bg-white/45 focus-within:ring-2 focus-within:ring-[#0B79D0]/15">
            <Icon type="lock" />

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              autoComplete="current-password"
              className="min-w-0 flex-1 bg-transparent px-3 text-sm font-medium text-[#102033] outline-none placeholder:text-[#7A8AA0]"
              required
            />

            {password ? (
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="rounded border border-white/60 bg-white/35 px-2.5 py-1.5 text-xs font-semibold text-[#0B79D0] transition hover:bg-white/50"
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            ) : null}
          </div>
        </div>

        {error ? (
          <div className="rounded-md border border-[#fecaca] bg-[#fef2f2]/80 px-3 py-2 text-xs font-semibold text-[#b91c1c]">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isLoading}
          className={`h-12 w-full rounded-md px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-70 ${
            camposCompletos
              ? "bg-[#0B79D0] text-white hover:bg-[#0969B4]"
              : "bg-white/25 text-[#5f7890]"
          }`}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs font-medium leading-5 text-[#5b6f86]">
          Acceso restringido. Solo personal autorizado.
        </p>
        <p className="mt-1 text-xs font-bold text-[#71869d]">
          CLICK.COM del Caribe
        </p>
      </div>
    </section>
  );
}

function Field({ label, icon, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#334155]">
        {label}
      </label>

      <div className="flex h-12 items-center rounded-md border border-white/65 bg-white/30 px-3 transition focus-within:border-[#0B79D0] focus-within:bg-white/45 focus-within:ring-2 focus-within:ring-[#0B79D0]/15">
        <Icon type={icon} />

        <input
          {...props}
          className="min-w-0 flex-1 bg-transparent px-3 text-sm font-medium text-[#102033] outline-none placeholder:text-[#7A8AA0]"
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
    <svg
      className="h-5 w-5 shrink-0 text-[#64748b]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}
