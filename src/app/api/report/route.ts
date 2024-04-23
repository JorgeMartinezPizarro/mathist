import os from 'node:os' 
import fs from "fs"

import { segmentedEratosthenes, lastTenEratosthenes, classicOrSegmentedEratosthenes } from '@/helpers/eratosthenes'
import errorMessage from '@/helpers/errorMessage'
import { ln } from '@/helpers/math'
import countPrimes from "@/helpers/countPrimes"
import duration from '@/helpers/duration'
import percent from '@/helpers/percent'
import getTimeMicro from '@/helpers/getTimeMicro'
import { MAX_CLASSIC_SIEVE_LENGTH } from '@/Constants'

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
      ? [10**6, 10**7, 10**8, 10**9, 10**10, 10**11]                                  // acceptable for local, 26m
      : [10**6, 10**7, 10**8, 10**9, 10**10, 10**11, 10**12]                          // server stress checks, 3h

    const stringArray = [
      "<h3>Test report of mather.ideniox.com</h3>",
      "<hr/>",
      "<b>" + os.cpus()[0].model + " " + process.arch + "</b>",
      "<b>Primes percent for given digits number</b>",
      ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
        return printPercentPrimes(i)
      }),
      ...[10, 11, 12, 13, 14, 15, 20, 30, 40, 50, 100, 200, 300, 1000, 10000, 40000].map(i => {
        return printPercentPrimesEstimated(i)
      }),
      "<b>Test prime generation algorithms</b>",
      "&nbsp;&nbsp;&nbsp;&nbsp;SS: Segmented Sieve",
      "&nbsp;&nbsp;&nbsp;&nbsp;CS: Classic Sieve",
      "&nbsp;&nbsp;&nbsp;&nbsp;GS: Gordon's Sieve",
      "&nbsp;&nbsp;&nbsp;&nbsp;PS: Partial Segmented Sieve",
      "",
      ...testValues.reduce(
        (acc: string[], i: number): string[] => {
          try {
            return [...acc, ...checkPrimeCounts(i)] 
          } catch (e) {
            return ["WARNING: An error ocurred processing checkPrimeCounts(" + i + ")", errorMessage(e)]
          }
        }, []
      ),
      "<hr/>",
      "It took " + duration(getTimeMicro() - start) + " to generate the report!"
    ]
    
    const filename = "./public/files/report.html"
    fs.writeFileSync(filename, "<html><head></head><body>", 'utf8')
    stringArray.forEach(string => 
      fs.appendFileSync(filename, "<p>" + string + "</p>", 'utf8')
    );
    fs.appendFileSync(filename, "</body></html>", 'utf8')
    // The whole report takes 6m in local, 8 hours in the server.
    return Response.json( {time: getTimeMicro() - start, message: "report generated under /files/report.html"} )
  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}

const printPercentPrimesEstimated = (digits: number): string => {
          
  const maxTenDigits = BigInt(new Array(digits).fill("9").join(""))
  const maxNineDigits = BigInt(new Array(digits - 1).fill("9").join(""))
  const numbersWithTenDigits = maxTenDigits - maxNineDigits
  const primesWithLessThanTenDigitsEstimated = maxTenDigits / ln(maxTenDigits)
  const primesWithLessThanNineDigitsEstimated = maxNineDigits / ln(maxNineDigits)
  const primesWithTenDigitsEstimated = primesWithLessThanTenDigitsEstimated - primesWithLessThanNineDigitsEstimated
  
  return percent(primesWithTenDigitsEstimated, numbersWithTenDigits) + " numbers with " + digits + " digits are prime approximately"
}

const printPercentPrimes = (digits: number): string => {
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
  // Needed to increase the cache from 1MB to 13MB to avoid max number of iterations in the segments loop.
  const cache = Math.min(1024 * 1024 * 2)
  const skipClassicSieve = n > MAX_CLASSIC_SIEVE_LENGTH // From that the classic sieve does not worth.
  let stringArray: string[] = [];
  const sort = n.toString()[0] + "E" + (n.toString().length - 1)
  stringArray.push("<b>Checking prime functions for " + sort +"</b>")
  const limit = n
  const c = countPrimes(limit, cache)
  const ce = !skipClassicSieve ? classicOrSegmentedEratosthenes(limit) : {primes: [], length: 0, filename: "", isPartial: false, time: 0}
  const se = segmentedEratosthenes(limit)
  const lp = lastTenEratosthenes(BigInt(limit))
  
  if (skipClassicSieve) {
    if (!arrayEquals(lp.primes, se.primes)
    ) {
      stringArray.push("<span style='color: red'>Something went wrong generating primes to " + sort + "</span>")
      stringArray.push("PS: " +  lp.primes.toString())
      stringArray.push("SS: " + se.primes.toString())
    }
    if (c.length !== se.length) {
      stringArray.push("<span style='color: red'>Something went wrong counting primes to " + sort + "</span>")
      stringArray.push("GS: " + c.length + " !== SS: " + se.length)
    }
  } else {
    if (!arrayEquals(lp.primes, se.primes) || 
      !arrayEquals(se.primes, ce.primes)
    ) {
      stringArray.push("<span style='color: red'>Something went wrong generating primes to " + sort + "</span>")
      stringArray.push("PS: " + lp.primes.toString())
      stringArray.push("SS: " + se.primes.toString())
      stringArray.push("CS: " + ce.primes.toString())
    }
    if (c.length !== ce.length || ce.length !== se.length) {
      stringArray.push("<span style='color: red'>Something went wrong counting primes to " + sort + "</span>")
      stringArray.push("GS: " + c.length + " !== CS: " + ce.length + " !== SS: " + se.length)
    }
  }

  stringArray.push("It took " + duration(lp.time) + " to generate the last 10 primes")
  !skipClassicSieve && stringArray.push("It took " + duration(ce.time) + " to generate the full sieve at once and iterate over all primes")
  stringArray.push("It took " + duration(se.time) + " to generate the full sieve with segments and iterate over all primes")
  stringArray.push("It took " + duration(c.time) + " to count with a bit wise segmentation sieve.")

  return stringArray;
}