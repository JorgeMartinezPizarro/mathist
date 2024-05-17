import { workerData, parentPort } from 'worker_threads';
import bigInt from "big-integer";

function prpTest(p) {
  
  let x = BigInt(3);
  const m = BigInt(2) ** BigInt(p) - BigInt(1); // Mersenne number

  // Iterate the PRP test
  for (let i = 1; i <= p; i++) {
      x = (x ** BigInt(2)) % m;
  }

  // Check if the result is probably prime
  return x === BigInt(9);
}

function hasSmallFactors(p) {
  const mersenneNumber = (BigInt(1) << BigInt(p)) - BigInt(1);
  const s = Math.round(Math.sqrt(p))
  for (var i = 3; i<=10000 && i<=s; i+=2) {
    if (mersenneNumber % BigInt(i) === BigInt(0)) {
      return true
    }
  }
  return false
}

// Each LLT is executed in a thread.
function computeLLT(workerData) {
  
  const p = workerData

  if (p === 2 || p === 3) return {p, isPrime: true}; // 2^2 - 1 = 3 is prime

  if (p <= 1 || p % 2 === 0) return {p, isPrime: false}; // Mersenne number for p <= 1 or even p is not prime

  if (hasSmallFactors(p) || !prpTest(p)) {
    return {
      p,
      isPrime: false
    }
  }
    
  const mersenneNumber = (BigInt(1) << BigInt(p)) - BigInt(1);
  
  let s = BigInt(4);
  
  for (let i = 3; i <= p; i+=1) {
      s = (s**BigInt(2) - BigInt(2)) % mersenneNumber
  }

  const isPrime = (s % mersenneNumber === BigInt(0))

  return {
    p: workerData,
    isPrime: isPrime
  }
}

// Execute the task and send back the result to the parent thread
parentPort.postMessage(computeLLT(workerData));
