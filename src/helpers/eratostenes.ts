import BitArray from "@/helpers/BitArray"

export default (LIMIT: number) => {

    return eratostenes(LIMIT);
}

const eratostenes = (LIMIT:number): number[] => {

    if (LIMIT < 1) return []

    var b: BitArray = new BitArray(LIMIT, 1);

    let upperLimit = Math.round(Math.sqrt(LIMIT))
    
    const primes: number[] = []

    for (var i = 2; i <= upperLimit; i++) { 
        if (b.get(i) === 1) { 
            for (var j = i * 2; j < LIMIT; j += i) { 
                b.set(j, 0)
            }
        }
    }

    for (var i = 2; i < LIMIT; i++) {
        if (b.get(i) === 1) {
            primes.push(i)
        }
    }  

    return primes;
}