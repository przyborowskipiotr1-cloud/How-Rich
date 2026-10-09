import { describe, expect, it } from "vitest";
import { filterMonth, summarize, type FlowRow } from "../flow";

const rows: FlowRow[] = [
  { kind: "income", amount: 5000, occurred_on: "2026-10-01", category: "Salary" },
  { kind: "expense", amount: 1500, occurred_on: "2026-10-02", category: "Rent" },
  { kind: "expense", amount: 300.1, occurred_on: "2026-10-05", category: "Food" },
  { kind: "expense", amount: 100, occurred_on: "2026-10-06", category: "Food" },
  { kind: "expense", amount: 50, occurred_on: "2026-10-07", category: null },
  { kind: "saving", amount: 1000, occurred_on: "2026-10-03", category: null },
  { kind: "transfer", amount: 800, occurred_on: "2026-10-04", category: null },
];

describe("summarize", () => {
  it("totals income, expenses and savings, ignoring transfers", () => {
    const s = summarize(rows);
    expect(s.income).toBe(5000);
    expect(s.expense).toBe(1950.1);
    expect(s.saved).toBe(1000);
    expect(s.net).toBe(2049.9);
  });
  it("groups expenses by category, largest first, with uncategorised fallback", () => {
    const s = summarize(rows);
    expect(s.byCategory).toEqual([
      { category: "Rent", total: 1500 },
      { category: "Food", total: 400.1 },
      { category: "Uncategorised", total: 50 },
    ]);
  });
  it("returns zeros for no rows", () => {
    expect(summarize([])).toEqual({ income: 0, expense: 0, saved: 0, net: 0, byCategory: [] });
  });
});

describe("filterMonth", () => {
  it("keeps rows from the given month only", () => {
    const extra: FlowRow = { kind: "income", amount: 1, occurred_on: "2026-09-30", category: null };
    expect(filterMonth([...rows, extra], "2026-10")).toHaveLength(rows.length);
  });
});
