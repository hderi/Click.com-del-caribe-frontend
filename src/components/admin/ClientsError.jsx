"use client";

export default function ClientsError({ message }) {
  if (!message) return null;

  return (
    <div className="rounded-lg border border-[#f0b8a8] bg-[#fff4f1] px-4 py-3 text-sm font-semibold text-[#9a3412]">
      {message}
    </div>
  );
}
