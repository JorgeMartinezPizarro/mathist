

import { isMillerRabinProbablePrime, isBaillieProbablePrime, isPrimeForSure } from "./primalyTests"
import id from '@/helpers/id';
import getTimeMicro from "./getTimeMicro";
import duration from "./duration";

// The random generator
// Inspired in https://bigprimes.org/how-it-works
const randomPrimes = (length: number, amount: number) => {
    
    const start = getTimeMicro();
    let elapsed = getTimeMicro();
    let countFailedAttemps = 0
    // Generate really big primes, above 300 digits it takes long!
    const primes: bigint[] = []
    const firstCheck = (number: bigint) => number > BigInt(10**6) ? isBaillieProbablePrime(number) : isPrimeForSure(parseInt(number.toString()))
    while (primes.length < amount) {
        const string: string = id(length)
        const number: bigint = BigInt(string)
        // Check the baillie test only if the number did not start with 0
        if (string[0] !== "0" && firstCheck(number)) {
            primes.push(number)
        }
        else {
            countFailedAttemps++;
        }
    }

    console.log("Failed attemps " + countFailedAttemps + " in " + duration(getTimeMicro() - elapsed) + ", now check with another primality test")
    elapsed = getTimeMicro();
    
    primes.forEach(prime => {
        // Test with miller-rabin
        if (!isMillerRabinProbablePrime(prime)) {
            throw new Error("Did not pass the second test! Composite: " +  prime)
        }
    })

    console.log("Validating primality for " + duration(getTimeMicro() - elapsed))
    
    return {
        primes,
        length,
        time: getTimeMicro() - start,
        amount,
    };
}

export default randomPrimes;