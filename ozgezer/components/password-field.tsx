"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordFieldProps = {
  label: string;
  name: string;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
  placeholder?: string;
  showLabel: string;
  hideLabel: string;
};

/**
 * Parol maydoni — ko'zcha tugmasi bilan.
 * Foydalanuvchi yozganini ko'ra oladi, shu bilan xatoni darhol tuzatadi.
 */
export function PasswordField({
  label,
  name,
  required,
  minLength,
  autoComplete,
  placeholder,
  showLabel,
  hideLabel,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)]/50">
        {label}
      </span>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          name={name}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="h-12 w-full rounded-[1rem] border border-[var(--color-ink)]/10 bg-white px-4 pr-12 text-sm text-[var(--color-ink)] shadow-sm outline-none transition placeholder:text-[var(--color-ink)]/30 focus:border-[var(--color-sky)] focus:ring-2 focus:ring-[var(--color-sky)]/12"
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? hideLabel : showLabel}
          title={visible ? hideLabel : showLabel}
          aria-pressed={visible}
          className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[0.75rem] text-[var(--color-ink)]/40 transition hover:bg-[var(--color-mist)] hover:text-[var(--color-sky-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-sky)]/30"
        >
          {visible ? <EyeOff size={17} strokeWidth={2} /> : <Eye size={17} strokeWidth={2} />}
        </button>
      </div>
    </label>
  );
}
