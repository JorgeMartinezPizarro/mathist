export default (LIMIT: number) => {
    
    return eratostenes(LIMIT);
}

const eratostenes = (LIMIT:number): number[] => {

    if (LIMIT < 1) return []
    
    let upperLimit = Math.round(Math.sqrt(LIMIT))
    
    let arr: boolean[] = new Array(LIMIT).fill(true);

    const primes: number[] = []

    for (var i = 2; i <= upperLimit; i++) { 
        if (arr[i]) { 
            for (var j = 2 * i; j < LIMIT; j += i) { 
                arr[j] = false; 
            }
        }
    }
    
    for (var i = 2; i <= LIMIT; i++) {
        if (arr[i]) {
            primes.push(i)
        }
    }  

    return primes;
}