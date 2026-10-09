import { MAX_DIGITS_TRIPLE } from '@/constants';
import { badRequest, errorResponse, jsonResponse, methodNotAllowed, parseJsonBody } from '@/server/http';
import PythagoreanTriple from '@/math/pythagoreanTriple'

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

    return jsonResponse(PythagoreanTriple(LIMIT))
  
  } catch (error) {
    return errorResponse(error);
  }
}