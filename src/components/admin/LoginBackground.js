"use client";

export default function LoginBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#EAF5FB]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-95"
        style={{ backgroundImage: "url('/login-bg-clickcom-new.png')" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(236,248,255,0.10),rgba(255,255,255,0.16),rgba(255,232,204,0.12))]" />
    </div>
  );
}
