const { parentPort, workerData } = require('worker_threads');

function performComplexCalculation(data) {
    return data**BigInt(2)
}

const result = performComplexCalculation(workerData);
parentPort?.postMessage(result);