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
    
    for (let i = 3; i <= p; i+=1) {
        s = (s**BigInt(2) - BigInt(2)) % mersenneNumber
    }

    //console.log("finished a worker for " + p)
    
    return {
        isPrime: (s % mersenneNumber === BigInt(0)),
        p: p,
    }
}

parentPort?.postMessage(JSON.stringify(lucasLehmerTest(workerData)));