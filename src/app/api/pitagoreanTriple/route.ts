import pitagoreanTree from '@/helpers/pitagoreanTree'
import pitagoreanTriple from '@/helpers/pitagoreanTriple'

export async function GET(request: Request) {
  
  const { searchParams } = new URL(request.url)
  const LIMIT = parseInt(searchParams.get('LIMIT') || "0")

  return Response.json( pitagoreanTriple(LIMIT) )
}