import zlib from "zlib"
 
import eratostenes from '@/helpers/eratostenes'

export async function POST(request: Request) {
  
  const body = await request.json();
  const LIMIT = parseInt(body.number)
  BigInt.prototype.toJSON = function() { return this.toString() }
  
  try {
    return Response.json( eratostenes(LIMIT) )
  } catch (e) {
    return Response.json({ error: e.toString()  }, { status: 400 });
  }
}


