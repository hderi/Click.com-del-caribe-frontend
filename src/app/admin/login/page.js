"use client";
import { useRouter } from "next/navigation";

import { setSession } from "@/lib/authStorage";
import { useState } from "react";
import LoginCard from "@/components/admin/LoginCard";
import LoginBackground from "@/components/admin/LoginBackground";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async ({ usuario, password }) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo iniciar sesión");

      setSession(data.token, data.usuario);
      router.push("/admin/dashboard");
    } catch (err) {
      const message = err instanceof TypeError
        ? `No se pudo conectar con el backend en ${API_URL}. Revisa que el servidor esté encendido.`
        : err.message || "Usuario o contraseña incorrectos";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        overflowX: "hidden",
        overflowY: "auto",
        fontFamily: "Inter, Segoe UI, Arial, sans-serif",
      }}
    >
      <LoginBackground />
      <div className="relative z-10 mx-auto w-full max-w-[460px]">
        <LoginCard onSubmit={handleLogin} isLoading={isLoading} error={error} />
      </div>
    </main>
  );
}
