import os from 'node:os' 
import fs from 'fs' 
import fetch from 'node-fetch';

import errorMessage from '@/helpers/errorMessage'
import getTimeMicro from '@/helpers/getTimeMicro'
import duration from '@/helpers/duration';
import eratosthenes from '@/helpers/eratosthenes';
import { KNOWN_MERSENNE_PRIMES } from '@/Constants';

interface MersennePrime {
  p: number;
  isPrime: boolean;
}

//https://en.wikipedia.org/wiki/Pocklington_primality_test

//https://es.wikipedia.org/wiki/N%C3%BAmero_primo_de_Mersenne

export async function GET(request: Request): Promise<Response> {  

  (BigInt.prototype as any).toJSON = function() {
    return this.toString()
  }

  try {

    // TODO: use a temp file to record the processed values. Make the search resumable. Maybe we can just pack all this search into Scala code and use the mather just to link to the results.

    const { searchParams } = new URL(request.url||"".toString())
    const KEY: string = searchParams.get('KEY') || "";
    const LIMIT: number = parseInt(searchParams.get('LIMIT') || "100");
    if (KEY !== process.env.MATHER_SECRET?.trim()) {
      throw new Error("Forbidden!")
    }

    const start = getTimeMicro()

    const n = LIMIT

    //const numbers = eratosthenes(n, n).primes.map(p => Number(p))

    const numbers = KNOWN_MERSENNE_PRIMES.slice(0, 34)

    const m = await sendPrimesInBatches(numbers, 17) // 500 seems to be the more effective batch size.
    
    const stringArray = [
      "<h3 style='text-align: center;'>Debug report of mather.ideniox.com</h3>",
      "<p style='text-align: center;'><b>" + os.cpus()[0].model + " " + (os.cpus()[0].speed/1000) + "GHz " + process.arch + "</b></p>",
      "<hr/>",
      ...m.map((mp: MersennePrime) => "<p style='text-align: center;'>2**" + mp.p + " - 1</p>"),
      "<hr/>",
      "<p style='text-align: center;'>" + m.length +" primes found</p>",
      "<hr/>",
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
    return Response.json({ error: "Error generating mersenne report. " + errorMessage(error) }, { status: 500 });
  }
}

async function processPrimes(primes: number[]): Promise<MersennePrime[]>  {
  // Your logic to send the primes to the REST API and process the response
  // Example:
  const url = 'http://37.27.102.105:8080/lltp';

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
        numbers: primes.join(","),
        numThreads: 16,
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

async function sendPrimesInBatches(primesArray: number[], batchSize: number): Promise<MersennePrime[]> {
  
  const mersennePrimes: MersennePrime[] = new Array();
  
  for (let i = 0; i < primesArray.length; i += batchSize) {
      const batch = primesArray.slice(i, i + batchSize);
      const response = await processPrimes(batch);
      mersennePrimes.push(...response)
  }
  
  return mersennePrimes
}
