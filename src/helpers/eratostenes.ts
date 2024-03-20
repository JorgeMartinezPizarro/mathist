export default (LIMIT: number) => {
    let upperLimit = Math.sqrt(LIMIT)

    let arr = new Array(LIMIT).fill(true);

    for (var i = 2; i <= upperLimit; i++) { 
        if (arr[i]) { 
        for (var j = i * i; j < LIMIT; j += i) { 
            arr[j] = false; 
        }
        }
    }

    const primes = []
    for (var i = 2; i <= LIMIT; i++) {
        if (arr[i]) {
        primes.push(i)
        }
    }  

    return primes;
}