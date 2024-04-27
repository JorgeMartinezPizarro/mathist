import { lastTenGenerated, segmentedEratosthenes, lastTenEratosthenes, classicOrSegmentedEratosthenes } from '@/helpers/eratosthenes'
import errorMessage from '@/helpers/errorMessage'
import countPrimes from "@/helpers/countPrimes"
import duration from '@/helpers/duration'
import percent from '@/helpers/percent'
import getTimeMicro from '@/helpers/getTimeMicro'
import { MAX_CLASSIC_SIEVE_LENGTH } from '@/Constants'
import isProbablePrime from '@/helpers/isProbablePrime'
import id from '@/helpers/id'
import { SieveReport } from '@/types'

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
  count: number;
}

export default function testSieve(local: boolean = true): string[] {
  const start = getTimeMicro();
  // tests in around 20 minutes
    // STEP 1: define values to test
    // ==============================
    
    // if !local, tests takes 33 extra hours. use it on a server
    const testValues = local
      ? [10**6, 10**7, 10**8, 10**9]
      : [10**6, 10**7, 10**8, 10**9, 2*10**9, 4*10**9, 10**10, 10**11, 10**12, 10**13]

    const testLastValues: bigint[] = [
      ...local 
        ? [BigInt(10**11), BigInt(10**12), BigInt(10**13), BigInt(10**14), BigInt(10**15)]
        : [BigInt(10**11), BigInt(10**12), BigInt(10**13), BigInt(10**14), BigInt(10**15), BigInt(10**16), BigInt(10**17), BigInt(10)**BigInt(18), BigInt(4)*BigInt(10)**BigInt(18), BigInt(416)*BigInt(10**16)]
      ,
      ...local
        ? [BigInt(10**10)]
        : new Array(1000).fill(0).map(e => BigInt(id(12)))
    ]
    
    const randomTestLastValues: bigint[] = (new Array(500).fill(0)).map(e => {
      return BigInt(id(6))
    })

    const bigTestLastValues = [
      ...local
        ? [20, 50, 100].map(e => BigInt(10)**BigInt(e))
        : [20, 25, 30, 50, 100, 150, 200, 250, 300, 400, 600].map(e => BigInt(10)**BigInt(e)),
      ...local
        ? new Array(10).fill(0).map(e => BigInt(id(20)))
        : new Array(1000).fill(0).map(e => BigInt(id(20)))
    ]

    // STEP 2: test over the values
    // ==============================

    const testPrimesCountArray = testValues.map(i => checkPrimeCounts(i))
    
    const testLastPrimes = [
      ...testLastValues.map(i => checkLastPrimes(i)), 
      ...randomTestLastValues.map(i => checkLastPrimes(i)), 
    ]

    const testLastGeneratedPrimes = bigTestLastValues.map(i => checkLastGeneratedPrimes(i))

    const countPassedTests = (tests: TestReport[]): number => tests.filter(line => line.passed === true).length

    const countFailedTests = (tests: TestReport[]): number => tests.filter(line => line.passed === false).length
    
    const testArray = [
      ...testPrimesCountArray,
      ...testLastPrimes,
      ...testLastGeneratedPrimes
    ]

    const passedTests = countPassedTests(testArray)

    const failedTests = countFailedTests(testArray)
    
    

    const testArrayToDisplay = [
      ...testArray.filter(test => test.passed).sort((test1, test2) => test1.time - test2.time).slice(-20).reverse(),
    ]

    // STEP 3: create the test report
    // ==============================

    const testRows = testArrayToDisplay.map(test => "<tr><td>" +
        test.name +
      "</td><td>" +
        test.count +
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

    const totalCount = testArray.reduce((acc, val) => acc + val.count, 0)

    const errorTests = testArray.filter(test => !test.passed).map(test => "" + 
      "<p style='color:red;text-align:center;'>An error ocurred in test <b>" + test.name+ "</b></p>" +
      "<p style='color:red;text-align:center;'>" + test.error.split(". ").join("</p><p style='color:red;text-align:center;'>") + "</>" + 
      "<hr/>" 
    )

    const stringArray = [
      "<table style='width: 850px;margin: 0 auto;'><thead>" + 
      "<tr><th style='text-align: left;'>Test name</th><th style='text-align: left;'># primes</th><th style='text-align: left;'>SS time</th><th style='text-align: left;'>ES time</th><th style='text-align: left;'>GS time</th><th style='text-align: left;'>PS time</th><th style='text-align: left;'>BF time</th><th style='text-align: left;'>Total time</th><th style='text-align: left; width: 80px;'>Result</th></tr>" + 
      "</thead><tbody>",
      ...testRows,
      "<tr><td>" + (testArray.length - testRows.length) + " more</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>",
      "<tr><th style='text-align: left;'># tests</th><th style='text-align: left;'># primes</th><th style='text-align: left;'>SS time</th><th style='text-align: left;'>ES time</th><th style='text-align: left;'>GS time</th><th style='text-align: left;'>PS time</th><th style='text-align: left;'>BF time</th><th style='text-align: left;'>Total time</th><th style='text-align: left; width: 80px;'>Result</th></tr>" + 
      "<tr><td>" + testArray.length + "</td><td>" + totalCount + "</td><td>" + SSTime + "</td><td>" + ESTime + "</td><td>" + GSTime + "</td><td>" + PSTime + "</td><td>" + BFTime + "</td><td>" + time + "</td><td  style='text-align:center;color:white;" + (failedTests === 0 ? "background: green;" : "background: red;") + "'>" + percent(BigInt(passedTests), BigInt(passedTests + failedTests)) + "</td>",
      "</tbody></table>",
      "<hr/>",
      ...errorTests,
      "<p style='text-align: center;'><b>Tested the following prime algorithms</b></p>",
      "<p style='text-align: center;'>SS: Segmented Sieve</p>",
      "<p style='text-align: center;'>ES: Eratosthenes' Sieve</p>",
      "<p style='text-align: center;'>GS: Gordon's Sieve</p>",
      "<p style='text-align: center;'>PS: Partial Segmented Sieve</p>",
      "<p style='text-align: center;'>BF: Brute force generator</p>",
      "<hr/>",
    ]

    return stringArray
}

const checkLastGeneratedPrimes = (number: bigint): TestReport => {
  const start = getTimeMicro();
  const sort = number.toString()[0] + "E" + (number.toString().length - 1)
  const stringArray: string[] = []
  let failed = false
  let sr: SieveReport | false = false
  try {
    sr = lastTenGenerated(number)
    
    if (sr.primes.length !== 10) {
        stringArray.push("Failed to generate 10 primes checkLastGeneratedPrimes(" + sort + ")")
        failed = true
    }
  } catch(e) {
    stringArray.push("ERROR: An error ocurred processing checkLastGeneratedPrimes(" + sort + ")")
    stringArray.push(errorMessage(e))
    failed = true
  }

  return {
    error: stringArray.join(". "),
    BFTime: sr && sr.time||0,
    SSTime: 0,
    ESTime: 0,
    GSTime: 0,
    PSTime: 0,
    name: "<span title='" + number + "'>BF to " + sort+ "</span>",
    passed: !failed,
    time: getTimeMicro() - start,
    count: sr && sr.length||0,
  }
}

const checkLastPrimes = (number: bigint): TestReport => {

  const start = getTimeMicro();
  const sort = number.toString()[0] + "E" + (number.toString().length - 1)
  const stringArray: string[] = []
  let failed = false
  let sr: SieveReport | false = false

  try {
    sr = lastTenEratosthenes(number)
    sr.primes.forEach(p => {
      if (!isProbablePrime(p)) {
        stringArray.push("The generated number " + p + " is not prime!")
        failed = true
      }
    })
    if (sr.primes.length !== 10) {
        stringArray.push("Failed to generate 10 primes at checkLastPrimes(" + sort + ")")
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
    PSTime: sr && sr.time||0,
    name: "<span title='" + number + "'>PS to " + sort+ "</span>",
    passed: !failed,
    time: getTimeMicro() - start,
    count: sr && sr.length||0,
  }
}

const checkPrimeCounts = (n: number): TestReport => {
  
  // Needed to increase the cache from 512KB to 10MB for 10**13
  const sort = n.toString()[0] + "E" + (n.toString().length - 1)
  const stringArray: string[] = []
  const cache = 1024**2 * 2**4
  const skipClassicSieve = n > MAX_CLASSIC_SIEVE_LENGTH // From that the classic sieve does not worth.
  const start = getTimeMicro()
  let failed = false;
  let c: SieveReport | false = false
  let ce: SieveReport | false = false
  let se: SieveReport | false = false
  let lp: SieveReport | false = false
  let bf: SieveReport | false = false

  try {
    
    const limit = n
    c = countPrimes(limit, cache)
    ce = !skipClassicSieve ? classicOrSegmentedEratosthenes(limit, 10) : {primes: [], length: 0, filename: "", isPartial: false, time: 0}
    se = segmentedEratosthenes(limit)
    lp = lastTenEratosthenes(BigInt(limit))
    bf = lastTenGenerated(BigInt(limit))
    
    if (skipClassicSieve) {
      if (!arrayEquals(lp.primes, se.primes) || 
        !arrayEquals(se.primes, bf.primes)
      ) {
        failed = true
        stringArray.push("Primes generated are not the same " + sort + "")
        stringArray.push("PS: " +  lp.primes.join(", "))
        stringArray.push("BF: " +  bf.primes.join(", "))
        stringArray.push("SS: " + se.primes.join(", "))
      }
      if (c.length !== se.length) {
        failed = true
        stringArray.push("Count primes give different results " + sort + "")
        stringArray.push("GS: " + c.length + " !== SS: " + se.length)
      }
    } else {
      if (!arrayEquals(lp.primes, se.primes) || 
        !arrayEquals(se.primes, ce.primes) || 
        !arrayEquals(ce.primes, bf.primes)
      ) {
        failed = true
        stringArray.push("Primes generated are not the same " + sort + "")
        stringArray.push("PS: " + lp.primes.join(", "))
        stringArray.push("SS: " + se.primes.join(", "))
        stringArray.push("ES: " + ce.primes.join(", "))
        stringArray.push("BF: " + bf.primes.join(", "))
      }
      if (c.length !== ce.length || ce.length !== se.length) {
        failed = true
        stringArray.push("Count primes give different results " + sort + "")
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
    BFTime: bf && bf.time||0,
    SSTime: se && se?.time||0,
    ESTime: ce && ce.time||0,
    GSTime: c && c.time||0,
    PSTime: lp && lp.time||0,
    name: "<span title='" + n + "'>All algorithms to " + sort+ "</span>",
    passed: !failed,
    time: getTimeMicro() - start,
    count: c && c.length||0
  }
}

function arrayEquals(a: (number | bigint)[], b: (number | bigint)[]) {
  return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => BigInt(val) === BigInt(b[index]));
}
