import { useRomanNumerals } from "../../converters/composables/useRomanNumerals";

export type StringSimilarity = {
    similarity: (a: string, b: string) => number;
    isSimilar: (a: string, b: string, threshold?: number) => boolean;
    bestMatches: <T, U>(
        targets: T[],
        candidates: U[],
        options: BestMatchesOptions<T, U>
    ) => BestMatches<T, U>;
};

export type BestMatches<T, U> = {
    perfect: BestMatchesEntry<T, U>[];
    matches: BestMatchesEntry<T, U>[];
    partial: BestMatchesEntry<T, U>[];
    unmatched: U[];
}

export type BestMatchesEntry<T, U> = {
    target: T;
    candidate: U;
    delta: number;
}

export type BestMatchesOptions<T, U> = {
    extractTarget: (t: T) => string;
    extractCandidate: (c: U) => string;
    thresholdMatch?: number;
    thresholdPartial?: number;
}

type Comparison = (aWords: Set<string>, bWords: Set<string>) => number;

export const useStringSimilarity = (): StringSimilarity => {
    const normalize = (str: string) => {
        return str
            .toLowerCase()
            .replace(/[^\w\s]/g, "")
            .trim();
    };

    const normalizeArticles = (str: string) => {
        const articles: Set<string> = new Set(["the", "a", "an"]);
        const words: string[] = normalize(str)
            .split(/\s+/)
            .filter((w: string) => w.length > 0 && !articles.has(w));
        return words.join(" ");
    };

    // IMPORTANT: get Roman numeral helpers inside the composable, not at module scope
    const { toNumber } = useRomanNumerals();

    const comparisons: Comparison[] = [
        function intersection(aWords: Set<string>, bWords: Set<string>): number {
            // Default penalty factor; this overlaps both dice and strict.
            const penalty: number = 0.5;

            // If no overlap at all → mark as invalid
            if (![...aWords].some((w: string) => bWords.has(w))) {
                return -1;
            }

            const interSize: number = [...aWords].filter((x: string) => bWords.has(x)).length;

            // Original formula (Dice coefficient, more forgiving)
            const dice: number = (2 * interSize) / (aWords.size + bWords.size);

            // Stricter formula (intersection over max size, harsher on extra words)
            const strict: number = interSize / Math.max(aWords.size, bWords.size);

            // Blend them based on a penalty factor
            return (dice * (1 - penalty)) + (strict * penalty);
        },
        function numeric(aWords: Set<string>, bWords: Set<string>): number {
            const convert = (x: string): number | null => {
                const n: number = Number(x);
                if (!isNaN(n)) {
                    return n;
                }

                const r: number | undefined = toNumber(x);
                if (r !== undefined) {
                    return r;
                }

                return null; // ignore non-numeric words
            };

            const aNumbers: number[] = [...aWords].map(convert).filter((x: number | null): x is number => x !== null);
            const bNumbers: number[] = [...bWords].map(convert).filter((x: number | null): x is number => x !== null);

            // If either has numbers, compare strictly
            if (aNumbers.length > 0 || bNumbers.length > 0) {
                const intersection: number[] = aNumbers.filter((x: number) => bNumbers.includes(x));
                if (intersection.length === 0) {
                    return 0; // penalize different sequels
                }

                return intersection.length / Math.max(aNumbers.length, bNumbers.length);
            }

            // No numbers → ignore numeric contribution
            return -1;
        }
    ];

    const similarity = (a: string, b: string): number => {
        const aWords: Set<string> = new Set(normalizeArticles(a).split(/\s+/));
        const bWords: Set<string> = new Set(normalizeArticles(b).split(/\s+/));
        if ([...aWords].join("") === [...bWords].join("")) {
            return 1;
        }

        let result: number = 0;
        let division: number = 0;

        comparisons.forEach((x: Comparison): void => {
            const y: number = x(aWords, bWords);
            if (y >= 0) {
                result += y;
                division++;
            }
        });

        return Math.round(((result / division) + Number.EPSILON) * 100) / 100;
    };

    const isSimilar = (a: string, b: string, threshold: number = 0.75): boolean => {
        return similarity(a, b) >= threshold;
    };

    const bestMatches = <T, U>(
        targets: T[],
        candidates: U[],
        {
            extractTarget,
            extractCandidate,
            thresholdMatch = 0.8,
            thresholdPartial = 0.5,
        }: BestMatchesOptions<T, U>
    ): BestMatches<T, U> => {
        const deltas: BestMatchesEntry<T, U>[] = [];

        // Pre-normalize strings
        const normalizedTargets: string[] = targets.map((t: T) => normalizeArticles(extractTarget(t)));
        const normalizedCandidates: string[] = candidates.map((c: U) => normalizeArticles(extractCandidate(c)));

        // 1 Compute all candidate-target deltas
        for (let i = 0; i < targets.length; i++) {
            const normalizedTarget: string = String(normalizedTargets[i]);
            const targetWords: Set<string> = new Set(normalizedTarget.split(/\s+/));
            for (let j = 0; j < candidates.length; j++) {
                const normalizedCandidate: string = String(normalizedCandidates[j]);
                const candidateWords: Set<string> = new Set(normalizedCandidate.split(/\s+/));
                if (![...targetWords].some((w: string) => candidateWords.has(w))) {
                    continue;
                }

                if (normalizedTarget && normalizedCandidate) {
                    deltas.push({
                        target: targets[i] as T,
                        candidate: candidates[j] as U,
                        delta: (normalizedTarget === normalizedCandidate) ? 1 :
                            similarity(normalizedTarget, normalizedCandidate),
                    });
                }
            }
        }

        // 2 Sort descending by delta (the best match first)
        deltas.sort((a: BestMatchesEntry<T, U>, b: BestMatchesEntry<T, U>): number => {
            return b.delta - a.delta;
        });

        const perfect: BestMatchesEntry<T, U>[] = [];
        const matches: BestMatchesEntry<T, U>[] = [];
        const partial: BestMatchesEntry<T, U>[] = [];
        const used: Set<U> = new Set<U>();

        // 3 Assign candidates greedily
        for (const { target, candidate, delta } of deltas) {
            if (used.has(candidate)) {
                continue;
            }

            if (delta === 1) {
                perfect.push({ target, candidate, delta });
                used.add(candidate);
            } else if (delta >= thresholdMatch) {
                matches.push({ target, candidate, delta });
                used.add(candidate);
            } else if (delta >= thresholdPartial) {
                partial.push({ target, candidate, delta });
                used.add(candidate);
            }
        }

        // 4 Remaining candidates are unmatched
        const unmatched: U[] = candidates.filter((c: U) => !used.has(c));

        return { perfect, matches, partial, unmatched };
    };

    return { similarity, isSimilar, bestMatches };
};
