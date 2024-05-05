const { parentPort, workerData } = require('worker_threads');

function lucasLehmerTest(p) {
    if (p === 2) return {
        isPrime: true,
        p,   
    }

    if (p <= 1 || p % 2 === 0) return {
        isPrime: false,
        p,
    }

    const mersenneNumber = (BigInt(1) << BigInt(p)) - BigInt(1);

    let s = BigInt(4);
    
    const recursion = (i, s) => {
        if (i > p) return s;
        return recursion(i + BigInt(1), (s * s - BigInt(2)) % mersenneNumber);
    };

    s = recursion(BigInt(3), s);

    return {
        isPrime: (s % mersenneNumber === BigInt(0)),
        p: p,
    };
}

parentPort.postMessage(lucasLehmerTest(workerData));