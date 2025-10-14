export type UseRomanNumerals = {
    toNumber: (str: string) => number | undefined;
    toRoman: (num: number) => string;
};
export declare const useRomanNumerals: () => UseRomanNumerals;
