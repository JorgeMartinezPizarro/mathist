import fs from "fs"

import removeFilesAsync from "@/helpers/removeFilesAsync"
import getTimeMicro from "@/helpers/getTimeMicro";
import {EXCEL_MAX_COLS, EXCEL_MAX_ROWS, MAX_ALLOCATABLE_ARRAY, MAX_DISPLAY_SIEVE, MAX_LENGTH_FOR_SIEVE_HEALTY, MAX_ALLOCATABLE_MATRIX_30GB} from "./Constants";
import duration from "./duration";
import toHuman from "./toHuman"
import eratosthenes from "./sieve"

export default (LIMIT: number, amount: number = MAX_DISPLAY_SIEVE, excel: boolean = false) => {
  
  // LIMIT CHECKS 
  // TODO: use ENVIRONMENT variable for check or not.
  // 1b Up to 64MB RAM 516MB disk, natural limit for the web, it takes 20s to compute
  if (LIMIT > MAX_LENGTH_FOR_SIEVE_HEALTY) { 
    // SKIP IT FOR HARD TESTINGs
    //throw new Error("max length " + MAX_LENGTH_FOR_SIEVE_HEALTY + ", " + toHuman(MAX_LENGTH_FOR_SIEVE_HEALTY / 16) + " RAM 515MB disk.");
  } 
  // 500b Up to 30GB RAM 240GB disk ( x500), common sense limit, it takes 10h to compute
  if (LIMIT > MAX_ALLOCATABLE_MATRIX_30GB) {
    throw new Error("max length " + MAX_ALLOCATABLE_MATRIX_30GB + ", " + toHuman(MAX_ALLOCATABLE_MATRIX_30GB / 16) + " RAM 240GB disk.");
  }

  if (excel) {
    return primesToExcel(LIMIT)
  } 
  return primes(LIMIT, amount)
}

// Create excel file with primes up to LIMIT
function primesToExcel(LIMIT: number) {

  console.log("//////////////////////////////////////////////////////////////////////////////////////////")
  console.log("Requesting excel file primes-to-" + LIMIT + ".csv")
  console.log("Let's sieve for less or equal than " + LIMIT)
  
  const elapsed = getTimeMicro()
  const root = "./public/files/"  
  const filename = "primes-to-" + LIMIT + ".csv"
  const path = root + filename

  try {
    if (fs.existsSync(path)) {
      return {
        filename,
        length: -1,
        time: getTimeMicro() - elapsed
      }
    }
    // DO NOT remove files older than 8h
    //removeFilesAsync('./public/files/', ["csv"], 60 * 60 * 8);
  } catch (e) {
    console.log("WARNING: an error ocurred deleting cache files from " + root)
  }

  let e = getTimeMicro();
  const sieve = eratosthenes(LIMIT);
  let line = new Array();
  line.push(2)
  let rows = 0;
  let length = 1;
  
  console.log("Sieved in " + duration(getTimeMicro() - e) + ", start writting primes to file")
  e = getTimeMicro()
  
  // write primes in sieve to a CSV file
  fs.writeFileSync(path, "")

  if (sieve.length === 0) {
    fs.appendFileSync(path, "2")
  }

  for (var i = 1; i < sieve.length; i++) {
    if (i * 2 + 1 <= LIMIT && sieve.get(i) === 0) {
      line.push( 2 * i + 1)
      length++
    }
    if (line.length === EXCEL_MAX_COLS || i === sieve.length-1) {
      try {
        fs.appendFileSync(path, line.join(',') + "\r\n");
      } catch (e) {
        console.log("Error writting to file " + path + ", " + e.toString())
        throw new Error("Error writting to file " + path + ", " + e.toString())
      }
      rows++;
      // Max excel file size
      if (rows === EXCEL_MAX_ROWS) {
        console.log("Warning. The file cannot be open with Excel. Max cells count " + (EXCEL_MAX_ROWS* EXCEL_MAX_COLS) + ", last prime fit into Excel " + line.slice(-1))
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

// Count primes and return count and last amount primes
function primes(lastNumber: number, amount: number = MAX_DISPLAY_SIEVE) {
  const elapsed = getTimeMicro()

  if (amount > MAX_ALLOCATABLE_ARRAY) {
    throw new Error("Such a big array of primes may not fit in memory, max " + MAX_ALLOCATABLE_ARRAY)
  }
  if (lastNumber < 0) {
    throw new Error("Cannot get the sieve of negative numbers")
  }
  if (lastNumber === 1) {
    console.log("//////////////////////////////////////////////////////////////////////////////////////////")
    console.log("Requesting last " + amount + " primes lower or equal than " + lastNumber)
    console.log("Let's sieve for less or equal than " + lastNumber)
    console.log("Sieved in " + duration(0) + ", now count and generate " + amount + " primes")
    console.log("Primes obtained and counted in " + duration(0))
    console.log("Total duration " +  duration(getTimeMicro() - elapsed))
    return {primes: [], time: getTimeMicro() - elapsed, length: 0}
  }  
  if (lastNumber === 2) {
    console.log("//////////////////////////////////////////////////////////////////////////////////////////")
    console.log("Requesting last " + amount + " primes lower or equal than " + lastNumber)
    console.log("Let's sieve for less or equal than " + lastNumber)
    console.log("Sieved in " + duration(0) + ", now count and generate " + amount + " primes")
    console.log("Primes obtained and counted in " + duration(0))
    console.log("Total duration " +  duration(getTimeMicro() - elapsed))
    return {primes: [[2]], time: getTimeMicro() - elapsed, length: 1}
  } 
  
  console.log("//////////////////////////////////////////////////////////////////////////////////////////")
  console.log("Requesting last " + amount + " primes lower or equal than " + lastNumber)
  console.log("Let's sieve for less or equal than " + lastNumber)
  let memorySize = Math.round(lastNumber / 2);
  let arrayOfPrimes = Array()  
  let count = 0
  let numberOfPrimes = 1
  let sieve = eratosthenes(lastNumber)
  
  console.log("Sieved in " + duration(getTimeMicro() - elapsed) + ", now count and generate " + amount + " primes")

  let e = getTimeMicro()
  // Basically push primes until get an amount
  for (var i = memorySize; i >= 1; i-- ) {
    if (i * 2 + 1 <= lastNumber && sieve.get(i) === 0) {
      if (count < amount) {
        try {
          arrayOfPrimes.push(i * 2 + 1)
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