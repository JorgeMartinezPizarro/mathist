import { MAX_DISPLAY_SIEVE } from '@/helpers/Constants'
import eratostenes from '@/helpers/eratostenes'

export async function GET(request: Request) {
  
  const { searchParams } = new URL(request.url||"".toString())
  const LIMIT = parseInt(searchParams.get('LIMIT') || "0")
  const amount = parseInt(searchParams.get('amount') || MAX_DISPLAY_SIEVE.toString())
  const excel = searchParams.get('excel') ? true : false;
  (BigInt.prototype as any).toJSON = function() {
    return this.toString()
  }
  try {
    return Response.json( eratostenes(LIMIT, amount, excel) )
  } catch (error) {
    let message
    if (error instanceof Error) message = error.message
    else message = String(error)
    return Response.json({ error: message }, { status: 400 });
  }
}