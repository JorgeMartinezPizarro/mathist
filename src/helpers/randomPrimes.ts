import { isMillerRabinProbablePrime, isBaillieProbablePrime, isPrimeForSure } from "@/helpers/isProbablePrime"
import id from '@/helpers/id';
import getTimeMicro from "@/helpers/getTimeMicro";
import { RandomPrimesReport } from "@/types";

// The random generator
// Inspired in https://bigprimes.org/how-it-works
const randomPrimes = (length: number, amount: number): RandomPrimesReport => {
    
    if (length < 1 || amount < 1) {
        return {
            tries: 0,
            primes: [],
            length: length,
            time: 1,
            amount: amount,
        }
    }

    const start = getTimeMicro();
    let elapsed = getTimeMicro();
    let countFailedAttemps = 0
    const primes: bigint[] = []
    
    // For low values the tests are not efficient, so we do a hard check
    const firstCheck = (number: bigint) => number > BigInt(10**9) ? isBaillieProbablePrime(number) : isPrimeForSure(parseInt(number.toString()))
    let tries = 0;
    while (primes.length < amount) {
        const string: string = id(length)
        const firstDigit: string = string[0]
        const lastDigit: string = string.slice(-1)[0]
        // Ignore even numbers, multiples of 5 and numbers starting with 0
        if (length === 1 || firstDigit !== "0" && !["0", "2", "4", "5", "6", "8"].includes(lastDigit) ) {
            // Test with baillie
            const number: bigint = BigInt(string)
            if (firstCheck(number)) {
                primes.push(number)
            } else {
                countFailedAttemps++;
            }
            tries++
        }        
    }

    elapsed = getTimeMicro();
    
    primes.forEach(prime => {
        // Test with miller-rabin
        if (!isMillerRabinProbablePrime(prime)) {
            throw new Error("Did not pass the second test! Composite: " +  prime)
        }
    })

    return {
        primes,
        length,
        time: getTimeMicro() - start,
        amount,
        tries,
    };
}

export default randomPrimes;