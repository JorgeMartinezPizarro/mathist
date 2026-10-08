import os from 'node:os' 
import fs from "fs"

import { badRequest, errorResponse } from '@/helpers/http'
import { requireAdmin } from '@/helpers/auth'
import duration from '@/helpers/duration'
import getTimeMicro from '@/helpers/getTimeMicro'
import testRandom from '@/tests/test-random'
import testFactorization from '@/tests/test-factorization'
import testSieve from '@/tests/test-sieve'
import testMersenne from '@/tests/test-mersenne'

export async function GET(request: Request): Promise<Response> {  

  (BigInt.prototype as any).toJSON = function() {
    return this.toString()
  }

  try {

    const { searchParams } = new URL(request.url||"".toString())
    const start = getTimeMicro()

    requireAdmin(request)

    // short=1 runs a reduced version of the tests, short=0 (default) the full one.
    // Duration of the tests: short 12m, full 42h.
    const shortParam = searchParams.get('short') || "0"
    if (!["0", "1"].includes(shortParam)) {
      throw badRequest("Invalid short = " + shortParam + ", use 0 or 1")
    }
    const short = shortParam === "1"

    const stringArray = [
      "<h3 style='text-align: center;'>Test report of math.ideniox.com</h3>",
      "<p style='text-align: center;'><b>" + os.cpus()[0].model + " " + (os.cpus()[0].speed/1000) + "GHz " + process.arch + "</b></p>",
      "<hr/>",
      "<p style='text-align: center;'><b>Test factors(n)</b></p>",
      "<hr/>",
      ...testFactorization(short),
      "<p style='text-align: center;'><b>Test randomPrimes(n)</b></p>",
      "<hr/>",
      ...testRandom(short),
      "<p style='text-align: center;'><b>Test sieve functions</b></p>",
      "<hr/>",
      ...testSieve(short),
      "<p style='text-align: center;'>It took " + duration(getTimeMicro() - start) + " to generate the report.</p>",
    ]

    const filename = "./public/files/test.html"
    
    fs.writeFileSync(filename, '<!DOCTYPE html><html><head><style>hr {height: 1px;background-color: #1976d2!important;border: none;margin: 16px!important;} b, th, h3 {color: #1976d2;}</style><meta charset="utf-8"><meta http-equiv="content-type" content="text/html; charset=UTF-8" /><meta http-equiv="content-type" content="application/json; charset=utf-8" /></head><body>', 'utf8')
    stringArray.forEach(string => 
      fs.appendFileSync(filename, string, 'utf8')
    );
    
    fs.appendFileSync(filename, "</body></html>", 'utf8')

    return Response.json( {time: getTimeMicro() - start, message: "test report generated under /files/test.html"} )
  } catch (error) {
    return errorResponse(error);
  }
}

