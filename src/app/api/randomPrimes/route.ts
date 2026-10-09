import { MAX_DIGITS_RANDOM_PRIMES } from '@/constants'
import { badRequest, errorResponse, jsonResponse } from '@/server/http';
import randomPrimes from '@/math/randomPrimes'

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

    return jsonResponse( randomPrimes(LIMIT, amount) )
  } catch (error) {
    return errorResponse(error);
  }
}