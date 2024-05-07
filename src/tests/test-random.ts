import errorMessage from '@/helpers/errorMessage'
import duration from '@/helpers/duration'
import percent from '@/helpers/percent'
import getTimeMicro from '@/helpers/getTimeMicro'
import randomPrimes from '@/helpers/randomPrimes'
import countPrimes from '@/helpers/countPrimes'
import { ln } from '@/helpers/math'

interface TestRandomReport {
  time: number;
  prime: bigint;
  passed: boolean;
  error: string;
  tries: number;
  name: string;
}

let totalTests = 0

export default function testRandom(local: boolean): string[] {
    const randomTestSize = local ? 10**2 : 10**5

    // STEP 1: vales to evaluate
    // ==============================
    
    const elapsed = getTimeMicro()

    const randomArray = (n: number): number[] => new Array(randomTestSize).fill(0).map(() => n)

    // STEP 2: run the reports and generate the html
    // ==============================

    const testRandomValues = local
      ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 50, 100, 200]
      : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 50, 100, 200, 300, 400]
    
    totalTests = testRandomValues.length

    const randomTestCount = randomTestSize * testRandomValues.length
    let errorsArray: string[] = []

    const testRows: string[] = [
      ...testRandomValues
        .reduce((acc: string[], n: number): string[] => {
          const t = testRow(randomArray(n))
          if (t[1].length > 0 && t[1][0] !== "") {
            errorsArray = [
              ...errorsArray,
              ...t[1].map(error => "<p style='color=red;text-align:center;'" + error + "</p>"),
              "<hr/>"
            ]
          }
          return [...acc, ...t[0]];
        }, []),
    ];

    const stringArray = [
      "<table style='width: 770px;margin: 0 auto;'><thead>",
      "<tr>",
      "<th style='text-align:left'># Tests</th>",
      "<th style='text-align:left'>Prime length</th>",
      "<th style='text-align:left'>Prime %</th>",
      "<th style='text-align:left'># Tries</th>",
      "<th style='text-align:left'>Avg time</th>",
      "<th style='text-align:left'>Min time</th>",
      "<th style='text-align:left'>Max time</th>",
      "<th style='text-align:left'>Total time</th>",
      "<th style='text-align: left; width: 80px;'>Result</th>",
      "</tr>",
      "</thead><tbody>",
      ...testRows,
      "<tr>",
      "<th style='text-align:left'># Tests</th>",
      "<th style='text-align:left'>-</th>",
      "<th style='text-align:left'>-</th>",
      "<th style='text-align:left'>-</th>",
      "<th style='text-align:left'>-</th>",
      "<th style='text-align:left'>-</th>",
      "<th style='text-align:left'>-</th>",
      "<th style='text-align:left'>Total time</th>",
      "<th style='text-align: left; width: 80px;'>-</th>",
      "</tr>",
      "<tr>",
      "<td style=''>" + randomTestCount + "</td>",
      "<td style=''>-</td>",
      "<td style=''>-</td>",
      "<td style=''>-</td>",
      "<td style=''>-</td>",
      "<td style=''>-</td>",
      "<td style=''>-</td>",
      "<td style=''>" + duration(getTimeMicro() - elapsed) + "</td>",
      "<td style=''>-</td>",
      "</tr>",
      "</tr></tbody></table>",
      "<hr/>",
      ...errorsArray.slice(0, 1000),
      "<p style='text-align: center;'><b>Used the following primaly algorithms</b></p>",
      "<p style='text-align: center;'>Find factors for values up to 1E23</p>",
      "<p style='text-align: center;'>Miller-Rabin and Baillie probabilistic primaly test up to 1E3000</p>",
      "<hr/>",
    ]

    return stringArray
}

let c = 0

