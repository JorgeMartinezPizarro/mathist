import { MAX_DIGITS_PRIMALY_TEST } from '@/helpers/Constants'
import getTimeMicro from '@/helpers/getTimeMicro'
import { isBaillieProbablePrime, isMillerRabinProbablePrime } from '@/helpers/primalyTests'

export async function GET(request: Request) {
  return Response.json({ error: "invalid protocol GET, available protocol POST"}, {status: 500})
}

export async function POST(request: Request) {
  
  try {
    const start = getTimeMicro();

    const body = await request.json();

    const number: bigint = BigInt(body.number);
    
    if (number.toString().length > MAX_DIGITS_PRIMALY_TEST) {
      throw new Error("Invalid number length = " + number+ ", max allowed is 5000")
    }

    (BigInt.prototype as any).toJSON = function() {
      return this.toString()
    }

    const isPrime = isBaillieProbablePrime(number) && isMillerRabinProbablePrime(number)

    return Response.json( {isPrime, number, time: getTimeMicro() - start} )
  } catch (error) {
    let message
    if (error instanceof Error) message = error.message
    else message = String(error)
    return Response.json({ error: message }, { status: 500 });
  }
}