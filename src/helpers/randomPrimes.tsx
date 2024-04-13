import { bignumber, isPrime } from "mathjs";

import { isMillerRabinProbablePrime, isBaillieProbablePrime } from "./primalyTests"
import id from '@/helpers/id';
import getTimeMicro from "./getTimeMicro";
import duration from "./duration";
import { FALSE_BIG_PRIME } from "./Constants";
import string from "./string";

// The random generator
// Inspired in https://bigprimes.org/how-it-works
// Be aware above 200 digits it can takes a lot of time
const randomPrimes = (length: number, amount: number) => {

    const start = getTimeMicro();

    // FALSE_BIG_PRIME is a coincidence!
    
    /*const a = isPrime(bignumber(FALSE_BIG_PRIME.toString())) ? "is prime" : "is not prime"

    const b = isMillerRabinProbablePrime(FALSE_BIG_PRIME) && isBaillieProbablePrime(FALSE_BIG_PRIME) ? "passed the tests" : "did not pass the tests"
    
    console.log("The number " + string(FALSE_BIG_PRIME) + " " + a + " but " + b, " took " + duration(getTimeMicro() - start))*/
    
    let elapsed = getTimeMicro();
    let countFailedAttemps = 0
    // Generate really big primes, above 300 digits it takes long!
    const primes: bigint[] = []
    while (primes.length < amount) {
        const string: string = id(length)
        const number: bigint = BigInt(string)
        // Check the baillie test only if the number did not start with 0 or is even
        const firstCheck = (number: bigint) => number > 1000 ? isBaillieProbablePrime(number) : isPrime(parseInt(number.toString()))
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
            throw new Error("Invalid prime generated, what a bad luck!. Composite: " +  prime)
        }
        // A deterministic check would be cool but after 30 digits it takes years
        /*if (!isPrime(bignumber(prime.toString()))) {
            throw new Error("Invalid prime generated, what a bad luck!. Composite: " +  prime)
        }*/
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