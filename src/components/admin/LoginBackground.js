"use client";

export default function LoginBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#EAF5FB]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/login-bg-clickcom-new.png')" }}
      />
    </div>
  );
}
