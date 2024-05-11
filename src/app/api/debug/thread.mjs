import { workerData, parentPort } from 'worker_threads';

// Each LLT is executed in a thread.
function computeLLT(workerData) {
  
  const p = workerData
    
  if (p === 2) return {p: 2, isPrime: true}; // 2^2 - 1 = 3 is prime

  if (p <= 1 || p % 2 === 0) return {p, isPrime: false}; // Mersenne number for p <= 1 or even p is not prime

  const mersenneNumber = (BigInt(1) << BigInt(p)) - BigInt(1);

  let s = BigInt(4);
  
  for (let i = 3; i <= p; i+=1) {
      s = (s**BigInt(2) - BigInt(2)) % mersenneNumber
  }

  const isPrime = (s % mersenneNumber === BigInt(0))

  // Simulate some processing time
  return {
    p: workerData,
    isPrime: isPrime
  }
}

// Execute the task and send back the result to the parent thread
parentPort.postMessage(computeLLT(workerData));
