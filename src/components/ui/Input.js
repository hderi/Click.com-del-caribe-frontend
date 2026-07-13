"use client";
export default function Input({
  id,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  required = false,
  autoComplete,
  icon,
  suffix,
  disabled = false,
  ...props
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-text-secondary tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        {/* Left icon */}
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted transition-colors duration-200 group-focus-within:text-brand-blue pointer-events-none">
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
          autoComplete={autoComplete}
          disabled={disabled}
          className={`
            w-full rounded-xl border border-border-default
            bg-surface-800/60
            text-text-primary placeholder:text-text-muted
            transition-all duration-300 ease-out
            focus:border-brand-blue focus:shadow-[var(--shadow-input-focus)] focus:bg-surface-800
            hover:border-border-hover hover:bg-surface-800/80
            disabled:opacity-50 disabled:cursor-not-allowed
            text-sm leading-5 outline-none
            ${icon ? "pl-11" : "pl-4"}
            ${suffix ? "pr-11" : "pr-4"}
            py-3
          `}
          {...props}
        />
        {/* Right suffix (e.g., show/hide password) */}
        {suffix && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}
        {/* Focus ring animation */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none ring-1 ring-brand-blue/20" />
      </div>
    </div>
  );
}
