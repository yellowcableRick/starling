export type StringSimilarity = {
    similarity: (a: string, b: string) => number;
    isSimilar: (a: string, b: string, threshold?: number) => boolean;
    bestMatches: <T, U>(targets: T[], candidates: U[], options: BestMatchesOptions<T, U>) => BestMatches<T, U>;
};
export type BestMatches<T, U> = {
    perfect: BestMatchesEntry<T, U>[];
    matches: BestMatchesEntry<T, U>[];
    partial: BestMatchesEntry<T, U>[];
    unmatched: U[];
};
export type BestMatchesEntry<T, U> = {
    target: T;
    candidate: U;
    delta: number;
};
export type BestMatchesOptions<T, U> = {
    extractTarget: (t: T) => string;
    extractCandidate: (c: U) => string;
    thresholdMatch?: number;
    thresholdPartial?: number;
};
export declare const useStringSimilarity: () => StringSimilarity;
