"use client";
/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   FormSection — Visual grouping card for form fields
   Glass panel with title, icon, and optional description
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export default function FormSection({ title, icon, description, children }) {
  return (
    <div className="rounded-xl border border-[#D5E2EC] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.08)] overflow-hidden">
      {/* Header */}
      <div className="px-5 sm:px-6 py-4 border-b border-[#D5E2EC] flex items-center gap-3">
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold text-[#102033]">{title}</h3>
          {description && (
            <p className="text-[11px] text-[#64748B] mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {/* Content */}
      <div className="px-5 sm:px-6 py-5">
        {children}
      </div>
    </div>
  );
}


