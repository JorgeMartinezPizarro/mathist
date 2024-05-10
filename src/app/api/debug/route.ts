import os from 'node:os' 
import fs from 'fs' 
import fetch from 'node-fetch';
import { Worker, isMainThread } from 'worker_threads';
import _ from "lodash"

import errorMessage from '@/helpers/errorMessage'
import getTimeMicro from '@/helpers/getTimeMicro'
import duration from '@/helpers/duration';
import eratosthenes from '@/helpers/eratosthenes';
import { MERSENNE_TABLE } from '@/Constants';

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
  let elapsed = getTimeMicro();

  (BigInt.prototype as any).toJSON = function() {
    return this.toString()
  }

  try {

    // TODO: use a temp file to record the processed values. Make the search resumable. Maybe we can just pack all this search into Scala code and use the mather just to link to the results.
    
    ////////////////////////////////////////////////////////////////////////////
    // Benchmark scala VS python vs js bigint
    ////////////////////////////////////////////////////////////////////////////
    const { searchParams } = new URL(request.url||"".toString())
    const KEY: string = searchParams.get('KEY') || "";
    const LIMIT: number = parseInt(searchParams.get('maxPrime') || "128");
    const numberOfThreads: number = parseInt(searchParams.get('numberOfThreads') || "16");

    if (KEY !== process.env.MATHER_SECRET?.trim()) {
      throw new Error("Forbidden!")
    }

    const numbers = eratosthenes(LIMIT, LIMIT).primes.map(n => Number(n))

    const mersennePrimesPython = await sendPrimesInBatchesPython(numbers, numberOfThreads, numberOfThreads)
    const timeForPythonLLTP = getTimeMicro() - elapsed
    elapsed = getTimeMicro()

    const mersennePrimesGo = (await (sendPrimesInBatchesGo(numbers, numberOfThreads, numberOfThreads))).filter(p=>p.isPrime)
    const timeForGoLLTP = getTimeMicro() - elapsed
    elapsed = getTimeMicro()
   
    const mersennePrimesJS = (await sendPrimesInBatchesJS(numbers, numberOfThreads)).filter(p=>p.isPrime)
    const timeForJSLLTP = getTimeMicro() - elapsed
    elapsed = getTimeMicro()    

    const mersennePrimesScala = await sendPrimesInBatchesScala(numbers, 500, numberOfThreads)
    const timeForScalaLLTP = getTimeMicro() - elapsed

    const mersenneReport: MersenneReport[] = [
      {language: "Python", maxPrime: LIMIT, time: timeForPythonLLTP, mersennePrimes: mersennePrimesPython},
      {language: "Go", maxPrime: LIMIT, time: timeForGoLLTP, mersennePrimes: mersennePrimesGo},
      {language: "Javascript", maxPrime: LIMIT, time: timeForJSLLTP, mersennePrimes: mersennePrimesJS},
      {language: "Scala", maxPrime: LIMIT, time: timeForScalaLLTP, mersennePrimes: mersennePrimesScala},
    ]

    for (var i = 0; i<mersenneReport.length - 1; i++) {
      if (!_.isEqual(mersenneReport[i].mersennePrimes, mersenneReport[i+1].mersennePrimes)) {
        console.log("////////////////////////////////////////////////")
        console.log(mersenneReport[i].mersennePrimes)
        console.log("////////////////////////////////////////////////")
        console.log(mersenneReport[i+1].mersennePrimes)
        throw new Error("WTF underteministic computation!")
      }
    }

    const mersennePrimesRow = mersennePrimesScala.map(mp => {
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
      "<h3 style='text-align: center;'>Debug report of mather.ideniox.com</h3>",
      "<p style='text-align: center;'><b>" + os.cpus()[0].model + " " + (os.cpus()[0].speed/1000) + "GHz , " + os.cpus().length + " cores, " + process.arch + "</b></p>",
      "<hr/>",
      "<table style='margin: 0 auto; width: 700px;'><thead><tr><th>#</th><th>Mersenne prime</th><th>Date</th><th>Finder</th></tr></thead><tbody>",
      ...mersennePrimesRow,
      "</tbody></table>",
      "<hr/>",
      "<p style='text-align: center;'>" + mersennePrimesScala.length +" Mersenne primes found</p>",
      ...benchmarkRows,
      "<hr/>",
      "<p style='text-align: center;'>It took " + duration(getTimeMicro() - start) + " to generate the report</p>",
      "<hr/>",
    ]

    const filename = "./public/files/debug.html"
    
    fs.writeFileSync(filename, '<!DOCTYPE html><html><head><style>hr {height: 1px;background-color: #1976d2!important;border: none;margin: 16px!important;} b, th, h3 {color: #1976d2;}</style><meta charset="utf-8"><meta http-equiv="content-type" content="text/html; charset=UTF-8" /><meta http-equiv="content-type" content="application/json; charset=utf-8" /></head><body>', 'utf8')
    stringArray.forEach(string => 
      fs.appendFileSync(filename, string, 'utf8')
    );
    
    fs.appendFileSync(filename, "</body></html>", 'utf8')

    return Response.json({message: "report generated under /files/debug.html", time: getTimeMicro() - start})

  } catch (error) {
    return Response.json({ error: "Error generating mersenne report. " + errorMessage(error) }, { status: 500 });
  }
}

