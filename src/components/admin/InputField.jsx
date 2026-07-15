"use client";

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
        <label htmlFor={id} className={`flex items-center gap-1 text-xs font-semibold ${light ? "text-[#374151]" : "text-[#374151]"}`}>
          {label}
          {required && <span className="text-[#b91c1c]">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]">
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
          className={`w-full rounded-md border bg-white py-2 text-sm leading-5 text-[#111827] outline-none transition-colors placeholder:text-[#9ca3af] disabled:cursor-not-allowed disabled:bg-[#f3f4f6] disabled:text-[#6b7280] ${
            error ? "border-red-300 focus:border-red-500" : "border-[#d1d5db] focus:border-[#2563eb]"
          } ${icon ? "pl-10" : "pl-3"} pr-3`}
          {...props}
        />
      </div>
      {error && <p className="text-xs font-medium text-[#b91c1c]">{error}</p>}
    </div>
  );
}
