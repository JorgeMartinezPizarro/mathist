const { parentPort, workerData } = require('worker_threads');

function performComplexCalculation(p) {

    if (p === 2) return true; // 2^2 - 1 = 3 is prime

    if (p <= 1 || p % 2 === 0) return false; // Mersenne number for p <= 1 or even p is not prime

    const mersenneNumber = (BigInt(1) << BigInt(p)) - BigInt(1);

    let s = BigInt(4);
    
    for (let i = 3; i <= p; i+=1) {
        s = (s*s - BigInt(2)) % mersenneNumber
    }
    
    return s % mersenneNumber === BigInt(0)
}

const result = performComplexCalculation(workerData);
parentPort?.postMessage(result);