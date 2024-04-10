import { MAX_DISPLAY_SIEVE } from '@/helpers/Constants';
import differences from '@/helpers/differences';

export async function POST(request: Request) {

  const body = await request.json();
  const array = body;
  (BigInt.prototype as any).toJSON = function() {
    return this.toString()
  } 

  if (array.length > MAX_DISPLAY_SIEVE) {
    return Response.json({error: "Max length of serie is " + MAX_DISPLAY_SIEVE + ", " + array.length + " provided"}, {status: 500})
  }

  return Response.json(differences(array)  )
}