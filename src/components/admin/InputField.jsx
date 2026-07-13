"use client";
/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   InputField — Form input with label, required indicator,
   and error message. Extends the design system input styling.
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export default function InputField({
  id,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  disabled = false,
  icon,
  light = false,
  ...props
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className={`flex items-center gap-1 text-sm font-medium ${light ? "text-[#263548]" : "text-[#334155]"}`}>
          {label}
          {required && <span className="text-brand-orange text-xs">*</span>}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] transition-colors duration-200 group-focus-within:text-brand-blue pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`
            w-full rounded-xl border
            ${error ? "border-error/50 focus:border-error" : "border-[#D5E2EC] focus:border-brand-blue"}
            ${light ? "bg-white text-[#0F172A] placeholder:text-[#7A8797] focus:bg-white hover:bg-white" : "bg-white text-[#102033] placeholder:text-[#7A8AA0] focus:bg-white hover:bg-[#F8FBFD]"}
            transition-all duration-300 ease-out
            focus:shadow-[var(--shadow-input-focus)]
            hover:border-[#BFD0DF]
            disabled:opacity-50 disabled:cursor-not-allowed
            text-sm leading-5 outline-none
            ${icon ? "pl-11" : "pl-4"} pr-4 py-3
          `}
          {...props}
        />
        <div className={`absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none ring-1 ${error ? "ring-error/20" : "ring-brand-blue/20"}`} />
      </div>
      {error && (
        <p className="text-[11px] text-error font-medium flex items-center gap-1">
          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}




