import Bits from "@/helpers/BitArray"
import getTimeMicro from "@/helpers/getTimeMicro";

export default (LIMIT: number) => {
    return eratostenes(LIMIT);
}

// Improve by getting an array of only odd numbers
const eratostenes = (LIMIT:number) => {
    const start = getTimeMicro()
    
    if (LIMIT < 0) 
        throw new Error("Cannot get the sieve of negative numbers")
    if (LIMIT <= 1) 
        return {primes: [], time: 0}

    const primes: number[] = [2]

    var bits = new Bits(LIMIT);
    let upperLimit = Math.round(Math.sqrt(LIMIT))
    
    bits.set(0, 1);
    bits.set(1, 1);

    for (var i = 0; i < upperLimit; i += 1)  
        if (bits.get(i) === 0)
            for (var j = i * i; j <= LIMIT; j += i)  
                bits.set(j, 1)
    
    for (var i = 3; i <= LIMIT; i+=2) 
        if (bits.get(i) === 0) 
            primes.push(i)
        
    return {primes: primes, time: getTimeMicro() - start};
}