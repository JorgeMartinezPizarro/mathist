import pitagoreanTree from '@/helpers/pitagoreanTree'

export async function GET(request: Request) {
  
  const { searchParams } = new URL(request.url)
  const LIMIT = BigInt(searchParams.get('LIMIT') || "0")
  // https://github.com/GoogleChromeLabs/jsbi/issues/30#issuecomment-953187833
  BigInt.prototype.toJSON = function() { return this.toString() }
  return Response.json( pitagoreanTree(BigInt(LIMIT)) )
}