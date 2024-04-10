import { MAX_SERIES_DIFFERENCES_SIZE } from '@/helpers/Constants';
import series from '@/helpers/series'

export async function GET(request: Request) {
  
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') || "integers"
  const LIMIT = parseInt(searchParams.get('LIMIT') || "0");

  
  if (LIMIT > MAX_SERIES_DIFFERENCES_SIZE) {
    return Response.json({ error: "The series function works up to " + MAX_SERIES_DIFFERENCES_SIZE + " elements, " + LIMIT + " provided."}, {status: 500})
  }

  (BigInt.prototype as any).toJSON = function() {
    return this.toString()
  }
  try {
    return Response.json( series(LIMIT, name) )
  } catch (error) {
    let message
    if (error instanceof Error) message = error.message
    else message = String(error)
    return Response.json({ error: message }, { status: 500 });
  }
}