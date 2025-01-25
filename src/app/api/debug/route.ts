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
import series from '@/helpers/series';
import differences from '@/helpers/differences';


export async function GET(request: Request): Promise<Response> {

  try {
    const start = getTimeMicro()
    let elapsed = getTimeMicro();
    let filename = `benchmark.html`
    
    const { searchParams } = new URL(request.url||"".toString())
    const KEY: string = searchParams.get('KEY') || "";
    const N: string = searchParams.get('N') || "";
    
    let strings = []

    if (KEY !== process.env.MATHER_SECRET?.trim()) {
      throw new Error("Forbidden!");
    }

    const url = 'http://37.27.102.105:5003/sieve?n=10000000';
    
    const x = await fetch(url, {
      method: "GET"
    });


    const primes = await x.json()
    strings = ["<p>Last 10 primes</p>", JSON.stringify(primes.primes.slice(-20), null, 2)];

    filename= "fortran-report.html"
    
    const filepath = "./public/files/" + filename

    const stringArray = [
      "<h3 style='text-align: center;'>Benchmark report of math.ideniox.com</h3>",
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
    return Response.json({ error: process.env.MATHER_SECRET + "Error generating report. " + errorMessage(error) }, { status: 500 });
  }
}
