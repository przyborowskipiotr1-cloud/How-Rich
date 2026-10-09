import { describe, expect, it } from "vitest";
import { formatMoney, parseAmount } from "../money";

describe("parseAmount", () => {
  it("accepts comma and dot decimals and spaces", () => {
    expect(parseAmount("12,50")).toBe(12.5);
    expect(parseAmount("12.5")).toBe(12.5);
    expect(parseAmount("1 200,00")).toBe(1200);
  });
  it("rejects zero, negatives, and junk", () => {
    expect(parseAmount("0")).toBeNull();
    expect(parseAmount("-5")).toBeNull();
    expect(parseAmount("abc")).toBeNull();
    expect(parseAmount("1.234")).toBeNull();
    expect(parseAmount("")).toBeNull();
  });
});

describe("formatMoney", () => {
  it("formats PLN by default", () => {
    expect(formatMoney(1200)).toContain("zł");
  });
  it("formats another currency when asked", () => {
    expect(formatMoney(10, "EUR")).toContain("€");
  });
});
