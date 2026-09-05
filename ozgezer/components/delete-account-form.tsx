"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

type Props = {
  locale: string;
  labels: {
    title: string;
    description: string;
    button: string;
    confirmTitle: string;
    confirmDescription: string;
    cancel: string;
    confirm: string;
  };
};

export function DeleteAccountForm({ locale, labels }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="section-card rounded-[1.75rem] border border-red-200/50 p-6">
        <h3 className="text-sm font-semibold text-red-600">{labels.title}</h3>
        <p className="mt-1.5 text-sm leading-6 text-[var(--color-ink)]/60">{labels.description}</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
        >
          <Trash2 size={14} strokeWidth={2} />
          {labels.button}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[1.5rem] bg-white p-6 shadow-2xl">
            <h4 className="text-base font-semibold text-[var(--color-ink)]">{labels.confirmTitle}</h4>
            <p className="mt-2 text-sm leading-6 text-[var(--color-ink)]/60">{labels.confirmDescription}</p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full border border-[var(--color-ink)]/10 px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-mist)]"
              >
                {labels.cancel}
              </button>
              <form action="/api/auth/delete" method="post" className="flex-1">
                <input type="hidden" name="locale" value={locale} />
                <button
                  type="submit"
                  className="w-full rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  {labels.confirm}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
