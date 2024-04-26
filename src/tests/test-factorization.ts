import id from '@/helpers/id'
import errorMessage from '@/helpers/errorMessage'
import duration from '@/helpers/duration'
import percent from '@/helpers/percent'
import getTimeMicro from '@/helpers/getTimeMicro'
import factors from '@/helpers/factors'
import { PrimePower } from '@/types'
import { max, min } from '@/helpers/math'

interface TestFactorReport {
  time: number;
  name: string;
  passed: boolean;
  error: string;
  factorsCount: number;
  factorsAvgLength: number;
  factors: PrimePower[]
}

let totalTests = 0

//test the factorization and generate a report
export default function testFactorization(): string[] {
  
  const randomTestSize = 5 * 10**3
  const elapsed = getTimeMicro()

  const randomArray = (n: number): bigint[] => new Array(randomTestSize).fill(0).map(() => BigInt(id(n)) + BigInt(1))

  const fullArray = (n: number): bigint[] => new Array(10**n).fill(0).map((e, i) => BigInt(i) + BigInt(1))

  // STEP 2: run the reports and generate the html
  // ==============================

  const testFullValues = new Array(6).fill(0).map((e, i) => i + 1)    // 1 to 6
  const testRandomValues = new Array(17).fill(0).map((e, i) => i + 7) // 7 to 23
  
  totalTests = testFullValues.length + testRandomValues.length
  
  const testRows: string[] = [
    ...testFullValues
      .reduce((acc: string[], n: number) => [...acc, ...testRow(fullArray(n))], []),
    ...testRandomValues
      .reduce((acc: string[], n: number) => [...acc, ...testRow(randomArray(n))], []),
  ];

  const stringArray = [
    "<table style='width: 970px;margin: 0 auto;'><thead>",
    "<tr>",
    "<th style='text-align:left'># Tests</th>",
    "<th style='text-align:left'>max value</th>",
    "<th style='text-align:left'># factors avg</th>",
    "<th style='text-align:left'>factors length avg</th>",
    "<th style='text-align:left'>avg Time</th>",
    "<th style='text-align:left'>max time</th>",
    "<th style='text-align:left'>min time</th>",
    "<th style='text-align:left'>Total time</th>",
    "<th style='text-align: left; width: 80px;'>Result</th>",
    "</tr>",
    "</thead><tbody><tr>",
    ...testRows,
    "<tr>",
    "<th style='text-align:left'># Tests</th>",
    "<th style='text-align:left'>max value</th>",
    "<th style='text-align:left'># factors avg</th>",
    "<th style='text-align:left'>factors length avg</th>",
    "<th style='text-align:left'>avg Time</th>",
    "<th style='text-align:left'>max time</th>",
    "<th style='text-align:left'>min time</th>",
    "<th style='text-align:left'>Total time</th>",
    "<th style='text-align: left; width: 80px;'>Result</th>",
    "</tr>",
    "<tr>",
    "<td style=''>" + totalTests + "</td>",
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
    "<p style='text-align: center;'><b>Tested the following factorization algorithms</b></p>",
    "<p style='text-align: center;'>Brute force for factors up to 10**7</p>",
    "<p style='text-align: center;'>Brent algorithm for factors up to 10**11</p>",
    "<hr/>",
  ]
  
  return stringArray
}
let c = 0

