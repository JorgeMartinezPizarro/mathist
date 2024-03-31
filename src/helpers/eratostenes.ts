import fs from "fs"

import Bits from "@/helpers/Bits"
import getTimeMicro from "@/helpers/getTimeMicro";
import {EXCEL_MAX_COLS, EXCEL_MAX_ROWS, MAX_LENGTH_FOR_SIEVE, MAX_NODE_ARRAY_LENGTH} from "./Constants";

export default (LIMIT: number, amount: number = 10, excel: boolean = false) => {
  if (excel) {
    return convertToExcel(eratosthenes(LIMIT, LIMIT).primes, LIMIT)  
  } 
  return eratosthenes(LIMIT, amount)
}

function makeid() {
  var length = 25
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

// Convert an array to a CSV compatible with EXCEL
function convertToExcel(x, LIMIT) {

  console.log("CONVERT TO EXCEL", x)

  const filename = makeid() + ".csv"
  const path = "./public/files/" + filename
  fs.writeFileSync(path, "")

  for (var j = x.length - 1; j>=0; j--) {
    const sieve = x[j]
    const a: [][] = Array()
    let b: [] = Array()

    try {
      for (var i = sieve.length - 1; i>=0;i--) {
        b.push(sieve[i])
        if (b.length === EXCEL_MAX_COLS || i===0) {
            a.push(b)
            b = []
            if (a.length === EXCEL_MAX_ROWS) {
              throw new Error("Max excel size is " + EXCEL_MAX_ROWS * EXCEL_MAX_COLS + " cells")
            }
        }
      }
    } catch (e) {
      throw new Error("WTF it is not possible")
    }

    try {
      
      for (var i =0;i<a.length;i++) {
          fs.appendFileSync(path, a[i].join(',') + "\r\n");
      }
    } catch (e) {
      throw new Error("WTF error writting to file ....")
    }
  }

  return filename;
}

// Enhanced eratosthenes sieve starting with only odd numbers
// it works for 100m in 500ms, for 1b in 8s, 4b in 36s
// beyond it, there is no way to allocate the sieve in js.
function eratosthenes(lastNumber: number, amount: number = 10) {
  let elapsed = getTimeMicro()
  
  if (lastNumber > 2**32)
    throw new Error("Cannot allocate enough memory, " + MAX_LENGTH_FOR_SIEVE + " is the max number allowed")
  
  if (lastNumber < 0) 
      throw new Error("Cannot get the sieve of negative numbers")

  if (lastNumber <= 1) 
      return {primes: [], time: 0, length: 0}

  let upperLimit = Math.round(Math.sqrt(lastNumber))
  var memorySize = Math.round((lastNumber - 1)/2);
  let found = new Array()
    
  var sieve = new Bits(memorySize);
  
  // Hard process crossing odd composite numbers
  for (var i = 3; i <= upperLimit; i += 2) {
    if (sieve.get(i / 2) === 0) {
      for (var j = i*i; j <= lastNumber; j += 2*i) {
        sieve.set(j / 2, 1)
      }
    }
  }
  
  let count = 0
  let numberOfPrimes = 1
  console.log("GENERATING PRIMES")
  let partialPrimes = Array()
  const t = MAX_NODE_ARRAY_LENGTH
  for (var i = memorySize; i >= 1; i-- ) {
    if (sieve.get(i) === 0 && i*2+1 <= lastNumber) {
      if (count < amount) {
        const MAX = found.length
        try {
          partialPrimes.push(i*2+1)
          if (i===1 || count === amount - 1) {
              partialPrimes.push(2)
          }
          if (partialPrimes.length === t || i===1 || count === amount - 1) {
            
            console.log("Adding primes one more time")
            found.push(partialPrimes)
            partialPrimes = Array()
            if (found.length === t) {
              throw new Error("No way to createa that big matrix!")
            }
          }
          count++
        } catch (e) {
          throw new Error("Error push in array with length " + MAX + " at primes below " + lastNumber + " last prime generated is " + (1 + 2*i))
        }
      }
      numberOfPrimes++;
    }
  }

  // MAX of primes allowed in Array() is 125813764
  console.log("GENERATED PRIMES")
  console.log(found)
  elapsed = getTimeMicro() - elapsed;
  return {primes: found, time: elapsed, length: numberOfPrimes};
}