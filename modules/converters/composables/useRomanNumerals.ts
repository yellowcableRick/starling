export type UseRomanNumerals = {
    toNumber: (str: string) => number | undefined;
    toRoman: (num: number) => string;
}

export const useRomanNumerals = (): UseRomanNumerals => {
    function toNumber(str: string): number | undefined {
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

    function toRoman(num: number): string {
        if (!Number.isFinite(num)) return "";
        // clamp between 0 and 3999 (standard Roman numeral range)
        const n: number = Math.max(0, Math.min(3999, Math.floor(num)));
        if (n === 0) {
            return "";
        }
        const romans: Array<[number, string]> = [
            [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
            [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
            [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
        ];
        let value: number = n;
        let out: string = "";
        for (const [v, sym] of romans) {
            while (value >= v) {
                out += sym;
                value -= v;
            }
        }
        return out;
    }

    return {
        toNumber,
        toRoman,
    };
};
