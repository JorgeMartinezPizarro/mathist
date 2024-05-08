import os from 'node:os' 
import fs from 'fs' 
import fetch from 'node-fetch';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
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

    const { searchParams } = new URL(request.url||"".toString())
    const KEY: string = searchParams.get('KEY') || "";
    const LIMIT: number = parseInt(searchParams.get('maxPrime') || "100");
    const numberOfThreads: number = parseInt(searchParams.get('numberOfThreads') || "16");

    if (KEY !== process.env.MATHER_SECRET?.trim()) {
      throw new Error("Forbidden!")
    }

    const numbers = eratosthenes(LIMIT, LIMIT).primes.map(n => Number(n))

    const t = await sendPrimesInBatchesJS(numbers, numberOfThreads)

    const mersennePrimesJS = t.filter(p=>p.isPrime)

    const timeForJSLLTP = getTimeMicro() - elapsed

    elapsed = getTimeMicro()    

    const mersennePrimesScala = await sendPrimesInBatchesScala(numbers, 500, numberOfThreads)
    const timeForScalaLLTP = getTimeMicro() - elapsed

    if (!_.isEqual(mersennePrimesJS, mersennePrimesScala )) {
      throw new Error("WTF underteministic computation!")
    }

    const report = mersennePrimesJS.map(mp => {
      const mersenneRow = MERSENNE_TABLE.find(mr => mr.prime === mp.p)
      return "<tr><td style='text-align: center'>" + mersenneRow?.position + "</td><td style='text-align: center'>" + mersenneRow?.prime + "</td><td style='text-align: center'>" + mersenneRow?.discoveryDate + "</td><td style='text-align: center'>" + mersenneRow?.discoveredBy + "</td></tr>"
    })

    const stringArray = [
      "<h3 style='text-align: center;'>Debug report of mather.ideniox.com</h3>",
      "<p style='text-align: center;'><b>" + os.cpus()[0].model + " " + (os.cpus()[0].speed/1000) + "GHz , " + os.cpus().length + " cores, " + process.arch + "</b></p>",
      "<hr/>",
      "<table style='margin: 0 auto; width: 700px;'><thead><tr><th>#</th><th>Prime</th><th>Date</th><th>Finder</th></tr></thead><tbody>",
      ...report,
      "</tbody></table>",
      "<hr/>",
      "<p style='text-align: center;'>" + mersennePrimesJS.length +" Mersenne primes found</p>",
      "<hr/>",
      "<p style='text-align: center;'><b>Javascript</b></p>",
      "<hr/>",
      "<p style='text-align: center;'>It took " + duration(timeForJSLLTP) + " to test " + + " " + numberOfThreads + " javascript workers, " + duration(Math.floor(timeForJSLLTP/mersennePrimesJS.length)) + " for each prime</p>",
      "<hr/>",
      "<p style='text-align: center;'><b>Scala</b></p>",
      "<hr/>",
      "<p style='text-align: center;'>It took " + duration(timeForScalaLLTP) + " to test " + numbers.length + " primes using "+ numberOfThreads + " scala threads, " + duration(Math.floor(timeForScalaLLTP/mersennePrimesScala.length)) + " for each prime</p>",
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

// TODO: benchmark scala VS js bigint. First results, js wins by 10%.
// Use scala for the computation!
async function processPrimes(primes: number[], numThreads: number): Promise<MersennePrime[]>  {
  
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

async function sendPrimesInBatchesScala(primesArray: number[], batchSize: number, numThreads: number): Promise<MersennePrime[]> {
  
  const mersennePrimes: MersennePrime[] = new Array();
  
  for (let i = 0; i < primesArray.length; i += batchSize) {
      const batch = primesArray.slice(i, i + batchSize);
      const response = await processPrimes(batch, numThreads);
      mersennePrimes.push(...response)
  }
  
  return mersennePrimes
}

async function sendPrimesInBatchesJS(primesArray: number[], numberOfThreads: number): Promise<MersennePrime[]> {
  
  const mersennePrimes: MersennePrime[] = new Array();
  
  for (let i = 0; i < primesArray.length; i += numberOfThreads) {
      const batch = primesArray.slice(i, i + numberOfThreads);
      const response = await computeLLTP(batch);
      mersennePrimes.push(...response)
  }
  
  return mersennePrimes
}

async function computeLLTP(numbers: number[]): Promise<MersennePrime[]> {
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