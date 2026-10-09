"use client";

import { useActionState } from "react";
import { addCategory, updateCurrency, type FormState } from "@/app/actions";
import { CURRENCIES } from "@/lib/money";

type Item = { id: string; name: string };

const field =
  "rounded-lg border border-[color:var(--hairline)] bg-[color:var(--page)] px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]";
const card = "rounded-2xl bg-[color:var(--surface-1)] p-5";

function Feedback({ state }: { state: FormState }) {
  if (!state) return null;
  return (
    <p className="text-sm" role="status" style={{ color: state.error ? "var(--danger)" : "var(--good)" }}>
      {state.error ?? state.message}
    </p>
  );
}

export function SettingsForms({ currency, categories, accounts }: { currency: string; categories: Item[]; accounts: Item[] }) {
  const [currencyState, currencyAction, currencyPending] = useActionState<FormState, FormData>(updateCurrency, undefined);
  const [categoryState, categoryAction, categoryPending] = useActionState<FormState, FormData>(addCategory, undefined);

  return (
    <>
      <section className={`${card} space-y-4`}>
        <h2 className="text-sm font-medium text-[color:var(--text-secondary)]">Currency</h2>
        <form action={currencyAction} className="flex items-center gap-3">
          <select name="currency" defaultValue={currency} className={field}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button disabled={currencyPending} className="rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            Save
          </button>
        </form>
        <Feedback state={currencyState} />
      </section>

      <section className={`${card} space-y-4`}>
        <h2 className="text-sm font-medium text-[color:var(--text-secondary)]">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <span key={c.id} className="rounded-full border border-[color:var(--hairline)] px-3 py-1 text-sm">
              {c.name}
            </span>
          ))}
        </div>
        <form action={categoryAction} className="flex items-center gap-3">
          <input name="name" placeholder="New category" maxLength={60} required className={field} />
          <button disabled={categoryPending} className="rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            Add
          </button>
        </form>
        <Feedback state={categoryState} />
      </section>

      <section className={card}>
        <h2 className="mb-3 text-sm font-medium text-[color:var(--text-secondary)]">Accounts</h2>
        <p className="text-sm text-[color:var(--text-secondary)]">{accounts.map((a) => a.name).join(" · ")}</p>
      </section>
    </>
  );
}
