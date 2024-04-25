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
import factors from '@/helpers/factors'
import { PrimePower } from '@/types'

interface TestReport {
  time: number;
  passed: boolean,
  name: string;
  SSTime: number;
  ESTime: number;
  GSTime: number;
  PSTime: number;
  BFTime: number;
  error: string;
}

interface TestFactorReport {
  time: number;
  name: string;
  passed: boolean;
  error: string;
  factorsCount: number;
  factorsAvgLength: number;
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

    const { searchParams } = new URL(request.url||"".toString())
    const KEY: string = searchParams.get('KEY') || "";
    const start = getTimeMicro();
    
    if (KEY !== process.env.MATHER_SECRET?.trim()) {
      throw new Error("Forbidden!")
    }
    
    // STEP 1: define values to test
    // ==============================
    // acceptable for local, 20m
    // server stress checks, 52h

    const testValues = KEY ==="111111"
      ? [10**6, 10**7, 10**8, 10**9, 2*10**9, 4*10**9, 10**10]
      : [10**6, 10**7, 10**8, 10**9, 2*10**9, 4*10**9, 10**10, 10**11, 10**12, 10**13]

    const testLastValues: bigint[] = [
      BigInt(10**11), BigInt(10**12), BigInt(10**13), BigInt(10**14), BigInt(10**15), BigInt(10**16), BigInt(10**17), BigInt(10)**BigInt(18), BigInt(4)*BigInt(10)**BigInt(18), BigInt(416)*BigInt(10**16),
      ...new Array(1000).fill(0).map(e => BigInt(id(12)))
    ]
    
    const randomTestLastValues: bigint[] = (new Array(500).fill(0)).map(e => {
      return BigInt(id(6))
    })

    const randomTestFactorizeValues: bigint[] = KEY==="111111"
      ? new Array(20000).fill(0).map(e => BigInt(id(21)))
      : new Array(200000).fill(0).map(e => BigInt(id(21)))
    
    const bigTestLastValues = [
      ...[20, 25, 30, 50, 100, 150, 200, 250, 300, 350, 400, 500].map(e => BigInt(10)**BigInt(e)),
      ...new Array(1000).fill(0).map(e => BigInt(id(20)))
    ]

    // STEP 2: test over the values
    // ==============================

    const testFactorizationArray: TestFactorReport[] = randomTestFactorizeValues.map(number => {
      const sort = number.toString()[0] + "E" + (number.toString().length - 1)
      const start = getTimeMicro()
      let error = "";
      let failed = false;
      let factorsCount = 0;
      let factorsLengthSum = 0;
      
      try {
        const f = factors(number)
        factorsCount = f.factors.reduce((acc: number, val: PrimePower): number => {
          return acc + val.exponent
        }, 0)
        factorsLengthSum = f.factors.reduce((acc: number, val: PrimePower): number => {
          return acc + val.prime.toString().length * val.exponent
        }, 0)
        if (f.message) error = f.message
      } catch (e) {
        failed = true
        error = "Failed factoring " + sort + ". " + errorMessage(e)
      }
      
      return {
        time: getTimeMicro() - start,
        name: "<span title='" + number + "'>Factorize " + sort + "</span>",
        passed: !failed,
        error,
        factorsCount,
        factorsAvgLength: factorsLengthSum / factorsCount,
      }
    })

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

    const rowPercentsEstimated = [10, 20, 30, 40, 50, 100, 200, 300, 1000, 10000, 40000]
      .map(printPercentPrimesEstimated)

    const testArray = [
      ...testPrimesCountArray,
      ...testLastPrimes,
      ...testLastGeneratedPrimes
    ]

    const testFactorizationTestToDisplay = [
      ...testFactorizationArray.filter(test => !test.passed),
      ...testFactorizationArray.filter(test => test.passed).sort((test1, test2) => test1.time - test2.time).slice(-5).reverse(),
      ...testFactorizationArray.filter(test => test.passed).sort((test1, test2) => test1.time - test2.time).slice(0, 5).reverse(),
    ]

    const testArrayToDisplay = [
      ...testArray.filter(test => !test.passed),
      ...testArray.filter(test => test.passed).sort((test1, test2) => test1.time - test2.time).slice(-20).reverse(),
    ]

    // STEP 3: create the test report
    // ==============================

    const testFactorRows = testFactorizationTestToDisplay.map(test => "<tr><td>" +
        test.name +
      "</td><td>" +
        duration(test.time) +
      "</td><td title='" + test.error + "' style='text-align: center;color: white;" + (test.passed ? "background: green;" : "background: red;") + "'>" +
        (test.passed ? "Passed" : "Failed") + 
      "</td></tr>"
    )

