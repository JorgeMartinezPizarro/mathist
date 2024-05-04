import os from 'node:os' 
import fs from 'fs' 

import errorMessage from '@/helpers/errorMessage'
import getTimeMicro from '@/helpers/getTimeMicro'
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import { resolve } from 'path'; // Import resolve function to handle file paths
import duration from '@/helpers/duration';
import eratosthenes from '@/helpers/eratosthenes';

interface MersennePrime {
  p: number;
  isPrime: boolean;
}

export async function GET(request: Request): Promise<Response> {  

  (BigInt.prototype as any).toJSON = function() {
    return this.toString()
  }

  try {

    const { searchParams } = new URL(request.url||"".toString())
    const KEY: string = searchParams.get('KEY') || "";
    if (KEY !== process.env.MATHER_SECRET?.trim()) {
      throw new Error("Forbidden!")
    }
    const start = getTimeMicro()

    const primes = eratosthenes(10000, 10000).primes.map(p => Number(p))

    const chunkedPrimes: number[][] = chunkArray(primes, 8)

    const mersennePrimesFound = (await processArray(chunkedPrimes)).reduce((acc, val) => [...acc, ...val.filter(mp => mp.isPrime)], [])

    const stringArray = [
      "<h3 style='text-align: center;'>Debug report of mather.ideniox.com</h3>",
      "<p style='text-align: center;'><b>" + os.cpus()[0].model + " " + (os.cpus()[0].speed/1000) + "GHz " + process.arch + "</b></p>",
      "<hr/>",
      ...mersennePrimesFound.map(mp => "<p style='text-align: center;'>" + mp.p + "</p>"),
      "<p style='text-align: center;'>" + mersennePrimesFound.length +" primes found</p>",
      "<p style='text-align: center;'>It took " + duration(getTimeMicro() - start) + " to generate the report.</p>",
    ]

    const filename = "./public/files/debug.html"
    
    fs.writeFileSync(filename, '<!DOCTYPE html><html><head><style>hr {height: 1px;background-color: #1976d2!important;border: none;margin: 16px!important;} b, th, h3 {color: #1976d2;}</style><meta charset="utf-8"><meta http-equiv="content-type" content="text/html; charset=UTF-8" /><meta http-equiv="content-type" content="application/json; charset=utf-8" /></head><body>', 'utf8')
    stringArray.forEach(string => 
      fs.appendFileSync(filename, string, 'utf8')
    );
    
    fs.appendFileSync(filename, "</body></html>", 'utf8')

    return Response.json({result: mersennePrimesFound, time: getTimeMicro() - start})

  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}

async function processArray(array: number[][]): Promise<MersennePrime[][]> {
  const resultArray = await Promise.all(array.map(async (items) => {
      // Perform asynchronous operation on each item
      const result = await doIt(items);
      return result;
  }));
  return resultArray;
}

async function doIt(number: number[]): Promise<MersennePrime[]> {
  
  return new Promise((accept, reject) => { // Renamed parameter to 'accept'
    try {
      // Array to store promises for each worker
      const promises: Promise<any>[] = [];

      // Create and start each worker thread
      for (let i = 0; i < number.length; i++) {
        promises.push(new Promise((innerResolve, innerReject) => {
          try {
            // Get the absolute path to the worker script
            const workerScriptPath = resolve('./src/app/api/debug/thread.js');

            // Create a new worker thread
            const worker = new Worker(workerScriptPath, { workerData: number[i] });

            // Listen for messages from the worker thread
            worker.on('message', (result) => {
                // Resolve the inner promise with the result
                innerResolve(JSON.parse(result));
            });

            // Handle errors from the worker thread
            worker.on('error', (error) => {
                console.error(error);
                innerReject(new Error('Internal Server Error. ' + errorMessage(error)));
            });
          } catch (error) {
              innerReject(new Error("An error ocurred. " + errorMessage(error)));
          }
        }));
      }

      // Resolve the outer promise with results from all worker threads
      Promise.all(promises)
        .then((results) => accept(results)) // Renamed parameter to 'accept'
        .catch((error) => reject(error));

    } catch (error) {
        reject(new Error("An error ocurred. " + errorMessage(error)));
    }
  });
}

function chunkArray(array: number[], chunkSize: number) {
  return Array.from(
    { length: Math.ceil(array.length / chunkSize) },
    (_, index) => array.slice(index * chunkSize, (index + 1) * chunkSize)   
  );
}