import { badRequest, errorResponse, jsonResponse } from '@/server/http'
import { requireAdmin } from '@/server/auth'
import writeReport from '@/server/report'
import duration from '@/utils/duration'
import getTimeMicro from '@/utils/getTimeMicro'
import factorizationReport from '@/reports/factorization'
import randomPrimesReport from '@/reports/randomPrimes'
import sieveReport from '@/reports/sieve'

// Stress test and benchmark of the math, written as an HTML report.
export async function GET(request: Request): Promise<Response> {

  try {

    const { searchParams } = new URL(request.url)
    const start = getTimeMicro()

    requireAdmin(request)

    // short=1 runs a reduced version of the tests, short=0 (default) the full one.
    // Duration of the tests: short 12m, full 42h.
    const shortParam = searchParams.get('short') || "0"
    if (!["0", "1"].includes(shortParam)) {
      throw badRequest("Invalid short = " + shortParam + ", use 0 or 1")
    }
    const short = shortParam === "1"

    const path = writeReport("test.html", "Test report", [
      "<p style='text-align: center;'><b>Test factors(n)</b></p>",
      "<hr/>",
      ...factorizationReport(short),
      "<p style='text-align: center;'><b>Test randomPrimes(n)</b></p>",
      "<hr/>",
      ...randomPrimesReport(short),
      "<p style='text-align: center;'><b>Test sieve functions</b></p>",
      "<hr/>",
      ...sieveReport(short),
      "<p style='text-align: center;'>It took " + duration(getTimeMicro() - start) + " to generate the report.</p>",
    ])

    return jsonResponse({ time: getTimeMicro() - start, message: "test report generated under " + path })
  } catch (error) {
    return errorResponse(error);
  }
}
