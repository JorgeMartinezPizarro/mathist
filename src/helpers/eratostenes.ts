import Bits from "@/helpers/Bits"

export default (LIMIT: number) => {
    console.log(LIMIT)
    return eratostenes(LIMIT);
}

// Improve by getting an array of only odd numbers
const eratostenes = (LIMIT:number) => {
    var hrTime = process.hrtime()
    const a = hrTime[0] * 1000000 + hrTime[1] / 1000
    if (LIMIT < 1 || parseInt(LIMIT.toString()) - LIMIT !== 0) return []

    var bits = new Bits(LIMIT, 1)
    
    let upperLimit = Math.round(Math.sqrt(LIMIT))
    
    const primes: number[] = [2]
    
    bits.set(0, 0);
    bits.set(1, 0);
    
    for (var i = 0; i <= upperLimit; i += 1) { 
        if (bits.get(i) === 1) { 
            for (var j = i * i; j <= LIMIT; j += i) { 
                bits.set(j, 0)
            }
        }
    }
    
    // Iterate over odds (even are all not prime except 2)
    for (var i = 3; i < LIMIT; i+=2) {
        if (bits.get(i) === 1) {
            primes.push(i)
        }
    }

    var hrTime = process.hrtime()
    const b = hrTime[0] * 1000000 + hrTime[1] / 1000

    return {primes, time: Math.round(b - a)};
}