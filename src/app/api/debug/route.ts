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
    const LIMIT: number = parseInt(searchParams.get('LIMIT') || "100");
    if (KEY !== process.env.MATHER_SECRET?.trim()) {
      throw new Error("Forbidden!")
    }
    const start = getTimeMicro()

    const primes = eratosthenes(LIMIT, LIMIT).primes.map(p => Number(p))

    const chunkedPrimes: number[][] = chunkArray(primes, 2)

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

    return Response.json({message: "report generated under /files/debug.html", time: getTimeMicro() - start})

  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}

async function processArray(array: number[][]): Promise<MersennePrime[][]> {
  const resultArray = await Promise.all(array.map(async (items) => {
      // Perform asynchronous operation on each item
      console.log("Starting thread")
      const result = await doIt(items);
      return result;
  }));
  return resultArray;
}

async function doIt(number: number[]): Promise<MersennePrime[]> {
  return new Promise((accept, reject) => {
    try {
      const promises: Promise<any>[] = [];

      for (let i = 0; i < number.length; i++) {
        promises.push(new Promise((innerResolve, innerReject) => {
          try {
            const workerScriptPath = resolve('./src/app/api/debug/thread.js');
            const worker = new Worker(workerScriptPath, { workerData: number[i] });

            worker.on('message', (result) => {
              console.log(`Worker ${i}: received result`);
              innerResolve(JSON.parse(result));
            });

            worker.on('error', (error) => {
              console.error(`Worker ${i}: error`, error);
              innerReject(new Error('Internal Server Error. ' + errorMessage(error)));
            });

            worker.on('exit', (code) => {
              console.log(`Worker ${i}: exited with code ${code}`);
            });
          } catch (error) {
            console.error(`Worker ${i}: exception`, error);
            innerReject(new Error("An error ocurred. " + errorMessage(error)));
          }
        }));
      }

      Promise.all(promises)
        .then((results) => {
          console.log('All workers resolved');
          accept(results);
        })
        .catch((error) => {
          console.error('Error in Promise.all', error);
          reject(error);
        });
    } catch (error) {
      console.error('Outer promise catch', error);
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