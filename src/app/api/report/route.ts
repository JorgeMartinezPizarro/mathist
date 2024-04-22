import fs from "fs"

import eratostenes, { segmentedEratostenes, lastTenEratostenes } from '@/helpers/eratostenes'
import errorMessage from '@/helpers/errorMessage'
import { ln } from '@/helpers/math'
import countPrimes from "@/helpers/countPrimes"
import duration from '@/helpers/duration'
import percent from '@/helpers/percent'
import getTimeMicro from '@/helpers/getTimeMicro'

function arrayEquals(a: (number | bigint)[], b: (number | bigint)[]) {
  return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => BigInt(val) === BigInt(b[index]));
}

export async function GET(request: Request): Promise<Response> {
  

  (BigInt.prototype as any).toJSON = function() {
    return this.toString()
  }

  try {

    const { searchParams } = new URL(request.url||"".toString())

    const KEY: string = searchParams.get('KEY') || "";

    if (KEY !== process.env.MATHER_SECRET?.trim()) {
      throw new Error("Forbidden!")
    }
    
    const start = getTimeMicro();
    const testValues = KEY==="111111"
      ? [10**6, 10**7, 10**8, 10**9,10**10, 10**11 + 1]
      : [10**6, 10**7, 10**8, 10**9, 10**10, 10**11, 10**12] // 10**13 produces stackoverflow

    const stringArray = [
      ...[1, 2, 3, 4, 5, 6,7,8].map(i => {
        return printPrecentPrimes(i)
      }),
      ...[9, 10,11,12,13,14,15,20,50,100,1000,10000].map(i => {
        return printPrecentPrimesEstimated(i)
      }),
      ...testValues.reduce(
        (acc: string[], i: number): string[] => {
          try {
            return [...acc, ...checkPrimeCounts(i)] 
          } catch (e) {
            return ["WARNING: An error ocurred processing checkPrimeCounts(" + i + ")", errorMessage(e)]
          }
        }, []
      )
    ]
    
    const filename = "./public/files/report.html"
    stringArray.push("It took " + duration(getTimeMicro() - start) + " to generate the report!")
    fs.writeFileSync(filename, "<html><head></head><body>", 'utf8')
    stringArray.forEach(string => fs.appendFileSync(filename, "<p>" + string + "</p>", 'utf8'))
    fs.appendFileSync(filename, "</body></html>", 'utf8')
    // The whole report takes 25m in local, several hours in server.
    return Response.json( {time: getTimeMicro() - start, message: "report generated under /files/report.html"} )
  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}

const printPrecentPrimesEstimated = (digits: number): string => {
          
  const maxTenDigits = BigInt(new Array(digits).fill("9").join(""))
  const maxNineDigits = BigInt(new Array(digits - 1).fill("9").join(""))
  const numbersWithTenDigits = maxTenDigits - maxNineDigits
  const primesWithLessThanTenDigitsEstimated = maxTenDigits / ln(maxTenDigits)
  const primesWithLessThanNineDigitsEstimated = maxNineDigits / ln(maxNineDigits)
  const primesWithTenDigitsEstimated = primesWithLessThanTenDigitsEstimated - primesWithLessThanNineDigitsEstimated
  // TODO: think about 
  /* 
    const a = x / Math.log(x) * (1 + 0.992 / Math.log(x));
    const b = x / Math.log(x) * (1 + 1.2762 / Math.log(x));
    return Math.round((a + b) / 2); // take the value in the middle
  */
  return percent(primesWithTenDigitsEstimated, numbersWithTenDigits) + " numbers with " + digits + " digits are prime approximated"
}

const printPrecentPrimes = (digits: number): string => {
  const buffer = 8 * 1024 ** 2 // 8MB cache
  const maxTenDigits = BigInt(new Array(digits).fill("9").join(""))
  const maxNineDigits = BigInt(new Array(digits - 1).fill("9").join(""))
  const numbersWithTenDigits = maxTenDigits - maxNineDigits
  const c = countPrimes(parseInt(maxTenDigits.toString()), buffer)
  const d = countPrimes(parseInt(maxNineDigits.toString()), buffer)
  
  const primesWithLessThanTenDigits = BigInt(c?.length || 0)
  const primesWithLessThanNineDigits = BigInt(d?.length || 0)
  const primesWithTenDigits = primesWithLessThanTenDigits - primesWithLessThanNineDigits
  
  return percent(primesWithTenDigits, numbersWithTenDigits) + " numbers with " + digits + " digits are prime"
}

const checkPrimeCounts = (n: number): string[] => {
  
  let stringArray: string[] = [];
  stringArray.push("Checking prime functions for " + n.toString()[0] + "E" + (n.toString().length - 1))
  const limit = n
  const c = countPrimes(limit)
  const e = n <= 10**11 ? eratostenes(limit) : {primes: [], length: 0, filename: "", isPartial: false, time: 0}
  const se = segmentedEratostenes(limit)
  const lp = lastTenEratostenes(BigInt(limit))
  
  if (e.length === 0) {
    
    if (!arrayEquals(lp.primes, se.primes)
    ) {
      stringArray.push(lp.primes.toString())
      stringArray.push(se.primes.toString())
      stringArray.push("Something went wrong generating primes to " + limit)
    }
    if (c.length !== se.length) {
      stringArray.push("" + c.length)
      stringArray.push("" + se.length)
      stringArray.push("Something went wrong counting primes to " + limit)
    }
  } else {
    if (!arrayEquals(lp.primes, se.primes) || 
      !arrayEquals(se.primes, e.primes)
    ) {
      stringArray.push(lp.primes.toString())
      stringArray.push(se.primes.toString())
      stringArray.push(e.primes.toString())
      stringArray.push("Some went wrong generating primes to " + limit)
    }

    if (c.length !== e.length || e.length !== se.length) {
      stringArray.push("" + c.length)
      stringArray.push("" + e.length)
      stringArray.push("" + se.length)
      stringArray.push("Something went wrong counting primes to " + limit)
    }
  }

  stringArray.push("It took " + duration(lp.time) + " to generate the last 10 primes")
  e.time > 0 && stringArray.push("It took " + duration(e.time) + " to generate the full sieve at once and iterate over all primes")
  stringArray.push("It took " + duration(se.time) + " to generate the full sieve with segments and iterate over all primes")
  stringArray.push("It took " + duration(c.time) + " to count with a bit wise segmentation sieve.")

  return stringArray;
}