import fs from "fs"

import {EXCEL_MAX_COLS, EXCEL_MAX_ROWS, MAX_ALLOCATABLE_ARRAY, MAX_DISPLAY_SIEVE} from "./Constants";
import getTimeMicro from "@/helpers/getTimeMicro";
import duration from "@/helpers/duration";
import toHuman from "@/helpers/toHuman";
import eratosthenes from "@/helpers/sieve";
import id from "@/helpers/id";

export default function eratostenes(LIMIT: number, amount: number = MAX_DISPLAY_SIEVE, excel: boolean = false): SieveReport {
  
  if (excel) {
    return primesToExcel(LIMIT)
  } 
  return primes(LIMIT, amount)
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

  let root;
  root = "./public/files/"
  
  
  const filename = id(20) + ".csv"
  
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
        let message
        if (error instanceof Error) message = error.message
        else message = String(error)
        console.log("Error writting to file " + path + ", " + message)
        throw new Error("Error writting to file " + path + ", " + message)
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
  
  return {filename, time: getTimeMicro() - elapsed, length, primes: []};
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
    return {primes: [BigInt(2)], time: getTimeMicro() - elapsed, length: 1, filename: ""}
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

  return {filename: "", primes: arrayOfPrimes.reverse(), time: getTimeMicro() - elapsed, length: numberOfPrimes};
}

export interface SieveReport {
  filename: string;
  primes: bigint[];
  time: number;
  length: number;
}
