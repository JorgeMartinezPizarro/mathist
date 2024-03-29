import pitagoreanTree from '@/helpers/pitagoreanTree'

export async function GET(request: Request) {
  
  const { searchParams } = new URL(request.url)
  const LIMIT = BigInt(searchParams.get('LIMIT') || "0")
  BigInt.prototype.toJSON = function() { return this.toString() }
  try {
    return Response.json( pitagoreanTree(LIMIT) )
  } catch (e) {
    return Response.json({ error: 'Error generating the pitagorean tree ...' }, { status: 400 });
  }
}