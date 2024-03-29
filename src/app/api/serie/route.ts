import series from '@/helpers/series'

export async function GET(request: Request) {
  
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') || "integers"
  const LIMIT = parseInt(searchParams.get('LIMIT') || "0")
  BigInt.prototype.toJSON = function() { return this.toString() }
  try {
    return Response.json( series(LIMIT, name) )
  } catch (e) {
    return Response.json({ error: e.toString()  }, { status: 400 });
  }
}