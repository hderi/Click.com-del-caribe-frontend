"use client";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  isLoading = false,
  fullWidth = false,
  disabled = false,
  id,
  onClick,
  ...props
}) {
  const baseClasses = `
    relative inline-flex items-center justify-center
    font-semibold text-sm tracking-wide
    rounded-xl px-6 py-3
    transition-all duration-300 ease-out
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900
    disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
    ${fullWidth ? "w-full" : ""}
  `;

  const variants = {
    primary: `
      bg-[#00A8E8] text-white shadow-[0_8px_20px_rgba(0,168,232,0.22)] hover:bg-[#FF7A00] hover:shadow-[0_10px_24px_rgba(255,122,0,0.24)]
      active:scale-[0.98]
    `,
    secondary: `
      bg-white border border-[#A9C2D6] text-[#17324D] shadow-[0_6px_16px_rgba(23,50,77,0.08)] hover:bg-[#EAF6FC] hover:border-[#7EA9C5]
      active:scale-[0.98]
    `,
    ghost: `
      bg-transparent text-[#4B647A] hover:bg-[#EAF6FC] hover:text-[#17324D]
      active:scale-[0.98]
    `,
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant] || variants.primary}`}
      disabled={disabled || isLoading}
      id={id}
      onClick={onClick}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}

      <span className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-200"}>
        {children}
      </span>
    </button>
  );
}
