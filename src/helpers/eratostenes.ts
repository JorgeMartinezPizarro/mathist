import Bits from "@/helpers/Bits"

export default (LIMIT: number) => {
    return eratostenes(LIMIT);
}

// Improve by getting an array of only odd numbers
const eratostenes = (LIMIT:number): number[] => {
    if (LIMIT < 1 || parseInt(LIMIT.toString()) - LIMIT !== 0) return []

    var bits = new Bits(LIMIT, 1)
    
    let upperLimit = Math.round(Math.sqrt(LIMIT))
    
    const primes: number[] = []

    bits.set(0, 0);
    bits.set(1, 0);

    for (var i = 0; i <= upperLimit; i += 1) { 
        if (bits.get(i) === 1) { 
            for (var j = i * i; j <= LIMIT; j += i) { 
                bits.set(j, 0)
            }
        }
    }
    
    for (var i = 0; i < LIMIT; i++) {
        if (bits.get(i) === 1) {
            primes.push(i)
        }
    }

    return primes;
}