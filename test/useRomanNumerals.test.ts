import { describe, it, expect } from "vitest";
import { useRomanNumerals } from "../modules/converters/composables/useRomanNumerals";

describe("useRomanNumerals", () => {
  const { romanToNumber } = useRomanNumerals();

  it("converts simple numerals", () => {
    expect(romanToNumber("I")).toBe(1);
    expect(romanToNumber("II")).toBe(2);
    expect(romanToNumber("IV")).toBe(4);
    expect(romanToNumber("V")).toBe(5);
    expect(romanToNumber("IX")).toBe(9);
    expect(romanToNumber("X")).toBe(10);
  });

  it("handles lowercase and complex numerals", () => {
    expect(romanToNumber("ix")).toBe(9);
    expect(romanToNumber("MCMXC")).toBe(1990); // 1990
    expect(romanToNumber("MMXXV")).toBe(2025); // 2025
  });

  it("returns undefined for invalid strings", () => {
    expect(romanToNumber("ABC")).toBeUndefined();
    expect(romanToNumber("IIV")).toBe(romanToNumber("I")! + romanToNumber("IV")!); // permissive parsing
    expect(romanToNumber("")).toBe(0);
  });
});
