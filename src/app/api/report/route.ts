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
    const stringArray = [
      ...[3, 4, 5, 6,7,8].map(i => printPrecentPrimes(i)),
      ...[9, 10,11,12,13,14,15,20,50,100,1000,10000].map(i => printPrecentPrimesEstimated(i)),
      ...[10**7, 10**8, 10**9, 10**10, 10**11, 10**12].reduce(
        (acc: string[], i: number): string[] => [...acc, ...checkPrimeCounts(i)], 
        []
      )
    ]
    
    stringArray.push("It took " + duration(getTimeMicro() - start) + " to generate the report!")
    const filename = "./public/files/report.html"
    fs.writeFileSync(filename, "<html><head></head><body>")
    stringArray.forEach(string => fs.appendFileSync(filename, "<p>" + string + "</p>"))
    fs.appendFileSync(filename, "</body></html>")
    // The whole report takes about 5 minutes to generate.
    return Response.json( {stringArray} )
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
  // 37607912018 primes up to 1t
  const limit = n
  const c = countPrimes(limit)
  const e = n <= 10**11 ? eratostenes(limit) : {primes: [], length: 0, filename: "", isPartial: false, time: 0}
  const se = segmentedEratostenes(limit)
  const lp = lastTenEratostenes(BigInt(limit))
  

  if (!arrayEquals(lp.primes, se.primes) || 
      !arrayEquals(se.primes, e.primes)
  ) {
    stringArray.push(lp.primes.toString())
    stringArray.push(se.primes.toString())
    stringArray.push(e.primes.toString())
    stringArray.push("Some is wrong generating last primes to " + limit)
  }

  if (c.length !== e.length || e.length !== se.length) {
    stringArray.push("" + c.length)
    stringArray.push("" + e.length)
    stringArray.push("" + se.length)
    stringArray.push("Something is wrong counting primes to " + limit)
  }

  stringArray.push("It took " + duration(lp.time) + " to generate the last 10 primes")
  
  stringArray.push("It took " + duration(e.time) + " to generate the full sieve at once and iterate over all primes")

  stringArray.push("It took " + duration(se.time) + " to generate the full sieve with segments and iterate over all primes")

  stringArray.push("It took " + duration(c.time) + " to count with a bit wise segmentation sieve.")

  return stringArray;
}