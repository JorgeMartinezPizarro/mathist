// https://en.wikipedia.org/wiki/Lucas%E2%80%93Lehmer_primality_test#Proof_of_correctness
import os from 'node:os' 
import fs from 'fs' 
import fetch from 'node-fetch';
import { Worker, isMainThread } from 'worker_threads';
import _ from "lodash"

import errorMessage from '@/helpers/errorMessage'
import getTimeMicro from '@/helpers/getTimeMicro'
import duration from '@/helpers/duration';
import eratosthenes from '@/helpers/eratosthenes';
import { KNOWN_MERSENNE_PRIMES, MERSENNE_TABLE } from '@/Constants';
import series from '@/helpers/series';
import differences from '@/helpers/differences';

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
    ////////////////////////////////////////////////////////////////////////////
    // Benchmark Scala VS Go vs Js bigint
    ////////////////////////////////////////////////////////////////////////////
    const { searchParams } = new URL(request.url||"".toString())
    const KEY: string = searchParams.get('KEY') || "";
    const LIMIT: number = parseInt(searchParams.get('maxPrime') || "128");
    const numberOfThreads: number = parseInt(searchParams.get('numberOfThreads') || "16");
    const language: string = searchParams.get("lang") || "go"
    const mode = searchParams.get("mode") || "mersenne";
    
    if (KEY !== process.env.MATHER_SECRET?.trim()) {
      throw new Error("Forbidden!");
    }

    let strings: string[] = []

    let filename = `/files/debug_${mode}_${numberOfThreads}_${language}_${LIMIT}.html`

    if (mode === "mersenne") {
      const languages = language === "all" ? ["go", "scala", "javascript"] : [language]
      const numbers = eratosthenes(LIMIT, LIMIT).primes.map(p=>Number(p))
      strings = await mersennePrimesBenchmark(numbers, numberOfThreads, languages)
    } else if (mode === "mersenne-check") {
      const languages = language === "all" ? ["go", "scala", "javascript"] : [language]
      const numbers = KNOWN_MERSENNE_PRIMES.slice(0, LIMIT)
      strings = await mersennePrimesBenchmark(numbers, numberOfThreads, languages)
    }
    else if (mode === "primes") {
      strings = await primesDifferences(LIMIT)
      filename = "/files/primes.html"
    } else if (mode === "json") {
      filename = "/files/data.json"
      const numbers = eratosthenes(LIMIT, LIMIT).primes.map(n => Number(n))
      const objects = numbers.map((p: number, i: number) => ({n: i+1, pn: p}))
      fs.writeFileSync("./public/files/data.json", JSON.stringify(objects))
      return Response.json({message: "Report generated under " + filename, time: getTimeMicro() - start})
    } else {
      throw new Error("Unknown mode " + mode);
    }

    const filepath = "./public" + filename

    const stringArray = [
      "<h3 style='text-align: center;'>Debug report of mather.ideniox.com</h3>",
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

async function primesDifferences(LIMIT: number): Promise<string[]> {
  const array = series(2 * LIMIT - 1, "prime")
  const diff = differences(array, 2)
  const result = diff.slice(0, LIMIT).map(subDiff => subDiff.slice(0, LIMIT))

  const table = result[0].map((number, i) => "<tr><td style='text-align: center;'>" + (i + 1)  + "</td><td style='text-align: center;'>" + number + "</td><td style='text-align: center;'>" + result[1][i] + "</td><td style='text-align: center;'>" + result[2][i] + "</td></tr>")
  
  const strings = [
    "<table style='width: 500px; margin: 0 auto;'><thead>",
    "<tr><th>n</th><th>Pn</th><th>Δ(Pn)</th><th>Δ2(Pn)</th></tr>",
    "</thead>",
    "<tbody>",
    ...table,
    "</tbody></table>",
  ]
  return strings
}

async function mersennePrimesBenchmark(numbers: number[], numberOfThreads: number, languages: string[]): Promise<string[]> {
    
    let elapsed = getTimeMicro();
    const mersenneReport: MersenneReport[] = []

    if (languages.includes("go")) {
      const mersennePrimesGo = (await (computeMersenneGo(numbers, 500, numberOfThreads))).filter(p=>p.isPrime)
      const timeForGoLLTP = getTimeMicro() - elapsed
      mersenneReport.push(
        {language: "go", maxPrime: numbers.slice(-1)[0], time: timeForGoLLTP, mersennePrimes: mersennePrimesGo}
      )
      elapsed = getTimeMicro()
    } 
    if (languages.includes("javascript")) {
      const mersennePrimesJS = (await computeMersenneJS(numbers, 500, numberOfThreads)).filter(p=>p.isPrime)
      const timeForJSLLTP = getTimeMicro() - elapsed
      elapsed = getTimeMicro()    

      mersenneReport.push(
        {language: "javascript", maxPrime: numbers.slice(-1)[0], time: timeForJSLLTP, mersennePrimes: mersennePrimesJS}
      )
      elapsed = getTimeMicro()
    } 
    if (languages.includes("scala")) {
      const mersennePrimesScala = await computeMersenneScala(numbers, 500, numberOfThreads)
      const timeForScalaLLTP = getTimeMicro() - elapsed
      mersenneReport.push(
        {language: "scala", maxPrime: numbers.slice(-1)[0], time: timeForScalaLLTP, mersennePrimes: mersennePrimesScala}
      )
      elapsed = getTimeMicro()
    }  
    
    for (var i = 0; i<mersenneReport.length - 1; i++) {
      if (!_.isEqual(mersenneReport[i].mersennePrimes, mersenneReport[i+1].mersennePrimes)) {
        console.log("////////////////////////////////////////////////")
        console.log(mersenneReport[i].mersennePrimes)
        console.log("////////////////////////////////////////////////")
        console.log(mersenneReport[i+1].mersennePrimes)
        throw new Error("WTF underteministic computation!")
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
// Use scala for the computation!
///////////////////////////////////////////////////////////
async function computeMersenneScala(primesArray: number[], batchSize: number, numThreads: number): Promise<MersennePrime[]> {
  
  const mersennePrimes: MersennePrime[] = new Array();
  
  for (let i = 0; i < primesArray.length; i += batchSize) {
      const batch = primesArray.slice(i, i + batchSize);
      const response = await computeLLTPScala(batch, numThreads);
      mersennePrimes.push(...response)
  }
  
  return mersennePrimes.sort((mp1, mp2) => mp1.p - mp2.p)
}

async function computeLLTPScala(primes: number[], numThreads: number): Promise<MersennePrime[]>  {
  
  const url = 'http://37.27.102.105:8080/lltp';

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
        numbers: primes.join(","),
        numThreads,
    }),
    timeout: 86400 * 1000, // A day. No timeouts wanted.
  }

  console.log("Requesting", url, options)

  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status} ${response.toString()}`);
  }


  const x: any = (await response.json())

  return x.filter((p: MersennePrime) => p.isPrime)
}

///////////////////////////////////////////////////////////
// Use Js for the computation
///////////////////////////////////////////////////////////
async function computeMersenneJS(primesArray: number[], batchSize: number, numberOfThreads: number): Promise<MersennePrime[]> {
  const mersennePrimes: MersennePrime[] = [];

  // Process primes in batches
  for (let i = 0; i < primesArray.length; i += batchSize) {
      const batch = primesArray.slice(i, i + batchSize);

      try {
          // Await the completion of the current batch computation
          const response = await computeLLTPJs(batch, numberOfThreads);
          console.log("////////////////////////////////////////////////////////////////////////")
          // Push the results of the current batch to the mersennePrimes array
          mersennePrimes.push(...response);
      } catch (error) {
          console.error(`Error processing batch. ` + errorMessage(error));
          // You may choose to handle or log the error here
      }
  }

  // Sort the mersennePrimes array before returning
  return mersennePrimes.sort((mp1, mp2) => mp1.p - mp2.p);
}

async function computeLLTPJs(numbers: number[], numThreads: number): Promise<MersennePrime[]> {
  if (isMainThread) {
    // This is the main thread

    console.log("Requesting " + numbers.length + " numbers up to " + numbers.slice(-1)[0] + "  with numThreads = " + numThreads)
    
    const workerPromises: Promise<MersennePrime>[] = []; // Adjusted to hold single promises
    let currentIndex = 0;

    // Function to create a new worker
    const createWorker = (number: number) => {
      const worker = new Worker('./src/app/api/debug/thread.mjs', {
        workerData: number
      });

      // Create a promise that resolves with the result from the worker
      const workerPromise = new Promise<MersennePrime>((resolve, reject) => { // Adjusted to resolve single MersennePrime
        // Listen for messages from the worker
        worker.on('message', message => {
          // Assuming the worker sends back a single MersennePrime object
          resolve(message as MersennePrime);
        });

        // Handle errors
        worker.on('error', error => {
          reject(error);
        });

        // Handle worker exit
        worker.on('exit', code => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });
      });

      // Push the worker promise to the array
      workerPromises.push(workerPromise);
    };

    // Start the workers
    for (const number of numbers) {
      createWorker(number);
    }

    // Return a promise that resolves when all workers are done
    return Promise.allSettled(workerPromises).then(results => {
      const mergedResults: MersennePrime[] = [];
      for (const result of results) {
        if (result.status === 'fulfilled') {
          // Push the resolved MersennePrime object to the mergedResults array
          mergedResults.push(result.value);
        } else {
          console.error(`Worker promise rejected: ${result.reason}`);
        }
      }
      return mergedResults.sort((a, b) => a.p - b.p);
    });
  } else {
    // This is a worker thread, not the main thread
    console.error('This script should be run as the main thread.');
    return [];
  }
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
    timeout: 86400 * 1000, // A day. No timeouts wanted.
  }

  console.log("Requesting", url, options)

  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status} ${response.toString()}`);
  }

  const x: any = (await response.json())

  return x.filter((p: MersennePrime) => p.isPrime).map((mp: any) => {return {isPrime: mp.isPrime, p: Number(mp.p)}})
}
