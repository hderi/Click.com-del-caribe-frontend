"use client";

export const TOKEN_KEY = "clickcom_token";
export const USER_KEY = "clickcom_user";

function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function getToken() {
  if (!canUseBrowserStorage()) return "";

  const sessionToken = window.sessionStorage.getItem(TOKEN_KEY);
  const oldToken = window.localStorage.getItem(TOKEN_KEY);

  if (!sessionToken && oldToken) {
    window.sessionStorage.setItem(TOKEN_KEY, oldToken);
    window.localStorage.removeItem(TOKEN_KEY);
  }

  return window.sessionStorage.getItem(TOKEN_KEY) || "";
}

export function getSessionUser() {
  if (!canUseBrowserStorage()) return null;

  const sessionUser = window.sessionStorage.getItem(USER_KEY);
  const oldUser = window.localStorage.getItem(USER_KEY);

  if (!sessionUser && oldUser) {
    window.sessionStorage.setItem(USER_KEY, oldUser);
    window.localStorage.removeItem(USER_KEY);
  }

  try {
    return JSON.parse(window.sessionStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function setSession(token, user) {
  if (!canUseBrowserStorage()) return;

  window.sessionStorage.setItem(TOKEN_KEY, token || "");
  window.sessionStorage.setItem(USER_KEY, JSON.stringify(user || null));

  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function clearSession() {
  if (!canUseBrowserStorage()) return;

  window.sessionStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(USER_KEY);
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function authHeaders(extra = {}) {
  const token = getToken();
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function logoutToLogin() {
  clearSession();
  if (typeof window !== "undefined") {
    window.location.assign("/admin/login");
  }
}
