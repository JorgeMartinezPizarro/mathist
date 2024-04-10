import { MAX_SERIES_DIFFERENCES_SIZE } from '@/helpers/Constants';
import differences from '@/helpers/differences';

export async function POST(request: Request) {

  const body = await request.json();
  const array: bigint[] = body;
  (BigInt.prototype as any).toJSON = function() {
    return this.toString()
  } 

  if (array.length > 2 * MAX_SERIES_DIFFERENCES_SIZE - 1) {
    return Response.json({error: "Max length of serie is " + (2 * MAX_SERIES_DIFFERENCES_SIZE - 1) + ", " + array.length + " provided"}, {status: 500})
  }

  return Response.json(differences(array)  )
}