function testRow(testValuesArray: number[]): string[][] {
  c++
  console.log("Test " + c + " from " + totalTests)
  const startX = getTimeMicro()
  let count = 0
  process.stdout.write("\r");
  process.stdout.write("\r");
  process.stdout.write("Randomized:   0.000% in " + duration(getTimeMicro() - startX)+ "          ")
  const maxCount = testValuesArray.length
  const testFactorizationArray: TestRandomReport[] = testValuesArray.map((n: number) => {

    process.stdout.write("\r");
    process.stdout.write("\r");
    process.stdout.write("Randomized: " + percent(BigInt(Math.round(count)), BigInt(Math.round(maxCount))) + " in " + duration(getTimeMicro() - startX)+ "         ")
    count++
    const number = BigInt(n)
    let sort = number.toString()[0] + "E" + (BigInt(number).toString().length - 1)
    sort = "<span title='" + number + "'>" + sort+ "</span>";
    const start = getTimeMicro()
    let error = "";
    let failed = false;
    let prime = BigInt(2);
    let tries = 0;

    try {
      const f = randomPrimes(n, 1)
      prime = f.primes[0]
      tries = f.tries;
    } catch (e) {
      failed = true
      error = "Failed factoring " + sort + ". " + errorMessage(e)
    }
    
    return {
      name: "Prime of length " + n,
      error,
      passed: !failed,
      time: getTimeMicro() - start,
      prime, 
      tries
    }
  })

  process.stdout.write("\r");
  process.stdout.write("\r");
  process.stdout.write("Randomized: 100.000% in " + duration(getTimeMicro() - startX)+ "          \n")

  // STEP 3: create the test report
  // ==============================

  const testFactorizationPassedCount = testFactorizationArray.reduce((acc: number, val: TestRandomReport): number => acc + (val.passed ? 1 : 0), 0)

  const testFactorizationTime = testFactorizationArray.reduce((acc: number, val: TestRandomReport): number => acc + val.time, 0)

  const testFactoritzationMaxTime = testFactorizationArray.reduce((acc: number, val: TestRandomReport): number => Math.max(acc, val.time), -Infinity)

  const testFactorizationMinTime = testFactorizationArray.reduce((acc: number, val: TestRandomReport): number => Math.min(acc, val.time), Infinity)

  const testFactorizationCount = testFactorizationArray.length

  const testCountSort = totalTests.toString()[0] + "E" + (totalTests.toString().length - 1)

  const totalTries = testFactorizationArray.reduce((acc, val) => acc + val.tries, 0)
  
  const error = testFactorizationArray.filter(test => !test.passed).map(test => test.error).join(". ")
  
  const l = testFactorizationArray[0].prime.toString().length

  const stringArray = [
    "<tr>",
    "<td style=''>" + testFactorizationArray.length + "</td>",
    "<td style=''>" + testFactorizationArray[0].prime.toString().length + "</td>",
    "<td style=''>" + (l < 10 ? percentPrimes(l) : percentPrimesEstimated(l)) + "</td>",
    "<td style=''>" + totalTries + "</td>",
    "<td style=''>" + duration(Math.round(testFactorizationTime / testFactorizationArray.length)) + "</td>",
    "<td style=''>" + duration(testFactorizationMinTime) + "</td>",
    "<td style=''>" + duration(testFactoritzationMaxTime) + "</td>",
    "<td style=''>" + duration(testFactorizationTime) + "</td>",
    "<td style='text-align: center;color:white;" + (testFactorizationPassedCount === testFactorizationCount ? "background: green;" : "background: red;") + "'>" + percent(BigInt(testFactorizationPassedCount), BigInt(testFactorizationCount)) + "</td>",
    "</tr>"
  ]

  return [
    stringArray,
    error.split(". ")
  ]
}

const percentPrimesEstimated = (digits: number): string => {
          
  const maxTenDigits = BigInt(new Array(digits).fill("9").join(""))
  const maxNineDigits = BigInt(new Array(digits - 1).fill("9").join(""))
  const numbersWithTenDigits = maxTenDigits - maxNineDigits
  const primesWithLessThanTenDigitsEstimated = maxTenDigits / ln(maxTenDigits)
  const primesWithLessThanNineDigitsEstimated = maxNineDigits / ln(maxNineDigits)
  const primesWithTenDigitsEstimated = primesWithLessThanTenDigitsEstimated - primesWithLessThanNineDigitsEstimated
  
  return percent(primesWithTenDigitsEstimated, numbersWithTenDigits)
}

const percentPrimes = (digits: number): string => {
  const buffer = 1024 * 512 // 512KB cache
  const maxTenDigits = BigInt(new Array(digits).fill("9").join(""))
  const maxNineDigits = BigInt(new Array(digits - 1).fill("9").join(""))
  const numbersWithTenDigits = maxTenDigits - maxNineDigits
  const c = countPrimes(parseInt(maxTenDigits.toString()), buffer)
  const d = countPrimes(parseInt(maxNineDigits.toString()), buffer)
  const primesWithLessThanTenDigits = BigInt(c?.length || 0)
  const primesWithLessThanNineDigits = BigInt(d?.length || 0)
  const primesWithTenDigits = primesWithLessThanTenDigits - primesWithLessThanNineDigits
  
  return percent(primesWithTenDigits, numbersWithTenDigits)
}