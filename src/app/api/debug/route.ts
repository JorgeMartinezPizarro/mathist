// TODO: review:
// Understand demonstration: https://en.wikipedia.org/wiki/Lucas%E2%80%93Lehmer_primality_test#Proof_of_correctness
// Investigate GPU usage: https://github.com/preda/gpuowl
// http://www.polprimos.com/
import os from 'node:os' 
import fs from 'fs' 
import _ from "lodash"
import getTimeMicro from '@/helpers/getTimeMicro';
import errorMessage from '@/helpers/errorMessage';
import duration from '@/helpers/duration';
import id from "@/helpers/id"
import BN from '@/helpers/multiplication';
import series from '@/helpers/series';
import differences from '@/helpers/differences';

export async function GET(request: Request): Promise<Response> {

  try {
    const start = getTimeMicro()
    let elapsed = getTimeMicro();
    let filename = `benchmark.html`
    
    const { searchParams } = new URL(request.url||"".toString())
    const KEY: string = searchParams.get('KEY') || "";
    const mode = searchParams.get("mode") || ""
    const LIMIT = parseInt(searchParams.get("LIMIT") || "0")
    
    let strings = []

    if (KEY !== process.env.MATHER_SECRET?.trim()) {
      throw new Error("Forbidden!");
    }

    if (mode === "primes") {
      strings = await primesDifferences(LIMIT)
      filename = "primes.html"
    } else {
      const t = 7

      const m  = 29 * 10 ** 6

      for (var i = 0; i < t; i++){
        console.log(i + " / " + t)
        const a = BigInt(id(m))
        const c = BigInt("2")
        const b = BigInt(id(m + 1));
        const x = (a**c-BigInt(2)) % b
      }

      const bigIntMultiplicationTime = getTimeMicro() - elapsed

      strings = [
        "<p style='text-align: center;'>Squaring " + t + " numbers with " + m + " digits with bigint and mod takes in average " + duration(Math.round((bigIntMultiplicationTime) / t)) + "</p>",
        "</hr>",
      ];

      filename= "benchmark.html"
    }
    
    const filepath = "./public/files/" + filename

    const stringArray = [
      "<h3 style='text-align: center;'>Benchmark report of mather.ideniox.com</h3>",
      "<p style='text-align: center;'><b>" + os.cpus()[0].model + " " + (os.cpus()[0].speed/1000) + "GHz , " + os.cpus().length + " cores, " + process.arch + "</b></p>",
      "<hr/>",
      ...strings,  
      "<p style='text-align: center;'>It took " + duration(getTimeMicro() - start) + " to generate the report</p>",
      "<hr/>",
    ]
    
    fs.writeFileSync(filepath, '<!DOCTYPE html><html><head><style>hr {height: 1px;background-color: #1976d2!important;border: none;margin: 16px!important;} b, th, h3 {color: #1976d2;}</style><meta charset="utf-8"><meta http-equiv="content-type" content="text/html; charset=UTF-8" /><meta http-equiv="content-type" content="application/json; charset=utf-8" /></head><body>', 'utf8')
    stringArray.forEach(string => 
      fs.appendFileSync(filepath, string, 'utf8')
    );
    
    fs.appendFileSync(filepath, "</body></html>", 'utf8')

    return Response.json({message: "Report generated under " + filename, time: getTimeMicro() - start})

  } catch (error) {
    return Response.json({ error: "Error generating report. " + errorMessage(error) }, { status: 500 });
  }
}

async function primesDifferences(LIMIT: number): Promise<string[]> {
  const array = series(2 * LIMIT - 1, "prime")
  const diff = differences(array, 2)
  const result = diff.slice(0, LIMIT).map(subDiff => subDiff.slice(0, LIMIT))

  const table = result[0].map((number, i) => "<tr><td style='text-align: center;'>" + (i + 1)  + "</td><td style='text-align: center;'>" + number + "</td><td style='text-align: center;'>" + result[1][i] + "</td><td style='text-align: center;'>" + result[2][i] + "</td></tr>")
  
  return [
    "<table style='width: 500px; margin: 0 auto;'><thead>",
    "<tr><th>n</th><th>Pn</th><th>Δ(Pn)</th><th>Δ2(Pn)</th></tr>",
    "</thead>",
    "<tbody>",
    ...table,
    "</tbody></table>",
  ]
}
