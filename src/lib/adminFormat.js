"use client";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function todayLocalInput() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function timeLocalInput() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export function formatDateOnly(value, fallback = "Sin fecha") {
  if (!value) return fallback;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-");
    return `${d}/${m}/${y}`;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Cancun",
  }).format(date);
}

export function formatDateTime(value, fallback = "Sin fecha") {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Cancun",
  }).format(date);
}

export function formatTime(value, fallback = "Sin hora") {
  if (!value) return fallback;
  if (typeof value === "string" && /^\d{2}:\d{2}/.test(value)) {
    const [h, m] = value.split(":");
    const date = new Date();
    date.setHours(Number(h), Number(m), 0, 0);
    return new Intl.DateTimeFormat("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Cancun",
    }).format(date);
  }
  return formatDateTime(value, fallback);
}

export function resolveAssetUrl(src) {
  if (!src) return "";
  if (typeof src !== "string") return "";
  if (src.startsWith("data:") || src.startsWith("blob:") || /^https?:\/\//.test(src)) return src;
  if (src.startsWith("/uploads/")) return `${API_URL}${src}`;
  return src;
}

export function normalizePhoto(photo) {
  if (!photo) return null;
  if (typeof photo === "string") return { url: resolveAssetUrl(photo), name: "Evidencia" };
  const raw = photo.url || photo.preview || photo.dataUrl || photo.src || "";
  return {
    ...photo,
    url: resolveAssetUrl(raw),
    preview: resolveAssetUrl(photo.preview || raw),
    dataUrl: photo.dataUrl || "",
  };
}

export function dedupePhotos(photos = []) {
  const seen = new Set();
  const clean = [];
  for (const item of photos) {
    const photo = normalizePhoto(item);
    if (!photo) continue;
    const key = photo.url || photo.dataUrl || [photo.name, photo.size, photo.lastModified].filter(Boolean).join("-");
    if (!key || seen.has(key)) continue;
    seen.add(key);
    clean.push(photo);
  }
  return clean;
}
