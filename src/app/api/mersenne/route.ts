// TODO: review:
// Understand demonstration: https://en.wikipedia.org/wiki/Lucas%E2%80%93Lehmer_primality_test#Proof_of_correctness
// Investigate GPU usage: https://github.com/preda/gpuowl
// http://www.polprimos.com/
import os from 'node:os' 
import fs from 'fs' 
import fetch from 'node-fetch';
import _ from "lodash"

import errorMessage from '@/helpers/errorMessage'
import getTimeMicro from '@/helpers/getTimeMicro'
import duration from '@/helpers/duration';
import eratosthenes from '@/helpers/eratosthenes';
import { KNOWN_MERSENNE_PRIMES, MERSENNE_TABLE } from '@/Constants';

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
  
  (BigInt.prototype as any).toJSON = function() {
    return this.toString()
  }

  try {
    
    // TODO: use a temp file to record the processed values. Make the search resumable. Maybe we can just pack all this search into Scala code and use the mather just to link to the results.
    // TODO: use a DB is better than just files.
    ////////////////////////////////////////////////////////////////////////////
    // Benchmark Scala vs Go vs Rust vs C++
    ////////////////////////////////////////////////////////////////////////////
    const { searchParams } = new URL(request.url||"".toString())
    const KEY: string = searchParams.get('KEY') || "";
    const LIMIT: number = parseInt(searchParams.get('maxPrime') || "128");
    const numberOfThreads: number = parseInt(searchParams.get('numberOfThreads') || "16");
    const language: string = searchParams.get("lang") || "go"
    const mode = searchParams.get("mode") || "mersenne";
    
    if (KEY !== process.env.MATHER_SECRET?.trim()) {
      throw new Error("Forbidden!" + KEY + " - " + process.env.MATHER_SECRET);
    }
    
    let filename = `/files/debug_${mode}_${numberOfThreads}_${language}_${LIMIT}-V2.html`

    let languages;
    let numbers;

    if (mode === "mersenne") {
      languages = language === "all" ? ["c", "go"] : [language]
      numbers = eratosthenes(LIMIT, LIMIT).primes.map(p=>Number(p))
      
    } else if (mode === "mersenne-check") {
      languages = language === "all" ? ["c", "go"] : [language]
      numbers = KNOWN_MERSENNE_PRIMES.slice(0, LIMIT)
    } else {
      throw new Error("Unknown mode " + mode);
    }

    const strings = await mersennePrimesBenchmark(numbers, numberOfThreads, languages)

    const filepath = "./public" + filename

    const stringArray = [
      "<h3 style='text-align: center;'>Debug report of math.ideniox.com</h3>",
      "<p style='text-align: center;'><b>" + os.cpus()[0].model + " " + (os.cpus()[0].speed/1000) + "GHz , " + os.cpus().length + " cores, " + process.arch + "</b></p>",
      "<hr/>",
      ...strings,
      "</hr>",
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

async function mersennePrimesBenchmark(numbers: number[], numberOfThreads: number, languages: string[]): Promise<string[]> {
    
    let elapsed = getTimeMicro();
    const mersenneReport: MersenneReport[] = []

    if (languages.includes("c")) {
      const mersennePrimesC = (await (computeMersenneC(numbers, 500, numberOfThreads))).filter(p=>p.isPrime)
      const timeForCLLTP = getTimeMicro() - elapsed
      mersenneReport.push(
        {language: "c++", maxPrime: numbers.slice(-1)[0], time: timeForCLLTP, mersennePrimes: mersennePrimesC}
      )
      elapsed = getTimeMicro()
    } 
    if (languages.includes("go")) {
      const mersennePrimesGo = (await (computeMersenneGo(numbers, numberOfThreads * 16, numberOfThreads))).filter(p=>p.isPrime)
      const timeForGoLLTP = getTimeMicro() - elapsed
      mersenneReport.push(
        {language: "go", maxPrime: numbers.slice(-1)[0], time: timeForGoLLTP, mersennePrimes: mersennePrimesGo}
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
      return "<tr><td style='text-align: center'>" + mersenneRow?.position + "</td><td style='text-align: center'>2**" + mersenneRow?.prime + "-1</td><td style='text-align: center'>" + mersenneRow?.discoveryDate + "</td><td style='text-align: center'>" + mersenneRow?.discoveredBy + "</td></tr>"
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
// Use GO for the computation!
///////////////////////////////////////////////////////////
async function computeMersenneGo(primesArray: number[], batchSize: number, numThreads: number): Promise<MersennePrime[]> {
  
  const mersennePrimes: MersennePrime[] = new Array();
  
  for (let i = 0; i < primesArray.length; i += batchSize) {
      const batch = primesArray.slice(i, i + batchSize);
      const response = await computeLLTPGo(batch, numThreads);
      mersennePrimes.push(...response)
  }
  
  return mersennePrimes.sort((mp1, mp2) => mp1.p - mp2.p)
}

async function computeLLTPGo(primes: number[], numThreads: number): Promise<MersennePrime[]>  {
  
  const url = 'http://37.27.102.105:5002/lltp';

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
        numbers: primes.join(","),
        num_threads: numThreads,
    }),
    timeout: 86400 * 1000 * 30, // A month. No timeouts wanted.
  }

  console.log("Requesting", url, options)

  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status} ${response.toString()}`);
  }

  const x: any = (await response.json())

  return x.filter((p: MersennePrime) => p.isPrime).map((mp: any) => {return {isPrime: mp.isPrime, p: Number(mp.p)}})
}

async function computeMersenneC(primesArray: number[], batchSize: number, numThreads: number): Promise<MersennePrime[]> {
  
  const mersennePrimes: MersennePrime[] = new Array();
  
  for (let i = 0; i < primesArray.length; i += batchSize) {
      const batch = primesArray.slice(i, i + batchSize);
      const response = await computeLLTPC(batch, numThreads);
      mersennePrimes.push(...response)
  }
  
  return mersennePrimes.sort((mp1, mp2) => mp1.p - mp2.p)
}

async function computeLLTPC(primes: number[], numThreads: number): Promise<MersennePrime[]>  {
  
  const url = 'http://37.27.102.105:5004/lucas-lehmer';

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
        numbers: primes.map(p => p)
    }),
    timeout: 86400 * 1000 * 30, // A month. No timeouts wanted.
  }

  console.log("Requesting", url, options)

  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status} ${await response.text()}`);
  }

  const x: any = (await response.json())
  console.log(x)
  const y = x.mersenne_primes.map((p: number) => ({p, isPrime: true}))

  return y
}
