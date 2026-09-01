import type { ReactNode } from "react";

/* Brand mark — login/register ikkalasida bir xil */
export function AuthBrand({
  title,
  subtitle,
  logo,
}: {
  title: string;
  subtitle: string;
  logo?: ReactNode;
}) {
  return (
    <div className="mb-6 text-center">
      <div className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-sky)] to-[var(--color-teal)] shadow-lg shadow-[var(--color-sky)]/20 ring-1 ring-white/10">
        {logo ?? (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        )}
      </div>
      <h1 className="display-title text-[1.7rem] font-semibold leading-tight text-[var(--color-ink)] sm:text-3xl">{title}</h1>
      <p className="mt-1.5 text-sm leading-6 text-[var(--color-ink)]/55">{subtitle}</p>
    </div>
  );
}

/* AuthError — xato banneri */
export function AuthError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="mb-5 rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700 shadow-sm">
      {message}
    </div>
  );
}

/* Field + input — placeholder bilan, dark/light kontrast tuzatildi */
export function AuthField({
  label,
  type = "text",
  name,
  required,
  minLength,
  autoComplete,
  placeholder,
}: {
  label: string;
  type?: string;
  name: string;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)]/50">
        {label}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="h-12 w-full rounded-[1rem] border border-[var(--color-ink)]/10 bg-white px-4 text-sm text-[var(--color-ink)] shadow-sm outline-none transition placeholder:text-[var(--color-ink)]/30 focus:border-[var(--color-sky)] focus:ring-2 focus:ring-[var(--color-sky)]/12"
      />
    </label>
  );
}

export function AuthSubmit({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="mt-2 h-12 w-full rounded-full bg-[var(--color-sky)] text-sm font-semibold text-white shadow-md shadow-[var(--color-sky)]/25 transition hover:opacity-90"
    >
      {label}
    </button>
  );
}