///////////////////////////////////////////////////////////
// Use fortran for the computation!
///////////////////////////////////////////////////////////
async function sendPrimesInBatchesFortran(primesArray: number[], batchSize: number, numThreads: number): Promise<MersennePrime[]> {
  
  const mersennePrimes: MersennePrime[] = new Array();
  
  for (let i = 0; i < primesArray.length; i += batchSize) {
      const batch = primesArray.slice(i, i + batchSize);
      const response = await computeLLTPFortran(batch, numThreads);
      mersennePrimes.push(...response)
  }
  
  return mersennePrimes
}

async function computeLLTPFortran(primes: number[], numThreads: number): Promise<MersennePrime[]>  {
  
  const url = 'http://37.27.102.105:5001/lltp';

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
        numbers: primes,
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
  console.log(x)
  return x.results.filter((p: MersennePrime) => p.isPrime)
}

///////////////////////////////////////////////////////////
// Use python for the computation!
///////////////////////////////////////////////////////////
async function sendPrimesInBatchesPython(primesArray: number[], batchSize: number, numThreads: number): Promise<MersennePrime[]> {
  
  const mersennePrimes: MersennePrime[] = new Array();
  
  for (let i = 0; i < primesArray.length; i += batchSize) {
      const batch = primesArray.slice(i, i + batchSize);
      const response = await computeLLTPPython(batch, numThreads);
      mersennePrimes.push(...response)
  }
  
  return mersennePrimes.sort((mp1, mp2) => mp1.p - mp2.p)
}

async function computeLLTPPython(primes: number[], numThreads: number): Promise<MersennePrime[]>  {
  
  const url = 'http://37.27.102.105:5000/lltp';

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
        numbers: primes,
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

  return x.results.filter((p: MersennePrime) => p.isPrime)
}

///////////////////////////////////////////////////////////
// Use scala for the computation!
///////////////////////////////////////////////////////////
async function sendPrimesInBatchesScala(primesArray: number[], batchSize: number, numThreads: number): Promise<MersennePrime[]> {
  
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
async function sendPrimesInBatchesJS(primesArray: number[], numberOfThreads: number): Promise<MersennePrime[]> {
    
  const mersennePrimes: MersennePrime[] = new Array();
  
  for (let i = 0; i < primesArray.length; i += numberOfThreads) {
      const batch = primesArray.slice(i, i + numberOfThreads);
      const response = await computeLLTPJs(batch);
      mersennePrimes.push(...response)
  }
  
  return mersennePrimes.sort((mp1, mp2) => mp1.p - mp2.p)
}

async function computeLLTPJs(numbers: number[]): Promise<MersennePrime[]> {
  if (isMainThread) {
      // This is the main thread
      
      const workerPromises: Promise<MersennePrime>[] = [];

      for (let i = 0; i < numbers.length; i++) {
        const number = numbers[i]
          // Create a new worker
          const worker = new Worker('./src/app/api/debug/thread.mjs', { // Adjust the path here
              workerData: number
          });

          // Create a promise that resolves with the result from the worker
          const workerPromise = new Promise<MersennePrime>((resolve, reject) => {
              // Listen for messages from the worker
              worker.on('message', message => {
                  // Assuming the worker sends back MersennePrime objects
                  resolve(message as MersennePrime);
              });

              // Handle errors
              worker.on('error', error => {
                  console.error(`Worker error: ${error}`);
                  reject(error);
              });

              // Handle worker exit
              worker.on('exit', code => {
                  if (code !== 0) {
                      console.error(`Worker stopped with exit code ${code}`);
                      reject(new Error(`Worker stopped with exit code ${code}`));
                  }
              });
          });

          workerPromises.push(workerPromise)

      }

      // Wait for all worker promises to resolve
      return await Promise.all(workerPromises);
  } else {
      // This is a worker thread, not the main thread
      console.error('This script should be run as the main thread.');
      return [];
  }
}

///////////////////////////////////////////////////////////
// Use GO for the computation!
///////////////////////////////////////////////////////////
async function sendPrimesInBatchesGo(primesArray: number[], batchSize: number, numThreads: number): Promise<MersennePrime[]> {
  
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