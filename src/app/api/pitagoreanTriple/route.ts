import pitagoreanTriple from '@/helpers/pitagoreanTriple'

export async function POST(request: Request) {
  
  const body = await request.json();

  const LIMIT = BigInt(body.number || "0")

  try {
    return Response.json(pitagoreanTriple(LIMIT))
  } catch (e) {
    return Response.json({ error: 'The generated triple does not satisfy the equations, something went wrong ...' }, { status: 400 });
  }
}