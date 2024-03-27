import pitagoreanTriple from '@/helpers/pitagoreanTriple'

export async function POST(request: Request) {
  
  const body = await request.json();

  const number = body.number
  
  const LIMIT = BigInt(number || "0")

  try {
    const response = pitagoreanTriple(LIMIT)
    return Response.json(response)
  } catch (e) {
    return Response.json({ error: 'The generated triple does not satisfy the equations, something went wrong ...' }, { status: 400 });
  }

  
  // https://github.com/GoogleChromeLabs/jsbi/issues/30#issuecomment-953187833
  //  BigInt.prototype.toJSON = function() { return this.toString() }
  
  
}