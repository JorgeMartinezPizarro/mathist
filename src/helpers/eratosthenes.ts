import fs from "fs"

import { EXCEL_MAX_COLS, EXCEL_MAX_ROWS, MAX_ALLOCATABLE_ARRAY, MAX_CLASSIC_SIEVE_LENGTH, MAX_DISPLAY_SIEVE, MAX_SUPPORTED_PARTIAL_SIEVE_LENGTH, MAX_SUPPORTED_SIEVE_LENGTH } from "@/Constants";
import getTimeMicro from "@/helpers/getTimeMicro";
import duration from "@/helpers/duration";
import toHuman from "@/helpers/toHuman";
import id from "@/helpers/id";
import errorMessage from "@/helpers/errorMessage";
import percent from "@/helpers/percent";
import { SieveReport } from "@/types";
import Bits from "@/helpers/Bits";
import { sqrt } from "./math";
import isProbablePrime from "./isProbablePrime";

const [zero, one, two]: bigint[] = [0, 1, 2 ,3].map(n => BigInt(n))

// Get primes or write primes to a file and get the link.
// primesToExcel works MAX value 10**12, 452GB.
// primesToExcel works up to 10**8 48MB less than a second.
// lastTenEratosthenes works well up to 10**16 generating last primes in less than a second.
// classicOrSegmentedEratosthenes works up to 10**13
//
function eratosthenes(LIMIT: number, amount: number = MAX_DISPLAY_SIEVE, excel: boolean = false): SieveReport {
  if (excel) {
    return primesToExcel(LIMIT)
  } 
  
  return classicOrSegmentedEratosthenes(LIMIT, amount)
}

function lastTenEratosthenes(LIMIT: bigint): SieveReport {
  if (LIMIT > MAX_SUPPORTED_PARTIAL_SIEVE_LENGTH) {
    throw new Error("lastTenEratosthenes can be run with a max value of " + MAX_SUPPORTED_PARTIAL_SIEVE_LENGTH)
  }

  if (LIMIT < 10**6)
    return segmentedEratosthenes(Number(LIMIT), 10)
  else 
    return segmentedEratosthenesPartial(LIMIT - BigInt(10**4), LIMIT)
}

function lastTenGenerated(LIMIT: bigint): SieveReport {

  const start = getTimeMicro()
  const primesArray = new Array();

  let bigNumber = LIMIT % two === zero ? LIMIT - one : LIMIT
  
  process.stdout.write("\r");
  process.stdout.write("\r");
  process.stdout.write("BF: Sieved   0.000% in " + (duration(getTimeMicro() - start)) + "       ")

  while (primesArray.length < 10 && bigNumber >= BigInt(3)) {
    if (isProbablePrime(bigNumber)) {
      primesArray.push(bigNumber)
      process.stdout.write("\r");
      process.stdout.write("\r");
      process.stdout.write("BF: Sieved " + percent(BigInt(primesArray.length), BigInt(10)) + " in " + (duration(getTimeMicro() - start)) + "       ")
    }
    bigNumber-=two
  }

  if (primesArray.length < 10 && LIMIT >= BigInt(2))
    primesArray.push(2)
  
  process.stdout.write("\r");
  process.stdout.write("\r");
  process.stdout.write("BF: Sieved 100.000% in " + (duration(getTimeMicro() - start)) + "                 \n")

  return {
    primes: primesArray.reverse(),
    filename: "",
    length: primesArray.length,
    isPartial: true,
    time: getTimeMicro() - start,
  }
}

// Use the iterator for primes and primesTOExcel. It is 10 times faster than the classic sieve for values from 10**12
function segmentedEratosthenesIterator(n: number, callback: any): void {
  
  const startx = getTimeMicro()

  const nsqrt = Math.floor(Math.sqrt(n));
  const initialSieveSize = nsqrt
  const segmentSize = initialSieveSize
  const firstPrimes = classicOrSegmentedEratosthenes(initialSieveSize + 1, initialSieveSize + 1).primes.map(prime => Number(prime))
  process.stdout.write("\r");
  process.stdout.write("\r");
  process.stdout.write("SS: Sieved   0.000% in " + (duration(getTimeMicro() - startx)) + "       ")
  
  const bloque: boolean[] = new Array(segmentSize)

  const segmentsNumber = Math.round(n / segmentSize)

  for (let k = 0; k <= segmentsNumber; k++) {
      bloque.fill(true)
      const start = k * segmentSize;
      for (const p of firstPrimes) {
          const startIdx = Math.max(Math.floor((start + p - 1) / p), p) * p - start;
          for (let j = startIdx; j < segmentSize; j += p)
              bloque[j] = false;
      }
      if (k === 0) {
          bloque[0] = false;
          bloque[1] = false;
      }
      for (let i = 0; i < segmentSize && start + i <= n; i++) {
          if (bloque[i]) {
              callback(start + i)
          }
      }

      process.stdout.write("\r");
      process.stdout.write("\r");
      process.stdout.write("SS: Sieved " + percent(BigInt(k), BigInt(segmentsNumber)) + " in " + (duration(getTimeMicro() - startx)) + "       ")
  }

  process.stdout.write("\r");
  process.stdout.write("\r");
  process.stdout.write("SS: Sieved 100.000% in " + (duration(getTimeMicro() - startx)) + "                 \n")
}

