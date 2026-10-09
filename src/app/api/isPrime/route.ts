import { MAX_DIGITS_PRIMALITY_TEST } from '@/constants'
import { badRequest, errorResponse, jsonResponse, methodNotAllowed, parseBigInt, parseJsonBody } from '@/server/http';
import getTimeMicro from '@/utils/getTimeMicro'
import isProbablePrime from '@/math/isProbablePrime'

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

    const isPrime = isProbablePrime(number)

    return jsonResponse( {isPrime, number, time: getTimeMicro() - start} )
  } catch (error) {
    return errorResponse(error);
  }
}