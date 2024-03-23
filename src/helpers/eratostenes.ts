export default (LIMIT: number) => {
    
    return eratostenes(LIMIT);
}

const eratostenes = (LIMIT:number): number[] => {

    if (LIMIT < 1) return []
    
    let upperLimit = Math.round(Math.sqrt(LIMIT))
    
    let arr: boolean[] = new Array(LIMIT).fill(true);

    for (var i = 2; i <= upperLimit; i++) { 
        if (arr[i]) { 
            console.log(i, "Is prime!")
            for (var j = 2 * i; j < LIMIT; j += i) { 
                arr[j] = false; 
            }
        }
    }

    console.log(arr)

    const primes: number[] = []

    for (var i = 2; i <= LIMIT; i++) {
        if (arr[i]) {
            primes.push(i)
        }
    }  

    return primes;
}





//[1 3 5 7 9 11 13 15 17]