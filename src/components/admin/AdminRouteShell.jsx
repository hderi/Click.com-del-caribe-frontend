"use client";
import { getToken, clearSession, setSession } from "@/lib/authStorage";
import { canAccessPath, defaultPathForUser } from "@/lib/roleAccess";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AdminRouteShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const isLogin = pathname === "/admin/login";
  const isProfile = pathname === "/admin/perfil";

  useEffect(() => {
    let ignore = false;

    async function verifySession() {
      if (isLogin) {
        setChecked(true);
        return;
      }

      const token = getToken();
      if (!token) {
        setChecked(false);
        router.replace("/admin/login");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.usuario) {
          clearSession();
          router.replace("/admin/login");
          return;
        }

        setSession(token, data.usuario);

        if (data.usuario.debeCambiarPassword && !isProfile) {
          router.replace("/admin/perfil?cambiar=1");
          return;
        }

        if (!canAccessPath(data.usuario, pathname)) {
          router.replace(defaultPathForUser(data.usuario));
          return;
        }

        if (!ignore) setChecked(true);
      } catch {
        clearSession();
        router.replace("/admin/login");
      }
    }

    verifySession();
    return () => {
      ignore = true;
    };
  }, [isLogin, isProfile, router, pathname]);

  if (isLogin) return <>{children}</>;

  if (!checked) {
    return (
      <div className="min-h-screen bg-[#EEF4F8] flex items-center justify-center text-[#102033] font-semibold">
        Verificando acceso...
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}
