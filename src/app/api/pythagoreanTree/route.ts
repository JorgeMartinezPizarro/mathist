import { MAX_LENGTH_TREE } from '@/constants';
import { badRequest, errorResponse, jsonResponse, parseBigInt } from '@/server/http';
import PythagoreanTree from '@/math/pythagoreanTree'

export async function GET(request: Request) {
  
  try {
    const { searchParams } = new URL(request.url)
    const limit: string = searchParams.get('LIMIT') || "";
    const LIMIT = parseBigInt(limit, "LIMIT");

    if (LIMIT > MAX_LENGTH_TREE) {
      throw badRequest("Max length of Pythagorean tree is " + MAX_LENGTH_TREE + ", " + LIMIT + " provided.")
    }

    return jsonResponse( PythagoreanTree(LIMIT) )
  } catch (error) {
    return errorResponse(error);
  }
}