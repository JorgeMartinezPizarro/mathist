import gcd from "@/helpers/gcd"
import { isMillerRabinProbablePrime, isBaillieProbablePrime } from "@/helpers/primalyTests"
import getTimeMicro from '@/helpers/getTimeMicro';
import { MAX_COMPUTATION_FACTORS } from "@/Constants";
import { Factor, Factorization, PrimePower } from "@/types"
import { abs, min, sqrt } from "@/helpers/math";
import Eratosthenes from "./Eratosthenes";

const [zero, one, two]: bigint[] = [0, 1, 2 ,3].map(n => BigInt(n))

// TODO implement the gnfs algorithm
//
// https://stackoverflow.com/a/2274520/4219083
//
export default function factors(n: bigint ): Factorization {
    
    const start = getTimeMicro()

    console.log("///////////////////////////////////////////////")
    console.log("Getting factors of " + n)
    
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
        if (f.message.includes("The factor " + f.factor + " is not prime.")) {
            // Enought with trial division, now try brent algorithm
            console.log("Give up with bruce force, try the Brent factoring algorithm")
            // brentFactor
            addFactorsWithMethod(factors, f.factor, brentFactor)
            factors.sort((a: PrimePower,b: PrimePower ) => Number(a.prime - b.prime))
            return {
                factors,
                message: "",
                time: getTimeMicro() - start,
            }
        }
        addPrime(factors, f.factor)
        m = m / f.factor
        f = factor(m)
    }

    return {
        factors,
        time: getTimeMicro() - start,
        message: ""
    }
}

function addFactorsWithMethod(factors: PrimePower[], factor: bigint, factorizationMethod: any) {
    const computedFactor = factorizationMethod(factor)
    console.log("Found a factor " + computedFactor)
    if (computedFactor !== factor) {
        let c = 1
        let p: bigint = computedFactor
        let rest = factor / p
        if (isBaillieProbablePrime(p) && isMillerRabinProbablePrime(p)) {
            addPrime(factors, p)
        }
        while (p > two && !isMillerRabinProbablePrime(rest) && isMillerRabinProbablePrime(p)) {
            
            p = factorizationMethod(rest)
            rest = rest / p;
            c++
            console.log("Found another factor " + p)
            addPrime(factors, p)
        }
        
        addPrime(factors, rest)
    }
}

function addPrime(factors: PrimePower[], factor: bigint): void {
    
    if (factors.length > 0 && factors.slice(-1)[0].prime === factor) {
        factors[factors.length - 1].exponent++;
    } else {
        factors.push({
            prime: factor,
            exponent: 1
        })
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

    for (var i = 0; i < firstPrimes.length; i++) {
        if (n % firstPrimes[i] === zero) {
            console.log("Found a factor " + firstPrimes[i])
            return {factor: firstPrimes[i], message: ""};
        }
    }
    
    const m = sqrt(n);

    for (let i: bigint = initialPrime; i <= m; i += ringSize) {
        if (i > MAX_COMPUTATION_FACTORS) {
            const message = "The factor " + n + " is not prime. We give up by i = " + i;
            console.log(message)
            return {
                factor: n,
                message, 
            }
        }
        for (const a of dividers) {
            // Only check divisibility by biggers than last prime to save time
            if (n % (i + a) === zero) {
                console.log("Found a factor " + (i + a))
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

const brentFactor = (n: bigint): bigint => {
    
    const s = sqrt(n)

    // If it is a square return the root
    if (s * s - n === zero) {
        return s;
    }
 
    if (n <= 0) throw new Error("Invalid n = " + n)

    if (n % two === zero) return two; // If n is even, return 2

    let x = two;
    let y = two;
    let d = one;

    const f = (x: bigint): bigint => (x * x + one) % n;

    while (d === one) {
        x = f(x);
        y = f(f(y));
        d = gcd(abs(x - y), n);
    }

    if (d === n) {
        // Retry with different starting point if failed
        x = two;
        y = two;
        d = one;
        while (d === one) {
            x = f(x) % n;
            y = f(y) % n;
            d = gcd(abs(x - y), n);
        }
    }

    if (d === n) {
        throw new Error("Factor found itself ... failed brent")
        return d;
    }

    const factor = min(d, n / d)
    
    if (!isMillerRabinProbablePrime(factor) || !isBaillieProbablePrime(factor)) {
        throw new Error("Factor is not prime, should we iterate to find more?")
    }

    return factor;
}