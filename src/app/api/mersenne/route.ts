// TODO: review:
// Understand demonstration: https://en.wikipedia.org/wiki/Lucas%E2%80%93Lehmer_primality_test#Proof_of_correctness
// Investigate GPU usage: https://github.com/preda/gpuowl
// http://www.polprimos.com/
import fetch from 'node-fetch';
import _ from "lodash"

import { badRequest, errorResponse, HttpError, jsonResponse } from '@/server/http'
import { requireAdmin } from '@/server/auth'
import writeReport from '@/server/report'
import getTimeMicro from '@/utils/getTimeMicro'
import duration from '@/utils/duration';
import eratosthenes from '@/math/eratosthenes';
import mersenneServer, { isMersenneLanguage, MERSENNE_LANGUAGES, MersenneLanguage } from '@/server/mersenneServer';
import { KNOWN_MERSENNE_PRIMES, MERSENNE_TABLE } from '@/constants';

export interface MersennePrime {
  p: number;
  isPrime: boolean;
}

export interface MersenneReport {
  language: string;
  maxPrime: number;
  time: number;
  mersennePrimes: MersennePrime[];
}

//https://en.wikipedia.org/wiki/Pocklington_primality_test

//https://es.wikipedia.org/wiki/N%C3%BAmero_primo_de_Mersenne

export async function GET(request: Request): Promise<Response> {

  const start = getTimeMicro();

  try {
    
    // TODO: use a temp file to record the processed values. Make the search resumable. Maybe we can just pack all this search into Scala code and use the mather just to link to the results.
    // TODO: use a DB is better than just files.
    ////////////////////////////////////////////////////////////////////////////
    // Benchmark Scala vs Go vs Rust vs C++
    ////////////////////////////////////////////////////////////////////////////
    const { searchParams } = new URL(request.url||"".toString())
    const LIMIT: number = parseInt(searchParams.get('maxPrime') || "128");
    const numberOfThreads: number = parseInt(searchParams.get('numberOfThreads') || "16");
    const language: string = searchParams.get("lang") || "go"
    const mode = searchParams.get("mode") || "mersenne";

    requireAdmin(request)

    if (mode !== "mersenne" && mode !== "mersenne-check") {
      throw badRequest("Unknown mode " + mode);
    }
    if (language !== "all" && !isMersenneLanguage(language)) {
      throw badRequest("Unknown lang " + language + ", use c, go or all");
    }

    const filename = `debug_${mode}_${numberOfThreads}_${language}_${LIMIT}-V3.html`

    // Before computing anything, so a missing port fails fast
    const languages = language === "all" ? MERSENNE_LANGUAGES : [language]
    const servers = languages.map(l => [l, mersenneServer(l)] as const)

    const numbers = mode === "mersenne"
      ? eratosthenes(LIMIT, LIMIT).primes.map(p=>Number(p))
      : KNOWN_MERSENNE_PRIMES.slice(0, LIMIT)

    const strings = await mersennePrimesBenchmark(numbers, numberOfThreads, servers)

    const path = writeReport(filename, "Debug report", [
      ...strings,
      "<p style='text-align: center;'>It took " + duration(getTimeMicro() - start) + " to generate the report</p>",
      "<hr/>",
    ])

    return jsonResponse({message: "Report generated under " + path, time: getTimeMicro() - start})

  } catch (error) {
	console.log(error);
    return errorResponse(error, "Error generating report. ");
  }
}

// Both servers answer the same API, they only differ in how many primes go in each request
const BENCHMARKS: Record<MersenneLanguage, { label: string, batchSize: (numberOfThreads: number) => number }> = {
  c: { label: "c", batchSize: () => 500 },
  go: { label: "go", batchSize: numberOfThreads => numberOfThreads * 16 },
}

