import fs from "fs"

import {EXCEL_MAX_COLS, EXCEL_MAX_ROWS, MAX_ALLOCATABLE_ARRAY, MAX_CLASSIC_SIEVE_LENGTH, MAX_DISPLAY_SIEVE, MAX_HEALTHY_SEGMENTED_SIEVE_LENGTH} from "@/Constants";
import getTimeMicro from "@/helpers/getTimeMicro";
import duration from "@/helpers/duration";
import toHuman from "@/helpers/toHuman";
import sieve from "@/helpers/sieve";
import id from "@/helpers/id";
import errorMessage from "@/helpers/errorMessage";
import percent from "@/helpers/percent";
import { SieveReport } from "@/types";
import { BitView } from "@/helpers/Bits";
import { sqrt } from "./math";

const [zero, one, two]: bigint[] = [0, 1, 2 ,3].map(n => BigInt(n))

// https://en.wikipedia.org/wiki/Prime_number_theorem#Table_of_%CF%80(x),_x_/_log_x,_and_li(x)

// Get primes or write primes to a file and get the link.
// primesToExcel works MAX value 10**12, 452GB.
// primesToExcel works up to 10**8 48MB less than a second.
// lastTenEratosthenes works well up to 10**16 generating last primes in less than a second.
// classicOrSegmentedEratosthenes works up to 10**12 
//
function eratosthenes(LIMIT: number, amount: number = MAX_DISPLAY_SIEVE, excel: boolean = false): SieveReport {
  if (excel) {
    return primesToExcel(LIMIT)
  } 
  
  return classicOrSegmentedEratosthenes(LIMIT, amount)
}

function lastTenEratosthenes(LIMIT: bigint): SieveReport {
  if (LIMIT > MAX_HEALTHY_SEGMENTED_SIEVE_LENGTH) {
    throw new Error("Segmented sieve can be run with a max value of " + MAX_HEALTHY_SEGMENTED_SIEVE_LENGTH)
  }

  const high = LIMIT;
  const t = BigInt(10**5)
  // Up to 10**18, 10000 elements ensure 10 primes
  const low = high > t ? high - t : BigInt(1)

  return segmentedEratosthenesPartial(low, high)
}

// Use the iterator for primes and primesTOExcel. It is 10 times faster than the classic sieve for values from 10**12
function segmentedEratosthenesIterator(n: number, callback: any): void {
  
  const startx = getTimeMicro()
  const nsqrt = Math.floor(Math.sqrt(n));
  const S = Math.min(1024 * 1024 * 16, nsqrt)
  const firstPrimes = classicOrSegmentedEratosthenes(nsqrt + 1, nsqrt + 1).primes
  process.stdout.write("\r");
  process.stdout.write("\r");
  process.stdout.write("SS: Sieved   0.000% in " + (duration(getTimeMicro() - startx)) + "       ")
  
  let bloque: BitView = new BitView(S);
  for (let k = 0; k * S <= n; k++) {
      bloque = new BitView(S);
      const start = k * S;
      for (const p of firstPrimes) {
          const startIdx = Math.max(Math.floor((start + Number(p) - 1) / Number(p)), Number(p)) * Number(p) - start;
          for (let j = startIdx; j < S; j += Number(p))
              bloque.setBit(j, true);
      }
      if (k === 0) {
          bloque.setBit(0, true);
          bloque.setBit(1, true);
      }
      for (let i = 0; i < S && start + i <= n; i++) {
          if (!bloque.getBit(i)) {
              callback(start + i)
          }
      }

      process.stdout.write("\r");
      process.stdout.write("\r");
      process.stdout.write("SS: Sieved " + percent(BigInt(k), BigInt(n)/BigInt(S)) + " in " + (duration(getTimeMicro() - startx)) + "       ")
  }

  process.stdout.write("\r");
  process.stdout.write("\r");
  process.stdout.write("SS: Sieved 100.000% in " + (duration(getTimeMicro() - startx)) + "                 \n")
}