function testRow(testValuesArray: bigint[]): string[] {
  c++
  console.log("Test " + c + " from " + totalTests)
  const startX = getTimeMicro()
  let count = 0
  process.stdout.write("\r");
  process.stdout.write("\r");
  process.stdout.write("Factorized:   0.000% in " + duration(getTimeMicro() - startX)+ "          ")
  const maxCount = testValuesArray.length
  const testFactorizationArray: TestFactorReport[] = testValuesArray.map((n: bigint) => {

    process.stdout.write("\r");
    process.stdout.write("\r");
    process.stdout.write("Factorized: " + percent(BigInt(Math.round(count)), BigInt(Math.round(maxCount))) + " in " + duration(getTimeMicro() - startX)+ "         ")
    count++
    const number = BigInt(n)
    const sort = number.toString()[0] + "E" + (BigInt(number).toString().length - 1)
    const start = getTimeMicro()
    let error = "";
    let failed = false;
    let factorsCount = 0;
    let factorsLengthSum = 0;
    let factorsArray: PrimePower[] = []
    try {
      const f = factors(BigInt(number))
      factorsCount = f.factors.reduce((acc: number, val: PrimePower): number => {
        return acc + val.exponent
      }, 0)
      factorsLengthSum = f.factors.reduce((acc: number, val: PrimePower): number => {
        return acc + val.prime.toString().length * val.exponent
      }, 0)
      factorsArray = f.factors
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
      factorsAvgLength: factorsCount === 0 ? 1 : factorsLengthSum / factorsCount,
      factors: factorsArray
    }
  })

  process.stdout.write("\r");
  process.stdout.write("\r");
  process.stdout.write("Factorized: 100.000% in " + duration(getTimeMicro() - startX)+ "          \n")

  // STEP 3: create the test report
  // ==============================

  const testFactorizationPassedCount = testFactorizationArray.reduce((acc: number, val: TestFactorReport): number => acc + (val.passed ? 1 : 0), 0)

  const testFactorizationFailedCount = testFactorizationArray.reduce((acc: number, val: TestFactorReport): number => acc + (val.passed ? 0 : 1), 0)

  const testFactorizationTime = testFactorizationArray.reduce((acc: number, val: TestFactorReport): number => acc + val.time, 0)

  const testFactoritzationCount = testFactorizationArray.length

  const testFactorizationPrimeCount = testFactorizationArray.reduce((acc, val) => {
    return acc + val.factorsCount
  }, 0)

  const testFactorizationPrimeCountAvg = testFactorizationPrimeCount / testFactorizationArray.length
  const factorsAvgLength = testFactorizationArray.reduce((acc, val) => {
    return acc + val.factorsAvgLength;
  }, 0)

  const maxPrimeFound = testFactorizationArray.reduce((acc, val) => {
    return max(acc, val.factors.reduce((acc2, val2) => {
      return max(acc2, val2.prime)
    }, BigInt(0)))
  }, BigInt(0))

  const minPrimeFound = testFactorizationArray.reduce((acc, val) => {
    return min(acc, val.factors.reduce((acc2, val2) => {
      return min(acc2, val2.prime)
    }, BigInt(10)**BigInt(100)))
  }, BigInt(10)**BigInt(100))

  const totalPrimesFound = testFactorizationPrimeCount

  const factorTestCount = testFactorizationArray.length;

  const totalTestAverageFactorsLength = factorsAvgLength / factorTestCount

  const minValue = testValuesArray.reduce((acc, val) => min(acc, val), BigInt(10)**BigInt(100))

  const minValueSort = "<span title='" + minValue + "'>" + minValue.toString()[0] + "E" + (minValue.toString().length - 1) + ""

  const maxValue = testValuesArray.reduce((acc, val) => max(acc, val), BigInt(0))

  const maxValueSort = "<span title='" + maxValue + "'>" + maxValue.toString()[0] + "E" + (maxValue.toString().length - 1) + ""

  const testCount = testValuesArray.length

  const testCountSort = testCount.toString()[0] + "E" + (testCount.toString().length - 1)
  
  const maxFactorizationTime = testFactorizationArray.reduce((acc, test) => Math.max(acc, test.time), 0)
  const minFactorizationTime = testFactorizationArray.reduce((acc, test) => Math.min(acc, test.time), Infinity)

  const stringArray = [
    "<tr>",
    "<td style=''>" + testCountSort + "</td>",
    "<td style=''>" + maxValueSort + "</td>",
    "<td style=''>" + Math.round(testFactorizationPrimeCountAvg * 100) / 100 + "</td>",
    "<td style=''>" + Math.round(totalTestAverageFactorsLength * 100) / 100 + "</td>",
    "<td style=''>" + duration(Math.round(testFactorizationTime/testCount)) + "</td>",
    "<td style=''>" + duration(maxFactorizationTime) + "</td>",
    "<td style=''>" + duration(minFactorizationTime) + "</td>",
    "<td style=''>" + duration(testFactorizationTime) + "</td>",
    "<td style='text-align: center;color:white;" + (testFactorizationPassedCount === testFactoritzationCount ? "background: green;" : "background: red;") + "'>" + percent(BigInt(testFactorizationPassedCount), BigInt(testCount)) + "</td>",
    "</tr>"
  ]

  return stringArray;
}
