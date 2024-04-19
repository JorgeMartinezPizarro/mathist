import fs from "fs"

import {EXCEL_MAX_COLS, EXCEL_MAX_ROWS, MAX_ALLOCATABLE_ARRAY, MAX_DISPLAY_SIEVE, MAX_HEALTHY_SEGMENTED_SIEVE_LENGTH} from "@/Constants";
import getTimeMicro from "@/helpers/getTimeMicro";
import duration from "@/helpers/duration";
import toHuman from "@/helpers/toHuman";
import eratosthenes from "@/helpers/sieve";
import id from "@/helpers/id";
import errorMessage from "@/helpers/errorMessage";
import { SieveReport } from "@/types";
import Bits from "@/helpers/Bits";


// TODO: research https://stackoverflow.com/questions/39312107/implementing-the-page-segmented-sieve-of-eratosthenes-in-javascript
export default function eratostenes(LIMIT: number, amount: number = MAX_DISPLAY_SIEVE, excel: boolean = false): SieveReport {

  if (excel) {
    return primesToExcel(LIMIT)
  } 
  
  return primes(LIMIT, amount)
  
}

export function partialEratostenes(LIMIT: bigint) {
  if (LIMIT > MAX_HEALTHY_SEGMENTED_SIEVE_LENGTH) {
    throw new Error("Segmented sieve can be run with a max value of " + MAX_HEALTHY_SEGMENTED_SIEVE_LENGTH)
  }

  const high = LIMIT;
  // Up to 10**18, 1000 elements ensure 10 primes
  const low = high > BigInt(10**3) ? high - BigInt(10**3) : BigInt(1)

  return segmentedSieve(low, high)
}