function classicEratosthenesIterator(n: number, callback: any): void {
    const lastNumber = n
    const startx = getTimeMicro()

    callback(2);
    
    if (lastNumber === 2) {
      return;
    }
  
    try { 
        // Initialization
        const memorySize = Math.round(lastNumber / 2);
        const upperLimit = Math.round(Math.sqrt(lastNumber));
        const sieve: Bits = new Bits(memorySize)

        process.stdout.write("\r");
        process.stdout.write("\r");
        process.stdout.write("ES: Sieved   0.000% in " + duration(getTimeMicro() - startx) + "        ")     

        // Hard process crossing all odd composite numbers
        for (var i = 3; i <= upperLimit; i += 2) {
          if (sieve.getBit((i -1) / 2) === 0) {
            for (var j = i * i; j <= lastNumber; j += 2 * i) {
              sieve.setBit((j - 1) / 2, true);
            }

            process.stdout.write("\r");
            process.stdout.write("\r");
            process.stdout.write("ES: Sieved " + percent(BigInt(Math.round(i)), BigInt(Math.round(upperLimit))) + " in " + duration(getTimeMicro() - startx) + "        ")
          }          
        }
        process.stdout.write("\r");
        process.stdout.write("\r");
        process.stdout.write("ES: Sieved  99.999% in " + duration(getTimeMicro() - startx) + "              ")
        
        for (var i = 1; i< sieve.length();i++) {
          if (2*i+1 <=n && sieve.getBit(i) === 0) {
            callback(2 * i + 1)
          }
        }

        process.stdout.write("\r");
        process.stdout.write("\r");
        process.stdout.write("ES: Sieved 100.000% in " + duration(getTimeMicro() - startx) + "              \n")
  
    } catch (error) {
      const text = "sieve(" + lastNumber + "), " + errorMessage(error);
      throw new Error(text);
    }
}

function segmentedEratosthenes(n: number, amount: number = MAX_DISPLAY_SIEVE): SieveReport {
  
  const start = getTimeMicro()
  let result: number[] = new Array()
  let resultado = 0;

  segmentedEratosthenesIterator(n, (prime: number) => {
    resultado++;
    try {
      if (result.length === Math.max(10**7, amount))
        result = result.slice(-amount)
      result.push(prime)
    } catch (e) {
      throw new Error("Error pushing to primes array with length " + result.length + ", " + errorMessage(e))  
    }
  })
  
  return {
    primes: result.slice(-amount),
    length: resultado,
    filename: "",
    time: getTimeMicro() - start,
    isPartial: false
  };
}

// Get part of the segmentedEratosthenes only
function segmentedEratosthenesPartial(low: bigint, high: bigint, maxLength: number = 10): SieveReport {
  const maxSS = MAX_SUPPORTED_PARTIAL_SIEVE_LENGTH
  if (high > maxSS) {
    throw new Error("Max value for segmented sieve is " + maxSS)
  } else if (high - low > 10**6) {
    throw new Error("It would take a lot of time!")
  }

  const startx: number = getTimeMicro();
  const sieveSize = Number(sqrt(high)) + 1
  const segmentSize = Math.min(sieveSize, Number(high - low) + 1); // Size of each segment
  const numSegments = Math.ceil((Number(high - low) + 1) / segmentSize); // Number of segments
  const primesToRoot = classicOrSegmentedEratosthenes(sieveSize, sieveSize).primes;
  let primesInRange: bigint[] = new Array();
  let count = 0

  process.stdout.write("\r");
  process.stdout.write("\r");
  process.stdout.write("PS: Sieved   0.000% in " + (duration(getTimeMicro() - startx)) + "      ")
  
  // Iterate over each segment
  for (let segment = 0; segment < numSegments; segment++) {
      const start = low + BigInt(segment) * BigInt(segmentSize);
      const end = low + BigInt(segment + 1) * BigInt(segmentSize);
      const sieve: Bits = new Bits(segmentSize)
      // Sieve the segment using primes from the base sieve
      for (const t of primesToRoot) {
          const p = BigInt(t)
          const startIdx = p >= start ? p : start + (p - start % p) % p; // Start at the smallest multiple of p >= start
          for (let j = startIdx; j < end; j += p) {
              sieve.setBit(Number(j - start), true); // Mark multiples of prime as composite
          }
      }
      // Store primes found in this segment
      for (let i = 0; i < segmentSize; i++) {
          if (!sieve.getBit(i) && (start + BigInt(i)) !== BigInt(1)) { // Skip 1 as it's not a prime
              if (start + BigInt(i) <= high && start + BigInt(i) >= low) {
                count++;
                if (primesInRange.length > 2*maxLength) {
                  primesInRange = primesInRange.slice(-maxLength)
                }
                primesInRange.push(start + BigInt(i));
              }
          }
      }
      
      primesInRange = primesInRange.slice(-maxLength);
      process.stdout.write("\r");
      process.stdout.write("\r");
      process.stdout.write("PS: Sieved " + percent(BigInt(segment + 1), BigInt(numSegments)) + " in " + (duration(getTimeMicro() - startx)) + "      ")
  }

  process.stdout.write("\r");
  process.stdout.write("\r");
  process.stdout.write("PS: Sieved 100.000% in " + (duration(getTimeMicro() - startx)) + "      \n")

  return {
    isPartial: true,
    primes: primesInRange.slice(-maxLength),
    filename: "",
    time: getTimeMicro() - startx,
    length: count
  }
}