function classicEratosthenesIterator(n: number, callback: any): void {
  const s = sieve(n);
  
  callback(2);

  for (var i = 1; i< s.length();i++) {
    if (2*i+1 <=n && !s.getBit(i)) {
      callback(2 * i + 1)
    }
  }
}

function segmentedEratosthenes(n: number, amount: number = MAX_DISPLAY_SIEVE): SieveReport {
  
  let result: number[] = []
  const startx = getTimeMicro()
  const nsqrt = Math.floor(Math.sqrt(n));
  const S = Math.min(1024 * 1024 * 16, nsqrt)
  const firstPrimes = classicOrSegmentedEratosthenes(nsqrt + 1, nsqrt + 1).primes
  process.stdout.write("\r");
  process.stdout.write("\r");
  process.stdout.write("SS: Sieved   0.000% in " + (duration(getTimeMicro() - startx)) + "       ")
  let resultado = 0;
  const bloque: boolean[] = Array(S).fill(true);
  for (let k = 0; k * S <= n; k++) {
      bloque.fill(true);
      const start = k * S;
      for (const p of firstPrimes) {
          const startIdx = Math.max(Math.floor((start + Number(p) - 1) / Number(p)), Number(p)) * Number(p) - start;
          for (let j = startIdx; j < S; j += Number(p))
              bloque[j] = false;
      }
      if (k === 0)
          bloque[0] = bloque[1] = false;
      for (let i = 0; i < S && start + i <= n; i++) {
          if (bloque[i]) {
              resultado++;
              result.push(start + i)
          }
      }

      result = result.slice(-amount)
      process.stdout.write("\r");
      process.stdout.write("\r");
      process.stdout.write("SS: Sieved " + percent(BigInt(k), BigInt(n)/BigInt(S)) + " in " + (duration(getTimeMicro() - startx)) + "       ")
  }

  process.stdout.write("\r");
  process.stdout.write("\r");
  process.stdout.write("SS: Sieved 100.000% in " + (duration(getTimeMicro() - startx)) + "                 \n")

  return {
    primes: result,
    length: resultado,
    filename: "",
    time: getTimeMicro() - startx,
    isPartial: false
  };
}

// Get part of the segmentedEratosthenes only
function segmentedEratosthenesPartial(low: bigint, high: bigint, maxLength: number = 10): SieveReport {
  const maxSS = BigInt(MAX_ALLOCATABLE_ARRAY) ** two
  if (high > maxSS) {
    throw new Error("Max value for segmented sieve is " + maxSS)
  } else if (high - low > 10**6) {
    throw new Error("It would take a lot of time!")
  }

  console.log("/////////////////////////////////////////////////////////////////////////////")
  
  const startx: number = getTimeMicro();
  const sieveSize = Number(sqrt(high)) + 1
  const segmentSize = Math.min(sieveSize, Number(high - low) + 1); // Size of each segment
  const numSegments = Math.ceil((Number(high - low) + 1) / segmentSize); // Number of segments
  const primesToRoot = classicOrSegmentedEratosthenes(sieveSize, sieveSize).primes;
  let primesInRange: Array<bigint> = [];
  let count = 0

  process.stdout.write("\r");
  process.stdout.write("\r");
  process.stdout.write("PS: Sieved   0.000% in " + (duration(getTimeMicro() - startx)) + "      ")
  
  // Iterate over each segment
  for (let segment = 0; segment < numSegments; segment++) {
      const start = low + BigInt(segment) * BigInt(segmentSize);
      const end = low + BigInt(segment + 1) * BigInt(segmentSize);
      const sieve: BitView = new BitView(segmentSize)
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
    primes: primesInRange,
    filename: "",
    time: getTimeMicro() - startx,
    length: count
  }
}

