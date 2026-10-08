import { MAX_DIGITS_TRIPLE } from '@/Constants';
import { badRequest, errorResponse, methodNotAllowed, parseJsonBody } from '@/helpers/http';
import PythagoreanTriple from '@/helpers/pythagoreanTriple'

export async function GET(request: Request) {
  return methodNotAllowed("POST")
}

export async function POST(request: Request) {
  
  try {
  
    const body = await parseJsonBody(request);

    const LIMIT: string | undefined = body.number;

    if (typeof LIMIT !== "string") {
      throw badRequest("Missing parameter number");
    }

    const regex = new RegExp("[^012$]");

    if (regex.test(LIMIT)) {
        throw badRequest("Invalid base 3 path provided: " + LIMIT)
    }

    if (LIMIT.length > MAX_DIGITS_TRIPLE) {
      throw badRequest("Max path length is " + MAX_DIGITS_TRIPLE + ", " + LIMIT.length + " provided")
    }

    (BigInt.prototype as any).toJSON = function() {
      return this.toString()
    }
    
    return Response.json(PythagoreanTriple(LIMIT))
  
  } catch (error) {
    return errorResponse(error);
  }
}