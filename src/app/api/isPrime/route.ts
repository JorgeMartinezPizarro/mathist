import { MAX_DIGITS_PRIMALITY_TEST } from '@/Constants'
import { badRequest, errorResponse, methodNotAllowed, parseBigInt, parseJsonBody } from '@/helpers/http';
import getTimeMicro from '@/helpers/getTimeMicro'
import isProbablePrime from '@/helpers/isProbablePrime'

export async function GET(request: Request) {
  return methodNotAllowed("POST")
}

export async function POST(request: Request) {
  
  try {
    const start = getTimeMicro();

    const body = await parseJsonBody(request);

    const number: bigint = parseBigInt(body.number, "number");

    if (number.toString().length > MAX_DIGITS_PRIMALITY_TEST) {
      throw badRequest("Invalid number length = " + number + ", max allowed is " + MAX_DIGITS_PRIMALITY_TEST)
    }

    (BigInt.prototype as any).toJSON = function() {
      return this.toString()
    }

    const isPrime = isProbablePrime(number)

    return Response.json( {isPrime, number, time: getTimeMicro() - start} )
  } catch (error) {
    return errorResponse(error);
  }
}