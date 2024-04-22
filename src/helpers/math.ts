import { Decimal } from 'decimal.js';

const [zero, one, two, three]: bigint[] = [0, 1, 2 ,3].map(n => BigInt(n))

export function ln(a: bigint): bigint {
    // Initialize Decimal instance with the number
    const num = new Decimal(a.toString());

    // Compute the natural logarithm
    const result = num.ln();
    // log(a) < MAX_SAFE_INTEGER, more than that is ridiculously big
    // Return the result as a string
    return BigInt(Math.round(Number(result.toString())));
}

// How to get sqrt of a BigInt, found under the link below
// https://stackoverflow.com/a/53684036/4219083
export function sqrt(value: bigint): bigint {
    if (value < zero) {
        throw 'Square root of negative numbers is not supported'
    }
    // The method give incorrect values for small numbers, so check it separately
    if ([zero, one].includes(value))  {
        return value;
    }
    if (value < two * two) {
        return one;
    }
    if (value < three * three) {
        return two;
    }
    if (value <  BigInt(16)) {
        return three;
    }
    if (value < BigInt(25)) {
        return BigInt(4);
    }
    
    function newtonIteration(n: bigint, x0: bigint): bigint {
        const x1: bigint = n / x0 + x0 >> one;
        if (x0 === x1 || x0 === x1 - one) {
            return x0;
        }
        return newtonIteration(n, x1);
    }

    return newtonIteration(value, one);
}

export const max = (a: bigint, b: bigint) => a > b ? a : b;

export const min = (a: bigint, b: bigint) => a > b ? b : a;

export const abs = (n: bigint): bigint => n < zero ? -n : n;