import { isMillerRabinProbablePrime, isBaillieProbablePrime } from "./primalyTests"
import getTimeMicro from '@/helpers/getTimeMicro';
import id from '@/helpers/id';
import { MAX_COMPUTATION_FACTORS } from "@/helpers/Constants";

const zero: bigint = BigInt(0)
const one: bigint = BigInt(1)
const two: bigint = BigInt(2)
const three: bigint = BigInt(3)

export default function factors(n: bigint ): Factorization {
    
    const start = getTimeMicro()
    
    if (n === one || n === zero) {
        return {
            message: "0 and 1 are special numbers, no primes.",
            factors: [
                { prime: n, exponent: 1 }
            ],
            time: getTimeMicro()-start,
        }
    } 
    else if (n < zero) {
        throw new Error("It works only with positive integers!")
    }

    const factors: PrimePower[] = []
    let m = n
    let f: Factor = factor(n)
    while (f.factor > one) {
        if (factors.length > 0 && factors.slice(-1)[0].prime === f.factor) {
            factors[factors.length - 1].exponent++
        } else {
            factors.push({
                prime: f.factor,
                exponent: 1,
            })
        }
        
        if (f.message !== "") {
            return {
                factors,
                message: f.message,
                time: getTimeMicro() - start,
            }
        }
        m = m / f.factor
        f = factor(m)
    }
    console.log(factors)

    return {
        factors,
        time: getTimeMicro() - start,
        message: ""
    }
}

// How to get sqrt of a BigInt, found under the link below
// https://stackoverflow.com/a/53684036
function sqrt(value: bigint): bigint {
    if (value < zero) {
        throw 'square root of negative numbers is not supported'
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

export interface PrimePower {
    prime: bigint;
    exponent: number;
}

interface Factorization {

    factors: PrimePower[];
    message: string;
    time: number;
}

interface Factor {
    factor: bigint;
    message: string;
}

const randomFactor = function(n: bigint): Factor {
    console.log("////////////////////////////")
    console.log("Random factor of " + n)
    const m: bigint = sqrt(n)
    let count = 0;
    const MAX = 10**3
    if (isMillerRabinProbablePrime(n) && isBaillieProbablePrime(n)) {
        return {
            factor: n,
            message: ""
        }
    }
    if ([zero, one, two, BigInt(3)].includes(n)) {
        return {
            factor: n,
            message: "",
        }
    }
    if (m === one) {
        return {
            factor: n,
            message: "",
        }
    }
    while (count < MAX) {
        const randomPosibleDivisor: bigint = rand(m.toString().length)
        
        if (one < randomPosibleDivisor && randomPosibleDivisor <= m) {
            if (n % randomPosibleDivisor === zero) {
                return {
                    factor: randomPosibleDivisor,
                    message: "",
                }
            }
            count++;
        }
    }

    return {
        factor: n,
        message: "Max iterations 10**6, no divisors found",
    }
}

// Divide by 2, 3, 5 and 7 and iterate over the possible rests mod 2 * 3 * 5 * 7 = 210

export const factor = function(n: bigint): Factor {
    if (n > 10**10 && isMillerRabinProbablePrime(n) && isBaillieProbablePrime(n)) {
        return {
            factor: n, 
            message: "",
        }
    }

    if ([zero, one].includes(n)) {
        return {
            factor: n,
            message: "",
        }
    }

    const ringSize = BigInt(210)

    const initialPrime = BigInt(11)

    const dividers = [
        0, 2, 6, 8, 12, 18, 20, 26, 30, 32, 36, 42, 48, 50, 56, 60, 62, 68, 72,
        78, 86, 90, 92, 96, 98, 102, 110, 116, 120, 126, 128, 132, 138, 140, 146,
        152, 156, 158, 162, 168, 170, 176, 180, 182, 186, 188, 198, 200
    ].map(n => BigInt(n));

    const firstPrimes = [
        2, 3, 5, 7
    ].map(n => BigInt(n));

    const x: bigint = n
    
    for (var i = 0; i < firstPrimes.length; i++) {
        if (x % firstPrimes[i] === zero) return {factor: firstPrimes[i], message: ""};
    }
    
    const m = sqrt(n);
    for (let i: bigint = initialPrime; i <= m; i += ringSize) {
        if (i > MAX_COMPUTATION_FACTORS) {
            return {
                factor: n,
                message:"Factor " + n + " is not prime"
            }
        }
        for (const a of dividers) {
            if (x % (i + a) === zero) {
                return {
                    factor: i + a,
                    message: ""
                }
            }
        }
    }
    return {
        factor: n,
        message: ""
    };
}

const rand = (length: number): bigint => {
    return  BigInt(id(length))
}