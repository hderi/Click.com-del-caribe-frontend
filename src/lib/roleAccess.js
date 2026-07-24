export const ROLE_ACCESS = {
  admin: [
    "/admin/dashboard",
    "/admin/reparaciones",
    "/admin/clientes",
    "/admin/equipos",
    "/admin/garantias",
    "/admin/alertas",
    "/admin/configuracion",
    "/admin/perfil",
  ],
  gerencia: [
    "/admin/dashboard",
    "/admin/reparaciones",
    "/admin/clientes",
    "/admin/equipos",
    "/admin/garantias",
    "/admin/alertas",
    "/admin/configuracion",
    "/admin/perfil",
  ],
  ventas: [
    "/admin/dashboard",
    "/admin/reparaciones",
    "/admin/clientes",
    "/admin/equipos",
    "/admin/garantias",
    "/admin/perfil",
  ],
  tecnico: [
    "/admin/dashboard",
    "/admin/reparaciones",
    "/admin/equipos",
    "/admin/garantias",
    "/admin/alertas",
    "/admin/perfil",
  ],
};

export function normalizeRole(role) {
  return String(role || "").trim().toLowerCase();
}

export function canAccessPath(user, pathname) {
  const path = String(pathname || "");
  if (!path || path === "/admin/login") return true;

  const role = normalizeRole(user?.rol || user?.role);
  const allowed = ROLE_ACCESS[role] || [];

  return allowed.some((basePath) => path === basePath || path.startsWith(`${basePath}/`));
}

export function filterNavItemsForUser(items, user) {
  return items.filter((item) => canAccessPath(user, item.href));
}
