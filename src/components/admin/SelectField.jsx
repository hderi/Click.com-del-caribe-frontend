"use client";

export default function SelectField({
  id,
  label,
  value,
  onChange,
  options = [],
  placeholder = "Seleccionar...",
  required = false,
  error,
  disabled = false,
}) {
  const normalizedOptions = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="flex items-center gap-1 text-sm font-extrabold text-[#253244]">
          {label}
          {required && <span className="text-[#B45309] text-xs">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          name={id}
          value={value || ""}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`w-full appearance-none rounded-xl border bg-white px-4 py-3 pr-11 text-sm font-bold text-[#172234] outline-none transition
            ${error ? "border-[#C2410C]" : "border-[#BFD0DF]"}
            ${disabled ? "cursor-not-allowed bg-[#E7EEF4] text-[#7B8796]" : "hover:border-[#8EA9BD] focus:border-[#087EA7] focus:ring-4 focus:ring-[#CDEAF6]"}`}
        >
          <option value="" disabled>{placeholder}</option>
          {normalizedOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#526174]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
      {error && <p className="text-[11px] font-bold text-[#C2410C]">{error}</p>}
    </div>
  );
}
