"use client";
import { getToken } from "@/lib/authStorage";
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function authHeaders(extra = {}) {
  const token = getToken();
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: authHeaders(options.headers || {}),
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: text };
  }
  if (!res.ok) {
    throw new Error(data?.error || data?.message || "Error de conexión");
  }
  return data;
}

export function formatDate(value) {
  if (!value) return "Sin definir";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Cancun",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function formatTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Cancun",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatMoney(value) {
  const amount = Number(value || 0);
  return amount.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

