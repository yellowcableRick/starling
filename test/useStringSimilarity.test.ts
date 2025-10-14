import { describe, it, expect } from "vitest";
import { useStringSimilarity } from "../modules/comparators/composables/useStringSimilarity";

describe("useStringSimilarity", () => {
    const { similarity, isSimilar, bestMatches } = useStringSimilarity();

    it("returns 1.0 for exact matches (after normalization)", () => {
        expect(similarity("The Office", "Office, The")).toBe(1);
        expect(similarity("Hello-World!", "hello world")).toBe(1);
    });

    it("detects similarity with threshold", () => {
        expect(isSimilar("Matrix", "The Matrix")).toBe(true);
        expect(isSimilar("Rocky II", "Rocky 2")).toBe(true);
        expect(isSimilar("Alpha", "Alfa", 0.9)).toBe(false);
    });

    it("bestMatches categorizes perfect, matches/partials and unmatched", () => {
        const targets = ["alpha", "beta"];
        const candidates = ["alpha", "bet", "gamma"];

        const result = bestMatches(
            targets,
            candidates,
            {
                extractTarget: (t) => t,
                extractCandidate: (c) => c,
                thresholdMatch: 0.8,
                thresholdPartial: 0.5,
            }
        );

        expect(result.perfect.map(e => e.candidate)).toEqual(["alpha"]);
        // "bet" shares no full words with "beta" so it's filtered out, ends in unmatched
        expect(result.matches.length).toBe(0);
        expect(result.partial.length).toBe(0);
        expect(result.unmatched.sort()).toEqual(["bet", "gamma"].sort());
    });

    it("handles numeric and Roman numeral equivalence", () => {
    // numeric comparator treats II and 2 as equal number tokens, so overall should be similar
        expect(isSimilar("Rocky II", "Rocky 2")).toBe(true);
        // different numbers should penalize
        expect(isSimilar("Rocky III", "Rocky 2", 0.9)).toBe(false);
    });
});
