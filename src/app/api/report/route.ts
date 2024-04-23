import os from 'node:os' 
import fs from "fs"

import { lastTenGenerated, segmentedEratosthenes, lastTenEratosthenes, classicOrSegmentedEratosthenes } from '@/helpers/eratosthenes'
import errorMessage from '@/helpers/errorMessage'
import { ln } from '@/helpers/math'
import countPrimes from "@/helpers/countPrimes"
import duration from '@/helpers/duration'
import percent from '@/helpers/percent'
import getTimeMicro from '@/helpers/getTimeMicro'
import { MAX_CLASSIC_SIEVE_LENGTH } from '@/Constants'
import isProbablePrime from '@/helpers/isProbablePrime'
import id from '@/helpers/id'
import { get } from 'node:http'
import factors from '@/helpers/factors'

interface TestReport {
  time: number;
  passed: boolean,
  name: string;
  SSTime: number;
  ESTime: number;
  GSTime: number;
  PSTime: number;
  BFTime: number;
}

interface TestFactorReport {
  time: number;
  name: string;
  passed: boolean;
  error: string;
}

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

    // TODO: add error message on hover
    const { searchParams } = new URL(request.url||"".toString())

    const KEY: string = searchParams.get('KEY') || "";

    if (KEY !== process.env.MATHER_SECRET?.trim()) {
      throw new Error("Forbidden!")
    }
    
    const start = getTimeMicro();

    // TODO: add tests for factorization algorithms
    const testValues = KEY==="111111"
      ? [10**6, 10**7, 10**8, 10**9, 2*10**9, 4*10**9, 10**10]                                          // acceptable for local, 10m
      : [10**6, 10**7, 10**8, 10**9, 2*10**9, 4*10**9, 10**10, 10**11, 10**12]                          // server stress checks,  3h

    const testLastValues: bigint[] = [BigInt(10**11), BigInt(10**12), BigInt(10**13), BigInt(10**14), BigInt(10**15), BigInt(10**16), BigInt(10**17), BigInt(10)**BigInt(18), BigInt(4)*BigInt(10)**BigInt(18)]
    
    const randomTestLastValues: bigint[] = (new Array(200).fill(0)).map(e => {
      return BigInt(1) + BigInt(Math.floor(Math.random() * (10**16-1)))
    })

    const randomTestFactorizeValues: bigint[] = (new Array(5000).fill(0)).map(e => {
      return BigInt(id(21))
    })

    const testFactorizationArray: TestFactorReport[] = randomTestFactorizeValues.map(number => {
      const sort = number.toString()[0] + "E" + (number.toString().length - 1)
      const start = getTimeMicro()
      let error = "";
      let failed = false;
      
      try {
        factors(number)
      } catch (e) {
        failed = true
        error = "Failed factoring " + sort + ". " + errorMessage(e)
      }
      
      return {
        time: getTimeMicro() - start,
        name: "Factorize " + sort,
        passed: !failed,
        error,
      }
    })

    const bigTestLastValues = [BigInt(10)**BigInt(20), BigInt(10)**BigInt(25), BigInt(10)**BigInt(30), BigInt(10)**BigInt(50), BigInt(10)**BigInt(100), BigInt(10)**BigInt(150), BigInt(10)**BigInt(200), BigInt(10)**BigInt(250), BigInt(10)**BigInt(300), BigInt(10)**BigInt(350), BigInt(10)**BigInt(400)]

    const testPrimesCountArray = testValues.map(i => checkPrimeCounts(i))
    
    const testLastPrimes = [
      ...testLastValues.map(i => checkLastPrimes(i)), 
      ...randomTestLastValues.map(i => checkLastPrimes(i)), 
    ]

    const testLastGeneratedPrimes = bigTestLastValues.map(i => checkLastGeneratedPrimes(i))

    const countPassedTests = (tests: TestReport[]): number => tests.filter(line => line.passed === true).length

    const countFailedTests = (tests: TestReport[]): number => tests.filter(line => line.passed === false).length
    
    const passedTests = countPassedTests(testLastPrimes) + countPassedTests(testLastGeneratedPrimes) + countPassedTests(testLastGeneratedPrimes)

    const failedTests = countFailedTests(testLastPrimes) + countFailedTests(testLastGeneratedPrimes) + countFailedTests(testLastGeneratedPrimes)
    
    const rowsPercentsExact = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      .map(printPercentPrimes)

    const rowPercentsEstimated = [10, 11, 12, 13, 14, 15, 20, 30, 40, 50, 100, 200, 300, 1000, 10000, 40000]
      .map(printPercentPrimesEstimated)

    const testArray = [
      ...testPrimesCountArray,
      ...testLastPrimes,
      ...testLastGeneratedPrimes
    ]

    const testFactorRows = testFactorizationArray.sort((test1, test2) => test1.time - test2.time).slice(-25).reverse().map(test => "<tr><td>" +
        test.name +
      "</td><td>" +
        duration(test.time) +
      "</td><td style='" + (test.passed ? "background: green;" : "background: red;") + "'>" +
        (test.passed ? "Passed" : "Failed") + 
      "</td></tr>"
    )

    const testRows = testArray.sort((test1, test2) => test1.time - test2.time).slice(-25).reverse().map(test => "<tr><td>" +
        test.name +
      "</td><td>" +
        duration(test.SSTime) + 
      "</td><td>" + 
        duration(test.ESTime) + 
      "</td><td>" +
        duration(test.GSTime) + 
      "</td><td>" +
        duration(test.PSTime) +
      "</td><td>" + 
        duration(test.BFTime) + 
      "</td><td>" + 
        duration(test.time) + 
      "</td><td style='" + (test.passed ? "background: green;" : "background: red;") + "'>" +
        (test.passed ? "Passed" : "Failed") + 
      "</td></tr>"
    )

    const SSTime = duration(testArray.reduce((acc: number, val: TestReport): number => acc + val.SSTime, 0))
    const ESTime = duration(testArray.reduce((acc: number, val: TestReport): number => acc + val.ESTime, 0))
    const GSTime = duration(testArray.reduce((acc: number, val: TestReport): number => acc + val.GSTime, 0))
    const PSTime = duration(testArray.reduce((acc: number, val: TestReport): number => acc + val.PSTime, 0))
    const BFTime = duration(testArray.reduce((acc: number, val: TestReport): number => acc + val.BFTime, 0))
    const time   = duration(testArray.reduce((acc: number, val: TestReport): number => acc + val.time,   0))

    const testFactorizationPassedCount = testFactorizationArray.reduce((acc: number, val: TestFactorReport): number => acc + (val.passed ? 1 : 0), 0)

    const testFactorizationTime = testFactorizationArray.reduce((acc: number, val: TestFactorReport): number => acc + val.time, 0)

    const testFactoritzationCount = testFactorizationArray.length

    const stringArray = [
      "<h3 style='text-align: center;'>Test report of mather.ideniox.com</h3>",
      "<p style='text-align: center;'><b>" + os.cpus()[0].model + " " + process.arch + "</b></p>",
      "<hr/>",
      "<table style='width: 300px;margin: 0 auto;'><thead><tr><th style='text-align: left;'>Primes %</th><th style='text-align: left;'>Digits</th></tr></thead><tbody>",
      ...rowsPercentsExact,
      ...rowPercentsEstimated,
      "</tbody></table>",
      "<hr/>",
      "<table style='width: 800px;margin: 0 auto;'> <thead><tr><th style='text-align: left;'>Test name</th><th style='text-align: left;'>SS time</th><th style='text-align: left;'>ES time</th><th style='text-align: left;'>GS time</th><th style='text-align: left;'>PS time</th><th style='text-align: left;'>BF time</th><th style='text-align: left;'>Total time</th><th style='text-align: left; width: 80px;'>Passed</th></tr></thead><tbody>",
      ...testRows,
      "<tr><td>" + (testArray.length - 25) + " more</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>",
      "<tr><th style='text-align: left;'>Value</th><th style='text-align: left;'>SS time</th><th style='text-align: left;'>ES time</th><th style='text-align: left;'>GS time</th><th style='text-align: left;'>PS time</th><th style='text-align: left;'>BF time</th><th style='text-align: left;'>Total time</th><th style='text-align: left;'>Passed</th></tr>",
      "<tr><td>" + testArray.length + "</td><td>" + SSTime + "</td><td>" + ESTime + "</td><td>" + GSTime + "</td><td>" + PSTime + "</td><td>" + BFTime + "</td><td>" + time + "</td><td>" + percent(BigInt(passedTests), BigInt(passedTests + failedTests)) + "</td>",
      "</tbody></table>",
      "<hr/>",
      "<p style='text-align: center;'><b>Tested the following prime algorithms</b></p>",
      "<p style='text-align: center;'>SS: Segmented Sieve</p>",
      "<p style='text-align: center;'>ES: Eratosthenes Sieve</p>",
      "<p style='text-align: center;'>GS: Gordon's Sieve</p>",
      "<p style='text-align: center;'>PS: Partial Segmented Sieve</p>",
      "<p style='text-align: center;'>BF: Brute force generator</p>",
      "<hr/>",
      "<table style='width: 500px;margin: 0 auto;'><thead><tr><th style='text-align: left;'>Name</th><th style='text-align: left;'>Time</th><th style='text-align: left; width: 80px;'>Passed</th></tr></thead><tbody>",
      ...testFactorRows,
      "<tr><td>" + (testFactoritzationCount - 25) + " more</td><td>...</td><td>...</td>",
      "<tr><th style='text-align: left;'>Name</th><th style='text-align: left;'>Time</th><th style='text-align: left; width: 80px;'>Passed</th></tr>",
      "<tr><td>" + testFactoritzationCount + "</td><td>" + duration(testFactorizationTime) + "</td><td>" + percent(BigInt(testFactorizationPassedCount), BigInt(testFactoritzationCount)) + "</td>",
      "<tr>",
      "</tbody></table>",
      "<hr/>",
      "<p style='text-align: center;'><b>Tested the following factorization algorithms</b></p>",
      "<p style='text-align: center;'>Brute force for factors up to 10**7</p>",
      "<p style='text-align: center;'>Brent algorithm for factors up to 10**11</p>",
      "<hr/>",
      "<p style='text-align: center;'>It took " + duration(getTimeMicro() - start) + " to generate the report.</p>"
    ]
    
    const filename = "./public/files/report.html"
    fs.writeFileSync(filename, "<html><head></head><body>", 'utf8')
    stringArray.forEach(string => 
      fs.appendFileSync(filename, string, 'utf8')
    );
    fs.appendFileSync(filename, "</body></html>", 'utf8')
    // The whole report takes 6m in local, 8 hours in the server.
    return Response.json( {time: getTimeMicro() - start, message: "report generated under /files/report.html"} )
  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}

