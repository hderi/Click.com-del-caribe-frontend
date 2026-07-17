"use client";

export default function FormSection({ title, icon, description, children }) {
  return (
    <div className="overflow-visible rounded-md border border-[#d1d5db] bg-white">
      <div className="flex items-center gap-3 border-b border-[#e5e7eb] px-4 py-3">
        {icon && (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#d1d5db] bg-[#f9fafb] text-[#2563eb]">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold text-[#111827]">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-[#6b7280]">{description}</p>}
        </div>
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}
