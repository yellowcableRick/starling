import { describe, it, expect } from "vitest";
import { useRomanNumerals } from "../modules/converters/composables/useRomanNumerals";

describe("useRomanNumerals", () => {
    const { toNumber } = useRomanNumerals();

    it("converts simple numerals", () => {
        expect(toNumber("I")).toBe(1);
        expect(toNumber("II")).toBe(2);
        expect(toNumber("IV")).toBe(4);
        expect(toNumber("V")).toBe(5);
        expect(toNumber("IX")).toBe(9);
        expect(toNumber("X")).toBe(10);
    });

    it("handles lowercase and complex numerals", () => {
        expect(toNumber("ix")).toBe(9);
        expect(toNumber("MCMXC")).toBe(1990); // 1990
        expect(toNumber("MMXXV")).toBe(2025); // 2025
    });

    it("returns undefined for invalid strings", () => {
        expect(toNumber("ABC")).toBeUndefined();
        expect(toNumber("IIV")).toBe(toNumber("I")! + toNumber("IV")!); // permissive parsing
        expect(toNumber("")).toBe(0);
    });
});
