export type Kind = "income" | "expense" | "saving" | "transfer";

export type FlowRow = {
  kind: Kind;
  amount: number;
  occurred_on: string; // YYYY-MM-DD
  category: string | null;
};

export type FlowSummary = {
  income: number;
  expense: number;
  saved: number;
  net: number; // income - expense - saved
  byCategory: { category: string; total: number }[]; // expenses only, largest first
};

// Totals for a set of rows. Transfers move money between accounts, so they are excluded.
export function summarize(rows: FlowRow[]): FlowSummary {
  let income = 0;
  let expense = 0;
  let saved = 0;
  const categories = new Map<string, number>();

  for (const row of rows) {
    if (row.kind === "income") income += row.amount;
    else if (row.kind === "expense") {
      expense += row.amount;
      const key = row.category ?? "Uncategorised";
      categories.set(key, (categories.get(key) ?? 0) + row.amount);
    } else if (row.kind === "saving") saved += row.amount;
  }

  const byCategory = [...categories.entries()]
    .map(([category, total]) => ({ category, total: round2(total) }))
    .sort((a, b) => b.total - a.total);

  return {
    income: round2(income),
    expense: round2(expense),
    saved: round2(saved),
    net: round2(income - expense - saved),
    byCategory,
  };
}

// Keeps the current month's rows only. monthKey is "YYYY-MM".
export function filterMonth(rows: FlowRow[], monthKey: string): FlowRow[] {
  return rows.filter((row) => row.occurred_on.startsWith(monthKey));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
