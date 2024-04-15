import { MAX_SUPPORTED_SIEVE_LENGTH, MAX_DISPLAY_SIEVE, MAX_HEALTHY_SIEVE_LENGTH } from '@/helpers/Constants'
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
    
    if (isNaN(amount) || isNaN(LIMIT)) {
      return Response.json(
        {error: "Invalid parameters amount = " + amount + ", LIMIT = " + LIMIT},
        {status: 500}
      )
    }
    
    // USE ENV MATHER_SECRET TO OVERCOME THE GUI LIMITS
    if (process.env.MATHER_SECRET !== KEY && LIMIT > MAX_HEALTHY_SIEVE_LENGTH) { 
      // 500m up to 30MB RAM 245MB disk, natural limit for the web, it takes 3s to compute.
      return Response.json(
        {error: "Max length " + MAX_HEALTHY_SIEVE_LENGTH + ", " + toHuman(MAX_HEALTHY_SIEVE_LENGTH / 16) + " RAM 245MB disk. For more ask the admin."},
        {status: 500}
      )
    } 
    
    if (LIMIT > MAX_SUPPORTED_SIEVE_LENGTH) {
      // 1t, up to 58GB RAM 450GB disk (x2000), common sense limit, it takes 24h to compute.
      return Response.json(
        {error: "Max length " + MAX_SUPPORTED_SIEVE_LENGTH + ", " + toHuman(MAX_SUPPORTED_SIEVE_LENGTH / 16) + " RAM 450GB disk."},
        {status: 500}
      )
    }
    
    (BigInt.prototype as any).toJSON = function() {
      return this.toString()
    }

    return Response.json( eratostenes(LIMIT, amount, excel) )
  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}

