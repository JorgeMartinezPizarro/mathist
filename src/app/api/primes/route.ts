import { MAX_ALLOCATABLE_MATRIX_30GB, MAX_DISPLAY_SIEVE, MAX_LENGTH_FOR_SIEVE_HEALTY } from '@/helpers/Constants'
import eratostenes from '@/helpers/eratostenes'
import errorMessage from '@/helpers/errorMessage'
import toHuman from '@/helpers/toHuman'

export async function GET(request: Request) {
  // Add start - end principle. Use prime tests to generate big partial prime lists.
  try {
    const { searchParams } = new URL(request.url||"".toString())
    const LIMIT: number = parseInt(searchParams.get('LIMIT') || "x")
    const amount: number = parseInt(searchParams.get('amount') || MAX_DISPLAY_SIEVE.toString())
    const excel: boolean = searchParams.get('excel') ? true : false;
    const KEY: string = searchParams.get('KEY') || "";
    const SECRET: string = (process.env.MATHER_SECRET || "").trim();
    
    if (isNaN(amount) || isNaN(LIMIT)) {
      return Response.json(
        {error: "Invalid parameters amount = " + amount + ", LIMIT = " + LIMIT},
        {status: 500}
      )
    }
    
    // USE ENV SECRET TO OVERCOME THE LIMITS
    if (SECRET !== KEY) {
      if (LIMIT > MAX_LENGTH_FOR_SIEVE_HEALTY) { 
        // 1b Up to 64MB RAM 516MB disk, natural limit for the web, it takes 10s to compute.
        return Response.json(
          {error: "Max length " + MAX_LENGTH_FOR_SIEVE_HEALTY + ", " + toHuman(MAX_LENGTH_FOR_SIEVE_HEALTY / 16) + " RAM 515MB disk. For more ask the admin."}, 
          {status: 500}
        )
      } 
      if (LIMIT > MAX_ALLOCATABLE_MATRIX_30GB) {
        // 535b, up to 31GB RAM 240GB disk (x500), common sense limit, it takes 12h to compute.
        // Actually we can use up to 60GB to generate up to 1t.
        return Response.json(
          {error: "Max length " + MAX_ALLOCATABLE_MATRIX_30GB + ", " + toHuman(MAX_ALLOCATABLE_MATRIX_30GB / 16) + " RAM 240GB disk."},
          {status: 500}
        )
      }
    }
    
    (BigInt.prototype as any).toJSON = function() {
      return this.toString()
    }

    return Response.json( eratostenes(LIMIT, amount, excel) )
  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}