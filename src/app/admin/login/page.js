"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginCard from "@/components/admin/LoginCard";
import LoginBackground from "@/components/admin/LoginBackground";
import { setSession } from "@/lib/authStorage";
import { defaultPathForUser } from "@/lib/roleAccess";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin({ usuario, password }) {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "No se pudo iniciar sesión.");
      }

      setSession(data.token, data.usuario);

      if (data.usuario?.debeCambiarPassword) {
        router.replace("/admin/perfil");
        return;
      }

      router.replace(defaultPathForUser(data.usuario));
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main
      className="relative isolate flex min-h-screen w-full items-center justify-center overflow-x-hidden px-4 py-[clamp(28px,7vh,72px)] font-[Inter] sm:px-6 lg:px-8"
      style={{ fontFamily: "Inter, Segoe UI, Arial, sans-serif" }}
    >
      <LoginBackground />

      <div className="relative z-10 flex w-full justify-center">
        <LoginCard onSubmit={handleLogin} isLoading={isLoading} error={error} />
      </div>
    </main>
  );
}
