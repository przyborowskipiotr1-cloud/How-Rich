import { describe, expect, it } from "vitest";
import { parseTransactionForm } from "../transactions";

function form(fields: Record<string, string>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.set(k, v);
  return f;
}

const valid = { kind: "expense", amount: "42,50", occurred_on: "2026-10-09", note: " lunch ", category_id: "c1", account_id: "" };

describe("parseTransactionForm", () => {
  it("parses a valid form and trims the note", () => {
    const result = parseTransactionForm(form(valid));
    expect(result).toEqual({
      ok: true,
      value: { kind: "expense", amount: 42.5, occurred_on: "2026-10-09", account_id: null, category_id: "c1", note: "lunch" },
    });
  });
  it("rejects an unknown kind", () => {
    expect(parseTransactionForm(form({ ...valid, kind: "gift" })).ok).toBe(false);
  });
  it("rejects a bad amount", () => {
    expect(parseTransactionForm(form({ ...valid, amount: "0" })).ok).toBe(false);
  });
  it("rejects a bad date", () => {
    expect(parseTransactionForm(form({ ...valid, occurred_on: "09/10/2026" })).ok).toBe(false);
  });
  it("rejects an over-long note", () => {
    expect(parseTransactionForm(form({ ...valid, note: "x".repeat(281) })).ok).toBe(false);
  });
});
