"use client";

import { useCallback, useState } from "react";
import { Bot, CalendarDays, MapPin, Send, Sparkles } from "lucide-react";

import type { Locale } from "@/lib/i18n";
import type { AiGuideMessages } from "@/lib/i18n";

type Props = {
  locale: Locale;
  t: AiGuideMessages;
  categories: string[];
  regions: string[];
};

type Mode = "plan" | "place";

/* ── Inline formatlash: **bold**, *italic*, `code` ─────────────────────────── */
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="rounded bg-[var(--color-mist)] px-1.5 py-0.5 text-[0.85em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });
}

/* ── Engil markdown renderer ────────────────────────────────────────────────── */
function renderMarkdown(source: string): React.ReactNode {
  const blocks: React.ReactNode[] = [];
  const lines = source.split("\n");
  let listBuffer: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushList = () => {
    if (!listType || listBuffer.length === 0) return;
    const items = listBuffer.map((item, i) => (
      <li key={i} className="ml-1 leading-6">
        {renderInline(item)}
      </li>
    ));
    blocks.push(
      listType === "ul" ? (
        <ul key={`ul-${blocks.length}`} className="my-2 list-disc space-y-1 pl-5">
          {items}
        </ul>
      ) : (
        <ol key={`ol-${blocks.length}`} className="my-2 list-decimal space-y-1 pl-5">
          {items}
        </ol>
      ),
    );
    listBuffer = [];
    listType = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }

    if (line.startsWith("### ")) {
      flushList();
      blocks.push(
        <h4 key={`h-${blocks.length}`} className="mt-4 mb-1.5 text-sm font-semibold text-[var(--color-ink)]">
          {renderInline(line.slice(4))}
        </h4>,
      );
      continue;
    }

    if (line.startsWith("## ")) {
      flushList();
      blocks.push(
        <h3 key={`h-${blocks.length}`} className="mt-4 mb-1.5 text-base font-semibold text-[var(--color-teal)]">
          {renderInline(line.slice(3))}
        </h3>,
      );
      continue;
    }

    const isOL = /^\d+[.)]\s+/.test(line);
    if (line.startsWith("- ") || line.startsWith("* ") || isOL) {
      const itemText = line.replace(/^[-*\d.)\s]+/, "");
      if (listType !== (isOL ? "ol" : "ul")) {
        flushList();
        listType = isOL ? "ol" : "ul";
      }
      listBuffer.push(itemText);
      continue;
    }

    flushList();
    blocks.push(
      <p key={`p-${blocks.length}`} className="my-2 leading-7 text-[var(--color-ink)]/75">
        {renderInline(line)}
      </p>,
    );
  }
  flushList();

  return blocks;
}

