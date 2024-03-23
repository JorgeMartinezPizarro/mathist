import pitagoreanTree from '@/helpers/pitagoreanTree'

export async function GET(request: Request) {
  
  const { searchParams } = new URL(request.url)
  const LIMIT = parseInt(searchParams.get('LIMIT') || "0")

  return Response.json( pitagoreanTree(LIMIT) )
}