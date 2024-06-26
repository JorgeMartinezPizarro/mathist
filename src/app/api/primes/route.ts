import { MAX_SUPPORTED_SIEVE_LENGTH, MAX_DISPLAY_SIEVE, MAX_HEALTHY_SIEVE_LENGTH } from '@/Constants'
import eratosthenes, { lastTenEratosthenes } from '@/helpers/eratosthenes'
import errorMessage from '@/helpers/errorMessage'
import toHuman from '@/helpers/toHuman'

export async function GET(request: Request): Promise<Response> {
  
  (BigInt.prototype as any).toJSON = function() {
    return this.toString()
  }

  try {
    
    const { searchParams } = new URL(request.url||"".toString())
    const LIMIT_BI: bigint = BigInt(searchParams.get('LIMIT') || "")
    const LIMIT = Number(LIMIT_BI)
    const amount: number = parseInt(searchParams.get('amount') || MAX_DISPLAY_SIEVE.toString())
    const excel: boolean = searchParams.get('excel') ? true : false;
    const KEY: string = searchParams.get('KEY') || "";
    
    if (isNaN(amount) || isNaN(LIMIT)) {
      return Response.json(
        {error: "Invalid parameters amount = " + amount + ", LIMIT = " + LIMIT},
        {status: 500}
      )
    };
    if (process.env.MATHER_SECRET?.trim() !== KEY && !excel && LIMIT_BI > MAX_HEALTHY_SIEVE_LENGTH) {
      return Response.json( lastTenEratosthenes(LIMIT_BI) )
    } 
    // USE ENV MATHER_SECRET TO OVERCOME THE GUI LIMITS
    if (process.env.MATHER_SECRET?.trim() !== KEY && LIMIT > MAX_HEALTHY_SIEVE_LENGTH) { 
      // 500m up to 30MB RAM 245MB disk, natural limit for the web, it takes 3s to compute.
      return Response.json(
        {error: "Max length for generate prime download is " + MAX_HEALTHY_SIEVE_LENGTH + ", which takes " + toHuman(MAX_HEALTHY_SIEVE_LENGTH / 16) + " RAM and 49MB disk. For more ask the admin."},
        {status: 500}
      )
    } 
    // MAX SERVER LIMIT
    if (LIMIT > MAX_SUPPORTED_SIEVE_LENGTH) {
      // up to 1t, 59GB RAM 452GB disk, it takes 36h to compute.
      return Response.json(
        {error: "Max length is " + MAX_SUPPORTED_SIEVE_LENGTH + ", which takes " + toHuman(MAX_SUPPORTED_SIEVE_LENGTH / 16) + " RAM and 452GB disk."},
        {status: 500}
      )
    }    

    return Response.json( eratosthenes(LIMIT, amount, excel) )
  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}
