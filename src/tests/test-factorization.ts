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
export default function testFactorization(local: boolean): string[] {
  
  const randomTestSize = local  
    ? 10**2
    : 10**5

  const elapsed = getTimeMicro()

  const randomArray = (n: number): bigint[] => new Array(randomTestSize).fill(0).map(() => BigInt(id(n)) + BigInt(1))

  const fullArray = (n: number): bigint[] => new Array(10**n).fill(0).map((e, i) => BigInt(i) + BigInt(1))

  // STEP 2: run the reports and generate the html
  // ==============================

  const testFullValues = local  
    ? [1, 2, 3, 4]
    : [1, 2, 3, 4, 5, 6]

  const testRandomValues = local
    ? new Array(18).fill(0).map((e, i) => i + 5) // 5 to 22
    : new Array(19).fill(0).map((e, i) => i + 7) // 7 to 25

  totalTests = testFullValues.length + testRandomValues.length

  const testsCount = testFullValues.reduce((acc, val) => acc + 10**val, 0) + randomTestSize * testRandomValues.length

  let errorsArray: string[] = []
  const testRows: string[] = [
    ...testFullValues
      .reduce((acc: string[], n: number): string[] => {
        const t = testRow(fullArray(n), n)
        if (t[1].length > 0 && t[1][0] !== "") {
          errorsArray = [
            ...errorsArray,
            ...t[1].map(error => "<p style='color=red;text-align:center;'" + error + "</p>"),
            "<hr/>"
          ]
        }
        
        return [...acc, ...t[0]];
      }, []),
    ...testRandomValues
      .reduce((acc: string[], n: number): string[] => {
        const t = testRow(randomArray(n), n)
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
    "<table style='width: 970px;margin: 0 auto;'><thead>",
    "<tr>",
    "<th style='text-align:left'># Tests</th>",
    "<th style='text-align:left'>Max value</th>",
    "<th style='text-align:left'># Factors avg</th>",
    "<th style='text-align:left'>Factors length avg</th>",
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
    "<td style=''>" + testsCount + "</td>",
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
    "<p style='text-align: center;'><b>Tested the following factorization algorithms</b></p>",
    "<p style='text-align: center;'>Wheel divison for factors up to 1E7</p>",
    "<p style='text-align: center;'>Brent algorithm for factors up to 1E13</p>",
    "<hr/>",
  ]
  
  return stringArray
}
let c = 0

function testRow(testValuesArray: bigint[], n: number): string[][] {
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
    let sort = number.toString()[0] + "E" + (BigInt(number).toString().length - 1)
    sort = "<span title='" + number + "'>" + sort + "</span>";
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
      name: "Factorize " + sort,
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

  const maxValue = BigInt(10)**BigInt(n)

  const maxValueSort = "<span title='" + maxValue + "'>" + maxValue.toString()[0] + "E" + (maxValue.toString().length - 1) + ""

  const testCount = testValuesArray.length

  const error = testFactorizationArray.filter(test => !test.passed).map(test => test.error).join(". ")

  const maxFactorizationTime = testFactorizationArray.reduce((acc, test) => Math.max(acc, test.time), 0)
  const minFactorizationTime = testFactorizationArray.reduce((acc, test) => Math.min(acc, test.time), Infinity)

  const stringArray = [
    "<tr>",
    "<td style=''>" + testCount + "</td>",
    "<td style=''>" + maxValueSort + "</td>",
    "<td style=''>" + Math.round(testFactorizationPrimeCountAvg * 100) / 100 + "</td>",
    "<td style=''>" + Math.round(totalTestAverageFactorsLength * 100) / 100 + "</td>",
    "<td style=''>" + duration(Math.round(testFactorizationTime/testCount)) + "</td>",
    "<td style=''>" + duration(minFactorizationTime) + "</td>",
    "<td style=''>" + duration(maxFactorizationTime) + "</td>",
    "<td style=''>" + duration(testFactorizationTime) + "</td>",
    "<td style='text-align: center;color:white;" + (testFactorizationPassedCount === testFactoritzationCount ? "background: green;" : "background: red;") + "'>" + percent(BigInt(testFactorizationPassedCount), BigInt(testCount)) + "</td>",
    "</tr>"
  ]

  return [stringArray, error.split(". ")];
}
