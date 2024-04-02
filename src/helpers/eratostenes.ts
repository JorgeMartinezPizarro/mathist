import fsS from "fs"

import Bits from "@/helpers/Bits"
import removeFilesAsync from "@/helpers/removeFilesAsync"
import id from "@/helpers/id"
import getTimeMicro from "@/helpers/getTimeMicro";
import {EXCEL_MAX_COLS, EXCEL_MAX_ROWS, MAX_DISPLAY_SIEVE, MAX_NODE_ARRAY_LENGTH} from "./Constants";
import duration from "./duration";

export default (LIMIT: number, amount: number = MAX_DISPLAY_SIEVE, excel: boolean = false) => {
  if (excel) {
    return primesToExcel(LIMIT)  
  } 
  return primes(LIMIT, amount)
}

// Create excel file with primes up to LIMIT
function primesToExcel(LIMIT: number) {

  const elapsed = getTimeMicro();
  const sieve = eratosthenes(LIMIT);
  const filename = id() + ".csv"
  const path = "./public/files/" + filename
    
  let line = new Array(2);
  let rows = 0;
  let length = 1

  console.log("start writting primes to file")
  // write primes in sieve to a CSV file
  fsS.writeFileSync(path, "")
  
  for (var i =1;i<sieve.length;i++) {
    if (i * 2 + 1 <= LIMIT && sieve.get(i) === 0) {
      line.push( 2 * i + 1)
      length++
    }
    if (line.length === EXCEL_MAX_COLS || i === sieve.length-1) {
      try {
        fsS.appendFileSync(path, line.join(',') + "\r\n");
      } catch (e) {
        throw new Error("Error writting primes to file " + path)
      }
      rows++;
      // Absurd max value, no disk can handle it!
      if (rows === EXCEL_MAX_ROWS) {
        throw new Error("Max excel file " + (EXCEL_MAX_ROWS* EXCEL_MAX_COLS)) + " cells"
      }
      line = new Array()
    }
  }
  console.log("finish writting primes to file")
  
  // Remove files older than 30 minutes to avoid disk full
  try {
    removeFilesAsync('./public/files/', ["csv"], 60 * 30);
  } catch (e) {
    console.log("WARNING: an error ocurred deleting cache files from ./public/files/")
  }
  
  return {filename, time: getTimeMicro() - elapsed, length};
}

// Enhanced eratosthenes sieve starting with only odd numbers
// It create a matrix of primes to tackle the max value MAX_NODE_ARRAY_LENGTH, going up to MAX_NODE_ARRAY_LENGTH**2
// it works for 100m in 500ms, for 1b in 6s, 4b in 32s, 8b 1m, 
// beyond it, there is no way to allocate the sieve in js, unless using the matrix trick for the sieve
function primes(lastNumber: number, amount: number = MAX_DISPLAY_SIEVE) {
  let elapsed = getTimeMicro()

  if (amount > MAX_NODE_ARRAY_LENGTH ) {
    throw new Error("Such a big array of primes may not fit in memory")
  }
  if (lastNumber < 0) {
    throw new Error("Cannot get the sieve of negative numbers")
  }
  if (lastNumber === 1) {
    return {primes: [], time: getTimeMicro() - elapsed, length: 0}
  }  
  if (lastNumber === 2) {
    return {primes: [[2]], time: getTimeMicro() - elapsed, length: 1}
  }
  
  console.log("Let's sieve")

  let memorySize = Math.round(lastNumber / 2);
  let arrayOfPrimes = Array()  
  let count = 0
  let numberOfPrimes = 1
  let sieve = eratosthenes(lastNumber)

  console.log("Sieved, now generate " + amount + " primes!")

  const e = getTimeMicro()
  // Basically push primes until get an amount
  for (var i = memorySize; i >= 1; i-- ) {
    if (i * 2 + 1 <= lastNumber && sieve.get(i) === 0) {
      if (count < amount) {
        try {
          arrayOfPrimes.push(i*2+1)
          if (i===1 || count === amount - 1 && arrayOfPrimes.length < amount) {
            arrayOfPrimes.push(2);
          }
          count++
        } catch (e) {
          throw new Error("Error push " + count + "th time in array at primes below " + lastNumber + " last prime generated is " + (1 + 2*i))
        }
      }
      numberOfPrimes++;    
    }
  }

  console.log("Primes obtained and counted in " + duration(getTimeMicro() - e))

  return {primes: arrayOfPrimes.reverse(), time: getTimeMicro() - elapsed, length: numberOfPrimes};
}

const eratosthenes = (lastNumber: number) => {
  
  // Initialization
  let upperLimit = Math.round(Math.sqrt(lastNumber))
  let memorySize = Math.round(lastNumber / 2);
  let sieve = new Bits(memorySize);
  
  // Hard process crossing all odd composite numbers
  for (var i = 3; i <= upperLimit; i += 2) {
    if (sieve.get((i -1) / 2) === 0) {
      for (var j = i*i; j <= lastNumber; j += 2*i) {
        sieve.set((j-1)/2, 1)
      }
    }
  }  
  
  return sieve;
}