async function mersennePrimesBenchmark(numbers: number[], numberOfThreads: number, servers: (readonly [MersenneLanguage, string])[]): Promise<string[]> {

    let elapsed = getTimeMicro();
    const mersenneReport: MersenneReport[] = []

    for (const [language, server] of servers) {
      const { label, batchSize } = BENCHMARKS[language]
      const mersennePrimes = await computeMersenne(label, server, numbers, batchSize(numberOfThreads), numberOfThreads)
      mersenneReport.push(
        {language: label, maxPrime: numbers.slice(-1)[0], time: getTimeMicro() - elapsed, mersennePrimes}
      )
      elapsed = getTimeMicro()
    }
    
    for (var i = 0; i<mersenneReport.length - 1; i++) {
      if (!_.isEqual(mersenneReport[i].mersennePrimes, mersenneReport[i+1].mersennePrimes)) {
        console.log("////////////////////////////////////////////////")
        console.log(mersenneReport[i].language)
        console.log(mersenneReport[i].mersennePrimes)
        console.log("////////////////////////////////////////////////")
        console.log(mersenneReport[i+1].language)
        console.log(mersenneReport[i+1].mersennePrimes)
        throw new Error("Not deterministic computation!")
      }
    }

    if (mersenneReport.length < 1) {
      return []
    }

    const mersennePrimesRow = mersenneReport[0].mersennePrimes.map(mp => {
      const mersenneRow = MERSENNE_TABLE.find(mr => mr.prime === mp.p)
	  if (mersenneRow != undefined)
      	return "<tr><td style='text-align: center'>" + mersenneRow?.position + "</td><td style='text-align: center'>2**" + mersenneRow?.prime + "-1</td><td style='text-align: center'>" + mersenneRow?.discoveryDate + "</td><td style='text-align: center'>" + mersenneRow?.discoveredBy + "</td></tr>"
	  else
		return "";
    })

    const benchmarkRows = mersenneReport.reduce((acc: string[], val: MersenneReport) => {
      return [...acc,
        "<hr/>",
        "<p style='text-align: center;'><b>"  + val.language + "</b></p>",
        "<hr/>",
        "<p style='text-align: center;'>It took " + duration(val.time) + " to test " + numbers.length + " primes using " + numberOfThreads + " threads.",

      ]
    }, [])

    const stringArray = [
      "<table style='margin: 0 auto; width: 700px;'><thead><tr><th>#</th><th>Mersenne prime</th><th>Date</th><th>Finder</th></tr></thead><tbody>",
      ...mersennePrimesRow,
      "</tbody></table>",
      "<hr/>",
      "<p style='text-align: center;'>" + mersenneReport[0].mersennePrimes.length + " Mersenne primes found</p>",
      ...benchmarkRows,
      "<hr/>",
    ]

    return stringArray
}

///////////////////////////////////////////////////////////
// POST /lucas-lehmer-test, the same in the C and Go servers
///////////////////////////////////////////////////////////
async function computeMersenne(label: string, server: string, primesArray: number[], batchSize: number, numThreads: number): Promise<MersennePrime[]> {

  const mersennePrimes: MersennePrime[] = new Array();

  for (let i = 0; i < primesArray.length; i += batchSize) {
      const batch = primesArray.slice(i, i + batchSize);
      const response = await lucasLehmerTest(label, server, batch, numThreads);
      mersennePrimes.push(...response)
  }

  return mersennePrimes.sort((mp1, mp2) => mp1.p - mp2.p)
}

async function lucasLehmerTest(label: string, server: string, primes: number[], numThreads: number): Promise<MersennePrime[]>  {

  const url = server + "/lucas-lehmer-test";

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
        numbers: primes,
        num_threads: numThreads,
    }),
    timeout: 86400 * 1000 * 30, // A month. No timeouts wanted.
  }

  console.log("Requesting", url, options)

  const response = await fetch(url, options)

  if (!response.ok) {
    throw new HttpError(502, `${label} server error! Status: ${response.status} ${await response.text()}`);
  }

  const { results } = await response.json() as { results: { p: number, is_prime: boolean }[] }

  return results.filter(r => r.is_prime).map(r => ({p: r.p, isPrime: true}))
}