const checkLastGeneratedPrimes = (number: bigint): TestReport => {
  const start = getTimeMicro();
  const sort = number.toString()[0] + "E" + (number.toString().length - 1)
  const stringArray: string[] = ["<b>Check last primes below " + sort + "</b>"]
  let failed = false
  let sr
  try {
    sr = lastTenGenerated(number)
    
    if (sr.primes.length !== 10) {
        stringArray.push("<span style='color: red'>Failed to generate 10 primes</span>")
        failed = true
    }

    if (!failed) {
      stringArray.push("<span style='color: green'>The ten generated numbers are all prime.</span>")
    }

    stringArray.push("Checked last ten primes generated in " + duration(getTimeMicro() - start))

  } catch(e) {
    stringArray.push("<span style='color: red;'>ERROR: An error ocurred processing checkPrimeCounts(" + sort + ")</span>")
    stringArray.push(errorMessage(e))
    failed = true
  }

  return {
    BFTime: sr?.time||0,
    SSTime: 0,
    ESTime: 0,
    GSTime: 0,
    PSTime: 0,
    name: "BF to " + sort,
    passed: !failed,
    time: getTimeMicro() - start,
  }
}

const checkLastPrimes = (number: bigint): TestReport => {

  const start = getTimeMicro();
  const sort = number.toString()[0] + "E" + (number.toString().length - 1)
  const stringArray: string[] = ["<b>Check last primes below " + sort + "</b>"]
  let failed = false
  let sr

  try {
    sr = lastTenEratosthenes(number)
    

    sr.primes.forEach(p => {
      if (!isProbablePrime(p)) {
        stringArray.push("<span style='color: red'>The generated number " + p + " is not prime!</span>")
        failed = true
      }
    })
    if (sr.primes.length !== 10) {
        stringArray.push("<span style='color: red'>Failed to generate 10 primes</span>")
        failed = true
    }

    if (!failed) {
      stringArray.push("<span style='color: green'>The ten generated numbers are all prime.</span>")
    }

    stringArray.push("Checked last ten primes generated in " + duration(getTimeMicro() - start))

  } catch(e) {
    stringArray.push("<span style='color: red;'>ERROR: An error ocurred processing checkPrimeCounts(" + sort + ")</span>")
    stringArray.push(errorMessage(e))
    failed = true
  }

  return {
    BFTime: 0,
    SSTime: 0,
    ESTime: 0,
    GSTime: 0,
    PSTime: sr?.time||0,
    name: "PS to " + sort,
    passed: !failed,
    time: getTimeMicro() - start,
  }
}

