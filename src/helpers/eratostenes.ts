import fsS from "fs"

import Bits from "@/helpers/Bits"
import removeFilesAsync from "@/helpers/removeFilesAsync"
import id from "@/helpers/id"
import getTimeMicro from "@/helpers/getTimeMicro";
import {EXCEL_MAX_COLS, EXCEL_MAX_ROWS, MAX_LENGTH_FOR_SIEVE, MAX_NODE_ARRAY_LENGTH, MAX_PRIME_LIST_NODE_MEMORY_SIZE} from "./Constants";

export default (LIMIT: number, amount: number = 10, excel: boolean = false) => {
  if (excel) {
    return convertToExcel(LIMIT)  
  } 
  return eratosthenes(LIMIT, amount)
}

// Convert an array to a CSV compatible with EXCEL
function convertToExcel(LIMIT: number) {
  const elapsed = getTimeMicro();
  const e = eratosthenes(LIMIT, LIMIT)
  const x = e.primes
  const length = e.length

  const filename = id() + ".csv"
  const path = "./public/files/" + filename
  const a: number[][] = Array()
  let b: number[] = Array()

  fsS.writeFileSync(path, "")

  // Split the primes into a matrix of primes
  for (var j = x.length - 1; j>=0; j--) {
    const sieve = x[j]      
    for (var i = sieve.length - 1; i>=0;i--) {
      b.push(sieve[i])
      if (b.length === EXCEL_MAX_COLS || (i===0 && j===0)) {
        if (a.length === EXCEL_MAX_ROWS) {
          throw new Error("Max excel size is " + EXCEL_MAX_ROWS + " x " + EXCEL_MAX_COLS + " cells")
        }  
        a.push(b)
        b = []
      }
    }
  }

  // Write the matrix of primes to a CSV file
  for (var i =0;i<a.length;i++) {
    try {
      fsS.appendFileSync(path, a[i].join(',') + "\r\n");
    } catch (e) {
    }
  }
  
  // Remove files older than 30 minutes to avoid disk full
  try {
    removeFilesAsync('./public/files/', ["csv"], 60 * 30);
  } catch (e) {
    
  }
  
  return {filename, time: getTimeMicro() - elapsed, length};
}

// Enhanced eratosthenes sieve starting with only odd numbers
// It create a matrix of primes to tackle the max value MAX_NODE_ARRAY_LENGTH
// it works for 100m in 500ms, for 1b in 8s, 4b in 36s
// beyond it, there is no way to allocate the sieve in js, unless using the matrix trick

// 375535031 is the max of primes with 2**33 sieve
// 433358501 is the maximun of numbers allowed before memory crash

function eratosthenes(lastNumber: number, amount: number = 10) {
  let elapsed = getTimeMicro()

  if (lastNumber < 0) 
      throw new Error("Cannot get the sieve of negative numbers")

  if (lastNumber === 1) 
      return {primes: [], time: getTimeMicro() - elapsed, length: 0}
  
  if (lastNumber === 2) 
    return {primes: [[2]], time: getTimeMicro() - elapsed, length: 1}
  

  let upperLimit = Math.round(Math.sqrt(lastNumber))
  let memorySize = Math.round(lastNumber / 2);
  let found = new Array()
  let count = 0
  let numberOfPrimes = 1
  let partialPrimes = Array()  
  let sieve = new Bits(0)



  try {
    sieve = new Bits(memorySize);
  } catch (e) {
    throw new Error("Error initializating variables for the sieve! " + e.toString())
  }
  sieve.set(memorySize-1, 1) 
  if (sieve.get(memorySize-1) !== 1) {
    throw new Error("The sieve is buggy with memory size " + memorySize)
  }
  sieve.set(memorySize-1, 0)
  
  // Hard process crossing odd composite numbers
  for (var i = 3; i <= upperLimit; i += 2) {
    if (sieve.get((i -1) / 2) === 0) {
      for (var j = i*i; j <= lastNumber; j += 2*i) {
        sieve.set((j-1)/2, 1)
      }
    }
  }  

  // Convert the sieve to a matrix of primes
  for (var i = memorySize; i >= 1; i-- ) {
    if (i * 2 + 1 <= lastNumber && sieve.get(i) === 0) {
      if (count < amount) {
        try {
          // the number is definetively prime, so push it!
          partialPrimes.push(i*2+1)
          if (i===1 || count === amount - 1) {
              partialPrimes.push(2)
          }
          if (partialPrimes.length === MAX_NODE_ARRAY_LENGTH || i===1 || count === amount - 1) {
            if (partialPrimes.length === MAX_NODE_ARRAY_LENGTH)
              console.log("Using a new array cause the length exceed the max: " + MAX_NODE_ARRAY_LENGTH)
            found.push(partialPrimes)
            partialPrimes = Array()
          }
          count++
        } catch (e) {
          throw new Error("Error push " + count + "th time in array at primes below " + lastNumber + " last prime generated is " + (1 + 2*i))
        }
        // LIMITS BEYOND THE COMPUTATION!
        if (found.length === MAX_NODE_ARRAY_LENGTH) {
          throw new Error("No way to create a matrix bigger than " + MAX_NODE_ARRAY_LENGTH + " x " + MAX_NODE_ARRAY_LENGTH)
        }
        if (count === MAX_PRIME_LIST_NODE_MEMORY_SIZE) {
          throw new Error("More primes in the matrix will throw an OOM Exception, " + MAX_PRIME_LIST_NODE_MEMORY_SIZE)
        }
      }
      numberOfPrimes++;    
    }
  }

  return {primes: found, time: getTimeMicro() - elapsed, length: numberOfPrimes};
}