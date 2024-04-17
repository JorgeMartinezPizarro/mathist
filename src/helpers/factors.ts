import gcd from "@/helpers/gcd"
import { isMillerRabinProbablePrime, isBaillieProbablePrime } from "@/helpers/primalyTests"
import getTimeMicro from '@/helpers/getTimeMicro';
import { MAX_COMPUTATION_FACTORS } from "@/Constants";
import { Factor, Factorization, PrimePower } from "@/types"

const [zero, one, two, three]: bigint[] = [0, 1, 2 ,3].map(n => BigInt(n))

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
        if (factors.length > 0 && factors.slice(-1)[0].prime === f.factor) {
            factors[factors.length - 1].exponent++
        } else {
            factors.push({
                prime: f.factor,
                exponent: 1,
            })
        }
        
        if (f.message === "The factor " + f.factor + " is not prime.") {
            // Enought with trial division, now try brent algorithm
            console.log("Give up with bruce force, try brent factoring algorithm")
            const brentFactor = brentFactorization(f.factor)
            console.log("Found a factor " + brentFactor)
            if (brentFactor !== f.factor) {
                factors.pop();
                let c = 1
                let p = brentFactor
                let rest = f.factor / p
                if (isBaillieProbablePrime(p) && isMillerRabinProbablePrime(p)) {
                    addPrime(factors, p)
                }
                while (!isBaillieProbablePrime(p) || !isMillerRabinProbablePrime(p)) {
                    addPrime(factors, p)
                    rest = rest / p;
                    p = brentFactorization(rest)
                    c++
                }
                
                addPrime(factors, rest)
            }
            return {
                factors,
                message: "",
                time: getTimeMicro() - start,
            }
        }
        m = m / f.factor
        f = factor(m)
    }
    
    return {
        factors,
        time: getTimeMicro() - start,
        message: ""
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

// How to get sqrt of a BigInt, found under the link below
// https://stackoverflow.com/a/53684036
function sqrt(value: bigint): bigint {
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

    for (let i: bigint = BigInt(11); i <= m; i += ringSize) {
        if (i > MAX_COMPUTATION_FACTORS) {
            return {
                factor: n,
                message: "The factor " + n + " is not prime."
            }
        }
        for (const a of dividers) {
            // Only check divisibility by biggers than last prime to save time
            if (x % (i + a) === zero) {
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

const brentFactorization = (n: bigint): bigint => {
    
    const s = sqrt(n)

    // If it is a square return the root
    if (s * s - n === zero) {
        return s;
    }
 
    if (n <= 0) throw new Error("Invalid n = " + n)

    if (n % two === zero) return two; // If n is even, return 2 and n/2

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
            x = (x * x + one) % n;
            y = (y * y + one) % n;
            d = gcd(abs(x - y), n);
        }
    }

    return d;
}

const abs = (n: bigint): bigint => {
    if (n < zero)
        return -n;
    return n;
}