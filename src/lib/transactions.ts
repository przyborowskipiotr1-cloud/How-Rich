import { parseAmount } from "./money";
import type { Kind } from "./flow";

export const KINDS: Kind[] = ["income", "expense", "saving", "transfer"];

export type NewTransactionInput = {
  kind: Kind;
  amount: number;
  occurred_on: string;
  account_id: string | null;
  category_id: string | null;
  note: string | null;
};

export type ParseResult =
  | { ok: true; value: NewTransactionInput }
  | { ok: false; error: string };

// Turns raw form fields into a validated transaction. Used by the server action.
export function parseTransactionForm(form: FormData): ParseResult {
  const kind = String(form.get("kind") ?? "");
  if (!(KINDS as string[]).includes(kind)) return { ok: false, error: "Pick a transaction type." };

  const amount = parseAmount(String(form.get("amount") ?? ""));
  if (amount === null) return { ok: false, error: "Enter a valid amount greater than 0." };

  const occurred_on = String(form.get("occurred_on") ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(occurred_on)) return { ok: false, error: "Pick a valid date." };

  const note = String(form.get("note") ?? "").trim();
  if (note.length > 280) return { ok: false, error: "Note must be 280 characters or fewer." };

  return {
    ok: true,
    value: {
      kind: kind as Kind,
      amount,
      occurred_on,
      account_id: String(form.get("account_id") ?? "") || null,
      category_id: String(form.get("category_id") ?? "") || null,
      note: note || null,
    },
  };
}
