import { MAX_DIGITS_RANDOM_PRIMES } from '@/Constants'
import errorMessage from '@/helpers/errorMessage';
import randomPrimes from '@/helpers/randomPrimes'

export async function GET(request: Request) {
  
  try {
    const { searchParams } = new URL(request.url||"".toString())
    const LIMIT: number = parseInt(searchParams.get('length') || "NaN")
    const amount: number = parseInt(searchParams.get('amount') || "NaN");
    
    if (isNaN(LIMIT) || isNaN(amount)) {
      throw new Error("Invalid parameters length = " + LIMIT + ", amount = " + amount)
    }

    if (amount * LIMIT > MAX_DIGITS_RANDOM_PRIMES) {
      throw new Error("Invalid parameters length = " + LIMIT + ", amount = " + amount + " the max total of DIGITS is " + MAX_DIGITS_RANDOM_PRIMES)
    }

    (BigInt.prototype as any).toJSON = function() {
      return this.toString()
    }

    return Response.json( randomPrimes(LIMIT, amount) )
  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}