export function AiGuideClient({ locale, t, categories, regions }: Props) {
  const [mode, setMode] = useState<Mode>("plan");
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(2);
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = useCallback(async () => {
    const finalQuery = (query || `${destination} ${days} kun`).trim();
    if (!finalQuery) return;

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await fetch("/api/ai/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: finalQuery,
          mode,
          locale,
          destination: mode === "plan" ? destination || undefined : undefined,
          days: mode === "plan" ? days : undefined,
          category: mode === "plan" ? category || undefined : undefined,
        }),
      });

      if (!res.ok) {
        let code = "UNKNOWN";
        try {
          code = ((await res.json()) as { error?: string }).error ?? "UNKNOWN";
        } catch {
          /* ignore */
        }
        setError(
          code === "RATE_LIMITED"
            ? t.errorRateLimited
            : code === "AI_NOT_CONFIGURED"
              ? t.errorNotConfigured
              : t.errorUnknown,
        );
        setLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setError(t.errorUnknown);
        setLoading(false);
        return;
      }

      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setResponse(acc);
      }
    } catch {
      setError(t.errorUnknown);
    } finally {
      setLoading(false);
    }
  }, [category, days, destination, locale, mode, query, t]);

  const applyPlaceholder = (p: string) => setQuery(p);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      {/* ── Chap: form ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        {/* Mode tabs */}
        <div className="flex rounded-full border border-[var(--color-ink)]/8 bg-[var(--color-mist)]/60 p-1">
          {(
            [
              { key: "plan", label: t.planTab },
              { key: "place", label: t.placeTab },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setMode(tab.key);
                setResponse("");
                setError("");
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                mode === tab.key
                  ? "bg-[var(--color-sky)] text-white shadow-sm"
                  : "text-[var(--color-ink)]/55 hover:text-[var(--color-ink)]"
              }`}
            >
              {tab.key === "plan" ? <CalendarDays size={15} strokeWidth={2.2} /> : <MapPin size={15} strokeWidth={2.2} />}
              {tab.label}
            </button>
          ))}
        </div>

        <p className="text-sm leading-6 text-[var(--color-ink)]/55">
          {mode === "plan" ? t.planDescription : t.placeDescription}
        </p>

        {mode === "plan" && (
          <>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink)]/40">
                {t.destinationLabel}
              </span>
              <input
                list="ai-guide-regions"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={t.destinationPlaceholder}
                className="h-12 rounded-[1rem] border border-[var(--color-ink)]/10 bg-[var(--color-mist)]/50 px-4 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-sky)]"
              />
              <datalist id="ai-guide-regions">
                {regions.map((r) => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink)]/40">
                  {t.daysLabel}
                </span>
                <select
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value, 10))}
                  className="h-12 rounded-[1rem] border border-[var(--color-ink)]/10 bg-[var(--color-mist)]/50 px-3 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-sky)]"
                >
                  {[1, 2, 3, 4, 5, 7, 10].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink)]/40">
                  {t.categoryLabel}
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-12 rounded-[1rem] border border-[var(--color-ink)]/10 bg-[var(--color-mist)]/50 px-3 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-sky)]"
                >
                  <option value="">{t.categoryAny}</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink)]/40">
            {t.queryLabel}
          </span>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={mode === "plan" ? t.queryPlaceholder : t.queryPlacePlaceholder}
            rows={3}
            className="resize-none rounded-[1.25rem] border border-[var(--color-ink)]/10 bg-[var(--color-mist)]/50 px-4 py-3 text-sm leading-6 text-[var(--color-ink)] outline-none transition focus:border-[var(--color-sky)]"
          />
        </label>

        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-[1rem] bg-[var(--color-sky)] px-6 text-sm font-semibold text-white shadow-sm shadow-[var(--color-sky)]/25 transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? t.generating : t.submit}
          {loading ? <Sparkles size={16} strokeWidth={2} className="animate-pulse" /> : <Send size={16} strokeWidth={2} />}
        </button>

        {error && (
          <p className="rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        {/* Maslahatlar */}
        <div className="flex flex-wrap gap-2">
          {t.placeholders.map((ph) => (
            <button
              key={ph}
              type="button"
              onClick={() => applyPlaceholder(ph)}
              className="rounded-full border border-[var(--color-sky)]/25 bg-[var(--color-mist)]/50 px-3 py-1.5 text-xs font-medium text-[var(--color-ink)]/55 transition hover:border-[var(--color-sky)] hover:text-[var(--color-sky)]"
            >
              {ph}
            </button>
          ))}
        </div>
      </div>

      {/* ── O'ng: natija ──────────────────────────────────────────── */}
      <div
        aria-live="polite"
        className="flex min-h-[22rem] flex-col rounded-[1.75rem] border border-[var(--color-ink)]/6 bg-[linear-gradient(160deg,#F8F7F3_0%,#FFFFFF_60%)] p-5 sm:p-6"
      >
        {response ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-sky)] to-[var(--color-teal)]">
                <Bot size={15} className="text-white" strokeWidth={2} />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)]/40">
                O&apos;zGezer AI
              </span>
            </div>
            <div className="text-[0.95rem]">{renderMarkdown(response)}</div>
            {loading && (
              <p className="text-xs text-[var(--color-ink)]/40">{"▌"}</p>
            )}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-sky)]/10">
              <Sparkles size={24} className="text-[var(--color-sky)]" strokeWidth={2} />
            </div>
            <p className="max-w-xs text-sm leading-6 text-[var(--color-ink)]/45">
              {loading ? t.generating : (mode === "plan" ? t.planDescription : t.placeDescription)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}