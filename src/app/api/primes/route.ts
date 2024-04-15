import { MAX_ALLOCATABLE_MATRIX_58GB, MAX_DISPLAY_SIEVE, MAX_LENGTH_FOR_SIEVE_HEALTY } from '@/helpers/Constants'
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
    }
    
    if (LIMIT > MAX_ALLOCATABLE_MATRIX_58GB) {
      // 1t, up to 58GB RAM 450GB disk (x1000), common sense limit, it takes 24h to compute.
      return Response.json(
        {error: "Max length " + MAX_ALLOCATABLE_MATRIX_58GB + ", " + toHuman(MAX_ALLOCATABLE_MATRIX_58GB / 16) + " RAM 500GB disk."},
        {status: 500}
      )
    }
    
    (BigInt.prototype as any).toJSON = function() {
      return this.toString()
    }

    console.log(LIMIT, amount)

    return Response.json( eratostenes(LIMIT, amount, excel) )
  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}

