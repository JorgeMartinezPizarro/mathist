import fs from "fs"

import removeFilesAsync from "@/helpers/removeFilesAsync"
import getTimeMicro from "@/helpers/getTimeMicro";
import {EXCEL_MAX_COLS, EXCEL_MAX_ROWS, MAX_DISPLAY_SIEVE, MAX_LENGTH_FOR_SIEVE_HEALTY, MAX_NODE_ARRAY_LENGTH} from "./Constants";
import duration from "./duration";
import toHuman from "./toHuman"
import eratosthenes from "./sieve"

export default (LIMIT: number, amount: number = MAX_DISPLAY_SIEVE, excel: boolean = false) => {
  if (excel) {
    return primesToExcel(LIMIT)  
  } 
  return primes(LIMIT, amount)
}

// Create excel file with primes up to LIMIT
function primesToExcel(LIMIT: number) {

  console.log("/////////////////////////////////////////////")
  console.log("Let's sieve for less or equal than " + LIMIT)
  
  const root = "./public/files/"
  const elapsed = getTimeMicro();
  const filename = "primes-to-" + LIMIT + ".csv"
  const path = root + filename

  try {
    removeFilesAsync('./public/files/', ["csv"], 60 * 10);
  } catch (e) {
    console.log("WARNING: an error ocurred deleting cache files from ./public/files/")
  }

  let e = getTimeMicro();
  const sieve = eratosthenes(LIMIT);
  let line = new Array();
  line.push(2)
  let rows = 0;
  let length = 1;
  
  console.log("Sieved in " + duration(getTimeMicro() - e) + " start writting primes to file")
  e = getTimeMicro()
  
  // write primes in sieve to a CSV file
  fs.writeFileSync(path, "")
  for (var i = 1;i < sieve.length;i++) {
    if (i * 2 + 1 <= LIMIT && sieve.get(i) === 0) {
      line.push( 2 * i + 1)
      length++
    }
    if (line.length === EXCEL_MAX_COLS || i === sieve.length-1) {
      try {
        fs.appendFileSync(path, line.join(',') + "\r\n");
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

  var stats = fs.statSync(path)
  var fileSizeInBytes = stats.size;

  console.log("Finished writting " + toHuman(fileSizeInBytes) + " of primes in " + duration(getTimeMicro() - e));
  
  console.log("Total duration " + duration(getTimeMicro() - elapsed))
  
  return {filename, time: getTimeMicro() - elapsed, length};
}

// Enhanced eratosthenes sieve starting with only odd numbers
// it works for 100m in 500ms, for 1b in 6s, 4b in 32s, 8b 1m, 
// beyond it, there is no way to allocate the sieve in js, unless using the matrix trick for the sieve
function primes(lastNumber: number, amount: number = MAX_DISPLAY_SIEVE) {
  const elapsed = getTimeMicro()

  if (amount > MAX_NODE_ARRAY_LENGTH) {
    throw new Error("Such a big array of primes may not fit in memory, max " + MAX_NODE_ARRAY_LENGTH)
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
  
  console.log("/////////////////////////////////////////////")
  console.log("Let's sieve for less or equal than " + lastNumber)
  let memorySize = Math.round(lastNumber / 2);
  let arrayOfPrimes = Array()  
  let count = 0
  let numberOfPrimes = 1
  let sieve = eratosthenes(lastNumber)
  
  console.log("Sieved in " + duration(getTimeMicro() - elapsed) + ", now generate " + amount + " primes!")

  let e = getTimeMicro()
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

  console.log("Total duration " + duration(getTimeMicro() - elapsed))

  return {primes: arrayOfPrimes.reverse(), time: getTimeMicro() - elapsed, length: numberOfPrimes};
}