const printPercentPrimesEstimated = (digits: number): string => {
          
  const maxTenDigits = BigInt(new Array(digits).fill("9").join(""))
  const maxNineDigits = BigInt(new Array(digits - 1).fill("9").join(""))
  const numbersWithTenDigits = maxTenDigits - maxNineDigits
  const primesWithLessThanTenDigitsEstimated = maxTenDigits / ln(maxTenDigits)
  const primesWithLessThanNineDigitsEstimated = maxNineDigits / ln(maxNineDigits)
  const primesWithTenDigitsEstimated = primesWithLessThanTenDigitsEstimated - primesWithLessThanNineDigitsEstimated
  
  return "<tr><td>" + percent(primesWithTenDigitsEstimated, numbersWithTenDigits) + "</td><td>" + digits + "</td></tr>"
}

const printPercentPrimes = (digits: number): string => {
  const buffer = 1024 * 512 // 512KB cache
  const maxTenDigits = BigInt(new Array(digits).fill("9").join(""))
  const maxNineDigits = BigInt(new Array(digits - 1).fill("9").join(""))
  const numbersWithTenDigits = maxTenDigits - maxNineDigits
  const c = countPrimes(parseInt(maxTenDigits.toString()), buffer)
  const d = countPrimes(parseInt(maxNineDigits.toString()), buffer)
  const primesWithLessThanTenDigits = BigInt(c?.length || 0)
  const primesWithLessThanNineDigits = BigInt(d?.length || 0)
  const primesWithTenDigits = primesWithLessThanTenDigits - primesWithLessThanNineDigits
  
  return "<tr><td>" + percent(primesWithTenDigits, numbersWithTenDigits) + "</td><td>" + digits + "</td></tr>"
}

