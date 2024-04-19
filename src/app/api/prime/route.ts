import fs from "fs"
import nthline from "@/helpers/nthline"

import { EXCEL_MAX_COLS } from '@/Constants'
import errorMessage from '@/helpers/errorMessage'
import getTimeMicro from "@/helpers/getTimeMicro";

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
    if (isNaN(LIMIT) || LIMIT > 10**9) { // More than primes below 1t, ie 36b
      throw new Error("Invalid LIMIT " + LIMIT)
    }
    const row = (LIMIT -1 )% EXCEL_MAX_COLS  
    const col = Math.floor((LIMIT -1) / EXCEL_MAX_COLS)

    console.log("Get element " + row + " x " + col)
    const start = getTimeMicro()
    
    // USE ENVIRONMENT VARIABLE FOR DISTINCT FILES IN LOCAL OR SERVER
    const filePath = "/app/files/primes-to-1t.csv"
    //const filePath = "/Users/USUARIO/Downloads/primes-to-100b.csv";
    
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
