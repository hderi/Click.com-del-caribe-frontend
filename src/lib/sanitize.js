export function sanitizeText(value, maxLength = 500) {
  return String(value ?? "")
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeMultiline(value, maxLength = 2000) {
  return String(value ?? "")
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function sanitizePhone(value) {
  return String(value ?? "")
    .replace(/[^0-9+()\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 30);
}

export function sanitizeEmail(value) {
  return String(value ?? "")
    .replace(/[<>\s]/g, "")
    .trim()
    .toLowerCase()
    .slice(0, 120);
}
