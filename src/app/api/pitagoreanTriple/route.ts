import pitagoreanTriple from '@/helpers/pitagoreanTriple'

export async function POST(request: Request) {
  
  const body = await request.json();

  const LIMIT = BigInt(body.number || "0")
  BigInt.prototype.toJSON = function() { return this.toString() }

  try {
    return Response.json(pitagoreanTriple(LIMIT))
  } catch (e) {
    return Response.json({ error: e.toString(), status: 400 });
  }
}