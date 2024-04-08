import pitagoreanTree from '@/helpers/pitagoreanTree'

export async function GET(request: Request) {
  
  const { searchParams } = new URL(request.url)
  const LIMIT = BigInt(searchParams.get('LIMIT') || "0")
  try {
    return Response.json( pitagoreanTree(LIMIT) )
  } catch (error) {
    let message
    if (error instanceof Error) message = error.message
    else message = String(error)
    return Response.json({ error: message }, { status: 400 });
  }
}