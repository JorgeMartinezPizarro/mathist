import os from 'node:os' 
import fs from "fs"

import errorMessage from '@/helpers/errorMessage'
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
    const KEY: string = searchParams.get('KEY') || "";
    const start = getTimeMicro()

    if (KEY !== process.env.MATHER_SECRET?.trim()) {
      throw new Error("Forbidden!")
    }

    const local = KEY == "111111"

    // Duration of the tests: local 12m, !local 42h.

    const stringArray = [
      "<h3 style='text-align: center;'>Test report of mather.ideniox.com</h3>",
      "<p style='text-align: center;'><b>" + os.cpus()[0].model + " " + (os.cpus()[0].speed/1000) + "GHz " + process.arch + "</b></p>",
      "<hr/>",
      "<p style='text-align: center;'><b>Test factors(n)</b></p>",
      "<hr/>",
      ...testFactorization(local),
      "<p style='text-align: center;'><b>Test randomPrimes(n)</b></p>",
      "<hr/>",
      ...testRandom(local),
      "<p style='text-align: center;'><b>Test sieve functions</b></p>",
      "<hr/>",
      ...testSieve(local),
      "<p style='text-align: center;'><b>Test Mersenne primes</b></p>",
      "<hr/>",
      ...testMersenne(2000),
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
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}

