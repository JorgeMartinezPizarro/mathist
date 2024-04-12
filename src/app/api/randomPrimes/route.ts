import { MAX_ALLOCATABLE_MATRIX_30GB, MAX_DISPLAY_SIEVE, MAX_LENGTH_FOR_SIEVE_HEALTY } from '@/helpers/Constants'
import eratostenes from '@/helpers/eratostenes'
import randomPrimes from '@/helpers/randomPrimes'
import toHuman from '@/helpers/toHuman'

export async function GET(request: Request) {
  
  
  try {
    const { searchParams } = new URL(request.url||"".toString())
    const LIMIT = BigInt(searchParams.get('length') || "NaN")
    const amount = BigInt(searchParams.get('amount') || "NaN");
    
    if (amount > BigInt(5)) {
      throw new Error("Too much numbers, max allowed is 5")
    }

    if (LIMIT > BigInt(600)) {
      throw new Error("Too long numbers, max allowed is 600 digits")
    }

    if (amount)
    (BigInt.prototype as any).toJSON = function() {
      return this.toString()
    }

    return Response.json( randomPrimes(LIMIT, amount) )
  } catch (error) {
    let message
    if (error instanceof Error) message = error.message
    else message = String(error)
    return Response.json({ error: message }, { status: 500 });
  }
}