export type UseRomanNumerals = {
    romanToNumber: (str: string) => number | undefined;
}

export const useRomanNumerals = (): UseRomanNumerals => {
    function romanToNumber(str: string): number | undefined {
        const map: Record<string, number> = {
            M:1000, CM:900, D:500, CD:400,
            C:100, XC:90, L:50, XL:40,
            X:10, IX:9, V:5, IV:4, I:1
        };

        let num: number = 0;
        let i: number = 0;
        str = str.toUpperCase();

        while (i < str.length) {
            const two: string = str.slice(i, i+2);
            const s: string = String(str[i]);
            if (map[two]) {
                num += map[two];
                i += 2;
            } else if (map[s]) {
                num += map[s];
                i += 1;
            } else {
                return undefined; // Not a valid Roman numeral
            }
        }

        return num;
    }

    return {
        romanToNumber,
    };
};
