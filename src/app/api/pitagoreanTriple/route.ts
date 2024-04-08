import pitagoreanTriple from '@/helpers/pitagoreanTriple'

export async function POST(request: Request) {
  
  const body = await request.json();

  const LIMIT = body.number;

  (BigInt.prototype as any).toJSON = function() {
    return this.toString()
  }
  
  try {
    return Response.json(pitagoreanTriple(LIMIT))
  } catch (error) {
    let message
    if (error instanceof Error) message = error.message
    else message = String(error)
    return Response.json({ error: message }, { status: 400 });
  }
}