// Segment the sieve into steps of size sqrt of high. 
export function segmentedSieve(low: bigint, high: bigint, maxLength: number = 10): SieveReport {
  if (high > 10 ** 18) {
    throw new Error("This algorithm need memory sqrt(high), 10**8 basic sieve takes some seconds.")
  } else if (high - low > 10**10) {
    throw new Error("It would take a lot of time!")
  }
  console.log("/////////////////////////////////////////////////////////////////////////////")
  const start = getTimeMicro();
  const sieveSize = Math.floor(Math.sqrt(Number(high))) + 1;
  const segmentSize = Math.min(sieveSize, Number(high - low) + 1); // Size of each segment
  const numSegments = Math.ceil((Number(high - low) + 1) / segmentSize); // Number of segments
  console.log("Start segmented sieve for primes from " + low + " to " + high + " with number of segments " + numSegments + " with max memory usage " + toHuman(2 * sieveSize / 16))
  
  // TODO: instead of getting the primes and iterate over them, iterate over the original sieve and catch the primes.
  // TODO the count is wrong!
  const primesToRoot = primes(sieveSize, sieveSize).primes;
  
  let primesInRange: Array<bigint> = []; // Primes found in the given range
  
  console.log("Start first segment ...")
  let elapsed = getTimeMicro();
  // Iterate over each segment
  for (let segment = 0; segment < numSegments; segment++) {
      const start = low + BigInt(segment) * BigInt(segmentSize);
      const end = low + BigInt(segment + 1) * BigInt(segmentSize);
      const sieve = new Bits(segmentSize)
      // Sieve the segment using primes from the base sieve
      for (const t of primesToRoot) {
          const p = BigInt(t)
          const startIdx = p >= start ? p : start + (p - start % p) % p; // Start at the smallest multiple of p >= start
          for (let j = startIdx; j < end; j += p) {
              sieve.set(Number(j - start), true); // Mark multiples of prime as composite
          }
      }
      // Store primes found in this segment
      for (let i = 0; i < segmentSize; i++) {
          if (!sieve.get(i) && (start + BigInt(i)) !== BigInt(1)) { // Skip 1 as it's not a prime
              if (start + BigInt(i) < high && start + BigInt(i) > low) {
                primesInRange.push(start + BigInt(i));
              }
          }
      }
      
      primesInRange = primesInRange.slice(-maxLength);
      process.stdout.write("\r");
      process.stdout.write("\r");
      process.stdout.write("Segment done, processed " + Math.round(100 * ((segment + 1) / numSegments)) + "%.")
  }

  console.log("\nDone in " + duration(getTimeMicro() - elapsed))

  return {
    primes: primesInRange,
    filename: "",
    time: getTimeMicro() - start,
    length: -1
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
  const sieve = eratosthenes(LIMIT);
  let line = new Array();
  line.push(2)
  let rows = 0;
  let length = 1;
  
  console.log("Sieved in " + duration(getTimeMicro() - e) + ", start writting primes to file")
  e = getTimeMicro()
  
  // Create the file
  fs.writeFileSync(path, "")

  if (sieve.length === 0) {
    fs.appendFileSync(path, "2")
  }

  for (var i = 1; i < sieve.length; i++) {
    if (i * 2 + 1 <= LIMIT && !sieve.get(i)) {
      line.push( 2 * i + 1)
      length++
    }
    if (line.length === EXCEL_MAX_COLS || i === sieve.length-1) {
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
  }

  var stats = fs.statSync(path);
  var fileSizeInBytes = stats.size;

  console.log("Finished writting " + toHuman(fileSizeInBytes) + " of primes in " + duration(getTimeMicro() - e));
  console.log("Total duration " + duration(getTimeMicro() - elapsed))
  
  return {filename: "/files/" + filename, time: getTimeMicro() - elapsed, length, primes: []};
}

// Count primes and return count and last amount primes
function primes(lastNumber: number, amount: number = MAX_DISPLAY_SIEVE): SieveReport {
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
    console.log("Sieved in " + duration(10) + ", now count and generate " + amount + " primes")
    console.log("Primes obtained and counted in " + duration(10))
    console.log("Total duration " +  duration(getTimeMicro() - elapsed))
    return {primes: [], time: getTimeMicro() - elapsed, length: 0, filename: ""}
  }  
  if (lastNumber === 2) {
    console.log("//////////////////////////////////////////////////////////////////////////////////////////")
    console.log("Requesting last " + amount + " primes lower or equal than " + lastNumber)
    console.log("Let's sieve for less or equal than " + lastNumber)
    console.log("Sieved in " + duration(10) + ", now count and generate " + amount + " primes")
    console.log("Primes obtained and counted in " + duration(10))
    console.log("Total duration " +  duration(getTimeMicro() - elapsed))
    return {primes: [2], time: getTimeMicro() - elapsed, length: 1, filename: ""}
  } 
  
  console.log("//////////////////////////////////////////////////////////////////////////////////////////")
  console.log("Requesting last " + amount + " primes lower or equal than " + lastNumber)
  console.log("Let's sieve for less or equal than " + lastNumber)
  let memorySize = Math.round(lastNumber / 2);
  let arrayOfPrimes: number[] = Array()  
  let count = 0
  let numberOfPrimes = 1
  let sieve = eratosthenes(lastNumber)
  
  console.log("Sieved in " + duration(getTimeMicro() - elapsed) + ", now count and generate " + amount + " primes")

  let e = getTimeMicro()
  // Basically push primes until get an amount
  for (var i = memorySize; i >= 1; i-- ) {
    if (i * 2 + 1 <= lastNumber && !sieve.get(i)) {
      if (count < amount) {
        try {
          arrayOfPrimes.push(i * 2 + 1)
          if (i===1 || count === amount - 1 && arrayOfPrimes.length < amount) {
            arrayOfPrimes.push(2);
          }
          count++
        } catch (e) {
          throw new Error("Error push " + count + "-th time in array at primes below " + lastNumber + " last prime generated is " + (1 + 2*i))
        }
      }
      numberOfPrimes++;
    }
  }
  
  console.log("Primes obtained and counted in " + duration(getTimeMicro() - e))

  console.log("Total duration " + duration(getTimeMicro() - elapsed))

  return {filename: "", primes: arrayOfPrimes.slice(0, amount).reverse(), time: getTimeMicro() - elapsed, length: numberOfPrimes};
}