const checkPrimeCounts = (n: number): TestReport => {
  
  // Needed to increase the cache from 512 to 10MB for 10**13
  const sort = n.toString()[0] + "E" + (n.toString().length - 1)
  const stringArray: string[] = ["<b>Checking prime functions for " + sort +"</b>"]
  const cache = 1024 * 512
  const skipClassicSieve = n > MAX_CLASSIC_SIEVE_LENGTH // From that the classic sieve does not worth.
  const start = getTimeMicro()
  let failed = false;
  let c, ce, se, lp

  try {
    
    const limit = n
    c = countPrimes(limit, cache)
    ce = !skipClassicSieve ? classicOrSegmentedEratosthenes(limit) : {primes: [], length: 0, filename: "", isPartial: false, time: 0}
    se = segmentedEratosthenes(limit)
    lp = lastTenEratosthenes(BigInt(limit))
    

    if (skipClassicSieve) {
      if (!arrayEquals(lp.primes, se.primes)
      ) {
        failed = true
        stringArray.push("<span style='color: red'>Something went wrong generating primes to " + sort + "</span>")
        stringArray.push("PS: " +  lp.primes.toString())
        stringArray.push("SS: " + se.primes.toString())
      }
      if (c.length !== se.length) {
        failed = true
        stringArray.push("<span style='color: red'>Something went wrong counting primes to " + sort + "</span>")
        stringArray.push("GS: " + c.length + " !== SS: " + se.length)
      }
    } else {
      if (!arrayEquals(lp.primes, se.primes) || 
        !arrayEquals(se.primes, ce.primes)
      ) {
        failed = true
        stringArray.push("<span style='color: red'>Something went wrong generating primes to " + sort + "</span>")
        stringArray.push("PS: " + lp.primes.toString())
        stringArray.push("SS: " + se.primes.toString())
        stringArray.push("ES: " + ce.primes.toString())
      }
      if (c.length !== ce.length || ce.length !== se.length) {
        failed = true
        stringArray.push("<span style='color: red'>Something went wrong counting primes to " + sort + "</span>")
        stringArray.push("GS: " + c.length + " !== ES: " + ce.length + " !== SS: " + se.length)
      }
    }
    stringArray.push("It took " + duration(lp.time) + " to generate the last 10 primes")
    !skipClassicSieve && stringArray.push("It took " + duration(ce.time) + " to generate the full sieve at once and iterate over all primes")
    stringArray.push("It took " + duration(se.time) + " to generate the full sieve with segments and iterate over all primes")
    stringArray.push("It took " + duration(c.time) + " to count with a bit wise segmentation sieve.")
    !failed && stringArray.push("<span style='color: green'>Counted " + c.length + " primes</span>")
  } catch(e) {
    failed = true
    stringArray.push("<span style='color: red;'>ERROR: An error ocurred processing checkPrimeCounts(" + sort + ")</span>")
    stringArray.push(errorMessage(e))
  }  

  return {
    BFTime: 0,
    SSTime: se?.time||0,
    ESTime: ce?.time||0,
    GSTime: c?.time||0,
    PSTime: lp?.time||0,
    name: "GS ES SS PS to " + sort,
    passed: !failed,
    time: getTimeMicro() - start,
  }
}
