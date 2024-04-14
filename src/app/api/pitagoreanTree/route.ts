import { MAX_LENGTH_TREE } from '@/helpers/Constants';
import errorMessage from '@/helpers/errorMessage';
import pitagoreanTree from '@/helpers/pitagoreanTree'

export async function GET(request: Request) {
  
  try {
    const { searchParams } = new URL(request.url)
    const limit: string = searchParams.get('LIMIT') || "";
    const LIMIT = BigInt(parseInt(limit));
    
    (BigInt.prototype as any).toJSON = function() {
      return this.toString()
    }

    if (LIMIT > MAX_LENGTH_TREE) {
      return Response.json({error: "Max length of pithagorean tree is " + MAX_LENGTH_TREE + ", " + LIMIT + " provided."}, {status: 500})
    }

    return Response.json( pitagoreanTree(LIMIT) )
  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}