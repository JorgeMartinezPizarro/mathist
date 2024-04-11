import { MAX_DIGITS_TRIPLE } from '@/helpers/Constants';
import pitagoreanTriple from '@/helpers/pitagoreanTriple'
import string from '@/helpers/string';

export async function GET(request: Request) {
  return Response.json({ error: "invalid protocol!"}, {status: 500})
}

export async function POST(request: Request) {
  
  try {
    const body = await request.json();

    const LIMIT: string = body.number;
  
    if (LIMIT.length > MAX_DIGITS_TRIPLE) {
      throw new Error("Max value of path is " + string(BigInt(LIMIT)))
    }

    (BigInt.prototype as any).toJSON = function() {
      return this.toString()
    }
    
    return Response.json(pitagoreanTriple(LIMIT))
  } catch (error) {
    let message
    if (error instanceof Error) message = error.message
    else message = String(error)
    return Response.json({ error: message }, { status: 500 });
  }
}