    const testRows = testArrayToDisplay.map(test => "<tr><td>" +
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
      "</td><td title='" + test.error + "' style='text-align: center;color: white;" + (test.passed ? "background: green;" : "background: red;") + "'>" +
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

    const testFactorizationPrimeCount = testFactorizationArray.reduce((acc, val) => {
      return acc + val.factorsCount
    }, 0)

    const testFactorizationPrimeCountAvg = testFactorizationPrimeCount / testFactorizationArray.length
    const factorsAvgLength = testFactorizationArray.reduce((acc, val) => {
      return acc + val.factorsAvgLength;
    }, 0)

    const factorTestCount = testFactorizationArray.length;

    const totalTestAverageFactorsLength = factorsAvgLength / factorTestCount

    const stringArray = [
      "<h3 style='text-align: center;'>Test report of mather.ideniox.com</h3>",
      "<p style='text-align: center;'><b>" + os.cpus()[0].model + " " + (os.cpus()[0].speed/1000) + "GHz " + process.arch + "</b></p>",
      "<hr/>",
      "<table style='width: 300px;margin: 0 auto;'><thead><tr><th style='text-align: left;'>Primes %</th><th style='text-align: left;'>Digits</th></tr></thead><tbody>",
      ...rowsPercentsExact,
      ...rowPercentsEstimated,
      "</tbody></table>",
      "<hr/>",
      "<table style='width: 850px;margin: 0 auto;'> <thead><tr><th style='text-align: left;'>Test name</th><th style='text-align: left;'>SS time</th><th style='text-align: left;'>ES time</th><th style='text-align: left;'>GS time</th><th style='text-align: left;'>PS time</th><th style='text-align: left;'>BF time</th><th style='text-align: left;'>Total time</th><th style='text-align: left; width: 80px;'>Result</th></tr></thead><tbody>",
      ...testRows,
      "<tr><td>" + (testArray.length - testRows.length) + " more</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>",
      "<tr><th style='text-align: left;'>Total tests</th><th style='text-align: left;'>SS time</th><th style='text-align: left;'>ES time</th><th style='text-align: left;'>GS time</th><th style='text-align: left;'>PS time</th><th style='text-align: left;'>BF time</th><th style='text-align: left;'>Total time</th><th style='text-align: left;'>Result</th></tr>",
      "<tr><td>" + testArray.length + "</td><td>" + SSTime + "</td><td>" + ESTime + "</td><td>" + GSTime + "</td><td>" + PSTime + "</td><td>" + BFTime + "</td><td>" + time + "</td><td  style='text-align:center;color:white;" + (failedTests === 0 ? "background: green;" : "background: red;") + "'>" + percent(BigInt(passedTests), BigInt(passedTests + failedTests)) + "</td>",
      "</tbody></table>",
      "<hr/>",
      "<p style='text-align: center;'><b>Tested the following prime algorithms</b></p>",
      "<p style='text-align: center;'>SS: Segmented Sieve</p>",
      "<p style='text-align: center;'>ES: Eratosthenes' Sieve</p>",
      "<p style='text-align: center;'>GS: Gordon's Sieve</p>",
      "<p style='text-align: center;'>PS: Partial Segmented Sieve</p>",
      "<p style='text-align: center;'>BF: Brute force generator</p>",
      "<hr/>",
      "<table style='width: 500px;margin: 0 auto;'><thead><tr><th style='text-align: left;'>Test name</th><th style='text-align: left;'>Time</th><th style='text-align: left; width: 80px;'>Result</th></tr></thead><tbody>",
      ...testFactorRows,
      "<tr><td>" + (testFactoritzationCount - testFactorRows.length) + " more</td><td>...</td><td>...</td>",
      "<tr><th style='text-align: left;'>Total tests</th><th style='text-align: left;'>Total time</th><th style='text-align: left; width: 80px;'>Result</th></tr>",
      "<tr><td>" + testFactoritzationCount + "</td><td>" + duration(testFactorizationTime) + "</td><td style='text-align:center;color:white;" + (testFactorizationPassedCount === testFactoritzationCount ? "background: green;" : "background: red;") + "'>" + percent(BigInt(testFactorizationPassedCount), BigInt(testFactoritzationCount)) + "</td>",
      "<tr>",
      "</tbody></table>",
      "<hr/>",
      "<p style='text-align: center;'><b>Factorization summary</b></p>",
      "<p style='text-align: center;'>The average of prime factors is " + Math.round(testFactorizationPrimeCountAvg * 100) / 100 + "</p>",
      "<p style='text-align: center;'>The average prime lenght is " + Math.round(totalTestAverageFactorsLength * 100) / 100 + "</p>",
      "<hr/>",
      "<p style='text-align: center;'><b>Tested the following factorization algorithms</b></p>",
      "<p style='text-align: center;'>Brute force for factors up to 10**7</p>",
      "<p style='text-align: center;'>Brent algorithm for factors up to 10**11</p>",
      "<hr/>",
      "<p style='text-align: center;'>It took " + duration(getTimeMicro() - start) + " to generate the report.</p>"
    ]

    // STEP 4: write the report to a file
    
    const filename = "./public/files/report.html"
    fs.writeFileSync(filename, '<html><head><meta charset="utf-8"><meta http-equiv="content-type" content="text/html; charset=UTF-8" /><meta http-equiv="content-type" content="application/json; charset=utf-8" /></head><body>', 'utf8')
    stringArray.forEach(string => 
      fs.appendFileSync(filename, string, 'utf8')
    );
    fs.appendFileSync(filename, "</body></html>", 'utf8')

    return Response.json( {time: getTimeMicro() - start, message: "report generated under /files/report.html"} )
  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}

const checkLastGeneratedPrimes = (number: bigint): TestReport => {
  const start = getTimeMicro();
  const sort = number.toString()[0] + "E" + (number.toString().length - 1)
  const stringArray: string[] = []
  let failed = false
  let sr
  try {
    sr = lastTenGenerated(number)
    
    if (sr.primes.length !== 10) {
        stringArray.push("Failed to generate 10 primes")
        failed = true
    }
  } catch(e) {
    stringArray.push("ERROR: An error ocurred processing checkLastGeneratedPrimes(" + sort + ")")
    stringArray.push(errorMessage(e))
    failed = true
  }

  return {
    error: stringArray.join(". "),
    BFTime: sr?.time||0,
    SSTime: 0,
    ESTime: 0,
    GSTime: 0,
    PSTime: 0,
    name: "<span title='" + number + "'>BF to " + sort+ "</span>",
    passed: !failed,
    time: getTimeMicro() - start,
  }
}

const checkLastPrimes = (number: bigint): TestReport => {

  const start = getTimeMicro();
  const sort = number.toString()[0] + "E" + (number.toString().length - 1)
  const stringArray: string[] = []
  let failed = false
  let sr

  try {
    sr = lastTenEratosthenes(number)
    

    sr.primes.forEach(p => {
      if (!isProbablePrime(p)) {
        stringArray.push("The generated number " + p + " is not prime!")
        failed = true
      }
    })
    if (sr.primes.length !== 10) {
        stringArray.push("Failed to generate 10 primes")
        failed = true
    }

    
  } catch(e) {
    stringArray.push("ERROR: An error ocurred processing checkLastPrimes(" + sort + ")")
    stringArray.push(errorMessage(e))
    failed = true
  }

  return {
    error: stringArray.join(". "),
    BFTime: 0,
    SSTime: 0,
    ESTime: 0,
    GSTime: 0,
    PSTime: sr?.time||0,
    name: "<span title='" + number + "'>PS to " + sort+ "</span>",
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
  
  // Needed to increase the cache from 512KB to 10MB for 10**13
  const sort = n.toString()[0] + "E" + (n.toString().length - 1)
  const stringArray: string[] = []
  const cache = 1024**2 * 2**4
  const skipClassicSieve = n > MAX_CLASSIC_SIEVE_LENGTH // From that the classic sieve does not worth.
  const start = getTimeMicro()
  let failed = false;
  let c, ce, se, lp, bf

  try {
    
    const limit = n
    c = countPrimes(limit, cache)
    ce = !skipClassicSieve ? classicOrSegmentedEratosthenes(limit) : {primes: [], length: 0, filename: "", isPartial: false, time: 0}
    se = segmentedEratosthenes(limit)
    lp = lastTenEratosthenes(BigInt(limit))
    bf = lastTenGenerated(BigInt(limit))
    
    if (skipClassicSieve) {
      if (!arrayEquals(lp.primes, se.primes) || 
        !arrayEquals(se.primes, bf.primes)
      ) {
        failed = true
        stringArray.push("Something went wrong generating primes to " + sort + "")
        stringArray.push("PS: " +  lp.primes.join(", "))
        stringArray.push("BF: " +  bf.primes.join(", "))
        stringArray.push("SS: " + se.primes.join(", "))
      }
      if (c.length !== se.length) {
        failed = true
        stringArray.push("Something went wrong counting primes to " + sort + "")
        stringArray.push("GS: " + c.length + " !== SS: " + se.length)
      }
    } else {
      if (!arrayEquals(lp.primes, se.primes) || 
        !arrayEquals(se.primes, ce.primes) || 
        !arrayEquals(ce.primes, bf.primes)
      ) {
        failed = true
        stringArray.push("Something went wrong generating primes to " + sort + "")
        stringArray.push("PS: " + lp.primes.join(", "))
        stringArray.push("SS: " + se.primes.join(", "))
        stringArray.push("ES: " + ce.primes.join(", "))
        stringArray.push("BF: " + bf.primes.join(", "))
      }
      if (c.length !== ce.length || ce.length !== se.length) {
        failed = true
        stringArray.push("Something went wrong counting primes to " + sort + "")
        stringArray.push("GS: " + c.length + " !== ES: " + ce.length + " !== SS: " + se.length)
      }
    }
    
  } catch(e) {
    failed = true
    stringArray.push("ERROR: An error ocurred processing checkPrimeCounts(" + sort + ")")
    stringArray.push(errorMessage(e))
  }  

  return {
    error: stringArray.join(". "),
    BFTime: bf?.time||0,
    SSTime: se?.time||0,
    ESTime: ce?.time||0,
    GSTime: c?.time||0,
    PSTime: lp?.time||0,
    name: "<span title='" + n + "'>All algorithms to " + sort+ "</span>",
    passed: !failed,
    time: getTimeMicro() - start,
  }
}
