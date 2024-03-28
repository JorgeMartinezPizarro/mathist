import Bits from "@/helpers/Bits"
import getTimeMicro from "@/helpers/getTimeMicro";

export default (LIMIT: number) => {
    return eratostenes(LIMIT);
}

// Improve by getting an array of only odd numbers
const eratostenes = (LIMIT:number) => {
    const start = getTimeMicro()

    if (LIMIT <= 1 || parseInt(LIMIT.toString()) - LIMIT !== 0) return {primes: [], time: 0}

    var bits = new Bits(LIMIT, 1)
    
    let upperLimit = Math.round(Math.sqrt(LIMIT))

    bits.set(0, 0);
    bits.set(1, 0);
    
    for (var i = 0; i <= upperLimit; i += 1) { 
        if (bits.get(i) === 1) { 
            for (var j = i * i; j <= LIMIT; j += i) { 
                bits.set(j, 0)
            }
        }
    }

    const primes: number[] = [2]
    
    // Iterate over odds (even are all not prime except 2)
    for (var i = 3; i <= LIMIT; i+=2) {
        if (bits.get(i) === 1) {
            primes.push(i)
        }
    }

    return {primes, time: getTimeMicro() - start};
}