import zlib from "zlib"
 
import eratostenes from '@/helpers/eratostenes'

export async function POST(request: Request) {
  
  const body = await request.json();
  const LIMIT = parseInt(body.number)
  
  return Response.json( eratostenes(LIMIT) )
}


