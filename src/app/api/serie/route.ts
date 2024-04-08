import series from '@/helpers/series'

export async function GET(request: Request) {
  
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') || "integers"
  const LIMIT = parseInt(searchParams.get('LIMIT') || "0");
  (BigInt.prototype as any).toJSON = function() {
    return this.toString()
  }
  try {
    return Response.json( series(LIMIT, name) )
  } catch (error) {
    let message
    if (error instanceof Error) message = error.message
    else message = String(error)
    return Response.json({ error: message }, { status: 400 });
  }
}