// Create excel file with primes up to LIMIT
function primesToExcel(LIMIT: number): SieveReport {

  console.log("Requesting excel file primes-to-" + LIMIT + ".csv")
  
  if (isNaN(LIMIT)) {
    throw new Error("Invalid length " + LIMIT)
  }

  if (LIMIT < 2) {
    throw new Error("Generated an empty file ...")
  }

  if (LIMIT > MAX_SUPPORTED_SIEVE_LENGTH) {
    throw new Error("That generates over 500GB primes, aborted.")
  }

  const elapsed = getTimeMicro()
  const root = "./public/files/"
  const filename = "primes-to-" + LIMIT + "-hash-" + id(20) + ".csv"
  const path = root + filename;

  let line = new Array();
  let rows = 0;
  let length = 0;
  
  // Create the file
  fs.writeFileSync(path, "")

  const primesIterator = LIMIT > MAX_CLASSIC_SIEVE_LENGTH ? segmentedEratosthenesIterator : classicEratosthenesIterator

  primesIterator(LIMIT, (p: number) => {
    line.push(p)
    length++
    if (line.length === EXCEL_MAX_COLS) {
      try {
        fs.appendFileSync(path, line.join(',') + "\r\n");
      } catch (error) {
        const message = "Error writting to file " + path + ", " + errorMessage(error)
        throw new Error(message)
      }
      rows++;
      // Max excel file size
      if (rows === EXCEL_MAX_ROWS) {
        console.log("Warning. The file cannot be open with Excel. Max cells count " + (EXCEL_MAX_ROWS* EXCEL_MAX_COLS) + ", last prime fit into Excel " + line.slice(-1))
      }
      line = new Array()
    }
  })

  // append the rest 
  fs.appendFileSync(path, line.join(',') + "\r\n");
  
  var stats = fs.statSync(path);
  var fileSizeInBytes = stats.size;

  console.log("Finished writting " + toHuman(fileSizeInBytes) + " of primes in " + duration(getTimeMicro() - elapsed));
  
  return {filename: "/files/" + filename, time: getTimeMicro() - elapsed, length, primes: [], isPartial: false};
}

// Count primes and return count and last amount primes using classic or segmented sieve depending on the size
function classicOrSegmentedEratosthenes(lastNumber: number, amountX: number = MAX_DISPLAY_SIEVE): SieveReport {

  const amount = Math.min(2 * Math.round(lastNumber / Math.log(lastNumber)), amountX)
  const elapsed = getTimeMicro()

  if (isNaN(lastNumber)) {
    throw new Error("Invalid length " + lastNumber)
  }
  if (amount > MAX_ALLOCATABLE_ARRAY) {
    throw new Error("Such a big array of primes may not fit in memory, max " + MAX_ALLOCATABLE_ARRAY)
  }
  if (lastNumber < 0) {
    throw new Error("Cannot get the sieve of negative numbers")
  }
  if (lastNumber === 1 || lastNumber === 0) {
    return {primes: [], time: getTimeMicro() - elapsed, length: 0, filename: "", isPartial: false}
  }  
  if (lastNumber === 2) {
    return {primes: [2], time: getTimeMicro() - elapsed, length: 1, filename: "", isPartial: false}
  } 
  
  let arrayOfPrimes: number[] = new Array()
  let numberOfPrimes = 0
  
  const primesIterator = lastNumber > MAX_CLASSIC_SIEVE_LENGTH ? segmentedEratosthenesIterator : classicEratosthenesIterator
  
  primesIterator(lastNumber, (p: number) => {
    try {
      if (arrayOfPrimes.length === Math.max(10**7, amount)) {
        arrayOfPrimes = arrayOfPrimes.slice(-amount)
      }
      arrayOfPrimes.push(p)
      numberOfPrimes++
    } catch (e) {
      throw new Error("Error push " + arrayOfPrimes.length + "-th time in array at primes below " + lastNumber + " last prime generated is " + p + ". " + errorMessage(e))
    }
  })

  return {filename: "", primes: arrayOfPrimes.slice(-amount), time: getTimeMicro() - elapsed, length: numberOfPrimes, isPartial: false};
}

export default eratosthenes;

export { lastTenGenerated, lastTenEratosthenes, segmentedEratosthenes, classicOrSegmentedEratosthenes }
