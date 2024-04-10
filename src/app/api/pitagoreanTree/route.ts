import { MAX_LENGTH_TREE } from '@/helpers/Constants';
import pitagoreanTree from '@/helpers/pitagoreanTree'

export async function GET(request: Request) {
  
  const { searchParams } = new URL(request.url)
  const LIMIT = BigInt(searchParams.get('LIMIT') || "0");
  (BigInt.prototype as any).toJSON = function() {
    return this.toString()
  }

  if (LIMIT > MAX_LENGTH_TREE) {
    return Response.json({error: "Max length of pithagorean tree is " + MAX_LENGTH_TREE + ", " + LIMIT + " provided."}, {status: 500})
  }

  try {
    return Response.json( pitagoreanTree(LIMIT) )
  } catch (error) {
    let message
    if (error instanceof Error) message = error.message
    else message = String(error)
    return Response.json({ error: message }, { status: 400 });
  }
}