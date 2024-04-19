import fs from "fs"
import readline from 'node:readline/promises'
import stream from 'stream';
import nthline from "nthline"

import { MAX_SUPPORTED_SIEVE_LENGTH, MAX_DISPLAY_SIEVE, MAX_HEALTHY_SIEVE_LENGTH, EXCEL_MAX_COLS } from '@/Constants'
import eratostenes, { partialEratostenes, segmentedSieve } from '@/helpers/eratostenes'
import errorMessage from '@/helpers/errorMessage'
import toHuman from '@/helpers/toHuman'
import getTimeMicro from "@/helpers/getTimeMicro";
import duration from "@/helpers/duration";
import { number } from "mathjs";



export async function GET(request: Request) {
  (BigInt.prototype as any).toJSON = function() {
    
    return this.toString()
  }

  try {

    const { searchParams } = new URL(request.url||"".toString())
    const LIMIT: number = parseInt(searchParams.get('LIMIT') || "x")

    if (LIMIT === 0) {
      return Response.json({error: "It returns a prime given a positive integer position. 0 is not a positive integer."}, {status: 500})
    }
    if (isNaN(LIMIT)) {
      throw new Error("Invalid LIMIT " + LIMIT)
    }
    const row = (LIMIT -1 )% EXCEL_MAX_COLS  
    const col = Math.floor((LIMIT -1) / EXCEL_MAX_COLS)

    console.log("Get element " + row + " x " + col)
    const start = getTimeMicro()
    
    //const filePath = "/app/files/primes-to-10b.csv"
    const filePath = "/Users/USUARIO/Downloads/primes-to-100b.csv";
    
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found " + filePath)
    }

    const line = await nthline(col, filePath)
    const array = line.split(",")
    let prime: number = array[row]
    
    return Response.json({
      time: getTimeMicro() - start, 
      prime, 
      position: LIMIT
    })
    
  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}
