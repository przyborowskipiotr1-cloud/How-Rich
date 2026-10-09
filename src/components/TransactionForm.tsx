"use client";

import { useActionState, useEffect, useRef } from "react";
import { addTransaction, type FormState } from "@/app/actions";

type Option = { id: string; name: string };

export function TransactionForm({ accounts, categories }: { accounts: Option[]; categories: Option[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(addTransaction, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.message) formRef.current?.reset();
  }, [state]);

  const field =
    "w-full rounded-lg border border-[color:var(--hairline)] bg-[color:var(--page)] px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)]";

  return (
    <form ref={formRef} action={action} className="grid gap-3 sm:grid-cols-2">
      <div className="flex gap-1 rounded-lg bg-[color:var(--page)] p-1 sm:col-span-2">
        {[
          { value: "expense", label: "Expense", color: "var(--series-2)" },
          { value: "income", label: "Income", color: "var(--series-3)" },
          { value: "saving", label: "Saving", color: "var(--series-1)" },
          { value: "transfer", label: "Transfer", color: "var(--series-6)" },
        ].map((kind, i) => (
          <label key={kind.value} className="flex-1 cursor-pointer">
            <input type="radio" name="kind" value={kind.value} defaultChecked={i === 0} className="peer sr-only" />
            <span
              className="block rounded-md py-2 text-center text-sm text-[color:var(--text-secondary)] peer-checked:bg-[color:var(--surface-1)] peer-checked:text-[color:var(--text-primary)]"
              style={{ boxShadow: "inset 0 -2px 0 transparent" }}
            >
              <span style={{ color: kind.color }}>●</span> {kind.label}
            </span>
          </label>
        ))}
      </div>

      <input name="amount" inputMode="decimal" placeholder="Amount, e.g. 42,50" required className={field} />
      <input name="occurred_on" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required className={field} />
      <select name="category_id" className={field} defaultValue="">
        <option value="">No category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <select name="account_id" className={field} defaultValue="">
        <option value="">No account</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>
      <input name="note" placeholder="Note (optional)" maxLength={280} className={`${field} sm:col-span-2`} />

      <div className="flex items-center justify-between sm:col-span-2">
        <p className="text-sm" role="status" style={{ color: state?.error ? "var(--danger)" : "var(--good)" }}>
          {state?.error ?? state?.message ?? ""}
        </p>
        <button
          disabled={pending}
          className="rounded-lg bg-[color:var(--accent)] px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {pending ? "Saving…" : "Add"}
        </button>
      </div>
    </form>
  );
}
