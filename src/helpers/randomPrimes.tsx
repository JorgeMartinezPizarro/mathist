import { bignumber, isPrime } from "mathjs";

import { isMillerRabinProbablePrime, isBaillieProbablePrime } from "./primalyTests"
import id from '@/helpers/id';
import getTimeMicro from "./getTimeMicro";

// The random generator
// Inspired in https://bigprimes.org/how-it-works
// Be aware above 200 digits it can takes a lot of time
const randomPrimes = (length: number, amount: number) => {
    const start = getTimeMicro();
    // Generate really big primes, above 300 digits it takes long!
    const primes: bigint[] = []
    while (primes.length < amount) {
        const number: bigint = BigInt(id(length))
        // Check the baillie test
        if (isBaillieProbablePrime(number)) {
            primes.push(number)
        }
    }

    primes.forEach(prime => {
        // Check again with baillie and even with a deterministic function
        if (!isMillerRabinProbablePrime(prime) && !isPrime(bignumber(prime.toString()))) {
            throw new Error("Invalid prime generated, what a bad luck!. Prime: " +  prime)
        }
    })
    
    return {
        primes,
        length,
        time: getTimeMicro() - start,
        amount,
    };
}

export default randomPrimes;