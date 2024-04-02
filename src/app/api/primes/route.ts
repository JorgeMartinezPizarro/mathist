import { MAX_DISPLAY_SIEVE } from '@/helpers/Constants'
import eratostenes from '@/helpers/eratostenes'

export async function GET(request: Request) {
  
  const { searchParams } = new URL(request.url||"".toString())
  const LIMIT = parseInt(searchParams.get('LIMIT') || "0")
  const amount = parseInt(searchParams.get('amount') || MAX_DISPLAY_SIEVE.toString())
  const excel = searchParams.get('excel') ? true : false

  BigInt.prototype.toJSON = function() { return this.toString() }
  
  try {
    return Response.json( eratostenes(LIMIT, amount, excel) )
  } catch (e) {
    return Response.json({ error: e.toString().replaceAll("Error: ", "")  }, { status: 500 });
  }
}