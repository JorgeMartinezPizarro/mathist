import pitagoreanTriple from '@/helpers/pitagoreanTriple'

export async function POST(request: Request) {
  
  const body = await request.json();

  const number = body.number
  
  const LIMIT = BigInt(number || "0")

  const response = pitagoreanTriple(LIMIT)
  // https://github.com/GoogleChromeLabs/jsbi/issues/30#issuecomment-953187833
  BigInt.prototype.toJSON = function() { return this.toString() }
  return Response.json(response)
  
}