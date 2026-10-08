import { MAX_LENGTH_TREE } from '@/Constants';
import { badRequest, errorResponse, parseBigInt } from '@/helpers/http';
import PythagoreanTree from '@/helpers/pythagoreanTree'

export async function GET(request: Request) {
  
  try {
    const { searchParams } = new URL(request.url)
    const limit: string = searchParams.get('LIMIT') || "";
    const LIMIT = parseBigInt(limit, "LIMIT");

    (BigInt.prototype as any).toJSON = function() {
      return this.toString()
    }

    if (LIMIT > MAX_LENGTH_TREE) {
      throw badRequest("Max length of Pythagorean tree is " + MAX_LENGTH_TREE + ", " + LIMIT + " provided.")
    }

    return Response.json( PythagoreanTree(LIMIT) )
  } catch (error) {
    return errorResponse(error);
  }
}