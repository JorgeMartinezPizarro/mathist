import { MAX_DIGITS_RANDOM_PRIMES } from '@/Constants'
import { badRequest, errorResponse } from '@/helpers/http';
import randomPrimes from '@/helpers/randomPrimes'

export async function GET(request: Request) {
  
  try {
    const { searchParams } = new URL(request.url||"".toString())
    const LIMIT: number = parseInt(searchParams.get('length') || "NaN")
    const amount: number = parseInt(searchParams.get('amount') || "NaN");
    
    if (isNaN(LIMIT) || isNaN(amount)) {
      throw badRequest("Invalid parameters length = " + LIMIT + ", amount = " + amount)
    }

    if (amount * LIMIT > MAX_DIGITS_RANDOM_PRIMES) {
      throw badRequest("Invalid parameters length = " + LIMIT + ", amount = " + amount + " the max total of DIGITS is " + MAX_DIGITS_RANDOM_PRIMES)
    }

    (BigInt.prototype as any).toJSON = function() {
      return this.toString()
    }

    return Response.json( randomPrimes(LIMIT, amount) )
  } catch (error) {
    return errorResponse(error);
  }
}