// Create excel file with primes up to LIMIT
function primesToExcel(LIMIT: number): SieveReport {

  console.log("//////////////////////////////////////////////////////////////////////////////////////////")
  console.log("Requesting excel file primes-to-" + LIMIT + ".csv")
  console.log("Let's sieve for less or equal than " + LIMIT)
  
  if (isNaN(LIMIT)) {
    throw new Error("Invalid length " + LIMIT)
  }

  if (LIMIT < 2) {
    throw new Error("Generated an empty file ...")
  }

  const elapsed = getTimeMicro()
  const root = "./public/files/"
  const filename = "primes-to-" + LIMIT + "-hash-" + id(20) + ".csv"
  const path = root + filename;

  let e = getTimeMicro();
  
  let line = new Array();
  let rows = 0;
  let length = 0;
  
  console.log("Sieved in " + duration(getTimeMicro() - e) + ", start writting primes to file")
  e = getTimeMicro()
  
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
        console.log(message)
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

  console.log("Finished writting " + toHuman(fileSizeInBytes) + " of primes in " + duration(getTimeMicro() - e));
  console.log("Total duration " + duration(getTimeMicro() - elapsed))
  
  return {filename: "/files/" + filename, time: getTimeMicro() - elapsed, length, primes: [], isPartial: false};
}

// Count primes and return count and last amount primes using classic or segmented sieve depending on the size
function classicOrSegmentedEratosthenes(lastNumber: number, amount: number = MAX_DISPLAY_SIEVE): SieveReport {
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
    console.log("//////////////////////////////////////////////////////////////////////////////////////////")
    console.log("Requesting last " + amount + " primes lower or equal than " + lastNumber)
    console.log("Let's sieve for less or equal than " + lastNumber)
    console.log("Primes obtained and counted in " + duration(10))
    console.log("Total duration " +  duration(getTimeMicro() - elapsed))
    return {primes: [], time: getTimeMicro() - elapsed, length: 0, filename: "", isPartial: false}
  }  
  if (lastNumber === 2) {
    console.log("//////////////////////////////////////////////////////////////////////////////////////////")
    console.log("Requesting last " + amount + " primes lower or equal than " + lastNumber)
    console.log("Let's sieve for less or equal than " + lastNumber)
    console.log("Primes obtained and counted in " + duration(10))
    console.log("Total duration " +  duration(getTimeMicro() - elapsed))
    return {primes: [2], time: getTimeMicro() - elapsed, length: 1, filename: "", isPartial: false}
  } 
  
  console.log("//////////////////////////////////////////////////////////////////////////////////////////")
  console.log("Requesting last " + amount + " primes lower or equal than " + lastNumber)
  console.log("Let's sieve for less or equal than " + lastNumber)
  
  let arrayOfPrimes: number[] = Array()  
  let numberOfPrimes = 0
  let e = getTimeMicro()

  const primesIterator = lastNumber > MAX_CLASSIC_SIEVE_LENGTH ? segmentedEratosthenesIterator : classicEratosthenesIterator
  
  primesIterator(lastNumber, (p: number) => {
    try {
      arrayOfPrimes.push(p)
      
      numberOfPrimes++
      if (arrayOfPrimes.length > 10**8) {
        arrayOfPrimes = arrayOfPrimes.slice(-amount)
      }

    } catch (e) {
      "Error push " + lastNumber + "-th time in array at primes below " + lastNumber + " last prime generated is " + p + ". " + errorMessage(e)
    }
  })

  console.log("Primes obtained and counted in " + duration(getTimeMicro() - e))

  console.log("Total duration " + duration(getTimeMicro() - elapsed))

  return {filename: "", primes: arrayOfPrimes.slice(-amount), time: getTimeMicro() - elapsed, length: numberOfPrimes, isPartial: false};
}

export default eratosthenes;

export { lastTenEratosthenes, segmentedEratosthenes, classicOrSegmentedEratosthenes }
