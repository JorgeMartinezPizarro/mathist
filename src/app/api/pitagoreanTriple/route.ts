import { MAX_DIGITS_TRIPLE } from '@/Constants';
import errorMessage from '@/helpers/errorMessage';
import PithagoreanTriple from '@/helpers/PithagoreanTriple'

export async function GET(request: Request) {
  return Response.json({ error: "invalid protocol GET, available protocol POST"}, {status: 500})
}

export async function POST(request: Request) {
  
  try {
  
    const body = await request.json();

    const LIMIT: string | undefined = body.number;

    if (LIMIT === undefined) {
      throw new Error("Missing parameter LIMIT");
    }

    const regex = new RegExp("[^012$]");

    if (regex.test(LIMIT)) {
        throw new Error("Invalid base 3 path provided: " + LIMIT)
    }
  
    if (LIMIT.length > MAX_DIGITS_TRIPLE) {
      throw new Error("Max path length is " + LIMIT)
    }

    (BigInt.prototype as any).toJSON = function() {
      return this.toString()
    }
    
    return Response.json(PithagoreanTriple(LIMIT))
  
  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}